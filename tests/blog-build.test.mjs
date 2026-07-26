import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
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

test('homepage LocalBusiness structured data has Google required properties', () => {
  const html = readOutput('index.html');
  const jsonLdBlocks = [...html.matchAll(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g
  )].map((match) => JSON.parse(match[1]));
  const graphNodes = jsonLdBlocks.flatMap((block) => block['@graph'] || [block]);
  const business = graphNodes.find((node) => {
    const types = Array.isArray(node['@type']) ? node['@type'] : [node['@type']];
    return types.includes('LocalBusiness');
  });

  assert.ok(business, 'homepage must define a LocalBusiness');
  assert.equal(business.name, 'RelyPro Cleaning Services');
  assert.deepEqual(business.address, {
    '@type': 'PostalAddress',
    addressLocality: 'Derby',
    addressRegion: 'Derbyshire',
    addressCountry: 'GB'
  });
  assert.equal(business.url, 'https://relypro.co.uk/');
  assert.equal(business.telephone, '+44 7796 584056');
});

test('blog index uses the RelyPro design and links to published posts', () => {
  const html = readOutput('blog/index.html');

  assert.match(html, /<title>Cleaning Advice &amp; Guides for Derby \| RelyPro<\/title>/);
  assert.match(
    html,
    /href="\/assets\/css\/style\.css\?v=20260726-blog-pagination"/
  );
  assert.match(html, /class="nav-link active" href="\/blog\/">Blog<\/a>/);
  assert.match(
    html,
    /href="\/blog\/airbnb-cleaning-cost-derby\/"/
  );
});

test('blog archive features the latest post and paginates the remaining articles', () => {
  const firstPage = readOutput('blog/index.html');
  const secondPage = readOutput('blog/page/2/index.html');
  const fifthPage = readOutput('blog/page/5/index.html');

  assert.match(firstPage, /class="blog-featured mb-5"/);
  assert.match(firstPage, /Featured guide/);
  assert.match(
    firstPage,
    /<h2 class="display-6 fw-bold">\s*<a href="\/blog\/airbnb-cleaning-cost-derby\/"/
  );
  assert.equal(
    (firstPage.match(/<article class="blog-card h-100">/g) || []).length,
    4,
    'the first archive page must show four cards after the featured article'
  );
  assert.match(firstPage, /aria-label="Blog pagination"/);
  assert.match(firstPage, /aria-current="page" aria-label="Page 1"/);
  assert.match(firstPage, /href="\/blog\/page\/2\/" rel="next"/);
  assert.match(
    firstPage,
    /<link rel="next" href="https:\/\/relypro\.co\.uk\/blog\/page\/2\/"/
  );

  assert.doesNotMatch(secondPage, /class="blog-featured mb-5"/);
  assert.equal(
    (secondPage.match(/<article class="blog-card h-100">/g) || []).length,
    5
  );
  assert.match(
    secondPage,
    /<link rel="canonical" href="https:\/\/relypro\.co\.uk\/blog\/page\/2\/"/
  );
  assert.match(
    secondPage,
    /<title>Cleaning Advice &amp; Guides – Page 2 \| RelyPro<\/title>/
  );
  assert.match(secondPage, /href="\/blog\/" rel="prev"/);
  assert.match(
    secondPage,
    /<link rel="prev" href="https:\/\/relypro\.co\.uk\/blog\/"/
  );

  assert.equal(
    (fifthPage.match(/<article class="blog-card h-100">/g) || []).length,
    1
  );
  assert.match(fifthPage, /aria-current="page" aria-label="Page 5"/);
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
  }).filter((entry) => entry.isDirectory() && entry.name !== 'page');

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

test('every published article has a unique optimized editorial image', () => {
  const articles = readdirSync(sourcePostsRoot).filter((filename) =>
    filename.endsWith('.md')
  );
  const images = new Set();

  assert.equal(articles.length, 21);

  for (const filename of articles) {
    const source = readFileSync(resolve(sourcePostsRoot, filename), 'utf8');
    const image = source.match(
      /^image: (\/assets\/images\/blog\/([a-z0-9-]+\.webp))$/m
    );
    const slug = source.match(/^slug: ([a-z0-9-]+)$/m)?.[1];
    const imageAlt = source.match(/^imageAlt: (.+)$/m)?.[1]?.trim();

    assert.ok(image, `${filename} must use a generated blog image`);
    assert.equal(image[2], `${slug}.webp`, `${filename} image must match its slug`);
    assert.equal(images.has(image[1]), false, `${filename} image must be unique`);
    images.add(image[1]);
    assert.ok(imageAlt?.length >= 8, `${filename} must have useful image alt text`);

    const sourceImage = resolve(image[1].slice(1));
    const builtImage = resolve(outputRoot, image[1].slice(1));
    assert.ok(existsSync(sourceImage), `${image[1]} must exist in source`);
    assert.ok(existsSync(builtImage), `${image[1]} must be copied to the build`);
    assert.ok(
      statSync(sourceImage).size <= 200_000,
      `${image[1]} must stay below 200 KB`
    );
  }
});

test('draft source and Eleventy internals are not published', () => {
  assert.equal(existsSync(resolve(outputRoot, 'src')), false);
  assert.equal(existsSync(resolve(outputRoot, 'package.json')), false);
  assert.equal(existsSync(resolve(outputRoot, '.pages.yml')), false);
});
