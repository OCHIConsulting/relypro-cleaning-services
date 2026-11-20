# Weekly article draft: 20 November 2026

## Status: not published

The required desktop/mobile browser QA gate is unavailable in this run: no browser-control tool is connected. The article remains a draft outside the publishing source directory, in docs/drafts/2026-11-20-end-of-tenancy-cupboards-wardrobes.md. Do not merge as a published article or claim a live URL until this gate is completed.

The frontmatter date records the intended slot, not an accomplished publication. On resuming, move the draft to src/blog/posts/, set both dates to the actual Europe/London publication date and change draft to false only for the reviewed publication candidate. Do not backdate a later release to 20 November. Check open PRs and remote posts before resuming to avoid duplication.

## Discovery and scope

- Fetched remote main at 62c46a3; no open PR or 20 November source article was present. Live archive still featured the 13 November office-closure guide.
- Read BLOG-WORKFLOW.md and docs/BLOG-CATCH-UP-2026-10.md; no tracked AGENTS.md found.
- Reused the clean isolated 13 November content worktree on a new branch, automation/blog-2026-11-20, based on origin/main. Original dirty website/portal checkout untouched. Managed-worktree creation did not return promptly; no reliance on that pending request.
- Rotated to End of Tenancy: **Move-Out Cleaning: What About Cupboards and Wardrobes?** Distinct storage-interior scope, emptying responsibilities, disposal boundaries and handover checklist.
- 864 whitespace-separated body words; 141-character description. Related guides, relevant service link and quote CTA included. Preserves existing layout/branding, prices, promises and privacy controls. No invented statistics, jobs, testimonials, credentials, legal or health claims.

## Original cover provenance

Built-in image generation, no customer images or personal data supplied. Original output exec-7bfc1a6c-90f2-4ab2-8766-7e3c9618a715.png inspected visually. Optimised with Pillow to **1600 × 900 WebP, 114,216 bytes**. Asset: assets/images/blog/end-of-tenancy-cupboards-wardrobes.webp. Descriptive alt text and the established AI-generated editorial illustration caption are included in the draft.

Prompt: “Use case: photorealistic-natural. Asset type: 16:9 editorial cover for RelyPro Cleaning Services blog. A modest unfurnished British rental bedroom on a late autumn afternoon, clean empty built-in wardrobe with doors open, a neatly placed green cleaning caddy in the doorway and a small stack of flattened moving boxes in the adjoining hallway. Clear uncluttered view of the empty wardrobe shelves and room, natural realistic surfaces, soft daylight, restrained green accents matching RelyPro. No people, text, branding, watermark or private information. Illustrative scene only, not a claimed customer job. Landscape composition suitable for 1600x900.”

## Checks completed and remaining

- Complete existing npm test: **38 passed, 0 failed** after placing the unpublished draft outside src/blog/posts/. The suite requires every Markdown file in that source directory to be published; it was not weakened to accommodate the draft.
- Draft internal service, related-article and quote links resolve against built output. Metadata length, heading structure, slug and image dimensions/size checked separately.
- Verified draft absent from built archive, sitemap and RSS. Passing existing-site tests does not mean the draft itself has been browser-tested or its generated page validated.
- Still required: generate the publication candidate with actual date; rerun full tests and new-page metadata/schema/link/sitemap/RSS checks; visually inspect article and archive on desktop/mobile; review final diff; require successful GitHub and Cloudflare preview checks; merge only then; verify five production resources and record evidence.
- No production publication, live article or merged PR is claimed in this note. No paid service or unrelated application changes.

## Rollback

Close the draft PR to abandon this work; production is unchanged. After eventual publication, revert the content merge through a new PR and let Cloudflare Pages rebuild.
