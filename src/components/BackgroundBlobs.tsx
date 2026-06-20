import { motion, useScroll, useTransform } from "framer-motion";

/**
 * Soft organic blob shapes parallax-scrolled behind content.
 * Three depth layers — back blobs move slowest, foreground fastest.
 * Pure SVG, low opacity, only #BDD8E9 / #F5F9FC / #4E8EA2 tints.
 */
export function BackgroundBlobs() {
  const { scrollY } = useScroll();
  const yBack = useTransform(scrollY, [0, 2000], [0, -120]);
  const yMid = useTransform(scrollY, [0, 2000], [0, -280]);
  const yFront = useTransform(scrollY, [0, 2000], [0, -460]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Layer 1 — slowest, large diffuse */}
      <motion.svg
        style={{ y: yBack }}
        className="absolute -top-40 -left-40 w-[820px] h-[820px] opacity-60"
        viewBox="0 0 600 600"
      >
        <defs>
          <filter id="b1"><feGaussianBlur stdDeviation="40" /></filter>
        </defs>
        <path
          fill="#BDD8E9" fillOpacity="0.5" filter="url(#b1)"
          d="M421,318Q396,386,322,420Q248,454,176,418Q104,382,86,304Q68,226,124,164Q180,102,260,98Q340,94,400,154Q460,214,421,318Z"
        />
      </motion.svg>

      <motion.svg
        style={{ y: yBack }}
        className="absolute top-[60vh] -right-60 w-[900px] h-[900px] opacity-50"
        viewBox="0 0 600 600"
      >
        <defs><filter id="b2"><feGaussianBlur stdDeviation="48" /></filter></defs>
        <path
          fill="#BDD8E9" fillOpacity="0.45" filter="url(#b2)"
          d="M462,316Q448,392,378,432Q308,472,224,448Q140,424,108,346Q76,268,124,196Q172,124,254,108Q336,92,408,140Q480,188,471,254Q462,316,462,316Z"
        />
      </motion.svg>

      {/* Layer 2 — medium */}
      <motion.svg
        style={{ y: yMid }}
        className="absolute top-[140vh] left-[20vw] w-[640px] h-[640px] opacity-50"
        viewBox="0 0 600 600"
      >
        <defs><filter id="b3"><feGaussianBlur stdDeviation="36" /></filter></defs>
        <path
          fill="#4E8EA2" fillOpacity="0.18" filter="url(#b3)"
          d="M438,308Q416,382,344,422Q272,462,196,422Q120,382,108,302Q96,222,160,162Q224,102,304,108Q384,114,432,178Q480,242,459,275Q438,308,438,308Z"
        />
      </motion.svg>

      {/* Layer 3 — fastest, smaller bright accent */}
      <motion.svg
        style={{ y: yFront }}
        className="absolute top-[240vh] -left-20 w-[500px] h-[500px] opacity-40"
        viewBox="0 0 600 600"
      >
        <defs><filter id="b4"><feGaussianBlur stdDeviation="30" /></filter></defs>
        <path
          fill="#BDD8E9" fillOpacity="0.55" filter="url(#b4)"
          d="M432,300Q412,376,338,418Q264,460,188,420Q112,380,108,298Q104,216,168,160Q232,104,312,108Q392,112,436,176Q480,240,456,270Q432,300,432,300Z"
        />
      </motion.svg>

      <motion.svg
        style={{ y: yFront }}
        className="absolute top-[320vh] right-[10vw] w-[560px] h-[560px] opacity-40"
        viewBox="0 0 600 600"
      >
        <defs><filter id="b5"><feGaussianBlur stdDeviation="34" /></filter></defs>
        <path
          fill="#4E8EA2" fillOpacity="0.16" filter="url(#b5)"
          d="M450,302Q428,380,352,420Q276,460,196,420Q116,380,108,298Q100,216,168,158Q236,100,316,110Q396,120,440,184Q484,248,467,275Q450,302,450,302Z"
        />
      </motion.svg>
    </div>
  );
}
