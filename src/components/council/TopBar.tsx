import { motion } from "framer-motion";
import { Activity, History, GitCompare, ArrowLeft, LogOut } from "lucide-react";

interface Props {
  onOpenHistory: () => void;
  compareMode: boolean;
  onToggleCompare: () => void;
  hasResponses: boolean;
  canGoBack?: boolean;
  onBack?: () => void;
  onLogout?: () => void;
  user?: string | null;
}

export function TopBar({ onOpenHistory, compareMode, onToggleCompare, hasResponses, canGoBack, onBack, onLogout, user }: Props) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-30 px-4 sm:px-8 py-4"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          {canGoBack && onBack && (
            <button
              onClick={onBack}
              className="mr-2 h-9 w-9 rounded-xl flex items-center justify-center glass text-muted-foreground hover:text-foreground transition-all"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          )}
          <div className="relative h-9 w-9 rounded-xl flex items-center justify-center"
            style={{ background: "var(--gradient-neon)", boxShadow: "var(--glow-cyan)" }}>
            <Activity className="h-4 w-4 text-background" strokeWidth={2.5} />
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-primary/80 flex gap-2">
              <span>v1.0 // online</span>
              {user && <span className="text-secondary">[{user}]</span>}
            </div>
            <h1 className="text-sm sm:text-base font-semibold text-foreground leading-none">
              Multi-Expert AI Council
            </h1>
          </div>
        </div>

        {user && (
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleCompare}
              disabled={!hasResponses}
              className={`hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all ${compareMode
                  ? "bg-accent/30 text-accent-foreground border border-accent/50"
                  : "glass text-muted-foreground hover:text-foreground"
                } disabled:opacity-30 disabled:cursor-not-allowed`}
            >
              <GitCompare className="h-3.5 w-3.5" />
              {compareMode ? "Council View" : "Compare"}
            </button>
            <button
              onClick={onOpenHistory}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono uppercase tracking-wider glass text-muted-foreground hover:text-foreground transition-all"
            >
              <History className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Archive</span>
            </button>
            {onLogout && (
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono uppercase tracking-wider glass text-red-400 hover:text-red-300 transition-all"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}
          </div>
        )}
      </div>
    </motion.header>
  );
}
