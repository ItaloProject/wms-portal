let cachedTier;

export function getPerfTier() {
  if (cachedTier) return cachedTier;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    cachedTier = 'minimal';
  } else if (navigator.connection?.saveData) {
    cachedTier = 'minimal';
  } else if (window.matchMedia('(max-width: 768px)').matches) {
    cachedTier = 'mobile';
  } else {
    const cores = navigator.hardwareConcurrency ?? 4;
    const memory = navigator.deviceMemory ?? 4;

    if (cores >= 8 && memory >= 8) cachedTier = 'high';
    else if (cores >= 6 && memory >= 4) cachedTier = 'medium';
    else cachedTier = 'lite';
  }

  return cachedTier;
}

export function applyPerfClass() {
  const tier = getPerfTier();
  document.documentElement.dataset.perf = tier;
  if (tier === 'minimal') document.documentElement.classList.add('perf-lite');
  return tier;
}

export function canUseRichMotion() {
  return getPerfTier() === 'high';
}

export function canUseCustomCursor() {
  if (getPerfTier() !== 'high') return false;
  if (window.matchMedia('(pointer: coarse)').matches) return false;
  return true;
}
