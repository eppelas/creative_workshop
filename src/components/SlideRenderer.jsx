import { motion } from 'framer-motion'
import { Download } from 'lucide-react'
import VoxelScene from './VoxelScene'
import { POLL_METAPHORS } from './PollMetaphors'

function WithVoxel({ slide, children }) {
  if (!slide.voxel) return children;

  // Title and Section slides: voxel in bottom half, no mask/blur
  if (slide.type === 'title' || slide.type === 'section') {
    return (
      <div className="relative w-full h-[75vh] overflow-visible">
        <div className="absolute bottom-0 left-0 right-0 h-[70%] opacity-50 overflow-visible">
          <VoxelScene src={slide.voxel} />
        </div>
        <div className="relative z-10 flex items-start justify-center h-full pt-12">
          {children}
        </div>
      </div>
    )
  }

  const sideFadeStyle = {
    maskImage: 'radial-gradient(ellipse 80% 70% at center center, black 20%, transparent 90%)',
    WebkitMaskImage: 'radial-gradient(ellipse 80% 70% at center center, black 20%, transparent 90%)',
  };

  // Other slides: side-by-side layout
  return (
    <div className="flex gap-6 items-start w-full">
      <div className="flex-1 min-w-0">
        {children}
      </div>
      <div className="w-80 h-64 flex-shrink-0 overflow-hidden" style={sideFadeStyle}>
        <VoxelScene src={slide.voxel} />
      </div>
    </div>
  )
}

export default function SlideRenderer({ slide }) {
  let content;
  switch (slide.type) {
    case 'title': content = <TitleSlide s={slide} />; break;
    case 'agenda': content = <AgendaSlide s={slide} />; break;
    case 'timeline': content = <TimelineSlide s={slide} />; break;
    case 'section': content = <SectionSlide s={slide} />; break;
    case 'poll': content = <PollSlide s={slide} />; break;
    case 'poll-results': content = <PollResultsSlide s={slide} />; break;
    case 'poll-scale': content = <PollScaleSlide s={slide} />; break;
    case 'poll-wordcloud': content = <PollWordcloudSlide s={slide} />; break;
    case 'poll-progress': content = <PollProgressSlide s={slide} />; break;
    case 'recap': content = <RecapSlide s={slide} />; break;
    case 'voices': content = <VoicesSlide s={slide} />; break;
    case 'bigquote': content = <BigQuoteSlide s={slide} />; break;
    case 'content': content = <ContentSlide s={slide} />; break;
    case 'levels': content = <LevelsSlide s={slide} />; break;
    case 'definition': content = <DefinitionSlide s={slide} />; break;
    case 'frameworks': content = <FrameworksSlide s={slide} />; break;
    case 'table': content = <TableSlide s={slide} />; break;
    case 'prd': content = <PrdSlide s={slide} />; break;
    case 'highlight': content = <HighlightSlide s={slide} />; break;
    case 'tools': content = <ToolsSlide s={slide} />; break;
    case 'resources': content = <ResourcesSlide s={slide} />; break;
    case 'links': content = <LinksSlide s={slide} />; break;
    case 'activity': content = <ActivitySlide s={slide} />; break;
    case 'checklist': content = <ChecklistSlide s={slide} />; break;
    case 'demoday': content = <DemoDaySlide s={slide} />; break;
    case 'closing': content = <ClosingSlide s={slide} />; break;
    case 'end': content = <EndSlide s={slide} />; break;
    default: content = <ContentSlide s={slide} />;
  }
  return <WithVoxel slide={slide}>{content}</WithVoxel>;
}

function TitleSlide({ s }) {
  return (
    <div className="flex flex-col items-center justify-center text-center gap-6">
      <div className="text-swiss-muted text-xs tracking-[0.3em] uppercase animate-fade-in">{s.meta}</div>
      <h1 className="text-5xl md:text-7xl font-extrabold text-swiss-black tracking-tighter animate-fade-in animate-fade-in-delay-1">
        {s.title}
      </h1>
      <div className="text-2xl md:text-3xl text-swiss-red font-light animate-fade-in animate-fade-in-delay-2">
        {s.subtitle}
      </div>
      {s.note && (
        <p className="text-sm text-swiss-muted max-w-xl mt-4 animate-fade-in animate-fade-in-delay-3">{s.note}</p>
      )}
    </div>
  )
}

function AgendaSlide({ s }) {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-extrabold text-swiss-black tracking-tight">{s.title}</h2>
      <div className="grid gap-2">
        {s.items.map((item, i) => (
          <div key={i} className={`flex items-baseline gap-4 py-2 px-3 rounded animate-fade-in animate-fade-in-delay-${Math.min(i + 1, 5)}`}>
            <span className="text-swiss-red font-bold text-sm w-8 flex-shrink-0">{item.label}</span>
            <span className="text-swiss-black text-base">{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function PollSlide({ s }) {
  const SlideSvg = s.svg ? POLL_METAPHORS[s.svg] : null

  return (
    <div className="flex flex-col items-center justify-center text-center gap-8 px-4">
      <div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-swiss-black tracking-tight animate-fade-in">
          {s.title}
        </h2>
        <p className="text-sm text-swiss-red mt-2 font-medium animate-fade-in animate-fade-in-delay-1">{s.subtitle}</p>
      </div>

      {SlideSvg && (
        <div className="w-24 h-24 animate-fade-in animate-fade-in-delay-1">
          <SlideSvg />
        </div>
      )}

      {s.options && (
        <div className="grid grid-cols-2 gap-4 max-w-2xl w-full">
          {s.options.map((opt, i) => {
            const OptSvg = opt.svg ? POLL_METAPHORS[opt.svg] : null
            return (
              <div key={i} className={`flex flex-col items-center gap-2 p-5 rounded-xl border-2 border-swiss-gray/40 hover:border-swiss-red/40 transition-all animate-fade-in animate-fade-in-delay-${Math.min(i + 1, 5)}`}>
                {OptSvg && <div className="w-12 h-12"><OptSvg /></div>}
                <span className="text-swiss-black font-bold text-sm">{opt.label}</span>
                <span className="text-swiss-muted text-xs">{opt.desc}</span>
              </div>
            )
          })}
        </div>
      )}

      {s.scale && (
        <div className="w-full max-w-xl animate-fade-in animate-fade-in-delay-2">
          <div className="flex justify-between items-end mb-3">
            {Array.from({length: s.scale.max}, (_, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center text-sm font-bold ${
                  i < 3 ? 'border-swiss-gray text-swiss-muted' :
                  i < 7 ? 'border-swiss-black/30 text-swiss-black' :
                  'border-swiss-red text-swiss-red'
                }`}>
                  {i + 1}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-swiss-muted mt-1">
            <span>{s.scale.labelMin}</span>
            <span>{s.scale.labelMax}</span>
          </div>
        </div>
      )}

      {s.open && s.prompt && (
        <div className="max-w-xl w-full animate-fade-in animate-fade-in-delay-2">
          <div className="border-2 border-dashed border-swiss-gray/50 rounded-xl p-6">
            <p className="text-swiss-muted text-sm italic">{s.prompt}</p>
          </div>
        </div>
      )}
    </div>
  )
}

function PollResultsSlide({ s }) {
  const sorted = [...(s.results || [])].sort((a, b) => b.pct - a.pct)
  const maxPct = sorted.length ? sorted[0].pct : 100

  return (
    <div className="flex flex-col items-center justify-center text-center gap-8 px-4">
      <div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-swiss-black tracking-tight animate-fade-in">
          {s.title}
        </h2>
        <p className="text-sm text-swiss-red mt-2 font-medium animate-fade-in animate-fade-in-delay-1">{s.subtitle}</p>
      </div>

      <div className="w-full max-w-2xl space-y-4">
        {sorted.map((r, i) => {
          const OptSvg = r.svg ? POLL_METAPHORS[r.svg] : null
          return (
            <div key={i} className={`flex items-center gap-4 animate-fade-in animate-fade-in-delay-${Math.min(i + 1, 5)}`}>
              {OptSvg && <div className="w-10 h-10 flex-shrink-0"><OptSvg /></div>}
              <div className="flex-1 text-left">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-swiss-black font-bold text-sm">{r.label}</span>
                  <span className="text-swiss-muted text-xs">{r.count}/{s.total} ({r.pct}%)</span>
                </div>
                <div className="w-full h-3 bg-swiss-gray/20 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: r.pct === maxPct ? '#DC2626' : '#1a1a1a' }}
                    initial={{ width: 0 }}
                    animate={{ width: `${r.pct}%` }}
                    transition={{ duration: 0.8, delay: i * 0.15, ease: 'easeOut' }}
                  />
                </div>
                <span className="text-swiss-muted text-xs">{r.desc}</span>
              </div>
            </div>
          )
        })}
      </div>

      {s.note && (
        <p className="text-xs text-swiss-muted max-w-lg animate-fade-in animate-fade-in-delay-5">{s.note}</p>
      )}
    </div>
  )
}

function PollScaleSlide({ s }) {
  const maxCount = Math.max(...(s.distribution || []).map(d => d.count))

  return (
    <div className="flex flex-col items-center justify-center text-center gap-6 px-4">
      <div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-swiss-black tracking-tight animate-fade-in">
          {s.title}
        </h2>
        <p className="text-sm text-swiss-red mt-2 font-medium animate-fade-in animate-fade-in-delay-1">{s.subtitle}</p>
      </div>

      <div className="w-full max-w-2xl animate-fade-in animate-fade-in-delay-2">
        <div className="flex items-end justify-center gap-2 h-40">
          {(s.distribution || []).map((d, i) => (
            <div key={i} className="flex flex-col items-center gap-1 flex-1">
              <span className="text-xs font-bold text-swiss-black">{d.count || ''}</span>
              <motion.div
                className="w-full rounded-t-md"
                style={{ backgroundColor: d.value >= 7 ? '#DC2626' : d.value >= 4 ? '#1a1a1a' : '#9ca3af' }}
                initial={{ height: 0 }}
                animate={{ height: d.count > 0 ? `${(d.count / maxCount) * 120}px` : '2px' }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: 'easeOut' }}
              />
              <span className={`text-xs font-mono ${d.value >= 7 ? 'text-swiss-red font-bold' : 'text-swiss-muted'}`}>{d.value}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-swiss-muted mt-2 px-1">
          <span>{s.labelMin}</span>
          <span>{s.labelMax}</span>
        </div>
      </div>

      {s.average && (
        <div className="animate-fade-in animate-fade-in-delay-3">
          <span className="text-sm text-swiss-muted">Среднее: </span>
          <span className="text-2xl font-extrabold text-swiss-red">{s.average}</span>
          <span className="text-sm text-swiss-muted"> / 10</span>
        </div>
      )}

      {s.note && (
        <p className="text-xs text-swiss-muted max-w-lg animate-fade-in animate-fade-in-delay-4">{s.note}</p>
      )}
    </div>
  )
}

function PollWordcloudSlide({ s }) {
  const sizes = ['text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl']

  return (
    <div className="flex flex-col items-center justify-center text-center gap-6 px-4">
      <div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-swiss-black tracking-tight animate-fade-in">
          {s.title}
        </h2>
        <p className="text-sm text-swiss-red mt-2 font-medium animate-fade-in animate-fade-in-delay-1">{s.subtitle}</p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 max-w-2xl animate-fade-in animate-fade-in-delay-2">
        {(s.words || []).map((w, i) => {
          const sizeIdx = Math.min(Math.floor((w.weight / (s.maxWeight || 8)) * sizes.length), sizes.length - 1)
          return (
            <motion.span
              key={i}
              className={`${sizes[sizeIdx]} font-bold leading-tight ${w.highlight ? 'text-swiss-red' : 'text-swiss-black'}`}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: w.weight >= 3 ? 1 : 0.6, scale: 1 }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              {w.text}
            </motion.span>
          )
        })}
      </div>

      {s.quotes && (
        <div className="w-full max-w-xl space-y-2 mt-2">
          {s.quotes.map((q, i) => (
            <div key={i} className={`text-left text-xs italic text-swiss-muted border-l-2 border-swiss-red/30 pl-3 animate-fade-in animate-fade-in-delay-${Math.min(i + 3, 5)}`}>
              "{q.text}" <span className="font-medium not-italic">— {q.author}</span>
            </div>
          ))}
        </div>
      )}

      {s.note && (
        <p className="text-xs text-swiss-muted max-w-lg animate-fade-in animate-fade-in-delay-5">{s.note}</p>
      )}
    </div>
  )
}

function PollProgressSlide({ s }) {
  return (
    <div className="flex flex-col items-center justify-center text-center gap-6 px-4">
      <div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-swiss-black tracking-tight animate-fade-in">
          {s.title}
        </h2>
        <p className="text-sm text-swiss-red mt-2 font-medium animate-fade-in animate-fade-in-delay-1">{s.subtitle}</p>
      </div>

      <div className="w-full max-w-2xl space-y-5">
        {(s.stages || []).map((st, i) => (
          <div key={i} className={`animate-fade-in animate-fade-in-delay-${Math.min(i + 1, 5)}`}>
            <div className="flex justify-between items-baseline mb-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-swiss-red">{st.level}</span>
                <span className="text-swiss-black font-bold text-sm">{st.label}</span>
              </div>
              <span className="text-swiss-muted text-xs">{st.count}/{s.total} ({st.pct}%)</span>
            </div>
            <div className="relative w-full h-4 bg-swiss-gray/15 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: st.level === '●' ? '#DC2626' :
                    `linear-gradient(90deg, #1a1a1a ${100 - st.pct}%, #DC2626 100%)`
                }}
                initial={{ width: 0 }}
                animate={{ width: `${st.pct}%` }}
                transition={{ duration: 0.8, delay: i * 0.15, ease: 'easeOut' }}
              />
            </div>
            <span className="text-swiss-muted text-xs">{st.desc}</span>
          </div>
        ))}
      </div>

      {s.note && (
        <p className="text-xs text-swiss-muted max-w-lg mt-2 animate-fade-in animate-fade-in-delay-5">{s.note}</p>
      )}
    </div>
  )
}

function TimelineSlide({ s }) {
  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-extrabold text-swiss-black tracking-tight">{s.title}</h2>
      <div className="flex items-center justify-center gap-2 md:gap-4 flex-wrap">
        {s.items.map((item, i) => (
          <div key={i} className="flex items-center gap-2 md:gap-4">
            <div className={`flex flex-col items-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
              item.active ? 'border-swiss-red bg-swiss-red/10' :
              item.done ? 'border-swiss-gray bg-swiss-gray/10' :
              item.upcoming ? 'border-dashed border-swiss-gray' : 'border-swiss-gray'
            }`}>
              <span className={`text-xs font-bold ${item.active ? 'text-swiss-red' : item.done ? 'text-swiss-muted' : 'text-swiss-muted'}`}>
                {item.week}
              </span>
              <span className={`text-sm ${item.active ? 'text-swiss-black font-bold' : 'text-swiss-black'}`}>
                {item.label}
              </span>
            </div>
            {i < s.items.length - 1 && (
              <span className="text-swiss-gray text-lg">—</span>
            )}
          </div>
        ))}
      </div>
      {s.note && <p className="text-center text-swiss-muted text-sm mt-4">{s.note}</p>}
    </div>
  )
}

function SectionSlide({ s }) {
  return (
    <div className="flex flex-col items-center justify-center text-center gap-4">
      <div className="text-swiss-red text-sm tracking-[0.2em] uppercase font-bold animate-fade-in">
        Block {String(s.block).padStart(2, '0')}
      </div>
      <h1 className="text-4xl md:text-6xl font-extrabold text-swiss-black tracking-tighter animate-fade-in animate-fade-in-delay-1">
        {s.title}
      </h1>
      {s.subtitle && (
        <p className="text-xl text-swiss-muted animate-fade-in animate-fade-in-delay-2">{s.subtitle}</p>
      )}
    </div>
  )
}

function RecapSlide({ s }) {
  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-extrabold text-swiss-black tracking-tight">{s.title}</h2>
          {s.slidesUrl && (
            <a href={s.slidesUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-swiss-muted border border-swiss-gray/50 rounded px-2 py-0.5 hover:text-swiss-red hover:border-swiss-red/40 transition-colors">slides &rarr;</a>
          )}
        </div>
        {s.speaker && (
          <p className="text-sm text-swiss-muted mt-1">
            {s.speaker}{s.date && <span> &middot; {s.date}</span>}
          </p>
        )}
        {s.tagline && (
          <span className="inline-flex items-center gap-1.5 text-xs text-swiss-red border border-swiss-red/30 rounded-full px-3 py-0.5 mt-2">
            <span className="w-1.5 h-1.5 rounded-full bg-swiss-red" />
            {s.tagline}
          </span>
        )}
      </div>
      <ul className="space-y-2">
        {s.items.map((item, i) => (
          <li key={i} className={`flex items-start gap-3 text-swiss-black text-sm animate-fade-in animate-fade-in-delay-${Math.min(i + 1, 5)}`}>
            <span className="text-swiss-red mt-0.5 flex-shrink-0">&#x2022;</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
      {s.quote && (
        <blockquote className="border-l-4 border-swiss-red/30 pl-4 mt-4 text-swiss-muted italic text-sm">
          {s.quote}
        </blockquote>
      )}
      {s.tools && s.tools.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {s.tools.map((tool, i) => (
            <span key={i} className="text-[10px] text-swiss-muted bg-swiss-gray/20 border border-swiss-gray/40 rounded px-2 py-0.5">{tool}</span>
          ))}
        </div>
      )}
    </div>
  )
}

function VoicesSlide({ s }) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-extrabold text-swiss-black tracking-tight">{s.title}</h2>
        {s.subtitle && <p className="text-sm text-swiss-muted mt-1">{s.subtitle}</p>}
      </div>
      <div className="grid gap-3">
        {s.items.map((item, i) => (
          <div key={i} className={`flex items-start gap-3 p-3 rounded-lg bg-swiss-gray/10 border border-swiss-gray/50 animate-fade-in animate-fade-in-delay-${Math.min(i + 1, 5)}`}>
            <span className="text-swiss-red/50 text-lg leading-none">&ldquo;</span>
            <div className="flex-1">
              <p className="text-swiss-black text-sm italic">{item.text}</p>
            </div>
            {item.tag && (
              <span className="text-[10px] text-swiss-muted bg-swiss-gray/30 rounded px-2 py-0.5 flex-shrink-0">{item.tag}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function BigQuoteSlide({ s }) {
  return (
    <div className="flex flex-col items-center justify-center text-center px-8">
      <span className="text-swiss-red/20 text-6xl leading-none mb-4">&ldquo;</span>
      <blockquote className="text-2xl md:text-4xl font-bold text-swiss-black leading-relaxed max-w-3xl tracking-tight animate-fade-in">
        {s.quote}
      </blockquote>
      {s.author && (
        <p className="text-swiss-muted text-sm mt-6 animate-fade-in animate-fade-in-delay-2">— {s.author}</p>
      )}
      {s.note && (
        <p className="text-swiss-muted text-sm mt-8 max-w-2xl leading-relaxed animate-fade-in animate-fade-in-delay-3">{s.note}</p>
      )}
    </div>
  )
}

function ContentSlide({ s }) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-extrabold text-swiss-black tracking-tight">{s.title}</h2>
        {s.subtitle && <p className="text-sm text-swiss-red mt-1">{s.subtitle}</p>}
      </div>
      {s.content && <p className="text-swiss-black text-sm leading-relaxed">{s.content}</p>}
      {s.items && (
        <ul className="space-y-2">
          {s.items.map((item, i) => (
            <li key={i} className={`flex items-start gap-3 text-swiss-black text-sm animate-fade-in animate-fade-in-delay-${Math.min(i + 1, 5)}`}>
              <span className="text-swiss-red mt-0.5 flex-shrink-0">&#x2022;</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
      {s.note && (
        <p className="text-swiss-muted text-xs mt-4 border-t border-swiss-gray pt-3">{s.note}</p>
      )}
    </div>
  )
}

function LevelsSlide({ s }) {
  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-extrabold text-swiss-black tracking-tight">{s.title}</h2>
      <div className="grid gap-3">
        {s.items.map((item, i) => (
          <div key={i} className={`flex items-start gap-4 p-4 rounded-lg border border-swiss-gray/50 bg-swiss-gray/5 animate-fade-in animate-fade-in-delay-${Math.min(i + 1, 5)}`}>
            <div className="flex flex-col items-center flex-shrink-0 w-12">
              <span className="text-swiss-red font-bold text-lg">{item.level}</span>
              <span className="text-swiss-muted text-[10px]">{item.hours}</span>
            </div>
            <div>
              <h3 className="text-swiss-black font-bold text-sm">{item.name}</h3>
              <p className="text-swiss-muted text-sm mt-1">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function DefinitionSlide({ s }) {
  return (
    <div className="flex flex-col items-center justify-center text-center px-8 space-y-6">
      <h2 className="text-4xl font-extrabold text-swiss-red">{s.title}</h2>
      <p className="text-xl text-swiss-black max-w-2xl leading-relaxed animate-fade-in animate-fade-in-delay-1">
        {s.definition}
      </p>
      {s.note && (
        <p className="text-sm text-swiss-muted max-w-xl animate-fade-in animate-fade-in-delay-2">{s.note}</p>
      )}
    </div>
  )
}

function FrameworksSlide({ s }) {
  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-extrabold text-swiss-black tracking-tight">{s.title}</h2>
      <div className="grid gap-4">
        {s.items.map((item, i) => (
          <div key={i} className={`p-4 rounded-lg border border-swiss-gray/50 bg-swiss-gray/5 animate-fade-in animate-fade-in-delay-${Math.min(i + 1, 5)}`}>
            <h3 className="text-swiss-red font-bold text-sm mb-2">{item.name}</h3>
            <p className="text-swiss-black text-sm">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function TableSlide({ s }) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-extrabold text-swiss-black tracking-tight">{s.title}</h2>
        {s.subtitle && <p className="text-sm text-swiss-muted mt-1">{s.subtitle}</p>}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              {s.headers.map((h, i) => (
                <th key={i} className="text-left text-swiss-red font-bold text-xs px-3 py-2 border-b-2 border-swiss-black">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {s.rows.map((row, i) => (
              <tr key={i} className="border-b border-swiss-gray">
                {row.map((cell, j) => (
                  <td key={j} className="px-3 py-2 text-swiss-black text-xs">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const PRD_MARKDOWN = `# PRD: [Product Name]

## 1. Context & Vision

**What pain are we solving?**
> Describe the specific frustration, inefficiency, or unmet need.

**Who is the user?**
> Be specific: grandma? realtor? myself? a team of 5?

**What does life look like AFTER this exists?**
> Paint the picture. One paragraph.

**What triggered this idea?**
> A moment, a conversation, a recurring annoyance?

---

## 2. User Stories

Write 2-5 stories in this format:

- When I [situation], I want to [action], so that [outcome].
- When I [situation], I want to [action], so that [outcome].
- When I [situation], I want to [action], so that [outcome].

---

## 3. Functional Requirements

**Input Data:**
- What does the user provide? (text, file, voice, URL, nothing?)
- Where does it come from? (manual input, API, clipboard, camera?)

**Core Logic:**
- What happens with the input? Step by step.
- What decisions does the system make?

**Output:**
- What does the user get back? (text, file, notification, visual?)
- In what format? (PDF, message, dashboard, audio?)

**Edge Cases:**
- What if the input is empty?
- What if the input is very large?
- What if the user does something unexpected?

---

## 4. The Interface (The Vibe)

**Entry points:**
- How does the user access this? (website, Telegram bot, browser extension, mobile app?)
- What devices must it work on?

**Key screens / states:**
- State 1: [e.g., empty / waiting for input]
- State 2: [e.g., processing / loading]
- State 3: [e.g., showing results]

**Vibe reference:**
> Pick one or describe your own. Link a screenshot or a site that feels right.

| Style | Description | Examples |
|-------|-------------|----------|
| **Minimal Swiss** | White bg, black text, one accent color. Grid. Typography as hero. | Linear, Notion, iA Writer |
| **Glassmorphism** | Frosted panels with blur over gradient/photo bg. Soft shadows, rounded corners. | Apple Vision Pro UI, macOS Control Center |
| **Dashboard / Data-Dense** | Dark bg, bright accents (green, cyan, orange). Charts, tables, metrics. Compact cards. | Grafana, Vercel Dashboard, Bloomberg Terminal |
| **Brutalist / Raw** | System fonts, visible borders, intentionally raw. Content over decoration. | Craigslist, HackerNews |
| **Warm Editorial** | Serif headings, warm tones (cream, terracotta, olive). Magazine feel. | Substack, Medium, Apple Newsroom |
| **Neon / Cyberpunk** | Dark bg (#0a0a0a), neon accents (cyan, magenta). Glow effects, monospace font. | Warp terminal, gaming UI |

**Key interactions:**
- What are the 2-3 main actions the user takes?

---

## 5. Non-Goals

What we are NOT building in this version:

- [ ] No database / no user accounts
- [ ] No mobile version
- [ ] No multi-language support
- [ ] No admin panel
- [ ] No analytics dashboard
- [ ] [Add your own...]

> This section is critical. Without it, AI will try to build a full SaaS platform when you just need a simple tool.

---

## 6. Error Handling Philosophy

What should happen when something breaks?

- **API not responding:** [show placeholder / retry 3x / show error message]
- **Invalid user input:** [highlight field / auto-correct / ignore]
- **Empty state:** [show onboarding hint / blank screen / sample data]
- **Slow loading:** [skeleton loader / spinner / nothing]

> Without this section, the model will decide for you — and usually badly.

---

## 7. Tech Preferences (optional)

- **Framework:** [e.g., React, vanilla JS, Python script]
- **Hosting:** [e.g., Vercel, GitHub Pages, local only]
- **AI model:** [e.g., GPT-4, Claude, local LLM]
- **Other:** [e.g., must work offline, needs Telegram integration]

> If you don't know — leave blank. A smart model will suggest the right stack.

---

## 8. Existing Code Context (if adding to a project)

> Skip this section if building from scratch.

- **Current stack:** [e.g., React + Tailwind + Supabase]
- **Folder structure:** [paste or describe]
- **Routing:** [e.g., Next.js App Router, React Router, none]
- **Key files to know about:** [e.g., src/lib/api.ts, src/components/Layout.tsx]

---

## 9. Examples of Input / Output

> Concrete examples help the model more than abstract descriptions.

**Example 1:**
- Input: \`[paste real input]\`
- Expected output: \`[paste or describe expected result]\`

**Example 2:**
- Input: \`[paste real input]\`
- Expected output: \`[paste or describe expected result]\`

---

## 10. Constraints & Boundaries

- [ ] Max [N] files
- [ ] No external dependencies / only these: [list]
- [ ] Must work in iframe / embed
- [ ] Budget: $0 for hosting
- [ ] Must work offline
- [ ] [Add your own...]

---

## 11. Iteration Plan

> Don't build everything at once. Models lose quality on large tasks.

- **Step 1:** Build [core feature only]. Stop. Test.
- **Step 2:** Add [second feature]. Stop. Test.
- **Step 3:** Add [polish / edge cases].

---

## 12. Reference Implementation (optional)

> A link to a working example is worth 100 lines of description.

- **Similar product:** [URL or name]
- **Screenshot:** [attach or link]
- **Repo to reference:** [GitHub URL]

---

## 13. Success Metrics

How do we know it works?

- [ ] [e.g., Grandma can see the text on her tablet]
- [ ] [e.g., Takes less than 30 seconds from input to result]
- [ ] [e.g., I actually use it daily for a week]

---

## 14. Open Questions

- ?
- ?
- ?
`;

function PrdSlide({ s }) {
  const handleDownload = () => {
    const blob = new Blob([PRD_MARKDOWN], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'PRD-Template.md'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-extrabold text-swiss-black tracking-tight">{s.title}</h2>
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-swiss-red text-white text-sm font-medium hover:bg-red-700 transition-colors shadow-sm"
        >
          <Download className="w-4 h-4" />
          Download .md
        </button>
      </div>
      <div className="grid gap-2">
        {s.items.map((item, i) => (
          <div key={i} className={`flex items-start gap-4 p-3 rounded-lg border border-swiss-gray/50 animate-fade-in animate-fade-in-delay-${Math.min(i + 1, 5)}`}>
            <span className="text-swiss-red font-bold text-lg w-8 flex-shrink-0 text-right">{item.num}</span>
            <div>
              <h3 className="text-swiss-black font-bold text-sm">{item.name}</h3>
              <p className="text-swiss-muted text-xs mt-0.5">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function HighlightSlide({ s }) {
  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-extrabold text-swiss-red">{s.title}</h2>
      {s.content && <p className="text-swiss-black text-sm leading-relaxed">{s.content}</p>}
      {s.items && (
        <div className="grid gap-2 pl-2">
          {s.items.map((item, i) => (
            <div key={i} className={`flex items-start gap-3 text-sm animate-fade-in animate-fade-in-delay-${Math.min(i + 1, 5)}`}>
              <span className="text-swiss-red flex-shrink-0">&#x2717;</span>
              <span className="text-swiss-black">{item}</span>
            </div>
          ))}
        </div>
      )}
      {s.note && (
        <p className="text-swiss-muted text-xs mt-3 border-t border-swiss-gray pt-3">{s.note}</p>
      )}
    </div>
  )
}

function ToolsSlide({ s }) {
  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-extrabold text-swiss-black tracking-tight">{s.title}</h2>
      <div className="grid gap-3">
        {s.items.map((item, i) => (
          <div key={i} className={`flex items-start gap-4 p-3 rounded-lg bg-swiss-gray/5 border border-swiss-gray/50 animate-fade-in animate-fade-in-delay-${Math.min(i + 1, 5)}`}>
            <div className="flex-1">
              <div className="flex items-baseline gap-3">
                <h3 className="text-swiss-black font-bold text-sm">{item.name}</h3>
                <span className="text-swiss-red text-[10px] bg-swiss-red/10 rounded px-2 py-0.5 font-bold">{item.role}</span>
              </div>
              <p className="text-swiss-muted text-xs mt-1">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ResourcesSlide({ s }) {
  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-extrabold text-swiss-black tracking-tight animate-fade-in">{s.title}</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {s.groups.map((group, gi) => (
          <div key={gi} className={`space-y-3 animate-fade-in animate-fade-in-delay-${Math.min(gi + 1, 5)}`}>
            <div className="text-xs font-bold tracking-[0.2em] uppercase text-swiss-red">{group.label}</div>
            <div className="space-y-2">
              {group.items.map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-2.5 rounded-lg border border-swiss-gray/30 bg-swiss-gray/5">
                  <span className="text-swiss-red flex-shrink-0 mt-0.5 text-xs font-bold">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <div className="text-swiss-black text-sm font-bold">{item.name}</div>
                    <div className="text-swiss-muted text-xs mt-0.5">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function LinksSlide({ s }) {
  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-extrabold text-swiss-black tracking-tight">{s.title}</h2>
      {s.content && <p className="text-swiss-black text-sm leading-relaxed">{s.content}</p>}
      <div className="space-y-2">
        {s.items.map((item, i) => (
          <a
            key={i}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-3 p-3 rounded-lg border border-swiss-gray/50 hover:border-swiss-red/50 hover:bg-swiss-red/5 transition-colors animate-fade-in animate-fade-in-delay-${Math.min(i + 1, 5)}`}
          >
            <span className="text-swiss-red font-bold text-sm flex-shrink-0">{String(i + 1).padStart(2, '0')}</span>
            <span className="text-swiss-black text-sm font-medium">{item.name}</span>
            <span className="text-swiss-muted text-xs ml-auto flex-shrink-0">&rarr;</span>
          </a>
        ))}
      </div>
    </div>
  )
}

function ActivitySlide({ s }) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-extrabold text-swiss-black tracking-tight">{s.title}</h2>
        {s.subtitle && <p className="text-sm text-swiss-red font-bold mt-1">{s.subtitle}</p>}
      </div>
      {s.goal && (
        <p className="text-swiss-black text-sm italic border-l-4 border-swiss-red/30 pl-4">{s.goal}</p>
      )}
      <div className="grid gap-3">
        {s.steps.map((step, i) => (
          <div key={i} className={`flex items-start gap-4 p-4 rounded-lg border border-swiss-gray/50 bg-swiss-gray/5 animate-fade-in animate-fade-in-delay-${Math.min(i + 1, 5)}`}>
            <div className="flex flex-col items-center flex-shrink-0">
              <span className="text-swiss-red font-bold text-lg">{i + 1}</span>
              {step.time && <span className="text-swiss-muted text-[10px]">{step.time}</span>}
            </div>
            <div>
              <h3 className="text-swiss-black font-bold text-sm">{step.name}</h3>
              <p className="text-swiss-muted text-sm mt-1">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ChecklistSlide({ s }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-extrabold text-swiss-black tracking-tight">{s.title}</h2>
      <div className="grid gap-3">
        {s.items.map((item, i) => (
          <div key={i} className={`flex items-center gap-4 p-3 rounded-lg border border-swiss-gray/50 animate-fade-in animate-fade-in-delay-${Math.min(i + 1, 5)}`}>
            <div className="w-5 h-5 rounded border-2 border-swiss-red/30 flex items-center justify-center flex-shrink-0">
              <span className="text-swiss-red/30 text-xs">&#x2713;</span>
            </div>
            <span className="text-swiss-black text-sm">{item}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function DemoDaySlide({ s }) {
  return (
    <div className="space-y-5">
      <h2 className="text-3xl font-extrabold text-swiss-red">{s.title}</h2>
      {s.content && <p className="text-swiss-black text-sm leading-relaxed">{s.content}</p>}
      {s.items && (
        <ul className="space-y-2">
          {s.items.map((item, i) => (
            <li key={i} className={`flex items-start gap-3 text-swiss-black text-sm animate-fade-in animate-fade-in-delay-${Math.min(i + 1, 5)}`}>
              <span className="text-swiss-red mt-0.5 flex-shrink-0">&#x2192;</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function ClosingSlide({ s }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-extrabold text-swiss-black tracking-tight">{s.title}</h2>
      <div className="grid gap-2">
        {s.items.map((item, i) => (
          <div key={i} className={`flex items-start gap-3 p-2 animate-fade-in animate-fade-in-delay-${Math.min(i + 1, 5)}`}>
            <span className="text-swiss-red flex-shrink-0 font-bold text-sm">{String(i + 1).padStart(2, '0')}</span>
            <span className="text-swiss-black text-sm">{item}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function EndSlide({ s }) {
  return (
    <div className="flex flex-col items-center justify-center text-center gap-6">
      <h1 className="text-5xl md:text-7xl font-extrabold text-swiss-black tracking-tighter animate-fade-in">
        {s.title}
      </h1>
      <p className="text-swiss-muted text-lg animate-fade-in animate-fade-in-delay-1">{s.subtitle}</p>
      <p className="text-swiss-red text-xl font-bold animate-fade-in animate-fade-in-delay-2">{s.meta}</p>
    </div>
  )
}
