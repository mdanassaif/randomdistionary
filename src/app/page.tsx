'use client';


import { useState } from 'react';

interface Meaning {
  word: string;
  meaning: string;
}

function generateRandomText() {
  const nouns = [
    "apple", "banana", "cherry", "date", "elderberry", "fig", "grape", "honeydew",
    "student", "university", "assignment", "learning", "education", "scholarship",
    "knowledge", "academics", "book", "library", "study", "examination"
  ];

  const adjectives = [
    "delicious", "ripe", "sweet", "juicy", "tasty", "fresh", "sour", "nutritious",
    "bright", "intelligent", "curious", "clever", "creative", "innovative", "ambitious"
  ];

  const verbs = [
    "enjoys", "devours", "consumes", "learns", "studies", "explores", "discovers",
    "reads", "comprehends", "absorbs", "analyzes", "experiments", "achieves", "succeeds"
  ];

  const adverbs = [
    "quickly", "eagerly", "enthusiastically", "intently", "passionately", "thoroughly",
    "creatively", "thoughtfully", "diligently", "persistently", "successfully", "brilliantly"
  ];

  const determiners = ["The", "A"];
  const connectors = ["and", "but", "or", "so"];

  const sentenceLength = Math.floor(Math.random() * 8) + 10; // Sentences of length 10-17 words
  let sentence = [];

  for (let i = 0; i < sentenceLength; i++) {
    let word;
    if (i === 0) {
      word = determiners[Math.floor(Math.random() * determiners.length)];
    } else if (i === sentenceLength - 1) {
      word = ".";
    } else {
      switch (i % 4) {
        case 0:
          word = adjectives[Math.floor(Math.random() * adjectives.length)];
          break;
        case 1:
          word = nouns[Math.floor(Math.random() * nouns.length)];
          break;
        case 2:
          word = verbs[Math.floor(Math.random() * verbs.length)];
          break;
        case 3:
          word = adverbs[Math.floor(Math.random() * adverbs.length)];
          break;
        default:
          break;
      }
      if (i > 1 && Math.random() > 0.7) {
        word = connectors[Math.floor(Math.random() * connectors.length)];
      }
    }
    sentence.push(word);
  }

  return sentence.join(' ');
}

console.log(generateRandomText());


export default function Home() {
  const [text, setText] = useState('');
  const [wordSize, setWordSize] = useState(7); // Default word size
  const [meanings, setMeanings] = useState<Meaning[]>([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await fetch('/api/getMeanings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, wordSize }), // Include wordSize in the request body
    });

    if (response.ok) {
      const data = await response.json();
      setMeanings(data.meanings);
    } else {
      console.error('Error fetching meanings');
    }
  };

  const handleGenerateText = () => {
    setText(generateRandomText());
  };

  return (
    <main className="flex h-[60vh]  items-center justify-center">
    <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <textarea
          className="w-full p-4 border border-gray-300 rounded-lg resize-none"
          rows={parseInt("4")}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your text here..."
        ></textarea>
        <div className="flex items-center justify-between">
          <label htmlFor="wordSize" className="text-gray-700">
            Word Size:
          </label>
          <select
            id="wordSize"
            value={wordSize}
            onChange={(e) => setWordSize(parseInt(e.target.value))}
            className="border border-gray-300 rounded-lg p-2"
          >
            {[3, 4, 5, 6, 7, 8, 9].map((size) => (
              <option key={size} value={size}>
                {size} letters or longer
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center justify-center space-x-4">
          <button
            type="submit"
            className="bg-[#6f1940] text-white px-6 py-3 rounded-lg hover:bg-[#db7f9d] transition-colors"
          >
            Get Meanings
          </button>
          <button
            type="button"
            onClick={handleGenerateText}
            className="bg-[#007a6a] text-white px-6 py-3 rounded-lg hover:bg-[#009d88] transition-colors"
          >
            Generate Random Sentence
          </button>
        </div>
      </form>
      {meanings.length > 0 && (
        <div className="mt-8">
          <ul className="space-y-2">
            {meanings.map((item, index) => (
              <li key={index} className="text-gray-800">
                <strong className='uppercase text-[#5f2134]'>{item.word} :</strong> {item.meaning}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  </main>
  
  );
}
