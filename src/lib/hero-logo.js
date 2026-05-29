import { canUseRichMotion } from './perf.js';
import { onScroll } from './scroll-runtime.js';

export function initHeroLogo() {
  const stage = document.querySelector('.hero-logo-stage');
  const hero = document.getElementById('hero');
  const reveal = stage?.querySelector('.hero-logo-reveal');
  if (!stage || !hero) return;

  const richMotion = canUseRichMotion();
  const mq = window.matchMedia('(max-width: 768px)');
  let metrics = {
    heroTop: 0,
    scrollSpan: 1,
    startOffset: 0,
  };
  let lastProgress = -1;

  const measure = () => {
    const isMobile = mq.matches;
    const scrollFactor = isMobile ? 0.9 : 0.55;
    const navOffset = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 80;
    metrics = {
      heroTop: hero.offsetTop,
      scrollSpan: Math.max(hero.offsetHeight * scrollFactor, 1),
      startOffset: isMobile ? navOffset * 0.8 : navOffset * 0.35,
    };
  };

  const update = () => {
    const scrolled = Math.max(0, window.scrollY - metrics.heroTop + metrics.startOffset);
    const progress = Math.min(1, scrolled / metrics.scrollSpan);

    if (Math.abs(progress - lastProgress) < 0.01) return;
    lastProgress = progress;

    stage.style.setProperty('--logo-progress', progress.toFixed(3));
    reveal?.classList.toggle('is-alive', progress >= 0.45);
  };

  measure();
  onScroll(update);
  window.addEventListener('resize', () => {
    measure();
    update();
  }, { passive: true });
  window.addEventListener('load', () => {
    measure();
    update();
  }, { once: true });

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
