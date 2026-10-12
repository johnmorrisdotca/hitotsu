---
title: カード・言語・音
section: explanation
order: 8
description: カード・言語・音の使い方と注意点。
---

## 同じ描画モデル

`hitotsuCardShapes`が描画の要素を返します。`hitotsuCardSvg`は SVG 文書にし、React のカードも同じ形を使います。基本の大きさは 100×140 です。カードが null なら裏面を描き、`called`で場のワイルドの色を示します。

```ts
import { hitotsuCardShapes, hitotsuCardSvg, hitotsuWords } from "@johnmorrisdotca/hitotsu";

console.log(hitotsuWords("R70", "ja"));
console.log(hitotsuCardShapes("R70").map((shape) => shape.kind));
console.log(hitotsuCardSvg("R70", { width: 80 }).slice(0, 120));
```

## 色だけに頼らない

カードには色に加えて言葉と四隅の元素があります。`hitotsuWords`は英語か日本語でカードを読み、`hitotsuStrings`はラベルと通知を返します。表示先はルールを変えずに文言とテーマを上書きできます。

## 必要になってから音を読む

[card-sounds](entry:card-sounds)に `createCardSounds`があります。読み込みや最初の音が必要になるまで、音声コンテキストも録音の取得も始めません。音はユーザーの操作から始め、希望に合わせて消音します。自分で作った音のハンドルは片付けるときに close を呼びます。`soundTimes`は全体の時間幅を保ちながら同時に使う録音数を制限します。
