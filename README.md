# Anamika Nayak — Portfolio

A responsive, single-page portfolio with a photographic coffee introduction, an animated spill reveal, selected projects, product approach, tool stack, career timeline, certifications, and direct contact links.

## Open it

Open `dist/index.html` in a current browser. No installation, API key, backend, or build step is required.

For a local HTTP preview, run this from the project folder:

```sh
python3 -m http.server 8080 --directory dist
```

Then open `http://localhost:8080`. The complete page can be deployed by uploading the contents of `dist/` to any static host. Nothing has been deployed for you.

## Files

- `dist/index.html` — semantic page content and native accessible dialogs.
- `dist/styles.css` — responsive layout, design tokens, typography, and motion.
- `dist/script.js` — coffee states, liquid animation, session memory, and focus handling.
- `dist/assets/anamika-nayak.webp` — optimized portrait used by the page.
- `dist/assets/anamika-nayak.png` — untouched supplied portrait.
- `dist/assets/coffee-cup.webp` — optimized transparent photographic coffee asset.
- `dist/assets/coffee-cup.png` — original generated coffee asset.
- `dist/assets/favicon.svg` — site monogram.
- `ASSETS.md` — asset provenance and optional external resources.

## Edit it

Edit text and links in `dist/index.html`. Colors, spacing, and typography are centralized at the beginning of `dist/styles.css`. Coffee timing and the canvas liquid animation are in `dist/script.js`.

There is no form submission or tracking. The Hire me and email links open the visitor’s mail application. The site stores one session-only flag, `anamika-portfolio-coffee-v1`, so the introduction is shown once per browser-tab session. Use “One more coffee?” in the footer to replay it. Browser storage restrictions do not prevent the site from working.

## Accessibility and motion

Native buttons support Enter and Space; native dialogs handle modal focus trapping. Escape and Skip intro dismiss the introduction at any stage. Focus is restored on dismissal. Both the intro and follow-up message have accessible names. All core actions are available without hover. Reduced-motion preferences bypass the animated spill, remove steam and entrance animations, and disable smooth scrolling.

The page uses a fluid grid and mobile breakpoints, with no required JavaScript libraries. The main content remains accessible when JavaScript is disabled; the introduction simply does not open.

## Case challenges and client work

The six “View case study” links open an in-page PDF.js 5.6.205 canvas viewer with Previous/Next, keyboard arrows, fit, zoom, and fullscreen controls. PDF.js and its worker are bundled locally and load on first use. The original PDFs are rendered directly. The three PowerPoint presentations have separate PDF exports for browser display, retaining the slide layouts, typography and imagery. Original PPTX/PDF files are untouched and included. PowerPoint animations are not played by the PDF viewer.

Document bytes are loaded by local scripts so the viewer also works when `dist/index.html` is opened directly from disk. No document service, upload, API key, or backend is required. The standalone preview HTML embeds the page assets, documents and viewer in one file.

Eight supplied client logos remain in their aligned white grid. No other portfolio layout, text, project cards, coffee interaction, experience or contact details were changed by the viewer update.

## Content provenance and verification limits

Career details, dates, email, and social links come from the supplied résumé. The Aha! certificate and selected-project links come from the supplied brief. Project cover designs are original editorial typography, not screenshots of the applications. No project performance results or unverified feature claims were added.

The requested project destinations were preserved exactly. Their live availability could not be verified in the build environment. In particular, the supplied Pipeline ScoreE URL uses `nayakanimikn-dot`, while the other repositories and résumé use `nayakanamikn-dot`; the provided project URL was retained rather than silently guessing a replacement.

JavaScript syntax, local asset references, unique IDs, and internal navigation targets were checked. Real-device and browser automation tests were not run. The standalone preview HTML uses the same page with documents and viewer assets embedded; it is not a deployment.

## Fonts and logo assets

Google Fonts provides DM Sans and Instrument Serif. The page has system-font fallbacks. The expanded tool stack contains 42 tools in six groups. Brand logos are bundled locally in `dist/assets/logos/`, with provenance in `sources.json`. The portrait, coffee, favicon, source, and interaction are local and require no external service.

SQL is a language rather than a single branded product, so it uses a plain text label. Brand marks for the other tools are included locally.

