---
title: カード・言語・音
section: explanation
order: 8
description: カードを同じ描画モデルで描き、色に頼らずに読み、録音した音は必要になってから読み込みます。
---

## 同じ描画モデル

`hitotsuCardShapes`が描画の要素を返します。`hitotsuCardSvg`はSVG文書にし、Reactのカードも同じ形を使います。基本の大きさは100×140です。カードがnullなら裏面を描き、`called`で場のワイルドの色を示します。

```ts
import { hitotsuCardShapes, hitotsuCardSvg, hitotsuWords } from "@johnmorrisdotca/hitotsu";

console.log(hitotsuWords("R70", "ja"));
console.log(hitotsuCardShapes("R70").map((shape) => shape.kind));
console.log(hitotsuCardSvg("R70", { width: 80 }).slice(0, 120));
```

## 色だけに頼らない

カードには色に加えて言葉と四隅の元素があります。`hitotsuWords`は英語か日本語でカードを読み、`hitotsuStrings`はラベルと通知を返します。表示先はルールを変えずに文言とテーマを上書きできます。

## 必要になってから音を読む

[card-sounds](entry:card-sounds)に`createCardSounds`があります。読み込みや最初の音が必要になるまで、音声コンテキストも録音の取得も始めません。音はユーザーの操作から始め、希望に合わせて消音します。自分で作った音のハンドルは片付けるときにcloseを呼びます。`soundTimes`は全体の時間幅を保ちながら同時に使う録音数を制限します。
