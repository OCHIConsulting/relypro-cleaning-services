import test from 'node:test';
import assert from 'node:assert/strict';
import { makeDeduplicationKey, makeReference, toStoredLead, validateLead } from '../lib/lead-core.js';

const now = new Date('2026-08-13T12:00:00.000Z');
const validLead = {
  kind: 'quote',
  name: 'Test Customer',
  contact_method: 'email',
  contact_details: 'test@example.invalid',
  service: 'Deep Cleaning',
  postcode: 'DE1 2AB',
  property_summary: 'Synthetic two-bedroom flat requiring a deep clean.',
  preferred_date: '2026-08-20',
  privacy_acknowledged: true,
  website: '',
  started_at: '2026-08-13T11:59:50.000Z',
  client_submission_id: 'synthetic-test-id-123456',
  landing_page: '/get-quote.html',
  attribution: { utm_source: 'test', utm_medium: 'unit', utm_campaign: 'phase-one', gclid: 'not-stored' }
};

test('normalises and accepts a valid synthetic quote lead', () => {
  const result = validateLead(validLead, now);
  assert.equal(result.ok, true);
  assert.equal(result.lead.postcode, 'DE1 2AB');
  assert.deepEqual(Object.keys(result.lead.attribution), ['utm_source', 'utm_medium', 'utm_campaign']);
  assert.equal(result.lead.attribution.gclid, undefined);
});

test('rejects malformed, automated, too-fast and unacknowledged submissions', () => {
  const result = validateLead({
    ...validLead,
    postcode: 'Derby',
    privacy_acknowledged: false,
    website: 'spam.example',
    started_at: '2026-08-13T11:59:59.500Z'
  }, now);
  assert.equal(result.ok, false);
  assert.ok(result.errors.postcode);
  assert.ok(result.errors.privacy_acknowledged);
  assert.ok(result.errors.submission);
});

test('deduplication keys are stable and references are public-safe', async () => {
  const { lead } = validateLead(validLead, now);
  assert.equal(await makeDeduplicationKey(lead), await makeDeduplicationKey(lead));
  assert.match(makeReference(now), /^RP-260813-[A-F0-9]{6}$/);
});

test('stored lead starts in the documented pipeline and never implies marketing consent', () => {
  const { lead } = validateLead(validLead, now);
  const stored = toStoredLead(lead, 'RP-260813-ABC123', now);
  assert.equal(stored.stage, 'New enquiry');
  assert.equal(stored.marketing_consent, false);
  assert.equal(stored.enquiry_reference, 'RP-260813-ABC123');
});
