// Home page animations (plan §3).
import { gsap, ScrollTrigger, reducedMotion } from './core.js';
import { whenRevealed } from './reveal.js';
import { revealLines, parallaxImg, fadeUpGroup, wordScrub, initReducedMotionFades } from './fx.js';

/* 3.1 Hero: Ken Burns + masked line rise after the reveal */
async function initHero() {
  const heroImg = document.querySelector('.hero-img');
  gsap.fromTo(heroImg, { scale: 1.08 }, { scale: 1, duration: 12, ease: 'none' });

  const lines = document.querySelectorAll('.hero-line-inner');
  const sub = document.querySelector('.hero-sub');
  const ctas = document.querySelector('.hero-ctas');
  const scrollHint = document.querySelector('.hero-scroll');
  gsap.set(lines, { yPercent: 110 });
  gsap.set([sub, ctas, scrollHint], { autoAlpha: 0 });

  await whenRevealed;

  gsap
    .timeline()
    .to(lines, { yPercent: 0, duration: 1.1, ease: 'power4.out', stagger: 0.12 })
    .to([sub, ctas], { autoAlpha: 1, duration: 0.7, ease: 'power2.out', stagger: 0.12 }, '-=0.45')
    .to(scrollHint, { autoAlpha: 1, duration: 0.6 }, '-=0.3');

  // Hero content parallaxes up and fades as you scroll away (plan 3.1)
  gsap.to('.hero-content', {
    yPercent: -16,
    autoAlpha: 0,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: '75% top', scrub: true },
  });
  gsap.to(scrollHint, {
    autoAlpha: 0,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: '25% top', scrub: true },
  });
}

/* 3.2 Grace Dent quote: word-by-word scrubbed reveal */
function initQuote() {
  wordScrub(document.querySelector('.quote-text'));
  gsap.from(['.quote cite', '.quote-more'], {
    autoAlpha: 0,
    duration: 0.8,
    stagger: 0.12,
    scrollTrigger: { trigger: '.quote cite', start: 'top 88%', once: true },
  });
}

/* 3.3 Cuisine trio: parallax images + masked headline rises */
function initTrio() {
  document.querySelectorAll('.trio-row').forEach((row) => {
    parallaxImg(row.querySelector('.img-mask'));
    revealLines(row.querySelector('h3'), { trigger: row });
    fadeUpGroup(row.querySelectorAll('.trio-kicker, .measure, .text-link'), row, { y: 24 });
  });
}

/* 3.4 Signature dishes: pinned horizontal scrub on desktop */
function initDishes() {
  const section = document.querySelector('[data-dishes]');
  const viewport = section.querySelector('[data-dishes-viewport]');
  const track = section.querySelector('[data-dishes-track]');

  revealLines(section.querySelector('h2'));

  // Below 900px the CSS switches to native swipe — skip the pin.
  if (!window.matchMedia('(min-width: 900px)').matches) return;

  gsap.to(track, {
    x: () => -(track.scrollWidth - viewport.clientWidth),
    ease: 'none',
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: '+=300%',
      pin: true,
      scrub: 1,
      invalidateOnRefresh: true,
    },
  });
}

/* 3.5 Experience cards: staggered entrance */
function initExperiences() {
  fadeUpGroup(document.querySelectorAll('.exp-card'), '.exp-grid');
}

/* 3.6 People */
function initPeople() {
  parallaxImg(document.querySelector('.people-img'));
  revealLines(document.querySelector('.people-copy h2'), { trigger: '.people' });
  fadeUpGroup(document.querySelectorAll('.people-copy .measure, .people-copy .text-link'), '.people');
}

/* 3.7 Lens strip: slow infinite drift, paused on hover */
function initLens() {
  const strip = document.querySelector('[data-lens]');
  const track = document.querySelector('[data-lens-track]');
  track.innerHTML += track.innerHTML; // duplicate once for a seamless loop
  track.querySelectorAll('img').forEach((img) => img.setAttribute('alt', ''));

  const drift = gsap.to(track, { xPercent: -50, duration: 48, ease: 'none', repeat: -1 });
  strip.addEventListener('mouseenter', () => drift.pause());
  strip.addEventListener('mouseleave', () => drift.play());
}

/* 3.8 Final invitation */
function initInvite() {
  revealLines(document.querySelector('.invite h2'), { trigger: '.invite' });
  fadeUpGroup(document.querySelectorAll('.invite-details, .invite .btn'), '.invite');
}

export async function init() {
  await document.fonts.ready; // SplitText needs final metrics

  if (reducedMotion) {
    initReducedMotionFades();
    return;
  }

  initHero();
  initQuote();
  initTrio();
  initDishes();
  initExperiences();
  initPeople();
  initLens();
  initInvite();

  // Lazy images below the fold can shift trigger positions.
  window.addEventListener('load', () => ScrollTrigger.refresh());
}
