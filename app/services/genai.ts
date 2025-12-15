import { GoogleGenAI, Type } from '@google/genai';
import { SupportedLanguage } from '../types';

// Get API key from environment variable
const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';

if (!API_KEY) {
  console.warn(
    '⚠️ GEMINI_API_KEY not found. AI generation will use fallback data.'
  );
}

const ai = new GoogleGenAI({
  apiKey: API_KEY,
});

export interface GeneratedContent {
  theme: string;
  words: {
    word: string;
    clue: string;
  }[];
}

// Broad, common knowledge categories suitable for a general audience
const INSPIRATIONS = [
  // Animals & Nature
  'Animals',
  'Birds',
  'Insects',
  'Sea Creatures',
  'Dog Breeds',
  'Farm Animals',
  'Flowers',
  'Trees',
  'Fruits',
  'Vegetables',
  'Weather',
  'The Solar System',
  'Gemstones',
  'Metals',
  'Jungle Animals',
  'Pets',

  // Geography & Places
  'Countries',
  'Capitals',
  'Cities',
  'Continents',
  'Rivers & Oceans',
  'Mountains',
  'Things in Japan',
  'Things in Brazil',
  'Things in Italy',
  'Things in USA',
  'Things in France',
  'At the Beach',
  'At the Farm',
  'At the Airport',
  'At the Hospital',
  'At the Supermarket',
  'In the Kitchen',
  'In the Bathroom',
  'In the Bedroom',
  'In the Living Room',
  'In the Office',
  'At School',
  'In a Library',
  'At the Cinema',
  'At a Restaurant',
  'At the Gym',

  // Objects & Daily Life
  'Clothing',
  'Footwear',
  'Furniture',
  'Tools',
  'Electronics',
  'Kitchen Utensils',
  'School Supplies',
  'Transportation',
  'Cars',
  'Musical Instruments',
  'Toys',
  'Makeup & Beauty',
  'Jewelry',
  'Colors',
  'Shapes',
  'Jobs & Professions',

  // Food & Drink
  'Breakfast Foods',
  'Desserts',
  'Drinks',
  'Pizza Toppings',
  'Ice Cream Flavors',
  'Candy',
  'Bakery Items',
  'BBQ',
  'Pasta',
  'Spices',
  'Cheeses',
  'Fast Food',

  // People & Culture
  'Male Names',
  'Female Names',
  'Family Members',
  'Emotions',
  'Zodiac Signs',
  'Superheroes',
  'Sports',
  'Olympic Sports',
  'Football/Soccer',
  'Martial Arts',
  'Board Games',
  'Card Games',
  'Video Game Genres',
  'Movie Genres',
  'Music Genres',
  'Fairy Tales',
  'Villains',
  'Famous Brands',
  'Currencies',
  'Languages',

  // Holidays & Events
  'Christmas',
  'Halloween',
  'Easter',
  "Valentine's Day",
  'Birthday Party',
  'Wedding',
  'Camping',
  'Circus',
  'Carnival',
  "New Year's Eve",
];

const LANGUAGE_NAMES: Record<SupportedLanguage, string> = {
  pt: 'Portuguese (Brazil)',
  en: 'English',
  fr: 'French',
  de: 'German',
  it: 'Italian',
  es: 'Spanish',
};

// Robust fallback data with enough words to guarantee a valid grid
const FALLBACK_DATA: GeneratedContent = {
  theme: 'TECNOLOGIA (OFFLINE)',
  words: [
    { word: 'INTERNET', clue: 'Rede mundial de computadores' },
    { word: 'COMPUTADOR', clue: 'Máquina de processar dados' },
    { word: 'MOUSE', clue: 'Dispositivo apontador' },
    { word: 'TECLADO', clue: 'Periférico para digitar' },
    { word: 'MONITOR', clue: 'Tela de exibição' },
    { word: 'WIFI', clue: 'Conexão sem fio' },
    { word: 'DADOS', clue: 'Informações digitais' },
    { word: 'MEMORIA', clue: 'Armazenamento temporário' },
    { word: 'PROCESSADOR', clue: 'Cérebro do computador' },
    { word: 'SOFTWARE', clue: 'Programas e aplicativos' },
    { word: 'HARDWARE', clue: 'Parte física do PC' },
    { word: 'CAMERA', clue: 'Grava vídeo' },
    { word: 'FONE', clue: 'Escuta áudio' },
    { word: 'GAMER', clue: 'Jogador de jogos eletrônicos' },
    { word: 'STREAM', clue: 'Transmissão de vídeo ao vivo' },
    { word: 'CHAT', clue: 'Conversa em tempo real' },
    { word: 'BOTAO', clue: 'Tecla de comando' },
    { word: 'CLIQUE', clue: 'Ação do mouse' },
    { word: 'ICONE', clue: 'Símbolo gráfico' },
    { word: 'PASTA', clue: 'Organizador de arquivos' },
  ],
};

export const generateTopicAndWords = async (
  language: SupportedLanguage = 'pt'
): Promise<GeneratedContent> => {
  // Return fallback data if no API key is configured
  if (!API_KEY) {
    console.warn('No API key configured, using fallback data');
    return FALLBACK_DATA;
  }

  const model = 'gemini-2.5-flash';

  // Select a random inspiration from the expanded list
  const inspiration =
    INSPIRATIONS[Math.floor(Math.random() * INSPIRATIONS.length)];
  const randomSeed = Math.floor(Math.random() * 1000000);
  const targetLanguage = LANGUAGE_NAMES[language];

  try {
    const response = await ai.models.generateContent({
      model,
      config: {
        temperature: 1.0, // Reduced temperature slightly for more coherent/common lists
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            theme: {
              type: Type.STRING,
              description: `The theme title in ${targetLanguage} (e.g., 'Frutas', 'Países', 'Cores').`,
            },
            words: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  word: {
                    type: Type.STRING,
                    description:
                      'The word answer (uppercase, no spaces, no special chars, normalized).',
                  },
                  clue: {
                    type: Type.STRING,
                    description: `A simple definition or clue in ${targetLanguage}.`,
                  },
                },
                required: ['word', 'clue'],
              },
            },
          },
          required: ['theme', 'words'],
        },
        systemInstruction: `You are a crossword puzzle generator for a casual livestream game.
        
        TASK:
        1. Create a BROAD, COMMON KNOWLEDGE theme based on the inspiration: "${inspiration}".
           - The theme should be simple and recognizable (e.g., if inspiration is "Kitchen", theme is "Objetos de Cozinha").
        2. Generate exactly 45 common words related to that theme in the language: ${targetLanguage}.
        
        RULES:
        - Words must be in ${targetLanguage}.
        - Words must be common vocabulary that an average person knows.
        - Words must be between 3 and 10 letters long.
        - Words must be single words (NO spaces, NO hyphens).
        - Normalize words: Remove accents/diacritics (e.g., 'JOÃO' -> 'JOAO', 'MÜNCHEN' -> 'MUNCHEN', 'ÑAME' -> 'NAME').
        - Clues must be in ${targetLanguage}, simple and direct.
        - Do NOT repeat words from the example prompt.
        - Return strictly JSON.`,
      },
      contents: `Generate a new crossword theme and word list in ${targetLanguage}. Random seed: ${randomSeed}`,
    });

    if (response.text) {
      return JSON.parse(response.text) as GeneratedContent;
    }
    throw new Error('Empty response from AI');
  } catch (error) {
    console.error('AI Generation Error:', error);
    return FALLBACK_DATA;
  }
};
