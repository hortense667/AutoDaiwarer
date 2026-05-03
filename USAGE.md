# AutoDaiwarer 使用説明書

このアプリは、台割テキスト（`//` で始まる行）を入力すると、ページ割りを「大・中・小」の帯で可視化できるツールです。  
編集担当の確認、ページ超過/不足の把握、記事一覧の確認に使います。

> English users: the English guide is in the second half of this document.

## 1. 台割画面の構成

画面上部には次のボタンがあります。

- `入力・編集` : 台割テキストの入力・編集
- `記事一覧` : すべての記事を表で確認
- `印刷` : 台割画面をA4縦で印刷
- `ヘルプ` : 画面内ヘルプを表示

メイン画面には次が表示されます。

- 台割ボード（表示は常に16枠単位）
- ページ番号
- 大・中・小目次の帯

## 2. 台割画面の見方（色と帯の意味）

### 帯の基本

- 上段: 大目次
- 中段: 中目次
- 下段: 小目次

同じ項目が続くページは、同じ帯として横方向に続いて表示されます。

### 背景色の意味

- `白` : 通常範囲
- `ピンク` : オーバーフロー（下位階層の合計が上位の想定ページを超過）
- `水色` : アンダー（下位階層の合計が上位の想定ページに不足）

補足:

- 大目次帯は「オーバー時のみピンク」、それ以外は白
- 中目次帯は小目次オーバーの区間でピンク
- 小目次帯のオーバー区間は白、アンダー区間は水色

### ツールチップ

帯の範囲上にマウスを置くと、次を表示します。

- デスク
- 編集担当
- 筆者
- 締切
- 進行
- メモ

## 3. 編集画面で入力するデータ形式

編集画面では、1行1項目で入力します。  
すべて `//` で始めます。

### サーバー機能（Cloudflare Pages 等に公開したサイト）

単体 HTML だけでは **`/api/session` に繋げないため**、この連携があるのは本番サイトに相当する構成です。

- **起動確認**: 開いたとき **GET `/api/session` + アドレス欄と同じクエリ** が送られ、応答が `ok` でないと続行しません。
- **見た目の切り替え（任意）**: 運用側（Worker）が認識した特定の **`mode`** クエリだけ、応答の **`uiTheme`** を基にヘッダー・ダイアログ周りの配色が変わります。**意味付け・閾値の解釈はサーバー側**です。環境変数 `UI_THEME_MODE` で許可値を変えられます。
- **`data` と Google ドライブ**: `?data=<Driveのファイル共有URL全体をURLエンコード>` とすると、そのファイル本文（編集データと同一のテキスト形式の **プレーン .txt** を想定）が **`/api/initial-data`** 経由で取得され、その内容が起動ソースとして読み込まれます。ドライブ上のファイルは **リンクを知っている人が取得できる権限**（例: 「リンクを知っている全員」）になっている必要があります。極めて巨大なファイルは取得に失敗し、ブラウザに保存済みのテキスト等へフォールバックします。
- **クエリの整理**: アドレス欄では主に **`mode`** が整理対象です。`data` / `share` / `syncEndpoint` は必要に応じて保持されます。
- （管理者向け）クエリ無しでも起動ソースを読み込ませたいときは環境変数 **`INITIAL_BOOT_DRIVE_FILE_ID`** などを設定します。詳細は **`ADMIN.md`**。

### 英語モード（`?mode=en`）

- 画面上部の `English Mode` チェックを ON にすると英語モードに切り替わり、URL に `?mode=en` が反映されます。
- URL に `?mode=en` を付けると **ブラウザがクエリを読んで**英語モードになります（例: `index.html?mode=en`）。
- 英語モードでは、UI表示に加えて入力コマンドも英語で利用できます。
- 主な対応:
  - `//large` / `//middle` / `//small`
  - `//board`
  - `//insert`（別丁）
  - `//hold`
  - `//filename` / `//title` / `//opening` / `//pages` / `//planned` / `//version` / `//writer` / `//start-page`

### メタ情報行

```text
//台割ファイル名 nandoku_hon
//書名 〇〇
//開き 左
//ページ数 128
//刊行予定 2026/05/20
//版 0.9
//記入者 山田
//開始ページ番号 1
```

`//開き` は次を指定できます。

- `//開き 左`（既定値）
- `//開き 右`

### 台設定行

```text
//台 台番号 版型 ページ数
```

例:

```text
//台 1 4C 16
//台 3 4C 8
//台 5 8        （版型は前回の値を継承）
//台 7 1C       （ページ数は前回の値を継承）
```

台設定ルール:

- 既定は `4C 16` です
- 指定がない項目は直前の `//台` の値を継承します
- 8ページ台でも表示枠は16枠を維持します
- 8ページ台の未使用8枠は「罫線なし・文字なし」の空白で表示します
- 最終台は、記事が途中で終わっていても台設定ぶん（16または8）の帯を表示します
- 実際の充足ページが不足する区間は、大/中/小すべて水色帯で表示します

### 本文（大・中・小目次）行

```text
//大 ページ数 記事名 デスク 編集担当 筆者 [締切] [進行] [メモ...]
//中 ページ数 記事名 デスク 編集担当 筆者 [締切] [進行] [メモ...]
//小 ページ数 記事名 デスク 編集担当 筆者 [締切] [進行] [メモ...]
```

階層入力の補足:

- 小目次まで必須ではありません。`大目次まで` / `中目次まで` のデータでも表示できます。
- `大目次` の直下に `小目次` が来た場合は、内部的に `名前なし中目次`（ページ数=その小目次群の合計）を自動補完して処理します。
- 自動補完された名前なし中目次は、台割上は中目次帯として使われます（記事名表示は空白）。

### 別丁行

```text
//別丁 挿入先台番号 ページ進み 別丁名 デスク 編集担当 筆者 [締切] [進行] [メモ...]
```

例:

```text
//別丁 3 4 特別地図 田中 山田 佐藤 2026/06/11 未発注 メモ
```

別丁ルール:

- `挿入先台番号` の台の後ろに挟み込みます
- `ページ進み` は、その台より後ろのページ番号に加算されます
- 左開き: 該当台の右側に表示
- 右開き: 該当台の左側に表示
- 別丁ボックスにマウスを置くと、担当・締切・進行・メモを表示します

例:

```text
//中 2 北海道北部 - 大塚 遠藤
//小 2 見開き1 山田 大塚 佐藤 2026/05/01 初稿 メモ例
```

入力ルール:

- デスク/編集担当/筆者を未指定にする場合は `-`
- 複数人は `|` 区切り（例: `大塚|斎藤`）
- 締切は `YYYY/MM/DD` 形式を推奨
- メモは自由文（後ろに続けて入力可能）
- `//*` はコメント扱い（解釈処理では何もしません）

## 4. 入力補助モード

入力作業を速くするためのモードです。

### 開始条件

- 空行で `//` を入力すると、その行だけ補助モードが有効になります。

### 操作

- `↑` / `↓` : 候補を切替
- `Space` または `→` : 候補を確定して次へ
- `Enter`（改行）: その行の補助モード終了

### 候補の内容

- 行先頭の項目（`小` / `中` / `大` / `台` / `別丁` / メタ情報 / `保留` / `*`）
- ページ数（初期値 `1`、`↑↓` で増減）
- 記事名（過去入力から候補）
- デスク/編集担当/筆者（過去入力から候補）
- 締切/進行/メモ（過去入力から候補）

### `//保留` の使い方

- `//保留 ページ数 記事名 ...`（英語モードでは `//hold pages article ...`）を、入力テキスト内のどこに置いても保留記事として解釈します。
- 保留指定がある行は通常台割の計算には入らず、保留セクションとして扱います。
- 保留データを同じファイル内に残しながら、通常台割とは分けて管理できます。
- 台割画面では通常台割の後ろに1台分の空白を挟み、保留記事を `1記事 = 1台` で表示します。
- 保留台は記事のページ数分だけ帯を表示し、残り枠は空白になります。
- 保留台の左ボックスは、上段が `保留`、下段が保留連番（1, 2, 3...）です。
- 保留帯にホバーすると、デスク/編集担当/筆者/締切/進行/メモを表示します。

## 5. 保存・読み込み・反映

### 保存して反映

- `保存` を押すと、画面表示が再計算されます。
- 同時にテキストファイルをダウンロードします。
- ファイル名は `台割ファイル名_版_YYYYMMDDHHmm.txt` 形式です。

### キャンセル

- `キャンセル` は保存せずに編集画面を閉じます。

### ファイルから読み込み

- `ファイルから読み込み` を押してファイルを選択すると、即時に編集画面へ読み込まれます。

### サンプル入力

- `サンプルを入力` は、現在のカーソル位置にサンプルを挿入します（上書きしません）。
- 英語モードでは `Insert Sample` で英語コマンドのサンプルを挿入します。

### 共有同期（Google Drive / Apps Script）

- この機能は **通常は不要** です。普段は `share` なしでローカル編集してください。
- **どうしても共有で共同編集したい場合のみ**、URL に `share` と `syncEndpoint` を付けて使います。
- 例: `...?share=book-202605&syncEndpoint=<AppsScriptのWebアプリURL>`
- 同期モードでは、編集中テキストを数秒ごとに自動保存し、数秒ごとに最新データを自動再取得します。
- 別ユーザーの保存が先行した場合は競合通知を出し、最新内容を反映します（新しい側優先）。
- セットアップが必要な場合は、次の手順で Apps Script を準備します。

#### 同期セットアップ手順（必要時のみ）

1. [Google Apps Script](https://script.google.com/) で新規プロジェクトを作成
2. `google-apps-script/Code.gs` の内容を `Code.gs` に貼り付けて保存
3. `デプロイ` → `新しいデプロイ` → `ウェブアプリ`
4. `次のユーザーとして実行`: `自分`、`アクセスできるユーザー`: `全員` を設定してデプロイ
5. 発行された `/exec` URL を使って共有URLを作成
   - `...?share=<共有ID>&syncEndpoint=<encodeURIComponentしたexec URL>`

## 6. 記事一覧・CSV出力・印刷

- `記事一覧` は左側が3列（大目次/中目次/小目次）、右側が6列（デスク/編集担当/筆者/締め切り/ステータス/メモ）の表です。
- 大目次行・中目次行・小目次行は階層に応じてセル結合表示されます。
- `カスケード表示` のON/OFFを切り替えできます（既定ON）。
  - ON: 階層を段組みで表示（従来表示）
  - OFF: 行結合ベースのフラット表示
- `記事一覧` には通常記事に加えて、別丁と保留の記事も表示されます。
- 一覧ダイアログの `CSV出力` で、一覧内容をCSV保存できます。
- 一覧ダイアログの `印刷` で一覧を印刷できます。
- 画面上部の `印刷` で、台割本体をA4縦で印刷できます。

## 7. 並び替え

- 台割上の項目はドラッグ&ドロップで同レベル内の並び替えができます。

---

クレジット: (c) 2026 Satoshi Endo all right reserved
連絡先: https://x.com/hortense667 

---

# AutoDaiwarer User Guide (English)

This app visualizes pagination and editorial structure from plain text directives (lines starting with `//`) using three hierarchy bands: Large / Middle / Small.  
It helps teams review assignments, identify over/under page allocation, and check article lists.

## 1. Layout Overview

Top buttons:

- `入力・編集` (`Input/Edit`): edit source text
- `記事一覧` (`Article List`): open article table
- `印刷` (`Print`): print the board layout on A4 portrait
- `ヘルプ` (`Help`): open in-app quick guide

Main area shows:

- Board panels (always rendered in 16-slot units)
- Page numbers
- Large/Middle/Small hierarchy bands

## 2. Bands and Colors

### Band levels

- Top: Large
- Middle: Middle
- Bottom: Small

### Color meaning

- `White`: normal
- `Pink`: overflow (child total exceeds parent pages)
- `Light blue`: under-allocation (child total is below parent pages)

Tooltip on a band or insert box shows:

- Desk
- Editor
- Writer
- Deadline
- Status
- Memo

## 3. Input Format

Each line starts with `//`.

### Meta lines

```text
//filename nandoku_hon
//title Example Book
//opening left
//pages 128
//planned 2026/05/20
//version 0.9
//writer Yamada
//start-page 1
```

### Board directive

```text
//board boardNo format pages
```

Example:

```text
//board 1 4C 16
//board 3 4C 8
//board 5 8
//board 7 1C
```

### Hierarchy rows

```text
//large pages article desk editor writer [deadline] [status] [memo...]
//middle pages article desk editor writer [deadline] [status] [memo...]
//small pages article desk editor writer [deadline] [status] [memo...]
```

### Insert row

```text
//insert boardNo advancePages name desk editor writer [deadline] [status] [memo...]
```

### Hold row

```text
//hold pages article desk editor writer [deadline] [status] [memo...]
```

Hold entries are excluded from normal board calculation and displayed after a one-board blank gap.

## 4. Assist Mode

When you type `//` on an empty line in the editor:

- `Up/Down`: switch candidates
- `Space` or `Right Arrow`: confirm
- `Enter`: exit assist mode for that line

## 5. Save / Load / Apply

- `保存` (`Save`) recalculates rendering and downloads the source text.
- `ファイルから読み込み` (`Load from file`) opens a file picker and imports the selected text immediately.
- `サンプルを入力` (`Insert Sample`) inserts sample lines at current cursor position.
- `キャンセル` (`Cancel`) exits editor without saving.

### Server features (deployed site, e.g. Cloudflare Pages)

Static files alone cannot call **`/api/session`**, so this applies to the deployed app.

- **Startup check**: **`GET /api/session` with the page’s query string** must return `{"ok":true,...}` before the UI continues.
- **Optional themed chrome**: Certain **`mode`** query values configured on the Worker set **`uiTheme`** in that response so header/dialog styling switches. **Interpretation stays on the server**. Use **`UI_THEME_MODE`** to change which `mode` value maps to which theme payload.
- **Drive bootstrap**: `?data=<URL-encoded Google Drive share link>` loads plain **UTF-8 .txt** in the editor format via **`/api/initial-data`**. The Drive file must be readable with “anyone with the link”. Very large uploads may fail and fall back to stored text.
- **Query cleanup**: `mode` is the main cleanup target in the address bar. `data` / `share` / `syncEndpoint` are kept when needed.
- **Env-only bootstrap (admin)**: See **`ADMIN.md`** for **`INITIAL_BOOT_DRIVE_FILE_ID`** (and alias `BOOTSTRAP_DRIVE_FILE_ID`).

### English mode (`?mode=en`)

- Turn on the `English Mode` checkbox in the top bar to switch language; this reflects `?mode=en` in the URL.
- The **browser** reads `?mode=en` from the query string (example: `index.html?mode=en`). UI strings, assist candidates, help, and **`Insert Sample`** use English directives.

### Shared Sync (Google Drive / Apps Script)

- This is **optional**. For normal use, work locally without `share`.
- Use this mode **only when you really need collaborative editing**.
- Add `share` and `syncEndpoint` query params to enable sync.
- Example: `...?share=book-202605&syncEndpoint=<Apps Script Web App URL>`
- In sync mode, the app auto-saves every few seconds and auto-polls latest text.
- On conflict, the app notifies users and applies newer remote content.
- If setup is needed, prepare Apps Script as below.

#### Sync setup steps (only when needed)

1. Create a new project at [Google Apps Script](https://script.google.com/).
2. Paste `google-apps-script/Code.gs` into `Code.gs` and save.
3. Deploy as Web App.
4. Set `Execute as`: `Me`, and `Who has access`: `Anyone`.
5. Build a share URL:
   - `...?share=<shareId>&syncEndpoint=<encodeURIComponent(exec URL)>`

## 6. Article List / CSV / Print

- `記事一覧` shows a 3-column hierarchy + metadata columns defined in `//article-fields` after `Article`.
- Cascade view can be toggled (`ON` by default).
- List includes regular items, inserts, and holds.
- `CSV出力` exports the current list as CSV.
- `印刷` in the list dialog prints the list view.

## 7. Reordering

- Drag and drop items on the board to reorder within the same level.

---

Credit: (c) 2026 Satoshi Endo all right reserved
Contact: https://x.com/hortense667 
