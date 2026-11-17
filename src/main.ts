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

function initRepair() {
  const scene = document.querySelector<HTMLElement>('[data-repair]');
  const toggle = scene?.querySelector<HTMLButtonElement>('[data-repair-toggle]');
  const label = toggle?.querySelector<HTMLElement>('[data-repair-toggle-label]');
  if (!scene || !toggle || !label || reducedMotion.matches) return;

  scene.classList.add('is-idle');
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => scene.classList.toggle('is-idle', !entry.isIntersecting), {
      threshold: 0.2,
    }).observe(scene);
  } else {
    scene.classList.remove('is-idle');
  }

  toggle.hidden = false;
  toggle.addEventListener('click', () => {
    const paused = scene.classList.toggle('is-paused');
    label.textContent = paused ? 'Pornește animația' : 'Oprește animația';
  });
}

/** Seamless loop: two players crossfade so the clip's black fade-in/out never shows. */
function initLoopVideo(host: HTMLElement) {
  const src = host.dataset.src ?? '';
  const start = Number(host.dataset.start ?? 0);
  const end = Number(host.dataset.end ?? 0);
  const fade = 0.7;
  const players: HTMLVideoElement[] = [];
  let front = 0;
  let inView = false;
  let switching = false;

  const cue = (video: HTMLVideoElement) => {
    if (Math.abs(video.currentTime - start) > 0.05) video.currentTime = start;
  };

  const sync = () => {
    const current = players[front];
    if (!current) return;
    if (inView && !document.hidden) current.play().catch(() => undefined);
    else current.pause();
  };

  const crossfade = () => {
    const current = players[front];
    const next = players[1 - front];
    if (!next || next.readyState < 2) {
      current.currentTime = start;
      return;
    }
    switching = true;
    next.play().catch(() => undefined);
    next.classList.add('is-front');
    current.classList.remove('is-front');
    front = 1 - front;

    let settled = false;
    const settle = () => {
      if (settled) return;
      settled = true;
      current.pause();
      cue(current);
      switching = false;
    };
    current.addEventListener('transitionend', settle, { once: true });
    window.setTimeout(settle, fade * 2000);
  };

  const addPlayer = () => {
    const video = document.createElement('video');
    video.muted = true;
    video.playsInline = true;
    video.preload = 'auto';
    video.tabIndex = -1;
    video.addEventListener('loadedmetadata', () => cue(video), { once: true });
    video.addEventListener('timeupdate', () => {
      if (video === players[front] && !switching && video.currentTime >= end - fade) crossfade();
    });
    video.src = src;
    host.append(video);
    players.push(video);
    return video;
  };

  const setup = () => {
    const first = addPlayer();
    first.addEventListener('playing', () => first.classList.add('is-front'), { once: true });
    first.addEventListener('canplaythrough', () => addPlayer(), { once: true });
    sync();
  };

  document.addEventListener('visibilitychange', sync);
  const preload = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return;
      preload.disconnect();
      setup();
    },
    { rootMargin: '300px 0px' },
  );
  preload.observe(host);
  new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    sync();
  }).observe(host);
}

function initLoopVideos() {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  if (reducedMotion.matches || connection?.saveData || !('IntersectionObserver' in window)) return;
  document.querySelectorAll<HTMLElement>('[data-loop-video]').forEach(initLoopVideo);
}

initNav();
initReveal();
initClock();
initHeroVideo();
initRepair();
initLoopVideos();
