---
title: Use the shared-table adapter
section: how-to
order: 6
description: Connect tables on several devices with adapters while your app keeps the network and the hidden hands.
---

## Keep transport in your application

The table adapter accepts setup and move objects, chooses the seat to wait for and writes seat names into a displayed game. It does not open a connection, create a server or provide storage. The host owns delivery and authorization.

```ts
import { HITOTSU_PARTY, readTableSetUp, startTable, tableToPlay } from "@johnmorrisdotca/hitotsu";

const setup = readTableSetUp({ seed: 42, options: HITOTSU_PARTY });
console.log(setup?.options.jumpIn);
const game = startTable(1, 4, setup, [1, 2, 3]);
if (game !== null) console.log(tableToPlay(game), game.computers);
```

## Validate moves against the current state

`readTableMove` checks shape and refuses jump-in. `playHitotsu` checks legality. `tableToPlay` returns the seat to wait for, or null after the game ends; `tableComputerMove` returns a move only when the table is waiting on that seat.

## Public and private views

The full native game contains every hand. Keep it with the host that runs the rules and supply each client only the information it should see. `namedTable` changes names without changing the deal. `readTableSetUp` disables jump-in so asynchronous devices do not compete to play the same discard.
