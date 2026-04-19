import { useNavigate } from 'react-router-dom'
import { industries } from '../data/industries'

export default function IndustryPage() {
  const navigate = useNavigate()

  return (
    <div className="p-5">
      <p className="font-display text-[13px] font-bold text-text-muted uppercase tracking-[2px] mb-4">業種を選択</p>
      <div className="grid grid-cols-2 gap-3">
        {industries.map((ind) => (
          <button
            key={ind.id}
            onClick={() => navigate(`/template/${ind.id}`)}
            className="bg-white rounded-2xl p-5 pt-5 pb-4 text-center cursor-pointer border-2 border-border-soft shadow-[0_2px_8px_rgba(234,88,12,0.06)] hover:border-primary hover:translate-y-[-2px] hover:shadow-[0_8px_24px_rgba(234,88,12,0.15)] tap-feedback transition-all"
          >
            <span className="text-4xl block mb-2.5">{ind.emoji}</span>
            <span className="font-display text-[14px] font-bold text-text-primary">{ind.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
