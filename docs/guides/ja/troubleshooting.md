---
title: 困ったとき・よくある質問
section: troubleshooting
order: 9
description: ゲームが始まらない、手が拒否される、値がnullになる、音が鳴らないといった場合の原因を確認します。
---

## ゲームが始まらない

`startHitotsu`は2〜8人と、サイズ1、200、500に対応します。それ以外はnullです。`startTable`は受け取った設定も確認します。端末内では型付きのプリセットを使い、外からの設定には`readHitotsuOptions`を使います。

## 手が拒否される

`readHitotsuMove`と`readTableMove`は形だけを確認します。現在可能な手かどうかはルールが判断し、`playHitotsu`は不正な手や終了済みのゲームにnullを返します。`hitotsuMoves`または`movesFor`で選択肢を確認します。色や交換先の選択が残る場合、`quickMove`はnullです。

## その他のnull

`colourOf`はワイルドでnull、`hitotsuComputerJump`は可能な割り込みがない場合にnullです。`decodeHitotsu`は読めない保存や不正な手順を拒否します。設定と手の読み取りは不正な形にnullを返し、共有テーブルでは割り込みも拒否します。`tableToPlay`は終了後にnull、`tableComputerMove`はその席を待っていない場合にnullです。toPlay、drawn、pendingFace、challengeなどの状態もnullになる場合があり、ゲームの型に意味があります。

## タグを使えない・音が鳴らない

定義用のエントリーを読み込んでタグを登録します。指定した場合は消音や無音で始まり、ブラウザーの音にはユーザーの操作が必要です。無音の例には`sound: false`を使います。ゲームの終了後はコンピューターの手を選ばせません。

## 見た目を変えたら試合の長さも変わった

以前の数値の`size="1|200|500"`は得点を指定します。試合には`points`、見た目にはsmall/medium/largeまたは幅を使います。[埋め込みの詳細](../../embeds.md)に、配り直す変更とプレイを保つ変更があります。
