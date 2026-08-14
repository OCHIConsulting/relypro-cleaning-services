# RelyPro Cleaning Services Website

A responsive static sales and local-search website for RelyPro Cleaning Services in Derby.

## Overview

- Core pages: `index.html`, `services.html`, `about.html`, `contact.html`, `get-quote.html`, and `careers.html`.
- Commercial landing pages: Airbnb and holiday-let turnovers, deep cleaning, end-of-tenancy cleaning, office cleaning, and carpet cleaning in Derby.
- Supporting pages: service areas, privacy, cookies, and booking terms.
- Local Bootstrap and Font Awesome assets; no third-party font or CSS dependency.
- Optimized WebP imagery, a compact hero video, reduced-motion support, and mobile conversion controls.
- Page-specific search metadata, structured data, `robots.txt`, and `sitemap.xml`.
- Eleventy-powered blog with Markdown content, Pages CMS editing, RSS and automated SEO output.

## Local Preview
You can open `index.html` directly in a browser, but using a tiny static server is better for consistent asset paths.

```bash
# From the project root
python -m http.server 8000
# Then visit http://localhost:8000
```

On Windows without Python, consider installing the "Live Server" VS Code extension or use Node’s http-server.

## Deployment

The website remains fully static. Eleventy now builds the blog, copies the existing
pages unchanged, and generates the sitemap and RSS feed.

```bash
npm install
npm start
```

Run `npm test` before publishing. See `BLOG-WORKFLOW.md` for the Pages CMS and
AI-assisted publishing process.

Production runs on the Git-integrated Cloudflare Pages project
`relypro-cleaning-services`. Cloudflare builds approved changes from `main` with
`npm run build`, publishes `_site`, applies `_headers`, and runs the Pages Functions
under `functions/`. Pull requests and pushes still run the GitHub build-and-test
workflow, but GitHub Pages is no longer a production deployment target.

Configuration shared with the repository is in `wrangler.jsonc`. Secrets and the
production KV binding remain in Cloudflare, never in Git. Cloudflare branch previews
should be used to validate changes before an approved production merge.

## Forms & Messaging

The quote and contact forms are prepared for first-party lead capture through the provider-neutral endpoint in `functions/api/leads.js`. Success is shown only after the configured destination accepts the record; otherwise entries remain available and the visitor receives phone, email and WhatsApp fallbacks. WhatsApp is always a reviewable customer-controlled handoff. The careers form retains its existing WhatsApp-only journey.

Cloudflare Pages executes the endpoint in production. See
`docs/PHASE-1-IMPLEMENTATION.md` and `docs/MONITORING-AND-RESPONSE.md` before
changing hosting, monitoring or CRM configuration.

## Analytics and Search Setup

GA4 measurement ID `G-M2JVHYSZ9D` is configured across the site. Analytics loads only after the visitor selects “Allow analytics”; the preference expires after 180 days, advertising features remain denied, and the cookie-notice reset control withdraws consent and removes accessible Google Analytics cookies.

See `SEO-OPERATIONS.md` for Search Console submission, conversion events, Google Business Profile and citation checks, and the account-level information still required before launch.

## Maintenance
- Blog UI uses Eleventy layouts and partials. Existing static pages can be migrated to those shared layouts gradually without changing their URLs.
- Keep images optimized (target ≤ 200 KB where practical) and include explicit width and height attributes.

## Project Structure
```
relypro-cleaning-services/
├── index.html
├── about.html
├── contact.html
├── services.html
├── get-quote.html
├── careers.html
├── *-cleaning-derby.html
├── areas.html
├── privacy.html
├── cookies.html
├── terms.html
├── robots.txt
├── sitemap.xml
├── _headers
├── .pages.yml
├── eleventy.config.js
├── src/
│   ├── _includes/
│   ├── _data/
│   └── blog/
├── assets/
│   ├── css/
│   │   ├── bootstrap.relypro.min.css
│   │   └── style.css
│   ├── js/
│   │   └── main.js
│   ├── images/
│   ├── videos/
│   └── vendor/
├── SEO-OPERATIONS.md
└── README.md
```

## Credits

- Bootstrap and Font Awesome.
- Images and video assets belong to RelyPro (replace or attribute as needed).
