import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NeuralOrb } from "@/components/council/NeuralOrb";
import { SmartInput } from "@/components/council/SmartInput";
import { ThinkingStages } from "@/components/council/ThinkingStages";
import { ExpertCard } from "@/components/council/ExpertCard";
import { SummaryCore } from "@/components/council/SummaryCore";
import { HistoryPanel } from "@/components/council/HistoryPanel";
import { ControlPanel } from "@/components/council/ControlPanel";
import { TopBar } from "@/components/council/TopBar";
import { DomainSelectionPanel } from "@/components/council/DomainSelectionPanel";
import { LoginPanel } from "@/components/council/LoginPanel";
import { EXPERTS, type ExpertId, detectDomains, detectDomainsAsync } from "@/data/experts";
import { useAppSession } from "@/hooks/useAppSession";
import { generateResponse } from "@/lib/ragWrapper";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Multi-Expert AI Council — Cinematic Intelligence Interface" },
      {
        name: "description",
        content:
          "A futuristic AI command center where five expert minds — doctor, engineer, teacher, economist, psychologist — convene to answer any question.",
      },
      { property: "og:title", content: "Multi-Expert AI Council" },
      { property: "og:description", content: "Convene five AI experts in a cinematic 3D council chamber." },
    ],
  }),
  component: CouncilPage,
});

function CouncilPage() {
  const {
    user,
    history,
    currentState,
    logout,
    navigate,
    goBack,
    updateState,
    saveHistoryItem,
    loadHistoryItem,
  } = useAppSession();

  const { page, query, detections, selectedDomains, responses, summary } = currentState;

  const [activeExpert, setActiveExpert] = useState<ExpertId | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [showSummary, setShowSummary] = useState(true);

  const activeExperts = useMemo(
    () => EXPERTS.filter((e) => selectedDomains.includes(e.id)),
    [selectedDomains]
  );

  const submit = useCallback(
    (q: string) => {
      updateState({ query: q });
      navigate("thinking");
    },
    [navigate, updateState]
  );

  const reset = () => {
    navigate("query", false);
    setActiveExpert(null);
    setCompareMode(false);
  };

  const toggleExpert = (id: ExpertId) => {
    const newSelected = selectedDomains.includes(id)
      ? selectedDomains.filter((x) => x !== id)
      : [...selectedDomains, id];
    updateState({ selectedDomains: newSelected });
  };

  const handleGenerate = async () => {
    navigate("result");
    const { responses: newResponses, summary: newSummary } = await generateResponse(query, selectedDomains);
    updateState({ responses: newResponses, summary: newSummary });

    saveHistoryItem({
      id: `${Date.now()}`,
      query,
      domains: detections,
      selectedDomains,
      responses: newResponses,
      summary: newSummary,
      timestamp: Date.now(),
    });
  };

  // Stack is gone from state, we only have absolute navigation
  const canGoBack = page !== "query" && page !== "login" && page !== "thinking";

  return (
    <div className="relative min-h-screen text-foreground overflow-x-hidden">
      <div className="fixed inset-0 grid-bg pointer-events-none" />

      <div className="fixed inset-0 pointer-events-none">
        <div
          className={`absolute inset-0 transition-all duration-1000 ${page === "query" || page === "login" ? "opacity-100" : "opacity-40 scale-105"
            }`}
        >
          <NeuralOrb active={page !== "query" && page !== "login"} />
        </div>
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 30%, oklch(0.12 0.03 265 / 0.6) 75%, oklch(0.1 0.03 265) 100%)",
          }}
        />
      </div>

      <TopBar
        user={user}
        onOpenHistory={() => setHistoryOpen(true)}
        compareMode={compareMode}
        onToggleCompare={() => setCompareMode((c) => !c)}
        hasResponses={page === "result"}
        canGoBack={canGoBack}
        onBack={goBack}
        onLogout={logout}
      />

      <main className="relative z-10 px-4 sm:px-8 pt-24 pb-16">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {page === "login" && (
              <LoginPanel key="login" />
            )}

            {page === "query" && (
              <motion.section
                key="hero"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.8 }}
                className="text-center mt-12 sm:mt-24 mb-12"
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass mb-6"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                  <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-primary">
                    Five Minds. One Council.
                  </span>
                </motion.div>

                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.05] mb-5">
                  <span className="text-gradient">Convene the</span>
                  <br />
                  <span className="text-gradient-neon">AI Council</span>
                </h1>
                <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
                  Pose a question. Five expert intelligences deliberate in real time —
                  then synthesize a unified, multi-perspective answer.
                </p>
              </motion.section>
            )}
          </AnimatePresence>

          {page !== "login" && page !== "query" && query && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8 mt-6"
            >
              <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-primary mb-2">
                // current query
              </div>
              <h2 className="text-xl sm:text-2xl font-medium text-gradient max-w-3xl mx-auto">
                "{query}"
              </h2>
              <button
                onClick={reset}
                className="mt-3 text-xs font-mono text-muted-foreground hover:text-primary uppercase tracking-wider"
              >
                ← New Query
              </button>
            </motion.div>
          )}

          {page === "query" && (
            <SmartInput onSubmit={submit} />
          )}

          <AnimatePresence>
            {page === "thinking" && (
              <ThinkingStages
                key="thinking"
                onDone={async () => {
                  const results = await detectDomainsAsync(query);
                  updateState({
                    detections: results,
                    selectedDomains: [results[0]?.expertId || "doctor", results[1]?.expertId || "psychologist"],
                  });
                  navigate("domain_selection");
                }}
              />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {page === "domain_selection" && (
              <DomainSelectionPanel
                key="domains"
                detections={detections}
                selected={selectedDomains}
                onToggle={toggleExpert}
                onProceed={handleGenerate}
              />
            )}
          </AnimatePresence>

          {page === "result" && responses && summary && (
            <div className="space-y-8 mt-4">
              {compareMode ? (
                <motion.div
                  key="compare"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  {activeExperts.map((e, i) => (
                    <ExpertCard
                      key={e.id}
                      expert={e}
                      response={responses[e.id]}
                      index={i}
                      active={activeExpert === e.id}
                      onActivate={() => setActiveExpert(e.id)}
                      compact
                    />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="grid"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                  {activeExperts.map((e, i) => (
                    <ExpertCard
                      key={e.id}
                      expert={e}
                      response={responses[e.id]}
                      index={i}
                      active={activeExpert === e.id}
                      onActivate={() => setActiveExpert(e.id)}
                    />
                  ))}
                </motion.div>
              )}

              {showSummary && !compareMode && <SummaryCore bullets={summary} />}

              <ControlPanel
                selected={selectedDomains}
                onToggle={toggleExpert}
                showSummary={showSummary}
                onToggleSummary={setShowSummary}
              />
            </div>
          )}
        </div>
      </main>

      <HistoryPanel
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        items={history}
        onSelect={(item) => {
          setHistoryOpen(false);
          loadHistoryItem(item);
        }}
      />

      <div className="fixed bottom-3 left-0 right-0 z-10 text-center pointer-events-none">
        <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground/50">
          ◆ council.ai // node mesh stable ◆
        </span>
      </div>
    </div>
  );
}

