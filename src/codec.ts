import { HITOTSU_COLOURS } from "./constants.ts";
import { isHitotsuCard } from "./deck.ts";
import { playHitotsu, startHitotsu } from "./rules.ts";
import type { HitotsuColour, HitotsuGame, HitotsuMove, HitotsuOptions } from "./types.ts";

/**
 * A GAME OF HITOTSU AS TEXT, and back: its table (the size, the names, which
 * seats a computer plays, the house rules), the seed its deals are shuffled
 * from, and every move in order — never a hand or a pile, which the moves make
 * again. Read back, the game is started from its table and seed and every move
 * played again through the rules, so what comes back is exactly the game those
 * moves make, or nothing.
 */

const KEPT_VERSION = 1;
const KEPT_NAME = "hitotsu";

const isColour = (value: unknown) => typeof value === "string" && (HITOTSU_COLOURS as readonly string[]).includes(value);
const isSeat = (value: unknown) => Number.isInteger(value) && (value as number) >= 0 && (value as number) < 8;

/** House rules as something sent them, checked for shape, or null.
 *
 * @param value - The unknown card, move or rules value to validate.
 * @returns Validated house rules, or null when the object does not have the supported fields and values.
 * @example
 * ```ts
 * import { HITOTSU_PARTY, readHitotsuOptions } from "@johnmorrisdotca/hitotsu";
 *
 * console.log(readHitotsuOptions(HITOTSU_PARTY));
 * ```
 */
export function readHitotsuOptions(value: unknown): HitotsuOptions | null {
  if (typeof value !== "object" || value === null) return null;
  const { stacking, jumpIn, sevenZero, drawToMatch, wildFour, deal } = value as Record<string, unknown>;
  if (stacking !== "off" && stacking !== "same" && stacking !== "any") return null;
  if (typeof jumpIn !== "boolean" || typeof sevenZero !== "boolean" || typeof drawToMatch !== "boolean") return null;
  if (wildFour !== "challenge" && wildFour !== "strict") return null;
  if (deal !== 7 && deal !== 5) return null;
  return { stacking, jumpIn, sevenZero, drawToMatch, wildFour, deal };
}

/** A move as something sent it, checked for its shape only: whether it may be made is the rules'.
 *
 * @param value - The unknown card, move or rules value to validate.
 * @returns A structurally valid move, or null for an invalid shape. Use playHitotsu to check whether it is legal now.
 * @example
 * ```ts
 * import { readHitotsuMove } from "@johnmorrisdotca/hitotsu";
 *
 * console.log(readHitotsuMove({ draw: true }));
 * ```
 */
export function readHitotsuMove(value: unknown): HitotsuMove | null {
  if (typeof value !== "object" || value === null) return null;
  const move = value as Record<string, unknown>;
  const extras = (from: Record<string, unknown>) => {
    if (from.colour !== undefined && !isColour(from.colour)) return null;
    if (from.swap !== undefined && !isSeat(from.swap)) return null;
    if (from.call !== undefined && typeof from.call !== "boolean") return null;
    return {
      ...(from.colour === undefined ? {} : { colour: from.colour as HitotsuColour }),
      ...(from.swap === undefined ? {} : { swap: from.swap as number }),
      ...(from.call === undefined ? {} : { call: from.call as boolean }),
    };
  };
  if (isHitotsuCard(move.play)) {
    const more = extras(move);
    return more === null ? null : { play: move.play, ...more };
  }
  if (isHitotsuCard(move.jump) && isSeat(move.seat)) {
    const more = extras(move);
    return more === null ? null : { jump: move.jump, seat: move.seat as number, ...more };
  }
  if (move.draw === true) return { draw: true };
  if (move.pass === true) return { pass: true };
  if (move.take === true) return { take: true };
  if (move.challenge === true) return { challenge: true };
  return null;
}

/** Save the setup, seed and ordered move log as JSON text; hands and piles are reconstructed when decoded.
 *
 * @param game - The current native game; it is left unchanged.
 * @returns Save the setup, seed and ordered move log as JSON text; hands and piles are reconstructed when decoded.
 * @example
 * ```ts
 * import { HITOTSU_CLASSIC, encodeHitotsu, startHitotsu } from "@johnmorrisdotca/hitotsu";
 *
 * const game = startHitotsu(1, ["Aki", "Ben"], 42, HITOTSU_CLASSIC, [true, true])!;
 * console.log(encodeHitotsu(game));
 * ```
 */
export function encodeHitotsu(game: HitotsuGame): string {
  return JSON.stringify({ v: KEPT_VERSION, g: KEPT_NAME, size: game.size, players: game.players, computers: game.computers, seed: game.seed, options: game.options, moves: game.moves });
}

/** Read a saved setup and replay every logged move through the native rules; null for an unreadable, unsupported or illegal saved game.
 *
 * @param text - The encoded saved game, or null when none was supplied.
 * @returns Read a saved setup and replay every logged move through the native rules; null for an unreadable, unsupported or illegal saved game.
 * @example
 * ```ts
 * import { HITOTSU_CLASSIC, decodeHitotsu, encodeHitotsu, startHitotsu } from "@johnmorrisdotca/hitotsu";
 *
 * const game = startHitotsu(1, ["Aki", "Ben"], 42, HITOTSU_CLASSIC, [true, true])!;
 * console.log(decodeHitotsu(encodeHitotsu(game))?.hands[0]);
 * ```
 */
export function decodeHitotsu(text: string | null): HitotsuGame | null {
  if (text === null) return null;
  let kept: unknown;
  try {
    kept = JSON.parse(text);
  } catch {
    return null;
  }
  if (typeof kept !== "object" || kept === null) return null;
  const { v, g, size, players, computers, seed, options, moves } = kept as Record<string, unknown>;
  if (v !== KEPT_VERSION || g !== KEPT_NAME || typeof size !== "number" || typeof seed !== "number" || !Number.isInteger(seed)) return null;
  if (!Array.isArray(players) || !players.every((name) => typeof name === "string")) return null;
  if (!Array.isArray(computers) || computers.length !== players.length || !computers.every((seat) => typeof seat === "boolean")) return null;
  const house = readHitotsuOptions(options);
  if (house === null || !Array.isArray(moves)) return null;
  let game = startHitotsu(size, players as string[], seed, house, computers as boolean[]);
  for (const sent of moves) {
    const move = readHitotsuMove(sent);
    if (game === null || move === null) return null;
    game = playHitotsu(game, move);
  }
  return game;
}
