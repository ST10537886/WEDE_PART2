# LizDeLux Botanicals — Part 3

South African handmade soap website by Lizzy Maake. This version builds on the supplied Part 2 ZIP and preserves the five-page structure, branding, product names, R35 prices and original photographs.

## Current status

Published Part 3 version, 2 November 2026. Student: Lizzy Maake (ST10537886). Module: WEDE5020. Repository: https://github.com/ST10537886/WEDE_PART2

The lecturer feedback has been reviewed. The screenshot gives positive overall feedback. The PDF selects technically correct referencing for consistency, congruency and the overall result. No specific website corrections or numerical website mark are shown. Desktop browser checks passed for catalogue loading, search, name sorting, modal open/Escape-close with focus restoration, empty-form errors, a three-soap R105 estimate, and contact draft preparation. The hosted enquiry calculation, public homepage, map tiles, live sitemap, robots file and homepage canonical URL were also verified. Mobile and email-app checks remain open.

Live website: **https://lizdelux-botanicals.netlify.app/**. Source branch: `part3-functionality-seo`. Review: https://github.com/ST10537886/WEDE_PART2/pull/1. Netlify deploys this branch automatically; the default branch still contains Part 2 until the review is merged.

Contact recipient confirmed by the owner: **maakepebetsi@gmail.com**. Phone: 082 654 0809. Service areas: Ga-Sekhukhune and Pretoria. No street address, stock quantities, ingredient benefits or delivery prices have been invented.

## Run locally

From this folder, run:

```text
python -m http.server 8000
```

Open http://localhost:8000/index.html in your browser. Use a web server, because loading catalogue JSON requires HTTP rather than opening an HTML file directly. Internet access is needed for Leaflet and OpenStreetMap tiles. The static preview calculates enquiry estimates from the public JSON catalogue when a server endpoint is unavailable (404, 405 or 501). It does not save or send enquiries.

## Part 3 functionality

- **Products:** JavaScript fetches `data/products.json`, creates cards with DOM methods, filters on product name/description, sorts by name/price and announces the result count. Original HTML cards remain available if loading fails or JavaScript is disabled. All current products cost R35, so price sorting produces ties, resolved alphabetically.
- **Gallery:** each loaded product image opens a native modal dialog. Close button, Escape, backdrop dismissal and focus restoration support keyboard use.
- **FAQs:** accessible disclosure accordions on the products page.
- **Motion:** card entrance animation, button transitions and image hover effects respect reduced-motion preferences.
- **Map:** Leaflet 1.9.4 [2], [3] with OpenStreetMap tiles and attribution [4] shows approximate service regions, not exact shop locations. External service-area links remain usable if the map cannot load.
- **Enquiry:** HTML and JavaScript validation check name, email, telephone, message and integer quantity 1–100. The Netlify-compatible AJAX endpoint [5], [6] validates again and returns a catalogue estimate without a reload. On Netlify the server calculates prices from its own catalogue. Upcoming products have no invented prices. Estimates exclude delivery and require stock/final-price confirmation. This is not an order or a sent enquiry; visitors are directed to contact the business after reviewing the estimate.
- **Contact:** a separate general-message form validates details and compiles a reviewed message into an encoded email draft addressed to maakepebetsi@gmail.com. The visitor opens their email app and sends it there. A copy-message alternative is provided. The website never claims an email has already been sent.

## Files

- `index.html`, `about.html`, `products.html`, `enquiry.html`, `contact.html`: public pages.
- `css/style.css`: original design plus interaction/accessibility styles.
- `js/app.js`: catalogue, gallery and form behavior.
- `js/config.js`: confirmed contact email.
- `js/map.js`: service-area map.
- `data/products.json`: shared catalogue and prices.
- `netlify/functions/enquiry.js`: AJAX estimate endpoint; no database or email service.
- `build.cjs`, `netlify.toml`, `_headers`: deployment build and security configuration.
- `robots.txt`, `sitemap.xml`: source templates. The build produces the complete live-domain versions in `dist/`.
- `tests/enquiry.cjs`: endpoint validation checks.

## SEO and performance

Following descriptive-content and navigation guidance [1], the site uses the following keyword themes, based on the business content rather than measured search volumes: handmade soap South Africa, botanical soaps, handmade soap Limpopo, soap Pretoria, LizDeLux Botanicals, Aloe de Gen, Shea Beaut and Turma Power. Page descriptions use relevant terms naturally. Each page has a unique title, description, one H1, descriptive image text, semantic sections and internal links. Filenames and navigation URLs remain descriptive and consistent.

The deployment build adds live-domain canonical links, Open Graph metadata, an Organization data record and a complete five-page XML sitemap. It also writes the sitemap URL into robots.txt. Use the final HTTPS domain when building; do not publish a sample-domain build. No street address or unverified social profiles appear in structured data.

JPEG assets decreased from 1,442,933 bytes to 1,008,914 bytes (about 30%). Images have dimensions, secondary images load lazily and scripts are deferred. Core functionality uses plain JavaScript without framework dependencies. Responsive styles are retained, and keyboard focus, error labels, live feedback and a skip link have been added.

## Security and privacy

User-entered content is inserted as text, not HTML. Server validation checks product IDs and quantity bounds and calculates prices independently. Requests have a size limit; no data is stored by application code. The hosting header file adds a content security policy, frame restrictions, MIME-sniffing protection and a referrer policy. Leaflet CDN resources have integrity hashes. HTTPS is provided by the chosen host.

The map provider receives normal network requests when the map loads. Netlify may retain ordinary request logs under its own settings. Do not add customer data to Git. If a future version stores enquiries or sends email automatically, implement appropriate consent, retention, abuse controls and server-side delivery; those capabilities are not implemented here.

## Deploy to Netlify (recommended for this version)

1. Add these source files to the existing GitHub repository, retaining its history. Do not replace or delete unrelated files.
2. Run `node tests/enquiry.cjs` and review the site locally.
3. Commit with a descriptive message, for example `Add Part 3 interactions, validated forms and SEO build` and push to the correct branch.
4. In Netlify, import the repository. The included configuration sets the build command to `node build.cjs`, publish directory to `dist`, and functions directory to `netlify/functions`.
5. Netlify's `URL` environment value supplies the production domain. If unavailable, set `URL` to the real HTTPS site URL. The build intentionally fails if no URL is supplied.
6. For a custom domain, set the final domain and rebuild. Confirm canonical URLs and sitemap match it.
7. Verify all five pages, catalogue loading, image dialog, map, valid/invalid forms and the enquiry POST on the hosted site. Confirm security headers are returned.
8. Record the live site URL and GitHub link here and submit the required links to the LMS yourself.

For another host, run `node build.cjs https://YOUR-REAL-DOMAIN` and publish `dist/`. GitHub Pages supports the static frontend but does not run Netlify Functions: its enquiry form uses the local catalogue fallback. A GitHub Pages project subdirectory also requires adapting the build's base URL; use Netlify for this configuration. A plain drag-and-drop upload of source files will not deploy the function.

## Off-page and local SEO — owner actions still required

After publication, request relevant links from authentic local business directories or partners, share the real site link through verified business social profiles, and consider an eligible Google Business Profile with accurate service information. No backlinks, social posts or business listings have been created or claimed. Record actual publication evidence here when complete. Avoid fabricated reviews and unverified addresses.

## Changelog

### 2026-11-02 — Part 3 draft

- Retained the Part 2 layout, five pages and owner-supplied product details.
- Added JSON catalogue loading, search, name/price sorting, result counts and failure fallback.
- Added image enlargement in a keyboard-accessible dialog and product-to-enquiry links with preselected products.
- Added FAQ disclosure sections and reduced-motion-aware visual transitions.
- Added an interactive service-area map with approximate regions, attribution and fallback links.
- Replaced form placeholders with distinct validated enquiry-estimate and general-contact workflows, inline errors, length constraints and telephone checks.
- Added an AJAX enquiry endpoint with independent server validation, a request size limit and catalogue-based calculations. Made its lack of storage/order submission explicit.
- Configured maakepebetsi@gmail.com after owner confirmation; added message review, email-draft and copy alternatives.
- Expanded page descriptions, accessibility, image dimensions and internal links; optimised image files by about 30%.
- Added a deployment build for canonical URLs, social previews, Organization data, robots.txt and sitemap.xml using the real domain.
- Added hosting security headers, deployment instructions, references and a requirements status checklist.
- Reviewed the supplied Part 2 feedback: no specific corrective instruction was supplied. No deductions or numerical website mark have been invented.
- Audited GitHub commit fc5fe40: root-level stylesheet and JPEG uploads did not match the HTML paths css/style.css and images/products/. Restored the expected directories in Part 3; existing root uploads remain in the repository.
- Recorded student details and the GitHub repository URL.
- Published the Part 3 branch on Netlify at https://lizdelux-botanicals.netlify.app/ with a public production site and private previews. Verified the hosted estimate and map rendering.
- Matched canonical and sitemap URLs to Netlify's clean routes: /, /about, /products, /enquiry and /contact.

## Verification recorded

- JavaScript syntax checks passed.
- Fifteen endpoint checks passed: valid price calculation, upcoming range, invalid JSON, null request, method restrictions, request size and invalid field/product/quantity cases.
- Static checks on all five HTML pages passed: one H1 and description, unique IDs, image attributes and existing local asset/page links.
- Deployment build succeeded with a sample validation domain. The sample build is excluded from the ZIP deliverable; rebuild with the real domain before publication.
- Desktop browser preview subsequently connected successfully. Verified catalogue loading, filtering to one pink soap, name sorting, image modal display, Escape-close and focus restoration, form validation, R105 for three soaps in the static fallback, and the prepared email link addressed to the confirmed recipient. Leaflet initialized with zoom controls and attribution. The live server endpoint subsequently returned R105.00 for three Aloe de Gen soaps, and the map tiles and service regions rendered. Live robots.txt, five clean sitemap URLs and the homepage canonical were verified. Mobile layout and email-app launch still require checking. No test email was sent. No Lighthouse or search-ranking results are claimed.

## References

Numbered references follow an IEEE-style format. Accessed Nov. 2, 2026.

[1] Google, "Search Engine Optimization (SEO) Starter Guide," Google Search Central. [Online]. Available: https://developers.google.com/search/docs/fundamentals/seo-starter-guide. [Accessed: Nov. 2, 2026].

[2] Leaflet, "Quick Start Guide," Leaflet. [Online]. Available: https://leafletjs.com/examples/quick-start/. [Accessed: Nov. 2, 2026].

[3] Leaflet, "Documentation," Leaflet. [Online]. Available: https://leafletjs.com/reference. [Accessed: Nov. 2, 2026].

[4] OpenStreetMap contributors, "Copyright and License," OpenStreetMap. [Online]. Available: https://www.openstreetmap.org/copyright. [Accessed: Nov. 2, 2026].

[5] Netlify, "Lambda compatibility for Functions," Netlify Docs. [Online]. Available: https://docs.netlify.com/build/functions/lambda-compatibility/. [Accessed: Nov. 2, 2026].

[6] Netlify, "Configuration for functions," Netlify Docs. [Online]. Available: https://docs.netlify.com/build/functions/configuration/. [Accessed: Nov. 2, 2026].

### Project materials and image credits

- L. Maake, LizDeLux Botanicals Part 2 website and original product photographs, owner-supplied ZIP, 2026. Existing names, descriptions and prices retained.
- The Independent Institute of Education, Part 3 assignment screenshots, student-supplied course materials, 2026.
- The Independent Institute of Education, Feedback for Formative 2 Part 2, technical referencing rubric, student-supplied PDF and accompanying overall-feedback screenshot, 2026. These review materials are private and have not been added to the public repository.

## Submission details — fill after publishing

- Student name / number: Lizzy Maake / ST10537886
- GitHub repository: https://github.com/ST10537886/WEDE_PART2
- Live website: https://lizdelux-botanicals.netlify.app/
- Part 2 feedback: reviewed; no specific website corrections requested
- Browser validation: desktop and selected live checks passed; mobile and email-app launch pending
