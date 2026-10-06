<h1 align="center">Hitotsu <sub>一つ</sub></h1>

<p align="center"><strong>The colour-card game, with the house rules people actually play.</strong><br>
Match the colour or the number, and call Hitotsu with one card left. Two to eight players, a computer for any seat, a table for several devices, and a deck of its own.</p>

<p align="center">
  <a href="https://github.com/johnmorrisdotca/hitotsu/actions/workflows/ci.yml"><img alt="CI" src="https://github.com/johnmorrisdotca/hitotsu/actions/workflows/ci.yml/badge.svg"></a>
  <a href="https://www.npmjs.com/package/@johnmorrisdotca/hitotsu"><img alt="npm" src="https://img.shields.io/npm/v/@johnmorrisdotca/hitotsu?color=2f5d4a"></a>
  <a href="./LICENSE"><img alt="MIT licence" src="https://img.shields.io/badge/licence-MIT-2f5d4a"></a>
  <img alt="No dependencies" src="https://img.shields.io/badge/dependencies-0-2f5d4a">
  <img alt="TypeScript" src="https://img.shields.io/badge/types-TypeScript-3178c6">
</p>

<p align="center"><a href="https://johnmorrisdotca.github.io/hitotsu/"><strong>Play a hand →</strong></a> · <a href="https://johnmorrisdotca.github.io/hitotsu/api.html">API reference</a></p>

<table align="center">
<tr>
<td align="center" valign="top">
<picture>
<source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/johnmorrisdotca/hitotsu/main/docs/images/hero-desk-dark.webp">
<img src="https://raw.githubusercontent.com/johnmorrisdotca/hitotsu/main/docs/images/hero-desk-light.webp" alt="The demo on a desk, in English, a few turns into a classic game for four: the page header with the language chooser, five cloth patches and the Help switch, the choices of rules, computers and sound, the seats along the top (You outlined because it is your turn, and three computers), the stock face down and a card in play on the green felt, and your hand with the cards that may be played glowing" width="600">
</picture>
<br><em>The demo on a desk: a classic game for four, three turns in.</em>
</td>
<td align="center" valign="top">
<picture>
<source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/johnmorrisdotca/hitotsu/main/docs/images/hero-phone-dark.webp">
<img src="https://raw.githubusercontent.com/johnmorrisdotca/hitotsu/main/docs/images/hero-phone-light.webp" alt="The demo on a phone, in Japanese, in party mode: the four seats, the stock and a red draw two in play on the green felt, the status line in Japanese, and a hand of three cards with the wild draw four glowing, and the four colours to choose from under it" width="190">
</picture>
<br><em>On a phone, in Japanese, in the device's light or dark.</em>
</td>
</tr>
</table>


*Hitotsu* means "one" in Japanese: the call a player makes with one card
left. It began as the colour-card game on [Itsutsu](https://itsutsu.com/games/hitotsu),
a site for board and table games, which uses this package for its rules, its
computer player, its tables on several devices and its cards.
## In 30 seconds

```sh
npm install @johnmorrisdotca/hitotsu    # or pnpm add, or yarn add
```

```ts no-run
import { HITOTSU_PARTY, mountHitotsu } from "@johnmorrisdotca/hitotsu";

mountHitotsu(document.getElementById("table")!, { rules: HITOTSU_PARTY });
```

That is a whole table: you and three computers, with the party rules. Or with
no script of your own:

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@johnmorrisdotca/hitotsu@1/dist/element-define.js"></script>
<hitotsu-table rules="party" computers="3"></hitotsu-table>
```

## Who it is for

- **Anybody putting a card game on a page.** The rules, the deal, the turn
  order, the scoring and a computer player are done, and so is a table to play
  it at. You can take all of it, or only the rules and draw your own.
- **Games sites and apps.** A table for several devices checks what arrives
  over the wire, and a saved game cannot hold a position the rules would not
  reach.
- **Bots and research.** Pure functions over plain data: play a thousand games
  in a loop, and replay any one from its seed.
- **Teaching.** The rules are a few hundred lines you can read, with their
  tests beside them.

## Features

- **The familiar game.** Numbers in four colours, Skip, Reverse, Draw Two,
  Wild and Wild Draw Four; the call with one card left, and two cards for
  forgetting it. Scored by the cards left in the other hands, to 200 or 500
  points, or a single hand.
- **The house rules, as options.** Stacking draw cards (the same card, or any
  on any), jump-in, sevens and zeros, draw until you can play, and the Wild
  Draw Four challenged or played without bluffing. `HITOTSU_CLASSIC` and
  `HITOTSU_PARTY` are ready-made; mix your own.
- **Pure and replayable.** Every function takes a game and returns a new one.
  A game is its set-up, a seed and its moves, kept as one line of text and read
  back by playing the moves again through the rules, so a saved game can never
  hold a position the rules would not reach.
- **A computer player** that stacks rather than takes, challenges a big hand's
  Wild Draw Four, saves its wilds, never bluffs and always calls. It sees only
  what a player at the table could.
- **Ready for several devices.** `readTableSetUp`, `startTable` and
  `readTableMove` check what arrives over the wire, and jumping in, a race no
  server can referee fairly, is taken off.
- **A deck of its own**, drawn as SVG: each colour carries one of the five
  elements in its corners (火 fire, 土 earth, 木 wood, 水 water), so no card is
  told by colour alone.
- **A table for any page**, in plain DOM, as a `<hitotsu-table>` tag, and as
  React components for the table and the cards. Light and dark, and themeable.
- **English and Japanese**, at the table and on the command line, following the
  page's `lang`.
- **Card sounds**, optional: cards dealt, played and shuffled, from real
  recordings, fetched only when the first one plays.
- **A command line**, `hitotsu`, that deals a game, lets computers play it out
  and reads a saved game back through the rules.


### What's in it

Each picture is the real table, drawn by the package and taken from [the demo](https://johnmorrisdotca.github.io/hitotsu/) with `pnpm screenshots:readme`, in light and dark.

<table>
<tr>
<td align="center" valign="top" width="50%">
<picture>
<source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/johnmorrisdotca/hitotsu/main/docs/images/table-desk-dark.webp">
<img src="https://raw.githubusercontent.com/johnmorrisdotca/hitotsu/main/docs/images/table-desk-light.webp" alt="A table of four on a desk after three turns of a classic game: the seats along the top (You, Computer 1, 2 and 3, with their card counts and points, and You outlined because it is your turn), the draw stock face down and a green four in play on a dark green felt, the line Your turn. Play green, the same number or symbol, or a wild, and your hand of four cards with the playable ones glowing" width="400">
</picture>
<br><em><strong>The table.</strong> The seats, the stock and the pile, and your hand with the cards you may play glowing.</em>
</td>
<td align="center" valign="top" width="50%">
<picture>
<source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/johnmorrisdotca/hitotsu/main/docs/images/eight-players-desk-dark.webp">
<img src="https://raw.githubusercontent.com/johnmorrisdotca/hitotsu/main/docs/images/eight-players-desk-light.webp" alt="The largest table on a desk: eight seats along the top (You and Computer 1 to 7, each with seven cards and 0 points), the draw stock and a yellow four in play on the green felt, the line Your turn. Play yellow, the same number or symbol, or a wild, and a hand of seven cards with three glowing" width="400">
</picture>
<br><em><strong>Up to eight players.</strong> You and seven computers; the seats wrap on a narrow screen.</em>
</td>
</tr>
<tr>
<td align="center" valign="top" width="50%">
<picture>
<source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/johnmorrisdotca/hitotsu/main/docs/images/party-phone-dark.webp">
<img src="https://raw.githubusercontent.com/johnmorrisdotca/hitotsu/main/docs/images/party-phone-light.webp" alt="Party mode on a phone, a table of six: the seats in two rows, the draw stock with 77 cards left and a yellow four in play, the status line Your turn, a hand of five cards with the wild draw four glowing, and four round buttons to choose the colour: red, yellow, green and blue" width="240">
</picture>
<br><em><strong>Party mode.</strong> Stacking draw cards, jumping in, and sevens and zeros; a wild asks for its colour.</em>
</td>
<td align="center" valign="top" width="50%">
<picture>
<source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/johnmorrisdotca/hitotsu/main/docs/images/deck-desk-dark.webp">
<img src="https://raw.githubusercontent.com/johnmorrisdotca/hitotsu/main/docs/images/deck-desk-light.webp" alt="The whole deck of 108 cards in rows: zero to nine, skip, reverse and draw two in red, yellow, green and blue, each with an element character in the corners (火 fire on red, 土 earth on yellow, 木 wood on green, 水 water on blue), then the wilds with 五 and the wild draw fours, and the dark back of a card with the circle of four colours and 一つ" width="400">
</picture>
<br><em><strong>The deck.</strong> Four colours with an element in the corners, so no card is told by colour alone, and the wilds.</em>
</td>
</tr>
<tr>
<td align="center" valign="top" width="50%">
<picture>
<source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/johnmorrisdotca/hitotsu/main/docs/images/set-up-desk-dark.webp">
<img src="https://raw.githubusercontent.com/johnmorrisdotca/hitotsu/main/docs/images/set-up-desk-light.webp" alt="The demo's choices on a desk: the rules (Classic chosen, Party), the number of computers (1, 3 chosen, 5, 7), the Sound switch (Off chosen, On), the Deal again button, and the line Classic: seven cards, one hand; match the colour or the number; draw cards may not be stacked" width="400">
</picture>
<br><em><strong>The options.</strong> Classic or party rules, one to seven computers, and sound.</em>
</td>
<td align="center" valign="top" width="50%">
<picture>
<source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/johnmorrisdotca/hitotsu/main/docs/images/using-it-desk-dark.webp">
<img src="https://raw.githubusercontent.com/johnmorrisdotca/hitotsu/main/docs/images/using-it-desk-light.webp" alt="The demo's Using it panel on a desk: the table as a tag with its script line, as a script call to mountHitotsu, and the same deal on the command line, each in a box with a Copy button" width="400">
</picture>
<br><em><strong>The code behind the table.</strong> The panel shows the tag, the script and the command line that make the game on the screen.</em>
</td>
</tr>
</table>

## Use it in your project

### Install

```sh
npm install @johnmorrisdotca/hitotsu
# or: pnpm add @johnmorrisdotca/hitotsu
# or: yarn add @johnmorrisdotca/hitotsu
```

Every version is also a GitHub release with the built package attached, if you
would rather install that file by its address.

ES modules with TypeScript types. The core and the table have no
dependencies; the React components need React 18 or later. A page with no
bundler loads the tag from a CDN (`@1` is the major version).

### As a tag

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@johnmorrisdotca/hitotsu@1/dist/element-define.js"></script>

<hitotsu-table rules="party" computers="5" sound></hitotsu-table>
<hitotsu-table lang="ja" players="あなた,アキ,ベン"></hitotsu-table>
```

| Attribute | What it does |
| --- | --- |
| `rules` | `classic` (the default) or `party` |
| `computers` | how many computers sit with you, 1 to 7 |
| `players` | the names at the table, comma-separated, seat 0 first (yours); two to eight of them |
| `size` | `1` for a single hand (the default), `200` or `500` points |
| `seed` | the number the deals are shuffled from; a fresh one if not given |
| `lang` | `ja` for Japanese; the page's language unless said |
| `sound` | card sounds, when present (`sound="off"` turns them off again) |

Changing an attribute deals again. Every move is announced as a `hitotsu-move`
event carrying the game in `detail`, and the element has a `game` property and
a `deal()` method. The script above is `@johnmorrisdotca/hitotsu/element/define`
(`@johnmorrisdotca/hitotsu/element-define` is the same file under its first name),
which registers the tag by being imported; `@johnmorrisdotca/hitotsu/element`
exports the same class and registers nothing until you call `defineHitotsuTable()`. Any framework that
passes unknown tags through will carry it; Vue needs to be told that tags
starting `hitotsu-` are custom elements (`isCustomElement`), and Angular needs
`CUSTOM_ELEMENTS_SCHEMA`.

### A table with a script

```html
<div id="table"></div>
<script type="module">
  import { HITOTSU_PARTY, mountHitotsu } from "@johnmorrisdotca/hitotsu";

  mountHitotsu(document.getElementById("table"), {
    players: ["You", "Aki", "Ben", "Cy"],   // seat 0 is you, the rest computers
    rules: HITOTSU_PARTY,
    sound: true,
    onMove: (game) => console.log(game.news),
  });
</script>
```

### In React

```tsx
import { HITOTSU_CLASSIC } from "@johnmorrisdotca/hitotsu";
import { HitotsuCardImage, HitotsuTable } from "@johnmorrisdotca/hitotsu/react";

export function Table() {
  return <HitotsuTable rules={{ ...HITOTSU_CLASSIC, stacking: "any" }} size={500} />;
}

export const RedFive = () => <HitotsuCardImage card="R50" width={80} />;
```

`HitotsuTable` mounts in the browser after the first render, so server
rendering draws an empty box and nothing needs a provider.

### Just the rules

```ts
import { HITOTSU_PARTY, hitotsuComputer, hitotsuMoves, hitotsuWinners, playHitotsu, startHitotsu } from "@johnmorrisdotca/hitotsu";

let game = startHitotsu(1, ["Ann", "Ben", "Cy"], 42, HITOTSU_PARTY)!; // one hand, seed 42
hitotsuMoves(game);                  // every legal move for the player to move
game = playHitotsu(game, { draw: true })!;   // null for a move the rules refuse
while (game.phase === "playing") game = playHitotsu(game, hitotsuComputer(game))!;
hitotsuWinners(game);                // [1]
```

### In Vue

Vue needs to be told that tags starting `hitotsu-` are custom elements, which is a compiler option; after that the tag is used as it is, and its event is a native one.

```vue
<script setup>
import "@johnmorrisdotca/hitotsu/element/define";   // registers <hitotsu-table> by being imported

function moved(event) {
  console.log(event.detail.news);                   // what just happened, as data
}
</script>

<template>
  <hitotsu-table rules="party" computers="3" @hitotsu-move="moved"></hitotsu-table>
</template>
```

```js no-check
// vite.config.js: tell Vue that hitotsu-* tags are custom elements
import vue from "@vitejs/plugin-vue";

export default { plugins: [vue({ template: { compilerOptions: { isCustomElement: (tag) => tag.startsWith("hitotsu-") } } })] };
```

### In Svelte

Svelte passes unknown tags through, and `on:` listens to a custom event by its name.

```svelte
<script>
  import "@johnmorrisdotca/hitotsu/element/define";

  let news = "";
  const moved = (event) => { news = event.detail.news; };
</script>

<hitotsu-table rules="classic" computers="2" on:hitotsu-move={moved}></hitotsu-table>
<p>{JSON.stringify(news)}</p>
```

### In Angular

Angular needs `CUSTOM_ELEMENTS_SCHEMA` for a tag it does not know.

```ts no-check
import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import "@johnmorrisdotca/hitotsu/element/define";

@Component({
  selector: "app-table",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `<hitotsu-table rules="party" computers="3" (hitotsu-move)="moved($event)"></hitotsu-table>`,
})
export class TableComponent {
  moved(event: Event) { console.log((event as CustomEvent).detail.news); }
}
```

## Examples

Each example is a whole recipe: copy it and it works. The ones in TypeScript and JavaScript are run in CI against the built package (`pnpm test:readme`), so none of them is a guess, and the output shown is what they print.

### A table in a page with no script of your own

Save this as a file and open it. The tag registers itself when its module is imported, deals a game of four with the party rules, and plays it: you, and three computers.

```html
<!doctype html>
<meta charset="utf-8">
<title>Hitotsu</title>
<script type="module" src="https://cdn.jsdelivr.net/npm/@johnmorrisdotca/hitotsu@1/dist/element-define.js"></script>
<hitotsu-table rules="party" computers="3" seed="2026" sound></hitotsu-table>
```

### Listening to every move

Every move is announced as a `hitotsu-move` event carrying the game in `detail`, so a page can keep a log, show a score of its own or send the game to a server.

```html
<hitotsu-table id="table" rules="classic" computers="2"></hitotsu-table>
<ol id="log"></ol>
<script type="module">
  import "https://cdn.jsdelivr.net/npm/@johnmorrisdotca/hitotsu@1/dist/element-define.js";

  document.getElementById("table").addEventListener("hitotsu-move", (event) => {
    const item = document.createElement("li");
    item.textContent = JSON.stringify(event.detail.news);   // what just happened, as data
    document.getElementById("log").append(item);
  });
</script>
```

### A table you configure from a script

`mountHitotsu` takes an element and the choices, and gives back the game and a way to start again. Everything the table says can be replaced, and its colours are CSS variables.

```ts no-run
import { HITOTSU_PARTY, mountHitotsu } from "@johnmorrisdotca/hitotsu";

const table = mountHitotsu(document.querySelector<HTMLElement>("#table")!, {
  players: ["You", "Aki", "Ben", "Cy"],      // seat 0 is you, the rest are computers
  rules: HITOTSU_PARTY,
  size: 200,                                 // play to 200 points, not a single hand
  language: "ja",
  strings: { again: "もう一局" },             // one of the table's words, changed
  theme: { "--ht-felt": "#234" },            // the table's own colours
  onMove: (game) => console.log(game.phase, game.scores),
});
table.restart();                              // deal again with the same choices
table.destroy();                              // when the page lets it go
```

### Play a whole game in code

The rules are pure functions over plain data: a game goes in, a new one comes out, and `hitotsuComputer` is a move for whoever is to play. This is the game the command line plays for seed 42 with three players and the party rules.

```ts
import { HITOTSU_PARTY, hitotsuComputer, hitotsuWinners, playHitotsu, startHitotsu } from "@johnmorrisdotca/hitotsu";

let game = startHitotsu(1, ["Ann", "Ben", "Cy"], 42, HITOTSU_PARTY)!;   // one hand
let moves = 0;
while (game.phase === "playing") {
  game = playHitotsu(game, hitotsuComputer(game))!;
  moves += 1;
}
console.log(moves, "moves; winners:", hitotsuWinners(game), "scores:", game.scores);
```

```text
28 moves; winners: [ 1 ] scores: [ 0, 71, 0 ]
```

### A thousand games, in a loop

For a bot, a balance check or research, play a lot of hands: each is a seed, and any one of them can be replayed. Here, 200 hands of four computers on the classic rules.

```ts
import { HITOTSU_CLASSIC, hitotsuComputer, hitotsuWinners, playHitotsu, startHitotsu } from "@johnmorrisdotca/hitotsu";

const wins = [0, 0, 0, 0];
for (let seed = 1; seed <= 200; seed += 1) {
  let game = startHitotsu(1, ["a", "b", "c", "d"], seed, HITOTSU_CLASSIC)!;
  while (game.phase === "playing") game = playHitotsu(game, hitotsuComputer(game))!;
  for (const seat of hitotsuWinners(game)) wins[seat]! += 1;
}
console.log("hands won by seat:", wins);
```

```text
hands won by seat: [ 58, 51, 55, 36 ]
```

### The house rules, as options

The two ready-made sets are `HITOTSU_CLASSIC` and `HITOTSU_PARTY`; any mix is an object. `startHitotsu` is `null` for a table outside the limits.

```ts
import { HITOTSU_CLASSIC, HITOTSU_PARTY, startHitotsu } from "@johnmorrisdotca/hitotsu";

console.log(HITOTSU_CLASSIC);
const mine = { ...HITOTSU_CLASSIC, stacking: "same" as const, drawToMatch: true };   // stack the same card, and draw until you can play
const game = startHitotsu(200, ["Ann", "Ben"], 7, mine)!;
console.log(game.options.stacking, game.options.drawToMatch, game.hands.map((hand) => hand.length), HITOTSU_PARTY.deal);
console.log(startHitotsu(1, ["only one"], 1), startHitotsu(7, ["Ann", "Ben"], 1));   // outside the limits: null
```

```text
{
  stacking: 'off',
  jumpIn: false,
  sevenZero: false,
  drawToMatch: false,
  wildFour: 'challenge',
  deal: 7
}
same true [ 7, 7 ] 5
null null
```

### Keep a game as one line of text

A game is its set-up, a seed and its moves. Reading it back plays every move through the rules again, so a saved game can never hold a position the rules would not reach, and one changed by hand is `null`.

```ts
import { HITOTSU_PARTY, decodeHitotsu, encodeHitotsu, hitotsuComputer, playHitotsu, startHitotsu } from "@johnmorrisdotca/hitotsu";

let game = startHitotsu(1, ["Ann", "Ben", "Cy"], 42, HITOTSU_PARTY)!;
for (let move = 0; move < 5; move += 1) game = playHitotsu(game, hitotsuComputer(game))!;

const kept = encodeHitotsu(game);
console.log(kept.length, "characters;", decodeHitotsu(kept)?.moves.length, "moves read back");
console.log(decodeHitotsu(kept.replace('"seed":42', '"seed":43')));    // a changed seed no longer makes these moves: null
```

```text
323 characters; 5 moves read back
null
```

### A table for several devices

On a server, a game for friends each on their own phone needs three checks: the set-up the host sent, a move a player sent, and whose turn it is. `readTableSetUp` takes jumping in off, because a race between two phones is one no server can referee fairly.

```ts
import { HITOTSU_PARTY, readTableMove, readTableSetUp, startTable, tableToPlay } from "@johnmorrisdotca/hitotsu";

const setUp = readTableSetUp({ seed: 5, options: HITOTSU_PARTY });   // what arrived over the wire, checked
console.log(setUp?.options.jumpIn);                                  // false: taken off, though the party rules have it on
const game = startTable(1, 3, setUp)!;                               // a game for three seats
console.log(game.phase, tableToPlay(game));                          // whose seat is to move
console.log(readTableMove({ draw: true }), readTableMove({ jump: "R50", seat: 1 }), readTableMove("junk"));
```

```text
false
playing 0
{ draw: true } null null
```

### A card as a picture, in words

The deck is drawn once, as shapes, and every drawing of it (the SVG here, the table, React's `HitotsuCardImage`) comes from those. Each colour carries its element in the corners, so no card is told by colour alone. `hitotsuWords` names a card for a screen reader.

```ts
import { hitotsuCardSvg, hitotsuWords } from "@johnmorrisdotca/hitotsu";

console.log(hitotsuWords("R50", "en"), "|", hitotsuWords("R50", "ja"), "|", hitotsuWords("GD0", "en"));
const svg = hitotsuCardSvg("R50", { width: 80 });
console.log(svg.startsWith("<svg"), svg.includes('width="80"'));
```

```text
red five | 赤の5 | green draw two
true true
```

### Deal, play and check from a terminal

`hitotsu` deals a game, lets computers play it out and reads a saved game back through the rules. The same seed prints the same cards on every machine.

```sh
npx @johnmorrisdotca/hitotsu deal --seed 42 --players 2
npx @johnmorrisdotca/hitotsu play --seed 42 --players 3 --rules party
npx @johnmorrisdotca/hitotsu play --seed 42 --players 3 --rules party --saved > game.json
npx @johnmorrisdotca/hitotsu check game.json
```

```text
Seat 1: R3 R5 YD G0 G6 BD WF
Seat 2: R0 G2 B1 B2 B8 BS WF
On the pile: Y7
Hitotsu for 3, party rules, seed 42: 28 moves. Won by Seat 2.
Scores: 0 71 0
Hitotsu for 3, seed 42, 28 moves. Over: won by Seat 2.
```

### Card sounds, off until asked

`sound: true` plays a card dealt, a card played and the deck shuffled, from real recordings fetched when the first one plays. For your own control, `createCardSounds` gives a sound you can mute and set the volume of.

```ts no-run
import { createCardSounds } from "@johnmorrisdotca/hitotsu/card-sounds";
import { mountHitotsu } from "@johnmorrisdotca/hitotsu";

const sound = createCardSounds({ muted: true, volume: 0.5 });
mountHitotsu(document.querySelector<HTMLElement>("#table")!, { sound });
document.querySelector("#unmute")!.addEventListener("click", () => sound.setMuted(false));   // a browser lets a page make sound only after a touch
```

## The rules

| Rule | Classic | Party | Option |
| --- | --- | --- | --- |
| Cards dealt | 7 | 5 | `deal: 7 \| 5` |
| Stacking draw cards | off | any on any | `stacking: "off" \| "same" \| "any"` |
| Jump-in (an identical card, out of turn) | off | on | `jumpIn` |
| Sevens and zeros (a 7 swaps hands, a 0 passes every hand on) | off | on | `sevenZero` |
| Drawing | one card | one card | `drawToMatch` |
| Wild Draw Four | may be challenged | may be challenged | `wildFour: "challenge" \| "strict"` |

The length is separate: `startHitotsu(size, …)` with 200 or 500 points, or 1
for a single hand. A card left in a hand scores its number, an action card 20
and a wild 50. A hand nobody can finish, with the stock and pile spent and
everybody passing, goes to whoever holds the fewest points.

A card is a short name: its colour (`R`, `Y`, `G`, `B`, or `W` for a wild),
its face (a digit, `S` skip, `R` reverse, `D` draw two, `W` wild, `F` wild draw
four) and which copy it is. The two red fives are `R50` and `R51`.

## The command line

```sh
npx @johnmorrisdotca/hitotsu deal --seed 42                  # the hands, and the card to start the pile
npx @johnmorrisdotca/hitotsu play --seed 42 --players 3 --rules party
npx @johnmorrisdotca/hitotsu play --seed 42 --saved > game.json
npx @johnmorrisdotca/hitotsu check game.json                 # read it back through the rules
```

| Command or option | What it does |
| --- | --- |
| `deal` | prints each seat's hand and the card the pile starts with |
| `play` | computers play a whole game; prints who won and the scores |
| `check <file>` | reads a saved game back through the rules, from a file, from `--stdin`, or given as the text itself; exits 1 if the rules cannot play it out |
| `-s`, `--seed N` | the number the deals are shuffled from; a fresh one is named on standard error if not given |
| `-p`, `--players N` | how many play, 2 to 8 (4 if not given) |
| `--rules R` | `classic` (the default) or `party` |
| `--size N` | `1` for a single hand (the default), `200` or `500` points |
| `--saved` | `play`: prints the saved game and nothing else |
| `--stdin` | `check`: reads the saved game from standard input |
| `-j`, `--json` | prints JSON |
| `--lang L` | `en` or `ja` |

The exit code is 0 when all went well, 1 when what was asked for could not be
done and 2 when the command itself was wrong. The same seed prints the same
cards on every machine.

## Keeping a game

A game is its set-up, a seed and its moves, kept as one line of text:
`encodeHitotsu(game)` and `decodeHitotsu(text)`. Reading it back plays every
move again through the rules, so a saved game can never hold a position the
rules would not reach, and a game that was changed by hand reads as `null`.
`readHitotsuOptions` and `readHitotsuMove` check what arrives over the wire,
and the table functions under the API below run a game on several devices.

## Sounds

Off unless asked: `sound: true` (or the `sound` attribute) plays a card dealt,
a card played and the deck shuffled, from real recordings. Nothing is fetched
until the first sound plays, and where a browser cannot play them a short sound
made in the page stands in. For your own control, `createCardSounds` from
`@johnmorrisdotca/hitotsu/card-sounds` gives a sound you can mute, set the
volume of and hand to `sound`.

The recordings are Kenney's Casino Audio, CC0, and
[CREDITS.md](./CREDITS.md) says which, with where each came from and
the day its licence was checked.

## API

The [API reference](https://johnmorrisdotca.github.io/hitotsu/api.html) lists every export of every entry point with its signature and its doc comment. It is made from the source by `pnpm site`, so it cannot fall behind the code.

Every function is pure, and every type is exported.

### Playing

```ts no-check
startHitotsu(size, players, seed?, options?, computers?): HitotsuGame | null
hitotsuMoves(game): HitotsuMove[]          // the player to move's legal moves
hitotsuJumpIns(game): HitotsuMove[]        // cards other seats may jump in with
playHitotsu(game, move): HitotsuGame | null
hitotsuWinners(game): number[]
hitotsuTop(game), hitotsuPlayable(game), hitotsuMatches(game, card)

type HitotsuMove =
  | { play: HitotsuCard; colour?: HitotsuColour; swap?: number; call?: boolean }
  | { draw: true } | { pass: true } | { take: true } | { challenge: true }
  | { jump: HitotsuCard; seat: number; colour?: HitotsuColour; swap?: number; call?: boolean };
```

### One seat's view

```ts no-check
movesFor(game, seat)            // its turn's moves, or its jump-ins at another's turn
playableFor(game, seat)         // the cards it may put down now
callMatters(game, seat)         // whether calling Hitotsu! is a choice now
waysFor(game, seat, card, call) // each way that card may go down
quickMove(game, seat, card, call) // the one way, or null if there is a colour or a seat to choose
```

### The computer

```ts no-check
hitotsuComputer(game): HitotsuMove           // for the player to move
hitotsuComputerJump(game): HitotsuMove | null // a computer seat jumping in
```

### Keeping a game, and tables on several devices

```ts no-check
encodeHitotsu(game): string
decodeHitotsu(text): HitotsuGame | null      // replays every move through the rules
readHitotsuOptions(sent), readHitotsuMove(sent)

readTableSetUp(sent): { seed, options } | null   // jumping in taken off
startTable(size, count, sent, computers?): HitotsuGame | null
readTableMove(sent): HitotsuMove | null          // never a jump
tableToPlay(game), tableComputerMove(game, seat), namedTable(game, names)
```

### The deck and its design

```ts no-check
HITOTSU_DECK, shuffledHitotsu(seed, hand), sortHitotsu(hand)
colourOf(card), faceOf(card), isWild(card), hitotsuPoints(card), hitotsuWords(card)

hitotsuCardSvg(card | null, { width?, called?, title? }): string
hitotsuCardShapes(card | null, called?): HitotsuShape[]
HITOTSU_COLOUR_LOOK, HITOTSU_FACE_MARK
```

`hitotsuCardShapes` is the design, once: `hitotsuCardSvg`, the table and the
React `HitotsuCardDrawing` all draw it.

### The table

```ts no-check
mountHitotsu(element, {
  players?, rules?, size?, seed?,
  language?,         // "en" or "ja"; the page's language if not given
  computerMs?,       // how long a computer thinks: your window to jump in
  strings?,          // your own words, over the language's
  sound?,            // true, or a createCardSounds() of your own
  theme?,            // CSS variables, such as { "--ht-felt": "#234" }
  onMove?,
}): { game(), restart(options?), destroy() }

hitotsuStrings(language), hitotsuLanguageOf(tag), HITOTSU_STRINGS, HITOTSU_STRINGS_JA
defineHitotsuTable()                           // registers <hitotsu-table>, from "/element"
createCardSounds({ muted?, volume? })           // from "/card-sounds"
```


### Entry points

| Import | What it holds |
| --- | --- |
| `@johnmorrisdotca/hitotsu` | The rules, the deck, the computer player, saved games, the table functions, the card's drawing and `mountHitotsu` |
| `@johnmorrisdotca/hitotsu/element` | The `<hitotsu-table>` class and `defineHitotsuTable()`, which registers nothing until called |
| `@johnmorrisdotca/hitotsu/element/define` | Registers `<hitotsu-table>` by being imported (`/element-define` is the same file under its first name) |
| `@johnmorrisdotca/hitotsu/react` | `HitotsuTable`, `HitotsuCardImage` and `HitotsuCardDrawing` |
| `@johnmorrisdotca/hitotsu/card-sounds` | `createCardSounds`: the card sounds, to mute or hand to a table |

### The calls to learn first

| Call | What it does |
| --- | --- |
| `startHitotsu(size, players, seed, options, computers)` | A new game, or `null` outside the limits |
| `hitotsuMoves(game)` | Every legal move for the player to move |
| `playHitotsu(game, move)` | The game after a move, or `null` for a move the rules refuse |
| `hitotsuComputer(game)` | A move for the player to move |
| `encodeHitotsu(game)` and `decodeHitotsu(text)` | A game as one line of text, and back |
| `mountHitotsu(element, options)` | The table, in plain DOM |

## Theming

Every colour is a CSS variable on `.ht-root`: `--ht-surface`, `--ht-ink`,
`--ht-muted`, `--ht-rule`, `--ht-felt`, `--ht-felt-deep`, `--ht-felt-ink`,
`--ht-accent`, `--ht-accent-ink`, `--ht-playable`, `--ht-radius`, `--ht-card`
and `--ht-font`. Pass them as `theme` when you mount, or set them in a rule on
`.ht-root`, such as `hitotsu-table .ht-root { --ht-felt: #234; }`. The demo
passes the family's cloth by reference, so a cloth chosen in its header changes
the felt at once.

## Limits

| Limit | Value | Constant |
| --- | --- | --- |
| Players | 2 to 8 | `HITOTSU_MOST_PLAYERS` |
| How long a game lasts | 1 (a single hand), 200 or 500 points | `HITOTSU_SIZES` |
| Cards in the deck | 108 | `HITOTSU_DECK_SIZE` |
| Cards dealt | 7, or 5 in party mode | `deal` in the options |
| Cards taken for forgetting to call | 2 | `HITOTSU_CAUGHT` |
| Cards taken for a Wild Draw Four challenged and found honest | 6 | `HITOTSU_CHALLENGE_LOST` |
| A seed on the command line | a whole number from 1 to 2,147,483,647 | `SEED_MOST` |

`startHitotsu` returns `null` for anything outside them, and `playHitotsu`
returns `null` for a move the rules refuse. The command line takes the same
limits.

## Accessibility

- **No card is told by colour alone.** Each colour carries one of the five elements in the card's corners (火 fire, 土 earth, 木 wood, 水 water, and 五 for a wild), and a face has its own mark (⊘ skip, ⇄ reverse, +2, +4), so a player who cannot tell red from green can still read the card.
- **A screen reader hears every card and every turn.** Each card in the hand is a real `button` labelled with its name ("red five", 赤の5), and a card that may not be played is disabled. The line that says whose turn it is and what is wanted is an `aria-live="polite"` region, so the game is followed without moving focus; what just happened ("Computer 1 took 2.") is a plain line under it, which a screen reader finds by reading on, and is not announced by itself.
- **The keyboard.** The whole table is native buttons: Tab to a card, the draw stock, the call of Hitotsu or a colour, Enter or Space to press it.
- **Touch targets and fit.** The table fits a phone at 390 pixels, with a hand that wraps rather than scrolls sideways.
- **Reduced motion.** The table's one transition, a card lifting when it may be played, is off under `prefers-reduced-motion`.
- **Sound is optional.** Off unless asked, never the only sign of anything: every move is also a line of text.
- **Light and dark** follow the page, and every colour is a CSS variable (see [Theming](#theming)).
- **Not yet.** The colour pairs have not been measured against WCAG contrast ratios, a computer takes 900 milliseconds to move (`computerMs` changes it) and a person cannot skip the wait, and the Japanese has not been read by a native reader (see [Languages](#languages)).

## Browser support

Any browser from the last few years: the core and the table need ES2020, and
the table CSS custom properties and `aspect-ratio` (Chrome and Edge 88,
Firefox 89, Safari 15). The demo's tests run in Chromium and WebKit, Safari's
engine. The core has no DOM and no platform needs at all, so it runs the same
in Node, Deno, Bun, a worker or a server function; the package is tested in
Node 22 and 24, on Linux, macOS and Windows, installed from the tarball npm
makes.

## Languages

The table speaks English and Japanese. It follows the page's `lang` (on the
element, an ancestor or the document) unless you say `language: "ja"` when you
mount it, and the `<hitotsu-table>` tag redraws when `<html lang>` changes, as
a language chooser does. Card names read to a screen reader follow it too: "red
five", or 赤の5. The command line takes `--lang`, or the environment's
language.

```ts no-check
import { HITOTSU_STRINGS_JA, hitotsuStrings, mountHitotsu } from "@johnmorrisdotca/hitotsu";

mountHitotsu(table, { language: "ja" });                       // the Japanese words
mountHitotsu(table, { language: "ja", strings: { again: "もう一局" } }); // one of them changed
hitotsuStrings("ja") === HITOTSU_STRINGS_JA;                   // true
```

**Japanese: included; not yet reviewed by a native reader. Corrections
welcome.** Every Japanese string is listed beside its English in
[docs/strings-ja.md](./docs/strings-ja.md), and there is an
[issue template](https://github.com/johnmorrisdotca/hitotsu/issues/new?template=fix-a-translation.md)
for fixing one. Any other language is a table of your own passed as `strings`.

## Roadmap

- More house rules: seven-card Draw, No Mercy's bigger draw cards, and
  forced play
- A second computer player that counts cards
- A deal animation
- Another language: a table of your own works today, and a real one is a
  native reader's to write

Ideas and pull requests are welcome.

## Architecture

The rules, the computer player and the saved-game format are plain functions
over plain data with no DOM and no dependency: a game is a value, and every
move returns the next one. The table is drawn by a small DOM layer under
`ui/`, kept apart so a server or a test can use the rules alone, and the card's
look is decided in one place (`card.ts`) that plain DOM and React both draw
from.

```text
src/
├── card-sounds.ts  the "/card-sounds" entry: the table's card sounds, to mute or hand to a table
├── card.ts       the deck's own design as shapes: one place decides how a card looks
├── cli.ts        the command line as a pure function, with its words in English and Japanese
├── codec.ts      a game as text and back: its table, its seed and every move, played again through the rules
├── computer.ts   the computer player, which sees only what a person at the table sees
├── constants.ts  how long a game lasts, its "size": 200 or 500 points, or a single hand
├── deck.ts       the 108-card deck as short names, and how a card is read
├── element-define.ts  the "/element/define" entry (also "/element-define"): registers <hitotsu-table> by being imported
├── element.ts    the "/element" entry: the <hitotsu-table> class, and defineHitotsuTable()
├── index.ts      the main entry: the rules, the deck, the computer player, the codec, and the table to mount
├── random.ts     a seeded source of numbers in [0, 1)
├── react.tsx     the "/react" entry: the card's drawing as React elements
├── rules.ts      the rules and nothing else: deal, list the legal moves, play one, score a hand
├── seat.ts       one seat's view of what it may do, for a table on one device or on several
├── sounds.ts     the recordings, as base64, written by `pnpm sounds` from ./sounds
├── table.ts      what a server needs to run a game whose players each hold their own phone
├── types.ts      the vocabulary of the game: cards, moves, options and a game
├── version.ts    the version, held to package.json by a test
└── ui/  the table that draws and plays a game in plain DOM
    ├── cardSounds.ts  the card sounds: the recordings fetched on the first one played, a made sound if they cannot be
    ├── dom.ts      a few lines of DOM building, so the table needs no framework
    ├── mount.ts    the table itself: mounting it on a page, and the options it takes
    ├── strings.ts  every word the table says, in English and Japanese, which a host page can replace
    └── style.ts    the table's look, injected once per document
```

Tests sit beside the code they test (`*.test.ts`). `scripts/` builds the demo
and its API reference page, and `demo/` is the page published on GitHub Pages.

## The name

*Hitotsu* (一つ) is Japanese for "one", the word for a single thing when you
count: "one card" is *hitotsu*. It is said in three beats, *hi-to-tsu*. It is
also the call at this table, made with one card left in your hand, which is
why the game and the package carry it.

## Where it comes from, and where it is used

It began as the colour-card game on [Itsutsu](https://itsutsu.com/games/hitotsu),
which uses this package for its rules, its computer player, its tables on
several devices and its cards. The [demo](https://johnmorrisdotca.github.io/hitotsu/)
is the table, set up with a few presses.

### Used by

- [Itsutsu](https://itsutsu.com/games/hitotsu), a site for board and table games, for its rules, its computer player, its tables on several devices and its cards.

Using it somewhere? [Tell us](https://github.com/johnmorrisdotca/hitotsu/issues/new?template=add-my-project.md).

### The family

<!-- family:start (made by scripts/family-readme.mjs from scripts/family-template.mjs; change those, not this) -->
Hitotsu is one of twenty-four packages, each made for the same site, each at
[github.com/johnmorrisdotca](https://github.com/johnmorrisdotca). The code of every one is MIT.

- [Korokoro](https://github.com/johnmorrisdotca/korokoro) (コロコロ): dice, with notation, exact odds, real sounds and the dice of many games. [Demo](https://johnmorrisdotca.github.io/korokoro/).
- [Kyuubu](https://github.com/johnmorrisdotca/kyuubu) (キューブ): a turning cube for the browser, 2×2 to 7×7, with record solves to replay. [Demo](https://johnmorrisdotca.github.io/kyuubu/).
- [Hitotsu](https://github.com/johnmorrisdotca/hitotsu) (一つ): a colour-card shedding game for two to eight, with the house rules people play. [Demo](https://johnmorrisdotca.github.io/hitotsu/).
- [Toranpu](https://github.com/johnmorrisdotca/toranpu) (トランプ): a deck of playing cards, card games with computer players, and solitaires. [Demo](https://johnmorrisdotca.github.io/toranpu/).
- [Tane](https://github.com/johnmorrisdotca/tane) (種): seeded random numbers and daily seeds, the same in every browser and on every server. [Demo](https://johnmorrisdotca.github.io/tane/).
- [Narabe](https://github.com/johnmorrisdotca/narabe) (並べ): one rules engine for abstract board games, from gomoku and Reversi to Go and checkers. [Demo](https://johnmorrisdotca.github.io/narabe/).
- [Tenka](https://github.com/johnmorrisdotca/tenka) (天下): world conquest for two to six, on a map of the real world. [Demo](https://johnmorrisdotca.github.io/tenka/).
- [Kumimoji](https://github.com/johnmorrisdotca/kumimoji) (組み文字): a crossword tile race, in English and Japanese kana. [Demo](https://johnmorrisdotca.github.io/kumimoji/).
- [Tsunagi](https://github.com/johnmorrisdotca/tsunagi) (繋ぎ): a line-joining logic puzzle whose every level has exactly one answer. [Demo](https://johnmorrisdotca.github.io/tsunagi/).
- [Jarajara](https://github.com/johnmorrisdotca/jarajara) (ジャラジャラ): mahjong tiles drawn as SVG, stacked layouts, and the matching solitaire Awase. [Demo](https://johnmorrisdotca.github.io/jarajara/).
- [Suido](https://github.com/johnmorrisdotca/suido) (水道): a pipe puzzle: turn the pieces until the water reaches every drain. [Demo](https://johnmorrisdotca.github.io/suido/).
- [Domino](https://github.com/johnmorrisdotca/domino) (ドミノ): dominoes and Mexican Train. [Demo](https://johnmorrisdotca.github.io/domino/).
- [Kotoba](https://github.com/johnmorrisdotca/kotoba) (言葉): word lists and word-game rules in English, French, German and Japanese. [Demo](https://johnmorrisdotca.github.io/kotoba/).
- [Sugoroku](https://github.com/johnmorrisdotca/sugoroku) (双六): backgammon and its variants, with the doubling cube and match play. [Demo](https://johnmorrisdotca.github.io/sugoroku/).
- [Kazu](https://github.com/johnmorrisdotca/kazu) (数): grid number puzzles: Sudoku and its variants, Futoshiki and Skyscrapers. [Demo](https://johnmorrisdotca.github.io/kazu/).
- [Meikyuu](https://github.com/johnmorrisdotca/meikyuu) (迷宮): mazes on squares, hexagons, triangles and circles, made from a seed and drawn through with a finger or the mouse. [Demo](https://johnmorrisdotca.github.io/meikyuu/).
- [Hikidashi](https://github.com/johnmorrisdotca/hikidashi) (引き出し): a drawer of small Japanese text tools: era dates, kanji numerals, readings and sentence difficulty. [Demo](https://johnmorrisdotca.github.io/hikidashi/).
- [Chizu](https://github.com/johnmorrisdotca/chizu) (地図): maps of the world and of countries' regions, in English and Japanese, with a quiz and callouts. [Demo](https://johnmorrisdotca.github.io/chizu/).
- [Bushu](https://github.com/johnmorrisdotca/bushu) (部首): find a kanji by the parts it is made of. [Demo](https://johnmorrisdotca.github.io/bushu/).
- [Tobiishi](https://github.com/johnmorrisdotca/tobiishi) (飛び石): peg solitaire with nine boards and seeded solvable challenges. [Demo](https://johnmorrisdotca.github.io/tobiishi/).
- [Jirai](https://github.com/johnmorrisdotca/jirai) (地雷): minesweeper on shaped grids with verified no-guess boards. [Demo](https://johnmorrisdotca.github.io/jirai/).
- [Gunjin](https://github.com/johnmorrisdotca/gunjin) (軍人): five hidden-rank strategy games with pass-the-device play. [Demo](https://johnmorrisdotca.github.io/gunjin/).
- [Karakuri](https://github.com/johnmorrisdotca/karakuri) (からくり): eight hyper-casual puzzle games, some of them physics: draw a shield, pull pins, cut ropes, slide blocks, pour tubes. [Demo](https://johnmorrisdotca.github.io/karakuri/).
- [Houseki](https://github.com/johnmorrisdotca/houseki) (宝石): gem and stone matching puzzles: falling triplets, stone collapse, colour chains and gem swap. [Demo](https://johnmorrisdotca.github.io/houseki/).

**This package is Hitotsu.** The demos of all twenty-four share one header and footer, so each links the rest.
<!-- family:end -->

## Development

```sh
pnpm install
pnpm check              # lint, types and tests: the same as CI
pnpm site               # build the demo into ./site, then serve it
pnpm test:demo          # build the demo and tap through it in a real browser
pnpm test:cli           # the command line, as a child process
pnpm test:package       # pack it, install the tarball, and use it as published
pnpm test:readme        # run every example in this README against the built package
pnpm screenshots:readme # take the README's pictures from the built demo, in light and dark
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md). Please follow the [code of conduct](./CODE_OF_CONDUCT.md). Ideas and pull requests are welcome.

## Changes

See [CHANGELOG.md](./CHANGELOG.md). The latest release, 1.3.2, adds no code: it is this README in full, with pictures of the table, the deck and the options, examples that are run on every change, examples for Vue, Svelte and Angular, and an Accessibility section.

## Licence

The code is [MIT](./LICENSE) © John Morris. The card sounds are Kenney's Casino Audio, which is CC0: [CREDITS.md](./CREDITS.md) says which recordings, where each came from and the day its licence was checked, and the package ships it.
