import { describe, expect, it } from "vitest";

import { hitotsuWords } from "./deck.ts";
import { HITOTSU_STRINGS, HITOTSU_STRINGS_JA, hitotsuLanguageOf, hitotsuStrings } from "./ui/strings.ts";

describe("the table's languages", () => {
  it("read a language tag: Japanese for any ja, English for anything else, and for nothing", () => {
    expect(["ja", "ja-JP", "JA", "ja_JP"].map(hitotsuLanguageOf)).toEqual(["ja", "ja", "ja", "ja"]);
    expect(["en", "en-GB", "jam", "fr", "", null, undefined].map(hitotsuLanguageOf)).toEqual(["en", "en", "en", "en", "en", "en", "en"]);
  });

  it("hand back each language's own words", () => {
    expect(hitotsuStrings("en")).toBe(HITOTSU_STRINGS);
    expect(hitotsuStrings("ja")).toBe(HITOTSU_STRINGS_JA);
    expect(HITOTSU_STRINGS_JA.you).toBe("あなた");
    expect(HITOTSU_STRINGS_JA.call).toContain("ヒトツ");
  });

  it("have the same shape: every English word has a Japanese one of the same kind", () => {
    const shape = (strings: object): string[] => Object.entries(strings).flatMap(([key, value]) => (typeof value === "object" ? shape(value).map((inner) => `${key}.${inner}`) : [`${key}:${typeof value}`]));
    expect(shape(HITOTSU_STRINGS_JA)).toEqual(shape(HITOTSU_STRINGS));
  });

  it("name a card in Japanese for a screen reader", () => {
    expect(hitotsuWords("R50", "ja")).toBe("赤の5");
    expect(hitotsuWords("BD1", "ja")).toBe("青のドロー2");
    expect(hitotsuWords("BS0", "ja")).toBe("青のスキップ");
    expect(hitotsuWords("GR0", "ja")).toBe("緑のリバース");
    expect(hitotsuWords("WW0", "ja")).toBe("ワイルド");
    expect(hitotsuWords("WF0", "ja")).toBe("ワイルドドローフォー");
    expect(hitotsuWords("R50")).toBe("red five");
    expect(hitotsuWords("WF0", "en")).toBe("wild draw four");
  });
});
