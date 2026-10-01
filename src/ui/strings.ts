/** Every word the table says, so a host page can put its own in (`strings` when it mounts). */
export type HitotsuStrings = {
  you: string;
  computer: (n: number) => string;
  yourTurn: string;
  toPlay: (who: string) => string;
  follow: (colour: string) => string;
  facing: (who: string, count: number) => string;
  drew: (who: string) => string;
  challengeOpen: (who: string, by: string) => string;
  cards: (count: number) => string;
  points: (count: number) => string;
  draw: string;
  keep: string;
  take: (count: number) => string;
  challenge: string;
  call: string;
  called: string;
  pickColour: string;
  swapWith: (who: string) => string;
  jumpIn: string;
  won: (who: string) => string;
  again: string;
  stock: (count: number) => string;
  /** The label under the card in play, matching the one under the draw pile so the two sit level. "In play" when left out. */
  inPlay?: string;
  colour: Record<"R" | "Y" | "G" | "B", string>;
  news: {
    caught: (who: string) => string;
    took: (who: string, count: number) => string;
    challenge: (who: string, by: string, guilty: boolean) => string;
    swap: (who: string, other: string) => string;
    rotate: string;
    jump: (who: string) => string;
    /** `you` is true when the seat skipped is the person at this screen. */
    skipped: (who: string, you: boolean) => string;
    reversed: string;
    drew: (who: string, count: number) => string;
  };
};

export const HITOTSU_STRINGS: Required<HitotsuStrings> = {
  you: "You",
  computer: (n) => `Computer ${n}`,
  yourTurn: "Your turn",
  toPlay: (who) => `${who} to play`,
  follow: (colour) => `Play ${colour}, the same number or symbol, or a wild.`,
  facing: (who, count) => `${who} must take ${count}, or stack a draw card.`,
  drew: (who) => `${who} drew: play that card, or keep it.`,
  challengeOpen: (who, by) => `${who} may challenge ${by}'s Wild Draw Four, or take it.`,
  cards: (count) => (count === 1 ? "1 card" : `${count} cards`),
  points: (count) => `${count} pts`,
  draw: "Draw",
  keep: "Keep it",
  take: (count) => `Take ${count}`,
  challenge: "Challenge",
  call: "Call Hitotsu!",
  called: "Hitotsu! called",
  pickColour: "Choose a colour",
  swapWith: (who) => `Swap with ${who}`,
  jumpIn: "Jump in!",
  won: (who) => `${who} won.`,
  again: "Play again",
  stock: (count) => `${count} left to draw`,
  inPlay: "In play",
  colour: { R: "red", Y: "yellow", G: "green", B: "blue" },
  news: {
    caught: (who) => `${who} forgot to call Hitotsu!: two cards.`,
    took: (who, count) => `${who} took ${count}.`,
    challenge: (who, by, guilty) => (guilty ? `${who} challenged ${by}, who had the colour.` : `${who} challenged ${by}, who did not have the colour.`),
    swap: (who, other) => `${who} swapped hands with ${other}.`,
    rotate: "Every hand passed on.",
    jump: (who) => `${who} jumped in!`,
    skipped: (who, you) => `${who} ${you ? "are" : "is"} skipped.`,
    reversed: "Play turns round.",
    drew: (who, count) => `${who} drew ${count === 1 ? "a card" : `${count} cards`}.`,
  },
};

/**
 * The table's words in Japanese. Not yet reviewed by a native reader: a
 * "Fix a translation" issue, naming the string, is welcome.
 */
export const HITOTSU_STRINGS_JA: Required<HitotsuStrings> = {
  you: "あなた",
  computer: (n) => `コンピューター${n}`,
  yourTurn: "あなたの番",
  toPlay: (who) => `${who}の番`,
  follow: (colour) => `${colour}、同じ数字か記号、またはワイルドを出します。`,
  facing: (who, count) => `${who}は${count}枚引くか、ドローカードを重ねます。`,
  drew: (who) => `${who}が引きました。そのカードを出すか、持っておきます。`,
  challengeOpen: (who, by) => `${who}は${by}のワイルドドローフォーに挑戦するか、引きます。`,
  cards: (count) => `${count}枚`,
  points: (count) => `${count}点`,
  draw: "引く",
  keep: "持っておく",
  take: (count) => `${count}枚引く`,
  challenge: "挑戦",
  call: "ヒトツ！と言う",
  called: "ヒトツ！と言いました",
  pickColour: "色を選ぶ",
  swapWith: (who) => `${who}と手札を交換`,
  jumpIn: "割り込み！",
  won: (who) => `${who}の勝ち。`,
  again: "もう一度",
  stock: (count) => `山札あと${count}枚`,
  inPlay: "場のカード",
  colour: { R: "赤", Y: "黄", G: "緑", B: "青" },
  news: {
    caught: (who) => `${who}は「ヒトツ！」と言い忘れました。2枚引きます。`,
    took: (who, count) => `${who}は${count}枚引きました。`,
    challenge: (who, by, guilty) => (guilty ? `${who}が${by}に挑戦しました。${by}はその色を持っていました。` : `${who}が${by}に挑戦しました。${by}はその色を持っていませんでした。`),
    swap: (who, other) => `${who}は${other}と手札を交換しました。`,
    rotate: "全員の手札が回りました。",
    jump: (who) => `${who}が割り込みました！`,
    skipped: (who) => `${who}は飛ばされます。`,
    reversed: "順番が逆になります。",
    drew: (who, count) => `${who}が${count}枚引きました。`,
  },
};

/** The languages the table speaks: English, and Japanese (`"ja"`). */
export type HitotsuLanguage = "en" | "ja";

/** The table's words in a language: `HITOTSU_STRINGS` for `"en"`, `HITOTSU_STRINGS_JA` for `"ja"`. */
export function hitotsuStrings(language: HitotsuLanguage): Required<HitotsuStrings> {
  return language === "ja" ? HITOTSU_STRINGS_JA : HITOTSU_STRINGS;
}

/** The language a language tag such as `"ja"`, `"ja-JP"` or `"en-GB"` asks for: Japanese for any `ja`, English for everything else, and for nothing. */
export function hitotsuLanguageOf(tag: string | null | undefined): HitotsuLanguage {
  return /^ja(?:[-_]|$)/i.test(tag ?? "") ? "ja" : "en";
}
