// The documents that are made from the source, or that quote it, checked against it.
// Plain JavaScript, so that reading files needs no Node types. `pnpm docs:make` rewrites what is made.
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import process from "node:process";

import { describe, expect, it } from "vitest";

import { CLI_STRINGS, runCli } from "./cli.ts";
import { HitotsuTableElement } from "./element.ts";
import * as hitotsu from "./index.ts";
import * as sounds from "./card-sounds.ts";
import * as element from "./element.ts";

const { HITOTSU_CAUGHT, HITOTSU_CHALLENGE_LOST, HITOTSU_CLASSIC, HITOTSU_DECK_SIZE, HITOTSU_MOST_PLAYERS, HITOTSU_PARTY, HITOTSU_SIZES, HITOTSU_STRINGS, HITOTSU_STRINGS_JA, SEED_MOST, VERSION } = hitotsu;

const readme = readFileSync("README.md", "utf8");
const pkg = JSON.parse(readFileSync("package.json", "utf8"));
const cell = (text) => text.replace(/\\\|/g, "|").trim();

/** The rows of the table under a heading: each row's cells. */
function table(heading, doc = readme) {
  const from = doc.indexOf(heading);
  if (from < 0) throw new Error(`no “${heading}”`);
  const rows = [];
  for (const line of doc.slice(from).split("\n").slice(1)) {
    if (line.startsWith("|")) rows.push(line.split(/(?<!\\)\|/).slice(1, -1).map(cell));
    else if (rows.length > 0) break;
  }
  return rows.slice(1);
}

/** The text of a section: from its heading to the next of the same level. */
const section = (heading) => {
  const from = readme.indexOf(`\n${heading}\n`);
  if (from < 0) throw new Error(`no “${heading}”`);
  const level = heading.match(/^#+/)[0];
  const rest = readme.slice(from + heading.length + 2);
  const next = rest.search(new RegExp(`^${level} `, "m"));
  return next < 0 ? rest : rest.slice(0, next);
};

/** A line of a README example: the code, and what its comment says it comes to. */
const says = (code) => expect(readme, code).toContain(code);

describe("the README's examples", () => {
  it("the rules-alone example ends where its comment says", () => {
    says("hitotsuWinners(game);                // [1]");
    let game = hitotsu.startHitotsu(1, ["Ann", "Ben", "Cy"], 42, HITOTSU_PARTY);
    game = hitotsu.playHitotsu(game, { draw: true });
    while (game.phase === "playing") game = hitotsu.playHitotsu(game, hitotsu.hitotsuComputer(game));
    expect(hitotsu.hitotsuWinners(game)).toEqual([1]);
  });

  it("the install lines name the package, and the tag example names real files", () => {
    says("npm install @johnmorrisdotca/hitotsu");
    says(`https://cdn.jsdelivr.net/npm/@johnmorrisdotca/hitotsu@${VERSION.split(".")[0]}/dist/element-define.js`);
    expect(pkg.exports["./element-define"].default).toBe("./dist/element-define.js");
    expect(pkg.sideEffects).toEqual(["./dist/element-define.js"]);
    expect(readme).not.toContain("not on npm");
  });

  it("every entry point the README names is in package.json, and every one in package.json is named", () => {
    for (const key of Object.keys(pkg.exports).filter((one) => one !== ".")) expect(readme, key).toContain(`@johnmorrisdotca/hitotsu/${key.slice(2)}`);
    for (const name of readme.match(/@johnmorrisdotca\/hitotsu\/[\w-]+/g) ?? []) expect(pkg.exports[`./${name.split("/").at(-1)}`], name).toBeDefined();
  });

  it("the names in the API section are real exports", () => {
    const real = new Set([...Object.keys(hitotsu), ...Object.keys(sounds), ...Object.keys(element), "HitotsuTable", "HitotsuCardImage", "HitotsuCardDrawing"]);
    const api = section("## API").replace(/\/\/.*$/gm, "");
    const calls = new Set([...api.matchAll(/(?<![\w.])([a-z][A-Za-z]+)(?=\()/g)].map((match) => match[1]));
    const known = new Set(["mountHitotsu", "game", "restart", "destroy"]);
    for (const name of calls) if (!known.has(name)) expect(real.has(name), `${name} is in the API section and not exported`).toBe(true);
    expect(calls.size).toBeGreaterThan(30);
  });
});

describe("the README's rules table", () => {
  it("gives the presets' own options", () => {
    const rows = table("| Rule | Classic | Party | Option |");
    const value = (text) => (text === "on" ? true : text === "off" ? false : text);
    const find = (start) => rows.find((row) => row[0].startsWith(start));
    expect(find("Cards dealt").slice(1, 3).map(Number)).toEqual([HITOTSU_CLASSIC.deal, HITOTSU_PARTY.deal]);
    expect(find("Stacking draw cards").slice(1, 3)).toEqual([HITOTSU_CLASSIC.stacking, "any on any"]);
    expect(HITOTSU_PARTY.stacking).toBe("any");
    expect(find("Jump-in").slice(1, 3).map(value)).toEqual([HITOTSU_CLASSIC.jumpIn, HITOTSU_PARTY.jumpIn]);
    expect(find("Sevens and zeros").slice(1, 3).map(value)).toEqual([HITOTSU_CLASSIC.sevenZero, HITOTSU_PARTY.sevenZero]);
    expect(find("Drawing").slice(1, 3)).toEqual(["one card", "one card"]);
    expect(HITOTSU_CLASSIC.drawToMatch || HITOTSU_PARTY.drawToMatch).toBe(false);
    expect(find("Wild Draw Four").slice(1, 3)).toEqual(["may be challenged", "may be challenged"]);
    expect([HITOTSU_CLASSIC.wildFour, HITOTSU_PARTY.wildFour]).toEqual(["challenge", "challenge"]);
    expect(rows).toHaveLength(6);
  });

  it("the scores in the text are the points", () => {
    expect(readme).toContain("an action card 20\nand a wild 50");
    expect(hitotsu.hitotsuPoints("BS0")).toBe(20);
    expect(hitotsu.hitotsuPoints("WW0")).toBe(50);
    expect(hitotsu.hitotsuPoints("R70")).toBe(7);
  });
});

describe("the README's Limits", () => {
  const rows = table("| Limit | Value | Constant |");
  const named = (start) => rows.find((row) => row[0].startsWith(start));

  it("are the constants' own, and the rules refuse what is outside them", () => {
    expect(named("Players")[1]).toBe("2 to 8");
    expect(HITOTSU_MOST_PLAYERS).toBe(8);
    expect(hitotsu.startHitotsu(1, ["a"], 1)).toBeNull();
    expect(hitotsu.startHitotsu(1, new Array(9).fill("a"), 1)).toBeNull();
    expect(hitotsu.startHitotsu(1, new Array(8).fill("a"), 1)).not.toBeNull();
    expect(named("How long a game lasts")[1]).toBe("1 (a single hand), 200 or 500 points");
    expect([...HITOTSU_SIZES]).toEqual([1, 200, 500]);
    expect(hitotsu.startHitotsu(7, ["a", "b"], 1)).toBeNull();
    expect(named("Cards in the deck")[1]).toBe("108");
    expect(HITOTSU_DECK_SIZE).toBe(108);
    expect(hitotsu.HITOTSU_DECK).toHaveLength(108);
    expect(named("Cards dealt")[1]).toBe("7, or 5 in party mode");
    expect([HITOTSU_CLASSIC.deal, HITOTSU_PARTY.deal]).toEqual([7, 5]);
    expect(named("Cards taken for forgetting")[1]).toBe(String(HITOTSU_CAUGHT));
    expect(named("Cards taken for a Wild")[1]).toBe(String(HITOTSU_CHALLENGE_LOST));
    expect(named("A seed on the command line")[1]).toBe(`a whole number from 1 to ${SEED_MOST.toLocaleString("en-US")}`);
    expect(runCli(["deal", "--seed", String(SEED_MOST + 1)]).code).toBe(2);
    expect(runCli(["deal", "--seed", String(SEED_MOST)]).code).toBe(0);
    expect(runCli(["deal", "--seed", "0"]).code).toBe(2);
  });

  it("every constant it names exists", () => {
    for (const row of rows) for (const name of row[2].match(/`(HITOTSU_\w+|SEED_MOST)`/g) ?? []) expect(Object.keys(hitotsu), name).toContain(name.replaceAll("`", ""));
  });
});

describe("the README's tag", () => {
  it("lists the attributes the element watches, and no others", () => {
    const rows = table("| Attribute | What it does |");
    expect(rows.map((row) => row[0].replaceAll("`", "")).sort()).toEqual([...HitotsuTableElement.observedAttributes].sort());
  });
});

describe("the README's theming", () => {
  it("lists the variables the stylesheet declares, and every one it declares", () => {
    const css = readFileSync("src/ui/style.ts", "utf8");
    const declared = new Set([...css.matchAll(/(--ht-[\w-]+):/g)].map((match) => match[1]));
    const listed = new Set(section("## Theming").match(/--ht-[\w-]+/g));
    expect([...listed].sort()).toEqual([...declared].sort());
  });
});

describe("the README's command line", () => {
  const usage = CLI_STRINGS.en.usage;
  it("lists the options and commands the help does", () => {
    const rows = table("| Command or option | What it does |").map((row) => row[0]);
    const flags = [...usage.matchAll(/^\s+(?:-\w, )?(--[\w-]+)/gm)].map((match) => match[1]);
    for (const flag of flags.filter((one) => one !== "--help" && one !== "--version")) expect(rows.join(" "), flag).toContain(flag);
    for (const command of ["deal", "play", "check"]) expect(rows.join(" ")).toContain(`\`${command}`);
  });

  it("the two helps list the same options and examples, in the same order", () => {
    const options = (text) => [...text.matchAll(/^\s+(?:-\w, )?(--[\w-]+)/gm)].map((match) => match[1]);
    expect(options(CLI_STRINGS.ja.usage)).toEqual(options(CLI_STRINGS.en.usage));
    const examples = (text) => text.split("\n").filter((line) => line.startsWith("  hitotsu "));
    expect(examples(CLI_STRINGS.ja.usage)).toEqual(examples(CLI_STRINGS.en.usage));
  });

  it("the commands in the README run, and print what is said", () => {
    expect(runCli(["deal", "--seed", "42"]).out).toMatch(/^Seat 1: .*\nOn the pile: /s);
    expect(runCli(["play", "--seed", "42", "--players", "3", "--rules", "party"]).out).toBe("Hitotsu for 3, party rules, seed 42: 28 moves. Won by Seat 2.\nScores: 0 71 0\n");
    const saved = runCli(["play", "--seed", "42", "--saved"]).out;
    expect(runCli(["check", saved.trim()]).code).toBe(0);
    for (const line of readme.match(/^npx @johnmorrisdotca\/hitotsu (deal|play|check) .*$/gm)) expect(line).toMatch(/^npx @johnmorrisdotca\/hitotsu (deal|play|check) --?\w|check game\.json/);
  });
});

describe("docs/strings-ja.md", () => {
  const escape = (text) => text.replaceAll("|", "\\|").replaceAll("\n", "<br>");
  /** What to give each function of the table so that its places show: the names in braces. */
  const SAMPLE = {
    computer: ["{n}"],
    toPlay: ["{who}"],
    follow: ["{colour}"],
    facing: ["{who}", "{count}"],
    drew: ["{who}"],
    challengeOpen: ["{who}", "{by}"],
    cards: ["{count}"],
    points: ["{count}"],
    take: ["{count}"],
    swapWith: ["{who}"],
    won: ["{who}"],
    stock: ["{count}"],
  };
  const NEWS = { caught: ["{who}"], took: ["{who}", "{count}"], swap: ["{who}", "{other}"], jump: ["{who}"], drew: ["{who}", "{count}"] };
  const rowsOf = (strings) => {
    const rows = {};
    for (const [key, value] of Object.entries(strings)) {
      if (key === "colour") for (const [letter, word] of Object.entries(value)) rows[`colour.${letter}`] = word;
      else if (key === "news") {
        for (const [name, item] of Object.entries(value)) {
          if (name === "challenge") {
            rows["news.challenge (found guilty)"] = item("{who}", "{by}", true);
            rows["news.challenge (not guilty)"] = item("{who}", "{by}", false);
          } else if (name === "skipped") {
            rows["news.skipped"] = item("{who}", false);
          } else rows[`news.${name}`] = typeof item === "function" ? item(...NEWS[name]) : item;
        }
      } else rows[key] = typeof value === "function" ? value(...SAMPLE[key]) : value;
    }
    return rows;
  };
  const en = rowsOf(HITOTSU_STRINGS);
  const ja = rowsOf(HITOTSU_STRINGS_JA);
  const cli = Object.keys(CLI_STRINGS.en).filter((key) => key !== "usage");
  const lines = [
    "# Hitotsu's words, in English and Japanese",
    "",
    "Made from `src/ui/strings.ts` and `src/cli.ts` by `pnpm docs:make`; a test fails if the two differ, so this list is never out of date.",
    "",
    "**The Japanese has not yet been reviewed by a native reader.** If a line reads wrongly or unnaturally, please",
    "open a *Fix a translation* issue with the string's name. `{who}`, `{count}` and the other braces are filled in when shown.",
    "",
    "## The table",
    "",
    "| Name | English | Japanese |",
    "| --- | --- | --- |",
    ...Object.keys(en).map((key) => `| \`${key}\` | ${escape(en[key])} | ${escape(ja[key])} |`),
    "",
    "## The command line",
    "",
    "Names are the keys of `CLI_STRINGS`. `{n}`, `{seed}` and the other braces are filled in when shown.",
    "",
    "| Name | English | Japanese |",
    "| --- | --- | --- |",
    ...cli.map((key) => `| \`${key}\` | ${escape(CLI_STRINGS.en[key])} | ${escape(CLI_STRINGS.ja[key])} |`),
    "",
    "### The help",
    "",
    "`usage`, in English:",
    "",
    "```",
    CLI_STRINGS.en.usage.trimEnd(),
    "```",
    "",
    "and in Japanese:",
    "",
    "```",
    CLI_STRINGS.ja.usage.trimEnd(),
    "```",
    "",
  ];
  const made = lines.join("\n");

  it("is what the source makes: run `pnpm docs:make` after changing a string", () => {
    if (process.env.UPDATE_DOCS === "1") writeFileSync("docs/strings-ja.md", made);
    expect(readFileSync("docs/strings-ja.md", "utf8")).toBe(made);
  });

  it("has a Japanese line for every English one, and keeps every place to fill in", () => {
    expect(Object.keys(ja)).toEqual(Object.keys(en));
    expect(Object.keys(CLI_STRINGS.ja)).toEqual(Object.keys(CLI_STRINGS.en));
    const places = (text) => [...new Set([...text.matchAll(/\{(\w+)\}/g)].map((match) => match[1]))].sort();
    for (const key of Object.keys(en)) {
      expect(ja[key].trim(), key).not.toBe("");
      expect(ja[key], key).not.toBe(en[key]);
      expect(places(ja[key]), key).toEqual(places(en[key]));
    }
    for (const key of Object.keys(CLI_STRINGS.en)) {
      if (!["hand", "rulesClassic", "rulesParty"].includes(key)) expect(CLI_STRINGS.ja[key], key).not.toBe(CLI_STRINGS.en[key]);
      expect(places(CLI_STRINGS.ja[key]), key).toEqual(places(CLI_STRINGS.en[key]));
    }
  });
});

describe("the version", () => {
  it("is package.json's, and the changelog has it", () => {
    expect(VERSION).toBe(pkg.version);
    expect(readFileSync("CHANGELOG.md", "utf8")).toContain(`## [${VERSION}]`);
  });
});

describe("package.json", () => {
  it("names built files directly, and ships what it names", () => {
    const pointed = [...Object.values(pkg.bin), ...Object.values(pkg.exports).flatMap((entry) => Object.values(entry))];
    for (const file of pointed) expect(/^\.?\/?(dist|bin)\//.test(file), file).toBe(true);
    expect(pkg.dependencies).toBeUndefined();
    for (const file of ["docs/strings-ja.md", "docs/credits.md", "bin"]) expect(pkg.files).toContain(file);
  });

  it("has keywords that are many, lower case and not repeated, and a description that fits", () => {
    expect(pkg.keywords.length).toBeGreaterThan(30);
    expect(new Set(pkg.keywords).size).toBe(pkg.keywords.length);
    for (const word of pkg.keywords) expect(word).toBe(word.toLowerCase());
    expect(pkg.description.length).toBeGreaterThan(200);
    expect(pkg.description.length).toBeLessThanOrEqual(350);
  });
});

describe("the family", () => {
  const SIBLINGS = ["korokoro", "kyuubu", "toranpu", "tane", "narabe", "tenka", "kumimoji", "tsunagi", "jarajara", "suido", "sugoroku", "kazu", "domino", "kotoba", "meikyuu"];

  it("lists all sixteen packages: this one, and a link to every other", () => {
    const family = section("## The family");
    expect(family).toContain("**Hitotsu** (一つ");
    for (const name of SIBLINGS) expect(family, name).toContain(`](https://github.com/johnmorrisdotca/${name})`);
    expect((family.match(/^- /gm) ?? []).length).toBe(16);
  });
});

describe("the family's look", () => {
  const css = readFileSync("demo/family.css", "utf8");

  it("demo/family.css is the family's file, byte for byte: never edit it here", () => {
    const [first, ...rest] = css.split("\n");
    const hash = createHash("sha256").update(rest.join("\n")).digest("hex");
    expect(first).toBe(`/* sha256 of every line after this one: ${hash} */`);
    expect(hash).toBe("c1e392564a7fd94d0bb5cfaefb6d4fedfd147fc3e27f3a7afd8d8dac8c94a227");
  });

  it("scripts/family-template.mjs is the family's file too", () => {
    expect(createHash("sha256").update(readFileSync("scripts/family-template.mjs")).digest("hex")).toBe("6bb8a0ba895eb971a050ddeb2168135f10c75ad21eee50a266be34a9b7298b37");
  });

  it("the site script uses the family's header and footer", () => {
    const site = readFileSync("scripts/site.mjs", "utf8");
    for (const part of ["familyHead(", "familyHeader(", "familyUnreviewed(", "familyFooter(", "FAMILY_SCRIPT", 'href="family.css"', 'href="site.css"']) expect(site).toContain(part);
    expect(site.indexOf('href="family.css"')).toBeLessThan(site.indexOf('href="site.css"'));
  });
});
