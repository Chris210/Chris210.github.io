# V2 localisation and cultural terminology review — 20 November 2026

**Scope**: public Loughborough Global Creative Network V2, repository `Chris210/Chris210.github.io`, `v2/`. This is a source-level QA review, not a substitute for paid native-language review or rendered-device accessibility testing.

## Reviewed
- `v2/index.html`: all 17 native language entries (English + 16 locales), 34 interface keys each, no missing keys or substituted-placeholder mismatches; language picker and text alternatives
- `v2/v2-i18n.js`: 16 locale dictionaries, 64 keys each, no missing keys or placeholder mismatches
- `v2/v2-localise.js`: translation switching, output from region-code names, title/metadata, dynamic country and city strings
- `v2/v2.js`: featured/spotlight/tour location display and source-derived partner names
- `v2/v2-themes.js`, `v2/v2-case-studies.js`, `v2/v2-collaborate.js`, `v2/v2-excellence.js`: international labels and public contact routes
- `v2/v2-activity-stories.js`, `v2/v2-featured-additions.js`, `v2/qs-university-rankings.js`: visible English case-study and academic partner material
- Historical master partner name audit `research/2026-11-19/full-directory-case-study-coverage.csv` (1,515 name records). This file is only the baseline inventory, not an exhaustive runtime basemap examination.

## Findings and changes
1. **Dynamic place names were not governed by locale-specific conventions.** In Simplified Chinese (`zh-CN`), display Taiwan location labels as **中国台湾**, including `Taiwan`, `Taiwan, China`, `Taiwan (China)`, `台湾`, `台灣`, `臺灣` and `TW`. The change is in `v2/v2-localise.js`, with `v2/v2.js` recognising Taiwan in location strings. Country display was tested on source variants and `Taipei, Taiwan`-type locations.
2. **Preserve official organisational names.** No changes to published institution names, partner master GeoJSON, rankings, feature IDs or geographical coordinates. This convention is scoped to displayed **Simplified Chinese** place labels. Traditional Chinese and English place-label conventions remain unchanged.
3. **Other potentially sensitive political/national descriptions**: no clearly offensive or inconsistent *static translated UI* statements found in the inspected dictionaries requiring a safe, source-supported edit. Do not extrapolate a political or legal claim from a region-name UI convention.
4. **Culturally inclusive language**: main collaboration routes use neutral, non-coercive text; no inappropriate culturally stereotyped messaging found in the reviewed static UI. Retain distinct `zh-CN` and `zh-TW` locales and RTL handling for `ar`, `ur`, `ms-Arab`.

## Known limitations / follow-up review
- The **Mapbox third-party basemap** has its own translated geographic labels; these are not fully controlled by the V2 interface localisation layer. A basemap layer audit is needed before promising that every map-tile label uses a specific locale convention. Do not alter the shared Mapbox style without assessing impacts on V1, accessibility and map loading.
- The 16-locale generic UI dictionaries are structurally complete, but **theme category translations exist for only selected priority locales** and some case-study evidence descriptions remain English by editorial design. Do not silently machine-translate official research titles or institution names; seek native-reader review before adding new locale content.
- The review did not conduct live-browser screen-reader/mobile RTL, region-specific network, or native-reader linguistic usability testing for every language. A code-level review cannot certify cultural suitability or native fluency.
- Names and descriptions in the master data might be revised independently by future sources; country-name testing should be part of ongoing localisation QA.

## Conservative publication policy
Prefer attributable institutional terms, respectful references to people and communities, clearly distinguished academic and employer collaboration types, unmodified source titles, and a small number of locale-specific display conventions. Avoid broad global renaming or retroactive rewriting of research evidence.
