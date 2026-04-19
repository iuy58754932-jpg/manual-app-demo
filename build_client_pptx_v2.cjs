const pptxgen = require('pptxgenjs');

const C = {
  navy: '1E2761',
  primary: '065A82',
  accent: '0891B2',
  bg: 'F6F8FB',
  card: 'FFFFFF',
  dark: '1A1F36',
  body: '3A4560',
  muted: '8896A7',
  border: 'E2E8F0',
  success: '10B981',
  warning: 'F59E0B',
  error: 'EF4444',
  sky: 'E8F4FD',
  ice: 'CADCFC',
};

const mkShadow = () => ({ type: 'outer', blur: 8, offset: 3, angle: 135, color: '000000', opacity: 0.1 });
const mkCardShadow = () => ({ type: 'outer', blur: 6, offset: 2, angle: 135, color: '000000', opacity: 0.08 });

let pres;

function slideNum(slide, n, total) {
  slide.addText(`${n} / ${total}`, {
    x: 9.1, y: 5.25, w: 0.8, h: 0.28,
    fontSize: 9, fontFace: 'Calibri', color: C.muted, align: 'right',
  });
}

function header(slide, title, subtitle, num, total) {
  slide.background = { color: C.bg };
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.9, fill: { color: C.navy } });
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0.85, w: 10, h: 0.05, fill: { color: C.accent } });
  slide.addText(title, { x: 0.5, y: 0.12, w: 9, h: 0.4, fontSize: 20, fontFace: 'Calibri', bold: true, color: C.card, margin: 0 });
  if (subtitle) {
    slide.addText(subtitle, { x: 0.5, y: 0.52, w: 9, h: 0.3, fontSize: 11, fontFace: 'Calibri', color: 'CADCFC', margin: 0 });
  }
  slideNum(slide, num, total);
}

function card(slide, x, y, w, h, opts = {}) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w, h,
    fill: { color: opts.fill || C.card },
    shadow: mkCardShadow(),
  });
  if (opts.topBar) {
    slide.addShape(pres.shapes.RECTANGLE, { x, y, w, h: 0.06, fill: { color: opts.topBar } });
  }
  if (opts.leftBar) {
    slide.addShape(pres.shapes.RECTANGLE, { x, y, w: 0.08, h, fill: { color: opts.leftBar } });
  }
}

// Phone frame helper — draws a smartphone-shaped outline and returns inner coords
function phoneFrame(slide, x, y, w, h, opts = {}) {
  // Outer frame (rounded look via dark background + inner white)
  slide.addShape(pres.shapes.RECTANGLE, { x: x - 0.08, y: y - 0.12, w: w + 0.16, h: h + 0.24, fill: { color: '1A1F36' }, shadow: mkShadow() });
  // Screen inner
  slide.addShape(pres.shapes.RECTANGLE, { x, y, w, h, fill: { color: opts.fill || C.card } });
  // Notch (small)
  slide.addShape(pres.shapes.RECTANGLE, { x: x + w / 2 - 0.35, y: y - 0.08, w: 0.7, h: 0.05, fill: { color: '1A1F36' } });
  return { innerX: x, innerY: y, innerW: w, innerH: h };
}

async function main() {
  pres = new pptxgen();
  pres.layout = 'LAYOUT_16x9';
  pres.author = '開発チーム';
  pres.title = 'マニュアル作成アプリ ご紹介資料 (図解版)';

  const TOTAL = 18;

  // ============ SLIDE 1: Cover ============
  let s = pres.addSlide();
  s.background = { color: C.navy };
  s.addShape(pres.shapes.RECTANGLE, { x: 6.2, y: 0, w: 3.8, h: 5.625, fill: { color: C.primary } });

  // Decorative phone illustration on right
  const phX = 7.1, phY = 1.2, phW = 2.1, phH = 3.2;
  s.addShape(pres.shapes.RECTANGLE, { x: phX - 0.12, y: phY - 0.15, w: phW + 0.24, h: phH + 0.3, fill: { color: '1A1F36' }, shadow: mkShadow() });
  s.addShape(pres.shapes.RECTANGLE, { x: phX, y: phY, w: phW, h: phH, fill: { color: C.card } });
  s.addShape(pres.shapes.RECTANGLE, { x: phX + phW / 2 - 0.35, y: phY - 0.1, w: 0.7, h: 0.06, fill: { color: '1A1F36' } });
  // Phone content mini
  s.addShape(pres.shapes.RECTANGLE, { x: phX, y: phY, w: phW, h: 0.35, fill: { color: C.navy } });
  s.addText('マニュアル作成', { x: phX + 0.1, y: phY, w: phW - 0.2, h: 0.35, fontSize: 7, fontFace: 'Calibri', bold: true, color: C.card, valign: 'middle' });
  s.addShape(pres.shapes.RECTANGLE, { x: phX + 0.7, y: phY + 0.6, w: 0.7, h: 0.7, fill: { color: C.accent } });
  s.addText('M', { x: phX + 0.7, y: phY + 0.6, w: 0.7, h: 0.7, fontSize: 24, fontFace: 'Calibri', bold: true, color: C.card, align: 'center', valign: 'middle' });
  s.addShape(pres.shapes.RECTANGLE, { x: phX + 0.3, y: phY + 1.7, w: 1.5, h: 0.3, fill: { color: C.accent } });
  s.addText('＋ 新規作成', { x: phX + 0.3, y: phY + 1.7, w: 1.5, h: 0.3, fontSize: 8, fontFace: 'Calibri', bold: true, color: C.card, align: 'center', valign: 'middle' });
  s.addShape(pres.shapes.RECTANGLE, { x: phX + 0.3, y: phY + 2.1, w: 1.5, h: 0.3, fill: { color: C.card }, line: { color: C.border, width: 0.5 } });
  s.addText('📂 読込', { x: phX + 0.3, y: phY + 2.1, w: 1.5, h: 0.3, fontSize: 8, fontFace: 'Calibri', bold: true, color: C.primary, align: 'center', valign: 'middle' });
  s.addShape(pres.shapes.RECTANGLE, { x: phX + 0.2, y: phY + 2.6, w: 1.7, h: 0.2, fill: { color: C.bg } });
  s.addShape(pres.shapes.RECTANGLE, { x: phX + 0.2, y: phY + 2.85, w: 1.7, h: 0.2, fill: { color: C.bg } });

  // Left side text
  s.addText('マニュアル作成アプリ', { x: 0.6, y: 1.4, w: 6, h: 0.8, fontSize: 36, fontFace: 'Calibri', bold: true, color: C.card, margin: 0 });
  s.addText('ご紹介資料', { x: 0.6, y: 2.2, w: 6, h: 0.5, fontSize: 22, fontFace: 'Calibri', color: C.accent, margin: 0 });
  s.addShape(pres.shapes.LINE, { x: 0.6, y: 2.9, w: 3, h: 0, line: { color: C.accent, width: 3 } });
  s.addText('業務マニュアルをスマホで簡単に', { x: 0.6, y: 3.15, w: 6, h: 0.4, fontSize: 16, fontFace: 'Calibri', color: 'CADCFC', margin: 0 });
  s.addText('テンプレート × 写真 × PDF出力', { x: 0.6, y: 3.55, w: 6, h: 0.35, fontSize: 13, fontFace: 'Calibri', italic: true, color: C.muted, margin: 0 });
  s.addText('2026年4月', { x: 0.6, y: 4.85, w: 5, h: 0.3, fontSize: 12, fontFace: 'Calibri', italic: true, color: 'CADCFC', margin: 0 });

  // ============ SLIDE 2: Before / After ============
  s = pres.addSlide();
  header(s, '1. Before → After', '紙のマニュアル作成から、スマホで3分に', 2, TOTAL);

  // Before
  card(s, 0.6, 1.2, 4.0, 4.0, { topBar: C.muted });
  s.addText('😰  BEFORE（今までの方法）', { x: 0.85, y: 1.35, w: 3.6, h: 0.4, fontSize: 14, fontFace: 'Calibri', bold: true, color: C.muted, margin: 0 });

  const beforeSteps = [
    ['1', 'PC で Word や Excel を起動', '時間がかかる'],
    ['2', '写真を別途撮影し、USB等で転送', '面倒・漏れる'],
    ['3', '写真を Word に貼り付け、サイズ調整', 'レイアウト崩れ'],
    ['4', '説明文を手入力', 'タイピング時間'],
    ['5', '印刷して配布', '修正のたびに再配布'],
  ];
  beforeSteps.forEach((step, i) => {
    const y = 1.9 + i * 0.55;
    s.addShape(pres.shapes.OVAL, { x: 0.85, y, w: 0.35, h: 0.35, fill: { color: C.muted } });
    s.addText(step[0], { x: 0.85, y, w: 0.35, h: 0.35, fontSize: 12, fontFace: 'Calibri', bold: true, color: C.card, align: 'center', valign: 'middle' });
    s.addText(step[1], { x: 1.35, y: y - 0.02, w: 3.1, h: 0.25, fontSize: 11, fontFace: 'Calibri', bold: true, color: C.dark, margin: 0 });
    s.addText('⚠ ' + step[2], { x: 1.35, y: y + 0.2, w: 3.1, h: 0.22, fontSize: 9, fontFace: 'Calibri', italic: true, color: C.error, margin: 0 });
  });

  // Arrow
  s.addShape(pres.shapes.RIGHT_TRIANGLE, { x: 4.7, y: 2.7, w: 0.5, h: 1.0, fill: { color: C.accent }, rotate: 0 });
  // Actually use arrow shape via text
  s.addText('→', { x: 4.7, y: 2.7, w: 0.5, h: 1.0, fontSize: 60, color: C.accent, align: 'center', valign: 'middle' });

  // After
  card(s, 5.3, 1.2, 4.1, 4.0, { topBar: C.success });
  s.addText('😊  AFTER（このアプリで）', { x: 5.55, y: 1.35, w: 3.6, h: 0.4, fontSize: 14, fontFace: 'Calibri', bold: true, color: C.success, margin: 0 });

  const afterSteps = [
    ['1', 'スマホでアプリ起動', 'タップ1回'],
    ['2', 'テンプレートを選ぶ', '白紙から作らない'],
    ['3', 'カメラで撮影してそのまま貼付', '転送不要'],
    ['4', '音声入力で説明追加も可', '話すだけ'],
    ['5', 'PDF で保存・共有', 'メール1通で完了'],
  ];
  afterSteps.forEach((step, i) => {
    const y = 1.9 + i * 0.55;
    s.addShape(pres.shapes.OVAL, { x: 5.55, y, w: 0.35, h: 0.35, fill: { color: C.success } });
    s.addText(step[0], { x: 5.55, y, w: 0.35, h: 0.35, fontSize: 12, fontFace: 'Calibri', bold: true, color: C.card, align: 'center', valign: 'middle' });
    s.addText(step[1], { x: 6.05, y: y - 0.02, w: 3.2, h: 0.25, fontSize: 11, fontFace: 'Calibri', bold: true, color: C.dark, margin: 0 });
    s.addText('✓ ' + step[2], { x: 6.05, y: y + 0.2, w: 3.2, h: 0.22, fontSize: 9, fontFace: 'Calibri', italic: true, color: C.success, margin: 0 });
  });

  // ============ SLIDE 3: 3 key points (large visual) ============
  s = pres.addSlide();
  header(s, '2. 3つのポイント', 'テンプレ × 写真 × PDF = カンタン', 3, TOTAL);

  const points = [
    {
      emoji: '📋',
      big: 'テンプレから選ぶ',
      desc: '8業種 × 13テンプレ',
      color: C.primary,
      detail: '飲食・製造・清掃・医療・宿泊・建設・小売・教育の各業種向けテンプレートを用意',
    },
    {
      emoji: '📷',
      big: '撮ってそのまま',
      desc: 'スマホのカメラで撮影',
      color: C.accent,
      detail: 'カメラで撮った写真をすぐ貼り付け。写真に文字や矢印も書き込めます',
    },
    {
      emoji: '📄',
      big: 'PDFで出力',
      desc: 'A4/A3/B4 対応',
      color: C.success,
      detail: 'ダウンロード・印刷・メール添付で簡単共有',
    },
  ];
  points.forEach((p, i) => {
    const x = 0.6 + i * 3.1;
    card(s, x, 1.2, 2.8, 3.9, { topBar: p.color });
    // Big emoji circle
    s.addShape(pres.shapes.OVAL, { x: x + 0.8, y: 1.5, w: 1.2, h: 1.2, fill: { color: p.color } });
    s.addText(p.emoji, { x: x + 0.8, y: 1.5, w: 1.2, h: 1.2, fontSize: 48, align: 'center', valign: 'middle' });
    s.addText(p.big, { x, y: 2.85, w: 2.8, h: 0.45, fontSize: 17, fontFace: 'Calibri', bold: true, color: C.dark, align: 'center', margin: 0 });
    s.addText(p.desc, { x, y: 3.3, w: 2.8, h: 0.3, fontSize: 12, fontFace: 'Calibri', bold: true, color: p.color, align: 'center', margin: 0 });
    s.addShape(pres.shapes.LINE, { x: x + 0.6, y: 3.7, w: 1.6, h: 0, line: { color: C.border, width: 1 } });
    s.addText(p.detail, { x: x + 0.2, y: 3.8, w: 2.4, h: 1.2, fontSize: 10, fontFace: 'Calibri', color: C.body, align: 'center', lineSpacingMultiple: 1.5 });
  });

  // Big subtitle below
  s.addText('✨ 最短3ステップでマニュアルが完成します', {
    x: 0.6, y: 5.2, w: 8.8, h: 0.3, fontSize: 13, fontFace: 'Calibri', italic: true, color: C.accent, align: 'center', margin: 0,
  });

  // ============ SLIDE 4: Who & Cost ============
  s = pres.addSlide();
  header(s, '3. こんな方に / 料金', 'ターゲットユーザー・ご利用料金', 4, TOTAL);

  // Who
  s.addText('こんな方におすすめ', { x: 0.6, y: 1.1, w: 5, h: 0.3, fontSize: 14, fontFace: 'Calibri', bold: true, color: C.navy, margin: 0 });
  const who = [
    { emoji: '👷', text: '現場で作業手順を撮影しながらマニュアル化したい' },
    { emoji: '🎓', text: '新人教育用の資料を手軽に準備したい' },
    { emoji: '📑', text: '紙のマニュアルをデジタル化したい' },
    { emoji: '🏪', text: '複数店舗で業務手順を統一したい' },
  ];
  who.forEach((w, i) => {
    const y = 1.5 + i * 0.55;
    card(s, 0.6, y, 5.4, 0.48);
    s.addShape(pres.shapes.OVAL, { x: 0.75, y: y + 0.09, w: 0.3, h: 0.3, fill: { color: C.accent } });
    s.addText(w.emoji, { x: 0.75, y: y + 0.09, w: 0.3, h: 0.3, fontSize: 14, align: 'center', valign: 'middle' });
    s.addText(w.text, { x: 1.15, y, w: 4.8, h: 0.48, fontSize: 11, fontFace: 'Calibri', color: C.body, valign: 'middle', margin: 0 });
  });

  // Cost card (big)
  card(s, 6.3, 1.1, 3.1, 3.6, { topBar: C.success });
  s.addText('💰  ご利用料金', { x: 6.55, y: 1.25, w: 2.8, h: 0.3, fontSize: 13, fontFace: 'Calibri', bold: true, color: C.navy, margin: 0 });
  s.addText('0', { x: 6.3, y: 1.75, w: 3.1, h: 1.2, fontSize: 96, fontFace: 'Calibri', bold: true, color: C.success, align: 'center', margin: 0 });
  s.addText('円 / 月', { x: 6.3, y: 2.95, w: 3.1, h: 0.35, fontSize: 16, fontFace: 'Calibri', bold: true, color: C.dark, align: 'center', margin: 0 });
  s.addShape(pres.shapes.LINE, { x: 7.0, y: 3.45, w: 1.7, h: 0, line: { color: C.border, width: 1 } });
  s.addText('📱 追加機器: 不要', { x: 6.4, y: 3.55, w: 2.9, h: 0.28, fontSize: 11, fontFace: 'Calibri', color: C.body, align: 'center', margin: 0 });
  s.addText('💻 専用ソフト: 不要', { x: 6.4, y: 3.85, w: 2.9, h: 0.28, fontSize: 11, fontFace: 'Calibri', color: C.body, align: 'center', margin: 0 });
  s.addText('☁️ サーバー: 不要', { x: 6.4, y: 4.15, w: 2.9, h: 0.28, fontSize: 11, fontFace: 'Calibri', color: C.body, align: 'center', margin: 0 });
  s.addText('お持ちのスマホで使える！', { x: 6.3, y: 4.45, w: 3.1, h: 0.28, fontSize: 10, fontFace: 'Calibri', italic: true, color: C.success, align: 'center', margin: 0 });

  // ============ SLIDE 5: Flow diagram (visual) ============
  s = pres.addSlide();
  header(s, '4. 全体の流れ', '最短3ステップでマニュアル作成', 5, TOTAL);

  // Main flow as large cards with arrows
  const flow = [
    { emoji: '🏠', label: 'ホーム', sub: 'アプリを開く', color: C.primary },
    { emoji: '🏭', label: '業種選択', sub: '8業種から', color: C.primary },
    { emoji: '📋', label: 'テンプレ選択', sub: '13種類から', color: C.accent },
    { emoji: '✏️', label: '編集する', sub: '写真＋文字', color: C.success },
    { emoji: '📄', label: 'PDF出力', sub: '保存/印刷', color: C.warning },
  ];
  flow.forEach((f, i) => {
    const x = 0.3 + i * 1.95;
    card(s, x, 1.5, 1.6, 2.0, { topBar: f.color });
    s.addShape(pres.shapes.OVAL, { x: x + 0.35, y: 1.75, w: 0.9, h: 0.9, fill: { color: f.color } });
    s.addText(f.emoji, { x: x + 0.35, y: 1.75, w: 0.9, h: 0.9, fontSize: 34, align: 'center', valign: 'middle' });
    s.addText(f.label, { x, y: 2.75, w: 1.6, h: 0.28, fontSize: 11, fontFace: 'Calibri', bold: true, color: C.dark, align: 'center', margin: 0 });
    s.addText(f.sub, { x, y: 3.05, w: 1.6, h: 0.3, fontSize: 9, fontFace: 'Calibri', color: C.muted, align: 'center', margin: 0 });

    // Arrow to next
    if (i < flow.length - 1) {
      s.addText('▶', { x: x + 1.6, y: 2.15, w: 0.35, h: 0.3, fontSize: 16, color: C.accent, align: 'center', valign: 'middle' });
    }
  });

  // Alt flow
  s.addText('💾  保存済みのマニュアルを開く場合', {
    x: 0.6, y: 4.0, w: 8.8, h: 0.3, fontSize: 12, fontFace: 'Calibri', bold: true, color: C.navy, margin: 0,
  });

  const altFlow = [
    { emoji: '🏠', label: 'ホーム' },
    { emoji: '📂', label: 'ファイル一覧' },
    { emoji: '✏️', label: '編集する' },
  ];
  altFlow.forEach((f, i) => {
    const x = 0.6 + i * 2.0;
    card(s, x, 4.4, 1.7, 0.8, { leftBar: C.muted });
    s.addText(f.emoji, { x: x + 0.1, y: 4.5, w: 0.4, h: 0.6, fontSize: 22, valign: 'middle' });
    s.addText(f.label, { x: x + 0.55, y: 4.4, w: 1.1, h: 0.8, fontSize: 11, fontFace: 'Calibri', bold: true, color: C.dark, valign: 'middle', margin: 0 });
    if (i < altFlow.length - 1) {
      s.addText('→', { x: x + 1.7, y: 4.5, w: 0.3, h: 0.6, fontSize: 18, color: C.muted, align: 'center', valign: 'middle' });
    }
  });

  // ============ SLIDE 6: Home screen ============
  s = pres.addSlide();
  header(s, '5. ホーム画面', 'アプリを開いた最初の画面', 6, TOTAL);

  // Phone mock on left
  const hp = phoneFrame(s, 1.0, 1.3, 2.6, 3.8);
  s.addShape(pres.shapes.RECTANGLE, { x: hp.innerX, y: hp.innerY, w: hp.innerW, h: 0.45, fill: { color: C.navy } });
  s.addText('マニュアル作成', { x: hp.innerX + 0.15, y: hp.innerY, w: hp.innerW - 0.3, h: 0.45, fontSize: 10, fontFace: 'Calibri', bold: true, color: C.card, valign: 'middle' });
  s.addShape(pres.shapes.RECTANGLE, { x: hp.innerX + 0.9, y: hp.innerY + 0.75, w: 0.8, h: 0.8, fill: { color: C.accent } });
  s.addText('M', { x: hp.innerX + 0.9, y: hp.innerY + 0.75, w: 0.8, h: 0.8, fontSize: 28, fontFace: 'Calibri', bold: true, color: C.card, align: 'center', valign: 'middle' });
  s.addText('マニュアル作成アプリ', { x: hp.innerX, y: hp.innerY + 1.65, w: hp.innerW, h: 0.25, fontSize: 10, fontFace: 'Calibri', bold: true, color: C.navy, align: 'center', margin: 0 });

  // Buttons with annotations
  s.addShape(pres.shapes.RECTANGLE, { x: hp.innerX + 0.3, y: hp.innerY + 2.05, w: 2.0, h: 0.4, fill: { color: C.accent } });
  s.addText('＋ 新規作成', { x: hp.innerX + 0.3, y: hp.innerY + 2.05, w: 2.0, h: 0.4, fontSize: 11, fontFace: 'Calibri', bold: true, color: C.card, align: 'center', valign: 'middle' });
  s.addShape(pres.shapes.RECTANGLE, { x: hp.innerX + 0.3, y: hp.innerY + 2.55, w: 2.0, h: 0.4, fill: { color: C.card }, line: { color: C.border, width: 1 } });
  s.addText('📂 ファイル読み込み', { x: hp.innerX + 0.3, y: hp.innerY + 2.55, w: 2.0, h: 0.4, fontSize: 10, fontFace: 'Calibri', bold: true, color: C.primary, align: 'center', valign: 'middle' });

  s.addText('最近のファイル', { x: hp.innerX + 0.3, y: hp.innerY + 3.05, w: 2, h: 0.2, fontSize: 8, fontFace: 'Calibri', bold: true, color: C.muted, margin: 0 });
  s.addShape(pres.shapes.RECTANGLE, { x: hp.innerX + 0.3, y: hp.innerY + 3.3, w: 2.0, h: 0.25, fill: { color: C.bg }, line: { color: C.border, width: 0.5 } });
  s.addText('📄 客室清掃マニュアル', { x: hp.innerX + 0.35, y: hp.innerY + 3.3, w: 1.9, h: 0.25, fontSize: 7, fontFace: 'Calibri', color: C.body, valign: 'middle', margin: 0 });

  // Annotation arrows & labels
  // Arrow 1: 新規作成
  s.addShape(pres.shapes.LINE, { x: 3.5, y: 2.05 + 1.3, w: 1.2, h: -0.5, line: { color: C.accent, width: 2 } });
  card(s, 4.7, 1.9, 4.5, 0.8, { leftBar: C.accent });
  s.addText('🟢 新規作成ボタン', { x: 4.9, y: 1.95, w: 4.2, h: 0.3, fontSize: 12, fontFace: 'Calibri', bold: true, color: C.accent, margin: 0 });
  s.addText('新しいマニュアルを作り始める時にタップ', { x: 4.9, y: 2.3, w: 4.2, h: 0.35, fontSize: 10, fontFace: 'Calibri', color: C.body, margin: 0 });

  // Arrow 2: ファイル読込
  s.addShape(pres.shapes.LINE, { x: 3.5, y: 2.55 + 1.3 + 0.2, w: 1.2, h: 0.0, line: { color: C.primary, width: 2 } });
  card(s, 4.7, 2.85, 4.5, 0.8, { leftBar: C.primary });
  s.addText('🔵 ファイル読み込み', { x: 4.9, y: 2.9, w: 4.2, h: 0.3, fontSize: 12, fontFace: 'Calibri', bold: true, color: C.primary, margin: 0 });
  s.addText('以前作ったマニュアルを開く時にタップ', { x: 4.9, y: 3.25, w: 4.2, h: 0.35, fontSize: 10, fontFace: 'Calibri', color: C.body, margin: 0 });

  // Arrow 3: 最近のファイル
  s.addShape(pres.shapes.LINE, { x: 3.5, y: 3.3 + 1.3 + 0.1, w: 1.2, h: 0.5, line: { color: C.warning, width: 2 } });
  card(s, 4.7, 3.8, 4.5, 0.8, { leftBar: C.warning });
  s.addText('🟡 最近のファイル', { x: 4.9, y: 3.85, w: 4.2, h: 0.3, fontSize: 12, fontFace: 'Calibri', bold: true, color: C.warning, margin: 0 });
  s.addText('直近5件のマニュアルがすぐ開ける', { x: 4.9, y: 4.2, w: 4.2, h: 0.35, fontSize: 10, fontFace: 'Calibri', color: C.body, margin: 0 });

  // ============ SLIDE 7: Industry / Template ============
  s = pres.addSlide();
  header(s, '6. 業種を選んでテンプレート選択', '業種ごとの専用テンプレート', 7, TOTAL);

  // Industry grid
  card(s, 0.6, 1.15, 4.3, 4.0, { topBar: C.primary });
  s.addText('8つの業種から選択', { x: 0.85, y: 1.3, w: 4, h: 0.35, fontSize: 13, fontFace: 'Calibri', bold: true, color: C.navy, margin: 0 });
  const industries = [
    { emoji: '🍽', name: '飲食' }, { emoji: '🏭', name: '製造' },
    { emoji: '🧹', name: '清掃' }, { emoji: '🏥', name: '医療' },
    { emoji: '🏨', name: '宿泊' }, { emoji: '🏗', name: '建設' },
    { emoji: '🛒', name: '小売' }, { emoji: '📚', name: '教育' },
  ];
  industries.forEach((ind, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 0.9 + col * 1.95;
    const y = 1.8 + row * 0.78;
    s.addShape(pres.shapes.RECTANGLE, { x, y, w: 1.8, h: 0.68, fill: { color: C.card }, line: { color: C.border, width: 1 } });
    s.addText(ind.emoji, { x, y: y + 0.03, w: 1.8, h: 0.35, fontSize: 22, align: 'center' });
    s.addText(ind.name, { x, y: y + 0.4, w: 1.8, h: 0.25, fontSize: 10, fontFace: 'Calibri', bold: true, color: C.dark, align: 'center', margin: 0 });
  });

  // Arrow
  s.addText('→', { x: 4.95, y: 2.8, w: 0.4, h: 0.5, fontSize: 32, color: C.accent, align: 'center', valign: 'middle' });

  // Template list
  card(s, 5.4, 1.15, 4.0, 4.0, { topBar: C.accent });
  s.addText('選んだ業種のテンプレート一覧', { x: 5.65, y: 1.3, w: 3.8, h: 0.35, fontSize: 13, fontFace: 'Calibri', bold: true, color: C.navy, margin: 0 });
  s.addText('例：飲食業を選んだ場合', { x: 5.65, y: 1.7, w: 3.8, h: 0.25, fontSize: 10, fontFace: 'Calibri', italic: true, color: C.muted, margin: 0 });

  const templates = [
    { emoji: '📋', name: '基本手順書', desc: '写真付き手順書' },
    { emoji: '✅', name: '衛生チェックリスト', desc: 'HACCP対応' },
    { emoji: '🍳', name: 'レシピカード', desc: '料理手順' },
  ];
  templates.forEach((t, i) => {
    const y = 2.1 + i * 0.85;
    s.addShape(pres.shapes.RECTANGLE, { x: 5.65, y, w: 3.5, h: 0.72, fill: { color: C.card }, line: { color: C.border, width: 1 } });
    s.addText(t.emoji, { x: 5.75, y: y + 0.1, w: 0.5, h: 0.5, fontSize: 20, align: 'center', valign: 'middle' });
    s.addText(t.name, { x: 6.3, y: y + 0.08, w: 2.7, h: 0.25, fontSize: 11, fontFace: 'Calibri', bold: true, color: C.dark, margin: 0 });
    s.addText(t.desc, { x: 6.3, y: y + 0.35, w: 2.7, h: 0.25, fontSize: 9, fontFace: 'Calibri', color: C.muted, margin: 0 });
  });

  // ============ SLIDE 8: Editor screen (big diagram) ============
  s = pres.addSlide();
  header(s, '7. マニュアル編集画面', 'アプリの中心となる画面', 8, TOTAL);

  // Mock phone full screen
  const ep = phoneFrame(s, 0.8, 1.15, 3.0, 4.0);
  // Header bar
  s.addShape(pres.shapes.RECTANGLE, { x: ep.innerX, y: ep.innerY, w: ep.innerW, h: 0.4, fill: { color: C.navy } });
  s.addText('← 編集画面', { x: ep.innerX + 0.1, y: ep.innerY, w: ep.innerW - 0.2, h: 0.4, fontSize: 9, fontFace: 'Calibri', bold: true, color: C.card, valign: 'middle' });

  // Title row
  s.addShape(pres.shapes.RECTANGLE, { x: ep.innerX, y: ep.innerY + 0.4, w: ep.innerW, h: 0.32, fill: { color: C.card }, line: { color: C.border, width: 0.5 } });
  s.addText('基本手順書', { x: ep.innerX + 0.1, y: ep.innerY + 0.4, w: 1.5, h: 0.32, fontSize: 9, fontFace: 'Calibri', bold: true, color: C.navy, valign: 'middle', margin: 0 });
  s.addShape(pres.shapes.RECTANGLE, { x: ep.innerX + 2.0, y: ep.innerY + 0.45, w: 0.4, h: 0.22, fill: { color: C.accent } });
  s.addText('保存', { x: ep.innerX + 2.0, y: ep.innerY + 0.45, w: 0.4, h: 0.22, fontSize: 6, fontFace: 'Calibri', bold: true, color: C.card, align: 'center', valign: 'middle' });
  s.addShape(pres.shapes.RECTANGLE, { x: ep.innerX + 2.45, y: ep.innerY + 0.45, w: 0.4, h: 0.22, fill: { color: C.navy } });
  s.addText('PDF', { x: ep.innerX + 2.45, y: ep.innerY + 0.45, w: 0.4, h: 0.22, fontSize: 6, fontFace: 'Calibri', bold: true, color: C.card, align: 'center', valign: 'middle' });

  // Toolbar (icons)
  s.addShape(pres.shapes.RECTANGLE, { x: ep.innerX, y: ep.innerY + 0.75, w: ep.innerW, h: 0.8, fill: { color: C.bg } });
  const tbIcons = ['📷', '📷+', '🖼', 'Aa', '🎤', '🔳', '✏️'];
  tbIcons.forEach((ic, i) => {
    const tx = ep.innerX + 0.1 + i * 0.39;
    s.addShape(pres.shapes.RECTANGLE, { x: tx, y: ep.innerY + 0.8, w: 0.35, h: 0.32, fill: { color: C.card }, line: { color: C.border, width: 0.5 } });
    s.addText(ic, { x: tx, y: ep.innerY + 0.8, w: 0.35, h: 0.32, fontSize: 10, align: 'center', valign: 'middle' });
  });
  const tbIcons2 = ['🔍+', '🔍-', '↩', '↪', '🗑'];
  tbIcons2.forEach((ic, i) => {
    const tx = ep.innerX + 0.1 + i * 0.39;
    s.addShape(pres.shapes.RECTANGLE, { x: tx, y: ep.innerY + 1.17, w: 0.35, h: 0.32, fill: { color: C.card }, line: { color: C.border, width: 0.5 } });
    s.addText(ic, { x: tx, y: ep.innerY + 1.17, w: 0.35, h: 0.32, fontSize: 9, align: 'center', valign: 'middle' });
  });

  // Canvas area
  s.addShape(pres.shapes.RECTANGLE, { x: ep.innerX, y: ep.innerY + 1.58, w: ep.innerW, h: 1.9, fill: { color: C.card } });
  s.addShape(pres.shapes.RECTANGLE, { x: ep.innerX + 0.1, y: ep.innerY + 1.7, w: ep.innerW - 0.2, h: 1.7, fill: { color: 'F8FAFC' }, line: { color: C.accent, width: 1, dashType: 'dash' } });
  s.addShape(pres.shapes.RECTANGLE, { x: ep.innerX + 0.3, y: ep.innerY + 1.85, w: 1.1, h: 0.7, fill: { color: C.sky }, line: { color: C.accent, width: 1, dashType: 'dash' } });
  s.addText('📷 写真', { x: ep.innerX + 0.3, y: ep.innerY + 1.85, w: 1.1, h: 0.7, fontSize: 7, color: C.primary, align: 'center', valign: 'middle' });
  s.addText('手順1: ここに説明文', { x: ep.innerX + 0.3, y: ep.innerY + 2.6, w: 2.4, h: 0.2, fontSize: 7, fontFace: 'Calibri', color: C.body, margin: 0 });

  // Page nav
  s.addShape(pres.shapes.RECTANGLE, { x: ep.innerX, y: ep.innerY + 3.5, w: ep.innerW, h: 0.5, fill: { color: C.card }, line: { color: C.border, width: 0.5 } });
  [1, 2, 3].forEach((n, i) => {
    const px = ep.innerX + 0.15 + i * 0.5;
    const sel = i === 0;
    s.addShape(pres.shapes.RECTANGLE, { x: px, y: ep.innerY + 3.55, w: 0.35, h: 0.4, fill: { color: sel ? C.sky : C.card }, line: { color: sel ? C.accent : C.border, width: sel ? 1 : 0.5 } });
    s.addText(String(n), { x: px, y: ep.innerY + 3.55, w: 0.35, h: 0.4, fontSize: 8, fontFace: 'Calibri', bold: true, color: sel ? C.primary : C.muted, align: 'center', valign: 'middle' });
  });
  s.addText('+', { x: ep.innerX + 1.75, y: ep.innerY + 3.55, w: 0.35, h: 0.4, fontSize: 14, fontFace: 'Calibri', bold: true, color: C.accent, align: 'center', valign: 'middle' });

  // Annotations on right
  const ann = [
    { label: '❶ 上部バー', desc: 'タイトル入力・保存・PDF出力', y: 1.2, areaY: 1.35, color: C.navy },
    { label: '❷ ツールバー', desc: '写真/文字/QR/手描き等 12個のボタン', y: 2.0, areaY: 2.1, color: C.primary },
    { label: '❸ 編集エリア', desc: '紙のイメージで写真・文字を自由配置', y: 3.0, areaY: 3.0, color: C.accent },
    { label: '❹ ページ一覧', desc: 'ページ切替・追加・削除', y: 4.4, areaY: 4.7, color: C.success },
  ];
  ann.forEach((a) => {
    card(s, 4.5, a.y, 5.0, 0.7, { leftBar: a.color });
    s.addText(a.label, { x: 4.7, y: a.y + 0.05, w: 2.0, h: 0.28, fontSize: 12, fontFace: 'Calibri', bold: true, color: a.color, margin: 0 });
    s.addText(a.desc, { x: 4.7, y: a.y + 0.35, w: 4.7, h: 0.3, fontSize: 10, fontFace: 'Calibri', color: C.body, margin: 0 });
    // Connector line from phone area to annotation
    s.addShape(pres.shapes.LINE, {
      x: 3.85, y: a.areaY + 0.1, w: 0.6, h: a.y - a.areaY + 0.2,
      line: { color: a.color, width: 1.5, dashType: 'dash' },
    });
  });

  // ============ SLIDE 9: Toolbar detail (visual) ============
  s = pres.addSlide();
  header(s, '8. ツールバーの12ボタン', '2行に整理された操作ボタン', 9, TOTAL);

  // Row 1
  s.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 1.15, w: 8.8, h: 0.32, fill: { color: C.navy } });
  s.addText('📱 Row 1: コンテンツを追加', { x: 0.75, y: 1.15, w: 5, h: 0.32, fontSize: 11, fontFace: 'Calibri', bold: true, color: C.card, valign: 'middle' });

  const row1 = [
    { icon: '📷', label: '写真を追加', desc: 'カメラ\nフォルダ' },
    { icon: '📷+', label: '編集して追加', desc: '写真に\n文字・図形' },
    { icon: '🖼', label: '画像を編集', desc: '既存写真を\n再編集' },
    { icon: 'Aa', label: 'テキスト', desc: '文字入力\n配置' },
    { icon: '🎤', label: '音声入力', desc: '話して\n文字化' },
    { icon: '🔳', label: 'QRコード', desc: 'URL埋込' },
    { icon: '✏️', label: '手描き', desc: '指で\n描画' },
  ];
  row1.forEach((b, i) => {
    const x = 0.6 + i * 1.26;
    card(s, x, 1.55, 1.2, 1.6);
    s.addShape(pres.shapes.OVAL, { x: x + 0.35, y: 1.65, w: 0.5, h: 0.5, fill: { color: C.primary } });
    s.addText(b.icon, { x: x + 0.35, y: 1.65, w: 0.5, h: 0.5, fontSize: 13, fontFace: 'Calibri', bold: true, color: C.card, align: 'center', valign: 'middle' });
    s.addText(b.label, { x, y: 2.2, w: 1.2, h: 0.3, fontSize: 10, fontFace: 'Calibri', bold: true, color: C.dark, align: 'center', margin: 0 });
    s.addText(b.desc, { x: x + 0.05, y: 2.5, w: 1.1, h: 0.6, fontSize: 8.5, fontFace: 'Calibri', color: C.muted, align: 'center', lineSpacingMultiple: 1.3, margin: 0 });
  });

  // Row 2
  s.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 3.35, w: 8.8, h: 0.32, fill: { color: C.accent } });
  s.addText('🔧 Row 2: 表示・編集操作', { x: 0.75, y: 3.35, w: 5, h: 0.32, fontSize: 11, fontFace: 'Calibri', bold: true, color: C.card, valign: 'middle' });

  const row2 = [
    { icon: '🔍+', label: '拡大' },
    { icon: '🔍−', label: '縮小' },
    { icon: '↩', label: '元に戻す' },
    { icon: '↪', label: 'やり直す' },
    { icon: '🗑', label: '削除' },
  ];
  row2.forEach((b, i) => {
    const x = 0.6 + i * 1.78;
    card(s, x, 3.75, 1.7, 1.3);
    s.addShape(pres.shapes.OVAL, { x: x + 0.6, y: 3.85, w: 0.5, h: 0.5, fill: { color: C.accent } });
    s.addText(b.icon, { x: x + 0.6, y: 3.85, w: 0.5, h: 0.5, fontSize: 13, fontFace: 'Calibri', bold: true, color: C.card, align: 'center', valign: 'middle' });
    s.addText(b.label, { x, y: 4.4, w: 1.7, h: 0.3, fontSize: 11, fontFace: 'Calibri', bold: true, color: C.dark, align: 'center', margin: 0 });
  });

  // ============ SLIDE 10: Photo flow (before/after image) ============
  s = pres.addSlide();
  header(s, '9. 写真を撮って貼り付け', '撮影 → 編集 → 配置', 10, TOTAL);

  // Step 1: camera
  card(s, 0.6, 1.2, 2.8, 3.0, { topBar: C.primary });
  s.addText('STEP 1', { x: 0.6, y: 1.3, w: 2.8, h: 0.25, fontSize: 10, fontFace: 'Calibri', bold: true, color: C.primary, align: 'center', margin: 0 });
  s.addShape(pres.shapes.OVAL, { x: 1.3, y: 1.7, w: 1.4, h: 1.4, fill: { color: C.primary } });
  s.addText('📷', { x: 1.3, y: 1.7, w: 1.4, h: 1.4, fontSize: 50, align: 'center', valign: 'middle' });
  s.addText('撮影する', { x: 0.6, y: 3.2, w: 2.8, h: 0.3, fontSize: 13, fontFace: 'Calibri', bold: true, color: C.dark, align: 'center', margin: 0 });
  s.addText('スマホのカメラで\n作業の写真を撮影', { x: 0.7, y: 3.55, w: 2.6, h: 0.5, fontSize: 10, fontFace: 'Calibri', color: C.body, align: 'center', lineSpacingMultiple: 1.3 });

  s.addText('→', { x: 3.4, y: 2.4, w: 0.4, h: 0.4, fontSize: 28, color: C.accent, align: 'center', valign: 'middle' });

  // Step 2: edit
  card(s, 3.7, 1.2, 2.8, 3.0, { topBar: C.accent });
  s.addText('STEP 2', { x: 3.7, y: 1.3, w: 2.8, h: 0.25, fontSize: 10, fontFace: 'Calibri', bold: true, color: C.accent, align: 'center', margin: 0 });
  // Mock photo with annotation
  s.addShape(pres.shapes.RECTANGLE, { x: 4.1, y: 1.7, w: 2.0, h: 1.4, fill: { color: 'F97316' } });
  s.addText('写真', { x: 4.1, y: 1.7, w: 2.0, h: 1.4, fontSize: 20, fontFace: 'Calibri', bold: true, color: C.card, align: 'center', valign: 'middle' });
  // Annotation: arrow + text
  s.addText('→', { x: 4.2, y: 1.85, w: 0.4, h: 0.3, fontSize: 24, color: 'FEF3C7', align: 'center' });
  s.addShape(pres.shapes.RECTANGLE, { x: 4.7, y: 2.5, w: 1.2, h: 0.3, fill: { color: 'EF4444' } });
  s.addText('ここ注意！', { x: 4.7, y: 2.5, w: 1.2, h: 0.3, fontSize: 9, fontFace: 'Calibri', bold: true, color: C.card, align: 'center', valign: 'middle' });

  s.addText('編集する（任意）', { x: 3.7, y: 3.2, w: 2.8, h: 0.3, fontSize: 13, fontFace: 'Calibri', bold: true, color: C.dark, align: 'center', margin: 0 });
  s.addText('文字・矢印・図形で\n要点を強調', { x: 3.8, y: 3.55, w: 2.6, h: 0.5, fontSize: 10, fontFace: 'Calibri', color: C.body, align: 'center', lineSpacingMultiple: 1.3 });

  s.addText('→', { x: 6.5, y: 2.4, w: 0.4, h: 0.4, fontSize: 28, color: C.accent, align: 'center', valign: 'middle' });

  // Step 3: placed in manual
  card(s, 6.8, 1.2, 2.6, 3.0, { topBar: C.success });
  s.addText('STEP 3', { x: 6.8, y: 1.3, w: 2.6, h: 0.25, fontSize: 10, fontFace: 'Calibri', bold: true, color: C.success, align: 'center', margin: 0 });
  // Paper mock
  s.addShape(pres.shapes.RECTANGLE, { x: 7.2, y: 1.7, w: 1.8, h: 1.4, fill: { color: C.card }, line: { color: C.border, width: 1 } });
  s.addShape(pres.shapes.RECTANGLE, { x: 7.3, y: 1.8, w: 0.9, h: 0.7, fill: { color: 'F97316' } });
  s.addText('→', { x: 7.4, y: 1.95, w: 0.25, h: 0.2, fontSize: 14, color: 'FEF3C7', align: 'center' });
  s.addShape(pres.shapes.RECTANGLE, { x: 7.3, y: 2.55, w: 1.6, h: 0.08, fill: { color: C.border } });
  s.addShape(pres.shapes.RECTANGLE, { x: 7.3, y: 2.7, w: 1.6, h: 0.08, fill: { color: C.border } });
  s.addShape(pres.shapes.RECTANGLE, { x: 7.3, y: 2.85, w: 1.2, h: 0.08, fill: { color: C.border } });
  s.addText('マニュアルに追加', { x: 6.8, y: 3.2, w: 2.6, h: 0.3, fontSize: 13, fontFace: 'Calibri', bold: true, color: C.dark, align: 'center', margin: 0 });
  s.addText('ページに自動配置\n位置・サイズも調整可', { x: 6.9, y: 3.55, w: 2.4, h: 0.5, fontSize: 10, fontFace: 'Calibri', color: C.body, align: 'center', lineSpacingMultiple: 1.3 });

  // Bottom benefit
  card(s, 0.6, 4.5, 8.8, 0.75, { leftBar: C.success });
  s.addText('💡  撮影からマニュアル掲載までスマホ1台で完結', {
    x: 0.85, y: 4.55, w: 8.4, h: 0.3, fontSize: 13, fontFace: 'Calibri', bold: true, color: C.success, margin: 0,
  });
  s.addText('PCへの転送・写真の加工ソフト・印刷ソフトなど他のツールは一切不要です', {
    x: 0.85, y: 4.85, w: 8.4, h: 0.3, fontSize: 10, fontFace: 'Calibri', color: C.body, margin: 0,
  });

  // ============ SLIDE 11: Photo Editor showcase ============
  s = pres.addSlide();
  header(s, '10. 写真の編集機能（Instagram風）', '写真の上に文字・図形を自由に', 11, TOTAL);

  // Big mock photo example
  card(s, 0.6, 1.15, 4.5, 4.0, { leftBar: C.accent });
  s.addText('編集の例', { x: 0.85, y: 1.3, w: 4, h: 0.3, fontSize: 13, fontFace: 'Calibri', bold: true, color: C.navy, margin: 0 });

  // Simulated photo
  s.addShape(pres.shapes.RECTANGLE, { x: 0.85, y: 1.75, w: 4.0, h: 3.0, fill: { color: '64748B' } });
  s.addText('（作業中の写真）', { x: 0.85, y: 1.75, w: 4.0, h: 3.0, fontSize: 14, fontFace: 'Calibri', italic: true, color: C.card, align: 'center', valign: 'middle' });

  // Annotations on the photo
  // Arrow
  s.addText('➡', { x: 1.2, y: 2.0, w: 0.6, h: 0.6, fontSize: 40, color: C.error, align: 'center', valign: 'middle' });
  // Text annotation
  s.addShape(pres.shapes.RECTANGLE, { x: 1.7, y: 2.2, w: 1.8, h: 0.35, fill: { color: 'FBBF24' } });
  s.addText('ここを押す', { x: 1.7, y: 2.2, w: 1.8, h: 0.35, fontSize: 12, fontFace: 'Calibri', bold: true, color: C.dark, align: 'center', valign: 'middle' });
  // Circle
  s.addShape(pres.shapes.OVAL, { x: 3.7, y: 3.2, w: 0.9, h: 0.9, fill: { type: 'none' }, line: { color: C.error, width: 4 } });
  // Star
  s.addText('★', { x: 1.0, y: 3.8, w: 0.6, h: 0.6, fontSize: 32, color: C.success, align: 'center', valign: 'middle' });
  // Checkmark
  s.addText('✓', { x: 3.8, y: 1.95, w: 0.6, h: 0.6, fontSize: 40, color: C.success, align: 'center', valign: 'middle' });

  // Right: what you can add
  card(s, 5.3, 1.15, 4.1, 4.0, { leftBar: C.primary });
  s.addText('追加できる要素', { x: 5.55, y: 1.3, w: 3.8, h: 0.3, fontSize: 13, fontFace: 'Calibri', bold: true, color: C.navy, margin: 0 });

  const elements = [
    { ic: 'Aa', label: 'テキスト（6サイズ）' },
    { ic: '➡', label: '矢印' },
    { ic: '━', label: '線' },
    { ic: '○', label: '丸' },
    { ic: '▢', label: '四角' },
    { ic: '△', label: '三角' },
    { ic: '★', label: '星' },
    { ic: '✓', label: 'チェックマーク' },
  ];
  elements.forEach((e, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 5.55 + col * 1.8;
    const y = 1.75 + row * 0.38;
    s.addShape(pres.shapes.OVAL, { x, y, w: 0.28, h: 0.28, fill: { color: C.accent } });
    s.addText(e.ic, { x, y, w: 0.28, h: 0.28, fontSize: 11, fontFace: 'Calibri', bold: true, color: C.card, align: 'center', valign: 'middle' });
    s.addText(e.label, { x: x + 0.35, y, w: 1.4, h: 0.28, fontSize: 10, fontFace: 'Calibri', color: C.body, valign: 'middle', margin: 0 });
  });

  // Colors
  s.addText('7色のカラー', { x: 5.55, y: 3.6, w: 3.5, h: 0.25, fontSize: 12, fontFace: 'Calibri', bold: true, color: C.navy, margin: 0 });
  const colors = ['EF4444', 'F97316', 'FBBF24', '10B981', '0891B2', '1E2761', '1A1F36'];
  colors.forEach((c, i) => {
    s.addShape(pres.shapes.OVAL, { x: 5.6 + i * 0.45, y: 3.95, w: 0.35, h: 0.35, fill: { color: c } });
  });
  s.addText('文字・図形の色を自由に選択', { x: 5.55, y: 4.4, w: 3.7, h: 0.25, fontSize: 9, fontFace: 'Calibri', italic: true, color: C.muted, margin: 0 });
  s.addText('💡 後から何度でも再編集できます', { x: 5.55, y: 4.75, w: 3.7, h: 0.25, fontSize: 10, fontFace: 'Calibri', bold: true, color: C.success, margin: 0 });

  // ============ SLIDE 12: Other features visual ============
  s = pres.addSlide();
  header(s, '11. 便利な追加機能', '音声入力・手描き・QRコード', 12, TOTAL);

  // Voice
  card(s, 0.6, 1.15, 2.85, 4.0, { topBar: 'EF4444' });
  s.addShape(pres.shapes.OVAL, { x: 1.45, y: 1.5, w: 1.15, h: 1.15, fill: { color: 'EF4444' } });
  s.addText('🎤', { x: 1.45, y: 1.5, w: 1.15, h: 1.15, fontSize: 44, align: 'center', valign: 'middle' });
  s.addText('音声入力', { x: 0.6, y: 2.75, w: 2.85, h: 0.35, fontSize: 15, fontFace: 'Calibri', bold: true, color: C.navy, align: 'center', margin: 0 });
  s.addText('話すだけで文字化', { x: 0.6, y: 3.1, w: 2.85, h: 0.3, fontSize: 11, fontFace: 'Calibri', italic: true, color: C.muted, align: 'center', margin: 0 });
  s.addShape(pres.shapes.LINE, { x: 1.1, y: 3.5, w: 1.85, h: 0, line: { color: C.border, width: 1 } });
  s.addText([
    { text: '例えば...', options: { breakLine: true, bold: true, color: C.accent } },
    { text: '"椅子に座ってシートベルトを着用する"', options: { italic: true, breakLine: true, color: C.muted, fontSize: 9 } },
    { text: '↓', options: { color: C.accent, breakLine: true } },
    { text: '自動で文字になる！', options: { bold: true, color: C.success } },
  ], { x: 0.75, y: 3.65, w: 2.55, h: 1.35, fontSize: 10, fontFace: 'Calibri', color: C.body, align: 'center', lineSpacingMultiple: 1.4 });

  // Drawing
  card(s, 3.6, 1.15, 2.8, 4.0, { topBar: C.warning });
  s.addShape(pres.shapes.OVAL, { x: 4.4, y: 1.5, w: 1.15, h: 1.15, fill: { color: C.warning } });
  s.addText('✏️', { x: 4.4, y: 1.5, w: 1.15, h: 1.15, fontSize: 44, align: 'center', valign: 'middle' });
  s.addText('手描きモード', { x: 3.6, y: 2.75, w: 2.8, h: 0.35, fontSize: 15, fontFace: 'Calibri', bold: true, color: C.navy, align: 'center', margin: 0 });
  s.addText('指で自由に描ける', { x: 3.6, y: 3.1, w: 2.8, h: 0.3, fontSize: 11, fontFace: 'Calibri', italic: true, color: C.muted, align: 'center', margin: 0 });
  s.addShape(pres.shapes.LINE, { x: 4.0, y: 3.5, w: 2.0, h: 0, line: { color: C.border, width: 1 } });
  // Mini canvas illustration
  s.addShape(pres.shapes.RECTANGLE, { x: 3.85, y: 3.65, w: 2.3, h: 1.3, fill: { color: C.bg }, line: { color: C.border, width: 1 } });
  // Draw simulated scribble
  s.addText('→', { x: 4.0, y: 3.8, w: 0.4, h: 0.3, fontSize: 20, color: 'EF4444', align: 'center' });
  s.addShape(pres.shapes.OVAL, { x: 4.6, y: 3.9, w: 0.8, h: 0.5, fill: { type: 'none' }, line: { color: '10B981', width: 2 } });
  s.addText('OK', { x: 5.5, y: 4.2, w: 0.5, h: 0.3, fontSize: 14, fontFace: 'Calibri', bold: true, color: '0891B2', align: 'center' });

  // QR
  card(s, 6.55, 1.15, 2.85, 4.0, { topBar: C.primary });
  s.addShape(pres.shapes.OVAL, { x: 7.4, y: 1.5, w: 1.15, h: 1.15, fill: { color: C.primary } });
  s.addText('🔳', { x: 7.4, y: 1.5, w: 1.15, h: 1.15, fontSize: 40, align: 'center', valign: 'middle' });
  s.addText('QRコード', { x: 6.55, y: 2.75, w: 2.85, h: 0.35, fontSize: 15, fontFace: 'Calibri', bold: true, color: C.navy, align: 'center', margin: 0 });
  s.addText('URLを埋め込める', { x: 6.55, y: 3.1, w: 2.85, h: 0.3, fontSize: 11, fontFace: 'Calibri', italic: true, color: C.muted, align: 'center', margin: 0 });
  s.addShape(pres.shapes.LINE, { x: 6.95, y: 3.5, w: 2.05, h: 0, line: { color: C.border, width: 1 } });
  // Mini QR pattern mock
  const qrX = 7.25, qrY = 3.7, qrS = 0.12;
  s.addShape(pres.shapes.RECTANGLE, { x: 7.05, y: 3.65, w: 1.55, h: 1.3, fill: { color: C.card }, line: { color: C.border, width: 1 } });
  const qrPattern = [
    [1,1,1,0,1,0,1,1,1],
    [1,0,1,1,1,1,1,0,1],
    [1,1,1,0,1,0,1,1,1],
    [0,0,0,1,0,1,0,0,0],
    [1,1,0,0,1,0,0,1,1],
    [0,0,1,1,0,1,1,0,0],
    [1,1,1,0,1,0,1,1,0],
    [1,0,1,1,1,1,1,0,1],
    [1,1,1,0,1,0,0,1,1],
  ];
  qrPattern.forEach((row, ri) => {
    row.forEach((v, ci) => {
      if (v === 1) {
        s.addShape(pres.shapes.RECTANGLE, { x: qrX + ci * qrS, y: qrY + ri * qrS, w: qrS, h: qrS, fill: { color: C.dark } });
      }
    });
  });

  // ============ SLIDE 13: PDF output flow ============
  s = pres.addSlide();
  header(s, '12. PDFで出力・印刷', 'マニュアルをすぐに共有', 13, TOTAL);

  // Manual mock
  card(s, 0.6, 1.2, 3.0, 3.9);
  s.addText('完成したマニュアル', { x: 0.6, y: 1.25, w: 3.0, h: 0.3, fontSize: 11, fontFace: 'Calibri', bold: true, color: C.navy, align: 'center', margin: 0 });
  // Paper stack
  s.addShape(pres.shapes.RECTANGLE, { x: 1.0, y: 1.85, w: 2.0, h: 2.8, fill: { color: C.card }, line: { color: C.border, width: 1 }, shadow: mkShadow() });
  s.addShape(pres.shapes.RECTANGLE, { x: 1.05, y: 1.9, w: 2.0, h: 2.8, fill: { color: C.card }, line: { color: C.border, width: 1 } });
  s.addShape(pres.shapes.RECTANGLE, { x: 1.1, y: 1.95, w: 2.0, h: 2.8, fill: { color: C.card }, line: { color: C.border, width: 1 } });
  s.addText('客室清掃', { x: 1.1, y: 2.05, w: 2.0, h: 0.3, fontSize: 11, fontFace: 'Calibri', bold: true, color: C.navy, align: 'center', margin: 0 });
  s.addShape(pres.shapes.RECTANGLE, { x: 1.3, y: 2.4, w: 1.6, h: 0.8, fill: { color: '64748B' } });
  s.addShape(pres.shapes.RECTANGLE, { x: 1.3, y: 3.3, w: 1.6, h: 0.06, fill: { color: C.border } });
  s.addShape(pres.shapes.RECTANGLE, { x: 1.3, y: 3.4, w: 1.6, h: 0.06, fill: { color: C.border } });
  s.addShape(pres.shapes.RECTANGLE, { x: 1.3, y: 3.5, w: 1.3, h: 0.06, fill: { color: C.border } });
  s.addShape(pres.shapes.RECTANGLE, { x: 1.3, y: 3.75, w: 1.6, h: 0.8, fill: { color: '64748B' } });

  // Arrow
  s.addText('→', { x: 3.7, y: 2.8, w: 0.5, h: 0.5, fontSize: 40, color: C.accent, align: 'center', valign: 'middle' });

  // PDF options
  card(s, 4.3, 1.2, 5.1, 3.9, { leftBar: C.primary });
  s.addText('📄  PDF出力の選択肢', { x: 4.55, y: 1.3, w: 4.8, h: 0.3, fontSize: 14, fontFace: 'Calibri', bold: true, color: C.navy, margin: 0 });

  // Paper sizes
  s.addText('用紙サイズを選択', { x: 4.55, y: 1.75, w: 4.8, h: 0.25, fontSize: 11, fontFace: 'Calibri', bold: true, color: C.body, margin: 0 });
  ['A4', 'A3', 'B4'].forEach((size, i) => {
    const sx = 4.55 + i * 1.1;
    const sel = i === 0;
    s.addShape(pres.shapes.RECTANGLE, { x: sx, y: 2.05, w: 1.0, h: 0.4, fill: { color: sel ? C.sky : C.card }, line: { color: sel ? C.accent : C.border, width: sel ? 1.5 : 0.5 } });
    s.addText(size, { x: sx, y: 2.05, w: 1.0, h: 0.4, fontSize: 12, fontFace: 'Calibri', bold: true, color: sel ? C.primary : C.muted, align: 'center', valign: 'middle' });
  });

  // Output options
  s.addShape(pres.shapes.RECTANGLE, { x: 4.55, y: 2.75, w: 2.3, h: 0.8, fill: { color: C.accent } });
  s.addText('📥  PDFで保存', { x: 4.55, y: 2.75, w: 2.3, h: 0.4, fontSize: 13, fontFace: 'Calibri', bold: true, color: C.card, align: 'center', valign: 'middle' });
  s.addText('端末にダウンロード', { x: 4.55, y: 3.15, w: 2.3, h: 0.35, fontSize: 9, fontFace: 'Calibri', color: 'CADCFC', align: 'center', valign: 'middle' });

  s.addShape(pres.shapes.RECTANGLE, { x: 7.0, y: 2.75, w: 2.3, h: 0.8, fill: { color: C.navy } });
  s.addText('🖨  印刷', { x: 7.0, y: 2.75, w: 2.3, h: 0.4, fontSize: 13, fontFace: 'Calibri', bold: true, color: C.card, align: 'center', valign: 'middle' });
  s.addText('プリンターで直接印刷', { x: 7.0, y: 3.15, w: 2.3, h: 0.35, fontSize: 9, fontFace: 'Calibri', color: 'CADCFC', align: 'center', valign: 'middle' });

  s.addText('✉️ メール添付・LINE送信でも共有可能', {
    x: 4.55, y: 3.8, w: 4.8, h: 0.3, fontSize: 11, fontFace: 'Calibri', italic: true, bold: true, color: C.success, margin: 0,
  });
  s.addText('全ページのプレビュー確認あり → 安心して出力', {
    x: 4.55, y: 4.15, w: 4.8, h: 0.3, fontSize: 10, fontFace: 'Calibri', color: C.body, margin: 0,
  });
  s.addText('作成者・日付は自動で記載', {
    x: 4.55, y: 4.5, w: 4.8, h: 0.3, fontSize: 10, fontFace: 'Calibri', color: C.body, margin: 0,
  });

  // ============ SLIDE 14: File management ============
  s = pres.addSlide();
  header(s, '13. ファイル管理', '作ったマニュアルをしっかり整理', 14, TOTAL);

  // Phone mock of files page
  const fp = phoneFrame(s, 0.8, 1.15, 2.8, 4.0);
  s.addShape(pres.shapes.RECTANGLE, { x: fp.innerX, y: fp.innerY, w: fp.innerW, h: 0.4, fill: { color: C.navy } });
  s.addText('← ファイル一覧', { x: fp.innerX + 0.1, y: fp.innerY, w: fp.innerW - 0.2, h: 0.4, fontSize: 9, fontFace: 'Calibri', bold: true, color: C.card, valign: 'middle' });

  // Search bar
  s.addShape(pres.shapes.RECTANGLE, { x: fp.innerX + 0.1, y: fp.innerY + 0.55, w: 2.1, h: 0.28, fill: { color: C.card }, line: { color: C.border, width: 1 } });
  s.addText('🔍 検索...', { x: fp.innerX + 0.15, y: fp.innerY + 0.55, w: 2.0, h: 0.28, fontSize: 8, fontFace: 'Calibri', color: C.muted, valign: 'middle' });
  s.addShape(pres.shapes.RECTANGLE, { x: fp.innerX + 2.3, y: fp.innerY + 0.55, w: 0.35, h: 0.28, fill: { color: C.card }, line: { color: C.border, width: 1 } });
  s.addText('📥', { x: fp.innerX + 2.3, y: fp.innerY + 0.55, w: 0.35, h: 0.28, fontSize: 8, align: 'center', valign: 'middle' });

  // File cards
  const fnames = ['客室清掃マニュアル', '基本手順書', '衛生チェック'];
  fnames.forEach((name, i) => {
    const y = fp.innerY + 1.0 + i * 0.65;
    s.addShape(pres.shapes.RECTANGLE, { x: fp.innerX + 0.1, y, w: 2.55, h: 0.55, fill: { color: C.card }, line: { color: C.border, width: 0.5 } });
    s.addShape(pres.shapes.RECTANGLE, { x: fp.innerX + 0.18, y: y + 0.08, w: 0.35, h: 0.4, fill: { color: C.bg } });
    s.addText('📄', { x: fp.innerX + 0.18, y: y + 0.08, w: 0.35, h: 0.4, fontSize: 13, align: 'center', valign: 'middle' });
    s.addText(name, { x: fp.innerX + 0.6, y: y + 0.08, w: 1.65, h: 0.22, fontSize: 8, fontFace: 'Calibri', bold: true, color: C.dark, margin: 0 });
    s.addText('2026/04/15 · 3P', { x: fp.innerX + 0.6, y: y + 0.3, w: 1.65, h: 0.2, fontSize: 6, fontFace: 'Calibri', color: C.muted, margin: 0 });
    s.addShape(pres.shapes.RECTANGLE, { x: fp.innerX + 2.25, y: y + 0.13, w: 0.3, h: 0.3, fill: { color: C.card }, line: { color: C.border, width: 0.5 } });
    s.addText('⋯', { x: fp.innerX + 2.25, y: y + 0.13, w: 0.3, h: 0.3, fontSize: 10, color: C.muted, align: 'center', valign: 'middle' });
  });

  // Callouts
  card(s, 4.2, 1.15, 5.2, 0.8, { leftBar: C.primary });
  s.addText('🔍 タイトル検索', { x: 4.45, y: 1.2, w: 2.5, h: 0.3, fontSize: 12, fontFace: 'Calibri', bold: true, color: C.primary, margin: 0 });
  s.addText('たくさん作っても目的のマニュアルをすぐ発見', { x: 4.45, y: 1.5, w: 4.8, h: 0.4, fontSize: 10, fontFace: 'Calibri', color: C.body, margin: 0 });

  card(s, 4.2, 2.0, 5.2, 0.8, { leftBar: C.accent });
  s.addText('📥 インポートボタン', { x: 4.45, y: 2.05, w: 2.5, h: 0.3, fontSize: 12, fontFace: 'Calibri', bold: true, color: C.accent, margin: 0 });
  s.addText('他の端末で作ったファイル（JSON）を取り込む', { x: 4.45, y: 2.35, w: 4.8, h: 0.4, fontSize: 10, fontFace: 'Calibri', color: C.body, margin: 0 });

  card(s, 4.2, 2.85, 5.2, 2.3, { leftBar: C.success });
  s.addText('⋯ メニューから選べる操作', { x: 4.45, y: 2.95, w: 4.8, h: 0.3, fontSize: 12, fontFace: 'Calibri', bold: true, color: C.success, margin: 0 });
  const menuOps = [
    { icon: '📋', label: '複製', desc: '似たマニュアルを量産する時に便利' },
    { icon: '📤', label: 'エクスポート', desc: 'JSONファイルとして書き出し（共有用）' },
    { icon: '🗑', label: '削除', desc: '不要になったファイルを削除' },
  ];
  menuOps.forEach((op, i) => {
    const y = 3.3 + i * 0.55;
    s.addText(op.icon, { x: 4.5, y, w: 0.4, h: 0.35, fontSize: 16, align: 'center', valign: 'middle' });
    s.addText(op.label, { x: 4.95, y, w: 1.2, h: 0.35, fontSize: 11, fontFace: 'Calibri', bold: true, color: C.dark, valign: 'middle', margin: 0 });
    s.addText(op.desc, { x: 6.15, y, w: 3.1, h: 0.35, fontSize: 10, fontFace: 'Calibri', color: C.muted, valign: 'middle', margin: 0 });
  });

  // ============ SLIDE 15: How to - 7 steps ============
  s = pres.addSlide();
  header(s, '14. 基本的な使い方（7ステップ）', '初めてでも迷わない', 15, TOTAL);

  const hsteps = [
    { num: 1, title: '「新規作成」をタップ', icon: '🏠', color: C.primary },
    { num: 2, title: '業種を選ぶ', icon: '🏭', color: C.primary },
    { num: 3, title: 'テンプレートを選ぶ', icon: '📋', color: C.accent },
    { num: 4, title: 'タイトル入力', icon: 'Aa', color: C.accent },
    { num: 5, title: '写真・文字を追加', icon: '📷', color: C.success },
    { num: 6, title: '「保存」ボタン', icon: '💾', color: C.warning },
    { num: 7, title: 'PDF出力で完成', icon: '📄', color: 'EF4444' },
  ];
  hsteps.forEach((st, i) => {
    const col = i % 4;
    const row = Math.floor(i / 4);
    const x = 0.6 + col * 2.2;
    const y = 1.2 + row * 2.0;

    card(s, x, y, 2.1, 1.85);
    // Number badge
    s.addShape(pres.shapes.OVAL, { x: x + 0.15, y: y + 0.15, w: 0.55, h: 0.55, fill: { color: st.color } });
    s.addText(String(st.num), { x: x + 0.15, y: y + 0.15, w: 0.55, h: 0.55, fontSize: 22, fontFace: 'Calibri', bold: true, color: C.card, align: 'center', valign: 'middle' });
    // Icon
    s.addText(st.icon, { x: x + 0.8, y: y + 0.2, w: 1.2, h: 0.5, fontSize: 30, fontFace: 'Calibri', bold: true, color: st.color, align: 'center' });
    // Title
    s.addText(st.title, { x: x + 0.1, y: y + 0.85, w: 1.9, h: 0.9, fontSize: 12, fontFace: 'Calibri', bold: true, color: C.dark, align: 'center', valign: 'top', lineSpacingMultiple: 1.3 });

    // Arrow to next (if not last in row / deck)
    if (i < hsteps.length - 1 && col < 3) {
      s.addText('→', { x: x + 2.1, y: y + 0.65, w: 0.1, h: 0.4, fontSize: 20, color: C.accent, align: 'center', valign: 'middle' });
    }
  });

  // ============ SLIDE 16: Usage scenarios ============
  s = pres.addSlide();
  header(s, '15. 活用シーン', '実際の使い方イメージ', 16, TOTAL);

  const scenarios = [
    {
      emoji: '👷',
      title: '現場での作業手順記録',
      steps: ['作業者がスマホで各工程を撮影', 'その場で文字・矢印を追加', 'PDFで上司に共有'],
      color: C.primary,
    },
    {
      emoji: '🎓',
      title: '新人教育資料',
      steps: ['ベテランの動きを撮影', '重要ポイントに矢印・注釈', '全新人に同じ資料を配布'],
      color: C.accent,
    },
    {
      emoji: '📑',
      title: '紙マニュアルのデジタル化',
      steps: ['既存マニュアルを撮影', 'アプリで補足追加', 'PDFで配布 → 検索可能'],
      color: C.success,
    },
    {
      emoji: '🏪',
      title: '複数店舗で統一',
      steps: ['本部で標準マニュアル作成', 'JSON エクスポート', '各店舗でインポート'],
      color: C.warning,
    },
  ];
  scenarios.forEach((sc, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 0.6 + col * 4.4;
    const y = 1.15 + row * 2.0;
    card(s, x, y, 4.2, 1.85, { topBar: sc.color });
    s.addText(sc.emoji, { x: x + 0.1, y: y + 0.2, w: 0.8, h: 0.8, fontSize: 36, align: 'center', valign: 'middle' });
    s.addText(sc.title, { x: x + 0.95, y: y + 0.2, w: 3.2, h: 0.35, fontSize: 13, fontFace: 'Calibri', bold: true, color: C.navy, margin: 0 });
    // Steps
    sc.steps.forEach((step, idx) => {
      const sy = y + 0.65 + idx * 0.35;
      s.addShape(pres.shapes.OVAL, { x: x + 0.95, y: sy, w: 0.25, h: 0.25, fill: { color: sc.color } });
      s.addText(String(idx + 1), { x: x + 0.95, y: sy, w: 0.25, h: 0.25, fontSize: 9, fontFace: 'Calibri', bold: true, color: C.card, align: 'center', valign: 'middle' });
      s.addText(step, { x: x + 1.3, y: sy, w: 2.85, h: 0.28, fontSize: 10, fontFace: 'Calibri', color: C.body, valign: 'middle', margin: 0 });
    });
  });

  // ============ SLIDE 17: FAQ ============
  s = pres.addSlide();
  header(s, '16. よくあるご質問', 'FAQ', 17, TOTAL);

  const faqs = [
    { q: 'インターネットがなくても使えますか？', a: '初回アクセス後は、オフラインでも利用できます。' },
    { q: '他の端末で同じマニュアルを開けますか？', a: 'エクスポート/インポート機能でデータを移動できます。' },
    { q: 'データは第三者に見られませんか？', a: '端末内にのみ保存されるため、漏洩の心配はありません。' },
    { q: '写真は何枚まで入れられますか？', a: '上限なし。100枚以上入れた実例もあります。' },
    { q: 'テンプレートの追加は可能ですか？', a: 'オリジナルテンプレートの開発も承ります。' },
    { q: '今後の機能追加は？', a: 'クラウド保存・AI機能等、拡張のご相談承ります。' },
  ];
  faqs.forEach((faq, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 0.6 + col * 4.4;
    const y = 1.15 + row * 1.4;
    card(s, x, y, 4.2, 1.3, { leftBar: C.accent });
    // Q
    s.addShape(pres.shapes.OVAL, { x: x + 0.15, y: y + 0.1, w: 0.3, h: 0.3, fill: { color: C.accent } });
    s.addText('Q', { x: x + 0.15, y: y + 0.1, w: 0.3, h: 0.3, fontSize: 12, fontFace: 'Calibri', bold: true, color: C.card, align: 'center', valign: 'middle' });
    s.addText(faq.q, { x: x + 0.5, y: y + 0.1, w: 3.6, h: 0.45, fontSize: 11, fontFace: 'Calibri', bold: true, color: C.dark, margin: 0 });
    // A
    s.addShape(pres.shapes.OVAL, { x: x + 0.15, y: y + 0.65, w: 0.3, h: 0.3, fill: { color: C.success } });
    s.addText('A', { x: x + 0.15, y: y + 0.65, w: 0.3, h: 0.3, fontSize: 12, fontFace: 'Calibri', bold: true, color: C.card, align: 'center', valign: 'middle' });
    s.addText(faq.a, { x: x + 0.5, y: y + 0.65, w: 3.6, h: 0.6, fontSize: 10, fontFace: 'Calibri', color: C.body, margin: 0, lineSpacingMultiple: 1.3 });
  });

  // ============ SLIDE 18: Closing ============
  s = pres.addSlide();
  s.background = { color: C.navy };
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 5.625, fill: { color: C.navy } });

  s.addText('ご検討のほど', {
    x: 0.6, y: 1.2, w: 8.8, h: 0.6, fontSize: 30, fontFace: 'Calibri', bold: true, color: C.card, align: 'center', margin: 0,
  });
  s.addText('よろしくお願いいたします', {
    x: 0.6, y: 1.8, w: 8.8, h: 0.6, fontSize: 30, fontFace: 'Calibri', bold: true, color: C.card, align: 'center', margin: 0,
  });
  s.addShape(pres.shapes.LINE, { x: 3.5, y: 2.65, w: 3, h: 0, line: { color: C.accent, width: 2 } });

  s.addText('お問い合わせ・導入に関するご相談', {
    x: 0.6, y: 2.95, w: 8.8, h: 0.4, fontSize: 14, fontFace: 'Calibri', color: 'CADCFC', align: 'center', margin: 0,
  });

  const infos = [
    { icon: '🌐', label: '公開URL', value: 'iuy58754932-jpg.github.io/manual-app-demo' },
    { icon: '📱', label: '対応デバイス', value: 'iPhone / Android / パソコン' },
    { icon: '🌐', label: '対応ブラウザ', value: 'Safari / Chrome / Edge' },
    { icon: '💰', label: 'ご利用料金', value: '月額費用 0円' },
  ];
  infos.forEach((info, i) => {
    const y = 3.55 + i * 0.42;
    s.addShape(pres.shapes.RECTANGLE, { x: 1.5, y, w: 7, h: 0.36, fill: { color: C.primary } });
    s.addText(info.icon, { x: 1.65, y, w: 0.5, h: 0.36, fontSize: 14, align: 'center', valign: 'middle' });
    s.addText(info.label, { x: 2.2, y, w: 1.8, h: 0.36, fontSize: 11, fontFace: 'Calibri', bold: true, color: 'CADCFC', valign: 'middle', margin: 0 });
    s.addText(info.value, { x: 4.0, y, w: 4.3, h: 0.36, fontSize: 11, fontFace: 'Calibri', color: C.card, valign: 'middle', margin: 0 });
  });

  s.addText('本資料は v1.6 時点のものです。機能はアップデートで拡張されます。', {
    x: 0.6, y: 5.3, w: 8.8, h: 0.25, fontSize: 9, fontFace: 'Calibri', italic: true, color: C.muted, align: 'center', margin: 0,
  });

  // ── Save ──
  const outPath = 'C:/Users/81805/JavaPractice/ClaudeCodePractice/manual_app_pwa/manual_app_client_guide_v1.6.pptx';
  await pres.writeFile({ fileName: outPath });
  console.log('Created: ' + outPath);
}

main().catch(console.error);
