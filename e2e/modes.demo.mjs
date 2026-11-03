// The demo's set-up offers the table's mode (the standard deck, wilds only, a launcher) in a row of buttons like its other choices:
// each is chosen with a press and plays as chosen, the address opens it, it is said in English and in Japanese, and choosing
// one moves nothing of the set-up, at the narrowest phones' widths and a wide desk's. `pnpm test:demo` builds the demo and runs this.
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test } from "@playwright/test";

const site = join(dirname(fileURLToPath(import.meta.url)), "..", "site");
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json" };
const MODES = ["classic", "all-wild", "launcher"];
const modeButton = (page, mode) => page.locator(`[data-testid="modes"] [data-variant="${mode}"]`);

async function open(page, query) {
  const errors = [];
  page.on("pageerror", (error) => errors.push(String(error)));
  page.on("console", (message) => message.type() === "error" && errors.push(message.text()));
  await page.addInitScript(() => {
    globalThis.hitotsuDelay = 60;
  });
  await page.route("http://modes.test/**", (route) => {
    const { pathname } = new URL(route.request().url());
    const file = join(site, pathname.endsWith("/") ? `${pathname}index.html` : pathname);
    if (!existsSync(file)) return route.fulfill({ status: 404, body: "" });
    return route.fulfill({
      body: readFileSync(file),
      contentType: TYPES[file.slice(file.lastIndexOf("."))] ?? "application/octet-stream",
    });
  });
  await page.goto(`http://modes.test/?seed=2026&help=off&${query}`);
  await expect(page.locator("html")).toHaveAttribute("data-ready", "true");
  await expect(page.locator(".ht-hand button").first()).toBeVisible();
  return errors;
}

async function press(locator) {
  await locator.scrollIntoViewIfNeeded();
  if (test.info().project.use.hasTouch === true) await locator.tap();
  else await locator.click();
}

/** The labels of the cards in the hand. */
const hand = (page) =>
  page.locator(".ht-hand button").evaluateAll((buttons) => buttons.map((button) => button.getAttribute("aria-label")));

/** Where the set-up and the table are: the set-up's box, each row of choices, and the table's top. */
const places = (page) =>
  page.evaluate(() => {
    const box = (element) => {
      const found = element.getBoundingClientRect();
      return {
        x: Math.round(found.x),
        y: Math.round(found.y + globalThis.scrollY),
        width: Math.round(found.width),
        height: Math.round(found.height),
      };
    };
    const each = (selector) => [...globalThis.document.querySelectorAll(selector)].map(box);
    return {
      setup: box(globalThis.document.querySelector("section.setup")),
      choices: each("#rules, #variants, #counts, #sound, #deal"),
      notes: each(".rules-note"),
      table: box(globalThis.document.querySelector("#table")),
    };
  });

const same = (one, other, what) => {
  expect(one.setup, `${what}: the set-up`).toEqual(other.setup);
  expect(one.choices, `${what}: the choices`).toEqual(other.choices);
  expect(one.notes, `${what}: the notes`).toEqual(other.notes);
  expect(one.table.y, `${what}: where the table starts`).toBe(other.table.y);
  expect(one.table.x, `${what}: the table's left`).toBe(other.table.x);
  expect(one.table.width, `${what}: the table's width`).toBe(other.table.width);
};

test("the mode is a row of three buttons beside the rules, and standard is chosen at first", async ({ page }) => {
  const errors = await open(page, "lang=en");
  await expect(page.locator('[data-testid="modes"] button')).toHaveText(["Standard", "Wilds only", "Launcher"]);
  await expect(modeButton(page, "classic")).toHaveAttribute("aria-pressed", "true");
  await expect(modeButton(page, "all-wild")).toHaveAttribute("aria-pressed", "false");
  await expect(page.locator("#mode-label")).toHaveText("Mode");
  await expect(page.locator('[data-testid="mode-note"]')).toContainText("Standard");
  expect(errors).toEqual([]);
});

test("wilds only deals a hand of wilds, and standard deals the usual cards again", async ({ page }) => {
  const errors = await open(page, "lang=en&rules=classic&computers=3");
  await press(modeButton(page, "all-wild"));
  await expect(modeButton(page, "all-wild")).toHaveAttribute("aria-pressed", "true");
  await expect(modeButton(page, "classic")).toHaveAttribute("aria-pressed", "false");
  await expect(page.locator('[data-testid="mode-note"]')).toContainText("Wilds only");
  await expect(page.locator(".ht-hand button")).toHaveCount(7);
  expect((await hand(page)).every((label) => /wild/i.test(label))).toBe(true);
  // The code on the page says so, in the tag, the script and with the command line's one limit.
  await expect(page.locator('[data-testid="using-tag"]')).toContainText(
    'rules="classic" mode="all-wild" computers="3"',
  );
  await expect(page.locator('[data-testid="using-script"]')).toContainText('{ ...HITOTSU_CLASSIC, mode: "all-wild" }');
  await expect(page.locator('[data-testid="using-cli"]')).toContainText("standard deck only");
  await press(modeButton(page, "classic"));
  await expect(page.locator(".ht-hand button")).toHaveCount(7);
  expect((await hand(page)).some((label) => !/wild/i.test(label))).toBe(true);
  await expect(page.locator('[data-testid="using-tag"]')).not.toContainText("mode=");
  await expect(page.locator('[data-testid="using-cli"]')).not.toContainText("standard deck only");
  expect(errors).toEqual([]);
});

test("a launcher fires a random number of cards, one to four, in place of a draw", async ({ page }) => {
  const errors = await open(page, "lang=en&rules=classic&computers=1&mode=launcher");
  await expect(modeButton(page, "launcher")).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator('[data-testid="mode-note"]')).toContainText("Launcher");
  await expect(page.locator(".ht-hand button")).toHaveCount(7);
  await expect(page.locator('[data-testid="using-tag"]')).toContainText('mode="launcher"');
  await press(page.locator('[data-testid="ht-stock"]'));
  await expect(page.locator(".ht-hand button")).not.toHaveCount(7);
  const drawn = (await page.locator(".ht-hand button").count()) - 7;
  expect(drawn).toBeGreaterThanOrEqual(1);
  expect(drawn).toBeLessThanOrEqual(4);
  expect(errors).toEqual([]);
});

test("an address opens the mode it names, a bad one opens the standard deck, and the link to a deal carries it", async ({
  page,
}) => {
  const errors = await open(page, "lang=en&rules=party&computers=5&mode=all-wild");
  await expect(modeButton(page, "all-wild")).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator('[data-testid="rules"] [data-mode="party"]')).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".ht-hand button")).toHaveCount(5);
  expect((await hand(page)).every((label) => /wild/i.test(label))).toBe(true);
  // The link to this deal says the mode, like the rules and the computers.
  await page
    .context()
    .grantPermissions(["clipboard-read", "clipboard-write"])
    .catch(() => {});
  const link = await page.evaluate(() => {
    const written = [];
    Object.defineProperty(globalThis.navigator, "clipboard", {
      value: { writeText: (text) => written.push(text) || Promise.resolve() },
      configurable: true,
    });
    globalThis.document.querySelector('[data-testid="share"]').click();
    return written;
  });
  expect(link).toHaveLength(1);
  expect(new URL(link[0]).searchParams.get("mode")).toBe("all-wild");
  expect(new URL(link[0]).searchParams.get("rules")).toBe("party");
  await page.goto("http://modes.test/?seed=2026&help=off&lang=en&mode=nonsense");
  await expect(page.locator("html")).toHaveAttribute("data-ready", "true");
  await expect(modeButton(page, "classic")).toHaveAttribute("aria-pressed", "true");
  expect(errors).toEqual([]);
});

test("the embed frame takes the mode, so the builder's preview plays it", async ({ page }) => {
  const errors = await open(page, "lang=en");
  await page.goto("http://modes.test/embed/?mode=all-wild&rules=classic&computers=2&seed=2026");
  await expect(page.locator(".ht-hand button").first()).toBeVisible();
  expect((await hand(page)).every((label) => /wild/i.test(label))).toBe(true);
  await page.goto("http://modes.test/embed/?mode=nonsense&rules=classic&computers=2&seed=2026");
  await expect(page.locator(".ht-hand button").first()).toBeVisible();
  expect((await hand(page)).some((label) => !/wild/i.test(label))).toBe(true);
  expect(errors).toEqual([]);
});

test("in Japanese the row, its note and the table speak Japanese", async ({ page }) => {
  const errors = await open(page, "lang=ja&rules=classic&computers=3&mode=all-wild");
  await expect(page.locator("#mode-label")).toHaveText("モード");
  await expect(page.locator('[data-testid="modes"] button')).toHaveText(["基本", "ワイルドのみ", "ランチャー"]);
  await expect(modeButton(page, "all-wild")).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator('[data-testid="mode-note"]')).toContainText("ワイルドのみ");
  await press(modeButton(page, "launcher"));
  await expect(page.locator('[data-testid="mode-note"]')).toContainText("ランチャー");
  expect(errors).toEqual([]);
});

for (const width of [320, 360, 390, 600, 768, 1280])
  for (const lang of ["en", "ja"])
    test(`at ${width} pixels, in ${lang}, choosing each mode moves nothing in the set-up`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      const errors = await open(page, `lang=${lang}&rules=classic&computers=3`);
      const first = await places(page);
      for (const mode of [...MODES.slice(1), ...MODES.slice(0, 1), "launcher", "all-wild", "classic"]) {
        await press(modeButton(page, mode));
        await expect(modeButton(page, mode)).toHaveAttribute("aria-pressed", "true");
        same(await places(page), first, `${mode}`);
      }
      // The other choices do not move it either, with a mode chosen.
      await press(modeButton(page, "launcher"));
      for (const choice of ['[data-testid="rules"] [data-mode="party"]', '[data-testid="counts"] [data-count="7"]']) {
        await press(page.locator(choice));
        same(await places(page), first, `${choice} with a launcher`);
      }
      expect(await page.evaluate(() => globalThis.document.documentElement.scrollWidth <= globalThis.innerWidth)).toBe(
        true,
      );
      expect(errors).toEqual([]);
    });
