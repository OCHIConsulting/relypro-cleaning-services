export const SERVICES = Object.freeze([
  'Regular Cleaning',
  'Deep Cleaning',
  'End-of-Tenancy Cleaning',
  'Carpet Cleaning',
  'Oven Cleaning',
  'Daily Office Cleaning',
  'Airbnb Turnover Cleaning',
  'Washroom Hygiene',
  'Window Cleaning',
  'Other'
]);

const CONTACT_METHODS = new Set(['email', 'phone', 'whatsapp']);
const CAMPAIGN_FIELDS = ['utm_source', 'utm_medium', 'utm_campaign'];
const PHONE_PATTERN = /^[+\d][\d\s().-]{6,24}$/;
const clean = (value, max = 200) => typeof value === 'string'
  ? value.trim().replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').slice(0, max)
  : '';

export function validateLead(input, now = new Date()) {
  const errors = {};
  const kind = input?.kind === 'contact' ? 'contact' : 'quote';
  const name = clean(input?.name, 100);
  const companyName = clean(input?.company_name, 160);
  const contactMethod = clean(input?.contact_method, 20).toLowerCase();
  const contactDetails = clean(input?.contact_details, 160);
  const phoneNumber = clean(input?.phone_number, 30);
  const service = clean(input?.service, 80);
  const postcode = clean(input?.postcode, 12).toUpperCase();
  const propertySummary = clean(input?.property_summary, 1500);
  const subject = kind === 'contact' ? clean(input?.subject, 200) : '';
  const message = kind === 'contact' ? clean(input?.message, 1500) : '';
  const preferredDate = clean(input?.preferred_date, 10);
  const clientSubmissionId = clean(input?.client_submission_id, 80);
  const landingPage = clean(input?.landing_page, 200);
  const startedAt = Date.parse(input?.started_at);

  if (name.length < 2) errors.name = 'Enter your name.';
  if (!CONTACT_METHODS.has(contactMethod)) errors.contact_method = 'Choose how you would like us to reply.';
  if (contactDetails.length < 5 || contactDetails.length > 160) errors.contact_details = 'Enter a valid phone number or email address.';
  if (contactMethod === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactDetails)) errors.contact_details = 'Enter a valid email address.';
  if ((contactMethod === 'phone' || contactMethod === 'whatsapp') && !PHONE_PATTERN.test(contactDetails)) errors.contact_details = 'Enter a valid phone number.';
  if (phoneNumber && !PHONE_PATTERN.test(phoneNumber)) errors.phone_number = 'Enter a valid phone number.';
  if (!SERVICES.includes(service)) errors.service = 'Choose a valid service.';
  if (kind === 'quote' && !/^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i.test(postcode)) errors.postcode = 'Enter a valid UK postcode.';
  if (propertySummary.length < 10) errors.property_summary = 'Add a short description (at least 10 characters).';
  if (preferredDate && !/^\d{4}-\d{2}-\d{2}$/.test(preferredDate)) errors.preferred_date = 'Enter a valid date.';
  if (input?.privacy_acknowledged !== true) errors.privacy_acknowledged = 'Confirm that you have read the privacy notice.';
  if (clean(input?.website, 100)) errors.submission = 'Submission rejected.';
  if (!Number.isFinite(startedAt) || now.getTime() - startedAt < 1500) errors.submission = 'Please review the form and try again.';
  if (!/^[a-zA-Z0-9-]{16,80}$/.test(clientSubmissionId)) errors.submission = 'Refresh the page and try again.';

  const attribution = Object.fromEntries(CAMPAIGN_FIELDS.map((key) => [key, clean(input?.attribution?.[key], 120)]));
  const lead = {
    kind,
    name,
    company_name: companyName,
    contact_method: contactMethod,
    contact_details: contactDetails,
    phone_number: phoneNumber,
    service,
    postcode,
    property_summary: propertySummary,
    subject,
    message,
    preferred_date: preferredDate || null,
    privacy_acknowledged: true,
    landing_page: landingPage.startsWith('/') && !landingPage.includes('?') ? landingPage : '/',
    attribution,
    client_submission_id: clientSubmissionId
  };

  return { ok: Object.keys(errors).length === 0, errors, lead };
}

export async function makeDeduplicationKey(lead) {
  const value = [
    lead.client_submission_id,
    lead.contact_details.toLowerCase(),
    lead.service,
    lead.postcode.replace(/\s/g, '')
  ].join('|');
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export function makeReference(now = new Date()) {
  const date = now.toISOString().slice(2, 10).replace(/-/g, '');
  const bytes = crypto.getRandomValues(new Uint8Array(3));
  const suffix = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('').toUpperCase();
  return `RP-${date}-${suffix}`;
}

export function toStoredLead(lead, reference, now = new Date()) {
  return {
    enquiry_reference: reference,
    created_at: now.toISOString(),
    ...lead,
    stage: 'New enquiry',
    marketing_consent: false
  };
}
