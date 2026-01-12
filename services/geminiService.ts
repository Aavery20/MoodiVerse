
import { GoogleGenAI, Type } from "@google/genai";
import { MoodLog } from "../types";

// Always use const ai = new GoogleGenAI({apiKey: process.env.API_KEY});.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateWellnessTips = async (logs: MoodLog[]) => {
  const recentHistory = logs.slice(-5).map(l => `${l.mood} (Stress: ${l.stressLevel})`).join(', ');
  
  const prompt = `Based on a user's recent mental health logs: [${recentHistory}], 
  provide 3 authentic, science-backed, and practical wellness tips to improve their current mood. 
  Keep the tone empathetic and gentle. 
  Ensure tips are varied across Mindfulness, Physical activity, and Self-Care.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              content: { type: Type.STRING },
              category: { type: Type.STRING }
            },
            required: ["title", "content", "category"]
          }
        }
      }
    });

    // Directly access the .text property of GenerateContentResponse.
    const text = response.text?.trim();
    return text ? JSON.parse(text) : null;
  } catch (error) {
    console.error("Error generating tips:", error);
    return null;
  }
};
