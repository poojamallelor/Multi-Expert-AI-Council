import { motion } from "framer-motion";
import { EXPERTS, type ExpertId, type DomainDetection } from "@/data/experts";
import { Check, ChevronRight } from "lucide-react";

export interface DomainSelectionPanelProps {
  detections: DomainDetection[];
  selected: ExpertId[];
  onToggle: (id: ExpertId) => void;
  onProceed: () => void;
}

export function DomainSelectionPanel({
  detections,
  selected,
  onToggle,
  onProceed,
}: DomainSelectionPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      className="w-full max-w-3xl mx-auto glass-strong rounded-2xl p-6 md:p-8 relative overflow-hidden"
    >
      <div className="flex items-center gap-3 mb-6">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
        </span>
        <span className="text-xs font-mono uppercase tracking-[0.2em] text-primary/80">
          Domain Classification Complete
        </span>
      </div>

      <h2 className="text-2xl font-semibold mb-2">Select Expert Domains</h2>
      <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
        We've analyzed your query and ranked the most relevant expert perspectives.
        The top 2 domains have been automatically selected. You can override these before generating the final council responses.
      </p>

      <div className="space-y-3 mb-8">
        {detections.map((det, index) => {
          const expert = EXPERTS.find((e) => e.id === det.expertId)!;
          const isSelected = selected.includes(expert.id);
          const Icon = expert.icon;

          return (
            <motion.div
              key={expert.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onToggle(expert.id)}
              className={`relative flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all duration-300 border ${isSelected
                  ? "bg-secondary/40 border-primary/50"
                  : "bg-background/40 border-white/5 hover:border-white/10"
                }`}
            >
              {/* Highlight gradient */}
              {isSelected && (
                <div
                  className="absolute inset-0 rounded-xl opacity-10 pointer-events-none"
                  style={{ background: expert.accent }}
                />
              )}

              {/* Icon & Checkbox */}
              <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-black/40 border border-white/10 relative">
                {isSelected ? (
                  <Check className="w-5 h-5 text-primary" />
                ) : (
                  <Icon className="w-5 h-5 text-muted-foreground" style={{ color: expert.color }} />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-foreground tracking-wide">
                    {expert.role}
                  </span>
                  <span
                    className={`text-xs font-mono px-2 py-0.5 rounded-full ${index < 2 ? "bg-primary/20 text-primary" : "bg-white/5 text-muted-foreground"
                      }`}
                  >
                    {det.confidence}% Match
                  </span>
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {det.reason}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="flex justify-end">
        <button
          onClick={onProceed}
          disabled={selected.length === 0}
          className="group relative px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium text-sm tracking-wide overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          <span className="relative flex items-center gap-2">
            Generate Responses
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </span>
        </button>
      </div>
    </motion.div>
  );
}
