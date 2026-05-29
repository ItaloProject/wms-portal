const tasks = new Set();
let ticking = false;

function runTasks() {
  tasks.forEach((task) => task());
  ticking = false;
}

function onScrollFrame() {
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
