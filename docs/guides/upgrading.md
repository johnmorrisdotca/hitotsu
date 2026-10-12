---
title: Upgrading and coming from other games
section: upgrading
order: 10
description: Learn upgrading and coming from other games.
---

## Within version 1

This rollout adds documentation and navigation without changing SDK behavior. Both `/element/define` and the legacy `/element-define` register the same native tag. Numeric element sizes preserve their match meaning; use points when combining a target score with display size.

## Moving from another colour-card game

Keep physical card ids, house rules and match target separate. A copied visual card is not enough to construct a legal native move. Select classic or party rules explicitly, read moves through the engine, and let its challenge, stacking and last-card-call rules decide the next state.

## Documentation and release

The [changelog](../../CHANGELOG.md) records version changes. The [embed guide](../embeds.md) remains the full attributes/events contract. New Japanese guides and metadata need language review before release. Local documentation builds and package checks do not publish a release or change external settings.
