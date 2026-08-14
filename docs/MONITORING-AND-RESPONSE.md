# Production monitoring and response

## Active control

Cloudflare notification `RelyPro deployment failures` is enabled for the
`relypro-cleaning-services` project, production environment, `Deployment failed`
event. Delivery is email to `admin@relypro.co.uk`. The alert does not cover preview
deployments, successful deployments or deployment starts.

## Sustained lead-API control

Cloudflare's native error-rate notification is not available on the current free
plan. The repository therefore implements a privacy-safe control without sending
synthetic customer data:

1. Each real `/api/leads` storage failure that returns 503 increments one KV counter.
2. A successful persisted lead or confirmed duplicate resets the counter.
3. Three consecutive storage failures set `/api/leads-health` to HTTP 503 with the
   non-personal state `sustained_5xx`.
4. `.github/workflows/production-health.yml` checks the health endpoint every 15
   minutes and retries three times, 20 seconds apart, before failing the run.
5. GitHub Actions failure notifications must remain enabled for the repository
   owner or nominated operator. The workflow also remains visible in the Actions
   tab if email delivery is delayed.

The public health response contains no lead, reference, CRM ID, IP address, request
body or failure count. KV updates are best-effort and eventually consistent, so the
Cloudflare Functions metrics and non-personal `lead_capture_failed` logs remain the
source for incident diagnosis.

## Retry and escalation procedure

1. Confirm that the latest production Pages deployment succeeded. If it failed,
   inspect the build log and restore the last known-good deployment only with
   production approval.
2. In Cloudflare Workers & Pages observability, check the Function error rate and
   the `lead_capture_failed` category. Never copy request bodies or customer details
   into incident notes.
3. Run the production-health workflow manually once. If all three retries fail,
   treat the issue as sustained rather than a transient edge error.
4. Check HubSpot service status and the service-key configuration without revealing
   the token. Do not automatically replay real lead payloads. Visitors retain their
   form values and receive phone, email and WhatsApp fallbacks; a customer may retry
   from the browser using the existing idempotent submission ID.
5. Escalate to the website owner if the health check remains failed, a production
   rollback is proposed, credentials need rotation, or HubSpot requires an account
   change. Record start time, affected component, non-personal error class, action
   taken and recovery time.
6. Close the incident after a successful persisted/duplicate outcome clears the
   health state and two consecutive manual health checks return HTTP 200.

## Rollback

Disable the scheduled workflow to stop probes. Revert `lib/lead-monitor.js`,
`functions/api/leads-health.js`, and the monitoring calls in `functions/api/leads.js`
to remove the runtime state. Deleting the single KV key
`monitor:lead-api:consecutive-5xx` clears only monitoring state and must not delete
lead deduplication or rate-limit records.
