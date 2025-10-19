# RelyPro Cleaning Services Website

A polished marketing site for RelyPro Cleaning Services featuring a video hero, trust metrics, detailed service overviews, testimonials, FAQs, and conversion-focused calls-to-action.

## Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Local Preview](#local-preview)
- [Deployment (Cloudflare Pages)](#deployment-cloudflare-pages)
- [Custom Domain Setup](#custom-domain-setup)
- [Media & Assets](#media--assets)
- [Forms & Messaging](#forms--messaging)
- [Next Steps & Enhancements](#next-steps--enhancements)

## Features
- Fullscreen video hero with animated scroll indicator.
- Trust metrics, service highlights, and differentiated value sections tailored for homeowners and businesses.
- Step-by-step "How It Works" timeline and curated pricing packages.
- Client testimonial carousel, FAQ accordion, and high-converting CTA with a custom collage background.
- Responsive layout built on Bootstrap 5, optimized for desktops, tablets, and mobile devices.

## Tech Stack
- **HTML5** for static content and structure.
- **CSS3** with Bootstrap 5.3.3 utilities plus custom styles in `assets/css/style.css`.
- **JavaScript (ES6)** in `assets/js/main.js` for UI behaviour and form submission helpers.
- **Font Awesome 6** iconography.

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

## Local Preview
Use any static server or browser live reload extension. From the project root:

```bash
# Start a lightweight static server (Python 3)
python -m http.server 8000

# Then open http://localhost:8000 in your browser
```

On Windows, you can also right-click `index.html` and choose “Open with” → your browser, though a local server is recommended for relative asset paths.

## Deployment (Cloudflare Pages)
The site is static and deploys cleanly without a build step.

1. Create or log into your Cloudflare account and open **Pages**.
2. Choose **Create project → Direct Upload** (for manual uploads) or connect your Git repository.
3. Framework preset: **None**. Build command: leave blank. Output directory: `/` (root).
4. Upload the contents of the `relypro` folder or select the repository branch.
5. Publish and preview via the generated `<project>.pages.dev` URL.

> **Large video tip:** If `assets/videos/hero.mp4` is sizeable or high-traffic, offload it to [Cloudflare R2](https://developers.cloudflare.com/r2/) or another CDN bucket and update the `<source>` URL in `index.html` for better performance and lower egress costs.

## Custom Domain Setup
1. In your Cloudflare Pages project, navigate to **Custom domains → Set up a domain**.
2. Enter your purchased domain and follow the wizard.
3. If your DNS is managed by Cloudflare, a proxied CNAME will be added automatically.
4. If DNS stays at another registrar, add a CNAME record pointing `www` (or root via ANAME/flattening) to your `<project>.pages.dev` domain, then confirm ownership.
5. Cloudflare issues SSL certificates automatically once DNS propagates.

## Media & Assets
- Hero video lives in `assets/videos/hero.mp4`. Consider providing WebM/MP4 fallbacks for broader browser support.
- CTA collage uses `assets/images/collage-1.jpg`, `collage-2.jpg`, and `collage-3.jpg`. Swap images by updating the files; layout logic is in the CTA section of `style.css`.
- Keep image sizes optimized (≤ 200 KB where possible) to maintain page speed.

## Forms & Messaging
- Quote and contact forms currently send submissions through a WhatsApp automation flow in `assets/js/main.js` using CallMeBot.
- Replace the placeholder API key and phone number with live credentials before production use.
- Add server-side persistence or a third-party form service if you require guaranteed delivery/audit trails.

## Next Steps & Enhancements
- Add SEO metadata (title, description, OG tags) and structured data for local businesses.
- Integrate analytics (e.g., Plausible, Google Analytics) to measure conversions.
- Implement a blog or resources section to support content marketing.
- Set up automated deployments via GitHub → Cloudflare Pages for effortless updates.

For questions or support, update this README with your preferred contact details.
