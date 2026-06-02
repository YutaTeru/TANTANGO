import React, { useState, useEffect, useMemo } from 'react';
import { Word, QuizState } from '../types';
import { CheckCircle, XCircle, RotateCcw, ArrowLeft } from 'lucide-react';

interface QuizModeProps {
  onExit: () => void;
  words?: Word[]; // Words to be quizzed on
  allWords: Word[]; // Full dictionary source for generating wrong answers
}

const QuizMode: React.FC<QuizModeProps> = ({ onExit, words = [], allWords = [] }) => {
  // Shuffle words for the session
  const shuffledWords = useMemo(() => {
    // If we have a very small list (e.g. 1 word), handle gracefully
    if (words.length === 0) return [];
    return [...words].sort(() => 0.5 - Math.random());
  }, [words]);

  // If words array is small, we limit the quiz length
  const quizLength = Math.min(20, words.length);

  const [gameState, setGameState] = useState<QuizState>({
    currentQuestionIndex: 0,
    score: 0,
    isFinished: false,
    history: [],
  });

  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [choices, setChoices] = useState<string[]>([]);

  const currentWord = shuffledWords[gameState.currentQuestionIndex];

  // Generate choices when question changes
  useEffect(() => {
    if (!currentWord) return;

    const generateChoices = () => {
      // Pick distractor answers from the full dictionary to ensure variety,
      // even if the quiz source list is small.
      const wrongAnswers = allWords
        .filter(w => w.id !== currentWord.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map(w => w.japanese);
      
      const allChoices = [currentWord.japanese, ...wrongAnswers];
      return allChoices.sort(() => 0.5 - Math.random());
    };

    setChoices(generateChoices());
    setSelectedAnswer(null);
  }, [currentWord, gameState.currentQuestionIndex, allWords]);

  const handleAnswer = (choice: string) => {
    if (selectedAnswer || gameState.isFinished) return; // Prevent double clicking

    setSelectedAnswer(choice);
    const isCorrect = choice === currentWord.japanese;

    // Wait a moment then go to next
    setTimeout(() => {
      // Check if this was the last question
      if (gameState.currentQuestionIndex >= quizLength - 1) {
        setGameState(prev => ({
          ...prev,
          score: isCorrect ? prev.score + 1 : prev.score,
          history: [...prev.history, isCorrect],
          isFinished: true
        }));
      } else {
        setGameState(prev => ({
          ...prev,
          score: isCorrect ? prev.score + 1 : prev.score,
          history: [...prev.history, isCorrect],
          currentQuestionIndex: prev.currentQuestionIndex + 1
        }));
      }
    }, 1200);
  };

  const handleRestart = () => {
    setGameState({
      currentQuestionIndex: 0,
      score: 0,
      isFinished: false,
      history: [],
    });
  };

  if (words.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center h-[400px]">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">単語が選択されていません</h2>
            <button 
                onClick={onExit}
                className="bg-indigo-500 border-b-4 border-indigo-700 text-white px-6 py-3 rounded-2xl font-bold active:border-b-0 active:translate-y-1"
            >
                戻る
            </button>
        </div>
      )
  }

  if (gameState.isFinished) {
    const percentage = Math.round((gameState.score / quizLength) * 100);
    let message = "Keep Going!";
    if (percentage === 100) message = "Perfect!!";
    else if (percentage >= 80) message = "Great Job!";
    else if (percentage >= 50) message = "Good Effort!";

    return (
      <div className="flex flex-col items-center justify-center p-8 max-w-md mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-pop border-4 border-gray-900 dark:border-gray-700 mt-10 transition-colors relative overflow-hidden">
        <div className="absolute top-0 w-full h-4 bg-yellow-400 border-b-2 border-gray-900"></div>
        
        <h2 className="text-4xl font-black text-gray-800 dark:text-white mb-2 mt-4">{message}</h2>
        
        <div className="relative mb-6">
            <span className="text-8xl font-black text-indigo-500 dark:text-indigo-400 drop-shadow-md">
            {percentage}%
            </span>
        </div>

        <p className="text-gray-600 dark:text-gray-300 mb-8 font-bold text-lg bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-full">
          正解数: {gameState.score} / {quizLength}
        </p>
        <div className="flex flex-col gap-3 w-full">
            <button 
                onClick={handleRestart}
                className="flex items-center justify-center space-x-2 bg-indigo-500 text-white py-4 rounded-2xl font-black border-b-4 border-indigo-700 active:border-b-0 active:translate-y-1 transition-all"
            >
                <RotateCcw size={20} strokeWidth={3} />
                <span>もう一度トライ</span>
            </button>
            <button 
                onClick={onExit}
                className="flex items-center justify-center space-x-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 py-4 rounded-2xl font-black border-b-4 border-gray-300 dark:border-gray-900 active:border-b-0 active:translate-y-1 transition-all"
            >
                <ArrowLeft size={20} strokeWidth={3} />
                <span>リストに戻る</span>
            </button>
        </div>
      </div>
    );
  }

  if (!currentWord) return <div className="dark:text-white">読み込み中...</div>;

  const progress = ((gameState.currentQuestionIndex) / quizLength) * 100;

  return (
    <div className="max-w-2xl mx-auto p-4 flex flex-col h-full">
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-5 mb-6 border-2 border-gray-900 dark:border-gray-500 overflow-hidden relative">
            <div className="absolute top-0 left-0 h-full bg-stripes opacity-20 w-full"></div>
            <div className="bg-yellow-400 h-full rounded-r-full transition-all duration-300 border-r-2 border-gray-900" style={{ width: `${progress}%` }}></div>
        </div>

        {/* Question Card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-pop border-4 border-gray-900 dark:border-gray-700 p-8 mb-6 text-center transition-colors relative">
             <div className="absolute top-[-15px] left-1/2 transform -translate-x-1/2 bg-indigo-500 text-white px-4 py-1 rounded-full border-2 border-gray-900 font-black text-sm shadow-sm">
                 QUESTION {gameState.currentQuestionIndex + 1}
             </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-800 dark:text-white mt-2">{currentWord.english}</h2>
        </div>

        {/* Choices */}
        <div className="grid grid-cols-1 gap-3">
            {choices.map((choice, idx) => {
                let btnClass = "bg-white dark:bg-gray-800 border-b-4 border-gray-200 dark:border-gray-700 hover:border-b-0 hover:translate-y-1 hover:bg-gray-50 dark:hover:bg-gray-700 border-x-2 border-t-2 border-gray-200";
                let textClass = "text-gray-700 dark:text-gray-200";
                
                if (selectedAnswer) {
                    if (choice === currentWord.japanese) {
                        btnClass = "bg-green-400 dark:bg-green-600 border-green-600 dark:border-green-800 border-4 transform translate-y-1";
                        textClass = "text-white";
                    } else if (choice === selectedAnswer) {
                        btnClass = "bg-red-400 dark:bg-red-600 border-red-600 dark:border-red-800 border-4 transform translate-y-1";
                        textClass = "text-white";
                    } else {
                        btnClass = "bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 border-2 opacity-50";
                    }
                } else {
                    // Normal state style override for pop effect
                    btnClass = "bg-white dark:bg-gray-800 border-2 border-gray-900 dark:border-gray-600 border-b-4 active:border-b-2 active:translate-y-0.5 transition-all";
                }

                return (
                    <button
                        key={idx}
                        onClick={() => handleAnswer(choice)}
                        disabled={selectedAnswer !== null}
                        className={`p-5 rounded-2xl text-lg font-bold text-left flex items-center justify-between ${btnClass} ${textClass}`}
                    >
                        <span>{choice}</span>
                        {selectedAnswer && choice === currentWord.japanese && <CheckCircle size={24} className="text-white" />}
                        {selectedAnswer && choice === selectedAnswer && choice !== currentWord.japanese && <XCircle size={24} className="text-white" />}
                    </button>
                );
            })}
        </div>
        
        <style>{`
            .bg-stripes {
                background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);
                background-size: 1rem 1rem;
            }
        `}</style>
    </div>
  );
};

export default QuizMode;