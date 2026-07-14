// Single "the page is visible" signal. Page modules await this before
// running entrance animations, whoever owns the reveal (preloader on
// first visit, transition roll-out on internal nav, or nobody).
let resolveReveal;

export const whenRevealed = new Promise((resolve) => {
  resolveReveal = resolve;
});

export function markRevealed() {
  resolveReveal();
}
