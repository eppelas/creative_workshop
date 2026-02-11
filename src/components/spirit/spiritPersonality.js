// ═══════════════════════════════════════════════════════════════
// Spirit Personality — phrase banks per phase, block, slide type
// ═══════════════════════════════════════════════════════════════

export const PHRASES = {
  birth: ['о, привет', 'я тут', 'начинаем?'],

  click: [
    'самое сложное — заметить момент, когда можно написать промпт',
    'поведение важнее технологий',
    'контекст важнее промпта',
    'все можно смешивать — календарь, текст, графика, видео',
    'не гоняйся за технологией — пойми принцип',
    'PRD — это список требований, а не просто «хочу помидор-таймер»',
    'сохрани то, что получилось — используй дальше',
    'навык создания инструментов — самый полезный',
    'SVG — чистая математика, которая легко передается в графику',
    'модели тянутся к тому, чтобы сами в себя вживлять все принципы',
    'один агент — менеджер с контекстом, остальные — исполнители',
    'сложнее всего поверить, что это возможно',
    'описывай не «залей на сервис», а на ценностном уровне',
    'скриншот + текст уже гораздо лучше, чем просто текст',
    'не vibe coding ради vibe — а контролируемый продукт',
    'правило второго раза: делаешь повторно — автоматизируй',
    'Google Build — из коробки красивая графика в один промпт',
    'эта презентация — не PowerPoint, а сайт, созданный на лету',
    'мы пытались делать chain of thought — сейчас это по дефолту',
    'agent team: он сам создаст команду разработки',
  ],

  manyClicks: [
    'попытка создавать свой framework — часть этой лаборатории',
    'демо дей — покажи что получилось, даже если это пара промтов',
    'ценность — как мы для себя определяем, что важно',
    'в папке roles появляются агенты с накапливаемым контекстом',
  ],

  wake: ['мм?', 'вернулся', 'ок'],

  sleep: ['...'],

  idle: {
    newcomer:    ['всё ок?', 'я тут', 'не торопись'],
    comfortable: ['что создадим?', 'vibe...', 'follow the interest'],
    inspired:    ['ship it', 'не страшно создавать', 'build for life'],
    deep:        ['...', '*дышит*', 'тишина — тоже практика'],
  },

  phaseChange: {
    comfortable: 'привыкаю',
    inspired:    'чувствую vibe',
    deep:        'глубина...',
  },

  // --- slide type reactions ---
  slideType: {
    title:      ['life engineering', 'поехали'],
    section:    ['новый блок', 'дальше'],
    bigquote:   ['*думает*', '...', 'сильно'],
    poll:       ['что скажете?', 'интересно'],
    activity:   ['делаем!', 'hands on'],
    recap:      ['помню', 'было круто'],
    timeline:   ['путь...', 'мы тут'],
    tools:      ['инструменты!', 'выбирай'],
    definition: ['запомни это'],
    end:        ['спасибо', 'было круто'],
    closing:    ['takeaways', 'главное'],
    demoday:    ['покажи!', 'давай'],
    checklist:  ['чеклист', 'погнали'],
  },

  // --- per-block personality overrides ---
  blockPersonality: {
    0: { energy: 0.8, remarks: ['добро пожаловать', 'начинаем'] },
    1: { energy: 0.6, remarks: ['вспоминаем', 'путь'] },
    2: { energy: 1.0, remarks: ['mindset shift', 'самое важное'] },
    3: { energy: 0.9, remarks: ['friction audit', 'где болит?'] },
    4: { energy: 0.7, remarks: ['PRD time', 'опиши боль'] },
    5: { energy: 1.1, remarks: ['vibe coding!', 'build it'] },
    6: { energy: 0.8, remarks: ['creative tools', 'красота'] },
    7: { energy: 0.9, remarks: ['агенты', 'second mind'] },
    8: { energy: 1.2, remarks: ['workshop!', 'делаем'] },
  },

  // --- special slide overrides by id ---
  specialSlides: {
    1:  'life engineering',
    51: 'спасибо за всё',
  },
}

export function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

export function getSlideRemark(slide) {
  // special override by id
  if (PHRASES.specialSlides[slide.id]) {
    return PHRASES.specialSlides[slide.id]
  }
  // slide type phrase
  const typeArr = PHRASES.slideType[slide.type]
  if (typeArr && Math.random() < 0.6) {
    return pick(typeArr)
  }
  // block personality
  const block = PHRASES.blockPersonality[slide.block]
  if (block && block.remarks && Math.random() < 0.3) {
    return pick(block.remarks)
  }
  return null
}

export function getBlockEnergy(blockNum) {
  const b = PHRASES.blockPersonality[blockNum]
  return b ? b.energy : 0.8
}
