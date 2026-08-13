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
  }
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
