# RelyPro Cleaning Services Website

A responsive static website for RelyPro Cleaning Services, featuring a fullscreen video hero, trust metrics, service overviews, a pricing section, testimonials, FAQs, and a high-conversion CTA with a custom collage background.

## Overview
- Pages: `index.html`, `services.html`, `about.html`, `contact.html`, `get-quote.html`
- Assets: CSS in `assets/css/style.css`, JS in `assets/js/main.js`, images in `assets/images`, and hero video in `assets/videos/hero.mp4`.
- Libraries: Bootstrap 5.3, Font Awesome 6, Google Fonts (Poppins)

## Local Preview
You can open `index.html` directly in a browser, but using a tiny static server is better for consistent asset paths.

```bash
# From the project root
python -m http.server 8000
# Then visit http://localhost:8000
```

On Windows without Python, consider installing the "Live Server" VS Code extension or use Node’s http-server.

## Deployment
This is a static site—no build step required. Two recommended options:

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

> Tip: If `assets/videos/hero.mp4` is large or traffic-heavy, host it on an object store/CDN (e.g., Cloudflare R2) and update the `<source>` URL for lower egress costs.

## Forms & Messaging
The contact and quote forms are wired to send details via WhatsApp using CallMeBot in `assets/js/main.js`.
- Update the API key and phone number to production-ready values.
- Consider adding a server-side endpoint or third-party form service for reliability and record-keeping.

## Accessibility & SEO
- Uses semantic HTML and accessible labels for form fields.
- Add/verify unique `<title>` and meta descriptions per page.
- Consider Open Graph/Twitter card tags for better link previews.

## Maintenance
- Shared UI (header/footer) currently lives in each HTML file. To reduce duplication, consider migrating to a light static site generator (e.g., Eleventy) with layouts/partials, compiling back to static HTML for deploy.
- Keep images optimized (target ≤ 200 KB where possible). Use WebP for further gains where practical.

## Project Structure
```
relypro/
├── index.html
├── about.html
├── contact.html
├── services.html
├── get-quote.html
├── assets/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── main.js
│   ├── images/
│   └── videos/
└── README.md
```

## Credits
- Bootstrap, Font Awesome, Google Fonts.
- Images and video assets belong to RelyPro (replace or attribute as needed).

---
If you want, I can also add a GitHub Pages-ready `CNAME` file and a one-command deploy workflow. 