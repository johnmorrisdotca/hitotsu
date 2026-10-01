# Changelog

All notable changes to this project are written here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses
[Semantic Versioning](https://semver.org/).

## [Unreleased]

### Changed

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

[Unreleased]: https://github.com/johnmorrisdotca/hitotsu/compare/v1.0.1...HEAD
[1.0.1]: https://github.com/johnmorrisdotca/hitotsu/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/johnmorrisdotca/hitotsu/compare/v0.1.0...v1.0.0
[0.1.0]: https://github.com/johnmorrisdotca/hitotsu/releases/tag/v0.1.0
