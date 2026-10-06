/**
 * `<hitotsu-table>`: a table of Hitotsu to play on any page, with no script of
 * your own, in any framework or none.
 *
 * ```html
 * <script type="module" src="https://cdn.jsdelivr.net/npm/@johnmorrisdotca/hitotsu@1/dist/element-define.js"></script>
 * <hitotsu-table rules="party" computers="3"></hitotsu-table>
 * ```
 *
 * Attributes (all optional; changing one deals again):
 *
 *   rules       `classic` (the default) or `party`
 *   computers   how many computers sit with you, 1 to 7 (3 unless `players` is given)
 *   players     the names at the table, comma-separated, seat 0 first: yours, then the computers'
 *   size        `1` for a single hand (the default), `200` or `500` points
 *   seed        the number the deals are shuffled from; a fresh one if not given
 *   lang        `ja` for Japanese; the page's language unless said
 *   sound       card sounds, when present (off unless asked)
 *
 * Every move is also announced as a `hitotsu-move` event, with the game it made in `detail`.
 * The table is the package's own `mountHitotsu`, drawn in the element itself so
 * that the page's own CSS reaches it: its colours are the `--ht-` variables
 * on `.ht-root`, as `README.md` lists.
 *
 * `./element` exports the class and `defineHitotsuTable()` with no effect of
 * its own; `./element/define` (once `./element-define`, which still works) registers it by being imported.
 */
import { HITOTSU_CLASSIC, HITOTSU_PARTY } from "./constants.ts";
import { mountHitotsu, type HitotsuHandle } from "./ui/mount.ts";
import { hitotsuLanguageOf, hitotsuStrings } from "./ui/strings.ts";
import type { HitotsuGame } from "./types.ts";

/** What the element extends: HTMLElement, or on a server, where there is none, an empty class, so that importing it never throws. */
const ElementBase: typeof HTMLElement = typeof HTMLElement === "undefined" ? (class {} as unknown as typeof HTMLElement) : HTMLElement;

const ATTRIBUTES = ["rules", "computers", "players", "size", "seed", "lang", "sound"] as const;

/** A whole number in an attribute, or `undefined` for anything else. */
function whole(text: string | null): number | undefined {
  if (text === null || text.trim() === "") return undefined;
  const value = Number(text);
  return Number.isInteger(value) ? value : undefined;
}

export class HitotsuTableElement extends ElementBase {
  static observedAttributes = ATTRIBUTES;
  #table: HitotsuHandle | null = null;
  #watch: MutationObserver | null = null;

  /** The game as it stands, or `null` before the element is on a page. */
  get game(): HitotsuGame | null {
    return this.#table?.game() ?? null;
  }

  /** Deal again, the same table. */
  deal(): void {
    this.#draw();
  }

  connectedCallback(): void {
    this.#draw();
    // A language chooser changes `<html lang>`: the table says its words again.
    if (this.getAttribute("lang") === null && typeof MutationObserver !== "undefined") {
      this.#watch = new MutationObserver(() => this.#draw());
      this.#watch.observe(this.ownerDocument.documentElement, { attributes: true, attributeFilter: ["lang"] });
    }
  }

  disconnectedCallback(): void {
    this.#watch?.disconnect();
    this.#watch = null;
    this.#table?.destroy();
    this.#table = null;
  }

  attributeChangedCallback(_name: string, before: string | null, now: string | null): void {
    if (this.#table !== null && before !== now) this.#draw();
  }

  #draw(): void {
    this.#table?.destroy();
    const named = this.getAttribute("players");
    const names = named?.split(",").map((name) => name.trim()).filter((name) => name !== "");
    const computers = whole(this.getAttribute("computers"));
    const size = whole(this.getAttribute("size"));
    const seed = whole(this.getAttribute("seed"));
    const language = hitotsuLanguageOf(this.closest("[lang]")?.getAttribute("lang") ?? this.ownerDocument.documentElement.lang);
    const words = hitotsuStrings(language);
    const players = names !== undefined && names.length >= 2 && names.length <= 8 ? names : computers !== undefined && computers >= 1 && computers <= 7 ? [words.you, ...Array.from({ length: computers }, (_, at) => words.computer(at + 1))] : undefined;
    const off = ["off", "false", "0", "no"].includes((this.getAttribute("sound") ?? "").toLowerCase());
    this.#table = mountHitotsu(this, {
      rules: this.getAttribute("rules") === "party" ? HITOTSU_PARTY : HITOTSU_CLASSIC,
      language,
      ...(players === undefined ? {} : { players }),
      ...(size === undefined ? {} : { size }),
      ...(seed === undefined ? {} : { seed }),
      ...(this.hasAttribute("sound") && !off ? { sound: true } : {}),
      onMove: (game) => this.dispatchEvent(new CustomEvent("hitotsu-move", { detail: game, bubbles: true })),
    });
  }
}

/** Registers `<hitotsu-table>`, once. Nothing happens where there is no browser. */
export function defineHitotsuTable(): void {
  if (typeof customElements === "undefined") return;
  if (customElements.get("hitotsu-table") === undefined) customElements.define("hitotsu-table", HitotsuTableElement);
}
