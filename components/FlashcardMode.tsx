import React, { useState, useEffect } from 'react';
import { Word } from '../types';
import Flashcard from './Flashcard';
import { Filter, Shuffle, RotateCcw, Play, Pause } from 'lucide-react';

interface FlashcardModeProps {
  allWords: Word[];
  initialDeck: Word[];
}

const FlashcardMode: React.FC<FlashcardModeProps> = ({ allWords, initialDeck }) => {
  // Deck State
  const [deck, setDeck] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Range Inputs State
  const [rangeStart, setRangeStart] = useState<string>('');
  const [rangeEnd, setRangeEnd] = useState<string>('');

  // Auto Play State
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [autoInterval, setAutoInterval] = useState(3000); // Default 3 seconds

  // Initialize deck on mount or when props change
  useEffect(() => {
    if (initialDeck.length > 0) {
      setDeck(initialDeck);
      // If initial deck is a subset (review mode), we don't necessarily update input fields
      // but we could set them if it matches a clean range. For now, keep inputs independent or default.
    } else {
      // Default to first 100 if no deck provided (or full range)
      // Let's call apply range with default params logic
      handleApplyRange(); 
    }
    setCurrentIndex(0);
    setIsAutoPlaying(false); // Stop auto play on deck change
  }, [initialDeck, allWords]);

  // Auto Play Timer
  useEffect(() => {
    let interval: any;
    if (isAutoPlaying && deck.length > 0) {
      interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % deck.length);
      }, autoInterval);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, autoInterval, deck.length]);

  const handleApplyRange = () => {
    // If empty, use defaults: 1 to 100
    const start = rangeStart === '' ? 1 : parseInt(rangeStart, 10);
    const end = rangeEnd === '' ? 100 : parseInt(rangeEnd, 10);

    const safeStart = isNaN(start) ? 1 : start;
    const safeEnd = isNaN(end) ? 100 : end;

    const filtered = allWords.filter(w => w.id >= safeStart && w.id <= safeEnd);
    if (filtered.length === 0) {
        alert("この範囲に単語は見つかりませんでした。");
        return;
    }
    setDeck(filtered);
    setCurrentIndex(0);
    setIsAutoPlaying(false);
  };

  const handleShuffle = () => {
    const shuffled = [...deck].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setCurrentIndex(0);
    setIsAutoPlaying(false);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % deck.length);
    setIsAutoPlaying(false); // Stop auto play on manual navigation
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + deck.length) % deck.length);
    setIsAutoPlaying(false); // Stop auto play on manual navigation
  };

  const handleReset = () => {
      setDeck(allWords);
      setRangeStart('');
      setRangeEnd('');
      setCurrentIndex(0);
      setIsAutoPlaying(false);
  }

  const preventInvalidInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (["e", "E", "+", "-"].includes(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      {/* Controls Bar */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row items-center justify-between gap-4 transition-colors">
        
        <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start w-full">
            {/* Range Inputs */}
            <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-700 p-1.5 rounded-lg border border-gray-200 dark:border-gray-600">
                <div className="flex items-center px-2">
                    <span className="text-xs font-bold text-gray-400 uppercase mr-2">範囲</span>
                    <input 
                        type="number" 
                        min="1"
                        value={rangeStart}
                        onChange={(e) => setRangeStart(e.target.value)}
                        onKeyDown={preventInvalidInput}
                        placeholder="1"
                        className="w-16 px-1 py-1 text-center border-b-2 border-transparent focus:border-indigo-500 bg-transparent text-gray-800 dark:text-gray-100 outline-none font-mono text-sm placeholder-gray-300 dark:placeholder-gray-500"
                    />
                    <span className="text-gray-400 mx-1">-</span>
                    <input 
                        type="number" 
                        min="1"
                        value={rangeEnd}
                        onChange={(e) => setRangeEnd(e.target.value)}
                        onKeyDown={preventInvalidInput}
                        placeholder="100"
                        className="w-16 px-1 py-1 text-center border-b-2 border-transparent focus:border-indigo-500 bg-transparent text-gray-800 dark:text-gray-100 outline-none font-mono text-sm placeholder-gray-300 dark:placeholder-gray-500"
                    />
                </div>
                <button 
                    onClick={handleApplyRange} 
                    className="p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                    title="範囲適用"
                >
                    <Filter size={14} />
                </button>
            </div>

            {/* Auto Play Controls */}
            <div className="flex items-center space-x-1 bg-gray-50 dark:bg-gray-700 p-1.5 rounded-lg border border-gray-200 dark:border-gray-600">
                <button
                    onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                    className={`flex items-center space-x-1 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                        isAutoPlaying
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                >
                    {isAutoPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
                    <span>自動</span>
                </button>

                <div className="h-4 w-px bg-gray-300 dark:bg-gray-600 mx-1" />

                <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((sec) => (
                        <button
                            key={sec}
                            onClick={() => setAutoInterval(sec * 1000)}
                            className={`w-6 h-6 flex items-center justify-center rounded text-xs font-mono transition-colors ${
                                autoInterval === sec * 1000
                                    ? 'bg-indigo-600 text-white font-bold'
                                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                            title={`${sec}秒`}
                        >
                            {sec}
                        </button>
                    ))}
                    <span className="text-xs text-gray-400 ml-1">秒</span>
                </div>
            </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3 w-full md:w-auto justify-center">
             <button 
                onClick={handleShuffle}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
             >
                <Shuffle size={16} />
                <span>シャッフル</span>
             </button>
             <button 
                onClick={handleReset}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                title="リセット"
             >
                <RotateCcw size={16} />
             </button>
        </div>
      </div>

      {/* Card Display */}
      <Flashcard 
        word={deck[currentIndex]} 
        current={currentIndex + 1}
        total={deck.length}
        onNext={handleNext} 
        onPrev={handlePrev} 
      />
    </div>
  );
};

export default FlashcardMode;