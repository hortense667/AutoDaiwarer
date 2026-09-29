const DEFAULT_TEXT = `//台割ファイル名	sample_daiwari
//書名	サンプル書名
//版	0.1
//記入者	山田
//刊行予定	2026/06/01
//入稿日	2026/05/04	あと 2 日
//刷数	初版500	発注は締切厳守
//頒布イベント	文学フリマ42	2026/05/04	売り子は売れるものだけ持ち込み
//印刷所	大日本印刷
//体裁
	//判型	A4変形縦
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
			//小	2	見開き2	大塚	2026/05/02	★行をダブルクリックでコメント入力できます
	//大	6	実験コーナー	山田
		//中	2	やってみた	山田	2026/05/03	初稿でている
		//中	1	ミニコラム枠	山田	2026/05/03	小数ページ例
			//小	0.3	コラムA（前半）	山田	2026/05/03	1ページの途中で終了
			//小	0.7	コラムB（後半）	佐藤	2026/05/04	同じページ後半から開始
	//*
	//保留	2	差し替え候補	山田	2026/05/21	台割に組み込まれていない記事。
	//保留	4	追加記事	佐藤	2026/05/30	台割に組み込まれていない記事２。
	//*
	//別丁	2	4	折込地図	田中	2026/05/20	発注前
	//*
//表紙まわり
	//表紙	5	山田	2026/05/22	5ページ目は背表紙の意味です
	//カバー	4	佐藤	2026/05/23	カバーコピー確認
	//帯	4	佐藤	2026/05/22	帯文確認
	//付録	1	大塚	2026/05/24	付録面確認
//*
//*	記事一覧での記事データの各カラムの表示幅です（記事一覧ページで修正すると自動的に反映されます）
//記事一覧カラム幅	9	9	9	20	10.33	10.33	10.33	10.33	10.33	10.33
//*	また、記事名より後の項目は変更できます（たとえば「//記事項目設定	ページ数	記事名	内容」のみなど）
//*
//更新履歴	2026/05/02 15:41:20	遠藤	サンプルデータを修正しました。
//*
//*	このデータはAutoDaiwarer用です。
`;
const DEFAULT_TEXT_EN = `//filename	sample_daiwari
//title	Sample Book
//version	0.1
//writer	Yamada
//planned	2026/06/01
//submission-date	2026/05/04	2 days left
//circulation	First 500	Order on time
//distribution-event	Bunfree 42	2026/05/04	Table memo
//print-shop	Dainippon Printing
//体裁
	//trim-size	A4 custom portrait
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
			//small	2	Spread 2	Otsuka	2026/05/02	Double-click a row to add a comment
	//large	6	Experiment Corner	Yamada
		//middle	2	Tryout	Yamada	2026/05/03	First draft received
		//middle	1	Mini Columns	Yamada	2026/05/03	Fractional page sample
			//small	0.3	Column A (first part)	Yamada	2026/05/03	Ends partway through one page
			//small	0.7	Column B (later part)	Sato	2026/05/04	Starts from the remaining area of the same page
	//*
	//hold	2	Replacement Candidate	Yamada	2026/05/21	Article not yet assigned to the flatplan.
	//hold	4	Additional Article	Sato	2026/05/30	Another article not yet assigned to the flatplan.
	//*
	//insert	2	4	Foldout Map	Tanaka	2026/05/20	Before ordering
	//*
//表紙まわり
	//hyoshi	5	Yamada	2026/05/22	Page 5 is the case spine
	//cover	4	Sato	2026/05/23	Check cover copy
	//obi	4	Sato	2026/05/22	Check obi copy
	//appendix	1	Otsuka	2026/05/24	Check appendix page
//*
//*	Column widths for article metadata in the article list. Editing widths on the article list page reflects this automatically.
//article-list-widths	9	9	9	20	10.33	10.33	10.33	10.33	10.33	10.33
//*	Fields after Article can be customized, for example: //article-fields	Pages	Article	Content
//*
//changelog	2026/05/02 15:41:20	Endo	Updated sample data.
//*
//*	This data is for AutoDaiwarer.
//*
`;

const LEVELS = { 大: "large", 中: "middle", 小: "small", large: "large", middle: "middle", small: "small" };
const CLASS_BY_LEVEL = { large: "seg-large", middle: "seg-middle", small: "seg-small" };
const SEARCH_PARAMS = new URLSearchParams(window.location.search);
const LOCALE = SEARCH_PARAMS.get("mode") === "en" ? "en" : "ja";
const SHARE_ID = (SEARCH_PARAMS.get("share") || "").trim();
const SYNC_ENDPOINT = (SEARCH_PARAMS.get("syncEndpoint") || "").trim();
const REMOTE_SYNC_ENABLED = SHARE_ID.length > 0 && SYNC_ENDPOINT.length > 0;
const REMOTE_SAVE_INTERVAL_MS = 3000;
const REMOTE_POLL_INTERVAL_MS = 5000;
// GAS + Drive は遅いことがある。短すぎると応答前に abort → 版ずれ競合の誤検知になる。
const REMOTE_SYNC_TIMEOUT_MS = 20000;
const BUG_REPORT_MAX_MESSAGE_LENGTH = 2000;
const BUG_REPORT_CLIENT_ID_KEY = "autodaiwarer.bug-report.client-id";
const BUG_REPORT_EMAIL_KEY = "autodaiwarer.bug-report.email";
const BUG_REPORT_MIN_INTERVAL_MS = 15000;
const BUG_REPORT_DUPLICATE_WINDOW_MS = 10 * 60 * 1000;
const BANNER_ROTATE_MS = 8000;
const BANNER_FADE_MS = 260;
const BANNER_SP_MEDIA = "(max-width: 640px)";
const SITE_GATE_ENDPOINT = "/api/session";
const CUSTOM_GPT_URL_STORAGE_KEY_LEGACY = "autodaiwarer.customGptUrl";
const CUSTOM_GPT_URL_STORAGE_KEY_JA = "autodaiwarer.customGptUrl.ja";
const CUSTOM_GPT_URL_STORAGE_KEY_EN = "autodaiwarer.customGptUrl.en";
/** 組み込み既定（本番は CUSTOM_GPT_URL_JA / CUSTOM_GPT_URL_EN で上書き可） */
const DEFAULT_CUSTOM_GPT_URL_JA =
  "https://chatgpt.com/g/g-6a1eef1b1a048191ba1f9b3df4d1617a-mottoautodaiwarer";
const DEFAULT_CUSTOM_GPT_URL_EN =
  "https://chatgpt.com/g/g-6a1ef9475b8c8191932c36ac959110ae-mottoautodaiwarer-en";
const AI_DRAFT_MEMO_STORAGE_KEY = "autodaiwarer.aiDraftMemo";
const AI_DRAFT_INCLUDE_FLATPLAN_KEY = "autodaiwarer.aiDraftIncludeFlatplan";
const sessionGateState = {
  customGptUrlJa: "",
  customGptUrlEn: "",
};
const INITIAL_DATA_ENDPOINT = "/api/initial-data";
const SITE_GATE_TIMEOUT_MS = 5000;
const INITIAL_DATA_TIMEOUT_MS = 20000;
// 画像は ./assets/banners/ 配下などに置き、pc/sp に相対パスを指定してください。
// 0件の場合は index.html の既存テキスト（広告募集 / 連絡先）をそのまま表示します。
const BANNER_ITEMS = [
  {
    pc: "./assets/banners/banner1-pc-1920x160.webp",
  //  sp: "./assets/banners/banner1-sp-640x100.webp",
    href: "https://x.com/hortense667",
    alt: "AutoDaiwarer banner 1",
  },
  {
    pc: "./assets/banners/banner2-pc-1920x160.webp",
  //   sp: "./assets/banners/banner2-sp-640x100.webp",
    href: "https://heterogeneous.booth.pm/",
    alt: "AutoDaiwarer banner 2",
  },
];
const LOCAL_KEY_BASE = "autodaiwarer.text";
const DOC_SLOT_PARAM_RAW = (SEARCH_PARAMS.get("doc") || "").trim();
const TAB_DOC_SLOT_SESSION_KEY_BASE = "autodaiwarer.doc-slot";
const LOCAL_KEY = resolveLocalTextStorageKey();
const SHARE_BACKUP_KEY_BASE = "autodaiwarer.share-backups";
const SYNC_INTRO_SHOWN_KEY_BASE = "autodaiwarer.sync.intro-shown";
const BOARD_WIDTH_KEY = "autodaiwarer.board-width-ratio";
const BOARD_WIDTH_MIN_RATIO = 0.45;
const BOARD_WIDTH_MAX_RATIO = 1;
const SEARCH_HIT_CLASS = "search-hit";
const EDITOR_WRAP_KEY = "autodaiwarer.editor-wrap";
const EDITOR_ASSIST_KEY = "autodaiwarer.editor-assist";
const DEFAULT_ARTICLE_FIELD_LABELS_JA = ["ページ数", "記事名", "デスク", "編集担当", "筆者", "締め切り", "ステータス", "メモ"];
const DEFAULT_ARTICLE_FIELD_LABELS_EN = ["Pages", "Article", "Desk", "Editor", "Writer", "Deadline", "Status", "Memo"];
const ARTICLE_COL_MIN_WIDTH_PCT = 4;
const LEVEL_LIKE_HEADS = new Set(["小", "中", "大", "保留", "small", "middle", "large", "hold"]);
const ARTICLE_LIKE_ASSIST_CANONS = new Set(["large", "middle", "small", "hold", "betcho", "hyoshi", "obi", "cover", "appendix"]);
const DATE_PICKER_CLICK_ASSIST_CANONS = new Set(["large", "middle", "small", "hold", "hyoshi", "obi", "cover", "appendix"]);
const IMPOSITION_KEYWORD_ALL = new Set(["すべて", "全て", "all", "ALL"]);
const IMPOSITION_PDFJS_SRC = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
const IMPOSITION_PDFJS_WORKER_SRC = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
const IMPOSITION_PPTXGENJS_SRC = "https://cdn.jsdelivr.net/npm/pptxgenjs@3.12.0/dist/pptxgen.bundle.js";
const IMPOSITION_JSZIP_SRC = "https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js";
const IMPOSITION_PDFLIB_SRC = "https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js";
const IMPOSITION_PRINT_PDF_DPI = 150;
const IMPOSITION_MM_TO_PT = 72 / 25.4;
const ROUGH_PPTX_MANIFEST_PATH = "autodaiwarer/manifest.json";
const PPTX_EMU_PER_INCH = 914400;
const ROUGH_PDF_RENDER_DPI = 150;
const ROUGH_PDF_MARGIN_SIDE_MM = 15;
const ROUGH_PDF_MARGIN_TOP_MM = 22;
const ROUGH_PDF_MARGIN_BOTTOM_MM = 22;
const ROUGH_PDF_HEADER_BAND_MM = 12;
const ROUGH_PDF_FOOTER_BAND_MM = 12;
const ROUGH_PDF_HEADER_FONT_MM = 7.2;
const ROUGH_PDF_FOOTER_FONT_MM = 7.8;
const IMPOSITION_MAPS_BY_OPENING = {
  right: {
    // 右開き（縦組み）基準。
    front: [[1, 16, 13, 4], [8, 9, 12, 5]],
    back: [[7, 10, 11, 6], [2, 15, 14, 3]],
  },
  left: {
    // 左開きは右開き配置の左右反転。
    front: [[4, 13, 16, 1], [5, 12, 9, 8]],
    back: [[6, 11, 10, 7], [3, 14, 15, 2]],
  },
};
// 16面付け・横判（ユーザー手描き確定）。4×2・奇数行天地逆。
// 追折り2回のあと、最終折りで 16|1（左開き）が背になる。
// 裏面は表と短辺とじ（上下反転）で裏打ち対応。
const IMPOSITION_MAPS_16_HORIZONTAL_BY_OPENING = {
  left: {
    // 表: 16 1 / 13 4(逆) / 12 5 / 9 8(逆)
    front: [[16, 1], [13, 4], [12, 5], [9, 8]],
    // 裏: 10 7 / 11 6(逆) / 14 3 / 15 2(逆)
    back: [[10, 7], [11, 6], [14, 3], [15, 2]],
  },
  right: {
    // 左開きの左右反転
    front: [[1, 16], [4, 13], [5, 12], [8, 9]],
    back: [[7, 10], [6, 11], [3, 14], [2, 15]],
  },
};
const IMPOSITION_MAPS_8_BY_OPENING = {
  right: {
    // 添付指定の8ページ割り付け（右開き基準）。
    // 表: 4 5 8 1（上段）
    // 裏: 3 6 7 2（下段・天地逆）
    front: [[4, 5, 8, 1], [null, null, null, null]],
    back: [[null, null, null, null], [3, 6, 7, 2]],
  },
  left: {
    // 左開きは右開き配置の左右反転。
    front: [[1, 8, 5, 4], [null, null, null, null]],
    back: [[null, null, null, null], [2, 7, 6, 3]],
  },
};
const IMPOSITION_8UP_SIGNATURE_MAP_BY_OPENING = {
  left: {
    // ユーザー提示の並び（左開き）
    // 表: 8 1 / 5 4
    // 裏: 2 7 / 3 6
    front: [[8, 1], [5, 4]],
    back: [[2, 7], [3, 6]],
  },
  right: {
    // 8面付け・右開き（表は従来どおり、裏＝偶数面は手書き指定：上 7・2、下 6・3 天地逆）
    front: [[1, 8], [4, 5]],
    back: [[7, 2], [6, 3]],
  },
};
// 8面付け・右開き・横判（ユーザー確定）
const IMPOSITION_8UP_SIGNATURE_MAP_RIGHT_HORIZONTAL = {
  front: [[1, 4], [8, 5]],
  back: [[7, 6], [2, 3]],
};
// 8面付け・左開き・横判（ユーザー指定）
const IMPOSITION_8UP_SIGNATURE_MAP_LEFT_HORIZONTAL = {
  front: [[4, 1], [5, 8]],
  back: [[2, 3], [7, 6]],
};
// 8P折本（ワンシートZINE / マジック折）用の固定配置（縦判のみ）。
// 8ページ超は 16ページ単位でこの並びを継続する。
const IMPOSITION_8P_BOOKLET_MAP_BY_OPENING = {
  right: {
    // ユーザー指定（右開き）
    // 表: 1 8 7 6 / 2 3 4 5
    // 裏: 9 16 15 14 / 10 11 12 13
    front: [[1, 8, 7, 6], [2, 3, 4, 5]],
    back: [[9, 16, 15, 14], [10, 11, 12, 13]],
  },
  left: {
    // ユーザー指定（左開き）
    // 表: 6 7 8 1 / 5 4 3 2
    // 裏: 14 15 16 9 / 13 12 11 10
    front: [[6, 7, 8, 1], [5, 4, 3, 2]],
    back: [[14, 15, 16, 9], [13, 12, 11, 10]],
  },
};
const LINE_HEAD_CANDIDATES_JA = [
  "小\t", "中\t", "大\t", "台\t", "別丁\t", "表紙\t", "帯\t", "カバー\t", "付録\t", "シェアID\t", "同期URL\t", "台割ファイル名\t", "書名\t", "判型\t", "開き\t", "ページ数\t", "刊行予定\t", "版\t", "記入者\t", "開始ページ番号\t", "本文ノンブル開始位置\t", "記事項目設定\t", "目次項目設定\t", "保留\t", "更新履歴\t", "コメント\t", "印刷所\t", "刷数\t", "頒布イベント\t", "スタッフ\t", "入稿日\t", "面付け印刷\t", "*",
];
const LINE_HEAD_CANDIDATES_EN = [
  "small\t", "middle\t", "large\t", "board\t", "insert\t", "hyoshi\t", "obi\t", "cover\t", "appendix\t", "share-id\t", "sync-endpoint\t", "filename\t", "title\t", "trim-size\t", "opening\t", "pages\t", "planned\t", "version\t", "writer\t", "start-page\t", "body-folio-start\t", "article-fields\t", "toc-article-fields\t", "hold\t", "changelog\t", "note\t", "print-shop\t", "circulation\t", "distribution-event\t", "staff\t", "submission-date\t", "imposition-print\t", "*",
];
const LINE_HEAD_CANDIDATES = LOCALE === "en" ? LINE_HEAD_CANDIDATES_EN : LINE_HEAD_CANDIDATES_JA;

function normalizeStorageKeyPart(value, fallback = "default") {
  const normalized = String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
  return normalized || fallback;
}

function getTabScopedDocSlot() {
  const sessionKey = `${TAB_DOC_SLOT_SESSION_KEY_BASE}.${LOCALE}`;
  try {
    const current = String(window.sessionStorage.getItem(sessionKey) || "").trim();
    if (current) return current;
    const randomPart = Math.random().toString(36).slice(2, 10);
    const created = `tab-${Date.now().toString(36)}-${randomPart}`;
    window.sessionStorage.setItem(sessionKey, created);
    return created;
  }
  catch (_e) {
    return `tab-fallback-${Date.now().toString(36)}`;
  }
}

function resolveLocalTextStorageKey() {
  const localeKey = `${LOCAL_KEY_BASE}.${LOCALE}`;
  if (SHARE_ID) {
    return `${localeKey}.share.${normalizeStorageKeyPart(SHARE_ID)}`;
  }
  if (DOC_SLOT_PARAM_RAW) {
    return `${localeKey}.doc.${normalizeStorageKeyPart(DOC_SLOT_PARAM_RAW)}`;
  }
  return `${localeKey}.${getTabScopedDocSlot()}`;
}

const KEYWORD_TO_CANON = {
  "小": "small",
  "中": "middle",
  "大": "large",
  small: "small",
  middle: "middle",
  large: "large",
  "台": "board",
  board: "board",
  "別丁": "betcho",
  insert: "betcho",
  "帯": "obi",
  obi: "obi",
  band: "obi",
  "カバー": "cover",
  cover: "cover",
  表紙: "hyoshi",
  hyoshi: "hyoshi",
  "front-matter": "hyoshi",
  "付録": "appendix",
  appendix: "appendix",
  "台割ファイル名": "filename",
  filename: "filename",
  "書名": "title",
  title: "title",
  "判型": "trim-size",
  "trim-size": "trim-size",
  trimsize: "trim-size",
  "開き": "opening",
  opening: "opening",
  "ページ数": "pages",
  pages: "pages",
  "刊行予定": "planned",
  planned: "planned",
  "版": "version",
  version: "version",
  "記入者": "writer",
  writer: "writer",
  "開始ページ番号": "start-page",
  "start-page": "start-page",
  startpage: "start-page",
  "本文ノンブル開始位置": "body-folio-start",
  "body-folio-start": "body-folio-start",
  bodyfoliostart: "body-folio-start",
  "記事項目設定": "article-fields",
  "目次項目設定": "toc-article-fields",
  "toc-article-fields": "toc-article-fields",
  "toc-fields": "toc-article-fields",
  tocarticlefields: "toc-article-fields",
  "article-fields": "article-fields",
  articlefields: "article-fields",
  "記事一覧カラム幅": "article-list-widths",
  "article-list-widths": "article-list-widths",
  articlelistwidths: "article-list-widths",
  "面付け印刷": "imposition-print",
  "imposition-print": "imposition-print",
  impositionprint: "imposition-print",
  "保留": "hold",
  hold: "hold",
  更新履歴: "revision-log",
  "revision-log": "revision-log",
  changelog: "revision-log",
  コメント: "inline-note",
  "inline-note": "inline-note",
  note: "inline-note",
  印刷所: "print-shop",
  "print-shop": "print-shop",
  刷数: "circulation",
  circulation: "circulation",
  頒布イベント: "distribution-event",
  "distribution-event": "distribution-event",
  スタッフ: "staff-line",
  "staff-line": "staff-line",
  staff: "staff-line",
  入稿日: "submission-date",
  "submission-date": "submission-date",
  "シェアID": "share-id",
  "シェアid": "share-id",
  "share-id": "share-id",
  shareid: "share-id",
  "同期URL": "sync-endpoint",
  "同期エンドポイント": "sync-endpoint",
  "sync-endpoint": "sync-endpoint",
  syncendpoint: "sync-endpoint",
};
const CANON_TO_HEAD = {
  ja: {
    small: "小",
    middle: "中",
    large: "大",
    board: "台",
    betcho: "別丁",
    obi: "帯",
    cover: "カバー",
    hyoshi: "表紙",
    appendix: "付録",
    filename: "台割ファイル名",
    title: "書名",
    "trim-size": "判型",
    opening: "開き",
    pages: "ページ数",
    planned: "刊行予定",
    version: "版",
    writer: "記入者",
    "start-page": "開始ページ番号",
    "body-folio-start": "本文ノンブル開始位置",
    "article-fields": "記事項目設定",
    "toc-article-fields": "目次項目設定",
    "article-list-widths": "記事一覧カラム幅",
    "imposition-print": "面付け印刷",
    hold: "保留",
    "revision-log": "更新履歴",
    "inline-note": "コメント",
    "print-shop": "印刷所",
    circulation: "刷数",
    "distribution-event": "頒布イベント",
    "staff-line": "スタッフ",
    "submission-date": "入稿日",
    "share-id": "シェアID",
    "sync-endpoint": "同期URL",
  },
  en: {
    small: "small",
    middle: "middle",
    large: "large",
    board: "board",
    betcho: "insert",
    obi: "obi",
    cover: "cover",
    hyoshi: "hyoshi",
    appendix: "appendix",
    filename: "filename",
    title: "title",
    "trim-size": "trim-size",
    opening: "opening",
    pages: "pages",
    planned: "planned",
    version: "version",
    writer: "writer",
    "start-page": "start-page",
    "body-folio-start": "body-folio-start",
    "article-fields": "article-fields",
    "toc-article-fields": "toc-article-fields",
    "article-list-widths": "article-list-widths",
    "imposition-print": "imposition-print",
    hold: "hold",
    "revision-log": "changelog",
    "inline-note": "note",
    "print-shop": "print-shop",
    circulation: "circulation",
    "distribution-event": "distribution-event",
    "staff-line": "staff",
    "submission-date": "submission-date",
    "share-id": "share-id",
    "sync-endpoint": "sync-endpoint",
  },
};
const ADDON_SPECS = {
  hyoshi: { pages: 4, labelJa: "表紙", labelEn: "Cover" },
  obi: { pages: 4, labelJa: "帯", labelEn: "Obi" },
  cover: { pages: 4, labelJa: "カバー", labelEn: "Dust jacket" },
  appendix: { pages: 1, labelJa: "付録", labelEn: "Appendix" },
};
const EDITOR_SAMPLE_TEXT = DEFAULT_TEXT;
const EDITOR_SAMPLE_TEXT_EN = DEFAULT_TEXT_EN;

const state = {
  meta: {},
  articleFieldLabels: [],
  /** null = 目次専用ラベル未指定（表紙等は記事項目設定に追随） */
  tocArticleFieldLabels: null,
  articleListColumnWidths: [],
  entries: [],
  holdEntries: [],
  addonEntries: [],
  betchoes: [],
  boardDirectives: [],
  commentLines: [],
  holdLines: [],
  rawText: "",
  textDirty: false,
  selectedId: null,
  editorSnapshotText: "",
  articleListSnapshotText: "",
  articleListCascade: true,
  syncStatusText: "",
  impositionOptions: {
    targetText: "",
    showPageLabel: true,
    mapFoldText: "",
    pdfScalePercent: 100,
    use8up: false,
    use8pBooklet: false,
    saddleStitch: false,
  },
  impositionPdf: {
    fileName: "",
    pageCount: 0,
    doc: null,
    orientation: "",
    imageByPageIndex: new Map(),
    spreadMode: false,
  },
};

const remoteSyncState = {
  enabled: REMOTE_SYNC_ENABLED,
  shareId: SHARE_ID,
  endpoint: SYNC_ENDPOINT,
  clientId: buildSyncClientId(),
  knownVersion: 0,
  appliedVersion: 0,
  lastSavedText: "",
  pollingTimer: 0,
  savingTimer: 0,
  isPolling: false,
  isSaving: false,
  clearSyncConfirmed: false,
};

const bugReportState = {
  endpoint: "",
  clientId: buildBugReportClientId(),
  isSubmitting: false,
  lastSubmittedAt: 0,
  lastSubmittedSignature: "",
};

const editorAssistState = {
  sessionActive: false,
  sessionLineStart: -1,
  sessionContentStart: -1,
  active: false,
  type: "",
  candidates: [],
  index: 0,
  numericValue: 1,
  boardNumberMin: 1,
  replaceStart: 0,
  replaceEnd: 0,
  appendSpace: false,
  memoryKey: "",
  suppressNextClickRefresh: false,
  recentValueByKey: new Map(),
};

const articleListEditState = {
  active: false,
  cell: null,
  table: null,
};

const bannerState = {
  fallbackHtml: "",
  items: [],
  index: 0,
  timerId: 0,
  rotatorEl: null,
  linkEl: null,
  sourceSpEl: null,
  imgEl: null,
};

const els = {
  main: document.querySelector("main"),
  bannerArea: document.querySelector("#bannerArea"),
  boards: document.querySelector("#boards"),
  metaInfo: document.querySelector("#metaInfo"),
  printMeta: document.querySelector("#printMeta"),
  tooltip: document.querySelector("#tooltip"),
  printArticleSheet: document.querySelector("#printArticleSheet"),
  printImpositionSheet: document.querySelector("#printImpositionSheet"),
  editorDialog: document.querySelector("#editorDialog"),
  editorText: document.querySelector("#editorText"),
  editorSyncNotice: document.querySelector("#editorSyncNotice"),
  articleDialog: document.querySelector("#articleDialog"),
  articleListContainer: document.querySelector("#articleListContainer"),
  helpDialog: document.querySelector("#helpDialog"),
  bugReportDialog: document.querySelector("#bugReportDialog"),
  bugReportEmail: document.querySelector("#bugReportEmail"),
  bugReportMessage: document.querySelector("#bugReportMessage"),
  bugReportCounter: document.querySelector("#bugReportCounter"),
  englishModeToggle: document.querySelector("#englishModeToggle"),
  fileLoader: document.querySelector("#fileLoader"),
  pickFileBtn: document.querySelector("#pickFileBtn"),
  fileSaveBtn: document.querySelector("#fileSaveBtn"),
  editorCandidate: document.querySelector("#editorCandidate"),
  editorWrapToggle: document.querySelector("#editorWrapToggle"),
  editorAssistToggle: document.querySelector("#editorAssistToggle"),
  impositionDialog: document.querySelector("#impositionDialog"),
  impositionBoardInput: document.querySelector("#impositionBoardInput"),
  impositionShowPageLabel: document.querySelector("#impositionShowPageLabel"),
  impositionUse8up: document.querySelector("#impositionUse8up"),
  impositionMapFoldInput: document.querySelector("#impositionMapFoldInput"),
  impositionUse8pBooklet: document.querySelector("#impositionUse8pBooklet"),
  impositionSaddleStitch: document.querySelector("#impositionSaddleStitch"),
  impositionExportSpreadPptxBtn: document.querySelector("#impositionExportSpreadPptxBtn"),
  impositionUpdateSpreadPptxBtn: document.querySelector("#impositionUpdateSpreadPptxBtn"),
  impositionPptxDialog: document.querySelector("#impositionPptxDialog"),
  impositionPptxSinglePage: document.querySelector("#impositionPptxSinglePage"),
  impositionPptxHideLabels: document.querySelector("#impositionPptxHideLabels"),
  impositionPptxDialogCancelBtn: document.querySelector("#impositionPptxDialogCancelBtn"),
  impositionPptxDialogRunBtn: document.querySelector("#impositionPptxDialogRunBtn"),
  impositionProcessingOverlay: document.querySelector("#impositionProcessingOverlay"),
  impositionProcessingMessage: document.querySelector("#impositionProcessingMessage"),
  impositionPdfLoader: document.querySelector("#impositionPdfLoader"),
  impositionLoadPdfBtn: document.querySelector("#impositionLoadPdfBtn"),
  impositionLoadSpreadPdfBtn: document.querySelector("#impositionLoadSpreadPdfBtn"),
  impositionPdfName: document.querySelector("#impositionPdfName"),
  impositionPdfScalePercent: document.querySelector("#impositionPdfScalePercent"),
  impositionPrintPaperSize: document.querySelector("#impositionPrintPaperSize"),
  impositionPrintDriverNotice: document.querySelector("#impositionPrintDriverNotice"),
  impositionFrontColXMM: document.querySelector("#impositionFrontColXMM"),
  impositionFrontRowYMM: document.querySelector("#impositionFrontRowYMM"),
  impositionBackColXMM: document.querySelector("#impositionBackColXMM"),
  impositionBackRowYMM: document.querySelector("#impositionBackRowYMM"),
  impositionResetLayoutBtn: document.querySelector("#impositionResetLayoutBtn"),
  impositionApplyMarginBtn: document.querySelector("#impositionApplyMarginBtn"),
  impositionPreview: document.querySelector("#impositionPreview"),
  impositionError: document.querySelector("#impositionError"),
  impositionWarning: document.querySelector("#impositionWarning"),
  impositionSaveParamsBtn: document.querySelector("#impositionSaveParamsBtn"),
  editorSearchInput: document.querySelector("#editorSearchInput"),
  searchNextBtn: document.querySelector("#searchNextBtn"),
  searchPrevBtn: document.querySelector("#searchPrevBtn"),
  insertSampleBtn: document.querySelector("#insertSampleBtn"),
  restoreBackupBtn: document.querySelector("#restoreBackupBtn"),
  closeEditorBtn: document.querySelector("#closeEditorBtn"),
  recalcPagesBtn: document.querySelector("#recalcPagesBtn"),
  boardWidthHandle: document.querySelector("#boardWidthHandle"),
  tocDraftDialog: document.querySelector("#tocDraftDialog"),
  tocDraftDepth: document.querySelector("#tocDraftDepth"),
  tocDraftStyle: document.querySelector("#tocDraftStyle"),
  tocDraftIncludeTitle: document.querySelector("#tocDraftIncludeTitle"),
  tocDraftPreview: document.querySelector("#tocDraftPreview"),
  aiDraftDialog: document.querySelector("#aiDraftDialog"),
  aiDraftGptUrl: document.querySelector("#aiDraftGptUrl"),
  aiDraftSaveUrlBtn: document.querySelector("#aiDraftSaveUrlBtn"),
  aiDraftMemo: document.querySelector("#aiDraftMemo"),
  aiDraftIncludeFlatplan: document.querySelector("#aiDraftIncludeFlatplan"),
  aiDraftLaunchBtn: document.querySelector("#aiDraftLaunchBtn"),
  aiDraftImportPreview: document.querySelector("#aiDraftImportPreview"),
  aiDraftApplyBtn: document.querySelector("#aiDraftApplyBtn"),
  aiDraftCloseBtn: document.querySelector("#aiDraftCloseBtn"),
  dwmlLintDialog: document.querySelector("#dwmlLintDialog"),
  dwmlLintSummary: document.querySelector("#dwmlLintSummary"),
  dwmlLintList: document.querySelector("#dwmlLintList"),
  dwmlLintJumpBtn: document.querySelector("#dwmlLintJumpBtn"),
  dwmlLintProceedBtn: document.querySelector("#dwmlLintProceedBtn"),
  dwmlLintCloseBtn: document.querySelector("#dwmlLintCloseBtn"),
  editorLintMirror: document.querySelector("#editorLintMirror"),
  editorSampleGhost: document.querySelector("#editorSampleGhost"),
  editorSampleGhostHint: document.querySelector("#editorSampleGhostHint"),
  editorSampleAppliedNotice: document.querySelector("#editorSampleAppliedNotice"),
};

let impositionRenderSeq = 0;
let ensurePdfJsPromise = null;
let ensurePptxGenJsPromise = null;
let ensureJsZipPromise = null;
let ensurePdfLibPromise = null;
let impositionPdfLoadMode = "single";
let impositionProcessingDepth = 0;
const ROUGH_PPTX_DEFAULT_OPTIONS = Object.freeze({
  singlePage: false,
  hideLabels: false,
});

function isShareEditorMode() {
  return SHARE_ID.length > 0;
}

function getShareBackupStorageKey() {
  return `${SHARE_BACKUP_KEY_BASE}.${SHARE_ID}`;
}

function readShareBackups() {
  if (!isShareEditorMode()) return [];
  try {
    const raw = localStorage.getItem(getShareBackupStorageKey());
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item) => item && typeof item.text === "string");
  } catch (_error) {
    return [];
  }
}

function writeShareBackups(list) {
  if (!isShareEditorMode()) return;
  try {
    localStorage.setItem(getShareBackupStorageKey(), JSON.stringify(list.slice(0, 20)));
  } catch (_error) {}
}

function resolveBackupSource() {
  const editorText = typeof els.editorText?.value === "string" ? els.editorText.value : "";
  if (editorText.trim()) return editorText;
  if (typeof state.editorSnapshotText === "string" && state.editorSnapshotText.trim()) return state.editorSnapshotText;
  if (typeof state.rawText === "string") return state.rawText;
  return "";
}

function createShareBackup(reason, text) {
  if (!isShareEditorMode()) return false;
  const sourceText = typeof text === "string" ? text : resolveBackupSource();
  if (!sourceText.trim()) return false;
  const next = [{ ts: Date.now(), reason: reason || "manual", text: sourceText }, ...readShareBackups()];
  writeShareBackups(next);
  return true;
}

function formatBackupTimestamp(ts) {
  const date = new Date(Number(ts));
  if (Number.isNaN(date.getTime())) return String(ts || "");
  return date.toLocaleString(LOCALE === "en" ? "en-US" : "ja-JP");
}

init();

async function init() {
  void initBannerRotator();
  applyLocaleUI();
  applyBoardWidthFromStorage();
  const gate = await verifySiteAccess();
  if (!gate.ok) {
    renderSiteAccessBlocked(gate.message);
    return;
  }
  applySessionGateResult(gate);
  const driveText = await fetchInitialTextIfAny(gate.driveFileId);
  const stored = localStorage.getItem(LOCAL_KEY) || localStorage.getItem(LOCAL_KEY_BASE);
  const normalizedStored = typeof stored === "string" ? normalizeEditorDirectiveText(stored) : "";
  const normalizedLegacySampleJa = normalizeEditorDirectiveText(DEFAULT_TEXT);
  const normalizedLegacySampleEn = normalizeEditorDirectiveText(DEFAULT_TEXT_EN);
  const startupText =
    normalizedStored === normalizedLegacySampleJa || normalizedStored === normalizedLegacySampleEn
      ? ""
      : (stored || "");
  if (typeof driveText === "string" && driveText.trim().length > 0) {
    loadFromText(driveText);
  }
  else {
    loadFromText(startupText);
  }
  persistNormalizedStateTextToLocal();
  scrubBootstrapParamsFromBrowserUrl();
  bindUI();
  refreshAiDraftMemoPlaceholder();
  updateEditorSyncNotice();
  showRemoteSyncIntroOnce();
  void initRemoteSync();
}

function persistNormalizedStateTextToLocal() {
  const base = state.rawText || "";
  const normalized = normalizeEditorDirectiveText(base);
  state.rawText = normalized;
  state.textDirty = false;
  try {
    localStorage.setItem(LOCAL_KEY, normalized);
  }
  catch (_e) {}
  return normalized;
}

async function verifySiteAccess() {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), SITE_GATE_TIMEOUT_MS);
  const gateUrl = SITE_GATE_ENDPOINT + (window.location.search || "");
  try {
    const res = await fetch(gateUrl, {
      method: "GET",
      cache: "no-store",
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });
    if (!res.ok) {
      return {
        ok: false,
        message: LOCALE === "en"
          ? "Access check failed. Please open this app from the official site."
          : "アクセス確認に失敗しました。公式サイトから開いてください。",
      };
    }
    const data = await res.json();
    if (!data?.ok) {
      return {
        ok: false,
        message: LOCALE === "en"
          ? "Access denied. Please use the official site."
          : "アクセスが許可されていません。公式サイトから利用してください。",
      };
    }
    const uiTheme =
      typeof data.uiTheme === "string" ? data.uiTheme.trim() : "";
    const driveFileId =
      typeof data.driveFileId === "string" ? data.driveFileId.trim() : "";
    const bugReportEndpoint =
      typeof data.bugReportEndpoint === "string" ? data.bugReportEndpoint.trim() : "";
    const customGptUrlJa =
      typeof data.customGptUrlJa === "string"
        ? data.customGptUrlJa.trim()
        : typeof data.customGptUrl === "string"
          ? data.customGptUrl.trim()
          : "";
    const customGptUrlEn =
      typeof data.customGptUrlEn === "string" ? data.customGptUrlEn.trim() : "";
    return {
      ok: true,
      message: "",
      uiTheme: uiTheme || undefined,
      driveFileId: driveFileId || undefined,
      bugReportEndpoint: bugReportEndpoint || undefined,
      customGptUrlJa: customGptUrlJa || undefined,
      customGptUrlEn: customGptUrlEn || undefined,
    };
  }
  catch {
    return {
      ok: false,
      message: LOCALE === "en"
        ? "Server connection is required. Please use the official site."
        : "このアプリはサーバー接続が必要です。公式サイトから利用してください。",
    };
  }
  finally {
    window.clearTimeout(timeoutId);
  }
}

/** /api/session で返した uiTheme のみ適用する（mode 等の名前解釈は Worker 側） */
function applySessionGateResult(gate) {
  if (gate.uiTheme === "bunfuri2026") {
    document.documentElement.classList.add("theme-bunfuri2026");
  }
  if (!bugReportState.endpoint && typeof gate.bugReportEndpoint === "string") {
    bugReportState.endpoint = gate.bugReportEndpoint;
  }
  if (typeof gate.customGptUrlJa === "string" && gate.customGptUrlJa.trim()) {
    sessionGateState.customGptUrlJa = gate.customGptUrlJa.trim();
  }
  if (typeof gate.customGptUrlEn === "string" && gate.customGptUrlEn.trim()) {
    sessionGateState.customGptUrlEn = gate.customGptUrlEn.trim();
  }
}

async function fetchInitialTextIfAny(driveFileId) {
  if (!driveFileId) return null;
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), INITIAL_DATA_TIMEOUT_MS);
  try {
    const qp = new URLSearchParams({ fileId: driveFileId });
    const res = await fetch(`${INITIAL_DATA_ENDPOINT}?${qp.toString()}`, {
      method: "GET",
      cache: "no-store",
      signal: controller.signal,
    });
    if (!res.ok) return null;
    return await res.text();
  }
  catch {
    return null;
  }
  finally {
    window.clearTimeout(timeoutId);
  }
}

/**
 * アドレスバーからのみブート用クエリを外す（初回評価は既に済んでいる）。
 * 「data」の意味はソースに載せず、応答フィールドだけ参照する構成にできる。
 */
function scrubBootstrapParamsFromBrowserUrl() {
  let q;
  try {
    q = new URL(window.location.href);
  }
  catch {
    return;
  }
  let changed = false;
  const modeParam = String(q.searchParams.get("mode") || "").trim().toLowerCase();
  if (modeParam && modeParam !== "en") {
    q.searchParams.delete("mode");
    changed = true;
  }
  if (!changed) return;
  try {
    const next = `${q.pathname}${q.search}${q.hash}`;
    window.history.replaceState({}, "", next);
  }
  catch (_e) {}
}

function renderSiteAccessBlocked(message) {
  const safeMessage = escapeHtml(message || "");
  if (els.metaInfo) els.metaInfo.textContent = "";
  if (els.boards) {
    els.boards.innerHTML = `
      <section class="site-access-notice">
        <h2>${LOCALE === "en" ? "Access Required" : "アクセス制限"}</h2>
        <p>${safeMessage}</p>
      </section>
    `;
  }
  document.querySelectorAll("button, input, textarea, select").forEach((el) => {
    el.disabled = true;
  });
}

async function initBannerRotator() {
  if (!els.bannerArea) return;
  bannerState.fallbackHtml = els.bannerArea.innerHTML;
  const configured = normalizeBannerItems(BANNER_ITEMS);
  if (configured.length === 0) {
    restoreBannerFallback();
    return;
  }
  const available = await pickLoadableBanners(configured);
  if (available.length === 0) {
    restoreBannerFallback();
    return;
  }
  mountBannerRotator(available);
}

function normalizeBannerItems(items) {
  return (items || [])
    .map((item) => {
      const pc = String(item?.pc || item?.srcPc || item?.src || "").trim();
      const sp = String(item?.sp || item?.srcSp || item?.src || pc).trim();
      if (!pc && !sp) return null;
      const href = String(item?.href || "").trim() || pc || sp;
      const alt = String(item?.alt || "").trim() || "banner";
      return { pc, sp, href, alt };
    })
    .filter(Boolean);
}

async function pickLoadableBanners(items) {
  const checks = items.map((item) =>
    Promise.all([
      canLoadImage(item.pc),
      item.sp && item.sp !== item.pc ? canLoadImage(item.sp) : Promise.resolve(Boolean(item.pc)),
    ]).then(([pcOk, spOk]) => {
      const pc = pcOk ? item.pc : (spOk ? item.sp : "");
      const sp = spOk ? item.sp : pc;
      if (!pc) return null;
      return { ...item, pc, sp };
    })
  );
  const loaded = await Promise.all(checks);
  return loaded.filter(Boolean);
}

function canLoadImage(src) {
  if (!src) return Promise.resolve(false);
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });
}

function restoreBannerFallback() {
  stopBannerTimer();
  if (!els.bannerArea) return;
  if (bannerState.fallbackHtml) els.bannerArea.innerHTML = bannerState.fallbackHtml;
  bannerState.items = [];
  bannerState.index = 0;
  bannerState.rotatorEl = null;
  bannerState.linkEl = null;
  bannerState.sourceSpEl = null;
  bannerState.imgEl = null;
}

function mountBannerRotator(items) {
  if (!els.bannerArea || items.length === 0) return;
  stopBannerTimer();
  bannerState.items = items;
  bannerState.index = 0;
  els.bannerArea.innerHTML = `
    <div class="banner-rotator">
      <a class="banner-link" target="_blank" rel="noopener noreferrer">
        <picture class="banner-picture">
          <source class="banner-source-sp" media="${BANNER_SP_MEDIA}" />
          <img class="banner-image" loading="lazy" decoding="async" />
        </picture>
      </a>
    </div>
  `;
  bannerState.rotatorEl = els.bannerArea.querySelector(".banner-rotator");
  bannerState.linkEl = els.bannerArea.querySelector(".banner-link");
  bannerState.sourceSpEl = els.bannerArea.querySelector(".banner-source-sp");
  bannerState.imgEl = els.bannerArea.querySelector(".banner-image");
  applyBannerFrame(0, true);
  if (items.length > 1) {
    startBannerTimer();
    bannerState.rotatorEl?.addEventListener("mouseenter", stopBannerTimer);
    bannerState.rotatorEl?.addEventListener("mouseleave", startBannerTimer);
    document.addEventListener("visibilitychange", onBannerVisibilityChange);
  }
}

function onBannerVisibilityChange() {
  if (document.hidden) {
    stopBannerTimer();
  }
  else if (bannerState.items.length > 1) {
    startBannerTimer();
  }
}

function applyBannerFrame(nextIndex, immediate = false) {
  if (!bannerState.linkEl || !bannerState.imgEl || bannerState.items.length === 0) return;
  const safeIndex = ((nextIndex % bannerState.items.length) + bannerState.items.length) % bannerState.items.length;
  bannerState.index = safeIndex;
  const next = bannerState.items[safeIndex];
  bannerState.linkEl.href = next.href;
  if (bannerState.sourceSpEl) bannerState.sourceSpEl.srcset = next.sp || next.pc;
  bannerState.imgEl.alt = next.alt;
  if (immediate) {
    bannerState.imgEl.src = next.pc;
    bannerState.imgEl.classList.add("is-ready");
    return;
  }
  bannerState.imgEl.classList.remove("is-ready");
  window.setTimeout(() => {
    if (!bannerState.imgEl) return;
    if (bannerState.sourceSpEl) bannerState.sourceSpEl.srcset = next.sp || next.pc;
    bannerState.imgEl.src = next.pc;
    bannerState.imgEl.classList.add("is-ready");
  }, Math.max(50, BANNER_FADE_MS));
}

function startBannerTimer() {
  if (bannerState.items.length <= 1 || bannerState.timerId) return;
  bannerState.timerId = window.setInterval(() => {
    applyBannerFrame(bannerState.index + 1, false);
  }, Math.max(2000, BANNER_ROTATE_MS));
}

function stopBannerTimer() {
  if (!bannerState.timerId) return;
  window.clearInterval(bannerState.timerId);
  bannerState.timerId = 0;
}

function canonHead(raw) {
  return KEYWORD_TO_CANON[String(raw || "").trim().toLowerCase()] || "";
}

function headByCanon(canon) {
  return CANON_TO_HEAD[LOCALE]?.[canon] || CANON_TO_HEAD.ja[canon] || canon;
}

const REVISION_LOG_BODY_MAX = 256;
const INLINE_NOTE_BODY_MAX = 1000;
const URL_IN_TEXT_RE = /(https?:\/\/[^\s<[\](){}]+[^\s<.,:;")\]'}`]*)/g;

function formatTimestampForLog(d = new Date()) {
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}/${p(d.getMonth() + 1)}/${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}

function formatRevisionLogLine(ts, author, body) {
  const b = [...String(body || "")].slice(0, REVISION_LOG_BODY_MAX).join("").trim();
  const t = String(ts || "").trim();
  const a = String(author || "").trim() || "-";
  return `//${headByCanon("revision-log")}\t${t}\t${a}\t${b}`;
}

function insertRevisionLogBeforeFooter(text, revisionLine) {
  const src = String(text || "");
  const line = String(revisionLine || "").trim();
  if (!line) return src;
  const lines = src.split(/\r?\n/);
  const footerLabel = "//*\tこのデータはAutoDaiwarer用です。";
  const footerIdx = lines.findIndex((ln) => String(ln || "").trim() === footerLabel);
  let insertIdx = lines.length;
  if (footerIdx >= 0) {
    const hasStarLine = footerIdx > 0 && String(lines[footerIdx - 1] || "").trim() === "//*";
    insertIdx = hasStarLine ? footerIdx - 1 : footerIdx;
  }
  lines.splice(Math.max(0, insertIdx), 0, line);
  return lines.join("\n");
}

function formatInlineNoteLine(ts, author, body) {
  const b = [...String(body || "")].slice(0, INLINE_NOTE_BODY_MAX).join("").trim();
  const t = String(ts || "").trim();
  const a = String(author || "").trim() || "-";
  return `//${headByCanon("inline-note")}\t${t}\t${a}\t${b}`;
}

function humanizeDirectiveLineForTooltip(raw) {
  const line = String(raw || "").trimStart();
  if (!line.startsWith("//")) return raw;
  const body = line.slice(2).trimStart();
  const tokens = parseLineTokens(body);
  if (tokens.length < 2) return raw;
  const h = canonHead(tokens[0]);
  if (h === "revision-log" || h === "inline-note") {
    const ts = tokens[1] || "";
    const author = tokens[2] || "";
    const rest = tokens.slice(3).join("\t");
    const showAuthor = author && author !== "-";
    const ap = showAuthor ? `[${author}] ` : "";
    return `${ts} ${ap}${rest}`.trim();
  }
  const only = tokens[0];
  const lr = LOCALE === "en" ? /^changelog(\s|$)/i : /^更新履歴(\s|$)/;
  const ln = LOCALE === "en" ? /^note(\s|$)/i : /^コメント(\s|$)/;
  if (tokens.length === 1 && (lr.test(only) || ln.test(only))) {
    return only.replace(/^[^\s]+\s*/, "").trim();
  }
  return raw;
}

function linkifyPlainTextToHtml(str) {
  const s = String(str ?? "");
  return escapeHtml(s).replace(URL_IN_TEXT_RE, (url) => (
    `<a class="text-link" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(url)}</a>`
  ));
}

function findUrlAtOffset(text, offset) {
  const src = String(text || "");
  const pos = Math.max(0, Math.min(offset ?? 0, src.length));
  for (const match of src.matchAll(URL_IN_TEXT_RE)) {
    const url = String(match[0] || "");
    const start = Number(match.index ?? -1);
    if (!url || start < 0) continue;
    const end = start + url.length;
    if (pos >= start && pos <= end) return url;
  }
  return "";
}

function findDateAtOffset(text, offset) {
  const src = String(text || "");
  const pos = Math.max(0, Math.min(offset ?? 0, src.length));
  const dateRe = /(\d{4}\/\d{1,2}\/\d{1,2})/g;
  for (const match of src.matchAll(dateRe)) {
    const value = String(match[1] || "");
    const start = Number(match.index ?? -1);
    if (!value || start < 0) continue;
    const end = start + value.length;
    if (pos >= start && pos <= end) return { value, start, end };
  }
  return null;
}

function toDateInputValue(ymd) {
  const m = String(ymd || "").match(/^(\d{4})\/(\d{1,2})\/(\d{1,2})$/);
  if (!m) return "";
  return `${m[1]}-${String(Number(m[2])).padStart(2, "0")}-${String(Number(m[3])).padStart(2, "0")}`;
}

function fromDateInputValue(value) {
  const m = String(value || "").match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return "";
  return `${m[1]}/${m[2]}/${m[3]}`;
}

function isValidYmdText(ymd) {
  const m = String(ymd || "").match(/^(\d{4})\/(\d{2})\/(\d{2})$/);
  if (!m) return false;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  if (Number.isNaN(d.getTime())) return false;
  return d.getFullYear() === Number(m[1]) && d.getMonth() === Number(m[2]) - 1 && d.getDate() === Number(m[3]);
}

let activeEditorDatePicker = null;

function openEditorDatePicker(textarea, dateHit, caretOffset, fallbackClientX = 0, fallbackClientY = 0) {
  if (!textarea || !dateHit) return;
  if (activeEditorDatePicker) {
    activeEditorDatePicker.remove();
    activeEditorDatePicker = null;
  }
  const picker = document.createElement("input");
  picker.type = "date";
  picker.value = toDateInputValue(dateHit.value);
  picker.className = "editor-date-picker-popup";
  picker.style.position = "fixed";
  const pickerWidth = 240;
  const pickerHeight = 44;
  let left = Math.max(8, Math.min(window.innerWidth - pickerWidth, fallbackClientX + 8));
  let top = Math.max(8, Math.min(window.innerHeight - pickerHeight, fallbackClientY + 8));
  const caret = Math.max(0, Math.min(Number(caretOffset ?? dateHit.start), textarea.value.length));
  const caretPos = getTextareaCaretPixelPosition(textarea, caret);
  if (Number.isFinite(caretPos.left) && Number.isFinite(caretPos.top)) {
    const rect = textarea.getBoundingClientRect();
    const style = window.getComputedStyle(textarea);
    const lineHeight = Number.parseFloat(style.lineHeight) || Number.parseFloat(style.fontSize) * 1.4 || 18;
    left = rect.left + caretPos.left + 12;
    top = rect.top + caretPos.top + lineHeight + 6;
    if (top + pickerHeight > window.innerHeight - 8) top = rect.top + caretPos.top - pickerHeight - 6;
    left = Math.max(8, Math.min(window.innerWidth - pickerWidth, left));
    top = Math.max(8, Math.min(window.innerHeight - pickerHeight, top));
  }
  picker.style.left = `${left}px`;
  picker.style.top = `${top}px`;
  picker.style.zIndex = "1200";
  picker.style.padding = "2px 4px";
  picker.style.width = "150px";
  picker.style.fontSize = "12px";
  picker.style.border = "1px solid #60a5fa";
  picker.style.borderRadius = "6px";
  picker.style.background = "#fff";
  picker.style.boxShadow = "0 4px 12px rgba(0,0,0,0.18)";

  const close = () => {
    if (activeEditorDatePicker !== picker) return;
    picker.remove();
    activeEditorDatePicker = null;
  };

  picker.addEventListener("change", () => {
    const next = fromDateInputValue(picker.value);
    if (!isValidYmdText(next)) {
      close();
      return;
    }
    replaceTextareaRangeWithUndo(textarea, dateHit.start, dateHit.end, next, "end");
    refreshEditorAssist(textarea);
    textarea.focus();
    close();
  });
  picker.addEventListener("blur", () => close());
  picker.addEventListener("keydown", (ev) => {
    if (ev.key === "Escape") close();
  });

  document.body.appendChild(picker);
  activeEditorDatePicker = picker;
  picker.focus({ preventScroll: true });
  requestAnimationFrame(() => {
    if (activeEditorDatePicker !== picker) return;
    if (typeof picker.showPicker === "function") {
      try {
        picker.showPicker();
        return;
      } catch (_e) {}
    }
    picker.click();
  });
}

function openFloatingDatePicker(dateHit, fallbackClientX = 0, fallbackClientY = 0, onCommit = null) {
  if (!dateHit) return;
  if (activeEditorDatePicker) {
    activeEditorDatePicker.remove();
    activeEditorDatePicker = null;
  }
  const picker = document.createElement("input");
  picker.type = "date";
  picker.value = toDateInputValue(dateHit.value);
  picker.className = "editor-date-picker-popup";
  picker.style.position = "fixed";
  const pickerWidth = 240;
  const pickerHeight = 44;
  const left = Math.max(8, Math.min(window.innerWidth - pickerWidth, fallbackClientX + 8));
  const top = Math.max(8, Math.min(window.innerHeight - pickerHeight, fallbackClientY + 8));
  picker.style.left = `${left}px`;
  picker.style.top = `${top}px`;
  picker.style.zIndex = "1200";
  picker.style.padding = "2px 4px";
  picker.style.width = "150px";
  picker.style.fontSize = "12px";
  picker.style.border = "1px solid #60a5fa";
  picker.style.borderRadius = "6px";
  picker.style.background = "#fff";
  picker.style.boxShadow = "0 4px 12px rgba(0,0,0,0.18)";

  const close = () => {
    if (activeEditorDatePicker !== picker) return;
    picker.remove();
    activeEditorDatePicker = null;
  };

  picker.addEventListener("change", () => {
    const next = fromDateInputValue(picker.value);
    if (!isValidYmdText(next)) {
      close();
      return;
    }
    if (typeof onCommit === "function") onCommit(next);
    close();
  });
  picker.addEventListener("blur", () => close());
  picker.addEventListener("keydown", (ev) => {
    if (ev.key === "Escape") close();
  });

  document.body.appendChild(picker);
  activeEditorDatePicker = picker;
  picker.focus({ preventScroll: true });
  requestAnimationFrame(() => {
    if (activeEditorDatePicker !== picker) return;
    if (typeof picker.showPicker === "function") {
      try {
        picker.showPicker();
        return;
      } catch (_e) {}
    }
    picker.click();
  });
}

function bindEditorUrlOpen(textarea) {
  if (!textarea) return;
  textarea.addEventListener("mouseup", (ev) => {
    if (ev.button !== 0) return;
    const start = textarea.selectionStart ?? 0;
    const end = textarea.selectionEnd ?? start;
    if (start !== end) return;
    const dateHit = findDateAtOffset(textarea.value, start);
    if (dateHit && canUseEditorDatePickerAtOffset(textarea.value, start)) {
      openEditorDatePicker(textarea, dateHit, start, ev.clientX, ev.clientY);
      return;
    }
    const clickCtx = resolveEditorLevelLineClickContext(textarea.value, start);
    if (!clickCtx || clickCtx.kind !== "level") return;
    if (clickCtx.hitDirectiveHead) {
      clearEditorAssist();
      return;
    }
    const url = findUrlAtOffset(textarea.value, start);
    if (url) {
      const ok = window.confirm(LOCALE === "en" ? "Open this link in a new tab?" : "このリンクを開きますか？");
      if (!ok) return;
      const opened = window.open(url, "_blank", "noopener,noreferrer");
      if (opened) opened.opener = null;
      return;
    }
    if (isEditorAssistEnabled()) {
      showEditorAssistMenuForLevelClick(textarea, clickCtx);
    }
  });
}

function canUseEditorDatePickerAtOffset(text, offset) {
  const ctx = resolveEditorDirectiveLineClickContext(text, offset);
  if (!ctx) return false;
  return DATE_PICKER_CLICK_ASSIST_CANONS.has(ctx.headCanon);
}

function resolveEditorDirectiveLineClickContext(text, offset) {
  const src = String(text || "");
  const pos = Math.max(0, Math.min(offset ?? 0, src.length));
  const { line } = getLineRangeAtOffset(src, pos);
  const trimmed = String(line || "").trimStart();
  if (!trimmed.startsWith("//")) return null;
  const tokens = parseAssistDirectiveTokens(trimmed);
  if (tokens.length === 0) return null;
  const headCanon = canonHead(tokens[0]);
  if (!headCanon) return null;
  return { headCanon };
}

function resolveEditorLevelLineClickContext(text, offset) {
  const src = String(text || "");
  const pos = Math.max(0, Math.min(offset ?? 0, src.length));
  const { start: lineStart, line } = getLineRangeAtOffset(src, pos);
  const leadingMatch = line.match(/^(\s*)/);
  const leading = (leadingMatch && leadingMatch[1]) || "";
  const trimmed = line.slice(leading.length);
  if (!trimmed.startsWith("//")) return null;

  const contentStart = lineStart + leading.length;
  const localPos = Math.max(0, Math.min(pos - contentStart, trimmed.length));

  const explicitHead = parseLineTokens(trimmed.slice(2))[0] || "";
  const explicitCanon = canonHead(explicitHead);
  if (explicitCanon === "board") return { kind: "board", lineStart, contentStart };

  const isSmallShort = /^\/\/\/\/(\t|$)/.test(trimmed);
  const isMiddleShort = !isSmallShort && /^\/\/\/(\t|$)/.test(trimmed);
  const isLargeShort = !isSmallShort && !isMiddleShort && /^\/\/(\t|$)/.test(trimmed);
  const isLevelShorthand = isSmallShort || isMiddleShort || isLargeShort;
  const isExplicitLevel = explicitCanon === "large" || explicitCanon === "middle" || explicitCanon === "small" || explicitCanon === "hold";
  if (!isLevelShorthand && !isExplicitLevel) return null;

  let headWidth = 2;
  let body = "";
  let tokenBaseIdx = 0;
  if (isSmallShort) {
    headWidth = 4;
    body = trimmed.slice(5);
    tokenBaseIdx = 1;
  } else if (isMiddleShort) {
    headWidth = 3;
    body = trimmed.slice(4);
    tokenBaseIdx = 1;
  } else if (isLargeShort) {
    headWidth = 2;
    body = trimmed.slice(3);
    tokenBaseIdx = 1;
  } else {
    headWidth = 2 + String(explicitHead || "").length;
    body = trimmed.slice(2);
    tokenBaseIdx = 0;
  }
  const hitDirectiveHead = localPos <= headWidth;

  const bodyStartLocal = isSmallShort ? 5 : (isMiddleShort ? 4 : (isLargeShort ? 3 : 2));
  const bodyPos = Math.max(0, localPos - bodyStartLocal);
  const rawParts = String(body || "").split("\t");
  let running = 0;
  let tokenEnd = 0;
  let tokenStart = 0;
  let tokenIdx = tokenBaseIdx;
  for (let i = 0; i < rawParts.length; i += 1) {
    const token = String(rawParts[i] || "");
    const start = running;
    const end = running + token.length;
    tokenEnd = end;
    tokenStart = start;
    tokenIdx = tokenBaseIdx + i;
    if (bodyPos <= end) break;
    running = end + 1;
    tokenEnd = running;
    tokenStart = running;
  }

  return {
    kind: "level",
    lineStart,
    contentStart,
    hitDirectiveHead,
    headCanon: isLevelShorthand
      ? (isSmallShort ? "small" : (isMiddleShort ? "middle" : "large"))
      : explicitCanon,
    tokenIdx,
    tokenValue: String(rawParts[Math.max(0, tokenIdx - tokenBaseIdx)] || "").trim(),
    tokenStartOffset: contentStart + bodyStartLocal + tokenStart,
    tokenEndOffset: contentStart + bodyStartLocal + tokenEnd,
  };
}

function showEditorAssistMenuForLevelClick(textarea, clickCtx) {
  if (!isEditorAssistEnabled()) return;
  if (!textarea || !clickCtx || clickCtx.kind !== "level") return;
  const fullText = String(textarea.value || "");
  const textBeforeLine = fullText.slice(0, clickCtx.lineStart);
  const currentTokenIdx = Math.max(1, Number(clickCtx.tokenIdx || 0));
  const currentHeadCanon = String(clickCtx.headCanon || "");
  if (!currentHeadCanon) return;
  const tokenValueRaw = String(clickCtx.tokenValue || "").trim();
  const isNumericToken = /^-?\d+(?:\.\d+)?$/.test(tokenValueRaw);
  const isBetchoNumberField = currentHeadCanon === "betcho" && (currentTokenIdx === 1 || currentTokenIdx === 2);
  const preferNumericAssist = isNumericToken && (currentTokenIdx === 1 || isBetchoNumberField);
  if (preferNumericAssist) {
    const parsed = Number.parseFloat(tokenValueRaw);
    const fallback = currentHeadCanon === "betcho" && currentTokenIdx === 1 ? 1 : 0;
    const numeric = Number.isFinite(parsed) ? parsed : fallback;
    editorAssistState.active = true;
    editorAssistState.type = currentHeadCanon === "betcho" && currentTokenIdx === 1
      ? "click-board-number"
      : "click-page-number";
    editorAssistState.memoryKey = `level-${currentTokenIdx}`;
    editorAssistState.numericValue = numeric;
    editorAssistState.candidates = [String(numeric)];
    editorAssistState.index = 0;
    editorAssistState.replaceStart = Math.max(0, clickCtx.tokenStartOffset);
    editorAssistState.replaceEnd = Math.max(editorAssistState.replaceStart, clickCtx.tokenEndOffset);
    editorAssistState.appendSpace = true;
    editorAssistState.sessionActive = true;
    editorAssistState.sessionLineStart = clickCtx.lineStart;
    editorAssistState.sessionContentStart = clickCtx.contentStart;
    editorAssistState.suppressNextClickRefresh = true;
    editorAssistState.boardNumberMin = currentHeadCanon === "betcho" && currentTokenIdx === 1 ? 0 : 1;
    const caretPos = Math.max(editorAssistState.replaceEnd, clickCtx.contentStart + 2);
    textarea.setSelectionRange(caretPos, caretPos);
    renderEditorCandidate(textarea);
    return;
  }

  editorAssistState.boardNumberMin = 1;

  const preferredValue = findPreviousDirectiveFieldValue(
    textBeforeLine,
    (tokens) => canonHead(tokens[0]) === currentHeadCanon,
    currentTokenIdx,
  );

  let candidates = [];
  if (currentTokenIdx === 1) {
    candidates = collectLevelFieldValuesByTokenIndexForHead(fullText, 1, currentHeadCanon);
  } else {
    const isAddonHead = Boolean(ADDON_SPECS[currentHeadCanon]);
    const assistFieldLabels = getAssistFieldLabelsForHead(fullText, currentHeadCanon);
    const dataLabels = getArticleDataFieldLabels(assistFieldLabels);
    const maxAssistTokenIdx = isAddonHead ? 1 + dataLabels.length : 2 + dataLabels.length;
    if (resolveAssistArticleFields(fullText).hasDirective && currentTokenIdx > maxAssistTokenIdx) return;
    const names = collectPeopleNames(fullText, assistFieldLabels, currentHeadCanon);
    const extra = collectLevelFieldValues(fullText, assistFieldLabels, currentHeadCanon);
    let pool = [];
    if (currentTokenIdx === 2 && !isAddonHead) {
      pool = extra.articleNames;
    } else {
      const labelIdx = isAddonHead ? currentTokenIdx - 2 : currentTokenIdx - 3;
      const label = String(dataLabels[labelIdx] || "");
      const canon = canonicalFieldByLabel(label);
      if (canon === "desk") pool = names.desk;
      else if (canon === "editors") pool = names.editors;
      else if (canon === "writers") pool = names.writers;
      else if (canon === "deadline") pool = extra.deadlines;
      else if (canon === "status") pool = extra.statuses;
      else if (canon === "memo") pool = extra.memos;
      else pool = collectLevelFieldValuesByTokenIndex(fullText, currentTokenIdx, currentHeadCanon);
    }
    candidates = pool.slice();
    if (!candidates.includes("-")) candidates.unshift("-");
  }

  const normalizedSeen = new Set();
  const merged = [];
  const pushCandidate = (value) => {
    const s = String(value || "").trim();
    if (!s) return;
    const key = s.toLowerCase();
    if (normalizedSeen.has(key)) return;
    normalizedSeen.add(key);
    merged.push(s);
  };
  pushCandidate(preferredValue);
  for (const item of candidates) pushCandidate(item);
  pushCandidate(clickCtx.tokenValue);
  if (merged.length === 0) return;

  editorAssistState.active = true;
  editorAssistState.type = `click-level-${currentTokenIdx}`;
  editorAssistState.memoryKey = `level-${currentTokenIdx}`;
  editorAssistState.candidates = merged;
  editorAssistState.index = 0;
  editorAssistState.replaceStart = Math.max(0, clickCtx.tokenStartOffset);
  editorAssistState.replaceEnd = Math.max(editorAssistState.replaceStart, clickCtx.tokenEndOffset);
  editorAssistState.appendSpace = true;
  editorAssistState.sessionActive = true;
  editorAssistState.sessionLineStart = clickCtx.lineStart;
  editorAssistState.sessionContentStart = clickCtx.contentStart;
  editorAssistState.suppressNextClickRefresh = true;
  const caretPos = Math.max(editorAssistState.replaceEnd, clickCtx.contentStart + 2);
  textarea.setSelectionRange(caretPos, caretPos);
  renderEditorCandidate(textarea);
}

function parseLocalYmdToDate(s) {
  const m = String(s || "").trim().match(/^(\d{4})\/(\d{1,2})\/(\d{1,2})/);
  if (!m) return null;
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
}

function daysFromTodayToDate(ymdStr) {
  const d = parseLocalYmdToDate(ymdStr);
  if (!d || Number.isNaN(d.getTime())) return null;
  const t0 = new Date();
  t0.setHours(0, 0, 0, 0);
  d.setHours(0, 0, 0, 0);
  return Math.round((d - t0) / 864e5);
}

function normalizeDirectiveIndentation(text) {
  const lines = String(text || "").split(/\r?\n/);
  let changed = false;
  for (let i = 0; i < lines.length; i += 1) {
    const raw = lines[i];
    const trimmed = raw.trimStart();
    if (!trimmed.startsWith("//")) continue;
    const body = trimmed.slice(2).trimStart();
    const tokens = parseLineTokens(body);
    if (!tokens.length) continue;
    const level = LEVELS[tokens[0]] || LEVELS[String(tokens[0]).toLowerCase()];
    if (!level) continue;
    const next = `${levelIndent(level)}${trimmed}`;
    if (next !== raw) {
      lines[i] = next;
      changed = true;
    }
  }
  return changed ? lines.join("\n") : String(text || "");
}

function refreshSubmissionMemoInText(text) {
  const lines = String(text || "").split(/\r?\n/);
  let changed = false;
  for (let i = 0; i < lines.length; i += 1) {
    const raw = lines[i];
    const trimmed = raw.trimStart();
    if (!trimmed.startsWith("//")) continue;
    const leading = raw.slice(0, raw.length - trimmed.length);
    const body = trimmed.slice(2).trimStart();
    const tokens = parseLineTokens(body);
    if (!tokens.length || canonHead(tokens[0]) !== "submission-date") continue;
    const submissionDate = tokens[1] || "";
    const days = daysFromTodayToDate(submissionDate);
    if (!Number.isFinite(days)) continue;
    const memo = LOCALE === "en" ? `${days} day(s) left` : `あと ${days} 日`;
    const head = tokens[0] || headByCanon("submission-date");
    const next = `${leading}//${head}\t${submissionDate}\t${memo}`;
    if (next !== raw) {
      lines[i] = next;
      changed = true;
    }
  }
  return changed ? lines.join("\n") : String(text || "");
}

function normalizeEditorDirectiveText(text) {
  // Keep user-authored indentation as-is.
  // DaiwariML proposal introduces section lines where visual indentation is editorial context,
  // so save-time auto reindent of //大 //中 //小 is intentionally disabled.
  return refreshSubmissionMemoInText(String(text || ""));
}

function upsertArticleListWidthsLine(text, widths) {
  const src = String(text || "");
  const normalizedWidths = normalizeArticleColumnWidths(widths, getArticleDisplayFieldLabels());
  const widthText = normalizedWidths.map((w) => (Math.round(w * 100) / 100)).join("\t");
  const lineText = `//${headByCanon("article-list-widths")}\t${widthText}`;
  const lines = src.split(/\r?\n/);

  const findDirectiveIndex = (canon) =>
    lines.findIndex((raw) => {
      const trimmed = String(raw || "").trimStart();
      if (!trimmed.startsWith("//")) return false;
      const tokens = parseLineTokens(trimmed.slice(2).trimStart());
      return tokens.length > 0 && canonHead(tokens[0]) === canon;
    });

  const widthsIdx = findDirectiveIndex("article-list-widths");
  if (widthsIdx >= 0) {
    lines[widthsIdx] = lineText;
    return lines.join("\n");
  }

  const fieldsIdx = findDirectiveIndex("article-fields");
  if (fieldsIdx >= 0) {
    lines.splice(fieldsIdx + 1, 0, lineText);
    return lines.join("\n");
  }

  const footerIdx = lines.findIndex((ln) => String(ln || "").trim() === "//*\tこのデータはAutoDaiwarer用です。");
  if (footerIdx >= 0) {
    lines.splice(Math.max(0, footerIdx), 0, lineText);
    return lines.join("\n");
  }

  lines.push(lineText);
  return lines.join("\n");
}

function getLineRangeAtOffset(text, offset) {
  const o = Math.max(0, Math.min(offset, text.length));
  const a = text.lastIndexOf("\n", o - 1) + 1;
  const b0 = text.indexOf("\n", o);
  const b = b0 === -1 ? text.length : b0;
  return { start: a, end: b, line: text.slice(a, b) };
}

function getSelectedWholeLineRange(text, start, end) {
  const src = String(text || "");
  const safeStart = Math.max(0, Math.min(start ?? 0, src.length));
  const safeEnd = Math.max(0, Math.min(end ?? safeStart, src.length));
  const lineStart = src.lastIndexOf("\n", Math.max(0, safeStart - 1)) + 1;
  const baseEnd = safeEnd > lineStart && src[safeEnd - 1] === "\n" ? safeEnd - 1 : safeEnd;
  const lineEndIdx = src.indexOf("\n", baseEnd);
  const lineEnd = lineEndIdx === -1 ? src.length : lineEndIdx;
  return { start: lineStart, end: lineEnd };
}

function parseSelectableOutlineLine(rawLine) {
  const line = String(rawLine || "");
  const leadingMatch = line.match(/^(\s*)(.*)$/);
  const leading = (leadingMatch && leadingMatch[1]) || "";
  const body = (leadingMatch && leadingMatch[2]) || "";
  const explicit = body.match(/^\/\/([大中小])(\t|$)(.*)$/);
  if (explicit) {
    const levelMap = { 大: 0, 中: 1, 小: 2 };
    return {
      matched: true,
      level: levelMap[explicit[1]],
      style: "explicit",
      leading,
      tail: `${explicit[2]}${explicit[3]}`,
    };
  }
  const smallShort = body.match(/^\/\/\/\/(\t|$)(.*)$/);
  if (smallShort) return { matched: true, level: 2, style: "shorthand", leading, tail: `${smallShort[1]}${smallShort[2]}` };
  const middleShort = body.match(/^\/\/\/(\t|$)(.*)$/);
  if (middleShort) return { matched: true, level: 1, style: "shorthand", leading, tail: `${middleShort[1]}${middleShort[2]}` };
  const largeShort = body.match(/^\/\/(\t|$)(.*)$/);
  if (largeShort) return { matched: true, level: 0, style: "shorthand", leading, tail: `${largeShort[1]}${largeShort[2]}` };
  return { matched: false };
}

function stringifyOutlineLineWithLevel(parsed, nextLevel) {
  const level = Math.max(0, Math.min(2, nextLevel));
  if (parsed.style === "explicit") {
    const heads = ["大", "中", "小"];
    return `${parsed.leading}//${heads[level]}${parsed.tail}`;
  }
  const slashes = ["//", "///", "////"];
  return `${parsed.leading}${slashes[level]}${parsed.tail}`;
}

function shiftLineLeadingTabs(line, delta) {
  const match = String(line || "").match(/^(\t*)(.*)$/);
  const current = (match && match[1] ? match[1].length : 0);
  const rest = (match && match[2]) || "";
  const next = Math.max(0, current + delta);
  return `${"\t".repeat(next)}${rest}`;
}

function shiftSelectedOutlineLevel(textarea, delta) {
  if (!textarea) return false;
  const text = textarea.value;
  const selStart = textarea.selectionStart ?? 0;
  const selEnd = textarea.selectionEnd ?? selStart;
  const range = getSelectedWholeLineRange(text, selStart, selEnd);
  const block = text.slice(range.start, range.end);
  const lines = block.split("\n");
  let changed = false;
  const mapped = lines.map((line) => {
    const parsed = parseSelectableOutlineLine(line);
    let nextLine = line;
    if (parsed.matched) {
      const nextLevel = Math.max(0, Math.min(2, parsed.level + delta));
      // At boundaries, keep the line unchanged:
      // //大 + Alt+Left, //小 + Alt+Right.
      if (nextLevel === parsed.level) return line;
      nextLine = stringifyOutlineLineWithLevel(parsed, nextLevel);
    }
    const shiftedLine = shiftLineLeadingTabs(nextLine, delta);
    if (shiftedLine !== line) changed = true;
    return shiftedLine;
  });
  if (!changed) return false;
  const nextBlock = mapped.join("\n");
  textarea.value = text.slice(0, range.start) + nextBlock + text.slice(range.end);
  const nextSelStart = range.start;
  const nextSelEnd = range.start + nextBlock.length;
  textarea.setSelectionRange(nextSelStart, nextSelEnd);
  refreshEditorAssist(textarea);
  return true;
}

function lineStartOffset(lines, lineIndex) {
  let offset = 0;
  for (let i = 0; i < lineIndex; i += 1) offset += lines[i].length + 1;
  return offset;
}

function moveSelectedLinesByOne(textarea, direction) {
  if (!textarea) return false;
  const text = String(textarea.value || "");
  const selStart = textarea.selectionStart ?? 0;
  const selEnd = textarea.selectionEnd ?? selStart;
  const range = getSelectedWholeLineRange(text, selStart, selEnd);
  const before = text.slice(0, range.start);
  const selected = text.slice(range.start, range.end);
  const startLine = before.length === 0 ? 0 : before.split("\n").length - 1;
  const selectedLineCount = selected.length === 0 ? 1 : selected.split("\n").length;
  const lines = text.split("\n");
  const endLine = startLine + selectedLineCount - 1;
  if (direction < 0 && startLine <= 0) return false;
  if (direction > 0 && endLine >= lines.length - 1) return false;

  const moving = lines.splice(startLine, selectedLineCount);
  const insertAt = direction < 0 ? startLine - 1 : startLine + 1;
  lines.splice(insertAt, 0, ...moving);

  const nextText = lines.join("\n");
  const nextStartLine = direction < 0 ? startLine - 1 : startLine + 1;
  const nextEndLine = nextStartLine + selectedLineCount - 1;
  const nextSelStart = lineStartOffset(lines, nextStartLine);
  const nextSelEnd = lineStartOffset(lines, nextEndLine) + lines[nextEndLine].length;

  textarea.value = nextText;
  textarea.setSelectionRange(nextSelStart, nextSelEnd);
  refreshEditorAssist(textarea);
  return true;
}

function getEditorSampleText() {
  return LOCALE === "en" ? EDITOR_SAMPLE_TEXT_EN : EDITOR_SAMPLE_TEXT;
}

function isEditorTextBlank(text) {
  return !String(text ?? "").trim();
}

function trimTextToVisibleHeight(el, maxHeight, fullText) {
  if (!el || maxHeight <= 0) {
    if (el) el.textContent = "";
    return;
  }
  const lines = String(fullText || "").split("\n");
  if (lines.length === 0) {
    el.textContent = "";
    return;
  }
  let lo = 0;
  let hi = lines.length;
  while (lo < hi) {
    const mid = Math.ceil((lo + hi) / 2);
    el.textContent = lines.slice(0, mid).join("\n");
    if (el.scrollHeight <= maxHeight) lo = mid;
    else hi = mid - 1;
  }
  el.textContent = lines.slice(0, lo).join("\n");
}

function renderEditorSampleGhostBody() {
  const ghost = els.editorSampleGhost;
  const body = ghost?.querySelector(".editor-sample-ghost-body");
  const hint = els.editorSampleGhostHint;
  if (!ghost || !body || ghost.classList.contains("hidden")) return;
  const fullText = body.dataset.fullText || getEditorSampleText();
  body.dataset.fullText = fullText;
  const ghostHeight = ghost.clientHeight;
  if (ghostHeight <= 0) return;
  const hintBlock = hint?.offsetHeight ?? 0;
  const hintGap = hintBlock > 0 ? 8 : 0;
  const maxBodyHeight = ghostHeight - hintBlock - hintGap - 4;
  trimTextToVisibleHeight(body, maxBodyHeight, fullText);
}

let editorSampleGhostResizeObserver = null;

function ensureEditorSampleGhostResizeObserver() {
  if (editorSampleGhostResizeObserver || !els.editorText) return;
  editorSampleGhostResizeObserver = new ResizeObserver(() => {
    renderEditorSampleGhostBody();
  });
  editorSampleGhostResizeObserver.observe(els.editorText);
}

function updateEditorSampleGhost() {
  const ghost = els.editorSampleGhost;
  const body = ghost?.querySelector(".editor-sample-ghost-body");
  const textarea = els.editorText;
  if (!ghost || !body || !textarea) return;
  ensureEditorSampleGhostResizeObserver();
  const show = isEditorTextBlank(textarea.value);
  if (show) {
    body.dataset.fullText = getEditorSampleText();
    if (els.editorSampleGhostHint) {
      els.editorSampleGhostHint.textContent = LOCALE === "en"
        ? "Click “Insert Sample” to turn the preview below into editable text.You can edit the text and make a daiwari, or use AI Assist to make it easily and then fix it."
        : "「サンプル入力」をクリックすると、下の内容が編集できるテキストになります。これを修正して台割を作ってもよいでしょう。「AIお助け」で作ったものをもとに直していく方法もあります。";
    }
    ghost.classList.remove("hidden");
    els.insertSampleBtn?.classList.add("is-sample-invite");
    window.requestAnimationFrame(() => {
      renderEditorSampleGhostBody();
    });
  } else {
    ghost.classList.add("hidden");
    els.insertSampleBtn?.classList.remove("is-sample-invite");
  }
}

function showEditorSampleAppliedFeedback() {
  const wrap = document.querySelector("#editorDialog .editor-text-wrap");
  const notice = els.editorSampleAppliedNotice;
  if (notice) {
    notice.textContent = LOCALE === "en"
      ? "Sample inserted. You can edit the text now."
      : "サンプルを入力しました。このまま編集できます。";
    notice.classList.remove("hidden");
    notice.classList.add("is-visible");
    window.setTimeout(() => {
      notice.classList.remove("is-visible");
      window.setTimeout(() => notice.classList.add("hidden"), 280);
    }, 3200);
  }
  if (wrap) {
    wrap.classList.add("is-sample-active");
    window.setTimeout(() => wrap.classList.remove("is-sample-active"), 1800);
  }
  els.insertSampleBtn?.classList.remove("is-sample-invite");
}

function clearEditorSampleAppliedFeedback() {
  els.editorSampleAppliedNotice?.classList.remove("is-visible");
  els.editorSampleAppliedNotice?.classList.add("hidden");
  document.querySelector("#editorDialog .editor-text-wrap")?.classList.remove("is-sample-active");
}

function levelLabel(level) {
  const ja = { large: "大", middle: "中", small: "小" };
  const en = { large: "Large", middle: "Middle", small: "Small" };
  return (LOCALE === "en" ? en[level] : ja[level]) || level;
}

function levelIndent(level) {
  if (level === "middle") return "\t";
  if (level === "small") return "\t\t";
  return "";
}

/** //目次計画 ブロック内（お手本 dwml どおり：大=タブ1、中=2、小=3） */
function levelIndentInTocPlan(level) {
  if (level === "small") return "\t\t\t";
  if (level === "middle") return "\t\t";
  return "\t";
}

function getDefaultArticleFieldLabels() {
  return [...(LOCALE === "en" ? DEFAULT_ARTICLE_FIELD_LABELS_EN : DEFAULT_ARTICLE_FIELD_LABELS_JA)];
}

function normalizeArticleFieldLabels(rawLabels) {
  const labels = (rawLabels || [])
    .map((label) => String(label || "").trim())
    .filter(Boolean);
  const base = labels.length > 0 ? labels : getDefaultArticleFieldLabels();
  const pagesLabel = base.find((label) => canonicalFieldByLabel(label) === "pages")
    || (LOCALE === "en" ? "Pages" : "ページ数");
  const nameLabel = base.find((label) => canonicalFieldByLabel(label) === "name")
    || (LOCALE === "en" ? "Article" : "記事名");
  const custom = base.filter((label) => {
    const canon = canonicalFieldByLabel(label);
    return canon !== "pages" && canon !== "name";
  });
  return [pagesLabel, nameLabel, ...custom];
}

function isVirtualArticleFieldLabel(label) {
  const canon = canonicalFieldByLabel(label);
  return canon === "pages" || canon === "name";
}

function getArticleDisplayFieldLabels(rawLabels = state.articleFieldLabels) {
  const labels = normalizeArticleFieldLabels(rawLabels);
  const displayLabels = labels.filter((label) => {
    const canon = canonicalFieldByLabel(label);
    return canon !== "name" && canon !== "pages";
  });
  return displayLabels.length > 0
    ? displayLabels
    : getDefaultArticleFieldLabels().filter((label) => {
      const canon = canonicalFieldByLabel(label);
      return canon !== "name" && canon !== "pages";
    });
}

function getArticleDataFieldLabels(rawLabels = state.articleFieldLabels) {
  const labels = getArticleDisplayFieldLabels(rawLabels);
  const dataLabels = labels.filter((label) => canonicalFieldByLabel(label) !== "pages");
  return dataLabels.length > 0 ? dataLabels : getDefaultArticleFieldLabels().filter((label) => !isVirtualArticleFieldLabel(label));
}

function parseArticleListColumnWidths(rawTokens) {
  return (rawTokens || [])
    .map((token) => Number.parseFloat(String(token || "").replace("%", "")))
    .filter((num) => Number.isFinite(num) && num > 0);
}

function getDefaultArticleColumnWidths(labels = getArticleDisplayFieldLabels()) {
  const metaCount = Math.max(1, labels.length);
  const fixed = [9, 9, 20];
  const remain = Math.max(0, 100 - fixed.reduce((sum, value) => sum + value, 0));
  const unit = remain / metaCount;
  return [...fixed, ...Array.from({ length: metaCount }, () => unit)];
}

function normalizeArticleColumnWidths(rawWidths, labels = getArticleDisplayFieldLabels()) {
  const expected = 3 + Math.max(1, labels.length);
  let input = Array.isArray(rawWidths) ? rawWidths : [];
  // 旧データ: 「ページ数」表示列を含む幅定義(期待値+1)はページ数列ぶんを除去して互換処理する
  if (input.length === expected + 1) {
    input = [...input.slice(0, 3), ...input.slice(4)];
  }
  if (input.length !== expected || input.some((w) => !Number.isFinite(w) || w <= 0)) {
    return getDefaultArticleColumnWidths(labels);
  }
  const total = input.reduce((sum, value) => sum + value, 0);
  if (!(total > 0)) return getDefaultArticleColumnWidths(labels);
  return input.map((value) => (value * 100) / total);
}

function getArticleColumnWidths() {
  const labels = getArticleDisplayFieldLabels();
  return normalizeArticleColumnWidths(state.articleListColumnWidths, labels);
}

function normalizeFieldLabelKey(label) {
  return String(label || "")
    .trim()
    .toLowerCase()
    .replace(/[ \t　_\-]/g, "");
}

function canonicalFieldByLabel(label) {
  const key = normalizeFieldLabelKey(label);
  if (["pages", "page", "ページ数", "頁"].includes(key)) return "pages";
  if (["article", "articlename", "name", "記事", "記事名"].includes(key)) return "name";
  if (["desk", "デスク"].includes(key)) return "desk";
  if (["editor", "editors", "編集担当", "担当編集"].includes(key)) return "editors";
  if (["writer", "writers", "筆者"].includes(key)) return "writers";
  if (["deadline", "締切", "締め切り", "締切日", "締め切り日"].includes(key)) return "deadline";
  if (["status", "進行", "ステータス"].includes(key)) return "status";
  if (["memo", "メモ", "備考"].includes(key)) return "memo";
  return "";
}

function articleLabelsEqualDefault(labels) {
  const a = normalizeArticleFieldLabels(labels);
  const b = normalizeArticleFieldLabels(getDefaultArticleFieldLabels());
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i += 1) {
    if (normalizeFieldLabelKey(a[i]) !== normalizeFieldLabelKey(b[i])) return false;
  }
  return true;
}

function getMetaAddonFieldLabels(meta) {
  if (meta.tocArticleFieldLabels != null) return meta.tocArticleFieldLabels;
  return meta.articleFieldLabels;
}

function parseArticleFieldPayload(tokens, startIdx, fieldLabels) {
  const labels = getArticleDataFieldLabels(fieldLabels);
  const values = {};
  for (let i = 0; i < labels.length; i += 1) {
    const label = labels[i];
    values[label] = tokens[startIdx + i] || "";
  }
  if (tokens.length > startIdx + labels.length && labels.length > 0) {
    const tailLabel = labels[labels.length - 1];
    const tail = tokens.slice(startIdx + labels.length).join("\t");
    values[tailLabel] = values[tailLabel] ? `${values[tailLabel]}\t${tail}` : tail;
  }

  const out = {
    fieldValues: values,
    desk: [],
    editors: [],
    writers: [],
    deadline: "",
    status: "",
    memo: "",
  };
  for (const label of labels) {
    const raw = values[label] || "";
    const canon = canonicalFieldByLabel(label);
    if (canon === "desk") out.desk = splitPeople(raw || "-");
    else if (canon === "editors") out.editors = splitPeople(raw || "-");
    else if (canon === "writers") out.writers = splitPeople(raw || "-");
    else if (canon === "deadline") out.deadline = raw;
    else if (canon === "status") out.status = raw;
    else if (canon === "memo") out.memo = raw;
  }
  return out;
}

function applyLocaleUI() {
  if (LOCALE !== "en") return;
  document.title = "AutoDaiwarer JS";
  const setText = (selector, text) => {
    const el = document.querySelector(selector);
    if (el) el.textContent = text;
  };
  const setTitle = (selector, text) => {
    const el = document.querySelector(selector);
    if (el) el.title = text;
  };
  setText("#editBtn", "Input / Edit");
  setText("#topPrintBtn", "Print");
  setText("#impositionBtn", "Imposition");
  setText("#listBtn", "Article List");
  setText("#tocDraftBtn", "TOC Draft");
  setText("#aiDraftBtn", "AI Assist");
  setText("#helpBtn", "Help");
  setText("#appBrandTag", "Flatplan Editor");
  setText("#editorTitle", "Daiwari Editor");
  setText("#pickFileBtn", "Load from file");
  setText("#fileSaveBtn", "Save to file (.dwml)");
  setText("#insertSampleBtn", "Insert Sample");
  setText("#searchNextBtn", "Next");
  setText("#searchPrevBtn", "Prev");
  setText("#recalcPagesBtn", "Recalc Pages");
  setText("#addRevisionLogBtn", "Add changelog");
  setText("#revisionLogDialog h3", "Changelog");
  setText("#revisionLogCancelBtn", "Cancel");
  setText("#revisionLogSaveBtn", "Save");
  setText("#inlineNoteDialog h3", "Comment");
  setText("#inlineNoteCancelBtn", "Cancel");
  setText("#inlineNoteSaveBtn", "Save");
  setText("#cancelEditBtn", "Cancel");
  setText("#closeEditorBtn", "Close (Apply to board)");
  const searchInput = document.querySelector("#editorSearchInput");
  if (searchInput) searchInput.placeholder = "Search text";
  setText("#articleDialog h3", "Article List");
  setText("#csvBtn", "Export CSV");
  setText("#tocDraftFromListBtn", "TOC Draft");
  setText("#printBtn", "Print");
  setText("#tocDraftDialog h3", "TOC Draft");
  const tocNote = document.querySelector("#tocDraftDialog .toc-draft-note");
  if (tocNote) {
    tocNote.innerHTML = "Build a print TOC from article titles and folios (<code>//start-page</code>, <code>//body-folio-start</code>, insert advances). Cover, obi, and hold blocks are excluded.";
  }
  setText("label[for='tocDraftDepth']", "Hierarchy depth");
  setText("label[for='tocDraftStyle']", "Separator");
  setText("label[for='tocDraftPreview']", "Preview");
  setText("#tocDraftCopyBtn", "Copy");
  setText("#tocDraftDownloadBtn", "Save text");
  setText("#tocDraftCloseBtn", "Close");
  setText("#aiDraftDialog h3", "AI Assist");
  const aiNote = document.querySelector("#aiDraftDialog .ai-draft-note");
  if (aiNote) {
    aiNote.textContent =
      "Describe what you want in plain language to create, edit, or rearrange a flatplan. We recommend saving the current flatplan to a file first.";
  }
  setText("label[for='aiDraftGptUrl']", "Dedicated GPT URL (English)");
  setText("#aiDraftSaveUrlBtn", "Save URL");
  setText("label[for='aiDraftMemo']", "Book planning memo");
  setText(
    "#aiDraftLaunchBtn",
    "Copy memo & context · Open dedicated GPT (paste into GPT input)",
  );
  const includeFlatplanLabel = els.aiDraftIncludeFlatplan?.closest("label");
  if (includeFlatplanLabel) {
    const input = includeFlatplanLabel.querySelector("input");
    includeFlatplanLabel.innerHTML = "";
    if (input) includeFlatplanLabel.appendChild(input);
    includeFlatplanLabel.appendChild(
      document.createTextNode(" Include current flatplan in copy (edit / rearrange)"),
    );
  }
  setText("label[for='aiDraftMemo']", "Instructions / memo");
  refreshAiDraftMemoPlaceholder();
  setText("label[for='aiDraftImportPreview']", "Paste GPT output here to preview");
  const importHint = document.querySelector("#aiDraftImportHint");
  if (importHint) {
    importHint.textContent =
      "Paste the GPT result in the box below (Windows: Ctrl+V, macOS: ⌘V).";
  }
  if (els.aiDraftImportPreview) {
    els.aiDraftImportPreview.placeholder = "";
  }
  setText("#aiDraftApplyBtn", "Apply to flatplan");
  setText("#aiDraftCloseBtn", "Close");
  setText("#dwmlLintDialog h3", "Flatplan syntax check");
  setText("#dwmlLintJumpBtn", "Go to first issue");
  setText("#dwmlLintProceedBtn", "Apply anyway (warnings only)");
  setText("#dwmlLintCloseBtn", "Close");
  if (els.tocDraftDepth) {
    const opts = els.tocDraftDepth.options;
    if (opts[0]) opts[0].textContent = "Large only";
    if (opts[1]) opts[1].textContent = "Large + middle";
    if (opts[2]) opts[2].textContent = "Large + middle + small";
  }
  if (els.tocDraftStyle) {
    const opts = els.tocDraftStyle.options;
    if (opts[0]) opts[0].textContent = "Dot leaders (…)";
    if (opts[1]) opts[1].textContent = "Tab-separated";
  }
  const tocTitleCheck = els.tocDraftIncludeTitle?.closest("label");
  if (tocTitleCheck) {
    const input = tocTitleCheck.querySelector("input");
    tocTitleCheck.innerHTML = "";
    if (input) tocTitleCheck.appendChild(input);
    tocTitleCheck.appendChild(document.createTextNode(" Include book title at top"));
  }
  setText("#cancelListBtn", "Cancel");
  setText("#closeListBtn", "Close (Apply to flatplan)");
  setText("#helpDialog h3", "Help (reference)");
  setText("#openBugReportBtn", "Send a bug report");
  setText("#closeHelpBtn", "Close");
  setText("#bugReportDialog h3", "Bug Report");
  setText("#cancelBugReportBtn", "Cancel");
  setText("#submitBugReportBtn", "Submit");
  setText("#impositionDialog h3", "Imposition Simulation");
  setText("label[for='impositionBoardInput']", "Target board numbers");
  if (els.impositionBoardInput) els.impositionBoardInput.placeholder = "Examples: 1,2 / 1 4 2 3 (order matters) / 3-4 / all";
  setTitle(
    "#impositionBoardInput",
    "Boards to impose. Leave empty for every board (same as \"all\", ascending order). Use \"1,2\" or \"3-4\" to pick boards, or \"1 4 2 3\" to concatenate them in that order."
  );
  setText("#impositionExportSpreadPptxBtn", "Export Rough PPTX");
  setTitle(
    "#impositionExportSpreadPptxBtn",
    "Use when starting a rough from scratch. Exports a new spread-based rough PPTX from the flatplan (edited roughs are not carried over)."
  );
  setText("#impositionUpdateSpreadPptxBtn", "Update / Export PPTX");
  setTitle(
    "#impositionUpdateSpreadPptxBtn",
    "Use after changing the flatplan to rebuild the rough while keeping your edits. Pages whose articles match reuse shapes from the previous PPTX."
  );
  setText(
    "#impositionPptxFlow",
    "Flow: flatplan -> [Export Rough PPTX] -> edit in PowerPoint -> [Update / Export PPTX] -> export PDF from PowerPoint -> [Load PDF] to check"
  );
  setText("#impositionPptxDialog h3", "Update PPTX");
  const singlePageLabel = els.impositionPptxSinglePage?.closest("label");
  if (singlePageLabel) {
    const input = singlePageLabel.querySelector("input");
    singlePageLabel.innerHTML = "";
    if (input) singlePageLabel.appendChild(input);
    singlePageLabel.appendChild(document.createTextNode(" Export as single pages (not spreads)"));
  }
  const hideLabelsLabel = els.impositionPptxHideLabels?.closest("label");
  if (hideLabelsLabel) {
    const input = hideLabelsLabel.querySelector("input");
    hideLabelsLabel.innerHTML = "";
    if (input) hideLabelsLabel.appendChild(input);
    hideLabelsLabel.appendChild(document.createTextNode(" Hide TOC name and page number"));
  }
  setText("#impositionPptxDialogCancelBtn", "Cancel");
  setText("#impositionPptxDialogRunBtn", "Export PPTX");
  if (els.impositionProcessingMessage) els.impositionProcessingMessage.textContent = "Processing…";
  setText("#impositionLoadPdfBtn", "Load PDF");
  setTitle(
    "#impositionLoadPdfBtn",
    "Use to check a single-page PDF (such as print-ready data). Pages are poured into the imposition slots in page-number order."
  );
  setText("#impositionLoadSpreadPdfBtn", "Load PDF (spread)");
  setTitle(
    "#impositionLoadSpreadPdfBtn",
    "Use to check a spread PDF (such as a rough PPTX saved as PDF). Each spread is split into left and right pages first."
  );
  setText("#impositionPdfName", "No PDF loaded");
  setText("label[for='impositionPdfScalePercent']", "Scale (%)");
  setText("label[for='impositionPrintPaperSize']", "Print paper");
  setText("label[for='impositionFrontColXMM']", "Front col X (mm)");
  setText("label[for='impositionFrontRowYMM']", "Front row Y (mm)");
  setText("label[for='impositionBackColXMM']", "Back col X (mm)");
  setText("label[for='impositionBackRowYMM']", "Back row Y (mm)");
  setText("#impositionResetLayoutBtn", "Reset positions");
  const impBasic = document.querySelector(".imposition-print-basic");
  if (impBasic) impBasic.setAttribute("aria-label", "Imposition print (position)");
  const tipPaper = document.querySelector("#impositionPrintPaperSize");
  const tipPdfScale = document.querySelector("#impositionPdfScalePercent");
  const tipFrontCols = document.querySelector("#impositionFrontColXMM");
  const tipFrontRows = document.querySelector("#impositionFrontRowYMM");
  const tipBackCols = document.querySelector("#impositionBackColXMM");
  const tipBackRows = document.querySelector("#impositionBackRowYMM");
  const tipReset = document.querySelector("#impositionResetLayoutBtn");
  if (tipPaper) tipPaper.title = "Paper size for imposition print (actual size). Changing resets column/row positions to defaults for both 8-up and 16-up.";
  if (tipPdfScale) tipPdfScale.title = "Scale PDF content within each imposition slot.";
  if (tipFrontCols) tipFrontCols.title = "Front: left edge of each column from paper left edge (mm, CSV).";
  if (tipFrontRows) tipFrontRows.title = "Front: top edge of each row from paper top edge (mm, CSV).";
  if (tipBackCols) tipBackCols.title = "Back: left edge of each column from paper left edge (mm, CSV).";
  if (tipBackRows) tipBackRows.title = "Back: top edge of each row from paper top edge (mm, CSV).";
  if (tipReset) tipReset.title = "Recompute column X / row Y from paper, trim, and up count.";
  // ラベル本文だけを差し替える（textContent の代入はチェックボックス自体を消してしまう）。
  const setCheckLabel = (input, text, title) => {
    const label = input?.closest("label");
    if (!label) return;
    label.innerHTML = "";
    label.appendChild(input);
    label.appendChild(document.createTextNode(` ${text}`));
    label.title = title;
  };
  setCheckLabel(
    els.impositionShowPageLabel,
    "Show page labels",
    "Show the page number and article name in each slot. Handy when folding to check page order; turn it off to review the finished look."
  );
  setCheckLabel(
    els.impositionUse8up,
    "8-up imposition",
    "Turn on for signatures folded into 8 pages per sheet. Off means 16-up. Entering a map fold order turns this off automatically."
  );
  setText("label[for='impositionMapFoldInput']", "Map fold order (16 values)");
  if (els.impositionMapFoldInput) {
    els.impositionMapFoldInput.placeholder = "Example: 1,16,2,3,4,5,6,7,8,9,10,11,12,13,14,15";
    els.impositionMapFoldInput.title = "Define your own map-fold layout (16-up only). Enter 1..16 once each, in slot order: first 8 = front, last 8 = back. Each face fills left to right, top row first (portrait 4x2, landscape 2x4). Each number is the page position inside the signature (1 = first page). Entering a value turns both 8-up and 8P fold booklet off.";
  }
  setCheckLabel(
    els.impositionUse8pBooklet,
    "8P Fold Booklet",
    "For a one-sheet zine (magic fold) layout: fold one sheet into 8 and add a center slit to make a simple booklet imposition."
  );
  setCheckLabel(
    els.impositionSaddleStitch,
    "Saddle stitch (outside to inside)",
    "Turn on for saddle-stitched books. Pages are imposed so folds stack from the outermost sheet inward."
  );
  setText("#impositionPrintBtn", "Export Imposition PDF");
  setTitle(
    "#impositionPrintBtn",
    "Export the current imposition as a PDF. Print it double-sided and fold it to build a miniature book (use long-edge binding)."
  );
  setText("#impositionSaveParamsBtn", "Save print parameters");
  setTitle(
    "#impositionSaveParamsBtn",
    "Save this screen's settings (paper size, scale, front/back column X and row Y) into the flatplan data."
  );
  setText("#impositionCloseBtn", "Close");
  setTitle("#impositionCloseBtn", "Close the imposition simulation.");
  setText("#editorAssistToggleLabel", "Input assist");
  const bugBody = document.querySelector("#bugReportDialog .bug-report-body p");
  if (bugBody) {
    bugBody.textContent = "Please describe the issue. Message length is limited to 2000 characters.";
  }
  const bugEmailLabel = document.querySelector("label[for='bugReportEmail']");
  if (bugEmailLabel) bugEmailLabel.textContent = "Email (optional)";
  const bugMessageLabel = document.querySelector("label[for='bugReportMessage']");
  if (bugMessageLabel) bugMessageLabel.textContent = "Message (max 2000 chars)";
  if (els.bugReportEmail) els.bugReportEmail.placeholder = "you@example.com";
  if (els.bugReportMessage) els.bugReportMessage.placeholder = "What happened, expected behavior, and actual behavior";
  const editorHelp = document.querySelector("#editorAssist .editor-help");
  if (editorHelp) {
    editorHelp.textContent =
      "When Input assist is ON: type // at line start (after whitespace) to start assist, or click fields to open assist. Use Up/Down to choose, Right Arrow to accept. For page counts, Up/Down adjusts the number and Right Arrow accepts. Enter inserts a newline and exits assist. Esc exits assist.";
  }
  const helpBody = document.querySelector("#helpDialog .help-body");
  if (helpBody) {
    helpBody.innerHTML = `
      <p class="help-lead">Quick reference. See <code>USAGE.md</code> for narrative docs.</p>
      <h4>Board &amp; colors</h4>
      <ul class="help-ref">
        <li>Bands: Large / Middle / Small. White = OK, pink = over, light blue = under.</li>
        <li>Bottom <strong>status strip</strong>: light gray by ink count (1C–4C; front/back may differ). Workflow text verbatim (no keyword colors).</li>
        <li>Right opening: pages right-to-left. Hover bands/inserts for desk, deadline, status, memo, etc.</li>
      </ul>
      <h4>Text format (<code>//</code> lines, TAB fields)</h4>
      <ul class="help-ref">
        <li>Shorthand heads: extra <code>/</code> after <code>//</code> maps to large/middle/small (see <code>USAGE.md</code>).</li>
        <li><code>//pages</code>: expressions OK. Article pages: one decimal for mid-page changes.</li>
        <li><code>//start-page</code>: first Arabic folio in the body (default <code>1</code>).</li>
        <li><code>//body-folio-start</code>: flatplan position where Arabic folios begin (default <code>1</code>). Earlier pages use lowercase Roman numerals (<code>i</code>, <code>ii</code>…). Example: <code>5</code> → i–iv, then 1, 2, 3… from page 5.</li>
        <li><code>//opening</code>: <code>left</code> (default) / <code>right</code>.</li>
        <li><code>//board</code>: duplex <code>4C1C</code> (first = imposition <strong>front</strong> ink, second = <strong>back</strong>) or split tokens; missing fields inherit. 8-page boards still use 16 slots. Ink count sets the status-strip shade.</li>
        <li><code>//insert</code> board <code>0</code> = front block. <code>//hold</code> anywhere. <code>//*</code> comment.</li>
        <li><code>//hyoshi</code> (cover) / <code>//cover</code> (dust jacket) / <code>//obi</code> / <code>//appendix</code>: page count first (like <code>//large</code>), fields from <code>//toc-article-fields</code> when set; each item numbered 1… on its board strip.</li>
        <li><code>-</code> on board/hover uses previous value; Article List shows <code>-</code> as typed.</li>
      </ul>
      <h4>Assist mode</h4>
      <ul class="help-ref">
        <li>Editor <strong>Input assist</strong> ON only. Up/Down, Right arrow, Enter—see assist panel.</li>
        <li>Top <strong>English Mode</strong> → <code>?mode=en</code>; directives like <code>//large</code>, <code>//board</code>.</li>
      </ul>
      <h4>Hosted app (<code>/api/session</code>)</h4>
      <ul class="help-ref">
        <li><code>uiTheme</code>, Drive <code>data</code>, <code>share</code>/<code>syncEndpoint</code> → <code>USAGE.md</code>.</li>
      </ul>
      <h4>Actions</h4>
      <ul class="help-ref">
        <li>Editor: save .dwml, Close applies. <strong>Print</strong> = A4 board. List = table, CSV, print.</li>
        <li><strong>Imposition</strong>: boards in <strong>typed order</strong>. Print placement = paper preset for col X / row Y (mm), then fine-tune mm + scale. Front/Back only for simplex. Seven-Eleven: long-edge duplex.</li>
        <li><strong>Export Rough PPTX</strong>: spread rough PPTX with a slide width of two trim pages (e.g. A4 portrait → A3 landscape), laid out per <code>//opening</code> (right opening = kata-okoshi / 片起こし). Page headers show <code>//large</code>, <code>//middle</code>, and <code>//small</code> article names; duplicate combinations get a serial number. Metadata is embedded in the PPTX. Edit in PowerPoint, export to PDF, then use <strong>Load PDF (spread)</strong>. Export may take <strong>several seconds to tens of seconds</strong>; a <strong>Processing…</strong> overlay is shown until finished.</li>
        <li><strong>Update / Export PPTX</strong>: opens an options dialog with <strong>single-page output</strong> and <strong>hide TOC/page labels</strong>. With no checks, behavior is the same as spread update. Matching pages copy edited shapes from the source PPTX (bottom article level → upper levels → serial number). A <strong>Processing…</strong> overlay is shown until finished.</li>
        <li><strong>Load PDF (spread)</strong>: splits spread PDFs into single pages in flatplan order (1, 2, 3…). Irregular board selection (e.g. <code>1 4 2 3</code>) still maps each slot by its global page number; the PDF must contain the <strong>full</strong> flatplan page sequence.</li>
        <li><strong>Spine marks</strong>: when pages <strong>1–16</strong> (16-up) or <strong>1–8</strong> (8-up) are <strong>adjacent</strong> on the rendered grid, centered on the fold. <code>//title</code> (first 15 graphemes) + fold index in 《…》, numbered in print order. Light fold line with a clear gap around type. Portrait = vertical type; landscape = horizontal. Some layouts (e.g. horizontal 16-up) may omit marks.</li>
        <li>List Cancel discards; backdrop does not close. Drag-and-drop on the board.</li>
      </ul>
      <h4>More</h4>
      <ul class="help-ref">
        <li>Samples: <a href="https://github.com/hortense667/AutoDaiwarer" target="_blank" rel="noopener noreferrer">GitHub</a>.</li>
        <li>No warranty; support not guaranteed.</li>
      </ul>
    `;
  }
}

function bindUI() {
  enableDialogDrag(els.editorDialog, "textarea, button, input, select, .dialog-actions");
  bindEditorUrlOpen(els.editorText);
  bindEditorAssist(els.editorText);
  bindEditorSearch();
  bindBugReportUI();
  if (els.restoreBackupBtn) {
    els.restoreBackupBtn.classList.toggle("hidden", !isShareEditorMode());
  }
  const cancelEditorDialog = () => {
    els.editorText.value = state.editorSnapshotText;
    clearEditorLintMirror();
    clearEditorAssist();
    els.editorDialog.close();
  };
  const closeEditorDialog = async (withApply = false) => {
    if (withApply) {
      const text = normalizeEditorDirectiveText(els.editorText.value);
      const applied = await applyEditorTextToBoard(text, {
        clear: "before-clear-close-editor",
        change: "before-close-editor-apply",
      });
      if (!applied) return;
    } else {
      clearEditorLintMirror();
    }
    clearEditorAssist();
    els.editorDialog.close();
  };
  const applyEditorTextToBoard = async (text, reasons = {}) => {
    if (isShareEditorMode()) {
      const backupSource = resolveBackupSource();
      const beforeTrimmed = backupSource.trim();
      const afterTrimmed = text.trim();
      if (!afterTrimmed && beforeTrimmed) {
        const okToClear = window.confirm(
          LOCALE === "en"
            ? "This will clear all data in share mode. Create backup and continue?"
            : "shareモードで全体を消去します。バックアップを作成して続行しますか？",
        );
        if (!okToClear) return false;
        createShareBackup(reasons.clear || "before-clear-apply", state.rawText || backupSource);
      } else if (beforeTrimmed && backupSource !== text) {
        createShareBackup(reasons.change || "before-apply-board", backupSource);
      }
    }
    const gate = await confirmFlatplanTextWithLint(text, { showEditorMirror: true });
    if (!gate.ok) return false;
    try {
      commitFlatplanText(gate.text);
      return true;
    } catch (error) {
      console.error(error);
      window.alert(
        LOCALE === "en"
          ? "The input format seems invalid and could not be applied to the board."
          : "入力形式に問題があり、台割に反映できませんでした。",
      );
      return false;
    }
  };
  bindDialogBackdropCancel(els.helpDialog, () => {
    els.helpDialog.close();
  });
  if (els.englishModeToggle) {
    els.englishModeToggle.checked = LOCALE === "en";
    els.englishModeToggle.addEventListener("change", () => {
      let next;
      try {
        next = new URL(window.location.href);
      }
      catch {
        return;
      }
      if (els.englishModeToggle.checked) {
        next.searchParams.set("mode", "en");
      } else if (String(next.searchParams.get("mode") || "").trim().toLowerCase() === "en") {
        next.searchParams.delete("mode");
      }
      const currentHref = `${window.location.pathname}${window.location.search}${window.location.hash}`;
      const nextHref = `${next.pathname}${next.search}${next.hash}`;
      if (nextHref !== currentHref) window.location.assign(nextHref);
    });
  }

  document.querySelector("#editBtn").addEventListener("click", () => {
    const sourceText = normalizeEditorDirectiveText(state.rawText || "");
    state.editorSnapshotText = sourceText;
    els.editorText.value = state.editorSnapshotText;
    if (els.restoreBackupBtn) {
      const inShareMode = isShareEditorMode();
      els.restoreBackupBtn.classList.toggle("hidden", !inShareMode);
      const hasBackup = inShareMode && readShareBackups().length > 0;
      els.restoreBackupBtn.disabled = !hasBackup;
      els.restoreBackupBtn.title = hasBackup
        ? ""
        : (LOCALE === "en" ? "No backup for current share ID" : "現在のshare IDにはバックアップがありません");
    }
    clearEditorLintMirror();
    clearEditorSampleAppliedFeedback();
    clearEditorAssist();
    if (els.editorAssistToggle) els.editorAssistToggle.checked = isEditorAssistEnabled();
    updateEditorAssistChrome();
    refreshEditorAssist(els.editorText);
    updateEditorSampleGhost();
    els.editorDialog.showModal();
  });

  els.editorText?.addEventListener("input", () => {
    updateEditorSampleGhost();
  });

  els.editorText?.addEventListener("beforeinput", () => {
    if (isEditorTextBlank(els.editorText?.value)) {
      els.editorSampleGhost?.classList.add("hidden");
      els.insertSampleBtn?.classList.remove("is-sample-invite");
    }
  });

  els.fileSaveBtn?.addEventListener("click", async () => {
    const text = normalizeEditorDirectiveText(els.editorText.value);
    window.alert(
      LOCALE === "en"
        ? "Changes will be applied to the board, then downloaded as a .dwml file (recommended AutoDaiwarer format — UTF-8 plain text)."
        : "変更を台割に反映したうえで、推奨形式の .dwml でダウンロードします（中身は UTF-8 のプレーンテキストです。 .txt として扱っても構いません）。",
    );
    const applied = await applyEditorTextToBoard(text, {
      clear: "before-clear-save-to-file",
      change: "before-save-to-file",
    });
    if (!applied) return;
    const fileNameInfo = resolveDownloadBaseName(text, state.meta.filename, state.meta.version);
    if (fileNameInfo.notice) window.alert(fileNameInfo.notice);
    downloadText(text, fileNameInfo.baseName, ".dwml");
  });

  document.querySelector("#cancelEditBtn").addEventListener("click", () => {
    cancelEditorDialog();
  });

  els.closeEditorBtn?.addEventListener("click", () => {
    void closeEditorDialog(true);
  });

  els.pickFileBtn?.addEventListener("click", () => {
    els.fileLoader?.click();
  });

  els.fileLoader?.addEventListener("change", () => {
    const file = els.fileLoader.files?.[0];
    if (!file) return;
    file.text().then(async (text) => {
      if (isShareEditorMode()) {
        const proceed = window.confirm(
          LOCALE === "en"
            ? "Load this file in share mode? Current editor text will be backed up."
            : "shareモードでこのファイルを読み込みますか？現在の内容はバックアップされます。",
        );
        if (!proceed) {
          try {
            els.fileLoader.value = "";
          }
          catch (_e) {}
          return;
        }
        createShareBackup("before-load-file", resolveBackupSource());
      }
      const normalized = normalizeEditorDirectiveText(text);
      els.editorText.value = normalized;
      clearEditorAssist();
      refreshEditorAssist(els.editorText);
      await applyEditorTextToBoard(normalized, {
        clear: "before-clear-load-file",
        change: "before-load-file-apply",
      });
      try {
        els.fileLoader.value = "";
      }
      catch (_e) {}
    });
  });

  els.insertSampleBtn?.addEventListener("click", () => {
    if (isShareEditorMode()) {
      const proceed = window.confirm(
        LOCALE === "en"
          ? "Insert sample text in share mode? Current editor text will be backed up."
          : "shareモードでサンプル入力しますか？現在の内容はバックアップされます。",
      );
      if (!proceed) return;
      createShareBackup("before-insert-sample", resolveBackupSource());
    }
    const sampleText = getEditorSampleText();
    const start = els.editorText.selectionStart ?? 0;
    const end = els.editorText.selectionEnd ?? start;
    const before = els.editorText.value.slice(0, start);
    const after = els.editorText.value.slice(end);
    els.editorText.value = `${before}${sampleText}${after}`;
    clearEditorAssist();
    refreshEditorAssist(els.editorText);
    updateEditorSampleGhost();
    showEditorSampleAppliedFeedback();
    els.editorText.focus();
    const nextPos = before.length + sampleText.length;
    els.editorText.setSelectionRange(nextPos, nextPos);
  });

  els.restoreBackupBtn?.addEventListener("click", () => {
    if (!isShareEditorMode()) return;
    const backups = readShareBackups();
    if (backups.length === 0) {
      window.alert(LOCALE === "en" ? "No backup found for this share ID." : "この share ID のバックアップがありません。");
      return;
    }
    const latest = backups[0];
    const proceed = window.confirm(
      LOCALE === "en"
        ? `Restore latest backup?\n${formatBackupTimestamp(latest.ts)} / ${latest.reason}`
        : `最新バックアップを復元しますか？\n${formatBackupTimestamp(latest.ts)} / ${latest.reason}`,
    );
    if (!proceed) return;
    els.editorText.value = latest.text;
    clearEditorAssist();
    refreshEditorAssist(els.editorText);
    els.editorText.focus();
  });

  els.recalcPagesBtn?.addEventListener("click", () => {
    const textarea = els.editorText;
    const start = textarea.selectionStart ?? 0;
    const end = textarea.selectionEnd ?? start;
    const nextText = recalcHierarchyPageCounts(textarea.value);
    textarea.value = nextText;
    clearEditorAssist();
    refreshEditorAssist(textarea);
    textarea.focus();
    const nextStart = Math.min(start, nextText.length);
    const nextEnd = Math.min(end, nextText.length);
    textarea.setSelectionRange(nextStart, nextEnd);
  });

  const revisionLogDialog = document.querySelector("#revisionLogDialog");
  const inlineNoteDialog = document.querySelector("#inlineNoteDialog");
  const inlineNoteCtx = { insertAt: 0, lead: "" };

  document.querySelector("#addRevisionLogBtn")?.addEventListener("click", () => {
    const dt = document.querySelector("#revisionLogDatetime");
    const auth = document.querySelector("#revisionLogAuthor");
    const body = document.querySelector("#revisionLogBody");
    if (dt) dt.value = formatTimestampForLog();
    if (auth) auth.value = "";
    if (body) body.value = "";
    revisionLogDialog?.showModal();
  });
  document.querySelector("#revisionLogCancelBtn")?.addEventListener("click", () => revisionLogDialog?.close());
  document.querySelector("#revisionLogSaveBtn")?.addEventListener("click", () => {
    const ts = document.querySelector("#revisionLogDatetime")?.value || formatTimestampForLog();
    const author = document.querySelector("#revisionLogAuthor")?.value || "";
    const body = document.querySelector("#revisionLogBody")?.value || "";
    const line = formatRevisionLogLine(ts, author, body);
    const ta = els.editorText;
    const v = ta.value;
    ta.value = insertRevisionLogBeforeFooter(v, line);
    revisionLogDialog?.close();
    clearEditorAssist();
    refreshEditorAssist(ta);
  });
  if (revisionLogDialog) {
    bindDialogBackdropCancel(revisionLogDialog, () => revisionLogDialog.close());
  }

  els.editorText?.addEventListener("dblclick", (ev) => {
    const ta = els.editorText;
    if (!ta) return;
    const pos = ta.selectionStart ?? 0;
    const { end, line } = getLineRangeAtOffset(ta.value, pos);
    inlineNoteCtx.insertAt = end;
    inlineNoteCtx.lead = (line.match(/^(\s*)/) || [, ""])[1] || "";
    if (document.querySelector("#inlineNoteDatetime")) {
      document.querySelector("#inlineNoteDatetime").value = formatTimestampForLog();
    }
    if (document.querySelector("#inlineNoteAuthor")) {
      document.querySelector("#inlineNoteAuthor").value = "";
    }
    if (document.querySelector("#inlineNoteBody")) {
      document.querySelector("#inlineNoteBody").value = "";
    }
    inlineNoteDialog?.showModal();
    ev.preventDefault();
  });
  document.querySelector("#inlineNoteCancelBtn")?.addEventListener("click", () => inlineNoteDialog?.close());
  document.querySelector("#inlineNoteSaveBtn")?.addEventListener("click", () => {
    const ta = els.editorText;
    if (!ta) return;
    const text = ta.value;
    const ts = document.querySelector("#inlineNoteDatetime")?.value || formatTimestampForLog();
    const author = document.querySelector("#inlineNoteAuthor")?.value || "";
    const body = document.querySelector("#inlineNoteBody")?.value || "";
    const mid = `${inlineNoteCtx.lead}${formatInlineNoteLine(ts, author, body)}`;
    const before = text.slice(0, inlineNoteCtx.insertAt);
    const glue = before.length && !before.endsWith("\n") ? "\n" : "";
    ta.value = before + glue + mid + text.slice(inlineNoteCtx.insertAt);
    inlineNoteDialog?.close();
    clearEditorAssist();
    refreshEditorAssist(ta);
  });
  if (inlineNoteDialog) {
    bindDialogBackdropCancel(inlineNoteDialog, () => inlineNoteDialog.close());
  }

  bindEditorWrapToggle();
  bindEditorAssistToggle();
  bindDwmlLintDialog();
  els.editorText?.addEventListener("scroll", syncEditorLintMirrorScroll);

  const openArticleDialog = () => {
    state.articleListSnapshotText = serializeState();
    renderArticleList();
    els.articleDialog.showModal();
  };

  const cancelArticleDialog = () => {
    const snapshot = String(state.articleListSnapshotText || "");
    if (snapshot) {
      loadFromText(snapshot);
    }
    state.articleListSnapshotText = "";
    els.articleDialog.close();
  };

  const closeArticleDialogWithApply = () => {
    if (articleListEditState.active && articleListEditState.cell) {
      commitArticleCellEdit({ sourceCell: articleListEditState.cell });
    }
    const text = serializeState();
    state.rawText = text;
    state.editorSnapshotText = text;
    state.textDirty = false;
    rerender();
    try {
      localStorage.setItem(LOCAL_KEY, text);
    } catch (_error) {}
    state.articleListSnapshotText = "";
    els.articleDialog.close();
  };

  document.querySelector("#listBtn").addEventListener("click", openArticleDialog);

  document.querySelector("#helpBtn").addEventListener("click", () => {
    resetHelpDialogScroll();
    els.helpDialog.showModal();
  });
  document.querySelector("#openBugReportBtn")?.addEventListener("click", () => {
    openBugReportDialog();
  });

  document.querySelector("#topPrintBtn").addEventListener("click", () => {
    document.body.classList.remove("print-article-list");
    document.body.classList.remove("print-imposition");
    window.print();
  });

  document.querySelector("#impositionBtn")?.addEventListener("click", () => {
    void openImpositionDialog();
  });

  document.querySelector("#cancelListBtn")?.addEventListener("click", cancelArticleDialog);
  document.querySelector("#closeListBtn").addEventListener("click", closeArticleDialogWithApply);

  document.querySelector("#closeHelpBtn").addEventListener("click", () => {
    els.helpDialog.close();
  });
  if (els.impositionDialog) {
    bindDialogBackdropCancel(els.impositionDialog, () => els.impositionDialog.close());
  }

  document.querySelector("#printBtn").addEventListener("click", () => {
    printArticleList();
  });
  document.querySelector("#impositionPrintBtn")?.addEventListener("click", () => {
    void printImpositionSimulation();
  });
  els.impositionSaveParamsBtn?.addEventListener("click", () => {
    saveImpositionPrintParamsToWorkingText();
  });
  document.querySelector("#impositionCloseBtn")?.addEventListener("click", () => {
    els.impositionDialog?.close();
  });
  els.impositionBoardInput?.addEventListener("input", () => {
    state.impositionOptions.targetText = String(els.impositionBoardInput?.value || "");
    void renderImpositionPreview();
  });
  els.impositionShowPageLabel?.addEventListener("change", () => {
    state.impositionOptions.showPageLabel = Boolean(els.impositionShowPageLabel?.checked);
    void renderImpositionPreview();
  });
  els.impositionUse8up?.addEventListener("change", () => {
    const nextUse8up = Boolean(els.impositionUse8up?.checked);
    if (nextUse8up && hasImpositionMapFoldText(state.impositionOptions.mapFoldText)) {
      state.impositionOptions.mapFoldText = "";
      if (els.impositionMapFoldInput) els.impositionMapFoldInput.value = "";
    }
    if (nextUse8up) {
      state.impositionOptions.use8pBooklet = false;
      if (els.impositionUse8pBooklet) els.impositionUse8pBooklet.checked = false;
    }
    const currentPaperSize = normalizeImpositionPrintPaperSize(
      els.impositionPrintPaperSize?.value
      || getImpositionPrintLayoutForCurrentMode(state.meta, state.impositionOptions.use8up).printPaperSize,
    );
    const scale = normalizeImpositionPdfScalePercent(
      els.impositionPdfScalePercent?.value
      ?? getImpositionPrintLayoutForCurrentMode(state.meta, state.impositionOptions.use8up).pdfScalePercent,
    );
    state.impositionOptions.use8up = nextUse8up;
    if (!state.meta) state.meta = {};
    const horizontalTrim = isHorizontalTrimSize(state.meta?.trimSize);
    const targetShape = getImpositionGridShape(nextUse8up, horizontalTrim);
    const targetLayoutRaw = nextUse8up ? state.meta.impositionPrint8Up : state.meta.impositionPrint16Up;
    const storedPaper = normalizeImpositionPrintPaperSize(targetLayoutRaw?.printPaperSize);
    // 保存済み位置が別の印刷判型向けなら、現判型のデフォルトで作り直す（紙サイズだけ差し替えるとズレる）。
    const useStoredPositions = storedPaper === currentPaperSize
      && hasImpositionPosList(targetLayoutRaw?.frontColXMMText, targetShape.cols)
      && hasImpositionPosList(targetLayoutRaw?.frontRowYMMText, targetShape.rows)
      && hasImpositionPosList(targetLayoutRaw?.backColXMMText, targetShape.cols)
      && hasImpositionPosList(targetLayoutRaw?.backRowYMMText, targetShape.rows);
    const seeded = useStoredPositions
      ? normalizeImpositionPrintLayout(
        { ...targetLayoutRaw, printPaperSize: currentPaperSize, pdfScalePercent: scale },
        targetShape,
      )
      : buildDefaultImpositionPrintLayout({
        printPaperSize: currentPaperSize,
        pdfScalePercent: scale,
        use8up: nextUse8up,
        horizontalTrim,
        trimText: getEffectiveTrimSizeText(state.meta),
      });
    if (nextUse8up) {
      state.meta.impositionPrint8Up = seeded;
    } else {
      state.meta.impositionPrint16Up = seeded;
    }
    syncImpositionDialogInputsFromMeta();
    void renderImpositionPreview();
  });
  els.impositionMapFoldInput?.addEventListener("input", () => {
    state.impositionOptions.mapFoldText = String(els.impositionMapFoldInput?.value || "");
    if (hasImpositionMapFoldText(state.impositionOptions.mapFoldText)) {
      state.impositionOptions.use8up = false;
      if (els.impositionUse8up) els.impositionUse8up.checked = false;
      state.impositionOptions.use8pBooklet = false;
      if (els.impositionUse8pBooklet) els.impositionUse8pBooklet.checked = false;
      syncImpositionDialogInputsFromMeta();
    }
    void renderImpositionPreview();
  });
  els.impositionUse8pBooklet?.addEventListener("change", () => {
    const nextUse8pBooklet = Boolean(els.impositionUse8pBooklet?.checked);
    if (nextUse8pBooklet && isHorizontalTrimSize(state.meta?.trimSize)) {
      window.alert(
        LOCALE === "en"
          ? "8P fold booklet is available only for portrait trim."
          : "8P折本は縦判のときだけ使えます。",
      );
      state.impositionOptions.use8pBooklet = false;
      if (els.impositionUse8pBooklet) els.impositionUse8pBooklet.checked = false;
      return;
    }
    state.impositionOptions.use8pBooklet = nextUse8pBooklet;
    if (nextUse8pBooklet) {
      state.impositionOptions.use8up = false;
      if (els.impositionUse8up) els.impositionUse8up.checked = false;
      state.impositionOptions.mapFoldText = "";
      if (els.impositionMapFoldInput) els.impositionMapFoldInput.value = "";
      syncImpositionDialogInputsFromMeta();
    }
    void renderImpositionPreview();
  });
  els.impositionSaddleStitch?.addEventListener("change", () => {
    state.impositionOptions.saddleStitch = Boolean(els.impositionSaddleStitch?.checked);
    void renderImpositionPreview();
  });
  els.impositionPdfScalePercent?.addEventListener("input", () => {
    applyImpositionPrintLayoutInputsToMeta();
    void renderImpositionPreview();
  });
  els.impositionPrintPaperSize?.addEventListener("change", () => {
    // 8面／16面は別保存のため、判型変更時は両方を現判型のデフォルト位置へ揃える。
    resetImpositionPrintLayoutToDefaults({ keepPaperSize: true, bothModes: true });
    void renderImpositionPreview();
  });
  els.impositionFrontColXMM?.addEventListener("input", () => {
    applyImpositionPrintLayoutInputsToMeta();
    void renderImpositionPreview();
  });
  els.impositionFrontRowYMM?.addEventListener("input", () => {
    applyImpositionPrintLayoutInputsToMeta();
    void renderImpositionPreview();
  });
  els.impositionBackColXMM?.addEventListener("input", () => {
    applyImpositionPrintLayoutInputsToMeta();
    void renderImpositionPreview();
  });
  els.impositionBackRowYMM?.addEventListener("input", () => {
    applyImpositionPrintLayoutInputsToMeta();
    void renderImpositionPreview();
  });
  els.impositionResetLayoutBtn?.addEventListener("click", () => {
    resetImpositionPrintLayoutToDefaults({ keepPaperSize: true });
    void renderImpositionPreview();
  });
  els.impositionExportSpreadPptxBtn?.addEventListener("click", () => {
    void exportImpositionRoughSpreadPptx();
  });
  els.impositionUpdateSpreadPptxBtn?.addEventListener("click", () => {
    openImpositionPptxDialog();
  });
  els.impositionPptxDialogCancelBtn?.addEventListener("click", () => {
    closeImpositionPptxDialog();
  });
  els.impositionPptxDialogRunBtn?.addEventListener("click", () => {
    void runImpositionPptxUpdateFromDialog();
  });
  els.impositionLoadPdfBtn?.addEventListener("click", () => {
    impositionPdfLoadMode = "single";
    els.impositionPdfLoader?.click();
  });
  els.impositionLoadSpreadPdfBtn?.addEventListener("click", () => {
    impositionPdfLoadMode = "spread";
    els.impositionPdfLoader?.click();
  });
  els.impositionPdfLoader?.addEventListener("change", () => {
    const file = els.impositionPdfLoader?.files?.[0];
    if (!file) return;
    if (impositionPdfLoadMode === "spread") {
      void loadImpositionSpreadPdfFile(file);
      return;
    }
    void loadImpositionPdfFile(file);
  });

  document.querySelector("#csvBtn").addEventListener("click", () => {
    downloadArticleCsv();
  });
  document.querySelector("#tocDraftBtn")?.addEventListener("click", openTocDraftDialog);
  document.querySelector("#tocDraftFromListBtn")?.addEventListener("click", openTocDraftDialog);
  document.querySelector("#tocDraftCopyBtn")?.addEventListener("click", () => {
    void copyTocDraftToClipboard();
  });
  document.querySelector("#tocDraftDownloadBtn")?.addEventListener("click", downloadTocDraftText);
  document.querySelector("#tocDraftCloseBtn")?.addEventListener("click", closeTocDraftDialog);
  for (const sel of [els.tocDraftDepth, els.tocDraftStyle, els.tocDraftIncludeTitle]) {
    sel?.addEventListener("change", refreshTocDraftPreview);
  }
  if (els.tocDraftDialog) {
    bindDialogBackdropCancel(els.tocDraftDialog, closeTocDraftDialog);
  }
  document.querySelector("#aiDraftBtn")?.addEventListener("click", openAiDraftDialog);
  document.querySelector("#aiDraftSaveUrlBtn")?.addEventListener("click", saveAiDraftGptUrlFromDialog);
  document.querySelector("#aiDraftLaunchBtn")?.addEventListener("click", () => {
    void launchCustomGptWithMemo();
  });
  document.querySelector("#aiDraftApplyBtn")?.addEventListener("click", () => {
    void applyAiDraftImport();
  });
  document.querySelector("#aiDraftCloseBtn")?.addEventListener("click", closeAiDraftDialog);
  els.aiDraftImportPreview?.addEventListener("paste", (event) => {
    const pasted = event.clipboardData?.getText() ?? "";
    if (!pasted) return;
    event.preventDefault();
    const cleaned = normalizeDwmlFromClipboard(pasted);
    const el = els.aiDraftImportPreview;
    if (!el) return;
    const start = el.selectionStart ?? el.value.length;
    const end = el.selectionEnd ?? start;
    el.value = `${el.value.slice(0, start)}${cleaned}${el.value.slice(end)}`;
    const pos = start + cleaned.length;
    el.selectionStart = pos;
    el.selectionEnd = pos;
  });
  els.aiDraftMemo?.addEventListener("input", persistAiDraftMemo);
  els.aiDraftIncludeFlatplan?.addEventListener("change", persistAiDraftIncludeFlatplanPreference);
  if (els.aiDraftDialog) {
    bindDialogBackdropCancel(els.aiDraftDialog, closeAiDraftDialog);
  }
  bindBoardWidthHandle();
  window.addEventListener("resize", updateBoardWidthHandlePosition);
  updateBoardWidthHandlePosition();
}

function isEditorWrapEnabled() {
  const saved = localStorage.getItem(EDITOR_WRAP_KEY);
  if (saved === "off") return false;
  return true;
}

function getRoughPptxOptionsFromDialog() {
  return {
    singlePage: Boolean(els.impositionPptxSinglePage?.checked),
    hideLabels: Boolean(els.impositionPptxHideLabels?.checked),
  };
}

function openImpositionPptxDialog() {
  const dialog = els.impositionPptxDialog;
  if (!dialog) return;
  if (typeof dialog.showModal === "function") dialog.showModal();
}

function closeImpositionPptxDialog() {
  const dialog = els.impositionPptxDialog;
  if (!dialog) return;
  if (dialog.open) dialog.close();
}

function pickPptxFileForUpdate() {
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pptx,application/vnd.openxmlformats-officedocument.presentationml.presentation";
    input.style.display = "none";
    const cleanup = () => {
      input.remove();
    };
    input.addEventListener("change", () => {
      const file = input.files?.[0] || null;
      cleanup();
      resolve(file);
    }, { once: true });
    document.body.appendChild(input);
    input.click();
  });
}

async function runImpositionPptxUpdateFromDialog() {
  const options = getRoughPptxOptionsFromDialog();
  closeImpositionPptxDialog();
  const sourceFile = await pickPptxFileForUpdate();
  if (!sourceFile) return;
  await updateImpositionRoughSpreadPptxFromFile(sourceFile, options);
}

function applyEditorWrapState(enabled, persist = true) {
  const textarea = els.editorText;
  const checkbox = els.editorWrapToggle;
  if (!textarea || !checkbox) return;
  const on = Boolean(enabled);
  textarea.wrap = on ? "soft" : "off";
  textarea.classList.toggle("wrap-off", !on);
  checkbox.checked = on;
  if (persist) localStorage.setItem(EDITOR_WRAP_KEY, on ? "on" : "off");
}

function bindEditorWrapToggle() {
  const checkbox = els.editorWrapToggle;
  if (!checkbox) return;
  applyEditorWrapState(isEditorWrapEnabled(), false);
  checkbox.addEventListener("change", () => {
    applyEditorWrapState(Boolean(checkbox.checked), true);
  });
}

function isEditorAssistEnabled() {
  return localStorage.getItem(EDITOR_ASSIST_KEY) === "on";
}

function updateEditorAssistChrome() {
  const panel = document.querySelector("#editorAssist");
  if (panel) panel.classList.toggle("hidden", !isEditorAssistEnabled());
}

function applyEditorAssistState(enabled, persist = true) {
  const checkbox = els.editorAssistToggle;
  if (!checkbox) return;
  const on = Boolean(enabled);
  checkbox.checked = on;
  if (persist) localStorage.setItem(EDITOR_ASSIST_KEY, on ? "on" : "off");
  updateEditorAssistChrome();
  if (els.editorText) refreshEditorAssist(els.editorText);
}

function bindEditorAssistToggle() {
  const checkbox = els.editorAssistToggle;
  if (!checkbox) return;
  checkbox.checked = isEditorAssistEnabled();
  updateEditorAssistChrome();
  checkbox.addEventListener("change", () => {
    applyEditorAssistState(Boolean(checkbox.checked), true);
  });
}

function bindEditorSearch() {
  const searchInput = els.editorSearchInput;
  const textarea = els.editorText;
  if (!searchInput || !textarea) return;

  const clearSearchHitHighlight = () => {
    textarea.classList.remove(SEARCH_HIT_CLASS);
  };

  const ensureSearchHitVisible = (start, end) => {
    const style = window.getComputedStyle(textarea);
    const lineHeight = Number.parseFloat(style.lineHeight) || Number.parseFloat(style.fontSize) * 1.4 || 18;
    const padding = Math.max(4, lineHeight * 0.4);
    const topLimit = padding;
    const bottomLimit = textarea.clientHeight - lineHeight - padding;
    const startPos = getTextareaCaretPixelPosition(textarea, start);
    const endPos = getTextareaCaretPixelPosition(textarea, end);
    if (startPos.top < topLimit) {
      textarea.scrollTop += startPos.top - topLimit;
      return;
    }
    if (endPos.top > bottomLimit) {
      textarea.scrollTop += endPos.top - bottomLimit;
    }
  };

  const runSearch = (direction) => {
    clearSearchHitHighlight();
    const query = searchInput.value;
    if (!query) return;
    const text = textarea.value;
    if (!text) return;
    const queryLen = query.length;
    let idx = -1;
    if (direction === "prev") {
      const from = Math.max(0, (textarea.selectionStart ?? 0) - 1);
      idx = text.lastIndexOf(query, from);
      if (idx < 0) idx = text.lastIndexOf(query);
    } else {
      const from = Math.max(0, textarea.selectionEnd ?? 0);
      idx = text.indexOf(query, from);
      if (idx < 0) idx = text.indexOf(query, 0);
    }
    if (idx < 0) return;
    textarea.focus();
    textarea.setSelectionRange(idx, idx + queryLen);
    ensureSearchHitVisible(idx, idx + queryLen);
    textarea.classList.add(SEARCH_HIT_CLASS);
    refreshEditorAssist(textarea);
  };

  els.searchNextBtn?.addEventListener("click", () => runSearch("next"));
  els.searchPrevBtn?.addEventListener("click", () => runSearch("prev"));
  searchInput.addEventListener("keydown", (ev) => {
    if (ev.key !== "Enter") return;
    runSearch(ev.shiftKey ? "prev" : "next");
    ev.preventDefault();
  });
  textarea.addEventListener("input", clearSearchHitHighlight);
  textarea.addEventListener("click", clearSearchHitHighlight);
  textarea.addEventListener("keydown", clearSearchHitHighlight);
  searchInput.addEventListener("input", clearSearchHitHighlight);
}

function bindBugReportUI() {
  bindDialogBackdropCancel(els.bugReportDialog, () => {
    els.bugReportDialog?.close();
  });
  const savedEmail = localStorage.getItem(BUG_REPORT_EMAIL_KEY);
  if (savedEmail && els.bugReportEmail) {
    els.bugReportEmail.value = savedEmail;
  }
  els.bugReportMessage?.addEventListener("input", () => {
    updateBugReportCounter();
  });
  document.querySelector("#cancelBugReportBtn")?.addEventListener("click", () => {
    els.bugReportDialog?.close();
  });
  document.querySelector("#submitBugReportBtn")?.addEventListener("click", () => {
    void submitBugReport();
  });
  updateBugReportCounter();
}

function resetHelpDialogScroll() {
  if (!els.helpDialog) return;
  els.helpDialog.scrollTop = 0;
  const body = els.helpDialog.querySelector(".help-body");
  if (body) body.scrollTop = 0;
}

function updateBugReportCounter() {
  if (!els.bugReportCounter) return;
  const length = String(els.bugReportMessage?.value || "").length;
  els.bugReportCounter.textContent = `${length} / ${BUG_REPORT_MAX_MESSAGE_LENGTH}`;
}

function openBugReportDialog() {
  if (!bugReportState.endpoint) {
    window.alert(
      LOCALE === "en"
        ? "Bug report endpoint is not configured on this site."
        : "このサイトではバグレポート送信先が未設定です。",
    );
    return;
  }
  if (els.bugReportEmail) {
    const savedEmail = localStorage.getItem(BUG_REPORT_EMAIL_KEY);
    els.bugReportEmail.value = savedEmail || els.bugReportEmail.value || "";
  }
  if (els.bugReportMessage) {
    els.bugReportMessage.value = "";
  }
  updateBugReportCounter();
  els.bugReportDialog?.showModal();
}

function isValidBugReportEmail(email) {
  if (!email) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function buildBugReportSignature(email, message) {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const normalizedMessage = String(message || "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase()
    .slice(0, 600);
  return `${normalizedEmail}|${normalizedMessage}`;
}

async function submitBugReport() {
  if (bugReportState.isSubmitting) return;
  if (!bugReportState.endpoint) return;
  const email = String(els.bugReportEmail?.value || "").trim();
  const messageRaw = String(els.bugReportMessage?.value || "");
  const message = messageRaw.trim();
  if (!message) {
    window.alert(LOCALE === "en" ? "Please enter a message." : "内容を入力してください。");
    return;
  }
  if (message.length > BUG_REPORT_MAX_MESSAGE_LENGTH) {
    window.alert(
      LOCALE === "en"
        ? `Message must be ${BUG_REPORT_MAX_MESSAGE_LENGTH} characters or fewer.`
        : `内容は${BUG_REPORT_MAX_MESSAGE_LENGTH}文字以内で入力してください。`,
    );
    return;
  }
  if (!isValidBugReportEmail(email)) {
    window.alert(LOCALE === "en" ? "Email format is invalid." : "メアドの形式が正しくありません。");
    return;
  }
  const now = Date.now();
  if (now - bugReportState.lastSubmittedAt < BUG_REPORT_MIN_INTERVAL_MS) {
    window.alert(
      LOCALE === "en"
        ? "Please wait a moment before sending another report."
        : "連続送信を防ぐため、少し待ってから再送してください。",
    );
    return;
  }
  const signature = buildBugReportSignature(email, message);
  if (
    signature &&
    signature === bugReportState.lastSubmittedSignature &&
    now - bugReportState.lastSubmittedAt < BUG_REPORT_DUPLICATE_WINDOW_MS
  ) {
    window.alert(
      LOCALE === "en"
        ? "A similar report was just sent. Please edit the message before resubmitting."
        : "同じ内容の送信が直前に行われています。内容を更新して再送してください。",
    );
    return;
  }

  bugReportState.isSubmitting = true;
  const submitBtn = document.querySelector("#submitBugReportBtn");
  if (submitBtn) submitBtn.disabled = true;
  try {
    const payload = {
      type: "bugReport",
      email,
      message,
      locale: LOCALE,
      clientId: bugReportState.clientId,
      appVersion: String(state.meta?.version || ""),
      pageUrl: window.location.href,
      userAgent: String(navigator.userAgent || ""),
    };
    const res = await fetch(bugReportState.endpoint, {
      method: "POST",
      cache: "no-store",
      headers: {
        accept: "application/json",
        "content-type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(payload),
    });
    let data = null;
    try {
      data = await res.json();
    }
    catch (_e) {}
    if (!res.ok || !data || data.ok === false) {
      const fallbackMessage = LOCALE === "en"
        ? "Failed to submit bug report. Please try again later."
        : "バグレポートの送信に失敗しました。時間をおいて再度お試しください。";
      const errorMessage = typeof data?.error === "string" && data.error
        ? data.error
        : fallbackMessage;
      window.alert(errorMessage);
      return;
    }
    localStorage.setItem(BUG_REPORT_EMAIL_KEY, email);
    bugReportState.lastSubmittedAt = Date.now();
    bugReportState.lastSubmittedSignature = signature;
    els.bugReportDialog?.close();
    if (els.bugReportMessage) els.bugReportMessage.value = "";
    updateBugReportCounter();
    window.alert(
      LOCALE === "en"
        ? "Thanks for your report. We received it."
        : "ご報告ありがとうございます。受け付けました。",
    );
  }
  catch {
    window.alert(
      LOCALE === "en"
        ? "Network error while submitting bug report."
        : "送信時にネットワークエラーが発生しました。",
    );
  }
  finally {
    bugReportState.isSubmitting = false;
    if (submitBtn) submitBtn.disabled = false;
  }
}

function bindDialogBackdropCancel(dialog, onCancel) {
  if (!dialog || typeof onCancel !== "function") return;
  // `click` の target が dialog になるだけでは閉じない（textarea 内で選択開始→外で離すと
  // オーバーレイに click が付くため編集が破棄されるのを防ぐ）
  let pointerDownOnBackdrop = false;
  dialog.addEventListener("pointerdown", (ev) => {
    pointerDownOnBackdrop = ev.target === dialog;
  });
  dialog.addEventListener("pointercancel", () => {
    pointerDownOnBackdrop = false;
  });
  dialog.addEventListener("click", (ev) => {
    if (ev.target !== dialog || !pointerDownOnBackdrop) return;
    pointerDownOnBackdrop = false;
    onCancel();
  });
}

function printArticleList() {
  const heading = LOCALE === "en" ? "Article List" : "記事一覧";
  const metaSummary = escapeHtml(buildMetaSummaryText());
  const tableHtml = state.articleListCascade
    ? (els.articleListContainer?.querySelector(".article-tree-table")?.outerHTML || "")
    : buildPrintableFlatTableHtml();
  const emptyHtml = els.articleListContainer?.querySelector(".article-list-empty")?.outerHTML || "";
  const printableBodyHtml = tableHtml || emptyHtml;
  const copyright =
    document.querySelector("#articleDialog .dialog-copyright")?.textContent?.trim() ||
    "(c) 2026 Satoshi Endo all right reserved";
  if (els.printArticleSheet) {
    els.printArticleSheet.innerHTML = `
      <h1>${heading}</h1>
      <div class="article-list-meta">${metaSummary}</div>
      <div class="article-list">${printableBodyHtml}</div>
      <div class="copyright">${escapeHtml(copyright)}</div>
    `;
  }
  document.body.classList.remove("print-imposition");
  document.body.classList.add("print-article-list");
  const cleanup = () => {
    document.body.classList.remove("print-article-list");
    if (els.printArticleSheet) els.printArticleSheet.innerHTML = "";
  };
  window.addEventListener("afterprint", cleanup, { once: true });
  window.print();
}

function syncImpositionDialogInputsFromMeta() {
  const ip = ensureImpositionPrintLayoutPositions(
    getImpositionPrintLayoutForCurrentMode(state.meta, state.impositionOptions.use8up),
  );
  if (state.impositionOptions.use8up) {
    state.meta.impositionPrint8Up = ip;
  } else {
    state.meta.impositionPrint16Up = ip;
  }
  if (els.impositionPdfScalePercent) els.impositionPdfScalePercent.value = String(ip.pdfScalePercent);
  if (els.impositionPrintPaperSize) els.impositionPrintPaperSize.value = ip.printPaperSize;
  if (els.impositionFrontColXMM) els.impositionFrontColXMM.value = String(ip.frontColXMMText || "");
  if (els.impositionFrontRowYMM) els.impositionFrontRowYMM.value = String(ip.frontRowYMMText || "");
  if (els.impositionBackColXMM) els.impositionBackColXMM.value = String(ip.backColXMMText || "");
  if (els.impositionBackRowYMM) els.impositionBackRowYMM.value = String(ip.backRowYMMText || "");
  state.impositionOptions.pdfScalePercent = ip.pdfScalePercent;
  updateImpositionPrintDriverNotice();
}

function updateImpositionPrintDriverNotice() {
  if (!els.impositionPrintDriverNotice) return;
  els.impositionPrintDriverNotice.hidden = true;
  els.impositionPrintDriverNotice.textContent = "";
}

function applyImpositionPrintLayoutInputsToMeta() {
  if (!state.meta) state.meta = {};
  const shape = getImpositionGridShape(
    Boolean(state.impositionOptions.use8up),
    isHorizontalTrimSize(state.meta?.trimSize),
  );
  const next = normalizeImpositionPrintLayout({
    printPaperSize: els.impositionPrintPaperSize?.value,
    pdfScalePercent: els.impositionPdfScalePercent?.value,
    frontColXMMText: els.impositionFrontColXMM?.value,
    frontRowYMMText: els.impositionFrontRowYMM?.value,
    backColXMMText: els.impositionBackColXMM?.value,
    backRowYMMText: els.impositionBackRowYMM?.value,
  }, shape);
  if (state.impositionOptions.use8up) {
    state.meta.impositionPrint8Up = next;
  } else {
    state.meta.impositionPrint16Up = next;
  }
  state.impositionOptions.pdfScalePercent = next.pdfScalePercent;
  if (els.impositionPdfScalePercent) els.impositionPdfScalePercent.value = String(next.pdfScalePercent);
  if (els.impositionPrintPaperSize) els.impositionPrintPaperSize.value = next.printPaperSize;
  if (els.impositionFrontColXMM) els.impositionFrontColXMM.value = String(next.frontColXMMText || "");
  if (els.impositionFrontRowYMM) els.impositionFrontRowYMM.value = String(next.frontRowYMMText || "");
  if (els.impositionBackColXMM) els.impositionBackColXMM.value = String(next.backColXMMText || "");
  if (els.impositionBackRowYMM) els.impositionBackRowYMM.value = String(next.backRowYMMText || "");
  state.textDirty = true;
  updateImpositionPrintDriverNotice();
}

function resetImpositionPrintLayoutToDefaults(options = {}) {
  if (!state.meta) state.meta = {};
  const keepPaper = Boolean(options.keepPaperSize);
  const bothModes = Boolean(options.bothModes);
  const paperSize = keepPaper
    ? normalizeImpositionPrintPaperSize(
      els.impositionPrintPaperSize?.value
      || state.meta?.impositionPrint16Up?.printPaperSize
      || state.meta?.impositionPrint8Up?.printPaperSize,
    )
    : undefined;
  const scale = normalizeImpositionPdfScalePercent(
    els.impositionPdfScalePercent?.value
    ?? getImpositionPrintLayoutForCurrentMode(state.meta, state.impositionOptions.use8up).pdfScalePercent,
  );
  const horizontalTrim = isHorizontalTrimSize(state.meta?.trimSize);
  const trimText = getEffectiveTrimSizeText(state.meta);
  const buildForMode = (use8up) => buildDefaultImpositionPrintLayout({
    printPaperSize: paperSize,
    pdfScalePercent: scale,
    use8up: Boolean(use8up),
    horizontalTrim,
    trimText,
  });
  if (bothModes) {
    state.meta.impositionPrint8Up = buildForMode(true);
    state.meta.impositionPrint16Up = buildForMode(false);
  } else if (state.impositionOptions.use8up) {
    state.meta.impositionPrint8Up = buildForMode(true);
  } else {
    state.meta.impositionPrint16Up = buildForMode(false);
  }
  const next = state.impositionOptions.use8up
    ? state.meta.impositionPrint8Up
    : state.meta.impositionPrint16Up;
  state.impositionOptions.pdfScalePercent = next.pdfScalePercent;
  if (els.impositionPdfScalePercent) els.impositionPdfScalePercent.value = String(next.pdfScalePercent);
  if (els.impositionPrintPaperSize) els.impositionPrintPaperSize.value = next.printPaperSize;
  if (els.impositionFrontColXMM) els.impositionFrontColXMM.value = String(next.frontColXMMText || "");
  if (els.impositionFrontRowYMM) els.impositionFrontRowYMM.value = String(next.frontRowYMMText || "");
  if (els.impositionBackColXMM) els.impositionBackColXMM.value = String(next.backColXMMText || "");
  if (els.impositionBackRowYMM) els.impositionBackRowYMM.value = String(next.backRowYMMText || "");
  state.textDirty = true;
  updateImpositionPrintDriverNotice();
}

function saveImpositionPrintParamsToWorkingText() {
  applyImpositionPrintLayoutInputsToMeta();
  const base = els.editorDialog?.open
    ? normalizeEditorDirectiveText(String(els.editorText?.value || ""))
    : normalizeEditorDirectiveText(String(state.rawText || ""));
  const merged = upsertImpositionPrintLine(base, state.meta);
  const normalized = normalizeEditorDirectiveText(merged);
  loadFromText(normalized);
  if (els.editorText && els.editorDialog?.open) {
    els.editorText.value = normalized;
    state.editorSnapshotText = normalized;
    clearEditorAssist();
    refreshEditorAssist(els.editorText);
  }
  try {
    localStorage.setItem(LOCAL_KEY, normalized);
  } catch (_e) {}
  void renderImpositionPreview();
  window.alert(
    LOCALE === "en"
      ? "Imposition print parameters saved into the flatplan text (//imposition-print)."
      : "面付け印刷のパラメータを台割テキスト（//面付け印刷）に保存しました。",
  );
}

async function openImpositionDialog() {
  if (!els.impositionDialog) return;
  if (hasImpositionMapFoldText(state.impositionOptions.mapFoldText) && state.impositionOptions.use8up) {
    state.impositionOptions.use8up = false;
  }
  if (state.impositionOptions.use8pBooklet) {
    state.impositionOptions.use8up = false;
    state.impositionOptions.mapFoldText = "";
  }
  if (state.impositionOptions.use8pBooklet && isHorizontalTrimSize(state.meta?.trimSize)) {
    state.impositionOptions.use8pBooklet = false;
  }
  if (els.impositionBoardInput) {
    els.impositionBoardInput.value = state.impositionOptions.targetText || "";
  }
  if (els.impositionShowPageLabel) {
    els.impositionShowPageLabel.checked = Boolean(state.impositionOptions.showPageLabel);
  }
  if (els.impositionUse8up) {
    els.impositionUse8up.checked = Boolean(state.impositionOptions.use8up);
  }
  if (els.impositionMapFoldInput) {
    els.impositionMapFoldInput.value = String(state.impositionOptions.mapFoldText || "");
  }
  if (els.impositionUse8pBooklet) {
    els.impositionUse8pBooklet.checked = Boolean(state.impositionOptions.use8pBooklet);
  }
  if (els.impositionSaddleStitch) {
    els.impositionSaddleStitch.checked = Boolean(state.impositionOptions.saddleStitch);
  }
  syncImpositionDialogInputsFromMeta();
  updateImpositionPdfName();
  await renderImpositionPreview();
  els.impositionDialog.showModal();
}

async function renderImpositionPreview() {
  const seq = ++impositionRenderSeq;
  const result = await buildImpositionRenderResult();
  if (seq !== impositionRenderSeq) return;
  if (els.impositionError) {
    const hasError = Boolean(result.error);
    els.impositionError.classList.toggle("hidden", !hasError);
    els.impositionError.textContent = hasError ? result.error : "";
  }
  if (els.impositionPreview) {
    els.impositionPreview.innerHTML = result.html || "";
  }
  if (els.impositionWarning) {
    const hasWarning = Boolean(result.warning);
    els.impositionWarning.classList.toggle("hidden", !hasWarning);
    els.impositionWarning.textContent = hasWarning ? result.warning : "";
  }
}

async function printImpositionSimulation() {
  // ブラウザの window.print() + @page は Windows/Print to PDF で用紙サイズ・向きが
  // 無視されやすい。面付けは選択用紙の実寸 PDF を生成して出力する。
  applyImpositionPrintLayoutInputsToMeta();
  try {
    await withImpositionProcessing(
      LOCALE === "en" ? "Building imposition PDF…" : "面付けPDFを生成しています…",
      async () => {
        const result = await buildImpositionRenderResult({ collectSheets: true });
        if (result.error) throw new Error(result.error);
        const sheets = Array.isArray(result.sheets) ? result.sheets : [];
        if (sheets.length === 0) {
          throw new Error(
            LOCALE === "en" ? "No imposition sheets to export." : "出力する面付けシートがありません。",
          );
        }
        const horizontalTrim = isHorizontalTrimSize(state.meta?.trimSize);
        const use8pBooklet = Boolean(state.impositionOptions.use8pBooklet);
        const use8up = Boolean(state.impositionOptions.use8up)
          && !use8pBooklet
          && !hasImpositionMapFoldText(state.impositionOptions.mapFoldText);
        const ip = getImpositionPrintLayoutForCurrentMode(state.meta, use8up);
        const pageLayout = resolveImpositionPrintPageLayout(
          ip.printPaperSize,
          use8up,
          horizontalTrim,
          Boolean(state.impositionOptions.saddleStitch),
        );
        const blob = await buildImpositionPrintPdfBlob(sheets, pageLayout, ip);
        const base = String(state.meta?.filename || state.meta?.title || "imposition")
          .trim()
          .replace(/[\\/:*?"<>|]+/g, "_") || "imposition";
        const orient = pageLayout.pageOrientation === "landscape" ? "landscape" : "portrait";
        downloadBlobFile(blob, `${base}_imposition_${pageLayout.paperSize}_${orient}.pdf`);
      },
    );
  } catch (error) {
    window.alert(
      (error && error.message)
      || (LOCALE === "en" ? "Failed to export imposition PDF." : "面付けPDFの出力に失敗しました。"),
    );
  }
}

async function waitForImpositionSheetImagesReady(root) {
  if (!(root instanceof Element)) return;
  const images = [...root.querySelectorAll("img.imposition-slot-pdf")];
  if (images.length === 0) return;
  const waitOne = (img) => new Promise((resolve) => {
    if (img.complete && img.naturalWidth > 0) {
      resolve();
      return;
    }
    const done = () => resolve();
    img.addEventListener("load", done, { once: true });
    img.addEventListener("error", done, { once: true });
    window.setTimeout(done, 1200);
  });
  await Promise.all(images.map((img) => waitOne(img)));
}

function hasImpositionMapFoldText(rawText) {
  return String(rawText || "").trim().length > 0;
}

function parseImpositionMapFoldSpec(rawText, horizontalTrim) {
  const text = String(rawText || "").trim();
  if (!text) {
    return { active: false, error: "", order: [], frontMap: [], backMap: [] };
  }
  const tokens = text
    .split(/[,\s、，]+/)
    .map((part) => part.trim())
    .filter(Boolean);
  if (tokens.length !== 16) {
    return {
      active: true,
      error: LOCALE === "en"
        ? "Map fold requires exactly 16 values."
        : "地図折りは16個の値（1〜16）を指定してください。",
      order: [],
      frontMap: [],
      backMap: [],
    };
  }
  const order = [];
  for (const token of tokens) {
    const n = Number.parseInt(token, 10);
    if (!Number.isFinite(n) || n < 1 || n > 16) {
      return {
        active: true,
        error: LOCALE === "en"
          ? "Map fold values must be integers from 1 to 16."
          : "地図折りの値は1〜16の整数で指定してください。",
        order: [],
        frontMap: [],
        backMap: [],
      };
    }
    order.push(n);
  }
  if (new Set(order).size !== 16) {
    return {
      active: true,
      error: LOCALE === "en"
        ? "Map fold values must not contain duplicates."
        : "地図折りの値は重複なしで1〜16を1回ずつ指定してください。",
      order: [],
      frontMap: [],
      backMap: [],
    };
  }
  const cols = horizontalTrim ? 2 : 4;
  const rows = horizontalTrim ? 4 : 2;
  const frontMap = [];
  const backMap = [];
  {
    let offset = 0;
    for (let r = 0; r < rows; r += 1) {
      frontMap.push(order.slice(offset, offset + cols));
      offset += cols;
    }
  }
  let offset = 8;
  for (let r = 0; r < rows; r += 1) {
    backMap.push(order.slice(offset, offset + cols));
    offset += cols;
  }
  return { active: true, error: "", order, frontMap, backMap };
}

async function buildImpositionRenderResult(buildOptions = {}) {
  const context = buildImpositionSourceContext();
  if (context.boards.length === 0) {
    return {
      error: LOCALE === "en" ? "No boards available for imposition." : "面付け対象の台がありません。",
      warning: "",
      html: "",
      sheets: [],
    };
  }
  const selected = parseImpositionBoardSelection(state.impositionOptions.targetText, context.boardNos);
  if (selected.error) return { error: selected.error, warning: "", html: "", sheets: [] };
  const horizontalTrim = isHorizontalTrimSize(state.meta?.trimSize);
  const use8pBooklet = Boolean(state.impositionOptions.use8pBooklet);
  if (use8pBooklet && horizontalTrim) {
    return {
      error: LOCALE === "en" ? "8P fold booklet is available only for portrait trim." : "8P折本は縦判のときだけ使えます。",
      warning: "",
      html: "",
      sheets: [],
    };
  }
  const mapFoldSpec = parseImpositionMapFoldSpec(state.impositionOptions.mapFoldText, horizontalTrim);
  if (mapFoldSpec.error) return { error: mapFoldSpec.error, warning: "", html: "", sheets: [] };
  const use8up = Boolean(state.impositionOptions.use8up) && !mapFoldSpec.active && !use8pBooklet;
  const ipRaw = getImpositionPrintLayoutForCurrentMode(state.meta, use8up);
  const ip = ensureImpositionPrintLayoutPositions(ipRaw);
  const sheetCollector = buildOptions.collectSheets ? [] : null;
  const options = {
    showPageLabel: Boolean(state.impositionOptions.showPageLabel),
    hasPdf: hasImpositionPdfLoaded(),
    pdfScalePercent: ip.pdfScalePercent,
    impositionPrintLayout: ip,
    use8up,
    saddleStitch: Boolean(state.impositionOptions.saddleStitch),
    horizontalTrim,
    use8pBooklet,
    openingCanon: normalizeOpeningCanon(state.meta?.opening),
    mapFoldSpec: mapFoldSpec.active ? mapFoldSpec : null,
    spineCounter: { n: 1 },
    sheetCollector,
  };
  const selectedBoards = selected.boardNos
    .map((boardNo) => context.boardByNo.get(boardNo))
    .filter(Boolean);
  const flatSourcePages = flattenImpositionPagesFromBoardsInOrder(selectedBoards);
  let saddleOrderedPages = null;
  if (options.saddleStitch) {
    const signatureSize = options.use8up ? 8 : 16;
    const saddle = buildSaddleStitchPageOrder(flatSourcePages, signatureSize);
    if (saddle.error) return { error: saddle.error, warning: "", html: "", sheets: [] };
    saddleOrderedPages = saddle.pages;
  }
  let cards;
  let boardsForPdf = selectedBoards;
  if (options.use8up) {
    const pdfImageBySourceIndex = await buildImpositionPdfImageMapForBoards(boardsForPdf);
    cards = renderImposition8upCardsHtml(
      selectedBoards,
      options,
      pdfImageBySourceIndex,
      options.saddleStitch ? saddleOrderedPages : null,
    );
  } else {
    const mergedBoards = options.saddleStitch
      ? buildImpositionMerged16UpBoardsFromFlat(
        saddleOrderedPages || [],
        selected.boardNos,
        {
          saddleStitch: Boolean(options.saddleStitch),
          sourceBoardCount: selectedBoards.length,
          singleBoard: selectedBoards[0] || null,
        },
      )
      : buildImpositionMerged16UpBoards(selectedBoards, selected.boardNos);
    boardsForPdf = mergedBoards;
    const pdfImageBySourceIndex = await buildImpositionPdfImageMapForBoards(boardsForPdf);
    cards = mergedBoards
      .map((board) => renderImpositionBoardCardHtml(board, options, pdfImageBySourceIndex))
      .join("");
  }
  return {
    error: "",
    warning: buildImpositionOrientationWarning(),
    html: cards,
    sheets: sheetCollector || [],
  };
}

function buildImpositionOrientationWarning() {
  if (!hasImpositionPdfLoaded()) return "";
  const pdfOrientation = String(state.impositionPdf.orientation || "");
  if (!pdfOrientation || pdfOrientation === "unknown" || pdfOrientation === "mixed") return "";
  const trimIsHorizontal = isHorizontalTrimSize(state.meta?.trimSize);
  const trimOrientation = trimIsHorizontal ? "landscape" : "portrait";
  if (pdfOrientation === trimOrientation) return "";
  const trimLabel = trimIsHorizontal ? "横" : "縦";
  const pdfLabel = pdfOrientation === "landscape" ? "横" : "縦";
  return LOCALE === "en"
    ? `Trim size orientation (${trimLabel}) does not match loaded PDF orientation (${pdfLabel}).`
    : `//判型の向き（${trimLabel}）と、読み込んだPDFの向き（${pdfLabel}）が一致していません。`;
}

function parseImpositionBoardSelection(rawText, availableBoardNos) {
  const allNos = [...new Set((availableBoardNos || []).map((n) => Number(n)).filter((n) => Number.isFinite(n) && n >= 1))].sort((a, b) => a - b);
  if (allNos.length === 0) {
    return {
      error: LOCALE === "en" ? "No boards are defined." : "台番号が定義されていません。",
      boardNos: [],
    };
  }
  const raw = String(rawText || "").trim();
  if (!raw || IMPOSITION_KEYWORD_ALL.has(raw)) {
    return { error: "", boardNos: allNos };
  }
  const tokens = raw.split(/[,\s、]+/).map((x) => x.trim()).filter(Boolean);
  if (tokens.length === 0) return { error: "", boardNos: allNos };
  const ordered = [];
  const seen = new Set();
  const missingNos = new Set();
  const pushNo = (n) => {
    if (!Number.isFinite(n) || n < 1) return;
    if (!allNos.includes(n)) {
      missingNos.add(n);
      return;
    }
    if (seen.has(n)) return;
    seen.add(n);
    ordered.push(n);
  };
  for (const token of tokens) {
    if (IMPOSITION_KEYWORD_ALL.has(token)) {
      for (const no of allNos) pushNo(no);
      continue;
    }
    const rangeMatch = token.match(/^(\d+)\s*-\s*(\d+)$/);
    if (rangeMatch) {
      const a = Number.parseInt(rangeMatch[1], 10);
      const b = Number.parseInt(rangeMatch[2], 10);
      if (!Number.isFinite(a) || !Number.isFinite(b) || a < 1 || b < 1) {
        return {
          error: LOCALE === "en"
            ? `Invalid board range: ${token}`
            : `台番号の範囲指定が不正です: ${token}`,
          boardNos: [],
        };
      }
      const from = Math.min(a, b);
      const to = Math.max(a, b);
      for (let n = from; n <= to; n += 1) pushNo(n);
      continue;
    }
    if (!/^\d+$/.test(token)) {
      return {
        error: LOCALE === "en"
          ? `Unsupported board selector: ${token}`
          : `台番号指定を解釈できません: ${token}`,
        boardNos: [],
      };
    }
    pushNo(Number.parseInt(token, 10));
  }
  if (missingNos.size > 0) {
    const list = [...missingNos].sort((a, b) => a - b).join(LOCALE === "en" ? ", " : "、");
    return {
      error: LOCALE === "en"
        ? `Board number(s) not found in the current flatplan: ${list}`
        : `指定された台番号は台割に存在しません: ${list}`,
      boardNos: [],
    };
  }
  if (ordered.length === 0) {
    return {
      error: LOCALE === "en"
        ? "No matching boards in the current flatplan."
        : "指定された台番号は現在の台割に存在しません。",
      boardNos: [],
    };
  }
  return { error: "", boardNos: ordered };
}

function buildImpositionSourceContext() {
  const boardDisplayData = buildBoardDisplayData();
  const totalBetchoAdvance = (state.betchoes || []).reduce(
    (sum, b) => sum + pagesToUnits(b.advancePages || 0),
    0,
  );
  const layoutMeta = {
    ...state.meta,
    pages:
      state.meta.pages > 0
        ? Math.max(1, state.meta.pages - totalBetchoAdvance)
        : state.meta.pages,
  };
  const layoutResult = layout(boardDisplayData.entries, layoutMeta);
  const pages = layoutResult.pages || [];
  const boardSpecs = buildBoardSpecs(pages.length, state.boardDirectives || []);
  const advancePrefixByBoard = buildAdvancePrefixByBoard(boardDisplayData.betchoes, boardSpecs);
  const entryById = new Map(
    (boardDisplayData.entries || [])
      .filter((entry) => entry?.id)
      .map((entry) => [entry.id, entry]),
  );
  const boards = boardSpecs.map((spec) => {
    const boardNo = spec.boardNo;
    const signaturePages = 16;
    const usedPagesInBoard = Math.max(0, Math.min(signaturePages, Number(spec.pages) || 0));
    const chunk = pages.slice(spec.start, spec.start + usedPagesInBoard);
    const chunkPadded = [
      ...chunk,
      ...Array.from({ length: Math.max(0, signaturePages - chunk.length) }, () => undefined),
    ];
    const pageAdvanceBefore = advancePrefixByBoard.get(boardNo) || 0;
    const pageItems = chunkPadded.map((page, idx) => {
      const summary = summarizeImpositionPage(page, entryById);
      const sourcePageIndex = idx < usedPagesInBoard ? spec.start + idx + 1 : 0;
      return {
        seq: idx + 1,
        sourcePageIndex,
        pageNo: page ? formatFlatplanFolioForPage(spec.start + idx, pageAdvanceBefore) : "",
        ...summary,
      };
    });
    return {
      boardNo,
      format: spec.format,
      pages: spec.pages,
      pageItems,
    };
  });
  return {
    boards,
    boardByNo: new Map(boards.map((board) => [board.boardNo, board])),
    boardNos: boards.map((board) => board.boardNo),
  };
}

/** 指定順の台から、PDF・ページ表記に使う実ページだけをつないだ配列（最大16ページ/台の制限は buildImpositionSourceContext に従う） */
function flattenImpositionPagesFromBoardsInOrder(boards) {
  const out = [];
  for (const board of boards || []) {
    for (const item of board?.pageItems || []) {
      if ((Number(item?.sourcePageIndex) || 0) <= 0) continue;
      out.push({ ...item });
    }
  }
  return out;
}

/**
 * 中綴じ（外側→内側）順にページ列を並べ替える。
 * 例: 32ページ・16面付けなら [先頭8] + [末尾8] + [次の8] + [その直前8]。
 */
function buildSaddleStitchPageOrder(sourcePages, signatureSize) {
  const pages = Array.isArray(sourcePages) ? sourcePages.slice() : [];
  if (pages.length === 0) return { error: "", pages: [] };
  if (!Number.isFinite(signatureSize) || signatureSize <= 0 || signatureSize % 2 !== 0) {
    return {
      error: LOCALE === "en"
        ? "Internal error: invalid imposition unit for saddle stitch."
        : "中綴じ処理で不正な面付け単位が指定されました。",
      pages: [],
    };
  }
  if (pages.length % signatureSize !== 0) {
    return {
      error: LOCALE === "en"
        ? `Saddle stitch requires total pages to be a multiple of ${signatureSize} (current: ${pages.length}).`
        : `中綴じでは総ページ数が${signatureSize}の倍数である必要があります（現在: ${pages.length}ページ）。`,
      pages: [],
    };
  }
  const half = signatureSize / 2;
  let left = 0;
  let right = pages.length;
  const ordered = [];
  while (left < right) {
    ordered.push(...pages.slice(left, left + half));
    left += half;
    ordered.push(...pages.slice(right - half, right));
    right -= half;
  }
  return { error: "", pages: ordered };
}

/**
 * 16面付け：複数台を「挟まれた台は無いかのように」1本のページ列にしてから16ページ単位でシグネチャ化する。
 * 台が1台だけ・かつシグネチャが1つだけのときは従来と同じ見出し用メタ（boardNo/format）を維持する。
 */
function buildImpositionMerged16UpBoards(selectedBoards, selectedBoardNos) {
  const flat = flattenImpositionPagesFromBoardsInOrder(selectedBoards);
  return buildImpositionMerged16UpBoardsFromFlat(flat, selectedBoardNos, {
    saddleStitch: false,
    sourceBoardCount: selectedBoards.length,
    singleBoard: selectedBoards[0] || null,
  });
}

function buildImpositionMerged16UpBoardsFromFlat(flat, selectedBoardNos, options = {}) {
  if (flat.length === 0) return [];
  const signatureSize = 16;
  const chunks = [];
  for (let i = 0; i < flat.length; i += signatureSize) {
    chunks.push(flat.slice(i, i + signatureSize));
  }
  const openingCanon = normalizeOpeningCanon(state.meta?.opening);
  const openingText = openingCanon === "right"
    ? (LOCALE === "en" ? "Right opening" : "右開き")
    : (LOCALE === "en" ? "Left opening" : "左開き");
  const saddleSuffix = Boolean(options.saddleStitch)
    ? (LOCALE === "en" ? " / Saddle stitch" : "／中綴じ")
    : "";
  const selectionSummary = (selectedBoardNos || []).join(", ");
  const sourceBoardCount = Number(options.sourceBoardCount) || 0;
  const useMergedCaption = sourceBoardCount > 1 || chunks.length > 1;
  return chunks.map((chunk, idx) => {
    const used = chunk.length;
    const pageItems = chunk.map((item, j) => ({
      ...item,
      seq: j + 1,
    }));
    while (pageItems.length < signatureSize) {
      const seq = pageItems.length + 1;
      pageItems.push({
        seq,
        sourcePageIndex: 0,
        pageNo: "",
        title: LOCALE === "en" ? "(Blank)" : "（空白）",
        lines: [],
      });
    }
    const sigNo = idx + 1;
    if (useMergedCaption) {
      const impositionCardLabel = LOCALE === "en"
        ? `Imposition sig. ${sigNo} — boards ${selectionSummary} (${used}p on this sheet / ${openingText}${saddleSuffix})`
        : `16面付け ${sigNo}（指定台: ${selectionSummary}／このシート${used}ページ・${openingText}${saddleSuffix}）`;
      return {
        boardNo: sigNo,
        format: "",
        pages: used,
        pageItems,
        impositionCardLabel,
      };
    }
    const only = options.singleBoard || null;
    return {
      boardNo: only?.boardNo || sigNo,
      format: only?.format || "",
      pages: used,
      pageItems,
    };
  });
}

function summarizeImpositionPage(page, entryById) {
  if (!page) {
    return {
      title: LOCALE === "en" ? "(Blank)" : "（空白）",
      lines: [],
    };
  }
  const largeText = String(page?.rows?.large?.text || "").trim();
  const middleText = String(page?.rows?.middle?.text || "").trim();
  const smallText = String(page?.rows?.small?.text || "").trim();
  const title = smallText || middleText || largeText || (LOCALE === "en" ? "(Untitled)" : "（無題）");
  const primaryEntryId =
    String(page?.rows?.small?.entryId || "")
    || String(page?.rows?.middle?.entryId || "")
    || String(page?.rows?.large?.entryId || "");
  const primary = primaryEntryId ? entryById.get(primaryEntryId) : null;
  const lines = [];
  if (largeText) lines.push(`大: ${largeText}`);
  if (middleText && middleText !== largeText) lines.push(`中: ${middleText}`);
  if (smallText && smallText !== middleText) lines.push(`小: ${smallText}`);
  if (primary?.deadline) lines.push(`締切: ${primary.deadline}`);
  if (primary?.status) lines.push(`進行: ${primary.status}`);
  return { title, lines };
}

function renderImpositionBoardCardHtml(board, options, pdfImageBySourceIndex = new Map()) {
  const { frontMap, backMap, halfMode } = resolveImpositionMapsForBoard(
    board.pages,
    state.meta.opening,
    options,
  );
  const bySeq = new Map((board.pageItems || []).map((page) => [page.seq, page]));
  const frontRows = frontMap.map((row) => row.map((seq) => resolveImpositionSlotData(seq, bySeq, pdfImageBySourceIndex)));
  let backRows = backMap.map((row) => row.map((seq) => resolveImpositionSlotData(seq, bySeq, pdfImageBySourceIndex)));
  const normalizedFrontRows = normalizeImpositionRowsForTrim(frontRows, options);
  const normalizedBackRows = normalizeImpositionRowsForTrim(backRows, options);
  backRows = normalizedBackRows;
  const openingText = normalizeOpeningCanon(state.meta?.opening) === "right"
    ? (LOCALE === "en" ? "Right opening" : "右開き")
    : (LOCALE === "en" ? "Left opening" : "左開き");
  const label = board.impositionCardLabel
    || (LOCALE === "en"
      ? `Board ${String(board.boardNo).padStart(2, "0")} (${board.pages}p / ${formatBoardLabel(board.format).replace(/<br>/g, "")} / ${openingText})`
      : `第${board.boardNo}台（${board.pages}頁 / ${formatBoardLabelPlain(board.format)} / ${openingText}）`);
  const frontTitle = LOCALE === "en" ? "Front" : "表面";
  const backTitle = LOCALE === "en" ? "Back" : "裏面";
  const foldNo = consumeImpositionSpineFoldNo(options);
  const sideOptions = Number.isFinite(foldNo) ? { ...options, spineFixedNo: foldNo } : options;
  const frontBlock = renderImpositionSidePageHtml(label, frontTitle, normalizedFrontRows, halfMode, "front", sideOptions);
  const backBlock = renderImpositionSidePageHtml(label, backTitle, backRows, halfMode, "back", sideOptions);
  return `
    <section class="imposition-board-card ${halfMode ? "is-half-sheet" : ""}">
      ${frontBlock}
      ${backBlock}
    </section>
  `;
}

function renderImposition8upCardsHtml(boards, options, pdfImageBySourceIndex = new Map(), sourcePagesOverride = null) {
  const openingCanon = normalizeOpeningCanon(state.meta?.opening);
  const baseMaps = IMPOSITION_8UP_SIGNATURE_MAP_BY_OPENING[openingCanon] || IMPOSITION_8UP_SIGNATURE_MAP_BY_OPENING.left;
  // 8面付けは横判/縦判とも、最終折り（背丁）を左右の縦折りに合わせるため
  // 基本の2×2マップを使う（横判専用マップは使わない）。
  const maps = baseMaps;
  const sourcePages = Array.isArray(sourcePagesOverride)
    ? sourcePagesOverride.slice()
    : flattenImpositionPagesFromBoardsInOrder(boards);
  if (sourcePages.length === 0) return "";
  const signatures = [];
  for (let i = 0; i < sourcePages.length; i += 8) {
    signatures.push(sourcePages.slice(i, i + 8));
  }
  return signatures.map((chunk, idx) => {
    const padded = [...chunk];
    while (padded.length < 8) padded.push(null);
    const bySeq = new Map(padded.map((item, i) => [i + 1, item || undefined]));
    const frontRows = maps.front.map((row) => row.map((seq) => resolveImpositionSlotData(seq, bySeq, pdfImageBySourceIndex)));
    const backRows = maps.back.map((row) => row.map((seq) => resolveImpositionSlotData(seq, bySeq, pdfImageBySourceIndex)));
    const sigNo = idx + 1;
    const modeSuffix = options.saddleStitch
      ? (LOCALE === "en" ? " (Saddle stitch)" : "（中綴じ）")
      : "";
    const sigLabel = LOCALE === "en"
      ? `8-up Signature ${sigNo}${modeSuffix}`
      : `8面付け ${sigNo}${modeSuffix}`;
    const frontTitle = LOCALE === "en" ? "Front" : "表面";
    const backTitle = LOCALE === "en" ? "Back" : "裏面";
    const foldNo = consumeImpositionSpineFoldNo(options);
    const sideOptions = Number.isFinite(foldNo) ? { ...options, spineFixedNo: foldNo } : options;
    const frontBlock = renderImpositionSidePageHtml(sigLabel, frontTitle, frontRows, true, "front", sideOptions);
    const backBlock = renderImpositionSidePageHtml(sigLabel, backTitle, backRows, true, "back", sideOptions);
    return `
      <section class="imposition-board-card is-8up-signature">
        ${frontBlock}
        ${backBlock}
      </section>
    `;
  }).join("");
}

function renderImpositionSidePageHtml(boardLabel, sideLabel, rows, halfMode, sideKind, options = {}) {
  const mapFoldActive = Boolean(options.mapFoldSpec?.active);
  // 横版は裏面を用紙全体で180度回転する。
  // （中綴じ/平綴じ、8面付け/16面付けの別を問わない）
  // （グリッド配置と各スロット内の向きは維持したまま、シート全体のみ回転）
  const rotateWhole =
    sideKind === "back"
    && (
      (Boolean(options.horizontalTrim) && !mapFoldActive)
      || (!Boolean(options.horizontalTrim) && mapFoldActive)
    );
  const forceAllUpsideDown =
    sideKind === "back"
    && !Boolean(options.horizontalTrim)
    && !Boolean(options.use8up)
    && mapFoldActive
    && !rotateWhole;
  const forceNoUpsideDown = mapFoldActive;
  const drawOptions = (forceAllUpsideDown || forceNoUpsideDown)
    ? { ...options, forceAllUpsideDown, forceNoUpsideDown }
    : options;
  if (Array.isArray(options.sheetCollector)) {
    options.sheetCollector.push({
      boardLabel: String(boardLabel || ""),
      sideLabel: String(sideLabel || ""),
      sideKind: String(sideKind || ""),
      rotateWhole,
      showPageLabel: Boolean(options.showPageLabel),
      spineFixedNo: options.spineFixedNo,
      use8up: Boolean(options.use8up),
      horizontalTrim: Boolean(options.horizontalTrim),
      forceAllUpsideDown,
      forceNoUpsideDown,
      halfMode: Boolean(halfMode),
      rows: (rows || []).map((row) => (Array.isArray(row) ? row.map((slot) => {
        if (!slot) return null;
        return {
          title: String(slot.title || ""),
          pageNo: slot.pageNo,
          pdfImage: String(slot.pdfImage || ""),
          seq: slot.seq,
          impositionSeq: slot.impositionSeq,
        };
      }) : [])),
    });
  }
  return `
    <article class="imposition-side-page ${halfMode ? "is-half-sheet" : ""} is-${sideKind}">
      ${renderImpositionGridHtml(rows, drawOptions, { rotateWhole, halfMode, sideKind })}
    </article>
  `;
}

function resolveImpositionMapsForBoard(pageCount, opening = "left", options = {}) {
  const canonOpening = normalizeOpeningCanon(options.openingCanon || opening);
  if (options.use8pBooklet) {
    const bookletMaps = IMPOSITION_8P_BOOKLET_MAP_BY_OPENING[canonOpening] || IMPOSITION_8P_BOOKLET_MAP_BY_OPENING.left;
    return { frontMap: bookletMaps.front, backMap: bookletMaps.back, halfMode: false };
  }
  if (options.mapFoldSpec?.active && !options.use8up) {
    return { frontMap: options.mapFoldSpec.frontMap, backMap: options.mapFoldSpec.backMap, halfMode: false };
  }
  if (pageCount <= 8) {
    const halfMaps = IMPOSITION_MAPS_8_BY_OPENING[canonOpening] || IMPOSITION_MAPS_8_BY_OPENING.left;
    return { frontMap: halfMaps.front, backMap: halfMaps.back, halfMode: true };
  }
  if (Boolean(options.horizontalTrim)) {
    const horizMaps = IMPOSITION_MAPS_16_HORIZONTAL_BY_OPENING[canonOpening]
      || IMPOSITION_MAPS_16_HORIZONTAL_BY_OPENING.left;
    return { frontMap: horizMaps.front, backMap: horizMaps.back, halfMode: false };
  }
  const maps = IMPOSITION_MAPS_BY_OPENING[canonOpening] || IMPOSITION_MAPS_BY_OPENING.left;
  return { frontMap: maps.front, backMap: maps.back, halfMode: false };
}

function resolveImpositionSlotData(seq, bySeq, pdfImageBySourceIndex = new Map()) {
  if (!Number.isFinite(seq)) return null;
  const fallback = {
    seq,
    impositionSeq: seq,
    sourcePageIndex: 0,
    pageNo: "",
    title: LOCALE === "en" ? "(Blank)" : "（空白）",
    lines: [],
  };
  const out = bySeq.get(seq) || fallback;
  out.impositionSeq = seq;
  const sourceIdx = Number(out.sourcePageIndex) || 0;
  if (sourceIdx > 0 && pdfImageBySourceIndex instanceof Map) {
    out.pdfImage = pdfImageBySourceIndex.get(sourceIdx) || "";
  }
  return out;
}

/** //書名 を最大15文字程度に整形（Unicode 書記素単位で切り詰め） */
function getImpositionSpineTitleShort(meta) {
  const t = String(meta?.title || "").trim().replace(/\s+/g, " ");
  if (!t) return LOCALE === "en" ? "—" : "（無題）";
  let graphemes;
  try {
    if (typeof Intl !== "undefined" && typeof Intl.Segmenter === "function") {
      graphemes = [...new Intl.Segmenter("ja", { granularity: "grapheme" }).segment(t)].map((x) => x.segment);
    }
  }
  catch (_e) {
    graphemes = null;
  }
  if (!graphemes) graphemes = [...t];
  if (graphemes.length <= 15) return graphemes.join("");
  return graphemes.slice(0, 15).join("");
}

/** 最終グリッド上で seqA と seqB が辺で隣接するとき、そのギャップ（列間 or 行間） */
function findImpositionSpineAdjacency(rows, seqA, seqB) {
  if (!Array.isArray(rows) || rows.length === 0) return null;
  const posA = [];
  const posB = [];
  for (let r = 0; r < rows.length; r += 1) {
    const row = rows[r];
    if (!Array.isArray(row)) continue;
    for (let c = 0; c < row.length; c += 1) {
      const slot = row[c];
      // 8面付けでは source 側 seq が 9..16 になることがあるため、
      // 背丁判定は面付け上の論理スロット番号（impositionSeq）を優先する。
      const logicalSeq = slot?.impositionSeq;
      const s = slot && Number.isFinite(Number(logicalSeq))
        ? Number(logicalSeq)
        : (slot && Number.isFinite(Number(slot.seq)) ? Number(slot.seq) : null);
      if (s === seqA) posA.push({ r, c });
      if (s === seqB) posB.push({ r, c });
    }
  }
  if (!posA.length || !posB.length) return null;
  for (const pa of posA) {
    for (const pb of posB) {
      const dr = Math.abs(pa.r - pb.r);
      const dc = Math.abs(pa.c - pb.c);
      if (dr + dc !== 1) continue;
      if (dr === 0) {
        return { kind: "between-cols", row: pa.r, k: Math.min(pa.c, pb.c) };
      }
      return { kind: "between-rows", upperRow: Math.min(pa.r, pb.r), c: pa.c };
    }
  }
  return null;
}

function findImpositionSpineAdjacencyByCandidates(rows, seqPairs) {
  for (const pair of seqPairs || []) {
    if (!Array.isArray(pair) || pair.length < 2) continue;
    const hit = findImpositionSpineAdjacency(rows, Number(pair[0]), Number(pair[1]));
    if (hit) return hit;
  }
  return null;
}

/** 1シート（表裏）で共有する背丁番号を採番 */
function consumeImpositionSpineFoldNo(options = {}) {
  const counter = options.spineCounter;
  if (!counter || typeof counter.n !== "number" || !Number.isFinite(counter.n)) return null;
  const out = counter.n;
  counter.n += 1;
  return out;
}

function renderImpositionSpineMarkElement(placement, options) {
  if (!placement) return "";
  const fixedNo = Number(options?.spineFixedNo);
  let foldNo = Number.isFinite(fixedNo) && fixedNo >= 1 ? fixedNo : null;
  if (foldNo == null) {
    const counter = options.spineCounter;
    if (!counter || typeof counter.n !== "number") return "";
    foldNo = counter.n;
    counter.n += 1;
  }
  const titleShort = getImpositionSpineTitleShort(state.meta);
  // 列間（縦の折り目）は縦組み、行間（横の折り目）は横組み。
  const verticalText = placement.kind === "between-cols";
  const modeClass = verticalText ? "imposition-spine-portrait" : "imposition-spine-landscape";
  const titleEsc = escapeHtml(titleShort);
  const foldEsc = escapeHtml(`《${foldNo}》`);
  const titleAttrEsc = escapeHtml(`${titleShort} 《${foldNo}》`);
  const inner = `<span class="imposition-spine-line imposition-spine-line-seg" aria-hidden="true"></span><span class="imposition-spine-core${verticalText ? " imposition-spine-vertical" : ""}"><span class="imposition-spine-title-text">${titleEsc}</span><span class="imposition-spine-fold-text">${foldEsc}</span></span><span class="imposition-spine-line imposition-spine-line-seg" aria-hidden="true"></span>`;
  if (placement.kind === "between-cols") {
    return `<div class="imposition-spine-mark imposition-spine-between-cols ${modeClass}" style="--spine-k:${Number(placement.k)};" title="${titleAttrEsc}">${inner}</div>`;
  }
  return `<div class="imposition-spine-mark imposition-spine-between-rows ${modeClass}" style="--spine-c:${Number(placement.c)};" title="${titleAttrEsc}">${inner}</div>`;
}

function renderImpositionGridHtml(rows, options = {}, layoutFlags = {}) {
  const showPageLabel = Boolean(options.showPageLabel);
  const hasPdf = Boolean(options.hasPdf);
  const pdfScale = toImpositionPdfRenderScale(options.pdfScalePercent);
  const pdfPrintSize = `${(Number.parseFloat(pdfScale) * 100).toFixed(2)}%`;
  const ip = options.impositionPrintLayout || DEFAULT_IMPOSITION_PRINT_LAYOUT;
  const colCount = Math.max(1, ...rows.map((row) => (Array.isArray(row) ? row.length : 0)));
  const rowCount = Math.max(1, rows.length);
  const halfMode = Boolean(layoutFlags.halfMode);
  const signatureSize = Boolean(options.use8up) || halfMode ? 8 : 16;
  const sideKind = String(layoutFlags.sideKind || "front");
  const geometry = resolveImpositionSheetGeometry(ip, {
    use8up: Boolean(options.use8up),
    horizontalTrim: Boolean(options.horizontalTrim),
    colCount,
    rowCount,
    sideKind,
  });
  const spineCandidates = signatureSize <= 8
    ? [[1, 8]]
    : [[1, 16]];
  const spinePlacement = options.spineCounter && sideKind === "front"
    ? findImpositionSpineAdjacencyByCandidates(rows, spineCandidates)
    : null;
  const paperW = geometry.pageWidthMm;
  const paperH = geometry.pageHeightMm;
  const cellW = geometry.cellWidthMm;
  const cellH = geometry.cellHeightMm;
  const colX = geometry.colXMM;
  const rowY = geometry.rowYMM;
  const body = rows.map((row, rowIdx) => {
    const cells = row.map((slot, colIdx) => {
      const leftPct = ((Number(colX[colIdx]) || 0) / paperW) * 100;
      const topPct = ((Number(rowY[rowIdx]) || 0) / paperH) * 100;
      const widthPct = (cellW / paperW) * 100;
      const heightPct = (cellH / paperH) * 100;
      const slotStyle = `left:${leftPct.toFixed(4)}%;top:${topPct.toFixed(4)}%;width:${widthPct.toFixed(4)}%;height:${heightPct.toFixed(4)}%;`;
      if (!slot) {
        return `<div class="imposition-slot is-blank" style="${slotStyle}">
          <div class="imposition-slot-inner"></div>
        </div>`;
      }
      const showTextMeta = !(hasPdf);
      const upside = isImpositionRowUpsideDown(rowIdx, rowCount, options);
      return `<div class="imposition-slot${upside ? " is-upside-down" : ""}" style="${slotStyle}">
        <div class="imposition-slot-inner ${slot.pdfImage ? "has-pdf" : ""}">
          ${showTextMeta ? `<div class="imposition-slot-title">${escapeHtml(slot.title || "")}</div>` : ""}
          ${slot.pdfImage ? `<div class="imposition-slot-pdf-wrap"><img class="imposition-slot-pdf" src="${slot.pdfImage}" alt="PDF page preview" /></div>` : ""}
          ${showPageLabel ? `<div class="imposition-slot-foot">${escapeHtml(formatImpositionFolioFootLabel(slot.pageNo))}</div>` : ""}
        </div>
      </div>`;
    }).join("");
    return cells;
  }).join("");
  let spineHtml = "";
  if (spinePlacement) {
    spineHtml = renderImpositionSpineMarkElementAbsolute(spinePlacement, options, geometry);
  }
  return `<div class="imposition-grid abs-mode ${hasPdf ? "pdf-mode" : ""} ${layoutFlags.rotateWhole ? "rotate-whole-180" : ""}" style="--imposition-pdf-scale:${pdfScale};--imposition-pdf-print-size:${pdfPrintSize};--imposition-grid-cols:${colCount};--imposition-paper-w:${paperW};--imposition-paper-h:${paperH};aspect-ratio:${paperW} / ${paperH};">${body}${spineHtml}</div>`;
}

function renderImpositionSpineMarkElementAbsolute(placement, options, geometry) {
  if (!placement || !options?.spineCounter) return "";
  let foldNo = Number(options.spineFixedNo);
  if (!Number.isFinite(foldNo) || foldNo < 1) {
    const counter = options.spineCounter;
    foldNo = Number(counter.n) || 1;
    counter.n += 1;
  }
  const titleShort = getImpositionSpineTitleShort(state.meta);
  const verticalText = placement.kind === "between-cols";
  const modeClass = verticalText ? "imposition-spine-portrait" : "imposition-spine-landscape";
  const titleEsc = escapeHtml(titleShort);
  const foldEsc = escapeHtml(`《${foldNo}》`);
  const titleAttrEsc = escapeHtml(`${titleShort} 《${foldNo}》`);
  const inner = `<span class="imposition-spine-line imposition-spine-line-seg" aria-hidden="true"></span><span class="imposition-spine-core${verticalText ? " imposition-spine-vertical" : ""}"><span class="imposition-spine-title-text">${titleEsc}</span><span class="imposition-spine-fold-text">${foldEsc}</span></span><span class="imposition-spine-line imposition-spine-line-seg" aria-hidden="true"></span>`;
  const paperW = geometry.pageWidthMm;
  const paperH = geometry.pageHeightMm;
  const cellW = geometry.cellWidthMm;
  const cellH = geometry.cellHeightMm;
  const colX = geometry.colXMM;
  const rowY = geometry.rowYMM;
  if (placement.kind === "between-cols") {
    const k = Number(placement.k);
    const row = Number(placement.row);
    const x0 = Number(colX[k]) || 0;
    const x1 = Number(colX[k + 1]) || (x0 + cellW);
    const midX = (x0 + cellW + x1) / 2;
    const top = Number(rowY[row]) || 0;
    const leftPct = (midX / paperW) * 100;
    const topPct = (top / paperH) * 100;
    const heightPct = (cellH / paperH) * 100;
    return `<div class="imposition-spine-mark imposition-spine-between-cols abs-pos ${modeClass}" style="left:${leftPct.toFixed(4)}%;top:${topPct.toFixed(4)}%;height:${heightPct.toFixed(4)}%;" title="${titleAttrEsc}">${inner}</div>`;
  }
  const c = Number(placement.c);
  const upper = Number(placement.upperRow);
  const y0 = Number(rowY[upper]) || 0;
  const y1 = Number(rowY[upper + 1]) || (y0 + cellH);
  const midY = (y0 + cellH + y1) / 2;
  const left = Number(colX[c]) || 0;
  const leftPct = (left / paperW) * 100;
  const topPct = (midY / paperH) * 100;
  const widthPct = (cellW / paperW) * 100;
  return `<div class="imposition-spine-mark imposition-spine-between-rows abs-pos ${modeClass}" style="left:${leftPct.toFixed(4)}%;top:${topPct.toFixed(4)}%;width:${widthPct.toFixed(4)}%;" title="${titleAttrEsc}">${inner}</div>`;
}

function normalizeImpositionRowsForTrim(rows, options = {}) {
  const base = Array.isArray(rows) ? rows.map((row) => (Array.isArray(row) ? row.slice() : [])) : [];
  if (!options.horizontalTrim) return base;
  // 横判16面付けは IMPOSITION_MAPS_16_HORIZONTAL_BY_OPENING で 4×2 を直接渡す。
  // 既に4行なら変換不要。旧2×4が来た場合のみフォールバックしない（誤配置防止）。
  if (base.length >= 4) return base;
  return base;
}

function isImpositionRowUpsideDown(rowIdx, rowCount, options = {}) {
  if (options.forceNoUpsideDown) return false;
  if (options.forceAllUpsideDown) return true;
  if (options.horizontalTrim && !options.use8up && rowCount >= 4) {
    // 横判16面付け（4×2）: 1行おきに天地反転し、追折り2回分の合わせを作る。
    return rowIdx % 2 === 1;
  }
  return rowIdx >= Math.ceil(rowCount / 2);
}

function getEffectiveTrimSizeText(meta) {
  const raw = String(meta?.trimSize || "").trim();
  if (raw) return raw;
  return LOCALE === "en" ? "A4 portrait" : "A4縦";
}

function isHorizontalTrimSize(trimTextRaw) {
  const text = String(trimTextRaw || "").trim();
  if (!text) return false;
  if (text.includes("横")) return true;
  return /(landscape|horizontal)/i.test(text);
}

function normalizeOpeningCanon(rawOpening) {
  const token = String(rawOpening || "").trim().toLowerCase();
  if (token === "right" || token === "右" || token === "右開き") return "right";
  return "left";
}

function normalizeImpositionPdfScalePercent(raw) {
  const n = Number.parseFloat(String(raw ?? ""));
  if (!Number.isFinite(n)) return 100;
  return Math.max(10, Math.min(300, Math.round(n)));
}

function toImpositionPdfRenderScale(percent) {
  const p = normalizeImpositionPdfScalePercent(percent);
  return `${(p / 100).toFixed(4)}`;
}

const DEFAULT_IMPOSITION_PRINT_LAYOUT = Object.freeze({
  printPaperSize: "A4",
  pdfScalePercent: 100,
  frontColXMMText: "",
  frontRowYMMText: "",
  backColXMMText: "",
  backRowYMMText: "",
});

const IMPOSITION_PRINT_PAPER_SIZES = Object.freeze(["A4", "A3", "B5", "B4"]);

const IMPOSITION_PRINT_PAPER_PRESETS_MM = Object.freeze({
  A4: { widthMm: 210, heightMm: 297 },
  A3: { widthMm: 297, heightMm: 420 },
  B5: { widthMm: 182, heightMm: 257 },
  B4: { widthMm: 257, heightMm: 364 },
});

/** デフォルト配置時の最小外周余白（mm） */
const IMPOSITION_DEFAULT_OUTER_MARGIN_MM = 8;

function normalizeImpositionPrintPaperSize(raw) {
  const s = String(raw || "").trim().toUpperCase();
  return IMPOSITION_PRINT_PAPER_SIZES.includes(s) ? s : "A4";
}

function isImpositionPrintPaperSizeToken(token) {
  const s = String(token || "").trim().toUpperCase();
  return IMPOSITION_PRINT_PAPER_SIZES.includes(s);
}

function getImpositionGridShape(use8up, horizontalTrim) {
  if (use8up) return { cols: 2, rows: 2 };
  if (horizontalTrim) return { cols: 2, rows: 4 };
  return { cols: 4, rows: 2 };
}

function formatImpositionMmForFile(n) {
  const v = Math.round(Number(n) * 100) / 100;
  if (!Number.isFinite(v)) return "0";
  return String(v);
}

function clampImpositionPosMm(n) {
  if (!Number.isFinite(n)) return 0;
  return Math.max(-50, Math.min(600, Math.round(n * 100) / 100));
}

function normalizeImpositionPosListText(raw, expectedCount = 0) {
  const text = String(raw ?? "").trim();
  if (!text || text === "-") return "";
  const parts = text
    .split(/[,\s、，]+/)
    .map((x) => x.trim())
    .filter(Boolean);
  const nums = [];
  for (const token of parts) {
    const n = Number.parseFloat(token);
    if (!Number.isFinite(n)) continue;
    nums.push(formatImpositionMmForFile(clampImpositionPosMm(n)));
  }
  if (nums.length === 0) return "";
  if (expectedCount > 0 && nums.length > expectedCount) nums.length = expectedCount;
  return nums.join(",");
}

function parseImpositionPosMmList(text, count) {
  const n = Math.max(0, Number(count) || 0);
  const out = new Array(n).fill(0);
  if (n === 0) return out;
  const raw = String(text ?? "").trim();
  if (!raw || raw === "-") return out;
  const tokens = raw.split(/[,\s、，]+/).map((x) => x.trim()).filter(Boolean);
  let last = 0;
  for (let i = 0; i < n; i += 1) {
    if (i < tokens.length) {
      const v = Number.parseFloat(tokens[i]);
      if (Number.isFinite(v)) {
        last = clampImpositionPosMm(v);
        out[i] = last;
        continue;
      }
    }
    out[i] = last;
  }
  return out;
}

function hasImpositionPosList(text, _expectedCount) {
  const raw = String(text ?? "").trim();
  if (!raw || raw === "-") return false;
  const parts = raw.split(/[,\s、，]+/).map((x) => x.trim()).filter(Boolean);
  return parts.some((token) => Number.isFinite(Number.parseFloat(token)));
}

function resolveImpositionPrintPageLayout(paperSizeRaw, use8up, horizontalTrim, _saddleStitch = false) {
  const paperSize = normalizeImpositionPrintPaperSize(paperSizeRaw);
  const preset = IMPOSITION_PRINT_PAPER_PRESETS_MM[paperSize] || IMPOSITION_PRINT_PAPER_PRESETS_MM.A4;
  const shortMm = Math.min(preset.widthMm, preset.heightMm);
  const longMm = Math.max(preset.widthMm, preset.heightMm);
  let pageName = "imposition";
  let pageLandscape = true;
  if (horizontalTrim) {
    if (use8up) {
      pageName = "impositionLandscape";
      pageLandscape = true;
    } else {
      pageName = "impositionPortrait";
      pageLandscape = false;
    }
  } else if (use8up) {
    pageName = "imposition8up";
    pageLandscape = false;
  }
  const pageW = pageLandscape ? longMm : shortMm;
  const pageH = pageLandscape ? shortMm : longMm;
  const pageOrientation = pageLandscape ? "landscape" : "portrait";
  return {
    paperSize,
    pageName,
    pageOrientation,
    pageSizeCss: `${paperSize} ${pageOrientation}`,
    pageWidthMm: pageW,
    pageHeightMm: pageH,
    pageMarginMm: 0,
    sideWidthMm: pageW,
    sideHeightMm: pageH,
  };
}

function computeDefaultImpositionPositions(pageW, pageH, cols, rows, trimW, trimH) {
  const colCount = Math.max(1, cols);
  const rowCount = Math.max(1, rows);
  const outer = IMPOSITION_DEFAULT_OUTER_MARGIN_MM;
  let cellW = Math.max(1, Number(trimW) || 1);
  let cellH = Math.max(1, Number(trimH) || 1);
  const maxW = Math.max(1, (pageW - 2 * outer) / colCount);
  const maxH = Math.max(1, (pageH - 2 * outer) / rowCount);
  const fit = Math.min(1, maxW / cellW, maxH / cellH);
  cellW = Math.round(cellW * fit * 100) / 100;
  cellH = Math.round(cellH * fit * 100) / 100;
  const gapX = (pageW - colCount * cellW) / (colCount + 1);
  const gapY = (pageH - rowCount * cellH) / (rowCount + 1);
  const colX = [];
  const rowY = [];
  for (let c = 0; c < colCount; c += 1) {
    colX.push(Math.round((gapX + c * (cellW + gapX)) * 100) / 100);
  }
  for (let r = 0; r < rowCount; r += 1) {
    rowY.push(Math.round((gapY + r * (cellH + gapY)) * 100) / 100);
  }
  return {
    cellWidthMm: cellW,
    cellHeightMm: cellH,
    colXMM: colX,
    rowYMM: rowY,
  };
}

function buildDefaultImpositionPrintLayout(options = {}) {
  const use8up = Boolean(options.use8up);
  const horizontalTrim = Boolean(options.horizontalTrim);
  const shape = getImpositionGridShape(use8up, horizontalTrim);
  const paperSize = normalizeImpositionPrintPaperSize(options.printPaperSize);
  const pageLayout = resolveImpositionPrintPageLayout(paperSize, use8up, horizontalTrim);
  const trim = parseTrimSizeToMm(options.trimText || getEffectiveTrimSizeText(state.meta));
  const pos = computeDefaultImpositionPositions(
    pageLayout.pageWidthMm,
    pageLayout.pageHeightMm,
    shape.cols,
    shape.rows,
    trim.widthMm,
    trim.heightMm,
  );
  const listX = pos.colXMM.map((n) => formatImpositionMmForFile(n)).join(",");
  const listY = pos.rowYMM.map((n) => formatImpositionMmForFile(n)).join(",");
  return normalizeImpositionPrintLayout({
    printPaperSize: paperSize,
    pdfScalePercent: options.pdfScalePercent ?? 100,
    frontColXMMText: listX,
    frontRowYMMText: listY,
    backColXMMText: listX,
    backRowYMMText: listY,
  }, shape);
}

function normalizeImpositionPrintLayout(raw, shape = null) {
  const d = { ...DEFAULT_IMPOSITION_PRINT_LAYOUT };
  if (!raw || typeof raw !== "object") return d;
  d.printPaperSize = normalizeImpositionPrintPaperSize(raw.printPaperSize);
  const s = Number(raw.pdfScalePercent);
  if (Number.isFinite(s)) d.pdfScalePercent = normalizeImpositionPdfScalePercent(s);
  const cols = shape?.cols || 0;
  const rows = shape?.rows || 0;
  d.frontColXMMText = normalizeImpositionPosListText(raw.frontColXMMText, cols);
  d.frontRowYMMText = normalizeImpositionPosListText(raw.frontRowYMMText, rows);
  d.backColXMMText = normalizeImpositionPosListText(raw.backColXMMText, cols);
  d.backRowYMMText = normalizeImpositionPosListText(raw.backRowYMMText, rows);
  return d;
}

function ensureImpositionPrintLayoutPositions(ip, options = {}) {
  const use8up = options.use8up != null ? Boolean(options.use8up) : Boolean(state.impositionOptions.use8up);
  const horizontalTrim = options.horizontalTrim != null
    ? Boolean(options.horizontalTrim)
    : isHorizontalTrimSize(state.meta?.trimSize);
  const shape = getImpositionGridShape(use8up, horizontalTrim);
  const base = normalizeImpositionPrintLayout(ip, shape);
  const hasFront = hasImpositionPosList(base.frontColXMMText, shape.cols)
    && hasImpositionPosList(base.frontRowYMMText, shape.rows);
  const hasBack = hasImpositionPosList(base.backColXMMText, shape.cols)
    && hasImpositionPosList(base.backRowYMMText, shape.rows);
  if (hasFront && hasBack) return base;
  const defaults = buildDefaultImpositionPrintLayout({
    printPaperSize: base.printPaperSize,
    pdfScalePercent: base.pdfScalePercent,
    use8up,
    horizontalTrim,
    trimText: getEffectiveTrimSizeText(state.meta),
  });
  return normalizeImpositionPrintLayout({
    ...defaults,
    printPaperSize: base.printPaperSize,
    pdfScalePercent: base.pdfScalePercent,
    frontColXMMText: hasFront ? base.frontColXMMText : defaults.frontColXMMText,
    frontRowYMMText: hasFront ? base.frontRowYMMText : defaults.frontRowYMMText,
    backColXMMText: hasBack ? base.backColXMMText : defaults.backColXMMText,
    backRowYMMText: hasBack ? base.backRowYMMText : defaults.backRowYMMText,
  }, shape);
}

function resolveImpositionCellSizeMm(pageW, pageH, colXMM, rowYMM, trimW, trimH) {
  const cols = Math.max(1, colXMM.length);
  const rows = Math.max(1, rowYMM.length);
  const outer = IMPOSITION_DEFAULT_OUTER_MARGIN_MM;
  const maxW = Math.max(1, (pageW - 2 * outer) / cols);
  const maxH = Math.max(1, (pageH - 2 * outer) / rows);
  const fit = Math.min(1, maxW / Math.max(1, Number(trimW) || 1), maxH / Math.max(1, Number(trimH) || 1));
  return {
    cellWidthMm: Math.round((Number(trimW) || 1) * fit * 100) / 100,
    cellHeightMm: Math.round((Number(trimH) || 1) * fit * 100) / 100,
  };
}

function resolveImpositionSheetGeometry(ip, options = {}) {
  const use8up = Boolean(options.use8up);
  const horizontalTrim = Boolean(options.horizontalTrim);
  const shape = getImpositionGridShape(use8up, horizontalTrim);
  const layout = ensureImpositionPrintLayoutPositions(ip, { use8up, horizontalTrim });
  const pageLayout = resolveImpositionPrintPageLayout(layout.printPaperSize, use8up, horizontalTrim);
  const sideKind = String(options.sideKind || "front");
  const colText = sideKind === "back" ? layout.backColXMMText : layout.frontColXMMText;
  const rowText = sideKind === "back" ? layout.backRowYMMText : layout.frontRowYMMText;
  const colCount = Math.max(shape.cols, Number(options.colCount) || 0, 1);
  const rowCount = Math.max(shape.rows, Number(options.rowCount) || 0, 1);
  const colXMM = parseImpositionPosMmList(colText, colCount);
  const rowYMM = parseImpositionPosMmList(rowText, rowCount);
  const trim = parseTrimSizeToMm(getEffectiveTrimSizeText(state.meta));
  const cell = resolveImpositionCellSizeMm(
    pageLayout.pageWidthMm,
    pageLayout.pageHeightMm,
    colXMM,
    rowYMM,
    trim.widthMm,
    trim.heightMm,
  );
  return {
    layout,
    pageWidthMm: pageLayout.pageWidthMm,
    pageHeightMm: pageLayout.pageHeightMm,
    pageOrientation: pageLayout.pageOrientation,
    paperSize: pageLayout.paperSize,
    colXMM,
    rowYMM,
    cellWidthMm: cell.cellWidthMm,
    cellHeightMm: cell.cellHeightMm,
    pdfScalePercent: layout.pdfScalePercent,
  };
}

function applyImpositionPrintDynamicPageStyles(layout) {
  let el = document.getElementById("impositionPrintDynamicStyle");
  if (!el) {
    el = document.createElement("style");
    el.id = "impositionPrintDynamicStyle";
    document.head.appendChild(el);
  }
  const pageW = layout.pageWidthMm;
  const pageH = layout.pageHeightMm;
  el.textContent = `@media print {
  @page {
    size: ${layout.pageSizeCss};
    margin: 0;
  }
  @page ${layout.pageName} {
    size: ${layout.pageSizeCss};
    margin: 0;
  }
  html,
  body.print-imposition {
    width: ${pageW}mm !important;
    min-width: ${pageW}mm !important;
    margin: 0 !important;
    padding: 0 !important;
  }
  body.print-imposition #printImpositionSheet {
    page: auto !important;
    width: ${pageW}mm !important;
    max-width: ${pageW}mm !important;
    margin: 0 !important;
    padding: 0 !important;
  }
  body.print-imposition #printImpositionSheet .imposition-side-page {
    page: auto !important;
    width: ${pageW}mm !important;
    max-width: ${pageW}mm !important;
    height: ${pageH}mm !important;
    margin: 0 !important;
    padding: 0 !important;
    box-sizing: border-box !important;
    overflow: hidden !important;
  }
}`;
}

function clearImpositionPrintDynamicPageStyles() {
  const el = document.getElementById("impositionPrintDynamicStyle");
  if (el) el.textContent = "";
}

function parseImpositionPrintDirectiveValues(parts, shape = null) {
  const t = Array.isArray(parts) ? parts.map((x) => String(x ?? "").trim()) : [];
  let offset = 0;
  let printPaperSize = "A4";
  if (t.length > 0 && isImpositionPrintPaperSizeToken(t[0])) {
    printPaperSize = normalizeImpositionPrintPaperSize(t[0]);
    offset = 1;
  }
  const raw = {
    printPaperSize,
    pdfScalePercent: t[offset] !== undefined && t[offset] !== "" ? Number.parseFloat(t[offset]) : NaN,
    frontColXMMText: t[offset + 1] !== undefined ? String(t[offset + 1] || "") : "",
    frontRowYMMText: t[offset + 2] !== undefined ? String(t[offset + 2] || "") : "",
    backColXMMText: t[offset + 3] !== undefined ? String(t[offset + 3] || "") : "",
    backRowYMMText: t[offset + 4] !== undefined ? String(t[offset + 4] || "") : "",
  };
  // 旧形式（単一数値の間隔・オフセット）は位置未設定として扱い、後でデフォルト化する。
  const looksLegacyNumeric = [raw.frontColXMMText, raw.frontRowYMMText, raw.backColXMMText, raw.backRowYMMText]
    .every((v) => v === "" || /^[-+]?(?:\d+\.?\d*|\.\d+)$/.test(String(v).trim()));
  if (looksLegacyNumeric && !String(raw.frontColXMMText).includes(",")) {
    return normalizeImpositionPrintLayout({
      printPaperSize,
      pdfScalePercent: raw.pdfScalePercent,
      frontColXMMText: "",
      frontRowYMMText: "",
      backColXMMText: "",
      backRowYMMText: "",
    }, shape);
  }
  return normalizeImpositionPrintLayout(raw, shape);
}

function getImpositionPrintLayoutForCurrentMode(meta, use8up) {
  const m = meta || {};
  const horizontalTrim = isHorizontalTrimSize(m.trimSize);
  const shape = getImpositionGridShape(Boolean(use8up), horizontalTrim);
  return use8up
    ? normalizeImpositionPrintLayout(m.impositionPrint8Up, shape)
    : normalizeImpositionPrintLayout(m.impositionPrint16Up, shape);
}

function parseImpositionPrintFileTokens(parts) {
  const t = Array.isArray(parts) ? parts.map((x) => String(x ?? "").trim()) : [];
  const shape8 = getImpositionGridShape(true, false);
  const shape16 = getImpositionGridShape(false, false);
  // 新形式: 8面(紙・拡大・表列・表行・裏列・裏行) + 16面(同) = 12トークン
  if (t.length >= 12 && isImpositionPrintPaperSizeToken(t[0])) {
    return {
      impositionPrint8Up: parseImpositionPrintDirectiveValues(t.slice(0, 6), shape8),
      impositionPrint16Up: parseImpositionPrintDirectiveValues(t.slice(6, 12), shape16),
    };
  }
  if (t.length >= 6 && isImpositionPrintPaperSizeToken(t[0])) {
    const one = parseImpositionPrintDirectiveValues(t.slice(0, 6), shape16);
    return {
      impositionPrint8Up: { ...one },
      impositionPrint16Up: { ...one },
    };
  }
  // 旧形式は破棄して空（ensure 時にデフォルト生成）
  return {
    impositionPrint8Up: normalizeImpositionPrintLayout({}, shape8),
    impositionPrint16Up: normalizeImpositionPrintLayout({}, shape16),
  };
}

function formatImpositionPrintDirectiveLine(meta) {
  const horizontalTrim = isHorizontalTrimSize(meta?.trimSize);
  const a = ensureImpositionPrintLayoutPositions(
    normalizeImpositionPrintLayout(meta?.impositionPrint8Up, getImpositionGridShape(true, horizontalTrim)),
    { use8up: true, horizontalTrim },
  );
  const b = ensureImpositionPrintLayoutPositions(
    normalizeImpositionPrintLayout(meta?.impositionPrint16Up, getImpositionGridShape(false, horizontalTrim)),
    { use8up: false, horizontalTrim },
  );
  const pack = (ip) => [
    ip.printPaperSize,
    String(ip.pdfScalePercent),
    ip.frontColXMMText || "-",
    ip.frontRowYMMText || "-",
    ip.backColXMMText || "-",
    ip.backRowYMMText || "-",
  ].join("\t");
  return `//${headByCanon("imposition-print")}\t${pack(a)}\t${pack(b)}`;
}

function upsertImpositionPrintLine(text, meta) {
  const lineText = formatImpositionPrintDirectiveLine(meta);
  const lines = String(text || "").split(/\r?\n/);
  const findDirectiveIndex = (canon) =>
    lines.findIndex((raw) => {
      const trimmed = String(raw || "").trimStart();
      if (!trimmed.startsWith("//")) return false;
      const tokens = parseLineTokens(trimmed.slice(2).trimStart());
      return tokens.length > 0 && canonHead(tokens[0]) === canon;
    });

  const impIdx = findDirectiveIndex("imposition-print");
  if (impIdx >= 0) {
    lines[impIdx] = lineText;
    return lines.join("\n");
  }

  const widthsIdx = findDirectiveIndex("article-list-widths");
  if (widthsIdx >= 0) {
    lines.splice(widthsIdx + 1, 0, lineText);
    return lines.join("\n");
  }

  const fieldsIdx = findDirectiveIndex("article-fields");
  if (fieldsIdx >= 0) {
    lines.splice(fieldsIdx + 1, 0, lineText);
    return lines.join("\n");
  }

  const footerIdx = lines.findIndex((ln) => String(ln || "").trim() === "//*\tこのデータはAutoDaiwarer用です。");
  if (footerIdx >= 0) {
    lines.splice(Math.max(0, footerIdx), 0, lineText);
    return lines.join("\n");
  }

  lines.push(lineText);
  return lines.join("\n");
}

async function ensurePdfJsLoaded() {
  if (window.pdfjsLib) return window.pdfjsLib;
  if (ensurePdfJsPromise) return ensurePdfJsPromise;
  ensurePdfJsPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = IMPOSITION_PDFJS_SRC;
    script.async = true;
    script.onload = () => {
      if (!window.pdfjsLib) {
        reject(new Error("PDF.js の読み込みに失敗しました。"));
        return;
      }
      try {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = IMPOSITION_PDFJS_WORKER_SRC;
      } catch (_e) {}
      resolve(window.pdfjsLib);
    };
    script.onerror = () => reject(new Error("PDF.js の読み込みに失敗しました。"));
    document.head.appendChild(script);
  });
  return ensurePdfJsPromise;
}

function hasImpositionPdfLoaded() {
  const ip = state.impositionPdf;
  if (ip.doc) return true;
  return Boolean(ip.spreadMode && (Number(ip.pageCount) || 0) > 0);
}

function resetImpositionPdfState() {
  state.impositionPdf.fileName = "";
  state.impositionPdf.doc = null;
  state.impositionPdf.pageCount = 0;
  state.impositionPdf.orientation = "";
  state.impositionPdf.imageByPageIndex = new Map();
  state.impositionPdf.spreadMode = false;
}

function updateImpositionPdfName() {
  if (!els.impositionPdfName) return;
  if (!state.impositionPdf.fileName) {
    els.impositionPdfName.textContent = LOCALE === "en" ? "No PDF loaded" : "未読み込み";
    return;
  }
  const count = Number(state.impositionPdf.pageCount) || 0;
  const spreadLabel = state.impositionPdf.spreadMode
    ? (LOCALE === "en" ? ", spread" : "・見開き")
    : "";
  els.impositionPdfName.textContent = count > 0
    ? `${state.impositionPdf.fileName} (${count}p${spreadLabel})`
    : state.impositionPdf.fileName;
}

async function loadImpositionPdfFile(file) {
  try {
    const pdfjs = await ensurePdfJsLoaded();
    const buf = await file.arrayBuffer();
    const task = pdfjs.getDocument({ data: buf });
    const doc = await task.promise;
    state.impositionPdf.fileName = file.name || "";
    state.impositionPdf.doc = doc;
    state.impositionPdf.pageCount = Number(doc.numPages) || 0;
    state.impositionPdf.orientation = await detectPdfOrientation(doc);
    state.impositionPdf.imageByPageIndex = new Map();
    state.impositionPdf.spreadMode = false;
    // 開き方向は PDF からは判定せず、台割テキストの //開き を常に使用する。
    syncImpositionDialogInputsFromMeta();
    updateImpositionPdfName();
    await renderImpositionPreview();
  } catch (error) {
    resetImpositionPdfState();
    updateImpositionPdfName();
    window.alert((error && error.message) || "PDFの読み込みに失敗しました。");
  } finally {
    try {
      if (els.impositionPdfLoader) els.impositionPdfLoader.value = "";
    } catch (_e) {}
  }
}

async function renderPdfSpreadPageToCanvas(doc, pdfPageIndex) {
  const page = await doc.getPage(pdfPageIndex);
  const baseViewport = page.getViewport({ scale: 1 });
  const targetWidthPx = 680;
  const scale = targetWidthPx / Math.max(1, baseViewport.width);
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.floor(viewport.width));
  canvas.height = Math.max(1, Math.floor(viewport.height));
  const ctx = canvas.getContext("2d", { alpha: false });
  if (!ctx) return null;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  await page.render({ canvasContext: ctx, viewport }).promise;
  return canvas;
}

function cropSpreadCanvasHalf(sourceCanvas, side) {
  const halfW = Math.max(1, Math.floor(sourceCanvas.width / 2));
  const fullH = sourceCanvas.height;
  const out = document.createElement("canvas");
  out.width = halfW;
  out.height = fullH;
  const ctx = out.getContext("2d");
  if (!ctx) return "";
  const sx = side === "left" ? 0 : halfW;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, halfW, fullH);
  ctx.drawImage(sourceCanvas, sx, 0, halfW, fullH, 0, 0, halfW, fullH);
  return out.toDataURL("image/jpeg", 0.92);
}

async function buildImpositionSpreadPdfImages(doc, opening = "left") {
  const isRightOpening = String(opening || "left").toLowerCase() === "right";
  const numPdfPages = Number(doc?.numPages) || 0;
  const images = new Map();
  if (numPdfPages <= 0) return { images, pageCount: 0 };

  let logicalPage = 0;
  for (let pdfIdx = 1; pdfIdx <= numPdfPages; pdfIdx += 1) {
    const canvas = await renderPdfSpreadPageToCanvas(doc, pdfIdx);
    if (!canvas) continue;
    const isFirst = pdfIdx === 1;
    const isLast = pdfIdx === numPdfPages;

    const appendHalf = (side) => {
      const image = cropSpreadCanvasHalf(canvas, side);
      if (!image) return;
      logicalPage += 1;
      images.set(logicalPage, image);
    };

    if (isRightOpening) {
      if (isFirst) {
        appendHalf("left");
      } else if (isLast) {
        appendHalf("right");
      } else {
        appendHalf("right");
        appendHalf("left");
      }
    } else if (isFirst) {
      appendHalf("right");
    } else if (isLast) {
      appendHalf("left");
    } else {
      appendHalf("left");
      appendHalf("right");
    }
  }

  return { images, pageCount: logicalPage };
}

async function loadImpositionSpreadPdfFile(file) {
  try {
    const pdfjs = await ensurePdfJsLoaded();
    const buf = await file.arrayBuffer();
    const task = pdfjs.getDocument({ data: buf });
    const doc = await task.promise;
    const opening = String(state.meta?.opening || "left").toLowerCase() === "right" ? "right" : "left";
    const { images, pageCount } = await buildImpositionSpreadPdfImages(doc, opening);
    if (pageCount <= 0) {
      throw new Error(LOCALE === "en" ? "No pages found in the PDF." : "PDFにページがありません。");
    }
    state.impositionPdf.fileName = file.name || "";
    state.impositionPdf.doc = null;
    state.impositionPdf.pageCount = pageCount;
    state.impositionPdf.orientation = isHorizontalTrimSize(state.meta?.trimSize) ? "landscape" : "portrait";
    state.impositionPdf.imageByPageIndex = images;
    state.impositionPdf.spreadMode = true;
    syncImpositionDialogInputsFromMeta();
    updateImpositionPdfName();
    await renderImpositionPreview();
  } catch (error) {
    resetImpositionPdfState();
    updateImpositionPdfName();
    window.alert((error && error.message) || "PDFの読み込みに失敗しました。");
  } finally {
    try {
      if (els.impositionPdfLoader) els.impositionPdfLoader.value = "";
    } catch (_e) {}
  }
}

async function detectPdfOrientation(doc) {
  const pageCount = Number(doc?.numPages) || 0;
  if (pageCount <= 0) return "unknown";
  const sampleCount = Math.min(pageCount, 6);
  let portrait = 0;
  let landscape = 0;
  for (let i = 1; i <= sampleCount; i += 1) {
    const page = await doc.getPage(i);
    const viewport = page.getViewport({ scale: 1 });
    const w = Number(viewport?.width) || 0;
    const h = Number(viewport?.height) || 0;
    if (w <= 0 || h <= 0) continue;
    if (w > h * 1.02) landscape += 1;
    else if (h > w * 1.02) portrait += 1;
  }
  if (portrait > 0 && landscape === 0) return "portrait";
  if (landscape > 0 && portrait === 0) return "landscape";
  if (portrait === 0 && landscape === 0) return "unknown";
  return "mixed";
}

async function buildImpositionPdfImageMapForBoards(boards) {
  const out = new Map();
  const pageCount = Number(state.impositionPdf.pageCount) || 0;
  if (!hasImpositionPdfLoaded() || pageCount <= 0) return out;
  const need = new Set();
  for (const board of boards || []) {
    for (const slot of board?.pageItems || []) {
      const idx = Number(slot?.sourcePageIndex) || 0;
      if (idx <= 0 || idx > pageCount) continue;
      need.add(idx);
    }
  }
  const tasks = [...need].map(async (idx) => {
    const image = await renderPdfPageToDataUrl(idx);
    if (image) out.set(idx, image);
  });
  await Promise.all(tasks);
  return out;
}

async function renderPdfPageToDataUrl(pageIndex) {
  const cache = state.impositionPdf.imageByPageIndex;
  if (cache instanceof Map && cache.has(pageIndex)) return cache.get(pageIndex) || "";
  if (state.impositionPdf.spreadMode) return "";
  const doc = state.impositionPdf.doc;
  const pageCount = Number(state.impositionPdf.pageCount) || 0;
  if (!doc || pageIndex < 1 || pageIndex > pageCount) return "";
  const page = await doc.getPage(pageIndex);
  const baseViewport = page.getViewport({ scale: 1 });
  const targetWidthPx = 680;
  const scale = targetWidthPx / Math.max(1, baseViewport.width);
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.floor(viewport.width));
  canvas.height = Math.max(1, Math.floor(viewport.height));
  const ctx = canvas.getContext("2d", { alpha: false });
  if (!ctx) return "";
  await page.render({ canvasContext: ctx, viewport }).promise;
  const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
  if (cache instanceof Map) cache.set(pageIndex, dataUrl);
  return dataUrl;
}

const TRIM_SIZE_PRESETS_MM = Object.freeze({
  A4: { widthMm: 210, heightMm: 297 },
  A5: { widthMm: 148, heightMm: 210 },
  B5: { widthMm: 182, heightMm: 257 },
  B6: { widthMm: 128, heightMm: 182 },
  AB: { widthMm: 210, heightMm: 296 },
  新書: { widthMm: 105, heightMm: 173 },
});

function parseTrimSizeToMm(trimTextRaw) {
  const text = String(trimTextRaw || "").trim();
  const horizontal = /(横|landscape|horizontal)/i.test(text);
  const customMatch = text.match(/(\d+(?:\.\d+)?)\s*[×xX]\s*(\d+(?:\.\d+)?)/);
  if (customMatch) {
    let widthMm = Number.parseFloat(customMatch[1]);
    let heightMm = Number.parseFloat(customMatch[2]);
    if (!Number.isFinite(widthMm) || !Number.isFinite(heightMm) || widthMm <= 0 || heightMm <= 0) {
      widthMm = TRIM_SIZE_PRESETS_MM.A4.widthMm;
      heightMm = TRIM_SIZE_PRESETS_MM.A4.heightMm;
    }
    if (horizontal && widthMm < heightMm) {
      [widthMm, heightMm] = [heightMm, widthMm];
    } else if (!horizontal && widthMm > heightMm) {
      [widthMm, heightMm] = [heightMm, widthMm];
    }
    return { widthMm, heightMm };
  }

  let preset = TRIM_SIZE_PRESETS_MM.A4;
  if (/新書/.test(text)) preset = TRIM_SIZE_PRESETS_MM.新書;
  else if (/AB/i.test(text)) preset = TRIM_SIZE_PRESETS_MM.AB;
  else if (/B6/i.test(text)) preset = TRIM_SIZE_PRESETS_MM.B6;
  else if (/B5/i.test(text)) preset = TRIM_SIZE_PRESETS_MM.B5;
  else if (/A5/i.test(text)) preset = TRIM_SIZE_PRESETS_MM.A5;
  else if (/A4/i.test(text)) {
    preset = /(変形|変)/.test(text)
      ? { widthMm: 210, heightMm: 275 }
      : TRIM_SIZE_PRESETS_MM.A4;
  }

  let widthMm = preset.widthMm;
  let heightMm = preset.heightMm;
  if (horizontal) [widthMm, heightMm] = [heightMm, widthMm];
  return { widthMm, heightMm };
}

function showImpositionProcessing(message) {
  impositionProcessingDepth += 1;
  if (els.impositionProcessingOverlay) {
    els.impositionProcessingOverlay.classList.remove("hidden");
    els.impositionProcessingOverlay.setAttribute("aria-busy", "true");
  }
  if (els.impositionProcessingMessage) {
    els.impositionProcessingMessage.textContent = message
      || (LOCALE === "en" ? "Processing…" : "処理中…");
  }
}

function hideImpositionProcessing() {
  impositionProcessingDepth = Math.max(0, impositionProcessingDepth - 1);
  if (impositionProcessingDepth > 0) return;
  if (els.impositionProcessingOverlay) {
    els.impositionProcessingOverlay.classList.add("hidden");
    els.impositionProcessingOverlay.setAttribute("aria-busy", "false");
  }
}

async function withImpositionProcessing(message, fn) {
  showImpositionProcessing(message);
  try {
    return await fn();
  } finally {
    hideImpositionProcessing();
  }
}

async function ensureJsZipLoaded() {
  if (window.JSZip) return window.JSZip;
  if (ensureJsZipPromise) return ensureJsZipPromise;
  ensureJsZipPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = IMPOSITION_JSZIP_SRC;
    script.async = true;
    script.onload = () => {
      if (!window.JSZip) {
        reject(new Error(LOCALE === "en" ? "Failed to load JSZip." : "JSZip の読み込みに失敗しました。"));
        return;
      }
      resolve(window.JSZip);
    };
    script.onerror = () => reject(new Error(LOCALE === "en" ? "Failed to load JSZip." : "JSZip の読み込みに失敗しました。"));
    document.head.appendChild(script);
  });
  return ensureJsZipPromise;
}

async function ensurePdfLibLoaded() {
  if (window.PDFLib) return window.PDFLib;
  if (ensurePdfLibPromise) return ensurePdfLibPromise;
  ensurePdfLibPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = IMPOSITION_PDFLIB_SRC;
    script.async = true;
    script.onload = () => {
      if (!window.PDFLib) {
        reject(new Error(LOCALE === "en" ? "Failed to load pdf-lib." : "pdf-lib の読み込みに失敗しました。"));
        return;
      }
      resolve(window.PDFLib);
    };
    script.onerror = () => reject(new Error(LOCALE === "en" ? "Failed to load pdf-lib." : "pdf-lib の読み込みに失敗しました。"));
    document.head.appendChild(script);
  });
  return ensurePdfLibPromise;
}

function mmToPxForImpositionPrint(mm) {
  return (Number(mm) || 0) * (IMPOSITION_PRINT_PDF_DPI / 25.4);
}

function dataUrlToBytes(dataUrl) {
  const match = String(dataUrl || "").match(/^data:([^;]+);base64,(.+)$/);
  if (!match) return null;
  const binary = atob(match[2]);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return { mime: match[1], bytes };
}

function loadHtmlImageFromSrc(src) {
  return new Promise((resolve) => {
    if (!src) {
      resolve(null);
      return;
    }
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function drawContainedImage(ctx, img, x, y, w, h, scaleFactor = 1) {
  if (!img || w <= 0 || h <= 0) return;
  const iw = Math.max(1, img.naturalWidth || img.width || 1);
  const ih = Math.max(1, img.naturalHeight || img.height || 1);
  const fit = Math.min(w / iw, h / ih);
  const drawW = iw * fit * scaleFactor;
  const drawH = ih * fit * scaleFactor;
  const dx = x + (w - drawW) / 2;
  const dy = y + (h - drawH) / 2;
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  ctx.drawImage(img, dx, dy, drawW, drawH);
  ctx.restore();
}

function drawImpositionTextSlot(ctx, slot, x, y, w, h, upsideDown, showPageLabel = true) {
  ctx.save();
  if (upsideDown) {
    ctx.translate(x + w / 2, y + h / 2);
    ctx.rotate(Math.PI);
    ctx.translate(-(x + w / 2), -(y + h / 2));
  }
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = "#1f4f96";
  ctx.lineWidth = Math.max(1, mmToPxForImpositionPrint(0.5));
  ctx.strokeRect(x + 1, y + 1, Math.max(0, w - 2), Math.max(0, h - 2));
  const pad = Math.max(4, Math.min(w, h) * 0.04);
  ctx.fillStyle = "#111111";
  ctx.font = `bold ${Math.max(10, Math.min(w, h) * 0.08)}px "Yu Gothic UI", Meiryo, sans-serif`;
  ctx.textBaseline = "top";
  const title = String(slot?.title || "").trim() || (LOCALE === "en" ? "(Blank)" : "（空白）");
  ctx.fillText(title, x + pad, y + pad, Math.max(8, w - pad * 2));
  if (showPageLabel) {
    drawImpositionFolioOnCanvas(ctx, slot?.pageNo, x, y, w, h);
  }
  ctx.restore();
}

function drawImpositionFolioOnCanvas(ctx, pageNo, x, y, w, h) {
  const folio = formatImpositionFolioFootLabel(pageNo);
  if (!folio) return;
  const pad = Math.max(4, Math.min(w, h) * 0.04);
  const fontSize = Math.max(9, Math.min(w, h) * 0.055);
  ctx.save();
  ctx.fillStyle = "rgba(255,255,255,0.88)";
  const labelW = Math.min(w - pad * 2, fontSize * Math.max(2.2, String(folio).length * 0.72));
  const labelH = fontSize * 1.35;
  ctx.fillRect(x + pad, y + h - pad - labelH, labelW, labelH);
  ctx.fillStyle = "#111111";
  ctx.font = `bold ${fontSize}px "Yu Gothic UI", Meiryo, sans-serif`;
  ctx.textBaseline = "bottom";
  ctx.fillText(String(folio), x + pad + 2, y + h - pad - 1, Math.max(8, w - pad * 2));
  ctx.restore();
}

function drawImpositionSpineMarkOnCanvas(ctx, placement, foldNo, colXPx, rowYPx, cellW, cellH, rowCount) {
  if (!placement || !Number.isFinite(Number(foldNo))) return;
  const titleShort = getImpositionSpineTitleShort(state.meta);
  const label = `${titleShort} 《${foldNo}》`;
  const fontSize = Math.max(8, Math.min(cellW, cellH) * 0.035);
  ctx.save();
  ctx.strokeStyle = "rgba(30,30,30,0.45)";
  ctx.fillStyle = "#1a1a1a";
  ctx.lineWidth = Math.max(1, mmToPxForImpositionPrint(0.18));
  ctx.font = `bold ${fontSize}px "Yu Gothic UI", Meiryo, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  if (placement.kind === "between-cols") {
    const row = Number(placement.row);
    if (!Number.isFinite(row) || row < 0 || row >= rowCount) {
      ctx.restore();
      return;
    }
    const k = Number(placement.k);
    const x0 = Number(colXPx[k]) || 0;
    const x1 = Number(colXPx[k + 1]) || (x0 + cellW);
    const lineX = (x0 + cellW + x1) / 2;
    const topY = Number(rowYPx[row]) || 0;
    const bottomY = topY + cellH;
    const midY = (topY + bottomY) / 2;
    const halfGap = Math.max(8, fontSize * String(label).length * 0.55);
    ctx.beginPath();
    ctx.moveTo(lineX, topY);
    ctx.lineTo(lineX, midY - halfGap);
    ctx.moveTo(lineX, midY + halfGap);
    ctx.lineTo(lineX, bottomY);
    ctx.stroke();
    ctx.save();
    ctx.translate(lineX, midY);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(label, 0, 0);
    ctx.restore();
  } else if (placement.kind === "between-rows") {
    const c = Number(placement.c);
    const upper = Number(placement.upperRow);
    const y0 = Number(rowYPx[upper]) || 0;
    const y1 = Number(rowYPx[upper + 1]) || (y0 + cellH);
    const lineY = (y0 + cellH + y1) / 2;
    const leftX = Number(colXPx[c]) || 0;
    const rightX = leftX + cellW;
    const midX = (leftX + rightX) / 2;
    const halfGap = Math.max(10, fontSize * String(label).length * 0.42);
    ctx.beginPath();
    ctx.moveTo(leftX, lineY);
    ctx.lineTo(midX - halfGap, lineY);
    ctx.moveTo(midX + halfGap, lineY);
    ctx.lineTo(rightX, lineY);
    ctx.stroke();
    ctx.fillText(label, midX, lineY);
  }
  ctx.restore();
}

async function renderImpositionSheetToJpegBytes(sheet, pageLayout, ip) {
  const pageWpx = Math.max(1, Math.round(mmToPxForImpositionPrint(pageLayout.pageWidthMm)));
  const pageHpx = Math.max(1, Math.round(mmToPxForImpositionPrint(pageLayout.pageHeightMm)));
  const canvas = document.createElement("canvas");
  canvas.width = pageWpx;
  canvas.height = pageHpx;
  const ctx = canvas.getContext("2d", { alpha: false });
  if (!ctx) throw new Error(LOCALE === "en" ? "Canvas unavailable." : "Canvas を利用できません。");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, pageWpx, pageHpx);

  const rows = Array.isArray(sheet?.rows) ? sheet.rows : [];
  const rowCount = Math.max(1, rows.length);
  const colCount = Math.max(1, ...rows.map((row) => (Array.isArray(row) ? row.length : 0)), 1);
  const options = {
    horizontalTrim: Boolean(sheet?.horizontalTrim) || isHorizontalTrimSize(state.meta?.trimSize),
    use8up: sheet?.use8up != null ? Boolean(sheet.use8up) : Boolean(state.impositionOptions.use8up),
    forceAllUpsideDown: Boolean(sheet?.forceAllUpsideDown),
    forceNoUpsideDown: Boolean(sheet?.forceNoUpsideDown),
  };
  const sideKind = String(sheet?.sideKind || "front");
  const geometry = resolveImpositionSheetGeometry(ip, {
    use8up: options.use8up,
    horizontalTrim: options.horizontalTrim,
    colCount,
    rowCount,
    sideKind,
  });
  const cellW = mmToPxForImpositionPrint(geometry.cellWidthMm);
  const cellH = mmToPxForImpositionPrint(geometry.cellHeightMm);
  const colXPx = geometry.colXMM.map((mm) => mmToPxForImpositionPrint(mm));
  const rowYPx = geometry.rowYMM.map((mm) => mmToPxForImpositionPrint(mm));
  const pdfScale = Number.parseFloat(toImpositionPdfRenderScale(ip.pdfScalePercent)) || 1;
  const showPageLabel = sheet?.showPageLabel != null
    ? Boolean(sheet.showPageLabel)
    : Boolean(state.impositionOptions.showPageLabel);
  const halfMode = Boolean(sheet?.halfMode);
  const signatureSize = options.use8up || halfMode ? 8 : 16;
  const spinePlacement = sideKind === "front"
    ? findImpositionSpineAdjacencyByCandidates(
      rows,
      signatureSize <= 8 ? [[1, 8]] : [[1, 16]],
    )
    : null;
  const foldNo = Number(sheet?.spineFixedNo);

  const drawGrid = async (targetCtx) => {
    for (let r = 0; r < rowCount; r += 1) {
      const row = Array.isArray(rows[r]) ? rows[r] : [];
      const upsideDown = isImpositionRowUpsideDown(r, rowCount, options);
      for (let c = 0; c < colCount; c += 1) {
        const slot = row[c];
        const x = Number(colXPx[c]) || 0;
        const y = Number(rowYPx[r]) || 0;
        if (!slot) continue;
        if (slot.pdfImage) {
          const img = await loadHtmlImageFromSrc(slot.pdfImage);
          targetCtx.save();
          if (upsideDown) {
            targetCtx.translate(x + cellW / 2, y + cellH / 2);
            targetCtx.rotate(Math.PI);
            targetCtx.translate(-(x + cellW / 2), -(y + cellH / 2));
          }
          targetCtx.fillStyle = "#ffffff";
          targetCtx.fillRect(x, y, cellW, cellH);
          if (img) drawContainedImage(targetCtx, img, x, y, cellW, cellH, pdfScale);
          if (showPageLabel) drawImpositionFolioOnCanvas(targetCtx, slot.pageNo, x, y, cellW, cellH);
          targetCtx.restore();
        } else {
          drawImpositionTextSlot(targetCtx, slot, x, y, cellW, cellH, upsideDown, showPageLabel);
        }
      }
    }
    if (spinePlacement && Number.isFinite(foldNo) && foldNo >= 1) {
      drawImpositionSpineMarkOnCanvas(
        targetCtx,
        spinePlacement,
        foldNo,
        colXPx,
        rowYPx,
        cellW,
        cellH,
        rowCount,
      );
    }
  };

  if (sheet.rotateWhole) {
    const layer = document.createElement("canvas");
    layer.width = pageWpx;
    layer.height = pageHpx;
    const layerCtx = layer.getContext("2d", { alpha: false });
    if (!layerCtx) throw new Error(LOCALE === "en" ? "Canvas unavailable." : "Canvas を利用できません。");
    layerCtx.fillStyle = "#ffffff";
    layerCtx.fillRect(0, 0, pageWpx, pageHpx);
    await drawGrid(layerCtx);
    ctx.translate(pageWpx / 2, pageHpx / 2);
    ctx.rotate(Math.PI);
    ctx.drawImage(layer, -pageWpx / 2, -pageHpx / 2);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  } else {
    await drawGrid(ctx);
  }

  const dataUrl = canvas.toDataURL("image/jpeg", 0.93);
  const parsed = dataUrlToBytes(dataUrl);
  if (!parsed) throw new Error(LOCALE === "en" ? "Failed to encode sheet image." : "シート画像のエンコードに失敗しました。");
  return parsed.bytes;
}

async function buildImpositionPrintPdfBlob(sheets, pageLayout, ip) {
  const PDFLib = await ensurePdfLibLoaded();
  const pdfDoc = await PDFLib.PDFDocument.create();
  const pageWidthPt = pageLayout.pageWidthMm * IMPOSITION_MM_TO_PT;
  const pageHeightPt = pageLayout.pageHeightMm * IMPOSITION_MM_TO_PT;
  for (const sheet of sheets) {
    const jpegBytes = await renderImpositionSheetToJpegBytes(sheet, pageLayout, ip);
    const image = await pdfDoc.embedJpg(jpegBytes);
    const page = pdfDoc.addPage([pageWidthPt, pageHeightPt]);
    page.drawImage(image, {
      x: 0,
      y: 0,
      width: pageWidthPt,
      height: pageHeightPt,
    });
  }
  const bytes = await pdfDoc.save();
  return new Blob([bytes], { type: "application/pdf" });
}

function summarizeRoughExportPage(page, entryById) {
  const large = String(page?.rows?.large?.text || "").trim();
  const middle = String(page?.rows?.middle?.text || "").trim();
  const small = String(page?.rows?.small?.text || "").trim();
  const title = small || middle || large || (LOCALE === "en" ? "(Untitled)" : "（無題）");
  return { large, middle, small, title };
}

function roughArticleCombinationKey(fields) {
  return `${String(fields.large || "")}\u0001${String(fields.middle || "")}\u0001${String(fields.small || "")}`;
}

function assignRoughExportDupIndices(pages) {
  const keyCount = new Map();
  for (const page of pages || []) {
    const key = roughArticleCombinationKey(page);
    keyCount.set(key, (keyCount.get(key) || 0) + 1);
  }
  const keySeen = new Map();
  return (pages || []).map((page) => {
    const key = roughArticleCombinationKey(page);
    if ((keyCount.get(key) || 0) <= 1) return { ...page, dupIndex: 0 };
    const next = (keySeen.get(key) || 0) + 1;
    keySeen.set(key, next);
    return { ...page, dupIndex: next };
  });
}

function getRoughArticleBottomLevel(fields) {
  const large = String(fields?.large || "").trim();
  const middle = String(fields?.middle || "").trim();
  const small = String(fields?.small || "").trim();
  if (small) return { level: "small", name: small };
  if (middle) return { level: "middle", name: middle };
  if (large) return { level: "large", name: large };
  return { level: "none", name: "" };
}

function roughSpreadSourceSlotKey(slot) {
  return `${Number(slot?.slideIndex) || 0}:${String(slot?.side || "")}`;
}

function hashStringFnv1a(input, seed = 0x811c9dc5) {
  let hash = seed >>> 0;
  const text = String(input || "");
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash >>> 0;
}

function buildRoughArticleMatchKey(fields) {
  const large = String(fields?.large || "");
  const middle = String(fields?.middle || "");
  const small = String(fields?.small || "");
  const dupIndex = Number(fields?.dupIndex) || 0;
  const raw = `L:${large}\u0001M:${middle}\u0001S:${small}\u0001D:${dupIndex}`;
  const h1 = hashStringFnv1a(raw, 0x811c9dc5).toString(36);
  const h2 = hashStringFnv1a(raw, 0x9e3779b1).toString(36);
  return `${h1}${h2}`;
}

function computeRoughArticleHashes(fields) {
  const bottom = getRoughArticleBottomLevel(fields);
  const large = String(fields?.large || "").trim();
  const middle = String(fields?.middle || "").trim();
  return {
    bottomHash: bottom.name ? hashStringFnv1a(bottom.name, 0x811c9dc5).toString(36) : "",
    middleHash: middle ? hashStringFnv1a(middle, 0x9e3779b1).toString(36) : "",
    largeHash: large ? hashStringFnv1a(large, 0x85ebca6b).toString(36) : "",
  };
}

function getSlotBottomText(slot) {
  const small = String(slot?.small || "").trim();
  const middle = String(slot?.middle || "").trim();
  const large = String(slot?.large || "").trim();
  return small || middle || large;
}

function hasTextualSlotIdentity(slot) {
  return !!String(slot?.small || "").trim()
    || !!String(slot?.middle || "").trim()
    || !!String(slot?.large || "").trim();
}

function countTargetBottomMatches(allTargetPages, bottomText, bottomHash) {
  if (bottomText) {
    return (allTargetPages || []).filter((p) => getSlotBottomText(p) === bottomText).length;
  }
  if (bottomHash) {
    return (allTargetPages || []).filter((p) => String(p?.bottomHash || "") === bottomHash).length;
  }
  return 0;
}

function findMatchingSourceSlotForUpdate(target, sourceSlots, allTargetPages, usedSlotKeys) {
  const available = (sourceSlots || []).filter((slot) => !usedSlotKeys.has(roughSpreadSourceSlotKey(slot)));
  const targetDup = Number(target?.dupIndex) || 0;
  const targetSmall = String(target?.small || "").trim();
  const targetMiddle = String(target?.middle || "").trim();
  const targetLarge = String(target?.large || "").trim();
  const targetBottomText = targetSmall || targetMiddle || targetLarge;
  const targetBottomHash = String(target?.bottomHash || "");
  const targetMiddleHash = String(target?.middleHash || "");
  const targetLargeHash = String(target?.largeHash || "");

  // Preferred path: match by textual hierarchy
  if (targetBottomText) {
    let candidates = available.filter((slot) => getSlotBottomText(slot) === targetBottomText);
    if (candidates.length > 0) {
      const sameBottomCount = countTargetBottomMatches(allTargetPages, targetBottomText, "");
      if (sameBottomCount > 1) {
        if (targetSmall) {
          const byMiddle = candidates.filter((slot) => String(slot?.middle || "").trim() === targetMiddle);
          if (byMiddle.length > 0) candidates = byMiddle;
          const byLarge = candidates.filter((slot) => String(slot?.large || "").trim() === targetLarge);
          if (byLarge.length > 0) candidates = byLarge;
        } else if (targetMiddle) {
          const byLarge = candidates.filter((slot) => String(slot?.large || "").trim() === targetLarge);
          if (byLarge.length > 0) candidates = byLarge;
        }
      }
      if (candidates.length > 1 && targetDup > 0) {
        const byDup = candidates.filter((slot) => (Number(slot?.dupIndex) || 0) === targetDup);
        if (byDup.length > 0) candidates = byDup;
      }
      return candidates[0] || null;
    }
  }

  // Secondary path: hashed hierarchy (for metadata-only slots)
  if (targetBottomHash) {
    let candidates = available.filter((slot) => String(slot?.bottomHash || "") === targetBottomHash);
    if (candidates.length > 0) {
      const sameBottomCount = countTargetBottomMatches(allTargetPages, "", targetBottomHash);
      if (sameBottomCount > 1) {
        if (targetMiddleHash) {
          const byMiddle = candidates.filter((slot) => String(slot?.middleHash || "") === targetMiddleHash);
          if (byMiddle.length > 0) candidates = byMiddle;
        }
        if (targetLargeHash) {
          const byLarge = candidates.filter((slot) => String(slot?.largeHash || "") === targetLargeHash);
          if (byLarge.length > 0) candidates = byLarge;
        }
      }
      if (candidates.length > 1 && targetDup > 0) {
        const byDup = candidates.filter((slot) => (Number(slot?.dupIndex) || 0) === targetDup);
        if (byDup.length > 0) candidates = byDup;
      }
      return candidates[0] || null;
    }
  }

  // Legacy source fallback (old keyed metadata)
  const targetArticleKey = String(target?.articleKey || buildRoughArticleMatchKey(target) || "");
  if (targetArticleKey) {
    const byArticleKey = available.filter((slot) => String(slot?.articleKey || "") === targetArticleKey);
    if (byArticleKey.length > 0) return byArticleKey[0];
  }

  // Only unnamed pages may fallback by index.
  const bottom = getRoughArticleBottomLevel(target);
  if (!bottom.name && !targetBottomHash && !hasTextualSlotIdentity(target)) {
    const targetPageIndex = Number(target?.pageIndex) || 0;
    if (targetPageIndex > 0) {
      return available.find((slot) => (Number(slot?.pageIndex) || 0) === targetPageIndex) || null;
    }
  }
  return null;
}

function buildRoughExportPages() {
  const boardDisplayData = buildBoardDisplayData();
  const totalBetchoAdvance = (state.betchoes || []).reduce(
    (sum, b) => sum + pagesToUnits(b.advancePages || 0),
    0,
  );
  const layoutMeta = {
    ...state.meta,
    pages:
      state.meta.pages > 0
        ? Math.max(1, state.meta.pages - totalBetchoAdvance)
        : state.meta.pages,
  };
  const layoutResult = layout(boardDisplayData.entries, layoutMeta);
  const pages = layoutResult.pages || [];
  const usedPages = layoutResult.usedPages || 0;
  if (usedPages <= 0) return [];
  const boardSpecs = buildBoardSpecs(pages.length, state.boardDirectives || []);
  const advancePrefixByBoard = buildAdvancePrefixByBoard(boardDisplayData.betchoes, boardSpecs);
  const advanceByGlobalIndex = new Map();
  for (const spec of boardSpecs) {
    const advance = advancePrefixByBoard.get(spec.boardNo) || 0;
    for (let i = 0; i < spec.pages; i += 1) {
      advanceByGlobalIndex.set(spec.start + i, advance);
    }
  }
  const entryById = new Map(
    (boardDisplayData.entries || [])
      .filter((entry) => entry?.id)
      .map((entry) => [entry.id, entry]),
  );
  const out = [];
  for (let i = 0; i < usedPages; i += 1) {
    const page = pages[i];
    if (!page) continue;
    const summary = summarizeRoughExportPage(page, entryById);
    const advance = advanceByGlobalIndex.get(i) || 0;
    out.push({
      pageIndex: i + 1,
      pageNo: formatFlatplanFolioForPage(i, advance),
      large: summary.large,
      middle: summary.middle,
      small: summary.small,
      title: summary.title || "",
    });
  }
  return assignRoughExportDupIndices(out).map((page) => {
    const hashes = computeRoughArticleHashes(page);
    return {
      ...page,
      articleKey: buildRoughArticleMatchKey(page),
      bottomHash: hashes.bottomHash,
      middleHash: hashes.middleHash,
      largeHash: hashes.largeHash,
    };
  });
}

function buildRoughHeaderLines(pageData) {
  const lines = [];
  const large = String(pageData?.large || "").trim();
  const middle = String(pageData?.middle || "").trim();
  const small = String(pageData?.small || "").trim();
  if (large) lines.push(large);
  if (middle && middle !== large) lines.push(middle);
  if (small && small !== middle && small !== large) lines.push(small);
  const dupIndex = Number(pageData?.dupIndex) || 0;
  if (dupIndex > 0) lines.push(`(${dupIndex})`);
  return lines;
}

function renderRoughPdfPageCanvas(pageData, trimSize, pxPerMm, { hideLabels = false } = {}) {
  const widthPx = Math.max(1, Math.round(trimSize.widthMm * pxPerMm));
  const heightPx = Math.max(1, Math.round(trimSize.heightMm * pxPerMm));
  const canvas = document.createElement("canvas");
  canvas.width = widthPx;
  canvas.height = heightPx;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  const mm = (value) => value * pxPerMm;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, widthPx, heightPx);

  const contentLeft = mm(ROUGH_PDF_MARGIN_SIDE_MM);
  const contentTop = mm(ROUGH_PDF_MARGIN_TOP_MM);
  const contentRight = widthPx - mm(ROUGH_PDF_MARGIN_SIDE_MM);
  const contentBottom = heightPx - mm(ROUGH_PDF_MARGIN_BOTTOM_MM);
  const contentWidth = Math.max(1, contentRight - contentLeft);
  const contentHeight = Math.max(1, contentBottom - contentTop);

  ctx.strokeStyle = "#d8dce3";
  ctx.lineWidth = Math.max(1, pxPerMm * 0.2);
  ctx.strokeRect(contentLeft, contentTop, contentWidth, contentHeight);

  const headerLines = hideLabels ? [] : buildRoughHeaderLines(pageData);
  const pageNoText = hideLabels ? "" : String(pageData?.pageNo ?? "").trim();
  const fontFamily = '"Yu Gothic UI", "Yu Gothic", "Hiragino Sans", "Meiryo", sans-serif';
  const footerFontPx = Math.max(8, mm(ROUGH_PDF_FOOTER_FONT_MM));

  ctx.fillStyle = "#666666";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  if (headerLines.length > 0) {
    const bandPx = mm(ROUGH_PDF_HEADER_BAND_MM);
    const lineCount = headerLines.length;
    const lineFontPx = Math.max(7, Math.min(mm(ROUGH_PDF_HEADER_FONT_MM), bandPx / Math.max(1, lineCount * 1.15)));
    ctx.font = `${lineFontPx}px ${fontFamily}`;
    const startY = (bandPx - lineFontPx * (lineCount - 1)) / 2;
    headerLines.forEach((line, idx) => {
      ctx.fillText(line, widthPx / 2, startY + idx * lineFontPx * 1.15);
    });
  }
  if (pageNoText) {
    ctx.font = `${footerFontPx}px ${fontFamily}`;
    ctx.fillText(pageNoText, widthPx / 2, heightPx - mm(ROUGH_PDF_FOOTER_BAND_MM / 2));
  }

  return canvas;
}

function buildRoughSpreadManifest(pageItems, spreadSlides, trimSize, opening) {
  const slots = [];
  spreadSlides.forEach((spec, slideIndex) => {
    for (const side of ["left", "right"]) {
      const page = spec?.[side];
      if (!page) continue;
      slots.push({
        slideIndex,
        side,
        pageIndex: Number(page.pageIndex) || 0,
        pageNo: page.pageNo,
        large: page.large || "",
        middle: page.middle || "",
        small: page.small || "",
        dupIndex: Number(page.dupIndex) || 0,
        articleKey: String(page.articleKey || buildRoughArticleMatchKey(page)),
        bottomHash: String(page.bottomHash || computeRoughArticleHashes(page).bottomHash || ""),
        middleHash: String(page.middleHash || computeRoughArticleHashes(page).middleHash || ""),
        largeHash: String(page.largeHash || computeRoughArticleHashes(page).largeHash || ""),
      });
    }
  });
  return {
    version: 1,
    opening,
    trimSizeText: getEffectiveTrimSizeText(state.meta),
    trimWidthMm: trimSize.widthMm,
    trimHeightMm: trimSize.heightMm,
    pageCount: pageItems.length,
    slots,
  };
}

function encodeUtf8Base64Url(text) {
  const utf8 = unescape(encodeURIComponent(String(text || "")));
  return btoa(utf8).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function decodeUtf8Base64Url(text) {
  if (!text) return "";
  const base64 = String(text).replace(/-/g, "+").replace(/_/g, "/");
  const pad = "=".repeat((4 - (base64.length % 4 || 4)) % 4);
  return decodeURIComponent(escape(atob(base64 + pad)));
}

function buildAdwShapeName(pageData, side) {
  if (!pageData) return "";
  const hashes = computeRoughArticleHashes(pageData);
  const bottomHash = String(pageData.bottomHash || hashes.bottomHash || "0");
  const middleHash = String(pageData.middleHash || hashes.middleHash || "0");
  const largeHash = String(pageData.largeHash || hashes.largeHash || "0");
  const dupIndex = Number(pageData.dupIndex) || 0;
  const pageIndex = Number(pageData.pageIndex) || 0;
  return `ADW_${side}_${bottomHash}_${middleHash}_${largeHash}_${dupIndex}_${pageIndex}`;
}

function parseAdwShapeName(name) {
  const raw = String(name || "").trim();
  if (!raw) return null;
  if (raw.startsWith("ADW|")) {
    const parts = raw.split("|");
    if (parts.length >= 3) {
      const side = parts[1] === "left" || parts[1] === "right" ? parts[1] : "";
      try {
        const payload = JSON.parse(decodeUtf8Base64Url(parts.slice(2).join("|")));
        return {
          side,
          pageIndex: Number(payload?.p) || 0,
          pageNo: payload?.n,
          large: String(payload?.l || ""),
          middle: String(payload?.m || ""),
          small: String(payload?.s || ""),
          dupIndex: Number(payload?.d) || 0,
        };
      } catch (_error) {
        return null;
      }
    }
  }
  const hashed = raw.match(/^ADW_(left|right)_([a-z0-9]+)_([a-z0-9]+)_([a-z0-9]+)_(\d+)_(\d+)$/i);
  if (hashed) {
    return {
      sourceType: "background",
      side: hashed[1],
      articleKey: "",
      bottomHash: String(hashed[2] || ""),
      middleHash: String(hashed[3] || ""),
      largeHash: String(hashed[4] || ""),
      dupIndex: Number(hashed[5]) || 0,
      pageIndex: Number(hashed[6]) || 0,
      pageNo: "",
      large: "",
      middle: "",
      small: "",
    };
  }
  const keyed = raw.match(/^ADW_(left|right)_([a-z0-9]+)_(\d+)$/i);
  if (keyed) {
    return {
      side: keyed[1],
      articleKey: String(keyed[2] || ""),
      bottomHash: "",
      middleHash: "",
      largeHash: "",
      dupIndex: 0,
      pageIndex: Number(keyed[3]) || 0,
      pageNo: "",
      large: "",
      middle: "",
      small: "",
      dupIndex: 0,
    };
  }
  const legacy = raw.match(/^ADW_(\d+)_(left|right)$/);
  if (legacy) {
    return {
      side: legacy[2],
      articleKey: "",
      bottomHash: "",
      middleHash: "",
      largeHash: "",
      pageIndex: Number(legacy[1]) || 0,
      pageNo: "",
      large: "",
      middle: "",
      small: "",
      dupIndex: 0,
    };
  }
  return null;
}

function decodeXmlAttrText(text) {
  return String(text || "")
    .replace(/&quot;/g, "\"")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

async function buildManifestFromPptxShapeNames(zip) {
  const slotByHalf = new Map();
  const slidePaths = Object.keys(zip.files)
    .filter((name) => /^ppt\/slides\/slide\d+\.xml$/.test(name))
    .sort((a, b) => {
      const na = Number((a.match(/slide(\d+)\.xml$/) || [0, 0])[1]) || 0;
      const nb = Number((b.match(/slide(\d+)\.xml$/) || [0, 0])[1]) || 0;
      return na - nb;
    });
  for (const slidePath of slidePaths) {
    const slideFile = zip.file(slidePath);
    if (!slideFile) continue;
    const xml = await slideFile.async("string");
    const slideNo = Number((slidePath.match(/slide(\d+)\.xml$/) || [0, 0])[1]) || 0;
    const slideIndex = Math.max(0, slideNo - 1);
    const cNvPrMatches = xml.matchAll(/<p:cNvPr\b[^>]*\bname="([^"]*)"/g);
    for (const match of cNvPrMatches) {
      const parsed = parseAdwShapeName(decodeXmlAttrText(match[1]));
      if (!parsed || !parsed.side) continue;
      const slot = {
        slideIndex,
        side: parsed.side,
        articleKey: String(parsed.articleKey || ""),
        bottomHash: String(parsed.bottomHash || ""),
        middleHash: String(parsed.middleHash || ""),
        largeHash: String(parsed.largeHash || ""),
        pageIndex: parsed.pageIndex,
        pageNo: parsed.pageNo,
        large: parsed.large,
        middle: parsed.middle,
        small: parsed.small,
        dupIndex: parsed.dupIndex,
      };
      const key = `${slideIndex}:${parsed.side}`;
      if (!slotByHalf.has(key)) slotByHalf.set(key, { slot, sourceType: parsed.sourceType || "" });
    }
  }
  const slots = [...slotByHalf.values()].map((v) => v.slot);
  if (slots.length <= 0) return null;
  return {
    version: 1,
    opening: "",
    trimSizeText: "",
    trimWidthMm: 0,
    trimHeightMm: 0,
    pageCount: 0,
    slots,
  };
}

async function loadPptxZipFromBlobLike(data) {
  const JSZip = await ensureJsZipLoaded();
  if (data instanceof Blob) {
    return JSZip.loadAsync(await data.arrayBuffer());
  }
  if (data instanceof ArrayBuffer) {
    return JSZip.loadAsync(data);
  }
  if (data instanceof Uint8Array) {
    return JSZip.loadAsync(data);
  }
  throw new Error(
    LOCALE === "en"
      ? "Invalid PPTX data. Failed to read the generated file."
      : "PPTXデータが不正です。生成ファイルの読み込みに失敗しました。",
  );
}

async function repairPptxGenJsZip(zip) {
  const entryNames = Object.keys(zip.files);
  const actualMasters = new Set();
  const actualLayouts = new Set();
  for (const name of entryNames) {
    const masterMatch = name.match(/^ppt\/slideMasters\/(slideMaster\d+\.xml)$/);
    if (masterMatch) actualMasters.add(masterMatch[1]);
    const layoutMatch = name.match(/^ppt\/slideLayouts\/(slideLayout\d+\.xml)$/);
    if (layoutMatch) actualLayouts.add(layoutMatch[1]);
  }

  const ctFile = zip.file("[Content_Types].xml");
  if (ctFile) {
    let ct = await ctFile.async("string");
    ct = ct.replace(
      /<Override\s+PartName="\/ppt\/slideMasters\/([^"]+)"[^>]*\/>/g,
      (match, filename) => (actualMasters.has(filename) ? match : ""),
    );
    ct = ct.replace(
      /<Override\s+PartName="\/ppt\/slideLayouts\/([^"]+)"[^>]*\/>/g,
      (match, filename) => (actualLayouts.has(filename) ? match : ""),
    );
    ct = ct.replace(/<Override\s+PartName="\/ppt\/notesMasters\/[^"]*"[^>]*\/>/g, "");
    ct = ct.replace(/<Override\s+PartName="\/ppt\/notesSlides\/[^"]*"[^>]*\/>/g, "");

    const usedExtensions = new Set(["xml", "rels"]);
    for (const name of entryNames) {
      if (name.startsWith("ppt/media/")) {
        const ext = name.split(".").pop()?.toLowerCase();
        if (ext) usedExtensions.add(ext);
      }
    }
    ct = ct.replace(
      /<Default\s+Extension="([^"]+)"[^>]*\/>/g,
      (match, ext) => (usedExtensions.has(String(ext).toLowerCase()) ? match : ""),
    );
    zip.file("[Content_Types].xml", ct);
  }

  for (const name of entryNames) {
    if (
      name.startsWith("ppt/notesMasters/")
      || name.startsWith("ppt/notesSlides/")
      || name.startsWith("ppt/charts/")
      || name.startsWith("ppt/embeddings/")
    ) {
      zip.remove(name);
    }
  }

  const presFile = zip.file("ppt/presentation.xml");
  if (presFile) {
    let presXml = await presFile.async("string");
    presXml = presXml.replace(/<p:notesMasterIdLst>[\s\S]*?<\/p:notesMasterIdLst>/g, "");
    if (!/<p:notesSz\b/.test(presXml)) {
      presXml = presXml.replace(
        /(<p:sldSz\b[^>]*\/>)/,
        "$1<p:notesSz cx=\"6858000\" cy=\"9144000\"/>",
      );
    }
    zip.file("ppt/presentation.xml", presXml);
  }

  const presRelsFile = zip.file("ppt/_rels/presentation.xml.rels");
  if (presRelsFile) {
    let presRels = await presRelsFile.async("string");
    presRels = presRels.replace(/<Relationship[^>]*notesMaster[^>]*\/>/g, "");
    zip.file("ppt/_rels/presentation.xml.rels", presRels);
  }

  const appFile = zip.file("docProps/app.xml");
  if (appFile) {
    let appXml = await appFile.async("string");
    appXml = appXml.replace(/<Notes>\d+<\/Notes>/, "<Notes>0</Notes>");
    zip.file("docProps/app.xml", appXml);
  }

  for (const name of Object.keys(zip.files)) {
    if (/^ppt\/slides\/slide\d+\.xml$/.test(name)) {
      const slideFile = zip.file(name);
      if (!slideFile) continue;
      let slideXml = await slideFile.async("string");
      const fixed = slideXml.replace(
        /<a:srcRect l="0" r="0" t="0" b="0"\/><a:stretch\/>/g,
        "<a:stretch><a:fillRect/></a:stretch>",
      );
      if (fixed !== slideXml) zip.file(name, fixed);
      continue;
    }
    if (!/^ppt\/slides\/_rels\/slide\d+\.xml\.rels$/.test(name)) continue;
    const relFile = zip.file(name);
    if (!relFile) continue;
    let content = await relFile.async("string");
    const cleaned = content.replace(/<Relationship[^>]*notesSlide[^>]*\/>/g, "");
    if (cleaned !== content) zip.file(name, cleaned);
  }
}

async function finalizeRoughSpreadPptxZip(zip) {
  if (zip.files["autodaiwarer/"]?.dir) zip.remove("autodaiwarer/");
}

async function embedManifestInPptxBlob(blob, manifest) {
  const zip = await loadPptxZipFromBlobLike(blob);
  await repairPptxGenJsZip(zip);
  await finalizeRoughSpreadPptxZip(zip);
  return zip.generateAsync({ type: "blob", compression: "DEFLATE" });
}

async function readManifestFromPptxBlob(blob) {
  const zip = await loadPptxZipFromBlobLike(blob);
  const embedded = zip.file(ROUGH_PPTX_MANIFEST_PATH);
  if (embedded) {
    return JSON.parse(await embedded.async("string"));
  }
  return buildManifestFromPptxShapeNames(zip);
}

function downloadBlobFile(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 2000);
}

function xmlLocalName(node) {
  if (!node) return "";
  return node.localName || String(node.nodeName || "").split(":").pop();
}

function findFirstDescendantByLocalName(root, localName) {
  if (!root) return null;
  if (xmlLocalName(root) === localName) return root;
  for (const child of root.children || []) {
    const hit = findFirstDescendantByLocalName(child, localName);
    if (hit) return hit;
  }
  return null;
}

function getShapeCenterXemu(node) {
  const xfrm = findFirstDescendantByLocalName(node, "xfrm");
  if (!xfrm) return null;
  const off = [...xfrm.children].find((child) => xmlLocalName(child) === "off");
  const ext = [...xfrm.children].find((child) => xmlLocalName(child) === "ext");
  if (!off || !ext) return null;
  const x = Number.parseInt(off.getAttribute("x") || "0", 10);
  const cx = Number.parseInt(ext.getAttribute("cx") || "0", 10);
  if (!Number.isFinite(x) || !Number.isFinite(cx)) return null;
  return x + cx / 2;
}

function getSlideSpTree(doc) {
  const spTree = findFirstDescendantByLocalName(doc.documentElement, "spTree");
  return spTree || null;
}

function isShapeNode(node) {
  const name = xmlLocalName(node);
  return name === "sp" || name === "pic" || name === "grpSp" || name === "cxnSp" || name === "graphicFrame";
}

function getShapeNvPrName(node) {
  const cNvPr = findFirstDescendantByLocalName(node, "cNvPr");
  return String(cNvPr?.getAttribute("name") || "").trim();
}

function setShapeNvPrName(node, name) {
  const cNvPr = findFirstDescendantByLocalName(node, "cNvPr");
  if (!cNvPr) return;
  cNvPr.setAttribute("name", String(name || ""));
}

function buildRoughSlotSignature(slot) {
  const bottomHash = String(slot?.bottomHash || "");
  const middleHash = String(slot?.middleHash || "");
  const largeHash = String(slot?.largeHash || "");
  const dup = Number(slot?.dupIndex) || 0;
  return `${bottomHash}.${middleHash}.${largeHash}.${dup}`;
}

function parseAdwUserShapeTag(name) {
  const raw = String(name || "");
  const m = raw.match(/^ADWUSR\|([^|]+)\|(.*)$/);
  if (!m) return null;
  return {
    signature: String(m[1] || ""),
    originalName: String(m[2] || ""),
  };
}

function buildAdwUserShapeName(signature, originalName) {
  const sig = String(signature || "").trim();
  const base = String(originalName || "").trim() || "Shape";
  return `ADWUSR|${sig}|${base}`;
}

function isAdwBackgroundShape(node) {
  const name = getShapeNvPrName(node);
  return name.startsWith("ADW_") || name.startsWith("ADW|");
}

function isAdwUserTaggedShape(node) {
  return !!parseAdwUserShapeTag(getShapeNvPrName(node));
}

function collectSpTreeHalfShapeNodes(spTree, side, slideWidthEmu, { includeBackground = true } = {}) {
  if (!spTree) return [];
  const half = slideWidthEmu / 2;
  const out = [];
  for (const child of spTree.children || []) {
    const local = xmlLocalName(child);
    if (local === "nvGrpSpPr" || local === "grpSpPr") continue;
    if (!isShapeNode(child)) continue;
    if (!includeBackground && isAdwBackgroundShape(child)) continue;
    const center = getShapeCenterXemu(child);
    if (center === null) continue;
    const isLeft = center < half;
    if ((side === "left" && isLeft) || (side === "right" && !isLeft)) out.push(child);
  }
  return out;
}

function collectAllUserShapeNodes(spTree) {
  if (!spTree) return [];
  const out = [];
  for (const child of spTree.children || []) {
    const local = xmlLocalName(child);
    if (local === "nvGrpSpPr" || local === "grpSpPr") continue;
    if (!isShapeNode(child)) continue;
    if (isAdwBackgroundShape(child)) continue;
    out.push(child);
  }
  return out;
}

function collectSourceNodesForSlot(spTree, side, slideWidthEmu, sourceSignature) {
  const sideNodes = new Set(collectSpTreeHalfShapeNodes(
    spTree, side, slideWidthEmu, { includeBackground: false },
  ));
  // PowerPoint copy/paste retains the old object's ADWUSR name. Such a tag
  // may belong to an article that is no longer on this slide. It is NOT a
  // reason to discard the object: use its current page position instead.
  const currentSignatures = new Set(sourceSignature ? [sourceSignature] : []);
  for (const node of spTree?.children || []) {
    if (!isAdwBackgroundShape(node)) continue;
    const slot = parseAdwShapeName(getShapeNvPrName(node));
    if (slot) currentSignatures.add(buildRoughSlotSignature(slot));
  }
  return collectAllUserShapeNodes(spTree).filter((node) => {
    const tag = parseAdwUserShapeTag(getShapeNvPrName(node));
    if (tag && sourceSignature && currentSignatures.has(tag.signature)) {
      return tag.signature === sourceSignature;
    }
    return sideNodes.has(node);
  });
}

function collectTargetNodesForRemoval(spTree, side, slideWidthEmu, targetSignature) {
  return collectSourceNodesForSlot(spTree, side, slideWidthEmu, targetSignature);
}

function getMaxShapeIdInDoc(doc) {
  let maxId = 1;
  const walker = doc.createTreeWalker(doc.documentElement, NodeFilter.SHOW_ELEMENT);
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (xmlLocalName(node) !== "cNvPr") continue;
    const id = Number.parseInt(node.getAttribute("id") || "0", 10);
    if (Number.isFinite(id) && id > maxId) maxId = id;
  }
  return maxId;
}

function renumberShapeTreeIds(root, idState) {
  const walker = (node) => {
    if (xmlLocalName(node) === "cNvPr") {
      idState.next += 1;
      node.setAttribute("id", String(idState.next));
    }
    for (const child of node.children || []) walker(child);
  };
  walker(root);
}

function shiftShapeTreeXemu(root, deltaX) {
  if (!root || !Number.isFinite(deltaX) || deltaX === 0) return;
  const walk = (node) => {
    if (xmlLocalName(node) === "off") {
      const x = Number.parseInt(node.getAttribute("x") || "0", 10);
      if (Number.isFinite(x)) node.setAttribute("x", String(x + deltaX));
    }
    for (const child of node.children || []) walk(child);
  };
  walk(root);
}

function parseRelationshipTargetPath(target) {
  const raw = String(target || "").replace(/^\//, "").replace(/^\.\.\//, "");
  return raw.startsWith("ppt/") ? raw : `ppt/${raw}`;
}

async function readRelationshipsMap(relsXml) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(relsXml, "application/xml");
  const map = new Map();
  for (const rel of doc.documentElement?.children || []) {
    if (xmlLocalName(rel) !== "Relationship") continue;
    const id = rel.getAttribute("Id");
    const target = rel.getAttribute("Target");
    if (id && target) map.set(id, target);
  }
  return map;
}

function nextRelationshipId(relsDoc) {
  let max = 0;
  for (const rel of relsDoc.documentElement?.children || []) {
    if (xmlLocalName(rel) !== "Relationship") continue;
    const id = rel.getAttribute("Id") || "";
    const n = Number.parseInt(id.replace(/^rId/, ""), 10);
    if (Number.isFinite(n) && n > max) max = n;
  }
  return `rId${max + 1}`;
}

// A copied image needs both its relationship and its OPC content type.
// In particular, repairPptxGenJsZip removes unused defaults before old images
// are imported, so assuming that EMF/JPEG/etc. are already registered is unsafe.
async function registerCopiedPptxImageType(sourceZip, sourcePath, targetZip, targetPath) {
  const contentTypesPath = "[Content_Types].xml";
  const sourceFile = sourceZip.file(contentTypesPath);
  const targetFile = targetZip.file(contentTypesPath);
  if (!sourceFile || !targetFile) throw new Error("PPTX: [Content_Types].xml is missing.");
  const parser = new DOMParser();
  const sourceDoc = parser.parseFromString(await sourceFile.async("string"), "application/xml");
  const targetDoc = parser.parseFromString(await targetFile.async("string"), "application/xml");
  if (sourceDoc.querySelector("parsererror") || targetDoc.querySelector("parsererror")) {
    throw new Error("PPTX: invalid [Content_Types].xml.");
  }
  const extension = sourcePath.split(".").pop().toLowerCase();
  const sourceEntries = [...sourceDoc.documentElement.children];
  const override = sourceEntries.find((el) => xmlLocalName(el) === "Override"
    && el.getAttribute("PartName") === `/${sourcePath}`);
  const fallback = sourceEntries.find((el) => xmlLocalName(el) === "Default"
    && String(el.getAttribute("Extension")).toLowerCase() === extension);
  const contentType = (override || fallback)?.getAttribute("ContentType");
  if (!contentType) throw new Error(`PPTX: image content type is missing: ${sourcePath}`);
  const targetEntries = [...targetDoc.documentElement.children];
  const existingOverride = targetEntries.find((el) => xmlLocalName(el) === "Override"
    && el.getAttribute("PartName") === `/${targetPath}`);
  const existingDefault = targetEntries.find((el) => xmlLocalName(el) === "Default"
    && String(el.getAttribute("Extension")).toLowerCase() === extension);
  if ((existingOverride || existingDefault)?.getAttribute("ContentType") === contentType) return;
  // A per-part override preserves the source type without changing other images
  // which happen to have the same extension in the destination.
  const entry = existingOverride || targetDoc.createElementNS(
    "http://schemas.openxmlformats.org/package/2006/content-types", "Override",
  );
  entry.setAttribute("PartName", `/${targetPath}`);
  entry.setAttribute("ContentType", contentType);
  if (!existingOverride) targetDoc.documentElement.appendChild(entry);
  targetZip.file(contentTypesPath, new XMLSerializer().serializeToString(targetDoc));
}

async function remapBlipEmbedsInFragment(root, sourceZip, sourceRelsPath, targetZip, targetRelsPath, ridMap) {
  const relationshipNs = "http://schemas.openxmlformats.org/officeDocument/2006/relationships";
  const blips = [];
  const walker = (node) => {
    // SVG images carry a second image relationship on asvg:svgBlip.
    if (xmlLocalName(node) === "blip" || xmlLocalName(node) === "svgBlip") blips.push(node);
    for (const child of node.children || []) walker(child);
  };
  walker(root);
  if (blips.length === 0) return;

  const sourceRelsFile = sourceZip.file(sourceRelsPath);
  const targetRelsFile = targetZip.file(targetRelsPath);
  if (!sourceRelsFile || !targetRelsFile) throw new Error("PPTX: image relationships are missing.");
  const sourceRelsMap = await readRelationshipsMap(await sourceRelsFile.async("string"));
  const parser = new DOMParser();
  const targetRelsDoc = parser.parseFromString(await targetRelsFile.async("string"), "application/xml");
  const serializer = new XMLSerializer();

  for (const blip of blips) {
    const oldRid = blip.getAttributeNS(relationshipNs, "embed") || blip.getAttribute("r:embed");
    if (!oldRid) continue;
    if (ridMap.has(oldRid)) {
      blip.setAttributeNS(relationshipNs, "r:embed", ridMap.get(oldRid));
      continue;
    }
    const target = sourceRelsMap.get(oldRid);
    if (!target) throw new Error(`PPTX: image relationship is missing: ${oldRid}`);
    const mediaPath = parseRelationshipTargetPath(target);
    const mediaFile = sourceZip.file(mediaPath);
    if (!mediaFile) throw new Error(`PPTX: image part is missing: ${mediaPath}`);
    const ext = mediaPath.split(".").pop() || "png";
    let newMediaName;
    do {
      newMediaName = `media/adw_${Date.now()}_${Math.random().toString(36).slice(2, 10)}.${ext}`;
    } while (targetZip.file(`ppt/${newMediaName}`));
    await registerCopiedPptxImageType(sourceZip, mediaPath, targetZip, `ppt/${newMediaName}`);
    targetZip.file(`ppt/${newMediaName}`, await mediaFile.async("uint8array"));
    const newRid = nextRelationshipId(targetRelsDoc);
    const relEl = targetRelsDoc.createElementNS(
      "http://schemas.openxmlformats.org/package/2006/relationships", "Relationship",
    );
    relEl.setAttribute("Id", newRid);
    relEl.setAttribute("Type", `${relationshipNs}/image`);
    relEl.setAttribute("Target", `../${newMediaName}`);
    targetRelsDoc.documentElement.appendChild(relEl);
    ridMap.set(oldRid, newRid);
    blip.setAttributeNS(relationshipNs, "r:embed", newRid);
  }
  targetZip.file(targetRelsPath, serializer.serializeToString(targetRelsDoc));
}

async function readSlideWidthEmuFromPptxZip(zip) {
  const presentationFile = zip.file("ppt/presentation.xml");
  if (!presentationFile) return 0;
  const xml = await presentationFile.async("string");
  const m = xml.match(/<p:sldSz\b[^>]*\bcx="(\d+)"/);
  return Number.parseInt(m?.[1] || "0", 10) || 0;
}

async function copySlideHalfFromSourceToTarget({
  sourceZip,
  targetZip,
  sourceSlideIndex,
  targetSlideIndex,
  sourceSide,
  targetSide,
  sourceSlideWidthEmu,
  targetSlideWidthEmu,
  sourceSlot,
  targetSlot,
  targetSinglePage = false,
}) {
  const sourceSlidePath = `ppt/slides/slide${sourceSlideIndex + 1}.xml`;
  const targetSlidePath = `ppt/slides/slide${targetSlideIndex + 1}.xml`;
  const sourceRelsPath = `ppt/slides/_rels/slide${sourceSlideIndex + 1}.xml.rels`;
  const targetRelsPath = `ppt/slides/_rels/slide${targetSlideIndex + 1}.xml.rels`;
  const sourceSlideFile = sourceZip.file(sourceSlidePath);
  const targetSlideFile = targetZip.file(targetSlidePath);
  if (!sourceSlideFile || !targetSlideFile) return;

  const parser = new DOMParser();
  const serializer = new XMLSerializer();
  const sourceDoc = parser.parseFromString(await sourceSlideFile.async("string"), "application/xml");
  const targetDoc = parser.parseFromString(await targetSlideFile.async("string"), "application/xml");
  const sourceSpTree = getSlideSpTree(sourceDoc);
  const targetSpTree = getSlideSpTree(targetDoc);
  if (!sourceSpTree || !targetSpTree) return;

  const srcSide = sourceSide === "right" ? "right" : "left";
  const dstSide = targetSide === "right" ? "right" : "left";
  const sourceSignature = buildRoughSlotSignature(sourceSlot);
  const targetSignature = buildRoughSlotSignature(targetSlot);
  const sourceWidth = Number(sourceSlideWidthEmu) || Number(targetSlideWidthEmu) || 0;
  const targetWidth = Number(targetSlideWidthEmu) || Number(sourceSlideWidthEmu) || 0;
  const sourceNodes = collectSourceNodesForSlot(sourceSpTree, srcSide, sourceWidth, sourceSignature);
  // The freshly generated target already contains the default title. Keep it
  // if the old page is empty; otherwise replace it with ALL existing roughs.
  if (sourceNodes.length === 0) return;
  const removeNodes = targetSinglePage
    ? collectAllUserShapeNodes(targetSpTree)
    : collectTargetNodesForRemoval(targetSpTree, dstSide, targetWidth, targetSignature);
  for (const node of removeNodes) node.remove();

  const idState = { next: getMaxShapeIdInDoc(targetDoc) };
  const ridMap = new Map();
  const sourceHalfShift = Math.round(sourceWidth / 2);
  const targetHalfShift = Math.round(targetWidth / 2);
  const sourceAnchorX = srcSide === "right" ? sourceHalfShift : 0;
  const targetAnchorX = targetSinglePage ? 0 : (dstSide === "right" ? targetHalfShift : 0);
  const shiftX = targetAnchorX - sourceAnchorX;
  for (const sourceNode of sourceNodes) {
    const clone = sourceNode.cloneNode(true);
    shiftShapeTreeXemu(clone, shiftX);
    const rawName = getShapeNvPrName(clone);
    const tagged = parseAdwUserShapeTag(rawName);
    const originalName = tagged?.originalName || rawName || "Shape";
    setShapeNvPrName(clone, buildAdwUserShapeName(targetSignature, originalName));
    renumberShapeTreeIds(clone, idState);
    await remapBlipEmbedsInFragment(clone, sourceZip, sourceRelsPath, targetZip, targetRelsPath, ridMap);
    targetSpTree.appendChild(targetDoc.importNode(clone, true));
  }

  targetZip.file(targetSlidePath, serializer.serializeToString(targetDoc));
}

async function buildRoughSpreadPptxBlob(pageItems, trimSize, opening, options = ROUGH_PPTX_DEFAULT_OPTIONS) {
  const PptxGenJS = await ensurePptxGenJsLoaded();
  const effective = {
    singlePage: Boolean(options?.singlePage),
    hideLabels: Boolean(options?.hideLabels),
  };
  const pxPerMm = ROUGH_PDF_RENDER_DPI / 25.4;
  const renderedPages = pageItems.map((pageData) => {
    if (effective.hideLabels) {
      return { ...pageData, image: "" };
    }
    const canvas = renderRoughPdfPageCanvas(pageData, trimSize, pxPerMm, { hideLabels: effective.hideLabels });
    return { ...pageData, image: canvas.toDataURL("image/png") };
  });
  const spreadSlides = effective.singlePage
    ? buildRoughSinglePageExportSlides(renderedPages)
    : buildRoughSpreadExportSlides(renderedPages, opening);
  const layout = effective.singlePage
    ? getSinglePageSlideLayoutFromTrim(trimSize)
    : getSpreadSlideLayoutFromTrim(trimSize);
  const manifest = buildRoughSpreadManifest(pageItems, spreadSlides, trimSize, opening);
  const pptx = new PptxGenJS();
  pptx.defineLayout({
    name: layout.layoutName,
    width: layout.slideWidthIn,
    height: layout.slideHeightIn,
  });
  pptx.layout = layout.layoutName;
  for (const spec of spreadSlides) {
    const slide = pptx.addSlide();
    addRoughPageImageToSpreadHalf(slide, spec.left?.image, "left", layout.pageWidthIn, layout.slideHeightIn, spec.left);
    if (!effective.singlePage) {
      addRoughPageImageToSpreadHalf(slide, spec.right?.image, "right", layout.pageWidthIn, layout.slideHeightIn, spec.right);
    }
    if (!effective.hideLabels) {
      addRoughPagePlaceholder(slide, spec.left, "left", layout.pageWidthIn, layout.slideHeightIn);
      if (!effective.singlePage) {
        addRoughPagePlaceholder(slide, spec.right, "right", layout.pageWidthIn, layout.slideHeightIn);
      }
    }
  }
  const blob = await pptx.write({ outputType: "blob" });
  if (!(blob instanceof Blob)) {
    throw new Error(
      LOCALE === "en"
        ? "Failed to generate PPTX data."
        : "PPTXデータの生成に失敗しました。",
    );
  }
  const withManifest = await embedManifestInPptxBlob(blob, manifest);
  return {
    blob: withManifest,
    manifest,
    spreadSlides,
    layout,
    slideWidthEmu: Math.round(layout.slideWidthIn * PPTX_EMU_PER_INCH),
  };
}

async function exportImpositionRoughSpreadPptx(options = ROUGH_PPTX_DEFAULT_OPTIONS) {
  await withImpositionProcessing(
    LOCALE === "en" ? "Exporting PPTX…" : "PPTXを出力しています…",
    async () => {
      const pages = buildRoughExportPages();
      if (pages.length === 0) {
        window.alert(LOCALE === "en" ? "No pages available to export." : "出力対象のページがありません。");
        return;
      }
      const trimSize = parseTrimSizeToMm(getEffectiveTrimSizeText(state.meta));
      const opening = String(state.meta?.opening || "left").toLowerCase() === "right" ? "right" : "left";
      const baseName = buildRoughPdfDownloadBaseName();
      const effective = {
        singlePage: Boolean(options?.singlePage),
        hideLabels: Boolean(options?.hideLabels),
      };
      const { blob } = await buildRoughSpreadPptxBlob(pages, trimSize, opening, effective);
      const suffix = effective.singlePage ? "_rough_single" : "_rough_spread";
      downloadBlobFile(blob, `${baseName}${suffix}.pptx`);
    },
  ).catch((error) => {
    window.alert((error && error.message) || (LOCALE === "en" ? "Failed to export PPTX." : "PPTXの出力に失敗しました。"));
  });
}

async function updateImpositionRoughSpreadPptxFromFile(file, options = ROUGH_PPTX_DEFAULT_OPTIONS) {
  await withImpositionProcessing(
    LOCALE === "en" ? "Updating PPTX…" : "PPTXを更新しています…",
    async () => {
      const pages = buildRoughExportPages();
      if (pages.length === 0) {
        window.alert(LOCALE === "en" ? "No pages available to export." : "出力対象のページがありません。");
        return;
      }
      const sourceBlob = file;
      let manifest = await readManifestFromPptxBlob(sourceBlob);
      if (!manifest) {
        throw new Error(
          LOCALE === "en"
            ? "Manifest not found in PPTX. Re-export with the latest version first."
            : "PPTX内に管理情報が見つかりません。最新版で「PPTXに出力（見開き）」を実行してください。",
        );
      }
      const trimSize = parseTrimSizeToMm(getEffectiveTrimSizeText(state.meta));
      const opening = String(state.meta?.opening || "left").toLowerCase() === "right" ? "right" : "left";
      const effective = {
        singlePage: Boolean(options?.singlePage),
        hideLabels: Boolean(options?.hideLabels),
      };
      const { blob: newBlob, spreadSlides, slideWidthEmu } = await buildRoughSpreadPptxBlob(pages, trimSize, opening, effective);
      const sourceZip = await loadPptxZipFromBlobLike(sourceBlob);
      const targetZip = await loadPptxZipFromBlobLike(newBlob);
      const sourceSlideWidthEmu = await readSlideWidthEmuFromPptxZip(sourceZip);
      const targetSlideWidthEmu = await readSlideWidthEmuFromPptxZip(targetZip);
      const usedSourceKeys = new Set();
      for (let slideIndex = 0; slideIndex < spreadSlides.length; slideIndex += 1) {
        const spec = spreadSlides[slideIndex];
        for (const side of ["left", "right"]) {
          const page = spec?.[side];
          if (!page) continue;
          const match = findMatchingSourceSlotForUpdate(page, manifest.slots || [], pages, usedSourceKeys);
          if (!match) continue;
          usedSourceKeys.add(roughSpreadSourceSlotKey(match));
          await copySlideHalfFromSourceToTarget({
            sourceZip,
            targetZip,
            sourceSlideIndex: Number(match.slideIndex) || 0,
            targetSlideIndex: slideIndex,
            sourceSide: match.side,
            targetSide: side,
            sourceSlideWidthEmu: sourceSlideWidthEmu || slideWidthEmu,
            targetSlideWidthEmu: targetSlideWidthEmu || slideWidthEmu,
            sourceSlot: match,
            targetSlot: page,
            targetSinglePage: effective.singlePage,
          });
        }
      }
      await finalizeRoughSpreadPptxZip(targetZip);
      const finalBlob = await targetZip.generateAsync({ type: "blob", compression: "DEFLATE" });
      const baseName = buildRoughPdfDownloadBaseName();
      const suffix = effective.singlePage ? "_rough_single" : "_rough_spread";
      downloadBlobFile(finalBlob, `${baseName}${suffix}.pptx`);
    },
  ).catch((error) => {
    window.alert((error && error.message) || (LOCALE === "en" ? "Failed to update PPTX." : "PPTXの更新に失敗しました。"));
  });
}


function buildRoughPdfDownloadBaseName() {
  const title = String(state.meta?.title || "").trim();
  const fileName = String(state.meta?.fileName || "").trim();
  const raw = title || fileName || (LOCALE === "en" ? "rough" : "ラフ");
  return raw.replace(/[\\/:*?"<>|]+/g, "_").replace(/\s+/g, "_").slice(0, 80) || "rough";
}

async function ensurePptxGenJsLoaded() {
  if (window.PptxGenJS) return window.PptxGenJS;
  if (ensurePptxGenJsPromise) return ensurePptxGenJsPromise;
  ensurePptxGenJsPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = IMPOSITION_PPTXGENJS_SRC;
    script.async = true;
    script.onload = () => {
      if (!window.PptxGenJS) {
        reject(new Error(LOCALE === "en" ? "Failed to load PptxGenJS." : "PptxGenJS の読み込みに失敗しました。"));
        return;
      }
      resolve(window.PptxGenJS);
    };
    script.onerror = () => reject(new Error(LOCALE === "en" ? "Failed to load PptxGenJS." : "PptxGenJS の読み込みに失敗しました。"));
    document.head.appendChild(script);
  });
  return ensurePptxGenJsPromise;
}

function getSpreadSlideLayoutFromTrim(trimSize) {
  const pageWidthMm = trimSize.widthMm;
  const pageHeightMm = trimSize.heightMm;
  const slideWidthMm = pageWidthMm * 2;
  const slideHeightMm = pageHeightMm;
  const mmToIn = (mm) => mm / 25.4;
  return {
    layoutName: "AUTODAIWARER_SPREAD",
    slideWidthIn: mmToIn(slideWidthMm),
    slideHeightIn: mmToIn(slideHeightMm),
    pageWidthIn: mmToIn(pageWidthMm),
    pageHeightIn: mmToIn(pageHeightMm),
  };
}

function getSinglePageSlideLayoutFromTrim(trimSize) {
  const mmToIn = (mm) => mm / 25.4;
  return {
    layoutName: "AUTODAIWARER_SINGLE",
    slideWidthIn: mmToIn(trimSize.widthMm),
    slideHeightIn: mmToIn(trimSize.heightMm),
    pageWidthIn: mmToIn(trimSize.widthMm),
    pageHeightIn: mmToIn(trimSize.heightMm),
  };
}

function buildRoughSpreadExportSlides(pageItems, opening = "left") {
  const isRightOpening = String(opening || "left").toLowerCase() === "right";
  const slides = [];
  const count = pageItems.length;
  if (count <= 0) return slides;

  if (isRightOpening) {
    slides.push({ left: pageItems[0], right: null });
    let idx = 1;
    while (idx < count) {
      if (idx === count - 1) {
        slides.push({ left: null, right: pageItems[idx] });
        break;
      }
      slides.push({ left: pageItems[idx + 1], right: pageItems[idx] });
      idx += 2;
    }
    return slides;
  }

  slides.push({ left: null, right: pageItems[0] });
  let idx = 1;
  while (idx < count) {
    if (idx === count - 1) {
      slides.push({ left: pageItems[idx], right: null });
      break;
    }
    slides.push({ left: pageItems[idx], right: pageItems[idx + 1] });
    idx += 2;
  }
  return slides;
}

function buildRoughSinglePageExportSlides(pageItems) {
  return pageItems.map((page) => ({ left: page, right: null }));
}

function addRoughPagePlaceholder(slide, pageData, side, pageWidthIn, slideHeightIn) {
  if (!pageData) return; // A blank half outside the book is not an article page.
  const title = getRoughArticleBottomLevel(pageData).name || String(pageData.title || "").trim();
  if (!title) return;
  const pageInArticle = Math.max(1, Number(pageData.dupIndex) || 1);
  const firstPage = pageInArticle === 1;
  const scale = Math.min(pageWidthIn / (210 / 25.4), slideHeightIn / (297 / 25.4));
  const margin = (24 / 25.4) * scale;
  const top = firstPage ? (29 / 25.4) * scale : slideHeightIn * 0.42;
  slide.addText(`${title}\n(${pageInArticle})`, {
    x: (side === "right" ? pageWidthIn : 0) + margin,
    y: top,
    w: pageWidthIn - margin * 2,
    h: Math.min(slideHeightIn * 0.36, slideHeightIn - top - margin),
    fontFace: "Yu Gothic",
    fontSize: 40 * scale,
    bold: firstPage,
    color: "000000",
    margin: 0,
    breakLine: false,
    valign: "top",
    align: "left",
    fit: "shrink",
    paraSpaceAfterPt: 0,
    // Treat this editable text as an existing rough on subsequent updates.
    objectName: buildAdwUserShapeName(buildRoughSlotSignature(pageData), "Rough page title"),
  });
}

function addRoughPageImageToSpreadHalf(slide, imageData, side, pageWidthIn, slideHeightIn, pageData) {
  if (!imageData) return;
  const x = side === "left" ? 0 : pageWidthIn;
  const meta = pageData ? {
    large: pageData.large || "",
    middle: pageData.middle || "",
    small: pageData.small || "",
    dupIndex: Number(pageData.dupIndex) || 0,
    pageIndex: Number(pageData.pageIndex) || 0,
    pageNo: pageData.pageNo,
  } : null;
  slide.addImage({
    data: imageData,
    x,
    y: 0,
    w: pageWidthIn,
    h: slideHeightIn,
    objectName: meta ? buildAdwShapeName(meta, side) : undefined,
  });
}

function buildPrintableFlatTableHtml() {
  const rows = buildArticleFlatRows();
  const metaColCount = getArticleDisplayFieldLabels().length;
  const body = rows.map((row) => {
    const metaCells = renderArticleMetaCells(row);
    if (row.type === "flat") {
      const largeCell = row.largeRowspan > 0
        ? `<td rowspan="${row.largeRowspan}" class="tree-cell cell-large">${escapeHtml(row.largeText || "")}</td>`
        : "";
      const middleCell = row.middleRowspan > 0
        ? `<td rowspan="${row.middleRowspan}" class="tree-cell cell-middle">${escapeHtml(row.middleText || "")}</td>`
        : "";
      const smallCell = `<td class="tree-cell cell-small">${escapeHtml(row.smallText || "")}</td>`;
      return `<tr class="article-tree-row row-flat row-flat-print">
        ${largeCell}
        ${middleCell}
        ${smallCell}
        ${metaCells}
      </tr>`;
    }
    if (row.type === "hold-separator") {
      return `<tr class="article-tree-row row-hold-separator">
        <td colspan="${3 + metaColCount}" class="tree-cell hold-separator-cell"></td>
      </tr>`;
    }
    return `<tr class="article-tree-row row-${row.type || "other"}">
      <td colspan="3" class="tree-cell">${escapeHtml(row.text || "")}</td>
      ${metaCells}
    </tr>`;
  }).join("");

  return `<table class="article-tree-table">
    ${buildArticleTableColgroupHtml()}
    <thead>
      ${buildArticleTableHeaderHtml()}
    </thead>
    <tbody>${body}</tbody>
  </table>`;
}

function enableDialogDrag(dialog, nonDragSelector) {
  if (!dialog) return;

  let dragging = false;
  let startX = 0;
  let startY = 0;
  let baseLeft = 0;
  let baseTop = 0;

  function ensureFixedPosition() {
    const rect = dialog.getBoundingClientRect();
    if (dialog.dataset.dragReady === "1") return rect;
    dialog.style.position = "fixed";
    dialog.style.margin = "0";
    dialog.style.left = `${rect.left}px`;
    dialog.style.top = `${rect.top}px`;
    dialog.dataset.dragReady = "1";
    return rect;
  }

  dialog.addEventListener("pointerdown", (ev) => {
    if (ev.button !== 0) return;
    if (!(ev.target instanceof Element)) return;
    if (ev.target.closest(nonDragSelector)) return;

    const rect = ensureFixedPosition();
    dragging = true;
    startX = ev.clientX;
    startY = ev.clientY;
    baseLeft = Number.parseFloat(dialog.style.left) || rect.left;
    baseTop = Number.parseFloat(dialog.style.top) || rect.top;
    dialog.setPointerCapture(ev.pointerId);
    ev.preventDefault();
  });

  dialog.addEventListener("pointermove", (ev) => {
    if (!dragging) return;
    const nextLeft = baseLeft + (ev.clientX - startX);
    const nextTop = baseTop + (ev.clientY - startY);
    dialog.style.left = `${nextLeft}px`;
    dialog.style.top = `${nextTop}px`;
  });

  dialog.addEventListener("pointerup", (ev) => {
    if (!dragging) return;
    dragging = false;
    if (dialog.hasPointerCapture(ev.pointerId)) dialog.releasePointerCapture(ev.pointerId);
  });

  dialog.addEventListener("pointercancel", () => {
    dragging = false;
  });
}

function bindEditorAssist(textarea) {
  if (!textarea) return;

  els.editorCandidate?.addEventListener("pointerdown", (ev) => {
    const target = ev.target;
    if (!(target instanceof Element)) return;
    const spinButton = target.closest("[data-editor-spin]");
    if (spinButton) {
      ev.preventDefault();
      const spin = String(spinButton.getAttribute("data-editor-spin") || "");
      if (isPageAssistType(editorAssistState.type)) {
        stepPageCandidate(spin === "up" ? 1 : -1);
      } else if (isBoardAssistType(editorAssistState.type)) {
        stepBoardCandidate(spin === "up" ? 1 : -1);
      }
      textarea.focus();
      return;
    }
    const option = target.closest("[data-editor-candidate-index]");
    if (!option) return;
    ev.preventDefault();
    const rawIdx = option.getAttribute("data-editor-candidate-index");
    const pickedIdx = Number.parseInt(rawIdx || "", 10);
    if (!Number.isFinite(pickedIdx) || pickedIdx < 0) return;
    editorAssistState.index = Math.min(
      pickedIdx,
      Math.max(0, editorAssistState.candidates.length - 1),
    );
    const clickAssist = isClickAssistType(editorAssistState.type);
    acceptEditorCandidate(textarea, {
      suppressAppendSpace: clickAssist,
      exitAssist: clickAssist,
      refreshAfterAccept: !clickAssist,
    });
    textarea.focus();
  });

  textarea.addEventListener("keydown", (ev) => {
    if (ev.altKey && !ev.ctrlKey && !ev.metaKey) {
      if (ev.key === "ArrowLeft") {
        ev.preventDefault();
        shiftSelectedOutlineLevel(textarea, -1);
        return;
      }
      if (ev.key === "ArrowRight") {
        ev.preventDefault();
        shiftSelectedOutlineLevel(textarea, 1);
        return;
      }
      if (ev.key === "ArrowUp") {
        ev.preventDefault();
        moveSelectedLinesByOne(textarea, -1);
        return;
      }
      if (ev.key === "ArrowDown") {
        ev.preventDefault();
        moveSelectedLinesByOne(textarea, 1);
        return;
      }
    }

    if (ev.ctrlKey && !ev.altKey && !ev.metaKey && !ev.shiftKey) {
      if (String(ev.key || "").toLowerCase() === "g") {
        const start = textarea.selectionStart ?? 0;
        const end = textarea.selectionEnd ?? start;
        if (end > start) {
          replaceTextareaRangeWithUndo(textarea, start, end, "", "start");
        } else if (start < textarea.value.length) {
          replaceTextareaRangeWithUndo(textarea, start, start + 1, "", "start");
        }
        refreshEditorAssist(textarea);
        ev.preventDefault();
        return;
      }
      const text = textarea.value;
      const caret = textarea.selectionStart ?? 0;
      const lineStart = text.lastIndexOf("\n", Math.max(0, caret - 1)) + 1;
      const lineEndIdx = text.indexOf("\n", caret);
      const lineEnd = lineEndIdx === -1 ? text.length : lineEndIdx;
      let nextPos = -1;
      if (ev.key === "ArrowLeft") nextPos = lineStart;
      else if (ev.key === "ArrowRight") nextPos = lineEnd;
      else if (ev.key === "ArrowUp") nextPos = 0;
      else if (ev.key === "ArrowDown") nextPos = text.length;
      if (nextPos >= 0) {
        textarea.setSelectionRange(nextPos, nextPos);
        refreshEditorAssist(textarea);
        ev.preventDefault();
        return;
      }
    }

    if (ev.key === "Tab") {
      const start = textarea.selectionStart ?? 0;
      const end = textarea.selectionEnd ?? start;
      replaceTextareaRangeWithUndo(textarea, start, end, "\t", "end");
      refreshEditorAssist(textarea);
      ev.preventDefault();
      return;
    }

    const active = editorAssistState.active;
    if (!active) {
      if (ev.key === "Enter" && editorAssistState.sessionActive) {
        clearEditorAssist();
      }
      return;
    }
    if (ev.key === "ArrowDown") {
      if (isPageAssistType(editorAssistState.type)) {
        stepPageCandidate(-1);
      } else if (isBoardAssistType(editorAssistState.type)) {
        stepBoardCandidate(-1);
      } else {
        rotateEditorCandidate(1);
      }
      ev.preventDefault();
      return;
    }
    if (ev.key === "ArrowUp") {
      if (isPageAssistType(editorAssistState.type)) {
        stepPageCandidate(1);
      } else if (isBoardAssistType(editorAssistState.type)) {
        stepBoardCandidate(1);
      } else {
        rotateEditorCandidate(-1);
      }
      ev.preventDefault();
      return;
    }
    if (ev.key === "Escape") {
      clearEditorAssist();
      ev.preventDefault();
      return;
    }
    if (ev.key === "Enter") {
      clearEditorAssist();
      return;
    }
    if (ev.key === "ArrowRight") {
      const clickAssist = isClickAssistType(editorAssistState.type);
      acceptEditorCandidate(textarea, {
        suppressAppendSpace: clickAssist,
        exitAssist: clickAssist,
        refreshAfterAccept: !clickAssist,
      });
      ev.preventDefault();
      return;
    }
  });

  textarea.addEventListener("input", () => {
    refreshEditorAssist(textarea);
  });

  textarea.addEventListener("click", () => {
    if (editorAssistState.suppressNextClickRefresh) {
      editorAssistState.suppressNextClickRefresh = false;
      return;
    }
    refreshEditorAssist(textarea);
  });

  textarea.addEventListener("scroll", () => {
    renderEditorCandidate(textarea);
  });

  window.addEventListener("resize", () => {
    renderEditorCandidate(textarea);
  });
}

function clearEditorAssist() {
  editorAssistState.sessionActive = false;
  editorAssistState.sessionLineStart = -1;
  editorAssistState.sessionContentStart = -1;
  editorAssistState.active = false;
  editorAssistState.type = "";
  editorAssistState.candidates = [];
  editorAssistState.index = 0;
  editorAssistState.numericValue = 1;
  editorAssistState.boardNumberMin = 1;
  editorAssistState.replaceStart = 0;
  editorAssistState.replaceEnd = 0;
  editorAssistState.appendSpace = false;
  if (els.editorCandidate) {
    els.editorCandidate.textContent = "";
    els.editorCandidate.style.display = "none";
  }
}

function refreshEditorAssist(textarea) {
  if (!isEditorAssistEnabled()) {
    clearEditorAssist();
    return;
  }
  syncEditorAssistSession(textarea);
  const next = buildEditorAssistContext(textarea);
  if (!next) {
    editorAssistState.active = false;
    editorAssistState.type = "";
    editorAssistState.candidates = [];
    editorAssistState.index = 0;
    editorAssistState.numericValue = 1;
    editorAssistState.boardNumberMin = 1;
    editorAssistState.replaceStart = 0;
    editorAssistState.replaceEnd = 0;
    editorAssistState.appendSpace = false;
    editorAssistState.memoryKey = "";
    editorAssistState.suppressNextClickRefresh = false;
    if (els.editorCandidate) {
      els.editorCandidate.textContent = "";
      els.editorCandidate.style.display = "none";
    }
  } else {
    const sameContext =
      editorAssistState.active &&
      editorAssistState.type === next.type &&
      editorAssistState.replaceStart === next.replaceStart &&
      editorAssistState.replaceEnd === next.replaceEnd;
    const preferredIndex = sameContext ? -1 : findPreferredEditorAssistCandidateIndex(next);
    const nextIndex = sameContext
      ? Math.min(editorAssistState.index, Math.max(0, next.candidates.length - 1))
      : (preferredIndex >= 0 ? preferredIndex : 0);
    editorAssistState.active = true;
    editorAssistState.type = next.type;
    editorAssistState.candidates = next.candidates;
    editorAssistState.index = nextIndex;
    editorAssistState.numericValue = next.numericValue ?? editorAssistState.numericValue;
    editorAssistState.replaceStart = next.replaceStart;
    editorAssistState.replaceEnd = next.replaceEnd;
    editorAssistState.appendSpace = next.appendSpace;
    editorAssistState.memoryKey = next.memoryKey || "";
    editorAssistState.boardNumberMin = Number.isFinite(next.boardNumberMin) ? next.boardNumberMin : 1;
    renderEditorCandidate(textarea);
  }
}

function findPreferredEditorAssistCandidateIndex(context) {
  if (!context || !Array.isArray(context.candidates) || context.candidates.length === 0) return -1;
  const preferred = String(context.preferredValue || "").trim();
  if (preferred) {
    const exactIdx = context.candidates.findIndex((item) => isSameAssistCandidate(item, preferred));
    if (exactIdx >= 0) return exactIdx;
  }
  const memoryKey = String(context.memoryKey || "").trim();
  if (memoryKey && editorAssistState.recentValueByKey instanceof Map) {
    const recent = String(editorAssistState.recentValueByKey.get(memoryKey) || "").trim();
    if (recent) {
      const recentExactIdx = context.candidates.findIndex((item) => isSameAssistCandidate(item, recent));
      if (recentExactIdx >= 0) return recentExactIdx;
    }
  }
  return -1;
}

function normalizeAssistCandidateValue(value) {
  return String(value || "").replace(/\t+$/g, "").trim().toLowerCase();
}

function isSameAssistCandidate(a, b) {
  return normalizeAssistCandidateValue(a) === normalizeAssistCandidateValue(b);
}

function renderEditorCandidate(textarea = els.editorText) {
  if (!els.editorCandidate) return;
  if (!editorAssistState.active || editorAssistState.candidates.length === 0) {
    els.editorCandidate.textContent = "";
    els.editorCandidate.style.display = "none";
    return;
  }
  const caret = textarea?.selectionStart ?? 0;
  const pos = getTextareaCaretPixelPosition(textarea, caret);
  const list = document.createElement("div");
  list.className = "editor-candidate-list";
  const candidates = editorAssistState.candidates;
  const spinnerMode = (isPageAssistType(editorAssistState.type) || isBoardAssistType(editorAssistState.type)) && candidates.length > 0;
  if (spinnerMode) {
    list.classList.add("is-spinner");
    const row = document.createElement("div");
    row.className = "editor-candidate-spinner-row";
    const spinDown = document.createElement("button");
    spinDown.type = "button";
    spinDown.className = "editor-candidate-spin";
    spinDown.setAttribute("data-editor-spin", "down");
    spinDown.textContent = "▼";
    row.appendChild(spinDown);

    const option = document.createElement("button");
    option.type = "button";
    option.className = "editor-candidate-option is-selected";
    option.setAttribute("data-editor-candidate-index", "0");
    option.setAttribute("aria-selected", "true");
    option.textContent = String(candidates[0] || "0");
    row.appendChild(option);

    const spinUp = document.createElement("button");
    spinUp.type = "button";
    spinUp.className = "editor-candidate-spin";
    spinUp.setAttribute("data-editor-spin", "up");
    spinUp.textContent = "▲";
    row.appendChild(spinUp);
    list.appendChild(row);
  } else {
    candidates.forEach((candidate, idx) => {
      const option = document.createElement("button");
      option.type = "button";
      option.className = "editor-candidate-option";
      if (idx === editorAssistState.index) option.classList.add("is-selected");
      option.setAttribute("data-editor-candidate-index", String(idx));
      option.setAttribute("aria-selected", idx === editorAssistState.index ? "true" : "false");
      option.textContent = candidate;
      list.appendChild(option);
    });
  }
  els.editorCandidate.replaceChildren(list);
  const lineHeightRaw = Number.parseFloat(window.getComputedStyle(textarea).lineHeight);
  const lineHeight = Number.isFinite(lineHeightRaw) ? lineHeightRaw : 18;
  const viewportMargin = 8;
  const host =
    els.editorCandidate.offsetParent instanceof Element
      ? els.editorCandidate.offsetParent
      : textarea;
  const hostRect = host.getBoundingClientRect();

  els.editorCandidate.style.left = `${Math.max(0, pos.left)}px`;
  els.editorCandidate.style.top = `${Math.max(0, pos.top + lineHeight + 2)}px`;
  els.editorCandidate.style.display = "block";
  els.editorCandidate.style.visibility = "hidden";
  list.style.maxHeight = "none";
  const naturalRect = els.editorCandidate.getBoundingClientRect();
  const naturalHeight = naturalRect.height;

  const anchorViewportTop = hostRect.top + Math.max(0, pos.top);
  const anchorViewportBottom = anchorViewportTop + lineHeight;
  const spaceAbove = Math.max(0, anchorViewportTop - viewportMargin);
  const spaceBelow = Math.max(0, window.innerHeight - anchorViewportBottom - viewportMargin);
  const tooTallForBothSides = naturalHeight > spaceAbove && naturalHeight > spaceBelow;
  const placeBelow =
    (naturalHeight > spaceAbove && naturalHeight <= spaceBelow) ||
    (tooTallForBothSides && naturalHeight > spaceAbove + spaceBelow);
  const availableHeight = Math.max(120, Math.floor(placeBelow ? spaceBelow : spaceAbove));
  list.style.maxHeight = `${availableHeight}px`;

  const measuredRect = els.editorCandidate.getBoundingClientRect();
  const popupHeight = measuredRect.height;
  const popupWidth = measuredRect.width;

  let left = Math.max(0, pos.left);
  let top = placeBelow
    ? Math.max(0, pos.top + lineHeight + 2)
    : Math.max(0, pos.top - popupHeight - 2);

  let viewportLeft = hostRect.left + left;
  if (viewportLeft + popupWidth > window.innerWidth - viewportMargin) {
    left -= viewportLeft + popupWidth - (window.innerWidth - viewportMargin);
    viewportLeft = hostRect.left + left;
  }
  if (viewportLeft < viewportMargin) {
    left += viewportMargin - viewportLeft;
  }

  let viewportTop = hostRect.top + top;
  if (viewportTop + popupHeight > window.innerHeight - viewportMargin) {
    top -= viewportTop + popupHeight - (window.innerHeight - viewportMargin);
    viewportTop = hostRect.top + top;
  }
  if (viewportTop < viewportMargin) {
    top += viewportMargin - viewportTop;
  }

  els.editorCandidate.style.left = `${Math.max(0, left)}px`;
  els.editorCandidate.style.top = `${Math.max(0, top)}px`;
  els.editorCandidate.style.visibility = "visible";
  const selectedEl = list.querySelector(".editor-candidate-option.is-selected");
  if (selectedEl instanceof Element) {
    selectedEl.scrollIntoView({ block: "nearest" });
  }
}

function rotateEditorCandidate(delta) {
  if (!editorAssistState.active || editorAssistState.candidates.length === 0) return;
  const size = editorAssistState.candidates.length;
  editorAssistState.index = (editorAssistState.index + delta + size) % size;
  renderEditorCandidate(els.editorText);
}

function stepPageCandidate(delta) {
  const next = Math.max(0, (editorAssistState.numericValue || 0) + delta);
  editorAssistState.numericValue = next;
  editorAssistState.candidates = [String(next)];
  editorAssistState.index = 0;
  renderEditorCandidate(els.editorText);
}

function stepBoardCandidate(delta) {
  const lo = Number.isFinite(editorAssistState.boardNumberMin)
    ? editorAssistState.boardNumberMin
    : 1;
  const next = Math.max(lo, (editorAssistState.numericValue || lo) + delta);
  editorAssistState.numericValue = next;
  editorAssistState.candidates = [String(next)];
  editorAssistState.index = 0;
  renderEditorCandidate(els.editorText);
}

function isPageAssistType(type) {
  return type === "page-number" || type === "click-page-number";
}

function isBoardAssistType(type) {
  return type === "board-number" || type === "click-board-number";
}

function acceptEditorCandidate(textarea, options = {}) {
  if (!editorAssistState.active || editorAssistState.candidates.length === 0) return;
  const picked = editorAssistState.candidates[editorAssistState.index];
  const memoryKey = String(editorAssistState.memoryKey || "").trim();
  if (memoryKey && editorAssistState.recentValueByKey instanceof Map) {
    editorAssistState.recentValueByKey.set(memoryKey, picked);
  }
  const suffix = editorAssistState.appendSpace && !options.suppressAppendSpace ? "\t" : "";
  const inserted = `${picked}${suffix}`;
  replaceTextareaRangeWithUndo(
    textarea,
    editorAssistState.replaceStart,
    editorAssistState.replaceEnd,
    inserted,
    "end",
  );
  if (options.exitAssist) {
    clearEditorAssist();
    return;
  }
  if (options.refreshAfterAccept) {
    refreshEditorAssist(textarea);
    return;
  }
  clearEditorAssist();
}

function replaceTextareaRangeWithUndo(textarea, start, end, replacement, selectionMode = "end") {
  if (!textarea) return;
  const textLength = String(textarea.value || "").length;
  const safeStart = Math.max(0, Math.min(Number(start) || 0, textLength));
  const safeEnd = Math.max(safeStart, Math.min(Number(end) || 0, textLength));
  const next = String(replacement ?? "");
  textarea.focus({ preventScroll: true });
  textarea.setSelectionRange(safeStart, safeEnd);
  textarea.setRangeText(next, safeStart, safeEnd, selectionMode);
}

function buildEditorAssistContext(textarea) {
  if (!isEditorAssistEnabled()) return null;
  if (!editorAssistState.sessionActive) return null;

  const text = textarea.value;
  const caret = textarea.selectionStart;
  const lineStart = text.lastIndexOf("\n", Math.max(0, caret - 1)) + 1;
  if (lineStart !== editorAssistState.sessionLineStart) return null;
  const lineEndIdx = text.indexOf("\n", caret);
  const lineEnd = lineEndIdx === -1 ? text.length : lineEndIdx;
  const lineText = text.slice(lineStart, lineEnd);
  const indentLen = (lineText.match(/^\s*/) || [""])[0].length;
  const contentStart = lineStart + indentLen;
  if (caret < contentStart) return null;
  const linePrefix = text.slice(contentStart, caret);

  if (linePrefix === "//") {
    const preferredHead = findPreferredLineHeadCandidate(text.slice(0, lineStart));
    return {
      type: "line-head",
      memoryKey: "line-head",
      candidates: LINE_HEAD_CANDIDATES,
      replaceStart: caret,
      replaceEnd: caret,
      appendSpace: false,
      preferredValue: preferredHead,
    };
  }

  const boardField = buildBoardFieldContext(text, linePrefix, lineStart, caret);
  if (boardField) return boardField;
  const levelField = buildLevelFieldContext(text, linePrefix, contentStart, caret);
  if (levelField) return levelField;
  return null;
}

function buildBoardFieldContext(fullText, linePrefix, lineStart, caret) {
  if (!linePrefix.startsWith("//")) return null;
  const body = linePrefix.slice(2);
  if (!/^(台|board)(\t|$)/i.test(body)) return null;
  const parts = splitAssistTabTokens(body);
  const currentTokenIdx = Math.max(0, parts.length - 1);
  const prefix = String(parts[currentTokenIdx] || "").trim();
  const boardValues = collectBoardDirectiveValues(fullText.slice(0, lineStart));
  if (currentTokenIdx === 1) {
    const typed = String(parts[currentTokenIdx] || "").trim();
    if (typed && !/^\d+$/.test(typed)) return null;
    const previousBoardNo = findPreviousBoardStartNumber(fullText.slice(0, lineStart));
    const nextNo = Number.isFinite(previousBoardNo) && previousBoardNo >= 1
      ? previousBoardNo + 1
      : Math.max(1, boardValues.maxBoardNo + 1);
    return {
      type: "board-number",
      memoryKey: "board-1",
      candidates: [String(nextNo)],
      numericValue: nextNo,
      boardNumberMin: 1,
      replaceStart: caret - typed.length,
      replaceEnd: caret,
      appendSpace: true,
      preferredValue: String(nextNo),
    };
  }
  let candidates = [];
  if (currentTokenIdx === 2) {
    candidates = boardValues.formats;
  } else if (currentTokenIdx === 3) {
    candidates = boardValues.pages;
  } else {
    return null;
  }
  const filtered = candidates.filter((item) => item.startsWith(prefix));
  if (filtered.length === 0) return null;
  const preferredValue = findPreviousDirectiveFieldValue(
    fullText.slice(0, lineStart),
    (tokens) => canonHead(tokens[0]) === "board",
    currentTokenIdx,
  );
  return {
    type: `board-${currentTokenIdx}`,
    memoryKey: `board-${currentTokenIdx}`,
    candidates: filtered,
    replaceStart: caret - prefix.length,
    replaceEnd: caret,
    appendSpace: true,
    preferredValue,
  };
}

function findPreviousBoardStartNumber(text) {
  const lines = String(text || "").split(/\r?\n/);
  for (let i = lines.length - 1; i >= 0; i -= 1) {
    const line = String(lines[i] || "").trim();
    if (!line.startsWith("//")) continue;
    const tokens = parseAssistDirectiveTokens(line);
    if (tokens.length < 2) continue;
    if (canonHead(tokens[0]) !== "board") continue;
    const value = Number.parseInt(String(tokens[1] || "").trim(), 10);
    if (Number.isFinite(value) && value >= 1) return value;
  }
  return Number.NaN;
}

function collectBoardDirectiveValues(text) {
  const formats = new Set(["4C", "2C", "1C", "4C1C", "1C4C", "4C2C", "2C4C", "2C1C", "1C2C"]);
  const pages = new Set(["16", "8"]);
  let maxBoardNo = 0;
  const lines = text.split(/\r?\n/);
  for (const lineRaw of lines) {
    const line = lineRaw.trim();
    if (!line.startsWith("//")) continue;
    const body = line.slice(2).trim();
    const tokens = parseLineTokens(body);
    if (canonHead(tokens[0]) !== "board") continue;
    const directive = parseBoardDirective(tokens);
    if (!directive) continue;
    maxBoardNo = Math.max(maxBoardNo, directive.boardNo);
    if (directive.hasFormat) formats.add(directive.format);
    if (directive.hasPages) pages.add(String(directive.pages));
  }
  return {
    formats: [...formats],
    pages: [...pages],
    maxBoardNo,
  };
}

function buildLevelFieldContext(fullText, linePrefix, lineStart, caret) {
  if (!linePrefix.startsWith("//")) return null;
  const body = linePrefix.slice(2);
  if (!/^(小|中|大|保留|別丁|表紙|帯|カバー|付録|small|middle|large|hold|insert|hyoshi|obi|cover|appendix)(\t|$)/i.test(body) && !/^(\t|\/\t|\/\/\t)/.test(body)) return null;

  const parts = splitAssistTabTokens(body);
  if (/^\t/.test(body)) parts[0] = "大";
  else if (parts[0] === "/") parts[0] = "中";
  else if (parts[0] === "//") parts[0] = "小";
  const currentHeadCanon = canonHead(parts[0]);
  if (!ARTICLE_LIKE_ASSIST_CANONS.has(currentHeadCanon)) return null;
  const currentTokenIdx = Math.max(0, parts.length - 1);
  if (currentTokenIdx === 1) {
    const typed = String(parts[currentTokenIdx] || "").trim();
    if (typed && !/^\d+$/.test(typed)) return null;
    if (typed) return null;
    const preferredPageRaw = findPreviousDirectiveFieldValue(
      fullText.slice(0, lineStart),
      (tokens) => canonHead(tokens[0]) === currentHeadCanon,
      1,
    );
    const preferredPage = Number.parseInt(preferredPageRaw || "", 10);
    const addonDefaultPages = ADDON_SPECS[currentHeadCanon]?.pages;
    const nextNumeric = Number.isFinite(preferredPage) && preferredPage >= 0
      ? preferredPage
      : (Number.isFinite(addonDefaultPages)
        ? addonDefaultPages
        : (editorAssistState.numericValue || 1));
    return {
      type: "page-number",
      memoryKey: "level-1",
      candidates: [String(nextNumeric)],
      numericValue: nextNumeric,
      replaceStart: caret,
      replaceEnd: caret,
      appendSpace: true,
    };
  }
  if (currentTokenIdx < 2) return null;
  const textBeforeLine = fullText.slice(0, lineStart);
  const isAddonHead = Boolean(ADDON_SPECS[currentHeadCanon]);
  const assistFieldLabels = getAssistFieldLabelsForHead(fullText, currentHeadCanon);
  const dataLabels = getArticleDataFieldLabels(assistFieldLabels);
  const maxAssistTokenIdx = isAddonHead ? 1 + dataLabels.length : 2 + dataLabels.length;
  if (currentTokenIdx > maxAssistTokenIdx) return null;

  const prefix = String(parts[currentTokenIdx] || "").trim();
  const names = collectPeopleNames(fullText, assistFieldLabels, currentHeadCanon);
  const extra = collectLevelFieldValues(fullText, assistFieldLabels, currentHeadCanon);
  let pool = [];
  if (currentTokenIdx === 2 && !isAddonHead) {
    pool = extra.articleNames;
  } else {
    const labelIdx = isAddonHead ? currentTokenIdx - 2 : currentTokenIdx - 3;
    const label = String(dataLabels[labelIdx] || "");
    const canon = canonicalFieldByLabel(label);
    if (canon === "desk") pool = names.desk;
    else if (canon === "editors") pool = names.editors;
    else if (canon === "writers") pool = names.writers;
    else if (canon === "deadline") pool = extra.deadlines;
    else if (canon === "status") pool = extra.statuses;
    else if (canon === "memo") pool = extra.memos;
    else pool = collectLevelFieldValuesByTokenIndex(fullText, currentTokenIdx, currentHeadCanon);
  }
  if (!pool.includes("-")) pool = ["-", ...pool];
  const candidates = pool.filter((name) => name.startsWith(prefix));
  if (candidates.length === 0) return null;
  const preferredValue = findPreviousDirectiveFieldValue(
    fullText.slice(0, lineStart),
    (tokens) => canonHead(tokens[0]) === currentHeadCanon,
    currentTokenIdx,
  );

  return {
    type: `people-${currentTokenIdx}`,
    memoryKey: `level-${currentTokenIdx}`,
    candidates,
    replaceStart: caret - prefix.length,
    replaceEnd: caret,
    appendSpace: true,
    preferredValue,
  };
}

function findPreviousDirectiveFieldValue(text, matcher, tokenIdx) {
  const lines = String(text || "").split(/\r?\n/);
  const immediateLine = extractImmediatePreviousLine(text);
  const immediate = parseAssistDirectiveTokens(immediateLine);
  if (immediate.length > tokenIdx && matcher(immediate)) {
    const immediateValue = String(immediate[tokenIdx] || "").trim();
    if (immediateValue) return immediateValue;
  }
  for (let i = lines.length - 1; i >= 0; i -= 1) {
    const line = String(lines[i] || "").trim();
    if (!line.startsWith("//")) continue;
    const tokens = parseAssistDirectiveTokens(line);
    if (tokens.length <= tokenIdx) continue;
    if (!matcher(tokens)) continue;
    const value = String(tokens[tokenIdx] || "").trim();
    if (!value) continue;
    return value;
  }
  return "";
}

function findPreferredLineHeadCandidate(text) {
  const lines = String(text || "").split(/\r?\n/);
  const immediateHead = extractDirectiveHeadToken(extractImmediatePreviousLine(text));
  if (immediateHead) {
    const immediatePreferred = LINE_HEAD_CANDIDATES.find((item) => isSameAssistCandidate(item, immediateHead));
    if (immediatePreferred) return immediatePreferred;
    const immediateCanon = canonHead(immediateHead);
    const immediateByCanon = LINE_HEAD_CANDIDATES.find((item) => {
      const raw = String(item || "").replace(/\t.*/, "");
      return canonHead(raw) === immediateCanon;
    });
    if (immediateByCanon) return immediateByCanon;
  }
  for (let i = lines.length - 1; i >= 0; i -= 1) {
    const line = String(lines[i] || "").trim();
    if (!line.startsWith("//")) continue;
    const head = extractDirectiveHeadToken(line);
    if (!head) continue;
    const preferred = LINE_HEAD_CANDIDATES.find((item) => isSameAssistCandidate(item, head));
    if (preferred) return preferred;
    const headCanon = canonHead(head);
    const byCanon = LINE_HEAD_CANDIDATES.find((item) => {
      const raw = String(item || "").replace(/\t.*/, "");
      return canonHead(raw) === headCanon;
    });
    if (byCanon) return byCanon;
  }
  return "";
}

function extractImmediatePreviousLine(text) {
  const raw = String(text || "");
  const withoutTailBreak = raw.replace(/\r?\n$/, "");
  const lineStart = withoutTailBreak.lastIndexOf("\n");
  return withoutTailBreak.slice(lineStart + 1).trim();
}

function extractDirectiveHeadToken(lineRaw) {
  const tokens = parseAssistDirectiveTokens(lineRaw);
  if (tokens.length > 0 && tokens[0]) return String(tokens[0]).trim();
  const line = String(lineRaw || "").trimStart();
  if (!line.startsWith("//")) return "";
  const body = line.slice(2).trim();
  if (!body) return "";
  return String(body.split(/\s+/)[0] || "").trim();
}

function splitAssistTabTokens(body) {
  return String(body || "").split("\t").map((token) => String(token || "").trim());
}

function parseAssistDirectiveTokens(lineRaw) {
  const line = String(lineRaw || "").trimStart();
  if (!line.startsWith("//")) return [];
  if (/^\/\/\/\/\t/.test(line)) return ["小", ...splitAssistTabTokens(line.slice(5))];
  if (/^\/\/\/\t/.test(line)) return ["中", ...splitAssistTabTokens(line.slice(4))];
  if (/^\/\/\t/.test(line)) return ["大", ...splitAssistTabTokens(line.slice(3))];
  return splitAssistTabTokens(line.slice(2));
}

function resolveAssistArticleFields(text) {
  let labels = getDefaultArticleFieldLabels();
  let tocLabels = null;
  let hasDirective = false;
  const lines = String(text || "").split(/\r?\n/);
  for (let i = 0; i < lines.length; i += 1) {
    const line = String(lines[i] || "").trim();
    if (!line.startsWith("//")) continue;
    const tokens = parseAssistDirectiveTokens(line);
    if (tokens.length === 0) continue;
    if (canonHead(tokens[0]) === "article-fields") {
      labels = normalizeArticleFieldLabels(tokens.slice(1));
      hasDirective = true;
    } else if (canonHead(tokens[0]) === "toc-article-fields") {
      tocLabels = normalizeArticleFieldLabels(tokens.slice(1));
    }
  }
  return { labels, tocLabels, hasDirective };
}

function getAssistFieldLabelsForHead(text, headCanon) {
  const resolved = resolveAssistArticleFields(text);
  if (ADDON_SPECS[headCanon] && resolved.tocLabels) return resolved.tocLabels;
  return resolved.labels;
}

function collectLevelFieldValuesByTokenIndex(text, tokenIdx, headCanon = "") {
  const out = [];
  const seen = new Set();
  const canonFilter = String(headCanon || "").trim();
  const lines = String(text || "").split(/\r?\n/);
  for (const lineRaw of lines) {
    const line = String(lineRaw || "").trim();
    if (!line.startsWith("//")) continue;
    const tokens = parseAssistDirectiveTokens(line);
    if (tokens.length <= tokenIdx) continue;
    if (!isArticleLikeAssistHeadToken(tokens[0])) continue;
    if (canonFilter && canonHead(tokens[0]) !== canonFilter) continue;
    const value = String(tokens[tokenIdx] || "").trim();
    if (!value) continue;
    if (seen.has(value)) continue;
    seen.add(value);
    out.push(value);
  }
  return out;
}

function collectLevelFieldValuesByTokenIndexForHead(text, tokenIdx, headCanon) {
  const out = [];
  const seen = new Set();
  const canon = String(headCanon || "").trim();
  if (!canon) return out;
  const lines = String(text || "").split(/\r?\n/);
  for (const lineRaw of lines) {
    const line = String(lineRaw || "").trim();
    if (!line.startsWith("//")) continue;
    const tokens = parseAssistDirectiveTokens(line);
    if (tokens.length <= tokenIdx) continue;
    if (canonHead(tokens[0]) !== canon) continue;
    const value = String(tokens[tokenIdx] || "").trim();
    if (!value) continue;
    const key = value.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(value);
  }
  return out;
}

function collectPeopleNames(text, fieldLabels = getDefaultArticleFieldLabels(), headCanon = "") {
  const names = {
    desk: [],
    editors: [],
    writers: [],
  };
  const canonFilter = String(headCanon || "").trim();
  const seen = {
    desk: new Set(),
    editors: new Set(),
    writers: new Set(),
  };

  const lines = text.split(/\r?\n/);
  for (const lineRaw of lines) {
    const line = lineRaw.trim();
    if (!line.startsWith("//")) continue;
    const tokens = parseAssistDirectiveTokens(line);
    if (tokens.length < 2) continue;
    if (!isArticleLikeAssistHeadToken(tokens[0])) continue;
    if (canonFilter && canonHead(tokens[0]) !== canonFilter) continue;
    const articleFields = parseArticleFieldPayload(tokens, 3, fieldLabels);
    if (Array.isArray(articleFields.desk)) {
      for (const person of articleFields.desk) collectPeopleInto(person, "desk", names, seen);
    }
    if (Array.isArray(articleFields.editors)) {
      for (const person of articleFields.editors) collectPeopleInto(person, "editors", names, seen);
    }
    if (Array.isArray(articleFields.writers)) {
      for (const person of articleFields.writers) collectPeopleInto(person, "writers", names, seen);
    }
  }

  return names;
}

function collectLevelFieldValues(text, fieldLabels = getDefaultArticleFieldLabels(), headCanon = "") {
  const out = {
    articleNames: [],
    deadlines: [],
    statuses: [],
    memos: [],
  };
  const seen = {
    articleNames: new Set(),
    deadlines: new Set(),
    statuses: new Set(),
    memos: new Set(),
  };
  const canonFilter = String(headCanon || "").trim();

  const lines = text.split(/\r?\n/);
  for (const lineRaw of lines) {
    const line = lineRaw.trim();
    if (!line.startsWith("//")) continue;
    const tokens = parseAssistDirectiveTokens(line);
    if (tokens.length < 3) continue;
    if (!isArticleLikeAssistHeadToken(tokens[0])) continue;
    if (canonFilter && canonHead(tokens[0]) !== canonFilter) continue;

    collectUniqueValue(tokens[2], "articleNames", out, seen);
    const articleFields = parseArticleFieldPayload(tokens, 3, fieldLabels);
    if (articleFields.deadline) collectUniqueValue(articleFields.deadline, "deadlines", out, seen);
    if (articleFields.status) collectUniqueValue(articleFields.status, "statuses", out, seen);
    if (articleFields.memo) collectUniqueValue(articleFields.memo, "memos", out, seen);
  }
  return out;
}

function collectUniqueValue(value, key, out, seen) {
  if (!value) return;
  if (seen[key].has(value)) return;
  seen[key].add(value);
  out[key].push(value);
}

function collectPeopleInto(raw, key, names, seen) {
  if (!raw) return;
  const items = raw.split("|").map((x) => x.trim()).filter(Boolean);
  for (const item of items) {
    if (seen[key].has(item)) continue;
    seen[key].add(item);
    names[key].push(item);
  }
}

function isArticleLikeAssistHeadToken(token) {
  return ARTICLE_LIKE_ASSIST_CANONS.has(canonHead(token));
}

function isClickAssistType(type) {
  return String(type || "").startsWith("click-");
}

function syncEditorAssistSession(textarea) {
  const text = textarea.value;
  const caret = textarea.selectionStart;
  const lineStart = text.lastIndexOf("\n", Math.max(0, caret - 1)) + 1;
  const lineEndIdx = text.indexOf("\n", caret);
  const lineEnd = lineEndIdx === -1 ? text.length : lineEndIdx;
  const lineText = text.slice(lineStart, lineEnd);
  const indentLen = (lineText.match(/^\s*/) || [""])[0].length;
  const contentStart = lineStart + indentLen;

  if (!editorAssistState.sessionActive) {
    if (
      isEditorAssistEnabled()
      && lineText.trimStart() === "//"
      && caret === contentStart + 2
    ) {
      editorAssistState.sessionActive = true;
      editorAssistState.sessionLineStart = lineStart;
      editorAssistState.sessionContentStart = contentStart;
      editorAssistState.numericValue = 1;
    }
    return;
  }

  if (lineStart !== editorAssistState.sessionLineStart) {
    editorAssistState.sessionActive = false;
    editorAssistState.sessionLineStart = -1;
    editorAssistState.sessionContentStart = -1;
    editorAssistState.active = false;
    return;
  }
  editorAssistState.sessionContentStart = contentStart;
}

function getTextareaCaretPixelPosition(textarea, caretPos) {
  if (!textarea) return { left: 0, top: 0 };
  const style = window.getComputedStyle(textarea);
  const mirror = document.createElement("div");
  const props = [
    "boxSizing",
    "width",
    "height",
    "overflowX",
    "overflowY",
    "borderTopWidth",
    "borderRightWidth",
    "borderBottomWidth",
    "borderLeftWidth",
    "paddingTop",
    "paddingRight",
    "paddingBottom",
    "paddingLeft",
    "fontStyle",
    "fontVariant",
    "fontWeight",
    "fontStretch",
    "fontSize",
    "fontFamily",
    "lineHeight",
    "letterSpacing",
    "textTransform",
    "textIndent",
    "textDecoration",
    "wordSpacing",
    "tabSize",
    "whiteSpace",
  ];
  for (const prop of props) {
    mirror.style[prop] = style[prop];
  }
  mirror.style.position = "absolute";
  mirror.style.visibility = "hidden";
  mirror.style.whiteSpace = "pre-wrap";
  mirror.style.wordWrap = "break-word";
  mirror.style.overflow = "hidden";

  const text = textarea.value;
  mirror.textContent = text.slice(0, caretPos);
  const marker = document.createElement("span");
  marker.textContent = "\u200b";
  mirror.appendChild(marker);
  document.body.appendChild(mirror);

  const left = marker.offsetLeft - textarea.scrollLeft + 1;
  const top = marker.offsetTop - textarea.scrollTop + 1;
  document.body.removeChild(mirror);
  return { left, top };
}


function parseLineTokens(line) {
  return String(line || "")
    .trim()
    .split(/\t+/)
    .map((token) => token.trim())
    .filter(Boolean);
}

function parseDirectiveTokensFromRawLine(lineRaw) {
  const line = String(lineRaw || "").trimStart();
  if (!line.startsWith("//")) return [];
  // Shorthand levels:
  // //\t...   => //大\t...
  // ///\t...  => //中\t...
  // ////\t... => //小\t...
  if (/^\/\/\/\/\t/.test(line)) return ["小", ...parseLineTokens(line.slice(5))];
  if (/^\/\/\/\t/.test(line)) return ["中", ...parseLineTokens(line.slice(4))];
  if (/^\/\/\t/.test(line)) return ["大", ...parseLineTokens(line.slice(3))];
  return parseLineTokens(line.slice(2).trim());
}

const PAGE_UNITS = 10;

function pagesToUnits(value) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.round(value * PAGE_UNITS));
}

function unitsToPages(units) {
  if (!Number.isFinite(units)) return 0;
  return units / PAGE_UNITS;
}

function formatPagesValue(units) {
  const pages = unitsToPages(units);
  const rounded = Math.round(pages * 10) / 10;
  if (Math.abs(rounded - Math.round(rounded)) < 1e-9) return String(Math.round(rounded));
  return rounded.toFixed(1);
}

function resolveBodyFolioStart(meta = state.meta) {
  return Math.max(1, Number.parseInt(meta?.bodyFolioStart, 10) || 1);
}

function resolveStartPage(meta = state.meta) {
  return Math.max(1, Number.parseInt(meta?.startPage, 10) || 1);
}

function getFlatplanPhysicalPosition(globalPageIndex, pageAdvanceBefore = 0) {
  return Math.max(1, (Number(globalPageIndex) || 0) + 1 + (Number(pageAdvanceBefore) || 0));
}

function toLowerRomanNumeral(value) {
  const num = Math.floor(Number(value) || 0);
  if (num <= 0) return "";
  const table = [
    [1000, "m"], [900, "cm"], [500, "d"], [400, "cd"],
    [100, "c"], [90, "xc"], [50, "l"], [40, "xl"],
    [10, "x"], [9, "ix"], [5, "v"], [4, "iv"], [1, "i"],
  ];
  let remaining = num;
  let out = "";
  for (const [unit, glyph] of table) {
    while (remaining >= unit) {
      out += glyph;
      remaining -= unit;
    }
  }
  return out;
}

function formatFlatplanFolioDisplay(physicalPos, meta = state.meta) {
  const pos = Math.max(1, Number(physicalPos) || 1);
  const bodyStart = resolveBodyFolioStart(meta);
  if (pos < bodyStart) {
    return toLowerRomanNumeral(pos);
  }
  const startPage = resolveStartPage(meta);
  return String(startPage + (pos - bodyStart));
}

function formatFlatplanFolioForPage(globalPageIndex, pageAdvanceBefore = 0, meta = state.meta) {
  const physicalPos = getFlatplanPhysicalPosition(globalPageIndex, pageAdvanceBefore);
  return formatFlatplanFolioDisplay(physicalPos, meta);
}

function buildTocLayoutContext() {
  const boardDisplayData = buildBoardDisplayData();
  const boardBetchoes = boardDisplayData.betchoes || [];
  const totalBetchoAdvance = boardBetchoes.reduce(
    (sum, b) => sum + pagesToUnits(b.advancePages || 0),
    0,
  );
  const layoutMeta = {
    ...state.meta,
    pages:
      state.meta.pages > 0
        ? Math.max(1, state.meta.pages - totalBetchoAdvance)
        : state.meta.pages,
  };
  const layoutResult = layout(boardDisplayData.entries, layoutMeta);
  const boardSpecs = buildBoardSpecs(layoutResult.pages.length, state.boardDirectives || []);
  const advancePrefixByBoard = buildAdvancePrefixByBoard(boardBetchoes, boardSpecs);
  const advanceByGlobalIndex = new Map();
  for (const spec of boardSpecs) {
    const advance = advancePrefixByBoard.get(spec.boardNo) || 0;
    for (let i = 0; i < spec.pages; i += 1) {
      advanceByGlobalIndex.set(spec.start + i, advance);
    }
  }
  return {
    entries: boardDisplayData.entries,
    advanceByGlobalIndex,
    meta: state.meta,
    tree: layoutResult.tree || [],
  };
}

function unitsStartToTocFolio(unitStart, advanceByGlobalIndex, meta) {
  const globalPageIndex = Math.floor(Math.max(0, unitStart) / PAGE_UNITS);
  const advance = advanceByGlobalIndex.get(globalPageIndex) || 0;
  return formatFlatplanFolioForPage(globalPageIndex, advance, meta);
}

function shouldIncludeTocEntry(entry) {
  if (!entry) return false;
  if (entry.anonymous) return false;
  const name = String(entry.name || "").trim();
  if (!name || name === "(無題)") return false;
  return true;
}

function measureTocLineWidth(text) {
  let width = 0;
  for (const ch of String(text || "")) {
    width += ch.charCodeAt(0) > 0xff ? 2 : 1;
  }
  return width;
}

function formatTocDraftLine(item, style, lineWidthHalfUnits = 72) {
  const indentUnit = LOCALE === "en" ? "  " : "　";
  const prefix = indentUnit.repeat(Math.max(0, item.indent || 0));
  const title = `${prefix}${item.name}`;
  const folio = String(item.folio ?? "");
  if (style === "tab") {
    return `${title}\t${folio}`;
  }
  const titleWidth = measureTocLineWidth(title);
  const folioWidth = measureTocLineWidth(folio);
  const leaderWidth = Math.max(3, lineWidthHalfUnits - titleWidth - folioWidth);
  const leader = "…".repeat(Math.ceil(leaderWidth / 2));
  return `${title}${leader}${folio}`;
}

function buildTocDraftItems(options = {}) {
  const depth = options.depth || "large-middle";
  const ctx = buildTocLayoutContext();
  const tree = ctx.tree || [];
  const items = [];

  const pushItem = (level, name, unitStart, indent) => {
    items.push({
      level,
      name: String(name).trim(),
      folio: unitsStartToTocFolio(unitStart, ctx.advanceByGlobalIndex, ctx.meta),
      indent: Math.max(0, indent),
    });
  };

  for (const large of tree) {
    if (!shouldIncludeTocEntry(large)) continue;
    pushItem("large", large.name, large.parentStart ?? large.start, 0);
    if (depth === "large") continue;

    for (const middle of large.middles) {
      const isSynthetic = Boolean(middle.syntheticAutoMiddle);
      const showMiddle = shouldIncludeTocEntry(middle) && !isSynthetic;
      if (showMiddle) {
        pushItem("middle", middle.name, middle.parentStart ?? middle.start, 1);
      }
      if (depth !== "all") continue;
      const smallIndent = showMiddle ? 2 : 1;
      for (const small of middle.smalls) {
        if (!shouldIncludeTocEntry(small)) continue;
        pushItem("small", small.name, small.start, smallIndent);
      }
    }
  }
  return items;
}

function getTocDraftOptionsFromDialog() {
  return {
    depth: els.tocDraftDepth?.value || "large-middle",
    style: els.tocDraftStyle?.value || "dots",
    includeTitle: Boolean(els.tocDraftIncludeTitle?.checked),
  };
}

function buildTocDraftText(options = {}) {
  const depth = options.depth || "large-middle";
  const style = options.style || "dots";
  const includeTitle = options.includeTitle !== false;
  const items = buildTocDraftItems({ depth });
  const lines = [];
  if (includeTitle) {
    const title = String(state.meta?.title || "").trim();
    if (title) lines.push(title, "");
  }
  if (items.length === 0) {
    lines.push(
      LOCALE === "en"
        ? "(No TOC entries — check article names and hierarchy.)"
        : "（目次に載せる記事がありません。記事名と階層を確認してください。）",
    );
  } else {
    for (const item of items) {
      lines.push(formatTocDraftLine(item, style));
    }
  }
  return lines.join("\n");
}

function refreshTocDraftPreview() {
  if (!els.tocDraftPreview) return;
  els.tocDraftPreview.value = buildTocDraftText(getTocDraftOptionsFromDialog());
}

function openTocDraftDialog() {
  const dialog = els.tocDraftDialog;
  if (!dialog) return;
  refreshTocDraftPreview();
  if (typeof dialog.showModal === "function") dialog.showModal();
}

function closeTocDraftDialog() {
  const dialog = els.tocDraftDialog;
  if (dialog?.open) dialog.close();
}

async function copyTocDraftToClipboard() {
  const text = buildTocDraftText(getTocDraftOptionsFromDialog());
  try {
    await navigator.clipboard.writeText(text);
    window.alert(LOCALE === "en" ? "Copied to clipboard." : "クリップボードにコピーしました。");
  } catch {
    if (els.tocDraftPreview) {
      els.tocDraftPreview.focus();
      els.tocDraftPreview.select();
    }
    window.alert(
      LOCALE === "en"
        ? "Copy failed. The preview text is selected — use Ctrl+C."
        : "コピーに失敗しました。プレビューを選択したので Ctrl+C でコピーしてください。",
    );
  }
}

function downloadTocDraftText() {
  const text = buildTocDraftText(getTocDraftOptionsFromDialog());
  const blob = new Blob([`\uFEFF${text}\r\n`], { type: "text/plain;charset=utf-8;" });
  const now = new Date();
  const ts = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("") + String(now.getHours()).padStart(2, "0") + String(now.getMinutes()).padStart(2, "0");
  const filename = `${state.meta.filename || "daiwari"}_toc_${ts}.txt`;
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

function isValidCustomGptUrl(url) {
  const s = String(url || "").trim();
  if (!s) return false;
  try {
    const u = new URL(s);
    const host = u.hostname.replace(/^www\./i, "").toLowerCase();
    return (host === "chatgpt.com" || host === "chat.openai.com") && u.pathname.startsWith("/g/");
  } catch {
    return false;
  }
}

function customGptUrlStorageKey() {
  return LOCALE === "en" ? CUSTOM_GPT_URL_STORAGE_KEY_EN : CUSTOM_GPT_URL_STORAGE_KEY_JA;
}

function sessionCustomGptUrlForLocale() {
  return LOCALE === "en" ? sessionGateState.customGptUrlEn : sessionGateState.customGptUrlJa;
}

function defaultCustomGptUrlForLocale() {
  return LOCALE === "en" ? DEFAULT_CUSTOM_GPT_URL_EN : DEFAULT_CUSTOM_GPT_URL_JA;
}

function migrateCustomGptUrlStorage() {
  try {
    const legacy = localStorage.getItem(CUSTOM_GPT_URL_STORAGE_KEY_LEGACY) || "";
    if (isValidCustomGptUrl(legacy) && !localStorage.getItem(CUSTOM_GPT_URL_STORAGE_KEY_JA)) {
      localStorage.setItem(CUSTOM_GPT_URL_STORAGE_KEY_JA, legacy.trim());
    }
    if (legacy) localStorage.removeItem(CUSTOM_GPT_URL_STORAGE_KEY_LEGACY);
  } catch (_e) {
  }
}

function resolveCustomGptUrl() {
  const fromSession = sessionCustomGptUrlForLocale();
  if (fromSession && isValidCustomGptUrl(fromSession)) return fromSession.trim();
  try {
    migrateCustomGptUrlStorage();
    const saved = localStorage.getItem(customGptUrlStorageKey()) || "";
    if (isValidCustomGptUrl(saved)) return saved.trim();
  } catch (_e) {
  }
  const fallback = defaultCustomGptUrlForLocale();
  return isValidCustomGptUrl(fallback) ? fallback.trim() : "";
}

function isCustomGptUrlLockedBySession() {
  const fromSession = sessionCustomGptUrlForLocale();
  return Boolean(fromSession && isValidCustomGptUrl(fromSession));
}

function getAiDraftMemoPlaceholder(includeFlatplanInCopy) {
  if (LOCALE === "en") {
    return includeFlatplanInCopy
      ? [
          "Example (edit / rearrange):",
          "Set chapter 2 to 10 pages / Make cover 5p / Reorder chapters for readability",
        ].join("\n")
      : [
          "Example (new flatplan):",
          "Title: Cat Railway Guide",
          "Trim: A4 trimmed portrait / left opening / 192 body pages",
          "Cover 5p, TOC 2p",
          "Chapter 1 Introduction 24p",
          "  - Route map 8p",
          "  - Buying tickets 8p",
          "  - Station guide 8p",
          "Roman folio from page 5 of body (optional)",
        ].join("\n");
  }
  return includeFlatplanInCopy
    ? [
        "例（修正・再構成）:",
        "第2章を10pに／表紙を5pに／章立てを読みやすく並べ替えて",
      ].join("\n")
    : [
        "例（新規作成）:",
        "書名: ねこ鉄道ガイド",
        "判型: A4変形縦／左開き／本編192p",
        "表紙5p、目次2p",
        "第1章 ねこ鉄道入門 24p",
        "  - 路線図 8p",
        "  - 切符の買い方 8p",
        "  - 駅ナビ 8p",
        "本文ノンブルは5页目から（任意）",
      ].join("\n");
}

function refreshAiDraftMemoPlaceholder() {
  if (!els.aiDraftMemo) return;
  const includeFlatplan = Boolean(els.aiDraftIncludeFlatplan?.checked);
  els.aiDraftMemo.placeholder = getAiDraftMemoPlaceholder(includeFlatplan);
}

function persistAiDraftMemo() {
  const memo = String(els.aiDraftMemo?.value ?? "");
  try {
    localStorage.setItem(AI_DRAFT_MEMO_STORAGE_KEY, memo);
  } catch (_e) {
  }
}

function loadAiDraftMemoFromStorage() {
  try {
    const saved = localStorage.getItem(AI_DRAFT_MEMO_STORAGE_KEY);
    if (typeof saved === "string" && els.aiDraftMemo) els.aiDraftMemo.value = saved;
  } catch (_e) {
  }
}

function hasSubstantialFlatplanContent() {
  const text = serializeState();
  if (!String(text || "").trim()) return false;
  const parsed = parseText(text);
  return (
    (parsed.entries?.length || 0) > 0
    || (parsed.addonEntries?.length || 0) > 0
    || (parsed.betchoes?.length || 0) > 0
    || Boolean(String(parsed.meta?.title || "").trim())
  );
}

function shouldIncludeFlatplanInAiDraftBundle() {
  if (!els.aiDraftIncludeFlatplan?.checked) return false;
  return hasSubstantialFlatplanContent();
}

function getCurrentFlatplanTextForAiDraft() {
  if (!shouldIncludeFlatplanInAiDraftBundle()) return "";
  return serializeState().trim();
}

function loadAiDraftIncludeFlatplanPreference() {
  if (!els.aiDraftIncludeFlatplan) return;
  try {
    const saved = localStorage.getItem(AI_DRAFT_INCLUDE_FLATPLAN_KEY);
    if (saved === "0") {
      els.aiDraftIncludeFlatplan.checked = false;
      refreshAiDraftMemoPlaceholder();
      return;
    }
    if (saved === "1") {
      els.aiDraftIncludeFlatplan.checked = true;
      refreshAiDraftMemoPlaceholder();
      return;
    }
  } catch (_e) {
  }
  els.aiDraftIncludeFlatplan.checked = hasSubstantialFlatplanContent();
  refreshAiDraftMemoPlaceholder();
}

function persistAiDraftIncludeFlatplanPreference() {
  if (!els.aiDraftIncludeFlatplan) return;
  try {
    localStorage.setItem(
      AI_DRAFT_INCLUDE_FLATPLAN_KEY,
      els.aiDraftIncludeFlatplan.checked ? "1" : "0",
    );
  } catch (_e) {
  }
  refreshAiDraftMemoPlaceholder();
}

function buildAiDraftClipboardBundle() {
  const memo = String(els.aiDraftMemo?.value ?? "").trim();
  const flatplanText = getCurrentFlatplanTextForAiDraft();
  const hasFlatplan = Boolean(flatplanText);
  const parts = [];

  if (hasFlatplan) {
    parts.push(
      LOCALE === "en" ? "【Current flatplan (full text)】" : "【現在の台割（全文）】",
      flatplanText,
      "",
    );
  }

  if (memo) {
    parts.push(
      LOCALE === "en" ? "【Instructions / memo】" : "【指示・メモ】",
      memo,
      "",
    );
  }

  if (!memo && !hasFlatplan) {
    parts.push(
      LOCALE === "en"
        ? "【Instructions / memo】\n(Describe a new book, or paste instructions to edit/rearrange an existing flatplan.)"
        : "【指示・メモ】\n（新規の企画メモ、または修正・再構成の指示を書いてください）",
      "",
    );
  } else if (!memo && hasFlatplan) {
    parts.push(
      LOCALE === "en"
        ? "【Instructions / memo】\n(Describe what to change or how to rearrange the flatplan above.)"
        : "【指示・メモ】\n（上の台割に対する修正・再構成の指示を書いてください）",
      "",
    );
  }

  if (hasFlatplan) {
    parts.push(
      LOCALE === "en"
        ? "---\nMode: edit or rearrange. Apply the instructions to the current flatplan. Keep unchanged parts unless asked. Keep //format, //boards, //toc-plan headers and tab indentation (//large tab1, //middle tab2, //small tab3 under //toc-plan). For large structural changes, confirm in 1–2 sentences first, then output the full revised flatplan (// lines only, tab-separated)."
        : "---\nモード: 修正または再構成。上の台割に指示を反映してください。指示のない部分は維持。//体裁・//台構成・//目次計画 の見出しとインデント（目次計画内: //大タブ1、//中タブ2、//小タブ3）も維持。章立ての大きな変更は、先に1〜2文で方針を確認してから、修正後の台割全文（// 行のみ、タブ区切り）を出力してください。",
    );
  } else {
    parts.push(
      LOCALE === "en"
        ? [
            "---",
            "Mode: new flatplan. Ask if anything is missing, then output only the flatplan text (// lines, tab-separated).",
            "Required section headers: //format, //boards, //toc-plan (and //cover-block if needed).",
            "Under //toc-plan: //toc-article-fields with 1 tab; //large 1 tab; //middle 2 tabs; //small 3 tabs (match sample dwml).",
            "Under //format and //boards: child lines indented with 1 tab.",
          ].join("\n")
        : [
            "---",
            "モード: 新規作成。不足があれば質問し、準備ができたら台割テキスト（// 行のみ、タブ区切り）だけを出力してください。",
            "必須の見出し: //体裁、//台構成、//目次計画（必要なら //表紙まわり）。",
            "//目次計画 内: //目次項目設定・//大 は行頭タブ1、//中 はタブ2、//小 はタブ3（ねこ鉄道と空中温泉ガイド.dwml お手本どおり）。",
            "//体裁・//台構成 の子行は行頭タブ1。",
          ].join("\n"),
    );
  }
  return parts.join("\n");
}

const DWML_SECTION_HEADERS = new Set([
  "体裁",
  "台構成",
  "目次計画",
  "表紙まわり",
  "format",
  "boards",
  "toc-plan",
  "cover-block",
]);

const DWML_UNKNOWN_HEAD_HINTS = {
  版型: "判型",
  版型縦: "判型",
  開始ページ: "開始ページ番号",
  ノンブル開始: "本文ノンブル開始位置",
};

function lintDwmlIssue(line, severity, message) {
  return { line: Math.max(1, Number(line) || 1), severity, message: String(message || "") };
}

function suggestUnknownHeadMessage(headRaw) {
  const hint = DWML_UNKNOWN_HEAD_HINTS[headRaw];
  if (hint) {
    return LOCALE === "en"
      ? `Unknown directive "//${headRaw}". Did you mean //${hint}?`
      : `不明な指令「//${headRaw}」。「//${hint}」の誤りではありませんか？`;
  }
  return LOCALE === "en"
    ? `Unknown directive "//${headRaw}".`
    : `不明な指令「//${headRaw}」`;
}

function lintDwml(text) {
  const errors = [];
  const warnings = [];
  const lines = String(text || "").split(/\r?\n/);
  let sawDirective = false;
  let hasLarge = false;

  for (let i = 0; i < lines.length; i += 1) {
    const lineRaw = lines[i];
    const lineNo = i + 1;
    const trimmedStart = lineRaw.trimStart();
    if (!trimmedStart.startsWith("//")) continue;
    sawDirective = true;

    const tokens = parseDirectiveTokensFromRawLine(lineRaw);
    if (tokens.length === 0) continue;

    const headRaw = String(tokens[0] || "");
    if (headRaw.startsWith("*")) continue;

    if (tokens.length >= 2 && !lineRaw.includes("\t") && /\s/.test(trimmedStart.slice(2))) {
      warnings.push(
        lintDwmlIssue(
          lineNo,
          "warning",
          LOCALE === "en"
            ? "Use tab characters between columns (recommended)."
            : "列の区切りはタブ推奨です（スペース区切りになっています）。",
        ),
      );
    }

    const headCanon = canonHead(headRaw);
    const level = LEVELS[headRaw] || LEVELS[String(headRaw).toLowerCase()];

    if (tokens.length === 1 && !headCanon && !level) {
      if (DWML_SECTION_HEADERS.has(headRaw)) continue;
      errors.push(lintDwmlIssue(lineNo, "error", suggestUnknownHeadMessage(headRaw)));
      continue;
    }

    if (!headCanon && !level) {
      errors.push(lintDwmlIssue(lineNo, "error", suggestUnknownHeadMessage(headRaw)));
      continue;
    }

    if (level === "large") {
      hasLarge = true;
      if (!looksLikePageCountToken(tokens[1])) {
        errors.push(
          lintDwmlIssue(
            lineNo,
            "error",
            LOCALE === "en"
              ? "//large: invalid page count (2nd column)."
              : "//大: 2列目のページ数が不正です。",
          ),
        );
      }
      const name = String(tokens[2] || "").trim();
      if (!name || name === "(無題)") {
        warnings.push(
          lintDwmlIssue(
            lineNo,
            "warning",
            LOCALE === "en" ? "Article name is empty." : "記事名が空です。",
          ),
        );
      }
      continue;
    }

    if (level === "middle") {
      if (!hasLarge) {
        errors.push(
          lintDwmlIssue(
            lineNo,
            "error",
            LOCALE === "en"
              ? "//middle without a preceding //large."
              : "//大 のない //中 です。",
          ),
        );
      }
      if (!looksLikePageCountToken(tokens[1])) {
        errors.push(
          lintDwmlIssue(
            lineNo,
            "error",
            LOCALE === "en"
              ? "//middle: invalid page count (2nd column)."
              : "//中: 2列目のページ数が不正です。",
          ),
        );
      }
      continue;
    }

    if (level === "small") {
      if (!hasLarge) {
        errors.push(
          lintDwmlIssue(
            lineNo,
            "error",
            LOCALE === "en"
              ? "//small without a preceding //large."
              : "//大 のない //小 です。",
          ),
        );
      }
      if (!looksLikePageCountToken(tokens[1])) {
        errors.push(
          lintDwmlIssue(
            lineNo,
            "error",
            LOCALE === "en"
              ? "//small: invalid page count (2nd column)."
              : "//小: 2列目のページ数が不正です。",
          ),
        );
      }
      continue;
    }

    if (headCanon === "board") {
      if (tokens.length < 2) {
        errors.push(
          lintDwmlIssue(
            lineNo,
            "error",
            LOCALE === "en"
              ? "//board needs board number, colors, and pages."
              : "//台: 台番号・色数・ページ数が必要です。",
          ),
        );
        continue;
      }
      const colorTok = String(tokens[2] || "").trim();
      if (colorTok && !normalizeBoardFormat(colorTok) && /[A-Za-z変形縦横]/.test(colorTok)) {
        errors.push(
          lintDwmlIssue(
            lineNo,
            "error",
            LOCALE === "en"
              ? "//board column 2 is ink colors (4C, 1C…), not trim size. Use //trim-size."
              : "//台 の第2列は色数（4C 等）です。判型は //判型 に書いてください。",
          ),
        );
      }
      const dir = parseBoardDirective(tokens);
      if (!dir?.hasFormat && !dir?.hasPages && tokens.length < 3) {
        warnings.push(
          lintDwmlIssue(
            lineNo,
            "warning",
            LOCALE === "en"
              ? "//board: color count or page count may be missing."
              : "//台: 色数またはページ数が不足している可能性があります。",
          ),
        );
      }
      continue;
    }

    if (ADDON_SPECS[headCanon]) {
      if (tokens.length >= 2 && !looksLikePageCountToken(tokens[1]) && !/^\d/.test(String(tokens[1] || ""))) {
        warnings.push(
          lintDwmlIssue(
            lineNo,
            "warning",
            LOCALE === "en"
              ? "First value after cover/obi line should be page count."
              : "表紙・帯などは先頭にページ数を書きます。",
          ),
        );
      }
      continue;
    }

    if (headCanon === "betcho") {
      if (tokens.length < 4) {
        errors.push(
          lintDwmlIssue(
            lineNo,
            "error",
            LOCALE === "en"
              ? "//insert needs: board, advance pages, name, …"
              : "//別丁: 挿入先台・ページ進み・名前 が必要です。",
          ),
        );
      }
      continue;
    }

    if (headCanon === "hold") {
      if (!looksLikePageCountToken(tokens[1])) {
        errors.push(
          lintDwmlIssue(
            lineNo,
            "error",
            LOCALE === "en"
              ? "//hold: invalid page count (2nd column)."
              : "//保留: 2列目のページ数が不正です。",
          ),
        );
      }
      continue;
    }

    if (headCanon === "title" && !String(tokens.slice(1).join("\t")).trim()) {
      warnings.push(
        lintDwmlIssue(lineNo, "warning", LOCALE === "en" ? "//title is empty." : "//書名 が空です。"),
      );
    }
    if (headCanon === "pages" && tokens.length < 2) {
      warnings.push(
        lintDwmlIssue(
          lineNo,
          "warning",
          LOCALE === "en" ? "//pages has no expression." : "//ページ数 が空です。",
        ),
      );
    }

    if (headCanon === "share-id") {
      const shareToken = String(tokens[1] || "").trim();
      if (!shareToken) {
        warnings.push(
          lintDwmlIssue(
            lineNo,
            "warning",
            LOCALE === "en" ? "//share-id is empty." : "//シェアID が空です。",
          ),
        );
      } else if (SHARE_ID && shareToken !== SHARE_ID) {
        warnings.push(
          lintDwmlIssue(
            lineNo,
            "warning",
            LOCALE === "en"
              ? `File share ID "${shareToken}" differs from URL ?share=${SHARE_ID}.`
              : `ファイルのシェアID「${shareToken}」と URL の ?share=${SHARE_ID} が一致しません。`,
          ),
        );
      } else if (!SHARE_ID && shareToken) {
        warnings.push(
          lintDwmlIssue(
            lineNo,
            "warning",
            LOCALE === "en"
              ? `Add ?share=${shareToken}&syncEndpoint=... to the URL for Drive sync.`
              : `Drive 同期するには URL に ?share=${shareToken}&syncEndpoint=... を付けてください。`,
          ),
        );
      }
      continue;
    }

    if (headCanon === "sync-endpoint") {
      const endpoint = tokens.slice(1).join("\t").trim();
      if (endpoint && !/^https?:\/\//i.test(endpoint)) {
        warnings.push(
          lintDwmlIssue(
            lineNo,
            "warning",
            LOCALE === "en"
              ? "//sync-endpoint should be an https URL (Apps Script /exec)."
              : "//同期URL は Apps Script の https URL（/exec）を指定してください。",
          ),
        );
      }
      continue;
    }
  }

  if (String(text || "").trim() && !sawDirective) {
    errors.push(
      lintDwmlIssue(
        1,
        "error",
        LOCALE === "en" ? "No lines starting with //." : "// で始まる行がありません。",
      ),
    );
  }

  return { errors, warnings, ok: errors.length === 0 };
}

function clearEditorLintMirror() {
  if (els.editorLintMirror) {
    els.editorLintMirror.innerHTML = "";
    els.editorLintMirror.classList.add("hidden");
  }
  els.editorText?.classList.remove("has-lint-mirror");
}

function syncEditorLintMirrorScroll() {
  const ta = els.editorText;
  const mirror = els.editorLintMirror;
  if (!ta || !mirror || mirror.classList.contains("hidden")) return;
  mirror.scrollTop = ta.scrollTop;
  mirror.scrollLeft = ta.scrollLeft;
}

function renderEditorLintMirror(lint) {
  const ta = els.editorText;
  const mirror = els.editorLintMirror;
  if (!ta || !mirror) return;
  const errorLines = new Set((lint?.errors || []).map((x) => x.line));
  const warnLines = new Set((lint?.warnings || []).map((x) => x.line));
  const lines = ta.value.split(/\r?\n/);
  const html = lines
    .map((line, idx) => {
      const lineNo = idx + 1;
      let cls = "editor-lint-line";
      if (errorLines.has(lineNo)) cls += " is-error";
      else if (warnLines.has(lineNo)) cls += " is-warning";
      const safe = escapeHtml(line) || "\u00a0";
      return `<div class="${cls}">${safe}</div>`;
    })
    .join("");
  mirror.innerHTML = html;
  mirror.classList.remove("hidden");
  ta.classList.add("has-lint-mirror");
  syncEditorLintMirrorScroll();
}

function focusEditorLine(lineNo) {
  const ta = els.editorText;
  if (!ta) return;
  const lines = ta.value.split(/\r?\n/);
  const idx = Math.max(0, Math.min(lines.length - 1, (Number(lineNo) || 1) - 1));
  let pos = 0;
  for (let i = 0; i < idx; i += 1) pos += lines[i].length + 1;
  const lineLen = lines[idx]?.length || 0;
  ta.focus();
  if (!els.editorDialog?.open && typeof els.editorDialog?.showModal === "function") {
    els.editorDialog.showModal();
  }
  ta.setSelectionRange(pos, pos + lineLen);
  const style = window.getComputedStyle(ta);
  const lineHeight = Number.parseFloat(style.lineHeight) || 18;
  ta.scrollTop = Math.max(0, idx * lineHeight - ta.clientHeight / 3);
  syncEditorLintMirrorScroll();
}

function populateDwmlLintDialog(lint) {
  const errors = lint?.errors || [];
  const warnings = lint?.warnings || [];
  const total = errors.length + warnings.length;
  if (els.dwmlLintSummary) {
    if (errors.length > 0) {
      els.dwmlLintSummary.textContent =
        LOCALE === "en"
          ? `Cannot apply (${errors.length} error(s), ${warnings.length} warning(s)).`
          : `反映できません（エラー ${errors.length}・警告 ${warnings.length}）。`;
    } else {
      els.dwmlLintSummary.textContent =
        LOCALE === "en"
          ? `${warnings.length} warning(s). You may apply anyway.`
          : `警告が ${warnings.length} 件あります。このまま反映できます。`;
    }
  }
  if (els.dwmlLintList) {
    const items = [...errors, ...warnings].slice(0, 40);
    els.dwmlLintList.innerHTML = items
      .map((item) => {
        const kind =
          item.severity === "error"
            ? LOCALE === "en"
              ? "Error"
              : "エラー"
            : LOCALE === "en"
              ? "Warn"
              : "警告";
        const kindClass =
          item.severity === "error" ? "lint-kind-error" : "lint-kind-warning";
        return `<li><span class="${kindClass}">${kind} ${item.line}:</span> ${escapeHtml(item.message)}</li>`;
      })
      .join("");
    if (total > items.length) {
      els.dwmlLintList.innerHTML += `<li>… ${total - items.length} more</li>`;
    }
  }
  const firstLine = errors[0]?.line || warnings[0]?.line || 0;
  els.dwmlLintJumpBtn?.classList.toggle("hidden", !firstLine);
  els.dwmlLintProceedBtn?.classList.toggle("hidden", errors.length > 0);
}

const dwmlLintDialogState = {
  pending: null,
};

function finishDwmlLintDialog(action) {
  const pending = dwmlLintDialogState.pending;
  if (!pending) return;
  dwmlLintDialogState.pending = null;
  els.dwmlLintDialog?.close();
  pending.resolve(action);
}

function showDwmlLintDialog(lint) {
  return new Promise((resolve) => {
    const dialog = els.dwmlLintDialog;
    if (!dialog) {
      resolve(lint.errors.length > 0 ? "cancel" : "proceed");
      return;
    }
    dwmlLintDialogState.pending = { lint, resolve };
    populateDwmlLintDialog(lint);
    if (typeof dialog.showModal === "function") dialog.showModal();
    else finishDwmlLintDialog(lint.errors.length > 0 ? "cancel" : "proceed");
  });
}

function bindDwmlLintDialog() {
  const dialog = els.dwmlLintDialog;
  if (!dialog) return;
  els.dwmlLintJumpBtn?.addEventListener("click", () => {
    const lint = dwmlLintDialogState.pending?.lint;
    const line = lint?.errors?.[0]?.line || lint?.warnings?.[0]?.line;
    if (line) focusEditorLine(line);
    finishDwmlLintDialog("jump");
  });
  els.dwmlLintProceedBtn?.addEventListener("click", () => finishDwmlLintDialog("proceed"));
  els.dwmlLintCloseBtn?.addEventListener("click", () => finishDwmlLintDialog("cancel"));
  bindDialogBackdropCancel(dialog, () => finishDwmlLintDialog("cancel"));
}

async function confirmFlatplanTextWithLint(text, options = {}) {
  const normalized = normalizeDwmlFromClipboard(text) || stripGptCitationArtifacts(String(text ?? "").trim());
  const lint = lintDwml(normalized);
  if (lint.errors.length === 0 && lint.warnings.length === 0) {
    clearEditorLintMirror();
    return { ok: true, text: normalized, lint };
  }
  if (options.showEditorMirror !== false && els.editorText) {
    renderEditorLintMirror(lint);
  }
  const action = await showDwmlLintDialog(lint);
  if (action === "proceed" && lint.errors.length === 0) {
    clearEditorLintMirror();
    return { ok: true, text: normalized, lint };
  }
  return { ok: false, text: normalized, lint, action };
}

function commitFlatplanText(text) {
  loadFromText(text);
  els.editorText.value = text;
  state.editorSnapshotText = text;
  state.rawText = text;
  state.textDirty = false;
  try {
    localStorage.setItem(LOCAL_KEY, text);
  } catch (_e) {
  }
  clearEditorAssist();
  refreshEditorAssist(els.editorText);
  clearEditorLintMirror();
}

const DWML_FORMAT_CHILD_CANONS = new Set([
  "trim-size",
  "opening",
  "pages",
  "planned",
  "start-page",
  "body-folio-start",
]);

const DWML_TOP_META_CANONS = new Set([
  "filename",
  "title",
  "planned",
  "version",
  "writer",
  "share-id",
  "sync-endpoint",
  "circulation",
  "distribution-event",
  "staff-line",
  "submission-date",
  "print-shop",
  "article-list-widths",
  "revision-log",
]);

const DWML_COVER_CHILD_CANONS = new Set(["hyoshi", "cover", "obi", "appendix"]);

/** 行頭スペースのみのインデントをタブに（GPT がスペース2個で階層を出す場合） */
function normalizeLeadingSpaceIndent(line) {
  const m = String(line ?? "").match(/^([ \t]*)(\/\/.*)$/);
  if (!m) return line;
  const indent = m[1];
  const body = m[2];
  if (!indent.includes(" ")) return line;
  let levels = 0;
  let spaceRun = 0;
  for (const ch of indent) {
    if (ch === "\t") {
      levels += 1;
      spaceRun = 0;
    } else if (ch === " ") {
      spaceRun += 1;
      if (spaceRun >= 2) {
        levels += 1;
        spaceRun = 0;
      }
    }
  }
  return `${"\t".repeat(levels)}${body}`;
}

function rebuildDirectiveLine(tokens) {
  return `//${tokens.join("\t")}`;
}

/** GPT 出力のブロック見出し・大中小・体裁/台の子行の行頭タブを正規化 */
function normalizeDwmlStructureIndent(text) {
  let block = "";
  const lines = String(text ?? "").split(/\r?\n/);

  for (let i = 0; i < lines.length; i += 1) {
    let line = normalizeLeadingSpaceIndent(lines[i]);
    const trimmed = line.trimStart();
    if (!trimmed.startsWith("//")) {
      lines[i] = line;
      continue;
    }

    const tokens = parseDirectiveTokensFromRawLine(trimmed);
    if (tokens.length === 0) {
      lines[i] = line;
      continue;
    }

    const headRaw = String(tokens[0] || "");
    if (DWML_SECTION_HEADERS.has(headRaw)) {
      block = `//${headRaw}`;
      lines[i] = block;
      continue;
    }

    const levelCanon = LEVELS[headRaw] || LEVELS[String(headRaw).toLowerCase()];
    if (levelCanon) {
      const indent =
        block === "//目次計画" || block === "//toc-plan"
          ? levelIndentInTocPlan(levelCanon)
          : levelIndent(levelCanon);
      lines[i] = `${indent}${rebuildDirectiveLine(tokens)}`;
      continue;
    }

    const headCanon = canonHead(headRaw);
    if (DWML_TOP_META_CANONS.has(headCanon) || headCanon === "revision-log") {
      block = "";
      lines[i] = rebuildDirectiveLine(tokens);
      continue;
    }

    if (block === "//体裁" || block === "//format") {
      if (DWML_FORMAT_CHILD_CANONS.has(headCanon)) {
        lines[i] = `\t${rebuildDirectiveLine(tokens)}`;
        continue;
      }
    }
    if (block === "//台構成" || block === "//boards") {
      if (headCanon === "board" || headRaw.startsWith("*")) {
        lines[i] = `\t${rebuildDirectiveLine(tokens)}`;
        continue;
      }
    }
    if (block === "//目次計画" || block === "//toc-plan") {
      if (headCanon === "toc-article-fields" || headCanon === "article-fields") {
        lines[i] = `\t${rebuildDirectiveLine(tokens)}`;
        continue;
      }
      if (headRaw.startsWith("*")) {
        lines[i] = `\t${rebuildDirectiveLine(tokens)}`;
        continue;
      }
    }
    if (block === "//表紙まわり" || block === "//cover-block") {
      if (headRaw.startsWith("*") || DWML_COVER_CHILD_CANONS.has(headCanon)) {
        lines[i] = `\t${rebuildDirectiveLine(tokens)}`;
        continue;
      }
    }

    lines[i] = rebuildDirectiveLine(tokens);
  }

  return lines.join("\n");
}

/** ChatGPT の引用メタデータ（:contentReference[oaicite:…] 等）を除去 */
function stripGptCitationArtifacts(text) {
  const citeInline =
    /:contentReference\[[^\]]*\]\{[^}]*\}|\[oaicite:\d+\]|【\d+(?::\d+)?†[^\]]+】/gi;
  const dropCommentLine = /^\/\/\*\s*(入力参照|Input\s+reference)\s*$/i;

  return String(text ?? "")
    .split(/\r?\n/)
    .map((line) => line.replace(citeInline, "").trimEnd())
    .filter((line) => {
      const t = line.trim();
      if (!t) return true;
      if (dropCommentLine.test(t)) return false;
      return true;
    })
    .join("\n");
}

function normalizeDwmlFromClipboard(raw) {
  let text = stripGptCitationArtifacts(String(raw ?? "").trim());
  if (!text) return "";
  const fence = text.match(/```(?:[\w-]+)?\s*([\s\S]*?)```/);
  if (fence?.[1]) text = stripGptCitationArtifacts(fence[1].trim());
  const lines = text.split(/\r?\n/);
  const startIdx = lines.findIndex((line) => /^\s*\/\//.test(line));
  if (startIdx > 0) text = lines.slice(startIdx).join("\n");
  return normalizeDwmlStructureIndent(stripGptCitationArtifacts(text)).trim();
}

function validateDwmlImportText(text) {
  const trimmed = String(text || "").trim();
  if (!trimmed) {
    return {
      ok: false,
      message: LOCALE === "en" ? "Text is empty." : "テキストが空です。",
    };
  }
  const lint = lintDwml(trimmed);
  if (lint.errors.length > 0) {
    const first = lint.errors[0];
    return {
      ok: false,
      message:
        LOCALE === "en"
          ? `Line ${first.line}: ${first.message}`
          : `${first.line}行目: ${first.message}`,
      lint,
    };
  }
  const parsed = parseText(trimmed);
  const hasBody =
    (parsed.entries?.length || 0) > 0
    || (parsed.addonEntries?.length || 0) > 0
    || Boolean(String(parsed.meta?.title || "").trim())
    || Boolean(String(parsed.meta?.filename || "").trim());
  if (!hasBody) {
    return {
      ok: false,
      message: LOCALE === "en"
        ? "Could not find articles or book meta in the text."
        : "記事または書名などのメタ情報が読み取れません。",
      lint,
    };
  }
  return { ok: true, parsed, lint };
}

function refreshAiDraftUrlField() {
  if (!els.aiDraftGptUrl) return;
  const url = resolveCustomGptUrl();
  els.aiDraftGptUrl.value = url;
  const locked = isCustomGptUrlLockedBySession();
  els.aiDraftGptUrl.readOnly = locked;
  els.aiDraftSaveUrlBtn?.classList.toggle("hidden", locked);
  if (!url) {
    els.aiDraftGptUrl.placeholder =
      LOCALE === "en"
        ? "English dedicated GPT URL (MottoAutoDaiwarer EN)"
        : "https://chatgpt.com/g/g-xxxxxxxx";
  }
}

/** 毎回新しいタブで開く（既存タブの会話を再利用しない） */
function buildDedicatedGptLaunchUrl(baseUrl) {
  const stamp = String(Date.now());
  try {
    const u = new URL(baseUrl);
    u.searchParams.set("autodaiwarer", stamp);
    return u.toString();
  } catch {
    const sep = String(baseUrl).includes("?") ? "&" : "?";
    return `${baseUrl}${sep}autodaiwarer=${stamp}`;
  }
}

function openAiDraftDialog() {
  const dialog = els.aiDraftDialog;
  if (!dialog) return;
  loadAiDraftMemoFromStorage();
  loadAiDraftIncludeFlatplanPreference();
  refreshAiDraftMemoPlaceholder();
  refreshAiDraftUrlField();
  if (els.aiDraftImportPreview && !els.aiDraftImportPreview.value.trim()) {
    els.aiDraftImportPreview.value = "";
  }
  if (typeof dialog.showModal === "function") dialog.showModal();
}

function closeAiDraftDialog() {
  persistAiDraftMemo();
  const dialog = els.aiDraftDialog;
  if (dialog?.open) dialog.close();
}

function saveAiDraftGptUrlFromDialog() {
  const raw = String(els.aiDraftGptUrl?.value ?? "").trim();
  if (!isValidCustomGptUrl(raw)) {
    window.alert(
      LOCALE === "en"
        ? "Enter a valid dedicated GPT URL (https://chatgpt.com/g/...)."
        : "専用GPTのURL（https://chatgpt.com/g/...）を入力してください。",
    );
    return;
  }
  try {
    migrateCustomGptUrlStorage();
    localStorage.setItem(customGptUrlStorageKey(), raw);
    window.alert(LOCALE === "en" ? "URL saved." : "URL を保存しました。");
  } catch {
    window.alert(LOCALE === "en" ? "Could not save URL." : "URL を保存できませんでした。");
  }
}

async function launchCustomGptWithMemo() {
  persistAiDraftMemo();
  const url = resolveCustomGptUrl();
  if (!url) {
    window.alert(
      LOCALE === "en"
        ? "Set a dedicated GPT URL first (see CUSTOM_GPT_SETUP.md)."
        : "先に専用GPTのURLを設定してください（CUSTOM_GPT_SETUP.md 参照）。",
    );
    els.aiDraftGptUrl?.focus();
    return;
  }
  const bundle = buildAiDraftClipboardBundle();
  try {
    await navigator.clipboard.writeText(bundle);
  } catch {
    window.alert(
      LOCALE === "en"
        ? "Could not copy to clipboard. Allow clipboard access and try again."
        : "クリップボードにコピーできませんでした。ブラウザの許可を確認してください。",
    );
    return;
  }
  if (els.aiDraftImportPreview) els.aiDraftImportPreview.value = "";
  const launchUrl = buildDedicatedGptLaunchUrl(url);
  window.open(launchUrl, `autodaiwarer-gpt-${Date.now()}`, "noopener,noreferrer");
}

async function applyAiDraftImport() {
  const raw = String(els.aiDraftImportPreview?.value ?? "");
  const normalized = normalizeDwmlFromClipboard(raw);
  if (els.aiDraftImportPreview && normalized !== raw) {
    els.aiDraftImportPreview.value = normalized;
  }
  if (!normalized.trim()) {
    window.alert(
      LOCALE === "en"
        ? "The paste area is empty. Paste GPT output first."
        : "貼り込み欄が空です。GPTの出力を貼り付けてください。",
    );
    return;
  }
  const gate = await confirmFlatplanTextWithLint(normalized, { showEditorMirror: false });
  if (!gate.ok) {
    if (els.editorText) {
      els.editorText.value = normalized;
      state.editorSnapshotText = normalized;
      if (gate.lint?.errors?.length || gate.lint?.warnings?.length) {
        renderEditorLintMirror(gate.lint);
      }
      if (gate.action === "jump") {
        const line = gate.lint?.errors?.[0]?.line || gate.lint?.warnings?.[0]?.line;
        if (line) focusEditorLine(line);
      }
      els.editorDialog?.showModal();
    }
    return;
  }
  const ok = window.confirm(
    LOCALE === "en"
      ? "Replace the current flatplan with this text?"
      : "現在の台割をこのテキストで置き換えます。よろしいですか？",
  );
  if (!ok) return;
  try {
    commitFlatplanText(normalized);
  } catch (error) {
    console.error(error);
    window.alert(
      LOCALE === "en" ? "Could not apply the flatplan." : "台割を反映できませんでした。",
    );
    return;
  }
  closeAiDraftDialog();
  window.alert(LOCALE === "en" ? "Flatplan applied." : "台割を反映しました。");
}

function formatImpositionFolioFootLabel(folio) {
  const text = String(folio ?? "").trim();
  if (!text) return "-";
  return /^\d+(?:\.\d+)?$/.test(text) ? `P${text}` : text;
}

function evalPageExpr(raw) {
  if (!raw) return 0;
  const normalized = raw.replaceAll("✕", "*").replaceAll("×", "*");
  if (!/^[\d*+\-()/.\s]+$/.test(normalized)) {
    const parsed = Number.parseFloat(raw);
    return Number.isFinite(parsed) ? pagesToUnits(parsed) : 0;
  }
  try {
    const value = Function(`"use strict";return (${normalized});`)();
    return Number.isFinite(value) ? pagesToUnits(value) : 0;
  } catch {
    const parsed = Number.parseFloat(raw);
    return Number.isFinite(parsed) ? pagesToUnits(parsed) : 0;
  }
}

function looksLikePageCountToken(raw) {
  const s = String(raw || "").trim();
  if (!s) return false;
  if (/[\/\\年月日]/.test(s)) return false;
  const normalized = s.replaceAll("✕", "*").replaceAll("×", "*");
  if (/^[\d*+\-()/.\s]+$/.test(normalized)) return true;
  const parsed = Number.parseFloat(s);
  return Number.isFinite(parsed) && /^-?\d+(?:\.\d+)?$/.test(s);
}

function resolveAddonParseLayout(tokens, headCanon) {
  const spec = ADDON_SPECS[headCanon];
  const defaultPageExpr = String(spec?.pages || 1);
  const first = String(tokens[1] || "").trim();
  if (!first) {
    return { pageExpr: defaultPageExpr, fieldStartIdx: 2 };
  }
  if (looksLikePageCountToken(first)) {
    return { pageExpr: first, fieldStartIdx: 2 };
  }
  return { pageExpr: defaultPageExpr, fieldStartIdx: 1 };
}

function recalcHierarchyPageCounts(text) {
  const lines = String(text || "").split(/\r?\n/);
  const levelRows = [];
  const middleSumByRow = new Map();
  const middleSmallCountByRow = new Map();
  const middleEffectiveByRow = new Map();
  const largeMiddleRows = new Map();
  let currentLargeRow = -1;
  let currentMiddleRow = -1;

  for (let i = 0; i < lines.length; i += 1) {
    const raw = lines[i];
    const trimmed = raw.trimStart();
    if (!trimmed.startsWith("//")) continue;
    const indent = raw.slice(0, raw.length - trimmed.length);
    const tokens = parseDirectiveTokensFromRawLine(trimmed);
    if (tokens.length === 0) continue;
    const level = canonHead(tokens[0]);
    if (level !== "large" && level !== "middle" && level !== "small") continue;

    const rowIdx = levelRows.length;
    levelRows.push({ lineIdx: i, indent: levelIndent(level), tokens: [...tokens], level });

    if (level === "large") {
      currentLargeRow = rowIdx;
      currentMiddleRow = -1;
      largeMiddleRows.set(rowIdx, []);
      continue;
    }
    if (level === "middle") {
      currentMiddleRow = rowIdx;
      middleSumByRow.set(rowIdx, 0);
      middleSmallCountByRow.set(rowIdx, 0);
      middleEffectiveByRow.set(rowIdx, evalPageExpr(tokens[1] || "0"));
      if (currentLargeRow >= 0) {
        if (!largeMiddleRows.has(currentLargeRow)) largeMiddleRows.set(currentLargeRow, []);
        largeMiddleRows.get(currentLargeRow).push(rowIdx);
      }
      continue;
    }
    if (currentMiddleRow >= 0) {
      const pageExpr = levelRows[rowIdx].tokens[1] || "0";
      const current = middleSumByRow.get(currentMiddleRow) || 0;
      middleSumByRow.set(currentMiddleRow, current + evalPageExpr(pageExpr));
      const count = middleSmallCountByRow.get(currentMiddleRow) || 0;
      middleSmallCountByRow.set(currentMiddleRow, count + 1);
    }
  }

  const largeSumByRow = new Map();
  for (const middleRow of middleSmallCountByRow.keys()) {
    const smallCount = middleSmallCountByRow.get(middleRow) || 0;
    if (smallCount > 0) {
      middleEffectiveByRow.set(middleRow, middleSumByRow.get(middleRow) || 0);
    }
  }
  for (const [largeRow, middleRows] of largeMiddleRows.entries()) {
    const total = (middleRows || []).reduce((sum, middleRow) => sum + (middleEffectiveByRow.get(middleRow) || 0), 0);
    largeSumByRow.set(largeRow, total);
  }

  for (let i = 0; i < levelRows.length; i += 1) {
    const row = levelRows[i];
    if (row.level === "middle") {
      const smallCount = middleSmallCountByRow.get(i) || 0;
      if (smallCount > 0) {
        row.tokens[1] = formatPagesValue(middleSumByRow.get(i) || 0);
      }
      lines[row.lineIdx] = `${levelIndent("middle")}//${row.tokens.join("\t")}`;
    } else if (row.level === "large") {
      const middleCount = (largeMiddleRows.get(i) || []).length;
      if (middleCount > 0) {
        row.tokens[1] = formatPagesValue(largeSumByRow.get(i) || 0);
      }
      lines[row.lineIdx] = `//${row.tokens.join("\t")}`;
    } else if (row.level === "small") {
      lines[row.lineIdx] = `${levelIndent("small")}//${row.tokens.join("\t")}`;
    }
  }

  return lines.join("\n");
}

function splitPeople(raw) {
  if (!raw || raw === "-") return [];
  return raw.split("|").map((x) => x.trim()).filter(Boolean);
}

function parseBoardFormatParts(formatStr) {
  const raw = String(formatStr || "").trim();
  if (!raw) return ["4C"];
  const compact = raw.replace(/\s+/g, "").toUpperCase();
  const double = compact.match(/^(\d+C)(\d+C)$/);
  if (double) return [double[1], double[2]];
  const one = compact.match(/^(\d+C)$/);
  if (one) return [one[1]];
  const loose = compact.match(/^(\d+C)/);
  if (loose) return [loose[1]];
  return ["4C"];
}

/** 台行の色数トークン（4C / 4C1C など）を正規化。空なら "" */
function normalizeBoardFormat(token) {
  const s = String(token || "").trim().replace(/\s+/g, "");
  if (!s) return "";
  // ページ数だけのトークンを版型と誤認しない（//台 1 8 → 8ページ。従来は "8" が 4C 扱いになっていた）
  if (/^\d+$/.test(s)) return "";
  const parts = parseBoardFormatParts(s);
  if (parts.length >= 2) return `${parts[0]}${parts[1]}`;
  return parts[0] || "";
}

function formatBoardLabelPlain(format) {
  const parts = parseBoardFormatParts(format);
  if (parts.length >= 2) return `${parts[0]}/${parts[1]}`;
  return parts[0] || "4C";
}

function flattenImpositionSeqSet(grid) {
  const out = new Set();
  for (const row of grid || []) {
    for (const cell of row || []) {
      if (Number.isFinite(cell)) out.add(cell);
    }
  }
  return out;
}

function isSigPageOnFrontSide(sigPage1Based, opening, pagesInBoard) {
  const { frontMap, backMap } = resolveImpositionMapsForBoard(pagesInBoard, opening);
  const front = flattenImpositionSeqSet(frontMap);
  const back = flattenImpositionSeqSet(backMap);
  if (front.has(sigPage1Based)) return true;
  if (back.has(sigPage1Based)) return false;
  return ((sigPage1Based - 1) % 2) === 0;
}

function colorPartToPrintClass(part) {
  const m = String(part || "").match(/^(\d+)C$/i);
  const n = m ? Number.parseInt(m[1], 10) : 4;
  if (!Number.isFinite(n) || n <= 1) return "band-print-1c";
  if (n === 2) return "band-print-2c";
  if (n === 3) return "band-print-3c";
  return "band-print-4c";
}

function getPrintBandClassForBoardSlot(format, sourceIdx, dataPagesPerBoard, opening) {
  const parts = parseBoardFormatParts(format);
  const onFront = isSigPageOnFrontSide(sourceIdx + 1, opening, dataPagesPerBoard);
  const part = parts.length >= 2 ? parts[onFront ? 0 : 1] : parts[0];
  return colorPartToPrintClass(part);
}

function parseBoardDirective(tokens) {
  const boardNo = Math.max(1, Number.parseInt(tokens[1], 10) || 0);
  if (!boardNo) return null;
  let format = "";
  let pages = 0;
  let hasFormat = false;
  let hasPages = false;
  for (let i = 2; i < tokens.length; i += 1) {
    const token = tokens[i];
    if (!hasFormat) {
      const mergedSingle = normalizeBoardFormat(token);
      if (
        mergedSingle
        && parseBoardFormatParts(mergedSingle).length === 1
        && i + 1 < tokens.length
      ) {
        const nextTok = tokens[i + 1];
        const second = normalizeBoardFormat(nextTok);
        if (second && parseBoardFormatParts(second).length === 1) {
          format = `${mergedSingle}${second}`;
          hasFormat = true;
          i += 1;
          continue;
        }
      }
      const normalizedFormat = normalizeBoardFormat(token);
      if (normalizedFormat) {
        format = normalizedFormat;
        hasFormat = true;
        continue;
      }
    }
    if (!hasPages && /^\d+$/.test(token)) {
      const parsedPages = Number.parseInt(token, 10);
      if (parsedPages > 0) {
        pages = parsedPages;
        hasPages = true;
      }
    }
  }
  return {
    boardNo,
    format: hasFormat ? format : "",
    pages: hasPages ? pages : 0,
    hasFormat,
    hasPages,
  };
}

function buildBoardSpecs(totalPages, directives) {
  const sorted = [...directives]
    .filter((x) => x && Number.isFinite(x.boardNo) && x.boardNo >= 1)
    .sort((a, b) => a.boardNo - b.boardNo);
  const grouped = new Map();
  for (const item of sorted) {
    if (!grouped.has(item.boardNo)) grouped.set(item.boardNo, []);
    grouped.get(item.boardNo).push(item);
  }
  const specs = [];
  const maxBoards = Math.max(1, totalPages * 2 + 10);
  let boardNo = 1;
  let consumed = 0;
  let currentFormat = "4C";
  let currentPages = 16;
  while (consumed < totalPages && boardNo <= maxBoards) {
    const boardRules = grouped.get(boardNo) || [];
    for (const rule of boardRules) {
      if (rule.hasFormat) currentFormat = rule.format;
      if (rule.hasPages && rule.pages > 0) currentPages = rule.pages;
    }
    specs.push({
      boardNo,
      format: currentFormat,
      pages: currentPages,
      start: consumed,
    });
    consumed += currentPages;
    boardNo += 1;
  }
  return specs;
}

function parseText(text) {
  const lines = text.split(/\r?\n/);
  const meta = {
    filename: "daiwari",
    title: "",
    trimSize: "A4縦",
    opening: "left",
    pages: 0,
    pagesExpr: "0",
    planned: "",
    version: "",
    writer: "",
    startPage: 1,
    bodyFolioStart: 1,
    articleFieldLabels: getDefaultArticleFieldLabels(),
    tocArticleFieldLabels: null,
    articleListColumnWidths: [],
    revisionLogLines: [],
    printShop: "",
    circulationLabel: "",
    circulationMemo: "",
    distName: "",
    distDate: "",
    distMemo: "",
    staffLine: "",
    submissionDate: "",
    submissionMemo: "",
    impositionPrint8Up: normalizeImpositionPrintLayout({}),
    impositionPrint16Up: normalizeImpositionPrintLayout({}),
    shareId: "",
    syncEndpoint: "",
  };
  const entries = [];
  const holdEntries = [];
  const addonEntries = [];
  const betchoes = [];
  const boardDirectives = [];
  const commentLines = [];
  const holdLines = [];

  let lastStructuralEntry = null;
  let sourceOrder = 0;

  for (const lineRaw of lines) {
    const line = lineRaw.trimStart();
    if (!line.startsWith("//")) continue;
    const tokens = parseDirectiveTokensFromRawLine(line);
    if (tokens.length === 0) continue;

    if (tokens.length === 1) {
      const only = tokens[0];
      const lr = LOCALE === "en" ? /^changelog(\s|$)/i : /^更新履歴(\s|$)/;
      const ln = LOCALE === "en" ? /^note(\s|$)/i : /^コメント(\s|$)/;
      if (lr.test(only)) {
        meta.revisionLogLines.push(lineRaw.trimEnd());
        continue;
      }
      if (ln.test(only)) {
        if (lastStructuralEntry) {
          lastStructuralEntry.attachedInlineNotes = lastStructuralEntry.attachedInlineNotes || [];
          lastStructuralEntry.attachedInlineNotes.push(lineRaw.trimEnd());
        }
        continue;
      }
    }

    const headCanon = canonHead(tokens[0]);
    if (headCanon === "revision-log") {
      meta.revisionLogLines.push(lineRaw.trimEnd());
      continue;
    }
    if (headCanon === "inline-note") {
      if (lastStructuralEntry) {
        lastStructuralEntry.attachedInlineNotes = lastStructuralEntry.attachedInlineNotes || [];
        lastStructuralEntry.attachedInlineNotes.push(lineRaw.trimEnd());
      }
      continue;
    }
    if (headCanon === "hold") {
      // `//hold` / `//保留` は文書中のどこにあっても許可し、
      // その行だけを保留として解釈する（通常記事の解析は継続）。
      const holdEntry = parseHoldEntryLine(lineRaw, meta.articleFieldLabels);
      if (holdEntry) {
        holdEntry.sourceOrder = sourceOrder;
        sourceOrder += 1;
        holdEntries.push(holdEntry);
        lastStructuralEntry = holdEntry;
      }
      else holdLines.push(lineRaw);
      continue;
    }
    if (ADDON_SPECS[headCanon]) {
      const addonEntry = parseAddonEntryTokens(tokens, headCanon, meta);
      if (addonEntry) {
        addonEntry.sourceOrder = sourceOrder;
        sourceOrder += 1;
        addonEntries.push(addonEntry);
        lastStructuralEntry = addonEntry;
      }
      continue;
    }
    if (headCanon === "share-id") meta.shareId = tokens.slice(1).join("\t").trim();
    else if (headCanon === "sync-endpoint") meta.syncEndpoint = tokens.slice(1).join("\t").trim();
    else if (headCanon === "filename") meta.filename = tokens.slice(1).join("\t");
    else if (headCanon === "title") meta.title = tokens.slice(1).join("\t");
    else if (headCanon === "trim-size") meta.trimSize = tokens.slice(1).join("\t");
    else if (headCanon === "opening") {
      const openingToken = String(tokens[1] || "").toLowerCase();
      meta.opening = openingToken === "右" || openingToken === "right" ? "right" : "left";
    }
    else if (headCanon === "board") {
      const directive = parseBoardDirective(tokens);
      if (directive) boardDirectives.push(directive);
    }
    else if (headCanon === "pages") {
      const pageExpr = tokens.slice(1).join("\t").trim() || "0";
      meta.pagesExpr = pageExpr;
      meta.pages = evalPageExpr(pageExpr);
    }
    else if (headCanon === "planned") meta.planned = tokens[1] || "";
    else if (headCanon === "version") meta.version = tokens[1] || "";
    else if (headCanon === "writer") meta.writer = tokens.slice(1).join("\t");
    else if (headCanon === "start-page") meta.startPage = Number.parseInt(tokens[1], 10) || 1;
    else if (headCanon === "body-folio-start") meta.bodyFolioStart = Math.max(1, Number.parseInt(tokens[1], 10) || 1);
    else if (headCanon === "article-fields") {
      meta.articleFieldLabels = normalizeArticleFieldLabels(tokens.slice(1));
    }
    else if (headCanon === "toc-article-fields") {
      meta.tocArticleFieldLabels = normalizeArticleFieldLabels(tokens.slice(1));
      if (articleLabelsEqualDefault(meta.articleFieldLabels)) {
        meta.articleFieldLabels = [...meta.tocArticleFieldLabels];
      }
    }
    else if (headCanon === "article-list-widths") {
      meta.articleListColumnWidths = parseArticleListColumnWidths(tokens.slice(1));
    }
    else if (headCanon === "imposition-print") {
      const pack = parseImpositionPrintFileTokens(tokens.slice(1));
      meta.impositionPrint8Up = pack.impositionPrint8Up;
      meta.impositionPrint16Up = pack.impositionPrint16Up;
    }
    else if (headCanon === "print-shop") meta.printShop = tokens.slice(1).join("\t");
    else if (headCanon === "circulation") {
      meta.circulationLabel = tokens[1] || "";
      meta.circulationMemo = tokens.slice(2).join("\t");
    }
    else if (headCanon === "distribution-event") {
      meta.distName = tokens[1] || "";
      meta.distDate = tokens[2] || "";
      meta.distMemo = tokens.slice(3).join("\t");
    }
    else if (headCanon === "staff-line") meta.staffLine = tokens.slice(1).join("\t");
    else if (headCanon === "submission-date") {
      meta.submissionDate = tokens[1] || "";
      meta.submissionMemo = tokens.slice(2).join("\t");
    }
    else if (headCanon === "betcho") {
      const boardTok = tokens[1];
      const parsedBoard = Number.parseInt(String(boardTok ?? "").trim(), 10);
      const boardNo = Number.isFinite(parsedBoard) ? Math.max(0, parsedBoard) : 1;
      const advancePages = Math.max(0, Number.parseInt(tokens[2], 10) || 0);
      const name = tokens[3] || "(別丁)";
      const articleFields = parseArticleFieldPayload(tokens, 4, meta.articleFieldLabels);
      const betchoRow = {
        id: crypto.randomUUID(),
        boardNo,
        advancePages,
        name,
        ...articleFields,
        sourceOrder,
      };
      sourceOrder += 1;
      betchoes.push(betchoRow);
      lastStructuralEntry = betchoRow;
    }
    else if (tokens[0].startsWith("*")) {
      commentLines.push(lineRaw);
    }
    else if (LEVELS[tokens[0]] || LEVELS[String(tokens[0]).toLowerCase()]) {
      const level = LEVELS[tokens[0]] || LEVELS[String(tokens[0]).toLowerCase()];
      const pageExpr = tokens[1] || "0";
      const name = tokens[2] || "(無題)";
      const articleFields = parseArticleFieldPayload(tokens, 3, meta.articleFieldLabels);
      const ent = {
        id: crypto.randomUUID(),
        level,
        pageExpr,
        pages: evalPageExpr(pageExpr),
        name,
        ...articleFields,
        anonymous: name === "(無題)",
        sourceOrder,
      };
      sourceOrder += 1;
      entries.push(ent);
      lastStructuralEntry = ent;
    }
  }
  return { meta, entries, holdEntries, addonEntries, betchoes, boardDirectives, commentLines, holdLines };
}

function parseAddonEntryTokens(tokens, headCanon, meta) {
  const spec = ADDON_SPECS[headCanon];
  if (!spec) return null;
  const { pageExpr, fieldStartIdx } = resolveAddonParseLayout(tokens, headCanon);
  const articleFields = parseArticleFieldPayload(tokens, fieldStartIdx, getMetaAddonFieldLabels(meta));
  return {
    id: crypto.randomUUID(),
    kind: headCanon,
    name: LOCALE === "en" ? spec.labelEn : spec.labelJa,
    pageExpr,
    pages: evalPageExpr(pageExpr),
    ...articleFields,
    anonymous: false,
  };
}

function parseHoldEntryLine(lineRaw, fieldLabels) {
  const line = lineRaw.trimStart();
  if (!line.startsWith("//")) return null;
  const tokens = parseDirectiveTokensFromRawLine(line);
  if (tokens.length < 3) return null;

  let pageExpr = "0";
  let name = "(無題)";
  let articleFields = parseArticleFieldPayload([], 0, fieldLabels);

  const headCanon = canonHead(tokens[0]);
  if (headCanon === "hold") {
    pageExpr = tokens[1] || "0";
    name = tokens[2] || "(無題)";
    articleFields = parseArticleFieldPayload(tokens, 3, fieldLabels);
  } else if (LEVELS[tokens[0]] || LEVELS[String(tokens[0]).toLowerCase()]) {
    // `//保留` 以降で `//大|中|小 ...` 形式が残っていても保留記事として扱う。
    pageExpr = tokens[1] || "0";
    name = tokens[2] || "(無題)";
    articleFields = parseArticleFieldPayload(tokens, 3, fieldLabels);
  } else {
    return null;
  }

  return {
    id: crypto.randomUUID(),
    level: "hold",
    pageExpr,
    pages: evalPageExpr(pageExpr),
    name,
    ...articleFields,
    anonymous: name === "(無題)",
  };
}

function inheritPeople(entries) {
  const last = { large: null, middle: null };
  for (const e of entries) {
    if (e.level === "large") {
      fillInherited(e, null);
      last.large = e;
      last.middle = null;
    } else if (e.level === "middle") {
      fillInherited(e, last.large);
      last.middle = e;
    } else if (e.level === "small") {
      fillInherited(e, last.middle || last.large);
    }
  }
}

function fillInherited(entry, parent) {
  if (!parent) return;
  if (entry.desk.length === 0) entry.desk = [...parent.desk];
  if (entry.editors.length === 0) entry.editors = [...parent.editors];
  if (entry.writers.length === 0) entry.writers = [...parent.writers];
}

function computeLevelBounds(entries) {
  const bounds = new Map();
  const levelStack = {};
  for (const e of entries) {
    if (e.level === "large") {
      levelStack.large = e;
      levelStack.middle = null;
    } else if (e.level === "middle") {
      levelStack.middle = e;
    }
  }

  const largeList = entries.filter((x) => x.level === "large");
  for (const l of largeList) {
    const mids = entries.filter((x) => x.level === "middle" && belongsTo(entries, x, l, "large"));
    const totalMid = mids.reduce((s, x) => s + x.pages, 0);
    bounds.set(l.id, {
      under: totalMid < l.pages,
      over: totalMid > l.pages,
      diff: Math.abs(totalMid - l.pages),
      level: "large",
    });
  }

  const midList = entries.filter((x) => x.level === "middle");
  for (const m of midList) {
    const sm = entries.filter((x) => x.level === "small" && belongsTo(entries, x, m, "middle"));
    const total = sm.reduce((s, x) => s + x.pages, 0);
    bounds.set(m.id, {
      under: total < m.pages,
      over: total > m.pages,
      diff: Math.abs(total - m.pages),
      level: "middle",
    });
  }
  return bounds;
}

function belongsTo(entries, child, parent, parentLevel) {
  const iChild = entries.findIndex((x) => x.id === child.id);
  const iParent = entries.findIndex((x) => x.id === parent.id);
  if (iParent < 0 || iChild < 0 || iChild <= iParent) return false;
  for (let i = iParent + 1; i < iChild; i += 1) {
    if (entries[i].level === parentLevel) return false;
    if (parentLevel === "middle" && entries[i].level === "middle") return false;
  }
  return true;
}

function layout(entries, meta) {
  const tree = buildHierarchy(entries);
  let usedUnits = 0;

  for (const largeNode of tree) {
    for (const middleNode of largeNode.middles) {
      const smallTotal = middleNode.smalls.reduce((s, x) => s + x.pages, 0);
      const hasSmalls = middleNode.smalls.length > 0;
      middleNode.smallTotal = smallTotal;
      middleNode.hasChildren = hasSmalls;
      middleNode.overBy = hasSmalls ? Math.max(0, smallTotal - middleNode.pages) : 0;
      middleNode.underBy = hasSmalls ? Math.max(0, middleNode.pages - smallTotal) : 0;
      middleNode.effective = hasSmalls ? Math.max(middleNode.pages, smallTotal) : middleNode.pages;
      middleNode.parentOffset = 0;
    }
    largeNode.middleTotal = largeNode.middles.reduce((s, x) => s + x.effective, 0);
    const hasMiddles = largeNode.middles.length > 0;
    largeNode.hasChildren = hasMiddles;
    largeNode.overBy = hasMiddles ? Math.max(0, largeNode.middleTotal - largeNode.pages) : 0;
    largeNode.underBy = hasMiddles ? Math.max(0, largeNode.pages - largeNode.middleTotal) : 0;
    largeNode.effective = hasMiddles ? Math.max(largeNode.pages, largeNode.middleTotal) : largeNode.pages;
    largeNode.parentOffset = 0;
    largeNode.start = usedUnits;
    largeNode.parentStart = largeNode.start + largeNode.parentOffset;
    largeNode.end = largeNode.start + largeNode.effective;

    let middleCursor = largeNode.start;
    for (const middleNode of largeNode.middles) {
      middleNode.start = middleCursor;
      middleNode.parentStart = middleNode.start + middleNode.parentOffset;
      middleNode.end = middleNode.start + middleNode.effective;
      let smallCursor = middleNode.start;
      for (const smallNode of middleNode.smalls) {
        smallNode.start = smallCursor;
        smallNode.end = smallNode.start + smallNode.pages;
        smallCursor = smallNode.end;
      }
      middleCursor = middleNode.end;
    }
    usedUnits = largeNode.end;
  }

  // `//ページ数` が指定されていても、記事側があふれた場合は台を増やして表示する。
  const totalUnits = meta.pages > 0 ? Math.max(meta.pages, usedUnits) : usedUnits;
  const totalPages = Math.ceil(totalUnits / PAGE_UNITS);
  const pages = Array.from({ length: totalPages }, (_, i) => ({
    pageNo: meta.startPage + i,
    rows: { large: null, middle: null, small: null },
    labels: { large: [], middle: [], small: [] },
    cont: { large: false, middle: false, small: false },
    bands: {
      large: { over: [], under: [] },
      middle: { over: [], under: [] },
    },
    boundaries: { large: [], middle: [], small: [] },
    ranges: { large: [], middle: [], small: [] },
    edge: {
      large: { start: "", end: "" },
      middle: { start: "", end: "" },
      small: { start: "", end: "" },
    },
  }));

  const levelUnits = {
    large: Array.from({ length: totalUnits }, () => null),
    middle: Array.from({ length: totalUnits }, () => null),
    small: Array.from({ length: totalUnits }, () => null),
  };
  const levelFlags = {
    large: Array.from({ length: totalUnits }, () => ""),
    middle: Array.from({ length: totalUnits }, () => ""),
  };

  const paintLevelRange = (level, start, end, entry) => {
    const s = Math.max(0, Math.floor(start));
    const e = Math.max(s, Math.min(totalUnits, Math.ceil(end)));
    for (let unit = s; unit < e; unit += 1) levelUnits[level][unit] = entry;
  };

  const markFlagRange = (level, start, end, flag) => {
    const s = Math.max(0, Math.floor(start));
    const e = Math.max(s, Math.min(totalUnits, Math.ceil(end)));
    for (let unit = s; unit < e; unit += 1) {
      if (!levelFlags[level][unit] || flag === "over") levelFlags[level][unit] = flag;
    }
  };

  for (const largeNode of tree) {
    paintLevelRange("large", largeNode.parentStart, largeNode.parentStart + largeNode.pages, largeNode);
    if (largeNode.hasChildren && largeNode.overBy > 0) {
      markFlagRange(
        "large",
        largeNode.start + largeNode.pages,
        largeNode.start + largeNode.middleTotal,
        "over",
      );
    } else if (largeNode.hasChildren && largeNode.underBy > 0) {
      markFlagRange(
        "large",
        largeNode.start + largeNode.middleTotal,
        largeNode.start + largeNode.pages,
        "under",
      );
    }

    for (const middleNode of largeNode.middles) {
      paintLevelRange(
        "middle",
        middleNode.parentStart,
        middleNode.parentStart + middleNode.pages,
        middleNode,
      );
      if (middleNode.hasChildren && middleNode.overBy > 0) {
        markFlagRange(
          "middle",
          middleNode.start + middleNode.pages,
          middleNode.start + middleNode.smallTotal,
          "over",
        );
      } else if (middleNode.hasChildren && middleNode.underBy > 0) {
        markFlagRange(
          "middle",
          middleNode.start + middleNode.smallTotal,
          middleNode.start + middleNode.pages,
          "under",
        );
      }
      for (const smallNode of middleNode.smalls) {
        paintLevelRange("small", smallNode.start, smallNode.end, smallNode);
      }
    }
  }

  // 指定ページ数を超えてあふれた区間は、大目次帯をピンク表示にする。
  if (meta.pages > 0 && usedUnits > meta.pages) {
    markFlagRange("large", meta.pages, usedUnits, "over");
  }
  // 指定ページ数まで埋まっていない末尾区間は、大目次帯を水色表示にする。
  if (meta.pages > 0 && usedUnits < meta.pages) {
    markFlagRange("large", usedUnits, meta.pages, "under");
  }

  const collectBoundaries = (unitsInPage) => {
    const result = [];
    for (let i = 1; i < unitsInPage.length; i += 1) {
      const prev = unitsInPage[i - 1]?.id || "";
      const next = unitsInPage[i]?.id || "";
      if (prev === next) continue;
      if (!prev && !next) continue;
      result.push(i / PAGE_UNITS);
    }
    return result;
  };

  const collectLabelStarts = (unitsInPage, globalUnitStart, globalUnits) => {
    const labels = [];
    let prevIdInPage = "";
    for (let i = 0; i < unitsInPage.length; i += 1) {
      const entry = unitsInPage[i];
      const id = entry?.id || "";
      if (!id) {
        prevIdInPage = "";
        continue;
      }
      if (id === prevIdInPage) continue;
      const globalUnitIndex = globalUnitStart + i;
      const prevGlobalId = globalUnitIndex > 0 ? (globalUnits?.[globalUnitIndex - 1]?.id || "") : "";
      labels.push({
        entryId: id,
        text: entry.name,
        anonymous: Boolean(entry.anonymous),
        start: i / PAGE_UNITS,
        isGlobalStart: prevGlobalId !== id,
      });
      prevIdInPage = id;
    }
    return labels;
  };

  const collectRanges = (flagsInPage, targetFlag) => {
    const ranges = [];
    let start = -1;
    for (let i = 0; i < PAGE_UNITS; i += 1) {
      const current = i < flagsInPage.length ? flagsInPage[i] : "";
      if (current === targetFlag) {
        if (start < 0) start = i;
        continue;
      }
      if (start >= 0) {
        ranges.push([start / PAGE_UNITS, i / PAGE_UNITS]);
        start = -1;
      }
    }
    if (start >= 0) ranges.push([start / PAGE_UNITS, 1]);
    return ranges;
  };

  const collectEntryRanges = (unitsInPage) => {
    const ranges = [];
    let start = -1;
    let currentId = "";
    for (let i = 0; i <= PAGE_UNITS; i += 1) {
      const entry = i < unitsInPage.length ? unitsInPage[i] : null;
      const id = entry?.id || "";
      if (id && id === currentId) continue;
      if (currentId && start >= 0) {
        ranges.push({
          entryId: currentId,
          start: start / PAGE_UNITS,
          end: i / PAGE_UNITS,
        });
      }
      currentId = id;
      start = id ? i : -1;
    }
    return ranges;
  };

  const firstEntry = (unitsInPage) => unitsInPage.find((u) => u?.id)?.id || "";
  const lastEntry = (unitsInPage) => {
    for (let i = unitsInPage.length - 1; i >= 0; i -= 1) {
      const id = unitsInPage[i]?.id || "";
      if (id) return id;
    }
    return "";
  };

  for (let pageIdx = 0; pageIdx < pages.length; pageIdx += 1) {
    const unitStart = pageIdx * PAGE_UNITS;
    const unitEnd = Math.min(totalUnits, unitStart + PAGE_UNITS);
    for (const level of ["large", "middle", "small"]) {
      const unitsInPage = levelUnits[level].slice(unitStart, unitEnd);
      const globalUnits = levelUnits[level];
      const startId = firstEntry(unitsInPage);
      const endId = lastEntry(unitsInPage);
      pages[pageIdx].edge[level].start = startId;
      pages[pageIdx].edge[level].end = endId;
      pages[pageIdx].boundaries[level] = collectBoundaries(unitsInPage);
      pages[pageIdx].ranges[level] = collectEntryRanges(unitsInPage);
      pages[pageIdx].labels[level] = collectLabelStarts(unitsInPage, unitStart, globalUnits);
      const firstEntryObj = unitsInPage.find((u) => u?.id);
      if (firstEntryObj) {
        pages[pageIdx].rows[level] = {
          entryId: firstEntryObj.id,
          text: firstEntryObj.name,
          anonymous: firstEntryObj.anonymous,
          level,
          hasChildren: Boolean(firstEntryObj.hasChildren),
        };
      }
    }

    const largeFlags = levelFlags.large.slice(unitStart, unitEnd);
    const middleFlags = levelFlags.middle.slice(unitStart, unitEnd);
    pages[pageIdx].bands.large.over = collectRanges(largeFlags, "over");
    pages[pageIdx].bands.large.under = collectRanges(largeFlags, "under");
    pages[pageIdx].bands.middle.over = collectRanges(middleFlags, "over");
    pages[pageIdx].bands.middle.under = collectRanges(middleFlags, "under");
  }

  for (let i = 0; i < pages.length - 1; i += 1) {
    for (const level of ["large", "middle", "small"]) {
      const here = pages[i].edge[level].end;
      const next = pages[i + 1].edge[level].start;
      if (here && next && here === next) pages[i].cont[level] = true;
    }
  }

  return { pages, usedPages: Math.ceil(usedUnits / PAGE_UNITS), tree };
}

function buildHierarchy(entries) {
  const tree = [];
  const fieldLabels = state.articleFieldLabels?.length ? state.articleFieldLabels : getDefaultArticleFieldLabels();
  const emptyFieldValues = Object.fromEntries(fieldLabels.map((label) => [label, ""]));
  let currentLarge = null;
  let currentMiddle = null;
  let autoMiddle = null;

  for (const entry of entries) {
    if (entry.level === "large") {
      currentLarge = { ...entry, middles: [] };
      currentMiddle = null;
      autoMiddle = null;
      tree.push(currentLarge);
    } else if (entry.level === "middle") {
      if (!currentLarge) continue;
      currentMiddle = { ...entry, smalls: [] };
      currentLarge.middles.push(currentMiddle);
      autoMiddle = null;
    } else if (entry.level === "small") {
      if (!currentLarge) continue;
      if (!currentMiddle) {
        if (!autoMiddle) {
          autoMiddle = {
            // 再レンダリングごとに変わらないIDにして、ホバー詳細の参照を安定させる。
            id: `synthetic-middle-${currentLarge.id}-${currentLarge.middles.length}`,
            level: "middle",
            pageExpr: "0",
            pages: 0,
            name: "",
            desk: [...entry.desk],
            editors: [...entry.editors],
            writers: [...entry.writers],
            deadline: "",
            status: "",
            memo: "",
            fieldValues: { ...emptyFieldValues },
            anonymous: false,
            syntheticAutoMiddle: true,
            smalls: [],
          };
          currentLarge.middles.push(autoMiddle);
        }
        currentMiddle = autoMiddle;
      }
      currentMiddle.smalls.push({ ...entry });
      if (currentMiddle.syntheticAutoMiddle) {
        currentMiddle.pages += Math.max(0, entry.pages || 0);
      }
    }
  }
  return tree;
}

function shrinkText(text, limit) {
  if (text.length <= limit) return text;
  return `${text.slice(0, Math.max(1, limit - 1))}…`;
}

function formatBetchoListPositionLabel(betcho) {
  if (betcho.boardNo === 0) {
    return LOCALE === "en" ? "before first board (0)" : "本の先頭（台0）";
  }
  return LOCALE === "en" ? `after board ${betcho.boardNo}` : `台${betcho.boardNo}の後ろ`;
}

function loadFromText(text) {
  const parsed = parseText(text);
  inheritPeople(parsed.entries);
  state.meta = parsed.meta;
  state.meta.impositionPrint8Up = normalizeImpositionPrintLayout(state.meta.impositionPrint8Up);
  state.meta.impositionPrint16Up = normalizeImpositionPrintLayout(state.meta.impositionPrint16Up);
  state.impositionOptions.pdfScalePercent = getImpositionPrintLayoutForCurrentMode(
    state.meta,
    state.impositionOptions.use8up,
  ).pdfScalePercent;
  state.articleFieldLabels = normalizeArticleFieldLabels(parsed.meta?.articleFieldLabels);
  state.tocArticleFieldLabels = parsed.meta?.tocArticleFieldLabels != null
    ? normalizeArticleFieldLabels(parsed.meta.tocArticleFieldLabels)
    : null;
  state.articleListColumnWidths = normalizeArticleColumnWidths(parsed.meta?.articleListColumnWidths, state.articleFieldLabels);
  state.entries = parsed.entries;
  state.holdEntries = parsed.holdEntries || [];
  state.addonEntries = parsed.addonEntries || [];
  state.betchoes = parsed.betchoes || [];
  state.boardDirectives = parsed.boardDirectives || [];
  state.commentLines = parsed.commentLines || [];
  state.holdLines = parsed.holdLines || [];
  state.rawText = text;
  state.textDirty = false;
  rerender();
}

function rerender() {
  renderMeta();
  renderBoards();
  updateBoardWidthHandlePosition();
}

function renderMeta() {
  const text = buildMetaSummaryText();
  els.metaInfo.textContent = text;
  if (els.printMeta) els.printMeta.textContent = text;
}

function buildMetaSummaryText() {
  const m = state.meta;
  const pagesLabel = formatPagesValue(m.pages);
  const openingLabel = LOCALE === "en"
    ? (m.opening === "right" ? "Right opening" : "Left opening")
    : (m.opening === "right" ? "右開き" : "左開き");
  let base = LOCALE === "en"
    ? `${m.title} | ${pagesLabel} pages | ${openingLabel} | Planned:${m.planned} | Ver:${m.version} | By:${m.writer}`
    : `${m.title} | ${pagesLabel}頁 | ${openingLabel} | 刊行予定:${m.planned} | 台割Ver:${m.version} | 記入:${m.writer}`;
  const trimSizeText = getEffectiveTrimSizeText(m);
  if (trimSizeText) {
    base = LOCALE === "en"
      ? `${m.title} | Trim:${trimSizeText} | ${pagesLabel} pages | ${openingLabel} | Planned:${m.planned} | Ver:${m.version} | By:${m.writer}`
      : `${m.title} | 判型:${trimSizeText} | ${pagesLabel}頁 | ${openingLabel} | 刊行予定:${m.planned} | 台割Ver:${m.version} | 記入:${m.writer}`;
  }
  if (m.submissionDate) {
    const days = daysFromTodayToDate(m.submissionDate);
    if (Number.isFinite(days)) {
      base +=
        LOCALE === "en"
          ? ` | Submission:${m.submissionDate} (${days}d)`
          : ` | 入稿日:${m.submissionDate}（あと${days}日）`;
    }
  }
  if (!remoteSyncState.enabled || !state.syncStatusText) return base;
  return `${base} | ${state.syncStatusText}`;
}

async function initRemoteSync() {
  if (!remoteSyncState.enabled) return;
  updateRemoteSyncStatus(
    LOCALE === "en"
      ? `Sync:${remoteSyncState.shareId} connecting`
      : `同期:${remoteSyncState.shareId} 接続中`,
  );
  const loaded = await pollRemoteLatest({ applyEvenIfSameVersion: true });
  if (!loaded) {
    updateRemoteSyncStatus(
      LOCALE === "en"
        ? `Sync:${remoteSyncState.shareId} waiting`
        : `同期:${remoteSyncState.shareId} 待機`,
    );
  }
  remoteSyncState.savingTimer = window.setInterval(() => {
    void saveRemoteIfChanged();
  }, REMOTE_SAVE_INTERVAL_MS);
  remoteSyncState.pollingTimer = window.setInterval(() => {
    void pollRemoteLatest();
  }, REMOTE_POLL_INTERVAL_MS);
}

function updateRemoteSyncStatus(label) {
  state.syncStatusText = label || "";
  renderMeta();
}

function buildSyncClientId() {
  const key = SHARE_ID
    ? `autodaiwarer.sync.client-id.${normalizeStorageKeyPart(SHARE_ID)}`
    : "autodaiwarer.sync.client-id";
  const saved = localStorage.getItem(key);
  if (saved) return saved;
  const next = `client-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  try {
    localStorage.setItem(key, next);
  } catch (_error) {}
  return next;
}

function hasUnsavedLocalSyncChanges() {
  const localText = getWorkingTextForRemoteSync();
  return localText !== String(remoteSyncState.lastSavedText || "");
}

function isRemoteUpdatedByThisClient(updatedBy) {
  const id = String(remoteSyncState.clientId || "").trim();
  if (!id) return false;
  return String(updatedBy || "")
    .split("|")
    .map((part) => part.trim())
    .includes(id);
}

function alignRemoteSyncStateFromFetch(data, options = {}) {
  if (!data || data.ok === false) return false;
  const remoteText = typeof data.text === "string" ? data.text : "";
  const remoteVersionRaw = Number(data.version || 0);
  const remoteVersion = Number.isFinite(remoteVersionRaw) ? remoteVersionRaw : 0;
  if (remoteVersion > remoteSyncState.knownVersion) {
    remoteSyncState.knownVersion = remoteVersion;
  }
  const localText = getWorkingTextForRemoteSync();
  if (remoteText && remoteText === localText) {
    remoteSyncState.lastSavedText = remoteText;
    if (remoteVersion > remoteSyncState.appliedVersion) {
      remoteSyncState.appliedVersion = remoteVersion;
    }
    return true;
  }
  if (options.updateAppliedVersion && remoteVersion > remoteSyncState.appliedVersion) {
    remoteSyncState.appliedVersion = remoteVersion;
  }
  return false;
}

function buildBugReportClientId() {
  const saved = localStorage.getItem(BUG_REPORT_CLIENT_ID_KEY);
  if (saved) return saved;
  const next = `bug-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  localStorage.setItem(BUG_REPORT_CLIENT_ID_KEY, next);
  return next;
}

function updateEditorSyncNotice() {
  if (!els.editorSyncNotice) return;
  if (!remoteSyncState.enabled) {
    els.editorSyncNotice.classList.add("hidden");
    els.editorSyncNotice.textContent = "";
    return;
  }
  els.editorSyncNotice.classList.remove("hidden");
  els.editorSyncNotice.textContent = LOCALE === "en"
    ? `Share ID "${remoteSyncState.shareId}" is syncing with Google Drive (auto-save / auto-reflect).`
    : `share ID「${remoteSyncState.shareId}」で Google Drive に自動保存・自動反映中です。`;
}

function showRemoteSyncIntroOnce() {
  if (!remoteSyncState.enabled) return;
  const key = `${SYNC_INTRO_SHOWN_KEY_BASE}.${remoteSyncState.shareId}`;
  if (localStorage.getItem(key) === "1") return;
  localStorage.setItem(key, "1");
  window.alert(
    LOCALE === "en"
      ? `This URL uses share ID "${remoteSyncState.shareId}". Auto-save and auto-reflect with Google Drive are enabled.`
      : `このURLは share ID「${remoteSyncState.shareId}」で共有同期モードです。Google Drive への自動保存・自動反映が有効です。`,
  );
}

function getWorkingTextForRemoteSync() {
  if (els.editorDialog?.open) {
    return normalizeEditorDirectiveText(String(els.editorText?.value || ""));
  }
  const source = state.rawText || "";
  return normalizeEditorDirectiveText(source);
}

function buildRemoteSyncUrl() {
  const url = new URL(remoteSyncState.endpoint);
  url.searchParams.set("share", remoteSyncState.shareId);
  return url.toString();
}

async function fetchRemoteSyncJson(method, payload) {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), REMOTE_SYNC_TIMEOUT_MS);
  try {
    const init = {
      method,
      cache: "no-store",
      headers: { Accept: "application/json" },
      signal: controller.signal,
    };
    if (method !== "GET") {
      init.headers["content-type"] = "text/plain;charset=utf-8";
      init.body = JSON.stringify(payload || {});
    }
    const res = await fetch(buildRemoteSyncUrl(), init);
    if (!res.ok) return null;
    return await res.json();
  }
  catch {
    return null;
  }
  finally {
    window.clearTimeout(timeoutId);
  }
}

async function refreshRemoteSyncVersionOnly() {
  if (!remoteSyncState.enabled) return false;
  // 保存失敗直後の版合わせは polling 中でも優先する（ロック待ちだと knownVersion が古いまま残る）。
  if (remoteSyncState.isPolling) {
    const data = await fetchRemoteSyncJson("GET");
    return alignRemoteSyncStateFromFetch(data);
  }
  remoteSyncState.isPolling = true;
  try {
    const data = await fetchRemoteSyncJson("GET");
    return alignRemoteSyncStateFromFetch(data);
  }
  finally {
    remoteSyncState.isPolling = false;
  }
}

async function pollRemoteLatest(options = {}) {
  // 保存中のポーリングは knownVersion だけ先に進み、自端末の保存レースを競合扱いしやすくする。
  if (!remoteSyncState.enabled || remoteSyncState.isPolling || remoteSyncState.isSaving) return false;
  remoteSyncState.isPolling = true;
  try {
    const data = await fetchRemoteSyncJson("GET");
    if (!data || data.ok === false) {
      updateRemoteSyncStatus(
        LOCALE === "en"
          ? `Sync:${remoteSyncState.shareId} disconnected`
          : `同期:${remoteSyncState.shareId} 接続エラー`,
      );
      return false;
    }
    const remoteText = typeof data.text === "string" ? data.text : "";
    const remoteVersionRaw = Number(data.version || 0);
    const remoteVersion = Number.isFinite(remoteVersionRaw) ? remoteVersionRaw : 0;
    if (remoteVersion > remoteSyncState.knownVersion) remoteSyncState.knownVersion = remoteVersion;
    if (!remoteText) {
      updateRemoteSyncStatus(
        LOCALE === "en"
          ? `Sync:${remoteSyncState.shareId} waiting`
          : `同期:${remoteSyncState.shareId} 待機`,
      );
      return false;
    }
    const localText = getWorkingTextForRemoteSync();
    const shouldApply = options.applyEvenIfSameVersion || remoteVersion > remoteSyncState.appliedVersion;
    const hasDiff = remoteText !== localText;
    const canApplyRemote = !hasUnsavedLocalSyncChanges() || Boolean(options.applyEvenIfSameVersion);
    if (hasDiff && shouldApply && canApplyRemote) {
      applyRemoteText(remoteText);
      remoteSyncState.appliedVersion = remoteVersion;
      remoteSyncState.lastSavedText = remoteText;
      notifyRemoteSync(
        LOCALE === "en"
          ? "Remote changes from another session/tab were detected. Latest content has been applied."
          : "別セッション（別タブ・別端末を含む）での更新を検知しました。最新内容を反映しました。",
      );
    } else if (!hasDiff) {
      // 画面上は一致しているのに lastSavedText だけ古い（timeout 後など）状態を解消する。
      remoteSyncState.lastSavedText = remoteText;
      if (remoteVersion > remoteSyncState.appliedVersion) {
        remoteSyncState.appliedVersion = remoteVersion;
      }
    } else if (shouldApply && remoteVersion > remoteSyncState.appliedVersion && !hasUnsavedLocalSyncChanges()) {
      remoteSyncState.appliedVersion = remoteVersion;
    }
    updateRemoteSyncStatus(
      LOCALE === "en"
        ? `Sync:${remoteSyncState.shareId} v${Math.max(remoteSyncState.knownVersion, 0)}`
        : `同期:${remoteSyncState.shareId} v${Math.max(remoteSyncState.knownVersion, 0)}`,
    );
    return hasDiff;
  }
  finally {
    remoteSyncState.isPolling = false;
  }
}

function applyRemoteText(text) {
  const nextText = String(text || "");
  if (!nextText) return;
  try {
    loadFromText(nextText);
    if (els.editorDialog?.open) {
      els.editorText.value = nextText;
      clearEditorAssist();
      refreshEditorAssist(els.editorText);
    }
    localStorage.setItem(LOCAL_KEY, nextText);
  }
  catch (error) {
    console.error(error);
    notifyRemoteSync(
      LOCALE === "en"
        ? "Remote data was invalid and could not be rendered."
        : "同期データの形式に問題があり、画面に反映できませんでした。",
    );
  }
}

function notifyRemoteSync(message) {
  if (!message) return;
  window.alert(message);
}

async function saveRemoteIfChanged(options = {}) {
  if (!remoteSyncState.enabled || remoteSyncState.isSaving) return false;
  const text = getWorkingTextForRemoteSync();
  const prevText = String(remoteSyncState.lastSavedText || "");
  if (text === prevText) return false;
  if (!text.trim()) {
    if (!prevText.trim()) return false;
    if (!remoteSyncState.clearSyncConfirmed) {
      const proceed = window.confirm(
        LOCALE === "en"
          ? "All content is currently empty in share mode. Create a backup and sync this full deletion?"
          : "shareモードで内容が全削除状態です。バックアップを作成してこの全削除を同期しますか？",
      );
      if (!proceed) return false;
      createShareBackup("before-clear-sync", prevText);
      remoteSyncState.clearSyncConfirmed = true;
    }
  } else {
    remoteSyncState.clearSyncConfirmed = false;
  }
  remoteSyncState.isSaving = true;
  let retryAfterOwnRace = false;
  updateRemoteSyncStatus(
    LOCALE === "en"
      ? `Sync:${remoteSyncState.shareId} saving`
      : `同期:${remoteSyncState.shareId} 保存中`,
  );
  try {
    const payload = {
      share: remoteSyncState.shareId,
      text,
      baseVersion: remoteSyncState.knownVersion,
      clientId: remoteSyncState.clientId,
      locale: LOCALE,
    };
    const data = await fetchRemoteSyncJson("POST", payload);
    if (!data || data.ok === false) {
      // timeout/abort でもサーバ側では保存済みのことがある。版だけ合わせて次回の誤競合を防ぐ。
      await refreshRemoteSyncVersionOnly();
      updateRemoteSyncStatus(
        LOCALE === "en"
          ? `Sync:${remoteSyncState.shareId} save failed`
          : `同期:${remoteSyncState.shareId} 保存失敗`,
      );
      return false;
    }
    const nextVersionRaw = Number(data.version || 0);
    if (Number.isFinite(nextVersionRaw) && nextVersionRaw > remoteSyncState.knownVersion) {
      remoteSyncState.knownVersion = nextVersionRaw;
    }
    if (data.conflict) {
      const remoteText = typeof data.text === "string" ? data.text : "";
      const localText = getWorkingTextForRemoteSync();
      if (remoteText && remoteText === text) {
        remoteSyncState.lastSavedText = remoteText;
        if (Number.isFinite(nextVersionRaw) && nextVersionRaw > remoteSyncState.appliedVersion) {
          remoteSyncState.appliedVersion = nextVersionRaw;
        }
        updateRemoteSyncStatus(
          LOCALE === "en"
            ? `Sync:${remoteSyncState.shareId} v${Math.max(remoteSyncState.knownVersion, 0)}`
            : `同期:${remoteSyncState.shareId} v${Math.max(remoteSyncState.knownVersion, 0)}`,
        );
        return true;
      }
      if (localText !== text) {
        updateRemoteSyncStatus(
          LOCALE === "en"
            ? `Sync:${remoteSyncState.shareId} v${Math.max(remoteSyncState.knownVersion, 0)}`
            : `同期:${remoteSyncState.shareId} v${Math.max(remoteSyncState.knownVersion, 0)}`,
        );
        return false;
      }
      // 自クライアントの先行保存（timeout 後の再送など）との版ずれ。
      // リモートで上書きすると編集中の内容が巻き戻るので、版だけ進めてローカルを再保存する。
      if (isRemoteUpdatedByThisClient(data.updatedBy)) {
        updateRemoteSyncStatus(
          LOCALE === "en"
            ? `Sync:${remoteSyncState.shareId} v${Math.max(remoteSyncState.knownVersion, 0)}`
            : `同期:${remoteSyncState.shareId} v${Math.max(remoteSyncState.knownVersion, 0)}`,
        );
        if (!options.retryOfOwnRace) retryAfterOwnRace = true;
        return false;
      }
      notifyRemoteSync(
        LOCALE === "en"
          ? "Conflict detected. Newer remote content has priority and will be applied."
          : "競合を検知しました。新しい側の内容を優先して反映します。",
      );
      if (remoteText.length > 0) {
        applyRemoteText(remoteText);
        remoteSyncState.lastSavedText = remoteText;
        if (Number.isFinite(nextVersionRaw) && nextVersionRaw > remoteSyncState.appliedVersion) {
          remoteSyncState.appliedVersion = nextVersionRaw;
        }
      } else {
        void pollRemoteLatest({ applyEvenIfSameVersion: true });
      }
      return false;
    }
    remoteSyncState.lastSavedText = text;
    if (Number.isFinite(nextVersionRaw) && nextVersionRaw > remoteSyncState.appliedVersion) {
      remoteSyncState.appliedVersion = nextVersionRaw;
    }
    updateRemoteSyncStatus(
      LOCALE === "en"
        ? `Sync:${remoteSyncState.shareId} v${Math.max(remoteSyncState.knownVersion, 0)}`
        : `同期:${remoteSyncState.shareId} v${Math.max(remoteSyncState.knownVersion, 0)}`,
    );
    return true;
  }
  finally {
    remoteSyncState.isSaving = false;
    if (retryAfterOwnRace) {
      window.setTimeout(() => {
        void saveRemoteIfChanged({ retryOfOwnRace: true });
      }, 0);
    }
  }
}

function createBetchoListItem(betcho) {
  const item = document.createElement("div");
  item.className = "betcho-item";
  const content = document.createElement("div");
  content.className = "betcho-content";
  const rowLarge = document.createElement("div");
  rowLarge.className = "betcho-row row-large";
  const betchoHead = document.createElement("div");
  betchoHead.className = "betcho-head";
  betchoHead.textContent = LOCALE === "en" ? "Insert" : "別丁";
  rowLarge.appendChild(betchoHead);
  const rowMiddle = document.createElement("div");
  rowMiddle.className = "betcho-row row-middle";
  const rowSmall = document.createElement("div");
  rowSmall.className = "betcho-row row-small";
  const name = document.createElement("div");
  name.className = "betcho-name";
  name.textContent = shrinkText(betcho.name, 18);
  const advance = document.createElement("div");
  advance.className = "betcho-advance";
  advance.textContent = LOCALE === "en"
    ? `+${betcho.advancePages}p`
    : `+${betcho.advancePages}頁`;
  const statusBand = document.createElement("div");
  statusBand.className = "betcho-row row-status betcho-status-band band-print-1c";
  const st = String(betcho.status || "").trim();
  if (st) {
    const statusText = document.createElement("div");
    statusText.className = "segment seg-status";
    statusText.textContent = shrinkText(st, 12);
    statusBand.appendChild(statusText);
  }
  rowSmall.appendChild(name);
  rowSmall.appendChild(advance);
  content.appendChild(rowLarge);
  content.appendChild(rowMiddle);
  content.appendChild(rowSmall);
  content.appendChild(statusBand);
  item.appendChild(content);
  makeBetchoHoverInteractive(item, betcho.id);
  return item;
}

function renderBetchoZeroStrip(betchoZeroList, isRightOpening, pagesPerBoard) {
  if (!betchoZeroList.length) return;
  const board = document.createElement("article");
  board.className = "board betcho-zero-board";
  const row = document.createElement("div");
  row.className = "board-row betcho-zero-row";
  row.style.setProperty("--board-pages", String(pagesPerBoard));
  if (isRightOpening) row.classList.add("right-opening");

  const betchoList = document.createElement("div");
  betchoList.className = "betcho-list";
  for (const betcho of betchoZeroList) {
    betchoList.appendChild(createBetchoListItem(betcho));
  }

  const connectorHost = document.createElement("div");
  connectorHost.className = "betcho-zero-connector-track";
  const connector = document.createElement("div");
  connector.className = "betcho-zero-connector";
  connector.setAttribute("aria-hidden", "true");
  connectorHost.appendChild(connector);

  const sideSpacer = document.createElement("div");
  sideSpacer.className = "board-side betcho-zero-board-side-spacer";
  sideSpacer.setAttribute("aria-hidden", "true");

  if (isRightOpening) {
    row.appendChild(betchoList);
    row.appendChild(connectorHost);
    row.appendChild(sideSpacer);
  } else {
    row.appendChild(sideSpacer);
    row.appendChild(connectorHost);
    row.appendChild(betchoList);
  }
  board.appendChild(row);
  els.boards.appendChild(board);
}

function renderBoards() {
  els.boards.innerHTML = "";
  const boardDisplayData = buildBoardDisplayData();
  const boardEntries = boardDisplayData.entries;
  const boardHoldEntries = boardDisplayData.holdEntries;
  const boardBetchoes = boardDisplayData.betchoes;
  const boardAddonEntries = boardDisplayData.addonEntries;
  const betchoZeroList = (boardBetchoes || []).filter((b) => b.boardNo === 0);
  const statusTextByEntryId = new Map(
    boardEntries.map((entry) => [entry.id, String(entry.status || "").trim()]),
  );
  const totalBetchoAdvance = (state.betchoes || []).reduce(
    (sum, b) => sum + pagesToUnits(b.advancePages || 0),
    0,
  );
  const layoutMeta = {
    ...state.meta,
    // `//ページ数` は最終ページ数として扱い、別丁の「ページ進み」分は
    // 物理ページ数側から差し引いてレイアウトする。
    pages:
      state.meta.pages > 0
        ? Math.max(1, state.meta.pages - totalBetchoAdvance)
        : state.meta.pages,
  };
  const layoutResult = layout(boardEntries, layoutMeta);
  const pages = layoutResult.pages;
  const usedPages = layoutResult.usedPages;
  const boardSpecs = buildBoardSpecs(pages.length, state.boardDirectives || []);
  const betchoByBoard = groupBetchoByBoard(boardBetchoes);
  const advancePrefixByBoard = buildAdvancePrefixByBoard(boardBetchoes, boardSpecs);
  const isRightOpening = state.meta.opening === "right";
  const visiblePagesPerBoard = 16;
  const firstSpec = boardSpecs[0];
  const zeroStripBoardPages = firstSpec
    ? Math.max(visiblePagesPerBoard, firstSpec.pages)
    : visiblePagesPerBoard;
  renderBetchoZeroStrip(betchoZeroList, isRightOpening, zeroStripBoardPages);
  for (const spec of boardSpecs) {
    const boardNo = spec.boardNo;
    const dataPagesPerBoard = spec.pages;
    const pagesPerBoard = Math.max(visiblePagesPerBoard, dataPagesPerBoard);
    const pageAdvanceBefore = advancePrefixByBoard.get(boardNo) || 0;
    const betchoes = betchoByBoard.get(boardNo) || [];
    const board = document.createElement("article");
    board.className = "board";
    const row = document.createElement("div");
    row.className = "board-row";
    if (betchoes.length > 0) row.classList.add("has-betcho-row");
    if (isRightOpening) row.classList.add("right-opening");
    const side = document.createElement("div");
    side.className = "board-side";
    side.innerHTML = createBoardSideHtml(
      String(boardNo).padStart(2, "0"),
      formatBoardLabel(spec.format),
      { bottomIsHtml: true },
    );

    const track = document.createElement("div");
    track.className = "page-track";
    track.style.gridTemplateColumns = `repeat(${pagesPerBoard}, minmax(0, 1fr))`;
    row.style.setProperty("--board-pages", String(pagesPerBoard));
    const chunk = pages.slice(spec.start, spec.start + dataPagesPerBoard);
    const chunkWithTailPadding = [
      ...chunk,
      ...Array.from({ length: Math.max(0, dataPagesPerBoard - chunk.length) }, () => undefined),
    ];
    const displayPadStart = isRightOpening ? pagesPerBoard - dataPagesPerBoard : 0;
    const displayedSlots = Array.from({ length: pagesPerBoard }, (_, displayIdx) => {
      const dataIdx = displayIdx - displayPadStart;
      if (dataIdx < 0 || dataIdx >= dataPagesPerBoard) {
        return { page: undefined, globalIndex: -1, isPadding: true };
      }
      const sourceIdx = isRightOpening ? dataPagesPerBoard - 1 - dataIdx : dataIdx;
      return {
        page: chunkWithTailPadding[sourceIdx],
        globalIndex: spec.start + sourceIdx,
        isPadding: false,
      };
    });
    const displayedChunk = displayedSlots.map((slot) => slot.page);
    const isContentFilled = (displayIdx) => {
      if (displayIdx < 0 || displayIdx >= pagesPerBoard) return false;
      const slot = displayedSlots[displayIdx];
      return !slot.isPadding && slot.globalIndex < usedPages;
    };

    for (let idx = 0; idx < pagesPerBoard; idx += 1) {
      const slotInfo = displayedSlots[idx];
      const isPaddingSlot = slotInfo.isPadding;
      const page = slotInfo.page;
      const globalPageIndex = slotInfo.globalIndex;
      const isActualEndBoundaryLeft = !isPaddingSlot && !isRightOpening && isContentFilled(idx) && !isContentFilled(idx + 1);
      // 右開きは内容終端(usedPages)ではなく、台の実ページ先頭側(最終ページ左側)のみを強調する。
      const isRightOpeningBoardStartBoundary =
        !isPaddingSlot && isRightOpening && idx === displayPadStart;
      const slot = document.createElement("div");
      slot.className = "page-slot";

      const cell = document.createElement("div");
      cell.className = "page-cell";
      const ruler = createPageRuler(idx, pagesPerBoard, !isPaddingSlot);
      const number = document.createElement("div");
      number.className = "page-number";
      number.textContent = page ? formatFlatplanFolioForPage(globalPageIndex, pageAdvanceBefore) : "";

      if (isPaddingSlot) {
        slot.classList.add("is-blank");
        slot.appendChild(cell);
        slot.appendChild(ruler);
        slot.appendChild(number);
        track.appendChild(slot);
        continue;
      }

      const rows = ["large", "middle", "small"];
      for (const level of rows) {
        const row = document.createElement("div");
        row.className = `cell-row row-${level}`;
        if (idx === 0) row.classList.add("left-thick");
        if (idx === pagesPerBoard - 1) row.classList.add("sep-thick");
        if (isActualEndBoundaryLeft) row.classList.add("sep-thick");
        if (isRightOpeningBoardStartBoundary) row.classList.add("left-thick");

        if (level === "large") {
          row.classList.add(getLargeSeparatorClass(displayedChunk, idx, pagesPerBoard));
        } else {
          row.classList.add(getSpreadSeparatorClass(idx, pagesPerBoard));
        }

        const largeBands = page?.bands?.large || { over: [], under: [] };
        const middleBands = page?.bands?.middle || { over: [], under: [] };
        if (level === "large") {
          addBandRangeMarkers(row, largeBands.over, "band-over", isRightOpening);
          addBandRangeMarkers(row, largeBands.under, "band-under", isRightOpening);
        } else if (level === "middle") {
          addBandRangeMarkers(row, middleBands.over, "band-over", isRightOpening);
          addBandRangeMarkers(row, middleBands.under, "band-under", isRightOpening);
          if (!page?.rows?.middle?.entryId) {
            addBandRangeMarkers(row, largeBands.over, "band-over", isRightOpening);
            addBandRangeMarkers(row, largeBands.under, "band-under", isRightOpening);
          }
        } else if (level === "small") {
          // 小段は従来仕様どおり「over」を塗らず、under のみ表示する。
          addBandRangeMarkers(row, middleBands.under, "band-under", isRightOpening);
          addBandRangeMarkers(row, largeBands.under, "band-under", isRightOpening);
        }
        addEntryRangeHoverMarkers(row, page?.ranges?.[level] || [], isRightOpening);
        addBoundaryMarkers(row, page?.boundaries?.[level] || [], isRightOpening);

        const labelStarts = page?.labels?.[level] || [];
        for (let labelIdx = 0; labelIdx < labelStarts.length; labelIdx += 1) {
          const label = labelStarts[labelIdx];
          const isBoardHead = globalPageIndex === spec.start;
          const shouldShow =
            label.start > 0 || label.isGlobalStart || isBoardHead;
          if (!shouldShow || !label.text) continue;
          const nextLabel = labelStarts[labelIdx + 1];
          const spanEnd = Math.min(1, Math.max(label.start, nextLabel?.start ?? 1));
          const spanWidth = Math.max(0, spanEnd - label.start);
          const div = document.createElement("div");
          div.className = `segment ${CLASS_BY_LEVEL[level]} ${label.anonymous ? "is-anon" : ""}`;
          div.textContent = shrinkText(label.text, 14);
          div.dataset.entryId = label.entryId;
          div.style.position = "absolute";
          div.style.top = "1px";
          div.style.left = `${(isRightOpening ? 0 : label.start) * 100}%`;
          div.style.width = `${spanWidth * 100}%`;
          if (spanWidth > 0 && spanWidth < 0.28) {
            div.style.fontSize = level === "small" ? "8px" : "9px";
          }
          makeInteractive(div, label.entryId);
          row.appendChild(div);
        }
        cell.appendChild(row);
      }
      const statusRow = document.createElement("div");
      statusRow.className = "cell-row row-status";
      if (idx === 0) statusRow.classList.add("left-thick");
      if (idx === pagesPerBoard - 1) statusRow.classList.add("sep-thick");
      if (isActualEndBoundaryLeft) statusRow.classList.add("sep-thick");
      if (isRightOpeningBoardStartBoundary) statusRow.classList.add("left-thick");
      statusRow.classList.add(getSpreadSeparatorClass(idx, pagesPerBoard));
      const sourceIdx = Math.max(0, slotInfo.globalIndex - spec.start);
      const printBandClass = getPrintBandClassForBoardSlot(spec.format, sourceIdx, dataPagesPerBoard, state.meta.opening);
      if (printBandClass) statusRow.classList.add(printBandClass);
      const statusSegments = buildPrioritizedStatusTextSegments(page, statusTextByEntryId);
      addStatusTextSegmentLabels(statusRow, statusSegments, isRightOpening);
      cell.appendChild(statusRow);

      slot.appendChild(cell);
      slot.appendChild(ruler);
      slot.appendChild(number);
      track.appendChild(slot);
    }

    let betchoList = null;
    if (betchoes.length > 0) {
      betchoList = document.createElement("div");
      betchoList.className = "betcho-list";
      for (const betcho of betchoes) {
        betchoList.appendChild(createBetchoListItem(betcho));
      }
    }
    if (isRightOpening) {
      if (betchoList) row.appendChild(betchoList);
      row.appendChild(track);
      row.appendChild(side);
    } else {
      row.appendChild(side);
      row.appendChild(track);
      if (betchoList) row.appendChild(betchoList);
    }
    board.appendChild(row);
    els.boards.appendChild(board);
  }

  if (boardHoldEntries.length > 0) {
    const spacerBoard = createHoldGapBoard();
    els.boards.appendChild(spacerBoard);

    for (const [holdIdx, holdEntry] of boardHoldEntries.entries()) {
      const holdBoard = createHoldBoard(
        holdEntry,
        {
          visiblePagesPerBoard,
          isRightOpening,
          labelTop: LOCALE === "en" ? "Hold" : "保留",
          labelBottom: String(holdIdx + 1),
        },
      );
      els.boards.appendChild(holdBoard);
    }
  }

  if (boardAddonEntries.length > 0) {
    for (const addon of boardAddonEntries) {
      const addonBoard = createHoldBoard(
        addon,
        {
          visiblePagesPerBoard,
          isRightOpening,
          labelTop: addon.name,
          labelBottom: LOCALE === "en" ? `${formatPagesValue(addon.pages)}p` : `${formatPagesValue(addon.pages)}頁`,
          showLocalPageNumbers: true,
        },
      );
      els.boards.appendChild(addonBoard);
    }
  }
}

function buildBoardDisplayData() {
  const allFieldLabels = getArticleFieldLabels();
  const dataFieldLabels = getArticleDataFieldLabels(allFieldLabels);
  const byCanon = {
    name: "",
    pages: "",
    desk: "",
    editors: "",
    writers: "",
    deadline: "",
    status: "",
    memo: "",
  };
  const byFieldKey = new Map();
  const ordered = [
    ...(state.entries || []).map((item) => ({ type: "entry", item })),
    ...(state.holdEntries || []).map((item) => ({ type: "hold", item })),
    ...(state.betchoes || []).map((item) => ({ type: "betcho", item })),
    ...(state.addonEntries || []).map((item) => ({ type: "addon", item })),
  ].sort((a, b) => {
    const ao = Number.isFinite(a.item?.sourceOrder) ? a.item.sourceOrder : Number.MAX_SAFE_INTEGER;
    const bo = Number.isFinite(b.item?.sourceOrder) ? b.item.sourceOrder : Number.MAX_SAFE_INTEGER;
    return ao - bo;
  });

  const resolvedById = new Map();
  for (const row of ordered) {
    const item = row.item;
    if (!item?.id) continue;
    const clone = {
      ...item,
      desk: [...(item.desk || [])],
      editors: [...(item.editors || [])],
      writers: [...(item.writers || [])],
      fieldValues: { ...(item.fieldValues || {}) },
    };

    const resolveDash = (canon, value) => {
      const raw = String(value ?? "");
      if (raw.trim() === "-" && byCanon[canon]) return byCanon[canon];
      if (raw && raw.trim() !== "-") byCanon[canon] = raw;
      return raw;
    };
    const resolveDashByFieldKey = (key, value) => {
      const raw = String(value ?? "");
      const saved = String(byFieldKey.get(key) ?? "");
      if (raw.trim() === "-" && saved.trim()) return saved;
      if (raw && raw.trim() !== "-") byFieldKey.set(key, raw);
      return raw;
    };

    clone.name = resolveDash("name", clone.name);
    if (row.type === "addon") {
      if (!clone.pageExpr) {
        const fallbackUnits = clone.pages || pagesToUnits(ADDON_SPECS[clone.kind]?.pages || 0);
        clone.pageExpr = formatPagesValue(fallbackUnits);
      }
      clone.pageExpr = resolveDash("pages", clone.pageExpr);
      clone.pages = evalPageExpr(clone.pageExpr || "0");
    } else {
      clone.pageExpr = resolveDash("pages", clone.pageExpr);
      clone.pages = evalPageExpr(clone.pageExpr || "0");
    }

    for (const label of dataFieldLabels) {
      const raw = getFieldRawValue(clone, label);
      const canon = canonicalFieldByLabel(label);
      const fieldKey = canon || `label:${normalizeFieldLabelKey(label) || label}`;
      const resolvedRaw = resolveDashByFieldKey(fieldKey, raw);
      clone.fieldValues[label] = resolvedRaw;
      if (canon === "desk") {
        clone.desk = splitPeople(resolveDash("desk", resolvedRaw) || "-");
      } else if (canon === "editors") {
        clone.editors = splitPeople(resolveDash("editors", resolvedRaw) || "-");
      } else if (canon === "writers") {
        clone.writers = splitPeople(resolveDash("writers", resolvedRaw) || "-");
      } else if (canon === "deadline") {
        clone.deadline = resolveDash("deadline", resolvedRaw);
      } else if (canon === "status") {
        clone.status = resolveDash("status", resolvedRaw);
      } else if (canon === "memo") {
        clone.memo = resolveDash("memo", resolvedRaw);
      }
    }
    resolvedById.set(item.id, clone);
  }

  const pick = (items) => (items || []).map((item) => resolvedById.get(item.id) || item);
  return {
    entries: pick(state.entries),
    holdEntries: pick(state.holdEntries),
    betchoes: pick(state.betchoes),
    addonEntries: pick(state.addonEntries),
  };
}

function createHoldGapBoard() {
  const board = document.createElement("article");
  board.className = "board board-hold-gap";
  board.innerHTML = `<div class="board-row hold-gap-row"></div>`;
  return board;
}

function createHoldBoard(entry, options) {
  const { visiblePagesPerBoard, isRightOpening, labelTop, labelBottom, showLocalPageNumbers = false } = options;
  const pagesPerBoard = visiblePagesPerBoard;
  const fillUnits = Math.max(0, Math.min(pagesPerBoard * PAGE_UNITS, entry.pages || 0));
  const fillCount = Math.ceil(fillUnits / PAGE_UNITS);
  const statusRaw = String(entry?.status || "").trim();
  const logicalPages = Array.from({ length: pagesPerBoard }, (_, idx) => {
    if (idx >= fillCount) return { rows: { large: null, middle: null, small: null } };
    return {
      rows: {
        large: {
          entryId: entry.id || "",
          text: "",
          anonymous: Boolean(entry.anonymous),
          level: "large",
        },
        middle: {
          entryId: entry.id || "",
          text: "",
          anonymous: Boolean(entry.anonymous),
          level: "middle",
        },
        small: {
          entryId: entry.id || "",
          text: entry.name || "",
          anonymous: Boolean(entry.anonymous),
          level: "small",
        },
      },
    };
  });
  const displayedPages = isRightOpening ? [...logicalPages].reverse() : logicalPages;
  const slotLogicalIndex = (displayIdx) => (isRightOpening ? pagesPerBoard - 1 - displayIdx : displayIdx);

  const board = document.createElement("article");
  board.className = "board board-hold";

  const row = document.createElement("div");
  row.className = "board-row";
  if (isRightOpening) row.classList.add("right-opening");

  const side = document.createElement("div");
  side.className = "board-side";
  side.innerHTML = createBoardSideHtml(labelTop || "", labelBottom || "");

  const track = document.createElement("div");
  track.className = "page-track";
  track.style.gridTemplateColumns = `repeat(${pagesPerBoard}, minmax(0, 1fr))`;
  row.style.setProperty("--board-pages", String(pagesPerBoard));

  for (let idx = 0; idx < pagesPerBoard; idx += 1) {
    const page = displayedPages[idx];
    const logicalIdx = slotLogicalIndex(idx);
    const pageUnitStart = logicalIdx * PAGE_UNITS;
    const filledUnitCount = Math.max(0, Math.min(PAGE_UNITS, fillUnits - pageUnitStart));
    const isFilled = filledUnitCount > 0;
    const prevFilled = idx > 0 && slotLogicalIndex(idx - 1) < fillCount;
    const nextFilled = idx < pagesPerBoard - 1 && slotLogicalIndex(idx + 1) < fillCount;

    const slot = document.createElement("div");
    slot.className = "page-slot";
    if (!isFilled) slot.classList.add("is-blank");

    const cell = document.createElement("div");
    cell.className = "page-cell";
    const ruler = createPageRuler(idx, pagesPerBoard, isFilled);
    const number = document.createElement("div");
    number.className = "page-number";
    number.textContent = showLocalPageNumbers && isFilled ? String(logicalIdx + 1) : "";

    if (!isFilled) {
      slot.appendChild(cell);
      slot.appendChild(ruler);
      slot.appendChild(number);
      track.appendChild(slot);
      continue;
    }

    const rows = ["large", "middle", "small"];
    for (const level of rows) {
      const levelRow = document.createElement("div");
      levelRow.className = `cell-row row-${level}`;
      if (level === "large") {
        if (!prevFilled) levelRow.classList.add("left-thick");
        levelRow.classList.add(nextFilled ? "sep-none" : "sep-solid");
      } else if (level === "middle") {
        const spread = getSpreadSeparatorClass(idx, pagesPerBoard);
        if (!prevFilled) levelRow.classList.add("left-thick");
        levelRow.classList.add(spread);
      } else {
        // 保留小段の縦罫線は通常台と同じ実線/点線ルールで表示する。
        const spread = getSpreadSeparatorClass(idx, pagesPerBoard);
        if (!prevFilled) levelRow.classList.add("left-thick");
        levelRow.classList.add(spread);
      }

      const rowData = page?.rows?.[level];
      if (level === "small" && rowData?.entryId) {
        makeBandHoverInteractive(levelRow, rowData.entryId);
      }
      if (filledUnitCount > 0 && filledUnitCount < PAGE_UNITS) {
        addBoundaryMarkers(levelRow, [filledUnitCount / PAGE_UNITS], isRightOpening);
      }
      if (isFilled && level === "small" && rowData?.text && logicalIdx === 0) {
        const div = document.createElement("div");
        div.className = `segment seg-small ${rowData.anonymous ? "is-anon" : ""}`;
        div.textContent = shrinkText(rowData.text, 14);
        levelRow.appendChild(div);
      }
      if (filledUnitCount > 0 && filledUnitCount < PAGE_UNITS) {
        addBandRangeMarkers(levelRow, [[filledUnitCount / PAGE_UNITS, 1]], "band-under", isRightOpening);
      }
      cell.appendChild(levelRow);
    }
    const statusRow = document.createElement("div");
    statusRow.className = "cell-row row-status";
    if (!prevFilled) statusRow.classList.add("left-thick");
    statusRow.classList.add(getSpreadSeparatorClass(idx, pagesPerBoard));
    statusRow.classList.add("band-print-1c");
    if (statusRaw && logicalIdx === 0) {
      const statusLabel = document.createElement("div");
      statusLabel.className = "segment seg-status";
      statusLabel.textContent = shrinkText(statusRaw, 12);
      statusLabel.style.position = "absolute";
      statusLabel.style.top = "0";
      statusLabel.style.left = isRightOpening ? "0" : "0";
      statusLabel.style.width = "100%";
      statusRow.appendChild(statusLabel);
    }
    cell.appendChild(statusRow);

    slot.appendChild(cell);
    slot.appendChild(ruler);
    slot.appendChild(number);
    track.appendChild(slot);
  }

  if (isRightOpening) {
    row.appendChild(track);
    row.appendChild(side);
  } else {
    row.appendChild(side);
    row.appendChild(track);
  }
  board.appendChild(row);
  return board;
}

function groupBetchoByBoard(betchoes) {
  const out = new Map();
  for (const betcho of betchoes) {
    if (betcho.boardNo === 0) continue;
    if (!out.has(betcho.boardNo)) out.set(betcho.boardNo, []);
    out.get(betcho.boardNo).push(betcho);
  }
  return out;
}

function buildAdvancePrefixByBoard(betchoes, boardSpecs) {
  const addByBoard = new Map();
  let advanceBeforeAnyBoard = 0;
  for (const betcho of betchoes) {
    const adv = betcho.advancePages || 0;
    if (betcho.boardNo === 0) {
      advanceBeforeAnyBoard += adv;
      continue;
    }
    addByBoard.set(betcho.boardNo, (addByBoard.get(betcho.boardNo) || 0) + adv);
  }
  const prefix = new Map();
  let running = advanceBeforeAnyBoard;
  for (const spec of boardSpecs) {
    const boardNo = spec.boardNo;
    prefix.set(boardNo, running);
    running += addByBoard.get(boardNo) || 0;
  }
  return prefix;
}

function formatBoardLabel(format) {
  const parts = parseBoardFormatParts(format);
  if (parts.length === 1) {
    const m = parts[0].match(/^(\d+)C$/);
    if (m) return `${m[1]}<br>c`;
    return escapeHtml(parts[0]);
  }
  const m0 = parts[0].match(/^(\d+)C$/);
  const m1 = parts[1].match(/^(\d+)C$/);
  if (m0 && m1) {
    return `<span class="board-format-stack"><span class="board-format-num">${m0[1]}</span><span class="board-format-c">c</span></span><span class="board-format-slash">/</span><span class="board-format-stack"><span class="board-format-num">${m1[1]}</span><span class="board-format-c">c</span></span>`;
  }
  return escapeHtml(`${parts[0]}${parts[1]}`);
}

function createBoardSideHtml(topText, bottomText, options = {}) {
  const bottom = options.bottomIsHtml ? String(bottomText ?? "") : escapeHtml(bottomText || "");
  return `
    <div class="board-no">${escapeHtml(topText || "")}</div>
    <div class="board-format">${bottom}</div>
  `;
}

function createPageRuler(idx, pagesPerBoard, hasLines = true) {
  const ruler = document.createElement("div");
  ruler.className = "page-ruler";
  if (!hasLines) return ruler;
  return ruler;
}

function addBandRangeMarkers(rowNode, ranges, className, reverseInline = false) {
  if (!rowNode || !Array.isArray(ranges) || ranges.length === 0) return;
  for (const range of ranges) {
    if (!Array.isArray(range) || range.length < 2) continue;
    const start = Math.max(0, Math.min(1, Number(range[0])));
    const end = Math.max(start, Math.min(1, Number(range[1])));
    if (end <= start) continue;
    const visualStart = reverseInline ? 1 - end : start;
    const visualEnd = reverseInline ? 1 - start : end;
    const marker = document.createElement("span");
    marker.className = `band-frac ${className}`;
    marker.style.left = `${visualStart * 100}%`;
    marker.style.width = `${(visualEnd - visualStart) * 100}%`;
    rowNode.appendChild(marker);
  }
}

function buildPrioritizedStatusTextSegments(page, statusTextByEntryId) {
  if (!(statusTextByEntryId instanceof Map)) return [];
  const pageRanges = page?.ranges || {};
  const levels = ["small", "middle", "large"];
  const boundaries = [0, 1];
  for (const level of levels) {
    const ranges = pageRanges[level] || [];
    for (const range of ranges) {
      const start = Number(range?.start);
      const end = Number(range?.end);
      if (Number.isFinite(start)) boundaries.push(Math.max(0, Math.min(1, start)));
      if (Number.isFinite(end)) boundaries.push(Math.max(0, Math.min(1, end)));
    }
  }
  const sorted = [...boundaries].sort((a, b) => a - b);
  const unique = [];
  for (const value of sorted) {
    if (!unique.length || Math.abs(unique[unique.length - 1] - value) > 0.000001) {
      unique.push(value);
    }
  }
  const out = [];
  for (let idx = 0; idx < unique.length - 1; idx += 1) {
    const start = unique[idx];
    const end = unique[idx + 1];
    if (end <= start) continue;
    const probe = (start + end) / 2;
    let statusText = "";
    for (const level of levels) {
      const ranges = pageRanges[level] || [];
      const hit = ranges.find((range) => {
        const rangeStart = Number(range?.start);
        const rangeEnd = Number(range?.end);
        return Number.isFinite(rangeStart) && Number.isFinite(rangeEnd) && probe >= rangeStart && probe < rangeEnd;
      });
      if (!hit?.entryId) continue;
      statusText = String(statusTextByEntryId.get(hit.entryId) || "").trim();
      if (statusText) break;
    }
    if (!statusText) continue;
    const prev = out[out.length - 1];
    if (prev && prev.text === statusText && Math.abs(prev.end - start) <= 0.000001) {
      prev.end = end;
    } else {
      out.push({ start, end, text: statusText });
    }
  }
  return out;
}

function addStatusTextSegmentLabels(rowNode, segments, reverseInline = false) {
  if (!rowNode || !Array.isArray(segments) || segments.length === 0) return;
  for (const seg of segments) {
    const start = Number(seg?.start);
    const end = Number(seg?.end);
    const text = String(seg?.text || "").trim();
    if (!text || !Number.isFinite(start) || !Number.isFinite(end) || end <= start) continue;
    const visualStart = reverseInline ? 1 - end : start;
    const visualEnd = reverseInline ? 1 - start : end;
    const div = document.createElement("div");
    div.className = "segment seg-status";
    div.textContent = shrinkText(text, 12);
    div.style.position = "absolute";
    div.style.top = "0";
    div.style.left = `${visualStart * 100}%`;
    div.style.width = `${Math.max(0, visualEnd - visualStart) * 100}%`;
    rowNode.appendChild(div);
  }
}

function addEntryRangeHoverMarkers(rowNode, ranges, reverseInline = false) {
  if (!rowNode || !Array.isArray(ranges) || ranges.length === 0) return;
  for (const range of ranges) {
    const entryId = String(range?.entryId || "");
    const start = Math.max(0, Math.min(1, Number(range?.start)));
    const end = Math.max(start, Math.min(1, Number(range?.end)));
    if (!entryId || end <= start) continue;
    const visualStart = reverseInline ? 1 - end : start;
    const visualEnd = reverseInline ? 1 - start : end;
    const marker = document.createElement("span");
    marker.className = "board-hover-range";
    marker.dataset.entryId = entryId;
    marker.style.left = `${visualStart * 100}%`;
    marker.style.width = `${(visualEnd - visualStart) * 100}%`;
    makeBoardRangeHoverInteractive(marker, entryId);
    rowNode.appendChild(marker);
  }
}

function addBoundaryMarkers(rowNode, boundaries, reverseInline = false) {
  if (!rowNode || !Array.isArray(boundaries) || boundaries.length === 0) return;
  for (const boundary of boundaries) {
    const rawPos = Number(boundary);
    const pos = reverseInline ? 1 - rawPos : rawPos;
    if (!Number.isFinite(pos) || pos <= 0 || pos >= 1) continue;
    const marker = document.createElement("span");
    marker.className = "row-frac-boundary";
    marker.style.left = `${pos * 100}%`;
    rowNode.appendChild(marker);
  }
}

function getSpreadSeparatorClass(idx, pagesPerBoard) {
  if (idx === pagesPerBoard - 1) return "sep-thick";
  if (idx === 0) return "sep-thick";
  return idx % 2 === 1 ? "sep-dotted" : "sep-solid";
}

function getLargeSeparatorClass(chunk, idx, pagesPerBoard) {
  if (idx === pagesPerBoard - 1) return "sep-thick";
  const currentId = chunk[idx]?.rows?.large?.entryId || "";
  const nextId = chunk[idx + 1]?.rows?.large?.entryId || "";
  if (currentId && nextId && currentId === nextId) return "sep-none";
  if (currentId || nextId) return "sep-thick";
  return "sep-solid";
}

function makeInteractive(node, entryId) {
  let rightDragStartX = null;

  node.draggable = true;
  node.addEventListener("dragstart", (ev) => {
    ev.dataTransfer.setData("text/id", entryId);
    state.selectedId = entryId;
  });
  node.addEventListener("dragover", (ev) => ev.preventDefault());
  node.addEventListener("drop", (ev) => {
    ev.preventDefault();
    const from = ev.dataTransfer.getData("text/id");
    if (!from || from === entryId) return;
    reorderSameLevel(from, entryId);
    rerender();
  });

  node.addEventListener("pointerdown", (ev) => {
    if (ev.button === 2) rightDragStartX = ev.clientX;
  });
  node.addEventListener("pointerup", (ev) => {
    if (ev.button !== 2 || rightDragStartX == null) return;
    const dx = ev.clientX - rightDragStartX;
    rightDragStartX = null;
    if (dx > 80) {
      createAnonymousAfter(entryId);
      rerender();
    }
  });
}

function makeBandHoverInteractive(node, entryId) {
  let hoverTimer = null;
  node.addEventListener("mouseenter", (ev) => {
    hoverTimer = setTimeout(() => showTooltip(entryId, ev.clientX, ev.clientY), 500);
  });
  node.addEventListener("mouseleave", () => {
    clearTimeout(hoverTimer);
    hideTooltip();
  });
}

function makeBoardRangeHoverInteractive(node, entryId) {
  let hoverTimer = null;
  const setHovered = (active) => {
    document.querySelectorAll(".board-hover-range").forEach((el) => {
      if (el.dataset.entryId === entryId) el.classList.toggle("is-board-hover", active);
    });
  };
  node.addEventListener("mouseenter", (ev) => {
    setHovered(true);
    hoverTimer = setTimeout(() => showTooltip(entryId, ev.clientX, ev.clientY), 500);
  });
  node.addEventListener("mouseleave", () => {
    clearTimeout(hoverTimer);
    setHovered(false);
    hideTooltip();
  });
}

function makeBetchoHoverInteractive(node, betchoId) {
  let hoverTimer = null;
  node.addEventListener("mouseenter", (ev) => {
    hoverTimer = setTimeout(() => showTooltip(betchoId, ev.clientX, ev.clientY), 500);
  });
  node.addEventListener("mouseleave", () => {
    clearTimeout(hoverTimer);
    hideTooltip();
  });
}

function showTooltip(entryId, x, y) {
  const boardDisplayData = buildBoardDisplayData();
  const e = boardDisplayData.entries.find((x0) => x0.id === entryId);
  const h = boardDisplayData.holdEntries.find((x0) => x0.id === entryId);
  const a = boardDisplayData.addonEntries.find((x0) => x0.id === entryId);
  const s = findSyntheticMiddleById(entryId, boardDisplayData.entries);
  const b = boardDisplayData.betchoes.find((x0) => x0.id === entryId);
  if (!e && !h && !a && !s && !b) return;
  els.tooltip.classList.remove("hidden");
  els.tooltip.style.left = `${x + 10}px`;
  els.tooltip.style.top = `${y + 10}px`;
  const nameLabel = LOCALE === "en" ? "Article" : "記事名";
  const article = e || h || a || s;
  if (article) {
    const labels = a
      ? getArticleDisplayFieldLabels(getAddonFieldLabelsRaw())
      : getArticleDisplayFieldLabels();
    const nameLine = (item) => `${nameLabel}: ${escapeHtml(item?.name || "-")}`;
    const fieldLinesLocal = (item) =>
      labels
        .map((label) => `${escapeHtml(label)}: ${escapeHtml(formatFieldDisplayValue(label, getFieldRawValue(item, label)))}`)
        .join("<br>");
    const detailLines = fieldLinesLocal(article);
    let html = detailLines ? `${nameLine(article)}<br>${detailLines}` : nameLine(article);
    const notes = article.attachedInlineNotes;
    if (notes && notes.length) {
      html += "<br><br>";
      html += notes.map((raw) => linkifyPlainTextToHtml(humanizeDirectiveLineForTooltip(raw))).join("<br>");
    }
    els.tooltip.innerHTML = html;
    return;
  }
  const labelsB = getArticleDisplayFieldLabels();
  const fieldLinesBetcho = (item) =>
    labelsB
      .map((label) => `${escapeHtml(label)}: ${escapeHtml(formatFieldDisplayValue(label, getFieldRawValue(item, label)))}`)
      .join("<br>");
  const nameLineB = (item) => `${nameLabel}: ${escapeHtml(item?.name || "-")}`;
  const head = LOCALE === "en"
    ? `Type: Insert (${b.boardNo === 0 ? "before first board (0)" : `after board ${b.boardNo}`})<br>Page advance: +${b.advancePages}<br>`
    : `種別: 別丁（${b.boardNo === 0 ? "本の先頭（台0）" : `台${b.boardNo}の後ろ`}）<br>ページ進み: +${b.advancePages}頁<br>`;
  const betchoDetailLines = fieldLinesBetcho(b);
  let htmlB = `${head}${nameLineB(b)}${betchoDetailLines ? `<br>${betchoDetailLines}` : ""}`;
  const notesB = b.attachedInlineNotes;
  if (notesB && notesB.length) {
    htmlB += "<br><br>";
    htmlB += notesB.map((raw) => linkifyPlainTextToHtml(humanizeDirectiveLineForTooltip(raw))).join("<br>");
  }
  els.tooltip.innerHTML = htmlB;
}

function findSyntheticMiddleById(entryId, entries = state.entries) {
  if (!String(entryId || "").startsWith("synthetic-middle-")) return null;
  const tree = buildHierarchy(entries || []);
  for (const large of tree) {
    for (const middle of large.middles) {
      if (middle.id === entryId && middle.syntheticAutoMiddle) return middle;
    }
  }
  return null;
}

function hideTooltip() {
  els.tooltip.classList.add("hidden");
}

function findIndexById(id) {
  return state.entries.findIndex((x) => x.id === id);
}

function reorderSameLevel(fromId, toId) {
  const fromIdx = findIndexById(fromId);
  const toIdx = findIndexById(toId);
  if (fromIdx < 0 || toIdx < 0) return;
  const from = state.entries[fromIdx];
  const to = state.entries[toIdx];
  if (from.level !== to.level) return;
  state.entries.splice(fromIdx, 1);
  const newToIdx = findIndexById(toId);
  state.entries.splice(newToIdx, 0, from);
  state.textDirty = true;
}

function createAnonymousAfter(id) {
  const idx = findIndexById(id);
  if (idx < 0) return;
  const base = state.entries[idx];
  const anon = {
    ...base,
    id: crypto.randomUUID(),
    pageExpr: "1",
    pages: evalPageExpr("1"),
    name: "(無題)",
    anonymous: true,
    deadline: "",
    status: "",
    memo: "",
  };
  state.entries.splice(idx + 1, 0, anon);
  state.textDirty = true;
}

function labelLevel(level) {
  return levelLabel(level);
}

function escapeHtml(text) {
  return String(text ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#39;");
}

function formatArticleCellText(name, pages) {
  return LOCALE === "en" ? `${name} (${formatPagesValue(pages)}p)` : `${name} (${formatPagesValue(pages)}頁)`;
}

function formatPagesOnlyText(pages) {
  return LOCALE === "en" ? `(${formatPagesValue(pages)}p)` : `(${formatPagesValue(pages)}頁)`;
}

function peopleText(list) {
  return list?.length ? list.join(", ") : "-";
}

function getArticleFieldLabels() {
  return normalizeArticleFieldLabels(state.articleFieldLabels);
}

function getAddonFieldLabelsRaw() {
  if (state.tocArticleFieldLabels != null) return state.tocArticleFieldLabels;
  return state.articleFieldLabels;
}

function getFieldRawValue(item, label) {
  if (item?.fieldValues && Object.hasOwn(item.fieldValues, label)) {
    return item.fieldValues[label] || "";
  }
  const canon = canonicalFieldByLabel(label);
  if (canon === "pages") return item?.pageExpr || formatPagesValue(item?.pages || 0);
  if (canon === "name") return item?.name || "";
  if (canon === "desk") return item?.desk?.join("|") || "";
  if (canon === "editors") return item?.editors?.join("|") || "";
  if (canon === "writers") return item?.writers?.join("|") || "";
  if (canon === "deadline") return item?.deadline || "";
  if (canon === "status") return item?.status || "";
  if (canon === "memo") return item?.memo || "";
  return "";
}

function formatFieldDisplayValue(label, rawValue) {
  const canon = canonicalFieldByLabel(label);
  if (canon === "desk" || canon === "editors" || canon === "writers") {
    return splitPeople(rawValue).join(", ") || "-";
  }
  return rawValue || "-";
}

function getArticleMetaCellClass(index) {
  const legacy = ["meta-desk", "meta-editor", "meta-writer", "meta-deadline", "meta-status", "meta-memo"];
  return [legacy[index], `meta-col-${index}`].filter(Boolean).join(" ");
}

function renderMetaCellHtml(text) {
  const raw = String(text ?? "");
  const urlRegex = /(https?:\/\/[^\s<>"'`]+)/g;
  let out = "";
  let last = 0;
  for (const match of raw.matchAll(urlRegex)) {
    const idx = match.index ?? -1;
    if (idx < 0) continue;
    const url = match[0] || "";
    out += escapeHtml(raw.slice(last, idx));
    out += `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(url)}</a>`;
    last = idx + url.length;
  }
  out += escapeHtml(raw.slice(last));
  return out;
}

function buildRowMetaFields(item, options = {}) {
  const raw = options.useTocAddonFields ? getAddonFieldLabelsRaw() : state.articleFieldLabels;
  const labels = getArticleDisplayFieldLabels(raw);
  return {
    entryId: item?.id || "",
    metaValues: labels.map((label) => formatFieldDisplayValue(label, getFieldRawValue(item, label))),
  };
}

function renderArticleMetaCells(row) {
  const values = row.metaValues || [];
  const entryAttr = articleEntryAttr(row.entryId || row.sourceId || "");
  return values
    .map((text, idx) => `<td class="tree-cell meta-cell article-editable-cell ${getArticleMetaCellClass(idx)}" data-edit-kind="meta" data-nav-col="${3 + idx}"${entryAttr}>${renderMetaCellHtml(text)}</td>`)
    .join("");
}

function canEditMainArticleCell(row) {
  if (!row || row.type === "hold-separator" || row.type === "middle-auto") return false;
  const entryId = String(row.entryId || row.sourceId || "").trim();
  if (!entryId) return false;
  return Boolean(findArticleListEditableItemById(entryId));
}

function isEditableItemWithPages(item) {
  if (!item || typeof item !== "object") return false;
  if (Object.hasOwn(item, "pageExpr")) return true;
  if (Object.hasOwn(item, "advancePages")) return true;
  if (Object.hasOwn(item, "pages")) return true;
  return false;
}

function getEditableItemPagesText(item) {
  if (!item || typeof item !== "object") return "";
  if (Object.hasOwn(item, "advancePages")) {
    const value = Math.max(1, Number.parseInt(item.advancePages, 10) || 1);
    return LOCALE === "en" ? `(+${value}p)` : `(+${value}頁)`;
  }
  const rawPages = Object.hasOwn(item, "pageExpr")
    ? String(item.pageExpr || "")
    : formatPagesValue(item.pages || 0);
  const fallback = formatPagesValue(item.pages || 0);
  const display = rawPages || fallback || "1";
  return LOCALE === "en" ? `(${display}p)` : `(${display}頁)`;
}

function renderArticleMainCellHtml(row) {
  const text = String(row?.text || "");
  const entryId = String(row?.entryId || row?.sourceId || "").trim();
  if (!entryId) return escapeHtml(text);
  const item = findArticleListEditableItemById(entryId);
  if (!item) return escapeHtml(text);
  const nameHtml = renderMetaCellHtml(item.name || "");
  if (!isEditableItemWithPages(item)) return nameHtml || "-";
  const prefix = row.type === "hold"
    ? `${LOCALE === "en" ? "Hold" : "保留"}: `
    : "";
  const pagesText = getEditableItemPagesText(item);
  return `${escapeHtml(prefix)}<span class="article-main-name">${nameHtml || "-"}</span> <span class="article-main-pages" data-main-subfield="pages">${escapeHtml(pagesText)}</span>`;
}

function uniqueArticleIds(ids) {
  return [...new Set((ids || []).filter(Boolean).map((id) => String(id)))];
}

function articleEntryAttr(id) {
  return id ? ` data-article-entry-id="${escapeHtml(id)}"` : "";
}

function articleHoverAttr(ids) {
  const safeIds = uniqueArticleIds(ids);
  return safeIds.length > 0
    ? ` data-article-hover-ids="${escapeHtml(safeIds.join(" "))}"`
    : "";
}

function collectArticleGroupIds(large) {
  const ids = [large?.id];
  for (const middle of large?.middles || []) {
    ids.push(middle.id);
    for (const small of middle.smalls || []) ids.push(small.id);
  }
  return uniqueArticleIds(ids);
}

function collectMiddleGroupIds(large, middle) {
  return uniqueArticleIds([
    large?.id,
    middle?.id,
    ...(middle?.smalls || []).map((small) => small.id),
  ]);
}

function buildArticleTreeRows() {
  const tree = buildHierarchy(state.entries);
  const rows = [];
  for (const large of tree) {
    const largeHoverIds = collectArticleGroupIds(large);
    rows.push({
      type: "large",
      text: formatArticleCellText(large.name, large.pages),
      entryId: large.id,
      hoverIds: largeHoverIds,
      ...buildRowMetaFields(large),
    });
    for (const middle of large.middles) {
      const middleHoverIds = collectMiddleGroupIds(large, middle);
      rows.push({
        type: middle.syntheticAutoMiddle ? "middle-auto" : "middle",
        text: middle.syntheticAutoMiddle
          ? formatPagesOnlyText(middle.pages)
          : formatArticleCellText(middle.name, middle.pages),
        entryId: middle.id,
        hoverIds: middleHoverIds,
        ...buildRowMetaFields(middle),
      });
      for (const small of middle.smalls) {
        rows.push({
          type: "small",
          text: formatArticleCellText(small.name, small.pages),
          entryId: small.id,
          hoverIds: uniqueArticleIds([large.id, middle.id, small.id]),
          ...buildRowMetaFields(small),
        });
      }
    }
  }
  for (const betcho of state.betchoes) {
    const pos = formatBetchoListPositionLabel(betcho);
    rows.push({
      type: "betcho",
      text: LOCALE === "en"
        ? `${betcho.name} (Insert: ${pos} / +${betcho.advancePages}p)`
        : `${betcho.name}（別丁: ${pos} / +${betcho.advancePages}頁）`,
      entryId: betcho.id,
      hoverIds: [betcho.id],
      ...buildRowMetaFields(betcho),
    });
  }
  const holds = state.holdEntries || [];
  if (holds.length > 0 && rows.length > 0) {
    rows.push({ type: "hold-separator" });
  }
  for (const hold of holds) {
    rows.push({
      type: "hold",
      text: `${LOCALE === "en" ? "Hold" : "保留"}: ${formatArticleCellText(hold.name, hold.pages)}`,
      entryId: hold.id,
      hoverIds: [hold.id],
      ...buildRowMetaFields(hold),
    });
  }
  const addons = state.addonEntries || [];
  if (addons.length > 0 && rows.length > 0) {
    rows.push({ type: "hold-separator" });
  }
  for (const addon of addons) {
    rows.push({
      type: "addon",
      text: `${addon.name}: ${formatPagesOnlyText(addon.pages)}`,
      entryId: addon.id,
      hoverIds: [addon.id],
      ...buildRowMetaFields(addon, { useTocAddonFields: true }),
    });
  }
  return rows;
}

function buildArticleListRows() {
  const labels = getArticleDisplayFieldLabels();
  const addonLabels = getArticleDisplayFieldLabels(getAddonFieldLabelsRaw());
  const toRow = (level, name, pages, item, metaLabels = labels) => ({
    level,
    name,
    pages,
    metaValues: metaLabels.map((label) => formatFieldDisplayValue(label, getFieldRawValue(item, label))),
  });
  const normalRows = state.entries.map((e) => ({
    ...toRow(labelLevel(e.level), e.name, formatPagesValue(e.pages), e),
  }));
  const betchoRows = state.betchoes.map((b) => {
    const pos = formatBetchoListPositionLabel(b);
    return {
      ...toRow(
        LOCALE === "en" ? "Insert" : "別丁",
        LOCALE === "en" ? `${b.name} (${pos})` : `${b.name}（${pos}）`,
        `+${b.advancePages}${LOCALE === "en" ? "p" : ""}`,
        b,
      ),
    };
  });
  const holdRows = (state.holdEntries || []).map((h) => ({
    ...toRow(
      LOCALE === "en" ? "Hold" : "保留",
      h.name,
      `${formatPagesValue(h.pages)}${LOCALE === "en" ? "p" : ""}`,
      h,
    ),
  }));
  const addonRows = (state.addonEntries || []).map((a) => ({
    ...toRow(a.name, a.name, `${formatPagesValue(a.pages)}${LOCALE === "en" ? "p" : ""}`, a, addonLabels),
  }));
  return [...normalRows, ...betchoRows, ...holdRows, ...addonRows];
}

function buildArticleFlatRows() {
  const tree = buildHierarchy(state.entries);
  const rows = [];

  for (const large of tree) {
    const largeHoverIds = collectArticleGroupIds(large);
    const middleBlocks = large.middles.length > 0 ? large.middles : [null];
    const largeRowCount = middleBlocks.reduce((sum, middle) => {
      if (!middle) return sum + 1;
      return sum + Math.max(1, middle.smalls.length);
    }, 0);

    let largeRendered = false;
    for (const middle of middleBlocks) {
      const middleHoverIds = middle ? collectMiddleGroupIds(large, middle) : [large.id];
      const middleText = !middle
        ? ""
        : (middle.syntheticAutoMiddle
          ? formatPagesOnlyText(middle.pages)
          : formatArticleCellText(middle.name, middle.pages));
      const smalls = middle ? middle.smalls : [];
      const rowCount = Math.max(1, smalls.length);

      for (let i = 0; i < rowCount; i += 1) {
        const small = smalls[i] || null;
        const source = small || middle || large;
        const rowHoverIds = small
          ? uniqueArticleIds([large.id, middle?.id, small.id])
          : uniqueArticleIds(middle ? middleHoverIds : [large.id]);
        rows.push({
          type: "flat",
          largeText: !largeRendered ? formatArticleCellText(large.name, large.pages) : "",
          largeRowspan: !largeRendered ? largeRowCount : 0,
          largeEntryId: large.id,
          largeHoverIds,
          middleText: i === 0 ? middleText : "",
          middleRowspan: i === 0 ? rowCount : 0,
          middleEntryId: middle?.id || "",
          middleHoverIds,
          smallText: small ? formatArticleCellText(small.name, small.pages) : "",
          smallEntryId: small?.id || "",
          sourceId: source?.id || "",
          entryId: source?.id || "",
          hoverIds: rowHoverIds,
          ...buildRowMetaFields(source),
        });
        largeRendered = true;
      }
    }
  }

  for (const betcho of state.betchoes) {
    const pos = formatBetchoListPositionLabel(betcho);
    rows.push({
      type: "betcho",
      text: LOCALE === "en"
        ? `${betcho.name} (Insert: ${pos} / +${betcho.advancePages}p)`
        : `${betcho.name}（別丁: ${pos} / +${betcho.advancePages}頁）`,
      entryId: betcho.id,
      hoverIds: [betcho.id],
      ...buildRowMetaFields(betcho),
    });
  }

  const holds = state.holdEntries || [];
  if (holds.length > 0 && rows.length > 0) rows.push({ type: "hold-separator" });
  for (const hold of holds) {
    rows.push({
      type: "hold",
      text: `${LOCALE === "en" ? "Hold" : "保留"}: ${formatArticleCellText(hold.name, hold.pages)}`,
      entryId: hold.id,
      hoverIds: [hold.id],
      ...buildRowMetaFields(hold),
    });
  }
  const addons = state.addonEntries || [];
  if (addons.length > 0 && rows.length > 0) rows.push({ type: "hold-separator" });
  for (const addon of addons) {
    rows.push({
      type: "addon",
      text: `${addon.name}: ${formatPagesOnlyText(addon.pages)}`,
      entryId: addon.id,
      hoverIds: [addon.id],
      ...buildRowMetaFields(addon, { useTocAddonFields: true }),
    });
  }
  return rows;
}

function buildArticleTableHeaderHtml() {
  const labels = getArticleDisplayFieldLabels();
  const metaHeaders = labels.map((label) => `<th>${escapeHtml(label)}</th>`).join("");
  return `<tr>
    <th>${LOCALE === "en" ? "Large" : "大目次"}</th>
    <th>${LOCALE === "en" ? "Middle" : "中目次"}</th>
    <th>${LOCALE === "en" ? "Small" : "小目次"}</th>
    ${metaHeaders}
  </tr>`;
}

function buildArticleTableColgroupHtml() {
  const widths = getArticleColumnWidths();
  const cols = widths
    .map((width, idx) => `<col data-col-idx="${idx}" style="width: ${Math.max(0.1, width)}%" />`)
    .join("");
  return `<colgroup>${cols}</colgroup>`;
}

function renderArticleList() {
  const rows = state.articleListCascade ? buildArticleTreeRows() : buildArticleFlatRows();
  const metaSummary = escapeHtml(buildMetaSummaryText());
  if (rows.length === 0) {
    els.articleListContainer.innerHTML = `
      <div class="article-list-meta">${metaSummary}</div>
      <div class="article-list-toolbar">
        <label class="article-toggle-label">
          <input id="cascadeToggle" type="checkbox" ${state.articleListCascade ? "checked" : ""} />
          ${LOCALE === "en" ? "Cascade view" : "カスケード表示"}
        </label>
      </div>
      <div class="article-list-empty">${LOCALE === "en" ? "No article data." : "記事データがありません。"}</div>
    `;
    const cascadeToggle = document.querySelector("#cascadeToggle");
    cascadeToggle?.addEventListener("change", (ev) => {
      state.articleListCascade = Boolean(ev.target.checked);
      renderArticleList();
    });
    return;
  }
  const body = rows
    .map((row) => {
      const text = escapeHtml(row.text || "");
      const mainText = renderArticleMainCellHtml(row);
      const editableMain = canEditMainArticleCell(row) ? " article-editable-cell" : "";
      const metaCells = renderArticleMetaCells(row);
      const rowHoverAttr = articleHoverAttr(row.hoverIds);
      if (row.type === "flat") {
        const middleEditable = Boolean(row.middleEntryId && findArticleListEditableItemById(row.middleEntryId));
        const smallEditable = Boolean(row.smallEntryId && findArticleListEditableItemById(row.smallEntryId));
        const largeCell = row.largeRowspan > 0
          ? `<td rowspan="${row.largeRowspan}" class="tree-cell cell-large article-editable-cell" data-edit-kind="main" data-nav-col="0"${articleEntryAttr(row.largeEntryId)}${articleHoverAttr(row.largeHoverIds)}>${renderArticleMainCellHtml({ type: "large", text: row.largeText, entryId: row.largeEntryId })}</td>`
          : "";
        const middleCell = row.middleRowspan > 0
          ? `<td rowspan="${row.middleRowspan}" class="tree-cell cell-middle${middleEditable ? " article-editable-cell" : ""}" data-edit-kind="main" data-nav-col="1"${articleEntryAttr(row.middleEntryId)}${articleHoverAttr(row.middleHoverIds)}>${row.middleEntryId ? renderArticleMainCellHtml({ type: "middle", text: row.middleText, entryId: row.middleEntryId }) : escapeHtml(row.middleText)}</td>`
          : "";
        const smallCell = `<td class="tree-cell cell-small${smallEditable ? " article-editable-cell" : ""}" data-edit-kind="main" data-nav-col="2"${articleEntryAttr(row.smallEntryId)}${articleHoverAttr(row.hoverIds)}>${row.smallEntryId ? renderArticleMainCellHtml({ type: "small", text: row.smallText, entryId: row.smallEntryId }) : escapeHtml(row.smallText)}</td>`;
        return `<tr class="article-tree-row row-flat"${rowHoverAttr}>
          ${largeCell}
          ${middleCell}
          ${smallCell}
          ${metaCells}
        </tr>`;
      }
      if (row.type === "large") {
        return `<tr class="article-tree-row row-large"${rowHoverAttr}>
          <td colspan="3" class="tree-cell cell-large${editableMain}" data-edit-kind="main" data-nav-col="0"${articleEntryAttr(row.entryId)}${rowHoverAttr}>${mainText}</td>
          ${metaCells}
        </tr>`;
      }
      if (row.type === "middle") {
        return `<tr class="article-tree-row row-middle"${rowHoverAttr}>
          <td class="tree-cell tree-guide guide-large no-top"></td>
          <td colspan="2" class="tree-cell cell-middle${editableMain}" data-edit-kind="main" data-nav-col="1"${articleEntryAttr(row.entryId)}${rowHoverAttr}>${mainText}</td>
          ${metaCells}
        </tr>`;
      }
      if (row.type === "middle-auto") {
        return `<tr class="article-tree-row row-middle row-middle-auto"${rowHoverAttr}>
          <td class="tree-cell tree-guide guide-large no-top"></td>
          <td colspan="2" class="tree-cell cell-middle cell-middle-auto"${articleEntryAttr(row.entryId)}${rowHoverAttr}>${text}</td>
          ${metaCells}
        </tr>`;
      }
      if (row.type === "small") {
        return `<tr class="article-tree-row row-small"${rowHoverAttr}>
          <td class="tree-cell tree-guide guide-large no-top"></td>
          <td class="tree-cell tree-guide guide-middle no-top"></td>
          <td class="tree-cell cell-small${editableMain}" data-edit-kind="main" data-nav-col="2"${articleEntryAttr(row.entryId)}${rowHoverAttr}>${mainText}</td>
          ${metaCells}
        </tr>`;
      }
      if (row.type === "hold") {
        return `<tr class="article-tree-row row-hold"${rowHoverAttr}>
          <td colspan="3" class="tree-cell cell-hold${editableMain}" data-edit-kind="main" data-nav-col="0"${articleEntryAttr(row.entryId)}${rowHoverAttr}>${mainText}</td>
          ${metaCells}
        </tr>`;
      }
      if (row.type === "addon") {
        return `<tr class="article-tree-row row-addon"${rowHoverAttr}>
          <td colspan="3" class="tree-cell cell-addon${editableMain}" data-edit-kind="main" data-nav-col="0"${articleEntryAttr(row.entryId)}${rowHoverAttr}>${mainText}</td>
          ${metaCells}
        </tr>`;
      }
      if (row.type === "hold-separator") {
        return `<tr class="article-tree-row row-hold-separator">
          <td colspan="${3 + getArticleDisplayFieldLabels().length}" class="tree-cell hold-separator-cell"></td>
        </tr>`;
      }
      return `<tr class="article-tree-row row-betcho"${rowHoverAttr}>
        <td colspan="3" class="tree-cell cell-betcho article-editable-cell" data-edit-kind="main" data-nav-col="0"${articleEntryAttr(row.entryId)}${rowHoverAttr}>${mainText}</td>
        ${metaCells}
      </tr>`;
    })
    .join("");

  els.articleListContainer.innerHTML = `
    <div class="article-list-meta">${metaSummary}</div>
    <div class="article-list-toolbar">
      <label class="article-toggle-label">
        <input id="cascadeToggle" type="checkbox" ${state.articleListCascade ? "checked" : ""} />
        ${LOCALE === "en" ? "Cascade view" : "カスケード表示"}
      </label>
    </div>
    <table class="article-tree-table">
    ${buildArticleTableColgroupHtml()}
    <thead>
      ${buildArticleTableHeaderHtml()}
    </thead>
    <tbody>${body}</tbody>
  </table>`;

  const cascadeToggle = document.querySelector("#cascadeToggle");
  cascadeToggle?.addEventListener("change", (ev) => {
    state.articleListCascade = Boolean(ev.target.checked);
    renderArticleList();
  });
  bindArticleColumnResize();
  bindArticleHoverHighlights();
  bindArticleMetaCellActions();
}

function bindArticleMetaCellActions() {
  const table = els.articleListContainer?.querySelector(".article-tree-table");
  if (!table) return;
  articleListEditState.active = false;
  articleListEditState.cell = null;
  articleListEditState.table = table;

  table.addEventListener("click", (ev) => {
    if (ev.button !== 0) return;
    const target = ev.target;
    if (!(target instanceof Element)) return;
    if (target.closest("a[href]")) return;
    const cell = target.closest("td.article-editable-cell");
    if (!cell || !table.contains(cell)) return;
    ev.preventDefault();
    const preferSubfield = target.closest("[data-main-subfield='pages']") ? "pages" : "name";
    startArticleCellEdit(cell, { preferSubfield });
  });
}

function startArticleCellEdit(cell, options = {}) {
  if (!(cell instanceof HTMLElement)) return;
  let targetCell = cell;
  if (articleListEditState.active && articleListEditState.cell && articleListEditState.cell !== targetCell) {
    const pendingEntryId = String(
      targetCell.getAttribute("data-article-entry-id")
      || targetCell.closest("[data-article-entry-id]")?.getAttribute("data-article-entry-id")
      || "",
    ).trim();
    const pendingNavCol = String(targetCell.dataset.navCol || "");
    commitArticleCellEdit({ sourceCell: articleListEditState.cell });
    if (pendingEntryId && pendingNavCol) {
      const refreshed = findArticleCellByNav(pendingEntryId, pendingNavCol);
      if (refreshed) targetCell = refreshed;
    }
  }
  if (articleListEditState.active && articleListEditState.cell === targetCell) return;
  const entryId = String(
    targetCell.getAttribute("data-article-entry-id")
    || targetCell.closest("[data-article-entry-id]")?.getAttribute("data-article-entry-id")
    || "",
  ).trim();
  if (!entryId) return;
  const item = findArticleListEditableItemById(entryId);
  if (!item) return;
  const kind = String(targetCell.dataset.editKind || "").trim();
  if (kind !== "main" && kind !== "meta") return;

  const originalHtml = targetCell.innerHTML;
  const originalText = targetCell.textContent || "";
  const editor = buildArticleCellEditor(targetCell, item, kind, options);
  if (!editor) return;

  targetCell.classList.add("is-cell-editing");
  targetCell.innerHTML = "";
  targetCell.appendChild(editor.root);

  articleListEditState.active = true;
  articleListEditState.cell = targetCell;
  articleListEditState.table = articleListEditState.table || targetCell.closest("table");
  targetCell.dataset.editingOriginalHtml = originalHtml;
  targetCell.dataset.editingOriginalText = originalText;

  if (editor.focusTarget instanceof HTMLElement) {
    editor.focusTarget.focus();
    if (typeof editor.focusTarget.select === "function") editor.focusTarget.select();
    if (editor.focusTarget instanceof HTMLInputElement && editor.focusTarget.type === "date") {
      try {
        if (typeof editor.focusTarget.showPicker === "function") {
          editor.focusTarget.showPicker();
        } else {
          editor.focusTarget.click();
        }
      } catch (_error) {}
    }
  }
}

function buildArticleCellEditor(cell, item, kind, options = {}) {
  if (kind === "meta") return buildArticleMetaCellEditor(cell, item);
  return buildArticleMainCellEditor(cell, item, options.preferSubfield || "name");
}

function buildArticleMetaCellEditor(cell, item) {
  const className = [...cell.classList].find((name) => /^meta-col-\d+$/.test(name)) || "";
  const colIdx = Number.parseInt(className.replace("meta-col-", ""), 10);
  if (!Number.isFinite(colIdx) || colIdx < 0) return null;
  const labels = getArticleDisplayFieldLabels();
  const label = String(labels[colIdx] || "");
  if (!label) return null;
  const rawValue = String(getFieldRawValue(item, label) || "");
  const isDate = /^\d{4}\/\d{1,2}\/\d{1,2}$/.test(rawValue.trim());
  const input = document.createElement("input");
  input.className = "article-cell-input";
  input.type = isDate ? "date" : "text";
  input.value = isDate ? toDateInputValue(rawValue.trim()) : rawValue;
  input.dataset.articleEditType = "meta";
  input.dataset.articleLabel = label;
  input.addEventListener("keydown", handleArticleCellEditorKeydown);
  return {
    root: input,
    focusTarget: input,
  };
}

function buildArticleMainCellEditor(cell, item, preferSubfield = "name") {
  const root = document.createElement("div");
  root.className = "article-main-editor";
  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.className = "article-cell-input";
  nameInput.value = String(item.name || "");
  nameInput.dataset.articleEditType = "main-name";
  nameInput.addEventListener("keydown", handleArticleCellEditorKeydown);
  root.appendChild(nameInput);

  let pageInput = null;
  if (isEditableItemWithPages(item)) {
    pageInput = document.createElement("input");
    pageInput.type = "number";
    pageInput.className = "article-cell-input article-cell-input-pages";
    pageInput.min = Object.hasOwn(item, "advancePages") ? "1" : "0.1";
    pageInput.step = "1";
    pageInput.value = getEditableItemPageInputValue(item);
    pageInput.dataset.articleEditType = "main-pages";
    pageInput.addEventListener("keydown", handleArticleCellEditorKeydown);
    root.appendChild(pageInput);
  }

  const focusTarget = preferSubfield === "pages" && pageInput ? pageInput : nameInput;
  return { root, focusTarget };
}

function getEditableItemPageInputValue(item) {
  if (Object.hasOwn(item, "advancePages")) {
    return String(Math.max(1, Number.parseInt(item.advancePages, 10) || 1));
  }
  if (Object.hasOwn(item, "pageExpr")) {
    const raw = String(item.pageExpr || "").trim();
    const parsed = Number.parseFloat(raw);
    if (raw && Number.isFinite(parsed) && parsed > 0) return raw;
  }
  const pages = unitsToPages(item.pages || 0);
  if (!Number.isFinite(pages) || pages <= 0) return "0.1";
  const rounded = Math.round(pages * 10) / 10;
  return String(Math.max(0.1, rounded));
}

function handleArticleCellEditorKeydown(ev) {
  const target = ev.target;
  if (!(target instanceof HTMLElement)) return;
  const cell = target.closest("td.article-editable-cell");
  if (!(cell instanceof HTMLElement)) return;
  if (ev.key === "Escape") {
    ev.preventDefault();
    cancelArticleCellEdit(cell);
    return;
  }
  if (ev.key === "Enter") {
    ev.preventDefault();
    commitArticleCellEdit({ move: "down", sourceCell: cell });
    return;
  }
  if (ev.key === "ArrowRight") {
    const type = String(target.dataset.articleEditType || "");
    const pageInput = cell.querySelector("input[data-article-edit-type='main-pages']");
    if (type === "main-name" && pageInput instanceof HTMLInputElement) {
      ev.preventDefault();
      pageInput.focus();
      pageInput.select();
      return;
    }
    ev.preventDefault();
    commitArticleCellEdit({ move: "right", sourceCell: cell });
    return;
  }
  if (ev.key === "ArrowLeft") {
    const type = String(target.dataset.articleEditType || "");
    const nameInput = cell.querySelector("input[data-article-edit-type='main-name']");
    if (type === "main-pages" && nameInput instanceof HTMLInputElement) {
      ev.preventDefault();
      nameInput.focus();
      nameInput.select();
      return;
    }
    ev.preventDefault();
    commitArticleCellEdit({ move: "left", sourceCell: cell });
    return;
  }
  if (ev.key === "ArrowUp") {
    ev.preventDefault();
    commitArticleCellEdit({ move: "up", sourceCell: cell });
    return;
  }
  if (ev.key === "ArrowDown") {
    ev.preventDefault();
    commitArticleCellEdit({ move: "down", sourceCell: cell });
  }
}

function cancelArticleCellEdit(cell) {
  const targetCell = cell || articleListEditState.cell;
  if (!(targetCell instanceof HTMLElement)) return;
  const originalHtml = targetCell.dataset.editingOriginalHtml || "";
  targetCell.innerHTML = originalHtml;
  targetCell.classList.remove("is-cell-editing");
  delete targetCell.dataset.editingOriginalHtml;
  delete targetCell.dataset.editingOriginalText;
  articleListEditState.active = false;
  articleListEditState.cell = null;
}

function commitArticleCellEdit(options = {}) {
  const cell = options.sourceCell || articleListEditState.cell;
  if (!(cell instanceof HTMLElement)) return;
  const entryId = String(
    cell.getAttribute("data-article-entry-id")
    || cell.closest("[data-article-entry-id]")?.getAttribute("data-article-entry-id")
    || "",
  ).trim();
  if (!entryId) {
    cancelArticleCellEdit(cell);
    return;
  }
  const item = findArticleListEditableItemById(entryId);
  if (!item) {
    cancelArticleCellEdit(cell);
    return;
  }
  const kind = String(cell.dataset.editKind || "");
  if (kind === "meta") {
    const input = cell.querySelector("input[data-article-edit-type='meta']");
    const label = String(input?.dataset.articleLabel || "");
    if (input instanceof HTMLInputElement && label) {
      const next = input.type === "date" ? fromDateInputValue(input.value) : input.value;
      setFieldRawValue(item, label, next);
      state.textDirty = true;
    }
  } else if (kind === "main") {
    const nameInput = cell.querySelector("input[data-article-edit-type='main-name']");
    if (nameInput instanceof HTMLInputElement) {
      item.name = String(nameInput.value || "");
      state.textDirty = true;
    }
    const pageInput = cell.querySelector("input[data-article-edit-type='main-pages']");
    if (pageInput instanceof HTMLInputElement) {
      applyEditableItemPageNumber(item, pageInput.value);
      state.textDirty = true;
    }
  }

  const move = String(options.move || "");
  const target = move ? findNextArticleEditableCell(cell, move) : null;
  renderArticleList();
  if (target) {
    const navCol = target.dataset.navCol || "";
    const entry = target.dataset.articleEntryId || "";
    const refreshed = findArticleCellByNav(entry, navCol);
    if (refreshed) startArticleCellEdit(refreshed, { preferSubfield: "name" });
  }
}

function applyEditableItemPageNumber(item, rawValue) {
  const parsedFloat = Number.parseFloat(String(rawValue || "1").trim());
  const parsed = Number.isFinite(parsedFloat) ? parsedFloat : 1;
  if (Object.hasOwn(item, "advancePages")) {
    item.advancePages = Math.max(1, Math.round(parsed));
    return;
  }
  item.pageExpr = String(Math.max(0.1, parsed));
  item.pages = evalPageExpr(item.pageExpr);
}

function findNextArticleEditableCell(cell, direction) {
  const table = articleListEditState.table || cell.closest("table");
  if (!(table instanceof HTMLElement)) return null;
  const row = cell.closest("tr");
  if (!(row instanceof HTMLElement)) return null;
  const rowCells = [...row.querySelectorAll("td.article-editable-cell")];
  const currentIndex = rowCells.indexOf(cell);
  if (direction === "left") return currentIndex > 0 ? rowCells[currentIndex - 1] : null;
  if (direction === "right") return currentIndex >= 0 && currentIndex < rowCells.length - 1 ? rowCells[currentIndex + 1] : null;
  if (direction !== "up" && direction !== "down") return null;

  const navCol = Number.parseInt(cell.dataset.navCol || "-1", 10);
  const rows = [...table.querySelectorAll("tbody tr")];
  const rowIndex = rows.indexOf(row);
  if (rowIndex < 0) return null;
  const step = direction === "up" ? -1 : 1;
  for (let i = rowIndex + step; i >= 0 && i < rows.length; i += step) {
    const candidateRow = rows[i];
    const editable = [...candidateRow.querySelectorAll("td.article-editable-cell")];
    if (editable.length === 0) continue;
    const exact = editable.find((node) => Number.parseInt(node.dataset.navCol || "-1", 10) === navCol);
    if (exact) return exact;
    const fallback = editable[editable.length - 1];
    if (fallback) return fallback;
  }
  return null;
}

function findArticleCellByNav(entryId, navCol) {
  const table = els.articleListContainer?.querySelector(".article-tree-table");
  if (!table) return null;
  return table.querySelector(`td.article-editable-cell[data-article-entry-id="${CSS.escape(String(entryId || ""))}"][data-nav-col="${CSS.escape(String(navCol || ""))}"]`);
}

function findArticleListEditableItemById(entryId) {
  const id = String(entryId || "").trim();
  if (!id) return null;
  const inEntries = state.entries.find((item) => String(item?.id || "") === id);
  if (inEntries) return inEntries;
  const inHolds = (state.holdEntries || []).find((item) => String(item?.id || "") === id);
  if (inHolds) return inHolds;
  const inBetchoes = (state.betchoes || []).find((item) => String(item?.id || "") === id);
  if (inBetchoes) return inBetchoes;
  const inAddons = (state.addonEntries || []).find((item) => String(item?.id || "") === id);
  if (inAddons) return inAddons;
  return null;
}

function setFieldRawValue(item, label, rawValue) {
  if (!item || !label) return;
  if (!item.fieldValues || typeof item.fieldValues !== "object") item.fieldValues = {};
  item.fieldValues[label] = String(rawValue || "");
  const canon = canonicalFieldByLabel(label);
  if (canon === "deadline") item.deadline = String(rawValue || "");
  if (canon === "status") item.status = String(rawValue || "");
  if (canon === "memo") item.memo = String(rawValue || "");
}

function bindArticleHoverHighlights() {
  const table = els.articleListContainer?.querySelector(".article-tree-table");
  if (!table) return;

  const clearHighlights = () => {
    table.querySelectorAll(".is-article-hover").forEach((el) => {
      el.classList.remove("is-article-hover");
    });
  };

  const applyHighlights = (rawIds) => {
    const activeIds = new Set(uniqueArticleIds(String(rawIds || "").split(/\s+/)));
    clearHighlights();
    if (activeIds.size === 0) return;
    table.querySelectorAll("[data-article-entry-id]").forEach((el) => {
      if (activeIds.has(el.dataset.articleEntryId || "")) {
        el.classList.add("is-article-hover");
      }
    });
  };

  table.addEventListener("mouseover", (ev) => {
    const target = ev.target.closest("[data-article-hover-ids]");
    if (!target || !table.contains(target)) {
      clearHighlights();
      return;
    }
    applyHighlights(target.dataset.articleHoverIds);
  });

  table.addEventListener("mouseleave", clearHighlights);
}

function bindArticleColumnResize() {
  const table = els.articleListContainer?.querySelector(".article-tree-table");
  if (!table) return;
  const headers = table.querySelectorAll("thead th");
  const cols = table.querySelectorAll("colgroup col");
  if (headers.length <= 1 || cols.length !== headers.length) return;

  const applyWidths = (nextWidths, persist = true) => {
    const labels = getArticleDisplayFieldLabels();
    const normalized = normalizeArticleColumnWidths(nextWidths, labels);
    for (let i = 0; i < cols.length; i += 1) {
      cols[i].style.width = `${normalized[i]}%`;
    }
    if (persist) {
      state.articleListColumnWidths = normalized;
      state.meta.articleListColumnWidths = normalized;
      state.rawText = upsertArticleListWidthsLine(state.rawText || "", normalized);
      state.textDirty = true;
    }
  };

  const readWidths = () => {
    const current = [];
    for (const col of cols) {
      const raw = Number.parseFloat(String(col.style.width || "").replace("%", ""));
      current.push(Number.isFinite(raw) ? raw : 0);
    }
    return normalizeArticleColumnWidths(current, getArticleDisplayFieldLabels());
  };

  headers.forEach((th, idx) => {
    if (idx >= headers.length - 1) return;
    const handle = document.createElement("span");
    handle.className = "col-resize-handle";
    handle.title = LOCALE === "en" ? "Drag to resize columns" : "ドラッグで列幅を変更";
    let startX = 0;
    let startWidths = [];

    const onPointerMove = (ev) => {
      const tableWidth = Math.max(1, table.getBoundingClientRect().width);
      const deltaPct = ((ev.clientX - startX) / tableWidth) * 100;
      const left = startWidths[idx] || 0;
      const right = startWidths[idx + 1] || 0;
      const min = ARTICLE_COL_MIN_WIDTH_PCT;
      const nextLeft = Math.min(left + right - min, Math.max(min, left + deltaPct));
      const nextRight = left + right - nextLeft;
      const next = [...startWidths];
      next[idx] = nextLeft;
      next[idx + 1] = nextRight;
      applyWidths(next, true);
    };

    const stopDrag = () => {
      document.body.classList.remove("is-resizing-columns");
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", stopDrag);
      window.removeEventListener("pointercancel", stopDrag);
    };

    handle.addEventListener("pointerdown", (ev) => {
      if (ev.button !== 0) return;
      startX = ev.clientX;
      startWidths = readWidths();
      document.body.classList.add("is-resizing-columns");
      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", stopDrag);
      window.addEventListener("pointercancel", stopDrag);
      ev.preventDefault();
    });

    th.appendChild(handle);
  });
}

function csvEscape(value) {
  const text = String(value ?? "");
  if (/[",\r\n]/.test(text)) {
    return `"${text.replaceAll("\"", "\"\"")}"`;
  }
  return text;
}

function downloadArticleCsv() {
  const header = [
    LOCALE === "en" ? "Level" : "階層",
    LOCALE === "en" ? "Article" : "記事",
    LOCALE === "en" ? "Pages" : "頁",
    ...getArticleDisplayFieldLabels(),
  ];
  const rows = buildArticleListRows();
  const csvLines = [
    header.map(csvEscape).join(","),
    ...rows.map((row) =>
      [
        row.level,
        row.name,
        row.pages,
        ...(row.metaValues || []),
      ].map(csvEscape).join(","),
    ),
  ];
  const csvText = `\uFEFF${csvLines.join("\r\n")}\r\n`;
  const blob = new Blob([csvText], { type: "text/csv;charset=utf-8;" });
  const now = new Date();
  const ts = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("") + String(now.getHours()).padStart(2, "0") + String(now.getMinutes()).padStart(2, "0");
  const filename = `${state.meta.filename || "daiwari"}_article_list_${ts}.csv`;
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

function serializeState() {
  const m = state.meta;
  const labels = getArticleFieldLabels();
  const dataLabels = getArticleDataFieldLabels(labels);
  const addonDataLabels = getArticleDataFieldLabels(getAddonFieldLabelsRaw());
  const fieldTokens = (item) =>
    dataLabels.map((label) => {
      const raw = getFieldRawValue(item, label);
      const canon = canonicalFieldByLabel(label);
      if (canon === "desk" || canon === "editors" || canon === "writers") {
        return raw || "-";
      }
      return raw || "";
    });
  const fieldTokensAddon = (item) =>
    addonDataLabels.map((label) => {
      const raw = getFieldRawValue(item, label);
      const canon = canonicalFieldByLabel(label);
      if (canon === "desk" || canon === "editors" || canon === "writers") {
        return raw || "-";
      }
      return raw || "";
    });
  const lines = [];
  if (m.shareId) lines.push(`//${headByCanon("share-id")}\t${m.shareId}`);
  if (m.syncEndpoint) lines.push(`//${headByCanon("sync-endpoint")}\t${m.syncEndpoint}`);
  lines.push(
    `//${headByCanon("filename")}\t${m.filename || "daiwari"}`,
    `//${headByCanon("title")}\t${m.title || ""}`,
    `//${headByCanon("trim-size")}\t${getEffectiveTrimSizeText(m)}`,
    `//${headByCanon("opening")}\t${m.opening === "right" ? (LOCALE === "en" ? "right" : "右") : (LOCALE === "en" ? "left" : "左")}`,
    `//${headByCanon("pages")}\t${m.pagesExpr || formatPagesValue(m.pages || 0)}`,
    `//${headByCanon("planned")}\t${m.planned || ""}`,
    `//${headByCanon("version")}\t${m.version || ""}`,
    `//${headByCanon("writer")}\t${m.writer || ""}`,
    `//${headByCanon("start-page")}\t${m.startPage || 1}`,
    ...(resolveBodyFolioStart(m) !== 1 ? [`//${headByCanon("body-folio-start")}\t${resolveBodyFolioStart(m)}`] : []),
    `//${headByCanon("article-fields")}\t${labels.join("\t")}`,
  );
  if (state.tocArticleFieldLabels != null) {
    const t = normalizeArticleFieldLabels(state.tocArticleFieldLabels);
    const a = getArticleFieldLabels();
    if (JSON.stringify(t) !== JSON.stringify(a)) {
      lines.push(`//${headByCanon("toc-article-fields")}\t${t.join("\t")}`);
    }
  }
  lines.push(`//${headByCanon("article-list-widths")}\t${getArticleColumnWidths().map((w) => (Math.round(w * 100) / 100)).join("\t")}`);
  lines.push(formatImpositionPrintDirectiveLine(m));
  for (const board of state.boardDirectives || []) {
    const parts = [`//${headByCanon("board")}`, String(board.boardNo)];
    if (board.hasFormat && board.format) parts.push(board.format);
    if (board.hasPages && board.pages > 0) parts.push(String(board.pages));
    lines.push(parts.join("\t"));
  }
  if (m.printShop) lines.push(`//${headByCanon("print-shop")}\t${m.printShop}`);
  if (m.circulationLabel || m.circulationMemo) {
    lines.push(`//${headByCanon("circulation")}\t${m.circulationLabel || ""}\t${m.circulationMemo || ""}`);
  }
  if (m.distName || m.distDate || m.distMemo) {
    lines.push(`//${headByCanon("distribution-event")}\t${m.distName || ""}\t${m.distDate || ""}\t${m.distMemo || ""}`);
  }
  if (m.staffLine) lines.push(`//${headByCanon("staff-line")}\t${m.staffLine}`);
  if (m.submissionDate) {
    const days = daysFromTodayToDate(m.submissionDate);
    const memo = Number.isFinite(days)
      ? (LOCALE === "en" ? `${days} day(s) left` : `あと ${days} 日`)
      : (m.submissionMemo || "");
    lines.push(`//${headByCanon("submission-date")}\t${m.submissionDate}\t${memo}`);
  }

  const pushNotes = (obj) => {
    for (const ln of obj.attachedInlineNotes || []) lines.push(ln);
  };

  for (const e of state.entries) {
    const head = headByCanon(e.level);
    const fields = [
      `//${head}`,
      e.pageExpr,
      e.name,
      ...fieldTokens(e),
    ];
    lines.push(`${levelIndent(e.level)}${fields.join("\t")}`);
    pushNotes(e);
  }
  for (const h of state.holdEntries || []) {
    const fields = [
      `//${headByCanon("hold")}`,
      h.pageExpr,
      h.name,
      ...fieldTokens(h),
    ];
    lines.push(fields.join("\t"));
    pushNotes(h);
  }
  for (const b of state.betchoes) {
    const fields = [
      `//${headByCanon("betcho")}`,
      String(b.boardNo),
      String(b.advancePages),
      b.name,
      ...fieldTokens(b),
    ];
    lines.push(fields.join("\t"));
    pushNotes(b);
  }
  for (const addon of state.addonEntries || []) {
    const fields = [
      `//${headByCanon(addon.kind)}`,
      addon.pageExpr || formatPagesValue(addon.pages || 0),
      ...fieldTokensAddon(addon),
    ];
    lines.push(fields.join("\t"));
    pushNotes(addon);
  }
  if (state.commentLines.length > 0) {
    lines.push(...state.commentLines);
  }
  if (state.holdLines.length > 0) {
    lines.push(...state.holdLines);
  }
  for (const rl of m.revisionLogLines || []) {
    if (rl) lines.push(rl);
  }
  return `${lines.join("\n")}\n`;
}

function readMetaFilenameFromText(text) {
  if (typeof text !== "string" || text.length === 0) return "";
  const lines = text.split(/\r?\n/);
  for (const lineRaw of lines) {
    const line = lineRaw.trimStart();
    let body = "";
    if (line.startsWith("//")) body = line.slice(2).trim();
    else if (line.startsWith("/")) body = line.slice(1).trim();
    else continue;
    const tokens = parseLineTokens(body);
    if (tokens.length === 0) continue;
    if (canonHead(tokens[0]) === "filename") {
      return tokens.slice(1).join("\t").trim();
    }
  }
  return "";
}

function readMetaVersionFromText(text) {
  if (typeof text !== "string" || text.length === 0) return "";
  const lines = text.split(/\r?\n/);
  for (const lineRaw of lines) {
    const line = lineRaw.trimStart();
    let body = "";
    if (line.startsWith("//")) body = line.slice(2).trim();
    else if (line.startsWith("/")) body = line.slice(1).trim();
    else continue;
    const tokens = parseLineTokens(body);
    if (tokens.length === 0) continue;
    if (canonHead(tokens[0]) === "version") {
      return (tokens[1] || "").trim();
    }
  }
  return "";
}

function sanitizeFileName(value) {
  return String(value || "")
    .replace(/\.(txt|dwml)$/i, "")
    .replace(/[<>:"/\\|?*\u0000-\u001f]/g, "_")
    .replace(/[. ]+$/g, "")
    .trim();
}

function sanitizeVersionForFileName(value) {
  return sanitizeFileName(
    String(value || "")
      // Keep version human-readable while avoiding dot-heavy names like v0.1.
      .replace(/\./g, "_")
      .replace(/\s+/g, "-"),
  );
}

function resolveDownloadBaseName(text, fallbackName = "", fallbackVersion = "") {
  const rawFromText = readMetaFilenameFromText(text);
  const safeFromText = sanitizeFileName(rawFromText);
  const versionRaw = readMetaVersionFromText(text) || String(fallbackVersion || "").trim();
  const safeVersion = sanitizeVersionForFileName(versionRaw);
  const withVersion = (name) => (safeVersion ? `${name}_v${safeVersion}` : name);
  if (safeFromText) {
    if (safeFromText !== rawFromText) {
      return {
        baseName: withVersion(safeFromText),
        notice: LOCALE === "en"
          ? `The //filename value contained unsupported characters, so it was saved as "${safeFromText}".`
          : `//台割ファイル名 に使えない文字が含まれていたため、「${safeFromText}」として保存しました。`,
      };
    }
    return { baseName: withVersion(safeFromText), notice: "" };
  }
  const safeFallback = sanitizeFileName(fallbackName) || "daiwari";
  return {
    baseName: withVersion(safeFallback),
    notice: LOCALE === "en"
      ? `//filename is missing or invalid, so "${safeFallback}" was used.`
      : `//台割ファイル名 が未指定または不正なため、「${safeFallback}」を使用しました。`,
  };
}

function clampBoardWidthRatio(value) {
  return Math.min(BOARD_WIDTH_MAX_RATIO, Math.max(BOARD_WIDTH_MIN_RATIO, value));
}

function applyBoardWidthRatio(value, persist = true) {
  const ratio = clampBoardWidthRatio(value);
  document.documentElement.style.setProperty("--boards-display-width", `${Math.round(ratio * 1000) / 10}%`);
  if (persist) localStorage.setItem(BOARD_WIDTH_KEY, String(ratio));
  updateBoardWidthHandlePosition();
}

function applyBoardWidthFromStorage() {
  const stored = Number.parseFloat(localStorage.getItem(BOARD_WIDTH_KEY) || "");
  const ratio = Number.isFinite(stored) ? stored : BOARD_WIDTH_MAX_RATIO;
  applyBoardWidthRatio(ratio, false);
}

function bindBoardWidthHandle() {
  const handle = els.boardWidthHandle;
  if (!handle) return;
  let dragging = false;
  let startX = 0;
  let startRatio = BOARD_WIDTH_MAX_RATIO;

  const onPointerMove = (ev) => {
    if (!dragging) return;
    const base = Math.max(1, window.innerWidth);
    let deltaRatio = (ev.clientX - startX) / base;
    if (state.meta.opening === "right") {
      deltaRatio = -deltaRatio;
    }
    applyBoardWidthRatio(startRatio + deltaRatio);
  };

  const stopDragging = () => {
    if (!dragging) return;
    dragging = false;
    document.body.classList.remove("is-resizing-board-width");
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", stopDragging);
    window.removeEventListener("pointercancel", stopDragging);
  };

  handle.addEventListener("pointerdown", (ev) => {
    if (ev.button !== 0) return;
    dragging = true;
    startX = ev.clientX;
    startRatio = Number.parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue("--boards-display-width"),
    ) / 100 || BOARD_WIDTH_MAX_RATIO;
    document.body.classList.add("is-resizing-board-width");
    handle.setPointerCapture(ev.pointerId);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", stopDragging);
    window.addEventListener("pointercancel", stopDragging);
    ev.preventDefault();
  });
}

function updateBoardWidthHandlePosition() {
  const handle = els.boardWidthHandle;
  const boards = els.boards;
  const main = els.main;
  if (!handle || !boards || !main) return;
  const firstBoard = boards.querySelector(".board");
  if (!firstBoard) {
    handle.style.left = "50%";
    handle.dataset.centered = "1";
    handle.classList.remove("is-left-edge");
    return;
  }
  const isRightOpening = state.meta.opening === "right";
  const mainRect = main.getBoundingClientRect();
  const boardRect = firstBoard.getBoundingClientRect();
  const relativeLeft = isRightOpening
    ? Math.max(0, boardRect.left - mainRect.left + 8)
    : Math.max(0, boardRect.right - mainRect.left - 8);
  handle.style.left = `${relativeLeft}px`;
  handle.dataset.centered = "0";
  handle.classList.toggle("is-left-edge", isRightOpening);
}

function downloadText(text, baseName = "", extension = ".dwml") {
  const now = new Date();
  const ts = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("") + String(now.getHours()).padStart(2, "0") + String(now.getMinutes()).padStart(2, "0");
  const safeBaseName = sanitizeFileName(baseName) || "daiwari";
  const ext = String(extension || ".dwml").trim();
  const extNorm = ext.startsWith(".") ? ext : `.${ext}`;
  const filename = `${safeBaseName}_${ts}${extNorm}`;
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}
