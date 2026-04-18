export interface TemplatePage {
  canvasJson: object
}

export interface Template {
  id: string
  name: string
  industry: string
  description: string
  paperSize: 'A4' | 'A3' | 'B4'
  orientation: 'portrait' | 'landscape'
  pages: TemplatePage[]
}

function makeCanvasJson(objects: object[]): object {
  return {
    version: '5.3.0',
    objects,
    background: '#ffffff',
  }
}

function titlePage(title: string, subtitle: string): object {
  return makeCanvasJson([
    {
      type: 'rect',
      left: 20, top: 20, width: 555, height: 802,
      fill: 'transparent', stroke: '#065A82', strokeWidth: 2,
      selectable: false, evented: false,
    },
    {
      type: 'textbox',
      left: 60, top: 200, width: 475,
      text: title,
      fontSize: 36, fontWeight: 'bold', fontFamily: 'Noto Sans JP',
      fill: '#1E2761', textAlign: 'center',
    },
    {
      type: 'textbox',
      left: 60, top: 280, width: 475,
      text: subtitle,
      fontSize: 18, fontFamily: 'Noto Sans JP',
      fill: '#8896A7', textAlign: 'center',
    },
    {
      type: 'textbox',
      left: 60, top: 700, width: 475,
      text: '作成日: ____年____月____日\n作成者: ________________',
      fontSize: 14, fontFamily: 'Noto Sans JP',
      fill: '#3A4560', textAlign: 'center', lineHeight: 1.8,
    },
  ])
}

function stepPage(stepLabel: string): object {
  return makeCanvasJson([
    {
      type: 'rect',
      left: 20, top: 20, width: 555, height: 802,
      fill: 'transparent', stroke: '#E2E8F0', strokeWidth: 1,
      selectable: false, evented: false,
    },
    {
      type: 'rect',
      left: 20, top: 20, width: 555, height: 50,
      fill: '#065A82', selectable: false, evented: false,
    },
    {
      type: 'textbox',
      left: 40, top: 28, width: 515,
      text: stepLabel,
      fontSize: 20, fontWeight: 'bold', fontFamily: 'Noto Sans JP',
      fill: '#FFFFFF',
    },
    {
      type: 'rect',
      left: 40, top: 90, width: 250, height: 200,
      fill: '#F6F8FB', stroke: '#E2E8F0', strokeWidth: 1, strokeDashArray: [5, 5],
      rx: 8, ry: 8,
    },
    {
      type: 'textbox',
      left: 110, top: 175, width: 120,
      text: '📷 写真',
      fontSize: 14, fontFamily: 'Noto Sans JP',
      fill: '#8896A7', textAlign: 'center',
    },
    {
      type: 'rect',
      left: 310, top: 90, width: 250, height: 200,
      fill: '#F6F8FB', stroke: '#E2E8F0', strokeWidth: 1, strokeDashArray: [5, 5],
      rx: 8, ry: 8,
    },
    {
      type: 'textbox',
      left: 380, top: 175, width: 120,
      text: '📷 写真',
      fontSize: 14, fontFamily: 'Noto Sans JP',
      fill: '#8896A7', textAlign: 'center',
    },
    {
      type: 'textbox',
      left: 40, top: 310, width: 520,
      text: 'ここに手順の説明を入力してください',
      fontSize: 14, fontFamily: 'Noto Sans JP',
      fill: '#3A4560', lineHeight: 1.8,
    },
  ])
}

function checklistPage(title: string, items: string[]): object {
  const objects: object[] = [
    {
      type: 'rect',
      left: 20, top: 20, width: 555, height: 802,
      fill: 'transparent', stroke: '#E2E8F0', strokeWidth: 1,
      selectable: false, evented: false,
    },
    {
      type: 'rect',
      left: 20, top: 20, width: 555, height: 50,
      fill: '#065A82', selectable: false, evented: false,
    },
    {
      type: 'textbox',
      left: 40, top: 28, width: 515,
      text: title,
      fontSize: 20, fontWeight: 'bold', fontFamily: 'Noto Sans JP',
      fill: '#FFFFFF',
    },
  ]

  items.forEach((item, i) => {
    const y = 90 + i * 50
    objects.push({
      type: 'rect',
      left: 40, top: y, width: 30, height: 30,
      fill: 'transparent', stroke: '#065A82', strokeWidth: 2,
      rx: 4, ry: 4,
    })
    objects.push({
      type: 'textbox',
      left: 85, top: y + 4, width: 470,
      text: item,
      fontSize: 14, fontFamily: 'Noto Sans JP',
      fill: '#1A1F36',
    })
  })

  return makeCanvasJson(objects)
}

export const templates: Template[] = [
  // 飲食
  {
    id: 'food-basic',
    name: '基本手順書',
    industry: 'food',
    description: '写真とテキストで調理・接客手順を記録',
    paperSize: 'A4',
    orientation: 'portrait',
    pages: [
      { canvasJson: titlePage('基本手順書', '飲食業務マニュアル') },
      { canvasJson: stepPage('手順 1') },
    ],
  },
  {
    id: 'food-hygiene',
    name: '衛生チェックリスト',
    industry: 'food',
    description: 'HACCP対応の衛生管理チェックリスト',
    paperSize: 'A4',
    orientation: 'portrait',
    pages: [
      { canvasJson: titlePage('衛生チェックリスト', '食品衛生管理') },
      {
        canvasJson: checklistPage('衛生チェック項目', [
          '手洗い・消毒の実施',
          '調理器具の洗浄・消毒',
          '食材の温度管理確認',
          '冷蔵庫・冷凍庫の温度記録',
          '調理場の清掃状況',
          '従業員の健康状態確認',
          '害虫駆除の確認',
          '廃棄物の適切な処理',
        ]),
      },
    ],
  },
  {
    id: 'food-recipe',
    name: 'レシピカード',
    industry: 'food',
    description: '料理のレシピを写真付きで記録',
    paperSize: 'A4',
    orientation: 'portrait',
    pages: [
      { canvasJson: titlePage('レシピカード', '調理手順書') },
      { canvasJson: stepPage('調理手順 1') },
    ],
  },
  // 清掃
  {
    id: 'cleaning-procedure',
    name: '清掃手順書',
    industry: 'cleaning',
    description: 'エリアごとの清掃手順を写真付きで記録',
    paperSize: 'A4',
    orientation: 'portrait',
    pages: [
      { canvasJson: titlePage('清掃手順書', '清掃業務マニュアル') },
      { canvasJson: stepPage('清掃手順 1') },
    ],
  },
  {
    id: 'cleaning-checklist',
    name: '点検チェックリスト',
    industry: 'cleaning',
    description: '清掃完了後の点検チェックリスト',
    paperSize: 'A4',
    orientation: 'portrait',
    pages: [
      { canvasJson: titlePage('点検チェックリスト', '清掃完了確認') },
      {
        canvasJson: checklistPage('清掃点検項目', [
          '床面の汚れ・ゴミなし',
          'ガラス・鏡の曇りなし',
          'トイレの清掃完了',
          '備品の補充完了',
          'ゴミ箱の回収・設置',
          '照明・換気の確認',
          '消臭・芳香の確認',
          '報告書の記入完了',
        ]),
      },
    ],
  },
  // 製造
  {
    id: 'manufacturing-standard',
    name: '作業標準書',
    industry: 'manufacturing',
    description: '製造工程の標準作業手順書',
    paperSize: 'A4',
    orientation: 'portrait',
    pages: [
      { canvasJson: titlePage('作業標準書', '製造工程マニュアル') },
      { canvasJson: stepPage('作業手順 1') },
    ],
  },
  {
    id: 'manufacturing-safety',
    name: '安全確認リスト',
    industry: 'manufacturing',
    description: '作業前の安全確認チェックリスト',
    paperSize: 'A4',
    orientation: 'portrait',
    pages: [
      { canvasJson: titlePage('安全確認リスト', '安全管理') },
      {
        canvasJson: checklistPage('安全確認項目', [
          '保護具の着用確認',
          '機械の始業前点検',
          '作業エリアの整理整頓',
          '非常口・消火器の確認',
          '危険物の保管状態確認',
          '換気設備の動作確認',
          '緊急連絡先の掲示確認',
          'KY活動の実施',
        ]),
      },
    ],
  },
  {
    id: 'manufacturing-quality',
    name: '品質検査シート',
    industry: 'manufacturing',
    description: '製品品質の検査記録シート',
    paperSize: 'A4',
    orientation: 'portrait',
    pages: [
      { canvasJson: titlePage('品質検査シート', '品質管理') },
      { canvasJson: stepPage('検査手順 1') },
    ],
  },
  // 医療
  {
    id: 'medical-procedure',
    name: '処置手順書',
    industry: 'medical',
    description: '医療処置の標準手順書',
    paperSize: 'A4',
    orientation: 'portrait',
    pages: [
      { canvasJson: titlePage('処置手順書', '医療業務マニュアル') },
      { canvasJson: stepPage('処置手順 1') },
    ],
  },
  // 宿泊
  {
    id: 'hotel-room',
    name: '客室清掃マニュアル',
    industry: 'hotel',
    description: '客室清掃の標準手順書',
    paperSize: 'A4',
    orientation: 'portrait',
    pages: [
      { canvasJson: titlePage('客室清掃マニュアル', '宿泊業務マニュアル') },
      { canvasJson: stepPage('清掃手順 1') },
    ],
  },
  // 建設
  {
    id: 'construction-safety',
    name: '安全作業手順書',
    industry: 'construction',
    description: '建設現場の安全作業手順',
    paperSize: 'A4',
    orientation: 'portrait',
    pages: [
      { canvasJson: titlePage('安全作業手順書', '建設業務マニュアル') },
      { canvasJson: stepPage('作業手順 1') },
    ],
  },
  // 小売
  {
    id: 'retail-service',
    name: '接客マニュアル',
    industry: 'retail',
    description: '接客対応の標準手順書',
    paperSize: 'A4',
    orientation: 'portrait',
    pages: [
      { canvasJson: titlePage('接客マニュアル', '小売業務マニュアル') },
      { canvasJson: stepPage('接客手順 1') },
    ],
  },
  // 教育
  {
    id: 'education-lesson',
    name: '授業計画書',
    industry: 'education',
    description: '授業の進行計画テンプレート',
    paperSize: 'A4',
    orientation: 'portrait',
    pages: [
      { canvasJson: titlePage('授業計画書', '教育マニュアル') },
      { canvasJson: stepPage('授業内容 1') },
    ],
  },
]
