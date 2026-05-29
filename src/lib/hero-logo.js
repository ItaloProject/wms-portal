import { canUseRichMotion } from './perf.js';

export function initHeroLogo() {
  const stage = document.querySelector('.hero-logo-stage');
  const hero = document.getElementById('hero');
  const reveal = stage?.querySelector('.hero-logo-reveal');
  if (!stage || !hero) return;

  let heroVisible = true;
  let ticking = false;
  const richMotion = canUseRichMotion();

  const update = () => {
    const rect = hero.getBoundingClientRect();
    const scrollSpan = Math.max(hero.offsetHeight * 0.5, 1);
    const progress = Math.min(1, Math.max(0, -rect.top / scrollSpan));
    stage.style.setProperty('--logo-progress', progress.toFixed(3));
    reveal?.classList.toggle('is-alive', progress >= 0.72);
  };

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      heroVisible = entry.isIntersecting;
      if (heroVisible) update();
    }, { threshold: 0 }).observe(hero);
  }

  window.addEventListener('scroll', () => {
    if (!heroVisible || ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      update();
      ticking = false;
    });
  }, { passive: true });

  if (richMotion) {
    let parallaxFrame = 0;
    let targetX = 0;
    let targetY = 0;

    window.addEventListener('mousemove', (e) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * 14;
      targetY = (e.clientY / window.innerHeight - 0.5) * 10;
      if (!parallaxFrame) {
        parallaxFrame = requestAnimationFrame(() => {
          stage.style.setProperty('--logo-shift-x', `${targetX.toFixed(2)}px`);
          stage.style.setProperty('--logo-shift-y', `${targetY.toFixed(2)}px`);
          stage.style.setProperty('--logo-tilt-y', `${(targetX * 0.35).toFixed(2)}deg`);
          stage.style.setProperty('--logo-tilt-x', `${(-targetY * 0.28).toFixed(2)}deg`);
          parallaxFrame = 0;
        });
      }
    }, { passive: true });
  }

  update();
}
