
import { GoogleGenAI, Type } from "@google/genai";
import { SupportedLanguage } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface GeneratedContent {
  theme: string;
  words: {
    word: string;
    clue: string;
  }[];
}

const CATEGORIES = [
  "Technology", "Ancient History", "World Geography", "Hollywood Movies", "Rock Music", 
  "Food", "Summer Sports", "Space Exploration", "Marine Life", "Fantasy Literature", 
  "Office Life", "School Subjects", "Christmas", "Superheroes", "Farm Animals", 
  "BBQ", "New Year", "Costumes", "Countries", "Common Names", "Kitchen Utensils",
  "Colors", "Emotions", "Weather", "Transportation", "Hobbies", "Video Games"
];

const LANGUAGE_NAMES: Record<SupportedLanguage, string> = {
  pt: 'Portuguese (Brazil)',
  en: 'English',
  fr: 'French',
  de: 'German',
  it: 'Italian',
  es: 'Spanish'
};

export const generateTopicAndWords = async (language: SupportedLanguage = 'pt'): Promise<GeneratedContent> => {
  const model = "gemini-2.5-flash";
  
  // Client-side randomness to force variety
  const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
  const randomSeed = Math.floor(Math.random() * 1000000);
  const targetLanguage = LANGUAGE_NAMES[language];

  try {
    const response = await ai.models.generateContent({
      model,
      config: {
        temperature: 1.2, // Increase creativity
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            theme: { type: Type.STRING, description: `A creative single-word or two-word theme title in ${targetLanguage}.` },
            words: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  word: { type: Type.STRING, description: "The word answer (uppercase, no spaces, no special chars, normalized)." },
                  clue: { type: Type.STRING, description: `A short, clever crossword clue in ${targetLanguage}.` }
                },
                required: ["word", "clue"]
              }
            }
          },
          required: ["theme", "words"]
        },
        systemInstruction: `You are a creative crossword puzzle generator.
        
        TASK:
        1. Create a unique crossword theme based on the category: "${category}". 
           (e.g., if category is 'Food', theme could be 'Italian Cuisine' or 'Spicy Things').
        2. Generate exactly 40 distinct words related to that theme in the language: ${targetLanguage}.
        
        RULES:
        - Words must be in ${targetLanguage}.
        - Words must be between 3 and 10 letters long.
        - Words must be single words (NO spaces, NO hyphens).
        - Normalize words: Remove accents/diacritics (e.g., 'JOÃO' -> 'JOAO', 'MÜNCHEN' -> 'MUNCHEN', 'ÑAME' -> 'NAME').
        - Clues must be in ${targetLanguage}.
        - Do NOT repeat words from the example prompt.
        - Return strictly JSON.`,
      },
      contents: `Generate a new crossword theme and word list in ${targetLanguage}. Random seed: ${randomSeed}`,
    });

    if (response.text) {
      return JSON.parse(response.text) as GeneratedContent;
    }
    throw new Error("Empty response from AI");
  } catch (error) {
    console.error("AI Generation Error:", error);
    // Fallback theme if API fails
    return {
      theme: "ERROR",
      words: [
        { word: "ERROR", clue: "API Error" },
        { word: "RELOAD", clue: "Try again" }
      ]
    };
  }
};
