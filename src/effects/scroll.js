import { initRevealObserver, initSectionObserver } from '../lib/reveal.js';
import { initScrollProgress, initNavSpy } from '../lib/brand-polish.js';

export function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

export function initLoader(onComplete) {
  const loader = document.getElementById('loader');

  const finish = () => {
    loader?.classList.add('hidden');
    document.body.classList.add('is-ready');
    onComplete();
  };

  if (document.readyState === 'complete') {
    window.setTimeout(finish, 900);
    return;
  }

  window.addEventListener('load', () => window.setTimeout(finish, 900), { once: true });
}

export function initHeroAnimations() {
  document.querySelectorAll('.stat-number').forEach((el) => {
    const target = Number.parseInt(el.dataset.target, 10);
    if (!Number.isFinite(target)) return;

    window.setTimeout(() => {
      const start = performance.now();
      const duration = 1400;

      const tick = (now) => {
        const progress = Math.min(1, (now - start) / duration);
        const eased = 1 - (1 - progress) ** 3;
        el.textContent = String(Math.round(target * eased));
        if (progress < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
    }, 900);
  });
}

export function initScrollAnimations() {
  const nav = document.getElementById('nav');
  let ticking = false;

  const updateNav = () => {
    nav?.classList.toggle('scrolled', window.scrollY > 80);
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(updateNav);
    }
  }, { passive: true });

  updateNav();
  initScrollProgress();
  initNavSpy();
  initRevealObserver();
  initSectionObserver('.inovacao');
  initSectionObserver('.services-stack', 'in-view');
  initSectionObserver('.journey', 'in-view');
}
