export function initHeroMesh() {
  const hero = document.getElementById('hero');
  const blobs = hero?.querySelectorAll('.mesh-blob');
  if (!hero || !blobs?.length) return;

  if (window.matchMedia('(pointer: coarse)').matches) return;

  const SPEEDS = [52, 34, 76, 28];
  const LERP = 0.055;
  const state = Array.from(blobs, () => ({ cx: 0, cy: 0, tx: 0, ty: 0 }));
  let frame = 0;
  let running = false;

  const tick = () => {
    let active = false;
    state.forEach((s, i) => {
      s.cx += (s.tx - s.cx) * LERP;
      s.cy += (s.ty - s.cy) * LERP;
      blobs[i].style.transform = `translate3d(${s.cx.toFixed(1)}px,${s.cy.toFixed(1)}px,0)`;
      if (Math.abs(s.tx - s.cx) > 0.08 || Math.abs(s.ty - s.cy) > 0.08) active = true;
    });
    frame = active ? requestAnimationFrame(tick) : 0;
    if (!active) running = false;
  };

  const start = () => { if (!running) { running = true; frame = requestAnimationFrame(tick); } };

  hero.addEventListener('mousemove', (e) => {
    const r = hero.getBoundingClientRect();
    const nx = (e.clientX - r.left - r.width / 2) / r.width;
    const ny = (e.clientY - r.top - r.height / 2) / r.height;
    state.forEach((s, i) => { s.tx = nx * SPEEDS[i]; s.ty = ny * SPEEDS[i]; });
    start();
  }, { passive: true });

  hero.addEventListener('mouseleave', () => {
    state.forEach(s => { s.tx = 0; s.ty = 0; });
    start();
  });
}
