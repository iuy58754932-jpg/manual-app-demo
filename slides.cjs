const pptxgen = require("pptxgenjs");

// ── Color Palette ──
const C = {
  primary: "065A82",
  secondary: "1E2761",
  accent: "0891B2",
  bg: "F6F8FB",
  card: "FFFFFF",
  textPrimary: "1A1F36",
  textSecondary: "3A4560",
  textMuted: "8896A7",
  border: "E2E8F0",
  sky: "E8F4FD",
  success: "10B981",
  error: "EF4444",
  dark: "0F172A",
};

const mkShadow = () => ({ type: "outer", blur: 8, offset: 3, angle: 135, color: "000000", opacity: 0.10 });
const mkCardShadow = () => ({ type: "outer", blur: 6, offset: 2, angle: 135, color: "000000", opacity: 0.08 });

function addSlideNumber(slide, num) {
  slide.addText(String(num), { x: 9.2, y: 5.15, w: 0.5, h: 0.35, fontSize: 10, color: C.textMuted, align: "right" });
}

function addSectionTitle(slide, title, subtitle) {
  slide.addText(title, { x: 0.6, y: 0.35, w: 8.8, h: 0.5, fontSize: 28, fontFace: "Calibri", bold: true, color: C.secondary, margin: 0 });
  if (subtitle) {
    slide.addText(subtitle, { x: 0.6, y: 0.85, w: 8.8, h: 0.3, fontSize: 13, fontFace: "Calibri", color: C.textMuted, margin: 0 });
  }
}

function addCard(slide, x, y, w, h, opts = {}) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w, h,
    fill: { color: opts.fill || C.card },
    shadow: mkCardShadow(),
    line: opts.border ? { color: C.border, width: 0.5 } : undefined,
  });
  if (opts.accentLeft) {
    slide.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 0.06, h,
      fill: { color: opts.accentColor || C.accent },
    });
  }
}

// ── Main ──
let pres;

async function main() {
  pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.author = "Claude Code";
  pres.title = "マニュアル作成アプリ - 画面仕様書";

  // ════════════════════════════════════════
  // SLIDE 1: Cover
  // ════════════════════════════════════════
  let s1 = pres.addSlide();
  s1.background = { color: C.secondary };
  // Decorative shape
  s1.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 5.625, fill: { color: C.secondary } });
  s1.addShape(pres.shapes.RECTANGLE, { x: 6.5, y: 0, w: 3.5, h: 5.625, fill: { color: C.primary } });
  // Logo
  s1.addShape(pres.shapes.RECTANGLE, { x: 7.5, y: 1.6, w: 1.5, h: 1.5, fill: { color: C.accent }, shadow: mkShadow() });
  s1.addText("M", { x: 7.5, y: 1.6, w: 1.5, h: 1.5, fontSize: 56, fontFace: "Calibri", bold: true, color: C.card, align: "center", valign: "middle" });
  // Title
  s1.addText("マニュアル作成アプリ", { x: 0.8, y: 1.2, w: 5.5, h: 0.8, fontSize: 36, fontFace: "Calibri", bold: true, color: C.card, margin: 0 });
  s1.addText("画面仕様書", { x: 0.8, y: 2.0, w: 5.5, h: 0.6, fontSize: 24, fontFace: "Calibri", color: C.accent, margin: 0 });
  s1.addShape(pres.shapes.LINE, { x: 0.8, y: 2.8, w: 2.5, h: 0, line: { color: C.accent, width: 3 } });
  s1.addText([
    { text: "業務用マニュアルを作成するPWA", options: { breakLine: true } },
    { text: "テンプレート選択 / 写真＋テキスト編集 / PDF出力", options: { breakLine: true } },
    { text: "モバイルファースト設計（iOS Safari最優先）" },
  ], { x: 0.8, y: 3.1, w: 5.5, h: 1.5, fontSize: 14, fontFace: "Calibri", color: "CADCFC", lineSpacingMultiple: 1.6, margin: 0 });
  s1.addText("v1.0", { x: 0.8, y: 5.0, w: 2, h: 0.3, fontSize: 11, fontFace: "Calibri", color: C.textMuted });

  // ════════════════════════════════════════
  // SLIDE 2: Screen Flow
  // ════════════════════════════════════════
  let s2 = pres.addSlide();
  s2.background = { color: C.bg };
  addSectionTitle(s2, "画面遷移フロー", "Screen Transition Flow");
  addSlideNumber(s2, 2);

  // Flow boxes
  const flowBoxes = [
    { label: "① ホーム", x: 0.6, y: 1.5, emoji: "🏠" },
    { label: "② 業種選択", x: 2.7, y: 1.5, emoji: "🏭" },
    { label: "③ テンプレート選択", x: 4.8, y: 1.5, emoji: "📋" },
    { label: "④ マニュアル編集", x: 7.0, y: 1.5, emoji: "✏️" },
  ];
  for (const box of flowBoxes) {
    s2.addShape(pres.shapes.RECTANGLE, { x: box.x, y: box.y, w: 1.8, h: 1.0, fill: { color: C.card }, shadow: mkCardShadow(), line: { color: C.border, width: 0.5 } });
    s2.addText(box.emoji, { x: box.x, y: box.y + 0.05, w: 1.8, h: 0.5, fontSize: 24, align: "center", valign: "middle" });
    s2.addText(box.label, { x: box.x, y: box.y + 0.6, w: 1.8, h: 0.35, fontSize: 10, fontFace: "Calibri", bold: true, color: C.textPrimary, align: "center", margin: 0 });
  }
  // Arrows
  for (let i = 0; i < flowBoxes.length - 1; i++) {
    const ax = flowBoxes[i].x + 1.8;
    s2.addText("→", { x: ax, y: 1.75, w: 0.9, h: 0.4, fontSize: 20, color: C.accent, align: "center", valign: "middle" });
  }

  // Bottom row
  const bottomBoxes = [
    { label: "⑤ PDF出力", x: 7.0, y: 3.0, emoji: "📄" },
    { label: "⑥ ファイル選択", x: 2.7, y: 3.0, emoji: "📂" },
  ];
  for (const box of bottomBoxes) {
    s2.addShape(pres.shapes.RECTANGLE, { x: box.x, y: box.y, w: 1.8, h: 1.0, fill: { color: C.card }, shadow: mkCardShadow(), line: { color: C.border, width: 0.5 } });
    s2.addText(box.emoji, { x: box.x, y: box.y + 0.05, w: 1.8, h: 0.5, fontSize: 24, align: "center", valign: "middle" });
    s2.addText(box.label, { x: box.x, y: box.y + 0.6, w: 1.8, h: 0.35, fontSize: 10, fontFace: "Calibri", bold: true, color: C.textPrimary, align: "center", margin: 0 });
  }
  // Vertical arrows
  s2.addText("↓", { x: 7.6, y: 2.5, w: 0.6, h: 0.5, fontSize: 20, color: C.accent, align: "center" });
  s2.addText("→", { x: 1.5, y: 3.2, w: 1.2, h: 0.4, fontSize: 14, color: C.accent, align: "center" });
  s2.addText("↗", { x: 3.9, y: 2.6, w: 0.6, h: 0.5, fontSize: 16, color: C.textMuted, align: "center" });

  // Legend
  s2.addText([
    { text: "[新規作成] → ② → ③ → ④ → ⑤", options: { breakLine: true, fontSize: 11 } },
    { text: "[ファイル読み込み] → ⑥ → ④", options: { breakLine: true, fontSize: 11 } },
    { text: "[最近のファイル] → ④", options: { fontSize: 11 } },
  ], { x: 0.6, y: 4.3, w: 5, h: 1.0, fontFace: "Calibri", color: C.textSecondary, lineSpacingMultiple: 1.5 });

  // ════════════════════════════════════════
  // SLIDE 3: Color Palette & Design Rules
  // ════════════════════════════════════════
  let s3 = pres.addSlide();
  s3.background = { color: C.bg };
  addSectionTitle(s3, "カラーパレット・デザインルール", "Color Palette & Design Rules");
  addSlideNumber(s3, 3);

  // Color swatches
  const colors = [
    { name: "Primary", hex: C.primary, desc: "深い青" },
    { name: "Secondary", hex: C.secondary, desc: "紺" },
    { name: "Accent", hex: C.accent, desc: "ティール" },
    { name: "Background", hex: C.bg, desc: "オフホワイト" },
    { name: "Text Primary", hex: C.textPrimary, desc: "メインテキスト" },
    { name: "Border", hex: C.border, desc: "ボーダー" },
    { name: "Success", hex: C.success, desc: "成功" },
    { name: "Error", hex: C.error, desc: "エラー" },
  ];
  colors.forEach((c, i) => {
    const col = i % 4;
    const row = Math.floor(i / 4);
    const cx = 0.6 + col * 2.25;
    const cy = 1.4 + row * 1.3;
    s3.addShape(pres.shapes.RECTANGLE, { x: cx, y: cy, w: 0.6, h: 0.6, fill: { color: c.hex }, shadow: mkCardShadow() });
    s3.addText(c.name, { x: cx + 0.75, y: cy, w: 1.4, h: 0.3, fontSize: 11, fontFace: "Calibri", bold: true, color: C.textPrimary, margin: 0 });
    s3.addText(`#${c.hex} (${c.desc})`, { x: cx + 0.75, y: cy + 0.28, w: 1.4, h: 0.3, fontSize: 9, fontFace: "Calibri", color: C.textMuted, margin: 0 });
  });

  // Design rules
  addCard(s3, 0.6, 4.0, 8.8, 1.3, { accentLeft: true, accentColor: C.primary });
  s3.addText("デザインルール", { x: 0.85, y: 4.05, w: 3, h: 0.3, fontSize: 13, fontFace: "Calibri", bold: true, color: C.secondary, margin: 0 });
  s3.addText([
    { text: "角丸: 12px (カード) / 10px (ボタン) / 8px (小要素)    ", options: { breakLine: true } },
    { text: "シャドウ: 0 2px 12px rgba(30,39,97,0.08)    ", options: { breakLine: true } },
    { text: "タップターゲット: 最低44px x 44px    |    フォント: Noto Sans JP    |    iOS Safe Area対応" },
  ], { x: 0.85, y: 4.4, w: 8.3, h: 0.85, fontSize: 10, fontFace: "Calibri", color: C.textSecondary, lineSpacingMultiple: 1.5 });

  // ════════════════════════════════════════
  // SLIDE 4: Home Screen
  // ════════════════════════════════════════
  let s4 = pres.addSlide();
  s4.background = { color: C.bg };
  addSectionTitle(s4, "① 起動画面（ホーム）", "Home Screen");
  addSlideNumber(s4, 4);

  // Phone mockup area
  addCard(s4, 0.6, 1.3, 3.2, 4.0);
  s4.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 1.3, w: 3.2, h: 0.5, fill: { color: C.secondary } });
  s4.addText("マニュアル作成", { x: 0.8, y: 1.33, w: 2.8, h: 0.44, fontSize: 11, fontFace: "Calibri", bold: true, color: C.card, margin: 0 });
  // Logo placeholder
  s4.addShape(pres.shapes.RECTANGLE, { x: 1.7, y: 2.0, w: 0.8, h: 0.8, fill: { color: C.accent } });
  s4.addText("M", { x: 1.7, y: 2.0, w: 0.8, h: 0.8, fontSize: 28, fontFace: "Calibri", bold: true, color: C.card, align: "center", valign: "middle" });
  s4.addText("マニュアル作成アプリ", { x: 0.8, y: 2.9, w: 2.8, h: 0.3, fontSize: 11, fontFace: "Calibri", bold: true, color: C.secondary, align: "center", margin: 0 });
  // Buttons
  s4.addShape(pres.shapes.RECTANGLE, { x: 1.0, y: 3.4, w: 2.4, h: 0.4, fill: { color: C.accent } });
  s4.addText("＋ 新規作成", { x: 1.0, y: 3.4, w: 2.4, h: 0.4, fontSize: 10, fontFace: "Calibri", bold: true, color: C.card, align: "center", valign: "middle" });
  s4.addShape(pres.shapes.RECTANGLE, { x: 1.0, y: 3.95, w: 2.4, h: 0.4, fill: { color: C.card }, line: { color: C.border, width: 1 } });
  s4.addText("📂 ファイル読み込み", { x: 1.0, y: 3.95, w: 2.4, h: 0.4, fontSize: 10, fontFace: "Calibri", bold: true, color: C.primary, align: "center", valign: "middle" });
  // Recent files placeholder
  s4.addText("最近のファイル", { x: 1.0, y: 4.5, w: 2.4, h: 0.25, fontSize: 8, fontFace: "Calibri", color: C.textMuted, margin: 0 });
  s4.addShape(pres.shapes.RECTANGLE, { x: 1.0, y: 4.8, w: 2.4, h: 0.3, fill: { color: C.bg }, line: { color: C.border, width: 0.5 } });
  s4.addText("📄 客室清掃マニュアル  2026/04/15", { x: 1.1, y: 4.8, w: 2.2, h: 0.3, fontSize: 7, fontFace: "Calibri", color: C.textSecondary, valign: "middle", margin: 0 });

  // Specs
  addCard(s4, 4.3, 1.3, 5.2, 4.0, { accentLeft: true, accentColor: C.primary });
  s4.addText("画面仕様", { x: 4.6, y: 1.4, w: 4.5, h: 0.35, fontSize: 16, fontFace: "Calibri", bold: true, color: C.secondary, margin: 0 });
  s4.addText([
    { text: "構成要素", options: { bold: true, breakLine: true, fontSize: 12 } },
    { text: "アプリロゴ（青い角丸四角 + 白文字「M」）", options: { bullet: true, breakLine: true } },
    { text: "アプリ名「マニュアル作成アプリ」", options: { bullet: true, breakLine: true } },
    { text: "「新規作成」ボタン → ② 業種選択へ遷移", options: { bullet: true, breakLine: true } },
    { text: "「ファイル読み込み」ボタン → ⑥ ファイル選択へ遷移", options: { bullet: true, breakLine: true } },
    { text: "最近使用したファイル一覧（直近5件）", options: { bullet: true, breakLine: true } },
    { text: "", options: { breakLine: true } },
    { text: "最近のファイル表示", options: { bold: true, breakLine: true, fontSize: 12 } },
    { text: "IndexedDBから直近5件を取得", options: { bullet: true, breakLine: true } },
    { text: "サムネイル + タイトル + 更新日時", options: { bullet: true, breakLine: true } },
    { text: "タップ → ④ マニュアル編集（既存読込）へ遷移", options: { bullet: true } },
  ], { x: 4.6, y: 1.85, w: 4.7, h: 3.2, fontSize: 10, fontFace: "Calibri", color: C.textSecondary, lineSpacingMultiple: 1.3 });

  // ════════════════════════════════════════
  // SLIDE 5: Industry Selection
  // ════════════════════════════════════════
  let s5 = pres.addSlide();
  s5.background = { color: C.bg };
  addSectionTitle(s5, "② 業種テンプレート選択", "Industry Selection");
  addSlideNumber(s5, 5);

  // Grid mockup
  addCard(s5, 0.6, 1.3, 3.2, 4.0);
  s5.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 1.3, w: 3.2, h: 0.5, fill: { color: C.secondary } });
  s5.addText("← 業種選択", { x: 0.7, y: 1.33, w: 2.8, h: 0.44, fontSize: 11, fontFace: "Calibri", bold: true, color: C.card, margin: 0 });

  const industries = [
    ["🍽", "飲食"], ["🏭", "製造"], ["🧹", "清掃"], ["🏥", "医療"],
    ["🏨", "宿泊"], ["🏗", "建設"], ["🛒", "小売"], ["📚", "教育"],
  ];
  industries.forEach((ind, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const gx = 0.8 + col * 1.5;
    const gy = 2.0 + row * 0.8;
    s5.addShape(pres.shapes.RECTANGLE, { x: gx, y: gy, w: 1.3, h: 0.65, fill: { color: C.card }, line: { color: C.border, width: 0.5 } });
    s5.addText(ind[0], { x: gx, y: gy + 0.02, w: 1.3, h: 0.35, fontSize: 18, align: "center", margin: 0 });
    s5.addText(ind[1], { x: gx, y: gy + 0.36, w: 1.3, h: 0.25, fontSize: 9, fontFace: "Calibri", bold: true, color: C.textPrimary, align: "center", margin: 0 });
  });

  // Specs
  addCard(s5, 4.3, 1.3, 5.2, 4.0, { accentLeft: true, accentColor: C.accent });
  s5.addText("画面仕様", { x: 4.6, y: 1.4, w: 4.5, h: 0.35, fontSize: 16, fontFace: "Calibri", bold: true, color: C.secondary, margin: 0 });
  s5.addText([
    { text: "レイアウト", options: { bold: true, breakLine: true, fontSize: 12 } },
    { text: "2列グリッド表示", options: { bullet: true, breakLine: true } },
    { text: "各カード: アイコン（絵文字）+ 業種名", options: { bullet: true, breakLine: true } },
    { text: "ホバー: border-color変更 + 上方向2pxシフト", options: { bullet: true, breakLine: true } },
    { text: "タップ → ③ テンプレート選択へ遷移", options: { bullet: true, breakLine: true } },
    { text: "", options: { breakLine: true } },
    { text: "業種一覧（8業種）", options: { bold: true, breakLine: true, fontSize: 12 } },
    { text: "飲食 🍽  /  製造 🏭  /  清掃 🧹  /  医療 🏥", options: { bullet: true, breakLine: true } },
    { text: "宿泊 🏨  /  建設 🏗  /  小売 🛒  /  教育 📚", options: { bullet: true, breakLine: true } },
    { text: "", options: { breakLine: true } },
    { text: "ナビゲーション", options: { bold: true, breakLine: true, fontSize: 12 } },
    { text: "戻るボタン → ① ホームへ", options: { bullet: true } },
  ], { x: 4.6, y: 1.85, w: 4.7, h: 3.2, fontSize: 10, fontFace: "Calibri", color: C.textSecondary, lineSpacingMultiple: 1.3 });

  // ════════════════════════════════════════
  // SLIDE 6: Template Selection
  // ════════════════════════════════════════
  let s6 = pres.addSlide();
  s6.background = { color: C.bg };
  addSectionTitle(s6, "③ テンプレート選択", "Template Selection");
  addSlideNumber(s6, 6);

  addCard(s6, 0.6, 1.3, 3.2, 4.0);
  s6.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 1.3, w: 3.2, h: 0.5, fill: { color: C.secondary } });
  s6.addText("← テンプレート選択", { x: 0.7, y: 1.33, w: 2.8, h: 0.44, fontSize: 11, fontFace: "Calibri", bold: true, color: C.card, margin: 0 });
  s6.addText("🍽 飲食", { x: 0.8, y: 1.95, w: 2.6, h: 0.25, fontSize: 9, fontFace: "Calibri", color: C.textMuted, margin: 0 });

  const templates = [
    ["📋", "基本手順書", "写真+テキスト", "A4 / 2P"],
    ["✅", "衛生チェックリスト", "HACCP対応", "A4 / 2P"],
    ["🍳", "レシピカード", "写真付きレシピ", "A4 / 2P"],
  ];
  templates.forEach((t, i) => {
    const ty = 2.35 + i * 0.85;
    s6.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: ty, w: 2.8, h: 0.7, fill: { color: C.card }, line: { color: C.border, width: 0.5 } });
    s6.addText(t[0], { x: 0.85, y: ty + 0.08, w: 0.5, h: 0.5, fontSize: 18, align: "center", valign: "middle", margin: 0 });
    s6.addText(t[1], { x: 1.35, y: ty + 0.05, w: 2.1, h: 0.25, fontSize: 10, fontFace: "Calibri", bold: true, color: C.textPrimary, margin: 0 });
    s6.addText(t[2], { x: 1.35, y: ty + 0.28, w: 1.5, h: 0.2, fontSize: 8, fontFace: "Calibri", color: C.textMuted, margin: 0 });
    s6.addText(t[3], { x: 2.6, y: ty + 0.45, w: 0.9, h: 0.2, fontSize: 7, fontFace: "Calibri", color: C.primary, margin: 0 });
  });

  addCard(s6, 4.3, 1.3, 5.2, 4.0, { accentLeft: true, accentColor: C.accent });
  s6.addText("画面仕様", { x: 4.6, y: 1.4, w: 4.5, h: 0.35, fontSize: 16, fontFace: "Calibri", bold: true, color: C.secondary, margin: 0 });
  s6.addText([
    { text: "表示内容", options: { bold: true, breakLine: true, fontSize: 12 } },
    { text: "選択業種に紐づくテンプレートをリスト表示", options: { bullet: true, breakLine: true } },
    { text: "サムネイルプレビュー + テンプレート名", options: { bullet: true, breakLine: true } },
    { text: "用紙サイズ (A4/A3/B4) + ページ数", options: { bullet: true, breakLine: true } },
    { text: "説明文", options: { bullet: true, breakLine: true } },
    { text: "", options: { breakLine: true } },
    { text: "テンプレート例", options: { bold: true, breakLine: true, fontSize: 12 } },
    { text: "飲食: 基本手順書、衛生チェックリスト、レシピカード", options: { bullet: true, breakLine: true } },
    { text: "清掃: 清掃手順書、点検チェックリスト", options: { bullet: true, breakLine: true } },
    { text: "製造: 作業標準書、安全確認リスト、品質検査シート", options: { bullet: true, breakLine: true } },
    { text: "その他: 各業種1テンプレート", options: { bullet: true } },
  ], { x: 4.6, y: 1.85, w: 4.7, h: 3.2, fontSize: 10, fontFace: "Calibri", color: C.textSecondary, lineSpacingMultiple: 1.3 });

  // ════════════════════════════════════════
  // SLIDE 7: Editor Overview
  // ════════════════════════════════════════
  let s7 = pres.addSlide();
  s7.background = { color: C.bg };
  addSectionTitle(s7, "④ マニュアル編集（概要）", "Editor Screen - Overview  ★最重要画面");
  addSlideNumber(s7, 7);

  // Layout diagram
  const regions = [
    { label: "ヘッダー\n← 戻る | タイトル入力 | 保存 | PDF", y: 1.4, h: 0.6, color: C.secondary },
    { label: "ツールバー\n📷 写真 | Aa テキスト | 🔍+ | 🔍− | ↩ | ↪ | 🗑", y: 2.1, h: 0.6, color: C.primary },
    { label: "キャンバス編集エリア（Fabric.js）\n写真配置・リサイズ・回転 / テキスト編集\nピンチズーム対応", y: 2.8, h: 1.6, color: C.accent },
    { label: "ページナビゲーション\nサムネイル横スクロール | + ページ追加", y: 4.5, h: 0.6, color: "3A4560" },
  ];
  regions.forEach(r => {
    s7.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: r.y, w: 4.0, h: r.h, fill: { color: r.color, transparency: 15 }, line: { color: r.color, width: 1.5 } });
    s7.addText(r.label, { x: 0.75, y: r.y + 0.05, w: 3.7, h: r.h - 0.1, fontSize: 9, fontFace: "Calibri", color: C.textPrimary, valign: "middle", margin: 0 });
  });

  // Key features
  addCard(s7, 5.1, 1.4, 4.5, 3.7, { accentLeft: true, accentColor: C.accent });
  s7.addText("コア機能", { x: 5.35, y: 1.5, w: 4, h: 0.35, fontSize: 16, fontFace: "Calibri", bold: true, color: C.secondary, margin: 0 });
  s7.addText([
    { text: "Fabric.jsベースのキャンバス編集", options: { bold: true, breakLine: true, fontSize: 11 } },
    { text: "写真: カメラ撮影 or フォトライブラリから追加", options: { bullet: true, breakLine: true } },
    { text: "リサイズ（四隅ハンドル）・回転対応", options: { bullet: true, breakLine: true } },
    { text: "テキスト: テキストボックスとして配置", options: { bullet: true, breakLine: true } },
    { text: "フォントサイズ変更・太字・配置移動", options: { bullet: true, breakLine: true } },
    { text: "", options: { breakLine: true } },
    { text: "マルチページ対応", options: { bold: true, breakLine: true, fontSize: 11 } },
    { text: "各ページは独立したCanvas JSON", options: { bullet: true, breakLine: true } },
    { text: "ページ追加・削除・並び替え", options: { bullet: true, breakLine: true } },
    { text: "", options: { breakLine: true } },
    { text: "Undo/Redo（最大30ステップ）", options: { bold: true } },
  ], { x: 5.35, y: 1.95, w: 4.0, h: 3.0, fontSize: 10, fontFace: "Calibri", color: C.textSecondary, lineSpacingMultiple: 1.25 });

  // ════════════════════════════════════════
  // SLIDE 8: Editor Details - Toolbar & Canvas
  // ════════════════════════════════════════
  let s8 = pres.addSlide();
  s8.background = { color: C.bg };
  addSectionTitle(s8, "④ ツールバー・キャンバス詳細", "Editor Details - Toolbar & Canvas");
  addSlideNumber(s8, 8);

  // Toolbar detail
  addCard(s8, 0.6, 1.3, 4.2, 2.0, { accentLeft: true, accentColor: C.primary });
  s8.addText("ツールバー", { x: 0.85, y: 1.35, w: 3.5, h: 0.3, fontSize: 14, fontFace: "Calibri", bold: true, color: C.secondary, margin: 0 });
  const toolItems = [
    ["📷", "写真追加", "カメラ撮影 / フォトライブラリ選択"],
    ["Aa", "テキスト追加", "テキストボックスをキャンバスに追加"],
    ["🔍+/−", "拡大縮小", "ピンチ操作 + ボタン対応"],
    ["↩/↪", "Undo/Redo", "キャンバス状態のスタック管理"],
    ["🗑", "削除", "選択オブジェクトを削除"],
  ];
  toolItems.forEach((t, i) => {
    s8.addText(t[0], { x: 0.85, y: 1.72 + i * 0.28, w: 0.45, h: 0.25, fontSize: 9, fontFace: "Calibri", bold: true, color: C.accent, margin: 0 });
    s8.addText(t[1], { x: 1.3, y: 1.72 + i * 0.28, w: 1.0, h: 0.25, fontSize: 9, fontFace: "Calibri", bold: true, color: C.textPrimary, margin: 0 });
    s8.addText(t[2], { x: 2.3, y: 1.72 + i * 0.28, w: 2.3, h: 0.25, fontSize: 9, fontFace: "Calibri", color: C.textMuted, margin: 0 });
  });

  // Canvas detail
  addCard(s8, 5.2, 1.3, 4.3, 2.0, { accentLeft: true, accentColor: C.accent });
  s8.addText("キャンバス編集エリア", { x: 5.45, y: 1.35, w: 3.8, h: 0.3, fontSize: 14, fontFace: "Calibri", bold: true, color: C.secondary, margin: 0 });
  s8.addText([
    { text: "Fabric.js Canvas使用（595 x 842 px）", options: { bullet: true, breakLine: true } },
    { text: "テンプレートのガイド枠を初期表示", options: { bullet: true, breakLine: true } },
    { text: "オブジェクトのドラッグ＆ドロップ配置", options: { bullet: true, breakLine: true } },
    { text: "四隅ハンドルでリサイズ・回転", options: { bullet: true, breakLine: true } },
    { text: "ピンチイン・アウトで全体の拡大縮小", options: { bullet: true, breakLine: true } },
    { text: "画像は最大幅1200pxにリサイズして追加", options: { bullet: true } },
  ], { x: 5.45, y: 1.72, w: 3.9, h: 1.5, fontSize: 10, fontFace: "Calibri", color: C.textSecondary, lineSpacingMultiple: 1.3 });

  // Photo input spec
  addCard(s8, 0.6, 3.6, 8.9, 1.7, { accentLeft: true, accentColor: C.success });
  s8.addText("写真追加の実装詳細", { x: 0.85, y: 3.65, w: 4, h: 0.3, fontSize: 14, fontFace: "Calibri", bold: true, color: C.secondary, margin: 0 });
  s8.addText([
    { text: "iOS Safari対応: <input type=\"file\" accept=\"image/*\" capture=\"environment\">", options: { bullet: true, breakLine: true } },
    { text: "MediaDevices APIはiOS制約のため不使用", options: { bullet: true, breakLine: true } },
    { text: "撮影/選択後、Canvas要素で最大1200pxにリサイズ → base64化", options: { bullet: true, breakLine: true } },
    { text: "Fabric.js Imageオブジェクトとしてキャンバスに追加", options: { bullet: true } },
  ], { x: 0.85, y: 4.05, w: 8.4, h: 1.1, fontSize: 10, fontFace: "Calibri", color: C.textSecondary, lineSpacingMultiple: 1.3 });

  // ════════════════════════════════════════
  // SLIDE 9: Editor Details - Pages & Object Menu
  // ════════════════════════════════════════
  let s9 = pres.addSlide();
  s9.background = { color: C.bg };
  addSectionTitle(s9, "④ ページ管理・オブジェクトメニュー", "Editor Details - Pages & Object Menu");
  addSlideNumber(s9, 9);

  addCard(s9, 0.6, 1.3, 4.5, 2.2, { accentLeft: true, accentColor: C.primary });
  s9.addText("ページナビゲーション", { x: 0.85, y: 1.35, w: 3.5, h: 0.3, fontSize: 14, fontFace: "Calibri", bold: true, color: C.secondary, margin: 0 });
  s9.addText([
    { text: "画面下部に横スクロールでサムネイル一覧", options: { bullet: true, breakLine: true } },
    { text: "現在ページをハイライト表示（accent border）", options: { bullet: true, breakLine: true } },
    { text: "「+」ボタンでページ追加", options: { bullet: true, breakLine: true } },
    { text: "ページの右クリック/長押しで削除", options: { bullet: true, breakLine: true } },
    { text: "各ページは独立したFabric.js Canvas JSON", options: { bullet: true, breakLine: true } },
    { text: "ページ切替時に現在ページの状態を保存", options: { bullet: true } },
  ], { x: 0.85, y: 1.72, w: 4.0, h: 1.7, fontSize: 10, fontFace: "Calibri", color: C.textSecondary, lineSpacingMultiple: 1.3 });

  addCard(s9, 5.5, 1.3, 4.0, 2.2, { accentLeft: true, accentColor: C.accent });
  s9.addText("オブジェクト選択メニュー", { x: 5.75, y: 1.35, w: 3.5, h: 0.3, fontSize: 14, fontFace: "Calibri", bold: true, color: C.secondary, margin: 0 });
  s9.addText([
    { text: "オブジェクト選択時にフローティング表示", options: { bullet: true, breakLine: true } },
    { text: "📋 複製", options: { bullet: true, breakLine: true } },
    { text: "⬆ 前面へ移動", options: { bullet: true, breakLine: true } },
    { text: "⬇ 背面へ移動", options: { bullet: true, breakLine: true } },
    { text: "🗑 削除（赤色ハイライト）", options: { bullet: true } },
  ], { x: 5.75, y: 1.72, w: 3.5, h: 1.7, fontSize: 10, fontFace: "Calibri", color: C.textSecondary, lineSpacingMultiple: 1.3 });

  // Undo/Redo
  addCard(s9, 0.6, 3.8, 8.9, 1.5, { accentLeft: true, accentColor: C.secondary });
  s9.addText("Undo/Redo 実装", { x: 0.85, y: 3.85, w: 4, h: 0.3, fontSize: 14, fontFace: "Calibri", bold: true, color: C.secondary, margin: 0 });
  s9.addText([
    { text: "Fabric.jsのキャンバス状態（JSON）をスタックで管理", options: { bullet: true, breakLine: true } },
    { text: "object:modified / object:added / object:removed イベントでスナップショット保存", options: { bullet: true, breakLine: true } },
    { text: "最大30ステップ保持（メモリ節約）", options: { bullet: true, breakLine: true } },
    { text: "Undo: undoStackからpop → redoStackにpush → キャンバス復元", options: { bullet: true } },
  ], { x: 0.85, y: 4.25, w: 8.4, h: 1.0, fontSize: 10, fontFace: "Calibri", color: C.textSecondary, lineSpacingMultiple: 1.3 });

  // ════════════════════════════════════════
  // SLIDE 10: PDF Export
  // ════════════════════════════════════════
  let s10 = pres.addSlide();
  s10.background = { color: C.bg };
  addSectionTitle(s10, "⑤ PDF出力（モーダル）", "PDF Export Modal");
  addSlideNumber(s10, 10);

  // Modal mockup
  addCard(s10, 0.6, 1.3, 3.2, 3.8);
  s10.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 1.3, w: 3.2, h: 0.5, fill: { color: C.card }, line: { color: C.border, width: 0.5 } });
  s10.addText("PDF出力                    ✕", { x: 0.8, y: 1.35, w: 2.8, h: 0.4, fontSize: 12, fontFace: "Calibri", bold: true, color: C.textPrimary, margin: 0 });

  s10.addText("用紙サイズ", { x: 0.8, y: 1.9, w: 2.8, h: 0.25, fontSize: 9, fontFace: "Calibri", bold: true, color: C.textSecondary, margin: 0 });
  ["A4", "A3", "B4"].forEach((size, i) => {
    const sx = 0.8 + i * 0.85;
    const selected = i === 0;
    s10.addShape(pres.shapes.RECTANGLE, { x: sx, y: 2.2, w: 0.7, h: 0.35, fill: { color: selected ? C.sky : C.card }, line: { color: selected ? C.accent : C.border, width: selected ? 1.5 : 0.5 } });
    s10.addText(size, { x: sx, y: 2.2, w: 0.7, h: 0.35, fontSize: 10, fontFace: "Calibri", bold: true, color: selected ? C.primary : C.textMuted, align: "center", valign: "middle" });
  });

  s10.addText("ページ数: 2ページ", { x: 0.8, y: 2.7, w: 2.8, h: 0.25, fontSize: 9, fontFace: "Calibri", bold: true, color: C.textSecondary, margin: 0 });
  [1, 2].forEach((p, i) => {
    s10.addShape(pres.shapes.RECTANGLE, { x: 0.8 + i * 0.75, y: 3.0, w: 0.6, h: 0.8, fill: { color: C.bg }, line: { color: C.border, width: 0.5 } });
    s10.addText(String(p), { x: 0.8 + i * 0.75, y: 3.25, w: 0.6, h: 0.3, fontSize: 8, color: C.textMuted, align: "center" });
  });

  s10.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 4.1, w: 1.35, h: 0.45, fill: { color: C.accent } });
  s10.addText("📄 PDF出力", { x: 0.8, y: 4.1, w: 1.35, h: 0.45, fontSize: 10, fontFace: "Calibri", bold: true, color: C.card, align: "center", valign: "middle" });
  s10.addShape(pres.shapes.RECTANGLE, { x: 2.25, y: 4.1, w: 1.35, h: 0.45, fill: { color: C.secondary } });
  s10.addText("🖨 印刷", { x: 2.25, y: 4.1, w: 1.35, h: 0.45, fontSize: 10, fontFace: "Calibri", bold: true, color: C.card, align: "center", valign: "middle" });

  // Specs
  addCard(s10, 4.3, 1.3, 5.2, 3.8, { accentLeft: true, accentColor: C.primary });
  s10.addText("PDF生成フロー", { x: 4.55, y: 1.4, w: 4.5, h: 0.35, fontSize: 16, fontFace: "Calibri", bold: true, color: C.secondary, margin: 0 });
  s10.addText([
    { text: "生成ステップ", options: { bold: true, breakLine: true, fontSize: 12 } },
    { text: "1. 各ページのFabric.jsキャンバスを画像化", options: { breakLine: true } },
    { text: "   canvas.toDataURL('image/jpeg', 0.92)", options: { breakLine: true, color: C.textMuted } },
    { text: "2. jsPDFで新規PDF作成", options: { breakLine: true } },
    { text: "3. 各ページ画像を用紙サイズに合わせて配置", options: { breakLine: true } },
    { text: "4. ダウンロード or 印刷", options: { breakLine: true } },
    { text: "", options: { breakLine: true } },
    { text: "用紙サイズ対応", options: { bold: true, breakLine: true, fontSize: 12 } },
    { text: "A4: 210 x 297mm（デフォルト）", options: { bullet: true, breakLine: true } },
    { text: "A3: 297 x 420mm", options: { bullet: true, breakLine: true } },
    { text: "B4: 250 x 353mm", options: { bullet: true, breakLine: true } },
    { text: "", options: { breakLine: true } },
    { text: "日本語フォント: キャンバスをimage化してPDFに", options: { bold: true, breakLine: true, fontSize: 10, color: C.accent } },
    { text: "貼る方式を採用（jsPDF日本語非対応のため）", options: { fontSize: 10, color: C.accent } },
  ], { x: 4.55, y: 1.85, w: 4.7, h: 3.1, fontSize: 10, fontFace: "Calibri", color: C.textSecondary, lineSpacingMultiple: 1.2 });

  // ════════════════════════════════════════
  // SLIDE 11: File Selection
  // ════════════════════════════════════════
  let s11 = pres.addSlide();
  s11.background = { color: C.bg };
  addSectionTitle(s11, "⑥ ファイル選択", "File Selection Screen");
  addSlideNumber(s11, 11);

  addCard(s11, 0.6, 1.3, 3.2, 4.0);
  s11.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 1.3, w: 3.2, h: 0.5, fill: { color: C.secondary } });
  s11.addText("← ファイル一覧", { x: 0.7, y: 1.33, w: 2.8, h: 0.44, fontSize: 11, fontFace: "Calibri", bold: true, color: C.card, margin: 0 });

  // Search bar
  s11.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 1.95, w: 2.8, h: 0.35, fill: { color: C.card }, line: { color: C.border, width: 0.5 } });
  s11.addText("🔍 タイトルで検索...", { x: 0.85, y: 1.95, w: 2.6, h: 0.35, fontSize: 8, fontFace: "Calibri", color: C.textMuted, valign: "middle", margin: 0 });

  // Sort buttons
  ["更新日順", "作成日順", "タイトル順"].forEach((label, i) => {
    const sx = 0.8 + i * 0.95;
    s11.addShape(pres.shapes.RECTANGLE, { x: sx, y: 2.4, w: 0.85, h: 0.25, fill: { color: i === 0 ? C.sky : C.card }, line: { color: i === 0 ? C.accent : C.border, width: 0.5 } });
    s11.addText(label, { x: sx, y: 2.4, w: 0.85, h: 0.25, fontSize: 7, fontFace: "Calibri", bold: true, color: i === 0 ? C.primary : C.textMuted, align: "center", valign: "middle" });
  });

  // File items
  const files = [
    ["📄", "客室清掃マニュアル", "2026/04/15 · 3ページ"],
    ["📄", "基本手順書", "2026/04/14 · 2ページ"],
    ["📄", "衛生チェックリスト", "2026/04/13 · 2ページ"],
  ];
  files.forEach((f, i) => {
    const fy = 2.8 + i * 0.7;
    s11.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: fy, w: 2.8, h: 0.55, fill: { color: C.card }, line: { color: C.border, width: 0.5 } });
    s11.addText(f[0], { x: 0.85, y: fy + 0.05, w: 0.4, h: 0.45, fontSize: 16, align: "center", valign: "middle" });
    s11.addText(f[1], { x: 1.25, y: fy + 0.05, w: 2.0, h: 0.25, fontSize: 9, fontFace: "Calibri", bold: true, color: C.textPrimary, margin: 0 });
    s11.addText(f[2], { x: 1.25, y: fy + 0.3, w: 2.0, h: 0.2, fontSize: 7, fontFace: "Calibri", color: C.textMuted, margin: 0 });
  });

  addCard(s11, 4.3, 1.3, 5.2, 4.0, { accentLeft: true, accentColor: C.primary });
  s11.addText("画面仕様", { x: 4.55, y: 1.4, w: 4.5, h: 0.35, fontSize: 16, fontFace: "Calibri", bold: true, color: C.secondary, margin: 0 });
  s11.addText([
    { text: "一覧表示", options: { bold: true, breakLine: true, fontSize: 12 } },
    { text: "IndexedDBに保存済みのマニュアル一覧", options: { bullet: true, breakLine: true } },
    { text: "サムネイル + タイトル + 更新日時 + ページ数", options: { bullet: true, breakLine: true } },
    { text: "タップ → ④ マニュアル編集へ遷移", options: { bullet: true, breakLine: true } },
    { text: "", options: { breakLine: true } },
    { text: "検索・ソート", options: { bold: true, breakLine: true, fontSize: 12 } },
    { text: "検索バー（タイトルで絞り込み）", options: { bullet: true, breakLine: true } },
    { text: "ソート: 更新日順 / 作成日順 / タイトル順", options: { bullet: true, breakLine: true } },
    { text: "", options: { breakLine: true } },
    { text: "操作", options: { bold: true, breakLine: true, fontSize: 12 } },
    { text: "右クリック/長押しで削除・複製メニュー", options: { bullet: true, breakLine: true } },
    { text: "削除時は確認ダイアログ表示", options: { bullet: true } },
  ], { x: 4.55, y: 1.85, w: 4.7, h: 3.2, fontSize: 10, fontFace: "Calibri", color: C.textSecondary, lineSpacingMultiple: 1.3 });

  // ════════════════════════════════════════
  // SLIDE 12: Data Structure
  // ════════════════════════════════════════
  let s12 = pres.addSlide();
  s12.background = { color: C.bg };
  addSectionTitle(s12, "データ構造", "Data Structure - Manual / ManualPage");
  addSlideNumber(s12, 12);

  // Manual interface
  addCard(s12, 0.6, 1.3, 4.3, 3.2, { accentLeft: true, accentColor: C.primary });
  s12.addText("Manual", { x: 0.85, y: 1.35, w: 3.5, h: 0.35, fontSize: 16, fontFace: "Calibri", bold: true, color: C.secondary, margin: 0 });

  const manualFields = [
    ["id", "string", "UUID"],
    ["title", "string", "マニュアルタイトル"],
    ["industry", "string", "業種"],
    ["templateId", "string", "テンプレートID"],
    ["pages", "ManualPage[]", "ページ配列"],
    ["createdAt", "Date", "作成日時"],
    ["updatedAt", "Date", "更新日時"],
    ["thumbnailDataUrl", "string", "サムネイル"],
  ];
  // Header
  s12.addShape(pres.shapes.RECTANGLE, { x: 0.85, y: 1.78, w: 3.85, h: 0.28, fill: { color: C.secondary } });
  s12.addText("フィールド", { x: 0.9, y: 1.78, w: 1.2, h: 0.28, fontSize: 8, fontFace: "Calibri", bold: true, color: C.card, margin: 0, valign: "middle" });
  s12.addText("型", { x: 2.1, y: 1.78, w: 1.2, h: 0.28, fontSize: 8, fontFace: "Calibri", bold: true, color: C.card, margin: 0, valign: "middle" });
  s12.addText("説明", { x: 3.3, y: 1.78, w: 1.3, h: 0.28, fontSize: 8, fontFace: "Calibri", bold: true, color: C.card, margin: 0, valign: "middle" });

  manualFields.forEach((f, i) => {
    const ry = 2.06 + i * 0.28;
    s12.addShape(pres.shapes.RECTANGLE, { x: 0.85, y: ry, w: 3.85, h: 0.28, fill: { color: i % 2 === 0 ? C.card : C.bg } });
    s12.addText(f[0], { x: 0.9, y: ry, w: 1.2, h: 0.28, fontSize: 8, fontFace: "Consolas", color: C.accent, margin: 0, valign: "middle" });
    s12.addText(f[1], { x: 2.1, y: ry, w: 1.2, h: 0.28, fontSize: 8, fontFace: "Consolas", color: C.textMuted, margin: 0, valign: "middle" });
    s12.addText(f[2], { x: 3.3, y: ry, w: 1.3, h: 0.28, fontSize: 8, fontFace: "Calibri", color: C.textSecondary, margin: 0, valign: "middle" });
  });

  // ManualPage interface
  addCard(s12, 5.3, 1.3, 4.2, 2.2, { accentLeft: true, accentColor: C.accent });
  s12.addText("ManualPage", { x: 5.55, y: 1.35, w: 3.5, h: 0.35, fontSize: 16, fontFace: "Calibri", bold: true, color: C.secondary, margin: 0 });

  const pageFields = [
    ["id", "string", "UUID"],
    ["pageNumber", "number", "ページ番号"],
    ["canvasJson", "string", "Fabric.js JSON"],
    ["thumbnailDataUrl", "string", "サムネイル"],
  ];
  s12.addShape(pres.shapes.RECTANGLE, { x: 5.55, y: 1.78, w: 3.75, h: 0.28, fill: { color: C.accent } });
  s12.addText("フィールド", { x: 5.6, y: 1.78, w: 1.1, h: 0.28, fontSize: 8, fontFace: "Calibri", bold: true, color: C.card, margin: 0, valign: "middle" });
  s12.addText("型", { x: 6.7, y: 1.78, w: 1.0, h: 0.28, fontSize: 8, fontFace: "Calibri", bold: true, color: C.card, margin: 0, valign: "middle" });
  s12.addText("説明", { x: 7.7, y: 1.78, w: 1.5, h: 0.28, fontSize: 8, fontFace: "Calibri", bold: true, color: C.card, margin: 0, valign: "middle" });

  pageFields.forEach((f, i) => {
    const ry = 2.06 + i * 0.28;
    s12.addShape(pres.shapes.RECTANGLE, { x: 5.55, y: ry, w: 3.75, h: 0.28, fill: { color: i % 2 === 0 ? C.card : C.bg } });
    s12.addText(f[0], { x: 5.6, y: ry, w: 1.1, h: 0.28, fontSize: 8, fontFace: "Consolas", color: C.accent, margin: 0, valign: "middle" });
    s12.addText(f[1], { x: 6.7, y: ry, w: 1.0, h: 0.28, fontSize: 8, fontFace: "Consolas", color: C.textMuted, margin: 0, valign: "middle" });
    s12.addText(f[2], { x: 7.7, y: ry, w: 1.5, h: 0.28, fontSize: 8, fontFace: "Calibri", color: C.textSecondary, margin: 0, valign: "middle" });
  });

  // IndexedDB schema
  addCard(s12, 5.3, 3.7, 4.2, 1.5, { accentLeft: true, accentColor: C.secondary });
  s12.addText("IndexedDB スキーマ (Dexie.js)", { x: 5.55, y: 3.75, w: 3.8, h: 0.3, fontSize: 12, fontFace: "Calibri", bold: true, color: C.secondary, margin: 0 });
  s12.addText([
    { text: "DB名: ManualAppDB", options: { bullet: true, breakLine: true } },
    { text: "テーブル: manuals", options: { bullet: true, breakLine: true } },
    { text: "インデックス: id, title, industry, updatedAt", options: { bullet: true, breakLine: true } },
    { text: "pagesはJSON.stringifyして保存", options: { bullet: true } },
  ], { x: 5.55, y: 4.15, w: 3.8, h: 1.0, fontSize: 10, fontFace: "Calibri", color: C.textSecondary, lineSpacingMultiple: 1.3 });

  // ════════════════════════════════════════
  // SLIDE 13: Tech Stack
  // ════════════════════════════════════════
  let s13 = pres.addSlide();
  s13.background = { color: C.secondary };

  s13.addText("技術スタック", { x: 0.6, y: 0.35, w: 8.8, h: 0.5, fontSize: 28, fontFace: "Calibri", bold: true, color: C.card, margin: 0 });
  s13.addText("Technology Stack", { x: 0.6, y: 0.85, w: 8.8, h: 0.3, fontSize: 13, fontFace: "Calibri", color: C.textMuted, margin: 0 });
  addSlideNumber(s13, 13);

  const techStack = [
    { category: "フロントエンド", items: "React + TypeScript", detail: "Viteでビルド", color: C.accent },
    { category: "スタイリング", items: "Tailwind CSS", detail: "モバイルファースト", color: "38BDF8" },
    { category: "キャンバス編集", items: "Fabric.js v5", detail: "写真/テキスト配置・編集の核", color: C.success },
    { category: "PDF出力", items: "jsPDF", detail: "Canvas画像化 → PDF生成", color: "F59E0B" },
    { category: "ローカル保存", items: "Dexie.js (IndexedDB)", detail: "画像含む大容量データ対応", color: "A78BFA" },
    { category: "PWA", items: "Service Worker + Manifest", detail: "オフライン対応・ホーム画面追加", color: C.error },
  ];

  techStack.forEach((t, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const tx = 0.6 + col * 3.1;
    const ty = 1.5 + row * 1.9;

    s13.addShape(pres.shapes.RECTANGLE, { x: tx, y: ty, w: 2.8, h: 1.6, fill: { color: C.primary }, shadow: mkShadow() });
    s13.addShape(pres.shapes.RECTANGLE, { x: tx, y: ty, w: 2.8, h: 0.06, fill: { color: t.color } });
    s13.addText(t.category, { x: tx + 0.2, y: ty + 0.2, w: 2.4, h: 0.3, fontSize: 11, fontFace: "Calibri", color: t.color, margin: 0 });
    s13.addText(t.items, { x: tx + 0.2, y: ty + 0.55, w: 2.4, h: 0.4, fontSize: 16, fontFace: "Calibri", bold: true, color: C.card, margin: 0 });
    s13.addText(t.detail, { x: tx + 0.2, y: ty + 1.0, w: 2.4, h: 0.4, fontSize: 10, fontFace: "Calibri", color: "CADCFC", margin: 0 });
  });

  // Save
  const outPath = "C:/Users/81805/JavaPractice/ClaudeCodePractice/manual_app_pwa/manual_app_screen_spec.pptx";
  await pres.writeFile({ fileName: outPath });
  console.log("Created: " + outPath);
}

main().catch(console.error);
