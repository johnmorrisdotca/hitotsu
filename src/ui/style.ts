/**
 * The table's look, injected once per document. Every colour is a CSS
 * variable with a default, so a host page restyles it by setting variables on
 * the element it mounts into (or any ancestor) and never by overriding rules.
 */
export const STYLE_ID = "hitotsu-style";

export const CSS = `
.ht-root {
  --ht-surface: #fbf8f1; --ht-ink: #1f2320; --ht-muted: #6b6f68; --ht-rule: #ddd6c6;
  --ht-felt: #2f5d4a; --ht-felt-deep: #1f4135; --ht-felt-ink: #f3efe4;
  --ht-accent: #b5452c; --ht-accent-ink: #fff; --ht-playable: #f2c14e;
  --ht-radius: 16px; --ht-card: 72px; --ht-font: inherit;
  font-family: var(--ht-font); color: var(--ht-ink); display: grid; gap: 12px;
  -webkit-tap-highlight-color: transparent;
}
@media (prefers-color-scheme: dark) {
  .ht-root:not([data-theme="light"]) {
    --ht-surface: #1d201e; --ht-ink: #ece8dc; --ht-muted: #a09d93; --ht-rule: #3a3d38;
    --ht-felt: #214337; --ht-felt-deep: #152c24;
  }
}
.ht-root *, .ht-root *::before, .ht-root *::after { box-sizing: border-box; }
.ht-root button { font: inherit; color: inherit; cursor: pointer; }
.ht-root button:focus-visible { outline: 3px solid var(--ht-accent); outline-offset: 2px; }
.ht-root, .ht-root * { line-height: 1.35; }
.ht-seats { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(148px, calc(50% - 4px)), 1fr)); gap: 8px; container-type: inline-size; }
.ht-seat { min-width: 0; padding: 8px 10px; border: 1px solid var(--ht-rule); border-radius: 12px; background: var(--ht-surface); display: grid; gap: 2px; }
.ht-seat[data-turn] { border-color: var(--ht-accent); box-shadow: 0 0 0 2px var(--ht-accent); }
/* A name keeps together: a seat is at least 148px wide, which holds "コンピューター7" at this size, and where that leaves room for one seat to a row it is half the row instead. A seat after the last full row keeps one column's width; a row with room to spare shares it. A name too long for any seat breaks only because it must. */
.ht-seat b { font-size: .95rem; min-height: 2.7em; word-break: keep-all; overflow-wrap: anywhere; }
/* On the narrowest phones the names are a little smaller, so two still make a row. */
@container (max-width: 320px) { .ht-seat b { font-size: .8rem; } }
.ht-seat span { font-size: .8rem; color: var(--ht-muted); }
.ht-felt { position: relative; border-radius: var(--ht-radius); background: radial-gradient(circle at 50% 40%, var(--ht-felt), var(--ht-felt-deep)); color: var(--ht-felt-ink); padding: 18px 16px; display: grid; justify-items: center; gap: 10px; }
.ht-piles { display: flex; align-items: flex-start; justify-content: center; gap: 22px; }
.ht-card { display: block; width: var(--ht-card); aspect-ratio: 5 / 7; border-radius: 9% / 6.5%; box-shadow: 0 1px 3px rgba(0,0,0,.4); }
.ht-card svg { display: block; width: 100%; height: 100%; }
.ht-piles .ht-card { width: calc(var(--ht-card) * 1.25); }
/* The draw pile and the card in play are the same box, a card over a one-line caption, so the two cards sit level. */
.ht-stock, .ht-pile { display: grid; justify-items: center; gap: 4px; background: none; border: 0; padding: 0; color: inherit; }
.ht-stock > span:last-child, .ht-pile > span:last-child { font-size: .75rem; line-height: 1.2; opacity: .85; white-space: nowrap; }
.ht-stock:disabled { cursor: default; }
/* The turn's direction sits level with the middle of the cards, not of the cards and their captions. */
.ht-dir { font-size: 1.6rem; line-height: 1; opacity: .8; align-self: flex-start; margin-top: calc(var(--ht-card) * 1.25 * 0.7 - .8rem); }
.ht-status { margin: 0; font-weight: 600; text-align: center; }
.ht-news { margin: 0; min-height: 1.3em; font-size: .85rem; opacity: .85; text-align: center; }
.ht-hand { display: flex; flex-wrap: wrap; justify-content: center; gap: 6px; padding-top: 6px; }
.ht-hand button { padding: 0; border: 0; background: none; border-radius: 9% / 6.5%; transition: transform .12s; }
.ht-hand button[data-playable] { transform: translateY(-6px); }
.ht-hand button[data-playable] .ht-card { box-shadow: 0 0 0 3px var(--ht-playable), 0 3px 6px rgba(0,0,0,.4); }
.ht-hand button:disabled { cursor: default; }
.ht-hand button:disabled .ht-card { filter: saturate(.55) brightness(.92); }
.ht-actions { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; min-height: 44px; }
.ht-actions button { border: 1px solid var(--ht-rule); background: var(--ht-surface); border-radius: 999px; padding: 8px 16px; min-height: 44px; }
.ht-actions button[data-strong] { background: var(--ht-accent); color: var(--ht-accent-ink); border-color: var(--ht-accent); }
.ht-actions button[data-on] { background: var(--ht-ink); color: var(--ht-surface); }
.ht-actions button[data-colour] { color: #fff; border-color: transparent; }
@media (prefers-reduced-motion: reduce) { .ht-hand button { transition: none; } }
`;

/** Install the native table stylesheet once per document or shadow root.
 * @param doc - The owner document.
 * @param root - The host root, defaulting to the document.
 * @returns Nothing; an existing stylesheet is preserved.
 * @example
 * ```ts
 * import { injectStyle } from "./style.ts";
 * const install = (doc: Document) => injectStyle(doc);
 * console.log(typeof install);
 * ```
 */
export function injectStyle(doc: Document, root: Node = doc): void {
  const target = typeof ShadowRoot !== "undefined" && root instanceof ShadowRoot ? root : doc.head;
  if (target.querySelector(`#${STYLE_ID}`) !== null) return;
  const style = doc.createElement("style");
  style.id = STYLE_ID;
  style.textContent = CSS;
  target.append(style);
}
