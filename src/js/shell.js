// Global shell: injects the markup shared by every page (skip link, nav,
// mobile menu, footer, sticky reserve pill, reserve overlay, slat layer)
// so the six HTML pages stay a single source of truth.
import { gsap, reducedMotion } from './core.js';

const NAV_LINKS = [
  ['menu', '/menu.html', 'Menu'],
  ['experiences', '/experiences.html', 'Experiences'],
  ['about', '/about.html', 'About'],
  ['gallery', '/gallery.html', 'Gallery'],
  ['contact', '/contact.html', 'Contact'],
];

const ADDRESS = '21-24 Victory Parade, East Village, London E20 1FS';
const MAPS_URL = 'https://maps.google.com/?q=Bamboo+Mat,+21-24+Victory+Parade,+London+E20+1FS';
const INSTAGRAM_URL = 'https://www.instagram.com/_bamboomatstratford';

function navLinkTags(page) {
  return NAV_LINKS.map(
    ([id, href, label]) =>
      `<a href="${href}"${page === id ? ' aria-current="page"' : ''}>${label}</a>`,
  ).join('');
}

export function mountShell() {
  const page = document.body.dataset.page;

  const header = `
    <a class="skip-link" href="#main">Skip to content</a>
    <header class="site-nav" data-nav>
      <div class="nav-inner">
        <a class="nav-logo" href="/" aria-label="Bamboo Mat — home">
          <img src="/assets/img/bamboo_logo.svg" alt="Bamboo Mat" width="110" height="24" />
        </a>
        <nav class="nav-links mono" aria-label="Primary">${navLinkTags(page)}</nav>
        <div class="nav-actions">
          <button type="button" class="btn btn-gold nav-reserve" data-reserve>Reserve</button>
          <button
            type="button"
            class="nav-burger"
            aria-expanded="false"
            aria-controls="mobile-menu"
            aria-label="Open menu"
          ><span></span><span></span></button>
        </div>
      </div>
    </header>
    <div class="mobile-menu" id="mobile-menu" hidden>
      <nav class="mobile-menu-links" aria-label="Mobile">
        <a class="display" href="/"${page === 'home' ? ' aria-current="page"' : ''}>Home</a>
        ${NAV_LINKS.map(
          ([id, href, label]) =>
            `<a class="display" href="${href}"${page === id ? ' aria-current="page"' : ''}>${label}</a>`,
        ).join('')}
      </nav>
      <div class="mobile-menu-foot mono">
        <p>${ADDRESS}</p>
        <a href="${INSTAGRAM_URL}" target="_blank" rel="noopener">@_bamboomatstratford</a>
      </div>
    </div>`;

  const footer = `
    <footer class="site-footer" data-footer>
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <img src="/assets/img/bamboo_logo.svg" alt="Bamboo Mat" width="150" height="33" />
            <p>Nikkei dining in East London — Est. 2022</p>
          </div>
          <nav class="footer-col mono" aria-label="Pages">
            <p class="footer-col-title">Pages</p>
            <a href="/">Home</a>${navLinkTags('')}
          </nav>
          <nav class="footer-col mono" aria-label="Visit">
            <p class="footer-col-title">Visit</p>
            <button type="button" data-reserve>Reserve a table</button>
            <a href="${MAPS_URL}" target="_blank" rel="noopener">Get directions</a>
            <a href="${INSTAGRAM_URL}" target="_blank" rel="noopener">Instagram</a>
            <a href="mailto:bamboomatuk@gmail.com">Email us</a>
          </nav>
          <address class="footer-address mono">
            <p>${ADDRESS}</p>
            <p><a href="mailto:bamboomatuk@gmail.com">bamboomatuk@gmail.com</a></p>
            <p><a href="${INSTAGRAM_URL}" target="_blank" rel="noopener">@_bamboomatstratford</a></p>
          </address>
        </div>
        <div class="makisu-divider" aria-hidden="true"></div>
        <div class="footer-bottom mono">
          <span>© 2026 Bamboo Mat</span>
          <span>Design prototype — not the live Bamboo Mat website.</span>
        </div>
      </div>
    </footer>`;

  const overlays = `
    <button type="button" class="reserve-pill mono" data-reserve data-pill hidden>
      Reserve
    </button>
    <div class="slats-layer" data-slats-layer aria-hidden="true"></div>`;

  document.body.insertAdjacentHTML('afterbegin', header);
  document.body.insertAdjacentHTML('beforeend', footer + overlays);
}

/* Sticky reserve pill: appears past the first viewport, hides at the footer. */
export function initStickyPill() {
  const pill = document.querySelector('[data-pill]');
  const footer = document.querySelector('[data-footer]');
  if (!pill || !footer) return;

  let pastHero = false;
  let footerInView = false;
  let shown = false;

  const update = () => {
    const next = pastHero && !footerInView;
    if (next === shown) return;
    shown = next;
    if (shown) pill.hidden = false;
    if (reducedMotion) {
      pill.hidden = !shown;
      return;
    }
    gsap.to(pill, {
      autoAlpha: shown ? 1 : 0,
      y: shown ? 0 : 12,
      duration: 0.35,
      ease: 'power2.out',
      onComplete: () => {
        if (!shown) pill.hidden = true;
      },
    });
  };

  if (!reducedMotion) gsap.set(pill, { autoAlpha: 0, y: 12 });

  window.addEventListener(
    'scroll',
    () => {
      pastHero = window.scrollY > window.innerHeight * 0.9;
      update();
    },
    { passive: true },
  );

  new IntersectionObserver(
    ([entry]) => {
      footerInView = entry.isIntersecting;
      update();
    },
    { rootMargin: '80px' },
  ).observe(footer);
}

/* Subtle magnetic hover for reserve buttons — desktop pointers only. */
export function initMagnetic() {
  if (reducedMotion || !window.matchMedia('(pointer: fine)').matches) return;
  const MAX = 8;
  document.querySelectorAll('[data-reserve], .btn').forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const box = el.getBoundingClientRect();
      const x = ((e.clientX - box.left) / box.width - 0.5) * 2 * MAX;
      const y = ((e.clientY - box.top) / box.height - 0.5) * 2 * MAX;
      gsap.to(el, { x, y, duration: 0.3, ease: 'power2.out' });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.45)' });
    });
  });
}

/* Minimal focus trap for full-screen overlays. Returns a cleanup fn. */
export function trapFocus(container) {
  const selector =
    'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';
  const onKeydown = (e) => {
    if (e.key !== 'Tab') return;
    const nodes = [...container.querySelectorAll(selector)].filter(
      (n) => n.offsetParent !== null || n === document.activeElement,
    );
    if (!nodes.length) return;
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };
  container.addEventListener('keydown', onKeydown);
  return () => container.removeEventListener('keydown', onKeydown);
}
