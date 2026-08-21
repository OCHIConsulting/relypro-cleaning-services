# RelyPro launch and local-search operations

The repository now contains metadata, structured data, `robots.txt`, `sitemap.xml`,
service landing pages and consent-aware analytics hooks. The following account-level
actions cannot be completed from the public website repository.

## 1. Google Search Console

Status on 14 August 2026: the `relypro.co.uk` domain property is verified and
accessible in the RelyPro Google account. `https://relypro.co.uk/sitemap.xml` was
submitted on 26 July, read successfully on 11 August, and reports 37 discovered
pages. The homepage and all five dedicated service pages were confirmed indexed
and added to Google's priority crawl queue on 14 August.

1. Add the `relypro.co.uk` domain property in Search Console.
2. Complete DNS verification with the TXT record Google provides.
3. Submit `https://relypro.co.uk/sitemap.xml`.
4. Inspect the home page and each of the five dedicated service pages, then request indexing.
5. Review Page indexing, Core Web Vitals and Enhancements after Google recrawls.

Do not add a made-up verification token to the HTML. Use the exact value provided
for the verified Google account.

## 2. Analytics activation

Status on 14 August 2026: the in-app RelyPro Google account has access to the
`RelyPro Cleaning Services` property and web stream. Stream URL and measurement ID
match production (`https://relypro.co.uk`, `G-M2JVHYSZ9D`), and data collection is
active. `lead_capture_success`, `phone_click`, `email_click`, `whatsapp_click`, and
`whatsapp_handoff` are configured as key events without default monetary values.
Lead success counts once per event; the newly registered email and handoff events
count once per session. `phone_click` and `whatsapp_click` already have stream data;
the other registered names begin counting when the website first sends them. A
consented live check showed one active UK user and delivered `consent_update` and
`email_click` to GA4 Realtime; the collection request contained the measurement ID,
event name and non-personal configuration only.

Status on 21 August 2026: the verified `relypro.co.uk` Search Console domain
property is linked to the RelyPro GA4 web stream. Controlled test sessions must
start with `?rp_test=1`; the flag persists only for that browser tab's session and
sends GA4 debug traffic for exclusion by the **RelyPro developer traffic** filter.
Use `?rp_test=0` to end test mode in the same tab before normal browsing.

Each page now contains the active GA4 web-stream ID:

```html
<meta name="relypro-ga4-id" content="G-M2JVHYSZ9D" />
```

The script uses basic consent: it does not request Google Analytics until the visitor
chooses “Allow analytics”. The preference expires after 180 days. Advertising
storage, advertising personalisation and Google Signals remain disabled, and
withdrawing consent removes accessible Google Analytics cookies.

After deployment:

1. Accept analytics on the live site and confirm the visit in GA4 Realtime or DebugView.
2. Mark the business-critical events below as key events in GA4.
3. Create any service or campaign custom dimensions required for regular reporting.

Implemented events:

- `quote_start`
- `quote_submit_attempt`
- `lead_capture_success`
- `lead_capture_failure`
- `form_start` (non-quote forms)
- `service_selected`
- `quote_click`
- `phone_click`
- `email_click`
- `whatsapp_click`
- `whatsapp_handoff` (post-capture or clearly labelled fallback)
- `careers_handoff`
- `consent_update`

The site can measure a successful lead capture and a WhatsApp handoff, but it cannot
prove that the person pressed Send, that a quote was issued, or that revenue was
booked. Join booked-job and revenue outcomes inside approved reporting; never send
the enquiry reference, CRM record ID, or customer data to GA4.

For the Airbnb turnover campaign, use `utm_campaign=airbnb_turnovers` consistently
across partner links and adverts. Segment `service_selected` and `lead_capture_success`
events where `service` is `Airbnb Turnover Cleaning`.

## 3. Local listing consistency

Use this canonical public business information everywhere:

- Name: RelyPro Cleaning Services
- Primary area: Derby, United Kingdom
- Phone: +44 7796 584056
- Email: enquiries@relypro.co.uk
- Website: https://relypro.co.uk/
- Phone hours: Monday–Saturday, 8:00 AM–6:00 PM

Known correction required:

- The Nextdoor page currently associates RelyPro with Norwich. Sign in to the
  business owner account and change the service location to Derby. If the page is
  not controlled by RelyPro, use Nextdoor's claim/report process.

Also verify Google Business Profile, Trustpilot, MyBuilder, Facebook and any local
directories. Keep business name, service area, phone and URL identical.

In Google Business Profile, add a custom service named “Airbnb and holiday-let
turnover cleaning” with a concise description covering cleaning, linen resets,
restocking and property checks. Link campaign traffic to the dedicated service page,
not the generic homepage.

## 4. Reviews and proof

- Link website rating claims to the exact review platform.
- Do not display an aggregate rating that cannot be reconciled with the linked source.
- Request honest reviews without incentives and respond consistently.
- Add permission-cleared before/after photographs with the service and Derby area.
- Request reviews from existing host and property-manager customers that describe
  turnover reliability, presentation and restocking without revealing guest details
  or property access information.

## 5. Hosting headers

The production Cloudflare Pages deployment applies the security and cache policy in
`_headers`. GitHub remains the source repository and Pages CMS content store; it is
not the production web host.

Review the Content Security Policy after adding any new payment, scheduling,
analytics or CRM domain.

## 6. Source-to-revenue reporting

Use the HubSpot deal pipeline as the outcome system and GA4 only for consented,
non-personal acquisition events. The weekly report should group by UTM source and
medium (falling back to `direct / none`) and show: enquiries created, requirements
confirmed, quotes sent, bookings, completed jobs, completed revenue, enquiry-to-quote
rate, quote-to-booking rate and revenue per enquiry.

Use HubSpot create date for the reporting cohort, `utm_source`/`utm_medium` for
acquisition, deal stage for quote and booking milestones, and built-in deal amount
plus close date for completed revenue. Do not export names, contact details,
postcodes, property summaries, enquiry references or CRM record IDs into GA4 or the
management summary. See `docs/MEASUREMENT-AND-REVENUE-REPORTING.md` for the exact
definitions and reconciliation checks.

## 7. Business details to confirm before publishing legal pages

Add the following to the privacy notice and footer if applicable:

- Full legal entity or proprietor name
- Correspondence or registered office address
- Companies House number
- VAT number
- ICO registration number

The repository intentionally does not invent these details.
