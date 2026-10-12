import { mixSeed, seededRandom, shuffled } from "./random.ts";
import { HITOTSU_COLOURS, HITOTSU_POINTS } from "./constants.ts";
import type { HitotsuCard, HitotsuColour } from "./types.ts";

/**
 * HITOTSU'S DECK, as the rules see it: 108 short names. Each colour has one
 * zero, two of each number one to nine, and two each of Skip, Reverse and
 * Draw Two; then four Wilds and four Wild Draw Fours.
 *
 * A name is its colour letter, its face and its copy (`R50`, `R51`), so a
 * hand of two red fives holds two different names and a rule can take one of
 * them away without the other.
 *
 * @example
 * ```ts
 * import { SKIP } from "@johnmorrisdotca/hitotsu";
 * console.log(SKIP);
 * ```
 */

export const SKIP = "S";
/** The face code for a Reverse card.
 *
 * @example
 * ```ts
 * import { REVERSE } from "@johnmorrisdotca/hitotsu";
 * console.log(REVERSE);
 * ```
 */
export const REVERSE = "R";
/** The face code for a Draw Two card.
 *
 * @example
 * ```ts
 * import { DRAW_TWO } from "@johnmorrisdotca/hitotsu";
 * console.log(DRAW_TWO);
 * ```
 */
export const DRAW_TWO = "D";
/** The face code for a Wild card.
 *
 * @example
 * ```ts
 * import { WILD } from "@johnmorrisdotca/hitotsu";
 * console.log(WILD);
 * ```
 */
export const WILD = "W";
/** The face code for a Wild Draw Four card.
 *
 * @example
 * ```ts
 * import { WILD_FOUR } from "@johnmorrisdotca/hitotsu";
 * console.log(WILD_FOUR);
 * ```
 */
export const WILD_FOUR = "F";

const FACES_TWICE = ["1", "2", "3", "4", "5", "6", "7", "8", "9", SKIP, REVERSE, DRAW_TWO];

/** Every card, in the deck's own order.
 *
 * @example
 * ```ts
 * import { HITOTSU_DECK } from "@johnmorrisdotca/hitotsu";
 * console.log(HITOTSU_DECK.slice(0, 8));
 * ```
 */
export const HITOTSU_DECK: readonly HitotsuCard[] = [
  ...HITOTSU_COLOURS.flatMap((colour) => [`${colour}00`, ...FACES_TWICE.flatMap((face) => [`${colour}${face}0`, `${colour}${face}1`])]),
  ...[0, 1, 2, 3].flatMap((copy) => [`W${WILD}${copy}`, `W${WILD_FOUR}${copy}`]),
];

const EVERY_CARD = new Set(HITOTSU_DECK);

/** Whether an unknown value is an actual physical card id from the deck.
 *
 * @param value - The unknown card, move or rules value to validate.
 * @returns Whether an unknown value is an actual physical card id from the deck.
 * @example
 * ```ts
 * import { isHitotsuCard } from "@johnmorrisdotca/hitotsu";
 *
 * console.log(isHitotsuCard("R70"));
 * ```
 */
export function isHitotsuCard(value: unknown): value is HitotsuCard {
  return typeof value === "string" && EVERY_CARD.has(value);
}

/** A card's colour, or null for a wild.
 *
 * @param card - The physical card id; null draws the back where supported.
 * @returns The card’s colour, or null for a wild card.
 * @example
 * ```ts
 * import { colourOf } from "@johnmorrisdotca/hitotsu";
 *
 * console.log(colourOf("WW0"));
 * ```
 */
export function colourOf(card: HitotsuCard): HitotsuColour | null {
  return card[0] === "W" ? null : (card[0] as HitotsuColour);
}

/** A card's face: a digit, or S, R, D, W, F.
 *
 * @param card - The physical card id; null draws the back where supported.
 * @returns A card's face: a digit, or S, R, D, W, F.
 * @example
 * ```ts
 * import { faceOf } from "@johnmorrisdotca/hitotsu";
 *
 * console.log(faceOf("R70"));
 * ```
 */
export function faceOf(card: HitotsuCard): string {
  return card[1] ?? "";
}

/** Whether two cards are the same card to play (the two red fives are).
 *
 * @param a - The first physical card.
 * @param b - The second physical card.
 * @returns Whether two cards are the same card to play (the two red fives are).
 * @example
 * ```ts
 * import { identical } from "@johnmorrisdotca/hitotsu";
 *
 * console.log(identical("R50", "R51"));
 * ```
 */
export function identical(a: HitotsuCard, b: HitotsuCard): boolean {
  return a.slice(0, 2) === b.slice(0, 2);
}

/** Whether a card is a Wild or Wild Draw Four.
 *
 * @param card - The physical card id; null draws the back where supported.
 * @returns Whether a card is a Wild or Wild Draw Four.
 * @example
 * ```ts
 * import { isWild } from "@johnmorrisdotca/hitotsu";
 *
 * console.log(isWild("WF0"));
 * ```
 */
export function isWild(card: HitotsuCard): boolean {
  return card[0] === "W";
}

/** Whether a card makes somebody draw: a Draw Two or a Wild Draw Four.
 *
 * @param card - The physical card id; null draws the back where supported.
 * @returns Whether a card makes somebody draw: a Draw Two or a Wild Draw Four.
 * @example
 * ```ts
 * import { isDrawCard } from "@johnmorrisdotca/hitotsu";
 *
 * console.log(isDrawCard("RD0"));
 * ```
 */
export function isDrawCard(card: HitotsuCard): boolean {
  return faceOf(card) === DRAW_TWO || faceOf(card) === WILD_FOUR;
}

/** Whether a card is a number, 0 to 9.
 *
 * @param card - The physical card id; null draws the back where supported.
 * @returns Whether a card is a number, 0 to 9.
 * @example
 * ```ts
 * import { isNumber } from "@johnmorrisdotca/hitotsu";
 *
 * console.log(isNumber("R70"));
 * ```
 */
export function isNumber(card: HitotsuCard): boolean {
  return !isWild(card) && /\d/.test(faceOf(card));
}

/** What a card left in hand is worth to the player who went out.
 *
 * @param card - The physical card id; null draws the back where supported.
 * @returns What a card left in hand is worth to the player who went out.
 * @example
 * ```ts
 * import { hitotsuPoints } from "@johnmorrisdotca/hitotsu";
 *
 * console.log(hitotsuPoints("WF0"));
 * ```
 */
export function hitotsuPoints(card: HitotsuCard): number {
  if (isWild(card)) return HITOTSU_POINTS.wild;
  return isNumber(card) ? Number(faceOf(card)) : HITOTSU_POINTS.action;
}

/** A hand as a player holds it: by colour, numbers then actions, the wilds last.
 *
 * @param hand - The hand number for deterministic shuffling, or the held cards where an array is accepted.
 * @returns A hand as a player holds it: by colour, numbers then actions, the wilds last.
 * @example
 * ```ts
 * import { sortHitotsu } from "@johnmorrisdotca/hitotsu";
 *
 * console.log(sortHitotsu(["WW0", "B20", "R70"]));
 * ```
 */
export function sortHitotsu(hand: readonly HitotsuCard[]): HitotsuCard[] {
  const faces = "0123456789SRDWF";
  const key = (card: HitotsuCard) => (isWild(card) ? 400 : HITOTSU_COLOURS.indexOf(card[0] as HitotsuColour) * 100) + faces.indexOf(faceOf(card));
  return [...hand].sort((a, b) => key(a) - key(b) || a.localeCompare(b));
}

const COLOUR_WORDS: Record<HitotsuColour, string> = { R: "red", Y: "yellow", G: "green", B: "blue" };
const FACE_WORDS: Record<string, string> = { S: "skip", R: "reverse", D: "draw two", W: "wild", F: "wild draw four" };

const COLOUR_WORDS_JA: Record<HitotsuColour, string> = { R: "赤", Y: "黄", G: "緑", B: "青" };
const FACE_WORDS_JA: Record<string, string> = { S: "スキップ", R: "リバース", D: "ドロー2", W: "ワイルド", F: "ワイルドドローフォー" };

/** A colour’s name in English or Japanese.
 *
 * @param colour - The colour to name.
 * @param language - English or Japanese for the displayed words.
 * @returns A colour’s name in English or Japanese.
 * @example
 * ```ts
 * import { colourWords } from "@johnmorrisdotca/hitotsu";
 *
 * console.log(colourWords("R", "ja"));
 * ```
 */
export function colourWords(colour: HitotsuColour, language: "en" | "ja" = "en"): string {
  return (language === "ja" ? COLOUR_WORDS_JA : COLOUR_WORDS)[colour];
}

/** "red five", "blue draw two", "wild draw four", as a sentence and a screen reader say it; in Japanese, "赤の5", "青のドロー2", "ワイルドドローフォー".
 *
 * @param card - The physical card id; null draws the back where supported.
 * @param language - English or Japanese for the displayed words.
 * @returns "red five", "blue draw two", "wild draw four", as a sentence and a screen reader say it; in Japanese, "赤の5", "青のドロー2", "ワイルドドローフォー".
 * @example
 * ```ts
 * import { hitotsuWords } from "@johnmorrisdotca/hitotsu";
 *
 * console.log(hitotsuWords("R70", "en"));
 * ```
 */
export function hitotsuWords(card: HitotsuCard, language: "en" | "ja" = "en"): string {
  const face = faceOf(card);
  if (language === "ja") {
    const named = FACE_WORDS_JA[face] ?? face;
    const colour = colourOf(card);
    return colour === null ? named : `${COLOUR_WORDS_JA[colour]}の${named}`;
  }
  const named = FACE_WORDS[face] ?? ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"][Number(face)] ?? face;
  const colour = colourOf(card);
  return colour === null ? named : `${COLOUR_WORDS[colour]} ${named}`;
}

/** The deck shuffled for one hand of one game: the same seed and hand always the same order.
 *
 * @param seed - The numeric seed that reproduces the same random sequence or deal.
 * @param hand - The hand number for deterministic shuffling, or the held cards where an array is accepted.
 * @returns The deck shuffled for one hand of one game: the same seed and hand always the same order.
 * @example
 * ```ts
 * import { shuffledHitotsu } from "@johnmorrisdotca/hitotsu";
 *
 * console.log(shuffledHitotsu(42, 0).slice(0, 7));
 * ```
 */
export function shuffledHitotsu(seed: number, hand: number): HitotsuCard[] {
  return shuffled(HITOTSU_DECK, seededRandom(mixSeed(seed, hand)));
}

/** These cards shuffled again, the same way for the same seed and salt: a pile turned over to make a new stock.
 *
 * @param cards - The cards to reshuffle, in their current order.
 * @param seed - The numeric seed that reproduces the same random sequence or deal.
 * @param salt - The extra integer mixed with the seed for this reshuffle.
 * @returns These cards shuffled again, the same way for the same seed and salt: a pile turned over to make a new stock.
 * @example
 * ```ts
 * import { reshuffledHitotsu } from "@johnmorrisdotca/hitotsu";
 *
 * console.log(reshuffledHitotsu(["R70", "B20", "WW0"], 42, 1));
 * ```
 */
export function reshuffledHitotsu(cards: readonly HitotsuCard[], seed: number, salt: number): HitotsuCard[] {
  return shuffled(cards, seededRandom(mixSeed(seed, salt)));
}
