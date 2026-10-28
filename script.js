// Progressive enhancement only. Content and project documents work without JavaScript.
(() => {
  'use strict';
  const button = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#primary-nav');
  const label = button?.querySelector('.menu-label');
  const header = document.querySelector('.site-header');
  if (!button || !nav || !label || !header) return;

  const desktop = window.matchMedia('(min-width: 48rem)');
  const setOpen = (open) => {
    button.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
    label.textContent = open ? 'Close' : 'Menu';
  };

  button.addEventListener('click', () => {
    setOpen(button.getAttribute('aria-expanded') !== 'true');
  });
  nav.addEventListener('click', (event) => {
    if (event.target instanceof Element && event.target.closest('a')) setOpen(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && button.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      button.focus();
    }
  });
  document.addEventListener('click', (event) => {
    if (event.target instanceof Node && !header.contains(event.target)) setOpen(false);
  });
  desktop.addEventListener('change', () => {
    const focusWasInNav = nav.contains(document.activeElement);
    setOpen(false);
    if (!desktop.matches && focusWasInNav) button.focus();
  });

  const root = document.documentElement;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  // Content stays visible before enhancement and when observers are unavailable.
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        if (!reducedMotion.matches) {
          entry.target.classList.add('motion-enter');
          entry.target.addEventListener('animationend', () => entry.target.classList.remove('motion-enter'), { once: true });
        }
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.08 });
    document.querySelectorAll('.section-heading, .featured-project, .secondary-project, .toolkit-group').forEach(element => observer.observe(element));
  }
  setOpen(false);
  root.classList.add('js');
})();
