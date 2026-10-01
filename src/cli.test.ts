import { describe, expect, it } from "vitest";

import { cliLanguage, runCli } from "./cli.ts";
import { VERSION } from "./version.ts";

describe("the command line", () => {
  it("says its version and its help, and the help is the default", () => {
    expect(runCli(["--version"])).toEqual({ code: 0, out: `${VERSION}\n`, err: "" });
    expect(runCli(["-h"]).out).toMatch(/^Usage: hitotsu/);
    expect(runCli([]).out).toBe(runCli(["--help"]).out);
  });

  it("deals the same cards for the same seed, and says a fresh seed when it drew one", () => {
    const a = runCli(["deal", "--seed", "42"]);
    expect(a.out).toBe(runCli(["deal", "-s", "42"]).out);
    expect(a.out.split("\n")).toHaveLength(6);
    const fresh = runCli(["deal"], { seed: () => 7 });
    expect(fresh.err).toBe("hitotsu: seed 7 (pass --seed 7 to repeat this)\n");
    expect(fresh.out).toBe(runCli(["deal", "--seed", "7"]).out);
    expect(runCli(["deal", "--json"], { seed: () => 7 }).err).toBe("");
  });

  it("plays a whole game out, and reads the saved text back", () => {
    const played = runCli(["play", "--seed", "42", "--players", "3", "--rules", "party", "--json"]);
    const data = JSON.parse(played.out);
    expect(data).toMatchObject({ seed: 42, over: true, winners: [1], moves: 28, rules: "party" });
    const checked = runCli(["check", "--stdin"], { stdin: data.saved });
    expect(checked.out).toBe("Hitotsu for 3, seed 42, 28 moves. Over: won by Seat 2.\n");
    expect(runCli(["check", "--stdin"], { stdin: data.saved.replace('"seed":42', '"seed":43') }).code).toBe(1);
    expect(runCli(["check", "game.json"], { readFile: () => data.saved }).code).toBe(0);
    expect(runCli(["check", "game.json"], { readFile: () => null }).code).toBe(1);
    expect(runCli(["check"]).code).toBe(2);
  });

  it("refuses what is wrong, with exit code 2, and says so in the language asked for", () => {
    expect(runCli(["--bogus"])).toMatchObject({ code: 2, out: "" });
    expect(runCli(["deal", "--players", "9"]).code).toBe(2);
    expect(runCli(["deal", "--players", "1"]).code).toBe(2);
    expect(runCli(["deal", "--size", "7"]).code).toBe(2);
    expect(runCli(["deal", "--rules", "wild"]).code).toBe(2);
    expect(runCli(["deal", "--seed"]).err).toMatch(/--seed needs a value/);
    expect(runCli(["dance"]).err).toMatch(/“dance” is not a command/);
    expect(runCli(["--bogus", "--lang", "ja"]).err).toMatch(/^hitotsu: 不明なオプションです: --bogus/);
    expect(runCli(["deal", "--lang", "fr"]).code).toBe(2);
  });

  it("chooses a language: the flag, then the environment, then the system", () => {
    expect(cliLanguage("ja")).toBe("ja");
    expect(cliLanguage(undefined, { LC_ALL: "ja_JP.UTF-8", LANG: "en_US" })).toBe("ja");
    expect(cliLanguage(undefined, { LANG: "C" }, "ja-JP")).toBe("ja");
    expect(cliLanguage(undefined, {})).toBe("en");
    expect(runCli(["play", "--seed", "42", "--lang", "ja"]).out).toMatch(/^ヒトツ 4人/);
  });
});
