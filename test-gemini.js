import { GoogleGenAI, Type } from '@google/genai';

async function test() {
  const apiKey = "AIzaSyC2fUyTs0A6UC2CXPqlleR8ByNBE7rIja4";
  if (!apiKey) return;
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `Return 2 experts.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-flash-lite-latest',
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
            }
          }
        }
      }
    });
    console.log("Raw Response text:\n", response.text);
    const parsed = JSON.parse(response.text);
    console.log("Parsed keys:", parsed.length);
  } catch (err) {
    console.error("Error calling API:", err);
  }
}

test();
