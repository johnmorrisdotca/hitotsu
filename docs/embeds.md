# Embed a Hitotsu table

Use the [builder](https://johnmorrisdotca.github.io/hitotsu/builder.html) for all
frameworks and HTML blocks, or load `@johnmorrisdotca/hitotsu/element/define`.
Every attribute listed in the README reflects as a property. `options` accepts
all `HitotsuTableOptions`, including custom rules, names, words, palettes,
computer delay and callbacks. `table` exposes the native handle; `game` returns
the private native game and `deal()` starts again. `defineTable(tag?)` and
`defineHitotsuTable(tag?)` are idempotent and safe to import on a server.

## Match points and appearance

Use `points="200"` or `points="500"` for a match; `1` means one hand. Existing
`size="1|200|500"` still selects match points unless `points` is supplied.
`size="small|medium|large"` sets widths of 320/480/640 pixels; explicit `width`
takes priority and fits its parent. Removing it restores the previous host
width. `theme="auto|light|dark"`, `label`, `lang="en|ja"` and `sound` do not
redeal; off/false/no/0 disable sound. Changing rules, seats, points or seed does.
The native handle's `set({ language, strings, theme, sound, onMove })` also
preserves the current hand, scores and moves. Native buttons work with the keyboard.

## Frames and events

The frame is `embed/?rules=party&computers=3&seed=42&size=medium&lang=en`.
It validates known parameters, ignores unknown/invalid values, accepts no
player names, uses no storage and has no tracking. Sounds are off initially;
turning them on uses the existing card-sound files on jsDelivr after interaction.
The builder prints a conservative height and adjusts it after preview sizing.

`hitotsu-load` carries seed, match points and seat count. `hitotsu-move` and
`hitotsu-finish` carry game-shaped JSON-safe copies with `players` replaced by
`Seat 1`, `Seat 2`, etc. Native callbacks and the local getter keep original
names. These are local games: game events include the hands and are unsuitable
for hiding opponents' cards in a network match. `hitotsu-error` carries a plain
message and shows a status. All events bubble and compose through shadow roots.
An iframe posts `{ type, detail }`; check `event.origin` against the exact
GitHub Pages origin and `event.source` against your frame's `contentWindow`.

## Troubleshooting and upgrading

Older numeric sizes keep their match meaning. Use `points` when combining a
match target with a symbolic display size. Existing event fields remain; use
the local getter or `options.onMove` when trusted code needs the original names.
Invalid local seat counts or match points show a status; correct the attribute
to mount again. A seed must be a whole number from 1 to 2147483647. A repeated
seed reproduces the initial deal, not the choices players make afterwards.
