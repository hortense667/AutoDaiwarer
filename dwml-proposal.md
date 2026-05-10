# 台割記述言語（DaiwariML）提案 / Proposal

この文書の後半に英語版があります。  
The second half of this document is in English.

## 日本語版

## 背景

このプログラムは、約40年前に私が『月刊アスキー』編集部にいた頃に作った台割ソフトのリバイバル版です。  
私の手元にある最古のソースは次の2本です。

- 【おーと台割らぁ／バカパパウェア】Ver.3.3E 10/Apr/1990 in Aoyama, TOKYO
- 【おーと台割らぁ・ファミ２／バカパパウェア】Ver.1.0 04/Jun/1990 in Aoyama, TOKYO

ここで「ファミ２」とあるのは、ゲーム雑誌の『ファミコン通』のためのバージョンということです。月刊アスキーは、いわゆる平綴じであるのに対して、ファミコン通は、中綴じなので台割は少し違った形で表現しいというオーダーで作りました。
当時の日本の雑誌編集部で広く使われていた台割表を、パソコンで扱える形で実務的に扱えるようにすることが目的でした。  
1990年前後はパソコン雑誌のページ数が急増し、私が編集長になる頃には広告を除く本文だけで250ページ超、ピーク時には広告込みで700ページ超の号もありました。

この規模になると、手書きやエクセルだけで台割を維持・更新するのは非常に大きな負担になります。  
しかもパソコン雑誌はニュース対応で差し替えを行いたくなることがままあります。さらに細かいことをいうと編集部の進行管理の担当者はどの台から印刷所に入れていくかを考えます（下版といいます）。それによって複数の記事を担当している編集者やデザイナーにどの記事を優先せよと指示を出すことをしていました。印刷所から少しでも早くまとまった台のデータが欲しいと言ってくるからです。ほぼ戦場です。台割の管理が時間との戦いである編集部において生命線だったといっても大げさではなかったのです。そこで生まれたのが「おーと台割らぁ」でした。今回の AutoDaiwarer でも、その愛称を継承したいと考えています。

## DaiwariML（台割記述言語）の提案

今回、AutoDaiwarer のデータ形式を「台割記述言語（DaiwariML）」と呼ぶことを提案します。

新たな記述言語を提案するなんて図々しいですが、なにしろ私の編集部だけでなく、私の見えないところで30年も使われていたことが最近分かったからです。ある出版社の社長によると「台割つくりは、いまだにこのソフトウェアによる方式がいちばんよい」ということでした。

IBMの大型コンピュータで使われていたJCL （Job Control Language）的な書式ですが、台割には「物理的な紙の製本上の制約（台の存在）」があり、YAML や TOML の一般的な階層表現だけでは運用しにくい場面があります。
見た目は不格好でも、現場の編集工程を崩さず、差し替えに強いという利点があると考えています。ちなみに、JCLは、それが誕生した当時もIBM社内ではPL/Iというモダンな言語も作られていたのに、なんて古典的な文法なのだと揶揄されたとどこかで読んだことがあります。
そんな文法ですが、なぜかこちらのほうがスッキリくるのです。

## 追加するセクション行

可読性のため、次のセクション行を追加することを提案します。

- `//体裁`
- `//台構成`
- `//目次計画`
- `//表紙まわり`

これらは現時点では主に「見出し」として扱われ、動作上の必須要素ではありません。  
ただし、将来的には自動整形やAI補助の区切りとして利用できる可能性があります。

注: 本文中で「5つの特別な行」と表現する場合、上記4行に加えて区切り用コメント行（`//*`）を含める意図です。

## ファイル拡張子と文字コード

- 保存時の拡張子は、従来どおり `.txt` でも、提案名に合わせて `.dwml` でも構いません。
- 実体はどちらもプレーンテキストです。
- 日本語データを扱う場合、文字コードは UTF-8 を推奨します。

## 互換性と拡張方針

- 予約語以外の行頭キーワードは、現状では多くの場合「無視される/意味を持たない」設計です。
- 例: `//頒布イベント` は同人誌運用に合わせたメタデータで、現状は表示補助的な意味しかありません。
- こうしたことに関しても、今後AIが台割データを扱う時代には、こうしたメタ情報を文脈的に解釈して活用できることを期待しています。

## サンプル（セクション行付き）

```text
//台割ファイル名	sample_daiwari
//書名	サンプル書名
//版	0.1
//記入者	山田
//刊行予定	2026/06/01
//入稿日	2026/05/04	あと 2 日
//刷数	初版500	発注は締切厳守
//頒布イベント	文学フリマ42	2026/05/04	売り子は売れるものだけ持ち込み
//印刷所	大日本印刷
//体裁
	//開き	左
	//ページ数	16*2+6
	//開始ページ番号	1
//台構成
	//*	開始台	色数等	台のページ数
	//台	1	1C	16
	//台	3	4C	8
	//台	4	1C	16
	//*
//目次計画
	//目次項目設定	ページ数	記事名	担当	締め切り	メモ
	//大	1	とびら	山田	2026/05/01
	//大	3	目次	山田	2026/05/01
	//大	4	特集A	佐藤
		//中	4	導入	佐藤
			//小	2	見開き1	佐藤	2026/05/01	メモ例
			//小	2	見開き2	大塚	2026/05/02	★行をクリックでコメント入力できます
	//大	6	実験コーナー	山田
		//中	2	やってみた	山田	2026/05/03	初稿でている
	//*
	//保留	2	差し替え候補	山田	2026/05/21	台割に組み込まれていない記事。
	//保留	4	追加記事	佐藤	2026/05/30	台割に組み込まれていない記事２。
	//*
	//別丁	2	4	折込地図	田中	2026/05/20	発注前
	//*
//表紙まわり
	//表紙	山田	2026/05/22	メモ
	//カバー	佐藤	2026/05/23	カバーコピー確認
	//帯	佐藤	2026/05/22	帯文確認
	//付録	大塚	2026/05/24	付録面確認
//*
//*	記事一覧での記事データの各カラムの表示幅です（記事一覧ページで修正すると自動的に反映されます）
//記事一覧カラム幅	9	9	9	20	10.33	10.33	10.33	10.33	10.33	10.33
//*	また、記事名より後の項目は変更できます（たとえば「//記事項目設定	ページ数	記事名	内容」のみなど）
//*
//更新履歴	2026/05/02 15:41:20	遠藤	サンプルデータを修正しました。
//*
//*	このデータはAutoDaiwarer用です。
```

---

クレジット: (c) 2026 Satoshi Endo all right reserved  
連絡先: https://x.com/hortense667

---

## English Version

## Background

This program is a revival of a layout-planning tool I originally built nearly 40 years ago while working at the editorial department of *Monthly ASCII* in Japan.

The oldest source packages I still have are:

- [Auto Daiwarer / BakaPapaWare] Ver.3.3E 10/Apr/1990 in Aoyama, TOKYO
- [Auto Daiwarer Fami2 / BakaPapaWare] Ver.1.0 04/Jun/1990 in Aoyama, TOKYO

Here, “Fami2” means a variant built for the game magazine *Famicom Tsushin*.  
*Monthly ASCII* was mainly perfect-bound, while *Famicom Tsushin* was saddle-stitched, so the board expression had to be adjusted for that production style.

The original goal was practical: to represent the board format commonly used in Japanese editorial departments in a way that could be handled on a personal computer.

Around 1990, PC magazines rapidly increased in size. By the time I became editor-in-chief, non-ad pages alone exceeded 250 pages, and at peak issues total pages (including ads) exceeded 700.

At that scale, manual management by handwriting or spreadsheets becomes expensive and fragile.  
PC magazines also often needed late replacements due to fast-moving news. More practically, the production editor had to decide which signatures should be sent to the printer first. In Japanese magazine production this is called *gehan* (sending pages/signatures to plate or print). That decision also determined which article should be prioritized when an editor or designer was responsible for several articles at once, because printers wanted complete signature data as early as possible.

It was almost a battlefield. In an editorial department where flatplan management was a race against time, the flatplan was no exaggeration a lifeline. That pressure gave birth to “Auto Daiwarer,” and I would like to keep that nickname in AutoDaiwarer as well.

## Proposal: DaiwariML

I propose calling this text format **DaiwariML**.

Proposing a “new language” may sound presumptuous, but I recently learned that this approach had been used for about 30 years, not only in my own newsroom but also elsewhere out of my sight.  
One publishing company president told me, “for making daiwari, this software style is still the best.”

Its syntax is JCL-like (Job Control Language from IBM mainframe days).  
Layout work has physical bookbinding constraints (the presence of signatures/boards), and those constraints are not always easy to operate with generic hierarchical formats such as YAML or TOML.

Even if it looks awkward, I believe it has practical advantages: it preserves real editorial workflow and tolerates replacements well.  
I once read that even when JCL was born, people mocked it as too old-fashioned despite IBM also having modern languages like PL/I.  
Still, for this problem, this style somehow feels cleaner.

## New Section Lines

For readability, I propose the following section lines:

- `//体裁`
- `//台構成`
- `//目次計画`
- `//表紙まわり`

At present, these are mostly visual delimiters and not semantically required for execution.  
However, they can become useful anchors for auto-formatting and AI-assisted tooling.

Note: when this document mentions “five special lines,” it refers to these four section headers plus comment separators such as `//*`.

## File Extension and Encoding

- Files may be saved with either `.txt` (conventional) or `.dwml` (proposal-oriented) extension.
- In both cases, the actual content is plain text.
- For Japanese content, UTF-8 encoding is recommended.

## Compatibility and Extension Policy

- Non-reserved keywords are generally tolerated and may be ignored in current runtime behavior.
- Example: `//頒布イベント` is metadata aimed at doujin publishing operations and currently has only display-support meaning.
- For this area as well, I hope future AI-assisted workflows will interpret and use such metadata contextually.

## Sample With Section Lines

```text
//filename	sample_daiwari
//title	Sample Book
//version	0.1
//writer	Yamada
//planned	2026/06/01
//submission-date	2026/05/04	2 days left
//circulation	First 500	Order on time
//distribution-event	Bunfree 42	2026/05/04	Only bring items that sell
//print-shop	Dainippon Printing
//体裁
	//opening	left
	//pages	16*2+6
	//start-page	1
//台構成
	//*	Start board	Color	Pages per board
	//board	1	1C	16
	//board	3	4C	8
	//board	4	1C	16
	//*
//目次計画
	//article-fields	Pages	Article	Desk	Deadline	Memo
	//large	1	Frontispiece	Yamada	2026/05/01
	//large	3	Contents	Yamada	2026/05/01
	//large	4	Feature A	Sato
		//middle	4	Introduction	Sato
			//small	2	Spread 1	Sato	2026/05/01	Sample memo
			//small	2	Spread 2	Otsuka	2026/05/02	Click a row to add a comment
	//large	6	Experiment Corner	Yamada
		//middle	2	Tryout	Yamada	2026/05/03	First draft received
	//*
	//hold	2	Replacement Candidate	Yamada	2026/05/21	Article not yet assigned to the flatplan.
	//hold	4	Additional Article	Sato	2026/05/30	Another article not yet assigned to the flatplan.
	//*
	//insert	2	4	Foldout Map	Tanaka	2026/05/20	Before ordering
	//*
//表紙まわり
	//hyoshi	Yamada	2026/05/22	Memo
	//cover	Sato	2026/05/23	Check cover copy
	//obi	Sato	2026/05/22	Check obi copy
	//appendix	Otsuka	2026/05/24	Check appendix page
//*
//*	Column widths for article metadata in the article list. Editing widths on the article list page reflects this automatically.
//article-list-widths	9	9	9	20	10.33	10.33	10.33	10.33	10.33	10.33
//*	Fields after Article can be customized, for example: //article-fields	Pages	Article	Content
//*
//changelog	2026/05/02 15:41:20	Endo	Updated sample data.
//*
//*	This data is for AutoDaiwarer.
```

---

Credit: (c) 2026 Satoshi Endo all right reserved  
Contact: https://x.com/hortense667
