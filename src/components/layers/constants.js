export const NodeType = {
  MINDSET: 'MINDSET',
  CODING: 'CODING',
  CREATIVE: 'CREATIVE',
  MUSIC: 'MUSIC',
  DESIGN: 'DESIGN',
  INFRA: 'INFRA'
}

export const SCHEMA_NODES = [
  // ═══ LEFT COLUMN: LEVELS (isLevel = true) ═══
  {
    id: 'level-1',
    type: NodeType.MINDSET,
    isLevel: true,
    title: 'Lvl 1: Awareness',
    description: 'How AI is changing life, work, and the world.',
    details: 'The hardest part isn\'t the tools — it\'s believing what is possible. The real barrier is the "glass ceiling" in your head. Start by understanding how AI is reshaping industries, regulations, and daily life.',
    connections: ['level-2'],
    tools: ['AI Mindset YouTube', 'AI Mindset Report', 'AI Mindset Knowledge Base'],
    toolsLabel: 'Links',
    timeEstimate: '0-5 Hours',
    x: 0, y: 0,
    toolDetails: [
      { name: 'AI Mindset YouTube', url: 'https://www.youtube.com/@A-I-Mindset', category: 'YouTube', description: 'Video lectures and workshops from the AI Mindset Lab.' },
      { name: 'AI Mindset Report', url: 'https://gap.aimindset.org/', category: 'Report', description: '11 сдвигов в мире AI, которые произошли в 2025. Вертикальный обзор: как AI меняет индустрии, регуляции, рабочие места и креативные процессы.' },
      { name: 'AI Mindset Knowledge Base', url: 'https://base.aimindset.org/guides/', category: 'Guides', description: 'Гайды по AI-автоматизации и интеграции. Практические руководства от экосистемы AI Mindset.' },
      { name: 'No Priors', url: 'https://www.youtube.com/@NoPriorsPodcast', category: 'Podcast', description: 'Подкаст Sarah Guo и Elad Gil с лидерами AI-индустрии. Глубокие интервью про технологии, стартапы и будущее AI.', bestFor: 'Industry insights, founder interviews.' },
      { name: 'Unskipped with Jack Altman', url: 'https://www.youtube.com/@uncappedpod', category: 'Podcast', description: 'Подкаст Jack Altman. Честные разговоры о возможностях и рисках искусственного интеллекта.', bestFor: 'Candid AI discussions.' },
      { name: 'Machine Learning Street Talk', url: 'https://www.youtube.com/@MachineLearningStreetTalk', category: 'Podcast', description: 'Глубокие технические разговоры о машинном обучении и AI. Интервью с исследователями и практиками.', bestFor: 'Deep ML/AI technical discussions.' },
      { name: 'Practical AI', url: 'https://changelog.com/practicalai', category: 'Podcast', description: 'Подкаст о практическом применении AI. Реальные кейсы внедрения машинного обучения в продукты и процессы.', bestFor: 'Applied AI, real-world ML use cases.' },
      { name: 'Learning from Machine Learning', url: 'https://www.learningfromml.com', category: 'Podcast', description: 'Подкаст Seth Levine. Уроки из мира машинного обучения для бизнеса и жизни.', bestFor: 'ML lessons for business and life.' },
    ]
  },
  {
    id: 'level-2',
    type: NodeType.MINDSET,
    isLevel: true,
    title: 'Lvl 2: Usage & Diversity',
    description: 'Probing the filters. DeepSeek vs GPT vs Claude.',
    details: 'Models are not "all human knowledge" but a heavily filtered slice. Each company has different safety filters, data, and cultural biases. Try the same provocative questions across models — you\'ll see the difference immediately.',
    connections: ['level-3'],
    tools: ['ChatGPT', 'Claude', 'DeepSeek', 'Gemini', 'Perplexity', 'Grok', 'Krisp', 'Granola', 'SuperWhisper'],
    timeEstimate: '5-30 Hours',
    x: 0, y: 1,
    toolDetails: [
      { name: 'Perplexity', url: 'https://perplexity.ai', category: 'AI Search', description: 'Search + AI. Always gives sources.', bestFor: 'Fact-checking, research with citations.' },
      { name: 'valyu.ai', url: 'https://valyu.ai', category: 'Deep Research', description: 'Инструмент для глубокого исследования (deep research). Структурированный анализ.', bestFor: 'Thorough analysis, research.' },
      { name: 'Parallel.ai', url: 'https://parallel.ai', category: 'Deep Research', description: 'Сервис для глубоких исследований с параллельным анализом источников.', bestFor: 'Comparing perspectives, deep research.' },
      { name: 'Krisp', url: 'https://krisp.ai', category: 'Productivity', description: 'AI-шумоподавление и транскрипция звонков в реальном времени.', bestFor: 'Clean audio in calls, meeting transcription.' },
      { name: 'Granola', url: 'https://granola.so', category: 'Productivity', description: 'AI-заметки для встреч. Автоматическая структуризация и саммари.', bestFor: 'Meeting notes, automatic summaries.' },
      { name: 'SuperWhisper', url: 'https://superwhisper.com', category: 'Voice', description: 'Голосовой ввод через Whisper. Диктовка в любом приложении на macOS и Windows.', bestFor: 'Voice-to-text, dictation.' },
      { name: 'Wispr Flow', url: 'https://www.wispr.ai', category: 'Voice', description: 'Голосовой ввод и управление приложениями голосом. Диктовка + голосовые команды.', bestFor: 'Voice dictation and commands.' },
      { name: 'MacWhisper', url: 'https://goodsnooze.gumroad.com/l/macwhisper', category: 'Voice', description: 'macOS-приложение для транскрипции аудиофайлов. Загружаешь аудио — получаешь текст.', bestFor: 'Audio file transcription.' },
      { name: '@WhisperSummaryAI_bot', url: 'https://t.me/WhisperSummaryAI_bot', category: 'Telegram Bot', description: 'Telegram-бот для создания кратких сводок (саммари) из голосовых и текстов.', bestFor: 'Quick summaries from voice/text.' },
      { name: 'LLMs Interfaces (Guide)', url: 'https://base.aimindset.org/guides/guide-LLMs-interfaces', category: 'Guide', description: 'Гайд AI Mindset: обзор интерфейсов для работы с LLM.', bestFor: 'Understanding different model interfaces.' },
      { name: 'GPTs (Guide)', url: 'https://base.aimindset.org/guides/guide-GPTs', category: 'Guide', description: 'Гайд AI Mindset: как создавать и использовать Custom GPTs.', bestFor: 'Learning to build custom GPTs.' },
      { name: 'SuperWhisper (Guide)', url: 'https://base.aimindset.org/guides/guide-Superwhisper', category: 'Guide', description: 'Гайд AI Mindset: настройка и использование SuperWhisper для голосового ввода.', bestFor: 'Setting up voice-to-text workflow.' },
      { name: 'Voice Interfaces (Meet)', url: 'https://base.aimindset.org/guides/Voice-interfaces-meet', category: 'Guide', description: 'Запись встречи AI Mindset про голосовые интерфейсы и их интеграцию.', bestFor: 'Voice interface inspiration.' },
    ],
    tips: [
      {
        title: 'Каскад из трёх промптов для PDF',
        text: `Когда закидываете большой PDF в Claude или GPT, они часто "плывут" по контексту. Используйте каскад:
1. Структурный: "Проанализируй оглавление и выдели 5 ключевых тезисов. Сделай Mind Map структуру".
2. Критический: "Найди утверждения, которые противоречат общепринятым фактам или другим частям самого документа. Выпиши с указанием глав".
3. Прикладной: "Исходя из контекста моей задачи [описать задачу], выдели 3 конкретных шага, которые я могу внедрить уже завтра. Игнорируй воду".
Это помогает не просто получить "краткое содержание", а вытащить рабочие инструменты.`
      }
    ]
  },
  {
    id: 'level-3',
    type: NodeType.MINDSET,
    isLevel: true,
    title: 'Lvl 3: Context & RAG',
    description: 'Knowledge Bases, Second Brains.',
    details: 'Moving beyond the "mainstream" answer. Using RAG or own KB/Memory to feed specific context. Reducing hallucinations by providing specific modern data.',
    connections: ['level-4'],
    tools: ['Custom GPTs', 'NotebookLM', 'Obsidian'],
    timeEstimate: '30-100 Hours',
    x: 0, y: 2,
    toolDetails: [
      { name: 'Collective Knowledge Management', url: 'https://base.aimindset.org/guides/Collective-Knowledge-Management-demo', category: 'Demo', description: 'Демо AI Mindset: автоматизация обработки встреч и построение коллективных баз знаний.' },
      { name: 'Browse.ai', url: 'https://browse.ai', category: 'Data Collection', description: 'Движок для сбора и мониторинга данных с любого веб-сайта.', bestFor: 'Web scraping, data monitoring.' },
      { name: 'Give me news', url: 'https://t.me/givemenews_bot', category: 'Telegram Bot', description: 'Парсер новостей в Telegram по ключевым словам.', bestFor: 'News monitoring, keyword tracking.' },
      { name: 'Competely.ai', url: 'https://competely.ai', category: 'Competitive Intel', description: 'Автоматическое выявление прямых и косвенных конкурентов. Анализирует семантическое сходство продуктов, маркетинга и целевых аудиторий.', bestFor: 'Competitor analysis, market research.' },
      { name: 'Outset.ai', url: 'https://outset.ai', category: 'UX Research', description: 'AI-исследования: проведение и синтез видео-, аудио- и юзабилити-сессий.', bestFor: 'User research, usability testing.' },
      { name: 'Youscan.io', url: 'https://youscan.io', category: 'Social Monitoring', description: 'Computer vision находит на фотографиях логотипы, объекты, сцены — мониторинг бренда без текстового упоминания.', bestFor: 'Brand monitoring, visual search.' },
      { name: 'Decisional AI', url: 'https://decisional.ai', category: 'Finance', description: 'AI-помощник для финансовых аналитиков. Автоматизирует работу с документами: PDF в Excel, поиск по файлам, готовые аналитические отчеты.', bestFor: 'Financial analysis, document processing.' },
      { name: 'Intelligo.ai', url: 'https://intelligo.ai', category: 'Due Diligence', description: 'AI обучен работать как аналитик по due diligence: выявляет красные флаги (криминал, финансы, конфликты интересов).', bestFor: 'Background checks, risk analysis.' },
      { name: 'Crunchbase', url: 'https://crunchbase.com', category: 'Startup Intel', description: 'Анализ миллиардов сигналов о стартапах. Предсказывает финансирование, поглощения и IPO с точностью 95%.', bestFor: 'Startup research, investment signals.' },
      { name: 'Polymer AI', url: 'https://polymersearch.com', category: 'Data Viz', description: 'No-code платформа для интерактивных дашбордов. AI автоматически генерирует графики и выявляет паттерны из Google Sheets, Shopify, SQL и др.', bestFor: 'Dashboards, data visualization.' },
      { name: 'PQAI', url: 'https://pqai.org', category: 'Patent Search', description: 'Open-source платформа для патентного поиска на естественном языке.', bestFor: 'Patent search, IP research.' },
    ]
  },
  {
    id: 'level-4',
    type: NodeType.MINDSET,
    isLevel: true,
    title: 'Lvl 4: Building',
    description: 'Creating custom tools and projects.',
    details: 'Building your own instruments with AI. From app generators to full IDEs. The moment you stop consuming and start creating — everything changes.',
    connections: ['level-5'],
    tools: ['Cursor', 'Windsurf', 'Lovable', 'Google Build'],
    timeEstimate: '50-200 Hours',
    x: 0, y: 3,
    toolDetails: [
      { name: 'Vibecoding Platforms Map', url: 'https://base.aimindset.org/guides/map-Vibecoding-Platforms', category: 'Guide', description: 'Карта AI Mindset: обзор платформ для вайб-кодинга и быстрого создания MVP.' },
      { name: 'OpenRouter', url: 'https://openrouter.ai', category: 'API Aggregator', description: 'Агрегатор всех топовых нейросетей (Claude, GPT-4, Llama) в одном API. Экономия и доступ без VPN.', bestFor: 'API access to many models, cost optimization.' },
      { name: 'OpenSpec', url: 'https://openspec.dev', category: 'Specs', description: 'Ресурс со спецификациями для постановки задач. Шаблоны PRD и технических требований.' },
    ],
    cases: [
      { title: 'AI Mindset Report', url: 'https://gap.aimindset.org/', description: 'Информационный сайт об уровнях AI-компетенций. Создан с помощью AI-кодинга.' },
      { title: 'Interaction Map', description: 'Эта карта инструментов — drag & drop нодовая система с деталями, связями и фильтрацией. Создана с помощью AI-кодинга (Windsurf Cascade + React).' },
    ]
  },
  {
    id: 'level-5',
    type: NodeType.MINDSET,
    isLevel: true,
    title: 'Lvl 5: Engineering',
    description: 'Creating custom visual & interactive tools.',
    details: 'Отличие от Building: вы не просто создаёте приложение — вы создаёте инструменты под себя, в том числе те, которые сами могут билдить. Автономные агенты, мультимодальные системы (видео, аудио, генерация картинок), кастомные пайплайны. Our case: интерактивная презентация с вокселями, анимациями и data-driven слайдами + специальные генераторы для SVG-метафор и 3D-сцен.',
    connections: [],
    tools: ['Windsurf', 'React', 'Vite', 'Tailwind'],
    timeEstimate: '200+ Hours',
    x: 0, y: 4,
    cases: [
      { title: 'This Deck', description: 'Интерактивная презентация WS04 — React + Vite + Tailwind, создана в Windsurf (Cascade). Для генерирования вокселей и SVG-метафор создали специальные инструменты, которые можно использовать в будущих проектах с соблюдением нашего стиля.' },
    ]
  },

  // ═══ RIGHT SIDE: TOOLS & DOMAINS (distributed by level) ═══

  // ═══ IMAGE COLUMN (x=2): Levels of Image Generation ═══
  {
    id: 'img-prompting',
    type: NodeType.CREATIVE,
    title: 'Image: Prompting',
    description: 'Генерация картинок из текста. Первый шаг.',
    details: 'Пишешь промпт — получаешь картинку. Главное — научиться формулировать и понимать, какая модель для чего.',
    connections: ['img-styles'],
    tools: ['Midjourney', 'Flux', 'Seedream', 'Fusara', 'Krea'],
    timeEstimate: 'Level 2',
    x: 2, y: 1,
    toolDetails: [
      { name: 'Midjourney V7', url: 'https://www.midjourney.com/explore', category: 'Art Model', description: 'Aesthetic king. V7: улучшенный NLP — понимает нюансы и абстрактные промпты. Текстуры, руки, детали на новом уровне. Веб-интерфейс. Omni Reference для стиля/персонажа/сцены.', bestFor: 'High-end art, fantasy, advertising, character consistency.' },
      { name: 'Flux.1', url: 'https://blackforestlabs.ai', category: 'Open Model', description: '12B-параметров, высокая семантическая точность. Семейство: Dev (base), Kontext (editing), Fill (inpaint), Redux (variations). Open-weight — можно тренировать LoRA.', bestFor: 'Complex scenes, text in images, LoRA training, editing.' },
      { name: 'Imagen 4', url: 'https://labs.google/fx/tools/image-fx', category: 'Model', description: 'Google. Лидер фотореализма и типографики (читаемый текст в картинках). 3 варианта: Fast (быстрый), Standard, Ultra (максимум деталей). Длинные сложные промпты.', bestFor: 'Photorealism, text/typography, production-grade images.' },
      { name: 'Seedream 4.0', url: 'https://dreamina.capcut.com', category: 'Gen & Edit', description: 'ByteDance. 5 столпов: точное instruction editing, сохранение деталей (pore-level), глубокое понимание намерений, multi-image input/output, 2K за <4 сек. Бесплатный доступ.', bestFor: 'Editing, character consistency, storyboards, speed.' },
      { name: 'GPT Image 1', url: 'https://chatgpt.com', category: 'Model', description: 'OpenAI. Нативно мультимодальная: Create + Modify. Прозрачные фоны (standout feature). Отличная для ассетов, иконок, UI-элементов.', bestFor: 'Assets, transparent backgrounds, instruction-following.' },
      { name: 'HiDream', url: 'https://hidreamai.com', category: 'Model', description: '17B MoE с 4 текстовыми энкодерами (включая Llama 3.1). Лучшая точность промптов: считает объекты, понимает пространственные отношения.', bestFor: 'Complex prompts, counting, spatial accuracy.' },
      { name: 'Fusara', url: 'https://fusara.ai', category: 'Aggregator', description: '~10 моделей (image/video) в одном интерфейсе. Бот помогает с промптами. Image references.', bestFor: 'Comparing models side by side.' },
      { name: 'Leonardo AI', url: 'https://leonardo.ai', category: 'Platform', description: 'Несколько моделей; дневные токены на бесплатном тарифе.', bestFor: 'Daily free generations, multiple models.' },
      { name: 'Playground AI', url: 'https://playground.com', category: 'Platform', description: 'Быстрые A/B по стилям; ежедневные бесплатные генерации.', bestFor: 'Style comparison, free daily credits.' },
      { name: 'AI Creative Map', url: 'https://base.aimindset.org/guides/map-AI-Creative-Map', category: 'Guide', description: 'Карта AI Mindset: все инструменты для создания контента.', bestFor: 'Overview of creative AI tools.' },
    ],
    tips: [
      {
        title: 'LLM как промпт-райтер',
        text: `Не пишите промпты сами — попросите ChatGPT/Claude: "Напиши промпт для [модель] в стиле [описание]". LLM знает синтаксис каждой модели лучше вас. Fusara бот тоже помогает адаптировать промпт под конкретную модель.`
      },
      {
        title: 'Разные модели — разный язык',
        text: `Mv7: natural language, описывай как режиссёр сцену. Flux/HiDream: verbose detail, чем подробнее тем лучше. Imagen 4: позитивные инструкции, никаких "не делай". GPT Image 1: разговорный стиль, как просьба дизайнеру. SDXL: keyword-based, через запятую.`
      },
      {
        title: 'Negative prompts: кто поддерживает',
        text: `Поддерживают: Mv7, SDXL, HiDream, Kling, Veo 3. НЕ поддерживают: Flux, GPT Image 1, Imagen 4, Seedream. Для моделей без negative prompt — описывайте только то, что ХОТИТЕ видеть, максимально подробно.`
      }
    ],
    cases: [
      { title: 'Children\'s Book with AI', url: 'https://medium.com/@vera.danchenko/i-wrote-a-children-book-with-dalle-chat-gpt-and-midjourney-and-this-is-how-i-did-it-6f2828264a03', description: 'Вера Данченко написала и проиллюстрировала детскую книгу с помощью DALL-E, ChatGPT и Midjourney.' },
    ]
  },
  {
    id: 'img-styles',
    type: NodeType.CREATIVE,
    title: 'Image: Styles & References',
    description: 'Контроль стиля, мудборды, image references.',
    details: 'Не просто "сделай красиво", а управление стилем: references, trained styles, мудборды. Консистентность между картинками.',
    connections: ['img-editing'],
    tools: ['Recraft', 'Imagen 4', 'Ideogram', 'Pencil'],
    timeEstimate: 'Level 3',
    x: 2, y: 2.15,
    toolDetails: [
      { name: 'Recraft', url: 'https://recraft.ai', category: 'Vector/Brand', description: 'Infinite canvas для генерации векторов и Brand sets. SVG export. Сохранённые стили и палитры для серий.', bestFor: 'SVG icons, consistent brand identity, vector sets.' },
      { name: 'Imagen 4', url: 'https://labs.google/fx/tools/image-fx', category: 'Typography', description: 'Google. Лидер типографики: читаемый текст в картинках. 3 варианта (Fast/Standard/Ultra). Лучший для постеров, обложек, дизайна с текстом.', bestFor: 'Text in images, posters, covers, typography.' },
      { name: 'Ideogram', url: 'https://ideogram.ai', category: 'Typography', description: 'Сильный рендеринг текста внутри изображений. Хорош для мерча.', bestFor: 'T-shirt designs, posters with text, merch.' },
      { name: 'Visual Electric', url: 'https://visualelectric.com', category: 'Moodboarding', description: 'Качественная стилизация; Trained References; удобная галерея примеров. Describe → Make Variations.', bestFor: 'Designers, Moodboards, Photorealism.' },
      { name: 'Reve.art', url: 'https://reve.art', category: 'Creative', description: 'Moodboard, prompt enhancer, describe, seed control; быстрый старт.', bestFor: 'Moodboards, prompt exploration.' },
      { name: 'Pencil', url: 'https://pencil.li', category: 'UI Design', description: 'AI-расширение для дизайна UI/UX прямо в IDE. Генерация интерфейсов, компонентов, макетов.', bestFor: 'UI/UX design, component generation, prototyping.' },
      { name: 'Galileo AI', url: 'https://www.usegalileo.ai', category: 'UI Design', description: 'Генерация UI-дизайна из текстового описания. Готовые экраны и компоненты.', bestFor: 'UI from text, rapid prototyping, design systems.' },
      { name: 'Florafauna.ai', url: 'https://florafauna.ai', category: 'Node Graph', description: 'Нодовая система images/video; удобный restyling; бесплатные Flux Dev и Runway Gen-4.', bestFor: 'Restyling, free Flux/Runway access.' },
      { name: 'Napkin.ai', url: 'https://www.napkin.ai', category: 'Visualization', description: 'Превращает текст в визуальные схемы и диаграммы.', bestFor: 'Diagrams, presentations from text.' },
      { name: 'PromptHero', url: 'https://prompthero.com', category: 'Prompt Gallery', description: 'Галерея промптов с фильтром по моделям (Midjourney, SDXL, Flux, DALL-E). Подсмотреть рабочие промпты и параметры.', bestFor: 'Prompt inspiration, learning prompt structure.' },
      { name: 'Consistency Guide', url: 'https://base.aimindset.org/guides/Consistency-Guide', category: 'Guide', description: 'Гайд AI Mindset: seed, references, master prompt, палитры, LoRA — всё для консистентности персонажей и объектов.', bestFor: 'Character/object consistency across images.' },
    ],
    tips: [
      {
        title: 'Reference-функции: что поддерживает какая модель',
        text: `Image/Style/Character Reference: SDXL, Flux, Mv7. Contour (ControlNet Canny): SDXL, Flux. Depth (ControlNet Depth): SDXL, Flux. Composition: только SDXL. GPT Image 1, Imagen 4, HiDream, Seedream — reference-функций нет, только текстовый промпт.`
      },
      {
        title: 'Консистентность персонажей',
        text: `1) Seed + одинаковые параметры. 2) Master prompt: 90% базы + 10% вариаций. 3) Фиксированная палитра/стиль на серию. 4) Character Reference (Mv7 Omni Ref, Flux PulID, SDXL HyperLoRA). 5) LoRA для максимального контроля. Подробнее — в Consistency Guide.`
      },
      {
        title: 'Contour и Depth — зачем',
        text: `Contour (Canny): копирует контуры/края — фиксирует композицию и позу. Depth: копирует 3D-расположение объектов — сохраняет перспективу. Оба работают на SDXL и Flux. Для Mv7 — используйте image reference + точное описание композиции.`
      }
    ]
  },
  {
    id: 'img-editing',
    type: NodeType.CREATIVE,
    title: 'Image: Editing & Inpaint',
    description: 'Inpaint, JSON-editing, точечные правки.',
    details: 'Точечное редактирование без перегенерации всей картинки. Nano Banana Pro — лидер: работает с JSON для попиксельного контроля. Inpaint, outpaint, замена элементов.',
    connections: ['img-advanced'],
    tools: ['Nano Banana Pro', 'Flux Kontext', 'Seed Edit', 'Krea'],
    timeEstimate: 'Level 4',
    x: 2, y: 3.1,
    toolDetails: [
      { name: 'Nano Banana Pro', url: 'https://fusara.ai', category: 'Editing Leader', description: 'Google. Лидер editing/inpainting. Работает с JSON: попиксельный контроль, координаты, углы поворота, размеры. Отлично понимает цифры и пространственные инструкции.', bestFor: 'JSON-based editing, precise modifications, text/numbers in images.' },
      { name: 'Flux Kontext', url: 'https://blackforestlabs.ai', category: 'Editing', description: 'Editing specialist из семейства Flux. In-context editing с сохранением character/style consistency. Итеративные правки.', bestFor: 'In-context editing, character consistency, iterative modifications.' },
      { name: 'Flux Fill', url: 'https://blackforestlabs.ai', category: 'Inpaint', description: 'Inpaint specialist из семейства Flux. Seamless inpainting: добавление, удаление, замена объектов в выделенной области.', bestFor: 'Inpainting, object removal, seamless fills.' },
      { name: 'Seed Edit 4.0', url: 'https://dreamina.capcut.com', category: 'Editing', description: 'ByteDance. Pore-level сохранение деталей, точное instruction editing, multi-image input/output. Бесплатный доступ.', bestFor: 'Lossless editing, character consistency, storyboards.' },
      { name: 'GPT Image 1 (Modify)', url: 'https://chatgpt.com', category: 'Editing', description: 'OpenAI. Режим Modify: точечное редактирование. Прозрачные фоны. Разговорный стиль инструкций.', bestFor: 'Precise modifications, transparent backgrounds.' },
      { name: 'Qwen Image Edit', url: 'https://fusara.ai', category: 'Editing', description: 'Alibaba. Все reference-функции (style, character, contour, depth, composition) + editing. Полный набор.', bestFor: 'Editing with full reference support.' },
      { name: 'Krea.ai', url: 'https://www.krea.ai', category: 'Realtime Canvas', description: 'Realtime generation и inpaint на canvas. Upscaling.', bestFor: 'Interactive editing, upscaling.' },
      { name: 'Artificial Analysis', url: 'https://artificialanalysis.ai', category: 'Leaderboard', description: 'Лидерборд AI-моделей с фильтром по задачам: editing, generation, стилистика. Актуальные рейтинги.', bestFor: 'Finding best model for your task.' },
    ],
    tips: [
      {
        title: 'JSON-editing через Nano Banana Pro',
        text: `Попросите любую LLM (ChatGPT/Claude) перевести ваше описание правок в JSON: координаты, углы, размеры. Nano Banana Pro идеально следует JSON-инструкциям. Пример: "повернуть стол на 45° по часовой" → JSON с rotate_y: 45. Меняется только указанный объект, остальное нетронуто.`
      },
      {
        title: 'Inpaint vs Modify vs JSON',
        text: `Inpaint (Flux Fill): маска + промпт, замена области. Modify (Kontext, GPT Image): текстовая инструкция, модель сама находит что менять. JSON (Nano Banana Pro): максимальный контроль — координаты, размеры, углы, текст. Чем точнее задача — тем больше нужен JSON.`
      }
    ]
  },
  {
    id: 'img-advanced',
    type: NodeType.CREATIVE,
    title: 'Image: LoRA & Training',
    description: 'Тренировка LoRA, кастомные чекпойнты.',
    details: 'Тренировка LoRA под свой стиль/персонажа/объект. Скачивание и использование чекпойнтов. Максимальная консистентность. Запуск — через ComfyUI (см. Local & Cloud Compute).',
    connections: ['infra'],
    tools: ['CivitAI', 'Krea'],
    timeEstimate: 'Level 5',
    x: 2, y: 3.9,
    toolDetails: [
      { name: 'CivitAI', url: 'https://civitai.com', category: 'Model Hub', description: 'Хаб LoRA, чекпойнтов. Тренировка, скачивание, шаринг. Готовые стили и персонажи.', bestFor: 'Finding/training LoRA, checkpoints.' },
      { name: 'Krea (LoRA Training)', url: 'https://www.krea.ai', category: 'Cloud Training', description: 'Обучение LoRA в облаке (платный тариф). Удобный UX, триггер-слова. Применение прямо в Krea.', bestFor: 'Cloud LoRA training, easy UX.' },
      { name: 'Mage.Space', url: 'https://mage.space', category: 'SD Hub', description: 'Много SD/SDXL чекпойнтов и LoRA; бесплатная очередь.', bestFor: 'SD/SDXL models, free queue.' },
      { name: 'SeaArt.ai', url: 'https://seaart.ai', category: 'Model Hub', description: 'Большая библиотека моделей/LoRA; дневные кредиты.', bestFor: 'Finding LoRA, daily credits.' },
      { name: 'Tensor.art', url: 'https://tensor.art', category: 'Model Hub', description: 'Хаб SD/SDXL/LoRA; быстрые тесты трендовых моделей.', bestFor: 'Testing trending models.' },
      { name: 'Civitai Create', url: 'https://civitai.com', category: 'Model Hub', description: 'Запуск популярных моделей прямо из Civitai.', bestFor: 'Running community models online.' },
    ],
    tips: [
      {
        title: 'Типы LoRA и когда использовать',
        text: `Style LoRA: самый эффективный, фиксирует визуальный стиль. Character LoRA: лучший для лиц и персонажей. Object LoRA: повторяет один и тот же предмет. Тренировка: 12-38 фото с разных углов при одинаковом свете. Платформы: Krea (платно), ComfyUI (локально).`
      }
    ]
  },

  // ═══ VIDEO COLUMN (x=3): Levels of Video Generation ═══
  {
    id: 'vid-generation',
    type: NodeType.CREATIVE,
    title: 'Video: Generation',
    description: 'Text/Image-to-Video. Первые клипы.',
    details: 'Генерация видео из текста или картинки. Каждая модель — свои сильные стороны: физика, кинематографичность, длина клипа.',
    connections: ['vid-avatars'],
    tools: ['Kling', 'Veo 3.1', 'Sora', 'Luma', 'Hailuo'],
    timeEstimate: 'Level 2',
    x: 3, y: 1,
    toolDetails: [
      { name: 'Kling 2.1', url: 'https://klingai.com', category: 'Model', description: 'Kuaishou. TLCM-архитектура: стабильность между кадрами, сохранение identity. 5-10 сек (бесплатно), до 2 мин (платно), до 3 мин через Extend. 3 тира: Standard/Pro/Master. Elements: несколько отдельных картинок (птица + яблоко + пьедестал) → одна сцена. Лучше всех понимает физику.', bestFor: 'Character continuity, physics, multi-image composition (Elements).' },
      { name: 'Veo 3.1', url: 'https://deepmind.google/models/veo', category: 'Model', description: 'Google. Нативный звук: диалоги, SFX, музыка в одном шаге. Lip-sync. Ingredients to Video: несколько ref-картинок → одна сцена (стиль, персонаж, объекты из разных источников). First & Last Frame. Fast/Pro.', bestFor: 'Cinematic + audio, dialogue, Ingredients compositing.' },
      { name: 'Sora 2', url: 'https://sora.chatgpt.com', category: 'Model', description: 'OpenAI. Нативный аудио-визуальный синтез с lip-sync. Storyboard: раскадровка из нескольких сцен. Лучшая нарративная интерпретация. Fast и Pro варианты.', bestFor: 'Narrative video, storyboard, audio-visual storytelling.' },
      { name: 'Wan 2.2', url: 'https://huggingface.co/Wan-AI', category: 'Open Source', description: 'Alibaba. 14B DiT, open-source (Apache 2.0). Мировой масштаб: эпические ландшафты, толпы, мегаструктуры. 3D Causal VAE. НЕ для крупных планов лиц — для world-building.', bestFor: 'Epic landscapes, crowds, world simulation, open-source.' },
      { name: 'SeeDance 1.0', url: 'https://seedance.ai', category: 'Motion Engine', description: 'ByteDance. Самый быстрый AI video. Сильная динамика: танцы, экшен, быстрые переходы. Fluid/psychedelic motion, seamless looping. Lite (скорость) и Pro (качество). Verb-first prompting.', bestFor: 'Dynamic motion, dance, action, VJ loops, speed.' },
      { name: 'Luma Dream Machine', url: 'https://lumalabs.ai', category: 'Model', description: 'Плавные движения камеры, лупы. Видео-редактирование в стиле Photoshop (но пока работает хуже конкурентов). Image-to-Video.', bestFor: 'Social clips, morphs, loops, basic video editing.' },
      { name: 'Hailuo.ai', url: 'https://hailuo.ai', category: 'Model', description: 'Хорошая генерация от изображения в начале к изображению в конце. Minimax.', bestFor: 'Start-to-End transitions.' },
    ]
  },
  {
    id: 'vid-avatars',
    type: NodeType.CREATIVE,
    title: 'Video: Avatars',
    description: 'Цифровые аватары, talking heads, lip sync.',
    details: 'Фото + голос = говорящий персонаж. Для рилсов, презентаций, обучающих видео. Lip sync и eye contact correction.',
    connections: ['vid-editing'],
    tools: ['HeyGen', 'Captions.ai', 'Higgsfield'],
    timeEstimate: 'Level 3',
    x: 3, y: 2.15,
    toolDetails: [
      { name: 'HeyGen', url: 'https://heygen.com', category: 'Avatars', description: 'Цифровые аватары: фото + голос = говорящий персонаж. Есть API и работа через скрипты — можно автоматизировать создание большого количества видео.', bestFor: 'Digital avatars, talking heads, batch video via API.' },
      { name: 'Captions.ai', url: 'https://www.captions.ai', category: 'Video Tool', description: 'Создание виральных видео с автоматическим переводом и коррекцией взгляда в камеру.', bestFor: 'Viral videos, auto-translation, eye contact fix.' },
      { name: 'Higgsfield AI', url: 'https://higgsfield.ai', category: 'AI Effects', description: 'Видео/изображения с AI-эффектами; Soul ID для обучения лица.', bestFor: 'AI photo/video effects, face training.' },
    ]
  },
  {
    id: 'vid-editing',
    type: NodeType.CREATIVE,
    title: 'Video: Editing & Compositing',
    description: 'Монтаж, элементы, compositing.',
    details: 'Профессиональное редактирование: tracking, inpaint, motion brush. Compositing элементов. Upscale, стабилизация, restyling.',
    connections: ['vid-production'],
    tools: ['Runway', 'Kling', 'Topaz', 'Florafauna'],
    timeEstimate: 'Level 4',
    x: 3, y: 3.1,
    toolDetails: [
      { name: 'Runway Gen-4', url: 'https://runwayml.com', category: 'Platform', description: 'Full editor (tracking, inpaint) + Generation. Editing tools are best in class.', bestFor: 'Professional control, Motion Brush.' },
      { name: 'Kling', url: 'https://klingai.com', category: 'Video Editing', description: 'Помимо генерации — мощные инструменты редактирования видео, эффекты, lip sync.', bestFor: 'Video editing, effects, lip sync.' },
      { name: 'Topaz Video AI', url: 'https://topazlabs.com', category: 'Post-Production', description: 'Upscale/стабилизация/слоумо.', bestFor: 'Video upscaling, stabilization.' },
      { name: 'Florafauna.ai', url: 'https://florafauna.ai', category: 'Node Graph', description: 'Нодовая система images/video; удобный restyling.', bestFor: 'Video restyling, node workflows.' },
    ]
  },
  {
    id: 'vid-production',
    type: NodeType.CREATIVE,
    title: 'Video: Pipelines & Automation',
    description: 'JSON-монтаж, API, скрипты.',
    details: 'Сложные пайплайны: программный монтаж через JSON/API (LLM генерирует монтажный лист → API собирает видео). Batch-производство из шаблонов. Локальные video pipelines — через ComfyUI (см. Local & Cloud Compute).',
    connections: ['infra'],
    tools: ['Shotstack', 'Creatomate', 'Pictory'],
    timeEstimate: 'Level 5',
    x: 3, y: 3.9,
    toolDetails: [
      { name: 'Shotstack', url: 'https://shotstack.io', category: 'Video API', description: 'Программный монтаж через API. JSON → готовое видео. Один шаблон → много вариаций. Титры, плашки, склейка. Удобен для огромных объёмов.', bestFor: 'Batch video production, API automation, templates.' },
      { name: 'Creatomate', url: 'https://creatomate.com', category: 'Video API', description: 'Отправить сценарий и структуру → видео собирается само. Как символы в Figma: меняешь в одном месте — меняется везде. Гибче Shotstack для сложных сценариев.', bestFor: 'Template-based video, programmatic editing, batch rendering.' },
      { name: 'Pictory', url: 'https://pictory.ai', category: 'Script-to-Video', description: 'Текст/сценарий → готовое видео с подбором стоковых клипов, субтитрами, озвучкой.', bestFor: 'Script-to-video, content repurposing.' },
    ]
  },

  // ═══ MUSIC COLUMN (x=4): Levels of Music & Audio ═══
  {
    id: 'music-tracks',
    type: NodeType.MUSIC,
    title: 'Music: Track Generation',
    description: 'Генерация треков из промптов.',
    details: 'Пишешь описание — получаешь готовый трек с вокалом. Radio-ready songs за минуты.',
    connections: ['music-voice'],
    tools: ['Suno', 'Udio', 'Stable Audio', 'AIVA'],
    timeEstimate: 'Level 2',
    x: 4, y: 1,
    toolDetails: [
      { name: 'Suno', url: 'https://suno.com', category: 'Song Generator', description: 'Одна строка — готовая песня с вокалом. Цепкие хуки, radio-ready. Стилистический "почерк" заметен, но скорость — лучшая.', bestFor: 'Демки с вокалом, джинглы, TikTok-формат.' },
      { name: 'Udio', url: 'https://udio.com', category: 'Song Generator', description: 'Выше качество вокала и сведения. Удобные правки куплет/припев. Более естественные жанры.', bestFor: 'Радиоформат, поп/инди, саунд для видео.' },
      { name: 'Stable Audio', url: 'https://stableaudio.com', category: 'Music/SFX', description: 'Инструментал, саунд-дизайн, лупы/подложки. Контроль длительности. Вокал слабее.', bestFor: 'Фон для видео, эмбиент, SFX.' },
      { name: 'AIVA', url: 'https://aiva.ai', category: 'Soundtrack', description: 'Оркестровое/саундтрек. Правки через партитуру/MIDI. Нет вокала.', bestFor: 'Корпоратив, игры, кино-бэкграунд.' },
      { name: 'Fugatto (Nvidia)', url: 'https://www.nvidia.com/en-us/ai/fugatto/', category: 'Audio AI', description: 'Nvidia. Трансформация голоса, акцентов, эмоций. Генерация звуков по описанию. Смешивание инструкций (грустный голос + дождь).', bestFor: 'Voice transformation, sound design, emotion control.' },
    ],
    tips: [
      {
        title: 'Структурные теги: контроль формы трека',
        text: `Suno и Udio понимают теги структуры в квадратных скобках: [Intro], [Verse], [Chorus], [Bridge], [Outro], [Break], [Hook], [Instrumental]. Пишите их прямо в тексте песни — модель выстроит форму по ним. Без тегов модель сама решает где припев, и результат менее предсказуем.`
      },
      {
        title: 'Теги исполнения: как звучит голос',
        text: `В круглых скобках можно указать манеру: (whispering), (energetic), (sad), (screaming), (spoken word), (falsetto). Комбинируйте со структурой: [Verse] (whispering) — тихий куплет, [Chorus] (energetic) — мощный припев. Работает в Suno, частично в Udio.`
      },
      {
        title: 'Жанровые эксперименты',
        text: `Попробуйте неочевидные жанры: Cyberpunk Bluegrass, Cathedralwave, Lo-fi Jazz Noir. AI-модели хорошо справляются с гибридами, которые сложно записать вживую. Чем конкретнее описание атмосферы и инструментов — тем интереснее результат.`
      }
    ]
  },
  {
    id: 'music-voice',
    type: NodeType.MUSIC,
    title: 'Music: Voice Design',
    description: 'Voice cloning, интонации, TTS.',
    details: 'Клонирование голоса, дизайн интонаций и "чтения". Контроль над тем, КАК голос звучит — не только что говорит.',
    connections: ['music-sounddesign'],
    tools: ['ElevenLabs', 'MiniMax', 'Cartesia', 'OpenVoice'],
    timeEstimate: 'Level 3',
    x: 4, y: 2.15,
    toolDetails: [
      { name: 'ElevenLabs', url: 'https://elevenlabs.io', category: 'Speech (TTS)', description: 'Лидер TTS: клоны голосов, эмоции, эффекты. Озвучка роликов, дубляж, подкасты. Чувствительность к пунктуации/разметке.', bestFor: 'Dubbing, audiobooks, voice cloning, podcasts.' },
      { name: 'MiniMax', url: 'https://minimax.io/audio', category: 'Voice', description: 'Бесплатные кредиты для клонирования голоса, voice design, text to audio.', bestFor: 'Free voice cloning, voice design.' },
      { name: 'Cartesia', url: 'https://cartesia.ai', category: 'API', description: 'Тембральная гибкость, real-time API. Больше для инженеров.', bestFor: 'Интерактивные ассистенты, real-time речь в продуктах.' },
      { name: 'OpenVoice', url: 'https://github.com/myshell-ai/OpenVoice', category: 'Open Source', description: 'Открытый voice conversion и style-трансфер голоса. Zero-shot клонирование на разных языках.', bestFor: 'Voice style transfer, cross-lingual cloning.' },
    ]
  },
  {
    id: 'music-sounddesign',
    type: NodeType.MUSIC,
    title: 'Music: Sound Design',
    description: 'Многослойное редактирование, стемы, SFX.',
    details: 'Разделение треков на дорожки (стемы), микширование, sound effects. Suno умеет многослойное редактирование: можно отдельно менять вокал, инструменты, аранжировку. Ещё больше контроля — в ComfyUI (4+ слоёв аудио, редактирование отдельных кусков).',
    connections: ['music-agents', 'infra'],
    tools: ['Suno', 'Demucs', 'Stable Audio'],
    timeEstimate: 'Level 4',
    x: 4, y: 3.1,
    toolDetails: [
      { name: 'Suno (Multi-layer)', url: 'https://suno.com', category: 'Editing', description: 'Многослойное редактирование: отдельно вокал, инструменты, аранжировка. Можно перегенерировать один слой, не трогая остальные.', bestFor: 'Layer-by-layer music editing, vocal/instrument control.' },
      { name: 'Demucs', url: 'https://github.com/facebookresearch/demucs', category: 'Open Source', description: 'Разделение треков на дорожки (стемы): вокал, бас, ударные, прочее.', bestFor: 'Stem separation, remixing.' },
      { name: 'Stable Audio', url: 'https://stableaudio.com', category: 'Music/SFX', description: 'Лупы, фон, SFX; контроль длительности.', bestFor: 'Sound effects, loops.' },
    ]
  },
  {
    id: 'music-agents',
    type: NodeType.MUSIC,
    title: 'Music: Voice Agents',
    description: 'Голосовые агенты, real-time voice.',
    details: 'Голосовые агенты которые разговаривают в реальном времени. Интеграция в приложения и сервисы.',
    connections: [],
    tools: ['Cartesia', 'ElevenLabs', 'OpenVoice'],
    timeEstimate: 'Level 5',
    x: 4, y: 3.9,
    toolDetails: [
      { name: 'Cartesia', url: 'https://cartesia.ai', category: 'API', description: 'Real-time голос через API. Ultra-low latency.', bestFor: 'Real-time voice agents in apps.' },
      { name: 'ElevenLabs', url: 'https://elevenlabs.io', category: 'Conversational AI', description: 'Conversational AI agents с клонированным голосом.', bestFor: 'Voice agents, conversational AI.' },
    ]
  },

  // ═══ DESIGN COLUMN (x=5) ═══
  {
    id: 'design-start',
    type: NodeType.DESIGN,
    secondary: true,
    title: 'Design & Vector',
    description: 'Clean logos, icons, and consistent assets.',
    details: 'Moving away from raster noise to clean, usable design assets and consistent styling.',
    connections: ['design-3d'],
    tools: ['Recraft', 'Ideogram', 'Krea', 'Pencil'],
    timeEstimate: '10 Hours',
    x: 4.5, y: 1.6,
    toolDetails: [
      { name: 'Recraft', url: 'https://recraft.ai', category: 'Vector/Brand', description: 'Infinite canvas for Vector generation and Brand sets.', bestFor: 'SVG icons, consistent brand identity.' },
      { name: 'Ideogram', url: 'https://ideogram.ai', category: 'Typography', description: 'Leader in rendering text inside images.', bestFor: 'T-shirt designs, posters with text.' },
      { name: 'Krea.ai', url: 'https://www.krea.ai', category: 'Realtime Canvas', description: 'Realtime generation and upscaling.', bestFor: 'Interactive design, Upscaling.' },
      { name: 'Pencil', url: 'https://pencil.li', category: 'UI Design', description: 'AI-расширение для дизайна UI/UX прямо в IDE. Генерация интерфейсов, компонентов, макетов.', bestFor: 'UI/UX design, component generation, prototyping.' },
    ]
  },
  {
    id: 'design-3d',
    type: NodeType.DESIGN,
    secondary: true,
    title: '3D & Spatial',
    description: 'Text-to-3D and SVG conversion.',
    details: 'Generating assets for the spatial web and game design.',
    connections: [],
    tools: ['Spline', 'Formia'],
    timeEstimate: 'Project Based',
    x: 4.5, y: 2.6,
    toolDetails: [
      { name: 'Spline', url: 'https://spline.design', category: '3D Design', description: 'Web-based 3D design with AI text-to-3D.', bestFor: 'Web 3D assets, simple models.' },
      { name: 'Formia.so', url: 'https://formia.so', category: 'SVG to 3D', description: 'Instant conversion of 2D vectors to 3D meshes.', bestFor: 'Logos to 3D.' }
    ]
  },

  // --- Level 3 row: Vibe Coding & Automation ---
  {
    id: 'coding-generators',
    type: NodeType.CODING,
    title: 'Vibe Coding & Automation',
    description: 'Платформы для создания приложений и автоматизаций.',
    details: 'От идеи к MVP за часы. Google Build — самый простой вход. Автоматизации — когда нужно связать сервисы между собой без кода.',
    connections: ['coding-ide'],
    tools: ['Google Build', 'Lovable', 'Replit', 'n8n', 'Make'],
    timeEstimate: 'Hours to MVP',
    x: 1, y: 2.2,
    toolDetails: [
      { name: 'Google Build', url: 'https://aistudio.google.com/apps', category: 'Prompt-to-App', description: 'Самый простой вход в вайб-кодинг. В браузере, видишь результат сразу. Лучше понимает красивый дизайн. Можно скачать код или расшарить ссылку — другие смогут на её основе создавать свои инструменты. Галерея чужих проектов как inspiration.', bestFor: 'Быстрый вход, быстрые итерации, шаринг.' },
      { name: 'Lovable', url: 'https://lovable.dev', category: 'Prompt-to-App', description: 'Rapid full-stack prototyping with Supabase integration.', bestFor: 'Scaffolding full-stack foundations to export later.' },
      { name: 'Replit', url: 'https://replit.com', category: 'Cloud IDE / Agent', description: 'All-in-one cloud environment. Zero setup deployment.', bestFor: 'Fast MVP/Demos, Non-technical founders.' },
      { name: 'bolt.new', url: 'https://bolt.new', category: 'Browser Container', description: 'Instant full-stack generation in the browser (WebContainers).', bestFor: 'One-off prototypes, browser demos.' },
      { name: 'v0.dev', url: 'https://v0.dev', category: 'UI Generator', description: 'Vercel ecosystem tool for Next.js/Tailwind UI.', bestFor: 'High quality UI/Frontend prototypes.' },
      { name: 'Cowork', url: 'https://cowork.dev', category: 'Vibe Coding', description: 'Сервис для вайб-кодинга и быстрого создания MVP.', bestFor: 'Collaborative vibe-coding.' },
      { name: 'Oh My OpenCode', url: 'https://ohmyopencode.com', category: 'Code Interface', description: 'Интерфейс для работы с кодом через GPT.', bestFor: 'GPT-powered code workflows.' },
      { name: 'n8n', url: 'https://n8n.io', category: 'Automation', description: 'Self-hosted workflow automation. Open-source альтернатива Zapier/Make.', bestFor: 'Complex automations, self-hosted.' },
      { name: 'Make.com', url: 'https://www.make.com', category: 'Automation', description: 'Облачные автоматизации (бывший Integromat). Визуальный редактор.', bestFor: 'Cloud automations, visual editor.' },
      { name: 'Zapier', url: 'https://zapier.com', category: 'Automation', description: 'Простые триггерные связки (Telegram -> Trello, и т.д.).', bestFor: 'Simple trigger-based automations.' },
    ]
  },
  {
    id: 'coding-ide',
    type: NodeType.CODING,
    title: 'IDEs',
    description: 'The "Last 20%". Logic, Refactoring, Scale.',
    details: 'Where the real work happens. Harder projects, more control.',
    connections: ['coding-terminal', 'coding-agents'],
    tools: ['Cursor', 'Windsurf'],
    timeEstimate: 'Career Skill',
    x: 1, y: 3.15,
    toolDetails: [
      { name: 'Cursor', url: 'https://cursor.com', category: 'AI-First IDE', description: 'Fork of VS Code. Deep context control.', bestFor: 'Pro dev, Refactoring, Scalable projects.' },
      { name: 'Windsurf', url: 'https://codeium.com/windsurf', category: 'Flow IDE', description: 'Focuses on "Flow" and deep agentic behavior (Cascade).', bestFor: 'Automating routine, mixed teams.' },
    ],
    tips: [
      {
        title: 'Настройка Cursor как "продолжения мозга"',
        text: `Совет Антона Воскобовича:
1. Файл .cursorrules: Создайте в корне проекта. Пропишите: "Ты — Senior Fullstack Architect. Всегда проверяй соответствие кода паттерну [название]. Не используй устаревшие библиотеки. Ответы кратко, только суть".
2. Индексация папок: В настройках Cursor включите индексацию не только кода, но и папки /docs или Obsidian Vault. Теперь можно спрашивать: "Как эта функция соотносится с моей концепцией из заметки X?".
3. MCP Server: Подключите локальный MCP сервер для работы с файловой системой. Убирает галлюцинации при работе с путями и структурой файлов.`
      }
    ]
  },
  {
    id: 'coding-terminal',
    type: NodeType.CODING,
    title: 'Terminal & CLI',
    description: 'Claude Code, agentic terminal workflows.',
    details: 'Advanced tweaking via conversational CLI. Bridging the gap between vibe-coding and traditional engineering.',
    connections: [],
    tools: ['Claude Code', 'Aider', 'GitHub Copilot CLI'],
    timeEstimate: 'Deep Skill',
    x: 1, y: 3.9,
    toolDetails: [
      { name: 'Claude Code', url: 'https://docs.anthropic.com/en/docs/claude-code', category: 'CLI Agent', description: 'Conversational interface for granular codebase control.', bestFor: 'Complex refactoring, debugging.' },
    ]
  },
  {
    id: 'coding-agents',
    type: NodeType.CODING,
    title: 'Agents & Infrastructure',
    description: 'Мульти-агентные системы, MCP, автономные пайплайны.',
    details: 'Когда агенты работают с агентами. Построение инфраструктуры: MCP для подключения инструментов, фреймворки для оркестрации мульти-агентных систем, деплой автономных пайплайнов.',
    connections: [],
    tools: ['MCP', 'LangGraph', 'CrewAI', 'OpenAI Agents SDK'],
    timeEstimate: 'Level 4-5',
    x: 1.5, y: 3.3,
    toolDetails: [
      { name: 'MCP', url: 'https://modelcontextprotocol.io', category: 'Protocol', description: 'Model Context Protocol — стандарт подключения AI к внешним инструментам и данным. Работает в Cursor, Windsurf, Claude.', bestFor: 'Custom integrations, tool orchestration.' },
      { name: 'LangGraph', url: 'https://langchain-ai.github.io/langgraph/', category: 'Agent Framework', description: 'Фреймворк для stateful мульти-агентных систем с ветвлением, циклами и error recovery. Часть экосистемы LangChain.', bestFor: 'Complex branching agents, long-running workflows.' },
      { name: 'CrewAI', url: 'https://crewai.com', category: 'Agent Framework', description: 'Платформа для создания команд AI-агентов с ролями. Каждый агент — специалист со своей задачей.', bestFor: 'Role-based multi-agent teams, task splitting.' },
      { name: 'OpenAI Agents SDK', url: 'https://openai.github.io/openai-agents-python/', category: 'Agent SDK', description: 'Официальный SDK OpenAI для построения агентов. Handoffs между агентами, guardrails, tracing.', bestFor: 'OpenAI ecosystem, production agents.' },
      { name: 'Google ADK', url: 'https://google.github.io/adk-docs/', category: 'Agent SDK', description: 'Agent Development Kit от Google. Мульти-агентные системы с интеграцией в Google Cloud.', bestFor: 'Google ecosystem, enterprise agents.' },
      { name: 'Pipedream', url: 'https://pipedream.com', category: 'Developer Tool', description: 'Работа с API и быстрая обработка вебхуков. Мост между агентами и внешними сервисами.', bestFor: 'API integrations, webhooks, agent triggers.' },
      { name: 'Linear', url: 'https://linear.app', category: 'Project Management', description: 'Управление задачами с MCP-интеграцией. Агенты могут создавать и обновлять задачи.', bestFor: 'Task management with MCP, agent-driven project tracking.' },
      { name: 'OpenClaw Guide', url: 'https://timeweb.cloud/tutorials/razvertyvanie-openclaw-svoe-lichnoe-ii-v-telegram', category: 'Tutorial', description: 'Инструкция по созданию личного AI-ассистента в Telegram на Timeweb Cloud.', bestFor: 'Building personal Telegram AI assistant.' },
      { name: 'Caila.io', url: 'https://docs.caila.io/docs/guides/ai-tools', category: 'Developer Guide', description: 'Гайд по подключению AI-инструментов для разработчиков. Интеграция LLM в приложения.', bestFor: 'Integrating AI tools into dev workflows.' },
      { name: 'Agent Frameworks Guide', url: 'https://www.langflow.org/blog/the-complete-guide-to-choosing-an-ai-agent-framework-in-2025', category: 'Guide', description: 'Сравнение фреймворков для агентов: LangGraph, CrewAI, AutoGen, n8n. Decision matrix с 10 факторами.', bestFor: 'Choosing the right agent framework.' },
    ]
  },
  {
    id: 'infra',
    type: NodeType.INFRA,
    title: 'Node Pipelines & Local Compute',
    description: 'ComfyUI, нодовые пайплайны, аренда GPU.',
    details: 'Нодовое редактирование: каждый шаг генерации — отдельный блок, полный контроль. ComfyUI — image/video/audio пайплайны. Локальный запуск или аренда серверов. Когда нужна приватность, отсутствие цензуры или низкая стоимость на объёмах.',
    connections: ['img-advanced', 'vid-production', 'music-agents'],
    tools: ['ComfyUI', 'RunPod', 'HuggingFace', 'CivitAI'],
    timeEstimate: 'Lifetime Mastery',
    x: 2.5, y: 4.5,
    toolDetails: [
      { name: 'ComfyUI', url: 'https://github.com/comfyanonymous/ComfyUI', category: 'Framework', description: 'Нодовая среда для GenAI: image, video, audio пайплайны. Каждый блок — одно действие. Комбинирование разных моделей. Весь workflow = JSON-файл, который можно шарить.', bestFor: 'Complex pipelines, mixing models, offline work, batch processing.' },
      { name: 'Fooocus', url: 'https://github.com/lllyasviel/Fooocus', category: 'Local Interface', description: 'Простейший локальный интерфейс для SDXL. Для тех, кому ComfyUI слишком сложен.', bestFor: 'Beginners wanting local privacy, simple SDXL.' },
      { name: 'Wan 2.2', url: 'https://huggingface.co/Wan-AI', category: 'Open Source Video', description: 'Alibaba. 14B DiT, open-source (Apache 2.0). Локальный запуск через ComfyUI. Эпические ландшафты, world-scale simulation.', bestFor: 'Local video generation, world-building, custom pipelines.' },
      { name: 'RunPod', url: 'https://runpod.io', category: 'Cloud GPU', description: 'Аренда GPU (H100, A100, 4090) по часам. Serverless или Pod. Для тяжёлых задач, когда своего железа не хватает.', bestFor: 'GPU rental, heavy generation, training.' },
      { name: 'Vast.ai', url: 'https://vast.ai', category: 'Cloud GPU', description: 'Маркетплейс GPU: дешевле RunPod, но менее стабильно. Хорош для экспериментов.', bestFor: 'Budget GPU rental, experiments.' },
      { name: 'CivitAI', url: 'https://civitai.com', category: 'Model Hub', description: 'Хаб LoRA, чекпойнтов, готовых ComfyUI workflow. Тренировка и скачивание моделей.', bestFor: 'Finding LoRA/checkpoints, ready workflows.' },
      { name: 'HuggingFace', url: 'https://huggingface.co', category: 'Repo', description: 'GitHub для ML-моделей. Веса, Spaces, документация.', bestFor: 'Finding weights, Spaces, model cards.' },
    ],
    tips: [
      {
        title: 'ComfyUI — это JSON',
        text: `Весь workflow ComfyUI — это просто JSON-файл. Можно отправить его коллеге, тот установит нужные модели и загрузит workflow к себе. Не нужно делать с нуля — ищите готовые workflow в интернете (CivitAI, Reddit, YouTube).`
      },
      {
        title: 'Нодовая среда = контроль каждого шага',
        text: `Каждый блок (нод) — одно действие: найти контур, распознать лицо, сгенерировать по промпту, анимировать. Можно комбинировать разные модели в одном пайплайне. Автоматизация через скрипты: загрузка изображений по очереди, batch-обработка.`
      },
      {
        title: 'Не только картинки',
        text: `ComfyUI умеет и видео, и музыку (4+ слоёв), и аудио. Больше контроля, чем в Suno/Udio: можно отредактировать один кусочек, не трогая остальное. Работает локально — без интернета, на своём компьютере или арендованном сервере.`
      },
      {
        title: 'Когда арендовать сервер',
        text: `Если ваша работа завязана на генерацию — облачный сервер (~$50/сутки) может быть дешевле, чем платить за API моделей. Для разовых задач — RunPod по часам. Для постоянной работы — свой сервер или Vast.ai.`
      }
    ]
  },
]
