// Gallery page (plan §7): masonry grid + tiny custom lightbox (no library).
import { reducedMotion, setScrollLock } from './core.js';
import { revealLines } from './fx.js';
import { trapFocus } from './shell.js';

const PHOTOS = [
  ['g-1', 'Tuna tartar with the dining room and its plants behind'],
  ['g-8', 'A shared table of maki boards and cocktails'],
  ['g-3', 'Tuna tartar crowned with a curled rice cracker'],
  ['g-15', 'Anticucho skewers under a green herb crust'],
  ['g-9', 'A cocktail catching the evening light at the bar'],
  ['g-10', 'The Bamboo Maki sliced on a wooden board'],
  ['g-22', 'A toast over dinner'],
  ['g-7', 'Hamachi tiradito on a white plate'],
  ['g-17', 'Gambas frites upright in a black stone cup'],
  ['g-20', 'The full table from above'],
  ['g-4', 'A spritz with fresh herbs among the greenery'],
  ['g-12', 'Maki board with the autumn pumpkin mochi'],
  ['g-21', 'Chopsticks lifting maki from a shared board'],
  ['g-6', 'Tuna tartar and crackers in low candle-light'],
  ['g-25', 'Mochi ice cream shaped as a tiny pumpkin'],
  ['g-16', 'Spritz and tempura by the window greenery'],
  ['g-2', 'Tuna tartar on the table beside the green banquettes'],
  ['g-14', 'Standing tempura prawns and a spritz, low light'],
  ['g-27', 'The house punch in cut crystal'],
  ['g-19', 'A dark punch and the pumpkin mochi'],
];

function renderGrid() {
  const grid = document.querySelector('[data-gallery]');
  grid.innerHTML = PHOTOS.map(
    ([id, alt], i) => `
    <button type="button" class="gallery-item" data-index="${i}" aria-label="View: ${alt}">
      <span class="img-mask"><img src="/assets/img/${id}.jpg" alt="${alt}" loading="lazy" /></span>
    </button>`,
  ).join('');
}

function initEnterFades() {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 },
  );
  document.querySelectorAll('.gallery-item').forEach((el, i) => {
    el.style.transitionDelay = `${(i % 3) * 70}ms`;
    io.observe(el);
  });
}

function initLightbox() {
  document.body.insertAdjacentHTML(
    'beforeend',
    `<div class="lightbox" role="dialog" aria-modal="true" aria-label="Image viewer" hidden>
       <button type="button" class="lightbox-close mono">Close</button>
       <button type="button" class="lightbox-arrow lightbox-prev" aria-label="Previous image">←</button>
       <figure class="lightbox-stage">
         <img class="lightbox-img" src="" alt="" />
         <figcaption class="lightbox-caption mono"></figcaption>
       </figure>
       <button type="button" class="lightbox-arrow lightbox-next" aria-label="Next image">→</button>
     </div>`,
  );

  const box = document.querySelector('.lightbox');
  const img = box.querySelector('.lightbox-img');
  const caption = box.querySelector('.lightbox-caption');
  let index = 0;
  let open = false;
  let invoker = null;
  let releaseTrap = null;

  const showAt = (i) => {
    index = (i + PHOTOS.length) % PHOTOS.length;
    const [id, alt] = PHOTOS[index];
    img.src = `/assets/img/${id}.jpg`;
    img.alt = alt;
    caption.textContent = alt;
  };

  const openBox = (i, trigger) => {
    invoker = trigger;
    open = true;
    showAt(i);
    box.hidden = false;
    setScrollLock(true);
    releaseTrap = trapFocus(box);
    box.querySelector('.lightbox-close').focus({ preventScroll: true });
  };

  const closeBox = () => {
    if (!open) return;
    open = false;
    box.hidden = true;
    setScrollLock(false);
    releaseTrap?.();
    releaseTrap = null;
    invoker?.focus({ preventScroll: true });
  };

  document.querySelector('[data-gallery]').addEventListener('click', (e) => {
    const item = e.target.closest('.gallery-item');
    if (item) openBox(Number(item.dataset.index), item);
  });

  box.querySelector('.lightbox-close').addEventListener('click', closeBox);
  box.querySelector('.lightbox-prev').addEventListener('click', () => showAt(index - 1));
  box.querySelector('.lightbox-next').addEventListener('click', () => showAt(index + 1));

  // click-out closes (clicks on the stage/arrows/close do not)
  box.addEventListener('click', (e) => {
    if (e.target === box) closeBox();
  });

  document.addEventListener('keydown', (e) => {
    if (!open) return;
    if (e.key === 'Escape') closeBox();
    if (e.key === 'ArrowLeft') showAt(index - 1);
    if (e.key === 'ArrowRight') showAt(index + 1);
  });
}

export async function init() {
  renderGrid();
  initLightbox();
  initEnterFades();

  await document.fonts.ready;
  if (!reducedMotion) revealLines(document.querySelector('.gallery-head h1'));
}
