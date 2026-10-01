# Hitotsu's words, in English and Japanese

Made from `src/ui/strings.ts` and `src/cli.ts` by `pnpm docs:make`; a test fails if the two differ, so this list is never out of date.

**The Japanese has not yet been reviewed by a native reader.** If a line reads wrongly or unnaturally, please
open a *Fix a translation* issue with the string's name. `{who}`, `{count}` and the other braces are filled in when shown.

## The table

| Name | English | Japanese |
| --- | --- | --- |
| `you` | You | あなた |
| `computer` | Computer {n} | コンピューター{n} |
| `yourTurn` | Your turn | あなたの番 |
| `toPlay` | {who} to play | {who}の番 |
| `follow` | Play {colour}, the same number or symbol, or a wild. | {colour}、同じ数字か記号、またはワイルドを出します。 |
| `facing` | {who} must take {count}, or stack a draw card. | {who}は{count}枚引くか、ドローカードを重ねます。 |
| `drew` | {who} drew: play that card, or keep it. | {who}が引きました。そのカードを出すか、持っておきます。 |
| `challengeOpen` | {who} may challenge {by}'s Wild Draw Four, or take it. | {who}は{by}のワイルドドローフォーに挑戦するか、引きます。 |
| `cards` | {count} cards | {count}枚 |
| `points` | {count} pts | {count}点 |
| `draw` | Draw | 引く |
| `keep` | Keep it | 持っておく |
| `take` | Take {count} | {count}枚引く |
| `challenge` | Challenge | 挑戦 |
| `call` | Call Hitotsu! | ヒトツ！と言う |
| `called` | Hitotsu! called | ヒトツ！と言いました |
| `pickColour` | Choose a colour | 色を選ぶ |
| `swapWith` | Swap with {who} | {who}と手札を交換 |
| `jumpIn` | Jump in! | 割り込み！ |
| `won` | {who} won. | {who}の勝ち。 |
| `again` | Play again | もう一度 |
| `stock` | {count} left to draw | 山札あと{count}枚 |
| `inPlay` | In play | 場のカード |
| `colour.R` | red | 赤 |
| `colour.Y` | yellow | 黄 |
| `colour.G` | green | 緑 |
| `colour.B` | blue | 青 |
| `news.caught` | {who} forgot to call Hitotsu!: two cards. | {who}は「ヒトツ！」と言い忘れました。2枚引きます。 |
| `news.took` | {who} took {count}. | {who}は{count}枚引きました。 |
| `news.challenge (found guilty)` | {who} challenged {by}, who had the colour. | {who}が{by}に挑戦しました。{by}はその色を持っていました。 |
| `news.challenge (not guilty)` | {who} challenged {by}, who did not have the colour. | {who}が{by}に挑戦しました。{by}はその色を持っていませんでした。 |
| `news.swap` | {who} swapped hands with {other}. | {who}は{other}と手札を交換しました。 |
| `news.rotate` | Every hand passed on. | 全員の手札が回りました。 |
| `news.jump` | {who} jumped in! | {who}が割り込みました！ |
| `news.skipped` | {who} is skipped. | {who}は飛ばされます。 |
| `news.reversed` | Play turns round. | 順番が逆になります。 |
| `news.drew` | {who} drew {count} cards. | {who}が{count}枚引きました。 |

## The command line

Names are the keys of `CLI_STRINGS`. `{n}`, `{seed}` and the other braces are filled in when shown.

| Name | English | Japanese |
| --- | --- | --- |
| `unknown` | unknown option {part} | 不明なオプションです: {part} |
| `needs` | {part} needs a value | {part} には値が必要です |
| `tryHelp` | Try `hitotsu --help`. | `hitotsu --help` をご覧ください。 |
| `langBad` | --lang takes en or ja | --lang は en か ja です |
| `seedBad` | --seed takes a whole number from 1 to {most} | --seed は1〜{most}の整数です |
| `playersBad` | --players takes a whole number from 2 to 8 | --players は2〜8の整数です |
| `sizeBad` | --size takes 1 (one hand), 200 or 500 | --size は 1（1回戦）、200、500のどれかです |
| `rulesBad` | --rules takes classic or party | --rules は classic か party です |
| `noCommand` | “{part}” is not a command | 「{part}」はコマンドではありません |
| `noSave` | there is no saved game to check | 確かめる保存データがありません |
| `notSaved` | that is not a saved game: the rules cannot play it out | 保存データではありません: ルールどおりに最後まで再現できません |
| `seatName` | Seat {n} | 席{n} |
| `fresh` | seed {seed} (pass --seed {seed} to repeat this) | シード {seed}（--seed {seed} で同じ結果を再現できます） |
| `hand` | {name}: {cards} | {name}: {cards} |
| `top` | On the pile: {card} | 場のカード: {card} |
| `played` | Hitotsu for {n}, {rules} rules, seed {seed}: {moves} moves. Won by {winners}. | ヒトツ {n}人、{rules}ルール、シード {seed}: {moves}手。勝者は{winners}。 |
| `scores` | Scores: {scores} | 得点: {scores} |
| `savedOver` | Hitotsu for {n}, seed {seed}, {moves} moves. Over: won by {winners}. | ヒトツ {n}人、シード {seed}、{moves}手。終了: 勝者は{winners}。 |
| `savedGoing` | Hitotsu for {n}, seed {seed}, {moves} moves. {player} to play. | ヒトツ {n}人、シード {seed}、{moves}手。{player}の番です。 |
| `rulesClassic` | classic | クラシック |
| `rulesParty` | party | パーティー |

### The help

`usage`, in English:

```
Usage: hitotsu <command> [options]

Hitotsu, the colour-card game: deal it, or let computers play it out.

Commands:
  deal              the hands of a new game and the card to start the pile
  play              computers play a whole game, and say who won
  check <file>      read a saved game back through the rules (or --stdin)

Options:
  -s, --seed N      the number the deals are shuffled from (a fresh one is named if not given)
  -p, --players N   how many play, 2 to 8 (4 if not given)
      --rules R     classic (the default) or party
      --size N      1 for a single hand (the default), 200 or 500 points
      --saved       play: print the saved game, ready for check, and nothing else
  -j, --json        print JSON
      --stdin       check: read the saved game from standard input
      --lang L      en or ja (the environment's language if not given)
  -h, --help        this help
  -v, --version     the version

Examples:
  hitotsu deal --seed 42
  hitotsu play --seed 42 --players 3 --rules party
  hitotsu play --seed 42 --saved > game.json && hitotsu check game.json
```

and in Japanese:

```
使い方: hitotsu <コマンド> [オプション]

ヒトツ（色のカードゲーム）。配るか、コンピューターに最後まで遊ばせます。

コマンド:
  deal              新しいゲームの手札と、場に出す最初のカードを表示します
  play              コンピューターが1ゲームを最後まで遊び、勝者を表示します
  check <ファイル>  保存したゲームをルールどおりに再現して確かめます（--stdin でも可）

オプション:
  -s, --seed N      配るときのシード（指定しなければ新しいシードを表示します）
  -p, --players N   遊ぶ人数、2〜8（指定しなければ4）
      --rules R     classic（既定）か party
      --size N      1は1回戦（既定）、200か500は目標点
      --saved       play: 保存データだけを表示します（check にそのまま渡せます）
  -j, --json        JSONで表示します
      --stdin       check: 標準入力から保存データを読みます
      --lang L      en か ja（指定しなければ環境の言語）
  -h, --help        このヘルプ
  -v, --version     バージョン

例:
  hitotsu deal --seed 42
  hitotsu play --seed 42 --players 3 --rules party
  hitotsu play --seed 42 --saved > game.json && hitotsu check game.json
```
