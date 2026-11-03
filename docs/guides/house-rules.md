---
title: Choose house rules
section: how-to
order: 2
description: Choose the classic or party rules, set the match length and check the settings you receive.
---

## Start from a preset

`HITOTSU_CLASSIC` deals seven cards, with no stacking, jump-in or seven-zero swaps, and challengeable Wild Draw Fours. `HITOTSU_PARTY` deals five, stacks draw cards, allows jump-in and seven-zero hand movement. Both are native `HitotsuOptions` objects; copy one before changing a field.

```ts
import { HITOTSU_PARTY, readHitotsuOptions, startHitotsu } from "@johnmorrisdotca/hitotsu";

const rules = { ...HITOTSU_PARTY, jumpIn: false };
console.log(readHitotsuOptions(rules));
console.log(startHitotsu(200, ["Aki", "Ben"], 42, rules)?.size);
```

## Choose a mode

`mode` in `HitotsuOptions` is the deck and how a draw is dealt, and every preset is `classic`. `all-wild` deals a deck of wilds only, so every card goes on any card and the colour is whatever is called. `launcher` has no draw pile to count: a draw fires a random number of cards, and nothing stacks. [HITOTSU_MODES](api:HITOTSU_MODES) lists them. A mode lays over either preset, and the same seed deals the same game.

```ts
import { HITOTSU_CLASSIC, HITOTSU_MODES, startHitotsu } from "@johnmorrisdotca/hitotsu";

console.log(HITOTSU_MODES);
const wilds = { ...HITOTSU_CLASSIC, mode: "all-wild" } as const;
console.log(startHitotsu(1, ["Aki", "Ben"], 42, wilds)?.hands[0]);
```

The demo's set-up chooses the mode in a row of buttons beside the rules, and `?mode=all-wild` or `?mode=launcher` in its address opens the table in that mode. The `mode` attribute of `<hitotsu-table>` and the builder's Mode row set it for an embed.

## Match length is separate

The first argument of `startHitotsu` is 1 for one hand, or 200 or 500 points. Choosing party rules does not itself change that argument. The browser table and builder supply their own setup defaults.

## Read untrusted settings

Use [readHitotsuOptions](api:readHitotsuOptions) for received objects. It checks the full shape and supported values. Move shape validation is separate from move legality, which [playHitotsu](api:playHitotsu) checks against the current game.
