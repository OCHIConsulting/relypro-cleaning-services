# CRM field mapping and sales operating model

## Provider-neutral to HubSpot mapping

### Live HubSpot Free configuration (portal `149095592`)

Configured on 13 August 2026 without enabling a paid subscription, connecting an inbox, or importing customer data. The live deal pipeline is named **RelyPro Sales Pipeline** and is ordered:

New enquiry -> Contact attempted -> Requirements confirmed -> Quote being prepared -> Quote sent -> Follow-up due -> Booked -> Completed -> Lost / not proceeding.

The free portal permits 10 custom deal properties. All 10 slots are currently used by these integration fields:

- `enquiry_reference` — unique single-line text
- `client_submission_id` — unique single-line text
- `service_requested` — single-line text
- `preferred_contact_channel` — single-line text
- `postcode__service_area` — single-line text
- `property_summary` — single-line text
- `landing_page` — single-line text
- `next_action` — single-line text
- `utm_source` — single-line text
- `utm_medium` — single-line text

The internal property names were verified in HubSpot before preview activation. Use built-in properties where possible for create date, owner, amount, close date, closed-lost reason, contact email/phone, and deal stage. `utm_campaign`, preferred/next-action dates, recurring status, and structured loss reason remain provider-neutral payload fields but cannot receive dedicated custom deal properties on the current free limit. Preserve them in the private deal note or upgrade only after explicit approval.

The free pipeline supports one closed-won and one closed-lost stage. `Completed` is the closed-won stage and `Lost / not proceeding` is the closed-lost stage. Recurring wins should be represented using a note/task until another structured field is available.

| RelyPro field | HubSpot target | Rule |
| --- | --- | --- |
| `enquiry_reference` | custom contact/deal property | Unique, visible customer reference |
| `client_submission_id` | custom contact/deal property | Unique integration key; never shown publicly |
| `created_at` | create date / custom received time | UTC ISO 8601 |
| `name` | first/last name | Split conservatively; retain full name if ambiguous |
| `contact_method` | custom preferred contact channel | Email, phone, or WhatsApp |
| `contact_details` | email or phone | Route by method; do not invent missing values |
| `service` | custom service property | Canonical values from `SERVICES` |
| `postcode` | postal code | Quote leads only; retain spacing |
| `property_summary` | custom `property_summary` and private deal description | Quote label is “What would you like cleaned?”; duplicate into the description so it is visible even when the custom property is not on the record sidebar; exclude from analytics |
| `subject`, `message` | private deal description | Contact-form values remain separately labelled; exclude from analytics |
| `preferred_date` | private deal description | Date only; no custom slot remains on HubSpot Free |
| `landing_page` | first conversion page | Path only, no query string |
| `attribution.*` | original source detail/custom UTM fields | Source, medium, campaign only |
| `stage` | deal stage | Begin at New enquiry |
| `marketing_consent` | marketing permission | Always false for this flow |

Every deal description also carries the reference, received time, enquiry type,
name, preferred reply method, contact details, service, postcode, cleaning details
or contact subject/message, preferred date, landing page, source/medium/campaign,
privacy acknowledgement and the fixed no-marketing-consent state. This readable
copy is deliberate: HubSpot Free's ten custom-property limit must not cause a
submitted form field to disappear from the sales record.

## Pipeline and ownership

Stages: New enquiry -> Contact attempted -> Requirements confirmed -> Quote being prepared -> Quote sent -> Follow-up due -> Booked -> Completed or Lost / not proceeding.

Every open lead needs one named owner, `next_action`, and `next_action_date`. At intake, assign by service/rota; if no routing rule matches, assign to the sales inbox owner. Record quote value only when prepared, booked/completed dates when confirmed, revenue from completed work, and a controlled loss reason (`price`, `timing`, `outside area`, `service unavailable`, `no response`, `competitor`, `duplicate`, `other`). Free-text notes supplement rather than replace these fields.

## Human-approved automation boundary

Create internal tasks and message drafts only. Do not auto-send customer acknowledgement, follow-up, satisfaction, or review messages until tone, timing, opt-out handling, delivery records, and complaint suppression have been reviewed with real operations. Never request a review while a complaint is unresolved.
