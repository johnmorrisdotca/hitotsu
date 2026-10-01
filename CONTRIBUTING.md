# Contributing to Hitotsu

Thank you for wanting to help. Bug reports, rule questions and pull requests
are all welcome.

## Reporting a bug

Open an issue with the house rules the table played, what happened, and what
you expected. The seed and the moves (`encodeHitotsu(game)`) replay the game
exactly, so pasting that line is the quickest way to show a position that
looks wrong.

## Fixing a translation

Every Japanese word is listed beside its English in
[docs/strings-ja.md](./docs/strings-ja.md), which is made from the source. Open
a *Fix a translation* issue with the string's name, or change it in
`src/ui/strings.ts` (the table) or `src/cli.ts` (the command line), run
`pnpm docs:make`, and send the pull request. The Japanese has not yet been read
by a native reader, so every correction is welcome.

## Suggesting a house rule

A house rule is one option in `HitotsuOptions`, with a test in
`src/rules.test.ts` that plays the position it is about, a row in the README's
rules table, and the words for the demo. Open a *Suggest a house rule* issue
saying where it is played, and how it fits with stacking, jump-in and sevens
and zeros.

## Setting up

```sh
git clone https://github.com/johnmorrisdotca/hitotsu
cd hitotsu
pnpm install
pnpm check            # lint, types and tests: the same as CI
pnpm site             # builds the demo into ./site
pnpm dlx serve site   # or any static server
pnpm test:demo        # the demo, tapped through in a real browser
pnpm test:cli         # the command line, as a child process
pnpm test:package     # packed, installed from the tarball, and used as published
```

## How the code is laid out

- `src/types.ts`, `src/constants.ts`: the vocabulary and the presets.
- `src/deck.ts`, `src/rules.ts`: the deck and the rules. Every function takes a
  game and returns a new one, and never changes the one it was given.
- `src/computer.ts`: the computer player. It sees only what a player at the
  table could see.
- `src/codec.ts`, `src/table.ts`: a game as text, and a table on several devices.
- `src/card.ts`: the card design, as shapes. Everything that draws a card draws
  these, so a change to the look is made once.
- `src/ui/`, `src/react.tsx`, `src/element.ts`: the table in plain DOM, the React
  wrapper and the `<hitotsu-table>` tag.
- `src/cli.ts`, `bin/hitotsu.mjs`: the command line, a pure function and the few
  lines that hand it the process.
- `sounds/`, `src/sounds.ts`: the recordings, and the module `pnpm sounds` makes
  from them. A new recording needs a row in `docs/credits.md` with its source
  and licence checked there: CC0 or public domain only.

## Pull requests

- A rule change comes with a test in `src/rules.test.ts` that plays the
  position it is about.
- Keep the core free of dependencies and of the DOM.
- A README table or example is held to the code by `src/docs.test.js`: change
  both together.
- Add a line under **Unreleased** in `CHANGELOG.md`.

## Releasing

A maintainer bumps `version` in `package.json` and `src/version.ts`, dates the
changelog's heading, pushes, waits for CI, then tags `vX.Y.Z`. The Release
workflow checks the package, attaches the tarball and publishes to npm with
provenance.

By taking part you agree to follow the [code of conduct](./CODE_OF_CONDUCT.md).
