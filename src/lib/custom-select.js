export function initCustomSelects(root = document) {
  const selects = root.querySelectorAll('.custom-select');
  if (!selects.length) return;

  const closeAll = (except) => {
    selects.forEach((select) => {
      if (select === except) return;
      select.classList.remove('is-open');
      select.querySelector('.custom-select-trigger')?.setAttribute('aria-expanded', 'false');
    });
  };

  selects.forEach((select) => {
    const trigger = select.querySelector('.custom-select-trigger');
    const list = select.querySelector('.custom-select-list');
    const valueEl = select.querySelector('.custom-select-value');
    const hidden = select.querySelector('input[type="hidden"]');
    const options = [...select.querySelectorAll('.custom-select-option')];

    if (!trigger || !list || !valueEl || !hidden) return;

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const willOpen = !select.classList.contains('is-open');
      closeAll(willOpen ? select : null);
      select.classList.toggle('is-open', willOpen);
      trigger.setAttribute('aria-expanded', String(willOpen));
    });

    options.forEach((option, index) => {
      option.addEventListener('click', (e) => {
        e.stopPropagation();
        const value = option.dataset.value ?? option.textContent.trim();
        hidden.value = value;
        valueEl.textContent = value;
        valueEl.classList.remove('is-placeholder');
        options.forEach((opt) => opt.classList.toggle('is-selected', opt === option));
        select.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
      });

      option.addEventListener('mouseenter', () => {
        options.forEach((opt, i) => opt.classList.toggle('is-focused', i === index));
      });
    });

    trigger.addEventListener('keydown', (e) => {
      const open = select.classList.contains('is-open');
      const focusedIndex = options.findIndex((opt) => opt.classList.contains('is-focused'));
      const selectedIndex = options.findIndex((opt) => opt.classList.contains('is-selected'));

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (!open) {
          closeAll(select);
          select.classList.add('is-open');
          trigger.setAttribute('aria-expanded', 'true');
        }
        const next = focusedIndex < options.length - 1 ? focusedIndex + 1 : 0;
        options.forEach((opt, i) => opt.classList.toggle('is-focused', i === next));
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (!open) return;
        const prev = focusedIndex > 0 ? focusedIndex - 1 : options.length - 1;
        options.forEach((opt, i) => opt.classList.toggle('is-focused', i === prev));
      }

      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (!open) {
          closeAll(select);
          select.classList.add('is-open');
          trigger.setAttribute('aria-expanded', 'true');
          const start = selectedIndex >= 0 ? selectedIndex : 0;
          options.forEach((opt, i) => opt.classList.toggle('is-focused', i === start));
          return;
        }
        const target = options[focusedIndex >= 0 ? focusedIndex : 0];
        target?.click();
      }

      if (e.key === 'Escape') {
        select.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
      }
    });
  });

  document.addEventListener('click', () => closeAll());
}
