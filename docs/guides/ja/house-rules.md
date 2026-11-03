---
title: ハウスルールを選ぶ
section: how-to
order: 2
description: クラシックかパーティーのルールを選び、試合の長さを決め、受け取った設定を確認します。
---

## プリセットから選ぶ

`HITOTSU_CLASSIC`は7枚を配り、ドローカードの重ね出し、割り込み、7と0の手札移動はなく、ワイルドドローフォーに挑戦できます。`HITOTSU_PARTY`は5枚で、それらのハウスルールを使います。どちらも`HitotsuOptions`なので、コピーしてから設定を変えます。

```ts
import { HITOTSU_PARTY, readHitotsuOptions, startHitotsu } from "@johnmorrisdotca/hitotsu";

const rules = { ...HITOTSU_PARTY, jumpIn: false };
console.log(readHitotsuOptions(rules));
console.log(startHitotsu(200, ["Aki", "Ben"], 42, rules)?.size);
```

## モードを選ぶ

`HitotsuOptions`の`mode`は、デッキと引き方を決めます。どのプリセットも`classic`（基本）です。`all-wild`はワイルドだけのデッキで、どのカードも何の上にでも出せ、色は宣言した色になります。`launcher`は数える山札がなく、引くとランダムな枚数のカードが飛んできて、重ね出しはできません。[HITOTSU_MODES](api:HITOTSU_MODES)に一覧があります。モードはどちらのプリセットにも組み合わせられ、同じシードなら同じ配りになります。

```ts
import { HITOTSU_CLASSIC, HITOTSU_MODES, startHitotsu } from "@johnmorrisdotca/hitotsu";

console.log(HITOTSU_MODES);
const wilds = { ...HITOTSU_CLASSIC, mode: "all-wild" } as const;
console.log(startHitotsu(1, ["Aki", "Ben"], 42, wilds)?.hands[0]);
```

デモの設定では、ルールの隣のボタンの行でモードを選べます。アドレスに`?mode=all-wild`や`?mode=launcher`をつけると、そのモードでテーブルが開きます。埋め込みでは、`<hitotsu-table>`の`mode`属性か、ビルダーの「モード」の行で指定します。

## 試合の長さは別に指定する

`startHitotsu`の最初の引数は1回戦なら1、得点制なら200または500です。パーティーのルールを選ぶだけではこの引数は変わりません。表示とビルダーにはそれぞれの初期設定があります。

## 受け取った設定を確認する

[readHitotsuOptions](api:readHitotsuOptions)で、オブジェクトの形と値を確認します。手の形と、現在のゲームで可能な手かどうかは別です。後者は[playHitotsu](api:playHitotsu)が確認します。
