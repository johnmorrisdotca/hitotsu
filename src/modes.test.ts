import { describe, expect, it } from "vitest";

import { decodeHitotsu, encodeHitotsu, readHitotsuOptions } from "./codec.ts";
import { hitotsuComputer, hitotsuComputerJump } from "./computer.ts";
import { HITOTSU_CLASSIC, HITOTSU_PARTY } from "./constants.ts";
import { colourOf, faceOf, HITOTSU_ALL_WILD_DECK, HITOTSU_DECK, hitotsuWords, isHitotsuCard, isWild } from "./deck.ts";
import { HITOTSU_MODES, hitotsuLaunch } from "./modes/modes.ts";
import { hitotsuMoves, hitotsuTop, playHitotsu, startHitotsu } from "./rules.ts";
import type { HitotsuGame, HitotsuOptions } from "./types.ts";

const wilds: HitotsuOptions = { ...HITOTSU_CLASSIC, mode: "all-wild" };
const launcher: HitotsuOptions = { ...HITOTSU_CLASSIC, mode: "launcher" };

/** A game played out by its computers, from the start; the game at its end. */
function playOut(options: HitotsuOptions, count: number, seed: number): HitotsuGame {
  const names = Array.from({ length: count }, (_, at) => `P${at}`);
  let game = startHitotsu(
    1,
    names,
    seed,
    options,
    names.map(() => true),
  )!;
  for (let step = 0; game.phase === "playing"; step += 1) {
    expect(step, "a game that does not end").toBeLessThan(20_000);
    const move = hitotsuComputerJump(game) ?? hitotsuComputer(game);
    expect(hitotsuMoves(game).length).toBeGreaterThan(0);
    game = playHitotsu(game, move)!;
    expect(game, `the rules refused ${JSON.stringify(move)}`).not.toBeNull();
  }
  return game;
}

describe("the modes", () => {
  it("name three: the classic game, a deck of wilds only, and a launcher", () => {
    expect(HITOTSU_MODES).toEqual(["classic", "all-wild", "launcher"]);
    expect(HITOTSU_CLASSIC.mode).toBe("classic");
    expect(HITOTSU_PARTY.mode).toBe("classic");
  });

  it("read back from a table kept before there were modes, as the classic game", () => {
    const { mode: _left, ...old } = HITOTSU_CLASSIC;
    expect(readHitotsuOptions(old)?.mode).toBe("classic");
    expect(readHitotsuOptions({ ...old, mode: "launcher" })?.mode).toBe("launcher");
    expect(readHitotsuOptions({ ...old, mode: "blitz" })).toBeNull();
  });

  it("leave the classic deal exactly as it was", () => {
    const game = startHitotsu(1, ["Aki", "Ben", "Cy"], 42, HITOTSU_CLASSIC)!;
    const again = startHitotsu(1, ["Aki", "Ben", "Cy"], 42, { ...HITOTSU_CLASSIC, mode: "launcher" })!;
    expect(again.hands).toEqual(game.hands);
    expect(again.discard).toEqual(game.discard);
  });
});

describe("all wild", () => {
  it("is a deck of 112 wilds with no colour and no number, every card a card of the game", () => {
    expect(HITOTSU_ALL_WILD_DECK).toHaveLength(112);
    expect(new Set(HITOTSU_ALL_WILD_DECK).size).toBe(112);
    for (const card of HITOTSU_ALL_WILD_DECK) {
      expect(colourOf(card)).toBeNull();
      expect(isWild(card)).toBe(true);
      expect(isHitotsuCard(card)).toBe(true);
    }
    expect(HITOTSU_ALL_WILD_DECK.filter((card) => !HITOTSU_DECK.includes(card)).length).toBeGreaterThan(0);
  });

  it("deals seven wilds to each seat and opens on a plain wild with a colour called from the seed", () => {
    const game = startHitotsu(1, ["Aki", "Ben", "Cy"], 5, wilds)!;
    expect(game.hands.map((hand) => hand.length)).toEqual([7, 7, 7]);
    expect(faceOf(hitotsuTop(game))).toBe("W");
    expect(["R", "Y", "G", "B"]).toContain(game.colour);
    expect(startHitotsu(1, ["Aki", "Ben", "Cy"], 5, wilds)!.colour).toBe(game.colour);
  });

  it("lets any card go on any card, in any of four colours called", () => {
    const game = startHitotsu(1, ["Aki", "Ben"], 5, wilds)!;
    const plays = hitotsuMoves(game).filter((move) => "play" in move);
    const cards = new Set(plays.map((move) => ("play" in move ? move.play : "")));
    expect(cards.size).toBe(new Set(game.hands[game.toPlay!]).size);
    expect(plays.length).toBeGreaterThanOrEqual(cards.size * 4);
  });

  it("names a wild Skip, Reverse and Draw Two as wild ones, in both languages", () => {
    expect(hitotsuWords("WS0")).toBe("wild skip");
    expect(hitotsuWords("WD0", "ja")).toBe("ワイルドのドロー2");
    expect(hitotsuWords("WW0")).toBe("wild");
  });

  it("is played out by computers at every table, and keeps its game", () => {
    for (let count = 2; count <= 8; count += 1) {
      const game = playOut(wilds, count, 11 * count);
      expect(game.phase).toBe("over");
      expect(decodeHitotsu(encodeHitotsu(game))).toEqual(game);
    }
  });
});

describe("the launcher", () => {
  it("fires the same number of cards for the same game and a number within its range", () => {
    for (let moves = 0; moves < 60; moves += 1) {
      const fired = hitotsuLaunch(7, moves, 1, 4);
      expect(fired).toBe(hitotsuLaunch(7, moves, 1, 4));
      expect(fired).toBeGreaterThanOrEqual(1);
      expect(fired).toBeLessThanOrEqual(4);
    }
    const seen = new Set(Array.from({ length: 80 }, (_, moves) => hitotsuLaunch(7, moves, 1, 4)));
    expect(seen.size).toBe(4);
  });

  it("answers a draw with a random handful, and the turn passes on", () => {
    let game = startHitotsu(1, ["Aki", "Ben"], 3, launcher)!;
    // Find a position where the player to move has nothing to play: they draw.
    for (
      let step = 0;
      step < 200 &&
      !hitotsuMoves(game).some((move) => "draw" in move && hitotsuMoves(game).every((one) => !("play" in one)));
      step += 1
    )
      game = playHitotsu(game, hitotsuComputer(game))!;
    const before = game.hands[game.toPlay!]!.length;
    const seat = game.toPlay!;
    const next = playHitotsu(game, { draw: true })!;
    const took = next.hands[seat]!.length - before;
    expect(took).toBeGreaterThanOrEqual(1);
    expect(took).toBeLessThanOrEqual(4);
    expect(next.toPlay).not.toBe(seat);
    expect(next.drawn).toBeNull();
  });

  it("does not stack: a draw card is taken at once by the next player, with a launched number of cards", () => {
    const seed = 9;
    let game = startHitotsu(1, ["Aki", "Ben", "Cy"], seed, { ...launcher, stacking: "any" })!;
    let saw = 0;
    for (let step = 0; step < 4000 && game.phase === "playing"; step += 1) {
      const move = hitotsuComputerJump(game) ?? hitotsuComputer(game);
      const was = game;
      game = playHitotsu(game, move)!;
      expect(game.pending, "nothing waits to be stacked").toBe(0);
      if ("play" in move && (faceOf(move.play) === "D" || faceOf(move.play) === "F")) {
        const took = game.news.find((news) => news.kind === "took");
        if (took?.kind === "took") {
          saw += 1;
          expect(took.count).toBeGreaterThanOrEqual(faceOf(move.play) === "D" ? 2 : 4);
          expect(took.count).toBeLessThanOrEqual(faceOf(move.play) === "D" ? 6 : 10);
        }
      }
      void was;
    }
    expect(saw).toBeGreaterThan(0);
  });

  it("is played out by computers at every table, and keeps its game", () => {
    for (let count = 2; count <= 8; count += 1) {
      const game = playOut(launcher, count, 13 * count);
      expect(game.phase).toBe("over");
      expect(decodeHitotsu(encodeHitotsu(game))).toEqual(game);
    }
  });
});
