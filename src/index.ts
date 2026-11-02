/**
 * Hitotsu 一つ: a colour-card shedding game for two to eight, with the house
 * rules people actually play.
 *
 * The core is plain functions over plain data, with no dependency and no DOM:
 * deal, list the legal moves, play one, score the hand, let a computer choose,
 * and keep a game as a line of text. Every function returns a new game and
 * leaves the one it was given alone. The card design is `./card.ts`, the
 * table for several devices `./table.ts`, and a table to play in any page is
 * `mountHitotsu` in `./ui/mount.ts`, exported here too.
 */

export * from "./card.ts";
export * from "./codec.ts";
export * from "./computer.ts";
export * from "./constants.ts";
export * from "./deck.ts";
export * from "./modes/modes.ts";
export * from "./random.ts";
export * from "./rules.ts";
export * from "./seat.ts";
export * from "./table.ts";
export * from "./types.ts";
export { type Cloth, clothVars, HITOTSU_CLOTHS, isCloth } from "./ui/cloth.ts";
export { type HitotsuHandle, type HitotsuTableOptions, mountHitotsu } from "./ui/mount.ts";
export {
  HITOTSU_STRINGS,
  HITOTSU_STRINGS_JA,
  type HitotsuLanguage,
  type HitotsuStrings,
  hitotsuLanguageOf,
  hitotsuStrings,
} from "./ui/strings.ts";
export * from "./version.ts";
