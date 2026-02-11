import { forwardRef } from 'react'
import { NodeType } from './constants'
import { MessageSquare, Code, Palette, Server, Music, PenTool, Box } from 'lucide-react'

const icons = {
  [NodeType.MINDSET]: MessageSquare,
  [NodeType.CODING]: Code,
  [NodeType.CREATIVE]: Palette,
  [NodeType.MUSIC]: Music,
  [NodeType.DESIGN]: PenTool,
  [NodeType.INFRA]: Server,
}

export const NodeCard = forwardRef(({ node, onSelect, onUpdate, onDragStart, isSelected, style }, ref) => {
  const Icon = icons[node.type] || Box
  const isLevel = node.isLevel
  const isSecondary = node.secondary

  const handleCardClick = () => {
    onSelect(node)
  }

  if (isLevel) {
    return (
      <div
        ref={ref}
        style={style}
        onClick={handleCardClick}
        className={`absolute w-80 flex flex-col overflow-hidden group cursor-pointer select-none
          transition-all duration-500 rounded-2xl border-2
          ${isSelected ? 'bg-slate-800 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.4)] scale-105 z-50 border-red-500/50' : 'bg-slate-900 hover:bg-slate-800 shadow-xl border-slate-700/50 z-10'}
        `}
      >
        <div
          className="h-7 w-full cursor-grab active:cursor-grabbing flex items-center justify-between px-4 border-b border-white/10"
          onMouseDown={(e) => onDragStart(e, node.id)}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-red-400 opacity-70"></div></div>
          <div className="text-[10px] font-mono uppercase font-bold text-slate-400">{node.timeEstimate}</div>
        </div>
        <div className="p-8 min-h-[280px] flex flex-col justify-center">
          <div className="mb-3 text-white font-sans font-extrabold text-lg tracking-tight">{node.title}</div>
          <div className="text-sm leading-relaxed text-slate-400 font-medium">{node.description}</div>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={ref}
      style={style}
      onClick={handleCardClick}
      className={`absolute w-80 flex flex-col overflow-hidden group cursor-pointer select-none
        backdrop-blur-xl transition-all duration-500 border border-white/20 rounded-3xl
        ${isSelected ? 'bg-white/80 shadow-[0_20px_40px_-10px_rgba(139,92,246,0.2)] scale-105 z-50' : isSecondary ? 'bg-white/30 hover:bg-white/50 shadow-md border-white/30 z-[5]' : 'bg-white/40 hover:bg-white/60 shadow-lg border-white/40 z-10'}
      `}
    >
      <div
        className={`h-8 w-full cursor-grab active:cursor-grabbing flex items-center justify-between px-4 border-b border-black/5 ${isSelected ? 'bg-purple-500/10 text-purple-600' : 'bg-transparent text-gray-400'}`}
        onMouseDown={(e) => onDragStart(e, node.id)}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-current opacity-50"></div></div>
        <div className="text-[10px] font-mono uppercase font-bold opacity-70">{node.type}</div>
      </div>
      <div className="p-5 flex flex-col h-full">
        <div className="flex items-start gap-3 mb-4">
          <div className="mt-1 text-purple-500"><Icon className="w-5 h-5" /></div>
          <div className="flex-1 min-w-0">
            <div className="mb-1 text-slate-800 font-sans font-bold">{node.title}</div>
            <div className="text-[10px] uppercase tracking-wider opacity-60 text-slate-500 font-medium">{node.timeEstimate}</div>
          </div>
        </div>
        <div className="text-sm leading-relaxed mb-4 text-slate-500 font-medium">{node.description}</div>
      </div>
    </div>
  )
})

NodeCard.displayName = 'NodeCard'
