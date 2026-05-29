export function initAmbientGlow() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const el = document.querySelector('.ambient-glow');
  if (!el) return;

  let cx = window.innerWidth * 0.6;
  let cy = window.innerHeight * 0.3;
  let tx = cx, ty = cy;
  let running = false;
  let visible = false;

  const tick = () => {
    cx += (tx - cx) * 0.06;
    cy += (ty - cy) * 0.06;
    el.style.transform = `translate3d(calc(${cx.toFixed(1)}px - 50%),calc(${cy.toFixed(1)}px - 50%),0)`;
    if (Math.abs(tx - cx) > 0.4 || Math.abs(ty - cy) > 0.4) {
      requestAnimationFrame(tick);
    } else {
      running = false;
    }
  };

  document.addEventListener('mousemove', (e) => {
    tx = e.clientX;
    ty = e.clientY;
    if (!visible) { visible = true; el.classList.add('is-active'); }
    if (!running) { running = true; requestAnimationFrame(tick); }
  }, { passive: true });

  document.addEventListener('mouseleave', () => {
    visible = false;
    el.classList.remove('is-active');
    running = false;
  });
}
