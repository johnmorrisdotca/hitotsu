// The table's lines of words keep their words whole: in Japanese the status line, the news line, the buttons and the seats are
// never broken inside ワイルド, ドローカード or コンピューター2, at the narrowest phones' widths and a wide desk's, and a line is
// never wider than the page, in English or in Japanese. `pnpm test:demo` builds the demo and runs this.
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test } from "@playwright/test";

const site = join(dirname(fileURLToPath(import.meta.url)), "..", "site");
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json" };

async function open(page, query) {
  await page.route("http://lines.test/**", (route) => {
    const { pathname } = new URL(route.request().url());
    const file = join(site, pathname.endsWith("/") ? `${pathname}index.html` : pathname);
    if (!existsSync(file)) return route.fulfill({ status: 404, body: "" });
    return route.fulfill({
      body: readFileSync(file),
      contentType: TYPES[file.slice(file.lastIndexOf("."))] ?? "application/octet-stream",
    });
  });
  await page.goto(`http://lines.test/?seed=2026&help=off&${query}`);
  await expect(page.locator("html")).toHaveAttribute("data-ready", "true");
  await expect(page.locator(".ht-status")).toBeVisible();
}

/** Every katakana word (with its number) the table's own text shows that is drawn on more than one line. A word is never across two pieces of text. */
const brokenWords = (page, selector) =>
  page.evaluate((within) => {
    const broken = [];
    for (const root of globalThis.document.querySelectorAll(within)) {
      const walker = globalThis.document.createTreeWalker(root, globalThis.NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) {
        const node = walker.currentNode;
        const tops = [];
        for (let at = 0; at < node.length; at += 1) {
          const range = globalThis.document.createRange();
          range.setStart(node, at);
          range.setEnd(node, at + 1);
          tops.push(Math.round(range.getClientRects()[0]?.top ?? -1));
        }
        for (const word of node.data.matchAll(/[ァ-ヶー]+\d*/g))
          if (new Set(tops.slice(word.index, word.index + word[0].length)).size > 1) broken.push(word[0]);
      }
    }
    return broken;
  }, selector);

/**
 * Say each of the table's Japanese sentences in the status line of a real table (its `follow` words are the sentence, so the
 * table itself draws it) and in the news line as the table draws that, and read how each is laid out: the words drawn on two
 * lines, the lines, and whether the line is wider than its box.
 */
const sentences = (page) =>
  page.evaluate(async () => {
    const { hitotsuStrings, mountHitotsu } = await import("./dist/index.js");
    const { phrased } = await import("./dist/ui/dom.js");
    const w = hitotsuStrings("ja");
    const one = w.computer(1);
    const two = w.computer(2);
    const said = [
      w.follow("赤"),
      `${w.yourTurn}。${w.follow("黄")}`,
      w.facing(one, 4),
      w.drew(w.computer(3)),
      w.challengeOpen(one, two),
      w.challengeOpen(w.you, two),
      w.won(w.computer(7)),
      w.news.caught(two),
      w.news.took(one, 4),
      w.news.challenge(one, two, true),
      w.news.challenge(one, two, false),
      w.news.swap(one, two),
      w.news.jump(one),
      w.news.drew(w.computer(3), 7),
    ];
    const lay = (line) => {
      const range = globalThis.document.createRange();
      range.selectNodeContents(line);
      const walker = globalThis.document.createTreeWalker(line, globalThis.NodeFilter.SHOW_TEXT);
      const rows = [];
      let text = "";
      while (walker.nextNode()) {
        const node = walker.currentNode;
        for (let at = 0; at < node.length; at += 1) {
          const letter = globalThis.document.createRange();
          letter.setStart(node, at);
          letter.setEnd(node, at + 1);
          rows.push(Math.round(letter.getClientRects()[0]?.top ?? -1));
        }
        text += node.data;
      }
      const broken = [...text.matchAll(/[ァ-ヶー]+\d*/g)]
        .filter((word) => new Set(rows.slice(word.index, word.index + word[0].length)).size > 1)
        .map((word) => word[0]);
      return { broken, lines: new Set(rows).size, wide: line.scrollWidth > line.clientWidth };
    };
    const found = [];
    for (const sentence of said) {
      // The status line of a real table.
      const host = globalThis.document.createElement("div");
      globalThis.document.querySelector("#table").after(host);
      const table = mountHitotsu(host, {
        language: "ja",
        seed: 2026,
        computers: 3,
        strings: { follow: () => sentence },
      });
      found.push({ selector: ".ht-status", sentence, ...lay(host.querySelector(".ht-status")) });
      table.destroy();
      host.remove();
      // The news line, filled as the table fills it.
      const news = globalThis.document.querySelector(".ht-news");
      news.replaceChildren(...phrased(sentence));
      found.push({ selector: ".ht-news", sentence, ...lay(news) });
    }
    return found;
  });

for (const width of [320, 360, 390, 1280])
  test(`at ${width} pixels no Japanese sentence the table says is broken inside a word`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await open(page, "lang=ja&rules=party&computers=3");
    const found = await sentences(page);
    expect(found.length).toBe(28);
    for (const one of found) {
      expect(one.broken, `${one.sentence} in ${one.selector}`).toEqual([]);
      expect(one.wide, `${one.sentence} fits ${one.selector}`).toBe(false);
      expect(one.lines, `${one.sentence} takes at most four lines`).toBeLessThanOrEqual(4);
    }
    expect(await page.evaluate(() => globalThis.document.documentElement.scrollWidth <= globalThis.innerWidth)).toBe(
      true,
    );
  });

for (const width of [320, 360, 390])
  test(`at ${width} pixels the table played in Japanese breaks no word, and English fits`, async ({ page }) => {
    await page.addInitScript(() => {
      globalThis.hitotsuDelay = 60;
    });
    await page.setViewportSize({ width, height: 900 });
    await open(page, "lang=ja&rules=party&computers=7");
    // The first turns: the status line says what to play, and the computers' news follows each of your moves.
    for (let turn = 0; turn < 3; turn += 1) {
      await expect(page.locator(".ht-seat").first()).toHaveAttribute("data-turn", "");
      expect(await brokenWords(page, ".ht-root"), `turn ${turn}, in Japanese`).toEqual([]);
      const colours = page.locator(".ht-actions button[data-colour]");
      const glowing = page.locator(".ht-hand button[data-playable]");
      if ((await glowing.count()) > 0) await glowing.first().click();
      else await page.locator('[data-testid="ht-stock"]').click();
      if ((await colours.count()) > 0) await colours.first().click();
    }
    expect(await brokenWords(page, ".ht-root")).toEqual([]);
    await open(page, "lang=en&rules=party&computers=7");
    const spills = await page.evaluate(
      () =>
        [...globalThis.document.querySelectorAll(".ht-status, .ht-news, .ht-actions button")].filter(
          (el) => el.scrollWidth > el.clientWidth,
        ).length,
    );
    expect(spills).toBe(0);
  });
