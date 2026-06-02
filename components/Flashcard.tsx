import React, { useState, useEffect } from 'react';
import { Word } from '../types';
import { ArrowLeft, ArrowRight, RotateCw } from 'lucide-react';

interface FlashcardProps {
  word?: Word;
  onNext: () => void;
  onPrev: () => void;
  current: number;
  total: number;
}

const Flashcard: React.FC<FlashcardProps> = ({ word, onNext, onPrev, current, total }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  // Reset state when word changes
  useEffect(() => {
    setIsFlipped(false);
  }, [word]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  if (!word) {
    return (
      <div className="flex flex-col items-center justify-center w-full max-w-xl mx-auto p-4 h-[500px]">
        <div className="w-full h-80 sm:h-96 shadow-pop rounded-3xl bg-white dark:bg-gray-800 flex items-center justify-center border-4 border-dashed border-gray-300 dark:border-gray-700">
           <div className="text-center p-6">
              <h2 className="text-xl font-bold text-gray-400 dark:text-gray-500 mb-2">カードがありません</h2>
              <p className="text-gray-300 dark:text-gray-600 text-sm font-bold">単語リストから単語を追加してね！</p>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-xl mx-auto p-4 h-[520px]">
      
      {/* Card Container */}
      <div 
        className="relative w-full h-80 sm:h-96 cursor-pointer group perspective-1000"
        onClick={handleFlip}
      >
        {/* Removed duration-500 for instant flip */}
        <div className={`relative w-full h-full transform-style-3d transition-transform duration-0 ${isFlipped ? 'rotate-y-180' : ''}`}>
          
          {/* Front (English) */}
          <div className="absolute w-full h-full backface-hidden">
            <div className="w-full h-full bg-white dark:bg-gray-800 rounded-3xl border-4 border-gray-900 dark:border-gray-700 shadow-pop group-hover:shadow-pop-bold transition-all flex flex-col items-center justify-center p-8 relative overflow-hidden">
               {/* Decoration */}
               <div className="absolute top-4 left-4 w-3 h-3 rounded-full bg-gray-200 dark:bg-gray-700"></div>
               <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-gray-200 dark:bg-gray-700"></div>
               <div className="absolute bottom-0 w-full h-2 bg-indigo-500"></div>
               
               <span className="absolute top-6 text-xs font-black text-gray-300 dark:text-gray-600 tracking-widest">ENGLISH</span>
               <h2 className="text-5xl font-black text-gray-800 dark:text-white text-center break-words w-full">{word.english}</h2>
               
               <div className="absolute bottom-6 right-6 text-gray-300 dark:text-gray-600 animate-pulse">
                   <RotateCw size={20} />
               </div>
            </div>
          </div>

          {/* Back (Japanese + Example) */}
          <div className="absolute w-full h-full backface-hidden rotate-y-180">
             <div className="w-full h-full bg-white dark:bg-gray-800 rounded-3xl border-4 border-gray-900 dark:border-gray-700 shadow-pop flex flex-col items-center justify-center p-8 relative overflow-hidden">
                {/* Decoration: Same as front or minimal */}
                <div className="absolute top-4 left-4 w-3 h-3 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                <div className="absolute top-0 w-full h-2 bg-yellow-400"></div>

                <div className="z-10 w-full flex flex-col items-center overflow-y-auto scrollbar-hide h-full justify-center">
                    <span className="text-yellow-600 dark:text-yellow-400 text-[10px] font-black tracking-widest uppercase bg-yellow-100 dark:bg-yellow-900/50 px-2 py-1 rounded-md mb-3">MEANING</span>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-6 break-words w-full leading-snug">{word.japanese}</h2>
                    
                    {word.example && (
                        <div className="bg-gray-50 dark:bg-black/20 p-4 rounded-xl border-2 border-gray-100 dark:border-gray-700 w-full">
                            <span className="text-gray-400 text-[10px] font-black uppercase block mb-1">EXAMPLE</span>
                            <p className="text-lg text-indigo-800 dark:text-indigo-300 font-bold italic mb-1">"{word.example}"</p>
                            {word.exampleMeaning && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">{word.exampleMeaning}</p>
                            )}
                        </div>
                    )}
                </div>
             </div>
          </div>

        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex justify-between items-center w-full mt-6 px-2 gap-4">
        <button 
          onClick={onPrev}
          className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-300 w-14 h-14 rounded-full flex items-center justify-center font-bold shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 active:scale-95 transition-all"
        >
          <ArrowLeft size={24} strokeWidth={3} />
        </button>
        
        <div className="bg-white dark:bg-gray-800 px-6 py-2 rounded-full border-2 border-gray-900 dark:border-gray-600 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-none">
             <span className="text-2xl font-black text-indigo-500 dark:text-indigo-400">{current}</span>
             <span className="text-gray-300 dark:text-gray-600 mx-2 font-black">/</span>
             <span className="text-gray-500 dark:text-gray-400 font-bold">{total}</span>
        </div>
        
        <button 
          onClick={onNext}
          className="bg-indigo-500 text-white w-14 h-14 rounded-full flex items-center justify-center border-2 border-indigo-600 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:shadow-none active:scale-95 transition-all"
        >
           <ArrowRight size={24} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
};

export default Flashcard;