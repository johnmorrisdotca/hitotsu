---
title: Run a computer player
section: how-to
order: 3
description: Ask the computer player for a move, handle out-of-turn jump-ins, and see what it knows.
---

## Ask only while playing

[hitotsuComputer](api:hitotsuComputer) chooses a legal move for the current player. It does not advance the game or run a timer. Apply its move with the native rules, then check the phase again.

```ts
import { hitotsuComputer, playHitotsu, startHitotsu } from "@johnmorrisdotca/hitotsu";

let game = startHitotsu(1, ["Aki", "Ben"], 42)!;
for (let turns = 0; turns < 20 && game.phase === "playing"; turns += 1) {
  const next = playHitotsu(game, hitotsuComputer(game));
  if (next === null) throw new Error("Unexpected illegal computer move");
  game = next;
}
console.log(game.phase, game.moves.length);
```

## Out-of-turn choices

`hitotsuComputerJump` returns a computer jump-in only when that option is enabled and a matching card is available; otherwise it returns null. `movesFor` and `playableFor` describe one seat's current choices. A shared table disables jump-in.

## What the computer sees

`hitotsuView` includes its own hand, public hand counts, current colour and legal choices. The heuristic is deterministic for a given game. Browser delays belong to `computerMs` in table options; the pure engine does not schedule play.
