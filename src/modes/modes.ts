import { HITOTSU_COLOURS } from "../constants.ts";
import { mixSeed, seededRandom } from "../random.ts";
import type { HitotsuColour, HitotsuMode } from "../types.ts";

/**
 * THE WAYS HITOTSU CAN BE PLAYED besides the classic deck, each a small rule laid over the same engine:
 *
 * - `all-wild`: a deck with no colours and no numbers, only wilds. Every card goes on any card; Skip, Reverse and Draw
 *   Two are wilds as well, and the colour of the next card is whatever is called.
 * - `launcher`: no draw pile to count. When a player must draw, a launcher fires a random number of cards at them (1 to
 *   4 when they cannot play, 2 to 6 for a Draw Two, 4 to 10 for a Wild Draw Four), and nobody can stack a draw card.
 *
 * Each is chosen at the set-up as the table's `mode`, and `classic` is the game as it always was.
 */

/** The modes a table can be set up with, the classic deck first.
 *
 * @example
 * ```ts
 * import { HITOTSU_MODES } from "@johnmorrisdotca/hitotsu";
 * console.log(HITOTSU_MODES);
 * ```
 */
export const HITOTSU_MODES: readonly HitotsuMode[] = ["classic", "all-wild", "launcher"];

/** The colour an all-wild hand opens on, from the seed: there is no coloured card to start it.
 *
 * @param seed - The game's seed.
 * @param hand - Which hand of the game it is.
 * @returns The colour the first card is taken to be.
 *
 * @example
 * ```ts
 * import { hitotsuOpeningColour } from "@johnmorrisdotca/hitotsu";
 * console.log(hitotsuOpeningColour(42, 0));
 * ```
 */
export function hitotsuOpeningColour(seed: number, hand: number): HitotsuColour {
  return HITOTSU_COLOURS[Math.floor(seededRandom(mixSeed(seed, 9000 + hand))() * HITOTSU_COLOURS.length)]!;
}

/** How many cards the launcher fires, from the seed and how many moves have been made: the same for the same game, never the same twice in a row.
 *
 * @param seed - The game's seed.
 * @param moves - How many moves the game has had.
 * @param least - The fewest cards.
 * @param most - The most cards.
 * @returns A whole number from `least` to `most`.
 *
 * @example
 * ```ts
 * import { hitotsuLaunch } from "@johnmorrisdotca/hitotsu";
 * console.log(hitotsuLaunch(42, 7, 1, 4));
 * ```
 */
export function hitotsuLaunch(seed: number, moves: number, least: number, most: number): number {
  return least + Math.floor(seededRandom(mixSeed(seed, 7000 + moves))() * (most - least + 1));
}
