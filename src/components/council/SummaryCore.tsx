import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface Props {
  bullets: string[];
}

export function SummaryCore({ bullets }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="relative glass-strong rounded-3xl p-6 sm:p-8 overflow-hidden"
      style={{ boxShadow: "0 0 60px oklch(0.65 0.27 295 / 0.25), var(--shadow-elevated)" }}
    >
      {/* Pulsing background glow */}
      <div
        className="absolute inset-0 opacity-50 animate-pulse-glow pointer-events-none rounded-3xl"
        style={{
          background:
            "radial-gradient(ellipse at center, oklch(0.65 0.27 295 / 0.15), transparent 60%)",
        }}
      />

      <div className="relative">
        <div className="flex items-center gap-3 mb-5">
          <div
            className="h-9 w-9 rounded-xl flex items-center justify-center"
            style={{ background: "var(--gradient-neon)", boxShadow: "var(--glow-purple)" }}
          >
            <Sparkles className="h-4 w-4 text-background" />
          </div>
          <div>
            <div className="text-xs font-mono uppercase tracking-[0.25em] text-accent">
              Council Synthesis
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold text-gradient">Unified Intelligence Brief</h3>
          </div>
        </div>

        <ul className="space-y-3">
          {bullets.map((b, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + i * 0.18, duration: 0.5 }}
              className="flex gap-3 text-sm sm:text-base text-foreground/90 leading-relaxed"
            >
              <span
                className="mt-2 h-1.5 w-1.5 rounded-full shrink-0"
                style={{
                  background: "var(--cyan-glow)",
                  boxShadow: "0 0 8px var(--cyan-glow)",
                }}
              />
              <span>{b}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
