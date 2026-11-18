import { business } from './data/business.ts';
import {
  defaultLocale,
  isLocale,
  localeMeta,
  locales,
  LOCALE_STORAGE_KEY,
  t,
  type Locale,
} from './data/i18n.ts';

/** First visit always Romanian — never auto-detect from the phone/browser language. */
export function readStoredLocale(): Locale {
  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (isLocale(stored)) return stored;
  } catch {
    // private mode
  }
  return defaultLocale;
}

export function writeStoredLocale(locale: Locale) {
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    // ignore
  }
}

function waHref(locale: Locale) {
  const text = encodeURIComponent(t(locale, 'wa.message'));
  return `https://wa.me/37379535005?text=${text}`;
}

function setMeta(selector: string, content: string, attr = 'content') {
  document.querySelectorAll(selector).forEach((el) => el.setAttribute(attr, content));
}

function applyDocumentMeta(locale: Locale) {
  const meta = localeMeta[locale];
  document.documentElement.lang = meta.htmlLang;

  const isPrivacy = location.pathname.includes('/confidentialitate');
  const is404 = /404\.html$/i.test(location.pathname) || document.body.classList.contains('notfound');

  if (is404) {
    document.title = t(locale, 'meta.404Title');
    setMeta('meta[name="description"]', t(locale, 'meta.404Description'));
    return;
  }

  if (isPrivacy) {
    document.title = t(locale, 'meta.privacyTitle');
    setMeta('meta[name="description"]', t(locale, 'meta.privacyDescription'));
    setMeta('meta[property="og:title"]', t(locale, 'meta.privacyTitle'));
    setMeta('meta[property="og:description"]', t(locale, 'meta.privacyDescription'));
    setMeta('meta[name="twitter:title"]', t(locale, 'meta.privacyTitle'));
    setMeta('meta[name="twitter:description"]', t(locale, 'meta.privacyDescription'));
  } else {
    document.title = t(locale, 'meta.title');
    setMeta('meta[name="description"]', t(locale, 'meta.description'));
    setMeta('meta[property="og:title"]', t(locale, 'meta.title'));
    setMeta('meta[property="og:description"]', t(locale, 'meta.ogDescription'));
    setMeta('meta[name="twitter:title"]', t(locale, 'meta.title'));
    setMeta('meta[name="twitter:description"]', t(locale, 'meta.ogDescription'));
  }

  setMeta('meta[property="og:locale"]', meta.ogLocale);
  setMeta('meta[name="geo.placename"]', t(locale, 'address.city'));
}

function fill(el: Element, value: string) {
  if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
    el.value = value;
    return;
  }
  if (el instanceof HTMLMetaElement) {
    el.content = value;
    return;
  }
  if (el instanceof HTMLImageElement && el.hasAttribute('data-i18n-alt')) {
    el.alt = value;
    return;
  }
  el.textContent = value;
}

export function applyTranslations(locale: Locale) {
  const year = String(new Date().getFullYear());
  const vars = {
    name: business.name,
    address: t(locale, 'address.full'),
    email: business.email.address,
    phone: business.phone.display,
    year,
  };

  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n;
    if (!key) return;
    fill(el, t(locale, key, vars));
  });

  document.querySelectorAll<HTMLElement>('[data-i18n-html]').forEach((el) => {
    const key = el.dataset.i18nHtml;
    if (!key) return;
    el.innerHTML = t(locale, key, vars);
  });

  document.querySelectorAll<HTMLElement>('[data-i18n-aria]').forEach((el) => {
    const key = el.dataset.i18nAria;
    if (!key) return;
    el.setAttribute('aria-label', t(locale, key, vars));
  });

  document.querySelectorAll<HTMLElement>('[data-i18n-title]').forEach((el) => {
    const key = el.dataset.i18nTitle;
    if (!key) return;
    el.setAttribute('title', t(locale, key, vars));
  });

  document.querySelectorAll<HTMLImageElement>('[data-i18n-alt]').forEach((el) => {
    const key = el.dataset.i18nAlt;
    if (!key) return;
    el.alt = t(locale, key);
  });

  const wa = waHref(locale);
  document.querySelectorAll<HTMLAnchorElement>('a[data-i18n-wa]').forEach((el) => {
    el.href = wa;
  });

  applyDocumentMeta(locale);

  document.querySelectorAll<HTMLElement>('[data-lang]').forEach((btn) => {
    const active = btn.dataset.lang === locale;
    btn.classList.toggle('is-active', active);
    btn.setAttribute('aria-pressed', String(active));
  });

  document.documentElement.dataset.locale = locale;
  window.dispatchEvent(new CustomEvent('forcecar:locale', { detail: { locale } }));
  fitLocaleHeadings();
}

function fitTitle(el: HTMLElement) {
  el.style.fontSize = '';
  const available = el.clientWidth;
  if (available < 8) return;

  const lines = el.querySelectorAll('.line');
  let widest = 0;

  if (lines.length) {
    const probe = document.createElement('span');
    probe.setAttribute('aria-hidden', 'true');
    probe.style.cssText =
      'position:absolute;left:0;top:0;white-space:nowrap;visibility:hidden;pointer-events:none;font:inherit;letter-spacing:inherit;text-transform:inherit';
    el.append(probe);
    lines.forEach((line) => {
      probe.textContent = line.textContent;
      widest = Math.max(widest, probe.getBoundingClientRect().width);
    });
    probe.remove();
  } else {
    widest = el.scrollWidth;
  }

  if (widest > available) {
    const current = parseFloat(getComputedStyle(el).fontSize);
    el.style.fontSize = `${((current * available) / widest) * 0.98}px`;
  }
}

function fitLocaleHeadings() {
  const run = () => {
    document
      .querySelectorAll<HTMLElement>('.hero__title, .display.section-title, .legal__title')
      .forEach(fitTitle);
  };
  run();
  requestAnimationFrame(run);
}

export function initI18n() {
  let locale = readStoredLocale();
  applyTranslations(locale);

  document.addEventListener('click', (event) => {
    const btn = (event.target as Element | null)?.closest<HTMLElement>('[data-lang]');
    if (!btn?.dataset.lang || !isLocale(btn.dataset.lang)) return;
    event.preventDefault();
    locale = btn.dataset.lang;
    writeStoredLocale(locale);
    applyTranslations(locale);
  });

  let resizeTimer = 0;
  window.addEventListener('resize', () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(fitLocaleHeadings, 80);
  });
  void document.fonts?.ready.then(fitLocaleHeadings);
}

export function currentLocale(): Locale {
  return isLocale(document.documentElement.dataset.locale) ? document.documentElement.dataset.locale : defaultLocale;
}

export function translate(key: string, vars?: Record<string, string>) {
  return t(currentLocale(), key, vars);
}

export { locales, localeMeta };
