import { Locale } from '@/locales';
import { GoogleGenAI, Type } from '@google/genai';
import { RawLevel } from '../types';

// Get API key from environment variable
const API_KEY = process.env.GEMINI_API_KEY || '';

if (!API_KEY) {
  console.warn(
    '⚠️ GEMINI_API_KEY not found. AI generation will use fallback data.'
  );
}

const ai = new GoogleGenAI({
  apiKey: API_KEY,
});

// Creative inspirations to spark unique category ideas (not the categories themselves)
const INSPIRATIONS = [
  // Nature & Living Things
  'creatures that live underwater',
  'animals with fur',
  'things that grow in gardens',
  'life in the rainforest',
  'creatures of the night',
  'things with wings',
  'life in the desert',
  'things that bloom',
  'animals people keep at home',
  'life in cold places',
  'things found in forests',
  'creatures with shells',
  'things that crawl',
  'life on a farm',
  'things in the sky',
  'microscopic life',
  'endangered wildlife',
  'prehistoric creatures',
  'venomous animals',
  'migratory species',

  // Places & Locations
  'a busy city street',
  'tropical paradise',
  'mountain adventures',
  'underground places',
  'places people work',
  'where children play',
  'places to relax',
  'historic locations',
  'places that serve food',
  'where people learn',
  'places for entertainment',
  'outdoor destinations',
  'places in a home',
  'sacred places',
  'places that move (vehicles)',
  'imaginary places',
  'abandoned locations',
  'extreme environments',
  'tourist attractions',
  'secret hideaways',

  // Food & Cooking
  'things in a kitchen',
  'breakfast time',
  'sweet treats',
  'spicy flavors',
  'food from the sea',
  'things you bake',
  'summer refreshments',
  'comfort on a cold day',
  'street food culture',
  'things you grill',
  'food that is raw',
  'fermented delicacies',
  'childhood favorites',
  'gourmet cuisine',
  'quick meals',
  'food that is wrapped',
  'things you dip',
  'celebratory foods',
  'food from plants',
  'aged and cured',

  // Human Activities
  'morning routines',
  'ways to exercise',
  'creative pursuits',
  'things people collect',
  'weekend activities',
  'ways to relax',
  'competitive activities',
  'things done in teams',
  'solo adventures',
  'nighttime activities',
  'seasonal traditions',
  'childhood games',
  'adult responsibilities',
  'romantic gestures',
  'ways to celebrate',
  'acts of kindness',
  'risky activities',
  'meditation and mindfulness',
  'learning something new',
  'expressions of art',

  // Objects & Things
  'things with buttons',
  'things that make noise',
  'things that shine',
  'things in pockets',
  'things that spin',
  'things you wear on your head',
  'things made of glass',
  'things that fold',
  'things with wheels',
  'things that float',
  'things that are sharp',
  'things that keep time',
  'things that store information',
  'things that connect',
  'things that protect',
  'things that measure',
  'things that heat',
  'things that cool',
  'vintage objects',
  'futuristic gadgets',

  // Emotions & Feelings
  'moments of joy',
  'things that scare',
  'feelings of love',
  'sources of stress',
  'peaceful moments',
  'exciting experiences',
  'nostalgic memories',
  'proud achievements',
  'embarrassing moments',
  'sources of inspiration',
  'things that comfort',
  'feelings of freedom',
  'moments of surprise',
  'things that frustrate',
  'sources of hope',
  'feelings of belonging',
  'moments of courage',
  'things that relax',
  'expressions of gratitude',
  'feelings of wonder',

  // Time & Seasons
  'spring awakening',
  'summer vibes',
  'autumn harvest',
  'winter wonderland',
  'things from the past',
  'modern innovations',
  'future predictions',
  'ancient wisdom',
  'teenage years',
  'golden age memories',
  'new beginnings',
  'endings and farewells',
  'daily routines',
  'weekly traditions',
  'annual events',
  'once in a lifetime',
  'fleeting moments',
  'timeless classics',
  'trends that come and go',
  'things that last forever',

  // Culture & Society
  'wedding traditions',
  'birthday celebrations',
  'holiday spirit',
  'funeral customs',
  'coming of age',
  'family gatherings',
  'friendship bonds',
  'workplace dynamics',
  'school memories',
  'community events',
  'religious practices',
  'superstitions and beliefs',
  'fashion through decades',
  'music movements',
  'art revolutions',
  'literary worlds',
  'film magic',
  'theater drama',
  'dance expressions',
  'culinary traditions',

  // Science & Discovery
  'space exploration',
  'ocean depths',
  'human anatomy',
  'chemical reactions',
  'physical forces',
  'mathematical patterns',
  'technological breakthroughs',
  'medical advances',
  'natural phenomena',
  'scientific tools',
  'experiments gone wrong',
  'discoveries by accident',
  'theories and hypotheses',
  'inventions that changed the world',
  'mysteries of the universe',
  'evolution of species',
  'climate and weather',
  'geological formations',
  'quantum mysteries',
  'genetic wonders',

  // Fantasy & Imagination
  'mythical creatures',
  'magical powers',
  'enchanted objects',
  'legendary heroes',
  'villains and monsters',
  'fairy tale settings',
  'dream worlds',
  'nightmare fuel',
  'supernatural beings',
  'parallel universes',
  'time travel scenarios',
  'alien encounters',
  'robot uprising',
  'post-apocalyptic survival',
  'medieval fantasy',
  'steampunk aesthetics',
  'cyberpunk futures',
  'underwater kingdoms',
  'floating cities',
  'hidden realms',

  // Sports & Competition
  'olympic glory',
  'team spirit',
  'individual excellence',
  'extreme challenges',
  'water competitions',
  'winter athletics',
  'combat and fighting',
  'racing speed',
  'precision sports',
  'strength and power',
  'endurance tests',
  'ball games',
  'racket sports',
  'target practice',
  'gymnastics grace',
  'dance competitions',
  'e-sports battles',
  'traditional games',
  'backyard fun',
  'playground classics',

  // Professions & Work
  'healing professions',
  'creative careers',
  'dangerous jobs',
  'helping others',
  'building things',
  'teaching and mentoring',
  'protecting people',
  'entertaining audiences',
  'solving problems',
  'leading organizations',
  'creating art',
  'growing food',
  'moving things',
  'fixing broken things',
  'discovering new things',
  'cooking for others',
  'designing spaces',
  'writing stories',
  'coding the future',
  'caring for animals',

  // Abstract Concepts
  'things that are red',
  'things that are round',
  'things that come in pairs',
  'things that are tiny',
  'things that are massive',
  'things that are fast',
  'things that are slow',
  'things that are loud',
  'things that are silent',
  'things that are smooth',
  'things that are rough',
  'things that are transparent',
  'things that are heavy',
  'things that are light',
  'things that are old',
  'things that are new',
  'things that are rare',
  'things that are common',
  'things that are expensive',
  'things that are free',

  // Sensory Experiences
  'delicious aromas',
  'beautiful sounds',
  'soft textures',
  'bright colors',
  'bitter tastes',
  'sweet scents',
  'harsh noises',
  'gentle touches',
  'vibrant visuals',
  'sour flavors',
  'smooth surfaces',
  'loud environments',
  'quiet spaces',
  'warm sensations',
  'cold feelings',
  'spicy experiences',
  'refreshing moments',
  'overwhelming senses',
  'subtle details',
  'intense experiences',

  // Relationships & Connections
  'family bonds',
  'childhood friends',
  'romantic partners',
  'work colleagues',
  'neighbors and community',
  'teachers and students',
  'doctors and patients',
  'strangers who helped',
  'rivals and competitors',
  'mentors and guides',
  'pets and owners',
  'leaders and followers',
  'artists and fans',
  'buyers and sellers',
  'hosts and guests',
  'players and coaches',
  'authors and readers',
  'performers and audiences',
  'creators and critics',
  'friends turned family',

  // Technology & Innovation
  'things that connect us',
  'devices we carry',
  'screens everywhere',
  'smart home living',
  'social media world',
  'gaming universes',
  'streaming entertainment',
  'digital communication',
  'online shopping',
  'virtual reality',
  'artificial intelligence',
  'cloud computing',
  'mobile apps',
  'wearable technology',
  'electric vehicles',
  'renewable energy',
  'space technology',
  'medical devices',
  'security systems',
  'automation everywhere',

  // Life Events & Milestones
  'first day of school',
  'graduation day',
  'first job',
  'moving out',
  'falling in love',
  'getting married',
  'becoming a parent',
  'career changes',
  'buying a home',
  'retirement dreams',
  'overcoming illness',
  'achieving goals',
  'traveling the world',
  'learning to drive',
  'first heartbreak',
  'making amends',
  'starting over',
  'finding purpose',
  'facing fears',
  'saying goodbye',

  // World Cultures
  'Japanese traditions',
  'Italian lifestyle',
  'Brazilian energy',
  'Indian spirituality',
  'French elegance',
  'Mexican fiesta',
  'Chinese heritage',
  'African rhythms',
  'Australian outback',
  'Russian soul',
  'Greek philosophy',
  'Egyptian mysteries',
  'Nordic resilience',
  'Caribbean vibes',
  'Middle Eastern hospitality',
  'Korean innovation',
  'Spanish passion',
  'German precision',
  'British customs',
  'American dreams',

  // Random & Quirky
  'things grandparents love',
  'things that annoy people',
  'guilty pleasures',
  'things people pretend to like',
  'overrated things',
  'underrated treasures',
  'things that smell weird',
  'things that taste better cold',
  'things people argue about',
  'things that always break',
  'things people forget',
  'things people lose',
  'things that stick',
  'things that bounce',
  'things that melt',
  'things that grow',
  'things that shrink',
  'things that change color',
  'things that make people laugh',
  'things that make people cry',
];

// Track used inspirations to avoid repetition within a session
let usedInspirations: Set<string> = new Set();

// Function to get a random unused inspiration
const getRandomInspiration = (): string => {
  // If all inspirations have been used, reset the list
  if (usedInspirations.size >= INSPIRATIONS.length) {
    usedInspirations.clear();
  }

  // Filter out used inspirations
  const availableInspirations = INSPIRATIONS.filter(
    (i) => !usedInspirations.has(i)
  );

  // Select a random one
  const inspiration =
    availableInspirations[
      Math.floor(Math.random() * availableInspirations.length)
    ];

  // Mark it as used
  usedInspirations.add(inspiration);

  return inspiration;
};

// Function to reset used inspirations (can be called when starting a new session)
export const resetUsedInspirations = () => {
  usedInspirations.clear();
};

const LANGUAGE_NAMES: Record<Locale, string> = {
  pt: 'Portuguese (Brazil)',
  en: 'English',
  fr: 'French',
  de: 'German',
  it: 'Italian',
  es: 'Spanish',
  ru: 'Russian',
  tr: 'Turkish',
  vi: 'Vietnamese',
  pl: 'Polish',
  ro: 'Romanian',
  cs: 'Czech',
  nl: 'Dutch',
  hr: 'Croatian',
  el: 'Greek',
};

// Robust fallback data with enough words to guarantee a valid grid
const FALLBACK_DATA: RawLevel = {
  clues: ['TECNOLOGIA', 'COMPUTADORES', 'MUNDO DIGITAL'],
  words: [
    'INTERNET',
    'COMPUTADOR',
    'MOUSE',
    'TECLADO',
    'MONITOR',
    'WIFI',
    'DADOS',
    'MEMORIA',
    'PROCESSADOR',
    'SOFTWARE',
    'HARDWARE',
    'CAMERA',
    'FONE',
    'GAMER',
    'STREAM',
    'CHAT',
    'BOTAO',
    'CLIQUE',
    'ICONE',
    'PASTA',
    'SERVIDOR',
    'REDE',
    'SISTEMA',
    'ARQUIVO',
    'DIGITAL',
    'CODIGO',
    'PIXEL',
    'TELA',
    'DISCO',
    'NUVEM',
    'LINK',
    'SITE',
    'BLOG',
    'EMAIL',
    'SENHA',
    'LOGIN',
    'PERFIL',
    'VIDEO',
    'AUDIO',
    'TECLA',
  ],
};

export const generateTopicAndWords = async (
  language: Locale = 'pt'
): Promise<RawLevel> => {
  // Return fallback data if no API key is configured
  if (!API_KEY) {
    console.warn('No API key configured, using fallback data');
    return FALLBACK_DATA;
  }

  const model = 'gemini-2.5-flash';

  // Select a random unused inspiration
  const inspiration = getRandomInspiration();
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
            clues: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
                description: `A clue hint in ${targetLanguage} (e.g., 'Frutas', 'Países', 'Cores').`,
              },
              description: `Exactly 3 clue hints that help players guess the words.`,
            },
            words: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
                description:
                  'The word answer (uppercase, no spaces, no special chars, normalized).',
              },
            },
          },
          required: ['clues', 'words'],
        },
        systemInstruction: `You are a crossword puzzle generator for a casual livestream game.

        TASK:
        1. Use this creative inspiration to come up with a FRESH, UNIQUE category: "${inspiration}"
           - DO NOT use the inspiration text directly as a clue.
           - Create specific, catchy clue hints in ${targetLanguage} that are INSPIRED BY but DIFFERENT from the prompt.
           - Be creative! Each clue should feel fresh and unique.
        2. Generate exactly 3 CLUE HINTS from DIFFERENT PERSPECTIVES. The clues must be:
           - NOT SYNONYMS: Each clue must offer a unique angle or viewpoint on the category.
           - Different perspectives, not different ways to say the same thing.
           - Example for "Ocean Animals": "Vida Marinha", "Fundo do Mar", "Natureza Aquática" (good - different perspectives)
           - NOT like: "Animais do Mar", "Animais Marinhos", "Criaturas do Oceano" (bad - synonyms)
           - Short (1-3 words each).
        3. Generate exactly 40 common words related to YOUR CREATED category in ${targetLanguage}.

        RULES:
        - CRITICAL: Clues must NEVER contain any of the answer words. The clue hints must be different from all 40 words in the list.
        - All 3 clues must be in ${targetLanguage}, creative, and related to the same category.
        - IMPORTANT: Clues should KEEP their natural accents/diacritics (e.g., "Países", "Música", "Café"). Only answer words are normalized.
        - Words must be in ${targetLanguage}.
        - Words must be common vocabulary that an average person knows.
        - Remove spaces and hyphens from answer words.
        - Words must be between 3 and 12 letters long.
        - Normalize answer words ONLY: Remove accents/diacritics from answers (e.g., 'JOÃO' -> 'JOAO', 'MÜNCHEN' -> 'MUNCHEN', 'ÑAME' -> 'NAME').
        - Generate up to 40 words, but not less than 15.
        - Return strictly JSON.`,
      },
      contents: `Generate 3 crossword clues and word list in ${targetLanguage}. Random seed: ${randomSeed}`,
    });

    if (response.text) {
      return JSON.parse(response.text) as RawLevel;
    }
    throw new Error('Empty response from AI');
  } catch (error) {
    console.error('AI Generation Error:', error);
    return FALLBACK_DATA;
  }
};
