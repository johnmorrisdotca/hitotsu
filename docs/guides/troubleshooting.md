---
title: Troubleshooting & FAQ
section: troubleshooting
order: 9
description: Find out why a game will not start, a move is refused, a value is null or a sound stays silent.
---

## A game does not start

`startHitotsu` accepts two to eight players and size 1, 200 or 500. Unsupported player counts or size return null. `startTable` also checks received setup. Use typed presets locally and `readHitotsuOptions` for external settings.

## A move is refused

`readHitotsuMove` and `readTableMove` check structure; only the rules know whether it is legal now. `playHitotsu` returns null for illegal moves or a finished game. Ask `hitotsuMoves` or `movesFor` for the current choices. A double tap may need another choice: `quickMove` returns null when colour or swap seat is unresolved.

## Other null results

`colourOf` returns null for a wild. `hitotsuComputerJump` returns null without an available computer jump. `decodeHitotsu` returns null for an unreadable or illegal save. `readTableSetUp` and the move readers return null for invalid shapes; shared-table readers also refuse jump-in. `tableToPlay` returns null after the game finishes, and `tableComputerMove` when it is not waiting on that seat. Game fields such as toPlay, drawn, pendingFace and challenge can also be absent as null; the game type explains them.

## The tag is unknown or sound is silent

Import the element definition entry to register the tag. Sound starts muted or disabled when requested, and browser audio needs a user action. Use `sound: false` for silent examples. Never call the computer chooser after the game is over.

## Appearance changed the match length

An older numeric `size="1|200|500"` selects match points. Use `points` for the match and symbolic small/medium/large size or explicit width for appearance. [Embed details](../embeds.md) describe which changes redeal and which preserve play.
