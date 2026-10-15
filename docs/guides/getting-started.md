---
title: Getting started
section: tutorial
order: 1
description: Install Hitotsu, deal from a seed and play one legal move.
---

Install Hitotsu, deal a deterministic hand and apply one legal move. The rules engine works in Node 22 or later and in a browser, with no runtime dependency.

## Install

```sh
npm install @johnmorrisdotca/hitotsu
```

The package ships its own types. React is optional and used only by the React entry.

## Deal and play

```ts
import { HITOTSU_CLASSIC, hitotsuMoves, playHitotsu, startHitotsu } from "@johnmorrisdotca/hitotsu";

const game = startHitotsu(1, ["Aki", "Ben"], 42, HITOTSU_CLASSIC);
if (game === null) throw new Error("Invalid setup");
console.log(game.hands.map((hand) => hand.length));
const move = hitotsuMoves(game)[0]!;
const next = playHitotsu(game, move);
console.log(game.moves.length, next?.moves.length);
```

A game is plain data. A legal move produces a new game and leaves the input unchanged. Start by asking the engine for its legal moves, rather than guessing whether a card can be played.

## Choose your integration

[Mount or embed a table](mount-and-embed.md) for local play, [run a computer](computer-player.md), [save a game](save-and-restore.md), or use the [shared-table adapter](shared-tables.md). The [main entry](entry:main) documents every engine export.
