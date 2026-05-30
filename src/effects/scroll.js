import { initRevealObserver, initSectionObserver } from '../lib/reveal.js';
import { initScrollProgress, initNavSpy, initBackToTop } from '../lib/brand-polish.js';
import { initScrollRuntime, onScroll } from '../lib/scroll-runtime.js';

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

function buildOdometer(el) {
  const target = Number.parseInt(el.dataset.target, 10);
  if (!Number.isFinite(target)) return;

  const digits = String(target).split('');
  el.textContent = '';
  el.classList.add('is-odometer');

  digits.forEach((digit, i) => {
    const wrap = document.createElement('span');
    wrap.className = 'odo-digit';

    const col = document.createElement('span');
    col.className = 'odo-col';

    for (let n = 0; n <= 9; n++) {
      const num = document.createElement('span');
      num.textContent = n;
      col.appendChild(num);
    }

    wrap.appendChild(col);
    el.appendChild(wrap);

    // Stagger por coluna — unidades primeiro, depois dezenas, centenas
    requestAnimationFrame(() => {
      setTimeout(() => {
        col.style.transform = `translateY(${-Number(digit)}em)`;
      }, 80 + i * 140);
    });
  });
}

export function initHeroAnimations() {
  const stats = document.querySelectorAll('.stat-number');
  if (!stats.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      buildOdometer(entry.target);
    });
  }, { threshold: 0.65 });

  stats.forEach((el) => observer.observe(el));
}

export function initScrollAnimations() {
  initScrollRuntime();

  const nav = document.getElementById('nav');
  const updateNav = () => {
    nav?.classList.toggle('scrolled', window.scrollY > 80);
  };

  onScroll(updateNav);
  updateNav();

  initScrollProgress();
  initNavSpy();
  initBackToTop();
  initRevealObserver();
  initSectionObserver('.inovacao');
  initSectionObserver('.services-stack', 'in-view');
  initSectionObserver('.journey', 'in-view');
  initSectionObserver('.marquee-section', 'in-view');
  initSectionObserver('.cta-section', 'in-view', 0.12);
  initSectionObserver('.diagnostico-section', 'in-view', 0.12);
  initSectionObserver('#hero', 'in-view');
  initSectionObserver('#sobre', 'in-view');
}
