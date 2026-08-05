import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const STAGES = [
  "Connecting to knowledge base...",
  "Retrieving domain insights...",
  "Synthesizing expert reasoning...",
  "Generating council responses...",
];

export function ThinkingStages({ onDone }: { onDone: () => void }) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setStage((s) => {
        if (s >= STAGES.length - 1) {
          clearInterval(t);
          setTimeout(onDone, 600);
          return s;
        }
        return s + 1;
      });
    }, 700);
    return () => clearInterval(t);
  }, [onDone]);

  const progress = ((stage + 1) / STAGES.length) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      className="w-full max-w-2xl mx-auto glass-strong rounded-2xl p-6 relative overflow-hidden scanline"
    >
      <div className="flex items-center gap-3 mb-4">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
        </span>
        <span className="text-xs font-mono uppercase tracking-[0.2em] text-primary/80">
          Council Initializing
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={stage}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.3 }}
          className="text-lg sm:text-xl font-medium text-foreground mb-5"
        >
          {STAGES[stage]}
        </motion.div>
      </AnimatePresence>

      {/* Neon progress bar */}
      <div className="h-1.5 w-full rounded-full bg-secondary/60 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{
            background: "var(--gradient-neon)",
            boxShadow: "var(--glow-cyan)",
          }}
        />
      </div>

      <div className="mt-4 flex justify-between text-[10px] font-mono text-muted-foreground/70">
        {STAGES.map((_, i) => (
          <span
            key={i}
            className={i <= stage ? "text-primary" : ""}
          >
            ◆ {String(i + 1).padStart(2, "0")}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
