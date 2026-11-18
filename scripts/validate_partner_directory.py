#!/usr/bin/env python3
"""Read-only validation for the SDCA Global Engagement Map's single partner dataset.

The GitHub file partner-directory.json is edited directly. Nothing in this
script fetches from or writes back to Mapbox.
"""
import json
import math
import re
from collections import Counter
from pathlib import Path

MASTER = Path(__file__).resolve().parents[1] / "partner-directory.json"
VALID_GROUPS = {"Placement", "Exchange Programme"}


def main() -> None:
    data = json.loads(MASTER.read_text(encoding="utf-8"))
    problems = []
    records = data.get("features", [])
    if data.get("type") != "FeatureCollection" or data.get("authoritative") is not True:
        problems.append("Dataset must be an authoritative GeoJSON FeatureCollection")
    if data.get("feature_count") != len(records):
        problems.append("feature_count does not match features length")
    if len(records) < 50:
        problems.append("Unexpectedly few records")
    ids = []
    seen_locations = set()
    zero_names = []
    for index, feature in enumerate(records, start=1):
        props = feature.get("properties") or {}
        name = props.get("name")
        if not isinstance(name, str) or not name.strip():
            problems.append(f"Record {index} has no valid organisation name")
            continue
        ids.append(feature.get("id"))
        if "\ufeffgroup" in props:
            problems.append(f"{name}: legacy BOM-prefixed group column")
        if props.get("group") not in VALID_GROUPS:
            problems.append(f"{name}: invalid group {props.get('group')!r}")
        if props.get("visible") not in ("Yes", "No"):
            problems.append(f"{name}: invalid visible flag")
        geometry = feature.get("geometry") or {}
        coords = geometry.get("coordinates")
        if geometry.get("type") != "Point" or not isinstance(coords, list) or len(coords) != 2:
            problems.append(f"{name}: invalid Point geometry")
            continue
        lon, lat = coords
        if (not all(isinstance(v, (int, float)) and math.isfinite(v) for v in coords)
                or not (-180 <= lon <= 180 and -90 <= lat <= 90)):
            problems.append(f"{name}: invalid longitude/latitude")
            continue
        if lon == 0 and lat == 0:
            zero_names.append(name)
            if props.get("review_status") != "needs_review":
                problems.append(f"{name}: unexplained (0,0) location")
        if abs(float(props.get("longitude", 9999)) - lon) > 0.00001 or abs(float(props.get("latitude", 9999)) - lat) > 0.00001:
            problems.append(f"{name}: location properties differ from geometry")
        site = props.get("url")
        if site is not None and (not isinstance(site, str) or
                not re.fullmatch(r"https?://[^ ]+", site, re.I)):
            problems.append(f"{name}: invalid website URL {site!r}")
        if props.get("review_status") == "needs_review" and not props.get("review_note"):
            problems.append(f"{name}: missing review note")
        key = (name.casefold().strip(), round(lon, 5), round(lat, 5))
        if key in seen_locations:
            problems.append(f"{name}: duplicated name and coordinates")
        seen_locations.add(key)
    if len(set(ids)) != len(ids):
        problems.append(f"{len(ids) - len(set(ids))} non-unique feature ids")
    counts = Counter(f.get("properties", {}).get("group") for f in records)
    # The original school's two Overview tabs are the historical truth.
    # Every imported employer row must remain traceable even after deduplication.
    if "imported_employer_log_rows" in data:
        actual_rows = sum(len(f.get("properties", {}).get("placement_log_records", []))
                          for f in records)
        if actual_rows != data["imported_employer_log_rows"]:
            problems.append(f"Employer-log integrity failed: {actual_rows} != "
                            f"{data['imported_employer_log_rows']} source rows")
        for feature in records:
            p = feature.get("properties") or {}
            logs = p.get("placement_log_records") or []
            if not logs:
                continue
            expected_years = {year for row in logs for year in row.get("years", [])}
            actual_years = set(p.get("placement_years") or [])
            if expected_years != actual_years:
                problems.append(f"{p.get('name')}: placement-year flags diverge from source logs")
            if expected_years and not str(p.get("placement_years_display") or "").strip():
                problems.append(f"{p.get('name')}: missing placement-years popup label")
        if counts["Exchange Programme"] < 27:
            problems.append("Exchange-programme records were unexpectedly lost")
    print(f"Partners: {len(records)}; groups: {dict(counts)}; unresolved (0,0): {zero_names}")
    if problems:
        print("Validation FAILED:")
        for issue in problems:
            print(" - " + issue)
        raise SystemExit(1)
    print("Validation PASSED: one authoritative dataset, valid IDs/coordinates/links/groups.")


if __name__ == "__main__":
    main()
