# Weekly blog catch-up: 25 October 2026

## Publication scope

The live blog and clean origin/main checkout both identified **How Much Does Airbnb Cleaning Cost in Derby?**, dated 24 July 2026, as the latest article. The filename of the existing turnover checklist contains 26 July, but its actual frontmatter date is 1 April. Existing dates were left unchanged.

Published-date slots below follow the user's explicit request to fill weekly gaps. All new articles were created in this batch on 25 October 2026 and carry `updated: 2026-10-25`. These archive dates do not mean the articles were previously live.

| Archive date | Article |
| --- | --- |
| 2026-07-31 | [A Cleaning Handover Guide for Property Managers](../src/blog/posts/2026-07-31-cleaning-handover-for-property-managers.md) |
| 2026-08-07 | [An Office Kitchen Cleaning Checklist That Works](../src/blog/posts/2026-08-07-office-kitchen-cleaning-checklist.md) |
| 2026-08-14 | [Holiday-Let Cleaning Quality Checks Before Guest Arrival](../src/blog/posts/2026-08-14-holiday-let-cleaning-quality-checks.md) |
| 2026-08-21 | [What to Include in an End-of-Tenancy Cleaning Quote Request](../src/blog/posts/2026-08-21-end-of-tenancy-cleaning-quote-guide.md) |
| 2026-08-28 | [A Back-to-School Cleaning Routine for Busy Homes](../src/blog/posts/2026-08-28-back-to-school-home-cleaning-routine.md) |
| 2026-09-04 | [How to Report Damage and Shortages During Airbnb Cleaning](../src/blog/posts/2026-09-04-airbnb-cleaning-damage-reporting.md) |
| 2026-09-11 | [An Autumn Office Cleaning Plan for Derby Workplaces](../src/blog/posts/2026-09-11-autumn-office-cleaning-plan.md) |
| 2026-09-18 | [Carpet Cleaning Drying Time and How to Plan Around It](../src/blog/posts/2026-09-18-carpet-cleaning-drying-time-guide.md) |
| 2026-09-25 | [How to Write a Clear Cleaning Scope of Work](../src/blog/posts/2026-09-25-cleaning-scope-of-work-template.md) |
| 2026-10-02 | [Use Quieter Holiday-Let Weeks for Planned Cleaning](../src/blog/posts/2026-10-02-holiday-let-cleaning-low-season.md) |
| 2026-10-09 | [A Rental Kitchen Cleaning Checklist Before Key Handover](../src/blog/posts/2026-10-09-rental-kitchen-cleaning-checklist.md) |
| 2026-10-16 | [Who Cleans What in a Shared Office?](../src/blog/posts/2026-10-16-shared-office-cleaning-responsibilities.md) |
| 2026-10-23 | [Get Your Holiday Let Guest-Ready for Colder Weather](../src/blog/posts/2026-10-23-winter-guest-ready-holiday-let.md) |

## Editorial and visual decisions

- 13 distinct practical guides, each over 500 words, written in UK English.
- Existing RelyPro layout, colours, typography, archive cards and quote panel retained.
- Specific checklists, comparison tables, related guides and relevant service links.
- No new prices, guarantees, customer stories, reviews or coverage claims.
- Guidance distinguishes cleaning, maintenance and specialist work.
- 13 original generated covers, 1600 × 900 WebP, each below 200 KB.
- Descriptive alternative text; generated illustrations are disclosed below the article cover.
- Existing schema uses the assigned datePublished and actual batch dateModified.
- No analytics, forms, dependencies, pricing or unrelated local changes included.

## Verification

- `npm ci --ignore-scripts --offline`: 127 locked packages installed; audit reported no vulnerabilities.
- `npm test`: 38 passed, 0 failed.
- Build produces 34 articles and 7 archive pages.
- Added checks for all 13 weekly slots, actual update date, sitemap/feed inclusion and working internal article links.
- Existing archive assertions now derive the latest article and page count from published source, retaining length, structure, metadata and image checks.
- Edge headless previews: 1440 × 1000 and 390 × 844; archive and two article layouts checked. Zero document overflow or missing images, one H1 and quote link present in each.
- Contact sheet inspected for all covers; desktop archive and mobile article screenshots visually inspected.

## Image provenance and prompts

Generated using the built-in image-generation tool. Optimisation used Pillow; no source photograph or customer data was supplied.

Shared prompt: “Create one landscape 16:9 photorealistic editorial cover photograph for RelyPro Cleaning Services blog. [Scene below]. Premium but believable small UK property, natural textures, soft daylight, restrained navy and teal accents matching a professional cleaning brand. Clear focal point and uncluttered composition, suitable crop at 1600x900. No text, no logos, no watermark. This is illustrative imagery, not a claimed customer job.”

The generated photographs use neutral interiors; the existing green website branding is unchanged.

- `assets/images/blog/cleaning-handover-for-property-managers.webp`: A property manager's organised handover folder, keys and plain room checklist on a clean apartment dining table.
- `assets/images/blog/office-kitchen-cleaning-checklist.webp`: A spotless modest UK office kitchenette with clean sink, microwave and staff mugs.
- `assets/images/blog/holiday-let-cleaning-quality-checks.webp`: A gloved cleaner inspecting the finish of a neatly made holiday-let bedroom, no identifiable face.
- `assets/images/blog/end-of-tenancy-cleaning-quote-guide.webp`: An empty UK rental living room ready for inspection with cleaning supplies near the doorway.
- `assets/images/blog/back-to-school-home-cleaning-routine.webp`: A tidy British family hallway with school bags on hooks and a small cleaning caddy.
- `assets/images/blog/airbnb-cleaning-damage-reporting.webp`: A professional inspecting a small scuff on an apartment side table beside a plain notebook, no readable text.
- `assets/images/blog/autumn-office-cleaning-plan.webp`: A contemporary small UK office entrance on a rainy autumn day with effective entrance matting.
- `assets/images/blog/carpet-cleaning-drying-time-guide.webp`: A clean carpeted UK lounge with a carpet extraction tool in the foreground and open internal door.
- `assets/images/blog/cleaning-scope-of-work-template.webp`: An organised cleaning supervisor planning a room checklist at a tidy desk with neutral unmarked stationery.
- `assets/images/blog/holiday-let-cleaning-low-season.webp`: A peaceful holiday cottage lounge with autumn light and a neatly arranged sofa.
- `assets/images/blog/rental-kitchen-cleaning-checklist.webp`: A bright empty rental kitchen with clean oven, sink and cupboards.
- `assets/images/blog/shared-office-cleaning-responsibilities.webp`: A tidy shared office meeting room with clean table and chairs and a small cleaning caddy.
- `assets/images/blog/winter-guest-ready-holiday-let.webp`: A welcoming UK holiday-let entrance and lounge with warm lighting, clean mats and folded guest towels.

## Rollback

Revert the merged content commit through a new PR and allow Cloudflare Pages to rebuild. This removes the 13 new posts, covers, optional image caption and associated test changes. Existing source posts remain unchanged.

