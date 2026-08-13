import { makeDeduplicationKey, makeReference, toStoredLead, validateLead } from '../../lib/lead-core.js';

const json = (body, status = 200, headers = {}) => new Response(JSON.stringify(body), {
  status,
  headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...headers }
});

async function rateLimited(env, ip, now) {
  if (!env.LEAD_DEDUPLICATION) return false;
  const bucket = Math.floor(now / 600000);
  const material = `${env.RATE_LIMIT_SALT || 'relypro-leads'}|${ip}|${bucket}`;
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(material));
  const hash = Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
  const key = `rate:${hash}`;
  const attempts = Number.parseInt(await env.LEAD_DEDUPLICATION.get(key) || '0', 10) + 1;
  await env.LEAD_DEDUPLICATION.put(key, String(attempts), { expirationTtl: 600 });
  return attempts > 5;
}

async function saveLead(env, lead) {
  if (!env.LEAD_DESTINATION_URL) throw new Error('destination_unconfigured');
  const response = await fetch(env.LEAD_DESTINATION_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...(env.LEAD_DESTINATION_TOKEN ? { authorization: `Bearer ${env.LEAD_DESTINATION_TOKEN}` } : {})
    },
    body: JSON.stringify(lead),
    signal: AbortSignal.timeout(8000)
  });
  if (!response.ok) throw new Error('destination_rejected');
}

export async function onRequestPost({ request, env }) {
  if (!request.headers.get('content-type')?.toLowerCase().includes('application/json')) {
    return json({ error: 'invalid_content_type' }, 415);
  }
  const ip = request.headers.get('cf-connecting-ip') || 'unknown';
  if (await rateLimited(env, ip, Date.now())) return json({ error: 'rate_limited' }, 429, { 'retry-after': '600' });

  let input;
  try { input = await request.json(); } catch { return json({ error: 'invalid_json' }, 400); }
  const validation = validateLead(input);
  if (!validation.ok) return json({ error: 'validation_failed', fields: validation.errors }, 422);

  const key = await makeDeduplicationKey(validation.lead);
  const existing = env.LEAD_DEDUPLICATION && await env.LEAD_DEDUPLICATION.get(key);
  if (existing) return json({ ok: true, reference: existing, duplicate: true });

  const reference = makeReference();
  try {
    await saveLead(env, toStoredLead(validation.lead, reference));
    if (env.LEAD_DEDUPLICATION) await env.LEAD_DEDUPLICATION.put(key, reference, { expirationTtl: 86400 });
    return json({ ok: true, reference });
  } catch (error) {
    const errorClass = error?.message === 'destination_unconfigured' ? 'unavailable' : 'upstream_failure';
    return json({ error: errorClass }, 503, { 'retry-after': '60' });
  }
}

export function onRequest() {
  return json({ error: 'method_not_allowed' }, 405, { allow: 'POST' });
}
