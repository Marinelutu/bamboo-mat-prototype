// Reserve overlay (plan §2): a mock booking flow — party size, date, time —
// entirely front-end. Slats roll in as the backdrop, panel fades above.
import { gsap, reducedMotion, setScrollLock } from './core.js';
import { buildSlats, rollIn, rollOut } from './slats.js';
import { trapFocus } from './shell.js';

const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

function dateChips() {
  const chips = [];
  const now = new Date();
  for (let i = 0; i < 14; i += 1) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
    const label =
      i === 0 ? 'TODAY' : `${WEEKDAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`;
    const full = `${WEEKDAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`;
    chips.push(`<button type="button" class="chip" data-value="${full}">${label}</button>`);
  }
  return chips.join('');
}

function timeChips() {
  const chips = [];
  for (let h = 12; h <= 21; h += 1) {
    for (const m of ['00', '30']) {
      const t = `${String(h).padStart(2, '0')}:${m}`;
      chips.push(`<button type="button" class="chip" data-value="${t}">${t}</button>`);
    }
  }
  return chips.join('');
}

const PARTY_LABELS = ['1', '2', '3', '4', '5', '6', '7', '8+'];

const MARKUP = `
<div class="reserve" role="dialog" aria-modal="true" aria-labelledby="reserve-title" hidden>
  <div class="reserve-slats" aria-hidden="true"></div>
  <div class="reserve-inner">
    <button type="button" class="reserve-close mono">Close</button>
    <div class="reserve-flow">
      <p class="eyebrow">Bookings</p>
      <h2 class="reserve-title" id="reserve-title">Reserve a table.</h2>
      <fieldset class="reserve-group" data-group="party">
        <legend class="mono">Party size</legend>
        <div class="chip-row">
          ${PARTY_LABELS.map(
            (n) => `<button type="button" class="chip" data-value="${n}">${n}</button>`,
          ).join('')}
        </div>
      </fieldset>
      <fieldset class="reserve-group" data-group="date">
        <legend class="mono">Date</legend>
        <div class="chip-row chip-scroll">${dateChips()}</div>
      </fieldset>
      <fieldset class="reserve-group" data-group="time">
        <legend class="mono">Time</legend>
        <div class="chip-grid">${timeChips()}</div>
      </fieldset>
      <div class="reserve-foot">
        <button type="button" class="btn btn-solid reserve-confirm" disabled>Confirm booking</button>
      </div>
    </div>
    <div class="reserve-success" hidden>
      <p class="eyebrow">Booking confirmed</p>
      <h2 class="reserve-title">See you <em>at the mat</em>.</h2>
      <p class="reserve-summary mono"></p>
      <p class="reserve-note mono">This is a design prototype — bookings via Design My Night.</p>
      <button type="button" class="btn btn-gold reserve-done">Done</button>
    </div>
  </div>
</div>`;

export function initReserve() {
  document.body.insertAdjacentHTML('beforeend', MARKUP);

  const overlay = document.querySelector('.reserve');
  const slatsBox = overlay.querySelector('.reserve-slats');
  const inner = overlay.querySelector('.reserve-inner');
  const flow = overlay.querySelector('.reserve-flow');
  const success = overlay.querySelector('.reserve-success');
  const confirm = overlay.querySelector('.reserve-confirm');
  const summary = overlay.querySelector('.reserve-summary');

  const state = { party: null, date: null, time: null };
  let open = false;
  let invoker = null;
  let releaseTrap = null;

  const updateConfirm = () => {
    confirm.disabled = !(state.party && state.date && state.time);
  };

  const reset = () => {
    Object.keys(state).forEach((k) => {
      state[k] = null;
    });
    overlay
      .querySelectorAll('.chip[aria-pressed]')
      .forEach((c) => c.removeAttribute('aria-pressed'));
    flow.hidden = false;
    success.hidden = true;
    updateConfirm();
  };

  overlay.querySelectorAll('.reserve-group').forEach((group) => {
    const key = group.dataset.group;
    group.addEventListener('click', (e) => {
      const chip = e.target.closest('.chip');
      if (!chip) return;
      group
        .querySelectorAll('.chip[aria-pressed]')
        .forEach((c) => c.removeAttribute('aria-pressed'));
      chip.setAttribute('aria-pressed', 'true');
      state[key] = chip.dataset.value;
      updateConfirm();
    });
  });

  confirm.addEventListener('click', () => {
    const party = state.party === '8+' ? 'a large table' : `table for ${state.party}`;
    summary.textContent = `${state.date} · ${state.time} · ${party}`.toUpperCase();
    if (reducedMotion) {
      flow.hidden = true;
      success.hidden = false;
    } else {
      gsap.to(flow, {
        autoAlpha: 0,
        y: -14,
        duration: 0.25,
        ease: 'power1.in',
        onComplete: () => {
          flow.hidden = true;
          gsap.set(flow, { clearProps: 'all' });
          success.hidden = false;
          gsap.fromTo(
            success.children,
            { autoAlpha: 0, y: 20 },
            { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out', stagger: 0.07 },
          );
        },
      });
    }
    success.querySelector('.reserve-done').focus({ preventScroll: true });
  });

  const close = () => {
    if (!open) return;
    open = false;
    releaseTrap?.();
    releaseTrap = null;
    setScrollLock(false);

    const finish = () => {
      overlay.hidden = true;
      reset();
      invoker?.focus({ preventScroll: true });
    };

    if (reducedMotion) {
      finish();
      return;
    }
    const slats = slatsBox.querySelectorAll('.slat');
    gsap.to(inner, { autoAlpha: 0, duration: 0.2, ease: 'power1.in' });
    rollOut(slats, { duration: 0.45, fromLeft: false }).then(finish);
  };

  const show = (trigger) => {
    if (open) return;
    open = true;
    invoker = trigger;
    reset();
    overlay.hidden = false;
    setScrollLock(true);
    releaseTrap = trapFocus(overlay);

    if (reducedMotion) {
      gsap.set(inner, { autoAlpha: 1 });
      overlay.querySelector('.reserve-close').focus({ preventScroll: true });
      return;
    }
    const slats = buildSlats(slatsBox);
    gsap.set(inner, { autoAlpha: 0, y: 18 });
    rollIn(slats, { duration: 0.4 });
    gsap.to(inner, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power3.out', delay: 0.28 });
    overlay.querySelector('.reserve-close').focus({ preventScroll: true });
  };

  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-reserve]');
    if (trigger) show(trigger);
  });

  overlay.querySelector('.reserve-close').addEventListener('click', close);
  overlay.querySelector('.reserve-done').addEventListener('click', close);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && open) close();
  });
}
