import { useState, useEffect, useCallback } from 'react'
import slides from './data/slides'
import SlideRenderer from './components/SlideRenderer'
import ProgressBar from './components/ProgressBar'
import BlockNav from './components/BlockNav'
import InteractionMap from './components/layers/InteractionMap'
import AimSpirit from './components/spirit/AimSpirit'
import { Layers } from 'lucide-react'

function parseHash() {
  const hash = window.location.hash || ''
  if (hash === '#/map') return { view: 'map', slide: 0 }
  const m = hash.match(/^#\/slide\/(\d+)$/)
  if (m) {
    const idx = parseInt(m[1], 10) - 1
    if (idx >= 0 && idx < slides.length) return { view: 'slides', slide: idx }
  }
  return { view: 'slides', slide: null }
}

export default function App() {
  const [sessionStartTime] = useState(() => Date.now())
  const [current, setCurrent] = useState(() => {
    const fromHash = parseHash()
    if (fromHash.slide !== null) return fromHash.slide
    const saved = localStorage.getItem('ws04_slide')
    const idx = saved ? parseInt(saved, 10) : 0
    return idx >= 0 && idx < slides.length ? idx : 0
  })
  const [showLayers, setShowLayers] = useState(() => parseHash().view === 'map')
  const total = slides.length

  const go = useCallback((dir) => {
    setCurrent(prev => {
      const next = prev + dir
      if (next < 0) return 0
      if (next >= total) return total - 1
      return next
    })
  }, [total])

  const goTo = useCallback((idx) => {
    if (idx >= 0 && idx < total) setCurrent(idx)
  }, [total])

  useEffect(() => {
    localStorage.setItem('ws04_slide', String(current))
    if (!showLayers) {
      window.history.replaceState(null, '', `#/slide/${current + 1}`)
    }
  }, [current, showLayers])

  // Sync showLayers to URL
  useEffect(() => {
    if (showLayers) {
      window.history.replaceState(null, '', '#/map')
    }
  }, [showLayers])

  // Listen for back/forward navigation
  useEffect(() => {
    const onHashChange = () => {
      const parsed = parseHash()
      if (parsed.view === 'map') {
        setShowLayers(true)
      } else {
        setShowLayers(false)
        if (parsed.slide !== null) setCurrent(parsed.slide)
      }
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault()
        go(1)
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault()
        go(-1)
      }
      if (e.key === 'Home') { e.preventDefault(); goTo(0) }
      if (e.key === 'End') { e.preventDefault(); goTo(total - 1) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go, goTo, total])

  useEffect(() => {
    let startX = 0
    const onStart = (e) => { startX = e.touches[0].clientX }
    const onEnd = (e) => {
      const diff = startX - e.changedTouches[0].clientX
      if (Math.abs(diff) > 50) go(diff > 0 ? 1 : -1)
    }
    window.addEventListener('touchstart', onStart)
    window.addEventListener('touchend', onEnd)
    return () => {
      window.removeEventListener('touchstart', onStart)
      window.removeEventListener('touchend', onEnd)
    }
  }, [go])

  const slide = slides[current]
  const blocks = [...new Set(slides.map(s => s.block))]
  const blockTitles = {}
  slides.forEach(s => { blockTitles[s.block] = s.blockTitle })

  if (showLayers) {
    return <InteractionMap onBack={() => setShowLayers(false)} />
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-white overflow-hidden">
      <ProgressBar current={current} total={total} slide={slide} />
      <AimSpirit slide={slide} slideIndex={current} totalSlides={total} sessionStartTime={sessionStartTime} />

      {/* Fixed Explore Map button */}
      <button
        onClick={() => setShowLayers(true)}
        className="fixed top-16 right-6 z-40 flex items-center gap-2 px-4 py-2.5 text-white bg-swiss-red hover:bg-red-700 rounded-full font-bold tracking-wide transition-all shadow-lg text-xs"
      >
        <Layers className="w-4 h-4" />
        Explore Map
      </button>

      <main className="flex-1 overflow-visible flex items-center justify-center px-6 md:px-16 lg:px-24">
        <div key={slide.id} className="w-full max-w-5xl animate-fade-in">
          <SlideRenderer slide={slide} />
        </div>
      </main>

      <footer className="flex-shrink-0 px-6 py-3 flex items-center justify-between text-xs font-mono text-swiss-muted border-t border-swiss-gray">
        <BlockNav
          blocks={blocks}
          blockTitles={blockTitles}
          currentBlock={slide.block}
          slides={slides}
          goTo={goTo}
        />
        <div className="flex items-center gap-4">
          <button onClick={() => go(-1)} className="hover:text-swiss-black transition-colors px-2 py-1">&larr;</button>
          <span className="text-swiss-muted tabular-nums">{current + 1}/{total}</span>
          <button onClick={() => go(1)} className="hover:text-swiss-black transition-colors px-2 py-1">&rarr;</button>
        </div>
      </footer>
    </div>
  )
}
