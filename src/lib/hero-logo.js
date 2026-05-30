import { canUseRichMotion } from './perf.js';

export function initHeroLogo() {
  const stage = document.querySelector('.hero-logo-stage');
  const hero = document.getElementById('hero');
  const reveal = stage?.querySelector('.hero-logo-reveal');
  if (!stage || !hero) return;

  // Ativa shimmer e float após a animação de reveal CSS completar
  setTimeout(() => reveal?.classList.add('is-alive'), 1500);

  // Parallax com mouse — apenas em dispositivos high-perf
  const richMotion = canUseRichMotion();
  if (!richMotion) return;

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
