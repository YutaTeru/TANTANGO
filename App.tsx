
import React, { useState, useEffect, useTransition } from 'react';
import { AppMode, Word } from './types';
import { DATASET_OPTIONS, DATASETS, DatasetKey } from './constants';
import FlashcardMode from './components/FlashcardMode';
import WordList from './components/WordList';
import QuizMode from './components/QuizMode';
import GridMode from './components/GridMode';
import Home from './components/Home';
import { Layers, List as ListIcon, LayoutGrid, Sun, Moon, Check, ChevronDown } from 'lucide-react';
import { getFavorites, addFavorite, removeFavorite } from './services/db';

const App: React.FC = () => {
  console.log("VocabMaster: App Rendering");
  const [mode, setMode] = useState<AppMode>(AppMode.HOME);
  // Navigation active state (optimistic UI)
  const [activeTab, setActiveTab] = useState<AppMode>(AppMode.HOME);
  
  // Dark Mode State - Default to light for readability
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Dataset State - Default to 'kinhure'
  const [datasetKey, setDatasetKey] = useState<DatasetKey>('kinhure');

  // Mode Menu State
  const [isModeMenuOpen, setIsModeMenuOpen] = useState(false);

  // Derived state for dictionary words
  const dictionaryWords = DATASETS[datasetKey].words;

  // The active session words (for Flashcard/Quiz)
  const [activeDeck, setActiveDeck] = useState<Word[]>([]);

  // Review Deck Management (Words)
  const [checkedIds, setCheckedIds] = useState<Set<number>>(new Set());
  const [reviewDeckName, setReviewDeckName] = useState("復習デッキ");

  // Load favorites when dataset changes
  useEffect(() => {
    console.log(`VocabMaster: useEffect datasetKey triggered for [${datasetKey}]`);
    const loadFavs = async () => {
      try {
        console.log(`VocabMaster: Calling getFavorites for ${datasetKey}`);
        const favIds = await getFavorites(datasetKey);
        console.log(`VocabMaster: getFavorites returned ${favIds.length} items`);
        setCheckedIds(new Set(favIds));
      } catch (e) {
        console.error("VocabMaster: Failed to load favorites", e);
      }
    };
    loadFavs();
    console.log("VocabMaster: Setting active deck and reset review deck name");
    setActiveDeck(dictionaryWords);
    setReviewDeckName("復習デッキ");
  }, [datasetKey, dictionaryWords]);

  // Toggle Dark Mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Sync activeTab with mode
  useEffect(() => {
    setActiveTab(mode);
  }, [mode]);

  const handleStartReview = (targetMode: 'flashcards' | 'quiz') => {
    const selectedWords = dictionaryWords.filter(w => checkedIds.has(w.id));
    if (selectedWords.length > 0) {
      setActiveDeck(selectedWords);
      const nextMode = targetMode === 'flashcards' ? AppMode.FLASHCARDS : AppMode.QUIZ;
      setMode(nextMode);
    }
  };

  const handleStartQuizFromGrid = (selectedWords: Word[]) => {
    setActiveDeck(selectedWords);
    setMode(AppMode.QUIZ);
  };

  const handleResetQuizMode = () => {
    setMode(AppMode.HOME);
  };

  const handleNavClick = (targetMode: AppMode) => {
    if (targetMode === activeTab && mode === targetMode) return;
    setActiveTab(targetMode);
    setMode(targetMode);
    setIsModeMenuOpen(false); // Close menu after selection
  };

  const handleToggleCheck = async (id: number) => {
    const newChecks = new Set(checkedIds);
    if (newChecks.has(id)) {
      newChecks.delete(id);
      await removeFavorite(datasetKey, id);
    } else {
      newChecks.add(id);
      await addFavorite(datasetKey, id);
    }
    setCheckedIds(newChecks);
  };

  const getActiveModeIcon = () => {
      switch (activeTab) {
          case AppMode.FLASHCARDS: return <Layers size={20} />;
          case AppMode.GRID: return <LayoutGrid size={20} />;
          case AppMode.LIST: return <ListIcon size={20} />;
          default: return <Layers size={20} />;
      }
  };

  const modes = [
      { mode: AppMode.FLASHCARDS, label: 'カード', icon: <Layers size={18} /> },
      { mode: AppMode.GRID, label: 'グリッド', icon: <LayoutGrid size={18} /> },
      { mode: AppMode.LIST, label: 'リスト', icon: <ListIcon size={18} /> },
  ];

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'text-slate-900 bg-transparent'}`}>
      
      {/* Header - Pop Style */}
      <header className="sticky top-0 z-50 pt-4 px-4 pb-2">
        <div className={`max-w-5xl mx-auto rounded-3xl shadow-pop border-2 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white/95 border-teal-300'} px-4 h-16 flex items-center justify-between`}>
          <div className="flex items-center gap-3 overflow-hidden">
            <div 
              className="flex items-center space-x-2 cursor-pointer group flex-shrink-0"
              onClick={() => {
                  setActiveTab(AppMode.HOME);
                  setMode(AppMode.HOME);
              }}
            >
                <div className="bg-amber-300 w-10 h-10 rounded-full flex items-center justify-center text-teal-950 font-black text-xl border-2 border-teal-700 shadow-[2px_2px_0px_0px_rgba(15,118,110,0.75)] group-hover:translate-y-0.5 group-hover:shadow-none transition-all">V</div>
                <h1 className={`font-black text-xl tracking-tight hidden lg:block ${isDarkMode ? 'text-white' : 'text-teal-950'}`}>Word Master</h1>
            </div>

            {/* Dataset Switcher (Tabs) - Explicitly visible */}
            <div className="hidden">
              <button
                onClick={() => setDatasetKey('kinhure')}
                className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                  datasetKey === 'kinhure'
                    ? 'bg-yellow-400 text-gray-900 shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                金フレ
              </button>
              <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 mx-1"></div>
              <button
                onClick={() => setDatasetKey('leap')}
                className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                  datasetKey === 'leap'
                    ? 'bg-sky-400 text-white shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                Leap
              </button>
              <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 mx-1"></div>
              <button
                onClick={() => setDatasetKey('exjun1')}
                className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                  datasetKey === 'exjun1'
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                EX(準１)
              </button>
            </div>

            <label className={`flex items-center gap-2 p-1 rounded-xl border-2 ${isDarkMode ? 'bg-gray-900 border-gray-600' : 'bg-teal-50 border-teal-200'}`}>
              <span className="hidden sm:inline px-2 text-xs font-black text-teal-700 dark:text-gray-300 whitespace-nowrap">
                単語帳
              </span>
              <select
                value={datasetKey}
                onChange={(event) => setDatasetKey(event.target.value as DatasetKey)}
                className={`max-w-[150px] sm:max-w-[240px] rounded-lg px-3 py-1.5 text-xs sm:text-sm font-bold outline-none ${
                  isDarkMode
                    ? 'bg-gray-800 text-gray-100'
                    : 'bg-white text-slate-800'
                }`}
              >
                {DATASET_OPTIONS.map((key) => (
                  <option key={key} value={key}>
                    {DATASETS[key].label} ({DATASETS[key].words.length})
                  </option>
                ))}
              </select>
            </label>
          </div>
          
          <div className="flex items-center space-x-2 md:space-x-3 flex-shrink-0">
            {/* Mode Selector Dropdown */}
            <div className="relative">
                <button
                    onClick={() => setIsModeMenuOpen(!isModeMenuOpen)}
                    className={`flex items-center justify-center space-x-1 w-12 h-10 sm:w-auto sm:px-3 sm:h-10 rounded-xl border-2 transition-all active:translate-y-0.5 active:shadow-none ${
                        isModeMenuOpen 
                        ? 'border-teal-500 ring-2 ring-teal-500/20'
                        : isDarkMode
                            ? 'bg-gray-900 border-gray-600 text-gray-200 hover:border-gray-500'
                            : 'bg-teal-50 border-teal-200 text-teal-800 hover:border-teal-400'
                    }`}
                >
                    {getActiveModeIcon()}
                    <ChevronDown size={14} className={`transition-transform hidden sm:block ${isModeMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isModeMenuOpen && (
                    <>
                        <div 
                            className="fixed inset-0 z-40" 
                            onClick={() => setIsModeMenuOpen(false)}
                        />
                        <div className={`absolute top-full right-0 mt-2 w-40 rounded-2xl shadow-xl border-2 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100 ${
                            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-teal-300'
                        }`}>
                            {modes.map((m) => (
                                <button
                                    key={m.mode}
                                    onClick={() => handleNavClick(m.mode)}
                                    className={`w-full text-left px-4 py-3 text-sm font-bold transition-all border-b last:border-b-0 flex items-center gap-3 ${
                                        isDarkMode ? 'border-gray-700' : 'border-gray-100'
                                    } ${
                                        activeTab === m.mode
                                            ? 'bg-teal-600 text-white'
                                            : isDarkMode
                                                ? 'text-gray-300 hover:bg-gray-700'
                                                : 'text-slate-700 hover:bg-teal-50'
                                    }`}
                                >
                                    {m.icon}
                                    <span>{m.label}</span>
                                    {activeTab === m.mode && <Check size={14} className="ml-auto" />}
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </div>

            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-full border-2 transition-all active:translate-y-0.5 active:shadow-none shadow-[2px_2px_0px_0px_rgba(15,118,110,0.25)] ${isDarkMode ? 'bg-indigo-900 border-indigo-700 text-yellow-300' : 'bg-amber-100 border-amber-300 text-teal-700'}`}
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun size={20} strokeWidth={3} /> : <Moon size={20} strokeWidth={3} />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-5xl mx-auto p-4 sm:p-6 transition-opacity duration-200">
        
        {mode === AppMode.HOME && (
          <Home 
            reviewDeckName={reviewDeckName}
            setReviewDeckName={setReviewDeckName}
            checkedCount={checkedIds.size}
            onStartReview={handleStartReview}
            onGoToGrid={() => handleNavClick(AppMode.GRID)}
          />
        )}

        {mode === AppMode.FLASHCARDS && (
          <div className="animate-fade-in-up">
            <FlashcardMode 
                allWords={dictionaryWords}
                initialDeck={activeDeck}
                key={`${datasetKey}-${activeDeck.length}`} 
            />
          </div>
        )}

        {mode === AppMode.GRID && (
          <div className="animate-fade-in">
            <GridMode 
                words={dictionaryWords} 
                onStartQuiz={handleStartQuizFromGrid} 
                checkedIds={checkedIds}
                onToggleCheck={handleToggleCheck}
                key={`grid-${datasetKey}`} 
            />
          </div>
        )}

        {mode === AppMode.LIST && (
           <div className="animate-fade-in">
             <WordList words={dictionaryWords} />
           </div>
        )}

        {mode === AppMode.QUIZ && (
           <div className="animate-fade-in">
             <QuizMode 
                words={activeDeck}
                allWords={dictionaryWords}
                onExit={handleResetQuizMode} 
                key={`${datasetKey}-${activeDeck.length}`} 
             />
           </div>
        )}
      </main>
    </div>
  );
};

export default App;
