# SDCA Global Engagement Map

[Live website](https://chris210.github.io/) · [Master partner data](partner-directory.json) · [Website code](index.html)

An interactive worldwide map of Loughborough University's School of Design and Creative Arts exchange programmes and student-placement organisations. Hosted on GitHub Pages and rendered with Mapbox GL JS.

## Architecture — updated 18 November 2026

**There is one authoritative partner dataset: [`partner-directory.json`](partner-directory.json).** This file is a GeoJSON FeatureCollection held in the repository root. It powers **all partner markers**, popups, global name search and the featured-partner list. Mapbox provides the basemap, navigation and geographic labels only.

The Mapbox Studio style still contains a **legacy `GE Data` vector layer**, but `index.html` explicitly hides it and uses a new GeoJSON layer named `sdca-master-points`. Do not edit the old Mapbox tileset to change website content; those changes will **not** populate the authoritative data file.

The old scheduled Mapbox-to-GitHub directory regeneration workflow, its build script, and the separate correction/override JSON files were removed. No background job should overwrite editorial data from Mapbox.

## Editing or adding a partner

1. Open [`partner-directory.json`](partner-directory.json) on GitHub and edit the file (or open a pull request). Keep valid JSON and a `FeatureCollection`.
2. Find the existing `features` record or add a new one, using a **unique numeric `id`**. Preserve unrelated records. For duplicate company names at genuinely different offices, use different IDs and accurate coordinates.
3. Update `properties.name`, `properties.url` (a complete `https://...` link or `null`), and `properties.group` (`Placement` or `Exchange Programme`). Keep `visible` as `Yes` unless deliberately hiding a record.
4. Place geographic coordinates in `geometry.coordinates` as **[longitude, latitude]**, and keep `properties.longitude` and `properties.latitude` in sync. Never use `[0,0]` as an approximation. If a location cannot be verified, mark `review_status: "needs_review"` and explain the concern in `review_note` rather than inventing coordinates.
5. For independently checked changes, keep the evidence in `verification_source` and the office/campus description in `address_verified`.
6. Update top-level `feature_count` to match the number of `features`. Commit, then check the [validation action](.github/workflows/validate-partners.yml) and the GitHub Pages deployment.

There is **no spreadsheet-to-website sync** configured. An Excel export would need to be validated and converted into this master GeoJSON deliberately; never re-import an older Mapbox tileset over the master.

## Automated validation

The read-only [partner validator](scripts/validate_partner_directory.py) runs on changes to the master data. It checks:

- authoritative GeoJSON structure and accurate `feature_count`;
- unique feature IDs and no duplicated name at exactly the same coordinate;
- valid point longitude/latitude and matching longitude/latitude properties;
- properly formatted website URLs, or `null` where unverified;
- valid placement/exchange groups with no hidden BOM character in the field name;
- explicit review notes for locations with unresolved problems.

The check also ensures the source-log row count and each organisation's academic-year flags reconcile to the imported overview rows; it never edits the data.\n\nThe check **does not rewrite records**, verify every company currently exists, or confirm every external website is online. That requires editorial and external-source review.

## Data quality and review queue

As of 18 November 2026, the curated master contains **1,515 organisations/locations**: **1,488 placement records** and **27 exchange programmes**. The placement import reconciles **1,581 employer Overview rows** from both school workbooks, including source rows consolidated under a single official organisation identity. **1,459 records have documented placement-year flags**; the 29 placement records absent from both overview logs explicitly say so. The site retains all 50 featured partners. Historical records do not imply a placement or exchange opportunity is currently available.

The imported source workbooks are `Creative Arts Employers Log (1).xlsx` and `Design Employers Log (1).xlsx`. Where their employer-specific information conflicts with older map data, the spreadsheet is authoritative. The original workbooks are not stored in this public repository; only employer-level metadata from their Overview sheets is published. No student, salary or staff-contact information was imported.

### Placement years and popups

Every partner has `placement_years` (an array of actual academic years, e.g. `["2021-22","2022-23","2025-26"]`), `placement_years_display` (the readable popup label), and `placement_years_status`. Placement employers may also include `placement_source_schools`, `programmes_of_study`, `placement_locations` and `placement_log_records` so source rows can be traced. Gaps in year flags are **not** collapsed into a fictional continuous range. `Pre-2020/21` means a legacy Design placement before 2020–21 with no particular year supplied.

The popup shows a **Placement years** label under the organisation description. Exchange programmes keep their purple markers and are not given invented placement-year values.

### Coordinate accuracy and website reviews

Not every log supplied a verifiable office address. **243 records have unresolved `[0,0]` placeholder coordinates and are deliberately excluded from map markers** while remaining in the searchable master. Another large group uses city or region-centre coordinates **explicitly marked approximate**, not presented as verified head offices. Never arbitrarily place unknown employers in a country capital. The map's nearby-location picker includes a text filter because several genuine employers share city-centre approximate coordinates.

**158 records have no verified website** and **22 carry website-review flags**. Keep their links blank or flagged rather than invent a domain or selecting the wrong similarly named business. The existing editorial review queue includes ambiguous names such as UAU Studio, ITL and Plymouth College, as well as historical records and records with unclear offices.

Examples awaiting editorial review include: Elephans (unknown coordinates, kept at [0,0] but excluded from the map), Mayertorne Interiors (no verified website), StormDFX (incorrect inherited URL removed; actual location unverified), the ambiguous Academy of Fine Arts & NTNU Oslo record, ITL and Omlet multiple-office records, two distinct Stag Design locations, and MacDuff Design's generic institutional URL. Do not auto-merge unrelated businesses or legitimate offices merely because their names or websites match.

## Website experience

- **Search:** names from the complete master dataset, independent of the globe's current viewport. “Browse all in view” lists only rendered points currently visible.
- **Featured partners:** a curated list of 50 names, resolved to matching master features.
- **Popups:** organisation name, category, description and official website where available. Close or choose “Other nearby locations” for overlapping points.
- **Language:** the page provides interface translations and uses Mapbox's localised basemap labels where supported. Partner names remain their official names.
- **Accessibility:** skip link, keyboard navigation, touch-friendly controls, focus management, descriptive headings and separate nearby-locations dialog. Continue testing with keyboard and assistive technology; these features are not a formal WCAG certification.
- **Branding:** Loughborough identity and placement/exchange colour key are defined in `index.html`. Preserve Mapbox and OpenStreetMap attribution.

## Website code and publishing

- [`index.html`](index.html): application markup, CSS, Mapbox GL JS, data fetch, marker layer, translations, hover/selection and popups.
- [`partner-directory.json`](partner-directory.json): the **sole source of partner locations, names, websites and descriptions**.
- [`LU-logo-white.png`](LU-logo-white.png): university logo.
- [`scripts/validate_partner_directory.py`](scripts/validate_partner_directory.py): read-only data quality checks.
- [`.github/workflows/validate-partners.yml`](.github/workflows/validate-partners.yml): validation workflow on relevant changes.

The live site is served from the repository's `main` branch by GitHub Pages. Most commits trigger a Pages deployment; check its status under **GitHub → Actions**. Refresh the site after a successful deployment if the browser still shows cached content.

### Security and privacy

The client-side Mapbox `pk.` token is intentionally public; **never** publish a secret `sk.` token. This website and its master dataset are publicly accessible. Do not include personal contact details, private placement records, confidential partner agreements or other restricted information. Confirm any external link and company identity before publishing.

---

Maintained as a single-source-of-truth GitHub project. For historical source corrections and superseded files, use the repository's Git commit history.
