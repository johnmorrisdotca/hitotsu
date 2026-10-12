---
title: コンピューターの手を進める
section: how-to
order: 3
description: コンピューターの手を進めるの使い方と注意点。
---

## プレイ中にだけ聞く

[hitotsuComputer](api:hitotsuComputer)は現在のプレイヤーが出せる手を選びます。ゲームを進めたり、タイマーを動かしたりはしません。その手をルールの関数に渡し、もう一度 phase を確認します。

```ts
import { hitotsuComputer, playHitotsu, startHitotsu } from "@johnmorrisdotca/hitotsu";

let game = startHitotsu(1, ["Aki", "Ben"], 42)!;
for (let turns = 0; turns < 20 && game.phase === "playing"; turns += 1) {
  const next = playHitotsu(game, hitotsuComputer(game));
  if (next === null) throw new Error("Unexpected illegal computer move");
  game = next;
}
console.log(game.phase, game.moves.length);
```

## 順番以外の手

`hitotsuComputerJump`は割り込みが有効で一致するカードがある場合だけ手を返し、それ以外は null です。`movesFor` と `playableFor`は席ごとの選択肢を返します。共有テーブルでは割り込みを無効にします。

## コンピューターが見るもの

`hitotsuView`には自分の手札、公開の枚数、現在の色、可能な手が入ります。同じゲームには同じ判断をします。表示の待ち時間はテーブルの `computerMs`で指定し、基本エンジンは自動で進めません。
