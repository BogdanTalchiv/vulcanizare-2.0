import './styles/fonts.css';
import './styles/main.css';
import { initI18n } from './i18n.ts';

document.documentElement.classList.replace('no-js', 'js');
initI18n();
if (import.meta.env.VITE_GA4_ID || import.meta.env.VITE_META_PIXEL_ID) {
  void import('./consent.ts').then(({ initConsent }) => initConsent());
}
