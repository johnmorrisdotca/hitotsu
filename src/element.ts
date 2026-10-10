import { HITOTSU_CLASSIC, HITOTSU_PARTY } from "./constants.ts";
import { freshSeed, SEED_MOST } from "./random.ts";
import { mountHitotsu, type HitotsuHandle, type HitotsuTableOptions } from "./ui/mount.ts";
import { hitotsuLanguageOf, hitotsuStrings } from "./ui/strings.ts";
import { CSS } from "./ui/style.ts";
import type { HitotsuGame } from "./types.ts";

const ElementBase: typeof HTMLElement = typeof HTMLElement === "undefined" ? (class {} as unknown as typeof HTMLElement) : HTMLElement;
const isOn = (value: string | null, fallback = false): boolean => value === null ? fallback : !["false", "off", "no", "0"].includes(value.trim().toLowerCase());
const whole = (text: string | null): number | undefined => text === null || text.trim() === "" || !Number.isInteger(Number(text)) ? undefined : Number(text);

/** Native option keys checked by the builder.
 * @example
 * ```ts
 * import { HITOTSU_EMBED_OPTION_KEYS } from "@johnmorrisdotca/hitotsu/element";
 * console.log(HITOTSU_EMBED_OPTION_KEYS.includes("players"));
 * ```
 */
export const HITOTSU_EMBED_OPTION_KEYS = Object.keys({ players: true, computers: true, rules: true, size: true, seed: true, language: true, strings: true, computerMs: true, theme: true, sound: true, onMove: true } satisfies Record<keyof HitotsuTableOptions, boolean>);
/** Host-only settings, including custom house rules and private names.
 * @example
 * ```ts
 * import type { HitotsuElementOptions } from "@johnmorrisdotca/hitotsu/element";
 * const options: HitotsuElementOptions = { seed: 42 };
 * console.log(options.seed);
 * ```
 */
export type HitotsuElementOptions = HitotsuTableOptions;
/** A native playable colour-card table with reflected settings.
 * Numeric size=1/200/500 remains a match-points alias; symbolic size controls display.
 * Move event games use generic seat names; the local getter and callbacks retain names.
 * @example
 * ```ts
 * import { HitotsuTableElement } from "@johnmorrisdotca/hitotsu/element";
 * console.log(HitotsuTableElement.observedAttributes.includes("points"));
 * ```
 */
export class HitotsuTableElement extends ElementBase {
  static observedAttributes = ["rules", "computers", "players", "size", "seed", "lang", "sound", "points", "theme", "width", "label"];
  #table: HitotsuHandle | null = null;
  #options: HitotsuElementOptions = {};
  #key = "";
  #seed = freshSeed();
  #queued = false;
  #watch: MutationObserver | null = null;
  #widthBefore: string | null = null;
  #widthOwned = false;
  #labelBefore: { role: string | null; label: string | null } | null = null;
  /** Native options; changes to words, palettes and callbacks preserve play. */
  get options(): HitotsuElementOptions { return this.#options; }
  set options(value: HitotsuElementOptions) { this.#options = value ?? {}; if (this.isConnected) this.#draw(); }
  /** The private native game, or null before mounting. */
  get game(): HitotsuGame | null { return this.#table?.game() ?? null; }
  /** The live native handle, or null before mounting. */
  get table(): HitotsuHandle | null { return this.#table; }
  /** Redeal, retaining the choices; an explicit seed reproduces the deal.
   * @returns Nothing; the load event announces the new table.
   * @example
   * ```ts
   * import type { HitotsuTableElement } from "@johnmorrisdotca/hitotsu/element";
   * const again = (table: HitotsuTableElement) => table.deal();
   * console.log(typeof again);
   * ```
   */
  deal(): void { this.#seed = freshSeed(); this.#key = ""; if (this.isConnected) this.#draw(); }
  #write(name: string, value: unknown): void { if (value === null || value === undefined) this.removeAttribute(name); else this.setAttribute(name, String(value)); }
  connectedCallback(): void {
    this.#draw();
    this.#watch = new MutationObserver(() => { if (!this.hasAttribute("lang")) this.#draw(); });
    this.#watch.observe(this.ownerDocument.documentElement, { attributes: true, attributeFilter: ["lang"] });
  }
  disconnectedCallback(): void { this.#watch?.disconnect(); this.#watch = null; this.#table?.destroy(); this.#table = null; this.#key = ""; }
  attributeChangedCallback(_name: string, before: string | null, now: string | null): void {
    if (before === now || !this.isConnected || this.#queued) return;
    this.#queued = true; queueMicrotask(() => { this.#queued = false; if (this.isConnected) this.#draw(); });
  }
  /** The `rules` attribute, reflected. */
  get rules(): string | null { return this.getAttribute("rules"); }
  set rules(value: string | number | boolean | null | undefined) { this.#write("rules", value); }
  /** The `computers` attribute, reflected. */
  get computers(): string | null { return this.getAttribute("computers"); }
  set computers(value: string | number | boolean | null | undefined) { this.#write("computers", value); }
  /** The `players` attribute, reflected. */
  get players(): string | null { return this.getAttribute("players"); }
  set players(value: string | number | boolean | null | undefined) { this.#write("players", value); }
  /** The `size` attribute, reflected. */
  get size(): string | null { return this.getAttribute("size"); }
  set size(value: string | number | boolean | null | undefined) { this.#write("size", value); }
  /** The `seed` attribute, reflected. */
  get seed(): string | null { return this.getAttribute("seed"); }
  set seed(value: string | number | boolean | null | undefined) { this.#write("seed", value); }
  /** The `sound` attribute, reflected. */
  get sound(): string | null { return this.getAttribute("sound"); }
  set sound(value: string | number | boolean | null | undefined) { this.#write("sound", value); }
  /** The `points` attribute, reflected. */
  get points(): string | null { return this.getAttribute("points"); }
  set points(value: string | number | boolean | null | undefined) { this.#write("points", value); }
  /** The `theme` attribute, reflected. */
  get theme(): string | null { return this.getAttribute("theme"); }
  set theme(value: string | number | boolean | null | undefined) { this.#write("theme", value); }
  /** The `width` attribute, reflected. */
  get width(): string | null { return this.getAttribute("width"); }
  set width(value: string | number | boolean | null | undefined) { this.#write("width", value); }
  /** The `label` attribute, reflected. */
  get label(): string | null { return this.getAttribute("label"); }
  set label(value: string | number | boolean | null | undefined) { this.#write("label", value); }
  #frame(): void {
    this.style.display = "block"; this.style.maxWidth = "100%";
    const width = Number(this.getAttribute("width")), size = this.getAttribute("size");
    const pixels = this.hasAttribute("width") && width > 0 && Number.isFinite(width) ? Math.min(width, 2000) : size === "small" ? 320 : size === "medium" ? 480 : size === "large" ? 640 : null;
    if (pixels !== null) { if (!this.#widthOwned) this.#widthBefore = this.style.width; this.#widthOwned = true; this.style.width = `${pixels}px`; }
    else if (this.#widthOwned) { this.style.width = this.#widthBefore ?? ""; this.#widthOwned = false; }
    const theme = this.getAttribute("theme"); this.style.colorScheme = theme === "light" || theme === "dark" ? theme : "light dark";
    this.setAttribute("data-hitotsu-embed", "");
    const root = this.getRootNode(), target: ParentNode = typeof ShadowRoot !== "undefined" && root instanceof ShadowRoot ? root : this.ownerDocument.head;
    if (target.querySelector("style[data-hitotsu-embed-style]") === null) {
      const style = this.ownerDocument.createElement("style"); style.setAttribute("data-hitotsu-embed-style", "");
      const light = CSS.match(/\.ht-root \{([^}]+)\}/)?.[1] ?? "";
      const dark = CSS.match(/@media \(prefers-color-scheme: dark\) \{\s*\.ht-root:not\(\[data-theme="light"\]\) \{([^}]+)\}/)?.[1] ?? "";
      style.textContent = `[data-hitotsu-embed][theme="light"] .ht-root{${light}}[data-hitotsu-embed][theme="dark"] .ht-root{${dark}}[data-hitotsu-embed]>.ht-root{background:var(--ht-surface);padding:12px;border-radius:12px}`;
 target.append(style);
    }
    if (this.hasAttribute("label")) { this.#labelBefore ??= { role: this.getAttribute("role"), label: this.getAttribute("aria-label") }; this.setAttribute("role", "group"); this.setAttribute("aria-label", this.getAttribute("label")!); }
    else if (this.#labelBefore !== null) { for (const [name, value] of [["role", this.#labelBefore.role], ["aria-label", this.#labelBefore.label]]) { if (value === null) this.removeAttribute(name!); else this.setAttribute(name!, value!); } this.#labelBefore = null; }
  }

  #draw(): void {
    this.#frame();
    try {
      const language = hitotsuLanguageOf(this.closest("[lang]")?.getAttribute("lang") ?? this.#options.language ?? this.ownerDocument.documentElement.lang);
      const count = whole(this.getAttribute("computers")) ?? this.#options.computers;
      const named = this.getAttribute("players")?.split(",").map(name => name.trim()).filter(Boolean);
      const players = named ?? this.#options.players;
      if (players !== undefined && (players.length < 2 || players.length > 8 || players.some(name => name.length > 200))) throw new RangeError("Choose two to eight player names, at most 200 characters each.");
      if (count !== undefined && (count < 1 || count > 7)) throw new RangeError("Choose one to seven computers.");
      const actualPlayers = players;
      const points = whole(this.getAttribute("points")) ?? whole(this.getAttribute("size")) ?? this.#options.size ?? 1;
      if (![1, 200, 500].includes(points)) throw new RangeError("Choose 1, 200 or 500 match points.");
      const seed = whole(this.getAttribute("seed")) ?? this.#options.seed ?? this.#seed;
      if (!Number.isInteger(seed) || seed < 1 || seed > SEED_MOST) throw new RangeError("Choose a seed from 1 to 2147483647.");
      const rules = this.hasAttribute("rules") ? this.getAttribute("rules") === "party" ? HITOTSU_PARTY : HITOTSU_CLASSIC : this.#options.rules ?? HITOTSU_CLASSIC;
      const sound = isOn(this.getAttribute("sound"), this.#options.sound !== undefined && this.#options.sound !== false) ? (typeof this.#options.sound === "object" ? this.#options.sound : true) : false;
      const key = JSON.stringify([actualPlayers, count, points, seed, rules, this.#options.computerMs]);
      const presentation = { language, strings: this.#options.strings, theme: this.#options.theme ?? {}, sound, onMove: (game: HitotsuGame) => {
        const detail = JSON.parse(JSON.stringify({ ...game, players: game.players.map((_, at) => `Seat ${at + 1}`) }));
        this.dispatchEvent(new CustomEvent("hitotsu-move", { detail, bubbles: true, composed: true }));
        this.#options.onMove?.(game);
        if (game.phase === "over") this.dispatchEvent(new CustomEvent("hitotsu-finish", { detail, bubbles: true, composed: true }));
      } };
      if (this.#table !== null && key === this.#key) { this.#table.set(presentation); return; }
      this.#table?.destroy(); this.#table = null; this.#key = ""; this.replaceChildren();
      this.#table = mountHitotsu(this, { ...this.#options, ...presentation, players: actualPlayers, computers: count, size: points, seed, rules }); this.#key = key;
      this.dispatchEvent(new CustomEvent("hitotsu-load", { detail: { seed, points, players: this.#table.game().players.length }, bubbles: true, composed: true }));
    } catch (error) {
      this.#table?.destroy(); this.#table = null; this.#key = "";
      const message = error instanceof Error ? error.message : String(error), status = this.ownerDocument.createElement("p");
      status.setAttribute("role", "status"); status.textContent = hitotsuLanguageOf(this.closest("[lang]")?.getAttribute("lang") ?? this.#options.language ?? this.ownerDocument.documentElement.lang) === "ja" ? hitotsuStrings("ja").embedError : message; this.replaceChildren(status);
      this.dispatchEvent(new CustomEvent("hitotsu-error", { detail: { message }, bubbles: true, composed: true }));
    }
  }
}
/** Register a default or custom-tag native table; safe on servers and idempotent.
 * @param tagName - The custom tag, defaulting to hitotsu-table.
 * @param registry - The browser registry, undefined on a server.
 * @returns Nothing; existing registrations are preserved.
 * @example
 * ```ts
 * import { defineHitotsuTable } from "@johnmorrisdotca/hitotsu/element";
 * defineHitotsuTable();
 * console.log(typeof defineHitotsuTable);
 * ```
 */
export function defineHitotsuTable(tagName = "hitotsu-table", registry: CustomElementRegistry | undefined = typeof customElements === "undefined" ? undefined : customElements): void {
  if (registry !== undefined && registry.get(tagName) === undefined) registry.define(tagName, tagName === "hitotsu-table" ? HitotsuTableElement : class extends HitotsuTableElement {});
}
/** Standard table registration helper.
 * @param tagName - The custom tag, defaulting to hitotsu-table.
 * @param registry - The browser registry, undefined on a server.
 * @returns Nothing; existing registrations are preserved.
 * @example
 * ```ts
 * import { defineTable } from "@johnmorrisdotca/hitotsu/element";
 * defineTable();
 * console.log(typeof defineTable);
 * ```
 */
export function defineTable(tagName = "hitotsu-table", registry: CustomElementRegistry | undefined = typeof customElements === "undefined" ? undefined : customElements): void { defineHitotsuTable(tagName, registry); }
