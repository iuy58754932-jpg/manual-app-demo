// Manual import/export utilities
// Allows users to save a manual as a JSON file (backup / share between devices)
// and load it back into another device.

import type { Manual, ManualPage } from '../hooks/useDatabase'

export const MANUAL_FILE_VERSION = 1

export interface ManualFile {
  fileVersion: number
  exportedAt: string
  manual: {
    title: string
    industry: string
    templateId: string
    pages: ManualPage[]
    thumbnailDataUrl: string
    createdAt: string
    updatedAt: string
  }
}

export function exportManualAsJson(manual: Manual): void {
  const payload: ManualFile = {
    fileVersion: MANUAL_FILE_VERSION,
    exportedAt: new Date().toISOString(),
    manual: {
      title: manual.title,
      industry: manual.industry,
      templateId: manual.templateId,
      pages: manual.pages,
      thumbnailDataUrl: manual.thumbnailDataUrl,
      createdAt: manual.createdAt.toISOString(),
      updatedAt: manual.updatedAt.toISOString(),
    },
  }
  const json = JSON.stringify(payload, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)

  const safeTitle = (manual.title || '無題のマニュアル').replace(/[\\/:*?"<>|]/g, '_')
  const filename = `${safeTitle}.manual.json`

  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  // Delay revoke to ensure download starts
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export async function parseManualJsonFile(file: File): Promise<{
  title: string
  industry: string
  templateId: string
  pages: ManualPage[]
  thumbnailDataUrl: string
}> {
  const text = await file.text()
  let parsed: unknown
  try {
    parsed = JSON.parse(text)
  } catch {
    throw new Error('JSONの形式が不正です')
  }

  const root = parsed as Record<string, unknown>
  if (!root || typeof root !== 'object') {
    throw new Error('マニュアルファイルではありません')
  }
  const fileVersion = root.fileVersion
  if (typeof fileVersion !== 'number') {
    throw new Error('マニュアルファイルではありません')
  }
  if (fileVersion > MANUAL_FILE_VERSION) {
    throw new Error('新しいバージョンのファイルです。アプリを更新してください')
  }

  const manualData = root.manual as Record<string, unknown> | undefined
  if (!manualData || typeof manualData !== 'object') {
    throw new Error('マニュアルデータが見つかりません')
  }
  const { title, industry, templateId, pages, thumbnailDataUrl } = manualData
  if (typeof title !== 'string' || typeof industry !== 'string' || typeof templateId !== 'string') {
    throw new Error('マニュアルデータが破損しています')
  }
  if (!Array.isArray(pages)) {
    throw new Error('ページデータが不正です')
  }

  return {
    title,
    industry,
    templateId,
    pages: pages as ManualPage[],
    thumbnailDataUrl: typeof thumbnailDataUrl === 'string' ? thumbnailDataUrl : '',
  }
}
