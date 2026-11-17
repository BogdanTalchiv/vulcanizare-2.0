import { readFileSync, existsSync } from 'node:fs';

if (!existsSync('dist/sitemap.xml')) {
  console.error('Missing dist/sitemap.xml. Build with SITE_URL set, e.g.:\n  SITE_URL=https://www.example.md npm run build');
  process.exit(1);
}

const site = process.env.SITE_URL?.replace(/\/+$/, '') || 'https://www.example.md';
const sitemap = readFileSync('dist/sitemap.xml', 'utf8');
const robots = readFileSync('dist/robots.txt', 'utf8');
const home = readFileSync('dist/index.html', 'utf8');
const privacy = readFileSync('dist/confidentialitate/index.html', 'utf8');
const notFound = readFileSync('dist/404.html', 'utf8');

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

// Sitemap XML well-formed + expected URLs
assert(sitemap.startsWith('<?xml'), 'sitemap missing xml declaration');
assert(sitemap.includes('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"'), 'sitemap namespace');
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
assert(locs.length === 2, `expected 2 urls, got ${locs.length}`);
assert(locs[0] === `${site}/`, `home loc: ${locs[0]}`);
assert(locs[1] === `${site}/confidentialitate/`, `privacy loc: ${locs[1]}`);
assert(!sitemap.includes('404'), 'sitemap must not include 404');
assert([...sitemap.matchAll(/<lastmod>(\d{4}-\d{2}-\d{2})<\/lastmod>/g)].length === 2, 'lastmod dates');

// robots
assert(robots.includes('User-agent: *'), 'robots ua');
assert(robots.includes('Allow: /'), 'robots allow');
assert(robots.includes(`Sitemap: ${site}/sitemap.xml`), 'robots sitemap');
assert(!/Disallow:\s*\//i.test(robots), 'robots must not disallow all');

function checkPage(name, html, { path, indexable, titleIncludes }) {
  assert(html.includes(`<link rel="canonical" href="${site}${path}"`), `${name} canonical`);
  assert(html.includes(`property="og:url" content="${site}${path}"`), `${name} og:url`);
  assert(html.includes(`${site}/img/og-forcecar.jpg`), `${name} og:image`);
  assert(html.includes(titleIncludes), `${name} title`);
  if (indexable) {
    assert(/name="robots" content="[^"]*index/.test(html), `${name} indexable robots`);
    assert(!/noindex/.test(html), `${name} must not noindex`);
  }
  const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) =>
    JSON.parse(m[1]),
  );
  assert(ld.length >= 1, `${name} json-ld`);
  return ld;
}

const homeLd = checkPage('home', home, {
  path: '/',
  indexable: true,
  titleIncludes: 'Vulcanizare 24/7 Chișinău',
});
assert(homeLd[0]['@graph']?.some((n) => n['@type'] === 'AutomotiveBusiness'), 'home AutomotiveBusiness');
assert(homeLd[0]['@graph']?.some((n) => n['@type'] === 'WebSite'), 'home WebSite');
const biz = homeLd[0]['@graph'].find((n) => n['@type'] === 'AutomotiveBusiness');
assert(biz.department?.some((d) => d.openingHoursSpecification), 'vulcanizare hours');
assert(biz.department?.find((d) => d['@type'] === 'AutoRepair') && !biz.department.find((d) => d['@type'] === 'AutoRepair').openingHoursSpecification, 'service auto has no 24/7 hours');

const privacyLd = checkPage('privacy', privacy, {
  path: '/confidentialitate/',
  indexable: true,
  titleIncludes: 'Confidențialitate',
});
assert(privacyLd[0]['@graph']?.some((n) => n['@type'] === 'BreadcrumbList'), 'privacy breadcrumbs');
assert(privacy.includes('class="breadcrumbs"'), 'privacy visible breadcrumbs');

assert(/noindex/.test(notFound), '404 noindex');
assert(!notFound.includes('rel="canonical"'), '404 no canonical');
assert(!existsSync('dist/sitemap.xml') || !readFileSync('dist/sitemap.xml', 'utf8').includes('404.html'), 'ok');

console.log(
  JSON.stringify(
    {
      ok: true,
      sitemapUrls: locs,
      robotsSitemap: robots.includes('Sitemap:'),
      homeTypes: homeLd[0]['@graph'].map((n) => n['@type']),
      privacyTypes: privacyLd[0]['@graph'].map((n) => n['@type']),
    },
    null,
    2,
  ),
);
