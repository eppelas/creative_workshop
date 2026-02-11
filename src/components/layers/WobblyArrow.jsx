export function WobblyArrow({ startX, startY, endX, endY }) {
  const deltaX = endX - startX
  const deltaY = endY - startY
  const cp1x = startX + deltaX * 0.5
  const cp1y = startY
  const cp2x = endX - deltaX * 0.5
  const cp2y = endY
  const pathD = `M ${startX} ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endX} ${endY}`

  return (
    <svg className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-visible z-0" style={{ minWidth: '100%', minHeight: '100%' }}>
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#8b5cf6" opacity="0.6" />
        </marker>
      </defs>
      <path d={pathD} stroke="#8b5cf6" strokeWidth={2.5} fill="none" strokeLinecap="round" markerEnd="url(#arrowhead)" className="transition-all duration-500" style={{ opacity: 0.25 }} />
      <circle r={3} fill="#a78bfa">
        <animateMotion dur="3s" repeatCount="indefinite" path={pathD} keyPoints="0;1" keyTimes="0;1" calcMode="linear" />
        <animate attributeName="opacity" values="0;1;1;0" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle r={2} fill="#a78bfa" opacity="0.5">
        <animateMotion dur="3s" begin="-0.2s" repeatCount="indefinite" path={pathD} calcMode="linear" />
      </circle>
    </svg>
  )
}
