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

## Match length is separate

The first argument of `startHitotsu` is 1 for one hand, or 200 or 500 points. Choosing party rules does not itself change that argument. The browser table and builder supply their own setup defaults.

## Read untrusted settings

Use [readHitotsuOptions](api:readHitotsuOptions) for received objects. It checks the full shape and supported values. Move shape validation is separate from move legality, which [playHitotsu](api:playHitotsu) checks against the current game.
