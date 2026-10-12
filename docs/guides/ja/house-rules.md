---
title: ハウスルールを選ぶ
section: how-to
order: 2
description: ハウスルールを選ぶの使い方と注意点。
---

## プリセットから選ぶ

`HITOTSU_CLASSIC`は 7 枚を配り、ドローカードの重ね出し、割り込み、7 と 0 の手札移動はなく、ワイルドドローフォーに挑戦できます。`HITOTSU_PARTY`は 5 枚で、それらのハウスルールを使います。どちらも `HitotsuOptions`なので、コピーしてから設定を変えます。

```ts
import { HITOTSU_PARTY, readHitotsuOptions, startHitotsu } from "@johnmorrisdotca/hitotsu";

const rules = { ...HITOTSU_PARTY, jumpIn: false };
console.log(readHitotsuOptions(rules));
console.log(startHitotsu(200, ["Aki", "Ben"], 42, rules)?.size);
```

## 試合の長さは別に指定する

`startHitotsu`の最初の引数は 1 回戦なら 1、得点制なら 200 または 500 です。パーティーのルールを選ぶだけではこの引数は変わりません。表示とビルダーにはそれぞれの初期設定があります。

## 受け取った設定を確認する

[readHitotsuOptions](api:readHitotsuOptions)で、オブジェクトの形と値を確認します。手の形と、現在のゲームで可能な手かどうかは別です。後者は[playHitotsu](api:playHitotsu)が確認します。
