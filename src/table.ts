import { readHitotsuMove, readHitotsuOptions } from "./codec.ts";
import { hitotsuComputer } from "./computer.ts";
import { SEED_MOST } from "./random.ts";
import { startHitotsu } from "./rules.ts";
import type { HitotsuGame, HitotsuMove, HitotsuOptions } from "./types.ts";

/**
 * A TABLE ON SEVERAL DEVICES: what a server needs to run a game of Hitotsu
 * whose players each hold their own phone. The rules are the same pure ones a
 * table on one device plays; this is only what arrives over the wire, checked.
 *
 * The seed is drawn by whoever sets the table up and sent with the house
 * rules, so the server never needs a random number of its own, and the whole
 * game is its set-up and its moves (`encodeHitotsu`).
 *
 * NO JUMPING IN. A jump-in is a move made out of turn, a race for the card,
 * and a table on several devices takes one move at a time from the seat it
 * waits on; so the house rule is taken off at the start whatever was sent, and
 * a jump is never read as a move.
 */

/** What a set-up sends beyond a length and the seats: the seed it was dealt from, and the house rules.
 *
 * @example
 * ```ts
 * import type { HitotsuTableSetUp } from "@johnmorrisdotca/hitotsu";
 * import { HITOTSU_CLASSIC } from "@johnmorrisdotca/hitotsu";
 *
 * const value: HitotsuTableSetUp = { seed: 42, options: HITOTSU_CLASSIC };
 * console.log(value.seed);
 * ```
 */
export type HitotsuTableSetUp = { seed: number; options: HitotsuOptions };

/** The set-up as a device sent it, checked for its shape, jumping in taken off, or null.
 *
 * @param sent - Untrusted setup or move data received from a device.
 * @returns The set-up as a device sent it, checked for its shape, jumping in taken off, or null.
 * @example
 * ```ts
 * import { HITOTSU_PARTY, readTableSetUp } from "@johnmorrisdotca/hitotsu";
 *
 * console.log(readTableSetUp({ seed: 42, options: HITOTSU_PARTY }));
 * ```
 */
export function readTableSetUp(sent: unknown): HitotsuTableSetUp | null {
  if (typeof sent !== "object" || sent === null) return null;
  const { seed, options } = sent as Record<string, unknown>;
  if (typeof seed !== "number" || !Number.isInteger(seed) || seed < 1 || seed > SEED_MOST) return null;
  const read = readHitotsuOptions(options);
  return read === null ? null : { seed, options: { ...read, jumpIn: false } };
}

/**
 * A new table: `count` seats with blank names (a table's names are its seats',
 * written in when it is shown), the seats in `computers` played by the
 * computer player. Null for a set-up that does not read, or a table the rules
 * will not start.
 *
 * @param size - The match length: 1 for one hand, or 200 or 500 points.
 * @param count - The number of sounds or seats, according to the call.
 * @param sent - Untrusted setup or move data received from a device.
 * @param computers - Computer-controlled seats: flags for a game, seat indices for a shared table.
 * @returns A new table: `count` seats with blank names (a table's names are its seats', written in when it is shown), the seats in `computers` played by the computer player. null for a set-up that does not read, or a table the rules will not start.
 * @example
 * ```ts
 * import { HITOTSU_CLASSIC, startTable } from "@johnmorrisdotca/hitotsu";
 *
 * console.log(startTable(1, 4, { seed: 42, options: HITOTSU_CLASSIC }, [1, 2, 3])?.computers);
 * ```
 */
export function startTable(size: number, count: number, sent: unknown, computers: readonly number[] = []): HitotsuGame | null {
  const setUp = readTableSetUp(sent);
  if (setUp === null) return null;
  const blanks = new Array<string>(count).fill("");
  const played = new Set(computers);
  return startHitotsu(size, blanks, setUp.seed, setUp.options, blanks.map((_, seat) => played.has(seat)));
}

/** A move as a device sent it, checked for its shape, or null; a jump is never a move at a table on several devices.
 *
 * @param sent - Untrusted setup or move data received from a device.
 * @returns A structurally valid shared-table move, or null for invalid data or a jump-in move.
 * @example
 * ```ts
 * import { readTableMove } from "@johnmorrisdotca/hitotsu";
 *
 * console.log(readTableMove({ draw: true }));
 * ```
 */
export function readTableMove(sent: unknown): HitotsuMove | null {
  const move = readHitotsuMove(sent);
  return move === null || "jump" in move ? null : move;
}

/** The seat the table waits on, or null once the game is over.
 *
 * @param game - The current native game; it is left unchanged.
 * @returns The seat the table waits on, or null once the game is over.
 * @example
 * ```ts
 * import { HITOTSU_CLASSIC, startHitotsu, tableToPlay } from "@johnmorrisdotca/hitotsu";
 *
 * const game = startHitotsu(1, ["Aki", "Ben"], 42, HITOTSU_CLASSIC, [true, true])!;
 * console.log(tableToPlay(game));
 * ```
 */
export function tableToPlay(game: HitotsuGame): number | null {
  return game.phase === "over" ? null : game.toPlay;
}

/** The computer player's move for this seat, or null when the table is not waiting on it.
 *
 * @param game - The current native game; it is left unchanged.
 * @param seat - The zero-based seat whose choices are requested.
 * @returns The computer player's move for this seat, or null when the table is not waiting on it.
 * @example
 * ```ts
 * import { HITOTSU_CLASSIC, startHitotsu, tableComputerMove } from "@johnmorrisdotca/hitotsu";
 *
 * const game = startHitotsu(1, ["Aki", "Ben"], 42, HITOTSU_CLASSIC, [true, true])!;
 * console.log(tableComputerMove(game, game.toPlay!));
 * ```
 */
export function tableComputerMove(game: HitotsuGame, seat: number): HitotsuMove | null {
  return tableToPlay(game) === seat ? hitotsuComputer(game) : null;
}

/** The game with its seats' names written in, a seat with no name keeping the one it had.
 *
 * @param game - The current native game; it is left unchanged.
 * @param names - Names by seat; an undefined entry keeps the existing name.
 * @returns The game with its seats' names written in, a seat with no name keeping the one it had.
 * @example
 * ```ts
 * import { HITOTSU_CLASSIC, namedTable, startHitotsu } from "@johnmorrisdotca/hitotsu";
 *
 * const game = startHitotsu(1, ["Aki", "Ben"], 42, HITOTSU_CLASSIC, [true, true])!;
 * console.log(namedTable(game, ["One", "Two"]).players);
 * ```
 */
export function namedTable(game: HitotsuGame, names: readonly (string | undefined)[]): HitotsuGame {
  return { ...game, players: game.players.map((was, seat) => names[seat] ?? was) };
}
