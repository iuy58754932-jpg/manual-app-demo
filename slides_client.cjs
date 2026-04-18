const pptxgen = require("pptxgenjs");

// ── Colors ──
const C = {
  primary: "065A82",
  secondary: "1E2761",
  accent: "0891B2",
  bg: "F6F8FB",
  card: "FFFFFF",
  textDark: "1A1F36",
  textBody: "3A4560",
  textMuted: "8896A7",
  border: "E2E8F0",
  sky: "E8F4FD",
  success: "10B981",
  warning: "F59E0B",
};

const mkShadow = () => ({ type: "outer", blur: 6, offset: 2, angle: 135, color: "000000", opacity: 0.08 });

let pres;

function slideNum(slide, n) {
  slide.addText(String(n), { x: 9.2, y: 5.2, w: 0.5, h: 0.3, fontSize: 9, color: C.textMuted, align: "right" });
}

function sectionHeader(slide, title, num) {
  slide.background = { color: C.bg };
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.9, fill: { color: C.secondary } });
  slide.addText(title, { x: 0.6, y: 0.15, w: 8.8, h: 0.6, fontSize: 24, fontFace: "Calibri", bold: true, color: C.card, margin: 0 });
  slideNum(slide, num);
}

function card(slide, x, y, w, h, opts = {}) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w, h,
    fill: { color: opts.fill || C.card },
    shadow: mkShadow(),
  });
  if (opts.topBar) {
    slide.addShape(pres.shapes.RECTANGLE, { x, y, w, h: 0.06, fill: { color: opts.topBar } });
  }
  if (opts.leftBar) {
    slide.addShape(pres.shapes.RECTANGLE, { x, y, w: 0.06, h, fill: { color: opts.leftBar } });
  }
}

function featureRow(slide, x, y, emoji, title, desc) {
  slide.addText(emoji, { x, y, w: 0.5, h: 0.45, fontSize: 20, align: "center", valign: "middle" });
  slide.addText(title, { x: x + 0.55, y, w: 3.5, h: 0.22, fontSize: 13, fontFace: "Calibri", bold: true, color: C.textDark, margin: 0 });
  slide.addText(desc, { x: x + 0.55, y: y + 0.22, w: 3.5, h: 0.22, fontSize: 10, fontFace: "Calibri", color: C.textMuted, margin: 0 });
}

async function main() {
  pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.author = "マニュアル作成アプリ開発チーム";
  pres.title = "マニュアル作成アプリ 画面仕様書";

  // ════════════════════════════════════════
  // SLIDE 1: Cover
  // ════════════════════════════════════════
  let s = pres.addSlide();
  s.background = { color: C.secondary };
  s.addShape(pres.shapes.RECTANGLE, { x: 6.2, y: 0, w: 3.8, h: 5.625, fill: { color: C.primary } });
  // Logo
  s.addShape(pres.shapes.RECTANGLE, { x: 7.35, y: 1.5, w: 1.3, h: 1.3, fill: { color: C.accent }, shadow: mkShadow() });
  s.addText("M", { x: 7.35, y: 1.5, w: 1.3, h: 1.3, fontSize: 48, fontFace: "Calibri", bold: true, color: C.card, align: "center", valign: "middle" });
  // Title
  s.addText("マニュアル作成アプリ", { x: 0.8, y: 1.3, w: 5, h: 0.7, fontSize: 32, fontFace: "Calibri", bold: true, color: C.card, margin: 0 });
  s.addText("画面仕様書", { x: 0.8, y: 2.0, w: 5, h: 0.5, fontSize: 22, fontFace: "Calibri", color: C.accent, margin: 0 });
  s.addText("業務マニュアルをスマホで簡単に作成・管理", { x: 0.8, y: 2.8, w: 5, h: 0.4, fontSize: 14, fontFace: "Calibri", color: "CADCFC", margin: 0 });
  s.addText("ご提出日: 2026年4月16日", { x: 0.8, y: 4.8, w: 5, h: 0.3, fontSize: 11, fontFace: "Calibri", color: C.textMuted });

  // ════════════════════════════════════════
  // SLIDE 2: App Overview
  // ════════════════════════════════════════
  s = pres.addSlide();
  sectionHeader(s, "アプリの概要", 2);

  s.addText("このアプリでできること", { x: 0.6, y: 1.1, w: 5, h: 0.4, fontSize: 16, fontFace: "Calibri", bold: true, color: C.secondary, margin: 0 });

  // 3 pillars
  const pillars = [
    { emoji: "📋", title: "テンプレートで簡単作成", desc: "業種に合ったテンプレートを\n選ぶだけで、すぐに\nマニュアル作成を開始", color: C.primary },
    { emoji: "📷", title: "写真をそのまま貼り付け", desc: "スマホのカメラで撮影して\nそのままマニュアルに\n貼り付けられます", color: C.accent },
    { emoji: "📄", title: "PDFで出力・印刷", desc: "完成したマニュアルは\nPDFで保存したり\nそのまま印刷できます", color: "10B981" },
  ];
  pillars.forEach((p, i) => {
    const px = 0.6 + i * 3.1;
    card(s, px, 1.6, 2.8, 2.1, { topBar: p.color });
    s.addText(p.emoji, { x: px + 0.15, y: 1.75, w: 2.5, h: 0.5, fontSize: 28, align: "center" });
    s.addText(p.title, { x: px + 0.15, y: 2.3, w: 2.5, h: 0.35, fontSize: 13, fontFace: "Calibri", bold: true, color: C.textDark, align: "center", margin: 0 });
    s.addText(p.desc, { x: px + 0.15, y: 2.7, w: 2.5, h: 0.85, fontSize: 10, fontFace: "Calibri", color: C.textBody, align: "center", lineSpacingMultiple: 1.4 });
  });

  // Features
  s.addText("アプリの特徴", { x: 0.6, y: 3.95, w: 5, h: 0.35, fontSize: 14, fontFace: "Calibri", bold: true, color: C.secondary, margin: 0 });
  card(s, 0.6, 4.35, 8.8, 0.95);
  const features = [
    ["📱", "スマホのホーム画面に追加して、アプリのように使えます"],
    ["✈️", "インターネット接続なしでも使えます"],
    ["💰", "サーバー不要のため、月額の維持費用がかかりません"],
  ];
  features.forEach((f, i) => {
    const fx = 0.8 + i * 2.95;
    s.addText(f[0], { x: fx, y: 4.42, w: 0.4, h: 0.35, fontSize: 16, align: "center", valign: "middle" });
    s.addText(f[1], { x: fx + 0.4, y: 4.42, w: 2.4, h: 0.8, fontSize: 10, fontFace: "Calibri", color: C.textBody, valign: "top", margin: 0 });
  });

  // ════════════════════════════════════════
  // SLIDE 3: Screen Flow
  // ════════════════════════════════════════
  s = pres.addSlide();
  sectionHeader(s, "全体の画面の流れ", 3);

  s.addText("最短3ステップでマニュアル作成を開始できます", { x: 0.6, y: 1.1, w: 8, h: 0.35, fontSize: 13, fontFace: "Calibri", italic: true, color: C.accent, margin: 0 });

  // Main flow
  s.addText("新規作成の流れ", { x: 0.6, y: 1.6, w: 3, h: 0.3, fontSize: 12, fontFace: "Calibri", bold: true, color: C.secondary, margin: 0 });
  const mainFlow = [
    { label: "ホーム", emoji: "🏠", desc: "アプリを開く" },
    { label: "業種を選ぶ", emoji: "🏭", desc: "飲食・製造 等" },
    { label: "テンプレを選ぶ", emoji: "📋", desc: "手順書 等" },
    { label: "編集する", emoji: "✏️", desc: "写真・文字を追加" },
    { label: "PDF出力", emoji: "📄", desc: "保存・印刷" },
  ];
  mainFlow.forEach((f, i) => {
    const fx = 0.6 + i * 1.85;
    card(s, fx, 2.0, 1.55, 1.3, { topBar: i === 3 ? C.accent : C.primary });
    s.addText(f.emoji, { x: fx, y: 2.12, w: 1.55, h: 0.45, fontSize: 22, align: "center" });
    s.addText(f.label, { x: fx + 0.05, y: 2.6, w: 1.45, h: 0.25, fontSize: 10, fontFace: "Calibri", bold: true, color: C.textDark, align: "center", margin: 0 });
    s.addText(f.desc, { x: fx + 0.05, y: 2.85, w: 1.45, h: 0.25, fontSize: 8, fontFace: "Calibri", color: C.textMuted, align: "center", margin: 0 });
    if (i < mainFlow.length - 1) {
      s.addText("→", { x: fx + 1.55, y: 2.35, w: 0.3, h: 0.4, fontSize: 18, color: C.accent, align: "center", valign: "middle" });
    }
  });

  // Alternative flow
  s.addText("保存済みファイルを開く場合", { x: 0.6, y: 3.6, w: 5, h: 0.3, fontSize: 12, fontFace: "Calibri", bold: true, color: C.secondary, margin: 0 });
  const altFlow = [
    { label: "ホーム", emoji: "🏠" },
    { label: "ファイルを選ぶ", emoji: "📂" },
    { label: "編集する", emoji: "✏️" },
  ];
  altFlow.forEach((f, i) => {
    const fx = 0.6 + i * 1.85;
    card(s, fx, 4.0, 1.55, 0.9, { topBar: C.textMuted });
    s.addText(f.emoji, { x: fx, y: 4.08, w: 1.55, h: 0.35, fontSize: 18, align: "center" });
    s.addText(f.label, { x: fx + 0.05, y: 4.45, w: 1.45, h: 0.25, fontSize: 10, fontFace: "Calibri", bold: true, color: C.textDark, align: "center", margin: 0 });
    if (i < altFlow.length - 1) {
      s.addText("→", { x: fx + 1.55, y: 4.2, w: 0.3, h: 0.4, fontSize: 18, color: C.textMuted, align: "center", valign: "middle" });
    }
  });

  s.addText("※ 最近編集したファイルはホーム画面から直接開くこともできます", { x: 0.6, y: 5.1, w: 8, h: 0.3, fontSize: 10, fontFace: "Calibri", color: C.textMuted, margin: 0 });

  // ════════════════════════════════════════
  // SLIDE 4: Home Screen
  // ════════════════════════════════════════
  s = pres.addSlide();
  sectionHeader(s, "① ホーム画面", 4);

  // Phone mockup
  card(s, 0.6, 1.2, 3.0, 4.0);
  s.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 1.2, w: 3.0, h: 0.45, fill: { color: C.secondary } });
  s.addText("マニュアル作成", { x: 0.75, y: 1.23, w: 2.5, h: 0.4, fontSize: 10, fontFace: "Calibri", bold: true, color: C.card, margin: 0 });
  s.addShape(pres.shapes.RECTANGLE, { x: 1.65, y: 1.85, w: 0.7, h: 0.7, fill: { color: C.accent } });
  s.addText("M", { x: 1.65, y: 1.85, w: 0.7, h: 0.7, fontSize: 24, fontFace: "Calibri", bold: true, color: C.card, align: "center", valign: "middle" });
  s.addText("マニュアル作成アプリ", { x: 0.8, y: 2.65, w: 2.6, h: 0.25, fontSize: 10, fontFace: "Calibri", bold: true, color: C.secondary, align: "center", margin: 0 });
  // Buttons
  s.addShape(pres.shapes.RECTANGLE, { x: 0.9, y: 3.05, w: 2.2, h: 0.38, fill: { color: C.accent } });
  s.addText("＋ 新規作成", { x: 0.9, y: 3.05, w: 2.2, h: 0.38, fontSize: 10, fontFace: "Calibri", bold: true, color: C.card, align: "center", valign: "middle" });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.9, y: 3.55, w: 2.2, h: 0.38, fill: { color: C.card }, line: { color: C.border, width: 1 } });
  s.addText("📂 ファイル読み込み", { x: 0.9, y: 3.55, w: 2.2, h: 0.38, fontSize: 10, fontFace: "Calibri", bold: true, color: C.primary, align: "center", valign: "middle" });
  s.addText("最近のファイル", { x: 0.9, y: 4.1, w: 2.2, h: 0.2, fontSize: 8, fontFace: "Calibri", bold: true, color: C.textMuted, margin: 0 });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.9, y: 4.35, w: 2.2, h: 0.3, fill: { color: C.bg }, line: { color: C.border, width: 0.5 } });
  s.addText("📄 客室清掃マニュアル   04/15", { x: 0.95, y: 4.35, w: 2.1, h: 0.3, fontSize: 7, fontFace: "Calibri", color: C.textBody, valign: "middle", margin: 0 });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.9, y: 4.7, w: 2.2, h: 0.3, fill: { color: C.bg }, line: { color: C.border, width: 0.5 } });
  s.addText("📄 衛生チェックリスト   04/14", { x: 0.95, y: 4.7, w: 2.1, h: 0.3, fontSize: 7, fontFace: "Calibri", color: C.textBody, valign: "middle", margin: 0 });

  // Description
  card(s, 4.1, 1.2, 5.4, 4.0, { leftBar: C.primary });
  s.addText("この画面でできること", { x: 4.4, y: 1.35, w: 4.8, h: 0.35, fontSize: 16, fontFace: "Calibri", bold: true, color: C.secondary, margin: 0 });

  s.addText([
    { text: "「新規作成」ボタン", options: { bold: true, breakLine: true, fontSize: 13 } },
    { text: "新しいマニュアルの作成を開始します。", options: { breakLine: true } },
    { text: "業種・テンプレートの選択画面に進みます。", options: { breakLine: true } },
    { text: "", options: { breakLine: true } },
    { text: "「ファイル読み込み」ボタン", options: { bold: true, breakLine: true, fontSize: 13 } },
    { text: "以前に保存したマニュアルの一覧を表示します。", options: { breakLine: true } },
    { text: "タップして編集を再開できます。", options: { breakLine: true } },
    { text: "", options: { breakLine: true } },
    { text: "最近のファイル", options: { bold: true, breakLine: true, fontSize: 13 } },
    { text: "直近に編集した5件のファイルが表示されます。", options: { breakLine: true } },
    { text: "ワンタップで前回の続きから編集を再開できます。", options: {} },
  ], { x: 4.4, y: 1.8, w: 4.8, h: 3.2, fontSize: 11, fontFace: "Calibri", color: C.textBody, lineSpacingMultiple: 1.35 });

  // ════════════════════════════════════════
  // SLIDE 5: Industry Selection
  // ════════════════════════════════════════
  s = pres.addSlide();
  sectionHeader(s, "② 業種選択画面", 5);

  // Grid
  card(s, 0.6, 1.2, 3.0, 4.0);
  s.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 1.2, w: 3.0, h: 0.45, fill: { color: C.secondary } });
  s.addText("← 業種選択", { x: 0.75, y: 1.23, w: 2.5, h: 0.4, fontSize: 10, fontFace: "Calibri", bold: true, color: C.card, margin: 0 });

  const industries = [
    ["🍽", "飲食"], ["🏭", "製造"], ["🧹", "清掃"], ["🏥", "医療"],
    ["🏨", "宿泊"], ["🏗", "建設"], ["🛒", "小売"], ["📚", "教育"],
  ];
  industries.forEach((ind, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const gx = 0.8 + col * 1.35;
    const gy = 1.85 + row * 0.75;
    s.addShape(pres.shapes.RECTANGLE, { x: gx, y: gy, w: 1.15, h: 0.6, fill: { color: C.card }, line: { color: C.border, width: 0.5 } });
    s.addText(ind[0], { x: gx, y: gy + 0.02, w: 1.15, h: 0.3, fontSize: 16, align: "center", margin: 0 });
    s.addText(ind[1], { x: gx, y: gy + 0.33, w: 1.15, h: 0.22, fontSize: 9, fontFace: "Calibri", bold: true, color: C.textDark, align: "center", margin: 0 });
  });

  // Description
  card(s, 4.1, 1.2, 5.4, 4.0, { leftBar: C.accent });
  s.addText("この画面でできること", { x: 4.4, y: 1.35, w: 4.8, h: 0.35, fontSize: 16, fontFace: "Calibri", bold: true, color: C.secondary, margin: 0 });
  s.addText([
    { text: "お客様の業種に合ったテンプレートを選べます", options: { bold: true, breakLine: true, fontSize: 13 } },
    { text: "", options: { breakLine: true } },
    { text: "8つの業種カテゴリが用意されています。", options: { breakLine: true } },
    { text: "ご自身の業種をタップすると、その業種向けの", options: { breakLine: true } },
    { text: "テンプレート一覧に進みます。", options: { breakLine: true } },
    { text: "", options: { breakLine: true } },
    { text: "対応業種", options: { bold: true, breakLine: true, fontSize: 13 } },
    { text: "🍽 飲食　　🏭 製造　　🧹 清掃　　🏥 医療", options: { breakLine: true, fontSize: 12 } },
    { text: "🏨 宿泊　　🏗 建設　　🛒 小売　　📚 教育", options: { breakLine: true, fontSize: 12 } },
    { text: "", options: { breakLine: true } },
    { text: "※ 業種カテゴリは今後の要望に応じて追加可能です", options: { fontSize: 10, color: C.textMuted } },
  ], { x: 4.4, y: 1.8, w: 4.8, h: 3.2, fontSize: 11, fontFace: "Calibri", color: C.textBody, lineSpacingMultiple: 1.35 });

  // ════════════════════════════════════════
  // SLIDE 6: Template Selection
  // ════════════════════════════════════════
  s = pres.addSlide();
  sectionHeader(s, "③ テンプレート選択画面", 6);

  card(s, 0.6, 1.2, 3.0, 4.0);
  s.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 1.2, w: 3.0, h: 0.45, fill: { color: C.secondary } });
  s.addText("← テンプレート選択", { x: 0.75, y: 1.23, w: 2.5, h: 0.4, fontSize: 10, fontFace: "Calibri", bold: true, color: C.card, margin: 0 });
  s.addText("🍽 飲食", { x: 0.8, y: 1.8, w: 2, h: 0.2, fontSize: 9, fontFace: "Calibri", color: C.textMuted, margin: 0 });

  const tmpl = [
    ["📋", "基本手順書", "写真とテキストで手順を記録"],
    ["✅", "衛生チェックリスト", "チェック欄付きリスト"],
    ["🍳", "レシピカード", "写真付きレシピテンプレート"],
  ];
  tmpl.forEach((t, i) => {
    const ty = 2.15 + i * 0.8;
    s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: ty, w: 2.6, h: 0.65, fill: { color: C.card }, line: { color: C.border, width: 0.5 } });
    s.addText(t[0], { x: 0.85, y: ty + 0.08, w: 0.45, h: 0.45, fontSize: 18, align: "center", valign: "middle" });
    s.addText(t[1], { x: 1.3, y: ty + 0.06, w: 2.0, h: 0.22, fontSize: 10, fontFace: "Calibri", bold: true, color: C.textDark, margin: 0 });
    s.addText(t[2], { x: 1.3, y: ty + 0.3, w: 2.0, h: 0.2, fontSize: 8, fontFace: "Calibri", color: C.textMuted, margin: 0 });
  });

  card(s, 4.1, 1.2, 5.4, 4.0, { leftBar: C.accent });
  s.addText("この画面でできること", { x: 4.4, y: 1.35, w: 4.8, h: 0.35, fontSize: 16, fontFace: "Calibri", bold: true, color: C.secondary, margin: 0 });
  s.addText([
    { text: "業種ごとに用意されたテンプレートから選べます", options: { bold: true, breakLine: true, fontSize: 13 } },
    { text: "", options: { breakLine: true } },
    { text: "各テンプレートにはあらかじめレイアウト枠が", options: { breakLine: true } },
    { text: "設定されているので、写真や文字を入れるだけで", options: { breakLine: true } },
    { text: "きれいなマニュアルが完成します。", options: { breakLine: true } },
    { text: "", options: { breakLine: true } },
    { text: "テンプレート例", options: { bold: true, breakLine: true, fontSize: 13 } },
    { text: "飲食: 基本手順書 / 衛生チェックリスト / レシピカード", options: { bullet: true, breakLine: true } },
    { text: "清掃: 清掃手順書 / 点検チェックリスト", options: { bullet: true, breakLine: true } },
    { text: "製造: 作業標準書 / 安全確認リスト / 品質検査シート", options: { bullet: true, breakLine: true } },
    { text: "", options: { breakLine: true } },
    { text: "※ テンプレートは今後の要望に応じて追加・変更が可能です", options: { fontSize: 10, color: C.textMuted } },
  ], { x: 4.4, y: 1.8, w: 4.8, h: 3.2, fontSize: 11, fontFace: "Calibri", color: C.textBody, lineSpacingMultiple: 1.3 });

  // ════════════════════════════════════════
  // SLIDE 7: Editor Overview
  // ════════════════════════════════════════
  s = pres.addSlide();
  sectionHeader(s, "④ マニュアル編集画面（全体像）", 7);

  s.addText("この画面がアプリの中心です", { x: 0.6, y: 1.1, w: 8, h: 0.3, fontSize: 13, fontFace: "Calibri", italic: true, color: C.accent, margin: 0 });

  // Layout diagram
  const areas = [
    { label: "タイトル入力 / 保存ボタン / PDF出力ボタン", y: 1.55, h: 0.55, color: C.secondary, textColor: C.card, name: "上部バー" },
    { label: "写真追加 / テキスト追加 / 拡大・縮小 / 元に戻す / 削除", y: 2.2, h: 0.55, color: C.primary, textColor: C.card, name: "操作ボタン" },
    { label: "マニュアルの編集エリア\n（紙のイメージ。写真や文字を自由に配置）", y: 2.85, h: 1.6, color: C.sky, textColor: C.textDark, name: "編集エリア" },
    { label: "ページ一覧（横スクロール）/ ページ追加ボタン", y: 4.55, h: 0.55, color: C.bg, textColor: C.textBody, name: "ページ一覧" },
  ];
  areas.forEach(a => {
    s.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: a.y, w: 3.8, h: a.h, fill: { color: a.color }, line: { color: C.border, width: 0.5 } });
    s.addText(a.label, { x: 0.75, y: a.y + 0.05, w: 3.5, h: a.h - 0.1, fontSize: 9, fontFace: "Calibri", color: a.textColor, valign: "middle", margin: 0 });
  });

  // Right side descriptions
  card(s, 4.9, 1.55, 4.6, 3.55, { leftBar: C.accent });
  s.addText("4つのエリアで構成されています", { x: 5.2, y: 1.65, w: 4.1, h: 0.3, fontSize: 14, fontFace: "Calibri", bold: true, color: C.secondary, margin: 0 });
  s.addText([
    { text: "❶ 上部バー", options: { bold: true, breakLine: true, fontSize: 12 } },
    { text: "マニュアルのタイトルを入力。保存やPDF出力もここから。", options: { breakLine: true } },
    { text: "", options: { breakLine: true } },
    { text: "❷ 操作ボタン", options: { bold: true, breakLine: true, fontSize: 12 } },
    { text: "写真の追加、文字の追加、拡大・縮小、元に戻すなどの", options: { breakLine: true } },
    { text: "操作ボタンが並んでいます。", options: { breakLine: true } },
    { text: "", options: { breakLine: true } },
    { text: "❸ 編集エリア", options: { bold: true, breakLine: true, fontSize: 12 } },
    { text: "紙のイメージで表示。写真や文字を自由に配置できます。", options: { breakLine: true } },
    { text: "", options: { breakLine: true } },
    { text: "❹ ページ一覧", options: { bold: true, breakLine: true, fontSize: 12 } },
    { text: "ページの切り替え、追加ができます。", options: {} },
  ], { x: 5.2, y: 2.05, w: 4.1, h: 2.9, fontSize: 10, fontFace: "Calibri", color: C.textBody, lineSpacingMultiple: 1.25 });

  // ════════════════════════════════════════
  // SLIDE 8: Editor - Photo & Text
  // ════════════════════════════════════════
  s = pres.addSlide();
  sectionHeader(s, "④ 編集画面 — 写真・テキストの操作", 8);

  // Photo operations
  card(s, 0.6, 1.2, 4.3, 2.2, { topBar: C.primary });
  s.addText("📷  写真の操作", { x: 0.8, y: 1.35, w: 3.8, h: 0.35, fontSize: 15, fontFace: "Calibri", bold: true, color: C.secondary, margin: 0 });
  s.addText([
    { text: "スマホのカメラで撮影", options: { bold: true, breakLine: true } },
    { text: "撮った写真がそのままマニュアルに貼り付けられます", options: { breakLine: true } },
    { text: "", options: { breakLine: true } },
    { text: "写真フォルダからも選択可能", options: { bold: true, breakLine: true } },
    { text: "既に撮影済みの写真も使えます", options: { breakLine: true } },
    { text: "", options: { breakLine: true } },
    { text: "指で自由に操作", options: { bold: true, breakLine: true } },
    { text: "大きさの変更・好きな位置への移動が可能", options: {} },
  ], { x: 0.8, y: 1.75, w: 3.9, h: 1.5, fontSize: 10, fontFace: "Calibri", color: C.textBody, lineSpacingMultiple: 1.25 });

  // Text operations
  card(s, 5.2, 1.2, 4.3, 2.2, { topBar: C.accent });
  s.addText("Aa  テキストの操作", { x: 5.4, y: 1.35, w: 3.8, h: 0.35, fontSize: 15, fontFace: "Calibri", bold: true, color: C.secondary, margin: 0 });
  s.addText([
    { text: "文字を入力して配置", options: { bold: true, breakLine: true } },
    { text: "手順の説明や注意書きなどを追加できます", options: { breakLine: true } },
    { text: "", options: { breakLine: true } },
    { text: "文字の大きさを変更可能", options: { bold: true, breakLine: true } },
    { text: "見出しは大きく、説明は小さくなど自由に調整", options: { breakLine: true } },
    { text: "", options: { breakLine: true } },
    { text: "好きな位置に移動", options: { bold: true, breakLine: true } },
    { text: "指でドラッグして配置を調整できます", options: {} },
  ], { x: 5.4, y: 1.75, w: 3.9, h: 1.5, fontSize: 10, fontFace: "Calibri", color: C.textBody, lineSpacingMultiple: 1.25 });

  // Undo feature
  card(s, 0.6, 3.7, 8.9, 1.2, { topBar: C.success });
  s.addText("↩  便利な機能", { x: 0.8, y: 3.85, w: 4, h: 0.3, fontSize: 15, fontFace: "Calibri", bold: true, color: C.secondary, margin: 0 });
  s.addText([
    { text: "元に戻す（やり直し）機能", options: { bold: true, breakLine: true } },
    { text: "操作を間違えても、ボタン一つで元の状態に戻せます。何段階でも戻せるので安心して編集できます。", options: {} },
  ], { x: 0.8, y: 4.25, w: 8.5, h: 0.55, fontSize: 11, fontFace: "Calibri", color: C.textBody, lineSpacingMultiple: 1.3 });

  // ════════════════════════════════════════
  // SLIDE 9: Editor - Page Management
  // ════════════════════════════════════════
  s = pres.addSlide();
  sectionHeader(s, "④ 編集画面 — ページ管理・その他の操作", 9);

  card(s, 0.6, 1.2, 4.5, 2.3, { leftBar: C.primary });
  s.addText("📑  ページの管理", { x: 0.85, y: 1.3, w: 4, h: 0.35, fontSize: 15, fontFace: "Calibri", bold: true, color: C.secondary, margin: 0 });
  s.addText([
    { text: "複数ページのマニュアルを作成できます", options: { bullet: true, breakLine: true } },
    { text: "「＋」ボタンでページを追加", options: { bullet: true, breakLine: true } },
    { text: "不要なページは長押しで削除", options: { bullet: true, breakLine: true } },
    { text: "画面下部のページ一覧から、見たいページに", options: { bullet: true, breakLine: true } },
    { text: "すぐに移動できます", options: { breakLine: true } },
    { text: "編集内容は「保存」ボタンで端末に保存されます", options: { bullet: true } },
  ], { x: 0.85, y: 1.75, w: 4.0, h: 1.6, fontSize: 11, fontFace: "Calibri", color: C.textBody, lineSpacingMultiple: 1.3 });

  card(s, 5.4, 1.2, 4.1, 2.3, { leftBar: C.accent });
  s.addText("👆  選択時の操作", { x: 5.65, y: 1.3, w: 3.5, h: 0.35, fontSize: 15, fontFace: "Calibri", bold: true, color: C.secondary, margin: 0 });
  s.addText("写真やテキストをタップして選択すると、以下の操作ができます：", { x: 5.65, y: 1.7, w: 3.6, h: 0.4, fontSize: 10, fontFace: "Calibri", color: C.textBody, margin: 0 });
  const ops = [
    ["📋 コピー", "同じ写真や文字を複製します"],
    ["⬆ 前に出す", "重なっている場合、手前に表示"],
    ["⬇ 後ろに下げる", "重なっている場合、奥に表示"],
    ["🗑 削除", "選択した要素を削除します"],
  ];
  ops.forEach((op, i) => {
    const oy = 2.15 + i * 0.32;
    s.addText(op[0], { x: 5.65, y: oy, w: 1.3, h: 0.28, fontSize: 10, fontFace: "Calibri", bold: true, color: C.textDark, margin: 0 });
    s.addText(op[1], { x: 6.95, y: oy, w: 2.3, h: 0.28, fontSize: 10, fontFace: "Calibri", color: C.textMuted, margin: 0 });
  });

  // Summary box
  card(s, 0.6, 3.8, 8.9, 1.3, { topBar: C.warning });
  s.addText("💡  編集画面のポイント", { x: 0.8, y: 3.95, w: 4, h: 0.3, fontSize: 14, fontFace: "Calibri", bold: true, color: C.secondary, margin: 0 });
  s.addText([
    { text: "スマホの画面上で、紙のマニュアルを作るイメージで操作できます。", options: { breakLine: true } },
    { text: "写真を撮って貼り付け、説明文を入力するだけ。直感的な操作で、特別な知識は不要です。", options: {} },
  ], { x: 0.8, y: 4.35, w: 8.5, h: 0.6, fontSize: 11, fontFace: "Calibri", color: C.textBody, lineSpacingMultiple: 1.4 });

  // ════════════════════════════════════════
  // SLIDE 10: PDF Export
  // ════════════════════════════════════════
  s = pres.addSlide();
  sectionHeader(s, "⑤ PDF出力画面", 10);

  // Mockup
  card(s, 0.6, 1.2, 3.0, 3.5);
  s.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 1.2, w: 3.0, h: 0.45, fill: { color: C.card }, line: { color: C.border, width: 0.5 } });
  s.addText("PDF出力                         ✕", { x: 0.75, y: 1.23, w: 2.7, h: 0.4, fontSize: 11, fontFace: "Calibri", bold: true, color: C.textDark, margin: 0 });

  s.addText("用紙サイズ", { x: 0.8, y: 1.8, w: 2.5, h: 0.22, fontSize: 9, fontFace: "Calibri", bold: true, color: C.textBody, margin: 0 });
  ["A4", "A3", "B4"].forEach((sz, i) => {
    const sel = i === 0;
    s.addShape(pres.shapes.RECTANGLE, { x: 0.8 + i * 0.8, y: 2.1, w: 0.65, h: 0.32, fill: { color: sel ? C.sky : C.card }, line: { color: sel ? C.accent : C.border, width: sel ? 1.5 : 0.5 } });
    s.addText(sz, { x: 0.8 + i * 0.8, y: 2.1, w: 0.65, h: 0.32, fontSize: 10, fontFace: "Calibri", bold: true, color: sel ? C.primary : C.textMuted, align: "center", valign: "middle" });
  });

  s.addText("プレビュー", { x: 0.8, y: 2.55, w: 2.5, h: 0.22, fontSize: 9, fontFace: "Calibri", bold: true, color: C.textBody, margin: 0 });
  [1, 2].forEach((p, i) => {
    s.addShape(pres.shapes.RECTANGLE, { x: 0.8 + i * 0.7, y: 2.85, w: 0.55, h: 0.75, fill: { color: C.bg }, line: { color: C.border, width: 0.5 } });
    s.addText(String(p), { x: 0.8 + i * 0.7, y: 3.1, w: 0.55, h: 0.25, fontSize: 8, color: C.textMuted, align: "center" });
  });

  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 3.85, w: 1.25, h: 0.4, fill: { color: C.accent } });
  s.addText("📄 PDF出力", { x: 0.8, y: 3.85, w: 1.25, h: 0.4, fontSize: 10, fontFace: "Calibri", bold: true, color: C.card, align: "center", valign: "middle" });
  s.addShape(pres.shapes.RECTANGLE, { x: 2.15, y: 3.85, w: 1.25, h: 0.4, fill: { color: C.secondary } });
  s.addText("🖨 印刷", { x: 2.15, y: 3.85, w: 1.25, h: 0.4, fontSize: 10, fontFace: "Calibri", bold: true, color: C.card, align: "center", valign: "middle" });

  card(s, 4.1, 1.2, 5.4, 3.5, { leftBar: C.primary });
  s.addText("この画面でできること", { x: 4.4, y: 1.35, w: 4.8, h: 0.35, fontSize: 16, fontFace: "Calibri", bold: true, color: C.secondary, margin: 0 });
  s.addText([
    { text: "PDFファイルとして保存", options: { bold: true, breakLine: true, fontSize: 13 } },
    { text: "作成したマニュアルをPDFファイルとしてスマホに", options: { breakLine: true } },
    { text: "ダウンロードできます。メールで共有も可能です。", options: { breakLine: true } },
    { text: "", options: { breakLine: true } },
    { text: "そのまま印刷", options: { bold: true, breakLine: true, fontSize: 13 } },
    { text: "印刷ボタンを押すだけで、プリンターから", options: { breakLine: true } },
    { text: "直接印刷できます。", options: { breakLine: true } },
    { text: "", options: { breakLine: true } },
    { text: "用紙サイズの選択", options: { bold: true, breakLine: true, fontSize: 13 } },
    { text: "A4 / A3 / B4 の3種類から選べます。", options: { breakLine: true } },
    { text: "", options: { breakLine: true } },
    { text: "出力前にプレビューで仕上がりを確認できます", options: { italic: true, color: C.accent } },
  ], { x: 4.4, y: 1.8, w: 4.8, h: 3.0, fontSize: 11, fontFace: "Calibri", color: C.textBody, lineSpacingMultiple: 1.3 });

  // ════════════════════════════════════════
  // SLIDE 11: File Management
  // ════════════════════════════════════════
  s = pres.addSlide();
  sectionHeader(s, "⑥ ファイル管理画面", 11);

  card(s, 0.6, 1.2, 3.0, 4.0);
  s.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 1.2, w: 3.0, h: 0.45, fill: { color: C.secondary } });
  s.addText("← ファイル一覧", { x: 0.75, y: 1.23, w: 2.5, h: 0.4, fontSize: 10, fontFace: "Calibri", bold: true, color: C.card, margin: 0 });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 1.8, w: 2.6, h: 0.32, fill: { color: C.card }, line: { color: C.border, width: 0.5 } });
  s.addText("🔍 タイトルで検索...", { x: 0.85, y: 1.8, w: 2.4, h: 0.32, fontSize: 8, fontFace: "Calibri", color: C.textMuted, valign: "middle", margin: 0 });
  ["更新日順", "作成日順", "タイトル順"].forEach((lbl, i) => {
    s.addShape(pres.shapes.RECTANGLE, { x: 0.8 + i * 0.88, y: 2.25, w: 0.78, h: 0.22, fill: { color: i === 0 ? C.sky : C.card }, line: { color: i === 0 ? C.accent : C.border, width: 0.5 } });
    s.addText(lbl, { x: 0.8 + i * 0.88, y: 2.25, w: 0.78, h: 0.22, fontSize: 7, fontFace: "Calibri", bold: true, color: i === 0 ? C.primary : C.textMuted, align: "center", valign: "middle" });
  });
  const files = [
    ["📄", "客室清掃マニュアル", "04/15 · 3ページ"],
    ["📄", "基本手順書", "04/14 · 2ページ"],
    ["📄", "衛生チェックリスト", "04/13 · 2ページ"],
  ];
  files.forEach((f, i) => {
    const fy = 2.65 + i * 0.6;
    s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: fy, w: 2.6, h: 0.48, fill: { color: C.card }, line: { color: C.border, width: 0.5 } });
    s.addText(f[0], { x: 0.85, y: fy + 0.03, w: 0.35, h: 0.4, fontSize: 14, align: "center", valign: "middle" });
    s.addText(f[1], { x: 1.2, y: fy + 0.04, w: 1.9, h: 0.22, fontSize: 9, fontFace: "Calibri", bold: true, color: C.textDark, margin: 0 });
    s.addText(f[2], { x: 1.2, y: fy + 0.26, w: 1.9, h: 0.18, fontSize: 7, fontFace: "Calibri", color: C.textMuted, margin: 0 });
  });

  card(s, 4.1, 1.2, 5.4, 4.0, { leftBar: C.primary });
  s.addText("この画面でできること", { x: 4.4, y: 1.35, w: 4.8, h: 0.35, fontSize: 16, fontFace: "Calibri", bold: true, color: C.secondary, margin: 0 });
  s.addText([
    { text: "保存済みマニュアルの一覧表示", options: { bold: true, breakLine: true, fontSize: 13 } },
    { text: "タイトル・更新日・ページ数が一目でわかります。", options: { breakLine: true } },
    { text: "タップするだけで編集を再開できます。", options: { breakLine: true } },
    { text: "", options: { breakLine: true } },
    { text: "検索機能", options: { bold: true, breakLine: true, fontSize: 13 } },
    { text: "タイトルを入力して、目的のファイルをすばやく", options: { breakLine: true } },
    { text: "見つけられます。", options: { breakLine: true } },
    { text: "", options: { breakLine: true } },
    { text: "並び替え", options: { bold: true, breakLine: true, fontSize: 13 } },
    { text: "更新日順・作成日順・タイトル順で並べ替え可能。", options: { breakLine: true } },
    { text: "", options: { breakLine: true } },
    { text: "ファイルの複製・削除", options: { bold: true, breakLine: true, fontSize: 13 } },
    { text: "長押しでメニューが表示されます。", options: {} },
  ], { x: 4.4, y: 1.8, w: 4.8, h: 3.2, fontSize: 11, fontFace: "Calibri", color: C.textBody, lineSpacingMultiple: 1.25 });

  // ════════════════════════════════════════
  // SLIDE 12: Estimate
  // ════════════════════════════════════════
  s = pres.addSlide();
  s.background = { color: C.bg };
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.9, fill: { color: C.secondary } });
  s.addText("お見積もり", { x: 0.6, y: 0.15, w: 8.8, h: 0.6, fontSize: 24, fontFace: "Calibri", bold: true, color: C.card, margin: 0 });
  slideNum(s, 12);

  // Main price
  card(s, 0.6, 1.2, 8.8, 1.5, { topBar: C.accent });
  s.addText("開発費用", { x: 0.8, y: 1.4, w: 3, h: 0.3, fontSize: 14, fontFace: "Calibri", bold: true, color: C.secondary, margin: 0 });
  s.addText("350万円", { x: 3.5, y: 1.25, w: 3, h: 0.7, fontSize: 44, fontFace: "Calibri", bold: true, color: C.primary, margin: 0 });
  s.addText("（税別）前後", { x: 6.3, y: 1.55, w: 2, h: 0.3, fontSize: 14, fontFace: "Calibri", color: C.textBody, margin: 0 });
  s.addText([
    { text: "納品後の保守あり前提のお見積もりです", options: { bullet: true, breakLine: true } },
    { text: "納品物: プログラム／操作マニュアル", options: { bullet: true, breakLine: true } },
    { text: "サーバー不要のため、月額のサーバー費用はかかりません", options: { bullet: true } },
  ], { x: 0.8, y: 2.0, w: 8.4, h: 0.6, fontSize: 10, fontFace: "Calibri", color: C.textBody, lineSpacingMultiple: 1.3 });

  // Option
  card(s, 0.6, 3.0, 4.2, 1.1, { leftBar: C.warning });
  s.addText("オプション", { x: 0.85, y: 3.1, w: 3, h: 0.25, fontSize: 12, fontFace: "Calibri", bold: true, color: C.secondary, margin: 0 });
  s.addText([
    { text: "設計書・テスト仕様書等の追加", options: { breakLine: true } },
    { text: "", options: { breakLine: true } },
    { text: "＋100万円（税別）前後", options: { bold: true, fontSize: 14, color: C.primary } },
  ], { x: 0.85, y: 3.4, w: 3.7, h: 0.6, fontSize: 11, fontFace: "Calibri", color: C.textBody, lineSpacingMultiple: 1.3 });

  // Note
  card(s, 5.1, 3.0, 4.3, 1.1, { leftBar: C.textMuted });
  s.addText("ご参考", { x: 5.35, y: 3.1, w: 3, h: 0.25, fontSize: 12, fontFace: "Calibri", bold: true, color: C.secondary, margin: 0 });
  s.addText([
    { text: "※ AWS等のサーバーを使用する場合は、", options: { breakLine: true } },
    { text: "  弊社とは別に月の使用量に応じて", options: { breakLine: true } },
    { text: "  費用が掛かります。", options: {} },
  ], { x: 5.35, y: 3.4, w: 3.8, h: 0.6, fontSize: 10, fontFace: "Calibri", color: C.textMuted, lineSpacingMultiple: 1.3 });

  // Important note
  card(s, 0.6, 4.4, 8.8, 0.8, { topBar: C.success });
  s.addText("✅  本アプリはサーバーを使用しないため、月額のサーバー費用は発生しません。", { x: 0.8, y: 4.55, w: 8.4, h: 0.3, fontSize: 12, fontFace: "Calibri", bold: true, color: C.success, margin: 0 });
  s.addText("データはご利用端末内に保存されます。", { x: 0.8, y: 4.85, w: 8.4, h: 0.25, fontSize: 10, fontFace: "Calibri", color: C.textBody, margin: 0 });

  // ════════════════════════════════════════
  // SLIDE 13: Schedule
  // ════════════════════════════════════════
  s = pres.addSlide();
  s.background = { color: C.bg };
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.9, fill: { color: C.secondary } });
  s.addText("開発スケジュール", { x: 0.6, y: 0.15, w: 8.8, h: 0.6, fontSize: 24, fontFace: "Calibri", bold: true, color: C.card, margin: 0 });
  slideNum(s, 13);

  s.addText("全体: 約6か月", { x: 0.6, y: 1.1, w: 4, h: 0.35, fontSize: 16, fontFace: "Calibri", bold: true, color: C.primary, margin: 0 });

  // Timeline
  const phases = [
    { month: "1か月目", title: "要件定義・設計", desc: "お客様と仕様の詳細を決定します。\n画面のデザインや機能の内容を\nすり合わせます。", color: C.primary, w: 1.5 },
    { month: "2〜3か月目", title: "開発・単体テスト", desc: "アプリの機能を一つずつ\n作成し、個別にテストします。", color: C.accent, w: 3.0 },
    { month: "4か月目", title: "結合テスト", desc: "アプリ全体を通して\n動作を確認します。", color: "10B981", w: 1.5 },
    { month: "5〜6か月目", title: "リリース対応", desc: "最終調整・公開準備を行います。\n予備期間を含みます。", color: C.warning, w: 3.0 },
  ];

  // Gantt-like bar
  let barX = 0.6;
  phases.forEach((p, i) => {
    const barW = p.w * 1.45;
    // Bar
    s.addShape(pres.shapes.RECTANGLE, { x: barX, y: 1.7, w: barW, h: 0.5, fill: { color: p.color } });
    s.addText(p.month, { x: barX, y: 1.73, w: barW, h: 0.44, fontSize: 11, fontFace: "Calibri", bold: true, color: C.card, align: "center", valign: "middle" });

    // Description card below
    card(s, barX, 2.4, barW - 0.1, 2.2);
    s.addText(p.title, { x: barX + 0.1, y: 2.5, w: barW - 0.3, h: 0.3, fontSize: 13, fontFace: "Calibri", bold: true, color: p.color, margin: 0 });
    s.addText(p.desc, { x: barX + 0.1, y: 2.85, w: barW - 0.3, h: 1.5, fontSize: 10, fontFace: "Calibri", color: C.textBody, lineSpacingMultiple: 1.4, margin: 0 });

    barX += barW + 0.08;
  });

  s.addText("※ スケジュールは目安です。仕様変更等により前後する場合がございます。", { x: 0.6, y: 4.85, w: 8.8, h: 0.3, fontSize: 10, fontFace: "Calibri", color: C.textMuted, margin: 0 });

  // ════════════════════════════════════════
  // SLIDE 14: Supplementary Notes
  // ════════════════════════════════════════
  s = pres.addSlide();
  s.background = { color: C.bg };
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.9, fill: { color: C.secondary } });
  s.addText("補足事項", { x: 0.6, y: 0.15, w: 8.8, h: 0.6, fontSize: 24, fontFace: "Calibri", bold: true, color: C.card, margin: 0 });
  slideNum(s, 14);

  // Data storage
  card(s, 0.6, 1.2, 4.3, 1.7, { topBar: C.primary });
  s.addText("💾  データの保存先", { x: 0.8, y: 1.35, w: 3.8, h: 0.3, fontSize: 14, fontFace: "Calibri", bold: true, color: C.secondary, margin: 0 });
  s.addText([
    { text: "スマホの端末内に保存されます", options: { bullet: true, breakLine: true } },
    { text: "サーバーを使わないため、月額費用が不要です", options: { bullet: true, breakLine: true } },
    { text: "", options: { breakLine: true } },
    { text: "※ データは端末に紐づくため、別の端末には", options: { fontSize: 9, color: C.textMuted, breakLine: true } },
    { text: "   自動で共有されません", options: { fontSize: 9, color: C.textMuted } },
  ], { x: 0.8, y: 1.72, w: 3.9, h: 1.05, fontSize: 11, fontFace: "Calibri", color: C.textBody, lineSpacingMultiple: 1.3 });

  // Devices
  card(s, 5.2, 1.2, 4.3, 1.7, { topBar: C.accent });
  s.addText("📱  対応端末", { x: 5.4, y: 1.35, w: 3.8, h: 0.3, fontSize: 14, fontFace: "Calibri", bold: true, color: C.secondary, margin: 0 });
  s.addText([
    { text: "iPhone（最優先で対応）", options: { bullet: true, breakLine: true, bold: true } },
    { text: "Android スマートフォン", options: { bullet: true, breakLine: true } },
    { text: "パソコン（確認用）", options: { bullet: true, breakLine: true } },
    { text: "", options: { breakLine: true } },
    { text: "スマホのホーム画面に追加すると、", options: { fontSize: 10, color: C.textMuted, breakLine: true } },
    { text: "アプリのアイコンのように使えます", options: { fontSize: 10, color: C.textMuted } },
  ], { x: 5.4, y: 1.72, w: 3.9, h: 1.05, fontSize: 11, fontFace: "Calibri", color: C.textBody, lineSpacingMultiple: 1.25 });

  // Future expansion
  card(s, 0.6, 3.2, 8.9, 1.5, { topBar: C.warning });
  s.addText("🚀  将来の拡張例", { x: 0.8, y: 3.35, w: 4, h: 0.3, fontSize: 14, fontFace: "Calibri", bold: true, color: C.secondary, margin: 0 });

  const expansions = [
    ["☁️", "クラウド保存", "インターネット上にデータを\n保存し、端末の故障時も安心"],
    ["🔄", "複数端末で共有", "スマホ・パソコン間で\n同じデータを利用可能"],
    ["📋", "テンプレート追加", "お客様の業務に合わせた\nオリジナルテンプレート"],
    ["👥", "チーム管理", "複数メンバーでの\nマニュアル共同編集"],
  ];
  expansions.forEach((e, i) => {
    const ex = 0.8 + i * 2.2;
    s.addText(e[0], { x: ex, y: 3.7, w: 0.4, h: 0.35, fontSize: 18, align: "center", valign: "middle" });
    s.addText(e[1], { x: ex + 0.4, y: 3.7, w: 1.6, h: 0.25, fontSize: 11, fontFace: "Calibri", bold: true, color: C.textDark, margin: 0 });
    s.addText(e[2], { x: ex + 0.4, y: 3.97, w: 1.6, h: 0.6, fontSize: 9, fontFace: "Calibri", color: C.textMuted, lineSpacingMultiple: 1.3, margin: 0 });
  });

  s.addText("※ 拡張機能は別途お見積もりとなります", { x: 0.6, y: 4.85, w: 8.8, h: 0.3, fontSize: 10, fontFace: "Calibri", color: C.textMuted, margin: 0 });

  // ── Save ──
  const outPath = "C:/Users/81805/JavaPractice/ClaudeCodePractice/manual_app_pwa/manual_app_client_spec.pptx";
  await pres.writeFile({ fileName: outPath });
  console.log("Created: " + outPath);
}

main().catch(console.error);
