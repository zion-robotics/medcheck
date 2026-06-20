import { motion } from "framer-motion";

export function PageWrap({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.main
      key={typeof window !== "undefined" ? window.location.pathname : "ssr"}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`pt-24 ${className}`}
    >
      {children}
    </motion.main>
  );
}
