// The Hitotsu demo: a table against the computers, set up with a few presses. The table is the package's own
// (`mountHitotsu`); this page chooses the rules and how many computers, gives it the family's cloth, and says
// everything in English or Japanese.
import { HITOTSU_CLASSIC, HITOTSU_DECK, HITOTSU_PARTY, hitotsuCardSvg, hitotsuStrings, mountHitotsu } from "./dist/index.js";
import { createCardSounds } from "./dist/card-sounds.js";

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
    pageSound: "Sound",
    pageSoundOn: "On",
    pageSoundOff: "Off",
    pageCopyLink: "Copy link to this deal",
    pageCopied: "Copied",
    pageCopyFailed: "Copy the address bar",
    pageUsing: "Using it",
    pageUsingNote: "The table above, as you would put it in your own page, or deal it on the command line. The seed is this deal's, so the command line shows the same cards.",
    pageUsingTag: "As a tag",
    pageUsingScript: "With a script",
    pageUsingCli: "On the command line",
    pageCopy: "Copy",
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
    pageSound: "音",
    pageSoundOn: "あり",
    pageSoundOff: "なし",
    pageCopyLink: "この配りのリンクをコピー",
    pageCopied: "コピーしました",
    pageCopyFailed: "アドレスバーからコピーしてください",
    pageUsing: "使い方",
    pageUsingNote: "上のテーブルを、自分のページに置くときの書き方と、コマンドラインで配る方法です。シードはこの配りのものなので、コマンドラインでも同じカードが出ます。",
    pageUsingTag: "タグで",
    pageUsingScript: "スクリプトで",
    pageUsingCli: "コマンドラインで",
    pageCopy: "コピー",
  },
};

const asked = new URLSearchParams(location.search);
const seatCounts = [1, 3, 5, 7];
let mode = asked.get("rules") === "party" ? "party" : "classic";
let computers = seatCounts.includes(Number(asked.get("computers"))) ? Number(asked.get("computers")) : 3;
let seed = /^\d{1,10}$/.test(asked.get("seed") ?? "") && Number(asked.get("seed")) >= 1 && Number(asked.get("seed")) <= 2147483647 ? Number(asked.get("seed")) : undefined;
let table = null;
// The sounds are the package's own, off until the Sound switch says On.
const sounds = createCardSounds({ muted: true });

const language = familyLanguage({
  id: "hitotsu",
  words: WORDS,
  onChange: () => {
    // The same deal, in the other language.
    seed = table.game().seed;
    mount();
    note();
    using();
  },
});

const chosen = () => {
  const words = hitotsuStrings(language.lang === "ja" ? "ja" : "en");
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
  table = mountHitotsu($("table"), { ...chosen(), seed, language: language.lang === "ja" ? "ja" : "en", sound: sounds, theme: THEME, computerMs: window.hitotsuDelay ?? undefined, onMove: using });
  seed = undefined;
  using();
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
    using();
  });
}
for (const button of $("counts").children) {
  button.addEventListener("click", () => {
    computers = Number(button.dataset.count);
    press("counts", "count", computers);
    table.restart(chosen());
    using();
  });
}
$("deal").addEventListener("click", () => {
  table.restart(chosen());
  using();
});

for (const button of $("sound").children) {
  button.addEventListener("click", () => {
    const on = button.dataset.sound === "on";
    sounds.setMuted(!on);
    press("sound", "sound", on ? "on" : "off");
    if (on) sounds.play("deal");
    using();
  });
}

/** Put text on the clipboard and say so on the button for a moment. */
async function copy(button, text, label) {
  let said = language.word("pageCopied");
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    said = language.word("pageCopyFailed");
  }
  button.textContent = said;
  button.dataset.said = "true";
  setTimeout(() => {
    button.textContent = language.word(label);
    delete button.dataset.said;
  }, 1500);
}

/** The address of this deal: the rules, the computers and the seed, and the language if it was asked for. */
function dealLink() {
  const link = new URL(location.href);
  link.search = "";
  link.searchParams.set("rules", mode);
  link.searchParams.set("computers", String(computers));
  link.searchParams.set("seed", String(table.game().seed));
  if (language.asked !== null) link.searchParams.set("lang", language.asked);
  return link.href;
}
$("share").addEventListener("click", () => copy($("share"), dealLink(), "pageCopyLink"));

/** The three ways to put this table in a page of your own, written out for what is on the screen. */
function using() {
  const lang = language.lang === "ja" ? "ja" : "en";
  const seedNow = table.game().seed;
  const sound = sounds.muted ? "" : " sound";
  $("using-tag").textContent = `<script type="module" src="https://cdn.jsdelivr.net/npm/@johnmorrisdotca/hitotsu@1/dist/element-define.js"></script>\n<hitotsu-table rules="${mode}" computers="${computers}" seed="${seedNow}"${lang === "ja" ? ' lang="ja"' : ""}${sound}></hitotsu-table>`;
  $("using-script").textContent = `import { ${mode === "party" ? "HITOTSU_PARTY" : "HITOTSU_CLASSIC"}, mountHitotsu } from "@johnmorrisdotca/hitotsu";\n\nmountHitotsu(document.getElementById("table"), {\n  rules: ${mode === "party" ? "HITOTSU_PARTY" : "HITOTSU_CLASSIC"},\n  players: [${chosen().players.map((name) => JSON.stringify(name)).join(", ")}],\n  seed: ${seedNow},\n  language: "${lang}",${sound === "" ? "" : "\n  sound: true,"}\n});`;
  $("using-cli").textContent = `npx @johnmorrisdotca/hitotsu deal --seed ${seedNow} --players ${computers + 1} --rules ${mode}\nnpx @johnmorrisdotca/hitotsu play --seed ${seedNow} --players ${computers + 1} --rules ${mode}`;
}
for (const id of ["tag", "script", "cli"]) $(`copy-${id}`).addEventListener("click", () => copy($(`copy-${id}`), $(`using-${id}`).textContent, "pageCopy"));

const shown = HITOTSU_DECK.filter((card) => card.endsWith("0"));
$("deck").innerHTML = [...shown, null].map((card) => hitotsuCardSvg(card, { width: 100 })).join("");

press("rules", "mode", mode);
press("counts", "count", computers);
mount();
note();
document.documentElement.dataset.ready = "true";
