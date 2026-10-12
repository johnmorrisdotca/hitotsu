---
title: Cards, language and sounds
section: explanation
order: 8
description: Learn cards, language and sounds.
---

## One drawing model

`hitotsuCardShapes` supplies the drawing primitives. `hitotsuCardSvg` renders them as an SVG document, and the React card components use the same shapes. The native box is 100 by 140. A null card draws its back; `called` marks a wild on the pile.

```ts
import { hitotsuCardShapes, hitotsuCardSvg, hitotsuWords } from "@johnmorrisdotca/hitotsu";

console.log(hitotsuWords("R70", "ja"));
console.log(hitotsuCardShapes("R70").map((shape) => shape.kind));
console.log(hitotsuCardSvg("R70", { width: 80 }).slice(0, 120));
```

## More than colour

Cards use words and corner elements as well as colours. `hitotsuWords` names a physical card in English or Japanese; `hitotsuStrings` supplies the table's labels and announcements. Hosts may override strings and theme without changing rules.

## Lazy sound

The [card-sounds entry](entry:card-sounds) exposes `createCardSounds`. It makes no audio context and fetches no recordings until loading or the first audible play. Start sound from a user action, keep it muted when requested, and call close when disposing a directly owned sound handle. `soundTimes` caps simultaneous recordings while keeping the requested span.
