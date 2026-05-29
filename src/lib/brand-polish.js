import { onScroll } from './scroll-runtime.js';

export function initLocalParallax() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia('(max-width: 768px)').matches) return;

  const main = document.querySelector('.local-photo-main img');
  const secondary = document.querySelector('.local-photo-secondary img');
  const photos = [main, secondary].filter(Boolean);
  if (!photos.length) return;

  const FACTORS = [0.09, 0.055];

  photos.forEach((img) => { img.style.transition = 'none'; });

  const MAX_SHIFT = 36; // px — dentro da margem de scale(1.14)

  const update = () => {
    photos.forEach((img, i) => {
      const rect = img.closest('.local-photo').getBoundingClientRect();
      const offset = (rect.top + rect.height / 2) - window.innerHeight / 2;
      const raw = -offset * FACTORS[i];
      const shift = Math.min(MAX_SHIFT, Math.max(-MAX_SHIFT, raw)).toFixed(2);
      img.style.transform = `scale(1.14) translateY(${shift}px)`;
    });
  };

  onScroll(update);
  update();
}

const NAV_SECTIONS = [
  { id: 'sobre', href: '#sobre' },
  { id: 'local', href: '#local' },
  { id: 'servicos', href: '#servicos' },
  { id: 'inovacao', href: '#inovacao' },
  { id: 'contato', href: '#contato' },
];

export function initScrollProgress() {
  const bar = document.querySelector('.scroll-progress');
  if (!bar) return;

  const update = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
    bar.style.setProperty('--progress', String(Math.min(1, Math.max(0, progress))));
  };

  onScroll(update);
  update();
}

export function initNavSpy() {
  const links = NAV_SECTIONS
    .map(({ href }) => document.querySelector(`.nav-link[href="${href}"]`))
    .filter(Boolean);

  const sections = NAV_SECTIONS
    .map(({ id }) => document.getElementById(id))
    .filter(Boolean);

  if (!links.length || !sections.length) return;

  const setActive = (id) => {
    links.forEach((link) => {
      link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

      if (visible[0]) setActive(visible[0].target.id);
    },
    { rootMargin: '-42% 0px -42% 0px', threshold: [0, 0.15, 0.4] },
  );

  sections.forEach((section) => observer.observe(section));

  if (window.scrollY < 120) setActive(sections[0].id);
}
