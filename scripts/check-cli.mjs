// Runs the built command line as a person would: as a child process, on
// whatever system this is. `pnpm test:cli` builds first. The rules of the
// command line are tested as plain data in src/cli.test.ts; this is the part
// only a real process can show: the exit code, the two streams, standard
// input, the environment.
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const bin = join(root, "bin", "hitotsu.mjs");
const { version } = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
// An environment with no language of its own, so each case says what it means.
const bare = { ...process.env, LC_ALL: "", LC_MESSAGES: "", LANG: "en_US.UTF-8", NO_COLOR: "" };

let failed = 0;
function check(what, args, want, { input, env } = {}) {
  const ran = spawnSync(process.execPath, [bin, ...args], { input, encoding: "utf8", env: { ...bare, ...env } });
  const got = { code: ran.status, out: ran.stdout, err: ran.stderr };
  const problems = [];
  if (want.code !== undefined && got.code !== want.code) problems.push(`exit code ${got.code}, wanted ${want.code}`);
  for (const stream of ["out", "err"]) {
    const wanted = want[stream];
    if (wanted === undefined) continue;
    const ok = wanted instanceof RegExp ? wanted.test(got[stream]) : typeof wanted === "function" ? wanted(got[stream]) : got[stream] === wanted;
    if (!ok) problems.push(`${stream} was ${JSON.stringify(got[stream])}, wanted ${wanted instanceof RegExp ? wanted : JSON.stringify(wanted)}`);
  }
  if (problems.length > 0) failed += 1;
  console.log(`${problems.length === 0 ? "ok  " : "FAIL"} ${what}${problems.map((p) => `\n       ${p}`).join("")}`);
  return got;
}

check("the version", ["--version"], { code: 0, out: `${version}\n`, err: "" });
check("help", ["--help"], { code: 0, out: /^Usage: hitotsu/, err: "" });
check("nothing asked for is the help", [], { code: 0, out: /^Usage: hitotsu/, err: "" });
check("a seeded deal", ["deal", "--seed", "42"], { code: 0, out: "Seat 1: R3 R5 G6 GR B0 BD WF\nSeat 2: Y0 G3 B1 B2 B5 B8 WF\nSeat 3: R6 Y2 Y9 YD G0 G6 BR\nSeat 4: R0 R7 Y7 G2 G4 G4 BS\nOn the pile: B9\n", err: "" });
check("a whole game, played by computers", ["play", "--seed", "42", "--players", "3", "--rules", "party"], { code: 0, out: "Hitotsu for 3, party rules, seed 42: 28 moves. Won by Seat 2.\nScores: 0 71 0\n", err: "" });
check("no seed: one is drawn and named on standard error", ["deal"], { code: 0, out: /^Seat 1: /, err: /^hitotsu: seed \d+ \(pass --seed \d+ to repeat this\)\n$/ });
const saved = check("a game as saved text", ["play", "--seed", "42", "--saved"], { code: 0, out: /^\{"v":1,"g":"hitotsu",/, err: "" });
const said = "Hitotsu for 4, seed 42, 49 moves. Over: won by Seat 1.\n";
check("saved text on standard input is checked", ["check", "--stdin"], { code: 0, out: said, err: "" }, { input: saved.out });
check("saved text with Windows line endings", ["check", "--stdin"], { code: 0, out: said, err: "" }, { input: saved.out.replaceAll("\n", "\r\n") });
check("saved text given as the argument", ["check", saved.out.trim()], { code: 0, out: said, err: "" });
const file = join(mkdtempSync(join(tmpdir(), "hitotsu-cli-")), "game.json");
writeFileSync(file, saved.out);
check("a saved game in a file is checked", ["check", file], { code: 0, out: said, err: "" });
check("a file that is not there is exit code 1", ["check", `${file}.missing`], { code: 1, out: "", err: /there is no saved game to check/ });
check("a game that has been changed is exit code 1", ["check", "--stdin"], { code: 1, out: "", err: "hitotsu: that is not a saved game: the rules cannot play it out\n" }, { input: saved.out.replace('"seed":42', '"seed":43') });
check("empty standard input is exit code 1", ["check", "--stdin"], { code: 1, out: "" }, { input: "" });
check("a wrong option is exit code 2", ["--bogus"], { code: 2, out: "", err: /unknown option --bogus/ });
check("a wrong command is exit code 2", ["shuffle"], { code: 2, out: "", err: /is not a command/ });
check("JSON parses", ["play", "--seed", "7", "--json"], { code: 0, out: (text) => JSON.parse(text).seed === 7, err: "" });
check("Japanese by flag", ["play", "--seed", "42", "--lang", "ja"], { code: 0, out: /^ヒトツ 4人、クラシックルール、シード 42: 49手。勝者は席1。/ });
check("Japanese by LANG", ["--help"], { code: 0, out: /^使い方: hitotsu/ }, { env: { LANG: "ja_JP.UTF-8" } });
check("Japanese by LC_ALL over LANG", ["--bogus"], { code: 2, err: /^hitotsu: 不明なオプションです: --bogus\n/ }, { env: { LC_ALL: "ja_JP.UTF-8", LANG: "en_US.UTF-8" } });
check("English by flag over LANG", ["--help", "--lang", "en"], { code: 0, out: /^Usage: hitotsu/ }, { env: { LANG: "ja_JP.UTF-8" } });

if (failed > 0) {
  console.log(`${failed} failed`);
  process.exit(1);
}
console.log("the command line does what it says, on", process.platform, process.version);
