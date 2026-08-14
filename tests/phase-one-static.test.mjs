import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('quote and contact forms expose privacy acknowledgement and error summaries', async () => {
  for (const file of ['get-quote.html', 'contact.html']) {
    const html = await read(file);
    assert.match(html, /form-error-summary[^>]*role="alert"/);
    assert.match(html, /name="privacy_acknowledged" required/);
    assert.match(html, /name="website"[^>]*tabindex="-1"/);
    assert.match(html, /name="company_name"/);
    assert.match(html, /name="phone_number"/);
    assert.doesNotMatch(html, /name="relypro-lead-endpoint"/);
  }
});

test('quote contact input follows the selected reply method', async () => {
  const source = await read('assets/js/main.js');
  assert.match(source, /quoteContact\.type = usesEmail \? 'email' : 'tel'/);
  assert.match(source, /quoteContactLabel\.textContent = usesEmail \? 'Email address'/);
  assert.match(source, /quoteOptionalPhoneGroup\.hidden = !usesEmail/);
  assert.match(source, /quotePhone\.disabled = !usesEmail/);
});

test('forms use the first-party endpoint without a cross-origin bridge', async () => {
  const source = await read('assets/js/main.js');
  const headers = await read('_headers');
  assert.match(source, /\|\| '\/api\/leads'/);
  assert.doesNotMatch(headers, /connect-src[^\n]+https:\/\/relypro-cleaning-services\.pages\.dev/);
});

test('analytics code does not send form contents, contact details, postcodes, or link URLs', async () => {
  const source = await read('assets/js/main.js');
  for (const field of ['contact_details', 'postcode:', 'property_summary:', 'link_url:', 'link_text:']) {
    assert.doesNotMatch(source, new RegExp(`trackEvent\\([^\\n]+${field}`));
  }
  assert.doesNotMatch(source, /postcode_area/);
  assert.match(source, /if \(!consent\.analytics\)\s*{\s*return;/);
});

test('client only reports lead success after an accepted API response', async () => {
  const source = await read('assets/js/main.js');
  const responseCheck = source.indexOf("if (!response.ok || !body.ok || !body.reference)");
  const successEvent = source.indexOf("trackEvent('lead_capture_success'");
  assert.ok(responseCheck > -1 && successEvent > responseCheck);
});

test('email and WhatsApp handoffs include every visible quote and contact field', async () => {
  const source = await read('assets/js/main.js');
  assert.match(source, /mailto:\$\{BUSINESS_EMAIL\}\?subject=\$\{encodeURIComponent\(emailSubject\)\}&body=\$\{encodeURIComponent\(message\)\}/);
  for (const label of [
    'Name:', 'Preferred reply:', 'Contact details:', 'Service:', 'Postcode:',
    'Company or property name:', 'Phone number:', 'What would you like cleaned?:',
    'Preferred date:', 'Email:', 'Subject:', 'Message:',
    'Privacy notice acknowledged: Yes'
  ]) {
    assert.match(source, new RegExp(label.replace(/[?]/g, '\\?')));
  }
});

test('every source page uses the current JavaScript cache-busting release', async () => {
  const release = 'assets/js/main.js?v=20260814-company-phone';
  const pages = [
    'about.html', 'airbnb-turnover-cleaning-derby.html', 'areas.html', 'careers.html',
    'carpet-cleaning-derby.html', 'contact.html', 'cookies.html', 'deep-cleaning-derby.html',
    'end-of-tenancy-cleaning-derby.html', 'get-quote.html', 'index.html',
    'office-cleaning-derby.html', 'privacy.html', 'services.html', 'terms.html'
  ];
  for (const page of pages) {
    assert.match(await read(page), new RegExp(release.replace(/[.?]/g, '\\$&')));
  }
  assert.match(await read('src/_includes/layouts/base.njk'), /\/assets\/js\/main\.js\?v=20260814-company-phone/);
});

test('privacy notice identifies the website and CRM processors', async () => {
  const html = await read('privacy.html');
  assert.match(html, /Cloudflare to host and protect the website and to process enquiry submissions/);
  assert.match(html, /HubSpot as our customer relationship management provider/);
});
