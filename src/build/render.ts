import { autoService, business, proposedServices } from '../data/business.ts';
import { categoryInfo, necessaryItem, type ConsentService, type OptionalCategory } from '../data/consent.ts';
import { icon, iconNames } from '../data/icons.ts';
import { photos, type PhotoName } from '../data/photos.ts';
import {
  busRanges,
  extras,
  paintPackages,
  patches,
  rimAutoRanges,
  rimSuvRanges,
  runFlatSurcharge,
  wheelWork,
} from '../data/prices.ts';

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

export function renderServices(): { note: string; cards: string } {
  const confirmed = proposedServices.filter((service) => service.confirmed);
  const note = `<span data-i18n="services.note">Ce găsești la atelierul de pe ${escapeHtml(business.address.short)}.</span>`;

  const cards = confirmed
    .map((item, index) => {
      return `<li class="card" data-reveal style="--i:${index}">
          <div class="card__top"><span class="card__index">${String(index + 1).padStart(2, '0')}</span><span class="card__icon">${icon(item.icon)}</span></div>
          <h3 class="card__title" data-i18n="service.${item.id}.title">${escapeHtml(item.title)}</h3>
          <p class="card__text" data-i18n="service.${item.id}.text">${escapeHtml(item.text)}</p>
        </li>`;
    })
    .join('\n');

  return { note, cards };
}

function money(value: string | number) {
  return `<span class="prices__money"><span class="prices__num">${escapeHtml(String(value))}</span> <span data-i18n="prices.currency">lei</span></span>`;
}

const rangeLabelDefaults: Record<string, string> = {
  'bus.remove': 'Scos / pus',
  'bus.mount': 'Demontare / montare',
  'bus.balance': 'Balansare',
  'bus.total': 'Total pe roată',
  'rims.alloy': 'Jante aliaj',
  'rims.steel': 'Jante oțel',
  'rims.nitrogen': 'Azot · 4 roți',
};

function rangeCards(items: { id: string; key: string; value: string }[], prefix: string) {
  return items
    .map((item, index) => {
      const i18nKey = `prices.${prefix}.${item.key}`;
      const label = rangeLabelDefaults[`${prefix}.${item.key}`] ?? item.key;
      return `<article class="prices__stat" data-reveal style="--i:${index}">
              <p class="prices__stat-label" data-i18n="${i18nKey}">${escapeHtml(label)}</p>
              <p class="prices__stat-value">${money(item.value)}</p>
            </article>`;
    })
    .join('\n');
}

export function renderPrices(): string {
  const chips = wheelWork
    .map(
      (row, index) =>
        `<button class="prices__chip${index === 3 ? ' is-active' : ''}" type="button" data-price-size="${row.id}" data-auto="${row.auto}" data-suv="${row.suv}" aria-pressed="${index === 3 ? 'true' : 'false'}">${escapeHtml(row.label)}</button>`,
    )
    .join('\n');

  const defaultRow = wheelWork[3] ?? wheelWork[0];

  const tableRows = wheelWork
    .map(
      (row) => `<tr data-price-row="${row.id}">
                <th scope="row">${escapeHtml(row.label)}</th>
                <td>${money(row.auto)}</td>
                <td>${money(row.suv)}</td>
              </tr>`,
    )
    .join('\n');

  const patchCards = patches
    .map(
      (item, index) => `<li class="prices__extra" data-reveal style="--i:${index}">
              <span class="prices__extra-name" data-i18n="prices.extra.${item.key}">${escapeHtml(item.key)}</span>
              ${money(item.price)}
            </li>`,
    )
    .join('\n');

  const extraCards = extras
    .map((item, index) => {
      const from = item.id === 'antitheft';
      return `<li class="prices__extra" data-reveal style="--i:${index}">
              <span class="prices__extra-name" data-i18n="prices.extra.${item.key}">${escapeHtml(item.key)}</span>
              <span class="prices__money">${from ? '<span data-i18n="prices.from">de la </span>' : ''}<span class="prices__num">${escapeHtml(item.price)}</span> <span data-i18n="prices.currency">lei</span></span>
            </li>`;
    })
    .join('\n');

  const paintDefaults: Record<string, { title: string; note: string }> = {
    paintSolid: { title: 'Într-o culoare', note: 'Set complet · R13–R23' },
    paintDiamond: { title: 'Culoare + tăiere diamant', note: 'Set complet · R13–R23' },
    paintCutOnly: { title: 'Tăiere diamant + lac', note: 'Fără vopsire · R13–R23' },
    paintSteel: { title: 'Vopsire jante metal', note: 'Tot setul' },
    paintCaliper: { title: 'Vopsire suport frână', note: 'Pe set' },
  };

  const paintCards = paintPackages
    .map((item, index) => {
      const value = item.to == null ? String(item.from) : `${item.from}–${item.to}`;
      const fromOnly = item.to == null;
      const defaults = paintDefaults[item.key] ?? { title: item.key, note: '' };
      return `<article class="prices__paint" data-reveal style="--i:${index}">
              <p class="prices__paint-index">0${index + 1}</p>
              <h3 class="prices__paint-title" data-i18n="prices.paint.${item.key}">${escapeHtml(defaults.title)}</h3>
              <p class="prices__paint-price">${fromOnly ? '<span data-i18n="prices.from">de la </span>' : ''}${money(value)}</p>
              <p class="prices__paint-note" data-i18n="prices.paint.${item.key}Note">${escapeHtml(defaults.note)}</p>
            </article>`;
    })
    .join('\n');

  return `<div class="prices" data-prices>
          <div class="prices__tabs" role="tablist" data-i18n-aria="prices.tabsLabel" aria-label="Categorii prețuri">
            <button class="prices__tab is-active" type="button" role="tab" id="prices-tab-wheels" aria-selected="true" aria-controls="prices-panel-wheels" data-price-tab="wheels" data-i18n="prices.tab.wheels">Roți</button>
            <button class="prices__tab" type="button" role="tab" id="prices-tab-bus" aria-selected="false" aria-controls="prices-panel-bus" data-price-tab="bus" data-i18n="prices.tab.bus">Autobuz</button>
            <button class="prices__tab" type="button" role="tab" id="prices-tab-rims" aria-selected="false" aria-controls="prices-panel-rims" data-price-tab="rims" data-i18n="prices.tab.rims">Jante</button>
            <button class="prices__tab" type="button" role="tab" id="prices-tab-extra" aria-selected="false" aria-controls="prices-panel-extra" data-price-tab="extra" data-i18n="prices.tab.extra">Extra</button>
            <button class="prices__tab" type="button" role="tab" id="prices-tab-paint" aria-selected="false" aria-controls="prices-panel-paint" data-price-tab="paint" data-i18n="prices.tab.paint">Vopsire</button>
          </div>

          <div class="prices__panels">
            <div class="prices__panel is-active" role="tabpanel" id="prices-panel-wheels" aria-labelledby="prices-tab-wheels" data-price-panel="wheels">
              <p class="prices__lead" data-reveal data-i18n="prices.wheels.lead">Alege diametrul — prețul e pentru o roată, complet (scos, demontare, montare, balansare).</p>
              <div class="prices__picker" data-reveal>
                <p class="prices__picker-label" data-i18n="prices.wheels.diameter">Diametru</p>
                <div class="prices__chips" role="group" data-i18n-aria="prices.wheels.diameterGroup" aria-label="Diametrul jantei">${chips}</div>
              </div>
              <div class="prices__stage" data-reveal>
                <article class="prices__quote">
                  <p class="prices__quote-kicker" data-i18n="prices.wheels.auto">Autoturism</p>
                  <p class="prices__quote-value"><span data-price-auto>${defaultRow.auto}</span> <span data-i18n="prices.currency">lei</span></p>
                  <p class="prices__quote-meta"><span data-i18n="prices.wheels.perWheel">pe o roată</span> · <span data-price-label>${escapeHtml(defaultRow.label)}</span></p>
                </article>
                <article class="prices__quote prices__quote--accent">
                  <p class="prices__quote-kicker">SUV</p>
                  <p class="prices__quote-value"><span data-price-suv>${defaultRow.suv}</span> <span data-i18n="prices.currency">lei</span></p>
                  <p class="prices__quote-meta"><span data-i18n="prices.wheels.perWheel">pe o roată</span> · <span data-price-label>${escapeHtml(defaultRow.label)}</span></p>
                </article>
              </div>
              <p class="prices__note" data-reveal><span class="prices__note-tag" data-i18n="prices.noteTag">Atenție</span> <span data-i18n="prices.wheels.note">Pentru anvelope RunFlat sau volum mare (de la 265, profil 25/40) se adaugă ${runFlatSurcharge} lei la montaj.</span></p>
              <div class="prices__table-wrap" data-reveal>
                <table class="prices__table">
                  <caption class="sr-only" data-i18n="prices.wheels.tableCaption">Prețuri lucru la o roată, autoturism și SUV</caption>
                  <thead>
                    <tr>
                      <th scope="col" data-i18n="prices.wheels.colSize">Diametru</th>
                      <th scope="col" data-i18n="prices.wheels.auto">Autoturism</th>
                      <th scope="col">SUV</th>
                    </tr>
                  </thead>
                  <tbody>${tableRows}</tbody>
                </table>
              </div>
            </div>

            <div class="prices__panel" role="tabpanel" id="prices-panel-bus" aria-labelledby="prices-tab-bus" data-price-panel="bus" hidden>
              <p class="prices__lead" data-reveal data-i18n="prices.bus.lead">Lucru la o roată de autobuz, diametre R14–R21 — în funcție de mărime.</p>
              <div class="prices__stats">${rangeCards(busRanges, 'bus')}</div>
            </div>

            <div class="prices__panel" role="tabpanel" id="prices-panel-rims" aria-labelledby="prices-tab-rims" data-price-panel="rims" hidden>
              <p class="prices__lead" data-reveal data-i18n="prices.rims.lead">Îndreptare jante și umflare cu azot — prețurile variază după diametru.</p>
              <div class="prices__rim-grid">
                <section class="prices__rim-card" data-reveal>
                  <h3 class="prices__rim-title" data-i18n="prices.rims.autoTitle">Autoturisme · R13–R22</h3>
                  <div class="prices__stats prices__stats--compact">${rangeCards(rimAutoRanges, 'rims')}</div>
                </section>
                <section class="prices__rim-card" data-reveal style="--i:1">
                  <h3 class="prices__rim-title" data-i18n="prices.rims.suvTitle">SUV · R14–R23</h3>
                  <div class="prices__stats prices__stats--compact">${rangeCards(rimSuvRanges, 'rims')}</div>
                </section>
              </div>
            </div>

            <div class="prices__panel" role="tabpanel" id="prices-panel-extra" aria-labelledby="prices-tab-extra" data-price-panel="extra" hidden>
              <p class="prices__lead" data-reveal data-i18n="prices.extra.lead">Reparații, ventile și alte lucrări din atelier.</p>
              <h3 class="prices__subhead" data-reveal data-i18n="prices.extra.patchesTitle">Plasturi</h3>
              <ul class="prices__extras" role="list">${patchCards}</ul>
              <h3 class="prices__subhead" data-reveal data-i18n="prices.extra.moreTitle">Alte servicii</h3>
              <ul class="prices__extras" role="list">${extraCards}</ul>
            </div>

            <div class="prices__panel" role="tabpanel" id="prices-panel-paint" aria-labelledby="prices-tab-paint" data-price-panel="paint" hidden>
              <p class="prices__lead" data-reveal data-i18n="prices.paint.lead">Vopsire și finisaj jante — preț pe set, în funcție de diametru (R13–R23).</p>
              <div class="prices__paint-grid">${paintCards}</div>
            </div>
          </div>
        </div>`;
}

export function renderAutoService(): { list: string; cta: string } {
  const list = autoService.services
    .map(
      (service, index) =>
        `<li data-reveal style="--i:${index}" data-i18n="auto.${service.key}">${escapeHtml(service.label)}</li>`,
    )
    .join('\n');

  const url = autoService.url.trim();
  if (!url) {
    return {
      list,
      cta: `<span class="btn btn--xl autoservice__cta is-pending" role="text" aria-disabled="true">
                <span class="btn__icon" aria-hidden="true">${icon('arrow')}</span>
                <span class="btn__stack"><span class="btn__label" data-i18n="auto.ctaLabel">Site-ul service-ului</span><span class="btn__meta" data-i18n="auto.ctaSoon">În curând</span></span>
              </span>`,
    };
  }
  if (!/^https?:\/\//.test(url)) throw new Error(`autoService.url must start with https://, got "${url}"`);

  return {
    list,
    cta: `<a class="btn btn--primary btn--xl autoservice__cta" href="${escapeHtml(url)}"${externalAttrs(true)}>
                <span class="btn__icon">${icon('arrow')}</span>
                <span class="btn__stack"><span class="btn__label" data-i18n="auto.ctaLive">Vezi site-ul service-ului</span><span class="btn__meta">${escapeHtml(new URL(url).hostname.replace(/^www\./, ''))}</span></span>
                <span class="sr-only" data-i18n="newtab"> (se deschide într-o filă nouă)</span>
              </a>`,
  };
}

export function renderPhoto(name: PhotoName): string {
  const photo = photos[name];
  const srcset = (ext: string) => photo.widths.map((w) => `/img/${name}-${w}.${ext} ${w}w`).join(', ');
  const largest = photo.widths[photo.widths.length - 1];
  const altKey = name === 'atelier-raft' ? 'photo.raft' : name === 'jante-sudura' ? 'photo.weld' : '';
  const altAttr = altKey
    ? `alt="${escapeHtml(photo.alt)}" data-i18n-alt="${altKey}"`
    : `alt="${escapeHtml(photo.alt)}"`;
  return `<picture>
              <source type="image/avif" srcset="${srcset('avif')}" sizes="${photo.sizes}" />
              <source type="image/webp" srcset="${srcset('webp')}" sizes="${photo.sizes}" />
              <img src="/img/${name}-${largest}.jpg" srcset="${srcset('jpg')}" sizes="${photo.sizes}" width="${photo.width}" height="${photo.height}" ${altAttr} loading="lazy" decoding="async" />
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

/** Public indexable routes. Keep in sync with the Vite HTML inputs (exclude 404). */
export const indexableRoutes = [
  {
    path: '/',
    title: 'Vulcanizare 24/7 Chișinău | Force-Car – Ismail 103',
    changefreq: 'weekly' as const,
  },
  {
    path: '/confidentialitate/',
    title: 'Confidențialitate și cookie-uri | Force-Car',
    changefreq: 'yearly' as const,
  },
];

/** Resolves an HTML entry path to its public URL path. */
export function pagePublicPath(htmlPath: string): string {
  const normalized = htmlPath.replace(/\\/g, '/');
  if (/confidentialitate\/index\.html$/i.test(normalized)) return '/confidentialitate/';
  if (/404\.html$/i.test(normalized)) return '';
  return '/';
}

export function normalizeSiteUrl(raw: string | undefined): string | undefined {
  const value = raw?.trim().replace(/\/+$/, '');
  if (!value) return undefined;
  if (!/^https:\/\/[^\s/]+/i.test(value)) {
    throw new Error(`SITE_URL must be an https:// origin without a path, got "${raw}"`);
  }
  try {
    const url = new URL(value);
    if (url.pathname !== '/' || url.search || url.hash) {
      throw new Error(`SITE_URL must be origin only (no path/query), got "${raw}"`);
    }
    return `${url.protocol}//${url.host}`;
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('SITE_URL')) throw error;
    throw new Error(`SITE_URL is invalid: "${raw}"`);
  }
}

function ldScript(data: unknown): string {
  return `<script type="application/ld+json">\n${JSON.stringify(data, null, 2).replace(/</g, '\\u003c')}\n</script>`;
}

function postalAddress() {
  return {
    '@type': 'PostalAddress',
    streetAddress: business.address.street,
    addressLocality: business.address.city,
    addressCountry: business.address.countryCode,
  };
}

function openingHours24_7() {
  return {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: DAYS.map((day) => `https://schema.org/${day}`),
    opens: '00:00',
    closes: '23:59',
  };
}

/** Homepage JSON-LD: business + website graph. Hours 24/7 apply only to vulcanizare. */
export function structuredData(siteUrl?: string) {
  const address = postalAddress();
  const businessId = siteUrl ? `${siteUrl}/#business` : undefined;
  const websiteId = siteUrl ? `${siteUrl}/#website` : undefined;

  const businessNode: Record<string, unknown> = {
    '@type': 'AutomotiveBusiness',
    ...(businessId ? { '@id': businessId } : {}),
    name: business.name,
    description: `Vulcanizare auto NON-STOP 24/7 în ${business.address.city}, ${business.address.street}. Schimb anvelope, echilibrare, reparare pene și jante.`,
    telephone: business.phone.e164,
    email: business.email.address,
    address,
    hasMap: business.links.maps,
    areaServed: {
      '@type': 'City',
      name: business.address.city,
      containedInPlace: { '@type': 'Country', name: business.address.country },
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: business.phone.e164,
      contactType: 'customer service',
      areaServed: 'MD',
      availableLanguage: ['ro'],
      hoursAvailable: openingHours24_7(),
    },
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
    department: [
      {
        '@type': 'AutomotiveBusiness',
        name: `${business.name} — Vulcanizare NON-STOP`,
        description: 'Vulcanizare auto, disponibilă 24 de ore din 24, 7 zile din 7 — inclusiv noaptea și în weekend.',
        telephone: business.phone.e164,
        address,
        openingHoursSpecification: openingHours24_7(),
      },
      {
        '@type': 'AutoRepair',
        name: `${business.name} — Service auto`,
        description: 'Service auto: diagnosticare computerizată, electrică auto, frâne, suspensie, ulei și reparații motor.',
        address,
        ...(autoService.url ? { url: autoService.url } : {}),
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Service auto',
          itemListElement: autoService.services.map((service) => ({
            '@type': 'Offer',
            itemOffered: { '@type': 'Service', name: service.label },
          })),
        },
      },
    ],
  };

  if (siteUrl) {
    Object.assign(businessNode, {
      url: `${siteUrl}/`,
      image: [
        `${siteUrl}/img/og-forcecar.jpg`,
        ...Object.keys(photos).map((name) => `${siteUrl}/img/${name}-${photos[name as PhotoName].width}.jpg`),
      ],
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/img/forcecar-mark-512.png`,
      },
    });
  }

  if (!siteUrl) return ldScript({ '@context': 'https://schema.org', ...businessNode });

  return ldScript({
    '@context': 'https://schema.org',
    '@graph': [
      businessNode,
      {
        '@type': 'WebSite',
        '@id': websiteId,
        url: `${siteUrl}/`,
        name: business.name,
        description: `Vulcanizare NON-STOP 24/7 și service auto în ${business.address.city}.`,
        inLanguage: 'ro-MD',
        publisher: { '@id': businessId },
      },
      {
        '@type': 'WebPage',
        '@id': `${siteUrl}/#webpage`,
        url: `${siteUrl}/`,
        name: indexableRoutes[0].title,
        isPartOf: { '@id': websiteId },
        about: { '@id': businessId },
        inLanguage: 'ro-MD',
        primaryImageOfPage: { '@type': 'ImageObject', url: `${siteUrl}/img/og-forcecar.jpg` },
      },
    ],
  });
}

/** Privacy page JSON-LD: WebPage + BreadcrumbList. */
export function privacyStructuredData(siteUrl?: string) {
  const crumbs = [
    { name: 'Acasă', path: '/' },
    { name: 'Confidențialitate și cookie-uri', path: '/confidentialitate/' },
  ];
  const breadcrumb = {
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      ...(siteUrl ? { item: `${siteUrl}${crumb.path}` } : {}),
    })),
  };
  const page: Record<string, unknown> = {
    '@type': 'WebPage',
    name: indexableRoutes[1].title,
    description: 'Cum tratează Force-Car datele tale: contact, cookie-uri și drepturile tale.',
    inLanguage: 'ro-MD',
    isPartOf: siteUrl ? { '@id': `${siteUrl}/#website` } : undefined,
    about: siteUrl ? { '@id': `${siteUrl}/#business` } : { '@type': 'Organization', name: business.name },
    breadcrumb,
  };
  if (siteUrl) {
    page['@id'] = `${siteUrl}/confidentialitate/#webpage`;
    page.url = `${siteUrl}/confidentialitate/`;
  }
  return ldScript({ '@context': 'https://schema.org', '@graph': [page, breadcrumb] });
}

const CATEGORY_ORDER: OptionalCategory[] = ['functional', 'analytics', 'marketing'];

function usedCategories(services: ConsentService[]) {
  return CATEGORY_ORDER.filter((category) => services.some((service) => service.category === category));
}

export function renderConsentUi(services: ConsentService[]): string {
  if (services.length === 0) return '';
  const categories = usedCategories(services);

  const categoryRows = categories
    .map((category) => {
      const names = services
        .filter((service) => service.category === category)
        .map((service) => `${escapeHtml(service.name)} (${escapeHtml(service.provider)})`)
        .join(', ');
      return `<li class="consent-cat">
            <div class="consent-cat__copy">
              <h3 class="consent-cat__title" id="consent-${category}-title" data-i18n="consent.${category}">${categoryInfo[category].title}</h3>
              <p class="consent-cat__text" id="consent-${category}-text"><span data-i18n="consent.${category}Text">${escapeHtml(categoryInfo[category].text)}</span> <span class="consent-cat__services">${names}</span></p>
            </div>
            <label class="switch">
              <input type="checkbox" role="switch" data-consent-category="${category}" aria-labelledby="consent-${category}-title" aria-describedby="consent-${category}-text" />
              <span class="switch__track" aria-hidden="true"></span>
            </label>
          </li>`;
    })
    .join('\n');

  return `<section class="consent" data-consent-banner hidden aria-labelledby="consent-title">
      <div class="consent__inner">
        <div class="consent__copy">
          <h2 class="consent__title" id="consent-title" data-i18n="consent.title">Cookie-uri</h2>
          <p class="consent__text"><span data-i18n="consent.text">Folosim cookie-uri opționale doar dacă ești de acord. Le poți refuza fără să pierzi nimic din site. Detalii în </span><a href="/confidentialitate/#cookie-uri" data-i18n="consent.policy">politica de cookie-uri</a>.</p>
        </div>
        <div class="consent__actions">
          <button class="btn btn--sm btn--ghost" type="button" data-consent-action="customize" data-i18n="consent.customize">Personalizează</button>
          <button class="btn btn--sm btn--ghost" type="button" data-consent-action="reject" data-i18n="consent.reject">Respinge opționalele</button>
          <button class="btn btn--sm btn--primary" type="button" data-consent-action="accept" data-i18n="consent.accept">Acceptă toate</button>
        </div>
      </div>
    </section>

    <dialog class="consent-panel" data-consent-panel aria-labelledby="consent-panel-title">
      <div class="consent-panel__body">
      <div class="consent-panel__head">
        <h2 class="consent-panel__title" id="consent-panel-title" data-i18n="consent.panelTitle">Preferințe cookie-uri</h2>
        <button class="icon-btn consent-panel__close" type="button" data-consent-action="close">${icon('close')}<span class="sr-only" data-i18n="consent.close">Închide</span></button>
      </div>
      <p class="consent-panel__intro" data-i18n="consent.intro">Alege ce cookie-uri opționale accepți. Poți reveni oricând din linkul „Setări cookie-uri” din subsolul paginii.</p>
      <ul class="consent-panel__list" role="list">
        <li class="consent-cat">
          <div class="consent-cat__copy">
            <h3 class="consent-cat__title" data-i18n="consent.necessary">${categoryInfo.necessary.title}</h3>
            <p class="consent-cat__text" data-i18n="consent.necessaryText">${escapeHtml(categoryInfo.necessary.text)}</p>
          </div>
          <span class="consent-cat__always" data-i18n="consent.always">Mereu active</span>
        </li>
        ${categoryRows}
      </ul>
      <div class="consent-panel__actions">
        <button class="btn btn--sm btn--ghost" type="button" data-consent-action="reject" data-i18n="consent.reject">Respinge opționalele</button>
        <button class="btn btn--sm btn--ghost" type="button" data-consent-action="save" data-i18n="consent.save">Salvează alegerea</button>
        <button class="btn btn--sm btn--primary" type="button" data-consent-action="accept" data-i18n="consent.accept">Acceptă toate</button>
      </div>
      </div>
    </dialog>`;
}

export function renderFooter(services: ConsentService[]): string {
  const settings =
    services.length > 0
      ? '<li><button class="footer__button" type="button" data-consent-open data-i18n="footer.cookies">Setări cookie-uri</button></li>'
      : '';
  return `<footer class="footer">
      <div class="container footer__inner">
        <p class="footer__brand"><strong>Force-Car</strong> <span aria-hidden="true">|</span><span data-i18n="footer.brand"> Vulcanizare 24/7 · Service auto</span></p>
        <ul class="footer__list" role="list">
          <li><a href="{{phone.href}}">{{phone.display}}</a></li>
          <li><a href="{{links.maps}}" target="_blank" rel="noopener noreferrer"><span data-i18n="address.short">{{address.short}}</span><span class="sr-only" data-i18n="newtab"> (se deschide într-o filă nouă)</span></a></li>
          <li><a href="{{email.href}}">{{email.address}}</a></li>
        </ul>
        <ul class="footer__list footer__legal" role="list">
          <li><a href="/confidentialitate/" data-i18n="footer.privacy">Confidențialitate și cookie-uri</a></li>
          ${settings}
        </ul>
        <p class="footer__copy" data-i18n="footer.copy">© {{year}} Force-Car</p>
      </div>
    </footer>`;
}

export function renderCookieTable(services: ConsentService[]): string {
  if (services.length === 0) {
    return `<p data-i18n="privacy.cookiesNone">Acest site nu folosește cookie-uri și nu salvează informații în browserul tău. Nu folosim instrumente de analiză, publicitate sau module de rețele sociale, iar fonturile și imaginile sunt servite direct de pe acest site, fără servicii terțe.</p>
          <p data-i18n="privacy.cookiesLater">Dacă vom adăuga vreodată astfel de instrumente, le vom porni doar după ce îți dai acordul și vom actualiza această pagină.</p>`;
  }
  const row = (cells: string[]) => `<tr>${cells.map((cell) => `<td>${cell}</td>`).join('')}</tr>`;
  const kind = (value: string) => (value === 'cookie' ? 'Cookie' : 'Stocare locală');
  const rows = [
    row([
      `<code>${necessaryItem.name}</code>`,
      kind(necessaryItem.kind),
      categoryInfo.necessary.title,
      'Force-Car',
      'Reține alegerea ta privind cookie-urile.',
      necessaryItem.retention,
    ]),
    ...services.flatMap((service) =>
      service.items.map((item) =>
        row([
          `<code>${escapeHtml(item.name)}</code>`,
          kind(item.kind),
          categoryInfo[service.category].title,
          `<a href="${escapeHtml(service.privacyUrl)}"${externalAttrs(true)}>${escapeHtml(service.provider)}${NEW_TAB}</a>`,
          `${escapeHtml(service.name)}: ${escapeHtml(service.purpose)}`,
          escapeHtml(item.retention),
        ]),
      ),
    ),
  ].join('\n');

  return `<p>Folosim cookie-uri opționale doar după ce îți dai acordul. Până atunci, scripturile de mai jos nu sunt încărcate deloc.</p>
          <div class="legal__table">
            <table>
              <caption class="sr-only">Cookie-uri și date stocate în browser</caption>
              <thead><tr><th scope="col">Denumire</th><th scope="col">Tip</th><th scope="col">Categorie</th><th scope="col">Furnizor</th><th scope="col">Scop</th><th scope="col">Durată</th></tr></thead>
              <tbody>
${rows}
              </tbody>
            </table>
          </div>
          <p>Îți poți schimba sau retrage acordul oricând: <button class="text-button" type="button" data-consent-open>deschide setările cookie-urilor</button>. La retragere, ștergem cookie-urile de mai sus de pe acest domeniu.</p>`;
}

export function seoHead(siteUrl: string | undefined, path = '/'): string {
  if (!siteUrl || !path) return '';
  const canonical = `${siteUrl}${path}`;
  const image = `${siteUrl}/img/og-forcecar.jpg`;
  const imageAlt = `Force-Car — Vulcanizare NON-STOP 24/7, ${business.address.short}`;
  return [
    `<link rel="canonical" href="${escapeHtml(canonical)}" />`,
    `<meta property="og:url" content="${escapeHtml(canonical)}" />`,
    `<meta property="og:image" content="${escapeHtml(image)}" />`,
    `<meta property="og:image:secure_url" content="${escapeHtml(image)}" />`,
    `<meta property="og:image:type" content="image/jpeg" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${escapeHtml(imageAlt)}" />`,
    `<meta name="twitter:image" content="${escapeHtml(image)}" />`,
    `<meta name="twitter:image:alt" content="${escapeHtml(imageAlt)}" />`,
  ].join('\n    ');
}

export function robotsTxt(siteUrl?: string) {
  const lines = [
    '# Force-Car robots.txt',
    'User-agent: *',
    'Allow: /',
    '',
    '# Public pages and assets are crawlable. 404.html is excluded via meta robots noindex.',
  ];
  if (siteUrl) {
    lines.push('', `Sitemap: ${siteUrl}/sitemap.xml`);
  }
  return `${lines.join('\n')}\n`;
}

export function sitemapXml(siteUrl: string, lastmod = new Date().toISOString().slice(0, 10)) {
  const urls = indexableRoutes
    .map(
      (route) => `  <url>
    <loc>${siteUrl}${route.path}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>`,
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}
