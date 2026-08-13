const HUBSPOT_API_ROOT = 'https://api.hubapi.com/crm/v3/objects';

const splitName = (name) => {
  const parts = name.trim().split(/\s+/);
  return parts.length === 1
    ? { firstname: parts[0] }
    : { firstname: parts.shift(), lastname: parts.join(' ') };
};

const compact = (value) => Object.fromEntries(
  Object.entries(value).filter(([, item]) => item !== undefined && item !== null && item !== '')
);

export function toHubSpotRecords(lead, config = {}) {
  const contact = {
    ...splitName(lead.name),
    ...(lead.contact_method === 'email'
      ? { email: lead.contact_details }
      : { phone: lead.contact_details })
  };
  const note = [
    `Received: ${lead.created_at}`,
    `Preferred date: ${lead.preferred_date || 'Not supplied'}`,
    `UTM campaign: ${lead.attribution?.utm_campaign || 'Not supplied'}`,
    `Marketing consent: No`,
    `Enquiry type: ${lead.kind}`
  ].join('\n');
  const deal = compact({
    dealname: `${lead.enquiry_reference} — ${lead.service}`,
    pipeline: config.pipeline || 'default',
    dealstage: config.newEnquiryStage || 'appointmentscheduled',
    enquiry_reference: lead.enquiry_reference,
    client_submission_id: lead.client_submission_id,
    service_requested: lead.service,
    preferred_contact_channel: lead.contact_method,
    postcode_service_area: lead.postcode,
    property_summary: lead.property_summary,
    landing_page: lead.landing_page,
    next_action: 'Contact customer and confirm requirements',
    utm_source: lead.attribution?.utm_source,
    utm_medium: lead.attribution?.utm_medium,
    description: note
  });
  return { contact, deal };
}

async function hubSpotRequest(path, token, init = {}) {
  const response = await fetch(`${HUBSPOT_API_ROOT}${path}`, {
    ...init,
    headers: {
      authorization: `Bearer ${token}`,
      'content-type': 'application/json',
      ...init.headers
    },
    signal: AbortSignal.timeout(8000)
  });
  if (!response.ok) throw new Error(`hubspot_${response.status}`);
  return response.json();
}

export async function saveHubSpotLead(env, lead) {
  if (!env.HUBSPOT_ACCESS_TOKEN) throw new Error('destination_unconfigured');
  const records = toHubSpotRecords(lead, {
    pipeline: env.HUBSPOT_PIPELINE_ID,
    newEnquiryStage: env.HUBSPOT_NEW_ENQUIRY_STAGE_ID
  });
  const contactResult = await hubSpotRequest('/contacts/batch/upsert', env.HUBSPOT_ACCESS_TOKEN, {
    method: 'POST',
    body: JSON.stringify({
      inputs: [{
        id: lead.contact_details,
        idProperty: lead.contact_method === 'email' ? 'email' : 'phone',
        properties: records.contact
      }]
    })
  });
  const contact = contactResult.results?.[0];
  if (!contact?.id) throw new Error('hubspot_contact_missing');
  await hubSpotRequest('/deals', env.HUBSPOT_ACCESS_TOKEN, {
    method: 'POST',
    body: JSON.stringify({
      properties: records.deal,
      associations: [{
        to: { id: contact.id },
        types: [{ associationCategory: 'HUBSPOT_DEFINED', associationTypeId: 3 }]
      }]
    })
  });
}
