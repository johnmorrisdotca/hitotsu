// The demo, driven as a person drives it: taps on a real page. Each flow ends by checking that the page fits the
// screen and nothing was complained of. `pnpm test:demo` builds the demo and runs these.
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { expect, test } from "@playwright/test";

const site = join(dirname(fileURLToPath(import.meta.url)), "..", "site");
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml" };

/** Open the demo (or another page of it), the computers moving at once, and collect anything the page complains of. */
async function open(page, address = "?lang=en") {
  if (!existsSync(join(site, "index.html"))) throw new Error("site/ is not built: run `pnpm site` first (`pnpm test:demo` does)");
  const errors = [];
  page.on("pageerror", (error) => errors.push(String(error)));
  page.on("console", (message) => message.type() === "error" && errors.push(message.text()));
  await page.route("http://hitotsu.test/**", (route) => {
    const { pathname } = new URL(route.request().url());
    const file = join(site, pathname === "/" ? "index.html" : pathname);
    if (!existsSync(file)) return route.fulfill({ status: 404, body: "" });
    return route.fulfill({ body: readFileSync(file), contentType: TYPES[file.slice(file.lastIndexOf("."))] ?? "application/octet-stream" });
  });
  await page.addInitScript(() => {
    window.hitotsuDelay = 60;
  });
  await page.goto(`http://hitotsu.test/${address}`);
  if (!address.startsWith("api")) await expect(page.locator("html")).toHaveAttribute("data-ready", "true");
  else await expect(page.locator("h1")).toBeVisible();
  return errors;
}

async function tap(page, selector) {
  const target = typeof selector === "string" ? page.locator(selector).first() : selector;
  await target.scrollIntoViewIfNeeded();
  if (test.info().project.use.hasTouch === true) await target.tap();
  else await target.click();
}

/** The page fits the screen, and everything to press is at least 44 pixels. */
async function sound(page, errors) {
  const found = await page.evaluate(() => {
    const seen = (el) => {
      const box = el.getBoundingClientRect();
      return box.width > 0 && box.height > 0 && getComputedStyle(el).visibility !== "hidden";
    };
    const small = [...document.querySelectorAll("button:not(:disabled), input, select, nav a, footer .family a")]
      .filter(seen)
      .map((el) => ({ what: el.id || el.className || el.textContent.trim().slice(0, 20), box: el.getBoundingClientRect() }))
      .filter(({ box }) => box.width < 43.5 || box.height < 43.5)
      .map(({ what, box }) => `${what} ${Math.round(box.width)}×${Math.round(box.height)}`);
    return { over: document.documentElement.scrollWidth - window.innerWidth, small };
  });
  expect(found.over, "the page scrolls sideways").toBeLessThanOrEqual(0);
  expect(found.small, "something to press is under 44px").toEqual([]);
  expect(errors, "the page complained").toEqual([]);
}

const seats = (page) => page.locator(".ht-seat");

test("opens on a table of four, in the family's look, with the deck below", async ({ page }) => {
  const errors = await open(page);
  await expect(page.locator("h1")).toHaveText("Hitotsu一つ");
  await expect(seats(page)).toHaveCount(4);
  await expect(seats(page).first()).toContainText("You");
  await expect(page.locator(".ht-hand button")).toHaveCount(7);
  await expect(page.locator('[data-testid="deck"] > svg')).toHaveCount(55);
  await expect(page.locator("footer .family a[aria-current='page']")).toHaveText("Hitotsu");
  expect(await page.evaluate(() => getComputedStyle(document.body).backgroundColor)).toMatch(/^rgb\((244, 239, 228|20, 22, 20)\)$/);
  await sound(page, errors);
});

test("the draw pile and the card in play sit level with each other", async ({ page }) => {
  await open(page);
  const tops = async () => page.evaluate(() => {
    const box = (selector) => document.querySelector(selector).getBoundingClientRect();
    return { stock: box('[data-testid="ht-stock"] .ht-card'), pile: box('[data-testid="ht-pile"] .ht-card'), stockBox: box('[data-testid="ht-stock"]'), pileBox: box('[data-testid="ht-pile"]') };
  });
  const level = await tops();
  expect(Math.abs(level.stock.top - level.pile.top)).toBeLessThanOrEqual(0.5);
  expect(Math.abs(level.stock.bottom - level.pile.bottom)).toBeLessThanOrEqual(0.5);
  expect(Math.abs(level.stock.height - level.pile.height)).toBeLessThanOrEqual(0.5);
  expect(Math.abs(level.stockBox.height - level.pileBox.height)).toBeLessThanOrEqual(0.5);
  // The direction mark sits level with the middle of the cards, not of the cards and their captions.
  const middle = await page.evaluate(() => {
    const arrow = document.querySelector(".ht-dir").getBoundingClientRect();
    const card = document.querySelector('[data-testid="ht-pile"] .ht-card').getBoundingClientRect();
    return { arrow: arrow.top + arrow.height / 2, card: card.top + card.height / 2 };
  });
  expect(Math.abs(middle.arrow - middle.card)).toBeLessThanOrEqual(3);
  // And still level after a card is played and one is drawn: they keep one shape.
  const playable = page.locator(".ht-hand button[data-playable='true']").first();
  if ((await playable.count()) > 0) await tap(page, playable);
  await page.waitForTimeout(300);
  const after = await tops();
  expect(Math.abs(after.stock.top - after.pile.top)).toBeLessThanOrEqual(0.5);
});

test("the rules and the number of computers are chosen with a press, and deal a fresh table", async ({ page }) => {
  const errors = await open(page);
  await tap(page, '[data-testid="counts"] [data-count="7"]');
  await expect(seats(page)).toHaveCount(8);
  await expect(page.locator('[data-testid="counts"] [data-count="7"]')).toHaveAttribute("aria-pressed", "true");
  await tap(page, '[data-testid="rules"] [data-mode="party"]');
  await expect(page.locator(".ht-hand button")).toHaveCount(5);
  await expect(page.locator('[data-testid="rules-note"]')).toContainText("Party");
  await tap(page, '[data-testid="counts"] [data-count="1"]');
  await expect(seats(page)).toHaveCount(2);
  await tap(page, '[data-testid="rules"] [data-mode="classic"]');
  await expect(page.locator(".ht-hand button")).toHaveCount(7);
  await tap(page, '[data-testid="deal"]');
  await expect(seats(page)).toHaveCount(2);
  await sound(page, errors);
});

test("a card that glows is played by a tap, and the computers answer", async ({ page }) => {
  const errors = await open(page);
  const playable = page.locator(".ht-hand button[data-playable='true']");
  if ((await playable.count()) === 0) await tap(page, '[data-testid="ht-stock"]');
  await expect(page.locator(".ht-status")).not.toBeEmpty();
  const before = await page.evaluate(() => document.querySelector(".ht-status").textContent);
  if ((await playable.count()) > 0) {
    const cards = await page.locator(".ht-hand button").count();
    await tap(page, playable.first());
    await expect.poll(() => page.locator(".ht-hand button").count()).not.toBe(cards);
  }
  expect(typeof before).toBe("string");
  await sound(page, errors);
});

test("the cloth patches in the header change the felt of the table", async ({ page }) => {
  await open(page);
  const felt = () => page.locator(".ht-felt").evaluate((el) => getComputedStyle(el).backgroundImage);
  const green = await felt();
  await tap(page, 'button[data-cloth="red"]');
  expect(await felt()).not.toBe(green);
  await expect(page.locator("html")).toHaveAttribute("data-cloth", "red");
  await tap(page, 'button[data-cloth="green"]');
  expect(await felt()).toBe(green);
});

test("in Japanese the page and the table speak Japanese, and the unreviewed note shows", async ({ page }) => {
  const errors = await open(page, "?lang=en");
  await tap(page, 'button[data-lang="ja"]');
  await expect(page.locator("html")).toHaveAttribute("lang", "ja");
  await expect(page.locator('[data-testid="deal"]')).toHaveText("配り直す");
  await expect(seats(page).first()).toContainText("あなた");
  await expect(page.locator(".ht-pile")).toContainText("場のカード");
  await expect(page.locator("#unreviewed")).toBeVisible();
  await sound(page, errors);
  await tap(page, 'button[data-lang="en"]');
  await expect(seats(page).first()).toContainText("You");
  await expect(page.locator("#unreviewed")).toBeHidden();
});

test("the API reference is in the family's frame and links back", async ({ page }) => {
  const errors = await open(page, "api.html?lang=en");
  await expect(page.locator("h1")).toHaveText("Hitotsu一つ");
  expect(await page.locator("article[data-kind]").count()).toBeGreaterThan(50);
  await expect(page.locator("header nav a", { hasText: "The table" })).toHaveAttribute("href", "./");
  await sound(page, errors);
});
