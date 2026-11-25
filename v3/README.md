# Global Creative Network — Version 3

V3 is the active interface development version, initially a faithful copy of V2 at commit db8c2aa3b121ea6c06223490356fdfa9db023757 (25 November 2026). Public URL: https://chris210.github.io/v3/. V1 (root) and V2 (/v2/) are legacy interfaces; do not change their HTML, styles, interface scripts or assets for V3 feature work.

## Shared data — single source of truth

- `/partner-directory.json`: canonical partner inventory, also consumed by V1 and V2.
- `/v2/v2-featured-additions.js`: additional partner records, shared by V2 and V3.
- `/v2/case-studies-data.js`: curated case studies.
- `/v2/partner-themes-data.js`: discovery theme index.
- `/v2/qs-university-rankings.js`: university rankings.
- `/v2/v2-activity-stories.js`: curated editorial evidence.

V3 references these data assets directly; do not copy them into V3. Shared files retain their existing paths for compatibility with older interfaces and scheduled maintenance. Changes to shared data can legitimately affect both V2 and V3; V1 reads only the data it supports. V3 retains the V2-named interface files and internal identifiers to avoid unnecessary migration risk, but each UI file in this directory is independent. The featured shortlist and country ranking algorithm are currently version-specific interface logic; when changing the shortlist, consider whether it is a shared editorial-data change or a V3-only presentation choice.

V3's exhibition entry, exit and QR code stay within V3. No changes to the root or V2 interface files are needed for V3 development. Shared scripts use their stable URLs so subsequent maintenance does not require modifying the V3 HTML for each data change; normal browser/CDN caching still applies.
