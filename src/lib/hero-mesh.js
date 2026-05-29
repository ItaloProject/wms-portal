export function initHeroMesh() {
  const hero = document.getElementById('hero');
  const blobs = hero?.querySelectorAll('.mesh-blob');
  if (!hero || !blobs?.length) return;

  if (window.matchMedia('(pointer: coarse)').matches) return;

  // Deslocamento máximo em px por blob (velocidades diferentes = profundidade)
  const SPEEDS = [52, 34, 76, 28];

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const tx = (e.clientX - rect.left - rect.width / 2) / rect.width;
    const ty = (e.clientY - rect.top - rect.height / 2) / rect.height;

    blobs.forEach((blob, i) => {
      const x = (tx * SPEEDS[i]).toFixed(1);
      const y = (ty * SPEEDS[i]).toFixed(1);
      blob.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    });
  }, { passive: true });

  hero.addEventListener('mouseleave', () => {
    blobs.forEach((blob) => { blob.style.transform = 'translate3d(0,0,0)'; });
  });
}
