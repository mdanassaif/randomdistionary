import { NextApiRequest, NextApiResponse } from 'next';

const definitionCache = new Map<string, string>();

async function fetchDefinition(word: string): Promise<string> {
  if (definitionCache.has(word)) return definitionCache.get(word)!;
  //dictionaryapi
  const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch definition.');
    const data = await response.json();
    const definition = data[0].meanings[0].definitions[0].definition;
    definitionCache.set(word, definition);  
    return definition;
  } catch (error) {
    console.error(`Error fetching definition for ${word}:`, error);
    return `No definition found for ${word}.`;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { text, wordSize } = req.body;
      const words: string[] = Array.from(new Set(text.match(new RegExp(`\\b\\w{${wordSize},}\\b`, 'g')) || []));

      const batchSize = 5;
      const meanings = await Promise.all(
        words.reduce((resultArray, item, index) => {
          const chunkIndex = Math.floor(index / batchSize);
          if (!resultArray[chunkIndex]) resultArray[chunkIndex] = [];
          resultArray[chunkIndex].push(item);
          return resultArray;
        }, [] as string[][]).map(async (batch) =>
          Promise.all(
            batch.map(async (word) => ({
              word,
              meaning: await fetchDefinition(word),
            }))
          )
        )
      );

      res.status(200).json({ meanings: meanings.flat() });
    } catch (error) {
      console.error('Error processing request:', error);
      res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
