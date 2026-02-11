export default function BlockNav({ blocks, blockTitles, currentBlock, slides, goTo }) {
  return (
    <div className="flex items-center gap-1">
      {blocks.map(b => {
        const firstSlide = slides.findIndex(s => s.block === b)
        const isActive = b === currentBlock
        return (
          <button
            key={b}
            onClick={() => goTo(firstSlide)}
            className={`px-2 py-1 rounded text-[10px] transition-colors ${
              isActive
                ? 'bg-swiss-red/10 text-swiss-red font-bold'
                : 'hover:bg-swiss-gray/20 text-swiss-muted hover:text-swiss-black'
            }`}
            title={blockTitles[b]}
          >
            {String(b).padStart(2, '0')}
          </button>
        )
      })}
    </div>
  )
}
