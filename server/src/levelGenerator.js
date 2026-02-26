import { generateTopicAndWords } from './services/genai.js';
import { generateLayout } from './services/layoutEngine.js';

export async function generateLevel(language = 'pt') {
  const raw = await generateTopicAndWords(language);
  const words = generateLayout(raw.words);

  if (words.length < 5) {
    throw new Error(`Only ${words.length} words placed, need at least 5`);
  }

  return {
    theme: raw.theme,
    words,
  };
}
