// Shared scroll-animation helpers used by the page modules.
// Everything animates transform/opacity only (plan §10).
import { gsap, ScrollTrigger, SplitText, reducedMotion } from './core.js';

/** Display headline: masked line rise on enter (Khufu's pattern). */
export function revealLines(el, { delay = 0, trigger = el } = {}) {
  const split = SplitText.create(el, { type: 'lines', mask: 'lines' });
  gsap.from(split.lines, {
    yPercent: 115,
    duration: 1,
    ease: 'power4.out',
    stagger: 0.1,
    delay,
    scrollTrigger: { trigger, start: 'top 85%', once: true },
  });
  return split;
}

/** Image parallax inside a masked container: drift + settle-in scale. */
export function parallaxImg(mask) {
  const img = mask.querySelector('img');
  gsap.fromTo(
    img,
    { yPercent: -8 },
    {
      yPercent: 8,
      ease: 'none',
      scrollTrigger: { trigger: mask, start: 'top bottom', end: 'bottom top', scrub: true },
    },
  );
  gsap.fromTo(
    img,
    { scale: 1.06 },
    {
      scale: 1,
      duration: 1.4,
      ease: 'power2.out',
      scrollTrigger: { trigger: mask, start: 'top 88%', once: true },
    },
  );
}

/** Staggered fade-up for a group of cards/rows. */
export function fadeUpGroup(items, trigger, { stagger = 0.08, y = 32 } = {}) {
  gsap.from(items, {
    autoAlpha: 0,
    y,
    duration: 0.9,
    ease: 'power3.out',
    stagger,
    scrollTrigger: { trigger, start: 'top 82%', once: true },
  });
}

/** Reduced-motion path: plain opacity fades on enter, nothing else. */
export function initReducedMotionFades(selector = '[data-fade], .img-mask, section h2, section h3') {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );
  document.querySelectorAll(selector).forEach((el) => {
    el.classList.add('rm-fade');
    io.observe(el);
  });
}

export { gsap, ScrollTrigger, SplitText, reducedMotion };
