#!/usr/bin/env python3
"""Build the SDCA worldwide partner index from a published Mapbox vector tileset.

Run in GitHub Actions to avoid scanning 100s of tiles in every visitor's browser.
The Mapbox token is a *public* map token already embedded in index.html.
"""
import concurrent.futures
import datetime as dt
import gzip
import json
import math
import os
from pathlib import Path
import re
import struct
import sys
import time
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

BASE = Path(__file__).resolve().parents[1]
HTML = BASE / "index.html"
DEST = BASE / "partner-directory.json"
TILESET_ID = "chrisuxd.1n1nj9bi"
REFERER = "https://chris210.github.io/"


def public_token():
    match = re.search(r"mapboxgl\.accessToken\s*=\s*['\"](pk\.[\w.\-]+)['\"]", HTML.read_text(encoding="utf8"))
    if not match:
        raise RuntimeError("Public Mapbox token not found in index.html")
    return match.group(1)


def get(url, *, retries=2):
    headers = {"User-Agent": "SDCA-partner-directory/1.0", "Referer": REFERER,
               "Origin": "https://chris210.github.io", "Accept": "application/json,application/x-protobuf,*/*"}
    for attempt in range(retries + 1):
        try:
            with urlopen(Request(url, headers=headers), timeout=22) as resp:
                return resp.read()
        except HTTPError as exc:
            if exc.code in (204, 404):
                return b""  # Blank ocean tiles are normal.
            if exc.code not in (429, 500, 502, 503, 504) or attempt == retries:
                raise RuntimeError(f"Mapbox HTTP {exc.code}; verify public token/tileset access") from exc
        except (URLError, TimeoutError) as exc:
            if attempt == retries:
                raise RuntimeError("Mapbox tile request timed out") from exc
        time.sleep(1.5 * (attempt + 1))
    return b""


def varint(buf, idx):
    value = 0
    for n in range(10):
        if idx >= len(buf):
            raise ValueError("Truncated protobuf varint")
        b = buf[idx]
        idx += 1
        value |= (b & 127) << (7 * n)
        if not b & 128:
            return value, idx
    raise ValueError("Unbounded protobuf varint")


def fields(buf):
    idx = 0
    while idx < len(buf):
        key, idx = varint(buf, idx)
        field, wire = key >> 3, key & 7
        if wire == 0:
            value, idx = varint(buf, idx)
        elif wire == 2:
            n, idx = varint(buf, idx)
            if idx + n > len(buf):
                raise ValueError("Truncated protobuf message")
            value = buf[idx:idx + n]
            idx += n
        elif wire in (1, 5):
            n = 8 if wire == 1 else 4
            value = buf[idx:idx + n]
            idx += n
        else:
            raise ValueError(f"Unsupported protobuf wire type {wire}")
        yield field, wire, value


def packed_ints(buf):
    idx = 0
    results = []
    while idx < len(buf):
        val, idx = varint(buf, idx)
        results.append(val)
    return results


def value_from(buf):
    result = None
    for field, wire, value in fields(buf):
        if field == 1 and wire == 2:
            result = value.decode("utf-8", errors="replace")
        elif field == 2 and wire == 5:
            result = struct.unpack("<f", value)[0]
        elif field == 3 and wire == 1:
            result = struct.unpack("<d", value)[0]
        elif field in (4, 5, 6) and wire == 0:
            result = (value >> 1) ^ -(value & 1) if field == 6 else value
        elif field == 7 and wire == 0:
            result = bool(value)
    return result


def decode_points(geometry, extent, z, x, y):
    vals = packed_ints(geometry)
    points = []
    px = py = idx = 0
    while idx < len(vals):
        command = vals[idx] & 7
        count = vals[idx] >> 3
        idx += 1
        if command in (1, 2):
            for _ in range(count):
                if idx + 1 >= len(vals):
                    break
                dx, dy = vals[idx:idx + 2]
                idx += 2
                px += (dx >> 1) ^ -(dx & 1)
                py += (dy >> 1) ^ -(dy & 1)
                if command == 1:
                    lon = ((x + px / extent) / (1 << z)) * 360 - 180
                    merc = math.pi * (1 - 2 * (y + py / extent) / (1 << z))
                    lat = math.degrees(math.atan(math.sinh(merc)))
                    points.append([round(lon, 6), round(lat, 6)])
        elif command == 7:
            continue
        else:
            break
    return points


def parse_mvt(payload, z, x, y):
    if payload.startswith(b"\x1f\x8b"):
        payload = gzip.decompress(payload)
    results = []
    for field, wire, layer_data in fields(payload):
        if field != 3 or wire != 2:
            continue
        name = ""
        keys, vals, records, extent = [], [], [], 4096
        for number, kind, item in fields(layer_data):
            if number == 1 and kind == 2:
                name = item.decode("utf8", errors="replace")
            elif number == 2 and kind == 2:
                records.append(item)
            elif number == 3 and kind == 2:
                keys.append(item.decode("utf8", errors="replace"))
            elif number == 4 and kind == 2:
                vals.append(value_from(item))
            elif number == 5 and kind == 0:
                extent = item
        if "name" not in keys:
            continue
        for record in records:
            fid, geom_type, tags, geometry = None, 0, [], None
            for number, kind, item in fields(record):
                if number == 1 and kind == 0:
                    fid = item
                elif number == 2 and kind == 2:
                    tags = packed_ints(item)
                elif number == 3 and kind == 0:
                    geom_type = item
                elif number == 4 and kind == 2:
                    geometry = item
            if geom_type != 1 or geometry is None:
                continue
            props = {keys[tags[i]]: vals[tags[i + 1]] for i in range(0, len(tags) - 1, 2)
                     if tags[i] < len(keys) and tags[i + 1] < len(vals)}
            if not str(props.get("name") or "").strip():
                continue
            # The source data retains original latitude/longitude properties.
            # Prefer those precise values over low-zoom MVT quantised geometry;
            # otherwise a zoom-10 popup can sit hundreds of metres from its dot.
            accurate = None
            try:
                lon = float(props.get("longitude"))
                lat = float(props.get("latitude"))
                if math.isfinite(lon) and math.isfinite(lat) and -180 <= lon <= 180 and -90 <= lat <= 90:
                    accurate = [lon, lat]
            except (ValueError, TypeError):
                pass
            for coords in decode_points(geometry, extent, z, x, y):
                coords = accurate or coords
                if -180 <= coords[0] <= 180 and -90 <= coords[1] <= 90:
                    results.append({"type": "Feature", "properties": props,
                                    "geometry": {"type": "Point", "coordinates": coords}, "id": fid})
    return results


def main():
    token = public_token()
    override_path = BASE / "head-office-overrides.json"
    corrections = json.loads(override_path.read_text(encoding="utf8"))["corrections"]
    decisions = json.loads((BASE / "partner-location-overrides.json").read_text(encoding="utf8"))
    removed_locations = decisions["remove"]
    standardized_locations = decisions["standardize"]
    website_fixes = json.loads((BASE / "partner-website-overrides.json").read_text(encoding="utf8"))["websites"]
    tilejson_url = f"https://api.mapbox.com/v4/{TILESET_ID}.json?access_token={token}"
    metadata = json.loads(get(tilejson_url))
    templates = metadata.get("tiles") or []
    if not templates:
        raise RuntimeError("Mapbox TileJSON has no tile templates")
    zoom = max(4, int(metadata.get("minzoom", 0)))
    zoom = min(zoom, int(metadata.get("maxzoom", zoom)))
    if zoom > 5:
        raise RuntimeError(f"Mapbox tileset minimum zoom is {zoom}, too high for worldwide tile scan")
    print(f"Mapbox tileset {TILESET_ID}: scanning zoom {zoom}; source layers: "
          f"{[layer.get('id') for layer in metadata.get('vector_layers', [])]}", flush=True)
    width = 1 << zoom
    jobs = [(x, y) for x in range(width) for y in range(width)]
    template = templates[0]

    def work(job):
        x, y = job
        req_y = width - 1 - y if metadata.get("scheme") == "tms" else y
        url = (template.replace("{z}", str(zoom)).replace("{x}", str(x))
               .replace("{y}", str(req_y)).replace("{ratio}", ""))
        payload = get(url)
        return parse_mvt(payload, zoom, x, y) if payload else []

    partners = {}
    errors = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
        future_to_job = {pool.submit(work, job): job for job in jobs}
        for future in concurrent.futures.as_completed(future_to_job):
            job = future_to_job[future]
            try:
                results = future.result()
                for feature in results:
                    source_name = str(feature["properties"]["name"])
                    lon, lat = feature["geometry"]["coordinates"]
                    # Persistent, location-specific cleanup decisions for the
                    # original Mapbox data. Never remove an entire company name
                    # where it has a separately identified head-office record.
                    def is_source_location(record):
                        return (source_name == record["name"] and
                                abs(lon - record["longitude"]) < 0.0001 and
                                abs(lat - record["latitude"]) < 0.0001)

                    if any(is_source_location(item) for item in removed_locations):
                        continue
                    for item in standardized_locations:
                        if is_source_location(item):
                            feature["properties"]["name"] = item["new_name"]
                            feature["properties"]["url"] = item["new_url"]
                            feature["properties"]["head_office_address"] = item["head_office_address"]
                            feature["properties"]["directory_override"] = True
                            break
                    # The source tileset still contains some 0,0 placeholders.
                    # Apply researched, name-matched HQ overrides only to those
                    # placeholders, retaining every non-zero Mapbox location.
                    correction = corrections.get(source_name) if lon == 0 and lat == 0 else None
                    if correction:
                        lon, lat = float(correction["longitude"]), float(correction["latitude"])
                        if not (-180 <= lon <= 180 and -90 <= lat <= 90) or (lon == 0 and lat == 0):
                            raise ValueError(f"Invalid HQ override for {source_name}")
                        feature["geometry"]["coordinates"] = [lon, lat]
                        feature["properties"]["longitude"] = lon
                        feature["properties"]["latitude"] = lat
                        feature["properties"]["head_office_corrected"] = True
                        feature["properties"]["head_office_address"] = correction["address"]
                    # Replace only missing/zero website placeholders. Keep new
                    # source websites if Mapbox later gains a valid value.
                    website = feature["properties"].get("url")
                    if website is None or str(website).strip().lower() in ("", "0", "null"):
                        website_fix = website_fixes.get(str(feature["properties"]["name"]))
                        if website_fix:
                            feature["properties"]["url"] = website_fix["url"]
                            feature["properties"]["website_corrected"] = True
                    name = str(feature["properties"]["name"]).casefold().strip()
                    # Deduplicate tile overlap / duplicate zoom-generated points.
                    key = (name, round(lon, 3), round(lat, 3))
                    old = partners.get(key)
                    if old is None or len(feature["properties"]) > len(old["properties"]):
                        partners[key] = feature
            except Exception as exc:
                errors.append((job, str(exc)))
    if errors:
        print(f"Failed to decode {len(errors)} / {len(jobs)} tiles, first errors: {errors[:5]}", file=sys.stderr)
        # Refuse to replace a known-good directory with a partial one.
        raise RuntimeError("Incomplete worldwide scan: retaining previous directory")
    if len(partners) < 50:
        raise RuntimeError(f"Only {len(partners)} partners found; refusing to publish incomplete index")
    features = sorted(partners.values(), key=lambda f: (str(f["properties"]["name"]).casefold(),
                                                  f["geometry"]["coordinates"][0]))
    # Do not create a new GitHub commit every day if the data hasn't changed.
    if DEST.exists():
        try:
            previous = json.loads(DEST.read_text(encoding="utf8"))
            if previous.get("source") == TILESET_ID and previous.get("features") == features:
                print("Partner directory is unchanged; no commit required", flush=True)
                return
        except (OSError, ValueError):
            pass
    result = {"type": "FeatureCollection", "source": TILESET_ID,
              "generated_at": dt.datetime.now(dt.timezone.utc).isoformat(),
              "feature_count": len(features), "features": features}
    output = json.dumps(result, ensure_ascii=False, separators=(",", ":")) + "\n"
    DEST.write_text(output, encoding="utf8")
    print(f"Wrote {len(features)} real map locations to {DEST.name} ({len(output)} bytes)", flush=True)


if __name__ == "__main__":
    main()
