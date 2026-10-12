---
title: テーブルの表示と埋め込み
section: how-to
order: 5
description: テーブルの表示と埋め込みの使い方と注意点。
---

## 本来の操作を表示する

[mountHitotsu](api:mountHitotsu)は席 0 の人と他の席のコンピューターが遊ぶ DOM テーブルを置きます。スタイルとキー操作も含まれます。音は切ったままにできます。

```ts no-run
import { HITOTSU_PARTY, mountHitotsu } from "@johnmorrisdotca/hitotsu";

const host = document.createElement("div");
document.body.append(host);
const table = mountHitotsu(host, { rules: HITOTSU_PARTY, seed: 42, computers: 3, sound: false });
table.set({ language: "ja" });
console.log(table.game().seed);
// Call table.destroy() when removing the table.
```

## 配り直さずに変更する

ハンドルの `set`は言語、文言、テーマ、音、通知を変え、プレイを保ちます。設定を変えて配り直すには `restart`を使います。テーブルを外すときは `destroy`でイベントと待機中のコンピューター処理を片付けます。

## React、タグ、フレーム

[HitotsuTable](api:HitotsuTable)は React で本来のテーブルを包みます。設定はマウント時に読まれるので、別の設定には新しい key を使います。`/element/define`で `hitotsu-table`を登録し、別のタグ名には `defineTable`を使います。以前の `/element-define`も別名として残ります。

ビルダーではモジュール、フレームワーク、要素、iframe のコードをコピーできます。属性、イベント、得点と表示サイズ、フレームの送信元の確認は[埋め込みガイド](../../embeds.md)にあります。ローカルのゲームイベントには手札が入り、名前は席の表記になります。相手の手札を隠すネットワーク対戦の通信形式ではありません。
