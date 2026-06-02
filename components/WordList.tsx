import React, { useState, useEffect } from 'react';
    import { Word } from '../types';
    import { Filter, Type, EyeOff, Eye, Shuffle, Search, ChevronLeft, ChevronRight } from 'lucide-react';
    
    interface WordListProps {
        words: Word[];
    }

    const ITEMS_PER_PAGE = 50;
    
    const WordList: React.FC<WordListProps> = ({ words }) => {
      // Range filtering state
      const [rangeStart, setRangeStart] = useState<string>('');
      const [rangeEnd, setRangeEnd] = useState<string>('');
      const [displayedWords, setDisplayedWords] = useState<Word[]>([]);
      const [hasSearched, setHasSearched] = useState(false);
      const [currentPage, setCurrentPage] = useState(1);
      
      // Red Sheet mode states
      const [isRedText, setIsRedText] = useState(false);
      const [isSheetOn, setIsSheetOn] = useState(false);
      
      // Track manually revealed words (when sheet is ON)
      const [revealedIds, setRevealedIds] = useState<Set<number>>(new Set());

      // Reset state when dataset changes
      useEffect(() => {
        setDisplayedWords([]);
        setHasSearched(false);
        setRangeStart('');
        setRangeEnd('');
        setCurrentPage(1);
        setRevealedIds(new Set());
      }, [words]);
    
      const handleApplyFilter = () => {
        const start = rangeStart === '' ? 1 : parseInt(rangeStart, 10);
        const end = rangeEnd === '' ? words.length : parseInt(rangeEnd, 10);
        
        // Safety check
        const safeStart = isNaN(start) ? 1 : start;
        const safeEnd = isNaN(end) ? words.length : end;

        if (safeStart > safeEnd) return;
    
        const filtered = words.filter(w => w.id >= safeStart && w.id <= safeEnd);
        setDisplayedWords(filtered);
        setHasSearched(true);
        setCurrentPage(1); // Reset page
        
        // Reset reveals when list changes
        setRevealedIds(new Set());
      };
    
      const handleShuffle = () => {
        if (displayedWords.length === 0) return;
        const shuffled = [...displayedWords].sort(() => Math.random() - 0.5);
        setDisplayedWords(shuffled);
        setCurrentPage(1); // Reset page
      };
    
      const handleToggleSheet = () => {
          const newState = !isSheetOn;
          setIsSheetOn(newState);
          // Reset all revealed items when toggling the sheet on/off
          setRevealedIds(new Set());
      };
    
      const toggleReveal = (id: number) => {
          if (!isSheetOn) return;
    
          const newRevealed = new Set(revealedIds);
          if (newRevealed.has(id)) {
              newRevealed.delete(id); // Cover it back up
          } else {
              newRevealed.add(id); // Reveal it
          }
          setRevealedIds(newRevealed);
      };
    
      const preventInvalidInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (["e", "E", "+", "-"].includes(e.key)) {
          e.preventDefault();
        }
      };

      // Pagination Logic
      const totalPages = Math.ceil(displayedWords.length / ITEMS_PER_PAGE);
      const currentWords = displayedWords.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
      );

      const handlePrevPage = () => setCurrentPage(p => Math.max(1, p - 1));
      const handleNextPage = () => setCurrentPage(p => Math.min(totalPages, p + 1));
    
      return (
        <div className="max-w-4xl mx-auto space-y-4">
            {/* Controls Header (Sticky) */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-3xl shadow-pop border-4 border-gray-900 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-4 sticky top-4 z-20 transition-colors">
                
                <div className="flex items-center space-x-2">
                    {/* Range Filter */}
                    <div className="flex items-center space-x-2 bg-yellow-50 dark:bg-gray-700 p-1.5 rounded-2xl border-2 border-yellow-200 dark:border-gray-600">
                        <div className="flex items-center px-2">
                            <input 
                                type="number" 
                                min="1"
                                value={rangeStart}
                                onChange={(e) => setRangeStart(e.target.value)}
                                onKeyDown={preventInvalidInput}
                                placeholder="1"
                                className="w-20 px-1 py-1 text-center font-bold bg-white dark:bg-gray-600 rounded-lg text-gray-800 dark:text-gray-100 outline-none border-2 border-transparent focus:border-indigo-400 placeholder-gray-300 dark:placeholder-gray-500"
                            />
                            <span className="text-gray-400 mx-1 font-black">~</span>
                            <input 
                                type="number" 
                                min="1"
                                value={rangeEnd}
                                onChange={(e) => setRangeEnd(e.target.value)}
                                onKeyDown={preventInvalidInput}
                                placeholder={words.length.toString()}
                                className="w-20 px-1 py-1 text-center font-bold bg-white dark:bg-gray-600 rounded-lg text-gray-800 dark:text-gray-100 outline-none border-2 border-transparent focus:border-indigo-400 placeholder-gray-300 dark:placeholder-gray-500"
                            />
                        </div>
                        <button 
                            onClick={handleApplyFilter} 
                            className="p-2 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-colors font-bold border-b-4 border-indigo-700 active:border-b-0 active:translate-y-1"
                        >
                            <Filter size={16} strokeWidth={3} />
                        </button>
                    </div>
    
                    {/* Shuffle Button */}
                    <button 
                        onClick={handleShuffle} 
                        disabled={!hasSearched || displayedWords.length === 0}
                        className="p-2.5 bg-white text-gray-600 dark:bg-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors border-2 border-gray-200 dark:border-gray-600 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                        title="シャッフル"
                    >
                        <Shuffle size={18} strokeWidth={3} />
                    </button>
                </div>
    
                {/* Red Sheet Tools */}
                <div className="flex items-center space-x-3">
                     {/* 1. Toggle Text Color */}
                     <button 
                        onClick={() => setIsRedText(!isRedText)}
                        className={`px-3 py-2 rounded-xl text-sm font-bold border-2 flex items-center space-x-2 transition-all ${isRedText ? 'bg-red-50 border-red-300 text-red-500 dark:bg-red-900/40 dark:border-red-800 dark:text-red-300' : 'bg-white border-gray-200 text-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 hover:bg-gray-50'}`}
                     >
                        <Type size={16} className={isRedText ? 'fill-current' : ''} strokeWidth={2.5} />
                        <span>赤文字</span>
                     </button>
                     
                     {/* 2. Toggle Sheet Overlay */}
                     <button 
                        onClick={handleToggleSheet}
                        className={`px-3 py-2 rounded-xl text-sm font-bold border-b-4 active:border-b-0 active:translate-y-1 flex items-center space-x-2 transition-all ${isSheetOn ? 'bg-red-500 text-white border-red-700' : 'bg-white border-gray-200 text-gray-500 border-b-2 active:border-b-2 active:translate-y-0 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300'}`}
                     >
                        {isSheetOn ? <EyeOff size={16} strokeWidth={2.5} /> : <Eye size={16} strokeWidth={2.5} />}
                        <span>赤シート</span>
                     </button>
                </div>
            </div>

            {/* Pagination Controls */}
            {hasSearched && displayedWords.length > 0 && (
                <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-2 rounded-2xl border-2 border-gray-200 dark:border-gray-700">
                    <button 
                        onClick={handlePrevPage} 
                        disabled={currentPage === 1}
                        className="flex items-center space-x-1 px-4 py-2 rounded-xl font-bold text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 disabled:opacity-30 transition-all"
                    >
                        <ChevronLeft size={18} strokeWidth={3} />
                        <span className="hidden sm:inline">PREV</span>
                    </button>
                    
                    <span className="font-black text-gray-700 dark:text-white text-sm">
                        {currentPage} / {totalPages} PAGE
                    </span>

                    <button 
                        onClick={handleNextPage} 
                        disabled={currentPage === totalPages}
                        className="flex items-center space-x-1 px-4 py-2 rounded-xl font-bold text-indigo-500 hover:bg-white dark:hover:bg-gray-700 disabled:opacity-30 transition-all"
                    >
                        <span className="hidden sm:inline">NEXT</span>
                        <ChevronRight size={18} strokeWidth={3} />
                    </button>
                </div>
            )}
    
            {/* Word List - Bubble Style */}
            <div className="grid grid-cols-1 gap-3">
                 {!hasSearched ? (
                     <div className="p-12 text-center text-gray-400 dark:text-gray-500 font-bold bg-white dark:bg-gray-800 rounded-3xl border-2 border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center gap-4 animate-fade-in">
                         <div className="bg-indigo-100 dark:bg-indigo-900/50 p-4 rounded-full text-indigo-500">
                             <Search size={48} strokeWidth={2} />
                         </div>
                         <div className="space-y-1">
                            <p className="text-xl text-gray-600 dark:text-gray-300">単語番号を指定してね♪</p>
                            <p className="text-sm font-normal opacity-70">上のボックスに番号を入れてボタンを押してスタート！</p>
                         </div>
                     </div>
                 ) : currentWords.length === 0 ? (
                     <div className="p-12 text-center text-gray-400 dark:text-gray-500 font-bold bg-white dark:bg-gray-800 rounded-3xl border-2 border-dashed border-gray-300 dark:border-gray-700">
                         見つかりませんでした！範囲を変えてみてね。
                     </div>
                 ) : (
                    currentWords.map((word) => {
                        const isHidden = isSheetOn && !revealedIds.has(word.id);
                        return (
                            <div key={word.id} className="bg-white dark:bg-gray-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between border-2 border-gray-100 dark:border-gray-700 shadow-sm hover:border-indigo-200 dark:hover:border-indigo-900 transition-colors group relative overflow-hidden animate-fade-in-up">
                                {/* ID Badge */}
                                <div className="absolute top-0 left-0 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-br-lg text-[10px] font-black text-gray-500 dark:text-gray-400">
                                    {word.id}
                                </div>

                                {/* Left Side (English) */}
                                <div className="flex items-center space-x-4 pt-4 sm:pt-0 pl-2 sm:pl-8 flex-1 min-w-0">
                                    <h3 className="text-xl font-black text-gray-800 dark:text-white truncate">{word.english}</h3>
                                </div>
    
                                {/* Right Side (Japanese) - Target for Red Sheet */}
                                <div className="mt-2 sm:mt-0 flex-1 text-right sm:text-left font-bold relative sm:pl-10">
                                    {/* Text Layer */}
                                    <span className={`text-lg transition-colors duration-300 ${isRedText ? 'text-red-500/90 dark:text-red-400' : 'text-gray-600 dark:text-gray-300'}`}>
                                        {word.japanese}
                                    </span>
                                    
                                    {/* Red Sheet Overlay Layer */}
                                    <div 
                                        onClick={() => toggleReveal(word.id)}
                                        className={`absolute inset-0 -m-2 p-2 rounded-xl cursor-pointer select-none flex items-center justify-center transition-all duration-300 ${isHidden ? 'opacity-100 pointer-events-auto transform scale-100' : 'opacity-0 pointer-events-none transform scale-95'}`}
                                        style={{ backgroundColor: '#ef4444' }}
                                    >
                                        <div className="w-full h-full border-2 border-white/30 border-dashed rounded-lg flex items-center justify-center">
                                            <span className="text-white font-black text-xs uppercase tracking-widest">HIDDEN</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                 )}
            </div>

            {/* Bottom Pagination Controls */}
            {hasSearched && displayedWords.length > 0 && (
                <div className="flex justify-center pt-4 pb-8">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={handlePrevPage} 
                            disabled={currentPage === 1}
                            className="w-12 h-12 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 shadow-sm disabled:opacity-30 disabled:shadow-none transition-all hover:-translate-y-0.5"
                        >
                            <ChevronLeft size={24} strokeWidth={3} className="text-gray-500 dark:text-gray-300" />
                        </button>
                        
                        <span className="font-black text-gray-400 text-sm">
                            {currentPage} / {totalPages}
                        </span>

                        <button 
                            onClick={handleNextPage} 
                            disabled={currentPage === totalPages}
                            className="w-12 h-12 flex items-center justify-center rounded-full bg-indigo-500 text-white border-2 border-indigo-600 shadow-pop disabled:opacity-30 disabled:shadow-none disabled:bg-gray-300 disabled:border-gray-400 transition-all hover:-translate-y-0.5"
                        >
                            <ChevronRight size={24} strokeWidth={3} />
                        </button>
                    </div>
                </div>
            )}
        </div>
      );
    };
    
    export default WordList;