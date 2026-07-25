# RelyPro Cleaning Services Website

A responsive static sales and local-search website for RelyPro Cleaning Services in Derby.

## Overview

- Core pages: `index.html`, `services.html`, `about.html`, `contact.html`, `get-quote.html`, and `careers.html`.
- Commercial landing pages: Airbnb and holiday-let turnovers, deep cleaning, end-of-tenancy cleaning, office cleaning, and carpet cleaning in Derby.
- Supporting pages: service areas, privacy, cookies, and booking terms.
- Local Bootstrap and Font Awesome assets; no third-party font or CSS dependency.
- Optimized WebP imagery, a compact hero video, reduced-motion support, and mobile conversion controls.
- Page-specific search metadata, structured data, `robots.txt`, and `sitemap.xml`.

## Local Preview
You can open `index.html` directly in a browser, but using a tiny static server is better for consistent asset paths.

```bash
# From the project root
python -m http.server 8000
# Then visit http://localhost:8000
```

On Windows without Python, consider installing the "Live Server" VS Code extension or use Node’s http-server.

## Deployment

This is a static site—no build step is required.

### Option A: GitHub Pages (simple & free)
1. Push this repo to GitHub on the `main` branch.
2. In GitHub: Settings → Pages → Source: `main` / `/ (root)` → Save.
3. Optional: Set a custom domain under Settings → Pages → Custom domain.
4. DNS: Add a CNAME for `www` → `ochiconsulting.github.io` (or your username). Add apex A records (GitHub Pages IPs) or forward apex to `www`.
5. Enable “Enforce HTTPS” after the certificate is issued.

### Option B: Cloudflare Pages (fast CDN & free SSL)
1. Create a project in Cloudflare Pages → Direct Upload (or connect GitHub).
2. Framework preset: None. Build command: none. Output directory: `/`.
3. Add your custom domain in the project → it will guide DNS.

The included `_headers` file configures security and cache headers on hosts that support the Netlify/Cloudflare Pages headers format. GitHub Pages ignores this file; use Cloudflare in front of GitHub Pages or a host with configurable response headers.

## Forms & Messaging

The quote, contact, and careers forms create a pre-filled WhatsApp message and explicitly ask the visitor to review and send it. No form data is sent silently to an unverified third-party endpoint.

Because the site is static, it records a `quote_handoff` when WhatsApp opens—not a verified lead submission. Use a consent-aware server-side form or CRM integration if verified submissions, lead stages, and revenue attribution are required.

## Analytics and Search Setup

GA4 measurement ID `G-M2JVHYSZ9D` is configured across the site. Analytics loads only after the visitor selects “Allow analytics”; the preference expires after 180 days, advertising features remain denied, and the cookie-notice reset control withdraws consent and removes accessible Google Analytics cookies.

See `SEO-OPERATIONS.md` for Search Console submission, conversion events, Google Business Profile and citation checks, and the account-level information still required before launch.

## Maintenance
- Shared UI (header/footer) currently lives in each HTML file. To reduce duplication, consider migrating to a light static site generator (e.g., Eleventy) with layouts/partials, compiling back to static HTML for deploy.
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
