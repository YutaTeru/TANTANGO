
export interface Word {
  id: number;
  english: string;
  japanese: string;
  example?: string;
  exampleMeaning?: string;
}

export interface VocabularyItem {
  id: number;
  word: string;
  meaning: string;
  extra1?: string;
  extra2?: string;
}

export interface SimilarMeaningWord {
  id: number | null;
  word: string;
  meaning: string;
}

export interface SimilarMeaningSubGroup {
  sub_group_name: string | null;
  point?: string;
  words: SimilarMeaningWord[];
}

export interface SimilarMeaningCategory {
  category_name: string;
  description: string;
  sub_groups: SimilarMeaningSubGroup[];
}

export interface OppositeMeaningPairItem {
  theme: string;
  pair: SimilarMeaningWord[];
}

export interface SimilarSpellingWordInfo {
  id: number | null;
  word: string;
  meaning: string;
}

export interface SimilarSpellingWord {
  word_info: SimilarSpellingWordInfo;
  breakdown: string;
}

export interface SimilarSpellingConfusingPairDetail {
  id: number | null;
  word: string;
  meaning: string;
}

export interface SimilarSpellingConfusingPair {
  pair: SimilarSpellingConfusingPairDetail[];
  point: string;
}

export interface SimilarSpellingGroup {
  group_name: string;
  etymology: string | null;
  words?: SimilarSpellingWord[];
  pairs?: SimilarSpellingConfusingPair[];
}

export interface SimilarWordsData {
  similar_meanings: {
    description: string;
    categories: SimilarMeaningCategory[];
  };
  opposite_meanings: {
    description: string;
    pairs: OppositeMeaningPairItem[];
  };
  similar_spelling_or_etymology: {
    description: string;
    groups: SimilarSpellingGroup[];
  };
}

export enum AppMode {
  HOME = 'HOME',
  FLASHCARDS = 'FLASHCARDS',
  LIST = 'LIST',
  QUIZ = 'QUIZ',
  GRID = 'GRID',
}

export interface QuizState {
  currentQuestionIndex: number;
  score: number;
  isFinished: boolean;
  history: boolean[]; // true if correct, false if wrong
}

export interface GrammarPage {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

export interface MistakeLog {
  id: string;
  wordId: number;
  english: string;
  japanese: string;
  mistakeCount: number;
  lastMistakeAt: number;
  createdAt: number;
}
