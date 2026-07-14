// Nav behavior: scrolled state, mobile menu overlay, smooth in-page anchors.
import { gsap, lenis, reducedMotion, setScrollLock } from './core.js';
import { trapFocus } from './shell.js';

export function initNav() {
  const nav = document.querySelector('[data-nav]');
  const burger = nav.querySelector('.nav-burger');
  const menu = document.getElementById('mobile-menu');

  // Transparent over the hero → sumi background after 80px (plan §2).
  const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 80);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile menu -----------------------------------------------------
  let releaseTrap = null;

  const closeMenu = () => {
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Open menu');
    setScrollLock(false);
    releaseTrap?.();
    releaseTrap = null;
    if (reducedMotion) {
      menu.hidden = true;
      return;
    }
    gsap.to(menu, {
      autoAlpha: 0,
      duration: 0.25,
      ease: 'power1.in',
      onComplete: () => {
        menu.hidden = true;
      },
    });
  };

  const openMenu = () => {
    menu.hidden = false;
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', 'Close menu');
    setScrollLock(true);
    releaseTrap = trapFocus(document.body); // burger stays reachable above the overlay
    if (reducedMotion) return;
    gsap.fromTo(menu, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, ease: 'power1.out' });
    gsap.fromTo(
      menu.querySelectorAll('.mobile-menu-links a, .mobile-menu-foot'),
      { autoAlpha: 0, y: 28 },
      { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out', stagger: 0.06, delay: 0.08 },
    );
  };

  burger.addEventListener('click', () => {
    const open = burger.getAttribute('aria-expanded') === 'true';
    (open ? closeMenu : openMenu)();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      burger.focus();
    }
  });

  // The slat transition takes over navigation; just close the menu first.
  menu.addEventListener('click', (e) => {
    if (e.target.closest('a')) setScrollLock(false);
  });

  // Smooth-scroll same-page anchors through Lenis ---------------------
  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;
    const target = document.querySelector(anchor.hash);
    if (!target) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(target, { offset: -70 });
    else target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
  });
}
