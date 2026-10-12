---
title: ゲームを保存して再開する
section: how-to
order: 4
description: ゲームを保存して再開するの使い方と注意点。
---

## 設定と手順を保存する

[encodeHitotsu](api:encodeHitotsu)は設定、名前、シード、各手を順に書き出します。保存された手札や山札を信用する形式ではありません。[decodeHitotsu](api:decodeHitotsu)は設定から始め、すべての手をルールで再実行します。

```ts
import { decodeHitotsu, encodeHitotsu, hitotsuMoves, playHitotsu, startHitotsu } from "@johnmorrisdotca/hitotsu";

const game = startHitotsu(1, ["Aki", "Ben"], 42)!;
const next = playHitotsu(game, hitotsuMoves(game)[0]!)!;
const restored = decodeHitotsu(encodeHitotsu(next));
console.log(restored?.moves.length, restored?.hands[0]);
console.log(decodeHitotsu("not JSON"));
```

## 読めなかった保存を確認する

読めない JSON、対応しない形式、不正な設定や手順には null が返ります。途中までのゲームで続けず、エラーを表示します。同じシードで配りは再現できますが、その後のプレイには手順も必要です。

## 共有する内容を選ぶ

保存したゲームには名前とカードを再構成できる情報が入ります。保存先と共有方法はアプリ側で決めます。ビルダーの設定 URL には個人の名前も進めた手順も入りません。[埋め込みの詳細](../../embeds.md)で、ローカルのイベントとネットワーク対戦の違いを確認できます。
