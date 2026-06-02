
import { VocabularyItem } from '../types';
import { vocabularyList as target1900 } from './vocabulary';
import { similarWordsData } from './similarWords';

export const vocabularies: { [key: string]: { name: string; list: VocabularyItem[] } } = {
  target1900: {
    name: 'ターゲット1900',
    list: target1900
  }
};

export { similarWordsData };
