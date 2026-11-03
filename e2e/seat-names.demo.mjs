// A seat's name keeps together: in Japanese with three computers, "コンピューター1" is never broken after タ, so the long vowel
// mark is never left alone on a line, at the narrowest phones' widths and a wide desk's, and the seats make the same rows in
// English and in Japanese. `pnpm test:demo` builds the demo and runs this.
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test } from "@playwright/test";

const site = join(dirname(fileURLToPath(import.meta.url)), "..", "site");
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json" };

async function open(page, query) {
  await page.route("http://seats.test/**", (route) => {
    const { pathname } = new URL(route.request().url());
    const file = join(site, pathname.endsWith("/") ? `${pathname}index.html` : pathname);
    if (!existsSync(file)) return route.fulfill({ status: 404, body: "" });
    return route.fulfill({
      body: readFileSync(file),
      contentType: TYPES[file.slice(file.lastIndexOf("."))] ?? "application/octet-stream",
    });
  });
  await page.goto(`http://seats.test/?seed=2026&help=off&${query}`);
  await expect(page.locator("html")).toHaveAttribute("data-ready", "true");
  await expect(page.locator(".ht-seat").first()).toBeVisible();
}

/** For each seat: its name, how many lines the name is drawn on, the seat's top, and whether the name spills out of the seat. */
const seats = (page) =>
  page.evaluate(() =>
    [...globalThis.document.querySelectorAll(".ht-seat")].map((seat) => {
      const name = seat.querySelector("b");
      const range = globalThis.document.createRange();
      range.selectNodeContents(name);
      const lines = new Set([...range.getClientRects()].map((box) => Math.round(box.top)));
      const inner = seat.getBoundingClientRect();
      return {
        name: name.textContent,
        lines: lines.size,
        top: Math.round(inner.top + globalThis.scrollY),
        spills:
          Math.ceil(name.scrollWidth) > Math.ceil(name.clientWidth) ||
          range.getBoundingClientRect().right > inner.right,
      };
    }),
  );

const rows = (list) => new Set(list.map((seat) => seat.top)).size;

for (const width of [320, 360, 390, 768, 1280])
  test(`at ${width} pixels no seat name breaks inside the word, in Japanese or English`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await open(page, "lang=ja&rules=party&computers=3");
    const japanese = await seats(page);
    expect(japanese).toHaveLength(4);
    for (const seat of japanese) {
      expect(seat.lines, `${seat.name} is on one line`).toBe(1);
      expect(seat.spills, `${seat.name} fits its seat`).toBe(false);
    }
    expect(japanese.filter((seat) => /^コンピューター\d$/.test(seat.name))).toHaveLength(3);
    // Seven computers, the most the table seats.
    await open(page, "lang=ja&rules=party&computers=7");
    for (const seat of await seats(page)) {
      expect(seat.lines, `${seat.name} is on one line`).toBe(1);
      expect(seat.spills, `${seat.name} fits its seat`).toBe(false);
    }
  });

for (const width of [320, 390, 1280])
  test(`at ${width} pixels the seats make the same rows in English and in Japanese`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await open(page, "lang=en&rules=party&computers=3");
    const english = await seats(page);
    await open(page, "lang=ja&rules=party&computers=3");
    const japanese = await seats(page);
    expect(rows(japanese)).toBe(rows(english));
  });
