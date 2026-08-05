import { EXPERTS, type ExpertId, getResponseFor, buildSummary } from "@/data/experts";
import { GoogleGenAI, Type } from '@google/genai';

export interface RAGOutput {
  responses: Record<ExpertId, string>;
  summary: string[];
}

export async function generateResponse(query: string, selectedDomains: ExpertId[]): Promise<RAGOutput> {
  const activeExperts = EXPERTS.filter((e) => selectedDomains.includes(e.id));
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    console.warn("VITE_GEMINI_API_KEY missing. Falling back to static responses.");
    const responses: Record<string, string> = {};
    for (const expert of activeExperts) {
      responses[expert.id] = getResponseFor(expert, query);
    }
    return {
      responses: responses as Record<ExpertId, string>,
      summary: buildSummary(query, activeExperts),
    };
  }

  const ai = new GoogleGenAI({ apiKey });
  const prompt = `You are an AI council consisting of the following experts:
${activeExperts.map(e => `- ${e.name} (${e.role}): ${e.defaultResponse}`).join('\n')}

The user asked: "${query}"

Provide a detailed response from the unique perspective of each of the active experts. 
Also, provide a 4-point summary of the combined advice.

Return the response strictly as a JSON object with this structure:
{
  "responses": {
    "expertId1": "Response text here",
    "expertId2": "Response text here"
  },
  "summary": [
    "Summary point 1",
    "Summary point 2",
    "Summary point 3",
    "Summary point 4"
  ]
}

The expert IDs to include in "responses" are exactly: ${activeExperts.map(e => `"${e.id}"`).join(', ')}. Do not use any other expert IDs. Return ONLY valid JSON.`;

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
            type: Type.OBJECT,
            properties: {
              responses: {
                type: Type.OBJECT,
                properties: activeExperts.reduce((acc, expert) => {
                  acc[expert.id] = { type: Type.STRING };
                  return acc;
                }, {} as Record<string, any>),
                required: activeExperts.map(e => e.id)
              },
              summary: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["responses", "summary"]
          }
        }
      });

      if (response.text) {
        let cleanText = response.text.replace(/```json/gi, "").replace(/```/g, "").trim();
        const parsed = JSON.parse(cleanText);
        if (parsed.responses && parsed.summary) {
          return {
            responses: parsed.responses,
            summary: parsed.summary
          };
        }
      }
    } catch (err: any) {
      console.warn(`Model ${model} failed for generating response:`, err?.message || err);
      lastError = err;
      // Continue to the next model in the fallback list
    }
  }

  // If all models fail, we surface the last error to the user
  console.error("All Gemini models failed. Last error:", lastError);
  const errorMessage = lastError?.message || "An unknown error occurred while calling the Gemini API.";
  const errorResponses: Record<string, string> = {};
  for (const expert of activeExperts) {
    errorResponses[expert.id] = `I could not generate a dynamic response due to an API Error: ${errorMessage}`;
  }
  return {
    responses: errorResponses as Record<ExpertId, string>,
    summary: [
      "DYNAMIC GENERATION FAILED",
      `API Error: ${errorMessage}`,
      "Please check your API Key or try again later.",
      "Ensure Vite server has been restarted."
    ]
  };

  // Fallback if no error but parsing failed
  const responses: Record<string, string> = {};
  for (const expert of activeExperts) {
    responses[expert.id] = `Failed to parse dynamic response.`;
  }
  return {
    responses: responses as Record<ExpertId, string>,
    summary: ["Parsing failed. Ensure prompt output is correct JSON."],
  };
}
