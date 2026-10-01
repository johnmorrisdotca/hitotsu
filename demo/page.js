// The Hitotsu demo: a table against the computers, set up with a few presses. The table is the package's own
// (`mountHitotsu`); this page chooses the rules and how many computers, gives it the family's cloth, and says
// everything in English or Japanese.
import { HITOTSU_CLASSIC, HITOTSU_DECK, HITOTSU_PARTY, hitotsuCardSvg, mountHitotsu } from "./dist/index.js";

const $ = (id) => document.getElementById(id);

// The page's own words. The Japanese has not yet been read by a native reader: the page says so in Japanese only.
const WORDS = {
  en: {
    pitch: "Match the colour or the number, and call Hitotsu! with one card left. Play against one to seven computers, by the classic rules or the party ones.",
    name: "Hitotsu is Japanese for “one”: the call you make with one card left.",
    nameLink: "About the name",
    pageApi: "API reference",
    pageBack: "The table",
    pageApiIntro: "Every export of every entry point, with its signature and its doc comment. Made from the source when the site is built, so it cannot fall behind the code.",
    pageSetup: "Set up the table",
    pageRules: "Rules",
    pageClassic: "Classic",
    pageParty: "Party",
    pageComputers: "Computers",
    pageDeal: "Deal again",
    noteClassic: "Classic: seven cards, one hand. Match the colour or the number; draw cards may not be stacked.",
    noteParty: "Party: five cards, draw cards stacking on any draw card, jumping in, and sevens and zeros.",
    pageDeck: "The deck",
    pageDeckNote: "108 cards in four colours. Each colour also has an element in its corners (火 土 木 水), so no card is told by colour alone.",
    foot: "Open source under the MIT licence. Nothing here is stored or sent anywhere.",
  },
  ja: {
    pitch: "色か数字をそろえて出し、手札が1枚になったら「ヒトツ！」と言います。コンピューター1〜7人と、クラシックかパーティーのルールで遊べます。",
    name: "「ヒトツ」は「一つ」。手札が1枚になったときに言う言葉です。",
    nameLink: "名前について（英語）",
    pageApi: "API リファレンス",
    pageBack: "テーブル",
    pageApiIntro: "すべてのエントリポイントのすべてのエクスポートを、シグネチャとドキュメントコメントつきで載せています。サイトをビルドするときにソースから作るので、コードとずれません。",
    pageSetup: "テーブルの設定",
    pageRules: "ルール",
    pageClassic: "クラシック",
    pageParty: "パーティー",
    pageComputers: "コンピューター",
    pageDeal: "配り直す",
    noteClassic: "クラシック: 7枚で1回戦。色か数字をそろえて出します。ドローカードは重ねられません。",
    noteParty: "パーティー: 5枚。どのドローカードにもドローカードを重ねられ、割り込みも、7と0の特別ルールもあります。",
    pageDeck: "カード",
    pageDeckNote: "4色108枚。色ごとに四隅の元素（火 土 木 水）もあるので、色だけで見分ける必要はありません。",
    foot: "MITライセンスのオープンソースです。ここでは何も保存せず、どこにも送りません。",
  },
};

// The table's own words in Japanese. Not yet reviewed by a native reader.
const TABLE_JA = {
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

let mode = "classic";
let computers = 3;
let table = null;

const language = familyLanguage({
  id: "hitotsu",
  words: WORDS,
  onChange: () => {
    mount();
    note();
  },
});

const tableWords = () => (language.lang === "ja" ? TABLE_JA : {});
const chosen = () => {
  const words = language.lang === "ja" ? TABLE_JA : { you: "You", computer: (n) => `Computer ${n}` };
  return {
    rules: mode === "party" ? HITOTSU_PARTY : HITOTSU_CLASSIC,
    players: [words.you, ...Array.from({ length: computers }, (_, at) => words.computer(at + 1))],
  };
};

// The table wears the family's cloth and the page's own colours, by reference, so a cloth chosen in the header changes it at once.
const THEME = {
  "--ht-surface": "var(--surface)",
  "--ht-ink": "var(--ink)",
  "--ht-muted": "var(--muted)",
  "--ht-rule": "var(--rule)",
  "--ht-felt": "var(--felt)",
  "--ht-felt-deep": "var(--felt-deep)",
  "--ht-felt-ink": "var(--felt-ink)",
  "--ht-accent": "var(--accent)",
  "--ht-playable": "var(--gold)",
};

function mount() {
  table?.destroy();
  table = mountHitotsu($("table"), { ...chosen(), strings: tableWords(), theme: THEME, computerMs: window.hitotsuDelay ?? undefined });
}

function note() {
  $("rules-note").textContent = language.word(mode === "party" ? "noteParty" : "noteClassic");
}

function press(group, attribute, value) {
  for (const button of $(group).children) button.setAttribute("aria-pressed", String(button.dataset[attribute] === String(value)));
}

for (const button of $("rules").children) {
  button.addEventListener("click", () => {
    mode = button.dataset.mode;
    press("rules", "mode", mode);
    note();
    table.restart(chosen());
  });
}
for (const button of $("counts").children) {
  button.addEventListener("click", () => {
    computers = Number(button.dataset.count);
    press("counts", "count", computers);
    table.restart(chosen());
  });
}
$("deal").addEventListener("click", () => table.restart(chosen()));

const shown = HITOTSU_DECK.filter((card) => card.endsWith("0"));
$("deck").innerHTML = [...shown, null].map((card) => hitotsuCardSvg(card, { width: 100 })).join("");

mount();
note();
document.documentElement.dataset.ready = "true";
