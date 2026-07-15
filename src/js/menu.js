// Menu page (plan §4): renders sections from data, sticky category chips
// with IntersectionObserver, staggered row reveals.
import { gsap, reducedMotion } from './core.js';
import { revealLines, fadeUpGroup, initReducedMotionFades } from './fx.js';
import { TASTING_MENUS, MENU_SECTIONS } from './data/menu-data.js';

function renderTastings() {
  const box = document.querySelector('[data-tastings]');
  box.innerHTML = TASTING_MENUS.map(
    (menu) => `
    <article class="tasting-card">
      <h3>${menu.name}</h3>
      <p class="tasting-price mono">${menu.price}</p>
      <ul>${menu.lines.map((line) => `<li>${line}</li>`).join('')}</ul>
      <p class="mono tasting-note">+ wine pairing available</p>
    </article>`,
  ).join('');
}

function renderSections() {
  const box = document.querySelector('[data-menu-sections]');
  box.innerHTML = MENU_SECTIONS.map(
    (section) => `
    <section class="menu-section" id="${section.id}" data-section>
      <header class="menu-section-head">
        <h2>${section.title}</h2>
        ${section.note ? `<p class="mono menu-section-note">${section.note}</p>` : ''}
      </header>
      <ul class="menu-list">
        ${section.items
          .map(
            (item) => `
          <li class="menu-row">
            <span class="menu-row-name">
              ${item.name}
              ${(item.tags || []).map((t) => `<span class="menu-tag mono">${t}</span>`).join('')}
            </span>
            <span class="menu-row-dots" aria-hidden="true"></span>
            <span class="menu-row-price mono">${item.price}</span>
          </li>`,
          )
          .join('')}
      </ul>
    </section>`,
  ).join('');
}

function renderChips() {
  const bar = document.querySelector('[data-chipbar]');
  bar.innerHTML = MENU_SECTIONS.map(
    (s) => `<a class="menu-chip mono" href="#${s.id}" data-chip="${s.id}">${s.title}</a>`,
  ).join('');
}

/* Active chip follows the section in view (plan §4). */
function initChipObserver() {
  const chips = new Map(
    [...document.querySelectorAll('[data-chip]')].map((chip) => [chip.dataset.chip, chip]),
  );
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        chips.forEach((chip) => chip.classList.remove('is-active'));
        chips.get(entry.target.id)?.classList.add('is-active');
      });
    },
    { rootMargin: '-30% 0px -60% 0px' },
  );
  document.querySelectorAll('[data-section]').forEach((s) => io.observe(s));
}

export async function init() {
  renderTastings();
  renderSections();
  renderChips();
  initChipObserver();

  await document.fonts.ready;

  if (reducedMotion) {
    initReducedMotionFades('.tasting-card, .menu-section-head, .menu-hero h1');
    return;
  }

  revealLines(document.querySelector('.menu-hero h1'));
  gsap.from('.menu-hero .origin-quote, .menu-hero .eyebrow', {
    autoAlpha: 0,
    y: 18,
    duration: 0.9,
    ease: 'power3.out',
    stagger: 0.1,
    delay: 0.25,
  });

  fadeUpGroup(document.querySelectorAll('.tasting-card'), '[data-tastings]');
  document.querySelectorAll('.menu-section').forEach((section) => {
    fadeUpGroup(section.querySelectorAll('.menu-row'), section, { y: 18, stagger: 0.04 });
  });
}
