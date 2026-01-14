import { Locale } from '@/locales';
import { generateTopicAndWords } from '@/services/genai';
import { generateLayout } from '@/services/layoutEngine';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function getLevel(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const language = (req.query.language as Locale) || 'pt';
  const level = await generateTopicAndWords(language);
  const words = generateLayout(level.words);

  if (words.length < 5) {
    res.status(500).json({ error: 'Could not generate a valid grid structure' });
    return;
  }

  res.status(200).json({
    clues: level.clues,
    words,
  });
}
