import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';

const outputRoot = resolve('_site');
const readOutput = (path) => readFileSync(resolve(outputRoot, path), 'utf8');
const articlePath =
  'blog/airbnb-turnover-cleaning-checklist-derby/index.html';

test('existing static website remains in the generated output', () => {
  for (const path of [
    'index.html',
    'services.html',
    'get-quote.html',
    'assets/css/style.css',
    'assets/js/main.js',
    'CNAME',
    '_headers'
  ]) {
    assert.ok(existsSync(resolve(outputRoot, path)), `${path} must be copied`);
  }
});

test('blog index uses the RelyPro design and links to published posts', () => {
  const html = readOutput('blog/index.html');

  assert.match(html, /<title>Cleaning Advice &amp; Guides for Derby \| RelyPro<\/title>/);
  assert.match(html, /href="\/assets\/css\/style\.css\?v=20260726-blog"/);
  assert.match(html, /class="nav-link active" href="\/blog\/">Blog<\/a>/);
  assert.match(
    html,
    /href="\/blog\/airbnb-turnover-cleaning-checklist-derby\/"/
  );
});

test('article output contains complete SEO and conversion metadata', () => {
  const html = readOutput(articlePath);

  assert.match(
    html,
    /<link rel="canonical" href="https:\/\/relypro\.co\.uk\/blog\/airbnb-turnover-cleaning-checklist-derby\/"/
  );
  assert.match(html, /"@type": "BlogPosting"/);
  assert.match(html, /"@type": "BreadcrumbList"/);
  assert.match(html, /Airbnb Turnover Cleaning Checklist for Derby Hosts/);
  assert.match(
    html,
    /href="\/get-quote\.html\?service=Airbnb%20Turnover%20Cleaning"/
  );
  assert.doesNotMatch(
    html,
    /Postcode remains/i,
    'regression-test source must not leak into article output'
  );
});

test('sitemap and RSS feed contain the published article', () => {
  const sitemap = readOutput('sitemap.xml');
  const feed = readOutput('feed.xml');
  const articleUrl =
    'https://relypro.co.uk/blog/airbnb-turnover-cleaning-checklist-derby/';

  assert.match(sitemap, /https:\/\/relypro\.co\.uk\/blog\//);
  assert.ok(sitemap.includes(articleUrl));
  assert.ok(feed.includes(articleUrl));
  assert.match(feed, /<rss version="2\.0"/);
});

test('draft source and Eleventy internals are not published', () => {
  assert.equal(existsSync(resolve(outputRoot, 'src')), false);
  assert.equal(existsSync(resolve(outputRoot, 'package.json')), false);
  assert.equal(existsSync(resolve(outputRoot, '.pages.yml')), false);
});
