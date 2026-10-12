---
title: はじめに
section: tutorial
order: 1
description: はじめにの使い方と注意点。
---

Hitotsu を入れ、同じシードで手札を配り、可能な手を 1 手進めます。ルールのエンジンは Node 22 以降とブラウザーで使え、実行時の依存パッケージはありません。

## インストール

```sh
npm install @johnmorrisdotca/hitotsu
```

型も含まれています。React は React エントリーを使う場合だけ必要です。

## 配って進める

```ts
import { HITOTSU_CLASSIC, hitotsuMoves, playHitotsu, startHitotsu } from "@johnmorrisdotca/hitotsu";

const game = startHitotsu(1, ["Aki", "Ben"], 42, HITOTSU_CLASSIC);
if (game === null) throw new Error("Invalid setup");
console.log(game.hands.map((hand) => hand.length));
const move = hitotsuMoves(game)[0]!;
const next = playHitotsu(game, move);
console.log(game.moves.length, next?.moves.length);
```

ゲームは普通のデータです。可能な手を進めると新しいゲームが返り、元のゲームは変わりません。カードを出せるか推測せず、エンジンに可能な手を聞きます。

## 組み込み方を選ぶ

[テーブルの表示と埋め込み](mount-and-embed.md)、[コンピューター](computer-player.md)、[保存と再開](save-and-restore.md)、[共有テーブル](shared-tables.md)へ進みます。[基本エントリー](entry:main)に公開 API があります。
