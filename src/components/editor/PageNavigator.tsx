interface Page {
  id: string
  thumbnailDataUrl: string
  pageNumber: number
}

interface PageNavigatorProps {
  pages: Page[]
  currentPage: number
  onSelectPage: (index: number) => void
  onAddPage: () => void
  onDeletePage: (index: number) => void
}

export default function PageNavigator({
  pages, currentPage, onSelectPage, onAddPage, onDeletePage,
}: PageNavigatorProps) {
  return (
    <div className="bg-white border-t border-border px-3 py-2 safe-bottom">
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
        {pages.map((page, i) => (
          <button
            key={page.id}
            onClick={() => onSelectPage(i)}
            onContextMenu={(e) => {
              e.preventDefault()
              if (pages.length > 1 && confirm(`ページ ${i + 1} を削除しますか？`)) {
                onDeletePage(i)
              }
            }}
            className={`shrink-0 w-14 h-20 rounded-lg border-2 overflow-hidden cursor-pointer tap-feedback transition-all relative ${
              currentPage === i
                ? 'border-accent shadow-[0_0_0_2px_rgba(8,145,178,0.2)]'
                : 'border-border hover:border-accent/50'
            }`}
          >
            {page.thumbnailDataUrl ? (
              <img src={page.thumbnailDataUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-bg flex items-center justify-center text-text-muted text-[10px]">
                {i + 1}
              </div>
            )}
            <span className="absolute bottom-0.5 right-1 text-[9px] font-bold text-text-muted bg-white/80 px-1 rounded">
              {i + 1}
            </span>
          </button>
        ))}
        <button
          onClick={onAddPage}
          className="shrink-0 w-14 h-20 rounded-lg border-2 border-dashed border-border bg-transparent cursor-pointer hover:border-accent hover:bg-sky transition-all flex items-center justify-center text-accent text-xl font-bold tap-feedback"
        >
          +
        </button>
      </div>
    </div>
  )
}
