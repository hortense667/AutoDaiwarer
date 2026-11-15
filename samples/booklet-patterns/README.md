# AutoDaiwarer 典型冊子パターン サンプル

note 投稿用原稿: [NOTE_ARTICLE.md](./NOTE_ARTICLE.md)  
マガジン: https://note.com/hortense667/m/m2712ecc2c5e1

各フォルダに次の4点があります。

- `*.dwml` … 台割テキスト（アプリに読み込み可）
- `*_rough_spread.pptx` … 見開きラフ相当の便宜PPTX
- `*_rough_spread.pdf` … 見開きの便宜PDF（PowerPoint変換の代わり）
- `*_imposition_*.pdf` … 面付けレイアウトの便宜PDF（表・裏）

中身のページは色分けとページ番号だけのプレースホルダです。
面付けのページ順はアプリ本体の定義に合わせています。

| フォルダ | 内容 |
|---|---|
| `01_left_portrait_16up/` | 左開き・縦判・16面付け — 標準的な左開き冊子（縦）。A3横に16面付け。 |
| `02_right_portrait_16up/` | 右開き・縦判・16面付け — 右開き（縦組向け）の16面付け例。 |
| `03_left_landscape_16up/` | 左開き・横判・16面付け — 横判の16面付け。用紙はA3縦向き、1行おきに天地逆。 |
| `04_mapfold/` | 地図折り（16面） — 地図折り指定例。並びは説明用の 1,16,2,…15。 |
| `05_8up/` | 左開き・縦判・8面付け — 8ページ折丁の8面付け例（A4縦に面付け）。 |
| `06_gacha/` | ガチャポン本（16面ベース） — 通常16面付けと同じページ順。各マスに上下2つの裁断枠。 |

## 再生成

```bash
node scripts/generate-booklet-pattern-samples.mjs
```

