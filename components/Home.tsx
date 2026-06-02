
import React, { useMemo, useState } from 'react';
import { Play, GraduationCap, PlusCircle, BookOpen, Edit2, Book, FileText, Star, Heart, Briefcase, RotateCcw, PenTool } from 'lucide-react';

interface HomeProps {
  reviewDeckName: string;
  setReviewDeckName: (name: string) => void;
  checkedCount: number;
  onStartReview: (mode: 'flashcards' | 'quiz') => void;
  onGoToGrid: () => void;
}

const GREETING_MESSAGES = [
  { main: "生きててエライ！", sub: "勉強しようとアプリを開いただけで、今日の徳は積まれました。" },
  { main: "伝説の勇者、現る。", sub: "睡魔という魔王を倒して、英単語のレベル上げを始めましょう。" },
  { main: "脳内メモリを解放せよ。", sub: "無駄な情報の代わりに、最強の英単語をインストールします。" },
  { main: "正直、寝たいよね。", sub: "わかる。でも、今の10分が未来のあなたを救う（はず）。" },
  { main: "スマホ依存の正解例。", sub: "SNSを見る指を止めてここに来たあなた、完全に「勝ち組」です。" },
  { main: "筋肉は裏切るが、単語も……", sub: "いや、単語は裏切りません！たぶん。信じて突き進もう。" },
  { main: "【朗報】神、降臨。", sub: "あなたが勉強を始めると、全米が（私が）泣きます。" },
  { main: "さて、一丁やりますか。", sub: "集中力ブースト中。今のあなたなら、辞書一冊いける気がする。" },
  { main: "現実逃避へようこそ！", sub: "他の宿題から逃げてきた？OK、ここで一緒に英単語と戦おう。" },
  { main: "おかえり！天才。", sub: "おっと、才能が溢れ出ていますね。さっさと暗記しちゃいましょう。" },
  { main: "脳のアップデート開始。", sub: "バグ修正：昨日の「ど忘れ」を修正し、語彙力を最適化します。" },
  { main: "英単語の逆襲、はじまる。", sub: "覚えられすぎて困る準備はできていますか？" },
  { main: "ここは精神と時の部屋。", sub: "外の世界の1時間は、ここでの英単語100個分に相当します（諸説あり）。" },
  { main: "おっと、努力の天才か？", sub: "ログインボーナス：私の「熱い視線」を差し上げます。" },
  { main: "全俺が泣いた。", sub: "あなたが戻ってくるのを、サーバーも震えて待っていました。" },
  { main: "「忘れた」とは言わせない。", sub: "エビングハウス（忘却曲線）の鼻を明かしてやりましょう。" },
  { main: "英単語ガチャの時間です。", sub: "今日は「SSR：一生忘れない単語」が出る確率100%（願望）。" },
  { main: "さて、無双しますか。", sub: "周りの奴らがスマホで遊んでいる間に、こっそり最強になりましょう。" },
  { main: "単語は「推し」だと思え。", sub: "眺めているだけで幸せ……にはなりませんが、力にはなります。" },
  { main: "あ、意識高い人だ！", sub: "画面の反射で自分の顔を見てごらん。……うん、いい顔してる。" }
];

const Home: React.FC<HomeProps> = ({
  reviewDeckName,
  setReviewDeckName,
  checkedCount,
  onStartReview,
  onGoToGrid
}) => {
  console.log("VocabMaster: Home component rendering");

  // Use a shuffle queue stored in localStorage to ensure all messages are shown without repetition
  const greeting = useMemo(() => {
    const STORAGE_KEY = 'vocabMaster_greeting_queue';
    const totalMessages = GREETING_MESSAGES.length;
    
    let queue: number[] = [];
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        queue = JSON.parse(stored);
      }
    } catch (e) {
      console.error("Failed to parse greeting queue", e);
    }

    // If queue is empty or invalid, create a new shuffled deck
    if (!Array.isArray(queue) || queue.length === 0) {
      // Create array [0, 1, 2, ..., 19]
      queue = Array.from({ length: totalMessages }, (_, i) => i);
      
      // Fisher-Yates Shuffle
      for (let i = queue.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [queue[i], queue[j]] = [queue[j], queue[i]];
      }
    }

    // Pop the next index from the queue
    const nextIndex = queue.pop();
    
    // Save the updated queue
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
    } catch (e) {
      console.warn("Failed to save greeting queue to localStorage", e);
    }

    // Return the selected message (fallback to 0 if something went wrong)
    return GREETING_MESSAGES[nextIndex ?? 0];
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in p-2">
      {/* Welcome Section */}
      <div className="text-center py-6">
        <div className="inline-block mb-2 px-4 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-black border-2 border-yellow-300">TODAY'S MOOD</div>
        <h1 className="text-3xl md:text-4xl font-black text-gray-800 dark:text-white mb-3 animate-slide-in-bottom drop-shadow-sm">
          {greeting.main}
        </h1>
        <p className="text-indigo-500 dark:text-indigo-300 font-bold text-base md:text-lg animate-slide-in-bottom delay-100 bg-white/50 dark:bg-black/20 inline-block px-4 py-2 rounded-2xl">
          {greeting.sub}
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 justify-center items-stretch">
        
        {/* Custom Review Deck Card - Pop Style */}
        <div className="w-full md:flex-1 bg-white dark:bg-gray-800 rounded-3xl shadow-pop border-4 border-gray-900 dark:border-gray-700 p-6 flex flex-col relative overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-pop-bold group">
          <div className="absolute top-[-20px] right-[-20px] w-40 h-40 bg-indigo-100 dark:bg-indigo-900/50 rounded-full blur-2xl opacity-50 pointer-events-none"></div>
          
          <div className="z-10 flex-1">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-black tracking-wider text-white bg-indigo-500 px-3 py-1 rounded-full border-2 border-indigo-600 shadow-sm">カスタムデッキ</span>
            </div>
            
            <div className="flex items-center space-x-2 mb-4 group/edit bg-gray-50 dark:bg-gray-900 p-3 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600">
              <input 
                type="text" 
                value={reviewDeckName}
                onChange={(e) => setReviewDeckName(e.target.value)}
                className="text-xl font-bold text-gray-800 dark:text-white bg-transparent outline-none w-full placeholder-gray-400"
                placeholder="復習デッキ"
              />
              <Edit2 size={18} className="text-gray-400" />
            </div>

            <div className="flex items-baseline space-x-2 mb-6 bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-2xl border-2 border-indigo-100 dark:border-indigo-800">
              <span className="text-5xl font-black text-indigo-500 dark:text-indigo-400">{checkedCount}</span>
              <span className="text-indigo-900 dark:text-indigo-200 font-bold text-sm">単語選択中</span>
            </div>
          </div>

          <div className="z-10 mt-auto space-y-3">
            {checkedCount > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => onStartReview('flashcards')}
                  className="flex flex-col items-center justify-center space-y-1 bg-indigo-500 text-white py-3 rounded-2xl font-bold border-b-4 border-indigo-700 active:border-b-0 active:translate-y-1 transition-all"
                >
                  <Play size={24} fill="currentColor" />
                  <span className="text-sm">暗記カード</span>
                </button>
                <button 
                  onClick={() => onStartReview('quiz')}
                  className="flex flex-col items-center justify-center space-y-1 bg-pink-500 text-white py-3 rounded-2xl font-bold border-b-4 border-pink-700 active:border-b-0 active:translate-y-1 transition-all"
                >
                  <GraduationCap size={24} />
                  <span className="text-sm">クイズ</span>
                </button>
              </div>
            ) : (
              <button 
                onClick={onGoToGrid}
                className="w-full flex items-center justify-center space-x-2 bg-yellow-400 text-gray-900 py-4 rounded-2xl font-black border-b-4 border-yellow-600 active:border-b-0 active:translate-y-1 transition-all hover:bg-yellow-300"
              >
                <PlusCircle size={24} strokeWidth={3} />
                <span>単語を選ぶ！</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
