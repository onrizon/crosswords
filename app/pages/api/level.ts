import { generateTopicAndWords } from '@/services/genai';
import { SupportedLanguage } from '@/types';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function getLevel(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const language = (req.query.language as SupportedLanguage) || 'pt';
  const level = await generateTopicAndWords(language);
  res.status(200).json(level);
}
