---
title: 共有テーブルのアダプター
section: how-to
order: 6
description: アダプターで複数の端末のテーブルをつなぎ、通信と見えない手札はアプリ側で管理します。
---

## 通信はアプリ側に置く

アダプターは設定と手を受け取り、待つ席を選び、表示用の名前を入れます。接続、サーバー、保存先は作りません。配送と権限の確認は表示先のアプリが行います。

```ts
import { HITOTSU_PARTY, readTableSetUp, startTable, tableToPlay } from "@johnmorrisdotca/hitotsu";

const setup = readTableSetUp({ seed: 42, options: HITOTSU_PARTY });
console.log(setup?.options.jumpIn);
const game = startTable(1, 4, setup, [1, 2, 3]);
if (game !== null) console.log(tableToPlay(game), game.computers);
```

## 現在の状態で手を確認する

`readTableMove`は形を確認し、割り込みを拒否します。`playHitotsu`は現在出せる手かを確認します。`tableToPlay`は待つ席を返し、終了後はnullです。`tableComputerMove`はその席を待っている場合だけ手を返します。

## 公開情報と手札

ゲーム全体には全員の手札があります。ルールを動かす側で保持し、各端末にはその端末が見る情報だけを渡します。`namedTable`は配りを変えずに名前を入れます。`readTableSetUp`は割り込みを無効にして、複数の端末が同じ捨て札へ競って出すことを避けます。
