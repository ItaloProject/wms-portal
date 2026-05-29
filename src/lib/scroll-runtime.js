const tasks = new Set();
let ticking = false;
let scrollEndTimer = 0;

function runTasks() {
  tasks.forEach((task) => task());
  ticking = false;
}

function onScrollFrame() {
  document.documentElement.classList.add('is-scrolling');
  window.clearTimeout(scrollEndTimer);
  scrollEndTimer = window.setTimeout(() => {
    document.documentElement.classList.remove('is-scrolling');
  }, 120);

  if (!ticking) {
    ticking = true;
    requestAnimationFrame(runTasks);
  }
}

export function onScroll(task) {
  tasks.add(task);
  return () => tasks.delete(task);
}

export function initScrollRuntime() {
  window.addEventListener('scroll', onScrollFrame, { passive: true });
  onScrollFrame();
}
