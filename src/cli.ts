import { HITOTSU_CLASSIC, HITOTSU_PARTY, HITOTSU_SIZES } from "./constants.ts";
import { decodeHitotsu, encodeHitotsu } from "./codec.ts";
import { hitotsuComputer } from "./computer.ts";
import { SEED_MOST, freshSeed } from "./random.ts";
import { hitotsuWinners, playHitotsu, startHitotsu } from "./rules.ts";
import type { HitotsuGame } from "./types.ts";
import { VERSION } from "./version.ts";

/**
 * The command line, as a pure function: arguments and surroundings in, what
 * to print and the exit code out. `bin/hitotsu.mjs` is the few lines that
 * hand it the real process. Nothing here touches a file, a terminal or the
 * network, so every line of it is tested as plain data.
 */

/** What the command line is run in. All of it is optional. */
export type CliSurroundings = {
  /** The environment, for the language (`LC_ALL`, `LC_MESSAGES`, `LANG`). */
  env?: Record<string, string | undefined>;
  /** Standard input, when `--stdin` asks for it: a saved game. */
  stdin?: string;
  /** Reads a file named on the command line, or gives null when it cannot be read. `check` needs it; nothing else does. */
  readFile?: (path: string) => string | null;
  /** The system's language where the environment names none: what `Intl` says, on Windows. */
  locale?: string;
  /** Where a seed comes from when none is given: a function that returns a whole number from 1. `freshSeed` unless given. */
  seed?: () => number;
};

/** What the command line came to. */
export type CliResult = {
  /** 0 when all went well, 1 when what was asked for could not be done, 2 when the command itself was wrong. */
  code: 0 | 1 | 2;
  /** For standard output. */
  out: string;
  /** For standard error. */
  err: string;
};

/** The languages the command line speaks. */
export type CliLanguage = "en" | "ja";

/** Every word the command line says, in both languages. `{n}` and the other braces are filled in when shown. */
export const CLI_STRINGS: Record<CliLanguage, Record<string, string>> = {
  en: {
    unknown: "unknown option {part}",
    needs: "{part} needs a value",
    tryHelp: "Try `hitotsu --help`.",
    langBad: "--lang takes en or ja",
    seedBad: "--seed takes a whole number from 1 to {most}",
    playersBad: "--players takes a whole number from 2 to 8",
    sizeBad: "--size takes 1 (one hand), 200 or 500",
    rulesBad: "--rules takes classic or party",
    noCommand: "“{part}” is not a command",
    noSave: "there is no saved game to check",
    notSaved: "that is not a saved game: the rules cannot play it out",
    seatName: "Seat {n}",
    fresh: "seed {seed} (pass --seed {seed} to repeat this)",
    hand: "{name}: {cards}",
    top: "On the pile: {card}",
    played: "Hitotsu for {n}, {rules} rules, seed {seed}: {moves} moves. Won by {winners}.",
    scores: "Scores: {scores}",
    savedOver: "Hitotsu for {n}, seed {seed}, {moves} moves. Over: won by {winners}.",
    savedGoing: "Hitotsu for {n}, seed {seed}, {moves} moves. {player} to play.",
    rulesClassic: "classic",
    rulesParty: "party",
    usage: `Usage: hitotsu <command> [options]

Hitotsu, the colour-card game: deal it, or let computers play it out.

Commands:
  deal              the hands of a new game and the card to start the pile
  play              computers play a whole game, and say who won
  check <file>      read a saved game back through the rules (or --stdin)

Options:
  -s, --seed N      the number the deals are shuffled from (a fresh one is named if not given)
  -p, --players N   how many play, 2 to 8 (4 if not given)
      --rules R     classic (the default) or party
      --size N      1 for a single hand (the default), 200 or 500 points
      --saved       play: print the saved game, ready for check, and nothing else
  -j, --json        print JSON
      --stdin       check: read the saved game from standard input
      --lang L      en or ja (the environment's language if not given)
  -h, --help        this help
  -v, --version     the version

Examples:
  hitotsu deal --seed 42
  hitotsu play --seed 42 --players 3 --rules party
  hitotsu play --seed 42 --saved > game.json && hitotsu check game.json
`,
  },
  ja: {
    unknown: "不明なオプションです: {part}",
    needs: "{part} には値が必要です",
    tryHelp: "`hitotsu --help` をご覧ください。",
    langBad: "--lang は en か ja です",
    seedBad: "--seed は1〜{most}の整数です",
    playersBad: "--players は2〜8の整数です",
    sizeBad: "--size は 1（1回戦）、200、500のどれかです",
    rulesBad: "--rules は classic か party です",
    noCommand: "「{part}」はコマンドではありません",
    noSave: "確かめる保存データがありません",
    notSaved: "保存データではありません: ルールどおりに最後まで再現できません",
    seatName: "席{n}",
    fresh: "シード {seed}（--seed {seed} で同じ結果を再現できます）",
    hand: "{name}: {cards}",
    top: "場のカード: {card}",
    played: "ヒトツ {n}人、{rules}ルール、シード {seed}: {moves}手。勝者は{winners}。",
    scores: "得点: {scores}",
    savedOver: "ヒトツ {n}人、シード {seed}、{moves}手。終了: 勝者は{winners}。",
    savedGoing: "ヒトツ {n}人、シード {seed}、{moves}手。{player}の番です。",
    rulesClassic: "クラシック",
    rulesParty: "パーティー",
    usage: `使い方: hitotsu <コマンド> [オプション]

ヒトツ（色のカードゲーム）。配るか、コンピューターに最後まで遊ばせます。

コマンド:
  deal              新しいゲームの手札と、場に出す最初のカードを表示します
  play              コンピューターが1ゲームを最後まで遊び、勝者を表示します
  check <ファイル>  保存したゲームをルールどおりに再現して確かめます（--stdin でも可）

オプション:
  -s, --seed N      配るときのシード（指定しなければ新しいシードを表示します）
  -p, --players N   遊ぶ人数、2〜8（指定しなければ4）
      --rules R     classic（既定）か party
      --size N      1は1回戦（既定）、200か500は目標点
      --saved       play: 保存データだけを表示します（check にそのまま渡せます）
  -j, --json        JSONで表示します
      --stdin       check: 標準入力から保存データを読みます
      --lang L      en か ja（指定しなければ環境の言語）
  -h, --help        このヘルプ
  -v, --version     バージョン

例:
  hitotsu deal --seed 42
  hitotsu play --seed 42 --players 3 --rules party
  hitotsu play --seed 42 --saved > game.json && hitotsu check game.json
`,
  },
};

/** Put values into a string's braces: `fillIn("Seat {n}", { n: 3 })` is "Seat 3". A brace with no value is left as it is. */
function fillIn(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (whole, name: string) => (name in values ? String(values[name]) : whole));
}

/** The language the command line speaks: `--lang`, or the environment's, or the system's; Japanese for `ja…`, English for anything else. */
export function cliLanguage(flag: string | undefined, env: Record<string, string | undefined> = {}, locale?: string): CliLanguage {
  const named = [flag, env.LC_ALL, env.LC_MESSAGES, env.LANG].find((value) => value !== undefined && value !== "" && value !== "C" && value !== "POSIX" && !value.startsWith("C."));
  return (named ?? locale ?? "en").toLowerCase().startsWith("ja") ? "ja" : "en";
}

const FLAGS_WITH_VALUES: Record<string, string> = { "-s": "seed", "--seed": "seed", "-p": "players", "--players": "players", "--rules": "rules", "--size": "size", "--lang": "lang" };
const FLAGS: Record<string, string> = { "--saved": "saved", "-j": "json", "--json": "json", "--stdin": "stdin", "-h": "help", "--help": "help", "-v": "version", "--version": "version" };

type Asked = { values: Record<string, string>; flags: Set<string>; words: string[]; wrong: { message: "unknown" | "needs"; part: string } | null };

/** The arguments sorted into options and words: the command, and what it is given. */
function sortArguments(args: readonly string[]): Asked {
  const asked: Asked = { values: {}, flags: new Set(), words: [], wrong: null };
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i] as string;
    const [name, inline] = arg.startsWith("--") && arg.includes("=") ? [arg.slice(0, arg.indexOf("=")), arg.slice(arg.indexOf("=") + 1)] : [arg, undefined];
    if (name in FLAGS_WITH_VALUES) {
      const value = inline ?? args[++i];
      if (value === undefined) {
        asked.wrong ??= { message: "needs", part: name };
        break;
      }
      asked.values[FLAGS_WITH_VALUES[name] as string] = value;
    } else if (name in FLAGS && inline === undefined) asked.flags.add(FLAGS[name] as string);
    // The first wrong option is the one reported; the rest are still read, so that the report comes in the language asked for.
    else if (arg.startsWith("-") && arg !== "-") asked.wrong ??= { message: "unknown", part: arg };
    else asked.words.push(arg);
  }
  return asked;
}

const whole = (text: string | undefined, least: number, most: number): number | null => (text !== undefined && /^\d{1,10}$/.test(text) && Number(text) >= least && Number(text) <= most ? Number(text) : null);

/** Computers play a game out, the same way every time for the same table and seed. */
function playOut(start: HitotsuGame): HitotsuGame {
  let game = start;
  for (let guard = 0; game.phase === "playing" && guard < 100_000; guard += 1) {
    const next = playHitotsu(game, hitotsuComputer(game));
    if (next === null) break;
    game = next;
  }
  return game;
}

/** A hand as a person reads it: each card by its colour and face, `R5`, `YS`, `WF`. */
const shown = (cards: readonly string[]) => cards.map((card) => card.slice(0, 2)).join(" ");

/**
 * Run the command line. See `hitotsu --help` for what it takes. Every deal
 * comes from the seed, so the same command prints the same cards on every
 * machine.
 */
export function runCli(args: readonly string[], around: CliSurroundings = {}): CliResult {
  const asked = sortArguments(args);
  const lang = asked.values.lang;
  const language = cliLanguage(lang, around.env ?? {}, around.locale);
  const t = CLI_STRINGS[language] as Record<string, string>;
  const wrong = (message: string): CliResult => ({ code: 2, out: "", err: `hitotsu: ${message}\n${t.tryHelp}\n` });
  if (asked.wrong !== null) return wrong(fillIn(t[asked.wrong.message] as string, { part: asked.wrong.part }));
  if (lang !== undefined && lang !== "en" && lang !== "ja") return wrong(t.langBad as string);
  const [command, ...rest] = asked.words;
  if (asked.flags.has("help") || (command === undefined && !asked.flags.has("version"))) return { code: 0, out: t.usage as string, err: "" };
  if (asked.flags.has("version")) return { code: 0, out: `${VERSION}\n`, err: "" };
  const json = asked.flags.has("json");
  const print = (body: Record<string, unknown>) => `${JSON.stringify({ generator: `hitotsu ${VERSION}`, ...body }, null, 2)}\n`;
  const seatName = (seat: number) => fillIn(t.seatName as string, { n: seat + 1 });
  const winnersText = (names: readonly string[]) => names.join(language === "ja" ? "、" : ", ");

  if (command === "check") {
    const text = asked.flags.has("stdin") ? (around.stdin ?? "") : rest[0] === undefined ? null : rest[0].trimStart().startsWith("{") ? rest.join(" ") : (around.readFile?.(rest[0]) ?? null);
    const nothing = text === null || text.trim() === "";
    if (nothing) return { code: rest[0] === undefined && !asked.flags.has("stdin") ? 2 : 1, out: "", err: `hitotsu: ${t.noSave}\n${rest[0] === undefined && !asked.flags.has("stdin") ? `${t.tryHelp}\n` : ""}` };
    const game = decodeHitotsu(text.trim());
    if (game === null) return { code: 1, out: json ? print({ ok: false }) : "", err: `hitotsu: ${t.notSaved}\n` };
    const winners = game.phase === "over" ? hitotsuWinners(game) : [];
    const said = { n: game.players.length, seed: game.seed, moves: game.moves.length };
    if (json) return { code: 0, out: print({ ok: true, size: game.size, players: game.players, seed: game.seed, moves: game.moves.length, over: game.phase === "over", toPlay: game.toPlay, winners, scores: game.scores }), err: "" };
    const line = game.phase === "over" || game.toPlay === null ? fillIn(t.savedOver as string, { ...said, winners: winnersText(winners.map((seat) => game.players[seat] as string)) }) : fillIn(t.savedGoing as string, { ...said, player: game.players[game.toPlay] as string });
    return { code: 0, out: `${line}\n`, err: "" };
  }

  if (command !== "deal" && command !== "play") return wrong(fillIn(t.noCommand as string, { part: command ?? "" }));

  // The seed: named, or drawn and said.
  let err = "";
  let seed: number;
  if (asked.values.seed !== undefined) {
    const read = whole(asked.values.seed, 1, SEED_MOST);
    if (read === null) return wrong(fillIn(t.seedBad as string, { most: SEED_MOST }));
    seed = read;
  } else {
    seed = (around.seed ?? freshSeed)();
    if (!json) err = `hitotsu: ${fillIn(t.fresh as string, { seed })}\n`;
  }
  const count = asked.values.players === undefined ? 4 : whole(asked.values.players, 2, 8);
  if (count === null) return wrong(t.playersBad as string);
  const size = asked.values.size === undefined ? 1 : whole(asked.values.size, 1, SEED_MOST);
  if (size === null || !(HITOTSU_SIZES as readonly number[]).includes(size)) return wrong(t.sizeBad as string);
  const rulesName = asked.values.rules ?? "classic";
  if (rulesName !== "classic" && rulesName !== "party") return wrong(t.rulesBad as string);
  const players = Array.from({ length: count }, (_, seat) => seatName(seat));
  const start = startHitotsu(size, players, seed, rulesName === "party" ? HITOTSU_PARTY : HITOTSU_CLASSIC, players.map(() => true));
  if (start === null) return wrong(t.playersBad as string);

  if (command === "deal") {
    const top = start.discard[start.discard.length - 1] as string;
    if (json) return { code: 0, out: print({ seed, size, rules: rulesName, players, hands: start.hands, top, stock: start.stock.length }), err };
    return { code: 0, out: `${start.hands.map((hand, seat) => `${fillIn(t.hand as string, { name: players[seat] as string, cards: shown(hand) })}\n`).join("")}${fillIn(t.top as string, { card: shown([top]) })}\n`, err };
  }

  const game = playOut(start);
  const winners = hitotsuWinners(game);
  if (asked.flags.has("saved")) return { code: 0, out: `${encodeHitotsu(game)}\n`, err };
  if (json) return { code: 0, out: print({ seed, size, rules: rulesName, players, moves: game.moves.length, over: game.phase === "over", winners, scores: game.scores, saved: encodeHitotsu(game) }), err };
  const named = { n: count, rules: t[rulesName === "party" ? "rulesParty" : "rulesClassic"] as string, seed, moves: game.moves.length, winners: winnersText(winners.map((seat) => players[seat] as string)) };
  return { code: 0, out: `${fillIn(t.played as string, named)}\n${fillIn(t.scores as string, { scores: game.scores.join(" ") })}\n`, err };
}
