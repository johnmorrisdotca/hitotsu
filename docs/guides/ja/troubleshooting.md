---
title: 困ったとき・よくある質問
section: troubleshooting
order: 9
description: 困ったとき・よくある質問の使い方と注意点。
---

## ゲームが始まらない

`startHitotsu`は 2〜8 人と、サイズ 1、200、500 に対応します。それ以外は null です。`startTable`は受け取った設定も確認します。端末内では型付きのプリセットを使い、外からの設定には `readHitotsuOptions`を使います。

## 手が拒否される

`readHitotsuMove` と `readTableMove`は形だけを確認します。現在可能な手かどうかはルールが判断し、`playHitotsu`は不正な手や終了済みのゲームに null を返します。`hitotsuMoves` または `movesFor`で選択肢を確認します。色や交換先の選択が残る場合、`quickMove`は null です。

## その他の null

`colourOf`はワイルドで null、`hitotsuComputerJump`は可能な割り込みがない場合に null です。`decodeHitotsu`は読めない保存や不正な手順を拒否します。設定と手の読み取りは不正な形に null を返し、共有テーブルでは割り込みも拒否します。`tableToPlay`は終了後に null、`tableComputerMove`はその席を待っていない場合に null です。toPlay、drawn、pendingFace、challenge などの状態も null になる場合があり、ゲームの型に意味があります。

## タグを使えない・音が鳴らない

定義用のエントリーを読み込んでタグを登録します。指定した場合は消音や無音で始まり、ブラウザーの音にはユーザーの操作が必要です。無音の例には `sound: false`を使います。ゲームの終了後はコンピューターの手を選ばせません。

## 見た目を変えたら試合の長さも変わった

以前の数値の `size="1|200|500"`は得点を指定します。試合には `points`、見た目には small/medium/large または幅を使います。[埋め込みの詳細](../../embeds.md)に、配り直す変更とプレイを保つ変更があります。
