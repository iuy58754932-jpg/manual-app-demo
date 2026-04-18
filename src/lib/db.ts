import Dexie, { type Table } from 'dexie'

export interface ManualRecord {
  id: string
  title: string
  industry: string
  templateId: string
  pages: string // JSON stringified ManualPage[]
  thumbnailDataUrl: string
  createdAt: Date
  updatedAt: Date
}

class ManualDatabase extends Dexie {
  manuals!: Table<ManualRecord>

  constructor() {
    super('ManualAppDB')
    this.version(1).stores({
      manuals: 'id, title, industry, updatedAt',
    })
  }
}

export const db = new ManualDatabase()
