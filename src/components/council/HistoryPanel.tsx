import { motion, AnimatePresence } from "framer-motion";
import { History, X, Clock } from "lucide-react";
import type { ExtendedHistoryItem } from "@/hooks/useAppSession";

interface Props {
  open: boolean;
  onClose: () => void;
  items: ExtendedHistoryItem[];
  onSelect: (item: ExtendedHistoryItem) => void;
}

function formatTime(ts: number) {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const h = Math.floor(mins / 60);
  return `${h}h ago`;
}

export function HistoryPanel({ open, onClose, items, onSelect }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 240 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-96 z-50 glass-strong border-l border-border flex flex-col"
          >
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div className="flex items-center gap-2">
                <History className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-mono uppercase tracking-[0.2em] text-foreground">
                  Council Archive
                </h2>
              </div>
              <button
                onClick={onClose}
                className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                aria-label="Close history"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {items.length === 0 ? (
                <div className="text-center text-muted-foreground text-sm py-12 font-mono">
                  No queries yet.
                </div>
              ) : (
                items.map((item, i) => (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => onSelect(item)}
                    className="w-full text-left glass rounded-xl p-3 hover:border-primary/40 hover:-translate-y-0.5 transition-all"
                  >
                    <p className="text-sm text-foreground line-clamp-2 mb-1.5">{item.query}</p>
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {formatTime(item.timestamp)}
                    </div>
                  </motion.button>
                ))
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
