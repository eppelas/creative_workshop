import { motion } from 'framer-motion'

const PULSE = { duration: 3, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }
const FLOAT = { duration: 6, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }
const SPIN = { duration: 15, repeat: Infinity, ease: "linear" }
const RED = "#DC2626"

// "Overwhelmed" — waves crashing, overflow
export const OverwhelmedSVG = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <rect x="10" y="10" width="80" height="80" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.1" />
    {[0, 1, 2, 3].map(i => (
      <motion.path
        key={i}
        d={`M ${10 + i * 5} ${55 + i * 5} Q ${30 + i * 3} ${40 + i * 5} ${50} ${55 + i * 5} T ${90 - i * 5} ${55 + i * 5}`}
        stroke={i === 0 ? RED : "currentColor"}
        strokeWidth={i === 0 ? 2 : 1}
        fill="none"
        opacity={1 - i * 0.2}
        animate={{ y: [-3, 3, -3] }}
        transition={{ ...FLOAT, delay: i * 0.4, duration: 2 + i * 0.5 }}
      />
    ))}
    <motion.circle cx="50" cy="35" r="4" fill={RED} animate={{ y: [0, 5, 0], opacity: [1, 0.4, 1] }} transition={PULSE} />
  </svg>
)

// "Excited" — expanding pulse, energy radiating
export const ExcitedSVG = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <motion.circle cx="50" cy="50" r="8" fill={RED} animate={{ scale: [1, 1.2, 1] }} transition={PULSE} />
    {[18, 28, 38].map((r, i) => (
      <motion.circle
        key={i} cx="50" cy="50" r={r}
        stroke={i === 0 ? RED : "currentColor"} strokeWidth={1.5 - i * 0.3} fill="none"
        animate={{ scale: [1, 1.1, 1], opacity: [0.6 - i * 0.15, 0.3, 0.6 - i * 0.15] }}
        transition={{ ...PULSE, delay: i * 0.3 }}
      />
    ))}
    {[0, 60, 120, 180, 240, 300].map((deg, i) => (
      <motion.line
        key={i}
        x1="50" y1="50"
        x2={50 + Math.cos(deg * Math.PI / 180) * 42}
        y2={50 + Math.sin(deg * Math.PI / 180) * 42}
        stroke="currentColor" strokeWidth="0.5" opacity="0.15"
        animate={{ opacity: [0.1, 0.3, 0.1] }}
        transition={{ ...PULSE, delay: i * 0.2 }}
      />
    ))}
  </svg>
)

// "Confused" — tangled paths, searching
export const ConfusedSVG = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <path d="M20 50 Q 35 20 50 50 Q 65 80 80 50" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.3" />
    <path d="M20 50 Q 35 80 50 50 Q 65 20 80 50" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.3" />
    <motion.circle
      cx="20" cy="50" r="4" fill={RED}
      animate={{ cx: [20, 50, 80, 50, 20], cy: [50, 30, 50, 70, 50] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.path
      d="M30 35 Q 50 15 70 35 Q 85 50 70 65 Q 50 85 30 65 Q 15 50 30 35"
      stroke={RED} strokeWidth="1.5" fill="none" opacity="0.4"
      strokeDasharray="8 4"
      animate={{ strokeDashoffset: [-24, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
    />
  </svg>
)

// "Calm" — balanced, centered, breathing
export const CalmSVG = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <line x1="50" y1="15" x2="50" y2="85" stroke="currentColor" strokeWidth="0.5" opacity="0.15" />
    <line x1="15" y1="50" x2="85" y2="50" stroke="currentColor" strokeWidth="0.5" opacity="0.15" />
    <motion.circle cx="50" cy="50" r="20" stroke={RED} strokeWidth="1.5" fill="none"
      animate={{ scale: [1, 1.08, 1] }} transition={PULSE}
    />
    <motion.circle cx="50" cy="50" r="4" fill={RED}
      animate={{ scale: [1, 1.15, 1], opacity: [0.8, 1, 0.8] }} transition={PULSE}
    />
    <motion.circle cx="50" cy="50" r="35" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.2"
      animate={{ scale: [1, 1.03, 1] }} transition={{ ...PULSE, delay: 0.5 }}
    />
  </svg>
)

// "Scale" — thermometer/gauge for 1-10 rating
export const ScaleSVG = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <rect x="45" y="10" width="10" height="75" rx="5" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.2" />
    <motion.rect x="46" y="85" width="8" height="0" rx="4" fill={RED}
      animate={{ height: [0, 65], y: [85, 20] }}
      transition={{ duration: 4, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
    />
    {[20, 35, 50, 65, 80].map((y, i) => (
      <line key={i} x1="40" y1={y} x2="44" y2={y} stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
    ))}
    <motion.circle cx="50" cy="85" r="3" fill={RED} animate={{ scale: [1, 1.2, 1] }} transition={PULSE} />
  </svg>
)

// "Useful" — lightbulb moment, signal
export const UsefulSVG = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <motion.circle cx="50" cy="40" r="15" stroke={RED} strokeWidth="2" fill="none"
      animate={{ scale: [1, 1.1, 1], opacity: [0.6, 1, 0.6] }} transition={PULSE}
    />
    <line x1="50" y1="55" x2="50" y2="75" stroke="currentColor" strokeWidth="2" />
    <line x1="44" y1="68" x2="56" y2="68" stroke="currentColor" strokeWidth="1" opacity="0.5" />
    <line x1="44" y1="72" x2="56" y2="72" stroke="currentColor" strokeWidth="1" opacity="0.5" />
    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
      <motion.line
        key={i}
        x1={50 + Math.cos(deg * Math.PI / 180) * 20}
        y1={40 + Math.sin(deg * Math.PI / 180) * 20}
        x2={50 + Math.cos(deg * Math.PI / 180) * 28}
        y2={40 + Math.sin(deg * Math.PI / 180) * 28}
        stroke={i % 2 === 0 ? RED : "currentColor"} strokeWidth="1"
        animate={{ opacity: [0.2, 0.8, 0.2] }}
        transition={{ ...PULSE, delay: i * 0.15 }}
      />
    ))}
  </svg>
)

// "Progress" — steps building up
export const ProgressSVG = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    {[0, 1, 2, 3].map(i => (
      <motion.rect
        key={i}
        x={15 + i * 20} y={80 - i * 18}
        width="15" height={15 + i * 18}
        fill={i === 3 ? RED : "currentColor"}
        opacity={i === 3 ? 1 : 0.15 + i * 0.15}
        animate={{ height: [0, 15 + i * 18], y: [80, 80 - i * 18] }}
        transition={{ duration: 1.5, delay: i * 0.3, repeat: Infinity, repeatType: "mirror", ease: "easeOut" }}
      />
    ))}
    <motion.path
      d="M15 75 L35 57 L55 39 L75 21"
      stroke={RED} strokeWidth="1.5" fill="none"
      strokeDasharray="5 3"
      animate={{ strokeDashoffset: [-16, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
    />
  </svg>
)

// "Expect" — target, focus
export const ExpectSVG = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    {[35, 25, 15].map((r, i) => (
      <circle key={i} cx="50" cy="50" r={r} stroke={i === 2 ? RED : "currentColor"} strokeWidth={i === 2 ? 1.5 : 0.8} fill="none" opacity={0.2 + i * 0.15} />
    ))}
    <motion.circle cx="50" cy="50" r="4" fill={RED}
      animate={{ scale: [1, 1.3, 1] }} transition={PULSE}
    />
    <motion.g animate={{ rotate: 360 }} transition={SPIN} style={{ transformOrigin: '50px 50px' }}>
      <line x1="50" y1="12" x2="50" y2="22" stroke={RED} strokeWidth="1" opacity="0.5" />
    </motion.g>
  </svg>
)

export const POLL_METAPHORS = {
  overwhelmed: OverwhelmedSVG,
  excited: ExcitedSVG,
  confused: ConfusedSVG,
  calm: CalmSVG,
  scale: ScaleSVG,
  useful: UsefulSVG,
  progress: ProgressSVG,
  expect: ExpectSVG,
}
