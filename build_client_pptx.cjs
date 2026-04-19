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

async function main() {
  pres = new pptxgen();
  pres.layout = 'LAYOUT_16x9';
  pres.author = '開発チーム';
  pres.title = 'マニュアル作成アプリ ご紹介資料';

  const TOTAL = 16;

  // ============ SLIDE 1: Cover ============
  let s = pres.addSlide();
  s.background = { color: C.navy };
  s.addShape(pres.shapes.RECTANGLE, { x: 6.2, y: 0, w: 3.8, h: 5.625, fill: { color: C.primary } });
  s.addShape(pres.shapes.RECTANGLE, { x: 7.35, y: 1.5, w: 1.3, h: 1.3, fill: { color: C.accent }, shadow: mkShadow() });
  s.addText('M', { x: 7.35, y: 1.5, w: 1.3, h: 1.3, fontSize: 48, fontFace: 'Calibri', bold: true, color: C.card, align: 'center', valign: 'middle' });
  s.addText('マニュアル作成アプリ', { x: 0.7, y: 1.3, w: 5.5, h: 0.7, fontSize: 32, fontFace: 'Calibri', bold: true, color: C.card, margin: 0 });
  s.addText('ご紹介資料', { x: 0.7, y: 2.0, w: 5.5, h: 0.5, fontSize: 22, fontFace: 'Calibri', color: C.accent, margin: 0 });
  s.addShape(pres.shapes.LINE, { x: 0.7, y: 2.75, w: 2.5, h: 0, line: { color: C.accent, width: 3 } });
  s.addText('業務マニュアルをスマホで簡単に', { x: 0.7, y: 3.0, w: 5.5, h: 0.4, fontSize: 16, fontFace: 'Calibri', color: 'CADCFC', margin: 0 });
  s.addText('テンプレート選択 / 写真＋文字 / PDF出力', { x: 0.7, y: 3.4, w: 5.5, h: 0.3, fontSize: 12, fontFace: 'Calibri', color: C.muted, margin: 0 });
  s.addText('2026年4月', { x: 0.7, y: 4.8, w: 5.5, h: 0.3, fontSize: 12, fontFace: 'Calibri', italic: true, color: 'CADCFC', margin: 0 });

  // ============ SLIDE 2: Intro - 3 key points ============
  s = pres.addSlide();
  header(s, '1. アプリのご紹介', 'こんなことができます', 2, TOTAL);

  s.addText('業務マニュアルをスマートフォンで簡単に作成・編集・共有', {
    x: 0.6, y: 1.1, w: 8.8, h: 0.4, fontSize: 15, fontFace: 'Calibri', italic: true, color: C.accent, margin: 0, align: 'center',
  });

  const keys = [
    { emoji: '📋', title: 'テンプレートから選ぶだけ', desc: '業種ごとのマニュアル下書きがすぐ使えます。白紙から作る必要はありません。', color: C.primary },
    { emoji: '📷', title: '写真をそのまま貼り付け', desc: 'スマホで撮影 → その場でマニュアル化。手元に画像がなくてもすぐ作成。', color: C.accent },
    { emoji: '📄', title: 'PDF出力＆印刷', desc: '完成したマニュアルはPDFで保存、そのまま印刷して配布・共有できます。', color: C.success },
  ];
  keys.forEach((k, i) => {
    const x = 0.6 + i * 3.1;
    card(s, x, 1.7, 2.8, 3.2, { topBar: k.color });
    s.addText(k.emoji, { x, y: 1.85, w: 2.8, h: 0.8, fontSize: 52, align: 'center' });
    s.addText(k.title, { x, y: 2.75, w: 2.8, h: 0.7, fontSize: 14, fontFace: 'Calibri', bold: true, color: C.dark, align: 'center', margin: 0 });
    s.addText(k.desc, { x: x + 0.2, y: 3.5, w: 2.4, h: 1.3, fontSize: 11, fontFace: 'Calibri', color: C.body, align: 'center', lineSpacingMultiple: 1.5 });
  });

  // ============ SLIDE 3: Who is this for ============
  s = pres.addSlide();
  header(s, '2. こんな方におすすめ', 'Target users', 3, TOTAL);

  const targets = [
    { emoji: '👷', title: '現場作業のマニュアル化', desc: '作業手順を撮影しながら、\nその場でマニュアル作成したい', color: C.primary },
    { emoji: '🎓', title: '新人教育用の資料作成', desc: 'ベテランの動きを記録して\n新人の教材を手軽に準備したい', color: C.accent },
    { emoji: '📑', title: '紙マニュアルのデジタル化', desc: '既存の紙マニュアルを\nデジタル化して共有したい', color: C.success },
    { emoji: '🏪', title: '複数店舗の業務統一', desc: '複数店舗・部署で同じ業務手順を\n統一したい', color: C.warning },
  ];
  targets.forEach((t, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 0.6 + col * 4.4;
    const y = 1.2 + row * 2.0;
    card(s, x, y, 4.2, 1.85, { leftBar: t.color });
    s.addText(t.emoji, { x: x + 0.2, y: y + 0.35, w: 0.9, h: 0.9, fontSize: 42, align: 'center', valign: 'middle' });
    s.addText(t.title, { x: x + 1.2, y: y + 0.25, w: 2.9, h: 0.4, fontSize: 14, fontFace: 'Calibri', bold: true, color: C.navy, margin: 0 });
    s.addText(t.desc, { x: x + 1.2, y: y + 0.75, w: 2.9, h: 1.0, fontSize: 11, fontFace: 'Calibri', color: C.body, lineSpacingMultiple: 1.4, margin: 0 });
  });

  // ============ SLIDE 4: Cost & Device ============
  s = pres.addSlide();
  header(s, '3. ご利用料金・対応端末', 'Cost & device support', 4, TOTAL);

  // Cost card
  card(s, 0.6, 1.15, 4.3, 2.0, { topBar: C.success });
  s.addText('💰  ご利用料金', {
    x: 0.85, y: 1.25, w: 4, h: 0.35, fontSize: 15, fontFace: 'Calibri', bold: true, color: C.navy, margin: 0,
  });
  s.addText('0円', {
    x: 0.85, y: 1.75, w: 4, h: 0.8, fontSize: 56, fontFace: 'Calibri', bold: true, color: C.success, margin: 0,
  });
  s.addText('月額サーバー費用なし', {
    x: 0.85, y: 2.55, w: 4, h: 0.3, fontSize: 11, fontFace: 'Calibri', color: C.body, margin: 0,
  });
  s.addText('（追加の機器・ソフト購入も不要）', {
    x: 0.85, y: 2.85, w: 4, h: 0.3, fontSize: 10, fontFace: 'Calibri', italic: true, color: C.muted, margin: 0,
  });

  // Devices card
  card(s, 5.1, 1.15, 4.3, 2.0, { topBar: C.primary });
  s.addText('📱  対応端末', {
    x: 5.35, y: 1.25, w: 4, h: 0.35, fontSize: 15, fontFace: 'Calibri', bold: true, color: C.navy, margin: 0,
  });
  s.addText([
    { text: 'iPhone', options: { bold: true, color: C.primary } },
    { text: '（推奨・最優先で対応）', options: { breakLine: true } },
    { text: 'Android', options: { bold: true, color: C.primary } },
    { text: ' スマートフォン', options: { breakLine: true } },
    { text: 'パソコン', options: { bold: true, color: C.primary } },
    { text: '（確認用として利用可）', options: {} },
  ], { x: 5.35, y: 1.75, w: 3.9, h: 1.3, fontSize: 12, fontFace: 'Calibri', color: C.body, lineSpacingMultiple: 1.6 });

  // Internet card
  card(s, 0.6, 3.4, 8.8, 1.8, { topBar: C.accent });
  s.addText('🌐  インターネット接続', {
    x: 0.85, y: 3.5, w: 4, h: 0.35, fontSize: 15, fontFace: 'Calibri', bold: true, color: C.navy, margin: 0,
  });
  s.addText([
    { text: '初回アクセス時のみ必要', options: { bullet: true, bold: true, breakLine: true } },
    { text: '以降はインターネットなしでも利用可能（オフライン動作対応）', options: { bullet: true, breakLine: true } },
    { text: 'ホーム画面に追加すれば、アプリのように起動できます', options: { bullet: true } },
  ], { x: 0.85, y: 3.95, w: 8.4, h: 1.2, fontSize: 12, fontFace: 'Calibri', color: C.body, lineSpacingMultiple: 1.5 });

  // ============ SLIDE 5: Feature Overview ============
  s = pres.addSlide();
  header(s, '4. できること一覧', 'Feature overview', 5, TOTAL);

  const features = [
    { emoji: '📋', title: 'テンプレート選択', desc: '8業種13種類から', color: C.primary },
    { emoji: '📷', title: '写真の取り込み', desc: 'カメラ・フォルダから', color: C.accent },
    { emoji: '🖼', title: '写真編集', desc: '文字・図形・色を追加', color: C.success },
    { emoji: '✏️', title: '手描きモード', desc: '指やペンで自由に', color: C.warning },
    { emoji: 'Aa', title: 'テキスト入力', desc: '配置・サイズ変更', color: 'A78BFA' },
    { emoji: '🎤', title: '音声入力', desc: '話した内容を文字化', color: 'EF4444' },
    { emoji: '🔳', title: 'QRコード生成', desc: 'URLを埋め込み', color: C.primary },
    { emoji: '📄', title: 'PDF出力・印刷', desc: 'A4/A3/B4選択可', color: C.accent },
    { emoji: '💾', title: '保存・検索', desc: '端末に自動保存', color: C.success },
    { emoji: '📤', title: 'ファイル共有', desc: 'エクスポート/インポート', color: C.warning },
  ];
  features.forEach((f, i) => {
    const col = i % 5;
    const row = Math.floor(i / 5);
    const x = 0.6 + col * 1.78;
    const y = 1.15 + row * 2.0;
    card(s, x, y, 1.7, 1.85);
    s.addShape(pres.shapes.OVAL, { x: x + 0.55, y: y + 0.2, w: 0.6, h: 0.6, fill: { color: f.color } });
    s.addText(f.emoji, { x: x + 0.55, y: y + 0.2, w: 0.6, h: 0.6, fontSize: 20, fontFace: 'Calibri', bold: true, color: C.card, align: 'center', valign: 'middle' });
    s.addText(f.title, { x, y: y + 0.9, w: 1.7, h: 0.35, fontSize: 11, fontFace: 'Calibri', bold: true, color: C.dark, align: 'center', margin: 0 });
    s.addText(f.desc, { x, y: y + 1.25, w: 1.7, h: 0.55, fontSize: 9, fontFace: 'Calibri', color: C.muted, align: 'center', lineSpacingMultiple: 1.3 });
  });

  // ============ SLIDE 6: Screen Flow ============
  s = pres.addSlide();
  header(s, '5. 全体の画面の流れ', 'Screen flow', 6, TOTAL);

  s.addText('最短3ステップでマニュアル作成を開始できます', {
    x: 0.6, y: 1.1, w: 8.8, h: 0.35, fontSize: 13, fontFace: 'Calibri', italic: true, color: C.accent, margin: 0,
  });

  s.addText('新規作成の流れ', { x: 0.6, y: 1.6, w: 3, h: 0.3, fontSize: 12, fontFace: 'Calibri', bold: true, color: C.navy, margin: 0 });
  const mainFlow = [
    { label: 'ホーム', emoji: '🏠' },
    { label: '業種を選ぶ', emoji: '🏭' },
    { label: 'テンプレ選択', emoji: '📋' },
    { label: '編集する', emoji: '✏️' },
    { label: 'PDF出力', emoji: '📄' },
  ];
  mainFlow.forEach((f, i) => {
    const x = 0.6 + i * 1.85;
    card(s, x, 2.0, 1.55, 1.3, { topBar: C.primary });
    s.addText(f.emoji, { x, y: 2.12, w: 1.55, h: 0.45, fontSize: 26, align: 'center' });
    s.addText(f.label, { x: x + 0.05, y: 2.65, w: 1.45, h: 0.25, fontSize: 10, fontFace: 'Calibri', bold: true, color: C.dark, align: 'center', margin: 0 });
    if (i < mainFlow.length - 1) {
      s.addText('→', { x: x + 1.55, y: 2.4, w: 0.3, h: 0.4, fontSize: 18, color: C.accent, align: 'center', valign: 'middle' });
    }
  });

  s.addText('保存済みファイルを開く場合', { x: 0.6, y: 3.6, w: 5, h: 0.3, fontSize: 12, fontFace: 'Calibri', bold: true, color: C.navy, margin: 0 });
  const altFlow = [
    { label: 'ホーム', emoji: '🏠' },
    { label: 'ファイル一覧', emoji: '📂' },
    { label: '編集する', emoji: '✏️' },
  ];
  altFlow.forEach((f, i) => {
    const x = 0.6 + i * 1.85;
    card(s, x, 4.0, 1.55, 0.9, { topBar: C.muted });
    s.addText(f.emoji, { x, y: 4.08, w: 1.55, h: 0.35, fontSize: 20, align: 'center' });
    s.addText(f.label, { x: x + 0.05, y: 4.45, w: 1.45, h: 0.25, fontSize: 10, fontFace: 'Calibri', bold: true, color: C.dark, align: 'center', margin: 0 });
    if (i < altFlow.length - 1) {
      s.addText('→', { x: x + 1.55, y: 4.2, w: 0.3, h: 0.4, fontSize: 18, color: C.muted, align: 'center', valign: 'middle' });
    }
  });

  s.addText('※ 最近編集したファイルはホーム画面から直接開くこともできます', {
    x: 0.6, y: 5.1, w: 8, h: 0.3, fontSize: 10, fontFace: 'Calibri', color: C.muted, margin: 0,
  });

  // ============ SLIDE 7: Home Screen ============
  s = pres.addSlide();
  header(s, '6. ホーム画面', 'Home screen', 7, TOTAL);

  // Mock
  card(s, 0.6, 1.2, 3.0, 4.0);
  s.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 1.2, w: 3.0, h: 0.45, fill: { color: C.navy } });
  s.addText('マニュアル作成', { x: 0.75, y: 1.23, w: 2.5, h: 0.4, fontSize: 10, fontFace: 'Calibri', bold: true, color: C.card, margin: 0 });
  s.addShape(pres.shapes.RECTANGLE, { x: 1.65, y: 1.85, w: 0.7, h: 0.7, fill: { color: C.accent } });
  s.addText('M', { x: 1.65, y: 1.85, w: 0.7, h: 0.7, fontSize: 24, fontFace: 'Calibri', bold: true, color: C.card, align: 'center', valign: 'middle' });
  s.addText('マニュアル作成アプリ', { x: 0.8, y: 2.65, w: 2.6, h: 0.25, fontSize: 10, fontFace: 'Calibri', bold: true, color: C.navy, align: 'center', margin: 0 });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.9, y: 3.05, w: 2.2, h: 0.38, fill: { color: C.accent } });
  s.addText('＋ 新規作成', { x: 0.9, y: 3.05, w: 2.2, h: 0.38, fontSize: 10, fontFace: 'Calibri', bold: true, color: C.card, align: 'center', valign: 'middle' });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.9, y: 3.55, w: 2.2, h: 0.38, fill: { color: C.card }, line: { color: C.border, width: 1 } });
  s.addText('📂 ファイル読み込み', { x: 0.9, y: 3.55, w: 2.2, h: 0.38, fontSize: 10, fontFace: 'Calibri', bold: true, color: C.primary, align: 'center', valign: 'middle' });
  s.addText('最近のファイル', { x: 0.9, y: 4.1, w: 2.2, h: 0.2, fontSize: 8, fontFace: 'Calibri', bold: true, color: C.muted, margin: 0 });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.9, y: 4.35, w: 2.2, h: 0.3, fill: { color: C.bg }, line: { color: C.border, width: 0.5 } });
  s.addText('📄 客室清掃マニュアル', { x: 0.95, y: 4.35, w: 2.1, h: 0.3, fontSize: 7, fontFace: 'Calibri', color: C.body, valign: 'middle', margin: 0 });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.9, y: 4.7, w: 2.2, h: 0.3, fill: { color: C.bg }, line: { color: C.border, width: 0.5 } });
  s.addText('📄 衛生チェックリスト', { x: 0.95, y: 4.7, w: 2.1, h: 0.3, fontSize: 7, fontFace: 'Calibri', color: C.body, valign: 'middle', margin: 0 });

  // Description
  card(s, 4.1, 1.2, 5.4, 4.0, { leftBar: C.primary });
  s.addText('この画面でできること', { x: 4.4, y: 1.35, w: 4.8, h: 0.35, fontSize: 16, fontFace: 'Calibri', bold: true, color: C.navy, margin: 0 });
  s.addText([
    { text: '＋ 新規作成', options: { bold: true, breakLine: true, fontSize: 13 } },
    { text: '新しいマニュアルの作成を開始します。', options: { breakLine: true } },
    { text: '業種・テンプレート選択画面に進みます。', options: { breakLine: true } },
    { text: '', options: { breakLine: true } },
    { text: '📂 ファイル読み込み', options: { bold: true, breakLine: true, fontSize: 13 } },
    { text: '以前に保存したマニュアル一覧を表示します。', options: { breakLine: true } },
    { text: '', options: { breakLine: true } },
    { text: '📄 最近のファイル', options: { bold: true, breakLine: true, fontSize: 13 } },
    { text: '直近5件のマニュアルがすぐ開けます。', options: { breakLine: true } },
    { text: 'ワンタップで前回の続きから編集再開。', options: {} },
  ], { x: 4.4, y: 1.8, w: 4.8, h: 3.2, fontSize: 11, fontFace: 'Calibri', color: C.body, lineSpacingMultiple: 1.35 });

  // ============ SLIDE 8: Industry & Template ============
  s = pres.addSlide();
  header(s, '7. 業種・テンプレート選択', 'Industry & template selection', 8, TOTAL);

  // Industry section
  card(s, 0.6, 1.15, 4.3, 4.0, { leftBar: C.primary });
  s.addText('業種を選択（8業種）', { x: 0.85, y: 1.25, w: 4, h: 0.3, fontSize: 13, fontFace: 'Calibri', bold: true, color: C.navy, margin: 0 });

  const industries = [
    ['🍽', '飲食'], ['🏭', '製造'], ['🧹', '清掃'], ['🏥', '医療'],
    ['🏨', '宿泊'], ['🏗', '建設'], ['🛒', '小売'], ['📚', '教育'],
  ];
  industries.forEach((ind, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 0.95 + col * 1.85;
    const y = 1.7 + row * 0.8;
    s.addShape(pres.shapes.RECTANGLE, { x, y, w: 1.65, h: 0.65, fill: { color: C.card }, line: { color: C.border, width: 0.5 } });
    s.addText(ind[0], { x, y: y + 0.03, w: 1.65, h: 0.35, fontSize: 20, align: 'center' });
    s.addText(ind[1], { x, y: y + 0.38, w: 1.65, h: 0.23, fontSize: 10, fontFace: 'Calibri', bold: true, color: C.dark, align: 'center', margin: 0 });
  });

  // Template examples
  card(s, 5.1, 1.15, 4.3, 4.0, { leftBar: C.accent });
  s.addText('テンプレート例（13種類）', { x: 5.35, y: 1.25, w: 4, h: 0.3, fontSize: 13, fontFace: 'Calibri', bold: true, color: C.navy, margin: 0 });
  const templates = [
    ['飲食', '基本手順書 / 衛生チェック / レシピカード'],
    ['清掃', '清掃手順書 / 点検チェックリスト'],
    ['製造', '作業標準書 / 安全確認 / 品質検査'],
    ['医療', '処置手順書'],
    ['宿泊', '客室清掃マニュアル'],
    ['建設', '安全作業手順書'],
    ['小売', '接客マニュアル'],
    ['教育', '授業計画書'],
  ];
  templates.forEach((t, i) => {
    const ty = 1.7 + i * 0.4;
    s.addText(t[0], { x: 5.35, y: ty, w: 0.8, h: 0.35, fontSize: 10, fontFace: 'Calibri', bold: true, color: C.accent, valign: 'middle', margin: 0 });
    s.addText(t[1], { x: 6.15, y: ty, w: 3.1, h: 0.35, fontSize: 10, fontFace: 'Calibri', color: C.body, valign: 'middle', margin: 0 });
  });

  // ============ SLIDE 9: Editor Overview ============
  s = pres.addSlide();
  header(s, '8. マニュアル編集画面（全体像）', 'The main editor screen', 9, TOTAL);

  s.addText('このアプリの中心となる画面です', {
    x: 0.6, y: 1.1, w: 8.8, h: 0.3, fontSize: 13, fontFace: 'Calibri', italic: true, color: C.accent, margin: 0,
  });

  // Layout diagram
  const areas = [
    { label: 'タイトル入力 / 保存 / PDF出力', y: 1.55, h: 0.5, color: C.navy, textColor: C.card, name: '上部バー' },
    { label: '写真・文字・QR・手描きなどの操作ボタン', y: 2.1, h: 0.5, color: C.primary, textColor: C.card, name: 'ツールバー' },
    { label: 'マニュアルの編集エリア\n（紙のイメージで表示）', y: 2.65, h: 1.7, color: C.sky, textColor: C.dark, name: '中央' },
    { label: 'ページ一覧・ページ追加', y: 4.45, h: 0.5, color: C.bg, textColor: C.body, name: '下部' },
  ];
  areas.forEach(a => {
    s.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: a.y, w: 3.8, h: a.h, fill: { color: a.color }, line: { color: C.border, width: 0.5 } });
    s.addText(a.label, { x: 0.75, y: a.y + 0.05, w: 3.5, h: a.h - 0.1, fontSize: 10, fontFace: 'Calibri', color: a.textColor, valign: 'middle', margin: 0 });
  });

  // Description
  card(s, 4.9, 1.55, 4.6, 3.4, { leftBar: C.accent });
  s.addText('4つのエリアで構成', { x: 5.2, y: 1.65, w: 4.1, h: 0.3, fontSize: 14, fontFace: 'Calibri', bold: true, color: C.navy, margin: 0 });
  s.addText([
    { text: '❶ 上部バー', options: { bold: true, breakLine: true, fontSize: 12 } },
    { text: 'タイトル入力、保存、PDF出力', options: { breakLine: true } },
    { text: '', options: { breakLine: true } },
    { text: '❷ ツールバー', options: { bold: true, breakLine: true, fontSize: 12 } },
    { text: '12種類の操作ボタン（2行配置）', options: { breakLine: true } },
    { text: '', options: { breakLine: true } },
    { text: '❸ 編集エリア', options: { bold: true, breakLine: true, fontSize: 12 } },
    { text: '紙のイメージ。写真・文字を自由に配置', options: { breakLine: true } },
    { text: '', options: { breakLine: true } },
    { text: '❹ ページ一覧', options: { bold: true, breakLine: true, fontSize: 12 } },
    { text: 'ページ切替・追加・削除', options: {} },
  ], { x: 5.2, y: 2.0, w: 4.1, h: 2.95, fontSize: 10, fontFace: 'Calibri', color: C.body, lineSpacingMultiple: 1.3 });

  // ============ SLIDE 10: Toolbar Buttons ============
  s = pres.addSlide();
  header(s, '9. ツールバーの操作ボタン', '12 buttons / 2 rows', 10, TOTAL);

  // Row 1
  s.addText('Row 1: コンテンツを追加', { x: 0.6, y: 1.1, w: 5, h: 0.3, fontSize: 12, fontFace: 'Calibri', bold: true, color: C.navy, margin: 0 });
  const row1 = [
    { icon: '📷', title: '写真', desc: 'カメラ・フォルダから' },
    { icon: '📷+', title: '編集して追加', desc: '写真＋文字・図形を一度に' },
    { icon: '🖼✎', title: '画像を編集', desc: '既存の写真を再編集' },
    { icon: 'Aa', title: 'テキスト', desc: '文字入力' },
    { icon: '🎤', title: '音声入力', desc: '話した内容を文字化' },
    { icon: '🔳', title: 'QRコード', desc: 'URLを埋込' },
    { icon: '✏️', title: '手描き', desc: '指で描く' },
  ];
  row1.forEach((btn, i) => {
    const x = 0.6 + i * 1.25;
    card(s, x, 1.45, 1.2, 1.4, { topBar: C.primary });
    s.addText(btn.icon, { x, y: 1.55, w: 1.2, h: 0.4, fontSize: 20, fontFace: 'Calibri', bold: true, color: C.dark, align: 'center' });
    s.addText(btn.title, { x, y: 1.95, w: 1.2, h: 0.25, fontSize: 9, fontFace: 'Calibri', bold: true, color: C.dark, align: 'center', margin: 0 });
    s.addText(btn.desc, { x: x + 0.05, y: 2.2, w: 1.1, h: 0.6, fontSize: 8, fontFace: 'Calibri', color: C.muted, align: 'center', lineSpacingMultiple: 1.3 });
  });

  // Row 2
  s.addText('Row 2: 表示・操作', { x: 0.6, y: 3.1, w: 5, h: 0.3, fontSize: 12, fontFace: 'Calibri', bold: true, color: C.navy, margin: 0 });
  const row2 = [
    { icon: '🔍+', title: '拡大', desc: '表示倍率を上げる' },
    { icon: '🔍−', title: '縮小', desc: '表示倍率を下げる' },
    { icon: '↩', title: '元に戻す', desc: '操作をやり直し' },
    { icon: '↪', title: 'やり直す', desc: '戻した操作を再実行' },
    { icon: '🗑', title: '削除', desc: '選択中を消す' },
  ];
  row2.forEach((btn, i) => {
    const x = 0.6 + i * 1.75;
    card(s, x, 3.45, 1.7, 1.4, { topBar: C.accent });
    s.addText(btn.icon, { x, y: 3.55, w: 1.7, h: 0.4, fontSize: 20, align: 'center' });
    s.addText(btn.title, { x, y: 3.95, w: 1.7, h: 0.25, fontSize: 10, fontFace: 'Calibri', bold: true, color: C.dark, align: 'center', margin: 0 });
    s.addText(btn.desc, { x: x + 0.05, y: 4.2, w: 1.6, h: 0.6, fontSize: 9, fontFace: 'Calibri', color: C.muted, align: 'center' });
  });

  // ============ SLIDE 11: Photo Editor ============
  s = pres.addSlide();
  header(s, '10. 写真編集機能（Instagram風）', 'Photo annotation', 11, TOTAL);

  s.addText('写真に文字や図形を入れて、見やすいマニュアルに', {
    x: 0.6, y: 1.1, w: 8.8, h: 0.3, fontSize: 13, fontFace: 'Calibri', italic: true, color: C.accent, margin: 0,
  });

  // Left: operations
  card(s, 0.6, 1.55, 4.3, 3.5, { leftBar: C.primary });
  s.addText('追加できる要素', { x: 0.85, y: 1.65, w: 4, h: 0.3, fontSize: 13, fontFace: 'Calibri', bold: true, color: C.navy, margin: 0 });

  const elements = [
    ['Aa', 'テキスト（12〜48pt の6サイズ）'],
    ['➡', '矢印'],
    ['━', '線'],
    ['○', '丸'],
    ['▢', '四角'],
    ['△', '三角'],
    ['★', '星'],
    ['✓', 'チェックマーク'],
  ];
  elements.forEach((e, i) => {
    const y = 2.05 + i * 0.35;
    s.addShape(pres.shapes.OVAL, { x: 0.95, y, w: 0.3, h: 0.3, fill: { color: C.accent } });
    s.addText(e[0], { x: 0.95, y, w: 0.3, h: 0.3, fontSize: 12, fontFace: 'Calibri', bold: true, color: C.card, align: 'center', valign: 'middle' });
    s.addText(e[1], { x: 1.4, y, w: 3.3, h: 0.3, fontSize: 10, fontFace: 'Calibri', color: C.body, valign: 'middle', margin: 0 });
  });

  // Right: colors + tips
  card(s, 5.1, 1.55, 4.3, 1.6, { leftBar: C.success });
  s.addText('7色のカラーパレット', { x: 5.35, y: 1.65, w: 4, h: 0.3, fontSize: 13, fontFace: 'Calibri', bold: true, color: C.navy, margin: 0 });
  const colors = ['EF4444', 'F97316', 'FBBF24', '10B981', '0891B2', '1E2761', '1A1F36'];
  colors.forEach((c, i) => {
    s.addShape(pres.shapes.OVAL, { x: 5.4 + i * 0.5, y: 2.15, w: 0.4, h: 0.4, fill: { color: c } });
  });
  s.addText('文字・図形の色を自由に選択', {
    x: 5.35, y: 2.7, w: 4, h: 0.3, fontSize: 10, fontFace: 'Calibri', color: C.muted, margin: 0,
  });

  card(s, 5.1, 3.3, 4.3, 1.75, { leftBar: C.warning });
  s.addText('便利な機能', { x: 5.35, y: 3.4, w: 4, h: 0.3, fontSize: 13, fontFace: 'Calibri', bold: true, color: C.navy, margin: 0 });
  s.addText([
    { text: '写真追加時に編集できます', options: { bullet: true, breakLine: true } },
    { text: '既存の写真も選んで編集可能', options: { bullet: true, breakLine: true } },
    { text: '「✓ 完了」で1枚の画像に統合', options: { bullet: true, breakLine: true } },
    { text: 'キャンセルで元に戻せます', options: { bullet: true } },
  ], { x: 5.35, y: 3.75, w: 3.9, h: 1.25, fontSize: 10, fontFace: 'Calibri', color: C.body, lineSpacingMultiple: 1.3 });

  // ============ SLIDE 12: Voice & Drawing & QR ============
  s = pres.addSlide();
  header(s, '11. その他の便利機能', 'Voice / Drawing / QR', 12, TOTAL);

  const advFeatures = [
    {
      emoji: '🎤',
      title: '音声入力',
      steps: [
        '🎤 ボタンをタップ',
        'マイクボタンを押して話す',
        '自動で文字化される',
        '内容を確認して「追加」',
      ],
      tip: '日本語対応。文字入力が面倒な時に便利',
      color: 'EF4444',
    },
    {
      emoji: '✏️',
      title: '手描きモード',
      steps: [
        '✏️ ボタンをタップ',
        '色と太さを選ぶ',
        '指で自由に描く',
        '「✓ 終了」で通常モードへ',
      ],
      tip: '矢印や囲みなど、好きに書き込める',
      color: C.warning,
    },
    {
      emoji: '🔳',
      title: 'QRコード',
      steps: [
        '🔳 ボタンをタップ',
        'URL や テキストを入力',
        'サイズを選ぶ（小/中/大）',
        '「キャンバスに追加」',
      ],
      tip: '動画URL埋込・現場から即アクセス',
      color: C.primary,
    },
  ];
  advFeatures.forEach((f, i) => {
    const x = 0.6 + i * 3.1;
    card(s, x, 1.15, 2.8, 4.0, { topBar: f.color });
    s.addText(f.emoji, { x, y: 1.3, w: 2.8, h: 0.7, fontSize: 44, align: 'center' });
    s.addText(f.title, { x, y: 2.05, w: 2.8, h: 0.35, fontSize: 14, fontFace: 'Calibri', bold: true, color: C.navy, align: 'center', margin: 0 });

    // Steps
    f.steps.forEach((step, idx) => {
      const sy = 2.5 + idx * 0.35;
      s.addShape(pres.shapes.OVAL, { x: x + 0.15, y: sy, w: 0.28, h: 0.28, fill: { color: f.color } });
      s.addText(String(idx + 1), { x: x + 0.15, y: sy, w: 0.28, h: 0.28, fontSize: 10, fontFace: 'Calibri', bold: true, color: C.card, align: 'center', valign: 'middle' });
      s.addText(step, { x: x + 0.5, y: sy, w: 2.2, h: 0.28, fontSize: 9.5, fontFace: 'Calibri', color: C.body, valign: 'middle', margin: 0 });
    });

    // Tip
    s.addText('💡 ' + f.tip, {
      x: x + 0.15, y: 4.7, w: 2.5, h: 0.3,
      fontSize: 9, fontFace: 'Calibri', italic: true, color: C.muted, margin: 0,
    });
  });

  // ============ SLIDE 13: PDF & Files ============
  s = pres.addSlide();
  header(s, '12. PDF出力・ファイル管理', 'PDF output & files', 13, TOTAL);

  // PDF
  card(s, 0.6, 1.15, 4.3, 4.0, { topBar: C.primary });
  s.addText('📄  PDF出力', { x: 0.85, y: 1.25, w: 4, h: 0.35, fontSize: 15, fontFace: 'Calibri', bold: true, color: C.navy, margin: 0 });

  s.addText('用紙サイズを選択', { x: 0.85, y: 1.75, w: 4, h: 0.25, fontSize: 11, fontFace: 'Calibri', bold: true, color: C.body, margin: 0 });
  ['A4', 'A3', 'B4'].forEach((size, i) => {
    const sx = 0.85 + i * 1.1;
    const selected = i === 0;
    s.addShape(pres.shapes.RECTANGLE, { x: sx, y: 2.05, w: 1.0, h: 0.45, fill: { color: selected ? C.sky : C.card }, line: { color: selected ? C.accent : C.border, width: selected ? 1.5 : 0.5 } });
    s.addText(size, { x: sx, y: 2.05, w: 1.0, h: 0.45, fontSize: 13, fontFace: 'Calibri', bold: true, color: selected ? C.primary : C.muted, align: 'center', valign: 'middle' });
  });

  s.addText([
    { text: '全ページのプレビュー表示', options: { bullet: true, breakLine: true } },
    { text: 'ダウンロードして保存', options: { bullet: true, breakLine: true } },
    { text: 'または直接印刷（AirPrint等）', options: { bullet: true, breakLine: true } },
    { text: 'メール添付で共有も可能', options: { bullet: true } },
  ], { x: 0.85, y: 2.75, w: 3.9, h: 2.2, fontSize: 11, fontFace: 'Calibri', color: C.body, lineSpacingMultiple: 1.5 });

  // Files
  card(s, 5.1, 1.15, 4.3, 4.0, { topBar: C.accent });
  s.addText('📁  ファイル管理', { x: 5.35, y: 1.25, w: 4, h: 0.35, fontSize: 15, fontFace: 'Calibri', bold: true, color: C.navy, margin: 0 });
  s.addText([
    { text: '保存済み一覧', options: { bold: true, breakLine: true, fontSize: 12 } },
    { text: 'サムネイル付きで見やすい', options: { breakLine: true } },
    { text: '', options: { breakLine: true } },
    { text: '検索・並び替え', options: { bold: true, breakLine: true, fontSize: 12 } },
    { text: 'タイトル検索／更新日順・作成日順・タイトル順', options: { breakLine: true } },
    { text: '', options: { breakLine: true } },
    { text: '操作メニュー（⋯ボタン）', options: { bold: true, breakLine: true, fontSize: 12 } },
    { text: '📋 複製 / 📤 エクスポート / 🗑 削除', options: { breakLine: true } },
    { text: '', options: { breakLine: true } },
    { text: '📥 インポート機能', options: { bold: true, breakLine: true, fontSize: 12 } },
    { text: '他端末のファイルを取り込める', options: {} },
  ], { x: 5.35, y: 1.7, w: 3.9, h: 3.3, fontSize: 10.5, fontFace: 'Calibri', color: C.body, lineSpacingMultiple: 1.35 });

  // ============ SLIDE 14: How to use - Step by step ============
  s = pres.addSlide();
  header(s, '13. 基本的な使い方（新規作成）', 'Step-by-step guide', 14, TOTAL);

  const steps = [
    { num: '1', title: 'ホーム画面で「新規作成」', desc: 'アプリを開き、中央の「新規作成」ボタンをタップ' },
    { num: '2', title: '業種を選ぶ', desc: '8業種の中から、お客様の業種をタップ' },
    { num: '3', title: 'テンプレートを選ぶ', desc: '業種に合ったテンプレートの中から1つ選択' },
    { num: '4', title: 'タイトルを入力', desc: '画面上部のタイトル欄にマニュアル名を入力' },
    { num: '5', title: '写真・文字を追加', desc: 'ツールバーから📷 写真追加やAa テキストを使い、マニュアル本体を作成' },
    { num: '6', title: '保存ボタンをタップ', desc: '編集内容を端末に保存。以降はいつでも編集再開可能' },
    { num: '7', title: 'PDFで出力（必要に応じて）', desc: '右上のPDFボタンから用紙サイズを選択してダウンロード・印刷' },
  ];
  steps.forEach((step, i) => {
    const y = 1.15 + i * 0.56;
    // Number badge
    s.addShape(pres.shapes.OVAL, { x: 0.6, y: y + 0.05, w: 0.45, h: 0.45, fill: { color: C.primary } });
    s.addText(step.num, { x: 0.6, y: y + 0.05, w: 0.45, h: 0.45, fontSize: 16, fontFace: 'Calibri', bold: true, color: C.card, align: 'center', valign: 'middle' });
    // Card
    s.addShape(pres.shapes.RECTANGLE, { x: 1.2, y, w: 8.2, h: 0.52, fill: { color: C.card }, line: { color: C.border, width: 0.5 } });
    s.addText(step.title, { x: 1.35, y: y + 0.05, w: 3.2, h: 0.25, fontSize: 11, fontFace: 'Calibri', bold: true, color: C.dark, margin: 0 });
    s.addText(step.desc, { x: 1.35, y: y + 0.28, w: 7.9, h: 0.22, fontSize: 9.5, fontFace: 'Calibri', color: C.muted, margin: 0 });
  });

  // ============ SLIDE 15: Usage Scenarios ============
  s = pres.addSlide();
  header(s, '14. 活用シーン', 'Real-world scenarios', 15, TOTAL);

  const scenarios = [
    {
      emoji: '👷‍♂️',
      title: '現場で作業手順を記録',
      desc: '作業者が現場でスマホを使い、各工程を撮影しながらマニュアル化',
      benefit: '手元に写真素材がなくてもすぐ作成',
      color: C.primary,
    },
    {
      emoji: '🎓',
      title: '新人教育資料の作成',
      desc: 'ベテランの作業を撮影 → 重要ポイントに矢印・文字を追加',
      benefit: 'PDFで全新人に均一な教育',
      color: C.accent,
    },
    {
      emoji: '✅',
      title: 'チェックリストの運用',
      desc: '衛生・安全確認用のチェックリストテンプレートを活用',
      benefit: '最初からチェック欄付き',
      color: C.success,
    },
    {
      emoji: '📑',
      title: '紙マニュアルのデジタル化',
      desc: '既存の紙マニュアルを撮影 → アプリで補足 → PDFで共有',
      benefit: '保管場所を取らず検索可能',
      color: C.warning,
    },
  ];
  scenarios.forEach((sc, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 0.6 + col * 4.4;
    const y = 1.15 + row * 2.05;
    card(s, x, y, 4.2, 1.85, { topBar: sc.color });
    s.addText(sc.emoji, { x: x + 0.15, y: y + 0.2, w: 0.8, h: 0.8, fontSize: 38, align: 'center' });
    s.addText(sc.title, { x: x + 1.0, y: y + 0.15, w: 3.0, h: 0.35, fontSize: 13, fontFace: 'Calibri', bold: true, color: C.navy, margin: 0 });
    s.addText(sc.desc, { x: x + 1.0, y: y + 0.55, w: 3.0, h: 0.8, fontSize: 10, fontFace: 'Calibri', color: C.body, lineSpacingMultiple: 1.35, margin: 0 });
    s.addText('→ ' + sc.benefit, { x: x + 0.15, y: y + 1.45, w: 3.9, h: 0.3, fontSize: 10, fontFace: 'Calibri', italic: true, bold: true, color: sc.color, margin: 0 });
  });

  // ============ SLIDE 16: Closing / Contact ============
  s = pres.addSlide();
  s.background = { color: C.navy };
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 5.625, fill: { color: C.navy } });

  s.addText('ご検討のほどよろしくお願いいたします', {
    x: 0.6, y: 1.5, w: 8.8, h: 0.6, fontSize: 28, fontFace: 'Calibri', bold: true, color: C.card, align: 'center', margin: 0,
  });
  s.addShape(pres.shapes.LINE, { x: 3.5, y: 2.3, w: 3, h: 0, line: { color: C.accent, width: 2 } });

  s.addText('お問い合わせ・導入に関するご相談', {
    x: 0.6, y: 2.6, w: 8.8, h: 0.4, fontSize: 14, fontFace: 'Calibri', color: 'CADCFC', align: 'center', margin: 0,
  });

  // Info cards
  const infos = [
    { icon: '🌐', label: '公開URL', value: 'iuy58754932-jpg.github.io/manual-app-demo' },
    { icon: '📱', label: '対応デバイス', value: 'iPhone / Android / PC' },
    { icon: '🌐', label: '対応ブラウザ', value: 'Safari / Chrome / Edge' },
  ];
  infos.forEach((info, i) => {
    const y = 3.4 + i * 0.55;
    s.addShape(pres.shapes.RECTANGLE, { x: 1.5, y, w: 7, h: 0.45, fill: { color: C.primary } });
    s.addText(info.icon, { x: 1.65, y, w: 0.5, h: 0.45, fontSize: 18, align: 'center', valign: 'middle' });
    s.addText(info.label, { x: 2.2, y, w: 1.8, h: 0.45, fontSize: 11, fontFace: 'Calibri', bold: true, color: 'CADCFC', valign: 'middle', margin: 0 });
    s.addText(info.value, { x: 4.0, y, w: 4.3, h: 0.45, fontSize: 11, fontFace: 'Calibri', color: C.card, valign: 'middle', margin: 0 });
  });

  s.addText('本資料は v1.6 時点のものです。機能はアップデートで拡張されます。', {
    x: 0.6, y: 5.15, w: 8.8, h: 0.3, fontSize: 10, fontFace: 'Calibri', italic: true, color: C.muted, align: 'center', margin: 0,
  });

  // ── Save ──
  const outPath = 'C:/Users/81805/JavaPractice/ClaudeCodePractice/manual_app_pwa/manual_app_client_guide_v1.6.pptx';
  await pres.writeFile({ fileName: outPath });
  console.log('Created: ' + outPath);
}

main().catch(console.error);
