import { Stethoscope, Cpu, GraduationCap, TrendingUp, Brain, type LucideIcon } from "lucide-react";
import { GoogleGenAI, Type } from '@google/genai';

export type ExpertId = "doctor" | "engineer" | "teacher" | "economist" | "psychologist";

export interface Expert {
  id: ExpertId;
  name: string;
  role: string;
  icon: LucideIcon;
  color: string;        // CSS var token
  glow: string;         // box-shadow color
  ring: string;         // ring color
  accent: string;       // gradient start
  responses: Record<string, string>;
  defaultResponse: string;
}

export const EXPERTS: Expert[] = [
  {
    id: "doctor",
    name: "Dr. Vega",
    role: "Medical Specialist",
    icon: Stethoscope,
    color: "var(--emerald-glow)",
    glow: "oklch(0.78 0.18 165 / 0.55)",
    ring: "oklch(0.78 0.18 165)",
    accent: "linear-gradient(135deg, oklch(0.78 0.18 165), oklch(0.6 0.15 200))",
    defaultResponse:
      "From a clinical perspective, prioritize evidence-based protocols. Monitor vitals, account for comorbidities, and never substitute speculation for diagnostic rigor.",
    responses: {
      sleep:
        "Adults need 7–9 hours. Consistent sleep–wake timing regulates cortisol and improves immune function. Avoid blue light and caffeine within 6h of bedtime.",
      stress:
        "Chronic stress dysregulates the HPA axis — elevated cortisol impairs immunity, sleep, and cardiovascular health. Recommend somatic breathing and routine cardio.",
      ai:
        "AI-assisted diagnostics show 15–30% accuracy gains in radiology, but human oversight remains essential for ethical and contextual judgment.",
    },
  },
  {
    id: "engineer",
    name: "Kairo",
    role: "Systems Engineer",
    icon: Cpu,
    color: "var(--cyan-glow)",
    glow: "oklch(0.82 0.18 215 / 0.55)",
    ring: "oklch(0.82 0.18 215)",
    accent: "linear-gradient(135deg, oklch(0.82 0.18 215), oklch(0.7 0.22 255))",
    defaultResponse:
      "Treat it as a system. Define inputs, constraints, and failure modes. Optimize for reliability before speed — premature optimization compounds technical debt.",
    responses: {
      sleep:
        "Sleep is biological garbage collection. Without it, the brain's memory consolidation pipeline thrashes — analogous to running a server without scheduled maintenance windows.",
      stress:
        "Model stress as a load-balancing problem. Distribute cognitive load across parallel tasks, build redundancy, and schedule regular system cooldowns.",
      ai:
        "Modern LLMs are stochastic function approximators. Pair them with deterministic systems — vector retrieval, structured outputs, and rigorous evals.",
    },
  },
  {
    id: "teacher",
    name: "Mira",
    role: "Educator",
    icon: GraduationCap,
    color: "var(--amber-glow)",
    glow: "oklch(0.82 0.17 75 / 0.55)",
    ring: "oklch(0.82 0.17 75)",
    accent: "linear-gradient(135deg, oklch(0.82 0.17 75), oklch(0.7 0.2 40))",
    defaultResponse:
      "Break the concept into first principles. Build understanding incrementally — foundations before abstraction. Curiosity outperforms memorization every time.",
    responses: {
      sleep:
        "Students who sleep 8+ hours score 25% higher on retention tests. Sleep is when the brain encodes the day's learning into long-term memory.",
      stress:
        "Reframe stress as growth signal. Teach metacognition — naming the emotion reduces its grip and builds resilience over time.",
      ai:
        "AI is a tutor, not a replacement. Use it to expand access to personalized learning — but keep human mentorship at the center.",
    },
  },
  {
    id: "economist",
    name: "Theo",
    role: "Economist",
    icon: TrendingUp,
    color: "var(--purple-glow)",
    glow: "oklch(0.65 0.27 295 / 0.55)",
    ring: "oklch(0.65 0.27 295)",
    accent: "linear-gradient(135deg, oklch(0.65 0.27 295), oklch(0.55 0.25 320))",
    defaultResponse:
      "Every decision has opportunity cost. Quantify trade-offs, model second-order effects, and beware of incentives that distort short-term behavior.",
    responses: {
      sleep:
        "Sleep deprivation costs the global economy ~$680B annually in lost productivity. Rest is not idle — it's a high-ROI capital investment.",
      stress:
        "Stress is a market inefficiency in personal capital. Burnout drives ~$300B in healthcare costs. Invest in recovery the way you'd diversify a portfolio.",
      ai:
        "AI will reshape labor markets — augmenting cognitive work like the steam engine augmented physical labor. Expect 20-year transition turbulence.",
    },
  },
  {
    id: "psychologist",
    name: "Dr. Rho",
    role: "Psychologist",
    icon: Brain,
    color: "var(--magenta)",
    glow: "oklch(0.7 0.28 340 / 0.55)",
    ring: "oklch(0.7 0.28 340)",
    accent: "linear-gradient(135deg, oklch(0.7 0.28 340), oklch(0.6 0.25 0))",
    defaultResponse:
      "Notice the pattern beneath the question. Behavior is signal, not noise. Compassion — for self and others — is the most underrated cognitive tool.",
    responses: {
      sleep:
        "Poor sleep amplifies the amygdala's threat response by 60%. Emotional regulation collapses without rest. Sleep is the foundation of mental health.",
      stress:
        "Stress lives in the body. Name it, locate it, breathe into it. The nervous system responds to attention — not avoidance.",
      ai:
        "Humans project meaning onto AI. The risk isn't intelligence — it's parasocial dependence. Use AI as a mirror, not a substitute for human connection.",
    },
  },
];

export function getResponseFor(expert: Expert, query: string): string {
  const q = query.toLowerCase();
  if (q.includes("sleep") || q.includes("rest")) return expert.responses.sleep;
  if (q.includes("stress") || q.includes("anxiet") || q.includes("burnout")) return expert.responses.stress;
  if (q.includes("ai") || q.includes("artificial") || q.includes("technology")) return expert.responses.ai;
  return expert.defaultResponse;
}

export function buildSummary(query: string, experts: Expert[]): string[] {
  const q = query.toLowerCase();
  if (q.includes("sleep")) {
    return [
      "Sleep is biologically essential — 7-9 hours optimizes memory, immunity, and emotional regulation.",
      "Economic impact is massive: ~$680B/year in lost global productivity from sleep deprivation.",
      "Treat sleep as a system: consistent timing, low blue light, and environmental control yield compounding benefits.",
      "Educational and psychological outcomes both improve sharply with adequate, restorative sleep.",
    ];
  }
  if (q.includes("stress") || q.includes("anxiet")) {
    return [
      "Chronic stress disrupts the HPA axis — affecting hormones, immunity, and cardiovascular health.",
      "Economically, burnout costs ~$300B annually in healthcare and absenteeism.",
      "Regulation strategies: somatic breathing, cardio, naming emotions, and structured cooldowns.",
      "Stress reframed as a growth signal — combined with self-compassion — builds long-term resilience.",
    ];
  }
  if (q.includes("ai")) {
    return [
      "AI augments expert decision-making but requires human oversight for context and ethics.",
      "Markets will see ~20 years of transition; cognitive labor reshapes like the industrial revolution did physical labor.",
      "Education benefits from AI tutoring — but mentorship and human connection remain central.",
      "Psychological risk: parasocial dependence. Use AI as a mirror, not a replacement for relationships.",
    ];
  }
  return [
    "Multiple disciplines converge on a shared principle — context determines the right answer.",
    "Trade-offs are real: optimize for resilience and second-order effects, not just immediate outcomes.",
    "Human judgment, compassion, and rigorous evidence outperform any single perspective.",
    "Iterate, measure, and stay curious — the council recommends a multi-lens approach.",
  ];
}

export interface DomainDetection {
  expertId: ExpertId;
  confidence: number;
  reason: string;
}

export function detectDomains(query: string): DomainDetection[] {
  const q = query.toLowerCase();
  let results: DomainDetection[] = [];

  if (q.includes("sleep") || q.includes("rest")) {
    results = [
      { expertId: "doctor", confidence: 95, reason: "Direct physiological impact on health." },
      { expertId: "psychologist", confidence: 88, reason: "Crucial for emotional regulation." },
      { expertId: "economist", confidence: 70, reason: "Macro-level productivity implications." },
      { expertId: "teacher", confidence: 65, reason: "Affects learning retention." },
      { expertId: "engineer", confidence: 40, reason: "Analogous to system maintenance." },
    ];
  } else if (q.includes("stress") || q.includes("anxiet") || q.includes("burnout")) {
    results = [
      { expertId: "psychologist", confidence: 98, reason: "Core domain of mental health." },
      { expertId: "doctor", confidence: 85, reason: "Somatic symptoms and cortisol regulation." },
      { expertId: "economist", confidence: 75, reason: "Burnout impacts labor markets." },
      { expertId: "teacher", confidence: 60, reason: "Stress affects educational environments." },
      { expertId: "engineer", confidence: 45, reason: "System load analogies." },
    ];
  } else if (q.includes("ai") || q.includes("artificial") || q.includes("technology")) {
    results = [
      { expertId: "engineer", confidence: 99, reason: "Direct domain expertise in systems." },
      { expertId: "economist", confidence: 90, reason: "Major driver of future labor markets." },
      { expertId: "teacher", confidence: 80, reason: "Transforming educational paradigms." },
      { expertId: "psychologist", confidence: 70, reason: "Impact on human connection." },
      { expertId: "doctor", confidence: 60, reason: "Applications in medical diagnostics." },
    ];
  } else {
    // Generic fallback
    results = [
      { expertId: "psychologist", confidence: 82, reason: "Addresses underlying human behavior." },
      { expertId: "economist", confidence: 78, reason: "Analyzes systemic trade-offs." },
      { expertId: "engineer", confidence: 72, reason: "Views the problem as a structured system." },
      { expertId: "teacher", confidence: 68, reason: "Breaks down concepts." },
      { expertId: "doctor", confidence: 60, reason: "Focuses on evidence." },
    ];
  }

  return results.sort((a, b) => b.confidence - a.confidence);
}

export async function detectDomainsAsync(query: string): Promise<DomainDetection[]> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("VITE_GEMINI_API_KEY missing. Falling back to static domain detection.");
    return detectDomains(query);
  }

  const ai = new GoogleGenAI({ apiKey });
  const prompt = `You are evaluating a user query to determine which experts should respond.
Available experts:
- doctor (Medical Specialist)
- engineer (Systems Engineer)
- teacher (Educator)
- economist (Economist)
- psychologist (Psychologist)

User query: "${query}"

Return a JSON array of objects, where each object represents an expert. Order the array by confidence, highest first. Include all 5 experts.
Each object must have:
- "expertId": the ID of the expert (string, exactly one of: doctor, engineer, teacher, economist, psychologist)
- "confidence": confidence score out of 100 (number)
- "reason": a short, 1-sentence reason why this expert is relevant.

Return strictly the JSON array.`;

  const modelsToTry = ['gemini-flash-latest', 'gemini-flash-lite-latest'];
  let lastError: any;

  for (const model of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                expertId: { type: Type.STRING },
                confidence: { type: Type.NUMBER },
                reason: { type: Type.STRING }
              },
              required: ["expertId", "confidence", "reason"]
            }
          }
        }
      });

      if (response.text) {
        let cleanText = response.text.replace(/```json/gi, "").replace(/```/g, "").trim();
        const parsed = JSON.parse(cleanText);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed as DomainDetection[];
        }
      }
    } catch (err: any) {
      console.warn(`Model ${model} failed for domain detection:`, err?.message || err);
      lastError = err;
      // Continue to the next model in the fallback list
    }
  }

  console.error("All Gemini models failed for domain detection. Last error:", lastError);

  return detectDomains(query);
}
