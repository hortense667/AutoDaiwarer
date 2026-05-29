# AutoDaiwarer (JavaScript)

台割テキストを読み込み、ページに流し込み表示する静的Webアプリです。

> English users: the English README is in the second half of this document.

この `README.md` は概要と最短の使い方です。  
詳細手順（入力形式・同期セットアップ）は `USAGE.md` を参照してください。

## 使い方

1. `index.html` をブラウザで開く
2. `入力・編集` で台割テキストを編集
3. `保存` で再描画し、`台割ファイル名_版_YYYYMMDDHHmm.txt` をダウンロード
4. `ファイルから読み込み` でファイル選択し、選択時に自動読み込み
5. `記事一覧` で一覧表示し、`CSV出力` と `印刷` が可能
6. `キャンセル` で編集画面を閉じる（保存せず閉じる場合）
7. `ヘルプ` で簡易説明を表示
8. `面付け` から `ラフ用PPTX出力` / `PPTX更新・出力` / `PDF読み込み（見開き）` を使って、見開きラフ制作〜面付け確認まで実行可能

### 英語モード

- 上部の `English Mode` チェックを ON にすると英語モードになります（URL には `?mode=en` が反映されます）。
- URL に `?mode=en` を付けても英語モードで表示できます（例: `index.html?mode=en`）。
- 英語モードではボタン/ヘルプ/記事一覧見出しに加えて、入力補助の候補も英語になります。
- `Insert Sample` で挿入されるサンプルも英語コマンド（`//large`, `//middle`, `//small`, `//board`, `//insert`, `//hold` など）になります。

### 本番（Cloudflare Pages 等）でのサーバー連携

- デプロイ先では読み込み時に **`/api/session`** が呼び出されます（環境確認）。静的ファイルのみで開いた場合とは起動経路が異なります。
- 任意で **`data` + Google ドライブの共有リンク** で、サイトがプレーン .txt を取り込み初回読み込みできます。詳しくは **`USAGE.md` と `ADMIN.md`** を参照してください。
- サイト運用側で許可したときだけ、アドレスバーの別の **`mode`** 値がヘッダ等の<strong>サーバー側</strong>の見た目切替につながります（応答フィールドを介してのみ反映）。
- 開始後、アドレス欄では `mode` が整理されることがあります。`data` / `share` / `syncEndpoint` は必要に応じて保持されます。

詳細は `USAGE.md` を参照してください。

## 実装済みの主な機能

- 大/中/小目次のパースと台割への流し込み
- 開始ページ番号からのページ採番
- `//開き 左|右` による開き方向切替（省略時は左）
- `//台 台番号 版型 ページ数` による台設定（省略項目は前回値を継承）
- 8ページ台対応（表示枠は16枠維持、未使用枠は空白）
- 見開き区切りの太線表示
- 上位からの担当者継承 (`-` 指定)
- 溢れ不足の背景色表示（ピンク/水色）
- ホバー0.5秒で担当/締切/進行/メモのツールチップ
- 右ドラッグで無題記事を追加（薄いグレー）
- ドラッグ&ドロップで同レベル記事を並び替え
- 入力補助モード（`//` 起点、候補選択・確定）
- `//保留` の入力補助（`//大` / `//中` / `//小` 同様にページ数・担当などの候補補完）
- `//保留 ...` / `//hold ...` をテキスト中の任意位置で保留指定でき、通常台割の後ろに「空白1台 + 保留1記事1台」で表示
- 保留台の左ボックス表示（上段: 保留、下段: 連番）
- `//別丁` 行の解釈（左開き=台右側、右開き=台左側、以降ページ番号の進み反映）
- 大目次まで／中目次までの入力でも表示可能（大目次の直下に小目次が来た場合は、内部で名前なし中目次を自動補完）
- 記事一覧の3列階層レイアウト（大/中/小）と右側メタ列（`//記事項目設定` の「記事名より後」で定義した項目）
- 記事一覧の「カスケード表示」ON/OFF切替（既定ON）
- 記事一覧への別丁・保留表示とCSV出力
- `English Mode` チェック（または `?mode=en`）による英語UI・英語コマンド入力対応
- （本番）`/api/session` 経由での起動確認、任意で `mode` と `Drive` を組み合わせたソース読込・見た目切替え（`/api/initial-data`、`uiTheme`。詳細は `USAGE.md`）
- `?share=<共有ID>&syncEndpoint=<AppsScriptURL>` による Drive 同期（自動保存・自動再取得・競合検知）
- `ラフ用PPTX出力`（見開きラフPPTXを生成）
- `PPTX更新・出力`（既存PPTXの書き込みを維持しながら再配置。1ページ出力/目次名・ページ番号非表示のオプション対応）
- `PDF読み込み（見開き）`（見開きPDFを台割ページ順に分割して面付け確認）

## 代表的な運用フロー（概要）

1. 台割を作成し、節目で `ラフ用PPTX出力` を実行
2. PowerPointで見開きラフを作り込む
3. 台割変更時は `PPTX更新・出力` で既存ラフを引き継ぎながら更新
4. 見開きPDFを書き出して `PDF読み込み（見開き）` で確認
5. 面付けシミュレーション結果を折って、ミニチュア本で物理確認
6. 最終段階で `PPTX更新・出力` の「1ページずつ出力」+「目次名とページ番号を表示しない」を使い、PDF化して入稿データ化

## Google Drive 同期（Apps Script）

- この機能は **通常は不要** です。普段は `share` なしでローカル編集してください。
- **どうしても共有で共同編集したい場合のみ**、`share` と `syncEndpoint` 付きURLを使ってください。
- 共有URLに `share` と `syncEndpoint` を付けると、同じデータを自動同期できます。
- セットアップ手順は `USAGE.md` を参照してください。

---

クレジット: (c) 2026 Satoshi Endo all right reserved
連絡先: https://x.com/hortense667 

---

# AutoDaiwarer (JavaScript)

A static web app that reads editorial pagination text and renders it as board layout pages in the browser.

This `README.md` is for overview and quick start.  
For detailed usage (input format and sync setup), see `USAGE.md`.

## Quick Start

1. Open `index.html` in your browser.
2. Click `入力・編集` (`Input/Edit`) and edit the source text.
3. Click `保存` (`Save`) to re-render and download `filename_version_YYYYMMDDHHmm.txt`.
4. Click `ファイルから読み込み` (`Load from file`), then choose a file to import immediately.
5. Click `記事一覧` (`Article List`) for table view, CSV export, and list print.
6. Click `キャンセル` (`Cancel`) to exit editor without saving.
7. Click `ヘルプ` (`Help`) for an in-app quick guide.
8. Use `面付け` (`Imposition`) for `Export Rough PPTX`, `Update / Export PPTX`, and `Load PDF (spread)` to cover rough drafting through print-layout checks.

### English mode

- Turn on the `English Mode` checkbox in the top bar to switch UI language (this also reflects `?mode=en` in the URL).
- You can also open directly with `?mode=en` (example: `index.html?mode=en`).
- UI labels, help text, and article list headers switch to English.
- Assist candidates and `Insert Sample` content also use English directives (`//large`, `//middle`, `//small`, `//board`, `//insert`, `//hold`).

### Production (Cloudflare Pages, etc.)

- On deploy, **`/api/session`** is fetched at startup. This differs from opening only static files locally.
- Optionally use **`data` + a Google Drive share link** so the site can pull a plain `.txt` as the first load. See **`USAGE.md` and `ADMIN.md`**.
- Optional header styling may be switched only when **`/api/session`** returns `uiTheme` for a **`mode`** value configured on the server (not inferred from scripts alone).
- After startup, `mode` may be normalized in the address bar. `data` / `share` / `syncEndpoint` are kept when needed.

See `USAGE.md` for full details.

## Key Features

- Parses Large/Middle/Small hierarchy rows and maps them onto boards.
- Supports custom start page numbering.
- Supports opening direction via `//opening left|right` (default: left).
- Supports board directives (`//board boardNo format pages`) with inheritance for omitted values.
- Supports 8-page boards while keeping 16 visual slots.
- Shows spread boundary with thick separators.
- Inherits assignees from parent levels (`-` fallback handling).
- Highlights overflow/under-allocation with background colors.
- Shows tooltip (desk/editor/writer/deadline/status/memo) on hover.
- Adds untitled article by right-drag interaction.
- Reorders items by drag-and-drop within the same level.
- Provides assist mode for fast `//` directive input.
- Supports `//hold` entries from any position in the source and renders them after a blank-board gap.
- Parses `//insert` lines and applies page advance logic.
- Renders article list with hierarchy columns + metadata columns defined after `Article` in `//article-fields`.
- Supports article list cascade toggle.
- Exports article list as CSV.
- English UI via `?mode=en` parsed in the browser.
- Hosted builds: **`/api/session`** gate plus optional **`data` + Drive** bootstrap and **`uiTheme`** styling via **`/api/initial-data`** (see `USAGE.md`).
- Supports Drive sync via `?share=<id>&syncEndpoint=<AppsScriptURL>` (auto-save, auto-poll, conflict detection).
- `Export Rough PPTX` for spread-based rough drafts.
- `Update / Export PPTX` to keep existing PPTX rough edits while re-mapping by article match (with single-page / hide-label options).
- `Load PDF (spread)` to split spread PDFs and verify imposition against flatplan order.

## Typical Workflow (Overview)

1. Build the flatplan and run `Export Rough PPTX` at checkpoints.
2. Refine spread roughs in PowerPoint.
3. When flatplan changes, run `Update / Export PPTX` to preserve rough edits as much as possible.
4. Export spread PDF and load it with `Load PDF (spread)`.
5. Fold printed imposition output to review a physical miniature booklet.
6. For final handoff, use `Update / Export PPTX` with single-page output + hide TOC/page labels, then export PDF for print submission.

## Google Drive Sync (Apps Script)

- This is optional. For normal use, keep working locally without `share`.
- Use this only when collaborative editing is really needed.
- Use a URL with `share` and `syncEndpoint` for this mode.
- See `USAGE.md` for setup details.

---

Credit: (c) 2026 Satoshi Endo all right reserved
Contact: https://x.com/hortense667 
