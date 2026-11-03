import { describe, expect, it } from "vitest";

import { phrases } from "./phrases.ts";

describe("phrases: where a line of Japanese may break", () => {
  it("leaves English as one piece", () => {
    const text = "Your turn. Play red, the same number or symbol, or a wild.";
    expect(phrases(text)).toEqual([text]);
  });
  it("cuts after a run of hiragana, never inside a katakana word or its number", () => {
    expect(phrases("赤、同じ数字か記号、またはワイルドを出します。")).toEqual([
      "赤、",
      "同じ",
      "数字か",
      "記号、または",
      "ワイルドを",
      "出します。",
    ]);
    expect(phrases("コンピューター1はコンピューター2のワイルドドローフォーに挑戦するか、引きます。")).toEqual([
      "コンピューター1は",
      "コンピューター2の",
      "ワイルドドローフォーに",
      "挑戦するか、",
      "引きます。",
    ]);
  });
  it("never starts a line with a closing mark or a long vowel", () => {
    expect(phrases("「ヒトツ！」と言いました")).toEqual(["「ヒトツ！」と", "言いました"]);
    expect(phrases("あー」い")).toEqual(["あー」い"]);
  });
  it("keeps every character of every Japanese sentence the table says", async () => {
    const { HITOTSU_STRINGS_JA: ja } = await import("./strings.ts");
    const who = ja.computer(2);
    const said = [
      ja.follow("赤"),
      ja.facing(who, 4),
      ja.drew(who),
      ja.challengeOpen(who, ja.computer(3)),
      ja.won(who),
      ja.news.caught(who),
      ja.news.challenge(who, ja.computer(3), true),
      ja.news.swap(who, ja.you),
    ];
    for (const sentence of said) {
      expect(phrases(sentence).join("")).toBe(sentence);
      for (const piece of phrases(sentence)) expect(piece).not.toMatch(/^[ぁ-ゖ]+$/);
    }
  });
});
