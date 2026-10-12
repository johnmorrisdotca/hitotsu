import { hitotsuJumpIns, hitotsuMoves } from "./rules.ts";
import type { HitotsuCard, HitotsuGame, HitotsuMove } from "./types.ts";

/**
 * ONE SEAT'S VIEW OF WHAT IT MAY DO: the questions a table asks the rules for
 * the player holding a hand — a table on one device and a table on several
 * alike, whatever draws them.
 */

/** A move that puts a card down: in turn, or jumping in.
 *
 * @example
 * ```ts
 * import type { HitotsuCardMove } from "@johnmorrisdotca/hitotsu";
 * import { cardOfMove } from "@johnmorrisdotca/hitotsu";
 *
 * const value: HitotsuCardMove = { play: "R70", call: true };
 * console.log(cardOfMove(value));
 * ```
 */
export type HitotsuCardMove = Extract<HitotsuMove, { play: HitotsuCard }> | Extract<HitotsuMove, { jump: HitotsuCard }>;

/** The card a card move puts down.
 *
 * @param move - The native move to apply, validate or inspect.
 * @returns The card a card move puts down.
 * @example
 * ```ts
 * import { cardOfMove } from "@johnmorrisdotca/hitotsu";
 *
 * console.log(cardOfMove({ play: "R70", call: true }));
 * ```
 */
export const cardOfMove = (move: HitotsuCardMove): HitotsuCard => ("play" in move ? move.play : move.jump);

/** Everything this seat may do now: its own turn's moves, or, at another's turn, the cards it may jump in with.
 *
 * @param game - The current native game; it is left unchanged.
 * @param seat - The zero-based seat whose choices are requested.
 * @returns Everything this seat may do now: its own turn's moves, or, at another's turn, the cards it may jump in with.
 * @example
 * ```ts
 * import { HITOTSU_CLASSIC, movesFor, startHitotsu } from "@johnmorrisdotca/hitotsu";
 *
 * const game = startHitotsu(1, ["Aki", "Ben"], 42, HITOTSU_CLASSIC, [true, true])!;
 * console.log(movesFor(game, 0));
 * ```
 */
export function movesFor(game: HitotsuGame, seat: number): HitotsuMove[] {
  if (game.toPlay === seat) return hitotsuMoves(game);
  return hitotsuJumpIns(game).filter((move) => "jump" in move && move.seat === seat);
}

/** The cards this seat may play now, in turn or jumping in.
 *
 * @param game - The current native game; it is left unchanged.
 * @param seat - The zero-based seat whose choices are requested.
 * @returns The cards this seat may play now, in turn or jumping in.
 * @example
 * ```ts
 * import { HITOTSU_CLASSIC, playableFor, startHitotsu } from "@johnmorrisdotca/hitotsu";
 *
 * const game = startHitotsu(1, ["Aki", "Ben"], 42, HITOTSU_CLASSIC, [true, true])!;
 * console.log(playableFor(game, 0));
 * ```
 */
export function playableFor(game: HitotsuGame, seat: number): HitotsuCard[] {
  return [...new Set(movesFor(game, seat).flatMap((move) => ("play" in move ? [move.play] : "jump" in move ? [move.jump] : [])))];
}

/** Whether the call is a choice now: this seat is about to play its second-last card.
 *
 * @param game - The current native game; it is left unchanged.
 * @param seat - The zero-based seat whose choices are requested.
 * @returns Whether the call is a choice now: this seat is about to play its second-last card.
 * @example
 * ```ts
 * import { HITOTSU_CLASSIC, callMatters, startHitotsu } from "@johnmorrisdotca/hitotsu";
 *
 * const game = startHitotsu(1, ["Aki", "Ben"], 42, HITOTSU_CLASSIC, [true, true])!;
 * console.log(callMatters(game, 0));
 * ```
 */
export function callMatters(game: HitotsuGame, seat: number): boolean {
  return movesFor(game, seat).some((move) => ("play" in move || "jump" in move) && move.call === true);
}

/** The ways this card may go down, the call made or not as the player said (where that is a choice).
 *
 * @param game - The current native game; it is left unchanged.
 * @param seat - The zero-based seat whose choices are requested.
 * @param card - The physical card id; null draws the back where supported.
 * @param call - Whether the player made the last-card call.
 * @returns The ways this card may go down, the call made or not as the player said (where that is a choice).
 * @example
 * ```ts
 * import { HITOTSU_CLASSIC, startHitotsu, waysFor } from "@johnmorrisdotca/hitotsu";
 *
 * const game = startHitotsu(1, ["Aki", "Ben"], 42, HITOTSU_CLASSIC, [true, true])!;
 * console.log(waysFor(game, 0, game.hands[0]![0]!, true));
 * ```
 */
export function waysFor(game: HitotsuGame, seat: number, card: HitotsuCard, call: boolean): HitotsuCardMove[] {
  const matters = callMatters(game, seat);
  return movesFor(game, seat)
    .filter((move): move is HitotsuCardMove => ("play" in move || "jump" in move) && cardOfMove(move) === card)
    .filter((move) => (move.call === true) === call || !matters);
}

/** What a card tapped twice plays: its one way, or null where there is a colour or a seat to choose.
 *
 * @param game - The current native game; it is left unchanged.
 * @param seat - The zero-based seat whose choices are requested.
 * @param card - The physical card id; null draws the back where supported.
 * @param call - Whether the player made the last-card call.
 * @returns What a card tapped twice plays: its one way, or null where there is a colour or a seat to choose.
 * @example
 * ```ts
 * import { HITOTSU_CLASSIC, quickMove, startHitotsu } from "@johnmorrisdotca/hitotsu";
 *
 * const game = startHitotsu(1, ["Aki", "Ben"], 42, HITOTSU_CLASSIC, [true, true])!;
 * console.log(quickMove(game, 0, game.hands[0]![0]!, true));
 * ```
 */
export function quickMove(game: HitotsuGame, seat: number, card: HitotsuCard, call: boolean): HitotsuMove | null {
  const ways = waysFor(game, seat, card, call);
  return ways.length === 1 ? ways[0]! : null;
}
