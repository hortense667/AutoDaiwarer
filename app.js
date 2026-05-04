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
const REMOTE_SYNC_TIMEOUT_MS = 7000;
const BUG_REPORT_MAX_MESSAGE_LENGTH = 2000;
const BUG_REPORT_CLIENT_ID_KEY = "autodaiwarer.bug-report.client-id";
const BUG_REPORT_EMAIL_KEY = "autodaiwarer.bug-report.email";
const BUG_REPORT_MIN_INTERVAL_MS = 15000;
const BUG_REPORT_DUPLICATE_WINDOW_MS = 10 * 60 * 1000;
const BANNER_ROTATE_MS = 8000;
const BANNER_FADE_MS = 260;
const BANNER_SP_MEDIA = "(max-width: 640px)";
const SITE_GATE_ENDPOINT = "/api/session";
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
const LOCAL_KEY = `${LOCAL_KEY_BASE}.${LOCALE}`;
const SHARE_BACKUP_KEY_BASE = "autodaiwarer.share-backups";
const SYNC_INTRO_SHOWN_KEY_BASE = "autodaiwarer.sync.intro-shown";
const BOARD_WIDTH_KEY = "autodaiwarer.board-width-ratio";
const BOARD_WIDTH_MIN_RATIO = 0.45;
const BOARD_WIDTH_MAX_RATIO = 1;
const SEARCH_HIT_CLASS = "search-hit";
const EDITOR_WRAP_KEY = "autodaiwarer.editor-wrap";
const DEFAULT_ARTICLE_FIELD_LABELS_JA = ["ページ数", "記事名", "デスク", "編集担当", "筆者", "締め切り", "ステータス", "メモ"];
const DEFAULT_ARTICLE_FIELD_LABELS_EN = ["Pages", "Article", "Desk", "Editor", "Writer", "Deadline", "Status", "Memo"];
const ARTICLE_COL_MIN_WIDTH_PCT = 4;
const LEVEL_LIKE_HEADS = new Set(["小", "中", "大", "保留", "small", "middle", "large", "hold"]);
const LINE_HEAD_CANDIDATES_JA = [
  "小\t", "中\t", "大\t", "台\t", "別丁\t", "表紙\t", "帯\t", "カバー\t", "付録\t", "台割ファイル名\t", "書名\t", "開き\t", "ページ数\t", "刊行予定\t", "版\t", "記入者\t", "開始ページ番号\t", "記事項目設定\t", "目次項目設定\t", "保留\t", "更新履歴\t", "コメント\t", "印刷所\t", "刷数\t", "頒布イベント\t", "スタッフ\t", "入稿日\t", "*",
];
const LINE_HEAD_CANDIDATES_EN = [
  "small\t", "middle\t", "large\t", "board\t", "insert\t", "hyoshi\t", "obi\t", "cover\t", "appendix\t", "filename\t", "title\t", "opening\t", "pages\t", "planned\t", "version\t", "writer\t", "start-page\t", "article-fields\t", "hold\t", "changelog\t", "note\t", "print-shop\t", "circulation\t", "distribution-event\t", "staff\t", "submission-date\t", "*",
];
const LINE_HEAD_CANDIDATES = LOCALE === "en" ? LINE_HEAD_CANDIDATES_EN : LINE_HEAD_CANDIDATES_JA;
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
  "記事項目設定": "article-fields",
  "目次項目設定": "article-fields",
  "article-fields": "article-fields",
  articlefields: "article-fields",
  "記事一覧カラム幅": "article-list-widths",
  "article-list-widths": "article-list-widths",
  articlelistwidths: "article-list-widths",
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
    opening: "開き",
    pages: "ページ数",
    planned: "刊行予定",
    version: "版",
    writer: "記入者",
    "start-page": "開始ページ番号",
    "article-fields": "記事項目設定",
    "article-list-widths": "記事一覧カラム幅",
    hold: "保留",
    "revision-log": "更新履歴",
    "inline-note": "コメント",
    "print-shop": "印刷所",
    circulation: "刷数",
    "distribution-event": "頒布イベント",
    "staff-line": "スタッフ",
    "submission-date": "入稿日",
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
    opening: "opening",
    pages: "pages",
    planned: "planned",
    version: "version",
    writer: "writer",
    "start-page": "start-page",
    "article-fields": "article-fields",
    "article-list-widths": "article-list-widths",
    hold: "hold",
    "revision-log": "changelog",
    "inline-note": "note",
    "print-shop": "print-shop",
    circulation: "circulation",
    "distribution-event": "distribution-event",
    "staff-line": "staff",
    "submission-date": "submission-date",
  },
};
const ADDON_SPECS = {
  hyoshi: { pages: 4, labelJa: "表紙", labelEn: "Jacket" },
  obi: { pages: 4, labelJa: "帯", labelEn: "Obi" },
  cover: { pages: 4, labelJa: "カバー", labelEn: "Cover" },
  appendix: { pages: 1, labelJa: "付録", labelEn: "Appendix" },
};
const EDITOR_SAMPLE_TEXT = DEFAULT_TEXT;
const EDITOR_SAMPLE_TEXT_EN = DEFAULT_TEXT_EN;

const state = {
  meta: {},
  articleFieldLabels: [],
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
  articleListCascade: true,
  syncStatusText: "",
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
  replaceStart: 0,
  replaceEnd: 0,
  appendSpace: false,
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
  editorCandidate: document.querySelector("#editorCandidate"),
  editorWrapToggle: document.querySelector("#editorWrapToggle"),
  editorSearchInput: document.querySelector("#editorSearchInput"),
  searchNextBtn: document.querySelector("#searchNextBtn"),
  searchPrevBtn: document.querySelector("#searchPrevBtn"),
  insertSampleBtn: document.querySelector("#insertSampleBtn"),
  restoreBackupBtn: document.querySelector("#restoreBackupBtn"),
  recalcPagesBtn: document.querySelector("#recalcPagesBtn"),
  boardWidthHandle: document.querySelector("#boardWidthHandle"),
};

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
  const defaultText = LOCALE === "en" ? DEFAULT_TEXT_EN : DEFAULT_TEXT;
  if (typeof driveText === "string" && driveText.trim().length > 0) {
    loadFromText(driveText);
  }
  else {
    loadFromText(stored || defaultText);
  }
  persistNormalizedStateTextToLocal();
  scrubBootstrapParamsFromBrowserUrl();
  bindUI();
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
    return {
      ok: true,
      message: "",
      uiTheme: uiTheme || undefined,
      driveFileId: driveFileId || undefined,
      bugReportEndpoint: bugReportEndpoint || undefined,
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
  // DEML proposal introduces section lines where visual indentation is editorial context,
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

function getEditorSampleText() {
  return LOCALE === "en" ? EDITOR_SAMPLE_TEXT_EN : EDITOR_SAMPLE_TEXT;
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
  setText("#editBtn", "Input / Edit");
  setText("#topPrintBtn", "Print");
  setText("#listBtn", "Article List");
  setText("#helpBtn", "Help");
  setText("#editorTitle", "Daiwari Editor");
  setText("#pickFileBtn", "Load from file");
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
  setText("#saveBtn", "Save");
  const searchInput = document.querySelector("#editorSearchInput");
  if (searchInput) searchInput.placeholder = "Search text";
  setText("#articleDialog h3", "Article List");
  setText("#csvBtn", "Export CSV");
  setText("#printBtn", "Print");
  setText("#closeListBtn", "Close");
  setText("#helpDialog h3", "How to Use");
  setText("#openBugReportBtn", "Send a bug report");
  setText("#closeHelpBtn", "Close");
  setText("#bugReportDialog h3", "Bug Report");
  setText("#cancelBugReportBtn", "Cancel");
  setText("#submitBugReportBtn", "Submit");
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
    editorHelp.textContent = "Assist mode: type // on an empty line, choose with Up/Down, confirm with Space or Right Arrow, end with Enter.";
  }
  const helpBody = document.querySelector("#helpDialog .help-body");
  if (helpBody) {
    helpBody.innerHTML = `
      <h4>Board View</h4>
      <p>Top row = Large, middle row = Middle, bottom row = Small. White = normal, pink = over, light blue = under.</p>
      <p>For right opening, pages run right-to-left.</p>
      <h4>Hold Articles</h4>
      <p><code>//hold ...</code> can be placed anywhere in the input. Hold items are excluded from normal board calculation and shown after a one-board blank gap.</p>
      <p>Each hold article is rendered as one board. Left box shows <code>hold</code> and serial number.</p>
      <h4>Input Format</h4>
      <p>Each line starts with <code>//</code> and fields must be TAB-separated. Example: <code>//middle\t2\tarticle\tdesk\teditor\twriter\t2026/05/01\tstatus\tmemo</code></p>
      <p><code>//pages</code> accepts expressions like <code>16*8+6</code>.</p>
      <p>Page values accept one decimal place (0.1-page unit). Use this when an article changes in the middle of a page (example: <code>//small\t3.5\tarticle...</code>).</p>
      <p>If an article contains an in-article column, you can manage it as a separate row for pagination convenience (main article + column), even when the actual layout position is inside the main article.</p>
      <p>Hierarchy does not need to always reach small level. Large-only and middle-only entries are valid. If a small item appears directly under a large item, an unnamed middle node is auto-generated internally.</p>
      <h4>Assist Mode</h4>
      <p><code>//hold</code> supports the same suggestions as <code>//large</code>/<code>//middle</code>/<code>//small</code>.</p>
      <p>For English UI, turn on the <code>English Mode</code> checkbox in the top bar (this reflects <code>?mode=en</code> in the URL). <code>Insert Sample</code> inserts English directives such as <code>//large</code>, <code>//board</code>, and <code>//insert</code>.</p>
      <h4>Server features (<code>/api/session</code> deployments)</h4>
      <p>Unlike opening static files offline, the hosted app calls <code>/api/session</code> using the address bar query string.</p>
      <ul>
        <li>Optional header/dialog styling activates only when <code>/api/session</code> returns <code>uiTheme</code> for a configured <code>mode</code> value (parsed on the server).</li>
        <li>To open from Google Drive plaintext, append <code>data=<i>your URL-encoded Drive file share URL</i></code>. Plain UTF-8 <code>.txt</code> matching the editor format is fetched via <code>/api/initial-data</code>. The Drive file must be readable with link access.</li>
        <li>After bootstrap, <code>mode</code> may be normalized in the address bar while behaviour continues. Keep links with <code>data</code>/<code>share</code>/<code>syncEndpoint</code> as needed.</li>
      </ul>
      <p>Optional collaborative sync uses <code>share</code> and <code>syncEndpoint</code> query params when needed.</p>
      <h4>Article List</h4>
      <p>Three hierarchy columns (Large/Middle/Small) plus meta columns (Desk/Editor/Writer/Deadline/Status/Memo). Includes inserts and hold items. Toggle <code>Cascade view</code> ON/OFF (default ON).</p>
      <h4>Sample Flatplan Files</h4>
      <p>Sample flatplan files are available on GitHub: <a href="https://github.com/hortense667/AutoDaiwarer" target="_blank" rel="noopener noreferrer">https://github.com/hortense667/AutoDaiwarer</a>.</p>
      <h4>Disclaimer</h4>
      <p>We cannot compensate for any damages arising from use of this software.</p>
      <p>We may not be able to answer all questions. Bug reports are welcome, but sufficient support may not always be available.</p>
      <h4>Related documents on GitHub</h4>
      <ul>
        <li><a href="https://github.com/hortense667/AutoDaiwarer/blob/main/README_AutoDaiwarer.md" target="_blank" rel="noopener noreferrer"><code>README_AutoDaiwarer.md</code></a>: project overview and quick start (feature outline and basic operations)</li>
        <li><a href="https://github.com/hortense667/AutoDaiwarer/blob/main/USAGE.md" target="_blank" rel="noopener noreferrer"><code>USAGE.md</code></a>: full usage guide including input format, editor workflow, and sync behavior</li>
        <li><a href="https://github.com/hortense667/AutoDaiwarer/blob/main/deml-proposal.md" target="_blank" rel="noopener noreferrer"><code>deml-proposal.md</code></a>: DEML background and proposal with section-line sample</li>
      </ul>
    `;
  }
}

function bindUI() {
  enableDialogDrag(els.editorDialog, "textarea, button, input, select, .dialog-actions");
  bindEditorAssist(els.editorText);
  bindEditorSearch();
  bindBugReportUI();
  if (els.restoreBackupBtn) {
    els.restoreBackupBtn.classList.toggle("hidden", !isShareEditorMode());
  }
  const cancelEditorDialog = () => {
    els.editorText.value = state.editorSnapshotText;
    clearEditorAssist();
    els.editorDialog.close();
  };
  bindDialogBackdropCancel(els.editorDialog, cancelEditorDialog);
  bindDialogBackdropCancel(els.articleDialog, () => {
    els.articleDialog.close();
  });
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
    clearEditorAssist();
    refreshEditorAssist(els.editorText);
    els.editorDialog.showModal();
  });

  document.querySelector("#saveBtn").addEventListener("click", () => {
    const text = normalizeEditorDirectiveText(els.editorText.value);
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
        if (!okToClear) return;
        createShareBackup("before-clear-save", state.rawText || backupSource);
      } else if (beforeTrimmed && backupSource !== text) {
        createShareBackup("before-save", backupSource);
      }
    }
    try {
      loadFromText(text);
      els.editorText.value = text;
      state.editorSnapshotText = text;
      state.rawText = text;
      state.textDirty = false;
      localStorage.setItem(LOCAL_KEY, text);
      const fileNameInfo = resolveDownloadBaseName(text, state.meta.filename);
      if (fileNameInfo.notice) window.alert(fileNameInfo.notice);
      downloadText(text, fileNameInfo.baseName);
      clearEditorAssist();
      refreshEditorAssist(els.editorText);
    } catch (error) {
      console.error(error);
      const saveAnyway = window.confirm(
        LOCALE === "en"
          ? "The input format seems invalid and cannot be rendered. Save only as text file?"
          : "入力形式に問題があり再描画できません。テキスト保存のみ行いますか？",
      );
      if (!saveAnyway) return;
      localStorage.setItem(LOCAL_KEY, text);
      const fileNameInfo = resolveDownloadBaseName(text, state.meta.filename);
      if (fileNameInfo.notice) window.alert(fileNameInfo.notice);
      downloadText(text, fileNameInfo.baseName);
      state.editorSnapshotText = text;
    }
  });

  document.querySelector("#cancelEditBtn").addEventListener("click", () => {
    cancelEditorDialog();
  });

  els.pickFileBtn?.addEventListener("click", () => {
    els.fileLoader?.click();
  });

  els.fileLoader?.addEventListener("change", () => {
    const file = els.fileLoader.files?.[0];
    if (!file) return;
    file.text().then((text) => {
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
      els.editorText.value = text;
      clearEditorAssist();
      refreshEditorAssist(els.editorText);
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

  document.querySelector("#listBtn").addEventListener("click", () => {
    renderArticleList();
    els.articleDialog.showModal();
  });

  document.querySelector("#helpBtn").addEventListener("click", () => {
    resetHelpDialogScroll();
    els.helpDialog.showModal();
  });
  document.querySelector("#openBugReportBtn")?.addEventListener("click", () => {
    openBugReportDialog();
  });

  document.querySelector("#topPrintBtn").addEventListener("click", () => {
    document.body.classList.remove("print-article-list");
    window.print();
  });

  document.querySelector("#closeListBtn").addEventListener("click", () => {
    els.articleDialog.close();
  });

  document.querySelector("#closeHelpBtn").addEventListener("click", () => {
    els.helpDialog.close();
  });

  document.querySelector("#printBtn").addEventListener("click", () => {
    printArticleList();
  });

  document.querySelector("#csvBtn").addEventListener("click", () => {
    downloadArticleCsv();
  });
  bindBoardWidthHandle();
  window.addEventListener("resize", updateBoardWidthHandlePosition);
  updateBoardWidthHandlePosition();
}

function isEditorWrapEnabled() {
  const saved = localStorage.getItem(EDITOR_WRAP_KEY);
  if (saved === "off") return false;
  return true;
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
  document.body.classList.add("print-article-list");
  const cleanup = () => {
    document.body.classList.remove("print-article-list");
    if (els.printArticleSheet) els.printArticleSheet.innerHTML = "";
  };
  window.addEventListener("afterprint", cleanup, { once: true });
  window.print();
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

  textarea.addEventListener("keydown", (ev) => {
    if (ev.ctrlKey && !ev.altKey && !ev.metaKey && !ev.shiftKey) {
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
      const before = textarea.value.slice(0, start);
      const after = textarea.value.slice(end);
      textarea.value = `${before}\t${after}`;
      const nextPos = before.length + 1;
      textarea.setSelectionRange(nextPos, nextPos);
      refreshEditorAssist(textarea);
      ev.preventDefault();
      return;
    }

    if (ev.key === "Enter" && editorAssistState.sessionActive) {
      clearEditorAssist();
      return;
    }

    const active = editorAssistState.active;
    if (!active) return;
    if (ev.key === "ArrowDown") {
      if (editorAssistState.type === "page-number") {
        stepPageCandidate(-1);
      } else {
        rotateEditorCandidate(1);
      }
      ev.preventDefault();
      return;
    }
    if (ev.key === "ArrowUp") {
      if (editorAssistState.type === "page-number") {
        stepPageCandidate(1);
      } else {
        rotateEditorCandidate(-1);
      }
      ev.preventDefault();
      return;
    }
    if (ev.key === " " || ev.key === "ArrowRight") {
      acceptEditorCandidate(textarea);
      ev.preventDefault();
      return;
    }
  });

  textarea.addEventListener("input", () => {
    refreshEditorAssist(textarea);
  });

  textarea.addEventListener("click", () => {
    refreshEditorAssist(textarea);
  });

  textarea.addEventListener("keyup", (ev) => {
    if (ev.key === "ArrowDown" || ev.key === "ArrowUp") {
      refreshEditorAssist(textarea);
    }
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
  editorAssistState.replaceStart = 0;
  editorAssistState.replaceEnd = 0;
  editorAssistState.appendSpace = false;
  if (els.editorCandidate) {
    els.editorCandidate.textContent = "";
    els.editorCandidate.style.display = "none";
  }
}

function refreshEditorAssist(textarea) {
  syncEditorAssistSession(textarea);
  const next = buildEditorAssistContext(textarea);
  if (!next) {
    editorAssistState.active = false;
    editorAssistState.type = "";
    editorAssistState.candidates = [];
    editorAssistState.index = 0;
    editorAssistState.numericValue = 1;
    editorAssistState.replaceStart = 0;
    editorAssistState.replaceEnd = 0;
    editorAssistState.appendSpace = false;
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
    const nextIndex = sameContext
      ? Math.min(editorAssistState.index, Math.max(0, next.candidates.length - 1))
      : 0;
    editorAssistState.active = true;
    editorAssistState.type = next.type;
    editorAssistState.candidates = next.candidates;
    editorAssistState.index = nextIndex;
    editorAssistState.numericValue = next.numericValue ?? editorAssistState.numericValue;
    editorAssistState.replaceStart = next.replaceStart;
    editorAssistState.replaceEnd = next.replaceEnd;
    editorAssistState.appendSpace = next.appendSpace;
    renderEditorCandidate(textarea);
  }
}

function renderEditorCandidate(textarea = els.editorText) {
  if (!els.editorCandidate) return;
  if (!editorAssistState.active || editorAssistState.candidates.length === 0) {
    els.editorCandidate.textContent = "";
    els.editorCandidate.style.display = "none";
    return;
  }
  const picked = editorAssistState.candidates[editorAssistState.index];
  const caret = textarea?.selectionStart ?? 0;
  const pos = getTextareaCaretPixelPosition(textarea, caret);
  els.editorCandidate.textContent = picked;
  els.editorCandidate.style.left = `${Math.max(0, pos.left)}px`;
  els.editorCandidate.style.top = `${Math.max(0, pos.top)}px`;
  els.editorCandidate.style.display = "block";
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

function acceptEditorCandidate(textarea) {
  if (!editorAssistState.active || editorAssistState.candidates.length === 0) return;
  const picked = editorAssistState.candidates[editorAssistState.index];
  const suffix = editorAssistState.appendSpace ? "\t" : "";
  const before = textarea.value.slice(0, editorAssistState.replaceStart);
  const after = textarea.value.slice(editorAssistState.replaceEnd);
  const inserted = `${picked}${suffix}`;
  const nextCaret = before.length + inserted.length;
  textarea.value = `${before}${inserted}${after}`;
  textarea.setSelectionRange(nextCaret, nextCaret);
  refreshEditorAssist(textarea);
}

function buildEditorAssistContext(textarea) {
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
    return {
      type: "line-head",
      candidates: LINE_HEAD_CANDIDATES,
      replaceStart: caret,
      replaceEnd: caret,
      appendSpace: false,
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
  const parts = body.trim().length ? body.trim().split(/\t+/).filter(Boolean) : [];
  const endsWithSpace = /\t$/.test(body);
  const currentTokenIdx = endsWithSpace ? parts.length : Math.max(0, parts.length - 1);
  const prefix = endsWithSpace ? "" : (parts[parts.length - 1] || "");
  const boardValues = collectBoardDirectiveValues(fullText.slice(0, lineStart));
  let candidates = [];
  if (currentTokenIdx === 1) {
    const nextNo = Math.max(1, boardValues.maxBoardNo + 1);
    candidates = [String(nextNo)];
  } else if (currentTokenIdx === 2) {
    candidates = boardValues.formats;
  } else if (currentTokenIdx === 3) {
    candidates = boardValues.pages;
  } else {
    return null;
  }
  const filtered = candidates.filter((item) => item.startsWith(prefix));
  if (filtered.length === 0) return null;
  return {
    type: `board-${currentTokenIdx}`,
    candidates: filtered,
    replaceStart: caret - prefix.length,
    replaceEnd: caret,
    appendSpace: true,
  };
}

function collectBoardDirectiveValues(text) {
  const formats = new Set(["4C", "1C"]);
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
  if (!/^(小|中|大|保留|small|middle|large|hold)(\t|$)/i.test(body)) return null;

  const parts = body.trim().length ? body.trim().split(/\t+/).filter(Boolean) : [];
  const endsWithSpace = /\t$/.test(body);
  const currentTokenIdx = endsWithSpace ? parts.length : Math.max(0, parts.length - 1);
  if (currentTokenIdx === 1) {
    const typed = endsWithSpace ? "" : (parts[parts.length - 1] || "");
    if (typed && !/^\d+$/.test(typed)) return null;
    if (typed) return null;
    return {
      type: "page-number",
      candidates: [String(editorAssistState.numericValue || 1)],
      numericValue: editorAssistState.numericValue || 1,
      replaceStart: caret,
      replaceEnd: caret,
      appendSpace: true,
    };
  }
  if (currentTokenIdx < 2) return null;

  const prefix = endsWithSpace ? "" : (parts[parts.length - 1] || "");
  const names = collectPeopleNames(fullText.slice(0, lineStart));
  const extra = collectLevelFieldValues(fullText.slice(0, lineStart));
  let pool = [];
  if (currentTokenIdx === 2) pool = extra.articleNames;
  else if (currentTokenIdx === 3) pool = names.desk;
  else if (currentTokenIdx === 4) pool = names.editors;
  else if (currentTokenIdx === 5) pool = names.writers;
  else if (currentTokenIdx === 6) pool = extra.deadlines;
  else if (currentTokenIdx === 7) pool = extra.statuses;
  else pool = extra.memos;
  const candidates = pool.filter((name) => name.startsWith(prefix));
  if (candidates.length === 0) return null;

  return {
    type: `people-${currentTokenIdx}`,
    candidates,
    replaceStart: caret - prefix.length,
    replaceEnd: caret,
    appendSpace: true,
  };
}

function collectPeopleNames(text) {
  const names = {
    desk: [],
    editors: [],
    writers: [],
  };
  const seen = {
    desk: new Set(),
    editors: new Set(),
    writers: new Set(),
  };

  const lines = text.split(/\r?\n/);
  for (const lineRaw of lines) {
    const line = lineRaw.trim();
    if (!line.startsWith("//")) continue;
    const body = line.slice(2).trim();
    const tokens = parseLineTokens(body);
    if (tokens.length < 6) continue;
    if (!LEVEL_LIKE_HEADS.has(tokens[0]) && !LEVEL_LIKE_HEADS.has(tokens[0].toLowerCase())) continue;
    collectPeopleInto(tokens[3], "desk", names, seen);
    collectPeopleInto(tokens[4], "editors", names, seen);
    collectPeopleInto(tokens[5], "writers", names, seen);
  }

  return names;
}

function collectLevelFieldValues(text) {
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

  const lines = text.split(/\r?\n/);
  for (const lineRaw of lines) {
    const line = lineRaw.trim();
    if (!line.startsWith("//")) continue;
    const body = line.slice(2).trim();
    const tokens = parseLineTokens(body);
    if (tokens.length < 3) continue;
    if (!LEVEL_LIKE_HEADS.has(tokens[0]) && !LEVEL_LIKE_HEADS.has(tokens[0].toLowerCase())) continue;

    collectUniqueValue(tokens[2], "articleNames", out, seen);
    if (tokens[6]) collectUniqueValue(tokens[6], "deadlines", out, seen);
    if (tokens[7]) collectUniqueValue(tokens[7], "statuses", out, seen);
    if (tokens.length >= 9) {
      collectUniqueValue(tokens.slice(8).join("\t"), "memos", out, seen);
    }
  }
  return out;
}

function collectUniqueValue(value, key, out, seen) {
  if (!value || value === "-") return;
  if (seen[key].has(value)) return;
  seen[key].add(value);
  out[key].push(value);
}

function collectPeopleInto(raw, key, names, seen) {
  if (!raw || raw === "-") return;
  const items = raw.split("|").map((x) => x.trim()).filter(Boolean);
  for (const item of items) {
    if (seen[key].has(item)) continue;
    seen[key].add(item);
    names[key].push(item);
  }
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
    if (lineText.trimStart() === "//" && caret === contentStart + 2) {
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
    const body = trimmed.slice(2).trim();
    const tokens = parseLineTokens(body);
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

function normalizeBoardFormat(raw) {
  if (!raw) return "";
  const m = String(raw).trim().match(/^(\d+)\s*[cC]$/);
  if (!m) return "";
  return `${Number.parseInt(m[1], 10)}C`;
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
    opening: "left",
    pages: 0,
    pagesExpr: "0",
    planned: "",
    version: "",
    writer: "",
    startPage: 1,
    articleFieldLabels: getDefaultArticleFieldLabels(),
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
  };
  const entries = [];
  const holdEntries = [];
  const addonEntries = [];
  const betchoes = [];
  const boardDirectives = [];
  const commentLines = [];
  const holdLines = [];

  let lastStructuralEntry = null;

  for (const lineRaw of lines) {
    const line = lineRaw.trimStart();
    if (!line.startsWith("//")) continue;
    const body = line.slice(2).trim();
    const tokens = parseLineTokens(body);
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
        holdEntries.push(holdEntry);
        lastStructuralEntry = holdEntry;
      }
      else holdLines.push(lineRaw);
      continue;
    }
    if (ADDON_SPECS[headCanon]) {
      const addonEntry = parseAddonEntryTokens(tokens, headCanon, meta.articleFieldLabels);
      if (addonEntry) {
        addonEntries.push(addonEntry);
        lastStructuralEntry = addonEntry;
      }
      continue;
    }
    if (headCanon === "filename") meta.filename = tokens.slice(1).join("\t");
    else if (headCanon === "title") meta.title = tokens.slice(1).join("\t");
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
    else if (headCanon === "article-fields") {
      meta.articleFieldLabels = normalizeArticleFieldLabels(tokens.slice(1));
    }
    else if (headCanon === "article-list-widths") {
      meta.articleListColumnWidths = parseArticleListColumnWidths(tokens.slice(1));
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
      const boardNo = Math.max(1, Number.parseInt(tokens[1], 10) || 1);
      const advancePages = Math.max(0, Number.parseInt(tokens[2], 10) || 0);
      const name = tokens[3] || "(別丁)";
      const articleFields = parseArticleFieldPayload(tokens, 4, meta.articleFieldLabels);
      const betchoRow = {
        id: crypto.randomUUID(),
        boardNo,
        advancePages,
        name,
        ...articleFields,
      };
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
      };
      entries.push(ent);
      lastStructuralEntry = ent;
    }
  }
  return { meta, entries, holdEntries, addonEntries, betchoes, boardDirectives, commentLines, holdLines };
}

function parseAddonEntryTokens(tokens, headCanon, fieldLabels) {
  const spec = ADDON_SPECS[headCanon];
  if (!spec) return null;
  const articleFields = parseArticleFieldPayload(tokens, 1, fieldLabels);
  return {
    id: crypto.randomUUID(),
    kind: headCanon,
    name: LOCALE === "en" ? spec.labelEn : spec.labelJa,
    pages: pagesToUnits(spec.pages),
    ...articleFields,
    anonymous: false,
  };
}

function parseHoldEntryLine(lineRaw, fieldLabels) {
  const line = lineRaw.trimStart();
  if (!line.startsWith("//")) return null;
  const body = line.slice(2).trim();
  const tokens = parseLineTokens(body);
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

  return { pages, usedPages: Math.ceil(usedUnits / PAGE_UNITS) };
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

function loadFromText(text) {
  const parsed = parseText(text);
  inheritPeople(parsed.entries);
  state.meta = parsed.meta;
  state.articleFieldLabels = normalizeArticleFieldLabels(parsed.meta?.articleFieldLabels);
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
  return `client-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
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

async function pollRemoteLatest(options = {}) {
  if (!remoteSyncState.enabled || remoteSyncState.isPolling) return false;
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
    if (hasDiff && shouldApply) {
      applyRemoteText(remoteText);
      remoteSyncState.appliedVersion = remoteVersion;
      remoteSyncState.lastSavedText = remoteText;
      notifyRemoteSync(
        LOCALE === "en"
          ? "Another user updated this data. Latest content has been applied."
          : "他のユーザーの更新を検知しました。最新内容を反映しました。",
      );
    }
    if (shouldApply && remoteVersion > remoteSyncState.appliedVersion) {
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

async function saveRemoteIfChanged() {
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
      notifyRemoteSync(
        LOCALE === "en"
          ? "Conflict detected. Newer remote content has priority and will be applied."
          : "競合を検知しました。新しい側の内容を優先して反映します。",
      );
      if (typeof data.text === "string" && data.text.length > 0) {
        applyRemoteText(data.text);
        remoteSyncState.lastSavedText = data.text;
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
  }
}

function renderBoards() {
  els.boards.innerHTML = "";
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
  const layoutResult = layout(state.entries, layoutMeta);
  const pages = layoutResult.pages;
  const usedPages = layoutResult.usedPages;
  const boardSpecs = buildBoardSpecs(pages.length, state.boardDirectives || []);
  const betchoByBoard = groupBetchoByBoard(state.betchoes);
  const advancePrefixByBoard = buildAdvancePrefixByBoard(state.betchoes, boardSpecs);
  const isRightOpening = state.meta.opening === "right";
  const visiblePagesPerBoard = 16;
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
    side.innerHTML = `
      <div class="board-no">${String(boardNo).padStart(2, "0")}</div>
      <div class="board-format">${formatBoardLabel(spec.format)}</div>
    `;

    const track = document.createElement("div");
    track.className = "page-track";
    track.style.gridTemplateColumns = `repeat(${pagesPerBoard}, minmax(0, 1fr))`;
    row.style.setProperty("--board-pages", String(pagesPerBoard));
    const chunk = pages.slice(spec.start, spec.start + dataPagesPerBoard);
    const chunkWithTailPadding = [
      ...chunk,
      ...Array.from({ length: Math.max(0, dataPagesPerBoard - chunk.length) }, () => undefined),
    ];
    const displayedChunk = isRightOpening ? [...chunkWithTailPadding].reverse() : chunkWithTailPadding;
    const slotGlobalIndex = (displayIdx) =>
      spec.start + (isRightOpening ? dataPagesPerBoard - 1 - displayIdx : displayIdx);
    const isContentFilled = (displayIdx) =>
      displayIdx >= 0 && displayIdx < dataPagesPerBoard && slotGlobalIndex(displayIdx) < usedPages;

    for (let idx = 0; idx < pagesPerBoard; idx += 1) {
      const isPaddingSlot = idx >= dataPagesPerBoard;
      const page = isPaddingSlot ? undefined : displayedChunk[idx];
      const globalPageIndex = isPaddingSlot ? -1 : slotGlobalIndex(idx);
      const isActualEndBoundaryLeft = !isPaddingSlot && !isRightOpening && isContentFilled(idx) && !isContentFilled(idx + 1);
      const isActualEndBoundaryRight = !isPaddingSlot && isRightOpening && isContentFilled(idx) && !isContentFilled(idx - 1);
      const slot = document.createElement("div");
      slot.className = "page-slot";

      const cell = document.createElement("div");
      cell.className = "page-cell";
      const number = document.createElement("div");
      number.className = "page-number";
      number.textContent = page ? String(page.pageNo + pageAdvanceBefore) : "";

      if (isPaddingSlot) {
        slot.classList.add("is-blank");
        slot.appendChild(cell);
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
        if (isActualEndBoundaryRight) row.classList.add("left-thick");

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
        addBoundaryMarkers(row, page?.boundaries?.[level] || [], isRightOpening);

        const rowData = page?.rows[level];
        if (rowData?.entryId) {
          makeBandHoverInteractive(row, rowData.entryId);
        }
        const labelStarts = page?.labels?.[level] || [];
        for (const label of labelStarts) {
          const isBoardHead = globalPageIndex === spec.start;
          const shouldShow =
            label.start > 0 || label.isGlobalStart || isBoardHead;
          if (!shouldShow || !label.text) continue;
          const div = document.createElement("div");
          div.className = `segment ${CLASS_BY_LEVEL[level]} ${label.anonymous ? "is-anon" : ""}`;
          div.textContent = shrinkText(label.text, 14);
          div.dataset.entryId = label.entryId;
          div.style.position = "absolute";
          div.style.top = "1px";
          div.style.left = `${(isRightOpening ? 0 : label.start) * 100}%`;
          div.style.width = `${Math.max(0, (1 - label.start) * 100)}%`;
          makeInteractive(div, label.entryId);
          row.appendChild(div);
        }
        cell.appendChild(row);
      }

      slot.appendChild(cell);
      slot.appendChild(number);
      track.appendChild(slot);
    }

    let betchoList = null;
    if (betchoes.length > 0) {
      betchoList = document.createElement("div");
      betchoList.className = "betcho-list";
      for (const betcho of betchoes) {
        const item = document.createElement("div");
        item.className = "betcho-item";
        item.innerHTML = `
          <div class="betcho-name">${shrinkText(betcho.name, 18)}</div>
          <div class="betcho-advance">+${betcho.advancePages}頁</div>
        `;
        makeBetchoHoverInteractive(item, betcho.id);
        betchoList.appendChild(item);
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

  if ((state.holdEntries || []).length > 0) {
    const spacerBoard = createHoldGapBoard();
    els.boards.appendChild(spacerBoard);

    for (const [holdIdx, holdEntry] of state.holdEntries.entries()) {
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

  if ((state.addonEntries || []).length > 0) {
    for (const addon of state.addonEntries) {
      const addonBoard = createHoldBoard(
        addon,
        {
          visiblePagesPerBoard,
          isRightOpening,
          labelTop: addon.name,
          labelBottom: LOCALE === "en" ? `${formatPagesValue(addon.pages)}p` : `${formatPagesValue(addon.pages)}頁`,
        },
      );
      els.boards.appendChild(addonBoard);
    }
  }
}

function createHoldGapBoard() {
  const board = document.createElement("article");
  board.className = "board board-hold-gap";
  board.innerHTML = `<div class="board-row hold-gap-row"></div>`;
  return board;
}

function createHoldBoard(entry, options) {
  const { visiblePagesPerBoard, isRightOpening, labelTop, labelBottom } = options;
  const pagesPerBoard = visiblePagesPerBoard;
  const fillUnits = Math.max(0, Math.min(pagesPerBoard * PAGE_UNITS, entry.pages || 0));
  const fillCount = Math.ceil(fillUnits / PAGE_UNITS);
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
  side.innerHTML = `
    <div class="board-no">${labelTop || ""}</div>
    <div class="board-format">${labelBottom || ""}</div>
  `;

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

    const slot = document.createElement("div");
    slot.className = "page-slot";
    if (!isFilled) slot.classList.add("is-blank");

    const cell = document.createElement("div");
    cell.className = "page-cell";
    const number = document.createElement("div");
    number.className = "page-number";
    number.textContent = "";

    if (!isFilled) {
      slot.appendChild(cell);
      slot.appendChild(number);
      track.appendChild(slot);
      continue;
    }

    const rows = ["large", "middle", "small"];
    for (const level of rows) {
      const levelRow = document.createElement("div");
      levelRow.className = `cell-row row-${level}`;
      const prevFilled = idx > 0 && slotLogicalIndex(idx - 1) < fillCount;
      const nextFilled = idx < pagesPerBoard - 1 && slotLogicalIndex(idx + 1) < fillCount;
      if (level === "large") {
        if (!prevFilled) levelRow.classList.add("left-thick");
        levelRow.classList.add(nextFilled ? "sep-none" : "sep-solid");
      } else if (level === "middle") {
        const spread = getSpreadSeparatorClass(idx, pagesPerBoard);
        if (idx === 0) levelRow.classList.add("left-thick");
        levelRow.classList.add(spread);
      } else {
        // 保留小段の縦罫線は通常台と同じ実線/点線ルールで表示する。
        const spread = getSpreadSeparatorClass(idx, pagesPerBoard);
        if (idx === 0) levelRow.classList.add("left-thick");
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

    slot.appendChild(cell);
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
    if (!out.has(betcho.boardNo)) out.set(betcho.boardNo, []);
    out.get(betcho.boardNo).push(betcho);
  }
  return out;
}

function buildAdvancePrefixByBoard(betchoes, boardSpecs) {
  const addByBoard = new Map();
  for (const betcho of betchoes) {
    addByBoard.set(betcho.boardNo, (addByBoard.get(betcho.boardNo) || 0) + betcho.advancePages);
  }
  const prefix = new Map();
  let running = 0;
  for (const spec of boardSpecs) {
    const boardNo = spec.boardNo;
    prefix.set(boardNo, running);
    running += addByBoard.get(boardNo) || 0;
  }
  return prefix;
}

function formatBoardLabel(format) {
  const normalized = normalizeBoardFormat(format) || "4C";
  const m = normalized.match(/^(\d+)C$/);
  if (!m) return normalized;
  return `${m[1]}<br>c`;
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
  const e = state.entries.find((x0) => x0.id === entryId);
  const h = state.holdEntries.find((x0) => x0.id === entryId);
  const a = state.addonEntries.find((x0) => x0.id === entryId);
  const s = findSyntheticMiddleById(entryId);
  const b = state.betchoes.find((x0) => x0.id === entryId);
  if (!e && !h && !a && !s && !b) return;
  els.tooltip.classList.remove("hidden");
  els.tooltip.style.left = `${x + 10}px`;
  els.tooltip.style.top = `${y + 10}px`;
  const article = e || h || a || s;
  const labels = getArticleDisplayFieldLabels();
  const nameLabel = LOCALE === "en" ? "Article" : "記事名";
  const nameLine = (item) => `${nameLabel}: ${escapeHtml(item?.name || "-")}`;
  const fieldLines = (item) =>
    labels
      .map((label) => `${escapeHtml(label)}: ${escapeHtml(formatFieldDisplayValue(label, getFieldRawValue(item, label)))}`)
      .join("<br>");
  if (article) {
    const detailLines = fieldLines(article);
    let html = detailLines ? `${nameLine(article)}<br>${detailLines}` : nameLine(article);
    const notes = article.attachedInlineNotes;
    if (notes && notes.length) {
      html += "<br><br>";
      html += notes.map((raw) => linkifyPlainTextToHtml(humanizeDirectiveLineForTooltip(raw))).join("<br>");
    }
    els.tooltip.innerHTML = html;
    return;
  }
  const head = LOCALE === "en"
    ? `Type: Insert (after board ${b.boardNo})<br>Page advance: +${b.advancePages}<br>`
    : `種別: 別丁（台${b.boardNo}の後ろ）<br>ページ進み: +${b.advancePages}頁<br>`;
  const betchoDetailLines = fieldLines(b);
  let htmlB = `${head}${nameLine(b)}${betchoDetailLines ? `<br>${betchoDetailLines}` : ""}`;
  const notesB = b.attachedInlineNotes;
  if (notesB && notesB.length) {
    htmlB += "<br><br>";
    htmlB += notesB.map((raw) => linkifyPlainTextToHtml(humanizeDirectiveLineForTooltip(raw))).join("<br>");
  }
  els.tooltip.innerHTML = htmlB;
}

function findSyntheticMiddleById(entryId) {
  if (!String(entryId || "").startsWith("synthetic-middle-")) return null;
  const tree = buildHierarchy(state.entries);
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

function buildRowMetaFields(item) {
  const labels = getArticleDisplayFieldLabels();
  return {
    metaValues: labels.map((label) => formatFieldDisplayValue(label, getFieldRawValue(item, label))),
  };
}

function renderArticleMetaCells(row) {
  const values = row.metaValues || [];
  return values
    .map((text, idx) => `<td class="tree-cell meta-cell ${getArticleMetaCellClass(idx)}">${renderMetaCellHtml(text)}</td>`)
    .join("");
}

function buildArticleTreeRows() {
  const tree = buildHierarchy(state.entries);
  const rows = [];
  for (const large of tree) {
    rows.push({
      type: "large",
      text: formatArticleCellText(large.name, large.pages),
      ...buildRowMetaFields(large),
    });
    for (const middle of large.middles) {
      rows.push({
        type: middle.syntheticAutoMiddle ? "middle-auto" : "middle",
        text: middle.syntheticAutoMiddle
          ? formatPagesOnlyText(middle.pages)
          : formatArticleCellText(middle.name, middle.pages),
        ...buildRowMetaFields(middle),
      });
      for (const small of middle.smalls) {
        rows.push({
          type: "small",
          text: formatArticleCellText(small.name, small.pages),
          ...buildRowMetaFields(small),
        });
      }
    }
  }
  for (const betcho of state.betchoes) {
    rows.push({
      type: "betcho",
      text: LOCALE === "en"
        ? `${betcho.name} (Insert: after board ${betcho.boardNo} / +${betcho.advancePages}p)`
        : `${betcho.name}（別丁: 台${betcho.boardNo}の後ろ / +${betcho.advancePages}頁）`,
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
      ...buildRowMetaFields(addon),
    });
  }
  return rows;
}

function buildArticleListRows() {
  const labels = getArticleDisplayFieldLabels();
  const toRow = (level, name, pages, item) => ({
    level,
    name,
    pages,
    metaValues: labels.map((label) => formatFieldDisplayValue(label, getFieldRawValue(item, label))),
  });
  const normalRows = state.entries.map((e) => ({
    ...toRow(labelLevel(e.level), e.name, formatPagesValue(e.pages), e),
  }));
  const betchoRows = state.betchoes.map((b) => ({
    ...toRow(
      LOCALE === "en" ? "Insert" : "別丁",
      LOCALE === "en" ? `${b.name} (after board ${b.boardNo})` : `${b.name}（台${b.boardNo}の後ろ）`,
      `+${b.advancePages}${LOCALE === "en" ? "p" : ""}`,
      b,
    ),
  }));
  const holdRows = (state.holdEntries || []).map((h) => ({
    ...toRow(
      LOCALE === "en" ? "Hold" : "保留",
      h.name,
      `${formatPagesValue(h.pages)}${LOCALE === "en" ? "p" : ""}`,
      h,
    ),
  }));
  const addonRows = (state.addonEntries || []).map((a) => ({
    ...toRow(a.name, a.name, `${formatPagesValue(a.pages)}${LOCALE === "en" ? "p" : ""}`, a),
  }));
  return [...normalRows, ...betchoRows, ...holdRows, ...addonRows];
}

function buildArticleFlatRows() {
  const tree = buildHierarchy(state.entries);
  const rows = [];

  for (const large of tree) {
    const middleBlocks = large.middles.length > 0 ? large.middles : [null];
    const largeRowCount = middleBlocks.reduce((sum, middle) => {
      if (!middle) return sum + 1;
      return sum + Math.max(1, middle.smalls.length);
    }, 0);

    let largeRendered = false;
    for (const middle of middleBlocks) {
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
        rows.push({
          type: "flat",
          largeText: !largeRendered ? formatArticleCellText(large.name, large.pages) : "",
          largeRowspan: !largeRendered ? largeRowCount : 0,
          middleText: i === 0 ? middleText : "",
          middleRowspan: i === 0 ? rowCount : 0,
          smallText: small ? formatArticleCellText(small.name, small.pages) : "",
          ...buildRowMetaFields(source),
        });
        largeRendered = true;
      }
    }
  }

  for (const betcho of state.betchoes) {
    rows.push({
      type: "betcho",
      text: LOCALE === "en"
        ? `${betcho.name} (Insert: after board ${betcho.boardNo} / +${betcho.advancePages}p)`
        : `${betcho.name}（別丁: 台${betcho.boardNo}の後ろ / +${betcho.advancePages}頁）`,
      ...buildRowMetaFields(betcho),
    });
  }

  const holds = state.holdEntries || [];
  if (holds.length > 0 && rows.length > 0) rows.push({ type: "hold-separator" });
  for (const hold of holds) {
    rows.push({
      type: "hold",
      text: `${LOCALE === "en" ? "Hold" : "保留"}: ${formatArticleCellText(hold.name, hold.pages)}`,
      ...buildRowMetaFields(hold),
    });
  }
  const addons = state.addonEntries || [];
  if (addons.length > 0 && rows.length > 0) rows.push({ type: "hold-separator" });
  for (const addon of addons) {
    rows.push({
      type: "addon",
      text: `${addon.name}: ${formatPagesOnlyText(addon.pages)}`,
      ...buildRowMetaFields(addon),
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
      const metaCells = renderArticleMetaCells(row);
      if (row.type === "flat") {
        const largeCell = row.largeRowspan > 0
          ? `<td rowspan="${row.largeRowspan}" class="tree-cell cell-large">${escapeHtml(row.largeText)}</td>`
          : "";
        const middleCell = row.middleRowspan > 0
          ? `<td rowspan="${row.middleRowspan}" class="tree-cell cell-middle">${escapeHtml(row.middleText)}</td>`
          : "";
        const smallCell = `<td class="tree-cell cell-small">${escapeHtml(row.smallText)}</td>`;
        return `<tr class="article-tree-row row-flat">
          ${largeCell}
          ${middleCell}
          ${smallCell}
          ${metaCells}
        </tr>`;
      }
      if (row.type === "large") {
        return `<tr class="article-tree-row row-large">
          <td colspan="3" class="tree-cell cell-large">${text}</td>
          ${metaCells}
        </tr>`;
      }
      if (row.type === "middle") {
        return `<tr class="article-tree-row row-middle">
          <td class="tree-cell tree-guide guide-large no-top"></td>
          <td colspan="2" class="tree-cell cell-middle">${text}</td>
          ${metaCells}
        </tr>`;
      }
      if (row.type === "middle-auto") {
        return `<tr class="article-tree-row row-middle row-middle-auto">
          <td class="tree-cell tree-guide guide-large no-top"></td>
          <td colspan="2" class="tree-cell cell-middle cell-middle-auto">${text}</td>
          ${metaCells}
        </tr>`;
      }
      if (row.type === "small") {
        return `<tr class="article-tree-row row-small">
          <td class="tree-cell tree-guide guide-large no-top"></td>
          <td class="tree-cell tree-guide guide-middle no-top"></td>
          <td class="tree-cell cell-small">${text}</td>
          ${metaCells}
        </tr>`;
      }
      if (row.type === "hold") {
        return `<tr class="article-tree-row row-hold">
          <td colspan="3" class="tree-cell cell-hold">${text}</td>
          ${metaCells}
        </tr>`;
      }
      if (row.type === "addon") {
        return `<tr class="article-tree-row row-addon">
          <td colspan="3" class="tree-cell cell-addon">${text}</td>
          ${metaCells}
        </tr>`;
      }
      if (row.type === "hold-separator") {
        return `<tr class="article-tree-row row-hold-separator">
          <td colspan="${3 + getArticleDisplayFieldLabels().length}" class="tree-cell hold-separator-cell"></td>
        </tr>`;
      }
      return `<tr class="article-tree-row row-betcho">
        <td colspan="3" class="tree-cell cell-betcho">${text}</td>
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
  const fieldTokens = (item) =>
    dataLabels.map((label) => {
      const raw = getFieldRawValue(item, label);
      const canon = canonicalFieldByLabel(label);
      if (canon === "desk" || canon === "editors" || canon === "writers") {
        return raw || "-";
      }
      return raw || "";
    });
  const lines = [
    `//${headByCanon("filename")}\t${m.filename || "daiwari"}`,
    `//${headByCanon("title")}\t${m.title || ""}`,
    `//${headByCanon("opening")}\t${m.opening === "right" ? (LOCALE === "en" ? "right" : "右") : (LOCALE === "en" ? "left" : "左")}`,
    `//${headByCanon("pages")}\t${m.pagesExpr || formatPagesValue(m.pages || 0)}`,
    `//${headByCanon("planned")}\t${m.planned || ""}`,
    `//${headByCanon("version")}\t${m.version || ""}`,
    `//${headByCanon("writer")}\t${m.writer || ""}`,
    `//${headByCanon("start-page")}\t${m.startPage || 1}`,
    `//${headByCanon("article-fields")}\t${labels.join("\t")}`,
    `//${headByCanon("article-list-widths")}\t${getArticleColumnWidths().map((w) => (Math.round(w * 100) / 100)).join("\t")}`,
  ];
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
      ...fieldTokens(addon),
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

function sanitizeFileName(value) {
  return String(value || "")
    .replace(/\.txt$/i, "")
    .replace(/[<>:"/\\|?*\u0000-\u001f]/g, "_")
    .replace(/[. ]+$/g, "")
    .trim();
}

function resolveDownloadBaseName(text, fallbackName = "") {
  const rawFromText = readMetaFilenameFromText(text);
  const safeFromText = sanitizeFileName(rawFromText);
  if (safeFromText) {
    if (safeFromText !== rawFromText) {
      return {
        baseName: safeFromText,
        notice: LOCALE === "en"
          ? `The //filename value contained unsupported characters, so it was saved as "${safeFromText}".`
          : `//台割ファイル名 に使えない文字が含まれていたため、「${safeFromText}」として保存しました。`,
      };
    }
    return { baseName: safeFromText, notice: "" };
  }
  const safeFallback = sanitizeFileName(fallbackName) || "daiwari";
  return {
    baseName: safeFallback,
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

function downloadText(text, baseName = "") {
  const now = new Date();
  const ts = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("") + String(now.getHours()).padStart(2, "0") + String(now.getMinutes()).padStart(2, "0");
  const safeBaseName = sanitizeFileName(baseName) || "daiwari";
  const filename = `${safeBaseName}_${ts}.txt`;
  const blob = new Blob([text], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}
