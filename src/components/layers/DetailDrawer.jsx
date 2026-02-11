import { useRef, useEffect } from 'react'
import { X, ExternalLink } from 'lucide-react'

export function DetailDrawer({ node, onClose }) {
  const bodyRef = useRef(null)

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = 0
  }, [node?.id])

  if (!node) return null

  return (
    <div className="fixed inset-y-0 right-0 w-[420px] max-w-[90vw] bg-white/95 backdrop-blur-xl shadow-2xl z-[100] flex flex-col border-l border-purple-100 animate-slide-in">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-purple-50">
        <div>
          <h2 className="text-lg font-bold text-slate-800">{node.title}</h2>
          <div className="text-[10px] uppercase tracking-wider text-purple-500 font-bold mt-1">{node.type} &middot; {node.timeEstimate}</div>
        </div>
        <button onClick={onClose} className="p-2 rounded-full hover:bg-purple-50 text-slate-400 hover:text-slate-600 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Body */}
      <div ref={bodyRef} className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Description */}
        <div>
          <p className="text-sm text-slate-600 leading-relaxed">{node.description}</p>
        </div>

        {/* Details */}
        {node.details && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Details</h3>
            <p className="text-sm text-slate-500 leading-relaxed">{node.details}</p>
          </div>
        )}

        {/* Tools list */}
        {node.tools && node.tools.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">{node.toolsLabel || 'Tools'}</h3>
            <div className="flex flex-wrap gap-2">
              {node.tools.map((t, i) => {
                const detail = node.toolDetails?.find(td => td.name === t)
                if (detail?.url) {
                  return (
                    <a key={i} href={detail.url} target="_blank" rel="noopener noreferrer" className="px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-medium hover:bg-purple-100 transition-colors cursor-pointer">
                      {t}
                    </a>
                  )
                }
                return <span key={i} className="px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-medium">{t}</span>
              })}
            </div>
          </div>
        )}

        {/* Tool Details */}
        {node.toolDetails && node.toolDetails.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">{node.toolsLabel ? `${node.toolsLabel} Details` : 'Tool Details'}</h3>
            {node.toolDetails.filter(t => !t.toolOnly).map((tool, i) => {
              const inner = (
                <>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold text-sm text-slate-800">{tool.name}</span>
                    {tool.url && <ExternalLink className="w-3.5 h-3.5 text-purple-400" />}
                    {tool.category && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-600 font-medium">{tool.category}</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mb-2">{tool.description}</p>
                  {tool.bestFor && <div className="text-xs text-slate-400"><span className="font-semibold text-slate-500">Best for:</span> {tool.bestFor}</div>}
                </>
              )
              if (tool.url) {
                return (
                  <a key={i} href={tool.url} target="_blank" rel="noopener noreferrer" className="block p-4 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100 hover:border-purple-200 transition-colors cursor-pointer no-underline">
                    {inner}
                  </a>
                )
              }
              return <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-100">{inner}</div>
            })}
          </div>
        )}

        {/* Tips */}
        {node.tips && node.tips.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Tips</h3>
            {node.tips.map((tip, i) => (
              <div key={i} className="p-4 rounded-xl bg-amber-50 border border-amber-100">
                {tip.title && <div className="font-bold text-sm text-amber-800 mb-1">{tip.title}</div>}
                <p className="text-xs text-amber-700 leading-relaxed whitespace-pre-line">{tip.text}</p>
              </div>
            ))}
          </div>
        )}

        {/* Cases */}
        {node.cases && node.cases.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Cases</h3>
            {node.cases.map((c, i) => (
              <div key={i} className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-sm text-emerald-800">{c.title}</span>
                  {c.url && (
                    <a href={c.url} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-600 transition-colors">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
                <p className="text-xs text-emerald-700">{c.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Connections */}
        {node.connections && node.connections.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Connections</h3>
            <div className="flex flex-wrap gap-2">
              {node.connections.map((c, i) => (
                <span key={i} className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-medium">{c}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
