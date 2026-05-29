import { onScroll } from './scroll-runtime.js';

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
