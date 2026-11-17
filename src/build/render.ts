import { autoService, business, proposedServices, visitSteps, type CardAction } from '../data/business.ts';
import { categoryInfo, necessaryItem, type ConsentService, type OptionalCategory } from '../data/consent.ts';
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

export function renderAutoService(): { list: string; cta: string } {
  const list = autoService.services
    .map((service, index) => `<li data-reveal style="--i:${index}">${escapeHtml(service)}</li>`)
    .join('\n');

  const url = autoService.url.trim();
  if (!url) {
    return {
      list,
      cta: `<span class="btn btn--xl autoservice__cta is-pending" role="text" aria-disabled="true">
                <span class="btn__icon" aria-hidden="true">${icon('arrow')}</span>
                <span class="btn__stack"><span class="btn__label">Site-ul service-ului</span><span class="btn__meta">În curând</span></span>
              </span>`,
    };
  }
  if (!/^https?:\/\//.test(url)) throw new Error(`autoService.url must start with https://, got "${url}"`);

  return {
    list,
    cta: `<a class="btn btn--primary btn--xl autoservice__cta" href="${escapeHtml(url)}"${externalAttrs(true)}>
                <span class="btn__icon">${icon('arrow')}</span>
                <span class="btn__stack"><span class="btn__label">Vezi site-ul service-ului</span><span class="btn__meta">${escapeHtml(new URL(url).hostname.replace(/^www\./, ''))}</span></span>
                ${NEW_TAB}
              </a>`,
  };
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

/** Public indexable routes. Keep in sync with the Vite HTML inputs (exclude 404). */
export const indexableRoutes = [
  {
    path: '/',
    title: 'Vulcanizare 24/7 Chișinău | ForceCar – Ismail 103',
    changefreq: 'weekly' as const,
  },
  {
    path: '/confidentialitate/',
    title: 'Confidențialitate și cookie-uri | ForceCar',
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
          itemListElement: autoService.services.map((name) => ({
            '@type': 'Offer',
            itemOffered: { '@type': 'Service', name },
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
    description: 'Cum tratează ForceCar datele tale: contact, cookie-uri și drepturile tale.',
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
  const purposes = categories.map((category) => categoryInfo[category].title.toLowerCase()).join(' și ');

  const rows = categories
    .map((category) => {
      const names = services
        .filter((service) => service.category === category)
        .map((service) => `${escapeHtml(service.name)} (${escapeHtml(service.provider)})`)
        .join(', ');
      return `<li class="consent-cat">
            <div class="consent-cat__copy">
              <h3 class="consent-cat__title" id="consent-${category}-title">${categoryInfo[category].title}</h3>
              <p class="consent-cat__text" id="consent-${category}-text">${escapeHtml(categoryInfo[category].text)} <span class="consent-cat__services">${names}</span></p>
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
          <h2 class="consent__title" id="consent-title">Cookie-uri</h2>
          <p class="consent__text">Folosim cookie-uri de ${purposes} doar dacă ești de acord. Le poți refuza fără să pierzi nimic din site. Detalii în <a href="/confidentialitate/#cookie-uri">politica de cookie-uri</a>.</p>
        </div>
        <div class="consent__actions">
          <button class="btn btn--sm btn--ghost" type="button" data-consent-action="customize">Personalizează</button>
          <button class="btn btn--sm btn--ghost" type="button" data-consent-action="reject">Respinge opționalele</button>
          <button class="btn btn--sm btn--primary" type="button" data-consent-action="accept">Acceptă toate</button>
        </div>
      </div>
    </section>

    <dialog class="consent-panel" data-consent-panel aria-labelledby="consent-panel-title">
      <div class="consent-panel__body">
      <div class="consent-panel__head">
        <h2 class="consent-panel__title" id="consent-panel-title">Preferințe cookie-uri</h2>
        <button class="icon-btn consent-panel__close" type="button" data-consent-action="close">${icon('close')}<span class="sr-only">Închide</span></button>
      </div>
      <p class="consent-panel__intro">Alege ce cookie-uri opționale accepți. Poți reveni oricând din linkul „Setări cookie-uri” din subsolul paginii.</p>
      <ul class="consent-panel__list" role="list">
        <li class="consent-cat">
          <div class="consent-cat__copy">
            <h3 class="consent-cat__title">${categoryInfo.necessary.title}</h3>
            <p class="consent-cat__text">${escapeHtml(categoryInfo.necessary.text)}</p>
          </div>
          <span class="consent-cat__always">Mereu active</span>
        </li>
        ${rows}
      </ul>
      <div class="consent-panel__actions">
        <button class="btn btn--sm btn--ghost" type="button" data-consent-action="reject">Respinge opționalele</button>
        <button class="btn btn--sm btn--ghost" type="button" data-consent-action="save">Salvează alegerea</button>
        <button class="btn btn--sm btn--primary" type="button" data-consent-action="accept">Acceptă toate</button>
      </div>
      </div>
    </dialog>`;
}

export function renderFooter(services: ConsentService[]): string {
  const settings =
    services.length > 0
      ? '<li><button class="footer__button" type="button" data-consent-open>Setări cookie-uri</button></li>'
      : '';
  return `<footer class="footer">
      <div class="container footer__inner">
        <p class="footer__brand"><strong>ForceCar</strong> <span aria-hidden="true">|</span> Vulcanizare 24/7 · Service auto</p>
        <ul class="footer__list" role="list">
          <li><a href="{{phone.href}}">{{phone.display}}</a></li>
          <li><a href="{{links.maps}}" target="_blank" rel="noopener noreferrer">{{address.short}}{{newtab}}</a></li>
          <li><a href="{{email.href}}">{{email.address}}</a></li>
        </ul>
        <ul class="footer__list footer__legal" role="list">
          <li><a href="/confidentialitate/">Confidențialitate și cookie-uri</a></li>
          ${settings}
        </ul>
        <p class="footer__copy">© {{year}} ForceCar</p>
      </div>
    </footer>`;
}

export function renderCookieTable(services: ConsentService[]): string {
  if (services.length === 0) {
    return `<p>Acest site <strong>nu folosește cookie-uri</strong> și nu salvează informații în browserul tău. Nu folosim instrumente de analiză, publicitate sau module de rețele sociale, iar fonturile și imaginile sunt servite direct de pe acest site, fără servicii terțe.</p>
          <p>Dacă vom adăuga vreodată astfel de instrumente, le vom porni doar după ce îți dai acordul și vom actualiza această pagină.</p>`;
  }
  const row = (cells: string[]) => `<tr>${cells.map((cell) => `<td>${cell}</td>`).join('')}</tr>`;
  const kind = (value: string) => (value === 'cookie' ? 'Cookie' : 'Stocare locală');
  const rows = [
    row([
      `<code>${necessaryItem.name}</code>`,
      kind(necessaryItem.kind),
      categoryInfo.necessary.title,
      'ForceCar',
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
  const imageAlt = `ForceCar — Vulcanizare NON-STOP 24/7, ${business.address.short}`;
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
    '# ForceCar robots.txt',
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
