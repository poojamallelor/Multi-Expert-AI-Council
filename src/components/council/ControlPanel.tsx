import { motion } from "framer-motion";
import { Settings2 } from "lucide-react";
import { EXPERTS, type ExpertId } from "@/data/experts";

interface Props {
  selected: ExpertId[];
  onToggle: (id: ExpertId) => void;
  showSummary: boolean;
  onToggleSummary: (v: boolean) => void;
}

export function ControlPanel({ selected, onToggle, showSummary, onToggleSummary }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="glass-strong rounded-2xl p-4 sm:p-5"
    >
      <div className="flex items-center gap-2 mb-4">
        <Settings2 className="h-4 w-4 text-primary" />
        <h3 className="text-xs font-mono uppercase tracking-[0.25em] text-primary">
          Council Configuration
        </h3>
      </div>

      <div className="mb-5">
        <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-2">
          Active Experts ({selected.length}/{EXPERTS.length})
        </div>
        <div className="flex flex-wrap gap-2">
          {EXPERTS.map((e) => {
            const on = selected.includes(e.id);
            const Icon = e.icon;
            return (
              <button
                key={e.id}
                onClick={() => onToggle(e.id)}
                className="group relative flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                style={{
                  background: on ? e.accent : "oklch(0.22 0.04 265 / 0.5)",
                  color: on ? "oklch(0.12 0.03 265)" : "oklch(0.7 0.04 250)",
                  boxShadow: on ? `0 0 16px ${e.glow}` : "none",
                  border: `1px solid ${on ? "transparent" : "var(--border)"}`,
                }}
              >
                <Icon className="h-3 w-3" />
                {e.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-medium text-foreground">Synthesis Layer</div>
          <div className="text-xs text-muted-foreground">Show unified council brief</div>
        </div>
        <button
          onClick={() => onToggleSummary(!showSummary)}
          className="relative h-6 w-11 rounded-full transition-colors"
          style={{
            background: showSummary
              ? "var(--gradient-neon)"
              : "oklch(0.25 0.05 265 / 0.6)",
            boxShadow: showSummary ? "var(--glow-cyan)" : "none",
          }}
          aria-label="Toggle summary"
        >
          <motion.span
            layout
            className="absolute top-0.5 h-5 w-5 rounded-full bg-background"
            style={{ left: showSummary ? "22px" : "2px" }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        </button>
      </div>
    </motion.div>
  );
}
