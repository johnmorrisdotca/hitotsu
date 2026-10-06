# Changelog

All notable changes to this project are written here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses
[Semantic Versioning](https://semver.org/).

## [Unreleased]

### Changed

- Repository only: the package and everything it exports are unchanged. `CONTRIBUTING.md` is the family's one text with a section of its own for Hitotsu, held to the master in johnmorrisdotca/.github by `src/family.test.js`; `ci.yml` and `pages.yml` are the family's one text (`pnpm check`, the demo, and the package on Linux, macOS and Windows), and any jobs of the package's own after them.
- The demo's page titles read `Hitotsu · pitch`, like the rest of the family's.
- The demo's own stylesheet is `demo/hitotsu.css`, named for the package like the family's.

### Fixed

- The API reference page wraps a long entry path instead of running about 2 px wider than a 360 px screen. Nothing the package exports has changed.

## [1.3.1] - 2026-10-05

Nothing that was exported has been changed or removed.

### Added

- A test holds every `@johnmorrisdotca/hitotsu@N` version pin in the README to this package's major version.
- The entry point `@johnmorrisdotca/hitotsu/element/define`, the name every other package of the family gives its tag-registering entry. `@johnmorrisdotca/hitotsu/element-define` stays as an alias of it.

### Changed

- The family's list, in the README and in the demo's footer, names all twenty-four packages, Karakuri and Houseki included.
- The npm description is one sentence of 250 characters or fewer, so npm and its search show it whole; it is also the repository's About text. `homepage` is the demo site and `author` is `"John Morris"`, the same in every package.
- The GitHub Actions workflows use the current versions of the actions (checkout 7, setup-node 7, pnpm/action-setup 6; configure-pages 6, upload-pages-artifact 5 and deploy-pages 5 for Pages), which clears GitHub's Node 20 deprecation warning.
- `package.json` gains `main`, `module` and `types` for older tools, and an `import` condition on every entry.

## [1.3.0] - 2026-10-01

### Changed

- **Needs Node 22 or later; Node 20 is no longer supported.** Nothing else changed.

## [1.2.0] - 2026-10-01

### Added

- **The table in Japanese.** `language: "ja"` (or the page's `lang`, which it
  follows unless told) says every word at the table in Japanese, card names
  for a screen reader included: 赤の5. `HITOTSU_STRINGS_JA`, `hitotsuStrings`
  and `hitotsuLanguageOf` are exported, and `docs/strings-ja.md` lists every
  string beside its English. The Japanese has not yet been read by a native
  reader.
- **`<hitotsu-table>`**, a tag for a table with no script of your own
  (`@johnmorrisdotca/hitotsu/element` and `/element-define`).
- **Card sounds**, off unless asked: `sound: true`, or the tag's `sound`
  attribute. A card dealt, played and the deck shuffled, from Kenney's Casino
  Audio (CC0; `docs/credits.md`). `createCardSounds` is
  `@johnmorrisdotca/hitotsu/card-sounds`.
- **A command line**, `hitotsu`: `deal`, `play` and `check`, in English and
  Japanese, the same cards for the same seed on every machine.
- `VERSION`, `test:package` and a three-system package check in CI and in the
  release, issue templates, and a `docs.test.js` that holds the README's
  tables and examples to the code.

### Fixed

- The README said the package was not on npm. It is.
- The README said the colours could be set on any ancestor. They are set in a
  rule on `.ht-root`, or as `theme`.

### Changed

- The demo has a Sound switch, a link to the deal on the table (`?rules=`, `?computers=` and `?seed=`), and a "Using it" panel that writes the table out as a tag, a script and a command line.
- **A Help switch in the demo.** Beside the language chooser in the family header, shared by every demo. Off (the default) the page is as it was; on, each option row (the rules, the number of computers) says in one plain line what it does, in English or Japanese, and every button in it has the same words as its hover text. Kept on the device.


## [1.1.0] - 2026-10-01

### Changed

- **The draw pile and the card in play sit level.** They are now the same box,
  a card over a one-line caption (the new optional `inPlay` string, "In play"
  unless said), so the two cards share a top and a bottom and the direction
  mark sits level with the middle of them. The draw pile's caption used to be
  taller than the card in play's and pushed its card up.
- The table's buttons (Keep it, Take, Challenge, a colour) are at least 44
  pixels tall.

### Added

- The demo is on the family's standard: the shared header and footer, English
  and Japanese (the Japanese not yet read by a native reader), the family's
  cloth patches (the table wears the cloth chosen), rules and number of
  computers chosen with a press, and an API reference page in the same frame.
  It is tested in a real browser on a phone and a desk (`pnpm test:demo`).

## [1.0.1] - 2026-09-30

### Fixed

- The package loads through `require()` as well as `import` (Node 22 and
  later load the ES module either way), so a tool that compiles to CommonJS,
  such as Playwright's test runner, can use it.

## [1.0.0] - 2026-09-30

### Added

- Each version tag builds the package and attaches its tarball to a GitHub
  release, which is how projects install it until it is on npm.

### Changed

- The first stable version: the rules, the table, the card drawing and the
  mounted UI are the public API, and a change that breaks one of them is a new
  major version.

## [0.1.0] - 2026-09-30

### Added

- The game for two to eight: match the colour or the number, skip, reverse,
  draw two, wild, wild draw four, and the call with one card left. Scored by
  the cards left in the other hands, to 200 or 500 points or one hand.
- Its own deck of 108 cards, drawn as SVG: four colours, each with one of the
  five elements in its corners (火 土 木 水) so no card is told by colour alone.
- The popular house rules, each an option: stacking (same card, or any draw
  card on any), jump-in, sevens and zeros, draw until you can play, and the
  Wild Draw Four challenged or played without bluffing. Classic and Party
  presets.
- A computer player that stacks, challenges, saves its wilds and always calls.
- Games kept as a line of text (the set-up, the seed and the moves) and read
  back by replaying them through the rules.
- A table for several devices: set-ups and moves as they arrive over the wire,
  checked, with jumping in taken off.
- `mountHitotsu`, a table to play against computers on any page, and
  `HitotsuTable`, `HitotsuCardImage` and `HitotsuCardDrawing` for React, from
  `@johnmorrisdotca/hitotsu/react`.
- A static demo, published to GitHub Pages.

[Unreleased]: https://github.com/johnmorrisdotca/hitotsu/compare/v1.3.1...HEAD
[1.3.1]: https://github.com/johnmorrisdotca/hitotsu/compare/v1.3.0...v1.3.1
[1.3.0]: https://github.com/johnmorrisdotca/hitotsu/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/johnmorrisdotca/hitotsu/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/johnmorrisdotca/hitotsu/compare/v1.0.1...v1.1.0
[1.0.1]: https://github.com/johnmorrisdotca/hitotsu/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/johnmorrisdotca/hitotsu/compare/v0.1.0...v1.0.0
[0.1.0]: https://github.com/johnmorrisdotca/hitotsu/releases/tag/v0.1.0
