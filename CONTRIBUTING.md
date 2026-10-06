# Contributing

Thank you for helping. Bug reports, ideas, corrections to the Japanese and pull
requests are all welcome.

This first part is the same in every package of the family. It is the master
text kept in
[johnmorrisdotca/.github](https://github.com/johnmorrisdotca/.github/blob/main/CONTRIBUTING.md),
copied unchanged into `scripts/community/CONTRIBUTING.md`, and a test holds
this file to that copy. What is particular to the package follows it, under
the heading "Particular to" and the package's name.

## Before you start

Open an issue first for anything bigger than a typo, so that we can agree on the
shape before you spend time on it. Taking part follows the
[Code of Conduct](CODE_OF_CONDUCT.md); report a security concern privately, as
[SECURITY.md](SECURITY.md) says.

## Making a change

```sh
pnpm install
pnpm check          # lint, types and tests: the same as CI
pnpm test:package   # pack it as npm does, install it in an empty project, import every entry
pnpm site           # build the demo into ./site, as GitHub Pages publishes it
```

The package's own further commands (its browser tests, its command line, its
data scripts) are listed under its own heading below.

## House rules, shared by every package of the family

- **No runtime dependencies.** Development dependencies are for tests, builds and
  documentation only.
- **The core is pure.** Every function in it returns new values and never
  changes what it was given.
- **Test what you change.** Tests sit beside the code they test. A rule you
  change has a test that would have caught it.
- **Words a person reads come in English and Japanese.** If you cannot write the
  Japanese, say so in the pull request and someone will.
- **Option values and names are kebab case.**
- **Art and sound are CC0 or public domain only**, checked at the source and
  credited. Data and word lists may be under another licence that lets them be
  shipped, with its notice kept in `NOTICE.md`. No GPL or LGPL code.
- **Needs Node 22 or later.**
- **A README table, example or count that a test holds to the code** changes
  together with the code.
- **The family's own files are the same in every package**: `demo/family.css`,
  `scripts/family-template.mjs`, `scripts/family-readme.mjs`,
  `scripts/release-notes.mjs`, the files in `scripts/community/` and
  `family.test.js` (in `src/`, or in `test/`). Do not edit one here. To change
  one, change it in every repository at once, bump `FAMILY_TEMPLATE_VERSION` for
  the template, and record the new hash in `family.test.js`. What is the
  package's own goes in its own stylesheet, `demo/<name>.css`, and its page
  builder, `scripts/site.mjs`.
- **The list of the family in the README is made, not written.**
  `pnpm family:readme` writes it between its markers from
  `scripts/family-template.mjs`.
- **The workflows are the family's too.** `ci.yml` runs `pnpm check`, the demo's
  browser tests and the packed package on Linux, macOS and Windows; `pages.yml`
  is the same text in every package. A package adds jobs of its own after those.

## Pull requests

One change per pull request. Say what changed and how you checked it, and add a
line to `CHANGELOG.md` under **Unreleased**: for a change a user would notice,
and for one to the repository alone.

## Releasing

Maintainers bump the version in `package.json` (and in `src/version.ts`, where
the package has one), move *Unreleased* to the new version in `CHANGELOG.md`,
dated, push, wait for CI and tag `vX.Y.Z`, the same as `package.json`'s version.
The Release workflow (`.github/workflows/release.yml`) checks and builds the
package, attaches the tarball to a GitHub release and publishes it to npm by
trusted publishing, with provenance and no token. A version already on npm is
not published again.

## Particular to Hitotsu

### Reporting a bug

Open an issue with the house rules the table played, what happened, and what
you expected. The seed and the moves (`encodeHitotsu(game)`) replay the game
exactly, so pasting that line is the quickest way to show a position that
looks wrong.

### Fixing a translation

Every Japanese word is listed beside its English in
[docs/strings-ja.md](./docs/strings-ja.md), which is made from the source. Open
a *Fix a translation* issue with the string's name, or change it in
`src/ui/strings.ts` (the table) or `src/cli.ts` (the command line), run
`pnpm docs:make`, and send the pull request. The Japanese has not yet been read
by a native reader, so every correction is welcome.

### Suggesting a house rule

A house rule is one option in `HitotsuOptions`, with a test in
`src/rules.test.ts` that plays the position it is about, a row in the README's
rules table, and the words for the demo. Open a *Suggest a house rule* issue
saying where it is played, and how it fits with stacking, jump-in and sevens
and zeros.

### Commands and rules

```sh
pnpm check            # lint, types and tests: the same as CI
pnpm site             # builds the demo into ./site
pnpm test:demo        # the demo, tapped through in a real browser
pnpm test:cli         # the command line, as a child process
pnpm test:package     # packed, installed from the tarball, and used as published
```

### How the code is laid out

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
  from them. A new recording needs a row in `CREDITS.md` with its source
  and licence checked there: CC0 or public domain only.

### Rule changes

- A rule change comes with a test in `src/rules.test.ts` that plays the
  position it is about.
- Keep the core free of the DOM.
