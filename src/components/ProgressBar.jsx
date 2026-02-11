export default function ProgressBar({ current, total, slide }) {
  const pct = ((current + 1) / total) * 100

  return (
    <header className="flex-shrink-0 border-b border-swiss-gray">
      <div className="px-6 py-2 flex items-center justify-between text-xs font-mono">
        <span className="text-swiss-red font-bold tracking-wider">
          W26-WS04
        </span>
        <div className="flex items-center gap-4">
          {slide.blockTitle && (
            <span className="text-swiss-muted">{String(slide.block).padStart(2, '0')} — {slide.blockTitle}</span>
          )}
        </div>
      </div>
      <div className="h-1 bg-swiss-gray/30">
        <div
          className="h-full bg-swiss-red transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </header>
  )
}
