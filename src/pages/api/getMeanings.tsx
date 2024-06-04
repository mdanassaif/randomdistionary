import { NextApiRequest, NextApiResponse } from 'next';

async function fetchDefinition(word: string): Promise<string> {
  const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch definition.');
    const data = await response.json();
    return data[0].meanings[0].definitions[0].definition;
  } catch (error) {
    return `No definition found for ${word}.`;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { text, wordSize } = req.body;
    const words = text.match(new RegExp(`\\b\\w{${wordSize},}\\b`, 'g')) || []; // Filter words based on wordSize
    const meanings = await Promise.all(
      words.map(async (word) => ({
        word,
        meaning: await fetchDefinition(word),
      }))
    );

    res.status(200).json({ meanings });
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
