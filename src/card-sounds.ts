/**
 * The sounds of a card table, from real recorded cards: a card dealt, turned
 * over or played, the deck shuffled. Off
 * unless a table asks: nothing plays and nothing is fetched until `play`.
 *
 * ```ts
 * import { createCardSounds } from "@johnmorrisdotca/hitotsu/card-sounds";
 *
 * const sounds = createCardSounds();
 * sounds.play("shuffle");
 * sounds.play("deal", { count: 7, delay: 900 });
 * ```
 *
 * The recordings themselves are loaded by the first sound played. Kenney's Casino Audio, CC0: see CREDITS.md.
 */
export { CARD_SOUND_KINDS, MOST_SOUNDS_AT_ONCE, createCardSounds, soundTimes } from "./ui/cardSounds.ts";
export type { CardSoundData, CardSoundKind, CardSounds, CardSoundsOptions, CardSoundWindow, PlayCardSoundOptions } from "./ui/cardSounds.ts";
