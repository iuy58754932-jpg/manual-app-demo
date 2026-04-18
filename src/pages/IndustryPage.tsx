import { useNavigate } from 'react-router-dom'
import { industries } from '../data/industries'

export default function IndustryPage() {
  const navigate = useNavigate()

  return (
    <div className="p-5">
      <p className="text-[13px] font-bold text-text-muted uppercase tracking-[2px] mb-4">業種を選択</p>
      <div className="grid grid-cols-2 gap-3">
        {industries.map((ind) => (
          <button
            key={ind.id}
            onClick={() => navigate(`/template/${ind.id}`)}
            className="bg-white rounded-xl p-5 pt-5 pb-4 text-center cursor-pointer border-2 border-transparent shadow-[0_2px_12px_rgba(30,39,97,0.08)] hover:border-accent hover:translate-y-[-2px] hover:shadow-[0_8px_32px_rgba(30,39,97,0.12)] tap-feedback transition-all"
          >
            <span className="text-4xl block mb-2.5">{ind.emoji}</span>
            <span className="text-[14px] font-bold text-text-primary">{ind.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
