const fs = require('fs');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, LevelFormat, HeadingLevel, BorderStyle, WidthType,
  ShadingType, PageBreak,
} = require('docx');

// ── Helpers ──
const FONT = 'Calibri';
const CODE_FONT = 'Consolas';

const border = { style: BorderStyle.SINGLE, size: 4, color: 'BFBFBF' };
const borders = { top: border, bottom: border, left: border, right: border };
const cellMargins = { top: 100, bottom: 100, left: 140, right: 140 };

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    children: [new TextRun({ text, font: FONT })],
  });
}
function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    children: [new TextRun({ text, font: FONT })],
  });
}
function h3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    children: [new TextRun({ text, font: FONT })],
  });
}
function p(text, opts = {}) {
  return new Paragraph({
    spacing: { after: 120 },
    children: [new TextRun({ text, font: FONT, ...opts })],
  });
}
function bullet(text, opts = {}) {
  return new Paragraph({
    numbering: { reference: 'bullets', level: 0 },
    children: [new TextRun({ text, font: FONT, ...opts })],
  });
}
function code(lines) {
  return lines.map((line) =>
    new Paragraph({
      spacing: { after: 0, line: 260 },
      shading: { fill: 'F4F6F8', type: ShadingType.CLEAR },
      children: [new TextRun({ text: line || ' ', font: CODE_FONT, size: 20 })],
    })
  );
}

function headerCell(text, width) {
  return new TableCell({
    borders, margins: cellMargins,
    width: { size: width, type: WidthType.DXA },
    shading: { fill: '1E2761', type: ShadingType.CLEAR },
    children: [
      new Paragraph({
        children: [new TextRun({ text, font: FONT, bold: true, color: 'FFFFFF', size: 22 })],
      }),
    ],
  });
}
function bodyCell(text, width, opts = {}) {
  return new TableCell({
    borders, margins: cellMargins,
    width: { size: width, type: WidthType.DXA },
    shading: opts.alt ? { fill: 'F8FAFC', type: ShadingType.CLEAR } : undefined,
    children: [
      new Paragraph({
        children: [new TextRun({ text, font: opts.code ? CODE_FONT : FONT, size: opts.code ? 19 : 21 })],
      }),
    ],
  });
}
function makeTable(headers, rows, widths) {
  const total = widths.reduce((a, b) => a + b, 0);
  const headerRow = new TableRow({
    tableHeader: true,
    children: headers.map((h, i) => headerCell(h, widths[i])),
  });
  const bodyRows = rows.map((r, ri) =>
    new TableRow({
      children: r.map((cell, ci) => bodyCell(String(cell), widths[ci], { alt: ri % 2 === 1 })),
    })
  );
  return new Table({
    width: { size: total, type: WidthType.DXA },
    columnWidths: widths,
    rows: [headerRow, ...bodyRows],
  });
}

function codeTable(rows, widths) {
  const total = widths.reduce((a, b) => a + b, 0);
  const bodyRows = rows.map((r, ri) =>
    new TableRow({
      children: r.map((cell, ci) => bodyCell(String(cell), widths[ci], { alt: ri % 2 === 1, code: ci === 0 })),
    })
  );
  return new Table({
    width: { size: total, type: WidthType.DXA },
    columnWidths: widths,
    rows: bodyRows,
  });
}

// ── Document Content ──
const content = [];

// ==================== Cover ====================
content.push(
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 2400, after: 360 },
    children: [new TextRun({ text: 'マニュアル作成アプリ', font: FONT, size: 56, bold: true, color: '1E2761' })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 240 },
    children: [new TextRun({ text: '技術仕様書', font: FONT, size: 44, bold: true, color: '065A82' })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 1800 },
    children: [new TextRun({ text: 'Version 1.6 (2026-04-18)', font: FONT, size: 28, color: '8896A7' })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 120 },
    children: [new TextRun({ text: '社内技術資料', font: FONT, size: 24, color: '3A4560' })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 120 },
    children: [new TextRun({ text: '対象読者: 社内エンジニア・運用担当者', font: FONT, size: 20, color: '8896A7' })],
  }),
  new Paragraph({ children: [new PageBreak()] })
);

// ==================== 1. System Overview ====================
content.push(h1('1. システム概要'));
content.push(p('業務マニュアルをモバイル端末で作成・編集・共有するためのプログレッシブ・ウェブ・アプリケーション（PWA）である。テンプレートから簡単にマニュアルを作成し、写真・テキスト・手描き・QRコード・音声入力などを組み合わせ、PDF として出力できる。'));
content.push(
  makeTable(
    ['項目', '内容'],
    [
      ['アプリ名', 'マニュアル作成アプリ'],
      ['バージョン', 'v1.6（2026-04-18）'],
      ['公開URL', 'https://iuy58754932-jpg.github.io/manual-app-demo/'],
      ['リポジトリ', 'https://github.com/iuy58754932-jpg/manual-app-demo'],
      ['対象デバイス', 'iPhone（最優先）/ Android / PC'],
      ['対象業種', '飲食・製造・清掃・医療・宿泊・建設・小売・教育（8業種）'],
    ],
    [2800, 6400]
  )
);
content.push(p(''));
content.push(h2('設計思想'));
content.push(bullet('サーバーレス（フロントエンドのみで完結）'));
content.push(bullet('モバイルファースト（max-width: 480px）、iOS Safari を最優先で動作確認'));
content.push(bullet('外部依存を最小化（無料・オープンソースのみで構成）'));
content.push(bullet('PWA としてホーム画面追加でアプリ同等の体験を提供'));
content.push(bullet('Git タグによる明示的なバージョン管理でロールバック可能'));

// ==================== 2. Architecture ====================
content.push(h1('2. アーキテクチャ概要'));
content.push(p('完全クライアントサイドで動作し、バックエンドサーバー・データベースを持たない構成である。データはブラウザの IndexedDB に端末ローカルで保存される。'));
content.push(
  makeTable(
    ['レイヤー', '構成要素'],
    [
      ['UI層', 'React コンポーネント（Tailwind CSS でスタイリング）'],
      ['状態管理', 'React Hooks（useState / useCallback / useRef）'],
      ['ルーティング', 'react-router-dom の HashRouter（GitHub Pages 対応）'],
      ['ドメインロジック', 'カスタムフック（useCanvas / useDatabase / useHistory 等）'],
      ['キャンバス描画', 'Fabric.js（ページ単位の編集キャンバス）'],
      ['永続化', 'IndexedDB（Dexie.js ラッパー経由）'],
      ['外部入出力', 'File API / Canvas API / Web Speech API / Service Worker'],
    ],
    [2800, 6400]
  )
);
content.push(p(''));
content.push(h2('ランニングコスト'));
content.push(bullet('月額費用 0円（GitHub Pages 無料枠内でホスティング）'));
content.push(bullet('外部 API 利用時のみ従量課金（音声認識は Google/Apple の無料枠内）'));

// ==================== 3. Tech Stack ====================
content.push(h1('3. 技術スタック'));

content.push(h2('3.1 コア技術'));
content.push(
  makeTable(
    ['項目', '採用技術', 'バージョン'],
    [
      ['UIフレームワーク', 'React', '18.3'],
      ['言語', 'TypeScript', '5.5'],
      ['ビルドツール', 'Vite', '5.4'],
      ['ルーティング', 'react-router-dom (HashRouter)', '7.1'],
      ['CSS', 'Tailwind CSS + PostCSS + Autoprefixer', '3.4'],
    ],
    [2400, 4200, 2600]
  )
);
content.push(p(''));

content.push(h2('3.2 機能別ライブラリ'));
content.push(
  makeTable(
    ['機能', 'ライブラリ', '用途'],
    [
      ['キャンバス編集', 'Fabric.js v5', '写真・テキスト配置、ドラッグ＆ドロップ、リサイズ、回転、手描き'],
      ['PDF生成', 'jsPDF', 'A4/A3/B4 PDF 出力、各ページを画像として埋め込み'],
      ['QRコード生成', 'qrcode', 'PNG 形式の data URL 生成'],
      ['IndexedDB', 'Dexie.js', 'IndexedDB の高レベルラッパー'],
    ],
    [2200, 2200, 4800]
  )
);
content.push(p(''));

content.push(h2('3.3 使用している Web 標準 API'));
content.push(bullet('Web Speech API（webkitSpeechRecognition）— 音声認識、ja-JP'));
content.push(bullet('File API / FileReader — ファイル選択・base64変換'));
content.push(bullet('Canvas API — 画像リサイズ（最大1200px）'));
content.push(bullet('Service Worker — PWAキャッシュ'));
content.push(bullet('Blob / URL.createObjectURL — JSONファイルのダウンロード'));
content.push(bullet('IndexedDB — 永続化'));
content.push(bullet('MediaDevices / getUserMedia — マイク入力'));

content.push(h2('3.4 開発ツール'));
content.push(bullet('ESLint — 静的解析'));
content.push(bullet('@types/fabric, @types/qrcode — 型定義'));
content.push(bullet('Vite 開発サーバー — ホットリロード'));

// ==================== 4. Directory ====================
content.push(h1('4. ディレクトリ構成'));
content.push(p('主要なディレクトリとファイルは以下の通り。'));
content.push(
  ...code([
    'src/',
    '├── components/',
    '│   ├── common/',
    '│   │   ├── Layout.tsx            # ヘッダー付きレイアウト',
    '│   │   ├── Modal.tsx             # 汎用モーダル',
    '│   │   ├── Toast.tsx             # グローバル通知',
    '│   │   └── ErrorBoundary.tsx     # React エラーバウンダリ',
    '│   └── editor/',
    '│       ├── Canvas.tsx            # Fabric.js キャンバス要素',
    '│       ├── Toolbar.tsx           # 編集ツールバー（12ボタン・2行）',
    '│       ├── PhotoEditorModal.tsx  # 写真アノテーション',
    '│       ├── QrCodeModal.tsx       # QRコード生成',
    '│       ├── VoiceInputModal.tsx   # 音声入力',
    '│       ├── DrawingControls.tsx   # 手描き色/太さ選択',
    '│       ├── PageNavigator.tsx     # ページ切替・追加',
    '│       └── ObjectMenu.tsx        # オブジェクト選択時メニュー',
    '├── pages/',
    '│   ├── HomePage.tsx              # ① ホーム画面',
    '│   ├── IndustryPage.tsx          # ② 業種選択',
    '│   ├── TemplatePage.tsx          # ③ テンプレート選択',
    '│   ├── EditorPage.tsx            # ④ マニュアル編集（メイン画面）',
    '│   └── FilesPage.tsx             # ⑥ ファイル一覧',
    '├── hooks/',
    '│   ├── useCanvas.ts              # Fabric.js キャンバス操作',
    '│   ├── useHistory.ts             # Undo/Redo 管理',
    '│   ├── useDatabase.ts            # IndexedDB CRUD',
    '│   └── useSpeechRecognition.ts   # Web Speech API ラッパー',
    '├── lib/',
    '│   ├── db.ts                     # Dexie.js セットアップ',
    '│   ├── pdf.ts                    # PDF生成ロジック',
    '│   ├── imageUtils.ts             # 画像リサイズ',
    '│   ├── qrcode.ts                 # QRコード生成',
    '│   └── manualIO.ts               # JSON エクスポート/インポート',
    '├── data/',
    '│   ├── industries.ts             # 業種マスター（8業種）',
    '│   └── templates.ts              # テンプレート定義（13種）',
    '├── App.tsx',
    '├── main.tsx',
    '└── index.css                     # Tailwind directives',
    '',
    'public/',
    '├── icon-192x192.png              # PWAアイコン',
    '├── icon-512x512.png              # PWAアイコン（高解像度）',
    '├── manifest.json                 # Web App Manifest',
    '└── sw.js                         # Service Worker',
  ])
);

// ==================== 5. Screens ====================
content.push(h1('5. 画面一覧'));
content.push(p('アプリは6つの主要画面と、編集画面内で開く複数のモーダルで構成される。'));
content.push(
  makeTable(
    ['#', '画面名', 'パス', '役割'],
    [
      ['①', 'ホーム', '/', 'エントリポイント。新規作成/ファイル読込/最近のファイル'],
      ['②', '業種選択', '/industry', '8業種のグリッド表示'],
      ['③', 'テンプレート選択', '/template/:industryId', '業種に紐づくテンプレート一覧'],
      ['④', 'マニュアル編集', '/editor?template=xxx または /editor/:manualId', 'アプリの中心。Fabric.jsキャンバス'],
      ['⑤', 'PDF出力', '編集画面モーダル', 'A4/A3/B4選択、ダウンロード/印刷'],
      ['⑥', 'ファイル一覧', '/files', '検索・ソート・複製・エクスポート・削除'],
    ],
    [500, 1800, 2500, 4400]
  )
);

// ==================== 6. Core Features ====================
content.push(h1('6. 主要機能の実装方式'));

content.push(h2('6.1 マニュアル編集（コア機能）'));
content.push(bullet('Fabric.js の Canvas インスタンスを useCanvas フックで管理'));
content.push(bullet('キャンバスは 595×842px（A4比）で固定、表示時にコンテナ幅に合わせてスケール'));
content.push(bullet('各ページは Fabric.js の toJSON() 出力を文字列化して保存'));
content.push(bullet('テンプレートは src/data/templates.ts に Fabric.js JSON をハードコード'));
content.push(bullet('Fabric.js v5 の textbox styles バグ対策として、全 textbox に styles:{} を初期化するラッパー（safeToJSON / patchStyles）を実装'));

content.push(h2('6.2 PDF出力'));
content.push(bullet('各ページの Fabric.js StaticCanvas を再構築し、toDataURL("image/jpeg", 0.92) で画像化'));
content.push(bullet('jsPDF で用紙サイズ（A4=210×297mm / A3=297×420mm / B4=250×353mm）の PDF を作成'));
content.push(bullet('ページごとに addImage で画像として埋め込む'));
content.push(bullet('日本語フォントは jsPDF で非対応のため、キャンバスを画像化して貼る方式を採用'));

content.push(h2('6.3 ローカル保存（IndexedDB）'));
content.push(
  makeTable(
    ['項目', '内容'],
    [
      ['データベース名', 'ManualAppDB'],
      ['テーブル', 'manuals'],
      ['インデックス', 'id, title, industry, updatedAt'],
      ['pages フィールド', 'JSON.stringify した ManualPage[] を文字列として保存'],
      ['CRUD 実装', 'useDatabase フック（save / load / delete / duplicate / getRecent）'],
    ],
    [2800, 6400]
  )
);
content.push(p(''));

content.push(h2('6.4 Undo/Redo'));
content.push(bullet('useHistory フックで undoStack / redoStack を管理'));
content.push(bullet('Fabric.js の object:modified / added / removed イベントでキャンバス JSON をスタックに push'));
content.push(bullet('最大30ステップ保持（メモリ節約）'));

// ==================== 7. Additional Features ====================
content.push(h1('7. 追加機能の実装'));

content.push(h2('7.1 フォトエディタ（v1.1〜v1.2）'));
content.push(bullet('PhotoEditorModal: フルスクリーンモーダルで独立した Fabric.js キャンバスを持つ'));
content.push(bullet('写真を背景画像としてロック（selectable:false, evented:false）'));
content.push(bullet('アノテーション完了時に canvas.toDataURL() でフラット化'));
content.push(bullet('出力解像度は元画像の自然サイズに合わせる（multiplier = naturalW / canvasW）'));
content.push(bullet('既存画像の再編集: getActiveImageSrc() で src を取得 → 編集後 replaceActiveImage() で同位置・同サイズで置換'));
content.push(bullet('図形セット: 矢印 / 線 / 丸 / 四角 / 三角 / 星 / チェックマーク（7種類）'));
content.push(bullet('テキストのフォントサイズ: 12 / 16 / 20 / 24 / 32 / 48 px から選択'));

content.push(h2('7.2 手描きモード（v1.5）'));
content.push(bullet('Fabric.js Canvas の isDrawingMode = true'));
content.push(bullet('freeDrawingBrush に色・太さを設定（zoom を考慮して width を補正）'));
content.push(bullet('DrawingControls コンポーネントで色パレット8色・太さ5段階を選択'));
content.push(bullet('色: 赤 / 橙 / 黄 / 緑 / 青 / 紺 / 黒 / 白'));
content.push(bullet('太さ: 2 / 4 / 8 / 14 / 22 px'));

content.push(h2('7.3 QRコード生成（v1.5）'));
content.push(bullet('qrcode.toDataURL() で PNG の data URL を生成'));
content.push(bullet('300ms デバウンスでリアルタイムプレビュー'));
content.push(bullet('サイズ 200 / 400 / 600px から選択、エラー訂正レベル M'));
content.push(bullet('生成した dataURL は addImage() でキャンバスに追加'));

content.push(h2('7.4 JSONエクスポート/インポート（v1.5）'));
content.push(bullet('lib/manualIO.ts でシリアライズ/パース'));
content.push(bullet('ファイル形式: { fileVersion: 1, exportedAt, manual: {...} }'));
content.push(bullet('エクスポート: Blob + <a download> でダウンロード'));
content.push(bullet('インポート: FileReader.text() → JSON.parse → バリデーション → 新規マニュアル作成'));
content.push(bullet('fileVersion によるバージョン互換チェックを実装'));

content.push(h2('7.5 音声入力（v1.6）'));
content.push(bullet('useSpeechRecognition フック: Web Speech API（webkitSpeechRecognition フォールバック）'));
content.push(bullet('言語: ja-JP / continuous: true / interimResults: true'));
content.push(bullet('中間結果と確定結果を分けて管理し、編集可能なテキストエリアに反映'));
content.push(bullet('未対応ブラウザ（Firefox 等）向けのフォールバックUIを表示'));
content.push(bullet('エラーハンドリング: not-allowed / no-speech / audio-capture / network'));

// ==================== 8. Data Model ====================
content.push(h1('8. データモデル'));

content.push(h2('8.1 Manual（ドメインモデル）'));
content.push(
  ...code([
    'interface Manual {',
    '  id: string                 // UUID',
    '  title: string',
    '  industry: string           // Industry.id',
    '  templateId: string         // Template.id',
    '  pages: ManualPage[]',
    '  createdAt: Date',
    '  updatedAt: Date',
    '  thumbnailDataUrl: string   // 1ページ目のサムネ (JPEG base64)',
    '}',
  ])
);

content.push(h2('8.2 ManualPage'));
content.push(
  ...code([
    'interface ManualPage {',
    '  id: string',
    '  pageNumber: number         // 1-based',
    '  canvasJson: string         // Fabric.js toJSON() の結果 (stringified)',
    '  thumbnailDataUrl: string   // 0.2倍縮小の JPEG base64',
    '}',
  ])
);

content.push(h2('8.3 ManualRecord（IndexedDB スキーマ）'));
content.push(
  ...code([
    'interface ManualRecord {',
    '  id: string',
    '  title: string',
    '  industry: string',
    '  templateId: string',
    '  pages: string              // JSON.stringify(ManualPage[])',
    '  thumbnailDataUrl: string',
    '  createdAt: Date',
    '  updatedAt: Date',
    '}',
  ])
);

content.push(h2('8.4 ManualFile（JSONエクスポート形式）'));
content.push(
  ...code([
    'interface ManualFile {',
    '  fileVersion: 1',
    '  exportedAt: string         // ISO 8601',
    '  manual: {',
    '    title: string',
    '    industry: string',
    '    templateId: string',
    '    pages: ManualPage[]',
    '    thumbnailDataUrl: string',
    '    createdAt: string       // ISO 8601',
    '    updatedAt: string       // ISO 8601',
    '  }',
    '}',
  ])
);

// ==================== 9. PWA ====================
content.push(h1('9. PWA仕様'));

content.push(h2('9.1 Web App Manifest（public/manifest.json）'));
content.push(
  makeTable(
    ['項目', '値'],
    [
      ['name', 'マニュアル作成アプリ'],
      ['short_name', 'マニュアル'],
      ['display', 'standalone'],
      ['background_color', '#1E2761'],
      ['theme_color', '#065A82'],
      ['orientation', 'portrait'],
      ['icons', '192×192 / 512×512（any maskable）'],
    ],
    [2800, 6400]
  )
);
content.push(p(''));

content.push(h2('9.2 Service Worker（public/sw.js）'));
content.push(bullet('install 時: start_url と index.html をプリキャッシュ'));
content.push(bullet('fetch 時: cache-first + ネットワーク fallback 戦略'));
content.push(bullet('activate 時: 古いキャッシュを削除'));

content.push(h2('9.3 iOS 対応'));
content.push(bullet('apple-mobile-web-app-capable メタタグ'));
content.push(bullet('apple-touch-icon リンク'));
content.push(bullet('safe-area-inset-top/bottom（env()）で iPhone ノッチに対応'));
content.push(bullet('viewport: maximum-scale=1.0, user-scalable=no'));

// ==================== 10. Build / Deploy ====================
content.push(h1('10. ビルド・デプロイ'));

content.push(h2('10.1 ローカル開発'));
content.push(
  ...code([
    'npm install',
    'npm run dev       # http://localhost:5173',
  ])
);

content.push(h2('10.2 プロダクションビルド'));
content.push(
  ...code([
    'npm run build     # dist/ に出力',
  ])
);

content.push(h2('10.3 デプロイ構成'));
content.push(
  makeTable(
    ['項目', '内容'],
    [
      ['main ブランチ', 'ソースコード（TypeScript / TSX など）'],
      ['gh-pages ブランチ', 'ビルド成果物（dist/ の内容のみ）'],
      ['公開URL', 'https://iuy58754932-jpg.github.io/manual-app-demo/'],
      ['base path', '"./"（相対パス統一、サブディレクトリ配信対応）'],
      ['バージョン管理', 'Git タグ（v1.0〜v1.6）で各バージョンを固定'],
    ],
    [2800, 6400]
  )
);
content.push(p(''));

content.push(h2('10.4 ロールバック手順'));
content.push(
  ...code([
    '# 特定バージョンに戻す',
    'git checkout vX.Y',
    'git reset --hard vX.Y',
    'git push origin main --force',
    '',
    '# dist も再ビルドして gh-pages に反映',
    'npm run build',
    'cd dist && git add -A && git commit -m "Rollback" && git push origin gh-pages --force',
  ])
);

// ==================== 11. Version History ====================
content.push(h1('11. バージョン履歴'));
content.push(
  makeTable(
    ['バージョン', 'リリース内容'],
    [
      ['v1.0', '初期リリース: 6画面、PDF出力、IndexedDB、8業種×13テンプレ'],
      ['v1.1', 'Instagram風フォトエディタ追加（テキスト・図形でアノテーション）'],
      ['v1.2', '既存画像の再編集機能（画像選択→編集→同位置置換）'],
      ['v1.3', 'ツールバーをアイコンのみのコンパクト表示に'],
      ['v1.4', 'Unsplash画像検索（※v1.3へロールバック済み、タグのみ残存）'],
      ['v1.5', '手描き / QRコード / JSONエクスポート・インポート / 複製UI改善'],
      ['v1.6', '音声入力（Web Speech API）'],
    ],
    [1800, 7400]
  )
);

// ==================== 12. Known Limitations ====================
content.push(h1('12. 既知の制限'));
content.push(bullet('データは端末に紐づく。他端末との共有には JSON エクスポート/インポート経由が必要'));
content.push(bullet('Firefox では音声入力未対応（Web Speech API 未実装のため）'));
content.push(bullet('画像は base64 でキャンバス JSON に埋め込まれるため、多数の大画像を含むマニュアルはサイズが大きくなる'));
content.push(bullet('IndexedDB のストレージ上限はブラウザ依存（通常数百MB〜数GB）'));
content.push(bullet('Unsplash API は現在未接続（v1.4で実装済みだが v1.3 にロールバック済み）'));
content.push(bullet('印刷機能はブラウザの print ダイアログに依存する（iOS Safari では AirPrint 利用）'));

// ==================== 13. Extension Options ====================
content.push(h1('13. 拡張余地（参考）'));
content.push(p('本アプリは現時点でサーバーレスだが、以下の拡張を行う場合はバックエンドまたは外部 SaaS の導入が必要となる。'));
content.push(
  makeTable(
    ['拡張内容', '必要な追加構成', '概算工数'],
    [
      ['クラウド同期（複数端末共有）', 'Firebase / Supabase 等', '1.5人月'],
      ['共有リンク（閲覧専用URL）', 'バックエンド + 公開ストレージ', '0.5人月'],
      ['AI 文章生成', 'ChatGPT API（有料）', '0.8人月'],
      ['AI 画像生成', 'DALL-E / Stable Diffusion API（有料）', '1.0人月'],
      ['OCR（紙マニュアルデジタル化）', 'Google Vision / Azure OCR', '0.8人月'],
      ['翻訳機能', 'DeepL / Google Translate API', '0.5人月'],
      ['チーム管理・承認ワークフロー', 'バックエンド + 認証基盤', '2.0人月'],
    ],
    [3400, 3400, 2400]
  )
);

// ==================== 14. Security & Privacy ====================
content.push(h1('14. セキュリティ・プライバシー'));
content.push(h2('14.1 データ取扱い'));
content.push(bullet('全マニュアルデータは端末ローカルの IndexedDB に保存される'));
content.push(bullet('サーバーへのアップロードやクラウド同期は一切行わない'));
content.push(bullet('個人情報・業務データが第三者サーバーに保存されることはない'));

content.push(h2('14.2 外部送信が発生するケース'));
content.push(
  makeTable(
    ['機能', '送信先', '送信データ'],
    [
      ['音声入力', 'ブラウザベンダー（Google/Apple）', '音声データ（認識中のみ）'],
      ['フォント読込', 'Google Fonts', 'なし（静的 CSS/Font）'],
      ['Unsplash 画像検索', 'Unsplash API（※現在未接続）', '検索キーワード'],
    ],
    [2400, 3200, 3600]
  )
);
content.push(p(''));

content.push(h2('14.3 APIキー管理'));
content.push(bullet('Unsplash APIキーは .env ファイルで管理（.gitignore に追加済み）'));
content.push(bullet('本番ビルド時にバンドルされるため、公開 API キーとしての利用のみ可'));

// ==================== 15. Contact ====================
content.push(h1('15. 問い合わせ・リポジトリ'));
content.push(p('技術的な質問・機能追加要望・不具合報告は、社内開発チームまでお願いします。'));
content.push(p(''));
content.push(
  makeTable(
    ['項目', '内容'],
    [
      ['公開URL', 'https://iuy58754932-jpg.github.io/manual-app-demo/'],
      ['リポジトリ', 'https://github.com/iuy58754932-jpg/manual-app-demo'],
      ['デプロイブランチ', 'gh-pages'],
      ['開発ブランチ', 'main'],
      ['バージョンタグ', 'v1.0, v1.1, v1.2, v1.3, v1.4, v1.5, v1.6'],
    ],
    [2800, 6400]
  )
);

content.push(p(''));
content.push(p(''));
content.push(p('本仕様書は v1.6 時点のものです。最新の実装と齟齬があった場合はリポジトリの main ブランチを正とします。', { italic: true, color: '8896A7', size: 18 }));

// ── Build Document ──
const doc = new Document({
  creator: '開発チーム',
  title: 'マニュアル作成アプリ 技術仕様書 v1.6',
  description: '社内技術仕様書',
  styles: {
    default: {
      document: { run: { font: FONT, size: 22 } },
    },
    paragraphStyles: [
      {
        id: 'Heading1',
        name: 'Heading 1',
        basedOn: 'Normal',
        next: 'Normal',
        quickFormat: true,
        run: { size: 36, bold: true, color: '1E2761', font: FONT },
        paragraph: { spacing: { before: 480, after: 240 }, outlineLevel: 0 },
      },
      {
        id: 'Heading2',
        name: 'Heading 2',
        basedOn: 'Normal',
        next: 'Normal',
        quickFormat: true,
        run: { size: 28, bold: true, color: '065A82', font: FONT },
        paragraph: { spacing: { before: 320, after: 160 }, outlineLevel: 1 },
      },
      {
        id: 'Heading3',
        name: 'Heading 3',
        basedOn: 'Normal',
        next: 'Normal',
        quickFormat: true,
        run: { size: 24, bold: true, color: '0891B2', font: FONT },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 2 },
      },
    ],
  },
  numbering: {
    config: [
      {
        reference: 'bullets',
        levels: [
          {
            level: 0,
            format: LevelFormat.BULLET,
            text: '•',
            alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } },
          },
        ],
      },
    ],
  },
  sections: [
    {
      properties: {
        page: {
          size: { width: 11906, height: 16838 }, // A4
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
        },
      },
      children: content,
    },
  ],
});

const outPath = 'C:/Users/81805/JavaPractice/ClaudeCodePractice/manual_app_pwa/manual_app_spec_v1.6.docx';
Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(outPath, buffer);
  console.log('Created: ' + outPath + ' (' + buffer.length + ' bytes)');
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
