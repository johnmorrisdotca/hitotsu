import { phrases } from "./phrases.ts";

/** A few lines of DOM building, so the table needs no framework. Text is always set as text, never as HTML. */
type Attrs = Record<string, string | number | boolean | null | undefined | EventListener>;
type Child = Node | string | null | undefined | false;

export function h<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs: Attrs = {},
  ...children: Child[]
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  for (const [name, value] of Object.entries(attrs)) {
    if (value === null || value === undefined || value === false) continue;
    if (name.startsWith("on") && typeof value === "function") el.addEventListener(name.slice(2), value);
    else if (value === true) el.setAttribute(name, "");
    else el.setAttribute(name, String(value));
  }
  for (const child of children) {
    if (child === null || child === undefined || child === false) continue;
    el.append(typeof child === "string" ? document.createTextNode(child) : child);
  }
  return el;
}

/** A sentence as table text with a `<wbr>` between its phrases, so that a line of Japanese breaks only there (with `word-break: keep-all`). The text is the sentence as it was, for `textContent`, a screen reader and a host's tests. */
export function phrased(text: string): (Node | string)[] {
  return phrases(text).flatMap((part, at) => (at === 0 ? [part] : [document.createElement("wbr"), part]));
}

/** replaceChildren, skipping the parts a render left out. */
export function refill(el: Element, ...children: Child[]): void {
  el.replaceChildren(...children.filter((c): c is Node | string => c !== null && c !== undefined && c !== false));
}
