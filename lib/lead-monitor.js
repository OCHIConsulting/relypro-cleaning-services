const MONITOR_KEY = 'monitor:lead-api:consecutive-5xx';
const MONITOR_TTL_SECONDS = 86400 * 7;

const readState = async (env) => {
  if (!env.LEAD_DEDUPLICATION) return null;
  const raw = await env.LEAD_DEDUPLICATION.get(MONITOR_KEY);
  if (!raw) return { failures: 0, updated_at: null };
  const state = JSON.parse(raw);
  if (!Number.isInteger(state.failures) || state.failures < 0) throw new Error('invalid_monitor_state');
  return state;
};

const writeState = (env, state) => env.LEAD_DEDUPLICATION.put(
  MONITOR_KEY,
  JSON.stringify(state),
  { expirationTtl: MONITOR_TTL_SECONDS }
);

export async function recordLeadApiFailure(env, now = Date.now()) {
  if (!env.LEAD_DEDUPLICATION) return false;
  try {
    const state = await readState(env);
    await writeState(env, {
      failures: state.failures + 1,
      updated_at: new Date(now).toISOString()
    });
    return true;
  } catch {
    console.error(JSON.stringify({ event: 'lead_monitor_update_failed' }));
    return false;
  }
}

export async function recordLeadApiSuccess(env, now = Date.now()) {
  if (!env.LEAD_DEDUPLICATION) return false;
  try {
    await writeState(env, { failures: 0, updated_at: new Date(now).toISOString() });
    return true;
  } catch {
    console.error(JSON.stringify({ event: 'lead_monitor_update_failed' }));
    return false;
  }
}

export async function getLeadApiHealth(env) {
  if (!env.LEAD_DEDUPLICATION) return { ok: false, status: 'monitoring_unavailable' };
  try {
    const state = await readState(env);
    return state.failures >= 3
      ? { ok: false, status: 'sustained_5xx' }
      : { ok: true, status: 'healthy' };
  } catch {
    return { ok: false, status: 'monitoring_unavailable' };
  }
}
