import { getLeadApiHealth } from '../../lib/lead-monitor.js';

const json = (body, status = 200, headers = {}) => new Response(JSON.stringify(body), {
  status,
  headers: {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    ...headers
  }
});

export async function onRequestGet({ env }) {
  const health = await getLeadApiHealth(env);
  return json(health, health.ok ? 200 : 503);
}

export function onRequest() {
  return json({ error: 'method_not_allowed' }, 405, { allow: 'GET' });
}
