# QS Rankings maintenance — Loughborough Global Creative Network V2

**Automated refresh:** 1 April annually, beginning 2027, scheduled in the project's ChatGPT Automations ("Annual QS Partner Rankings").  
**Website:** https://chris210.github.io/v2/  
**Repository:** `Chris210/Chris210.github.io`

## Source of truth

- `v2/qs-university-rankings.js` contains every university partner currently represented as an Exchange Programme or documented Academic Collaboration. Current baseline: **32 records** (27 authoritative master exchange entries, plus five V2-only university additions).
- It also contains `home_university` for Loughborough's own front-page Art & Design accolade.
- Preserve stable `id` joins, original names and aliases; deduplicate any future identical institutions across entries only after confirming identity. The composite `Academy of Fine Arts & NTNU, Norway` needs institutional-name review before assigning a university-wide score.
- `v2/index.html` loads the source before `v2/v2.js`. The featured spotlight shows **world rank + world score** and **Art & Design rank + Art & Design subject overall score** with each record's **own edition year**; non-featured academic popups use the same data.
- Never alter `partner-directory.json`, V1 files, or the V1 deployment when carrying out the scheduled V2 refresh.

## Ranking series and edition years

QS **World University Rankings** (overall institutional) and QS **World University Rankings by Subject: Art & Design** are **distinct**. Their editions are released on different schedules. For example, as of 20 November 2026:
- The latest overall institutional edition is **2027**, published **18 June 2026**.
- The latest subject Art & Design edition is **2026**, published **25 March 2026**.

The annual agent in April 2027 should update the subject series to **2027 only if its results have actually been published and verified**, and should **keep overall-world entries at edition 2027** until a newer overall edition has been released and independently checked. Do not change a displayed year without changing its verified underlying source.

## Each university record

- `overall: {edition, rank, score, source_url, verification}`: world rank is a **string** (retaining ties such as `=87` and bands such as `1001–1200`); score is a numeric 0–100 only if officially published, otherwise `null`.
- `art_design: {edition, rank, score, source_url, verification}`: independent subject ranking position and published subject overall score.
- `null` for a whole series or score means **not established / not yet entered**; it is **not evidence of "unranked"**.
- Maintain `rankings.overall` and `rankings.art_design` publication metadata, `updated`, official edition sources, and useful verification notes. Retain historic verified editions separately if introducing a new edition would otherwise overwrite the only source.
- Scores must never be derived from rank position. Copy only scores explicitly labelled overall or subject-overall in the relevant QS table.
- The 2026 Art & Design baseline for Politecnico di Milano (#7, 83.3), Delft (#13, 77.9), CAFA (#14, 76.4), Tongji (#16, 75.4) is based on QS's published subject list. Loughborough's 2026 =48 position is supported by the university's 2026 March press release. The pre-existing 2027 world ranks are marked `previously_displayed` rather than claiming a new independent audit.

## Annual run instructions

1. Read the current GitHub files/SHAs, both partner sources, and this guide. Confirm that all academic university partners (not only the featured 21) have a record in the rankings source. Do not invent university affiliations, rankings, scores or dates.
2. Check current official QS tables for both series. Prefer official QS per-year URLs, and only update values/years for confirmed published data. Preserve existing value and edition where unconfirmed; capture discrepancies for review.
3. Keep the same `id`, add new aliases as required, record source URL, retrieval/verification date and publication year. Resolve ambiguities manually instead of matching on loose name substrings.
4. If Loughborough's newest Art & Design position is within the top 50, the homepage may retain its "Top 50" accolade. If it is not, show a factual neutral alternative rather than a misleading top-50 claim.
5. Commit the new `v2/qs-university-rankings.js` and any V2 UI and cache-busting query-string updates via GitHub. Test JS parsing, rank/score presence, every university's source year, aliases and visible links. Do not change V1.
6. Return a run report: latest overall/subject edition years, totals with verified rank/score, unknown or absent entries, unresolved mappings, GitHub commit SHA(s), and any failed checks.

## References

- [Official QS World University Rankings](https://www.topuniversities.com/world-university-rankings)
- [Official QS Art & Design Rankings](https://www.topuniversities.com/university-subject-rankings/art-design)
- [QS methodology](https://support.qs.com/hc/en-gb/articles/4410488025106-QS-World-University-Rankings-by-Subject)
