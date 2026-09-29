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
- 各ページ最下段のステータス帯（色数の濃さと進行。意味は次章）

## 2. 台割画面の見方（色と帯の意味）

### 帯の基本

- 上段: 大目次
- 中段: 中目次
- 下段: 小目次

同じ項目が続くページは、同じ帯として横方向に続いて表示されます。

### ステータス帯

各ページ枠の最下段（大・中・小の帯の下）にある細い帯です。

- 背景は `//台` の色数に応じた薄いグレーです。1C は白に近く、2C・3C・4C と色数が増えるほど少し濃くなります。`4C1C` のように表裏で色数が違うときは、そのページが面付けの表か裏かで濃さが変わります。
- 文字は記事の「進行」（ステータス）欄をそのまま表示します。語句による色分けはありません。
- 同じページに大・中・小が重なるときは、小 → 中 → 大の順で、先に進行が書かれている階層の文言を使います。同じ文言が続く区間はつながって表示されます。

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

**ChatGPT 等で台割のたたきを作るとき**は、長い本書の代わりに **`DWML_OUTPUT_RULES.md`**（出力ルール用の1枚メモ）を添付すると精度が上がりやすいです。記事リストと合わせて「台割テキストのみ出力」と指示してください。

**台割の文法チェック**: **台割に反映**するとき（エディタの閉じる、AI取り込み、ファイル読込）に、不明な `//` 指令・階層の欠け・色数の誤りなどを検出します。エラーがある場合は反映しません。警告のみのときは確認のうえ反映できます。エディタでは問題行を色付き表示し、**先頭の問題行へ**でジャンプします（行番号ガターはありません）。

**Custom GPT 連携（API 不要）**: **入力・編集** → 台割エディタ内の **AIお助け** で、**新規作成**・**既存台割の修正**・**章立ての再構成**ができます。**現在の台割全文をコピーに含める**（ON/OFF）と **指示・メモ** を Custom GPT に渡し、GPT の出力を **貼り込み欄に貼り付け → 台割に反映** します。手順・GPT Instructions は **`CUSTOM_GPT_SETUP.md`**。本番は **`CUSTOM_GPT_URL`**（`ADMIN.md`）。

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
  - `//filename` / `//title` / `//opening` / `//pages` / `//planned` / `//version` / `//writer` / `//start-page` / `//body-folio-start`
  - `//hyoshi` / `//cover` / `//obi` / `//appendix`（表紙・カバー・帯・付録。英語表示名は Cover / Dust jacket / Obi / Appendix）

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
//本文ノンブル開始位置 5
```

体裁ブロック（`//体裁` 見出しの下）にまとめて書いても構いません。行の位置はどこでも解釈されます。

```text
//体裁
	//判型 A4変形縦
	//開き 左
	//ページ数 128
	//開始ページ番号 1
	//本文ノンブル開始位置 5
```

`//開き` は次を指定できます。

- `//開き 左`（既定値）
- `//開き 右`

### ページ番号（ノンブル）

台割上の各ページ枠に表示される番号です。面付けプレビュー・ラフ PDF/PPTX のフッター番号にも反映されます。

| 行 | 意味 | 既定 |
|---|---|---|
| `//開始ページ番号` | 本文アラビア数字の開始値 | `1` |
| `//本文ノンブル開始位置` | 台割上でアラビア数字が始まるページ位置（1 始まり） | `1` |

- `//本文ノンブル開始位置` を省略した場合、または `1` を指定した場合 … 最初のページから `1`, `2`, `3` …（`//開始ページ番号` の値から）
- `//本文ノンブル開始位置 5` の例 … 台割 1〜4 ページ目は `i`, `ii`, `iii`, `iv`（小文字ローマ数字）、5 ページ目から `1`, `2`, `3` …
- 別丁の「ページ進み」は台割上の物理位置に加算され、ローマ数字区間・本文区間の判定にも使われます

英語モードでは `//start-page` / `//body-folio-start` です。

### 表紙・カバー・帯・付録

```text
//表紙 ページ数 担当 締め切り メモ
//カバー ページ数 担当 締め切り メモ
//帯 ページ数 担当 締め切り メモ
//付録 ページ数 担当 締め切り メモ
```

- `//大` と同様、**先頭トークンがページ数**です（例: `//表紙 5 山田 2026/05/22 5ページ目は背表紙`）
- 担当・締切・メモなどの列は `//目次項目設定` があればそれに従い、なければ `//記事項目設定` に従います（記事名列は省略し、種別名「表紙」等を表示）
- 台割では通常台の後ろに、各項目ごとに独立した帯として表示します。ページ番号は**項目内で 1 から**連番（本編ノンブルとは別）
- 英語モード: `//hyoshi`（表紙＝Cover）/ `//cover`（カバー＝Dust jacket）/ `//obi`（帯）/ `//appendix`（付録）。列定義は `//toc-article-fields`（目次項目設定）優先

ページ数を省略した旧形式（先頭が担当名など）も互換あり。その場合は表紙・帯・カバーは 4 頁、付録は 1 頁を既定とします。

### 台設定行

```text
//台 台番号 色数 ページ数
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
- 色数は各ページ最下段のステータス帯の濃さに反映されます（見方は「2. 台割画面の見方」のステータス帯）
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
- 台割ファイル先頭に **`//シェアID`**（任意で **`//同期URL`**）を書いておくと、どの共有データかがファイル上でも分かります（`book-202605` など）。URL の `?share=` と揃えてください。
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
- **ラフ用PPTX出力**（面付け）: 判型2ページ分の横長スライド（例: **A4縦 → A3横**）で見開きラフPPTXを直接出力します。`//開き` に合わせて左右配置し、右開き（片起こし）では最終ページの空白も反映します。各ページ天側に `//大`・`//中`・`//小` の記事名を表示し、大/中/小の組み合わせが同一のページには連番を付けます。記事照合用の管理情報はPPTX内に埋め込まれます。PowerPoint 等で編集後にPDFへ書き出し、**PDF読み込み（見開き）** から面付けシミュレーションに読み込んでください。出力には **数秒〜数十秒** かかることがあり、処理中は「処理中…」を表示します。
- **PPTX更新・出力**（面付け）: 更新ダイアログで「見開きでなく1ページずつ出力」「目次名とページ番号を表示しない」を選択できます。未チェック時は見開き出力で再生成し、記事が一致する半ページは旧PPTXから編集済みの形状をコピーします。照合は最下位クラスの記事名から始め、同名が複数なら上位クラス（小→中→大）→連番の順で判定します。処理中は「処理中…」を表示します。
- **PDF読み込み（見開き）**: 見開きPDFをノンブル順（1, 2, 3…）に分割して読み込みます。面付けの台指定が `1 4 2 3` のような変則順でも、各スロットは台割上の**ページ番号**（全体通し）でPDFを参照するため正しく対応します。PDFには台割**全体**のページ列が含まれている必要があります。
- **背丁**（面付プレビュー／印刷）: グリッド上で **1–16**（16面）または **1–8**（8面）が辺で隣り合う折のみ、折り（背）の中央に小さく表示。`//書名` を先頭15字程度＋折番号を《》で表示し、プレビュー・印刷に出る順で番号を振る。折位置には薄い補助線（文言部分は除き、線と字の間に余白）。縦判＝縦組、横判＝横書き。横判16面など、最終グリッドで隣接しない場合は表示されないことがあります。
- **地図折り**（面付け）: 1枚の紙を16ページに折る「地図折り」の面付け配置を、自分で自由に指定できる機能です。**16面付け専用**で、`地図折り（16個）` 欄に値を入れると **8面付け・8P折本は自動的にOFF** になります（排他）。標準の16面付けマップの代わりに、入力した配置で面付けプレビュー・印刷・PDF読み込みを行います。
  - **入力する値**: `1`〜`16` を **重複なくちょうど16個** 指定します。区切りはカンマ・半角/全角スペース・読点（`、`）・全角カンマ（`，`）のいずれでも構いません。各数字は **その台（16ページの折丁）の中の相対ページ位置** を表します（`1` ＝台の1ページ目、`16` ＝台の16ページ目）。1〜16以外の数字・個数違い・重複があるとエラーになり、理由が表示されます。
  - **並べる順番（ここが重要）**: 値は **紙面のマス目に置いていく順** で並べます。**前半の8個が表面、後半の8個が裏面** です。各面のマス目は次の順で埋まります。
    - **縦判**（A4縦など）＝ **4列×2行**。1〜4個目＝表の上段（左→右）、5〜8個目＝表の下段（左→右）、9〜12個目＝裏の上段（左→右）、13〜16個目＝裏の下段（左→右）。
    - **横判**（A4横など）＝ **2列×4行**。上の行から順に各行2個ずつ左→右で埋め、前半8個＝表面、後半8個＝裏面。
  - **例（縦判）**: `1,16,2,3,4,5,6,7,8,9,10,11,12,13,14,15` と入れると、表の左上マスに台の1ページ目、その右隣に16ページ目…という並びになります。この例は説明用なので、**実際の折り方に合わせて自由に数字を並べ替えて**ください。
  - **向き**: 各ページは天地そのまま（正立）で配置され、裏面は表裏の裏打ちが合うようシート全体で向きが調整されます。**プレビューを印刷して実際に折り、ページが正しい順序でつながるか確認しながら並びを詰める**のがおすすめです。
- **8P折本**（面付け）: 8P折本、ワンシートZINE、マジック折などと言われる、1枚の紙を8つにたたんで中央に切り込みを入れて作る簡易製本用の面付です。**縦判のときのみ有効**で、**8面付け・地図折りと排他**です。8ページを超える本文でも、16ページ単位の相対ページ位置で同じ順序を繰り返して割り付けます。  
  - **右開き**: 表 `1,8,7,6 / 2,3,4,5`、裏 `9,16,15,14 / 10,11,12,13`  
  - **左開き**: 表 `6,7,8,1 / 5,4,3,2`、裏 `14,15,16,9 / 13,12,11,10`

### おすすめワークフロー（ラフ制作〜入稿）

1. 台割を作成し、節目ごとに **ラフ用PPTX出力** で見開きラフを出力  
2. 見開きイメージを確認しながら PowerPoint でラフを育てる  
3. 台割を変更したら **PPTX更新・出力** を実行（既存ラフをできるだけ維持しつつ再配置）  
4. ある程度固まったら見開きのままPDF化し、**PDF読み込み（見開き）** で読み込む  
5. 面付けシミュレーションの印刷結果を折って、ミニチュア本として物理確認する  
6. 最終段階では **PPTX更新・出力** で「1ページずつ出力」+「目次名とページ番号を表示しない」を使って書き出し、PDF化して入稿データとして利用する

### 印刷会社への入稿（PowerPoint → PDF）

AutoDaiwarer の PPTX 出力は **台割に沿ったラフ制作・ページ割り確認** が主目的です。**塗り足し・トンボ付きの完全入稿データは自動では作りません**。そのため、印刷会社へ渡すときは PowerPoint（または別ソフト）での仕上げが必要になることが多いです。現時点では **アプリ側の機能追加なし** で、次の流れが現実的です。

#### AutoDaiwarer 側でやること

1. `//判型` に**仕上がりサイズ**（断裁後のサイズ）を正しく入れておく。1ページ出力のスライドサイズはこの判型に合わせます。
2. 見開きラフで PowerPoint 上のデザインを仕上げる（**ラフ用PPTX出力** → 編集 → **PPTX更新・出力** を繰り返す）。
3. 入稿直前に **PPTX更新・出力** で次を ON にする。
   - **見開きでなく1ページずつ出力** … 1ノンブル＝1スライド（仕上がりサイズ）
   - **目次名とページ番号を表示しない** … ラフ用の天ノンブル・記事名ラベルを載せない（編集済み形状は更新時に引き継がれます）
4. 出力した PPTX を PowerPoint で開き、**入稿前の最終調整**を行う（下記）。

#### PowerPoint 側でやること（印刷会社の指定に従う）

印刷会社ごとに「PDF で入稿」「トンボ要／不要」「塗り足し 3 mm」などルールが違います。**必ず受付ページ・入稿ガイドを先に確認**してください。

| 項目 | 一般的な考え方 |
|---|---|
| スライドサイズ | 仕上がりのみ → **塗り足し分を足したサイズ**に変更（例: A4 仕上がり 210×297 mm、塗り足し 3 mm 四方なら 216×303 mm）。[イシダ印刷の解説](https://www.lowcost-print.com/column/powerpoint%E3%81%A7%E5%85%A5%E7%A8%BF%E3%83%87%E3%83%BC%E3%82%BF%E3%82%92%E4%BD%9C%E3%82%8B%E6%96%B9%E6%B3%95/) も参照。 |
| 塗り足し | 端まで色・写真がある場合、断裁で白フチが出ないよう背景を外側へ 3 mm 程度延ばす。 |
| トンボ | 会社によって **不要**（データチェックのみ）のこともあれば、**必須**のこともある。[PPDTP のトンボ解説](https://ppdtp.com/powerpoint/trim-mark/) などを参考に、必要ならマスターにトンボ用オブジェクトを置く。 |
| 画像 | 「図の圧縮」を **高品質** に。貼り込み画像は 350 dpi 前後を目安（会社指定に合わせる）。 |
| 色 | PowerPoint は RGB 作業が基本。蛍光色は印刷で再現しにくい。正確な色管理が必要なら CMYK 指定の会社・DTP ソフトを検討。 |
| 書き出し | **PDF** が一般的。フォントの埋め込み・解像度・PDF/X などは **印刷会社の入稿規定**に合わせる。 |

#### このソフトとの役割分担

- **AutoDaiwarer** … ページ順・見開き・面付け確認、ラフのページ割り、1ページ単位への展開
- **PowerPoint（＋印刷会社の規定）** … 塗り足し、トンボ、色・解像度、最終 PDF

「1ページ出力 → サイズ変更 → 塗り足し → トンボ → PDF」という流れは妥当です。トンボや塗り足しの自動生成までアプリに組み込むかどうかは、印刷会社のバリエーションが大きいため **将来の拡張候補** とし、当面はドキュメントと PowerPoint 側の手順で足りる、という整理がよいと思います。

#### 参考リンク（外部）

- [PowerPointで入稿データを作る方法（イシダ印刷）](https://www.lowcost-print.com/column/powerpoint%E3%81%A7%E5%85%A5%E7%A8%BF%E3%83%87%E3%83%BC%E3%82%BF%E3%82%92%E4%BD%9C%E3%82%8B%E6%96%B9%E6%B3%95/)
- [PowerPointでトンボを入れる方法（PPDTP）](https://ppdtp.com/powerpoint/trim-mark/)


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
- A status strip at the bottom of each page (ink-count shading and workflow text; see the next section)

## 2. Bands and Colors

### Band levels

- Top: Large
- Middle: Middle
- Bottom: Small

The same item continues as one horizontal band across consecutive pages.

### Status strip

A thin strip at the bottom of each page slot, under the Large / Middle / Small bands.

- Background is light gray from the `//board` ink count. 1C is nearly white; 2C, 3C, and 4C get slightly darker. With a duplex form such as `4C1C`, the shade follows whether that page is on the imposition front or back.
- The text is the article **status** (workflow) field, shown verbatim. There is no keyword-based coloring.
- When Large, Middle, and Small overlap on one page, the first non-empty status wins in the order Small → Middle → Large. Adjacent spans with the same text are drawn as one run.

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

For LLM-generated drafts, attach **`DWML_OUTPUT_RULES.md`** (short output rules) plus your article list, and ask for flatplan text only.

**Flatplan syntax check**: On **Apply to flatplan** (editor close, AI import, file load), unknown `//` directives, hierarchy issues, and board color mistakes are reported. Errors block apply; warnings can be ignored after confirmation. The editor highlights issue lines and **Go to first issue** jumps there (no line-number gutter).

**Custom GPT (no API key)**: **Input / Edit** → **AI Assist** in the flatplan editor supports **new flatplans**, **edits**, and **rearranging** — optionally **include the current flatplan** plus **instructions**, then **paste GPT output** into the preview area → **Apply to flatplan**. See **`CUSTOM_GPT_SETUP.md`**. Hosted sites: **`CUSTOM_GPT_URL`** (`ADMIN.md`).

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
//body-folio-start 5
```

You may group trim-related lines under a `//体裁`-style block in Japanese sources, or place these directives anywhere in the file.

### Page folios (printed page numbers)

Numbers shown at the bottom of each board slot; also used in imposition preview and rough PDF/PPTX footers.

| Directive | Meaning | Default |
|---|---|---|
| `//start-page` | First Arabic folio in the body | `1` |
| `//body-folio-start` | Flatplan position (1-based) where Arabic folios begin | `1` |

- Omitted or `1`: folios run `1`, `2`, `3` … from the first page (starting at `//start-page`).
- Example `//body-folio-start 5`: pages 1–4 show `i`, `ii`, `iii`, `iv`; from page 5 onward `1`, `2`, `3` …
- Insert (`//insert`) page advances shift physical position and affect Roman vs Arabic boundaries.

Japanese equivalent: `//開始ページ番号` / `//本文ノンブル開始位置`.

### Cover, dust jacket, obi, appendix

```text
//hyoshi pages assignee deadline memo
//cover pages assignee deadline memo
//obi pages assignee deadline memo
//appendix pages assignee deadline memo
```

| Directive | Japanese | English label on board |
|---|---|---|
| `//hyoshi` | 表紙 | Cover |
| `//cover` | カバー（ブックジャケット） | Dust jacket |
| `//obi` | 帯 | Obi |
| `//appendix` | 付録 | Appendix |

- Page count is the **first token** after the head (same pattern as `//large`).
- Field columns follow `//toc-article-fields` when set, otherwise `//article-fields`.
- Rendered as separate board strips after the main flatplan; each item uses **local numbering 1, 2, 3…** (not main-book folios).
- Japanese heads: `//表紙` / `//カバー` / `//帯` / `//付録`.

Legacy lines without an explicit page count still parse; defaults are 4 pages for hyoshi/obi/cover and 1 for appendix.

### Board directive

```text
//board boardNo colorCount pages
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
- Ink count sets the shade of the bottom status strip (see **Status strip** under “2. Bands and Colors”).

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
- Meta and trim directives include `//start-page`, `//body-folio-start`, and cover-material rows `//hyoshi` / `//cover` / `//obi` / `//appendix` (with `//toc-article-fields` for column layout when set).

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
- **Export Rough PPTX** (imposition): exports spread rough PPTX with slide width equal to two trim pages (e.g. **A4 portrait → A3 landscape**), laid out per `//opening` (right opening = **kata-okoshi** / 片起こし; blank handling on the last page applies). Each page header shows `//large`, `//middle`, and `//small` article names; duplicate large/middle/small combinations get a serial number. Article metadata is embedded in the PPTX. Edit in PowerPoint, export to PDF, then load via **Load PDF (spread)**. Export may take **several seconds to tens of seconds**; a **Processing…** overlay is shown until finished.
- **Update / Export PPTX** (imposition): opens an options dialog with **single-page output** and **hide TOC/page labels**. With no checks, behavior is the same as spread update. Matching pages copy edited shapes from the source PPTX (bottom article level → upper levels → serial number). A **Processing…** overlay is shown until finished.
- **Load PDF (spread)**: splits spread PDF pages into single pages in flatplan order (1, 2, 3…). Irregular board selection (e.g. `1 4 2 3`) still maps each slot by its **global page number**; the PDF must contain the **full** flatplan page sequence.
- **Spine marks** (imposition preview/print): when pages **1–16** (16-up) or **1–8** (8-up) are **adjacent** on the rendered grid, a small spine legend is centered on that fold: `//title` (first ~15 graphemes) plus a fold index in 《…》, numbered in output order. A light guide line runs along the fold with a gap around the type. Portrait layout uses vertical type; landscape uses horizontal. Some layouts (e.g. horizontal 16-up) may omit marks when those pages are not neighbors.
- **Map fold** (imposition): custom 16-up arrangement (enter 16 unique values `1..16` in slot order). Entering this field turns **8-up and 8P fold booklet** off (mutually exclusive).
- **8P fold booklet** (imposition): one-sheet zine / magic-fold arrangement. Available only for portrait trim, and mutually exclusive with 8-up and map fold. Relative-page order repeats per 16 pages.  
  - Right opening: front `1,8,7,6 / 2,3,4,5`, back `9,16,15,14 / 10,11,12,13`  
  - Left opening: front `6,7,8,1 / 5,4,3,2`, back `14,15,16,9 / 13,12,11,10`

### Recommended workflow (rough draft to print-ready)

1. Build your flatplan and periodically run **Export Rough PPTX**  
2. Refine rough layouts in PowerPoint while checking spreads visually  
3. When flatplan changes, run **Update / Export PPTX** to keep existing rough edits as much as possible  
4. Export spread PDF and load it with **Load PDF (spread)**  
5. Use imposition simulation output to fold a physical miniature booklet and review finish quality  
6. At final stage, run **Update / Export PPTX** with **single-page output** + **hide TOC/page labels**, then convert to PDF for print submission

### Submitting to a print shop (PowerPoint → PDF)

AutoDaiwarer PPTX export is mainly for **rough layout tied to the flatplan**. It does **not** automatically produce print-ready PDFs with bleed or crop marks. Final handoff usually requires finishing in PowerPoint (or another DTP tool). **No extra app features are required** for a typical workflow:

#### In AutoDaiwarer

1. Set **`//trim-size`** to the **finished trim size** (after cut). Single-page slides use this size.
2. Refine design in spread roughs (**Export Rough PPTX** → edit → **Update / Export PPTX**).
3. Before submission, run **Update / Export PPTX** with:
   - **Single-page output** (one folio = one slide at trim size)
   - **Hide TOC name and page number** (no rough header/footer labels; edited shapes are preserved on update)
4. Open the exported PPTX in PowerPoint for **final prepress** (below).

#### In PowerPoint (follow your printer’s spec)

Rules differ by vendor (PDF only, crop marks required or not, 3 mm bleed, etc.). **Read their submission guide first.**

| Topic | Typical approach |
|---|---|
| Slide size | Expand from trim to **trim + bleed** (e.g. A4 210×297 mm → 216×303 mm with 3 mm bleed per side). See [Ishida Printing’s guide (JA)](https://www.lowcost-print.com/column/powerpoint%E3%81%A7%E5%85%A5%E7%A8%BF%E3%83%87%E3%83%BC%E3%82%BF%E3%82%92%E4%BD%9C%E3%82%8B%E6%96%B9%E6%B3%95/). |
| Bleed | Extend backgrounds/images past the trim edge where full-bleed art is needed. |
| Crop marks | Some shops require them, others do not. See e.g. [PPDTP trim-mark guide (JA)](https://ppdtp.com/powerpoint/trim-mark/). |
| Images | Disable aggressive picture compression; aim for ~350 dpi where possible. |
| Color | PowerPoint is RGB; neon colors may not print well. Use CMYK workflow if the shop requires it. |
| Export | PDF is common; follow the shop’s PDF/X, font embedding, and resolution rules. |

#### Division of roles

- **AutoDaiwarer** — page order, spreads, imposition checks, rough pagination, single-page export
- **PowerPoint (+ printer spec)** — bleed, crop marks, color/resolution, final PDF

Auto-generating bleed/crop marks inside the app is a possible **future enhancement**; for now, documentation plus PowerPoint finishing is enough for most users.

#### External references

- [Making submission data in PowerPoint (Ishida Printing, JA)](https://www.lowcost-print.com/column/powerpoint%E3%81%A7%E5%85%A5%E7%A8%BF%E3%83%87%E3%83%BC%E3%82%BF%E3%82%92%E4%BD%9C%E3%82%8B%E6%96%B9%E6%B3%95/)
- [Crop marks in PowerPoint (PPDTP, JA)](https://ppdtp.com/powerpoint/trim-mark/)

## 7. Reordering

- Drag and drop items on the board to reorder within the same level.

---

Credit: (c) 2026 Satoshi Endo all right reserved
Contact: https://x.com/hortense667 
