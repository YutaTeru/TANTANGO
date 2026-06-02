import React, { useState, useEffect } from 'react';
import { Word } from '../types';
import { Shuffle, Filter, Check, RotateCw, GraduationCap, Type, Play, X, Pause, ChevronLeft, ChevronRight, Search, Copy, ClipboardCheck } from 'lucide-react';

interface GridModeProps {
    words: Word[];
    onStartQuiz: (words: Word[]) => void;
    checkedIds: Set<number>;
    onToggleCheck: (id: number) => void;
}

const ITEMS_PER_PAGE = 50;

const GridMode: React.FC<GridModeProps> = ({ words, onStartQuiz, checkedIds, onToggleCheck }) => {
  const [rangeStart, setRangeStart] = useState<string>('');
  const [rangeEnd, setRangeEnd] = useState<string>('');
  const [displayWords, setDisplayWords] = useState<Word[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  const [fontSizeIndex, setFontSizeIndex] = useState<number>(2); 

  // Auto Mode State
  const [isAutoMode, setIsAutoMode] = useState(false);
  const [autoIndex, setAutoIndex] = useState(0);
  const [autoInterval, setAutoInterval] = useState(3000); // 3000ms
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [copyError, setCopyError] = useState('');

  // Clear search state when dataset changes
  useEffect(() => {
    setDisplayWords([]);
    setHasSearched(false);
    setRangeStart('');
    setRangeEnd('');
    setCurrentPage(1);
  }, [words]);

  useEffect(() => {
    let interval: any;
    if (isAutoMode && isAutoPlaying && displayWords.length > 0) {
      interval = setInterval(() => {
        setAutoIndex((prev) => (prev + 1) % displayWords.length);
      }, autoInterval);
    }
    return () => clearInterval(interval);
  }, [isAutoMode, isAutoPlaying, autoInterval, displayWords.length]);

  const handleApplyRange = () => {
    // If inputs are empty, use 1 and max length
    const start = rangeStart === '' ? 1 : parseInt(rangeStart, 10);
    const end = rangeEnd === '' ? words.length : parseInt(rangeEnd, 10);
    
    // Safety
    const safeStart = isNaN(start) ? 1 : start;
    const safeEnd = isNaN(end) ? words.length : end;

    const filtered = words.filter(w => w.id >= safeStart && w.id <= safeEnd);
    setDisplayWords(filtered);
    setHasSearched(true);
    setCurrentPage(1); // Reset page on filter
    if (isAutoMode) {
        setAutoIndex(0);
    }
  };

  const handleShuffle = () => {
    if (displayWords.length === 0) return;
    const shuffled = [...displayWords].sort(() => Math.random() - 0.5);
    setDisplayWords(shuffled);
    setCurrentPage(1); // Reset page on shuffle
    if (isAutoMode) setAutoIndex(0);
  };

  const handleStartQuiz = () => {
    const selectedWords = words.filter(w => checkedIds.has(w.id));
    if (selectedWords.length === 0) {
        alert("クイズを始めるには、少なくとも1つの単語を選択してください。");
        return;
    }
    onStartQuiz(selectedWords);
  };

  const handleStartAutoMode = () => {
      if (displayWords.length === 0) {
          alert("この範囲に再生する単語がありません。");
          return;
      }
      setAutoIndex(0);
      setIsAutoPlaying(true);
      setIsAutoMode(true);
  };
  
  const preventInvalidInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (["e", "E", "+", "-"].includes(e.key)) {
      e.preventDefault();
    }
  };

  const fontSizeClasses = ['text-lg', 'text-xl', 'text-2xl', 'text-3xl', 'text-4xl'];
  const currentFontSizeClass = fontSizeClasses[fontSizeIndex];

  // Pagination Logic
  const totalPages = Math.ceil(displayWords.length / ITEMS_PER_PAGE);
  const currentWords = displayWords.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePrevPage = () => setCurrentPage(p => Math.max(1, p - 1));
  const handleNextPage = () => setCurrentPage(p => Math.min(totalPages, p + 1));

  // --- Auto Mode Overlay Render ---
  if (isAutoMode && displayWords.length > 0) {
      const currentWord = displayWords[autoIndex];
      return (
          <div className="fixed inset-0 z-[100] bg-indigo-900/95 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-8 animate-fade-in">
              {/* Header Controls */}
              <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10">
                  <div className="flex items-center space-x-4">
                      <div className="bg-white/10 rounded-full p-1 flex items-center border border-white/20">
                          {[1, 2, 3, 4, 5].map((sec) => (
                            <button
                                key={sec}
                                onClick={() => setAutoInterval(sec * 1000)}
                                className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-bold transition-all ${autoInterval === sec * 1000 ? 'bg-yellow-400 text-gray-900' : 'text-white hover:bg-white/20'}`}
                            >
                                {sec}
                            </button>
                          ))}
                          <span className="text-xs text-white ml-2 mr-2 font-bold">SEC</span>
                      </div>
                      <div className="text-white font-black text-xl bg-black/20 px-4 py-2 rounded-full">
                          {autoIndex + 1} / {displayWords.length}
                      </div>
                  </div>
                  <button 
                      onClick={() => setIsAutoMode(false)}
                      className="bg-red-500 hover:bg-red-400 text-white p-3 rounded-full transition-colors border-2 border-red-300 shadow-pop"
                  >
                      <X size={24} strokeWidth={3} />
                  </button>
              </div>

              {/* Main Card Area */}
              <div className="w-full max-w-3xl h-full max-h-[60vh] flex flex-col relative perspective-1000">
                  <AutoModeCard word={currentWord} />
              </div>

              {/* Bottom Controls */}
              <div className="absolute bottom-10 flex items-center space-x-6">
                  <button 
                      onClick={() => {
                          setIsAutoPlaying(false);
                          setAutoIndex(prev => (prev - 1 + displayWords.length) % displayWords.length);
                      }}
                      className="p-4 rounded-full bg-white text-indigo-900 hover:bg-indigo-50 border-4 border-indigo-900 shadow-pop"
                  >
                      <ChevronLeft size={32} strokeWidth={3} />
                  </button>

                  <button 
                      onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                      className="p-6 rounded-full bg-yellow-400 text-gray-900 border-4 border-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none active:scale-95 transition-all"
                  >
                      {isAutoPlaying ? <Pause size={40} fill="currentColor" strokeWidth={0} /> : <Play size={40} fill="currentColor" strokeWidth={0} className="ml-1" />}
                  </button>

                  <button 
                      onClick={() => {
                          setIsAutoPlaying(false);
                          setAutoIndex(prev => (prev + 1) % displayWords.length);
                      }}
                      className="p-4 rounded-full bg-white text-indigo-900 hover:bg-indigo-50 border-4 border-indigo-900 shadow-pop"
                  >
                      <ChevronRight size={32} strokeWidth={3} />
                  </button>
              </div>
          </div>
      );
  }

  // --- Regular Grid Mode Render ---
  const selectedWordsList = words.filter(w => checkedIds.has(w.id));
  const formattedWordsText = selectedWordsList.map(w => `${w.english}\t${w.japanese}`).join('\n');

  const handleCopyText = async () => {
    setCopyError('');

    if (!navigator.clipboard?.writeText) {
      setCopyError('この画面では自動コピーが使えません。上の文字を選択して手動でコピーしてください。');
      return;
    }

    try {
      await navigator.clipboard.writeText(formattedWordsText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.warn('Clipboard copy failed:', error);
      setCopyError('クリップボードへの自動コピーが許可されませんでした。上の文字を選択して手動でコピーしてください。');
    }
  };

  return (
    <div className="flex flex-col space-y-6">
      {/* Copy Modal */}
      {isCopyModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-gray-800 w-full max-w-2xl rounded-[2.5rem] border-4 border-gray-900 dark:border-gray-700 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
                <div className="p-6 border-b-4 border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900">
                    <div className="flex items-center gap-3">
                        <div className="bg-sky-500 p-2 rounded-xl text-white">
                            <Copy size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-gray-800 dark:text-white">選択した単語リスト</h2>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{checkedIds.size} WORDS SELECTED</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => setIsCopyModalOpen(false)}
                        className="bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-300 p-2 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                        <X size={24} strokeWidth={3} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 font-mono text-sm leading-relaxed dark:text-gray-300">
                    <pre className="whitespace-pre-wrap bg-gray-50 dark:bg-gray-900/50 p-4 rounded-2xl border-2 border-gray-100 dark:border-gray-700">
                        {formattedWordsText}
                    </pre>
                    {copyError && (
                        <p className="mt-3 text-sm font-bold text-red-600 dark:text-red-300 bg-red-50 dark:bg-red-900/40 border-2 border-red-300 dark:border-red-800 rounded-xl px-3 py-2">
                            {copyError}
                        </p>
                    )}
                </div>

                <div className="p-6 border-t-4 border-gray-100 dark:border-gray-700 flex gap-4">
                    <button 
                        onClick={handleCopyText}
                        className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-white transition-all border-b-4 active:border-b-0 active:translate-y-1 ${
                            isCopied ? 'bg-green-500 border-green-700' : 'bg-indigo-500 border-indigo-700 hover:bg-indigo-600'
                        }`}
                    >
                        {isCopied ? (
                            <>
                                <ClipboardCheck size={24} />
                                <span>COPIED!</span>
                            </>
                        ) : (
                            <>
                                <Copy size={24} />
                                <span>CLIPBOARDにコピー</span>
                            </>
                        )}
                    </button>
                    <button 
                        onClick={() => setIsCopyModalOpen(false)}
                        className="px-8 py-4 rounded-2xl font-black text-gray-500 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                    >
                        閉じる
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Control Panel */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-pop border-4 border-gray-900 dark:border-gray-700 transition-colors">
        <div className="flex flex-col md:flex-row md:items-end gap-4 justify-between">
          
          {/* Range Inputs */}
          <div className="flex items-center gap-2 flex-wrap bg-gray-50 dark:bg-gray-900 p-2 rounded-2xl border-2 border-gray-200 dark:border-gray-700">
             <div className="flex flex-col">
               <label className="text-[10px] font-black text-gray-400 uppercase mb-1 pl-2">START</label>
               <input 
                  type="number" 
                  min="1"
                  value={rangeStart} 
                  onChange={(e) => setRangeStart(e.target.value)}
                  onKeyDown={preventInvalidInput}
                  placeholder="1"
                  className="bg-white dark:bg-gray-800 dark:text-white rounded-xl px-3 py-2 w-20 text-center font-bold outline-none border-2 border-transparent focus:border-indigo-400 placeholder-gray-300 dark:placeholder-gray-600"
               />
             </div>
             <div className="flex items-center justify-center pt-5 text-gray-400 font-black">
               <span>~</span>
             </div>
             <div className="flex flex-col">
               <label className="text-[10px] font-black text-gray-400 uppercase mb-1 pl-2">END</label>
               <input 
                  type="number" 
                  min="1"
                  value={rangeEnd} 
                  onChange={(e) => setRangeEnd(e.target.value)}
                  onKeyDown={preventInvalidInput}
                  placeholder={words.length.toString()}
                  className="bg-white dark:bg-gray-800 dark:text-white rounded-xl px-3 py-2 w-20 text-center font-bold outline-none border-2 border-transparent focus:border-indigo-400 placeholder-gray-300 dark:placeholder-gray-600"
               />
             </div>
             <div className="flex flex-col justify-end ml-2">
                <button 
                  onClick={handleApplyRange}
                  className="bg-indigo-500 text-white px-4 py-2 rounded-xl font-bold hover:bg-indigo-600 transition flex items-center gap-2 h-[42px] border-b-4 border-indigo-700 active:border-b-0 active:translate-y-1"
                >
                  <Filter size={16} strokeWidth={3} />
                  <span>GO</span>
                </button>
             </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-wrap">
             <button 
                onClick={handleShuffle}
                disabled={!hasSearched || displayWords.length === 0}
                className="bg-orange-400 text-white px-4 py-2 rounded-xl font-bold hover:bg-orange-500 transition flex items-center gap-2 h-[42px] border-b-4 border-orange-600 active:border-b-0 active:translate-y-1 disabled:opacity-50 disabled:border-b-2 disabled:translate-y-0.5"
              >
                <Shuffle size={18} strokeWidth={3} />
              </button>
             
             {/* Auto Play Button */}
             <button 
                onClick={handleStartAutoMode}
                disabled={!hasSearched || displayWords.length === 0}
                className="bg-green-500 text-white px-4 py-2 rounded-xl font-bold hover:bg-green-600 transition flex items-center gap-2 h-[42px] border-b-4 border-green-700 active:border-b-0 active:translate-y-1 disabled:opacity-50 disabled:border-b-2 disabled:translate-y-0.5"
              >
                <Play size={18} fill="currentColor" />
                <span>PLAY</span>
              </button>

             <button 
                onClick={handleStartQuiz}
                disabled={checkedIds.size === 0}
                className="bg-pink-500 text-white px-4 py-2 rounded-xl font-bold hover:bg-pink-600 transition flex items-center gap-2 h-[42px] border-b-4 border-pink-700 active:border-b-0 active:translate-y-1 disabled:opacity-50 disabled:border-b-2 disabled:translate-y-0.5"
              >
                <GraduationCap size={18} strokeWidth={2.5} />
                <span>QUIZ ({checkedIds.size})</span>
              </button>
              
             <button 
                onClick={() => {
                   setIsCopyModalOpen(true);
                   setIsCopied(false);
                   setCopyError('');
                }}
                disabled={checkedIds.size === 0}
                className="bg-sky-500 text-white px-4 py-2 rounded-xl font-bold hover:bg-sky-600 transition flex items-center gap-2 h-[42px] border-b-4 border-sky-700 active:border-b-0 active:translate-y-1 disabled:opacity-50 disabled:border-b-2 disabled:translate-y-0.5"
              >
                <Copy size={18} strokeWidth={2.5} />
                <span>COPY</span>
              </button>

             {/* Text Size Slider */}
             <div className="flex items-center gap-2 px-3 border-l-2 border-gray-200 dark:border-gray-600 ml-2 h-[42px]">
                <Type size={18} className="text-gray-400" />
                <input 
                  type="range" 
                  min="0" 
                  max="4" 
                  step="1" 
                  value={fontSizeIndex}
                  onChange={(e) => setFontSizeIndex(parseInt(e.target.value))}
                  className="w-20 h-2 bg-gray-200 rounded-full appearance-none cursor-pointer dark:bg-gray-700 accent-indigo-500"
                />
             </div>
          </div>
        </div>
        
        <div className="mt-4 text-sm font-bold text-gray-500 dark:text-gray-400 flex justify-between items-center bg-gray-50 dark:bg-gray-900 px-4 py-2 rounded-lg">
            <span>SHOWING: {displayWords.length}</span>
            <span className="text-indigo-500 dark:text-indigo-400">SELECTED: {checkedIds.size}</span>
        </div>
      </div>

      {/* Pagination Controls Top */}
      {hasSearched && displayWords.length > 0 && (
          <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-2 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <button 
                  onClick={handlePrevPage} 
                  disabled={currentPage === 1}
                  className="flex items-center space-x-1 px-4 py-2 rounded-lg font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 transition-all"
              >
                  <ChevronLeft size={18} strokeWidth={3} />
                  <span>PREV 50</span>
              </button>
              
              <span className="font-black text-gray-700 dark:text-white bg-gray-100 dark:bg-gray-700 px-4 py-1 rounded-full text-sm">
                  {currentPage} / {totalPages} PAGE
              </span>

              <button 
                  onClick={handleNextPage} 
                  disabled={currentPage === totalPages}
                  className="flex items-center space-x-1 px-4 py-2 rounded-lg font-bold text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 disabled:opacity-30 transition-all"
              >
                  <span>NEXT 50</span>
                  <ChevronRight size={18} strokeWidth={3} />
              </button>
          </div>
      )}

      {/* Grid Area */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {!hasSearched ? (
             <div className="col-span-full p-12 text-center text-gray-400 dark:text-gray-500 font-bold bg-white dark:bg-gray-800 rounded-3xl border-2 border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center gap-4 animate-fade-in">
                 <div className="bg-indigo-100 dark:bg-indigo-900/50 p-4 rounded-full text-indigo-500">
                     <Search size={48} strokeWidth={2} />
                 </div>
                 <div className="space-y-1">
                    <p className="text-xl text-gray-600 dark:text-gray-300">単語番号を指定してね♪</p>
                    <p className="text-sm font-normal opacity-70">上のボックスに番号を入れてボタンを押してスタート！</p>
                 </div>
             </div>
        ) : currentWords.length === 0 ? (
            <div className="col-span-full py-12 text-center text-gray-400 dark:text-gray-500 font-bold">
                NO WORDS FOUND HERE!
            </div>
        ) : (
            currentWords.map(word => (
              <GridCard 
                key={word.id} 
                word={word} 
                checked={checkedIds.has(word.id)} 
                onToggleCheck={() => onToggleCheck(word.id)} 
                fontSizeClass={currentFontSizeClass}
              />
            ))
        )}
      </div>

      {/* Pagination Controls Bottom --- */}
      {hasSearched && displayWords.length > 0 && (
          <div className="flex items-center justify-center pb-8">
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

// --- Sub Components ---

const AutoModeCard: React.FC<{ word: Word }> = ({ word }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    useEffect(() => {
        setIsFlipped(false);
    }, [word]);

    return (
        <div 
            className="relative w-full h-full cursor-pointer group"
            onClick={() => setIsFlipped(!isFlipped)}
        >
             {/* Removed duration-500 to flip instantly */}
             <div className={`relative w-full h-full transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                {/* Front */}
                <div className="absolute w-full h-full backface-hidden bg-white rounded-[3rem] border-8 border-gray-900 flex flex-col items-center justify-center p-8 shadow-2xl">
                    <div className="bg-gray-900 text-white font-mono px-4 py-1 rounded-full mb-8 text-xl font-bold">#{word.id}</div>
                    <h2 className="text-6xl md:text-8xl font-black text-gray-900 text-center tracking-tight">{word.english}</h2>
                </div>

                {/* Back */}
                <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-white rounded-[3rem] border-8 border-gray-900 flex flex-col items-center justify-center p-8 shadow-2xl">
                    <div className="bg-yellow-400 text-gray-900 font-black px-4 py-1 rounded-full mb-8 text-xl uppercase tracking-widest">Meaning</div>
                    <h2 className="text-5xl md:text-6xl font-black text-gray-900 text-center leading-normal">{word.japanese}</h2>
                </div>
             </div>
        </div>
    )
}

interface GridCardProps {
  word: Word;
  checked: boolean;
  onToggleCheck: () => void;
  fontSizeClass: string;
}

const GridCard: React.FC<GridCardProps> = ({ word, checked, onToggleCheck, fontSizeClass }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className="relative h-48 w-full perspective-1000 cursor-pointer group" 
      onClick={() => setIsFlipped(!isFlipped)}
    >
      {/* Removed duration-500 to flip instantly */}
      <div className={`relative w-full h-full transform-style-3d ${isFlipped ? 'rotate-y-180' : 'group-hover:-translate-y-1'} transition-transform duration-0`}>
        
        {/* Front (English) */}
        <div className={`absolute w-full h-full rounded-2xl flex flex-col backface-hidden border-4 transition-colors overflow-hidden shadow-pop ${
            checked 
            ? 'bg-indigo-100 dark:bg-indigo-900 border-indigo-500' 
            : 'bg-white dark:bg-gray-800 border-gray-900 dark:border-gray-600'
        }`}>
          {/* Controls Layer */}
          <div className="absolute top-0 left-0 w-full p-2 flex justify-between z-10 pointer-events-none">
            <div 
              onClick={(e) => { e.stopPropagation(); onToggleCheck(); }}
              className={`w-6 h-6 rounded-full border-2 cursor-pointer flex items-center justify-center transition-colors pointer-events-auto shadow-sm ${
                  checked 
                  ? 'bg-indigo-500 border-indigo-600' 
                  : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-500 hover:border-indigo-400'
              }`}
            >
              {checked && <Check size={14} className="text-white" strokeWidth={4} />}
            </div>
            <span className="text-[10px] text-gray-500 dark:text-gray-400 font-black bg-gray-100 dark:bg-gray-900 px-1.5 py-0.5 rounded-md">{word.id}</span>
          </div>
          
          <div className="flex-1 w-full flex flex-col items-center justify-center p-2">
            <h3 className={`${fontSizeClass} font-black text-gray-800 dark:text-white break-words text-center leading-tight`}>{word.english}</h3>
          </div>
        </div>

        {/* Back (Japanese) */}
        <div className={`absolute w-full h-full rounded-2xl flex flex-col backface-hidden rotate-y-180 border-4 transition-colors overflow-hidden shadow-pop ${
            checked 
            ? 'bg-indigo-500 border-indigo-700' 
            : 'bg-white dark:bg-gray-800 border-gray-900 dark:border-gray-600'
        }`}>
          <div className="absolute top-0 left-0 w-full p-2 flex justify-between z-10 pointer-events-none">
             <div 
              onClick={(e) => { e.stopPropagation(); onToggleCheck(); }}
              className={`w-6 h-6 rounded-full border-2 cursor-pointer flex items-center justify-center transition-colors pointer-events-auto shadow-sm ${
                  checked 
                  ? 'bg-white border-white text-indigo-500' 
                  : 'bg-gray-200 border-gray-400 text-gray-500 hover:bg-gray-300'
              }`}
            >
              <Check size={14} strokeWidth={4} className={checked ? "" : "opacity-0"} />
            </div>
          </div>

          <div className="flex-1 w-full overflow-y-auto flex flex-col items-center justify-center p-2 scrollbar-none">
             <div className="w-full">
                <h3 className={`text-lg font-bold text-center break-words leading-snug w-full ${checked ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                    {word.japanese}
                </h3>
             </div>
          </div>
          
          <div className="absolute bottom-2 right-2 pointer-events-none">
            <RotateCw size={14} className={`opacity-70 ${checked ? 'text-indigo-200' : 'text-gray-400'}`} />
          </div>
        </div>

      </div>
    </div>
  );
};

export default GridMode;
