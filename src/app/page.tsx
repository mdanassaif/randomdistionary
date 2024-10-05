'use client'

import React, { useState, useCallback } from 'react';
import { Book, Search } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Textarea } from "@/components/ui/textarea"
import { Slider } from '@/components/ui/slider';

const AdvancedDictionary = () => {
  const [text, setText] = useState('');
  const [wordSize, setWordSize] = useState(5);
  interface Meaning {
    word: string;
    meaning: string;
  }

  const [meanings, setMeanings] = useState<Meaning[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = useCallback(async (e: { preventDefault: () => void; }) => {
    e?.preventDefault();
    if (!text.trim()) return;

    setIsLoading(true);
    setError('');
    try {
      const response = await fetch('/api/getMeanings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, wordSize }),
      });
      if (!response.ok) throw new Error('Failed to fetch meanings');
      const data = await response.json();
      setMeanings(data.meanings);
    } catch (err) {
      setError('An error occurred while fetching meanings.');
    } finally {
      setIsLoading(false);
    }
  }, [text, wordSize]);

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg p-8">
       
      <form onSubmit={handleSubmit} className="space-y-6 ">
        <Textarea
          className="w-full border border-red-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-red-300 h-[15rem]"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your text here..."
        />
        <div className="space-y-2">
          <label htmlFor="wordSize" className="block text-sm font-medium text-red-700">
            Word Size: {wordSize} letters or longer
          </label>
          <Slider
            id="wordSize"
            min={3}
            max={15}
            step={1}
            value={[wordSize]}
            onValueChange={(value) => setWordSize(value[0])}
            className="w-full"
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-300 flex items-center justify-center"
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Get Meanings'}
          <Search className="ml-2" />
        </Button>
      </form>
      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {meanings.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4 text-red-600">Definitions:</h2>
          <ul className="space-y-2">
            {meanings.map((item, index) => (
              <li key={index} className="text-red-800">
                <p className="text-gray-900 bg-yellow-50 p-2 font-extrabold uppercase">{item.word}:</p> {item.meaning}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AdvancedDictionary;