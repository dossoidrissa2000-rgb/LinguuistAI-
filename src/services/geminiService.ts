import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
const TEXT_MODEL = "gemini-3-flash-preview";

export async function getPersonalizedFeedback(userLevel: string, userText: string) {
  const prompt = `As an expert ESL (English as a Second Language) tutor, analyze this text from a ${userLevel} level student: "${userText}". 
  Provide:
  1. Corrections for grammar/vocabulary.
  2. A more natural/native alternative.
  3. A short encouragement.
  Format as JSON with keys: corrections, alternative, encouragement.`;

  try {
    const response = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });
    
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini API Error:", error);
    return null;
  }
}

export async function getAITutorResponse(context: string, history: { role: 'user' | 'model', parts: { text: string }[] }[]) {
  // Simplification for the chat history conversion to the new format if needed
  // But generateContent also handles history in 'contents' if passed as an array
  try {
    const response = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: [
        ...history.map(h => ({ role: h.role, parts: h.parts })),
        { role: 'user', parts: [{ text: `${context}\n\nMaintain character and respond naturally. Use language appropriate for the user's level.` }] }
      ]
    });
    return response.text || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "I'm having trouble connecting right now.";
  }
}

export async function generateVocabulary(level: string, profile: string, month: string) {
  const prompt = `Generate a list of 5 advanced/useful vocabulary words for someone studying English.
  User Profile: ${profile}
  CEFR Level: ${level}
  Topic/Theme: Recommended for the month of ${month}.
  
  Format the response as a JSON array of objects with keys: word, definition, example, phonetic.
  Ensure the words are relevant to the status (e.g., if professional, include business terms).
  ONLY return the JSON array.`;

  try {
    const response = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Gemini Vocabulary Error:", error);
    return [];
  }
}
