# AutoDaiwarer 使用説明書

このアプリは、台割テキスト（`//` で始まる行）を入力すると、ページ割りを「大・中・小」の帯で可視化できるツールです。  
編集担当の確認、ページ超過/不足の把握、記事一覧の確認に使います。

**画面内ヘルプ**（ヘルプボタン）はリファレンス形式の短い一覧です。手順や細部の説明は本書（USAGE.md）を参照してください。

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
//台 2 4C1C 16  （例: 表4C・裏1C の複合版型）
```

複合版型の例: `4C1C` は**先**が面付け**表**、**後**が**裏**のインキ色数（`//開き` に応じたアプリ内16/8面マップで裏スロットを判定）。`4C` と `1C` を別トークンに分けて書いても可。

台設定ルール:

- 既定は `4C 16` です
- 指定がない項目は直前の `//台` の値を継承します
- **各ページ枠の最下段（ステータス帯）**は色段（1C〜4C）に応じた薄いグレーとし、進行などの**文言はそのまま**表示します（キーワード色分けなし）
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

- `挿入先台番号` が `0` のときは本の先頭（1台目前）として台グリッド上に表示（1台目の綴じ位置との関係は開き方向に従う）
- それ以外は `挿入先台番号` の台の後ろに挟み込みます
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

入力作業を速くするためのモードです。**台割エディタ**上部の「**入力補助**」チェックをONにしたときだけ有効**です（既定はOFF。ON/OFFはブラウザに保存されます）。行頭の `//` による補助と、項目クリックによる補助の両方がこの設定に従います。

### 開始条件

- 補助がONのとき、空行（または行頭のタブのあと）で `//` を入力すると、その行だけ補助モードが有効になります。

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
- `カスケード表示` のON/OFFを切り替えられます（既定ON）。
  - ON: 階層を段組みで表示（従来表示）
  - OFF: 行結合ベースのフラット表示
- `記事一覧` には通常記事に加えて、別丁と保留の記事も表示されます。
- 記事一覧の各セルはクリック編集できます。
  - 日付セル: カレンダーで編集
  - 文字セル: 直接入力
  - 記事名セル（`//大` / `//中` / `//小` / `//保留` 等）: 記事名とページ数を分離して編集
  - ページ数: ▲▼は1ページ刻み、手入力は小数（例: `0.5`）を許可
  - キー操作: `Enter` / 矢印 / `Esc` で表計算風に移動・終了
  - セル内URL部分クリックは別タブで開く
- 一覧ダイアログの `CSV出力` で、一覧内容をCSV保存できます。
- 一覧ダイアログの `印刷` で一覧を印刷できます。
- 一覧ダイアログの `キャンセル` は変更を破棄、`閉じる（変更時は台割に反映）` は変更を台割データへ反映して閉じます。
- 一覧ダイアログは外側クリック/タップでは閉じません。
- 画面上部の `印刷` で、台割本体をA4縦で印刷できます。
- 画面上部の `面付け` で面付けシミュレーションを開けます。片面プリンター向けに **表のみ印刷** / **裏のみ印刷** でプレビュー・印刷を表面と裏面に分けられます（手動両面・送り向きは機種で試し刷り推奨）。16面付けで `1,4` のように飛び番号の台だけを指定した場合、指定台のページだけを**入力した順**につないで面付けします（例: `1 4 2 3` なら 1台→4台→2台→3台）。同一台を二度書いても最初の1回だけが使われます。`すべて` や空欄は従来どおり台番号昇順です。セブンイレブンのプリントサービスで面付け印刷する場合は、印刷設定を **「両面印刷・長辺とじ」** にしてください。
- **ラフ用PPTX出力**（面付け）: 判型2ページ分の横長スライド（例: **A4縦 → A3横**）で見開きラフPPTXを直接出力します。`//開き` に合わせて左右配置し、右開きでは起こし・最終ページの空白も反映します。各ページ天側に `//大`・`//中`・`//小` の記事名を表示し、大/中/小の組み合わせが同一のページには連番を付けます。記事照合用の管理情報はPPTX内に埋め込まれます。PowerPoint 等で編集後にPDFへ書き出し、**PDF読み込み（見開き）** から面付けシミュレーションに読み込んでください。出力には **数秒〜数十秒** かかることがあり、処理中は「処理中…」を表示します。
- **PPTX更新・出力**（面付け）: 更新ダイアログで「見開きでなく1ページずつ出力」「目次名とページ番号を表示しない」を選択できます。未チェック時は見開き出力で再生成し、記事が一致する半ページは旧PPTXから編集済みの形状をコピーします。照合は最下位クラスの記事名から始め、同名が複数なら上位クラス（小→中→大）→連番の順で判定します。処理中は「処理中…」を表示します。
- **PDF読み込み（見開き）**: 見開きPDFをノンブル順（1, 2, 3…）に分割して読み込みます。面付けの台指定が `1 4 2 3` のような変則順でも、各スロットは台割上の**ページ番号**（全体通し）でPDFを参照するため正しく対応します。PDFには台割**全体**のページ列が含まれている必要があります。
- **背丁**（面付プレビュー／印刷）: グリッド上で **1–16**（16面）または **1–8**（8面）が辺で隣り合う折のみ、折り（背）の中央に小さく表示。`//書名` を先頭15字程度＋折番号を《》で表示し、プレビュー・印刷に出る順で番号を振る。折位置には薄い補助線（文言部分は除き、線と字の間に余白）。縦判＝縦組、横判＝横書き。横判16面など、最終グリッドで隣接しない場合は表示されないことがあります。

### おすすめワークフロー（ラフ制作〜入稿）

1. 台割を作成し、節目ごとに **ラフ用PPTX出力** で見開きラフを出力  
2. 見開きイメージを確認しながら PowerPoint でラフを育てる  
3. 台割を変更したら **PPTX更新・出力** を実行（既存ラフをできるだけ維持しつつ再配置）  
4. ある程度固まったら見開きのままPDF化し、**PDF読み込み（見開き）** で読み込む  
5. 面付けシミュレーションの印刷結果を折って、ミニチュア本として物理確認する  
6. 最終段階では **PPTX更新・出力** で「1ページずつ出力」+「目次名とページ番号を表示しない」を使って書き出し、PDF化して入稿データとして利用する

## 7. 並び替え

- 台割上の項目はドラッグ&ドロップで同レベル内の並び替えができます。

---

クレジット: (c) 2026 Satoshi Endo all right reserved
連絡先: https://x.com/hortense667 

---

# AutoDaiwarer User Guide (English)

This app visualizes pagination and editorial structure from plain text directives (lines starting with `//`) using three hierarchy bands: Large / Middle / Small.  
It helps teams review assignments, identify over/under page allocation, and check article lists.

**In-app Help** (Help button) is a short reference list; narrative detail lives in this document (USAGE.md).

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
//board 2 4C1C 16
```

Duplex example: `4C1C` means the **first** token is **front** imposition ink and the **second** is **back**, resolved with the app’s 16/8-up signature maps for the current `//opening`. You may also split tokens.

Board rules:

- Default is `4C 16`.
- Missing fields inherit from the previous `//board` line.
- The **bottom status strip** on each page uses light gray by color step (1C–4C) and shows workflow **text verbatim** (no keyword-based coloring).

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

`boardNo` **0** inserts the insert as a front-of-book block above the first signature grid (placement follows opening).

### Hold row

```text
//hold pages article desk editor writer [deadline] [status] [memo...]
```

Hold entries are excluded from normal board calculation and displayed after a one-board blank gap.

## 4. Assist Mode

**Input assist** is available only when you enable **Input assist** in the **Daiwari editor** toolbar (default OFF; preference is saved in the browser). Both `//` line-head assist and click-to-open field assist follow this setting.

When assist is enabled and you type `//` on an empty line (or after leading tabs) in the editor:

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
- Cells in Article List are editable by click.
  - Date cells: calendar picker
  - Text cells: direct edit
  - Main article cells (`//large` / `//middle` / `//small` / `//hold`): split edit for title + page value
  - Page value: spinner buttons step by 1; direct input allows decimals (e.g. `0.5`)
  - Keyboard: `Enter` / Arrow keys / `Esc` for spreadsheet-like navigation
  - Clicking URL segments opens links in a new tab
- `CSV出力` exports the current list as CSV.
- `印刷` in the list dialog prints the list view.
- In the list dialog, `キャンセル` (`Cancel`) discards edits, and `閉じる（変更時は台割に反映）` (`Close (Apply to flatplan)`) applies edits to flatplan data before closing.
- The list dialog does not close on backdrop click/tap.
- `面付け` (`Imposition`) opens imposition simulation. **Front only** / **Back only** prints split preview and printouts for simplex printers (manual duplex and feed direction depend on your printer—trial recommended). For **16-up**, board lists concatenate pages in **the order you type** (e.g. `1 4 2 3`). Duplicate board numbers use the first occurrence only. **`all`** / empty field still uses ascending board order. For Seven-Eleven print service, use **double-sided printing / long-edge binding**.
- **Export Rough PPTX** (imposition): exports spread rough PPTX with slide width equal to two trim pages (e.g. **A4 portrait → A3 landscape**), laid out per `//opening`. Each page header shows `//large`, `//middle`, and `//small` article names; duplicate large/middle/small combinations get a serial number. Article metadata is embedded in the PPTX. Edit in PowerPoint, export to PDF, then load via **Load PDF (spread)**. Export may take **several seconds to tens of seconds**; a **Processing…** overlay is shown until finished.
- **Update / Export PPTX** (imposition): opens an options dialog with **single-page output** and **hide TOC/page labels**. With no checks, behavior is the same as spread update. Matching pages copy edited shapes from the source PPTX (bottom article level → upper levels → serial number). A **Processing…** overlay is shown until finished.
- **Load PDF (spread)**: splits spread PDF pages into single pages in flatplan order (1, 2, 3…). Irregular board selection (e.g. `1 4 2 3`) still maps each slot by its **global page number**; the PDF must contain the **full** flatplan page sequence.
- **Spine marks** (imposition preview/print): when pages **1–16** (16-up) or **1–8** (8-up) are **adjacent** on the rendered grid, a small spine legend is centered on that fold: `//title` (first ~15 graphemes) plus a fold index in 《…》, numbered in output order. A light guide line runs along the fold with a gap around the type. Portrait layout uses vertical type; landscape uses horizontal. Some layouts (e.g. horizontal 16-up) may omit marks when those pages are not neighbors.

### Recommended workflow (rough draft to print-ready)

1. Build your flatplan and periodically run **Export Rough PPTX**  
2. Refine rough layouts in PowerPoint while checking spreads visually  
3. When flatplan changes, run **Update / Export PPTX** to keep existing rough edits as much as possible  
4. Export spread PDF and load it with **Load PDF (spread)**  
5. Use imposition simulation output to fold a physical miniature booklet and review finish quality  
6. At final stage, run **Update / Export PPTX** with **single-page output** + **hide TOC/page labels**, then convert to PDF for print submission

## 7. Reordering

- Drag and drop items on the board to reorder within the same level.

---

Credit: (c) 2026 Satoshi Endo all right reserved
Contact: https://x.com/hortense667 
