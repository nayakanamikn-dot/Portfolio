# Assets and attribution

## Included

| Asset | Source | Use |
| --- | --- | --- |
| Anamika portrait | User-provided image, retained unchanged as PNG | Hero image; optimized WebP for page performance |
| Cream coffee cup and saucer | Original image generated for this portfolio | Transparent interactive cup; original PNG and optimized WebP included |
| Monogram favicon | Original text-based site mark | Browser tab icon |
| Project covers | Original CSS and typographic layout | Editorial project identities, not product screenshots |

The generated coffee asset is a photograph-style illustration. The spill is a real-time canvas animation, not a filmed fluid simulation. The original portrait is not retouched or AI-edited.

## Fonts and brand assets

- DM Sans and Instrument Serif: [Google Fonts](https://fonts.google.com/), distributed by their authors under the SIL Open Font License.
- Local brand marks: Simple Icons 14.11.0 (CC0), the Iconify Logos collection 1.2.10 (CC0), and brand favicons or published logo images. Exact per-file provenance is recorded in `dist/assets/logos/sources.json`. Individual brands retain their trademark rights. The FigJam tile uses the Figma brand mark supplied with its product listing.

Google Fonts is the only optional online visual resource; system-font fallbacks are included. All displayed brand logo bytes are bundled locally. The HTML, stylesheet, JavaScript, original images, optimized images, and favicon are all included. There are no analytics, AI API calls, paid dependencies, credentials, or backend services.

## Added case-study and client assets

- All six original case-study files are bundled unchanged in `dist/assets/case-studies/`. Descriptions summarize the supplied proposals.
- Eight user-supplied client logos are proportionally fitted on white backgrounds; transparent margins were trimmed and web versions optimized. FusionTecZ uses CSS monochrome treatment for contrast.
- Case-brand logos use the Logos catalog, Simple Icons, and official LodgIQ and Third Wave Coffee website assets. Exact source URLs appear in `dist/assets/case-logos/sources.json`.

## Document viewer

- PDF.js 5.6.205 is bundled from the installed `pdfjs-dist` package. Its Apache 2.0 license is in `dist/vendor/pdfjs/LICENSE`.
- Viewer implementation follows https://mozilla.github.io/pdf.js/examples/.
- The Netflix, Airbnb and Uber PDFs are separate browser-view copies exported from the supplied PPTX files with LibreOffice. The originals remain unchanged.
- Existing PDF source bytes are displayed directly. Base64 data scripts preserve the PDF bytes and allow viewing from local files.
