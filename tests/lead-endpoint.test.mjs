import test from 'node:test';
import assert from 'node:assert/strict';
import { onRequestOptions, onRequestPost } from '../functions/api/leads.js';

const payload = () => ({
  kind: 'quote',
  name: 'Synthetic Customer',
  contact_method: 'email',
  contact_details: 'customer@example.invalid',
  service: 'Regular Cleaning',
  postcode: 'DE1 2AB',
  property_summary: 'Synthetic three-bedroom home requiring a regular clean.',
  preferred_date: '2026-08-20',
  privacy_acknowledged: true,
  website: '',
  started_at: new Date(Date.now() - 5000).toISOString(),
  client_submission_id: 'endpoint-test-id-123456',
  landing_page: '/get-quote.html',
  attribution: { utm_source: 'test' }
});

const request = (body, ip, origin) => new Request('https://example.invalid/api/leads', {
  method: 'POST',
  headers: { 'content-type': 'application/json', 'cf-connecting-ip': ip, ...(origin ? { origin } : {}) },
  body: JSON.stringify(body)
});

test('allows preflight only for RelyPro and Cloudflare Pages origins', async () => {
  for (const origin of ['https://relypro.co.uk', 'https://www.relypro.co.uk', 'https://preview.relypro-cleaning-services.pages.dev']) {
    const response = onRequestOptions({ request: new Request('https://example.invalid/api/leads', { method: 'OPTIONS', headers: { origin } }) });
    assert.equal(response.status, 204);
    assert.equal(response.headers.get('access-control-allow-origin'), origin);
  }
  const denied = onRequestOptions({ request: new Request('https://example.invalid/api/leads', { method: 'OPTIONS', headers: { origin: 'https://attacker.example' } }) });
  assert.equal(denied.status, 403);
});

test('returns validation errors without calling a destination', async () => {
  const response = await onRequestPost({ request: request({ ...payload(), name: '' }, '192.0.2.10', 'https://relypro.co.uk'), env: {} });
  assert.equal(response.status, 422);
  assert.equal(response.headers.get('access-control-allow-origin'), 'https://relypro.co.uk');
  assert.equal((await response.json()).error, 'validation_failed');
});

test('does not return false success or log personal data when storage is unconfigured', async (context) => {
  const originalConsoleError = console.error;
  const logs = [];
  console.error = (message) => logs.push(message);
  context.after(() => { console.error = originalConsoleError; });
  const response = await onRequestPost({ request: request(payload(), '192.0.2.11'), env: {} });
  assert.equal(response.status, 503);
  assert.deepEqual(await response.json(), { error: 'unavailable' });
  assert.deepEqual(logs, [JSON.stringify({ event: 'lead_capture_failed', error: 'unavailable' })]);
  assert.doesNotMatch(logs.join('\n'), /Synthetic Customer|customer@example\.invalid|DE1 2AB|192\.0\.2\.11|property_summary/);
});

test('persists once and returns the prior reference on an idempotent retry', async (context) => {
  const originalFetch = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = async () => { calls += 1; return new Response(null, { status: 204 }); };
  context.after(() => { globalThis.fetch = originalFetch; });
  const records = new Map();
  const env = {
    LEAD_DESTINATION_URL: 'https://destination.example.invalid/leads',
    LEAD_DEDUPLICATION: {
      get: async (key) => records.get(key),
      put: async (key, value) => records.set(key, value)
    }
  };
  const first = await onRequestPost({ request: request(payload(), '192.0.2.12'), env });
  const firstBody = await first.json();
  const second = await onRequestPost({ request: request(payload(), '192.0.2.12'), env });
  const secondBody = await second.json();
  assert.equal(first.status, 200);
  assert.match(firstBody.reference, /^RP-/);
  assert.deepEqual(secondBody, { ok: true, reference: firstBody.reference, duplicate: true });
  assert.equal(calls, 1);
});

test('rate limits excessive repeated submissions', async (context) => {
  const originalConsoleError = console.error;
  console.error = () => {};
  context.after(() => { console.error = originalConsoleError; });
  const ip = '192.0.2.13';
  const records = new Map();
  const env = {
    LEAD_DEDUPLICATION: {
      get: async (key) => records.get(key),
      put: async (key, value) => records.set(key, value)
    }
  };
  for (let i = 0; i < 5; i += 1) {
    const attempt = payload();
    attempt.client_submission_id = `rate-test-id-12345-${i}`;
    await onRequestPost({ request: request(attempt, ip), env });
  }
  const response = await onRequestPost({ request: request(payload(), ip), env });
  assert.equal(response.status, 429);
  assert.equal((await response.json()).error, 'rate_limited');
});
