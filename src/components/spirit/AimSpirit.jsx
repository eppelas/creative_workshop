import { useRef, useEffect, useState } from 'react'
import { createSpiritEngine } from './spiritEngine'

export default function AimSpirit({ slide, slideIndex, totalSlides, sessionStartTime }) {
  const canvasRef = useRef(null)
  const engineRef = useRef(null)
  const [visible, setVisible] = useState(true)

  // init engine
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const engine = createSpiritEngine(canvas)
    engineRef.current = engine
    engine.start()
    return () => engine.stop()
  }, [])

  // sync slide
  useEffect(() => {
    if (engineRef.current && slide) {
      engineRef.current.setSlide(slide, slideIndex, totalSlides)
    }
  }, [slide, slideIndex, totalSlides])

  // sync session time
  useEffect(() => {
    if (engineRef.current && sessionStartTime) {
      const elapsed = (Date.now() - sessionStartTime) / 1000
      engineRef.current.setSessionTime(elapsed)
    }
  }, [sessionStartTime, slideIndex])

  // toggle with 's' key (no modifier needed)
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 's' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        // don't intercept if user is typing in an input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
        e.preventDefault()
        setVisible(v => !v)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 40,
        pointerEvents: 'none',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.5s ease',
      }}
    />
  )
}
