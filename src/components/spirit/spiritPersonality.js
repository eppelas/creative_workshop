// ═══════════════════════════════════════════════════════════════
// Spirit Personality — phrase banks per phase, block, slide type
// ═══════════════════════════════════════════════════════════════

export const PHRASES = {
  birth: ['о, привет', 'я тут', 'творим?'],

  click: [
    'стиль — это не картинка, а система',
    'нейронка не придумывает — она интерпретирует твой контекст',
    'сохраняй всё, что цепляет — это твоя визуальная ДНК',
    'не «сделай красиво», а «вот мой мир, покажи его»',
    'один хороший референс стоит тысячи слов в промпте',
    'консистентность важнее идеальной картинки',
    'метафора → материал → промпт → картинка',
    'ты — арт-директор, AI — твой фокусировщик',
    'чат с контекстом лучше, чем гениальный промпт без контекста',
    'Style Guide в Markdown — твой визуальный код',
    'не гоняйся за трендами — найди свою текстуру',
    'от ощущения в животе до автоматизированного конвейера',
    'Recraft фиксирует стиль, Krea ищет форму',
    'JSON-файл может сгенерировать 100 картинок за минуту',
    'абстракцию легче визуализировать через физику материала',
    'мудборд — это не Pinterest, а осознанный выбор',
    'LLM задает вопросы лучше, чем отвечает на них',
    'визуальная каша = отсутствие системы',
  ],

  manyClicks: [
    'покажи свой стиль — даже если это три картинки',
    'творчество — это система, а не вдохновение',
    'API + стиль = креативный конвейер',
    'не бойся зацементировать свой вкус',
  ],

  wake: ['мм?', 'вдохновение?', 'ок'],

  sleep: ['...'],

  idle: {
    newcomer:    ['всё ок?', 'я тут', 'не торопись'],
    comfortable: ['что создадим?', 'ищем форму...', 'какой стиль?'],
    inspired:    ['генерируем!', 'вижу стиль', 'красота рядом'],
    deep:        ['...', '*рисует*', 'тишина — тоже эстетика'],
  },

  phaseChange: {
    comfortable: 'чувствую палитру',
    inspired:    'вижу стиль',
    deep:        'глубина...',
  },

  // --- slide type reactions ---
  slideType: {
    title:      ['архитектор системы', 'творим'],
    section:    ['новый блок', 'дальше'],
    bigquote:   ['*думает*', '...', 'сильно'],
    quote:      ['*думает*', 'точно'],
    poll:       ['что скажете?', 'интересно'],
    activity:   ['практика!', 'hands on'],
    links:      ['скачивай', 'ресурсы'],
    tools:      ['инструменты!', 'выбирай'],
    definition: ['запомни это'],
    end:        ['спасибо', 'было красиво'],
    closing:    ['takeaways', 'главное'],
  },

  // --- per-block personality overrides ---
  blockPersonality: {
    0: { energy: 0.8, remarks: ['добро пожаловать', 'начинаем'] },
    1: { energy: 0.9, remarks: ['от хаоса к системе', 'парадигма'] },
    2: { energy: 1.0, remarks: ['декодер вкуса', 'ищем ДНК'] },
    3: { energy: 0.9, remarks: ['форма и стиль', 'фиксируем'] },
    4: { energy: 1.2, remarks: ['практика!', 'создаём'] },
    5: { energy: 1.0, remarks: ['масштаб', 'конвейер'] },
  },

  // --- special slide overrides by id ---
  specialSlides: {
    1:  'архитектор системы',
    99: 'спасибо за всё',
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
