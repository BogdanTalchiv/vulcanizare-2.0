import { business, proposedServices, visitSteps, type CardAction } from '../data/business.ts';
import { icon, iconNames } from '../data/icons.ts';
import { photos, type PhotoName } from '../data/photos.ts';

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const NEW_TAB = '<span class="sr-only"> (se deschide într-o filă nouă)</span>';

export function externalAttrs(external?: boolean) {
  return external ? ' target="_blank" rel="noopener noreferrer"' : '';
}

function tokenMap(): Record<string, string> {
  const map: Record<string, string> = {
    'name': business.name,
    'phone.display': business.phone.display,
    'phone.countryCode': business.phone.countryCode,
    'phone.local': business.phone.local,
    'phone.href': business.phone.href,
    'email.address': business.email.address,
    'email.href': business.email.href,
    'address.street': business.address.street,
    'address.city': business.address.city,
    'address.country': business.address.country,
    'address.full': business.address.full,
    'address.short': business.address.short,
    'links.maps': business.links.maps,
    'links.whatsapp': business.links.whatsapp,
    'year': String(new Date().getFullYear()),
    'newtab': NEW_TAB,
  };
  const raw = new Set(['newtab']);
  for (const key of Object.keys(map)) if (!raw.has(key)) map[key] = escapeHtml(map[key]);
  for (const name of iconNames) map[`icon:${name}`] = icon(name);
  return map;
}

export function replaceTokens(html: string): string {
  const map = tokenMap();
  return html.replace(/\{\{\s*([\w.:-]+)\s*\}\}/g, (_, key: string) => {
    if (!(key in map)) throw new Error(`Unknown template token: {{${key}}}`);
    return map[key];
  });
}

function cardTitle(title: string, action?: CardAction) {
  if (!action) return escapeHtml(title);
  const newTab = action.external ? NEW_TAB : '';
  return `<a class="card__link" href="${escapeHtml(action.href)}"${externalAttrs(action.external)}>${escapeHtml(title)}${newTab}</a>`;
}

export function renderServices(): { note: string; cards: string } {
  const confirmed = proposedServices.filter((service) => service.confirmed);
  const items = confirmed.length > 0 ? confirmed : visitSteps;
  const note =
    confirmed.length > 0
      ? `Ce găsești la atelierul de pe ${business.address.short}.`
      : 'Vulcanizarea ForceCar funcționează non\u2011stop. Iată cum ajungi la noi cel mai rapid.';

  const cards = items
    .map((item, index) => {
      const action = 'action' in item ? item.action : undefined;
      const footer = action
        ? `<span class="card__action" aria-hidden="true">${escapeHtml(action.label)}${icon('arrow', 'icon icon--sm')}</span>`
        : '';
      return `<li class="card${action ? ' card--link' : ''}" data-reveal style="--i:${index}">
          <div class="card__top"><span class="card__index">${String(index + 1).padStart(2, '0')}</span><span class="card__icon">${icon(item.icon)}</span></div>
          <h3 class="card__title">${cardTitle(item.title, action)}</h3>
          <p class="card__text">${escapeHtml(item.text)}</p>
          ${footer}
        </li>`;
    })
    .join('\n');

  return { note: escapeHtml(note), cards };
}

export function renderPhoto(name: PhotoName): string {
  const photo = photos[name];
  const srcset = (ext: string) => photo.widths.map((w) => `/img/${name}-${w}.${ext} ${w}w`).join(', ');
  const largest = photo.widths[photo.widths.length - 1];
  return `<picture>
              <source type="image/avif" srcset="${srcset('avif')}" sizes="${photo.sizes}" />
              <source type="image/webp" srcset="${srcset('webp')}" sizes="${photo.sizes}" />
              <img src="/img/${name}-${largest}.jpg" srcset="${srcset('jpg')}" sizes="${photo.sizes}" width="${photo.width}" height="${photo.height}" alt="${escapeHtml(photo.alt)}" loading="lazy" decoding="async" />
            </picture>`;
}

export function replacePhotos(html: string): string {
  return html.replace(/<!--@photo:([\w-]+)-->/g, (_, name: string) => {
    if (!(name in photos)) throw new Error(`Unknown photo: ${name}`);
    return renderPhoto(name as PhotoName);
  });
}

export function renderDial(): string {
  const c = 220;
  const ring = (r: number, count: number, dash: number) => {
    const circumference = 2 * Math.PI * r;
    const gap = circumference / count - dash;
    return `stroke-dasharray="${dash} ${gap.toFixed(3)}" stroke-dashoffset="${(dash / 2).toFixed(2)}"`;
  };
  const labels = [
    ['00', c, 62],
    ['06', 378, c],
    ['12', c, 378],
    ['18', 62, c],
  ]
    .map(([text, x, y]) => `<text x="${x}" y="${y}">${text}</text>`)
    .join('');

  return `<svg class="dial" viewBox="0 0 440 440" aria-hidden="true" focusable="false">
      <circle class="dial__hairline" cx="${c}" cy="${c}" r="216"/>
      <circle class="dial__arc" cx="${c}" cy="${c}" r="206" pathLength="100" transform="rotate(-90 ${c} ${c})"/>
      <circle class="dial__ticks dial__ticks--minor" cx="${c}" cy="${c}" r="190" ${ring(190, 96, 1.2)} transform="rotate(-90 ${c} ${c})"/>
      <circle class="dial__ticks dial__ticks--major" cx="${c}" cy="${c}" r="188" ${ring(188, 24, 2.2)} transform="rotate(-90 ${c} ${c})"/>
      <g class="dial__labels">${labels}</g>
      <g class="dial__tread"><circle cx="${c}" cy="${c}" r="128" ${ring(128, 72, 4)}/></g>
      <circle class="dial__hairline" cx="${c}" cy="${c}" r="108"/>
      <g class="dial__hand" data-dial-hand>
        <line x1="${c}" y1="40" x2="${c}" y2="78"/>
        <circle cx="${c}" cy="14" r="6"/>
      </g>
    </svg>`;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export function structuredData(siteUrl?: string) {
  const address = {
    '@type': 'PostalAddress',
    streetAddress: business.address.street,
    addressLocality: business.address.city,
    addressCountry: business.address.countryCode,
  };
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'AutomotiveBusiness',
    name: business.name,
    description: `Vulcanizare auto NON-STOP 24/7 în ${business.address.city}, ${business.address.street}.`,
    telephone: business.phone.e164,
    email: business.email.address,
    address,
    hasMap: business.links.maps,
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Servicii anvelope',
      itemListElement: proposedServices
        .filter((service) => service.confirmed)
        .map((service) => ({
          '@type': 'Offer',
          itemOffered: { '@type': 'Service', name: service.title, description: service.text },
        })),
    },
    department: {
      '@type': 'AutomotiveBusiness',
      name: `${business.name} — Vulcanizare NON-STOP`,
      description: 'Vulcanizare auto, disponibilă 24 de ore din 24, 7 zile din 7.',
      telephone: business.phone.e164,
      address,
      openingHoursSpecification: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: DAYS.map((day) => `https://schema.org/${day}`),
        opens: '00:00',
        closes: '23:59',
      },
    },
  };
  if (siteUrl) {
    Object.assign(data, {
      '@id': `${siteUrl}/#business`,
      url: `${siteUrl}/`,
      image: [
        `${siteUrl}/img/og-forcecar.jpg`,
        ...Object.keys(photos).map((name) => `${siteUrl}/img/${name}-${photos[name as PhotoName].width}.jpg`),
      ],
      logo: `${siteUrl}/img/forcecar-mark-512.png`,
    });
  }
  const json = JSON.stringify(data, null, 2).replace(/</g, '\\u003c');
  return `<script type="application/ld+json">\n${json}\n</script>`;
}

export function seoHead(siteUrl?: string): string {
  if (!siteUrl) return '';
  return [
    `<link rel="canonical" href="${siteUrl}/" />`,
    `<meta property="og:url" content="${siteUrl}/" />`,
    `<meta property="og:image" content="${siteUrl}/img/og-forcecar.jpg" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="ForceCar — Vulcanizare NON-STOP 24/7, ${escapeHtml(business.address.short)}" />`,
    `<meta name="twitter:image" content="${siteUrl}/img/og-forcecar.jpg" />`,
  ].join('\n    ');
}

export function robotsTxt(siteUrl?: string) {
  return `User-agent: *\nAllow: /\n${siteUrl ? `\nSitemap: ${siteUrl}/sitemap.xml\n` : ''}`;
}

export function sitemapXml(siteUrl: string) {
  const today = new Date().toISOString().slice(0, 10);
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
    <lastmod>${today}</lastmod>
  </url>
</urlset>
`;
}
