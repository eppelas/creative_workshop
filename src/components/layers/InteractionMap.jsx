import { useState, useRef, useEffect, useCallback } from 'react'
import { SCHEMA_NODES } from './constants'
import { NodeCard } from './NodeCard'
import { DetailDrawer } from './DetailDrawer'
import { WobblyArrow } from './WobblyArrow'
import { CustomCursor } from './CustomCursor'
import { RotateCcw, ArrowLeft, Plus, Minus } from 'lucide-react'

const INITIAL_OFFSET_X = 200
const INITIAL_OFFSET_Y = 150
const GRID_X_SPACING = 385
const GRID_Y_SPACING = 380
const STORAGE_KEY = 'interaction_map_nodes_v17'

export default function InteractionMap({ onBack }) {
  const [nodes, setNodes] = useState(() => {
    let savedPositions = {}
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        JSON.parse(saved).forEach(n => { savedPositions[n.id] = { posX: n.posX, posY: n.posY } })
      }
    } catch (e) { console.warn(e) }
    return SCHEMA_NODES.map(node => ({
      ...node,
      posX: savedPositions[node.id]?.posX ?? (INITIAL_OFFSET_X + (node.x || 0) * GRID_X_SPACING + (Math.random() * 10 - 5)),
      posY: savedPositions[node.id]?.posY ?? (INITIAL_OFFSET_Y + (node.y || 0) * GRID_Y_SPACING + (Math.random() * 10 - 5))
    }))
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nodes))
  }, [nodes])

  const [selectedNode, setSelectedNode] = useState(null)
  const [scale, setScale] = useState(0.55)
  const [isDragging, setIsDragging] = useState(false)
  const [draggedNodeId, setDraggedNodeId] = useState(null)
  const containerRef = useRef(null)

  const handleDragStart = (e, id) => {
    e.stopPropagation()
    setDraggedNodeId(id)
    setIsDragging(true)
  }

  const handleMouseMove = useCallback((e) => {
    if (!isDragging || !draggedNodeId) return
    const deltaX = e.movementX / scale
    const deltaY = e.movementY / scale
    setNodes(prev => prev.map(node => {
      if (node.id === draggedNodeId) {
        return { ...node, posX: (node.posX || 0) + deltaX, posY: (node.posY || 0) + deltaY }
      }
      return node
    }))
  }, [isDragging, draggedNodeId, scale])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    setDraggedNodeId(null)
  }, [])

  const handleUpdateNode = (id, field, value) => {
    setNodes(prev => prev.map(n => n.id === id ? { ...n, [field]: value } : n))
  }

  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget || e.target.getAttribute('data-bg') === 'true') {
      setSelectedNode(null)
    }
  }

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const onWheel = (e) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault()
        setScale(prev => Math.min(Math.max(prev - e.deltaY * 0.005, 0.2), 3))
      }
    }
    container.addEventListener('wheel', onWheel, { passive: false })
    return () => container.removeEventListener('wheel', onWheel)
  }, [])

  // Compute content bounds with large padding for free scrolling in all directions
  const CARD_W = 320, CARD_H = 200, EDGE_PAD = 200
  const CANVAS_PAD = 2000 // extra space on all sides for free scrolling
  const xs = nodes.map(n => n.posX || 0)
  const ys = nodes.map(n => n.posY || 0)
  const contentW = CANVAS_PAD * 2 + Math.max(...xs) + CARD_W + EDGE_PAD
  const contentH = CANVAS_PAD * 2 + Math.max(...ys) + CARD_H + EDGE_PAD

  // Center cards in viewport on mount
  useEffect(() => {
    const center = () => {
      const container = containerRef.current
      if (!container || nodes.length === 0) return
      const vw = container.clientWidth
      const vh = container.clientHeight
      // Scroll so the CANVAS_PAD offset (where cards start) is centered
      const cardsW = (Math.max(...xs) + CARD_W) * scale
      const cardsH = (Math.max(...ys) + CARD_H) * scale
      const offsetX = CANVAS_PAD * scale
      const offsetY = CANVAS_PAD * scale
      container.scrollLeft = offsetX + (cardsW - vw) * 0.35
      container.scrollTop = offsetY + (cardsH - vh) / 2
    }
    requestAnimationFrame(() => requestAnimationFrame(center))
    const t = setTimeout(center, 150)
    return () => clearTimeout(t)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  const arrows = nodes.flatMap(sourceNode => {
    if (!sourceNode.connections) return []
    return sourceNode.connections.map(targetId => {
      const targetNode = nodes.find(n => n.id === targetId)
      if (!targetNode) return null
      const cardWidth = 320
      const cardHeight = 200
      return (
        <WobblyArrow
          key={`${sourceNode.id}-${targetId}`}
          startX={(sourceNode.posX || 0) + CANVAS_PAD + cardWidth / 2}
          startY={(sourceNode.posY || 0) + CANVAS_PAD + cardHeight / 2}
          endX={(targetNode.posX || 0) + CANVAS_PAD + cardWidth / 2}
          endY={(targetNode.posY || 0) + CANVAS_PAD + cardHeight / 2}
        />
      )
    }).filter(Boolean)
  })

  return (
    <div className="w-full h-full min-h-screen relative font-sans selection:bg-purple-500 selection:text-white cursor-none bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 text-slate-800 overflow-hidden">
      <CustomCursor />

      {/* Back button */}
      <div className="fixed top-6 left-6 z-50">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 hover:bg-white text-slate-600 hover:text-slate-800 transition-colors shadow-lg backdrop-blur-sm text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Slides
        </button>
      </div>

      <main
        ref={containerRef}
        className="absolute inset-0 overflow-auto cursor-none"
        onClick={handleBackgroundClick}
        data-bg="true"
      >
        {/* Sizing wrapper: scrollable area = content * scale */}
        <div style={{ width: `${contentW * scale}px`, height: `${contentH * scale}px` }} data-bg="true">
          <div
            className="relative origin-top-left transition-transform duration-75 ease-linear"
            style={{
              transform: `scale(${scale})`,
              width: `${contentW}px`,
              height: `${contentH}px`,
              backgroundImage: `
                linear-gradient(to right, rgba(139,92,246,0.04) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(139,92,246,0.15) 1px, transparent 1px)
              `,
              backgroundSize: `${GRID_X_SPACING}px ${GRID_Y_SPACING}px`,
              backgroundPosition: `${INITIAL_OFFSET_X - 40}px ${INITIAL_OFFSET_Y - 30}px`
            }}
            data-bg="true"
          >
            <div className="absolute inset-0 pointer-events-none z-0">
              {arrows}
            </div>

            {nodes.map(node => (
              <NodeCard
                key={node.id}
                node={node}
                isSelected={selectedNode?.id === node.id}
                onSelect={setSelectedNode}
                onUpdate={handleUpdateNode}
                onDragStart={handleDragStart}
                style={{ transform: `translate(${(node.posX || 0) + CANVAS_PAD}px, ${(node.posY || 0) + CANVAS_PAD}px)` }}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Zoom & Reset Controls */}
      <div className="fixed bottom-8 right-8 z-50 flex items-center gap-2">
        <button
          onClick={() => setScale(prev => Math.min(prev + 0.1, 3))}
          className="p-3 rounded-full bg-white/80 hover:bg-white text-slate-600 hover:text-slate-800 transition-colors shadow-lg backdrop-blur-sm"
          title="Zoom In"
        >
          <Plus className="w-5 h-5" />
        </button>
        <button
          onClick={() => setScale(prev => Math.max(prev - 0.1, 0.2))}
          className="p-3 rounded-full bg-white/80 hover:bg-white text-slate-600 hover:text-slate-800 transition-colors shadow-lg backdrop-blur-sm"
          title="Zoom Out"
        >
          <Minus className="w-5 h-5" />
        </button>
        <button
          onClick={() => {
            if (window.confirm('Reset Layout?')) {
              localStorage.removeItem(STORAGE_KEY)
              window.location.reload()
            }
          }}
          className="p-3 rounded-full bg-white/80 hover:bg-white text-slate-400 hover:text-red-500 transition-colors shadow-lg backdrop-blur-sm"
          title="Reset Layout"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      <DetailDrawer
        node={selectedNode}
        onClose={() => setSelectedNode(null)}
      />
    </div>
  )
}
