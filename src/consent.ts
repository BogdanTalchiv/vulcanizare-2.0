import {
  CONSENT_MAX_AGE_DAYS,
  CONSENT_STORAGE_KEY,
  consentRevision,
  consentServices,
  readConsentEnv,
  type ConsentService,
  type OptionalCategory,
} from './data/consent.ts';

type Choices = Record<OptionalCategory, boolean>;

interface StoredConsent {
  revision: string;
  savedAt: number;
  choices: Choices;
}

type Tracker = ((...args: unknown[]) => void) & Record<string, unknown>;
type TrackerWindow = Window & { dataLayer?: unknown[]; gtag?: Tracker; fbq?: Tracker; _fbq?: Tracker };

const env = readConsentEnv({
  VITE_GA4_ID: import.meta.env.VITE_GA4_ID,
  VITE_META_PIXEL_ID: import.meta.env.VITE_META_PIXEL_ID,
});
const services = consentServices(env);
const revision = consentRevision(services);
const win = window as TrackerWindow;
const loaded = new Set<ConsentService['id']>();

const none = (): Choices => ({ functional: false, analytics: false, marketing: false });

function readStored(): StoredConsent | null {
  try {
    const stored = JSON.parse(localStorage.getItem(CONSENT_STORAGE_KEY) ?? 'null') as StoredConsent | null;
    if (!stored || stored.revision !== revision || typeof stored.choices !== 'object') return null;
    if (Date.now() - stored.savedAt > CONSENT_MAX_AGE_DAYS * 86_400_000) return null;
    return stored;
  } catch {
    return null;
  }
}

function writeStored(choices: Choices) {
  try {
    const value: StoredConsent = { revision, savedAt: Date.now(), choices };
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(value));
  } catch {
    // Storage can be blocked (private mode); the choice still applies to this visit.
  }
}

function injectScript(src: string) {
  const script = document.createElement('script');
  script.async = true;
  script.src = src;
  document.head.append(script);
}

function loadGa4(id: string) {
  win.dataLayer = win.dataLayer ?? [];
  // gtag.js only processes the `arguments` object, not a plain array.
  const gtag = function () {
    win.dataLayer!.push(arguments);
  } as Tracker;
  win.gtag = gtag;
  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'granted',
  });
  gtag('js', new Date());
  gtag('config', id);
  injectScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`);
}

function loadMetaPixel(id: string) {
  const fbq = function (...args: unknown[]) {
    if (typeof fbq.callMethod === 'function') (fbq.callMethod as Tracker)(...args);
    else (fbq.queue as unknown[][]).push(args);
  } as Tracker;
  Object.assign(fbq, { push: fbq, loaded: true, version: '2.0', queue: [] });
  win.fbq = win._fbq = fbq;
  fbq('consent', 'grant');
  fbq('init', id);
  fbq('track', 'PageView');
  injectScript('https://connect.facebook.net/en_US/fbevents.js');
}

function deleteCookie(name: string) {
  const parts = location.hostname.split('.');
  const domains = [''];
  for (let i = 0; i < parts.length - 1; i += 1) domains.push(`; domain=.${parts.slice(i).join('.')}`);
  for (const domain of domains) document.cookie = `${name}=; Max-Age=0; path=/${domain}`;
}

function revoke(service: ConsentService) {
  if (service.id === 'ga4') win.gtag?.('consent', 'update', { analytics_storage: 'denied' });
  if (service.id === 'meta-pixel') win.fbq?.('consent', 'revoke');
  const prefixes = service.items.map((item) => item.name);
  document.cookie
    .split(';')
    .map((entry) => entry.split('=')[0].trim())
    .filter((name) => prefixes.some((prefix) => name === prefix || (prefix === '_ga' && name.startsWith('_ga_'))))
    .forEach(deleteCookie);
}

function apply(choices: Choices) {
  for (const service of services) {
    const granted = choices[service.category];
    if (granted && !loaded.has(service.id)) {
      loaded.add(service.id);
      if (service.id === 'ga4' && env.ga4Id) loadGa4(env.ga4Id);
      if (service.id === 'meta-pixel' && env.metaPixelId) loadMetaPixel(env.metaPixelId);
    } else if (granted && service.id === 'ga4') {
      win.gtag?.('consent', 'update', { analytics_storage: 'granted' });
    } else if (granted && service.id === 'meta-pixel') {
      win.fbq?.('consent', 'grant');
    } else if (!granted) {
      revoke(service);
    }
  }
}

export function initConsent() {
  if (services.length === 0) return;
  const banner = document.querySelector<HTMLElement>('[data-consent-banner]');
  const panel = document.querySelector<HTMLDialogElement>('[data-consent-panel]');
  if (!banner || !panel) return;

  const switches = [...panel.querySelectorAll<HTMLInputElement>('[data-consent-category]')];
  let current = readStored()?.choices ?? null;
  let opener: HTMLElement | null = null;
  let awaitingDecision = !current;

  const showBanner = () => {
    if (!awaitingDecision) return;
    banner.hidden = false;
    requestAnimationFrame(() => requestAnimationFrame(() => banner.classList.add('is-visible')));
  };

  const hideBanner = () => {
    if (banner.hidden) return;
    banner.classList.remove('is-visible');
    const done = () => {
      banner.hidden = true;
    };
    banner.addEventListener('transitionend', done, { once: true });
    window.setTimeout(done, 600);
  };

  const openPanel = (from?: HTMLElement | null) => {
    opener = from ?? null;
    const choices = current ?? none();
    for (const input of switches) input.checked = choices[input.dataset.consentCategory as OptionalCategory];
    hideBanner();
    if (!panel.open) panel.showModal();
  };

  const decide = (choices: Choices) => {
    awaitingDecision = false;
    current = choices;
    writeStored(choices);
    apply(choices);
    hideBanner();
    if (panel.open) panel.close();
  };

  const fromSwitches = (): Choices => {
    const choices = none();
    for (const input of switches) choices[input.dataset.consentCategory as OptionalCategory] = input.checked;
    return choices;
  };

  document.addEventListener('click', (event) => {
    const target = event.target as Element | null;
    const openTrigger = target?.closest<HTMLElement>('[data-consent-open]');
    if (openTrigger) {
      openPanel(openTrigger);
      return;
    }
    const actionEl = target?.closest<HTMLElement>('[data-consent-action]');
    const action = actionEl?.dataset.consentAction;
    if (action === 'accept') decide({ functional: true, analytics: true, marketing: true });
    else if (action === 'reject') decide(none());
    else if (action === 'save') decide(fromSwitches());
    else if (action === 'customize') openPanel(actionEl);
    else if (action === 'close') panel.close();
  });

  panel.addEventListener('click', (event) => {
    if (event.target === panel) panel.close();
  });

  panel.addEventListener('close', () => {
    if (awaitingDecision) showBanner();
    const restore = opener;
    opener = null;
    if (restore && document.contains(restore)) restore.focus();
  });

  if (current) apply(current);
  else showBanner();
}
