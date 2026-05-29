export function initAmbientGlow() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const el = document.querySelector('.ambient-glow');
  if (!el) return;

  document.addEventListener('mousemove', (e) => {
    el.style.transform = `translate3d(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%), 0)`;
    if (!el.classList.contains('is-active')) el.classList.add('is-active');
  }, { passive: true });

  document.addEventListener('mouseleave', () => el.classList.remove('is-active'));
}
