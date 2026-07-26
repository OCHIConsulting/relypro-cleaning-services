import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';

const outputRoot = resolve('_site');
const readOutput = (path) => readFileSync(resolve(outputRoot, path), 'utf8');
const articlePath =
  'blog/airbnb-turnover-cleaning-checklist-derby/index.html';
const sourcePostsRoot = resolve('src/blog/posts');
const originalArticle =
  '2026-07-26-airbnb-turnover-cleaning-checklist-derby.md';

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
  assert.match(html, /href="\/assets\/css\/style\.css\?v=20260726-content"/);
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

test('the 2026 editorial collection contains 20 substantial new articles', () => {
  const newArticles = readdirSync(sourcePostsRoot)
    .filter((filename) => filename.endsWith('.md'))
    .filter((filename) => filename !== originalArticle);

  assert.equal(newArticles.length, 20);

  const slugs = new Set();
  for (const filename of newArticles) {
    const source = readFileSync(resolve(sourcePostsRoot, filename), 'utf8');
    const document = source.match(
      /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/
    );
    assert.ok(document, `${filename} must have valid frontmatter`);
    const [, frontmatter, body] = document;
    const field = (name) =>
      frontmatter.match(new RegExp(`^${name}: (.+)$`, 'm'))?.[1].trim();
    const title = field('title');
    const description = field('description');
    const slug = field('slug');
    const date = field('date');
    const wordCount = body
      .split(/\s+/)
      .filter((word) => /[A-Za-z0-9]/.test(word)).length;

    assert.ok(title.length >= 20 && title.length <= 70, `${filename} title length`);
    assert.ok(
      description.length >= 100 && description.length <= 160,
      `${filename} description length`
    );
    assert.match(slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/, `${filename} slug`);
    assert.equal(slugs.has(slug), false, `${filename} slug must be unique`);
    slugs.add(slug);
    assert.match(date, /^2026-(0[1-7])-\d{2}$/, `${filename} date`);
    assert.match(frontmatter, /^draft: false$/m, `${filename} must be published`);
    assert.ok(wordCount >= 500, `${filename} must contain at least 500 words`);
    assert.ok(
      (body.match(/^## /gm) || []).length >= 4,
      `${filename} must contain useful section structure`
    );
    assert.match(
      body,
      /\]\(\/(?:airbnb-turnover-cleaning-derby|deep-cleaning-derby|end-of-tenancy-cleaning-derby|office-cleaning-derby|carpet-cleaning-derby|areas|get-quote)\.html/,
      `${filename} must link to a relevant commercial page`
    );
  }
});

test('all 21 published articles are generated as indexable pages', () => {
  const articleDirectories = readdirSync(resolve(outputRoot, 'blog'), {
    withFileTypes: true
  }).filter((entry) => entry.isDirectory());

  assert.equal(articleDirectories.length, 21);
  for (const entry of articleDirectories) {
    const htmlPath = resolve(outputRoot, 'blog', entry.name, 'index.html');
    assert.ok(existsSync(htmlPath), `${entry.name} must have an index page`);
    const html = readFileSync(htmlPath, 'utf8');
    assert.match(html, /<meta name="description" content="[^"]{100,160}"/);
    assert.match(html, /"@type": "BlogPosting"/);
    assert.match(html, /<aside class="article-cta"/);
  }
});

test('draft source and Eleventy internals are not published', () => {
  assert.equal(existsSync(resolve(outputRoot, 'src')), false);
  assert.equal(existsSync(resolve(outputRoot, 'package.json')), false);
  assert.equal(existsSync(resolve(outputRoot, '.pages.yml')), false);
});
