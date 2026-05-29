import { getPerfTier } from './perf.js';

export function initHeroEffects() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const tier = getPerfTier();
  const ambientEl = document.querySelector('.ambient-glow');
  const hero = document.getElementById('hero');
  const blobs = tier === 'high' ? hero?.querySelectorAll('.mesh-blob') : null;

  // Estado ambient
  let gcx = innerWidth * 0.6, gcy = innerHeight * 0.3;
  let gtx = gcx, gty = gcy;
  let glowVisible = false;

  // Estado mesh
  const SPEEDS = [52, 34, 76, 28];
  const mesh = blobs ? Array.from(blobs, () => ({ cx: 0, cy: 0, tx: 0, ty: 0 })) : [];

  let running = false;

  const tick = () => {
    let active = false;

    // Ambient glow
    if (ambientEl && glowVisible) {
      gcx += (gtx - gcx) * 0.08;
      gcy += (gty - gcy) * 0.08;
      ambientEl.style.transform =
        `translate3d(calc(${gcx.toFixed(1)}px - 50%),calc(${gcy.toFixed(1)}px - 50%),0)`;
      if (Math.abs(gtx - gcx) > 0.3 || Math.abs(gty - gcy) > 0.3) active = true;
    }

    // Hero mesh blobs
    mesh.forEach((s, i) => {
      s.cx += (s.tx - s.cx) * 0.055;
      s.cy += (s.ty - s.cy) * 0.055;
      blobs[i].style.transform = `translate3d(${s.cx.toFixed(1)}px,${s.cy.toFixed(1)}px,0)`;
      if (Math.abs(s.tx - s.cx) > 0.08 || Math.abs(s.ty - s.cy) > 0.08) active = true;
    });

    if (active) requestAnimationFrame(tick);
    else running = false;
  };

  const start = () => { if (!running) { running = true; requestAnimationFrame(tick); } };

  // Um único listener para ambos os efeitos
  document.addEventListener('mousemove', (e) => {
    gtx = e.clientX;
    gty = e.clientY;

    if (!glowVisible && ambientEl) {
      glowVisible = true;
      ambientEl.classList.add('is-active');
    }

    if (mesh.length && hero) {
      const r = hero.getBoundingClientRect();
      if (e.clientX >= r.left && e.clientX <= r.right &&
          e.clientY >= r.top && e.clientY <= r.bottom) {
        const nx = (e.clientX - r.left - r.width / 2) / r.width;
        const ny = (e.clientY - r.top - r.height / 2) / r.height;
        mesh.forEach((s, i) => { s.tx = nx * SPEEDS[i]; s.ty = ny * SPEEDS[i]; });
      }
    }

    start();
  }, { passive: true });

  document.addEventListener('mouseleave', () => {
    glowVisible = false;
    ambientEl?.classList.remove('is-active');
    running = false;
  });

  hero?.addEventListener('mouseleave', () => {
    mesh.forEach(s => { s.tx = 0; s.ty = 0; });
    start();
  });
}
