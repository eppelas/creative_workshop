// ═══════════════════════════════════════════════════════════════
// Spirit Engine — voxel-art character, perimeter wandering
// Inspired by Tanki (anca-image-to-voxel-art) visual style
// Swiss palette: #171717 black, #D4D4D4 gray, #DC2626 red
// ═══════════════════════════════════════════════════════════════

import { PHRASES, pick, getSlideRemark, getBlockEnergy } from './spiritPersonality'
import { getPacingHint } from './spiritPacing'

const BLACK = '#171717'
const GRAY  = '#D4D4D4'
const MUTED = '#737373'
const RED   = '#DC2626'
const WHITE = '#FFFFFF'

// isometric projection helpers
const ISO_ANGLE = Math.PI / 6 // 30 degrees
const COS_A = Math.cos(ISO_ANGLE)
const SIN_A = Math.sin(ISO_ANGLE)

function isoX(x, y, z) { return (x - z) * COS_A }
function isoY(x, y, z) { return -y + (x + z) * SIN_A }

const CONFIG = {
  voxelSize: 3,           // size of each voxel cube in px
  scale: 1.0,             // overall character scale

  bubbleBackground: 'rgba(23,23,23,0.92)',
  bubbleText: '#bbb',
  bubbleFontSize: 11,
  bubbleFontWeight: 400,

  wanderSpeed: 0.015,
  maxSpeed: 1.8,
  friction: 0.978,
  gravity: 0.003,
  bounciness: 0.4,

  perimeterMargin: 80,    // how far from edge the character stays
  perimeterInner: 200,    // inner boundary — don't go into content area

  cursorRadius: 100,
  cursorChaseForce: 0.02,
  clickPushForce: 2,
  manyClickThreshold: 5,

  sleepAfterIdle: 30,
  sleepCornerPadding: 40,
  wakeRadius: 60,

  phases: {
    newcomer:    { after: 0,    eyeScale: 1.3, glyphOpacity: 0.3, bodyHue: 0 },
    comfortable: { after: 60,   eyeScale: 1.1, glyphOpacity: 0.5, bodyHue: 0 },
    inspired:    { after: 180,  eyeScale: 1.0, glyphOpacity: 0.8, bodyHue: 0 },
    deep:        { after: 420,  eyeScale: 0.9, glyphOpacity: 1.0, bodyHue: 0 },
  },
}

// ─── VOXEL CHARACTER MODEL ──────────────────────────────────
// Each voxel: [x, y, z, colorIndex]
// colorIndex: 0=black, 1=gray, 2=red, 3=white, 4=dark-gray, 5=light-gray, 6=blush

const COLORS = [BLACK, GRAY, RED, WHITE, '#333333', '#AAAAAA', 'rgba(220,38,38,0.5)']

// growth: 0.0 (start) → 1.0 (end of presentation)
// The character literally grows: taller body, crown branches, red aura, wider stance
function buildCharacterModel(growth = 0) {
  const voxels = []
  const v = (x, y, z, c) => voxels.push([x, y, z, c])

  // growth stages: seed(0-0.15) → sprout(0.15-0.35) → growing(0.35-0.6) → blooming(0.6-0.85) → full(0.85-1.0)
  const g = Math.max(0, Math.min(1, growth))

  // === BASE BODY ===
  const bodyHeight = Math.floor(2 + g * 3) // 2→5 tall
  const bodyWidth = g > 0.3 ? 1 : 0        // widens at 30%
  for (let y = 0; y < bodyHeight; y++) {
    for (let x = -bodyWidth; x <= bodyWidth; x++) {
      v(x, y, 0, y < 2 ? 0 : 4)
      if (y < bodyHeight - 1) v(x, y, 1, 4)
    }
  }

  // shoulders (appear at 20%)
  if (g > 0.2) {
    const sw = g > 0.5 ? 2 : 1
    v(-sw, bodyHeight - 1, 0, 1)
    v(sw, bodyHeight - 1, 0, 1)
  }

  // === HEAD (always present, grows) ===
  const headBase = bodyHeight
  const headSize = g > 0.5 ? 2 : (g > 0.15 ? 2 : 1)
  const headTop = headBase + 3 + Math.floor(g * 2) // taller head as grows

  for (let y = headBase; y < headTop; y++) {
    for (let x = -headSize; x <= headSize; x++) {
      for (let z = -1; z <= 1; z++) {
        if (Math.abs(x) === headSize && Math.abs(z) === 1 && (y === headBase || y === headTop - 1)) continue
        if (Math.abs(x) === headSize && y === headTop - 1) continue
        v(x, y, z, 0)
      }
    }
  }
  // head crown row
  v(-1, headTop, 0, 0); v(0, headTop, 0, 0); v(1, headTop, 0, 0)

  // === EYES ===
  const eyeY = headBase + Math.floor((headTop - headBase) * 0.6)
  v(-1, eyeY, -2, 3)
  v(1, eyeY, -2, 3)

  // === BLUSH (appears at 25%) ===
  if (g > 0.25) {
    v(-headSize, eyeY - 1, -1, 6)
    v(headSize, eyeY - 1, -1, 6)
  }

  // === AIM GLYPH (grows brighter with progress) ===
  v(0, headTop - 1, -2, 2)
  if (g > 0.4) {
    v(-1, headTop - 1, -2, 2) // wider glyph
    v(1, headTop - 1, -2, 2)
  }

  // === LEGS (grow longer) ===
  const legLen = 1 + Math.floor(g * 2) // 1→3
  for (let i = 1; i <= legLen; i++) {
    v(-1, -i, 0, i === legLen ? 1 : 4)
    v(1, -i, 0, i === legLen ? 1 : 4)
  }
  // feet
  v(-1, -legLen - 1, 0, 1); v(-1, -legLen - 1, -1, 1)
  v(1, -legLen - 1, 0, 1);  v(1, -legLen - 1, -1, 1)

  // ═══ GROWTH FEATURES (branches, crown, etc.) ═══

  // === BRANCHES from shoulders (appear at 35%) ===
  if (g > 0.35) {
    const branchLen = Math.floor(1 + (g - 0.35) * 6) // 1→5
    for (let i = 1; i <= branchLen; i++) {
      // left branch goes up-left
      v(-headSize - i, bodyHeight + i - 1, 0, i % 2 === 0 ? 2 : 1)
      // right branch goes up-right
      v(headSize + i, bodyHeight + i - 1, 0, i % 2 === 0 ? 2 : 1)
    }
    // branch tips get red leaves at 50%
    if (g > 0.5) {
      const tip = branchLen
      v(-headSize - tip, bodyHeight + tip, 0, 2)
      v(-headSize - tip + 1, bodyHeight + tip, 0, 2)
      v(headSize + tip, bodyHeight + tip, 0, 2)
      v(headSize + tip - 1, bodyHeight + tip, 0, 2)
    }
  }

  // === CROWN / ANTENNA (appears at 50%) ===
  if (g > 0.5) {
    const crownH = Math.floor(1 + (g - 0.5) * 6) // 1→4
    for (let i = 1; i <= crownH; i++) {
      v(0, headTop + i, 0, i === crownH ? 2 : 4)
    }
    // crown spreads at 70%
    if (g > 0.7) {
      const top = headTop + crownH
      v(-1, top, 0, 2); v(1, top, 0, 2)
      v(-2, top - 1, 0, 2); v(2, top - 1, 0, 2)
    }
    // crown blooms at 85%
    if (g > 0.85) {
      const top = headTop + crownH
      v(0, top + 1, 0, 2)
      v(-1, top + 1, 0, 2); v(1, top + 1, 0, 2)
      v(0, top + 2, 0, 2)
      // side sprouts
      v(-3, headTop + 1, 0, 1); v(-3, headTop + 2, 0, 2)
      v(3, headTop + 1, 0, 1); v(3, headTop + 2, 0, 2)
    }
  }

  // === BODY DETAIL / PATTERN (appears at 40%) ===
  if (g > 0.4 && bodyHeight > 3) {
    v(0, 2, -1, 2) // red heart/core
    if (g > 0.6) {
      v(-1, 2, -1, 2); v(1, 2, -1, 2) // wider core
    }
  }

  // === AURA VOXELS (floating around, appear at 60%) ===
  if (g > 0.6) {
    const auraCount = Math.floor((g - 0.6) * 12) // 0→5
    const auraPositions = [
      [-4, headTop - 2, -1], [4, headTop - 2, -1],
      [-3, bodyHeight + 3, 2], [3, bodyHeight + 3, 2],
      [0, headTop + 5, 0],
    ]
    for (let i = 0; i < Math.min(auraCount, auraPositions.length); i++) {
      const [ax, ay, az] = auraPositions[i]
      v(ax, ay, az, i % 2 === 0 ? 2 : 5) // alternating red and light-gray
    }
  }

  return voxels
}

// cache to avoid rebuilding every frame
let cachedGrowth = -1
let cachedModel = buildCharacterModel(0)

// ═══════════════════════════════════════════════════════════════

export function createSpiritEngine(canvas) {
  const ctx = canvas.getContext('2d')
  let W = 0, H = 0, dt = 0.016, time = 0, sessionTime = 0
  // ─── RAGE GROWTH: spirit grows 8x over 5 minutes ───
  const RAGE_DURATION = 300
  const RAGE_MAX_SCALE = 8
  const rageStartTime = Date.now() / 1000
  function getRageFactor() {
    const elapsed = Date.now() / 1000 - rageStartTime
    if (elapsed <= 0) return 1
    const t = Math.min(elapsed / RAGE_DURATION, 1)
    return 1 + (RAGE_MAX_SCALE - 1) * t * t
  }
  function getRageSpeed() { return 1 + (getRageFactor() - 1) * 0.6 }
  let mouse = { x: -9999, y: -9999, active: false }
  let fontReady = false
  let animId = null

  let currentSlide = null
  let slideIndex = 0
  let totalSlides = 1
  let slideDwellTime = 0
  let lastPacingHintTime = 0

  document.fonts.ready.then(() => { fontReady = true })

  // ─── phase system ──────────────────────────────

  function getCurrentPhase() {
    const p = CONFIG.phases
    if (sessionTime >= p.deep.after) return 'deep'
    if (sessionTime >= p.inspired.after) return 'inspired'
    if (sessionTime >= p.comfortable.after) return 'comfortable'
    return 'newcomer'
  }

  function getPhaseData() {
    return CONFIG.phases[getCurrentPhase()]
  }

  let lastPhase = 'newcomer'

  // ─── particles (voxel-style squares) ───────────

  const particles = []

  function spawnParticles(x, y, count, color) {
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2
      const s = 0.5 + Math.random() * 2
      particles.push({
        x, y,
        vx: Math.cos(a) * s,
        vy: Math.sin(a) * s - 0.5,
        life: 1,
        decay: 0.015 + Math.random() * 0.015,
        size: 1.5 + Math.random() * 2.5,
        color,
        rot: Math.random() * Math.PI,
        rotV: (Math.random() - 0.5) * 0.1,
      })
    }
  }

  function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i]
      p.x += p.vx; p.y += p.vy; p.vy += 0.015; p.life -= p.decay
      p.rot += p.rotV
      if (p.life <= 0) particles.splice(i, 1)
    }
  }

  function drawParticles() {
    for (const p of particles) {
      ctx.save()
      ctx.globalAlpha = p.life * 0.6
      ctx.translate(p.x, p.y)
      ctx.rotate(p.rot)
      ctx.fillStyle = p.color
      // square particles for voxel feel
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size)
      ctx.restore()
    }
    ctx.globalAlpha = 1
  }

  // ─── ambient floating voxels ───────────────────

  const ambientVoxels = []
  function initAmbientVoxels() {
    for (let i = 0; i < 6; i++) {
      ambientVoxels.push({
        offsetX: (Math.random() - 0.5) * 60,
        offsetY: -20 - Math.random() * 30,
        phase: Math.random() * Math.PI * 2,
        speed: 0.3 + Math.random() * 0.5,
        size: 1.5 + Math.random() * 2,
        color: Math.random() > 0.3 ? GRAY : RED,
        rotPhase: Math.random() * Math.PI * 2,
      })
    }
  }
  initAmbientVoxels()

  function drawAmbientVoxels(cx, cy) {
    const phase = getPhaseData()
    const growth = totalSlides > 1 ? slideIndex / (totalSlides - 1) : 0
    // more ambient voxels visible as character grows
    const visibleCount = Math.floor(2 + growth * 4)
    ctx.globalAlpha = phase.glyphOpacity * (0.15 + growth * 0.2)
    for (let idx = 0; idx < Math.min(visibleCount, ambientVoxels.length); idx++) {
      const av = ambientVoxels[idx]
      const px = cx + av.offsetX + Math.sin(time * av.speed + av.phase) * 8
      const py = cy + av.offsetY + Math.cos(time * av.speed * 0.7 + av.phase) * 4
      ctx.save()
      ctx.translate(px, py)
      ctx.rotate(time * 0.3 + av.rotPhase)
      ctx.fillStyle = av.color
      ctx.fillRect(-av.size / 2, -av.size / 2, av.size, av.size)
      ctx.restore()
    }
    ctx.globalAlpha = 1
  }

  // ─── speech bubble ─────────────────────────────

  const bubble = { text: '', timer: 0, duration: 0, opacity: 0, slideY: 0, charReveal: 0 }

  function say(text, dur = 2.8) {
    bubble.text = text
    bubble.timer = 0
    bubble.duration = dur
    bubble.opacity = 0
    bubble.slideY = 6
    bubble.charReveal = 0
  }

  function updateBubble() {
    if (bubble.opacity <= 0 && bubble.timer === 0 && bubble.slideY <= 0) return
    bubble.timer += dt
    if (bubble.timer < 0.25) {
      bubble.opacity = Math.min(1, bubble.timer / 0.25)
    } else if (bubble.timer < bubble.duration - 0.6) {
      bubble.opacity = 1
    } else if (bubble.timer < bubble.duration) {
      bubble.opacity = Math.max(0, (bubble.duration - bubble.timer) / 0.6)
    } else {
      bubble.opacity = 0
    }
    bubble.slideY += (0 - bubble.slideY) * 0.15
    bubble.charReveal = Math.min(bubble.text.length, bubble.charReveal + 12 * dt)
  }

  function wrapText(ctx, text, maxW) {
    const words = text.split(' ')
    const lines = []; let line = ''
    for (const w of words) {
      const test = line ? line + ' ' + w : w
      if (ctx.measureText(test).width > maxW && line) { lines.push(line); line = w }
      else line = test
    }
    if (line) lines.push(line)
    return lines
  }

  function drawBubble(x, y) {
    if (bubble.opacity <= 0.01 || !fontReady) return
    ctx.save()
    ctx.font = `${CONFIG.bubbleFontWeight} ${CONFIG.bubbleFontSize}px "IBM Plex Mono", monospace`
    const displayText = bubble.text.slice(0, Math.floor(bubble.charReveal))
    const maxLineW = Math.min(280, W * 0.35)
    const lines = wrapText(ctx, displayText, maxLineW)
    const lineH = CONFIG.bubbleFontSize + 3
    const pad = 9
    const bw = Math.min(maxLineW + pad * 2, lines.reduce((m, l) => Math.max(m, ctx.measureText(l).width), 0) + pad * 2)
    const bh = lineH * lines.length + pad * 2 - 2
    let bx = Math.max(6, Math.min(W - bw - 6, x - bw / 2))
    let by = Math.max(6, y - 50 - (lines.length - 1) * lineH + bubble.slideY)
    ctx.globalAlpha = bubble.opacity * 0.95

    // shadow
    ctx.fillStyle = 'rgba(0,0,0,0.15)'
    ctx.fillRect(bx + 2, by + 2, bw, bh)
    // bg
    ctx.fillStyle = CONFIG.bubbleBackground
    ctx.fillRect(bx, by, bw, bh)
    // tiny red accent line at top
    ctx.fillStyle = RED
    ctx.fillRect(bx, by, bw, 1.5)
    // text
    ctx.textBaseline = 'middle'
    ctx.fillStyle = CONFIG.bubbleText
    lines.forEach((l, i) => ctx.fillText(l, bx + pad, by + pad + lineH * i + lineH / 2))
    ctx.restore()
  }

  // ─── zzz ───────────────────────────────────────

  const zzzList = []
  function updateZzz(sleeping, x, y) {
    if (sleeping && Math.random() < 0.012) {
      zzzList.push({ x: x + 8, y: y - 15, vx: 0.15, vy: -0.25, life: 1, size: 7 + Math.random() * 3 })
    }
    for (let i = zzzList.length - 1; i >= 0; i--) {
      const z = zzzList[i]; z.x += z.vx; z.y += z.vy; z.life -= 0.005; z.size += 0.02
      if (z.life <= 0) zzzList.splice(i, 1)
    }
  }
  function drawZzz() {
    if (!fontReady) return
    for (const z of zzzList) {
      ctx.globalAlpha = z.life * 0.3
      ctx.font = `300 ${Math.round(z.size)}px "IBM Plex Mono", monospace`
      ctx.fillStyle = MUTED; ctx.fillText('z', z.x, z.y)
    }
    ctx.globalAlpha = 1
  }

  // ─── character state ───────────────────────────

  const ch = {
    x: 0, y: 0, vx: 0, vy: 0,
    sleeping: false, sleepTimer: 0, sleepTarget: null, sleepBreath: 0,
    idleTimer: 0, clickCount: 0, clickReset: 0,
    squash: 0.2, squashV: 0, squashTarget: 1,
    tilt: 0, hopY: 0, hopV: 0,
    blinkTimer: 0, blinkState: false,
    legPhase: 0,
    born: false, birthTimer: 0,
    breathPhase: 0,
    floatPhase: Math.random() * Math.PI * 2,
    trail: [],
    facing: 1, // 1 = right, -1 = left
  }

  let waypoint = { x: 0, y: 0 }, wpTimer = 0

  // ─── PERIMETER WAYPOINTS ───────────────────────
  // Generate waypoints along the edges of the screen

  function newPerimeterWaypoint() {
    const m = CONFIG.perimeterMargin
    const _rage = getRageFactor()
    const inner = Math.max(0, CONFIG.perimeterInner * (1 - (_rage - 1) / (RAGE_MAX_SCALE - 1)))
    // pick a random edge: 0=top, 1=right, 2=bottom, 3=left
    const edge = Math.floor(Math.random() * 4)
    switch (edge) {
      case 0: // top
        waypoint.x = m + Math.random() * (W - m * 2)
        waypoint.y = m + Math.random() * 30
        break
      case 1: // right
        waypoint.x = W - m - Math.random() * 30
        waypoint.y = m + Math.random() * (H - m * 2)
        break
      case 2: // bottom
        waypoint.x = m + Math.random() * (W - m * 2)
        waypoint.y = H - m - Math.random() * 30
        break
      case 3: // left
        waypoint.x = m + Math.random() * 30
        waypoint.y = m + Math.random() * (H - m * 2)
        break
    }
    wpTimer = 0
  }

  function pickCorner() {
    const p = CONFIG.sleepCornerPadding
    const c = [
      { x: p, y: H - p },
      { x: W - p, y: H - p },
    ]
    return c[Math.floor(Math.random() * c.length)]
  }

  // ─── VOXEL CHARACTER DRAWING ───────────────────

  function drawVoxel(sx, sy, size, color, highlight = true) {
    // isometric cube face — top, left, right
    const hs = size / 2

    // top face (lighter)
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.moveTo(sx, sy - hs)
    ctx.lineTo(sx + hs * COS_A, sy - hs + hs * SIN_A)
    ctx.lineTo(sx, sy - hs + hs * SIN_A * 2)
    ctx.lineTo(sx - hs * COS_A, sy - hs + hs * SIN_A)
    ctx.closePath()
    ctx.fill()

    // left face (darker)
    ctx.fillStyle = darken(color, 0.7)
    ctx.beginPath()
    ctx.moveTo(sx - hs * COS_A, sy - hs + hs * SIN_A)
    ctx.lineTo(sx, sy - hs + hs * SIN_A * 2)
    ctx.lineTo(sx, sy + hs * SIN_A * 2 - hs + hs)
    ctx.lineTo(sx - hs * COS_A, sy + hs * SIN_A)
    ctx.closePath()
    ctx.fill()

    // right face (medium)
    ctx.fillStyle = darken(color, 0.85)
    ctx.beginPath()
    ctx.moveTo(sx + hs * COS_A, sy - hs + hs * SIN_A)
    ctx.lineTo(sx, sy - hs + hs * SIN_A * 2)
    ctx.lineTo(sx, sy + hs * SIN_A * 2 - hs + hs)
    ctx.lineTo(sx + hs * COS_A, sy + hs * SIN_A)
    ctx.closePath()
    ctx.fill()

    // highlight edge on top
    if (highlight) {
      ctx.strokeStyle = 'rgba(255,255,255,0.08)'
      ctx.lineWidth = 0.5
      ctx.beginPath()
      ctx.moveTo(sx - hs * COS_A, sy - hs + hs * SIN_A)
      ctx.lineTo(sx, sy - hs)
      ctx.lineTo(sx + hs * COS_A, sy - hs + hs * SIN_A)
      ctx.stroke()
    }
  }

  const colorCache = {}
  function darken(hex, factor) {
    const key = hex + factor
    if (colorCache[key]) return colorCache[key]
    // handle rgba
    if (hex.startsWith('rgba')) {
      const m = hex.match(/[\d.]+/g)
      const r = Math.round(parseFloat(m[0]) * factor)
      const g = Math.round(parseFloat(m[1]) * factor)
      const b = Math.round(parseFloat(m[2]) * factor)
      const result = `rgba(${r},${g},${b},${m[3]})`
      colorCache[key] = result
      return result
    }
    let r, g, b
    if (hex.length === 7) {
      r = parseInt(hex.slice(1, 3), 16)
      g = parseInt(hex.slice(3, 5), 16)
      b = parseInt(hex.slice(5, 7), 16)
    } else {
      return hex
    }
    const result = `rgb(${Math.round(r * factor)},${Math.round(g * factor)},${Math.round(b * factor)})`
    colorCache[key] = result
    return result
  }

  function drawCharacter() {
    const phase = getPhaseData()
    const rage = getRageFactor()
    const vs = CONFIG.voxelSize * CONFIG.scale * rage

    // rebuild model if growth changed (quantized to 0.02 steps)
    const growth = totalSlides > 1 ? slideIndex / (totalSlides - 1) : 0
    const quantizedGrowth = Math.round(growth * 50) / 50
    if (quantizedGrowth !== cachedGrowth) {
      cachedGrowth = quantizedGrowth
      cachedModel = buildCharacterModel(quantizedGrowth)
    }

    ctx.save()

    const floatY = Math.sin(ch.floatPhase) * 2
    const breathScale = 1 + Math.sin(ch.breathPhase) * 0.02
    const baseX = ch.x
    const baseY = ch.y + ch.hopY + floatY

    // squash-stretch
    ctx.translate(baseX, baseY)
    ctx.scale(ch.facing * (1 + (1 - ch.squash) * 0.15) * breathScale, ch.squash * breathScale)
    ctx.rotate(ch.tilt * 0.5)
    ctx.translate(-baseX, -baseY)

    // shadow — grows with character
    const shadowSize = 14 + growth * 12
    ctx.save()
    ctx.globalAlpha = 0.06 + growth * 0.04
    ctx.fillStyle = BLACK
    ctx.beginPath()
    ctx.ellipse(baseX, baseY + (25 + growth * 8) * rage, shadowSize * rage, (4 + growth * 2) * rage, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()

    // draw each voxel with isometric projection
    const speed = Math.sqrt(ch.vx * ch.vx + ch.vy * ch.vy)
    const legSwing = ch.sleeping ? 0 : Math.sin(ch.legPhase) * Math.min(speed * 2, 4)

    // sort voxels for proper isometric layering (back to front)
    const sorted = [...cachedModel].sort((a, b) => {
      return (a[2] - b[2]) || (a[1] - b[1]) || (a[0] - b[0])
    })

    for (const [vx, vy, vz, ci] of sorted) {
      let color = COLORS[ci]
      let ox = vx, oy = vy, oz = vz

      // leg animation
      if (vy < 0) {
        const isLeft = vx < 0
        ox += (isLeft ? legSwing : -legSwing) * 0.3
      }

      // arm/shoulder swing
      const bodyH = Math.floor(2 + growth * 3)
      if (vy === bodyH - 1 && Math.abs(vx) >= 2) {
        const isLeft = vx < 0
        oy += Math.sin(ch.legPhase + (isLeft ? 0 : Math.PI)) * Math.min(speed, 1) * 0.3
      }

      // branch sway (voxels far from center x)
      if (Math.abs(vx) > 3) {
        ox += Math.sin(time * 1.5 + vy * 0.5) * 0.3
        oy += Math.cos(time * 1.2 + vx * 0.3) * 0.15
      }

      // glyph/red opacity
      if (ci === 2) {
        ctx.globalAlpha = phase.glyphOpacity
      } else if (ci === 6) {
        ctx.globalAlpha = phase.glyphOpacity * 0.3
      } else if (ci === 3) {
        // eyes — blink
        if (ch.blinkState) {
          color = BLACK
        } else {
          const pdx = mouse.x - ch.x
          const pdy = mouse.y - ch.y
          const pd = Math.sqrt(pdx * pdx + pdy * pdy)
          if (pd > 10) {
            ox += (pdx / pd) * 0.3 * ch.facing
            oy += (pdy / pd) * 0.15
          }
        }
        ctx.globalAlpha = 1
      } else if (ci === 5) {
        // aura voxels — float and pulse
        ox += Math.sin(time * 2 + vx) * 0.5
        oy += Math.cos(time * 1.5 + vy) * 0.4
        ctx.globalAlpha = 0.5 + Math.sin(time * 3 + vx + vy) * 0.3
      } else {
        ctx.globalAlpha = 1
      }

      const sx = baseX + isoX(ox, oy, oz) * vs
      const sy = baseY - isoY(ox, oy, oz) * vs

      drawVoxel(sx, sy, vs, color, ci !== 6)
    }

    ctx.globalAlpha = 1
    ctx.restore()
  }

  // ─── trail (voxel squares fading) ──────────────

  function drawTrail() {
    if (ch.sleeping) return
    const speed = Math.sqrt(ch.vx * ch.vx + ch.vy * ch.vy)
    if (speed < 0.5) return
    for (let i = 0; i < ch.trail.length; i++) {
      const t = ch.trail[i]
      const a = (i / ch.trail.length) * 0.06 * Math.min(speed / 2, 1)
      const s = 1 + (i / ch.trail.length) * 2
      ctx.globalAlpha = a
      ctx.fillStyle = RED
      ctx.fillRect(t.x - s / 2, t.y - s / 2, s, s) // square trail
    }
    ctx.globalAlpha = 1
  }

  // ─── update ────────────────────────────────────

  function update() {
    time += dt
    sessionTime += dt
    slideDwellTime += dt

    // phase change
    const curPhase = getCurrentPhase()
    if (curPhase !== lastPhase) {
      const msg = PHRASES.phaseChange[curPhase]
      if (msg) {
        say(msg, 3)
        spawnParticles(ch.x, ch.y - 10, 8, RED)
      }
      lastPhase = curPhase
    }

    // pacing hints
    if (currentSlide && slideDwellTime - lastPacingHintTime > 20 && bubble.opacity <= 0) {
      const hint = getPacingHint(currentSlide.type, slideDwellTime)
      if (hint) {
        say(hint, 3)
        lastPacingHintTime = slideDwellTime
      }
    }

    // birth
    if (!ch.born) {
      ch.birthTimer += dt
      ch.squashTarget = 1
      if (ch.birthTimer > 0.6 && ch.birthTimer < 0.7) {
        say(pick(PHRASES.birth), 3)
        spawnParticles(ch.x, ch.y - 10, 6, GRAY)
      }
      if (ch.birthTimer > 1) ch.born = true
    }

    // click reset
    ch.clickReset += dt
    if (ch.clickReset > 5) { ch.clickCount = 0; ch.clickReset = 0 }

    // squash spring
    ch.squashV += (ch.squashTarget - ch.squash) * 0.18
    ch.squashV *= 0.72
    ch.squash += ch.squashV
    ch.squashTarget += (1 - ch.squashTarget) * 0.08

    // hop spring
    ch.hopV += (-ch.hopY) * 0.12
    ch.hopV *= 0.78
    ch.hopY += ch.hopV

    // breath + float
    ch.breathPhase += dt * 2
    ch.floatPhase += dt * 0.8

    if (!ch.born) return

    const speed = Math.sqrt(ch.vx * ch.vx + ch.vy * ch.vy)
    const dx = mouse.x - ch.x, dy = mouse.y - ch.y
    const distMouse = Math.sqrt(dx * dx + dy * dy)

    if (ch.sleeping) {
      ch.sleepBreath += dt * 1.2
      if (ch.sleepTarget) {
        const sx = ch.sleepTarget.x - ch.x, sy = ch.sleepTarget.y - ch.y
        const sd = Math.sqrt(sx * sx + sy * sy)
        if (sd > 2) { ch.vx += (sx / sd) * 0.03; ch.vy += (sy / sd) * 0.03 }
        ch.vx *= 0.92; ch.vy *= 0.92
      }
      if (distMouse < CONFIG.wakeRadius && mouse.active) {
        ch.sleeping = false; ch.sleepTimer = 0
        say(pick(PHRASES.wake)); ch.hopV = -2.5; ch.squashTarget = 1.15
        spawnParticles(ch.x, ch.y - 10, 4, GRAY)
      }
    } else {
      if (speed < 0.3 && bubble.opacity <= 0) ch.idleTimer += dt; else ch.idleTimer = 0

      if (ch.idleTimer > 12 && Math.random() < 0.0015) {
        const phase = getCurrentPhase()
        const idlePhrases = PHRASES.idle[phase] || PHRASES.idle.newcomer
        say(pick(idlePhrases))
        ch.idleTimer = 0
      }

      ch.sleepTimer += dt
      if (ch.sleepTimer > CONFIG.sleepAfterIdle + Math.random() * 10) {
        ch.sleeping = true
        ch.sleepTarget = pickCorner()
        ch.sleepTimer = 0
        say(pick(PHRASES.sleep), 2)
      }

      const energy = currentSlide ? getBlockEnergy(currentSlide.block) : 0.8
      const cursorForce = CONFIG.cursorChaseForce * energy
      if (distMouse < CONFIG.cursorRadius && mouse.active) {
        ch.sleepTimer = 0
        ch.vx += (dx / distMouse) * cursorForce
        ch.vy += (dy / distMouse) * cursorForce
      } else {
        wpTimer += dt
        const rSpd = getRageSpeed()
        const wpInterval = Math.max(1.5, (6 + Math.random() * 4) / rSpd)
        if (wpTimer > wpInterval || Math.abs(ch.x - waypoint.x) < 20) {
          newPerimeterWaypoint()
        }
        const wx = waypoint.x - ch.x, wy = waypoint.y - ch.y
        const wd = Math.sqrt(wx * wx + wy * wy)
        const ws = CONFIG.wanderSpeed * energy * rSpd
        if (wd > 1) { ch.vx += (wx / wd) * ws; ch.vy += (wy / wd) * ws }
      }
    }

    ch.vx *= CONFIG.friction; ch.vy *= CONFIG.friction
    const rageMax = CONFIG.maxSpeed * getRageSpeed()
    const cs = Math.sqrt(ch.vx * ch.vx + ch.vy * ch.vy)
    if (cs > rageMax) { ch.vx = (ch.vx / cs) * rageMax; ch.vy = (ch.vy / cs) * rageMax }
    if (!ch.sleeping) ch.vy += CONFIG.gravity
    ch.x += ch.vx; ch.y += ch.vy

    // facing direction
    if (Math.abs(ch.vx) > 0.2) {
      ch.facing = ch.vx > 0 ? 1 : -1
    }

    // boundary clamping
    const m = 30
    if (ch.x < m) { ch.x = m; ch.vx *= -CONFIG.bounciness }
    if (ch.x > W - m) { ch.x = W - m; ch.vx *= -CONFIG.bounciness }
    if (ch.y < m) { ch.y = m; ch.vy *= -CONFIG.bounciness }
    if (ch.y > H - m) { ch.y = H - m; ch.vy *= -CONFIG.bounciness; ch.hopV = -0.8 }

    ch.legPhase += cs * 0.25
    ch.tilt += (ch.vx * 0.03 - ch.tilt) * 0.06

    // blink
    ch.blinkTimer += dt
    if (ch.blinkTimer > 3 + Math.random() * 4) { ch.blinkState = true; ch.blinkTimer = 0 }
    if (ch.blinkState && ch.blinkTimer > 0.12) ch.blinkState = false

    // trail
    ch.trail.push({ x: ch.x, y: ch.y })
    if (ch.trail.length > 12) ch.trail.shift()

    updateBubble()
    updateParticles()
    updateZzz(ch.sleeping, ch.x, ch.y)
  }

  // ─── draw ──────────────────────────────────────

  function draw() {
    ctx.clearRect(0, 0, W, H)
    drawTrail()
    drawParticles()
    drawAmbientVoxels(ch.x, ch.y)
    drawZzz()
    drawCharacter()
    drawBubble(ch.x, ch.y + ch.hopY)
  }

  // ─── loop ──────────────────────────────────────

  let lastTime = performance.now()

  function loop(now) {
    dt = Math.min((now - lastTime) / 1000, 0.05)
    lastTime = now
    update()
    draw()
    animId = requestAnimationFrame(loop)
  }

  function resize() {
    W = canvas.width = window.innerWidth
    H = canvas.height = window.innerHeight
  }

  function handleClick(e) {
    const dx = e.clientX - ch.x, dy = e.clientY - (ch.y + ch.hopY)
    const dist = Math.sqrt(dx * dx + dy * dy)
    if (dist < 35) {
      ch.clickCount++; ch.clickReset = 0
      ch.squashTarget = 0.7; ch.hopV = -3
      ch.idleTimer = 0; ch.sleepTimer = 0
      spawnParticles(ch.x, ch.y - 10, 5, RED)
      if (ch.sleeping) {
        ch.sleeping = false; ch.sleepTimer = 0
        say(pick(PHRASES.wake)); ch.squashTarget = 1.2; return
      }
      if (ch.clickCount >= CONFIG.manyClickThreshold) {
        say(pick(PHRASES.manyClicks), 3.5)
        ch.vx += (ch.x - e.clientX) * 0.08; ch.vy += (ch.y - e.clientY) * 0.08
      } else {
        say(pick(PHRASES.click), 5)
        ch.vx += (dx < 0 ? 1 : -1) * CONFIG.clickPushForce; ch.vy -= CONFIG.clickPushForce * 0.5
      }
    } else {
      if (ch.sleeping) { ch.sleeping = false; ch.sleepTimer = 0; say(pick(PHRASES.wake)) }
      ch.idleTimer = 0; ch.sleepTimer = 0
    }
  }

  function handleMouseMove(e) {
    mouse.x = e.clientX; mouse.y = e.clientY; mouse.active = true
  }
  function handleMouseLeave() { mouse.active = false }

  // ─── public API ────────────────────────────────

  return {
    start() {
      resize()
      // start on right edge
      ch.x = W - CONFIG.perimeterMargin - 20
      ch.y = H * 0.6
      newPerimeterWaypoint()
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseleave', handleMouseLeave)
      window.addEventListener('resize', resize)
      window.addEventListener('click', handleClick)
      lastTime = performance.now()
      animId = requestAnimationFrame(loop)
    },

    stop() {
      if (animId) cancelAnimationFrame(animId)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('resize', resize)
      window.removeEventListener('click', handleClick)
    },

    setSlide(slide, index, total) {
      const changed = currentSlide && (currentSlide.id !== slide.id)
      currentSlide = slide
      slideIndex = index
      totalSlides = total

      if (changed) {
        slideDwellTime = 0
        lastPacingHintTime = 0
        if (ch.sleeping) { ch.sleeping = false; ch.sleepTimer = 0 }
        ch.hopV = -2
        ch.squashTarget = 0.85
        spawnParticles(ch.x, ch.y - 10, 4, RED)
        if (bubble.opacity <= 0.1) {
          const remark = getSlideRemark(slide)
          if (remark) say(remark, 2.5)
        }
      }
    },

    setSessionTime(t) { sessionTime = t },
    getCharPos() { return { x: ch.x, y: ch.y } },
  }
}
