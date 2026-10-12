---
title: Mount or embed a table
section: how-to
order: 5
description: Learn mount or embed a table.
---

## Mount native controls

[mountHitotsu](api:mountHitotsu) puts a playable DOM table in a host, with a person in seat 0 and computers in the other seats. It supplies its native styles and keyboard controls. Sound can stay off.

```ts no-run
import { HITOTSU_PARTY, mountHitotsu } from "@johnmorrisdotca/hitotsu";

const host = document.createElement("div");
document.body.append(host);
const table = mountHitotsu(host, { rules: HITOTSU_PARTY, seed: 42, computers: 3, sound: false });
table.set({ language: "ja" });
console.log(table.game().seed);
// Call table.destroy() when removing the table.
```

## Update without redealing

The handle's `set` updates language, strings, theme, sound and the move callback while preserving play. `restart` deals again with changed setup. `destroy` removes listeners and pending computer work when the table is removed.

## React, tags and frames

[HitotsuTable](api:HitotsuTable) wraps the native table in React. Options are read on mount; use a new key for a different setup. Import `/element/define` to register `hitotsu-table`, or call `defineTable` for a custom tag. The legacy `/element-define` entry remains an alias.

The builder copies module, framework, element and iframe code. Attributes, events, match points versus display size, and frame-origin checks remain in the [embed guide](../embeds.md). Game-shaped local events contain hands and use generic seat names; they are not a hidden-information network protocol.
