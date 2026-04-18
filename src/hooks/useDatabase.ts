import { useState, useEffect, useCallback } from 'react'
import { db, type ManualRecord } from '../lib/db'

export interface ManualPage {
  id: string
  pageNumber: number
  canvasJson: string
  thumbnailDataUrl: string
}

export interface Manual {
  id: string
  title: string
  industry: string
  templateId: string
  pages: ManualPage[]
  createdAt: Date
  updatedAt: Date
  thumbnailDataUrl: string
}

function generateId(): string {
  return crypto.randomUUID?.() ?? Date.now().toString(36) + Math.random().toString(36).slice(2)
}

export function useDatabase() {
  const [manuals, setManuals] = useState<ManualRecord[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    const all = await db.manuals.orderBy('updatedAt').reverse().toArray()
    setManuals(all)
    setLoading(false)
  }, [])

  useEffect(() => { refresh() }, [refresh])

  const saveManual = useCallback(async (manual: Manual) => {
    const record: ManualRecord = {
      id: manual.id,
      title: manual.title,
      industry: manual.industry,
      templateId: manual.templateId,
      pages: JSON.stringify(manual.pages),
      thumbnailDataUrl: manual.thumbnailDataUrl,
      createdAt: manual.createdAt,
      updatedAt: new Date(),
    }
    await db.manuals.put(record)
    await refresh()
    return record
  }, [refresh])

  const loadManual = useCallback(async (id: string): Promise<Manual | null> => {
    const record = await db.manuals.get(id)
    if (!record) return null
    return {
      ...record,
      pages: JSON.parse(record.pages) as ManualPage[],
    }
  }, [])

  const deleteManual = useCallback(async (id: string) => {
    await db.manuals.delete(id)
    await refresh()
  }, [refresh])

  const duplicateManual = useCallback(async (id: string) => {
    const original = await loadManual(id)
    if (!original) return
    const newManual: Manual = {
      ...original,
      id: generateId(),
      title: original.title + ' (コピー)',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    await saveManual(newManual)
  }, [loadManual, saveManual])

  const getRecentManuals = useCallback(async (limit = 5): Promise<ManualRecord[]> => {
    return db.manuals.orderBy('updatedAt').reverse().limit(limit).toArray()
  }, [])

  const createManual = useCallback((title: string, industry: string, templateId: string, pages: ManualPage[]): Manual => {
    return {
      id: generateId(),
      title,
      industry,
      templateId,
      pages,
      createdAt: new Date(),
      updatedAt: new Date(),
      thumbnailDataUrl: '',
    }
  }, [])

  return {
    manuals,
    loading,
    saveManual,
    loadManual,
    deleteManual,
    duplicateManual,
    getRecentManuals,
    createManual,
    refresh,
  }
}
