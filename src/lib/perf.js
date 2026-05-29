export function getPerfTier() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'minimal';
  if (navigator.connection?.saveData) return 'minimal';
  if (window.matchMedia('(max-width: 768px)').matches) return 'mobile';

  const cores = navigator.hardwareConcurrency ?? 4;
  const memory = navigator.deviceMemory ?? 4;

  if (cores >= 8 && memory >= 8) return 'high';
  if (cores >= 6 && memory >= 4) return 'medium';
  return 'lite';
}

export function applyPerfClass() {
  const tier = getPerfTier();
  document.documentElement.dataset.perf = tier;
  if (tier === 'minimal') document.documentElement.classList.add('perf-lite');
  return tier;
}

export function canUseRichMotion(tier = getPerfTier()) {
  return tier === 'high';
}

export function canUseCustomCursor() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  if (window.matchMedia('(max-width: 768px)').matches) return false;
  if (window.matchMedia('(pointer: coarse)').matches) return false;
  if (navigator.connection?.saveData) return false;
  return getPerfTier() === 'high';
}
