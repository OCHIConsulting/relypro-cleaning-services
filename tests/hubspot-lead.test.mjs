import test from 'node:test';
import assert from 'node:assert/strict';
import { saveHubSpotLead, toHubSpotRecords } from '../lib/hubspot-lead.js';

test('maps a stored lead to HubSpot without dropping operational details', () => {
  const { contact, deal } = toHubSpotRecords({
    enquiry_reference: 'RP-260813-ABC123',
    client_submission_id: 'submission-123456789',
    created_at: '2026-08-13T12:00:00.000Z',
    kind: 'quote',
    name: 'Synthetic Customer',
    contact_method: 'email',
    contact_details: 'customer@example.invalid',
    service: 'Regular Cleaning',
    postcode: 'DE1 2AB',
    property_summary: 'Synthetic test property, never a real customer.',
    preferred_date: '2026-08-20',
    landing_page: '/get-quote.html',
    attribution: { utm_source: 'test', utm_medium: 'automation', utm_campaign: 'synthetic' }
  });
  assert.deepEqual(contact, {
    firstname: 'Synthetic',
    lastname: 'Customer',
    email: 'customer@example.invalid'
  });
  assert.equal(deal.pipeline, 'default');
  assert.equal(deal.dealstage, 'appointmentscheduled');
  assert.equal(deal.enquiry_reference, 'RP-260813-ABC123');
  assert.match(deal.description, /Marketing consent: No/);
  assert.match(deal.description, /UTM campaign: synthetic/);
});

test('upserts the contact before creating its associated deal', async (context) => {
  const originalFetch = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (url, init) => {
    calls.push({ url, body: JSON.parse(init.body) });
    return url.endsWith('/contacts/batch/upsert')
      ? Response.json({ results: [{ id: 'contact-123' }] })
      : Response.json({ id: 'deal-456' });
  };
  context.after(() => { globalThis.fetch = originalFetch; });
  await saveHubSpotLead({ HUBSPOT_ACCESS_TOKEN: 'synthetic-token' }, {
    enquiry_reference: 'RP-260813-ABC123',
    client_submission_id: 'submission-123456789',
    created_at: '2026-08-13T12:00:00.000Z',
    kind: 'quote',
    name: 'Synthetic Customer',
    contact_method: 'email',
    contact_details: 'customer@example.invalid',
    service: 'Regular Cleaning',
    postcode: 'DE1 2AB',
    property_summary: 'Synthetic test property, never a real customer.',
    preferred_date: null,
    landing_page: '/get-quote.html',
    attribution: {}
  });
  assert.equal(calls.length, 2);
  assert.match(calls[0].url, /contacts\/batch\/upsert$/);
  assert.equal(calls[0].body.inputs[0].idProperty, 'email');
  assert.equal(calls[1].body.associations[0].to.id, 'contact-123');
});
