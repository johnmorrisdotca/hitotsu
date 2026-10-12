---
title: Save and restore a game
section: how-to
order: 4
description: Learn save and restore a game.
---

## Save the setup and moves

[encodeHitotsu](api:encodeHitotsu) writes setup, names, seed and the ordered moves. It does not trust saved hands or piles. [decodeHitotsu](api:decodeHitotsu) starts that setup and replays every move through the rules.

```ts
import { decodeHitotsu, encodeHitotsu, hitotsuMoves, playHitotsu, startHitotsu } from "@johnmorrisdotca/hitotsu";

const game = startHitotsu(1, ["Aki", "Ben"], 42)!;
const next = playHitotsu(game, hitotsuMoves(game)[0]!)!;
const restored = decodeHitotsu(encodeHitotsu(next));
console.log(restored?.moves.length, restored?.hands[0]);
console.log(decodeHitotsu("not JSON"));
```

## Check a refused save

The decoder returns null for unreadable JSON, unsupported format, invalid setup or an illegal recorded move. Show an error instead of continuing with a partial game. The same seed reproduces the deal; the move log is needed to reproduce the later play.

## Decide what to share

The encoded game contains player names and enough information to reconstruct the cards. Choose storage and sharing in the host application. The builder’s setup URL omits private names and does not include the played move log. [Embed details](../embeds.md) distinguish local game events from a network match.
