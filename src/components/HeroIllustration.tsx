import { motion } from "framer-motion";

/**
 * Hero illustration: stylized phone scanning a pill bottle, with a sweeping
 * scan line, soft drop shadows, and a verified checkmark accent.
 * Pure SVG + Framer Motion. Uses only brand palette + #2E9E5B for the check.
 */
export function HeroIllustration() {
  return (
    <div className="relative w-full max-w-[520px] mx-auto aspect-square">
      {/* soft halo */}
      <motion.div
        aria-hidden
        className="absolute inset-8 rounded-[40%] blur-3xl"
        style={{ background: "radial-gradient(closest-side, rgba(189,216,233,0.7), transparent 70%)" }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.55, 0.8, 0.55] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.svg
        viewBox="0 0 520 520"
        className="relative w-full h-full"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <defs>
          <linearGradient id="phoneGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0A4174" />
            <stop offset="100%" stopColor="#001D39" />
          </linearGradient>
          <linearGradient id="screenGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F5F9FC" />
            <stop offset="100%" stopColor="#BDD8E9" />
          </linearGradient>
          <linearGradient id="bottleGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#4E8EA2" />
            <stop offset="100%" stopColor="#0A4174" />
          </linearGradient>
          <linearGradient id="capsuleGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="50%" stopColor="#FFFFFF" />
            <stop offset="50%" stopColor="#4E8EA2" />
            <stop offset="100%" stopColor="#0A4174" />
          </linearGradient>
          <linearGradient id="scanGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(46,158,91,0)" />
            <stop offset="50%" stopColor="rgba(46,158,91,0.85)" />
            <stop offset="100%" stopColor="rgba(46,158,91,0)" />
          </linearGradient>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="14" stdDeviation="18" floodColor="#001D39" floodOpacity="0.18" />
          </filter>
          <clipPath id="screenClip">
            <rect x="118" y="100" width="200" height="360" rx="28" />
          </clipPath>
        </defs>

        {/* Phone */}
        <g filter="url(#shadow)">
          <rect x="108" y="90" width="220" height="380" rx="36" fill="url(#phoneGrad)" />
          <rect x="118" y="100" width="200" height="360" rx="28" fill="url(#screenGrad)" />
          {/* notch */}
          <rect x="198" y="108" width="40" height="6" rx="3" fill="#001D39" opacity="0.35" />
        </g>

        {/* Inside the screen */}
        <g clipPath="url(#screenClip)">
          {/* status bar */}
          <rect x="118" y="125" width="200" height="22" fill="rgba(10,65,116,0.06)" />
          <text x="135" y="140" fontSize="10" fill="#0A4174" fontWeight="600">MedCheck · Scanning</text>

          {/* scan frame */}
          <rect x="148" y="170" width="140" height="200" rx="14" fill="none" stroke="#0A4174" strokeOpacity="0.25" strokeDasharray="4 4" strokeWidth="1.5" />

          {/* capsule inside scan area */}
          <g transform="translate(218, 270) rotate(-30)">
            <rect x="-44" y="-18" width="88" height="36" rx="18" fill="url(#capsuleGrad)" />
            <rect x="-1.5" y="-18" width="3" height="36" fill="#001D39" opacity="0.18" />
          </g>

          {/* corner brackets */}
          {[
            "M 152 178 L 152 168 L 162 168",
            "M 274 168 L 284 168 L 284 178",
            "M 152 362 L 152 372 L 162 372",
            "M 284 362 L 284 372 L 274 372",
          ].map((d, i) => (
            <path key={i} d={d} stroke="#2E9E5B" strokeWidth="3" fill="none" strokeLinecap="round" />
          ))}

          {/* sweeping scan line */}
          <motion.rect
            x="148" y="170" width="140" height="40"
            fill="url(#scanGrad)"
            initial={{ y: 170 }}
            animate={{ y: [170, 330, 170] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* result line */}
          <rect x="148" y="390" width="140" height="10" rx="5" fill="#0A4174" opacity="0.12" />
          <rect x="148" y="408" width="100" height="8" rx="4" fill="#0A4174" opacity="0.10" />
        </g>

        {/* Pill bottle floating beside phone */}
        <g filter="url(#shadow)" transform="translate(330, 230)">
          <motion.g
            animate={{ y: [0, -6, 0], rotate: [-2, 2, -2] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <rect x="-50" y="-10" width="100" height="22" rx="6" fill="#4E8EA2" />
            <rect x="-58" y="10" width="116" height="120" rx="14" fill="url(#bottleGrad)" />
            <rect x="-46" y="36" width="92" height="48" rx="6" fill="#F5F9FC" opacity="0.92" />
            <rect x="-40" y="46" width="60" height="6" rx="3" fill="#0A4174" opacity="0.65" />
            <rect x="-40" y="58" width="80" height="4" rx="2" fill="#0A4174" opacity="0.35" />
            <rect x="-40" y="68" width="50" height="4" rx="2" fill="#0A4174" opacity="0.35" />
          </motion.g>
        </g>

        {/* Verified badge */}
        <motion.g
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.6, type: "spring", bounce: 0.4 }}
          transform="translate(388, 138)"
        >
          <circle r="34" fill="#2E9E5B" filter="url(#shadow)" />
          <motion.path
            d="M -14 0 L -4 11 L 16 -13"
            stroke="#fff" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 1.4, duration: 0.6, ease: "easeOut" }}
          />
        </motion.g>

        {/* Floating data ticks */}
        {[
          { x: 70, y: 160, delay: 0.3 },
          { x: 80, y: 360, delay: 0.6 },
          { x: 450, y: 380, delay: 0.9 },
        ].map((p, i) => (
          <motion.circle
            key={i} cx={p.x} cy={p.y} r="4" fill="#4E8EA2"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0], scale: [0, 1.4, 0] }}
            transition={{ delay: p.delay, duration: 3, repeat: Infinity }}
          />
        ))}
      </motion.svg>
    </div>
  );
}
