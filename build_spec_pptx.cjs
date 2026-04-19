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

function buildTable(slide, x, y, headers, rows, colWidths) {
  const rowH = 0.35;
  const totalW = colWidths.reduce((a, b) => a + b, 0);
  // Header
  let curX = x;
  slide.addShape(pres.shapes.RECTANGLE, { x, y, w: totalW, h: rowH, fill: { color: C.navy } });
  headers.forEach((h, i) => {
    slide.addText(h, {
      x: curX + 0.08, y, w: colWidths[i] - 0.16, h: rowH,
      fontSize: 10, fontFace: 'Calibri', bold: true, color: C.card, valign: 'middle', margin: 0,
    });
    curX += colWidths[i];
  });
  // Rows
  rows.forEach((row, ri) => {
    const ry = y + rowH + ri * rowH;
    const fill = ri % 2 === 0 ? C.card : '#F8FAFC';
    slide.addShape(pres.shapes.RECTANGLE, { x, y: ry, w: totalW, h: rowH, fill: { color: fill.replace('#', '') }, line: { color: C.border, width: 0.5 } });
    curX = x;
    row.forEach((cell, ci) => {
      slide.addText(String(cell), {
        x: curX + 0.08, y: ry, w: colWidths[ci] - 0.16, h: rowH,
        fontSize: 9, fontFace: 'Calibri', color: C.body, valign: 'middle', margin: 0,
      });
      curX += colWidths[ci];
    });
  });
}

async function main() {
  pres = new pptxgen();
  pres.layout = 'LAYOUT_16x9';
  pres.author = '開発チーム';
  pres.title = 'マニュアル作成アプリ 技術仕様書 v1.6';

  const TOTAL = 14;

  // ============ SLIDE 1: Cover ============
  let s = pres.addSlide();
  s.background = { color: C.navy };
  s.addShape(pres.shapes.RECTANGLE, { x: 6.2, y: 0, w: 3.8, h: 5.625, fill: { color: C.primary } });
  s.addShape(pres.shapes.RECTANGLE, { x: 7.35, y: 1.5, w: 1.3, h: 1.3, fill: { color: C.accent }, shadow: mkShadow() });
  s.addText('M', { x: 7.35, y: 1.5, w: 1.3, h: 1.3, fontSize: 48, fontFace: 'Calibri', bold: true, color: C.card, align: 'center', valign: 'middle' });
  s.addText('マニュアル作成アプリ', { x: 0.7, y: 1.3, w: 5.5, h: 0.7, fontSize: 32, fontFace: 'Calibri', bold: true, color: C.card, margin: 0 });
  s.addText('技術仕様書', { x: 0.7, y: 2.0, w: 5.5, h: 0.5, fontSize: 22, fontFace: 'Calibri', color: C.accent, margin: 0 });
  s.addShape(pres.shapes.LINE, { x: 0.7, y: 2.75, w: 2.5, h: 0, line: { color: C.accent, width: 3 } });
  s.addText('Version 1.6', { x: 0.7, y: 3.0, w: 5.5, h: 0.4, fontSize: 20, fontFace: 'Calibri', bold: true, color: 'CADCFC', margin: 0 });
  s.addText('2026-04-18 / 社内技術資料', { x: 0.7, y: 3.5, w: 5.5, h: 0.3, fontSize: 13, fontFace: 'Calibri', color: C.muted, margin: 0 });
  s.addText('対象読者: 社内エンジニア・運用担当者', { x: 0.7, y: 4.8, w: 5.5, h: 0.3, fontSize: 12, fontFace: 'Calibri', italic: true, color: 'CADCFC', margin: 0 });

  // ============ SLIDE 2: System Overview ============
  s = pres.addSlide();
  header(s, '1. システム概要', 'What is this app?', 2, TOTAL);

  s.addText('業務マニュアルをモバイル端末で作成・編集・共有する PWA', {
    x: 0.6, y: 1.1, w: 8.8, h: 0.4, fontSize: 14, fontFace: 'Calibri', italic: true, color: C.accent, margin: 0,
  });

  // 3 key points
  const keys = [
    { emoji: '🖥', title: 'サーバーレス', desc: 'フロントエンドのみで完結\nランニングコスト 0円', color: C.primary },
    { emoji: '📱', title: 'モバイルファースト', desc: 'iOS Safari 最優先\nmax-width 480px', color: C.accent },
    { emoji: '📂', title: '端末ローカル保存', desc: 'IndexedDB に全データ\nオフライン動作可', color: C.success },
  ];
  keys.forEach((k, i) => {
    const x = 0.6 + i * 3.1;
    card(s, x, 1.6, 2.8, 1.7, { topBar: k.color });
    s.addText(k.emoji, { x, y: 1.75, w: 2.8, h: 0.5, fontSize: 28, align: 'center' });
    s.addText(k.title, { x, y: 2.25, w: 2.8, h: 0.3, fontSize: 13, fontFace: 'Calibri', bold: true, color: C.dark, align: 'center', margin: 0 });
    s.addText(k.desc, { x: x + 0.1, y: 2.6, w: 2.6, h: 0.7, fontSize: 10, fontFace: 'Calibri', color: C.body, align: 'center', lineSpacingMultiple: 1.3 });
  });

  // Basic info table
  buildTable(s, 0.6, 3.6,
    ['項目', '内容'],
    [
      ['アプリ名', 'マニュアル作成アプリ'],
      ['バージョン', 'v1.6（2026-04-18）'],
      ['公開URL', 'https://iuy58754932-jpg.github.io/manual-app-demo/'],
      ['対象デバイス', 'iPhone（最優先）/ Android / PC'],
      ['対象業種', '飲食・製造・清掃・医療・宿泊・建設・小売・教育（8業種）'],
    ],
    [2.0, 6.8]
  );

  // ============ SLIDE 3: Architecture ============
  s = pres.addSlide();
  header(s, '2. アーキテクチャ概要', 'Layered design - client-side only', 3, TOTAL);

  // Layer diagram
  const layers = [
    { label: 'UI層', tech: 'React + Tailwind CSS', color: C.primary, y: 1.2 },
    { label: '状態管理', tech: 'React Hooks (useState / useCallback)', color: '0891B2', y: 1.75 },
    { label: 'ドメインロジック', tech: 'カスタムフック (useCanvas / useDatabase / useHistory / useSpeechRecognition)', color: '10B981', y: 2.30 },
    { label: 'ルーティング', tech: 'react-router-dom (HashRouter)', color: 'A78BFA', y: 2.85 },
    { label: 'キャンバス描画', tech: 'Fabric.js v5', color: 'F59E0B', y: 3.40 },
    { label: '永続化', tech: 'IndexedDB ← Dexie.js', color: 'EF4444', y: 3.95 },
    { label: '外部入出力', tech: 'File API / Canvas API / Web Speech API / Service Worker', color: C.muted, y: 4.50 },
  ];
  layers.forEach((l) => {
    s.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: l.y, w: 2.4, h: 0.45, fill: { color: l.color } });
    s.addText(l.label, { x: 0.6, y: l.y, w: 2.4, h: 0.45, fontSize: 12, fontFace: 'Calibri', bold: true, color: C.card, align: 'center', valign: 'middle' });
    s.addShape(pres.shapes.RECTANGLE, { x: 3.0, y: l.y, w: 6.4, h: 0.45, fill: { color: C.card }, line: { color: C.border, width: 0.5 } });
    s.addText(l.tech, { x: 3.15, y: l.y, w: 6.2, h: 0.45, fontSize: 11, fontFace: 'Calibri', color: C.body, valign: 'middle', margin: 0 });
  });

  // Cost note
  card(s, 0.6, 5.1, 8.8, 0.4, { leftBar: C.success });
  s.addText('💰  月額コスト: 0円（GitHub Pages 無料枠 / API 利用は従量制のみ）', {
    x: 0.85, y: 5.1, w: 8.5, h: 0.4, fontSize: 11, fontFace: 'Calibri', bold: true, color: C.dark, valign: 'middle', margin: 0,
  });

  // ============ SLIDE 4: Tech Stack - Core ============
  s = pres.addSlide();
  header(s, '3. 技術スタック (1/2) - コア技術', 'Foundation', 4, TOTAL);

  buildTable(s, 0.6, 1.2,
    ['項目', '採用技術', 'バージョン'],
    [
      ['UIフレームワーク', 'React', '18.3'],
      ['言語', 'TypeScript', '5.5'],
      ['ビルドツール', 'Vite', '5.4'],
      ['ルーティング', 'react-router-dom (HashRouter)', '7.1'],
      ['CSS', 'Tailwind CSS + PostCSS', '3.4'],
    ],
    [2.4, 4.8, 1.6]
  );

  s.addText('機能別ライブラリ', { x: 0.6, y: 3.5, w: 5, h: 0.3, fontSize: 14, fontFace: 'Calibri', bold: true, color: C.navy, margin: 0 });
  buildTable(s, 0.6, 3.9,
    ['機能', 'ライブラリ', '備考'],
    [
      ['キャンバス編集', 'Fabric.js v5', '写真・テキスト・手描き全て担当'],
      ['PDF生成', 'jsPDF', '画像として埋め込み（日本語対応）'],
      ['QRコード生成', 'qrcode', 'PNG dataURL'],
      ['IndexedDB', 'Dexie.js', '高レベルラッパー'],
    ],
    [2.0, 2.4, 4.4]
  );

  // ============ SLIDE 5: Tech Stack - Web APIs ============
  s = pres.addSlide();
  header(s, '3. 技術スタック (2/2) - Web API・開発ツール', 'Built-in browser APIs', 5, TOTAL);

  // Web APIs grid
  s.addText('使用している Web 標準 API', { x: 0.6, y: 1.1, w: 5, h: 0.3, fontSize: 14, fontFace: 'Calibri', bold: true, color: C.navy, margin: 0 });
  const apis = [
    { name: 'Web Speech API', desc: '音声認識（ja-JP）', color: C.primary },
    { name: 'File API / FileReader', desc: 'ファイル入出力・base64変換', color: C.accent },
    { name: 'Canvas API', desc: '画像リサイズ（最大1200px）', color: '10B981' },
    { name: 'Service Worker', desc: 'PWAキャッシュ', color: 'F59E0B' },
    { name: 'Blob / createObjectURL', desc: 'JSONダウンロード', color: 'A78BFA' },
    { name: 'IndexedDB', desc: '永続化ストレージ', color: 'EF4444' },
    { name: 'MediaDevices', desc: 'カメラ・マイク', color: '0891B2' },
    { name: 'Intersection Observer 等', desc: '標準UI動作', color: C.muted },
  ];
  apis.forEach((a, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 0.6 + col * 4.4;
    const y = 1.5 + row * 0.55;
    s.addShape(pres.shapes.RECTANGLE, { x, y, w: 4.2, h: 0.45, fill: { color: C.card }, shadow: mkCardShadow() });
    s.addShape(pres.shapes.RECTANGLE, { x, y, w: 0.08, h: 0.45, fill: { color: a.color } });
    s.addText(a.name, { x: x + 0.2, y, w: 2.0, h: 0.45, fontSize: 10, fontFace: 'Calibri', bold: true, color: C.dark, valign: 'middle', margin: 0 });
    s.addText(a.desc, { x: x + 2.2, y, w: 1.9, h: 0.45, fontSize: 9, fontFace: 'Calibri', color: C.muted, valign: 'middle', margin: 0 });
  });

  // Dev tools
  s.addText('開発ツール', { x: 0.6, y: 4.3, w: 5, h: 0.3, fontSize: 14, fontFace: 'Calibri', bold: true, color: C.navy, margin: 0 });
  card(s, 0.6, 4.7, 8.8, 0.7, { leftBar: C.primary });
  s.addText([
    { text: 'ESLint', options: { bold: true } },
    { text: '（静的解析）　|　', options: {} },
    { text: 'PostCSS + Autoprefixer', options: { bold: true } },
    { text: '（ベンダープレフィックス）　|　', options: {} },
    { text: '@types/fabric, @types/qrcode', options: { bold: true } },
    { text: '（型定義）', options: {} },
  ], { x: 0.85, y: 4.72, w: 8.4, h: 0.65, fontSize: 10, fontFace: 'Calibri', color: C.body, valign: 'middle', lineSpacingMultiple: 1.3 });

  // ============ SLIDE 6: Directory Structure ============
  s = pres.addSlide();
  header(s, '4. ディレクトリ構成', 'Source file layout', 6, TOTAL);

  const dirLines = [
    'src/',
    '├── components/',
    '│   ├── common/       Layout, Modal, Toast, ErrorBoundary',
    '│   └── editor/       Canvas, Toolbar, PhotoEditorModal,',
    '│                     QrCodeModal, VoiceInputModal,',
    '│                     DrawingControls, PageNavigator, ObjectMenu',
    '├── pages/            HomePage, IndustryPage, TemplatePage,',
    '│                     EditorPage, FilesPage',
    '├── hooks/            useCanvas, useHistory, useDatabase,',
    '│                     useSpeechRecognition',
    '├── lib/              db, pdf, imageUtils, qrcode, manualIO',
    '├── data/             industries, templates',
    '├── App.tsx',
    '├── main.tsx',
    '└── index.css',
    '',
    'public/',
    '├── icon-192x192.png / icon-512x512.png',
    '├── manifest.json',
    '└── sw.js',
  ];
  s.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 1.15, w: 8.8, h: 4.1, fill: { color: '1A1F36' } });
  s.addText(dirLines.join('\n'), {
    x: 0.85, y: 1.25, w: 8.5, h: 3.95,
    fontSize: 11, fontFace: 'Consolas', color: 'E8F4FD', valign: 'top',
    lineSpacingMultiple: 1.2,
  });

  // ============ SLIDE 7: Screens ============
  s = pres.addSlide();
  header(s, '5. 画面一覧', '6 main screens + modals', 7, TOTAL);

  buildTable(s, 0.6, 1.2,
    ['#', '画面名', 'パス', '役割'],
    [
      ['①', 'ホーム', '/', 'エントリポイント / 新規作成・ファイル読込'],
      ['②', '業種選択', '/industry', '8業種のグリッド表示'],
      ['③', 'テンプレート選択', '/template/:industryId', '業種別テンプレート一覧'],
      ['④', 'マニュアル編集', '/editor?template= / /editor/:id', 'アプリの中心（Fabric.jsキャンバス）'],
      ['⑤', 'PDF出力', '編集画面モーダル', 'A4/A3/B4 ダウンロード・印刷'],
      ['⑥', 'ファイル一覧', '/files', '検索・ソート・複製・エクスポート'],
    ],
    [0.5, 1.7, 2.4, 4.2]
  );

  // Modal list
  s.addText('主要モーダル（④編集画面内）', { x: 0.6, y: 4.0, w: 5, h: 0.3, fontSize: 14, fontFace: 'Calibri', bold: true, color: C.navy, margin: 0 });
  const modals = [
    ['PhotoEditorModal', '写真にテキスト・図形を追加（v1.1〜）'],
    ['QrCodeModal', 'QRコードを生成してキャンバスに追加（v1.5）'],
    ['VoiceInputModal', '音声からテキストを作成（v1.6）'],
    ['Modal (PDF)', 'PDF出力設定（v1.0〜）'],
  ];
  modals.forEach((m, i) => {
    const y = 4.4 + i * 0.25;
    s.addText(`• `, { x: 0.7, y, w: 0.2, h: 0.22, fontSize: 11, color: C.accent, margin: 0 });
    s.addText(m[0], { x: 0.9, y, w: 2.6, h: 0.22, fontSize: 10, fontFace: 'Consolas', bold: true, color: C.dark, margin: 0 });
    s.addText(m[1], { x: 3.5, y, w: 5.9, h: 0.22, fontSize: 10, fontFace: 'Calibri', color: C.body, margin: 0 });
  });

  // ============ SLIDE 8: Core Implementation ============
  s = pres.addSlide();
  header(s, '6. 主要機能の実装方式', 'Core implementation', 8, TOTAL);

  const implementations = [
    {
      title: '6.1 マニュアル編集',
      emoji: '✏️',
      items: [
        'Fabric.js Canvas を useCanvas フックで管理',
        '595×842px（A4比）固定 + コンテナ幅に動的スケール',
        'ページごとに toJSON() 結果を文字列保存',
        'v5 textbox styles バグ対策: safeToJSON / patchStyles',
      ],
      color: C.primary,
    },
    {
      title: '6.2 PDF出力',
      emoji: '📄',
      items: [
        '各ページを StaticCanvas 再構築 → JPEG化（quality 0.92）',
        'jsPDF で A4/A3/B4 サイズの PDF 作成',
        'ページごとに addImage で画像として埋込',
        '日本語非対応のため画像化方式を採用',
      ],
      color: C.accent,
    },
    {
      title: '6.3 IndexedDB',
      emoji: '💾',
      items: [
        'DB名: ManualAppDB, テーブル: manuals',
        'インデックス: id, title, industry, updatedAt',
        'pages は JSON.stringify で文字列保存',
        'useDatabase フック経由で CRUD',
      ],
      color: C.success,
    },
    {
      title: '6.4 Undo/Redo',
      emoji: '↩',
      items: [
        'useHistory で undoStack/redoStack を管理',
        'Fabric イベント（modified/added/removed）で push',
        '最大30ステップ（メモリ節約）',
        'canvas JSON 全体をスナップショット',
      ],
      color: 'F59E0B',
    },
  ];
  implementations.forEach((imp, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 0.6 + col * 4.4;
    const y = 1.2 + row * 2.0;
    card(s, x, y, 4.2, 1.85, { topBar: imp.color });
    s.addText(imp.emoji, { x, y: y + 0.15, w: 0.5, h: 0.4, fontSize: 20, align: 'center' });
    s.addText(imp.title, { x: x + 0.5, y: y + 0.1, w: 3.6, h: 0.35, fontSize: 13, fontFace: 'Calibri', bold: true, color: C.navy, margin: 0 });
    s.addText(imp.items.map((it, idx) => ({ text: it, options: { breakLine: idx < imp.items.length - 1 } })), {
      x: x + 0.15, y: y + 0.55, w: 3.95, h: 1.2,
      fontSize: 9, fontFace: 'Calibri', color: C.body, lineSpacingMultiple: 1.3, margin: 0,
    });
  });

  // ============ SLIDE 9: Additional Features ============
  s = pres.addSlide();
  header(s, '7. 追加機能の実装', 'Features added in v1.1〜v1.6', 9, TOTAL);

  const features = [
    { ver: 'v1.1-1.2', emoji: '🖼', title: 'フォトエディタ', desc: 'Instagram風。写真に文字・図形。出力は元画像解像度に合わせる', color: C.primary },
    { ver: 'v1.5', emoji: '✏️', title: '手描きモード', desc: 'Fabric.js isDrawingMode。色8・太さ5段階', color: C.accent },
    { ver: 'v1.5', emoji: '🔳', title: 'QRコード生成', desc: 'qrcode で PNG 生成、サイズ3種、リアルタイム PV', color: C.success },
    { ver: 'v1.5', emoji: '📤', title: 'JSON I/O', desc: 'Blob ダウンロード・FileReader インポート・ver互換', color: 'F59E0B' },
    { ver: 'v1.5', emoji: '📋', title: '複製 UX', desc: '長押し→⋯ボタン。3択メニュー（複製/エクスポート/削除）', color: 'A78BFA' },
    { ver: 'v1.6', emoji: '🎤', title: '音声入力', desc: 'Web Speech API（ja-JP）中間結果対応・未対応ブラウザフォールバック', color: 'EF4444' },
  ];
  features.forEach((f, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = 0.6 + col * 2.95;
    const y = 1.15 + row * 2.0;
    card(s, x, y, 2.8, 1.85, { topBar: f.color });
    s.addText(f.ver, {
      x: x + 0.15, y: y + 0.12, w: 1.2, h: 0.25,
      fontSize: 9, fontFace: 'Calibri', bold: true, color: f.color, margin: 0,
    });
    s.addText(f.emoji, { x: x + 1.5, y: y + 0.1, w: 1.2, h: 0.4, fontSize: 20, align: 'right' });
    s.addText(f.title, { x: x + 0.15, y: y + 0.45, w: 2.5, h: 0.35, fontSize: 13, fontFace: 'Calibri', bold: true, color: C.navy, margin: 0 });
    s.addText(f.desc, { x: x + 0.15, y: y + 0.85, w: 2.5, h: 0.95, fontSize: 9.5, fontFace: 'Calibri', color: C.body, lineSpacingMultiple: 1.35 });
  });

  // ============ SLIDE 10: Data Model ============
  s = pres.addSlide();
  header(s, '8. データモデル', 'TypeScript interfaces', 10, TOTAL);

  // Two columns of code
  const leftCode = [
    'interface Manual {',
    '  id: string              // UUID',
    '  title: string',
    '  industry: string',
    '  templateId: string',
    '  pages: ManualPage[]',
    '  createdAt: Date',
    '  updatedAt: Date',
    '  thumbnailDataUrl: string',
    '}',
    '',
    'interface ManualPage {',
    '  id: string',
    '  pageNumber: number      // 1-based',
    '  canvasJson: string      // Fabric JSON',
    '  thumbnailDataUrl: string',
    '}',
  ];
  const rightCode = [
    '// IndexedDB schema',
    'interface ManualRecord {',
    '  id: string',
    '  title: string',
    '  industry: string',
    '  templateId: string',
    '  pages: string',
    '  thumbnailDataUrl: string',
    '  createdAt: Date',
    '  updatedAt: Date',
    '}',
    '',
    '// JSON export format',
    'interface ManualFile {',
    '  fileVersion: 1',
    '  exportedAt: string',
    '  manual: { ... }',
    '}',
  ];
  s.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 1.15, w: 4.3, h: 4.0, fill: { color: '1A1F36' } });
  s.addText(leftCode.join('\n'), {
    x: 0.8, y: 1.3, w: 4.0, h: 3.7,
    fontSize: 11, fontFace: 'Consolas', color: 'E8F4FD', valign: 'top', lineSpacingMultiple: 1.2,
  });
  s.addShape(pres.shapes.RECTANGLE, { x: 5.1, y: 1.15, w: 4.3, h: 4.0, fill: { color: '1A1F36' } });
  s.addText(rightCode.join('\n'), {
    x: 5.3, y: 1.3, w: 4.0, h: 3.7,
    fontSize: 11, fontFace: 'Consolas', color: 'E8F4FD', valign: 'top', lineSpacingMultiple: 1.2,
  });

  // ============ SLIDE 11: PWA ============
  s = pres.addSlide();
  header(s, '9. PWA仕様', 'Progressive Web App', 11, TOTAL);

  // Manifest
  card(s, 0.6, 1.2, 4.3, 2.2, { leftBar: C.primary });
  s.addText('📄  Web App Manifest', {
    x: 0.85, y: 1.3, w: 4, h: 0.3, fontSize: 13, fontFace: 'Calibri', bold: true, color: C.navy, margin: 0,
  });
  s.addText([
    { text: 'name: マニュアル作成アプリ', options: { breakLine: true } },
    { text: 'short_name: マニュアル', options: { breakLine: true } },
    { text: 'display: standalone', options: { breakLine: true } },
    { text: 'background_color: #1E2761', options: { breakLine: true } },
    { text: 'theme_color: #065A82', options: { breakLine: true } },
    { text: 'orientation: portrait', options: { breakLine: true } },
    { text: 'icons: 192×192 / 512×512 (maskable)', options: {} },
  ], { x: 0.85, y: 1.7, w: 3.9, h: 1.6, fontSize: 10, fontFace: 'Consolas', color: C.body, lineSpacingMultiple: 1.35 });

  // Service Worker
  card(s, 5.1, 1.2, 4.3, 2.2, { leftBar: C.accent });
  s.addText('⚙️  Service Worker', {
    x: 5.35, y: 1.3, w: 4, h: 0.3, fontSize: 13, fontFace: 'Calibri', bold: true, color: C.navy, margin: 0,
  });
  s.addText([
    { text: 'install: 初期ファイルをプリキャッシュ', options: { bullet: true, breakLine: true } },
    { text: 'fetch: cache-first + network fallback', options: { bullet: true, breakLine: true } },
    { text: 'activate: 古いキャッシュを削除', options: { bullet: true, breakLine: true } },
    { text: '', options: { breakLine: true } },
    { text: 'オフラインでの閲覧・編集が可能', options: { italic: true, color: C.accent } },
  ], { x: 5.35, y: 1.7, w: 3.9, h: 1.6, fontSize: 10, fontFace: 'Calibri', color: C.body, lineSpacingMultiple: 1.4 });

  // iOS
  card(s, 0.6, 3.6, 8.8, 1.6, { leftBar: C.warning });
  s.addText('📱  iOS 対応', {
    x: 0.85, y: 3.7, w: 4, h: 0.3, fontSize: 13, fontFace: 'Calibri', bold: true, color: C.navy, margin: 0,
  });
  s.addText([
    { text: 'apple-mobile-web-app-capable', options: { bullet: true, breakLine: true } },
    { text: 'apple-touch-icon（ホーム画面追加時のアイコン）', options: { bullet: true, breakLine: true } },
    { text: 'safe-area-inset-top/bottom で iPhone ノッチ対応', options: { bullet: true, breakLine: true } },
    { text: 'viewport: maximum-scale=1.0, user-scalable=no', options: { bullet: true } },
  ], { x: 0.85, y: 4.1, w: 8.4, h: 1.05, fontSize: 10, fontFace: 'Calibri', color: C.body, lineSpacingMultiple: 1.3 });

  // ============ SLIDE 12: Build / Deploy ============
  s = pres.addSlide();
  header(s, '10. ビルド・デプロイ', 'Deployment pipeline', 12, TOTAL);

  // Commands
  card(s, 0.6, 1.15, 4.3, 2.0, { topBar: C.primary });
  s.addText('🛠  開発・ビルド', {
    x: 0.85, y: 1.25, w: 4, h: 0.3, fontSize: 13, fontFace: 'Calibri', bold: true, color: C.navy, margin: 0,
  });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.85, y: 1.65, w: 3.85, h: 1.4, fill: { color: '1A1F36' } });
  s.addText([
    { text: '# ローカル開発', options: { color: '64D8FF', breakLine: true } },
    { text: 'npm install', options: { color: 'E8F4FD', breakLine: true } },
    { text: 'npm run dev', options: { color: 'E8F4FD', breakLine: true } },
    { text: '', options: { breakLine: true } },
    { text: '# 本番ビルド', options: { color: '64D8FF', breakLine: true } },
    { text: 'npm run build', options: { color: 'E8F4FD' } },
  ], { x: 1.0, y: 1.8, w: 3.6, h: 1.2, fontSize: 11, fontFace: 'Consolas' });

  // Branches
  card(s, 5.1, 1.15, 4.3, 2.0, { topBar: C.accent });
  s.addText('🌿  Git ブランチ構成', {
    x: 5.35, y: 1.25, w: 4, h: 0.3, fontSize: 13, fontFace: 'Calibri', bold: true, color: C.navy, margin: 0,
  });
  s.addText([
    { text: 'main：', options: { bold: true } },
    { text: 'ソースコード（TSX / TS）', options: { breakLine: true } },
    { text: 'gh-pages：', options: { bold: true } },
    { text: 'ビルド成果物（dist/）', options: { breakLine: true } },
    { text: '', options: { breakLine: true } },
    { text: 'タグ：', options: { bold: true } },
    { text: 'v1.0 / v1.1 / v1.2 / v1.3 / v1.4 / v1.5 / v1.6', options: {} },
  ], { x: 5.35, y: 1.7, w: 3.9, h: 1.4, fontSize: 11, fontFace: 'Calibri', color: C.body, lineSpacingMultiple: 1.45 });

  // Rollback
  card(s, 0.6, 3.4, 8.8, 1.9, { topBar: C.warning });
  s.addText('↩  ロールバック手順', {
    x: 0.85, y: 3.5, w: 4, h: 0.3, fontSize: 13, fontFace: 'Calibri', bold: true, color: C.navy, margin: 0,
  });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.85, y: 3.85, w: 8.35, h: 1.4, fill: { color: '1A1F36' } });
  s.addText([
    { text: '# 特定バージョンに戻す', options: { color: '64D8FF', breakLine: true } },
    { text: 'git reset --hard vX.Y', options: { color: 'E8F4FD', breakLine: true } },
    { text: 'git push origin main --force', options: { color: 'E8F4FD', breakLine: true } },
    { text: '', options: { breakLine: true } },
    { text: '# dist も再ビルドして gh-pages 更新', options: { color: '64D8FF', breakLine: true } },
    { text: 'npm run build && cd dist && git commit -am "rollback" && git push -f', options: { color: 'E8F4FD' } },
  ], { x: 1.0, y: 3.97, w: 8.1, h: 1.2, fontSize: 11, fontFace: 'Consolas' });

  // ============ SLIDE 13: Version History ============
  s = pres.addSlide();
  header(s, '11. バージョン履歴', 'Release timeline', 13, TOTAL);

  const versions = [
    { ver: 'v1.0', title: '初期リリース', desc: '6画面 / PDF / IndexedDB / 8業種13テンプレ', color: C.primary },
    { ver: 'v1.1', title: 'フォトエディタ', desc: 'Instagram風アノテーション機能', color: C.accent },
    { ver: 'v1.2', title: '既存画像の再編集', desc: '画像を選択 → 編集 → 同位置置換', color: C.success },
    { ver: 'v1.3', title: 'コンパクトツールバー', desc: 'アイコンのみで1行化', color: 'F59E0B' },
    { ver: 'v1.4', title: 'Unsplash画像検索（ロールバック済）', desc: 'v1.3 へ巻き戻し、タグのみ残存', color: C.muted },
    { ver: 'v1.5', title: '手描き・QR・JSON・複製UX', desc: '4機能を一括追加', color: 'A78BFA' },
    { ver: 'v1.6', title: '音声入力', desc: 'Web Speech API（ja-JP）', color: 'EF4444' },
  ];
  versions.forEach((v, i) => {
    const y = 1.2 + i * 0.55;
    // timeline dot
    s.addShape(pres.shapes.OVAL, { x: 0.7, y: y + 0.1, w: 0.3, h: 0.3, fill: { color: v.color } });
    if (i < versions.length - 1) {
      s.addShape(pres.shapes.LINE, { x: 0.85, y: y + 0.4, w: 0, h: 0.4, line: { color: C.border, width: 2 } });
    }
    // card
    s.addShape(pres.shapes.RECTANGLE, { x: 1.2, y, w: 8.2, h: 0.5, fill: { color: C.card }, line: { color: C.border, width: 0.5 } });
    s.addText(v.ver, { x: 1.35, y, w: 0.9, h: 0.5, fontSize: 12, fontFace: 'Calibri', bold: true, color: v.color, valign: 'middle', margin: 0 });
    s.addText(v.title, { x: 2.3, y, w: 3.0, h: 0.5, fontSize: 11, fontFace: 'Calibri', bold: true, color: C.dark, valign: 'middle', margin: 0 });
    s.addText(v.desc, { x: 5.3, y, w: 4.0, h: 0.5, fontSize: 10, fontFace: 'Calibri', color: C.muted, valign: 'middle', margin: 0 });
  });

  // ============ SLIDE 14: Limitations & Extensions ============
  s = pres.addSlide();
  header(s, '12. 既知の制限・拡張余地', 'Known limits & future expansion', 14, TOTAL);

  // Known limits
  card(s, 0.6, 1.15, 4.3, 4.0, { topBar: C.error });
  s.addText('⚠️  既知の制限', {
    x: 0.85, y: 1.25, w: 4, h: 0.3, fontSize: 13, fontFace: 'Calibri', bold: true, color: C.navy, margin: 0,
  });
  s.addText([
    { text: 'データは端末に紐づく', options: { bullet: true, bold: true, breakLine: true } },
    { text: '  他端末と共有するには JSON I/O 経由', options: { color: C.muted, breakLine: true } },
    { text: '', options: { breakLine: true } },
    { text: 'Firefox は音声入力未対応', options: { bullet: true, bold: true, breakLine: true } },
    { text: '  Web Speech API 未実装', options: { color: C.muted, breakLine: true } },
    { text: '', options: { breakLine: true } },
    { text: '画像は base64 埋込', options: { bullet: true, bold: true, breakLine: true } },
    { text: '  大量画像でファイルサイズ増', options: { color: C.muted, breakLine: true } },
    { text: '', options: { breakLine: true } },
    { text: 'IndexedDB 容量はブラウザ依存', options: { bullet: true, bold: true, breakLine: true } },
    { text: '  通常数百MB〜数GB', options: { color: C.muted, breakLine: true } },
    { text: '', options: { breakLine: true } },
    { text: 'Unsplash API は未接続', options: { bullet: true, bold: true, breakLine: true } },
    { text: '  v1.3 にロールバック済', options: { color: C.muted } },
  ], { x: 0.85, y: 1.65, w: 3.95, h: 3.4, fontSize: 9.5, fontFace: 'Calibri', color: C.body, lineSpacingMultiple: 1.25 });

  // Extensions
  card(s, 5.1, 1.15, 4.3, 4.0, { topBar: C.success });
  s.addText('🚀  拡張余地', {
    x: 5.35, y: 1.25, w: 4, h: 0.3, fontSize: 13, fontFace: 'Calibri', bold: true, color: C.navy, margin: 0,
  });
  const extensions = [
    ['クラウド同期', '1.5人月'],
    ['共有リンク（閲覧専用URL）', '0.5人月'],
    ['AI 文章生成', '0.8人月'],
    ['AI 画像生成（DALL-E等）', '1.0人月'],
    ['OCR（紙マニュアル → デジタル化）', '0.8人月'],
    ['多言語翻訳', '0.5人月'],
    ['チーム管理・承認ワークフロー', '2.0人月'],
  ];
  extensions.forEach((ext, i) => {
    const ey = 1.65 + i * 0.43;
    s.addText(ext[0], {
      x: 5.35, y: ey, w: 3.0, h: 0.35,
      fontSize: 10, fontFace: 'Calibri', color: C.body, valign: 'middle', margin: 0,
    });
    s.addShape(pres.shapes.RECTANGLE, { x: 8.35, y: ey + 0.05, w: 0.9, h: 0.25, fill: { color: C.sky } });
    s.addText(ext[1], {
      x: 8.35, y: ey + 0.05, w: 0.9, h: 0.25,
      fontSize: 9, fontFace: 'Calibri', bold: true, color: C.primary, align: 'center', valign: 'middle', margin: 0,
    });
  });

  // ── Save ──
  const outPath = 'C:/Users/81805/JavaPractice/ClaudeCodePractice/manual_app_pwa/manual_app_spec_v1.6.pptx';
  await pres.writeFile({ fileName: outPath });
  console.log('Created: ' + outPath);
}

main().catch(console.error);
