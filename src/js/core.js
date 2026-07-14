// Shared animation core: GSAP plugins, Lenis smooth scroll, reduced-motion flag.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

gsap.registerPlugin(ScrollTrigger, SplitText);

export const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Reduced motion: no smooth scroll, native scrolling only (plan §1).
export const lenis = reducedMotion ? null : new Lenis({ autoRaf: false });

if (lenis) {
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

/** Shared scroll lock for full-screen overlays (mobile menu, reserve). */
export function setScrollLock(locked) {
  document.documentElement.classList.toggle('is-locked', locked);
  if (lenis) {
    if (locked) lenis.stop();
    else lenis.start();
  }
}

export { gsap, ScrollTrigger, SplitText };
