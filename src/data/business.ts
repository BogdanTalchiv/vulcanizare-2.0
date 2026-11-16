export const business = {
  name: 'ForceCar',
  service: 'Vulcanizare Auto NON-STOP 24/7',
  phone: {
    countryCode: '+373',
    local: '79 535 005',
    display: '+373 79 535 005',
    e164: '+37379535005',
    href: 'tel:+37379535005',
  },
  email: {
    address: 'force-car@nxt.ru',
    href: 'mailto:force-car@nxt.ru',
  },
  address: {
    street: 'str. Ismail 103',
    city: 'Chișinău',
    country: 'Republica Moldova',
    countryCode: 'MD',
    full: 'str. Ismail 103, Chișinău, Republica Moldova',
    short: 'str. Ismail 103, Chișinău',
  },
  links: {
    maps: 'https://www.google.com/maps/search/?api=1&query=ForceCar%2C%20str.%20Ismail%20103%2C%20Chi%C8%99in%C4%83u',
    whatsapp:
      'https://wa.me/37379535005?text=Bun%C4%83%20ziua!%20V%C4%83%20scriu%20de%20pe%20site-ul%20ForceCar.%20A%C8%99%20dori%20s%C4%83%20m%C4%83%20programez%20la%20service.',
  },
  hours: {
    label: 'Vulcanizare NON-STOP 24/7',
    timeZone: 'Europe/Chisinau',
  },
} as const;

export type IconName = 'puncture' | 'tire' | 'balance' | 'gauge' | 'stack' | 'rim' | 'phone' | 'pin' | 'chat' | 'clock';

export interface ServiceItem {
  title: string;
  text: string;
  icon: IconName;
  /** Only confirmed services are published on the site. */
  confirmed: boolean;
}

/**
 * Tire-service offering. Confirmed items match the workshop signage
 * ("Schimbare roți • Echilibrare • Presiune cu azot", "Stoc") and photos.
 * Set `confirmed: true` only for services the business has confirmed.
 */
export const proposedServices: ServiceItem[] = [
  {
    title: 'Schimb anvelope',
    text: 'Montare și demontare anvelope, schimbarea roților.',
    icon: 'tire',
    confirmed: true,
  },
  {
    title: 'Echilibrare roți',
    text: 'Echilibrarea roților pe stand, în atelier.',
    icon: 'balance',
    confirmed: true,
  },
  {
    title: 'Presiune cu azot',
    text: 'Umflarea anvelopelor cu azot și controlul presiunii.',
    icon: 'gauge',
    confirmed: true,
  },
  {
    title: 'Anvelope pe stoc',
    text: 'Anvelope noi disponibile direct la atelier.',
    icon: 'stack',
    confirmed: true,
  },
  {
    title: 'Reparare pene',
    text: 'Reparații pentru anvelope perforate, atunci când acestea pot fi reparate în siguranță.',
    icon: 'puncture',
    confirmed: true,
  },
  {
    title: 'Reparare jante',
    text: 'Îndreptarea și sudura jantelor, în atelier.',
    icon: 'rim',
    confirmed: true,
  },
];

export interface CardAction {
  href: string;
  label: string;
  external?: boolean;
}

export interface VisitStep {
  title: string;
  text: string;
  icon: IconName;
  action?: CardAction;
}

/** Verified-only fallback content: how to reach the non-stop vulcanization service. */
export const visitSteps: VisitStep[] = [
  {
    title: 'Vulcanizare auto',
    text: 'Disponibilă 24 de ore din 24, 7 zile din 7 — inclusiv noaptea și în weekend.',
    icon: 'clock',
    action: { href: '#non-stop', label: 'Program non-stop' },
  },
  {
    title: 'Sună înainte',
    text: `Descrie situația la ${business.phone.display.replace(/ /g, '\u00a0')} și află dacă te putem ajuta.`,
    icon: 'phone',
    action: { href: business.phone.href, label: 'Sună acum' },
  },
  {
    title: 'Vino pe Ismail 103',
    text: 'Deschide traseul direct în Google Maps, dintr-o singură atingere.',
    icon: 'pin',
    action: { href: business.links.maps, label: 'Deschide traseul', external: true },
  },
  {
    title: 'Scrie pe WhatsApp',
    text: 'Preferi un mesaj? Trimite-ne detaliile direct de pe telefon.',
    icon: 'chat',
    action: { href: business.links.whatsapp, label: 'Scrie pe WhatsApp', external: true },
  },
];
