// ═══════════════════════════════════════════════════════════════
// Spirit Pacing — dwell time targets + pacing hint logic
// ═══════════════════════════════════════════════════════════════

const DWELL_TARGETS = {
  title:       15,
  section:     10,
  content:     45,
  bigquote:    20,
  poll:        60,
  activity:    90,
  recap:       30,
  timeline:    20,
  tools:       40,
  definition:  25,
  agenda:      30,
  resources:   35,
  frameworks:  40,
  levels:      35,
  prd:         40,
  highlight:   30,
  table:       40,
  voices:      25,
  checklist:   30,
  demoday:     20,
  closing:     25,
  end:         15,
}

const HINTS_SLOW = [
  'maybe time to move on?',
  'следующий слайд?',
  'дальше?',
  'готовы?',
]

const HINTS_FAST = [
  'тут есть ещё',
  'не торопись',
  'подожди',
]

export function getDwellTarget(slideType) {
  return DWELL_TARGETS[slideType] || 30
}

export function getPacingHint(slideType, dwellSeconds) {
  const target = getDwellTarget(slideType)

  // dwelling too long: > 1.5x target
  if (dwellSeconds > target * 1.5) {
    return HINTS_SLOW[Math.floor(Math.random() * HINTS_SLOW.length)]
  }

  // moving too fast: < 40% of target but already 5s+ in
  if (dwellSeconds >= 5 && dwellSeconds < target * 0.4) {
    return HINTS_FAST[Math.floor(Math.random() * HINTS_FAST.length)]
  }

  return null
}
