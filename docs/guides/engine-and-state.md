---
title: The engine and its state
section: explanation
order: 7
description: Learn the engine and its state.
---

## Plain data and new states

The engine stores hands, stock, discard, turn direction, pending draws, challenges, scores and move history in `HitotsuGame`. Legal moves depend on those fields and the selected house rules. `playHitotsu` returns a new game; it does not mutate its input.

## Physical cards and matching faces

A card id includes colour, face and copy number. Two red fives are separate physical cards but `identical` says their colour and face match for jump-in. Wild cards have no fixed colour; `colourOf` returns null. `faceOf`, `hitotsuWords` and `hitotsuPoints` read a card without running a game.

## Repeatable randomness

Numeric seeds drive the shuffle. Hand number and reshuffle salt distinguish later deals and turnovers. Replaying the setup and moves reconstructs the state, so the codec does not store a second competing account of every pile.

## Finish and scoring

A single-hand game finishes when that hand ends. A 200- or 500-point match deals another hand until a score reaches its target. `hitotsuWinners` returns no winners until the game phase is over. The [game type](api:HitotsuGame) and [rules preset](api:HITOTSU_CLASSIC) expose the complete contract.
