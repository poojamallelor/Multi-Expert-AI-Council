import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { Expert } from "@/data/experts";

interface Props {
  expert: Expert;
  response: string;
  index: number;
  active: boolean;
  onActivate: () => void;
  compact?: boolean;
}

function useTypewriter(text: string, speed = 14, start = true) {
  const [out, setOut] = useState("");
  useEffect(() => {
    if (!start) return;
    setOut("");
    let i = 0;
    const id = setInterval(() => {
      i++;
      setOut(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, speed, start]);
  return out;
}

export function ExpertCard({ expert, response, index, active, onActivate, compact }: Props) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), index * 220);
    return () => clearTimeout(t);
  }, [index]);

  const safeResponse = response || "Analyzing query constraints...";
  const typed = useTypewriter(safeResponse, 12, visible);
  const Icon = expert.icon;

  return (
    <motion.button
      type="button"
      onClick={onActivate}
      initial={{ opacity: 0, y: 40, rotateX: -10 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ delay: index * 0.18, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, rotateX: 4, rotateY: 2, scale: 1.01 }}
      style={{ transformStyle: "preserve-3d", perspective: 1000 }}
      className={`group relative text-left w-full glass-strong rounded-2xl p-5 transition-all duration-500 ${
        active ? "ring-2 scale-[1.02]" : "ring-0"
      }`}
    >
      {/* Aura */}
      <div
        className={`pointer-events-none absolute -inset-px rounded-2xl transition-opacity duration-500 ${
          active ? "opacity-100" : "opacity-40 group-hover:opacity-80"
        }`}
        style={{
          boxShadow: `0 0 30px ${expert.glow}, 0 0 60px ${expert.glow}`,
        }}
      />
      {/* Top accent line */}
      <div
        className="absolute top-0 left-4 right-4 h-px"
        style={{ background: expert.accent, opacity: 0.8 }}
      />

      <div className="relative flex items-start gap-3 mb-3">
        <div
          className="relative h-11 w-11 rounded-xl flex items-center justify-center shrink-0 animate-float"
          style={{
            background: expert.accent,
            boxShadow: `0 0 20px ${expert.glow}`,
          }}
        >
          <Icon className="h-5 w-5 text-background" strokeWidth={2.2} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-mono uppercase tracking-[0.2em]" style={{ color: expert.color }}>
            {expert.role}
          </div>
          <div className="text-base font-semibold text-foreground truncate">{expert.name}</div>
        </div>
        <span
          className="h-2 w-2 rounded-full animate-pulse"
          style={{ background: expert.color, boxShadow: `0 0 10px ${expert.glow}` }}
        />
      </div>

      <p className={`text-sm leading-relaxed text-foreground/85 font-display ${compact ? "min-h-20" : "min-h-28"}`}>
        {typed}
        {typed.length < safeResponse.length && (
          <span
            className="inline-block w-1.5 h-4 ml-0.5 align-middle animate-pulse"
            style={{ background: expert.color }}
          />
        )}
      </p>

      {/* Corner brackets */}
      <span
        className="absolute bottom-2 right-3 text-[10px] font-mono"
        style={{ color: expert.color, opacity: 0.6 }}
      >
        // node_{String(index + 1).padStart(2, "0")}
      </span>
    </motion.button>
  );
}
