import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Mic, Send, Sparkles } from "lucide-react";

interface Props {
  onSubmit: (q: string) => void;
  disabled?: boolean;
}

const SUGGESTIONS = [
  "How does sleep affect productivity?",
  "How do I manage chronic stress?",
  "What is the future of AI in society?",
];

export function SmartInput({ onSubmit, disabled }: Props) {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const [listening, setListening] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!value.trim() || disabled) return;
    onSubmit(value.trim());
  };

  const toggleMic = () => {
    setListening((l) => !l);
    setTimeout(() => setListening(false), 1800);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.7 }}
        className={`relative glass-strong rounded-2xl transition-all duration-500 ${
          focused ? "glow-cyan ring-1 ring-primary/60" : "glow-soft"
        }`}
      >
        {/* Animated border gradient */}
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-60"
          style={{
            background:
              "linear-gradient(120deg, transparent 30%, oklch(0.78 0.18 215 / 0.15) 50%, transparent 70%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 4s linear infinite",
          }}
        />

        <div className="relative flex items-center gap-2 px-4 py-3 sm:px-5 sm:py-4">
          <Sparkles className="h-5 w-5 text-primary/80 shrink-0" />
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            disabled={disabled}
            placeholder="Ask anything to the AI Council..."
            className="flex-1 bg-transparent border-0 outline-none text-base sm:text-lg text-foreground placeholder:text-muted-foreground/70 font-display tracking-wide"
          />

          <motion.button
            type="button"
            onClick={toggleMic}
            whileTap={{ scale: 0.9 }}
            className={`relative h-10 w-10 rounded-xl flex items-center justify-center transition-colors ${
              listening
                ? "bg-accent/30 text-accent-foreground"
                : "bg-secondary/50 text-muted-foreground hover:text-foreground"
            }`}
            aria-label="Voice input"
          >
            <Mic className="h-4 w-4" />
            {listening && (
              <>
                <span className="absolute inset-0 rounded-xl border border-accent animate-ping" />
                <span className="absolute -inset-1 rounded-xl border border-accent/40 animate-ping [animation-delay:200ms]" />
              </>
            )}
          </motion.button>

          <motion.button
            type="submit"
            disabled={!value.trim() || disabled}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.94 }}
            className="relative h-10 px-4 rounded-xl flex items-center gap-2 font-medium text-sm overflow-hidden disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: "var(--gradient-neon)",
              color: "oklch(0.12 0.03 265)",
              boxShadow: "var(--glow-cyan)",
            }}
            aria-label="Send to council"
          >
            <span className="relative z-10">Convene</span>
            <Send className="h-4 w-4 relative z-10" />
          </motion.button>
        </div>
      </motion.form>

      {/* Suggestion chips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mt-4 flex flex-wrap items-center justify-center gap-2"
      >
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => {
              setValue(s);
              onSubmit(s);
            }}
            disabled={disabled}
            className="text-xs sm:text-sm px-3 py-1.5 rounded-full glass text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all hover:-translate-y-0.5 disabled:opacity-40"
          >
            {s}
          </button>
        ))}
      </motion.div>
    </div>
  );
}
