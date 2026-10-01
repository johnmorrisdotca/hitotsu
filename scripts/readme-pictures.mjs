// Takes the pictures the README shows, from the built demo in `site/`: `pnpm pictures` (builds the demo, then runs this).
// The page is served to a browser without a port, never fetched from the live site, and the same each run:
// `Math.random` is a seeded generator, the computers move at once and motion is reduced.
// Output: docs/desktop.jpg (1280 wide, light, English), docs/phone.jpg (390 by 844, dark, Japanese), docs/deck.jpg.
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { chromium } from "@playwright/test";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const site = join(root, "site");
const docs = join(root, "docs");
const host = "http://hitotsu.test";
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml" };
const QUALITY = 76;

if (!existsSync(join(site, "index.html"))) throw new Error("site/ is not built: run `pnpm pictures` (it builds the demo first)");
const browser = await chromium.launch();

/** Open the built demo, the same every time. */
async function open({ width, height, colorScheme, lang }) {
  const context = await browser.newContext({ viewport: { width, height }, colorScheme, reducedMotion: "reduce", locale: "en-US", deviceScaleFactor: 2 });
  const page = await context.newPage();
  await page.route(`${host}/**`, (route) => {
    const { pathname } = new URL(route.request().url());
    const file = join(site, pathname === "/" ? "index.html" : pathname);
    if (!existsSync(file)) return route.fulfill({ status: 404, body: "" });
    return route.fulfill({ body: readFileSync(file), contentType: TYPES[file.slice(file.lastIndexOf("."))] ?? "application/octet-stream" });
  });
  await page.addInitScript(() => {
    window.hitotsuDelay = 0;
    let seed = 2026;
    Math.random = () => {
      seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  });
  await page.goto(`${host}/?lang=${lang}`);
  await page.locator("html[data-ready='true']").waitFor({ state: "attached" });
  return { page, context };
}

/** Play `turns` turns as a person does: choose a colour for a wild, else tap a glowing card, else draw, else press what is offered. */
async function play(page, turns) {
  const mine = ".ht-actions button:not(:disabled):not([aria-pressed])";
  const playable = page.locator(".ht-hand button[data-playable='true']");
  for (let n = 0; n < turns; n += 1) {
    // Wait for the table to be the person's.
    await page.waitForFunction((offered) => document.querySelector(".ht-hand button[data-playable='true']") || !document.querySelector('[data-testid="ht-stock"]').disabled || document.querySelector(offered), mine);
    if ((await page.locator(`${mine}[data-colour]`).count()) > 0) await page.locator(`${mine}[data-colour]`).first().click();
    else if ((await playable.count()) > 0) await playable.first().click();
    else if (await page.locator('[data-testid="ht-stock"]').isEnabled()) await page.locator('[data-testid="ht-stock"]').click();
    else await page.locator(mine).first().click();
    await page.waitForTimeout(150);
  }
  await page.waitForTimeout(400);
}

const jpeg = (path) => ({ path, type: "jpeg", quality: QUALITY });

{
  const { page, context } = await open({ width: 1280, height: 900, colorScheme: "light", lang: "en" });
  await play(page, 3);
  await page.screenshot(jpeg(join(docs, "desktop.jpg")));
  await context.close();
}
{
  const { page, context } = await open({ width: 390, height: 844, colorScheme: "dark", lang: "ja" });
  await page.locator('[data-testid="rules"] [data-mode="party"]').click();
  await play(page, 3);
  await page.locator('[data-testid="table"]').evaluate((element) => window.scrollTo(0, element.getBoundingClientRect().top + window.scrollY - 16));
  await page.screenshot(jpeg(join(docs, "phone.jpg")));
  await context.close();
}
{
  const { page, context } = await open({ width: 1280, height: 900, colorScheme: "light", lang: "en" });
  // The deck, with a little room round it for the cards' shadows.
  const box = await page.locator('[data-testid="deck"]').boundingBox();
  await page.screenshot({ ...jpeg(join(docs, "deck.jpg")), clip: { x: box.x - 12, y: box.y - 12, width: box.width + 24, height: box.height + 24 }, fullPage: true });
  await context.close();
}
await browser.close();
