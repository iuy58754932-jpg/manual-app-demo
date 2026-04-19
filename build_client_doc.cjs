const fs = require('fs');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, LevelFormat, HeadingLevel, BorderStyle, WidthType,
  ShadingType, PageBreak,
} = require('docx');

const FONT = 'Calibri';
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
function numbered(text, opts = {}) {
  return new Paragraph({
    numbering: { reference: 'numbers', level: 0 },
    children: [new TextRun({ text, font: FONT, ...opts })],
  });
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
        children: [new TextRun({ text, font: FONT, size: 21 })],
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

// ── Document Content ──
const content = [];

// ==================== Cover ====================
content.push(
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 2400, after: 360 },
    children: [new TextRun({ text: 'マニュアル作成アプリ', font: FONT, size: 60, bold: true, color: '1E2761' })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 240 },
    children: [new TextRun({ text: 'ご紹介資料', font: FONT, size: 40, bold: true, color: '065A82' })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 1600 },
    children: [new TextRun({ text: '業務マニュアルをスマホで簡単に作成', font: FONT, size: 26, color: '8896A7' })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 120 },
    children: [new TextRun({ text: '2026年4月', font: FONT, size: 22, color: '3A4560' })],
  }),
  new Paragraph({ children: [new PageBreak()] })
);

// ==================== 1. Overview ====================
content.push(h1('1. アプリのご紹介'));

content.push(p('「マニュアル作成アプリ」は、業務マニュアルをスマートフォンで簡単に作成・編集・共有できるアプリです。テンプレートを選んで、写真・文字・図形などを自由に配置し、PDFとして保存・印刷できます。'));

content.push(h2('3つの特徴'));
content.push(bullet('テンプレートから選ぶだけ — 業種ごとのマニュアル下書きがすぐ使えます', { bold: true }));
content.push(bullet('スマホで撮った写真をそのまま貼り付け — 現場でその場でマニュアル作成', { bold: true }));
content.push(bullet('PDF出力 & 印刷 — 完成したマニュアルをすぐに共有・配布', { bold: true }));

content.push(h2('こんな方におすすめ'));
content.push(bullet('現場で作業手順を撮影しながらマニュアルを作りたい'));
content.push(bullet('新人教育用の資料を手軽に準備したい'));
content.push(bullet('紙のマニュアルをデジタル化したい'));
content.push(bullet('複数店舗・複数部署で同じ業務手順を統一したい'));

content.push(h2('ご利用料金・運用コスト'));
content.push(
  makeTable(
    ['項目', '内容'],
    [
      ['アプリ利用料', '月額費用なし（サーバー不要のため）'],
      ['追加機器', '不要（お手持ちのスマホ・タブレット・PCで利用可）'],
      ['インターネット', '初回のみ必要（以降はオフラインでも利用可）'],
      ['対応機種', 'iPhone（推奨）、Android、パソコン'],
    ],
    [2600, 6600]
  )
);

content.push(new Paragraph({ children: [new PageBreak()] }));

// ==================== 2. What you can do ====================
content.push(h1('2. できること'));

content.push(h2('📋 マニュアル作成'));
content.push(bullet('8業種（飲食・製造・清掃・医療・宿泊・建設・小売・教育）のテンプレートから選択'));
content.push(bullet('1マニュアルに複数ページを追加可能'));
content.push(bullet('過去に作ったマニュアルをコピーして新しく作る「複製」機能'));

content.push(h2('📷 写真の取り込み'));
content.push(bullet('スマホのカメラで撮影してそのまま貼り付け'));
content.push(bullet('写真フォルダから既存の写真を選択'));
content.push(bullet('写真の大きさ・位置・回転を自由に調整'));

content.push(h2('🖼 写真編集（Instagram風）'));
content.push(bullet('写真の上に文字を入れて手順を説明（例: 「ここを押す」「注意」）'));
content.push(bullet('矢印・丸・四角・星・チェックマークなど7種類の図形を配置'));
content.push(bullet('文字サイズは6段階から選択（12〜48pt）'));
content.push(bullet('色は7色から選択（赤・青・黄・緑・白・黒・オレンジ）'));
content.push(bullet('後からでも、貼った写真をもう一度編集し直せる'));

content.push(h2('✏️ テキスト・手描き・その他'));
content.push(bullet('文字の入力・配置・サイズ変更'));
content.push(bullet('指やApple Pencilで自由に線を描ける手描きモード'));
content.push(bullet('QRコードを生成してマニュアルに埋め込み（URLや連絡先を貼れる）'));
content.push(bullet('音声入力で話した内容を自動で文字化（日本語対応）'));

content.push(h2('📄 出力・共有'));
content.push(bullet('PDFとして保存（A4 / A3 / B4から選択）'));
content.push(bullet('そのままプリンターで印刷'));
content.push(bullet('マニュアルデータをファイルとして書き出し（他の端末へ移動可能）'));
content.push(bullet('他の端末で作ったファイルを読み込み'));

content.push(h2('💾 保存・管理'));
content.push(bullet('作成したマニュアルは端末内に自動保存'));
content.push(bullet('タイトルで検索可能'));
content.push(bullet('更新日順・作成日順・タイトル順で並び替え'));

content.push(new Paragraph({ children: [new PageBreak()] }));

// ==================== 3. Screen Guide ====================
content.push(h1('3. 画面のご紹介'));

content.push(p('アプリは6つの画面で構成されています。どの画面もシンプルで、迷わず操作できるように設計されています。'));

content.push(h2('① ホーム画面'));
content.push(p('アプリを開いたときに最初に表示される画面です。'));
content.push(h3('この画面でできること'));
content.push(bullet('新しいマニュアルの作成を開始'));
content.push(bullet('保存済みのマニュアル一覧を開く'));
content.push(bullet('最近編集したファイルから続きを再開（直近5件表示）'));

content.push(h2('② 業種選択画面'));
content.push(p('お客様の業種に合ったテンプレートを探すための画面です。'));
content.push(h3('8つの業種から選択'));
content.push(bullet('🍽 飲食'));
content.push(bullet('🏭 製造'));
content.push(bullet('🧹 清掃'));
content.push(bullet('🏥 医療'));
content.push(bullet('🏨 宿泊'));
content.push(bullet('🏗 建設'));
content.push(bullet('🛒 小売'));
content.push(bullet('📚 教育'));

content.push(h2('③ テンプレート選択画面'));
content.push(p('選んだ業種向けのテンプレート一覧が表示されます。'));
content.push(h3('テンプレート例'));
content.push(
  makeTable(
    ['業種', 'テンプレート'],
    [
      ['飲食', '基本手順書 / 衛生チェックリスト / レシピカード'],
      ['清掃', '清掃手順書 / 点検チェックリスト'],
      ['製造', '作業標準書 / 安全確認リスト / 品質検査シート'],
      ['医療', '処置手順書'],
      ['宿泊', '客室清掃マニュアル'],
      ['建設', '安全作業手順書'],
      ['小売', '接客マニュアル'],
      ['教育', '授業計画書'],
    ],
    [1800, 7400]
  )
);
content.push(p(''));
content.push(p('※ 今後ご要望に応じてテンプレートの追加・カスタマイズが可能です。', { italic: true, color: '8896A7', size: 20 }));

content.push(new Paragraph({ children: [new PageBreak()] }));

content.push(h2('④ マニュアル編集画面（メイン画面）'));
content.push(p('このアプリの中心となる画面です。写真・文字・図形を自由に配置してマニュアルを作成します。'));

content.push(h3('画面の構成'));
content.push(
  makeTable(
    ['エリア', '内容'],
    [
      ['上部バー', 'タイトル入力欄 / 保存ボタン / PDF出力ボタン'],
      ['ツールバー', '写真追加・文字追加・QRコードなどの操作ボタン（12種類）'],
      ['中央', 'マニュアル編集エリア（紙のイメージで表示）'],
      ['下部', 'ページ一覧（横スクロール）・ページ追加ボタン'],
    ],
    [2200, 7000]
  )
);
content.push(p(''));

content.push(h3('ツールバーの操作ボタン'));
content.push(
  makeTable(
    ['アイコン', '機能', '説明'],
    [
      ['📷', '写真を追加', 'カメラで撮影 または 写真フォルダから選択'],
      ['📷+', '編集して追加', '写真を撮ってからすぐ編集（文字・図形を載せる）'],
      ['🖼✎', '画像を編集', 'すでに配置した写真を選んで再編集'],
      ['Aa', 'テキストを追加', '文字を入力して配置'],
      ['🎤', '音声入力', 'マイクで話した内容を自動で文字化'],
      ['🔳', 'QRコード', 'URLやテキストからQRコードを生成'],
      ['✏️', '手描き', '指で自由に線や記号を描く'],
      ['🔍+/−', '拡大・縮小', '編集エリアの表示倍率を変更'],
      ['↩ / ↪', '元に戻す / やり直す', '操作のやり直し（最大30回）'],
      ['🗑', '削除', '選択中の要素を削除'],
    ],
    [1100, 2400, 5700]
  )
);

content.push(new Paragraph({ children: [new PageBreak()] }));

content.push(h2('⑤ PDF出力画面'));
content.push(p('作成したマニュアルをPDFファイルとして保存、または印刷する画面です。'));
content.push(h3('設定項目'));
content.push(bullet('用紙サイズ: A4 / A3 / B4 から選択'));
content.push(bullet('全ページのプレビュー表示'));
content.push(bullet('「PDF出力」ボタン → 端末にダウンロード'));
content.push(bullet('「印刷」ボタン → そのまま印刷ダイアログへ'));

content.push(h2('⑥ ファイル一覧画面'));
content.push(p('保存済みのマニュアルを管理する画面です。'));
content.push(h3('できること'));
content.push(bullet('タイトルで検索'));
content.push(bullet('更新日順・作成日順・タイトル順で並び替え'));
content.push(bullet('ファイルをタップして編集を再開'));
content.push(bullet('「⋯」ボタンから: 複製 / JSONエクスポート / 削除'));
content.push(bullet('「📥 読込」ボタンで他端末のファイルをインポート'));

content.push(new Paragraph({ children: [new PageBreak()] }));

// ==================== 4. How to use ====================
content.push(h1('4. 使い方ガイド'));

content.push(h2('4-1. 新しいマニュアルを作る'));
content.push(numbered('ホーム画面で「新規作成」ボタンをタップ'));
content.push(numbered('業種を選択（例: 飲食）'));
content.push(numbered('テンプレートを選択（例: 基本手順書）'));
content.push(numbered('編集画面が開きます。タイトルを入力'));
content.push(numbered('写真やテキストを追加して手順を作成'));
content.push(numbered('「保存」ボタンをタップ → 端末内に保存されます'));

content.push(h2('4-2. 写真を撮って貼り付ける'));
content.push(numbered('ツールバーの「📷」をタップ'));
content.push(numbered('カメラが起動 → 撮影 / または写真フォルダから選択'));
content.push(numbered('写真がマニュアルに自動で追加されます'));
content.push(numbered('指で写真を動かしたり、四隅のハンドルで大きさを変更'));

content.push(h2('4-3. 写真に文字や図形を入れる（Instagram風編集）'));
content.push(numbered('ツールバーの「📷+」をタップ'));
content.push(numbered('写真を撮影 / 選択'));
content.push(numbered('フォトエディタが開きます'));
content.push(numbered('下のメニューから「Aa テキスト」「➡ 矢印」「○ 丸」などを選んで配置'));
content.push(numbered('色パレットで色を変更、テキストはサイズも変更可能'));
content.push(numbered('「✓ 完了」をタップ → 編集済み写真としてマニュアルに追加'));

content.push(h2('4-4. 後から既存の写真を編集する'));
content.push(numbered('マニュアル上の写真をタップして選択'));
content.push(numbered('ツールバーの「🖼✎」ボタンが有効になる → タップ'));
content.push(numbered('フォトエディタで文字や図形を追加'));
content.push(numbered('「✓ 完了」で元の位置・サイズを保ったまま更新'));

content.push(h2('4-5. 手描きで書き込む'));
content.push(numbered('ツールバーの「✏️」をタップ'));
content.push(numbered('下に色と太さの選択パネルが表示される'));
content.push(numbered('指で自由に描画（矢印や囲みなど）'));
content.push(numbered('終わったら「✓ 終了」をタップ'));

content.push(h2('4-6. QRコードを貼る'));
content.push(numbered('ツールバーの「🔳」をタップ'));
content.push(numbered('URLまたはテキストを入力（例: https://example.com）'));
content.push(numbered('サイズを選択（小・中・大）'));
content.push(numbered('プレビューを確認 → 「キャンバスに追加」'));

content.push(h2('4-7. 音声で入力する'));
content.push(numbered('ツールバーの「🎤」をタップ'));
content.push(numbered('マイクの使用許可を「許可」'));
content.push(numbered('青いマイクボタンをタップ → 話し始める'));
content.push(numbered('認識結果がテキストエリアに表示される（手動修正も可）'));
content.push(numbered('「テキストとして追加」で完了'));

content.push(h2('4-8. PDFで保存・印刷'));
content.push(numbered('編集画面右上の「PDF」ボタンをタップ'));
content.push(numbered('用紙サイズを選択（A4 / A3 / B4）'));
content.push(numbered('プレビューで全ページを確認'));
content.push(numbered('「PDF出力」または「印刷」をタップ'));

content.push(h2('4-9. 保存ファイルを開く・複製する'));
content.push(numbered('ホーム画面から「ファイル読み込み」をタップ、または画面下の最近のファイル一覧から選択'));
content.push(numbered('ファイル一覧で目的のマニュアルをタップ → 編集再開'));
content.push(numbered('類似マニュアルを作りたい時は「⋯」→「📋 複製」'));

content.push(new Paragraph({ children: [new PageBreak()] }));

// ==================== 5. Usage Tips ====================
content.push(h1('5. 活用のヒント'));

content.push(h2('💡 シーン別の使い方'));

content.push(h3('現場での作業手順を記録'));
content.push(p('作業者が現場でスマホを使い、各工程を撮影しながらその場でマニュアル化。手元に写真素材がなくてもすぐ作成できます。'));

content.push(h3('新人教育用のマニュアル作成'));
content.push(p('ベテラン社員の作業を撮影 → Instagram風編集で重要ポイントに矢印・文字を追加 → 新人にPDFで共有。'));

content.push(h3('チェックリスト形式のマニュアル'));
content.push(p('衛生チェック・安全確認などは、専用のチェックリストテンプレートを使用。テンプレートには最初からチェック欄が用意されています。'));

content.push(h3('紙マニュアルのデジタル化'));
content.push(p('既存の紙マニュアルを撮影 → アプリに取り込み → 文字や矢印を追加して補足。完成したらPDFで共有。'));

content.push(h3('QRコードで現場と連携'));
content.push(p('マニュアル内に関連動画のURLや連絡先をQRコードで埋め込み。現場でスマホから読み取って即座にアクセス。'));

content.push(h2('📱 ホーム画面にアプリとして追加'));
content.push(numbered('Safari / Chromeで本アプリのURLを開く'));
content.push(numbered('ブラウザの「共有」→「ホーム画面に追加」'));
content.push(numbered('アイコンがホーム画面に追加され、通常のアプリのように起動できます'));

content.push(h2('✅ データの保管と共有'));
content.push(bullet('データは端末内に保存されます（他社サーバーには送られません）'));
content.push(bullet('複数の担当者でデータを共有したい場合は、「エクスポート」でファイルを出して、メールやチャットで共有'));
content.push(bullet('受け取った方は「インポート」で取り込んで、同じマニュアルを編集できます'));

content.push(new Paragraph({ children: [new PageBreak()] }));

// ==================== 6. FAQ ====================
content.push(h1('6. よくあるご質問'));

content.push(h2('Q1. インターネットに繋がっていなくても使えますか？'));
content.push(p('A. 初回アクセス後は、インターネットなしで利用できます。作成・編集・保存は全てオフラインで可能です。'));

content.push(h2('Q2. 他の端末でも同じマニュアルを見られますか？'));
content.push(p('A. 自動同期はありません。「エクスポート」でファイルを出して、他の端末で「インポート」すれば開けます（メール・チャット等で送付）。'));

content.push(h2('Q3. 作ったマニュアルのデータは誰に見られますか？'));
content.push(p('A. 端末内にのみ保存されるため、第三者や弊社には共有されません。データ漏洩の心配はありません。'));

content.push(h2('Q4. スマホ以外でも使えますか？'));
content.push(p('A. パソコン・タブレットでもブラウザから利用可能です。ただし、モバイル向けに最適化されているため、スマホでの操作が最もスムーズです。'));

content.push(h2('Q5. テンプレートは追加できますか？'));
content.push(p('A. 開発側でご希望のテンプレートを追加できます。お客様の業務に合わせたオリジナルテンプレートの作成もご相談ください。'));

content.push(h2('Q6. 画像をたくさん入れるとファイルが重くなりますか？'));
content.push(p('A. 画像は自動的に最適なサイズに圧縮されます。PDF出力時も問題ありません。'));

content.push(h2('Q7. 写真は何枚まで入れられますか？'));
content.push(p('A. 上限はありません。1マニュアルに数十枚〜100枚以上の写真を入れた実例もあります。'));

content.push(h2('Q8. データが消えることはありますか？'));
content.push(p('A. 端末のブラウザデータを手動で消去しない限り保持されます。心配な場合は、定期的に「エクスポート」でバックアップをおすすめします。'));

content.push(h2('Q9. 今後の機能追加は可能ですか？'));
content.push(p('A. 可能です。現在は「クラウド保存」「AI文章生成」「多言語対応」などの拡張もご要望に応じて開発可能です。'));

content.push(h2('Q10. サポートはありますか？'));
content.push(p('A. 導入後もアップデート対応・運用サポート・機能追加のご相談を承っております。契約内容に応じて保守プランをご提案します。'));

content.push(new Paragraph({ children: [new PageBreak()] }));

// ==================== 7. Contact ====================
content.push(h1('7. お問い合わせ'));

content.push(p('アプリのご利用・機能追加・導入に関するご質問は、担当窓口までお気軽にお問い合わせください。'));

content.push(p(''));

content.push(
  makeTable(
    ['項目', '内容'],
    [
      ['公開URL', 'https://iuy58754932-jpg.github.io/manual-app-demo/'],
      ['対応デバイス', 'iPhone / Android / パソコン'],
      ['対応ブラウザ', 'Safari（iOS）/ Chrome / Edge'],
      ['対応言語', '日本語'],
      ['サポート窓口', '（担当までご連絡ください）'],
    ],
    [2600, 6600]
  )
);

content.push(p(''));
content.push(p(''));
content.push(p('本資料は v1.6 時点のものです。機能はアップデートで拡張されます。', { italic: true, color: '8896A7', size: 20 }));

// ── Build ──
const doc = new Document({
  creator: '開発チーム',
  title: 'マニュアル作成アプリ ご紹介資料',
  description: 'お客様向け紹介資料',
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
      {
        reference: 'numbers',
        levels: [
          {
            level: 0,
            format: LevelFormat.DECIMAL,
            text: '%1.',
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
          size: { width: 11906, height: 16838 },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
        },
      },
      children: content,
    },
  ],
});

const outPath = 'C:/Users/81805/JavaPractice/ClaudeCodePractice/manual_app_pwa/manual_app_client_guide_v1.6.docx';
Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(outPath, buffer);
  console.log('Created: ' + outPath + ' (' + buffer.length + ' bytes)');
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
