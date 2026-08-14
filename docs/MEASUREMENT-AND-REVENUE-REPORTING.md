# Measurement and revenue reporting

## Reporting chain

`Source -> enquiry -> requirements confirmed -> quote sent -> booked -> completed -> revenue`

GA4 measures consented website behaviour and campaign acquisition. HubSpot is the
authoritative system for lead stage, booking and revenue. The two systems are
reconciled in aggregate; no customer or CRM identifier is sent to GA4.

## Weekly source report

Create a HubSpot deal report or privacy-minimised CSV summary grouped by:

- `utm_source` and `utm_medium`; use `direct / none` when both are blank.
- Deal create week.
- Optionally `service_requested` when the group is large enough to be useful.

Columns and definitions:

| Measure | Definition |
| --- | --- |
| Enquiries | Deals created in the cohort |
| Requirements confirmed | Deals that reached that stage or a later open/won stage |
| Quotes sent | Deals that reached `Quote sent` or a later stage |
| Bookings | Deals that reached `Booked` or `Completed` |
| Completed jobs | Deals in `Completed` |
| Completed revenue | Sum of built-in deal amount for completed deals, using close date for the revenue period |
| Enquiry-to-quote rate | Quotes sent / enquiries |
| Quote-to-booking rate | Bookings / quotes sent |
| Revenue per enquiry | Completed revenue / enquiries |

## Operating rules

- Populate deal amount when a quote is prepared and confirm it at completion.
- Keep deal stage current; stage history is required to count funnel milestones.
- Use `utm_source` and `utm_medium` exactly as captured. `utm_campaign` remains in
  the private deal note on the free-property limit and may be analysed manually.
- Compare HubSpot enquiries with consented GA4 `lead_capture_success` as a directional
  quality check, not an equality test: declined analytics consent legitimately makes
  GA4 lower.
- Exclude synthetic acceptance-test deals by their documented test source or name.
- The management report must not contain names, contact details, postcodes, property
  summaries, enquiry references or CRM record IDs.

## Initial dashboard views

1. HubSpot pipeline totals by current stage.
2. Weekly enquiries, quotes sent, bookings and completed revenue by source/medium.
3. GA4 key-event trend for `lead_capture_success`, `phone_click`, `email_click` and
   `whatsapp_handoff`, filtered to consented traffic.

Review the definitions after four weeks of real use before purchasing an attribution
or business-intelligence product.
