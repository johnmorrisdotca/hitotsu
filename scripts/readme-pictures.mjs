// Takes the pictures the README shows, from the built demo in `site/`: `pnpm screenshots:readme` (builds the demo, then runs this).
// The family's standard is in johnmorrisdotca/.github (README-STANDARD.md); the shared part is readme-pictures-lib.mjs.
// The page is served to a browser without a port, never fetched from the live site, and the same each run: the deal is named by
// the address (rules, computers, seed), `Math.random` is a seeded generator, the computers move at once, motion is reduced, and
// every turn the pictures play is played as a person does, by tapping a glowing card, and waited for on the table's own marks.
// Output: docs/images/<subject>-<desk|phone>-<light|dark>.webp.
import { takePictures } from "./readme-pictures-lib.mjs";

const READY = 'html[data-ready="true"] .ht-hand';
const address = (query, lang = "en") => `/?lang=${lang}&help=off&seed=2026&${query}`;
const TABLE = '[data-testid="table"]';
const MINE = ".ht-actions button:not(:disabled):not([aria-pressed])";
const PLAYABLE = ".ht-hand button[data-playable]";
const STOCK = '[data-testid="ht-stock"]';

/** The game as the table shows it now, so that a move can be waited for. */
const looks = (page) => page.evaluate(() => `${document.querySelectorAll(".ht-hand button").length}|${document.querySelector('[data-testid="ht-pile"]')?.innerHTML.length}|${document.querySelector(".ht-status")?.textContent}|${[...document.querySelectorAll(".ht-seat")].map((seat) => seat.textContent).join("/")}|${document.querySelector(".ht-actions")?.textContent}`);

/** Play `count` turns as a person does: choose a colour for a wild, else tap a glowing card, else draw, else press what is offered. */
async function play(page, count) {
  for (let turn = 0; turn < count; turn += 1) {
    // Wait for the table to be the person's.
    await page.waitForFunction(([mine, playable]) => document.querySelector(".ht-seat")?.hasAttribute("data-turn") && (document.querySelector(playable) || !document.querySelector('[data-testid="ht-stock"]').disabled || document.querySelector(mine)), [MINE, PLAYABLE]);
    const before = await looks(page);
    if ((await page.locator(`${MINE}[data-colour]`).count()) > 0) await page.locator(`${MINE}[data-colour]`).first().click();
    else if ((await page.locator(PLAYABLE).count()) > 0) await page.locator(PLAYABLE).first().click();
    else if (await page.locator(STOCK).isEnabled()) await page.locator(STOCK).click();
    else await page.locator(MINE).first().click();
    await page.waitForFunction((was) => `${document.querySelectorAll(".ht-hand button").length}|${document.querySelector('[data-testid="ht-pile"]')?.innerHTML.length}|${document.querySelector(".ht-status")?.textContent}|${[...document.querySelectorAll(".ht-seat")].map((seat) => seat.textContent).join("/")}|${document.querySelector(".ht-actions")?.textContent}` !== was, before);
  }
  await page.waitForFunction(([mine, playable]) => document.querySelector(".ht-seat")?.hasAttribute("data-turn") && (document.querySelector(playable) || !document.querySelector('[data-testid="ht-stock"]').disabled || document.querySelector(mine)), [MINE, PLAYABLE]);
}

const scrollTo = (selector) => (page) => page.locator(selector).evaluate((element) => window.scrollTo(0, element.getBoundingClientRect().top + window.scrollY - 16));
/** Before the page loads: the computers answer at once, and `Math.random` is a seeded generator, so a deal is the same every time. */
const steady = () => {
  window.hitotsuDelay = 0;
  let seed = 2026;
  Math.random = () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

await takePictures({
  shots: [
    // A few turns into a table of four, from the top of the page. On a phone, in Japanese, in party mode, scrolled to the table.
    {
      subject: "hero",
      views: ["desk", "phone"],
      url: address("rules=classic&computers=3"),
      init: steady,
      ready: READY,
      height: 900,
      async prepare(page, { view }) {
        if (view === "phone") {
          await page.goto(`http://hitotsu.test${address("rules=party&computers=3", "ja")}`);
          await page.waitForSelector(READY);
          await play(page, 2);
          await scrollTo(TABLE)(page);
        } else {
          await play(page, 3);
          await page.evaluate(() => window.scrollTo(0, 0));
        }
      },
    },
    // The table in the middle of a hand: the seats along the top with whose turn it is, the stock and the pile, and the hand with the cards that may be played glowing.
    { subject: "table", views: ["desk"], url: address("rules=classic&computers=3"), init: steady, ready: READY, target: TABLE, prepare: (page) => play(page, 3) },
    // Party mode: stacking draw cards, jumping in, and sevens and zeros, on a phone.
    { subject: "party", views: ["phone"], url: address("rules=party&computers=5"), init: steady, ready: READY, target: TABLE, prepare: (page) => play(page, 1) },
    // The largest table: you and seven computers.
    { subject: "eight-players", views: ["desk"], url: address("rules=classic&computers=7"), init: steady, ready: READY, target: TABLE },
    // The deck: zero to nine, skip, reverse and draw two in four colours, each with its element in the corners; the wilds and the back.
    { subject: "deck", views: ["desk"], url: address("rules=classic&computers=3"), ready: READY, target: '[data-testid="deck"]' },
    // The set-up: classic or party rules, how many computers, and sound.
    { subject: "set-up", views: ["desk"], url: address("rules=classic&computers=3"), ready: READY, target: "section.setup" },
    // The code for the table on the screen, as a tag, as a script and as the command line.
    { subject: "using-it", views: ["desk"], url: address("rules=party&computers=3"), ready: READY, target: 'section[aria-labelledby="using-title"]' },
  ],
});
