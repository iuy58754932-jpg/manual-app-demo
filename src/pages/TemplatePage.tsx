import { useParams, useNavigate } from 'react-router-dom'
import { templates } from '../data/templates'
import { industries } from '../data/industries'

export default function TemplatePage() {
  const { industryId } = useParams<{ industryId: string }>()
  const navigate = useNavigate()

  const industry = industries.find((i) => i.id === industryId)
  const filtered = templates.filter((t) => t.industry === industryId)

  const handleSelect = (templateId: string) => {
    navigate(`/editor?template=${templateId}`)
  }

  return (
    <div className="p-5">
      <p className="text-[13px] font-bold text-text-muted uppercase tracking-[2px] mb-1">
        {industry?.emoji} {industry?.name}
      </p>
      <p className="text-[13px] font-bold text-text-muted uppercase tracking-[2px] mb-4 mt-3">テンプレートを選択</p>

      <div className="flex flex-col gap-3">
        {filtered.map((tmpl) => (
          <button
            key={tmpl.id}
            onClick={() => handleSelect(tmpl.id)}
            className="flex items-start gap-4 p-4 bg-white rounded-xl border-2 border-transparent shadow-[0_2px_12px_rgba(30,39,97,0.08)] hover:border-accent hover:shadow-[0_8px_32px_rgba(30,39,97,0.12)] tap-feedback transition-all cursor-pointer text-left w-full"
          >
            <div className="w-16 h-20 rounded-lg bg-bg flex items-center justify-center text-3xl shrink-0">
              📋
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[15px] font-bold text-text-primary">{tmpl.name}</p>
              <p className="text-[12px] text-text-muted mt-1">{tmpl.description}</p>
              <div className="flex gap-2 mt-2">
                <span className="text-[11px] bg-sky text-primary px-2 py-0.5 rounded-md font-medium">
                  {tmpl.paperSize}
                </span>
                <span className="text-[11px] bg-bg text-text-muted px-2 py-0.5 rounded-md">
                  {tmpl.pages.length}ページ
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-text-muted">
          <p className="text-4xl mb-3">📭</p>
          <p className="text-[14px]">テンプレートがありません</p>
        </div>
      )}
    </div>
  )
}
