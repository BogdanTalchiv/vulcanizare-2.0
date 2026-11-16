import type { IconName } from './business.ts';

type AnyIcon = IconName | 'mail' | 'arrow' | 'route' | 'pause' | 'play';

const paths: Record<AnyIcon, string> = {
  phone:
    '<path d="M5.2 3.8h3.1l1.9 4.9-2.4 1.5a11.4 11.4 0 0 0 6 6l1.5-2.4 4.9 1.9v3.1a1.9 1.9 0 0 1-2 1.9A16.6 16.6 0 0 1 3.3 5.8a1.9 1.9 0 0 1 1.9-2z"/>',
  pin: '<path d="M12 21.2s-6.8-6-6.8-11.6a6.8 6.8 0 0 1 13.6 0c0 5.6-6.8 11.6-6.8 11.6z"/><circle cx="12" cy="9.6" r="2.4"/>',
  chat: '<path d="M3.6 20.4l1.3-4.1a8.4 8.4 0 1 1 3.2 3z"/><path d="M9 9.4c.4 2.2 2.2 4.4 5.6 5.4"/>',
  clock: '<circle cx="12" cy="12" r="8.8"/><path d="M12 7v5.2l3.4 2"/>',
  mail: '<rect x="3.2" y="5.2" width="17.6" height="13.6" rx="1.6"/><path d="m3.8 6.4 8.2 6.2 8.2-6.2"/>',
  arrow: '<path d="M7 17 17 7M9.5 7H17v7.5"/>',
  route: '<path d="M20.5 3.5 3.5 10.8l7 2.7 2.7 7z"/>',
  pause: '<path d="M9 6v12M15 6v12"/>',
  play: '<path d="M8 5.6v12.8L18.4 12z"/>',
  puncture:
    '<circle cx="12" cy="12" r="8.8"/><circle cx="12" cy="12" r="4.4"/><path d="m14.8 9.2 4.6-4.6M17.6 3l3.4 3.4"/>',
  tire: '<circle cx="12" cy="12" r="8.8"/><circle cx="12" cy="12" r="4.4"/><path d="M12 3.2v2.4M12 18.4v2.4M3.2 12h2.4M18.4 12h2.4M5.8 5.8l1.7 1.7M16.5 16.5l1.7 1.7M5.8 18.2l1.7-1.7M16.5 7.5l1.7-1.7"/>',
  balance:
    '<circle cx="12" cy="12" r="8.8"/><circle cx="12" cy="12" r="1.8"/><path d="M10.4 3.4h3.2v2.4h-3.2zM10.4 18.2h3.2v2.4h-3.2z"/>',
  stack:
    '<rect x="4.4" y="3.2" width="15.2" height="5.2" rx="2.6"/><rect x="4.4" y="9.4" width="15.2" height="5.2" rx="2.6"/><rect x="4.4" y="15.6" width="15.2" height="5.2" rx="2.6"/><path d="M8 3.6v4.4M16 9.8v4.4M8 16v4.4"/>',
  rim: '<circle cx="12" cy="12" r="8.8"/><circle cx="12" cy="12" r="2.2"/><path d="M12 9.8V5.6M14.1 11.3l4-1.3M13.3 13.8l2.5 3.4M10.7 13.8l-2.5 3.4M9.9 11.3l-4-1.3"/>',
  gauge: '<path d="M4.4 17.4a8.8 8.8 0 1 1 15.2 0"/><path d="m12 14.2 4.2-5"/><circle cx="12" cy="14.2" r="1.4"/>',
};

export function icon(name: AnyIcon, className = 'icon'): string {
  return `<svg class="${className}" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${paths[name]}</svg>`;
}

export const iconNames = Object.keys(paths) as AnyIcon[];
