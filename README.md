# SDCA Global Engagement Map

An interactive map showcasing **international exchange programmes and student placements** associated with **Loughborough University's School of Design and Creative Arts (SDCA)**.

The map combines a custom Mapbox globe with location details, external partner links, a names-only location browser, multilingual interface options, and accessibility-focused controls. It is hosted as a static website using GitHub Pages and can also be embedded in a university intranet using an iframe.

**Live map:** https://chris210.github.io/  
**Source repository:** https://github.com/Chris210/Chris210.github.io

> **Project status:** This README describes the current `index.html` implementation. The map is an evolving university project; the documented accessibility features should not be interpreted as a certification of WCAG 2.2 AA compliance.

## Contents

- [At a glance](#at-a-glance)
- [Using the map](#using-the-map)
- [Design and branding](#design-and-branding)
- [Languages and translation](#languages-and-translation)
- [Accessibility](#accessibility)
- [Technology and files](#technology-and-files)
- [Mapbox style and data](#mapbox-style-and-data)
- [Publishing and embedding](#publishing-and-embedding)
- [Maintaining the map](#maintaining-the-map)
- [Known limitations](#known-limitations)
- [Privacy and security](#privacy-and-security)
- [Troubleshooting](#troubleshooting)
- [Attribution](#attribution)

## At a glance

| Feature | Current behaviour |
| --- | --- |
| Map | Interactive Mapbox map, initially centred on Europe |
| Points | Coloured circles for international locations |
| Map key | **Static**, non-clickable labels for Student placements and Exchange programmes |
| Hover | Enlarged point with a white outline and halo, preserving the source layer's colour |
| Selecting a point | Opens a popup with the location's name, category, description and an external partner link when provided |
| Overlapping points | Offers a nearby-locations chooser and a zoom-in option |
| Search | **Search Locations by Name** lists locations in the current rendered map view; result cards show **names only** |
| Navigation | Zoom controls, **Reset to Europe**, and keyboard-operable directional pan buttons |
| Languages | **249 language/script options** in the selector; **11** have built-in interface translations, and the remainder offer Google Translate links |
| Accessibility | Skip link, text-based location browsing, focus handling, labelled controls, reduced-motion support and responsive layouts |
| Hosting | Static HTML hosted on GitHub Pages; no build process or application server |

## Using the map

### Explore locations

1. Move around the map and zoom into an area of interest. Scroll-wheel zoom is deliberately disabled; use the visible zoom controls or other supported map interactions.
2. Select a coloured dot to open its details.
3. Where several dots overlap, choose a location from the nearby-locations list, or use the popup's zoom-in action to separate them.
4. Use **Visit partner website** to open an available external URL in a new tab.

The popup uses the data associated with the selected Mapbox feature. It displays a location's name; a category label derived from the data; its description when available; and a website link when the URL is valid and uses `http:` or `https:`. It can also offer **Translate details** when a language other than English is selected.

### Understand the colours

The left-hand panel contains a **static map key**:

| Category | Colour |
| --- | --- |
| Student placements | Pink — `#F0047F` |
| Exchange programmes | Purple — `#2D0153` |

The key is for explanation only; **it does not filter the points**. Mapbox Studio controls the underlying point colours, while `index.html` also defines these two colours for its interface swatches. The colours should be kept consistent if the map's styling is changed.

### Search Locations by Name

The **Search Locations by Name** button opens an accessible, keyboard-operable location browser. Users can search and select results, which centres the map on the chosen point and opens its popup.

Important details:

- Search uses locations **currently rendered in the visible map area**. Move the map to search another region.
- Results **display the location name only**, without placement/exchange subtitles.
- Internally, matching checks the `name`, `group` and `description` fields, even though the results display only names.
- Results are alphabetised and de-duplicated where possible.
- Up to **150 matching results** are displayed at once. Refine the query to narrow a longer list.
- This is not a full-dataset, worldwide search service: the source is a vector tileset, and the browser works from features loaded in the current viewport.

### Map navigation

- **Reset to Europe** returns to longitude `10`, latitude `49`, with zero pitch and bearing. Its zoom is `2.5` on desktop and `2.1` on small screens.
- **Move map** opens directional controls for north, south, east and west. These buttons also provide an alternative to drag gestures.
- Mapbox's standard navigation control supplies zoom buttons.
- Navigation respects a user's reduced-motion preference where the implementation supports it.

## Design and branding

The interface has a restrained, rounded, Apple-inspired aesthetic while retaining university branding and visible interaction cues.

- Loughborough University branding appears at the top of the left information panel.
- The School name is followed by the **Global Engagement Map** heading and an introductory description.
- A dark floating panel provides contrast against the monochrome map.
- Popups use a clear heading, readable description and prominent external action.
- Mobile layouts reposition and collapse controls to preserve usable map space.

**Logo source:** `https://chris210.github.io/LU-logo-white.png`

The `index.html` currently references this **absolute URL**. Keep the image available at that address (or update the `src` attribute if it moves). When testing the HTML locally, the logo still depends on access to this online image.

## Languages and translation

The selector groups languages with the following priority:

1. **English**.
2. **Chinese:** Simplified Chinese and Traditional Chinese.
3. **Indian languages:** Hindi, Punjabi, Bengali, Gujarati, Tamil, Telugu, Marathi and Urdu.
4. **Other Google Translate languages:** a scrollable list of the remaining options, alphabetised by name.

The current `index.html` contains **249 unique language/script options** in total: English (1), Chinese (2), the priority Indian-language group (8), and 238 other options. The list reflects the Google Translate options captured when this version was prepared; it is embedded in the HTML and **does not automatically synchronise with Google's future additions or changes**.

### What gets translated?

**Built-in interface translations** exist for these 11 options:

`en`, `zh-CN`, `zh-TW`, `hi`, `pa`, `bn`, `gu`, `ta`, `te`, `mr`, `ur`.

For these options, the interface's headings, instructions, button labels, key labels and search messages can change directly in the page.

For the **other** listed languages, the interface remains in English and an explanatory message provides a link to open the page through **Google Translate**. This is a fallback, **not native in-page translation**, and map interactions may be limited in that externally translated view.

Partner names and descriptions originate in English from Mapbox data. For non-English selections, individual popups offer a **Translate details** link that sends the selected text to Google Translate in a new tab. Map labels supplied by the Mapbox style are separate from these interface translations.

### Updating translations

The priority-language text lives in the `translations` object in `index.html`; related search-count messages live in `searchCountLanguage`. Options in the `<select id="language-select">` element control which languages are listed. To add full in-page translation for another language, add its option (if not already present) and a complete translation entry in `translations`, then test layout, text direction, focus and labels.

## Accessibility

This implementation includes accessibility-oriented features designed with **WCAG 2.2 AA** in mind:

- A **skip link** to open the text-based location browser without navigating the map visually.
- A names-only, keyboard-operable search/list alternative to clicking small or overlapping markers.
- Semantic headings, accessible names, labels, status messages and focus-visible styles.
- Keyboard-operable map movement buttons and a reset control.
- Popup heading focus when opened; effort to return focus after closing; Escape closes the popup or location browser.
- Touch targets enlarged where practical, including navigation and search controls.
- CSS support for reduced motion, higher contrast and reduced transparency preferences.
- Responsive treatment for narrower screens and safe-area insets.
- English-language marking on un-translated Mapbox location content to help assistive technologies.

**Not a compliance guarantee:** The experience has not been independently certified as WCAG 2.2 AA conformant. Test the deployed site with keyboard-only operation, VoiceOver and NVDA, browser zoom/reflow, mobile screen readers, and real data. The viewport-only search, third-party Mapbox controls and externally translated pages merit particular attention.

## Technology and files

This is a **plain HTML/CSS/JavaScript site**. No Node.js packages, build tools or database are required for the current implementation.

| Component | Role |
| --- | --- |
| `index.html` | Entire application: layout, styles, translations, Mapbox GL JS initialization and map interactions |
| `LU-logo-white.png` | University logo, hosted at the GitHub Pages root |
| Mapbox GL JS `v3.35.0` | Map rendering, controls, layers, events and popups (loaded via Mapbox CDN) |
| Mapbox Studio | Published basemap style and uploaded location tileset |
| GitHub Pages | Free static web hosting for the page |
| Google Translate | Optional external translation of the page or location details |

### Mapbox configuration

The current code contains the following constants:

```js
const POINT_LAYER = 'GE Data';
const EUROPE_CENTRE = [10, 49];
```

The published style is:

```text
mapbox://styles/chrisuxd/cmmewcucc00j001qz3xo68y0z
```

A **public Mapbox access token** with the `pk.` prefix is set in `index.html`. It is used client-side. Do not replace it with a secret `sk.` token. Review the public token's origin/domain restrictions and Mapbox usage/billing settings as appropriate.

## Mapbox style and data

### Where the locations come from

**The current map does not read Excel, Google Sheets or SharePoint directly.** It reads the already-published **`GE Data` circle layer** from the Mapbox Studio style. That layer is backed by a Mapbox vector tileset.

The data previously inspected for this project contains fields such as:

| Field | Current application use |
| --- | --- |
| `id` | Where present, helps distinguish features and apply hover/selection effects |
| `name` | Popup heading; displayed location-search result; part of search matching |
| `description` | Popup text; part of search matching; possible category fallback |
| `group` | Category label and classification; part of search matching |
| `url` | Optional external partner website link |
| `color` | Present in the source data; actual point fill is governed by the published Mapbox style expression |
| `latitude`, `longitude` | Source geographic information; rendered point coordinates come from feature geometry |
| `icon`, `visible`, `maphub_image_url` | Present in the inspected source data, but not used directly by this page's popup renderer |

Category labels are inferred from the `group` field where it indicates a placement or exchange, with certain description-based fallbacks. Other categories can retain their source `group` label in popups. **The search results deliberately do not display any category subtitle.**

### Updating locations

For the current implementation, ordinary data changes are made at the **source/Mapbox** side, not by editing each entry in `index.html`:

1. Update the underlying location data.
2. Update/re-upload or republish the relevant Mapbox source/tileset as required by its configuration.
3. Ensure the published style still contains the layer named **`GE Data`**.
4. Verify that required properties (`name`, `description`, `group`, `url` where relevant) and coordinates appear correctly.
5. Refresh the published map to confirm the changes.

A future connection to a SharePoint-hosted Excel workbook has been discussed, **but it is not part of this HTML file**. It would require a new data feed/integration and changes to the map's data-source handling.

### Changing appearance or behaviour

- **Mapbox Studio:** Edit the base map and source-layer appearance; publish the style.
- **`index.html`:** Edit overlays, university branding, popup layout, accessibility controls, languages, search and hover/selection behaviour.
- **Colour consistency:** If you change the pink/purple categories, update both the Mapbox Studio colour expression and the `--placement` / `--exchange` CSS variables so the static key remains accurate.

### Overlapping markers

The current page does **not** use automatic numbered marker clustering. When multiple rendered features are near a click/tap, it presents a **nearby-locations picker** (up to 12 entries at a time) and a **zoom-in** action. Proper source-level clustering would require a separate data-source approach, such as GeoJSON with clustering enabled.

## Publishing and embedding

### Deploy via GitHub's website

1. Open the repository: https://github.com/Chris210/Chris210.github.io
2. Upload or edit `index.html` in the repository root.
3. Keep the logo accessible at `LU-logo-white.png`, or update its source URL in the HTML.
4. Commit your changes to the publishing branch (currently `main`).
5. In **Settings → Pages**, use the configured branch deployment (for a conventional setup, `main` and `/ (root)`).
6. Visit https://chris210.github.io/ and refresh to verify the published changes.

GitHub Pages typically serves a username repository like this at the matching `https://username.github.io/` address. Changes may take a short time to deploy; a browser cache refresh may be needed.

### Embed on the intranet

If the university intranet allows only iframe-based embeds, use the hosted GitHub Pages address:

```html
<iframe
  src="https://chris210.github.io/"
  width="100%"
  height="800"
  title="SDCA Global Engagement Map"
  style="border: 0"
  loading="lazy"
></iframe>
```

The intranet must permit the GitHub Pages domain to be embedded. The source page is publicly accessible, even when the iframe itself appears inside an authenticated intranet.

## Maintaining the map

For a straightforward editorial workflow:

- **To edit point text or website links:** update the Mapbox source data and republish/rebuild as appropriate.
- **To change marker colours or base map:** edit the published style in Mapbox Studio and check the static key in `index.html`.
- **To change page wording, logo layout, popup styling or controls:** edit `index.html`, commit and test.
- **To add or correct built-in interface translations:** edit `translations` and, where needed, `searchCountLanguage`.
- **To change the language menu:** edit the `language-select` options and check that the chosen translation pathway is supported.
- **To change the opening geographic view:** edit `EUROPE_CENTRE`, the initial zoom levels and the reset logic.
- **Before a major change:** keep a copy of the known-working `index.html` and test locally and on GitHub Pages.

## Known limitations

1. **No live spreadsheet sync.** Data is still provided by the Mapbox tileset.
2. **Viewport-only search.** The location browser only sees features currently rendered in the map view; it is not a complete global directory. The list shows at most 150 results at once.
3. **Static map key.** Placement and exchange categories cannot be toggled on or off in the current version.
4. **Overlaps are resolved through a chooser, not true clustering.** The nearby picker is limited to 12 displayed entries before zooming.
5. **Translation coverage differs by language.** All 249 languages/script variants are selectable, but only 11 have native interface translations. Other options offer external Google Translate access, which may affect functionality and has not been individually validated for every language.
6. **Source descriptions are in English.** Clicking Translate details opens a third-party service instead of changing the underlying data.
7. **Third-party dependencies.** Map rendering depends on Mapbox and its published style; translation links depend on Google Translate.
8. **Accessibility needs real-world validation.** Third-party map interaction, browser zoom, translated views and assistive-technology behaviour have not been certified as WCAG 2.2 AA compliant.

## Privacy and security

- This is a **publicly hosted** GitHub Pages website. Do not add confidential location data, credentials, internal-only URLs or personal information to the published HTML or Mapbox tileset without approval.
- A public `pk.` Mapbox token is embedded in the browser code, as required for client-side Mapbox GL JS. **Never commit an `sk.` secret token** or other private credentials.
- Public partner website links are validated for `http:` and `https:` schemes and open in a new tab with `rel="noopener noreferrer"`.
- Selecting translation actions may send the public page address or selected location text to **Google Translate**. Confirm this is permitted under the organisation's information-governance policy.
- Keep the Mapbox account's domain restrictions and usage monitoring under review; free allowances are not an unlimited-use guarantee.

## Troubleshooting

| Symptom | What to check |
| --- | --- |
| Blank or erroring map | Internet connection, browser console, Mapbox token, style publishing and Mapbox availability |
| No points | Confirm the published Mapbox style still contains the exact `GE Data` layer and its vector source |
| Hover/selected colours are wrong | Check the source layer's `circle-color` expression; hover overlay copies that colour expression |
| University logo missing | Confirm the image exists at `https://chris210.github.io/LU-logo-white.png` and the file name/capitalisation match |
| Search doesn't find a known worldwide location | Pan/zoom to its region first; only visible/rendered points are indexed |
| Search results lack categories | Expected: cards intentionally display **names only** |
| Category labels don't filter | Expected: the map key is **static**, not interactive |
| Language changes but page remains English | Expected for languages without a built-in translation; follow the external Google Translate link |
| Website links absent in popups | Check the feature's `url` value and that it is a valid `http`/`https` URL |
| GitHub update not visible | Confirm the commit is in the deployed branch, check Pages deployment, then hard-refresh the browser |
| Map cannot appear in an intranet iframe | Ask the intranet administrator whether `https://chris210.github.io/` is permitted for embedding |

## Attribution

Map tiles, geographic data and map controls are provided through **Mapbox** and their underlying data contributors. Preserve the **Mapbox**, **OpenStreetMap** and other attribution shown by the map. The Loughborough University logo is institutional branding and should be used in accordance with the university's brand guidelines.

---

*Documentation based on the current root `index.html` (16 November 2026). Update this README whenever the code, Mapbox data arrangement, language options, or public deployment process changes.*
