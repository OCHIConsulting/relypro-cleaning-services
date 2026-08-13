# CRM field mapping and sales operating model

## Provider-neutral to HubSpot mapping

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
| `property_summary` | deal description / note | Private sales requirement; exclude from analytics |
| `preferred_date` | custom preferred service date | Date only |
| `landing_page` | first conversion page | Path only, no query string |
| `attribution.*` | original source detail/custom UTM fields | Source, medium, campaign only |
| `stage` | deal stage | Begin at New enquiry |
| `marketing_consent` | marketing permission | Always false for this flow |

## Pipeline and ownership

Stages: New enquiry -> Contact attempted -> Requirements confirmed -> Quote being prepared -> Quote sent -> Follow-up due -> Booked -> Completed -> Won - recurring or Lost / not proceeding.

Every open lead needs one named owner, `next_action`, and `next_action_date`. At intake, assign by service/rota; if no routing rule matches, assign to the sales inbox owner. Record quote value only when prepared, booked/completed dates when confirmed, revenue from completed work, and a controlled loss reason (`price`, `timing`, `outside area`, `service unavailable`, `no response`, `competitor`, `duplicate`, `other`). Free-text notes supplement rather than replace these fields.

## Human-approved automation boundary

Create internal tasks and message drafts only. Do not auto-send customer acknowledgement, follow-up, satisfaction, or review messages until tone, timing, opt-out handling, delivery records, and complaint suppression have been reviewed with real operations. Never request a review while a complaint is unresolved.
