# Global Creative Network V2 — Partner theme taxonomy

**Edition:** 2026-11-20 · **Scope:** V2 ONLY · **Authoritative master unchanged**

## Purpose
Give **exactly three understandable discovery themes** to every partner, so academics and employers can search for a topic across the international map. Themes describe the published case study or the organisation's/school's areas of work. They **do not** by themselves demonstrate that a particular topic has been the subject of a collaboration with Loughborough. Do not imply that unresearched partners have been individually investigated.

## Controlled vocabulary (16; no ad-hoc synonyms in the data)
1. Inclusive Design
2. UX & Interaction Design
3. Sustainability & Circularity
4. Design for Health
5. Creative Heritage & Culture
6. Product & Industrial Design
7. Digital & Emerging Technology
8. Visual Communication & Branding
9. Fashion & Textiles
10. Architecture & Environments
11. Mobility & Transport
12. Service & Social Innovation
13. Arts & Creative Practice
14. Media & Entertainment
15. Design Education & Research
16. Sport & Leisure

## Scope and files
- `partner-directory.json`: authoritative 1,515-record master; **never** modify for theme presentation.
- `v2/v2-featured-additions.js`: five extra V2 academic partners (IDs 20001–20005).
- `v2/case-studies-data.js`: editorial case studies, priority evidence.
- `v2/partner-themes-data.js`: V2-only rows `[feature_id, partner_name, [three vocabulary indices], evidence_basis, evidence_url|null]`, plus schema and metadata.
- `v2/v2-themes.js`: read-only feature lookup, tag search synonyms, theme chip renderer.
- `v2/v2-themes.css`: layout and readable themes.
- `v2/index.html`, `v2/v2.js`: native and featured V2 search and theme placement.
- `research/2026-11-19/full-directory-case-study-coverage.csv`: initial complete master ID/name inventory. This historical audit does **not** mean all partner sites were reviewed.

## Evidence priority and meanings
1. **`case_study`**: published evidence found in the V2 case-study module with an exact ID/name/curated-alias match; inspect project title, methods, outputs and summary. When a partner has multiple examples, choose the three most descriptive, not necessarily the three most frequent keywords.
2. **`case_study_university_wide`**: university-wide Loughborough material; do not imply direct School of Design and Creative Arts involvement.
3. **`official_design_school`**: official design school research themes, objectives or departmental profile; examples reviewed include Kolding, NTU Singapore, UTS and Virginia Tech.
4. **`official_organisation`**: primary-source company profile describing the company or design division, not a joint project; initial reviewed sources are Accenture Song and Airbus.
5. **`school_strategy_pending`**: university lacking a case study and without an individually reviewed current design-school profile.
6. **`sector_inferred_pending_website`**: tentative company-sector themes inferred from its name/category; should be replaced after reading its official site.
7. **`provisional_unresearched`**: a placeholder theme trio, deliberately flagged as unverified. It **must** be reviewed on the organisation's official website. Never treat these three themes as independently established fact.

### Initial coverage snapshot (2026-11-20)
- 1,515 master partners + 5 V2-only academic partners = **1,520 exactly**.
- 16 possible themes; exactly 3 distinct controlled terms per feature.
- Initial review bases: 47 `case_study` + 2 `case_study_university_wide` + 4 `official_design_school` + 2 `official_organisation` + 15 `school_strategy_pending` + 475 `sector_inferred_pending_website` + 975 `provisional_unresearched`.
- **1,465 require individual official website/school-strategy confirmation.** This is not a completed exhaustive 1,515-website assessment.
- Case-study source module had 66 verified editorial entries for 44 partner-level records when generated. More than one feature can correspond to the same organisation.

## Monthly rules
The existing **Global Partner Case Studies** automation (first of each month) maintains both `v2/case-studies-data.js` and `v2/partner-themes-data.js`. Scan the full current master and V2 additions; use the latest work to overwrite outdated or provisional theme trios; preserve stable feature IDs, exact names, and three distinct themes. Whenever a partner acquires a valid case study, use that case study first. Without a case study, inspect the official organisation website, or for universities inspect the design school’s published strategy and objectives. Record source URL, review date and evidence basis. Do not mark a URL checked if it was not checked.

Do not add a 17th theme merely because a keyword differs. Prefer existing terms; propose vocabulary changes for explicit editorial review if absolutely necessary. Update cumulative status and outstanding URLs in the research audit. Report searched vs unsearched separately. Avoid modifying V1, `partner-directory.json`, V2 runtime/UI modules, or publishing unsupported relationships.

## QA before each publish
- Inventory exact feature IDs from current `partner-directory.json` + five additional V2 records, deduplicate IDs.
- Rows count matches current inventory (not a hard-coded 1,520 forever).
- Each entry has **three unique integer indices** in the vocabulary.
- No unused new theme labels; preserve named cases, links, and independent provenance.
- For every `official_*` row, check that the primary-source URL is genuine and describes the named organisation.
- Load V2, try searching `Inclusive Design`, `UX`, `Sustainability`, a known partner name, and a partner with only provisional tags.
- Ensure case-study links, both search panels, tour, theme display, keyboard browsing, translations and contrast still work.
