import { NodeType, SchemaNode } from './types';

// Grid Layout Strategy:
// X=0: Mindset/Foundation (Levels 0-3)
// X=1: Coding (Vibe Coding)
// X=2: Design (UI, Vector, 3D)
// X=3: Creative (Image, Video)
// X=4: Music (Audio, TTS)

export const SCHEMA_NODES: SchemaNode[] = [
  // --- FOUNDATION (Level 0 - 3) ---
  {
    id: 'mindset-barrier',
    type: NodeType.MINDSET,
    title: 'Lvl 0: The Barrier',
    description: 'The hardest part isn’t the tools, it’s believing what is possible.',
    details: 'Tools can teach you how to use them. The real challenge is the mental barrier and feeling the "glass ceiling" of possibilities. Finding the "ownership of ideas" is key. We need to switch our mindset to immediately ask "How can AI solve this?" when facing a problem.',
    connections: ['life-engineering'],
    tools: ['Brain', 'Notion'],
    timeEstimate: 'Day 0',
    x: 0,
    y: 0
  },
  {
    id: 'life-engineering',
    type: NodeType.MINDSET,
    title: 'Life Engineering',
    description: 'Design Thinking applied to AI adoption.',
    details: 'Life engineering is essentially a Design Thinking framework for finding ideas to create. It is about "osmosis" (community) and "just doing it" (endless experimentation). It moves beyond using AI once to true integration.',
    connections: ['level-1'],
    tools: ['Community Chat', 'Design Thinking'],
    timeEstimate: 'Ongoing',
    x: 0,
    y: 1
  },
  {
    id: 'level-1',
    type: NodeType.MINDSET,
    title: 'Lvl 1: Awareness',
    description: 'Knowing it exists. Agents & Regulations.',
    details: 'The entry level. Reading reports, knowing about "Agents" and "Agency", understanding the vertical shift in the world and regulations. Most people are past this, but it is the foundation.',
    connections: ['level-2'],
    tools: ['Newsletters', 'Reports', 'YouTube'],
    timeEstimate: '0-5 Hours',
    x: 0,
    y: 2
  },
  {
    id: 'level-2',
    type: NodeType.MINDSET,
    title: 'Lvl 2: Usage & Diversity',
    description: 'Probing the filters. DeepSeek vs GPT.',
    details: 'Trying different chats (DeepSeek, GPT, etc.) to understand their "personality," safety filters, and cultural biases. It is no longer "all human knowledge" but a filtered slice. Poking the AI to see how it reacts.',
    connections: ['level-3'],
    tools: ['ChatGPT', 'DeepSeek', 'Gemini', 'Perplexity'],
    timeEstimate: '5-50 Hours',
    x: 0,
    y: 3
  },
  {
    id: 'level-3',
    type: NodeType.MINDSET,
    title: 'Lvl 3: Context & RAG',
    description: 'Knowledge Bases, Second Brains.',
    details: 'Moving beyond the "mainstream" answer. Using RAG (Retrieval-Augmented Generation) to feed specific books or context (e.g., "Explain the world via Freud, not Marx"). Reducing hallucinations by providing specific modern data.',
    connections: ['coding-generators', 'design-start', 'creative-image'],
    tools: ['Custom GPTs', 'NotebookLM', 'Obsidian'],
    timeEstimate: '50+ Hours',
    x: 0,
    y: 4
  },

  // --- TRACK 1: VIBE CODING (X=1) ---
  {
    id: 'coding-generators',
    type: NodeType.CODING,
    title: 'App Generators',
    description: 'Prompt-to-App tools. Speed over control.',
    details: 'Tools for instant prototyping. Great for the "First 80%" of a product. "No-code" is a myth - these are strongest in the hands of developers who can debug.',
    connections: ['coding-ide'],
    tools: ['Lovable', 'Replit', 'bolt.new', 'v0.dev'],
    timeEstimate: 'Weekend Project',
    x: 1,
    y: 1,
    toolDetails: [
      {
        name: 'Lovable',
        url: 'https://lovable.dev',
        category: 'Prompt-to-Application',
        description: 'Rapid full-stack prototyping with Supabase integration.',
        bestFor: 'Scaffolding full-stack foundations to export later.',
        pros: 'Fast scaffolding, GitHub integration.',
        cons: 'Expensive credit model, UI quality varies.'
      },
      {
        name: 'Replit',
        url: 'https://replit.com',
        category: 'Cloud IDE / Agent',
        description: 'All-in-one cloud environment. Zero setup deployment.',
        bestFor: 'Fast MVP/Demos, Non-technical founders.',
        pros: 'Zero setup, "0 to 1" speed.',
        cons: 'Harder for serious SaaS scaling, vendor lock-in.'
      },
      {
        name: 'bolt.new',
        url: 'https://bolt.new',
        category: 'Browser Container',
        description: 'Instant full-stack generation in the browser (WebContainers).',
        bestFor: 'One-off prototypes, browser demos.',
        pros: 'Zero install, fast entry.',
        cons: 'No native git, instability, credit model.'
      },
      {
        name: 'v0.dev',
        url: 'https://v0.dev',
        category: 'UI Generator',
        description: 'Vercel ecosystem tool for Next.js/Tailwind UI.',
        bestFor: 'High quality UI/Frontend prototypes.',
        pros: 'Excellent shadcn/ui integration.',
        cons: 'Context limits, credit model.'
      }
    ]
  },
  {
    id: 'coding-ide',
    type: NodeType.CODING,
    title: 'AI-Augmented IDEs',
    description: 'The "Last 20%". Logic, Refactoring, Scale.',
    details: 'Where the real work happens. Moving from "Generating" to "Engineering". These tools keep you in the flow.',
    connections: ['infra'],
    tools: ['Cursor', 'Windsurf', 'Google AI Studio'],
    timeEstimate: 'Career Skill',
    x: 1,
    y: 3,
    toolDetails: [
      {
        name: 'Cursor',
        url: 'https://cursor.com',
        category: 'AI-First IDE',
        description: 'Fork of VS Code. Deep context control.',
        bestFor: 'Pro dev, Refactoring, Scalable projects.',
        pros: 'Deep context, predictable subscription.',
        cons: 'Performance drops occasionally.'
      },
      {
        name: 'Windsurf',
        url: 'https://codeium.com/windsurf',
        category: 'Flow IDE',
        description: 'Focuses on "Flow" and deep agentic behavior (Cascade).',
        bestFor: 'Automating routine, mixed teams.',
        pros: 'Intuitive UX, live preview.',
        cons: 'Credit model for some actions.'
      },
      {
        name: 'Google AI Studio',
        url: 'https://aistudio.google.com',
        category: 'Model Interface',
        description: 'Sandbox for prompt engineering and API code generation.',
        bestFor: 'Embedding AI functions, testing prompts.',
        pros: 'Fast cycle, Export to code.',
        cons: 'Rate limits on free tier.'
      }
    ]
  },

  // --- TRACK 2: DESIGN & 3D (X=2) ---
  {
    id: 'design-start',
    type: NodeType.DESIGN,
    title: 'Design & Vector',
    description: 'Clean logos, icons, and consistent assets.',
    details: 'Moving away from raster noise to clean, usable design assets and consistent styling.',
    connections: ['design-3d'],
    tools: ['Recraft', 'Ideogram', 'Krea', 'Visual Electric'],
    timeEstimate: '10 Hours',
    x: 2,
    y: 1,
    toolDetails: [
      {
        name: 'Recraft',
        url: 'https://recraft.ai',
        category: 'Vector/Brand',
        description: 'Infinite canvas for Vector generation and Brand sets.',
        bestFor: 'SVG icons, consistent brand identity.',
        pros: 'Editable SVGs, Style consistency.',
        cons: 'Artifacts in raster mode.'
      },
      {
        name: 'Ideogram',
        url: 'https://ideogram.ai',
        category: 'Typography',
        description: 'Leader in rendering text inside images.',
        bestFor: 'T-shirt designs, posters with text.',
        pros: 'Best-in-class typography.',
        cons: 'Queue times, Strict moderation.'
      },
      {
        name: 'Visual Electric',
        url: 'https://visualelectric.com',
        category: 'Moodboarding',
        description: 'Infinite canvas for aesthetic exploration.',
        bestFor: 'Designers, Moodboards, Photorealism.',
        pros: 'Trained references for style consistency.',
        cons: 'Weaker at rotation/physics.'
      },
      {
        name: 'Krea.ai',
        url: 'https://www.krea.ai',
        category: 'Realtime Canvas',
        description: 'Realtime generation and upscaling.',
        bestFor: 'Interactive design, Upscaling.',
        pros: 'Realtime, Style consistency.',
        cons: 'Artifacts in group shots.'
      }
    ]
  },
  {
    id: 'design-3d',
    type: NodeType.DESIGN,
    title: '3D & Spatial',
    description: 'Text-to-3D and SVG conversion.',
    details: 'Generating assets for the spatial web and game design.',
    connections: ['creative-image'],
    tools: ['Spline', 'Formia', 'Rodin'],
    timeEstimate: 'Project Based',
    x: 2,
    y: 2,
    toolDetails: [
      {
        name: 'Spline',
        url: 'https://spline.design',
        category: '3D Design',
        description: 'Web-based 3D design with AI text-to-3D.',
        bestFor: 'Web 3D assets, simple models.',
        pros: 'Browser based, export to web.',
        cons: 'Limited modeling tools vs Blender.'
      },
      {
        name: 'Formia.so',
        url: 'https://formia.so',
        category: 'SVG to 3D',
        description: 'Instant conversion of 2D vectors to 3D meshes.',
        bestFor: 'Logos to 3D.',
        pros: 'Very fast specialized tool.',
        cons: 'Narrow use case.'
      }
    ]
  },

  // --- TRACK 3: CREATIVE (IMAGE & VIDEO) (X=3) ---
  {
    id: 'creative-image',
    type: NodeType.CREATIVE,
    title: 'Image Generation',
    description: 'The vast ecosystem of Image Models.',
    details: 'From high-end art to precise editing. The ecosystem is huge.',
    connections: ['creative-video'],
    tools: ['Midjourney', 'Flux', 'Seedream', 'Fusara'],
    timeEstimate: '20 Hours',
    x: 3,
    y: 1,
    toolDetails: [
      {
        name: 'Midjourney v7',
        url: 'https://midjourney.com',
        category: 'Art Model',
        description: 'The aesthetic king. Painterly and rich.',
        bestFor: 'High-end art, fantasy, advertising.',
        pros: 'Aesthetics, Sref (Style Reference).',
        cons: 'Text generation is weak, Hands.'
      },
      {
        name: 'Flux.1',
        url: 'https://blackforestlabs.ai',
        category: 'Open Model',
        description: 'Excellent prompt adherence and object rotation.',
        bestFor: 'Complex scenes, realistic text.',
        pros: 'Prompt adherence, Rotation.',
        cons: 'Plastic/Smooth look.'
      },
      {
        name: 'Seedream (Dreamina)',
        url: 'https://dreamina.capcut.com',
        category: 'Gen & Edit',
        description: 'CapCut\'s powerhouse. Great text and editing.',
        bestFor: 'Realism, Editing, Typography.',
        pros: 'Inpaint tools, Upscaler, Describe.',
        cons: 'Limited creativity vs MJ.'
      },
      {
        name: 'Fusara',
        url: 'https://fusara.ai',
        category: 'Aggregator',
        description: 'Access to 10+ models (Flux, MJ, Imagen 4, etc) in one place.',
        bestFor: 'Comparing models, Accessing paid models.',
        pros: 'Many models, Node graph.',
        cons: 'Wrapper dependency.'
      },
      {
        name: 'Imagen 4',
        url: 'https://labs.google/fx/tools/image-fx',
        category: 'Model',
        description: 'Google\'s photorealism standard.',
        bestFor: 'Photorealism, Text.',
        pros: 'Micro-details, Lighting.',
        cons: 'Plastic/Retouched look.'
      },
      {
        name: 'Qwen-Image',
        url: 'https://qwen-image.net',
        category: 'Model',
        description: 'Strong text rendering capabilities.',
        bestFor: 'Typography (English/Chinese).',
        pros: 'Text rendering.',
        cons: 'Aesthetic quality is lower.'
      },
      {
        name: 'Fooocus',
        url: 'https://github.com/lllyasviel/Fooocus',
        category: 'Local Interface',
        description: 'Simplest offline interface for SDXL.',
        bestFor: 'Beginners wanting local privacy.',
        pros: 'Easy, Auto-prompting.',
        cons: 'Less control than ComfyUI.'
      }
    ]
  },
  {
    id: 'creative-video',
    type: NodeType.CREATIVE,
    title: 'Video Generation',
    description: 'Motion, Physics & World Building.',
    details: 'Moving from static pixels to temporal consistency. The "Hollywood in a box" stack.',
    connections: ['music-gen'],
    tools: ['Runway', 'Luma', 'Kling', 'Veo', 'Pika'],
    timeEstimate: '$$ Expensive',
    x: 3,
    y: 3,
    toolDetails: [
      {
        name: 'Sora',
        url: 'https://sora.chatgpt.com',
        category: 'Model',
        description: 'OpenAI\'s physics simulator.',
        bestFor: 'Realism, Complex camera moves.',
        pros: 'High realism.',
        cons: 'Physics glitches.'
      },
      {
        name: 'Veo 3',
        url: 'https://deepmind.google/models/veo',
        category: 'Model',
        description: 'Google\'s cinematic model with Audio Sync.',
        bestFor: 'Cinematic shots, Dialogue.',
        pros: 'Audio sync, 1080p.',
        cons: 'Availability.'
      },
      {
        name: 'Kling',
        url: 'https://klingai.com',
        category: 'Model',
        description: 'Long clips (2 mins), complex physics.',
        bestFor: 'Long scenes, Action.',
        pros: 'Duration, Realism.',
        cons: 'UI/UX can be clunky.'
      },
      {
        name: 'Runway Gen-3',
        url: 'https://runwayml.com',
        category: 'Platform',
        description: 'Full editor (tracking, inpaint) + Generation.',
        bestFor: 'Professional control, Motion Brush.',
        pros: 'Editing tools are best in class.',
        cons: 'Gen-2 is dated, Gen-3 is costly.'
      },
      {
        name: 'Luma Dream Machine',
        url: 'https://lumalabs.ai',
        category: 'Model',
        description: 'Fast, smooth motion, loops.',
        bestFor: 'Social clips, morphs.',
        pros: 'Speed, Morphing.',
        cons: 'Character consistency.'
      },
      {
        name: 'Pika',
        url: 'https://pika.art',
        category: 'Platform',
        description: 'Simple interface, fast short clips.',
        bestFor: 'Social media, Image animation.',
        pros: 'Speed, Simplicity.',
        cons: 'Quality lower than leaders.'
      },
      {
        name: 'Hailuo.ai',
        url: 'https://hailuo.ai',
        category: 'Model',
        description: 'TikTok ecosystem model.',
        bestFor: 'Fast gen, Start-to-End transitions.',
        pros: 'Follows prompts well.',
        cons: 'Strict moderation.'
      },
      {
        name: 'RoboNeo',
        url: 'https://roboneo.ai',
        category: 'Agent',
        description: 'Chat interface for video/image.',
        bestFor: 'Sci-fi, Mecha, Techno styles.',
        pros: 'Chat interface.',
        cons: 'Niche styles.'
      }
    ]
  },

  // --- TRACK 4: MUSIC & AUDIO (X=4) ---
  {
    id: 'music-gen',
    type: NodeType.MUSIC,
    title: 'Music & Audio',
    description: 'Suno, Udio & Voice Cloning.',
    details: 'Generating the soundtrack of the future. From "Chain-smoking hits" to precise professional dubbing.',
    connections: ['infra-audio'],
    tools: ['Suno', 'Udio', 'ElevenLabs'],
    timeEstimate: 'Fun / Fast',
    x: 4,
    y: 2,
    toolDetails: [
      {
        name: 'Suno',
        url: 'https://suno.com',
        category: 'Song Generator',
        description: 'Radio-ready songs from simple prompts.',
        bestFor: 'Catchy hooks, Full songs, Fun.',
        pros: 'High creativity, viral potential.',
        cons: 'Low control over stems.'
      },
      {
        name: 'Udio',
        url: 'https://udio.com',
        category: 'Song Generator',
        description: 'High fidelity audio with complex structure control.',
        bestFor: 'Realistic vocals, complex genres.',
        pros: 'Audio fidelity, Inpainting.',
        cons: 'Steeper learning curve, sometimes ignores prompts.'
      },
      {
        name: 'ElevenLabs',
        url: 'https://elevenlabs.io',
        category: 'Speech (TTS)',
        description: 'Industry standard for AI Voice.',
        bestFor: 'Dubbing, Audiobooks, Narrators.',
        pros: 'Unmatched realism, Voice Cloning.',
        cons: 'Music is not the focus, Legal risks.'
      }
    ]
  },
  {
    id: 'infra-audio',
    type: NodeType.INFRA,
    title: 'Audio Infra (ComfyUI)',
    description: 'The nodal backend for pro audio.',
    details: 'Using ComfyUI for audio pipelines allows for complex mixing, stem separation, and precise control that web generators lack. Can combine Audio, Video, and Image in one graph.',
    connections: [],
    tools: ['ComfyUI Audio'],
    timeEstimate: 'Hard',
    x: 4,
    y: 3,
    toolDetails: [
      {
        name: 'ComfyUI',
        url: 'https://github.com/comfyanonymous/ComfyUI',
        category: 'Framework',
        description: 'Node-based visual programming for GenAI.',
        bestFor: 'Complex pipelines, mixing, offline work.',
        pros: 'Free, Infinite control, Multi-modal (AV).',
        cons: 'High technical barrier, fragile pipelines.'
      }
    ]
  },

  // --- SHARED INFRA ---
  {
    id: 'infra',
    type: NodeType.INFRA,
    title: 'Local & Cloud Compute',
    description: 'Running open models (Flux, Wan).',
    details: 'When you need privacy, no censorship, or lower long-term costs. Renting H100s or running on your 4090.',
    connections: [],
    tools: ['RunPod', 'HuggingFace', 'CivitAI'],
    timeEstimate: 'Lifetime Mastery',
    x: 2,
    y: 4,
    toolDetails: [
      {
        name: 'CivitAI',
        url: 'https://civitai.com',
        category: 'Model Hub',
        description: 'The place for Loras, Checkpoints, and training.',
        bestFor: 'Finding specific styles/characters.',
        pros: 'Huge community, Easy simple training.',
        cons: 'NSFW content prevalence, SD-focused.'
      },
      {
        name: 'HuggingFace',
        url: 'https://huggingface.co',
        category: 'Repo',
        description: 'The GitHub of ML models.',
        bestFor: 'Finding weights, Spaces.',
        pros: 'Industry standard.',
        cons: 'Technical.'
      }
    ]
  },
];