# RelyPro launch and local-search operations

The repository now contains metadata, structured data, `robots.txt`, `sitemap.xml`,
service landing pages and consent-aware analytics hooks. The following account-level
actions cannot be completed from the public website repository.

## 1. Google Search Console

1. Add the `relypro.co.uk` domain property in Search Console.
2. Complete DNS verification with the TXT record Google provides.
3. Submit `https://relypro.co.uk/sitemap.xml`.
4. Inspect the home page and each of the five dedicated service pages, then request indexing.
5. Review Page indexing, Core Web Vitals and Enhancements after Google recrawls.

Do not add a made-up verification token to the HTML. Use the exact value provided
for the verified Google account.

## 2. Analytics activation

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

- `form_start`
- `service_selected`
- `quote_click`
- `phone_click`
- `email_click`
- `whatsapp_click`
- `quote_handoff`
- `contact_handoff`
- `careers_handoff`
- `consent_update`

The static site can measure a WhatsApp handoff, but it cannot prove that the person
pressed Send, that a quote was issued, or that revenue was booked. Import booked-job
and revenue outcomes from the CRM into analytics using a stable lead ID once a
server-side lead endpoint or CRM is introduced.

For the Airbnb turnover campaign, use `utm_campaign=airbnb_turnovers` consistently
across partner links and adverts. Segment `service_selected` and `quote_handoff`
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

The `_headers` file provides a deployable security and cache policy for hosts such as
Cloudflare Pages or Netlify. GitHub Pages ignores `_headers`; while GitHub Pages
remains the origin, activate equivalent response headers through Cloudflare or move
the deployment to a host that supports them.

Review the Content Security Policy after adding any new payment, scheduling,
analytics or CRM domain.

## 6. Business details to confirm before publishing legal pages

Add the following to the privacy notice and footer if applicable:

- Full legal entity or proprietor name
- Correspondence or registered office address
- Companies House number
- VAT number
- ICO registration number

The repository intentionally does not invent these details.
