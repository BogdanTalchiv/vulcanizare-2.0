/**
 * Consent registry. Optional services exist only when their ID is configured
 * (VITE_GA4_ID, VITE_META_PIXEL_ID); with none configured the site sets no cookies,
 * so no banner is rendered and the privacy page says so.
 */

export type OptionalCategory = 'functional' | 'analytics' | 'marketing';

export interface StoredItem {
  name: string;
  kind: 'cookie' | 'localStorage';
  retention: string;
}

export interface ConsentService {
  id: 'ga4' | 'meta-pixel';
  category: OptionalCategory;
  name: string;
  provider: string;
  purpose: string;
  privacyUrl: string;
  items: StoredItem[];
}

export interface ConsentEnv {
  ga4Id?: string;
  metaPixelId?: string;
}

export const CONSENT_STORAGE_KEY = 'forcecar-consent';
export const CONSENT_MAX_AGE_DAYS = 180;

export const categoryInfo: Record<'necessary' | OptionalCategory, { title: string; text: string }> = {
  necessary: {
    title: 'Strict necesare',
    text: 'Păstrează alegerea ta privind cookie-urile. Sunt mereu active, fiindcă fără ele site-ul nu își poate aminti decizia.',
  },
  functional: {
    title: 'Funcționale',
    text: 'Rețin preferințe care îmbunătățesc experiența pe site.',
  },
  analytics: {
    title: 'Analiză',
    text: 'Ne arată cum este folosit site-ul (pagini vizitate, durata vizitei), ca să îl putem îmbunătăți.',
  },
  marketing: {
    title: 'Marketing',
    text: 'Măsoară eficiența reclamelor noastre și pot fi folosite pentru reclame relevante pe alte platforme.',
  },
};

export const necessaryItem: StoredItem = {
  name: CONSENT_STORAGE_KEY,
  kind: 'localStorage',
  retention: `${CONSENT_MAX_AGE_DAYS} de zile`,
};

export function readConsentEnv(env: Record<string, string | undefined>): ConsentEnv {
  const ga4Id = env.VITE_GA4_ID?.trim() || undefined;
  const metaPixelId = env.VITE_META_PIXEL_ID?.trim() || undefined;
  if (ga4Id && !/^G-[A-Z0-9]{4,}$/.test(ga4Id)) throw new Error(`VITE_GA4_ID must look like G-XXXXXXX, got "${ga4Id}"`);
  if (metaPixelId && !/^\d{6,20}$/.test(metaPixelId)) {
    throw new Error(`VITE_META_PIXEL_ID must be numeric, got "${metaPixelId}"`);
  }
  return { ga4Id, metaPixelId };
}

export function consentServices({ ga4Id, metaPixelId }: ConsentEnv): ConsentService[] {
  const services: ConsentService[] = [];
  if (ga4Id) {
    services.push({
      id: 'ga4',
      category: 'analytics',
      name: 'Google Analytics 4',
      provider: 'Google Ireland Limited',
      purpose: 'Statistici despre vizite și paginile consultate.',
      privacyUrl: 'https://policies.google.com/privacy',
      items: [
        { name: '_ga', kind: 'cookie', retention: '2 ani' },
        { name: `_ga_${ga4Id.slice(2)}`, kind: 'cookie', retention: '2 ani' },
      ],
    });
  }
  if (metaPixelId) {
    services.push({
      id: 'meta-pixel',
      category: 'marketing',
      name: 'Meta Pixel',
      provider: 'Meta Platforms Ireland Limited',
      purpose: 'Măsurarea reclamelor de pe Facebook și Instagram.',
      privacyUrl: 'https://www.facebook.com/privacy/policy/',
      items: [{ name: '_fbp', kind: 'cookie', retention: '3 luni' }],
    });
  }
  return services;
}

/** Changes whenever the set of services changes, so earlier choices are asked again. */
export function consentRevision(services: ConsentService[]) {
  return services.map((service) => service.id).join('+');
}
