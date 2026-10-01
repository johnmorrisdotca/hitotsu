# Credits: where the sounds come from

Everything in Hitotsu was written for it, under its MIT licence, except what
this page names. Each item says where it came from, its licence as read at its
source, and the day that was checked. Nothing here is GPL or LGPL, and nothing
is used whose licence has not been read.

## The card sounds

**Casino Audio (1.1)** by Kenney Vleugels,
[https://kenney.nl/assets/casino-audio](https://kenney.nl/assets/casino-audio).

- **Licence:** Creative Commons Zero, CC0 1.0
  ([creativecommons.org/publicdomain/zero/1.0](http://creativecommons.org/publicdomain/zero/1.0/)),
  as the pack's page says ("CC0 licensed!") and as its own `License.txt`
  states: "You may use these assets in personal and commercial projects.
  Credit (Kenney or www.kenney.nl) would be nice but is not mandatory."
- **Checked:** 2026-10-01, on the pack's page. The `License.txt` inside the
  pack (`kenney_casino-audio.zip`, SHA-256
  `f36250766ac5bc378c13708ddf12a23a8e54a3251f8d482c7536e51b5dbafa18`) was read
  on 2026-09-30 for [Toranpu](https://github.com/johnmorrisdotca/toranpu), and
  these are the same recordings, cut and encoded the same way.

Ten of the pack's recordings are used, each cut short and re-encoded:

| File here | From the pack | What it is | Length | Size |
| --- | --- | --- | --- | --- |
| `sounds/deal-1.m4a` | `Audio/card-slide-1.ogg` | a card slid across the table | 0.07 s | 1,513 bytes |
| `sounds/deal-2.m4a` | `Audio/card-slide-2.ogg` | a card slid across the table | 0.40 s | 3,365 bytes |
| `sounds/deal-3.m4a` | `Audio/card-slide-3.ogg` | a card slid across the table | 0.40 s | 3,427 bytes |
| `sounds/deal-4.m4a` | `Audio/card-slide-5.ogg` | a card slid across the table | 0.10 s | 1,737 bytes |
| `sounds/flip-1.m4a` | `Audio/card-slide-4.ogg` | a short flick: a card turned over | 0.29 s | 2,814 bytes |
| `sounds/flip-2.m4a` | `Audio/card-slide-7.ogg` | a short flick: a card turned over | 0.40 s | 3,634 bytes |
| `sounds/play-1.m4a` | `Audio/card-place-1.ogg` | a card laid on the table | 0.11 s | 1,852 bytes |
| `sounds/play-2.m4a` | `Audio/card-place-2.ogg` | a card laid on the table | 0.23 s | 2,627 bytes |
| `sounds/play-3.m4a` | `Audio/card-place-4.ogg` | a card laid on the table | 0.34 s | 3,228 bytes |
| `sounds/shuffle-1.m4a` | `Audio/card-shuffle.ogg` | the deck shuffled: the first 1.6 s | 1.60 s | 11,500 bytes |

35,697 bytes in all. They are base64 in `src/sounds.ts`, which `pnpm sounds`
writes from the files, and which is loaded only when the first sound plays.
