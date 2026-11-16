import './styles/fonts.css';
import './styles/main.css';
import { business } from './data/business.ts';

document.documentElement.classList.replace('no-js', 'js');

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function initNav() {
  const nav = document.querySelector<HTMLElement>('[data-nav]');
  if (!nav) return;
  const sentinel = document.createElement('div');
  sentinel.className = 'nav-sentinel';
  sentinel.setAttribute('aria-hidden', 'true');
  document.body.prepend(sentinel);
  new IntersectionObserver(([entry]) => nav.classList.toggle('is-compact', !entry.isIntersecting)).observe(sentinel);
}

function initReveal() {
  const targets = document.querySelectorAll<HTMLElement>('[data-reveal]');
  if (reducedMotion.matches || !('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('is-in'));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.15 },
  );
  targets.forEach((el) => observer.observe(el));
}

function initClock() {
  const clock = document.querySelector<HTMLTimeElement>('[data-clock]');
  const wrap = document.querySelector<HTMLElement>('[data-clock-wrap]');
  const hand = document.querySelector<SVGGElement>('[data-dial-hand]');
  if (!clock || !wrap || !hand) return;

  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: business.hours.timeZone,
    hour: '2-digit',
    minute: '2-digit',
    weekday: 'short',
    hourCycle: 'h23',
  });
  const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const tick = () => {
    const values = Object.fromEntries(parts.formatToParts(new Date()).map((p) => [p.type, p.value]));
    const hours = Number(values.hour);
    const minutes = Number(values.minute);
    clock.textContent = `${values.hour}:${values.minute}`;
    clock.dateTime = `${values.hour}:${values.minute}`;
    hand.style.setProperty('--angle', `${((hours * 60 + minutes) / 1440) * 360}deg`);
    hand.classList.add('is-set');

    const today = String(weekdays.indexOf(values.weekday) + 1);
    document.querySelectorAll<HTMLElement>('.week [data-day]').forEach((day) => {
      const isToday = day.dataset.day === today;
      day.classList.toggle('is-today', isToday);
      if (isToday) day.setAttribute('aria-current', 'date');
      else day.removeAttribute('aria-current');
    });
  };

  tick();
  wrap.hidden = false;
  window.setInterval(tick, 30_000);
}

function initHeroVideo() {
  const video = document.querySelector<HTMLVideoElement>('[data-hero-video]');
  const toggle = document.querySelector<HTMLButtonElement>('[data-video-toggle]');
  const label = toggle?.querySelector<HTMLElement>('[data-video-toggle-label]');
  if (!video || !toggle || !label) return;

  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  if (connection?.saveData) return;

  const desktop = window.matchMedia('(min-width: 900px)');
  let paused = reducedMotion.matches;
  let inView = true;
  let started = false;

  const source = () => (desktop.matches ? video.dataset.desktop : video.dataset.mobile) ?? '';

  const sync = () => {
    if (!started) return;
    if (paused || !inView || document.hidden) {
      video.pause();
      return;
    }
    if (!video.getAttribute('src')) video.src = source();
    video.play().catch(() => undefined);
  };

  const setPaused = (value: boolean) => {
    paused = value;
    toggle.classList.toggle('is-paused', value);
    label.textContent = value ? 'Pornește videoclipul de fundal' : 'Oprește videoclipul de fundal';
    sync();
  };

  video.addEventListener('playing', () => video.classList.add('is-playing'));
  toggle.addEventListener('click', () => setPaused(!paused));
  document.addEventListener('visibilitychange', sync);
  desktop.addEventListener('change', () => {
    if (!video.getAttribute('src')) return;
    video.classList.remove('is-playing');
    video.src = source();
    sync();
  });
  new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    sync();
  }).observe(video);

  const start = () => {
    started = true;
    toggle.hidden = false;
    setPaused(paused);
  };
  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start, { once: true });
}

initNav();
initReveal();
initClock();
initHeroVideo();
