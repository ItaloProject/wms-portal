import { canUseRichMotion } from './perf.js';
import { onScroll } from './scroll-runtime.js';

export function initHeroLogo() {
  const stage = document.querySelector('.hero-logo-stage');
  const hero = document.getElementById('hero');
  const reveal = stage?.querySelector('.hero-logo-reveal');
  if (!stage || !hero) return;

  const richMotion = canUseRichMotion();

  const update = () => {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const scrollFactor = isMobile ? 0.75 : 0.55;
    const scrollSpan = Math.max(hero.offsetHeight * scrollFactor, 1);
    const rect = hero.getBoundingClientRect();
    const navOffset = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 80;
    const scrolled = Math.max(0, window.scrollY - hero.offsetTop + navOffset * 0.35);
    const rectProgress = Math.max(0, -rect.top / scrollSpan);
    const scrollProgress = scrolled / scrollSpan;
    const progress = Math.min(1, Math.max(rectProgress, scrollProgress));

    stage.style.setProperty('--logo-progress', progress.toFixed(3));
    reveal?.classList.toggle('is-alive', progress >= 0.45);
  };

  onScroll(update);
  window.addEventListener('resize', update, { passive: true });
  window.addEventListener('load', update, { once: true });

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
