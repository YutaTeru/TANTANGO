import { VocabularyItem, Word } from './types';
import { WORDS } from './words';
import { WORDS as RAW_EXJUN1 } from './exjun1';
import { WORDS as RAW_TARGET_1400 } from './target1400';
import { WORDS as RAW_TARGET_1900 } from './target1900';
import { vocabularyList as MOYASHI_TARGET_1900 } from './moyashi-data/vocabulary';
import { vocabularyList as SYSTAN } from './moyashi-data/systan';

const rawKinHure = `1	anyway	とにかく
2	following	～に続いて
3	refer	参照する
4	available	入手できる
5	department	部門
6	conference	会議
7	according to	～によると
8	likely	おそらく
9	offer	申し出る
10	equipment	機器
11	provide	提供する
12	local	地元の
13	purchase	購入する
14	opening	空き
15	construction	建設
16	tour	見学する
17	research	調査
18	attend	出席する
19	delivery	配達
20	recently	最近
21	indicate	示す
22	employee	従業員
23	additional	追加の
24	survey	アンケート調査
25	review	論評する
26	production	生産
27	located	位置して
28	detail	詳細
29	announce	発表する
30	repair	修理
31	increase	増加
32	include	含む
33	currently	現在
34	advertising	広告
35	charge	請求する
36	expect	予定する
37	client	顧客
38	firm	会社
39	financial	お金の
40	annual	年間の
41	payment	支払
42	budget	予算
43	application	応募書類
44	contract	契約
45	management	経営
46	performance	業績
47	pleased	満足して
48	confirm	確認する
49	award	賞
50	clothing	衣類
51	display	展示する
52	candidate	候補者
53	state	述べる
54	exhibit	展示物	a museum exhibit	博物館の展示物
55	session	時間	a Q&A session	質疑応答の時間
56	note	注意する	Please note that prices may change.	値段は変更になる場合があるので、注意してください
57	process	処理する	process an order	注文を処理する
58	instruction	説明書	Please read all the instructions.	説明書をすべてお読みください。
59	membership	会員	sign up for membership	会員登録する
60	agency	代理店	a travel agency	旅行代理店
61	based	拠点のある	a Seattle-based company	シアトルに拠点を置く会社
62	facility	施設	a research facility	研究施設
63	advance	事前の	advance notice	事前の告知
64	committee	委員会	join a committee	委員会に入る
65	successful	成功した	The event was successful.	そのイベントは成功だった。
66	excellent	素晴らしい	excellent service	素晴らしいサービス
67	industry	業界	the fashion industry	ファッション業界
68	fee	料金	pay a late fee	延滞料金を払う
69	accept	受け入れる	accept an offer	オファーを受け入れる
70	upcoming	今度の	prepare for an upcoming event	今度のイベントの準備をする
71	latest	最新の	Haruki Murakami's latest novel	村上春樹の最新の小説
72	submit	提出する	submit a report	レポートを提出する
73	transportation	輸送手段	use public transportation	公共の交通機関を利用する
74	résumé	履歴書	send a résumé	履歴書を送る
75	executive	重役	a company executive	会社の重役
76	introduce	導入する	introduce a new line of products	新たな商品ラインを導入する
77	previous	以前の	have no previous experience	以前の経験がない
78	proposal	提案	review a proposal	提案に目を通す
79	supply	必需品	office supplies	オフィス用品
80	enclose	同封する	My résumé is enclosed.	履歴書を同封いたします。
81	policy	規定	returns policy	返品規定
82	register	登録する	register for employee training	社員研修に登録する
83	arrange	手配する	arrange a meeting	会議の手配をする
84	bill	請求書	receive a bill	請求書を受け取る
85	hire	雇う	hire an assistant	アシスタントを雇う
86	approve	承認する	approve a plan	計画を承認する
87	conduct	実施する	conduct a survey	アンケート調査を行う
88	opportunity	機会	an opportunity to work with you	あなたとお仕事をする機会
89	deadline	締め切り	the deadline for the project	プロジェクトの締め切り
90	corporate	企業の	a corporate trainer	企業のトレーナー
91	warranty	保証	a three-year warranty	3年保証
92	necessary	必要な	necessary forms	必要な用紙
93	reserve	予約する	reserve a room at a hotel	ホテルの部屋を予約する
94	resident	住民	local residents	地元の住民
95	create	作り出す	create a new logo	新しいロゴを作り出す
96	inform	知らせる	We are happy to inform you that	～を知らせることができて嬉しい
97	allow	可能にする	allow customers to pay online	顧客がオンラインで支払うことを可能にする
98	mention	述べる	What problem does the man mention?	男性はどんな問題について述べていますか。
99	appreciate	感謝する	I really appreciate your help.	助けて頂いて本当に感謝しています。
100	replacement	交換品	replacement parts	交換部品
101	update	最新情報	traffic updates	交通の最新情報
102	branch	支店	open a new branch	新しい支店をオープンする
103	paid	有給の	paid leave	有給休暇
104	unfortunately	残念なことに	Unfortunately, there are some problems.	残念なことに、いくつか問題があります。
105	original	元の	in original condition	元の状態で
106	rent	家賃	a rent increase	家賃の値上げ
107	memo	社内文書	write a memo	社内文書を書く
108	luggage	旅行かばん	shop for luggage	旅行かばんを買い求める
109	editor	編集者	a newspaper editor	新聞の編集者
110	exhibition	展示会	an art exhibition	美術展
111	leading	首位の	a leading company	トップの会社
112	organization	組織	lead an organization	組織を率いる
113	release	発売する	release a new album	ニューアルバムを発売する
114	limited	限られた	for a limited time	期間限定で
115	procedure	手続き	a normal procedure	通常の手続き
116	experienced	経験豊富な	an experienced engineer	経験豊かなエンジニア
117	personnel	社員	all company personnel	全社員
118	author	著者	the author of a popular book	人気本の著者
119	benefit	福利厚生	employee benefits	従業員の福利厚生
120	focus	～に集中させる	focus on one point	1点に集中する
121	participate	参加する	participate in the workshop	セミナーに参加する
122	cause	原因	the cause of the problem	問題の原因
123	degree	学位	a degree in journalism	ジャーナリズムの学位
124	directly	直接	purchase directly from a Web site	ホームページから直接購入する
125	host	司会者	the host of a television show	テレビ番組の司会者
126	expert	専門家	an expert in the field	その分野の専門家
127	impress	感心させる	We were impressed by your knowledge.	我々はあなたの知識に感心した。
128	mainly	主に	work mainly in the steel industry	主に鉄鋼業界で働く
129	suggestion	提案	make suggestions	提案を行う
130	supplier	納入業者	relationships with suppliers	納入業者との関係
131	document	書類	an important document	重要な書類
132	remind	再確認する	remind employees about the policy	従業員に規則に関して再確認する
133	require	求める	Workers are required to wear uniforms.	作業員は制服の着用を求められます。
134	representative	担当者	a sales representative	営業担当者
135	packaging	梱包	the packaging area	梱包エリア
136	description	説明	a job description	職務内容の説明
137	property	不動産	a property manager	不動産の管理人
138	extension	内線	Call me at extension 4649.	内線4649にお電話ください。
139	inquire	問い合わせる	inquire about a job	仕事について問い合わせる
140	merchandise	商品	display merchandise	商品を陳列する
141	highly	非常に	a highly successful business	非常に成功しているビジネス
142	result	結果	The campaign resulted in success.	そのキャンペーンは成功という結果になった。
143	assistance	支援	Thank you for your assistance.	ご支援ありがとうございます。
144	encourage	奨励する	Employees are encouraged to attend the event.	従業員がイベントに参加することを奨励します。
145	individual	個人	each individual in the company	会社の一人一人の個人
146	laboratory	研究所	when entering the laboratory	研究所に入る時
147	consider	考える	consider working in Japan	日本での勤務を考える
148	headquarters	本社	move the headquarters to Boston	本社をボストンに移転する
149	ship	出荷する	We are ready to ship your order.	注文を出荷する準備ができました。
150	commercial	商業の	commercial buildings	商業ビル
151	device	機器	a medical device	医療機器
152	intended	向けられた	For whom is the notice intended?	このお知らせは誰に向けられていますか。
153	brochure	パンフレット	a product brochure	製品パンフレット
154	mail	郵便配達	by express mail	速達郵便で
155	prefer	～を好む	I prefer to work part-time.	私はパートタイムで働く方が好きです。
156	response	返事	I'm writing in response to your letter.	お手紙へのご返事です。
157	region	地域	companies in the region	その地域の会社
158	donation	寄付	donations to a museum	ミュージアムへの寄付
159	quarter	四半期	the third quarter	第3四半期
160	agreement	契約	a rental agreement	賃貸契約書
161	journal	専門誌	a scientific journal	科学の専門誌
162	distribute	配布する	distribute a document	書類を配布する
163	potential	見込みがある	potential customers	見込み客
164	reschedule	スケジュール変更する	reschedule an appointment	アポを予定変更する
165	renew	更新する	renew a contract	契約を更新する
166	warehouse	倉庫	ship from a warehouse	倉庫から出荷する
167	refund	返金	a full refund	全額返金
168	advise	勧める	What are listeners advised to do?	聞き手は何をするよう勧められていますか。
169	immediately	即座に	The tickets sold out immediately.	チケットは即売り切れた。
170	council	議会	the city council	市議会
171	broadcast	放送する	The program is usually broadcast on Saturdays.	その番組は通常土曜日に放送される。
172	responsible	担当している	I am responsible for training employees.	私は従業員の研修を担当している。
173	avoid	避ける	avoid wasting time	時間の無駄遣いを避ける
174	effective	効果的な	effective advertising campaigns	効果的な広告キャンペーン
175	invitation	招待	receive an invitation	招待状を受け取る
176	reduce	下げる	reduce prices	値段を下げる
177	vehicle	乗り物	park a vehicle	乗り物を駐車する
178	efficient	効率的な	efficient use of energy	エネルギーの効率的な使用
179	manufacturer	メーカー	a car manufacturer	自動車メーカー
180	comfortable	快適な	comfortable rooms and friendly staff	快適な部屋とフレンドリーなスタッフ
181	correct	正しい	the correct address	正しい住所
182	downtown	中心街の	downtown restaurants	中心街のレストラン
183	method	方法	the method of payment	支払方法
184	entire	全体の	the entire staff	全スタッフ
185	range	範囲	a wide range of services	広範囲のサービス
186	setting	環境	a hotel in a beautiful setting	美しい環境にあるホテル
187	apologize	おわびする	We apologize for the inconvenience.	ご便をおかけしますことをお詫びします。
188	frequent	ひんぱんな	frequent use of the Internet	インターネットのひんぱんな使用
189	promotion	昇進	Tex's promotion to sales manager	テックスの営業マネージャーへの昇進
190	regarding	～に関する	regarding your order	あなたのご注文に関して
191	temporary	臨時の	temporary workers	臨時雇いの従業員
192	traditional	伝統的な	traditional Italian dishes	伝統的なイタリア料理
193	admission	入場料	Admission is free for all members.	メンバーは入場無料です。
194	fit	入る	The room can fit 50 people.	その部屋には50人が入る。
195	reference	照会先	contact a reference	照会先に連絡を取る
196	status	状況	shipment status	配送状況
197	fuel	燃料	fuel costs	燃料のコスト
198	nearly	もう少しで	nearly two years	2年近く
199	cafeteria	社員食堂	meet in the cafeteria for lunch	昼食のために社員食堂に集まる
200	determine	決定する	determine how to sell the product	製品の売り方を決定する
201	expense	費用
202	overseas	海外の
203	appear	現れる
204	develop	作り出す
205	improve	改善する
206	reasonable	手ごろな
207	unable	できない
208	delay	遅らせる
209	legal	法律に関する
210	regulation	規則
211	expand	拡大する
212	launch	開始
213	recommendation	推薦
214	direct	向ける
215	profit	利益
216	seek	探し求める
217	entry	エントリー
218	claim	申し立て
219	crew	グループ
220	demand	需要
221	figure	数字
222	raise	上げる
223	attach	添付する
224	attract	引き付ける
225	insurance	保険
226	departure	出発
227	mayor	町長
228	balance	残金
229	estimate	見積もり
230	district	地区
231	former	前の
232	modern	現代的な
233	tip	アドバイス
234	establish	設立する
235	option	選択肢
236	retire	退職する
237	search	捜索
238	specific	具体的な
239	agriculture	農業の
240	historical	歴史の
241	helpful	役立つ
242	complaint	苦情
243	related	関連した
244	simply	単純に
245	unique	他にはない
246	concerning	～に関する
247	reputation	評判
248	ability	能力
249	arrival	到着
250	familiar	よく知っている
251	ideal	理想的な
252	maintain	維持する
253	landscaping	造園
254	organize	計画する
255	significant	かなりの
256	occasion	特別な行事
257	standard	基準
258	guided	ガイド付きの
259	advanced	進んだ
260	alternative	代わりの
261	confident	確信している
262	decade	10年間
263	initial	初めの
264	separate	分かれた
265	celebration	お祝い
266	concern	心配
267	environment	環境
268	operate	操作する
269	various	さまざまな
270	brief	短い
271	full-time	常勤の
272	overall	全体の
273	achieve	達成する
274	basis	ベース
275	complex	複合施設
276	delighted	とても喜んでいる
277	obtain	得る
278	honor	称える
279	properly	ちゃんと
280	electoronic	電子の
281	finalize	取りまとめる
282	generous	寛大な
283	preparation	準備
284	duty	任務
285	earn	得る
286	willing	〜することを嫌がらない
287	worth	価値がある
288	fund	資金を提供する
289	overnight	一晩の
290	particularly	特に
291	aspect	面
292	hesitate	ためらう
293	involved	関わった
294	regularly	定期的に
295	scholarship	奨学金
296	shortly	じきに
297	automobile	自動車の
298	satisfied	満足した
299	background	経歴
300	suitable	ふさわしい
301	deposit	保証金
302	contain	含む
303	content	内容
304	proof	証明
305	affect	影響する
306	recognize	認める
307	represent	代表を務める
308	transfer	転勤させる
309	anniversary	～周年
310	automatically	自動的に
311	capacity	能力
312	destination	目的地
313	grant	補助金
314	publish	出版する
315	accompany	添付する
316	economic	経済の
317	extremely	非常に
318	institution	機関
319	accurate	正確な
320	compete	競う
321	emphasize	強調する
322	aware	気付いて
323	crowded	混雑した
324	praise	ほめる
325	valuable	貴重な
326	explore	探索する
327	found	設立する
328	function	機能
329	impact	影響
330	amazing	驚くべき
331	assure	保証する
332	cooperation	協力
333	popularity	人気
334	permit	許可証
335	solve	解決する
336	vote	投票する
337	crop	作物
338	neighborhood	近所
339	permanent	常設の
340	regret	残念に思う
341	slightly	わずかに
342	complicated	複雑な
343	factor	要因
344	favorable	好意的な
345	guarantee	保証する
346	mechanical	機械の
347	priority	優先順位
348	relatively	比較的
349	resource	資源
350	shuttle	定期往復便
351	divide	分ける
352	native	出身の
353	afford	～する余裕がある
354	income	収入
355	occur	発生する
356	saving	値引き
357	findings	わかったこと
358	locate	見つける
359	postpone	延期する
360	preserve	保護する
361	prove	わかる
362	exact	正確な
363	gain	得る
364	labor	労働
365	regard	みなす
366	closely	密に
367	deserve	値する
368	identify	特定する
369	loyal	忠実な
370	promising	有望な
371	stress	強調する
372	analyze	分析する
373	commission	委託する
374	committed	熱心に取り組む
375	comparison	比較
376	component	部品
377	enable	可能にする
378	enjoyable	楽しい
379	existing	従来の
380	flyer	チラシ
381	proceed	進む
382	prevent	防ぐ
383	alike	同様に
384	appoint	指名する
385	connection	接続
386	eager	熱望する
387	ease	容易さ
388	fairly	かなり
389	absolutely	完全に
390	atmosphere	雰囲気
391	calculate	計算する
392	contrast	対照的である
393	monitor	監視する
394	occasionally	時々
395	practical	実務の
396	serious	重大な
397	strength	強度
398	equally	同じように
399	import	輸入品
400	informal	非公式の`;

const parseWords = (data: string): Word[] => {
  if (!data.trim()) return [];
  
  return data.trim().split('\n').map((line): Word | null => {
    const parts = line.split('\t');
    // Ensure we have at least ID, English, and Japanese
    if (parts.length < 3) return null;
    
    const id = parseInt(parts[0], 10);
    if (isNaN(id)) return null;

    return {
      id: id,
      english: parts[1].trim(),
      japanese: parts[2].trim(),
      // Handle optional columns for example sentences
      example: parts[3] ? parts[3].trim() : undefined,
      exampleMeaning: parts[4] ? parts[4].trim() : undefined
    };
  }).filter((w): w is Word => w !== null);
};

// Map the Leap data format to the App's Word interface
export const WORD_LIST_LEAP: Word[] = WORDS.map(item => ({
  id: item.id,
  english: item.word,
  japanese: item.meaning,
}));

export const WORD_LIST_KIN_HURE = parseWords(rawKinHure);
export const WORD_LIST_EXJUN1: Word[] = RAW_EXJUN1.map(item => ({
  id: item.id,
  english: item.word,
  japanese: item.meaning,
}));

// Map the Target 1400 data format to the App's Word interface
export const WORD_LIST_TARGET1400: Word[] = RAW_TARGET_1400.map(item => ({
  id: item.id,
  english: item.word,
  japanese: item.meaning,
}));

// Map the Target 1900 data format to the App's Word interface
export const WORD_LIST_TARGET1900: Word[] = RAW_TARGET_1900.map(item => ({
  id: item.id,
  english: item.word,
  japanese: item.meaning,
}));

const mapVocabularyItems = (items: VocabularyItem[]): Word[] => items.map(item => ({
  id: item.id,
  english: item.word,
  japanese: item.meaning,
  example: item.extra1,
  exampleMeaning: item.extra2,
}));

export const WORD_LIST_MOYASHI_TARGET1900: Word[] = mapVocabularyItems(MOYASHI_TARGET_1900);
export const WORD_LIST_SYSTAN: Word[] = mapVocabularyItems(SYSTAN);

export type DatasetKey =
  | 'kinhure'
  | 'leap'
  | 'exjun1'
  | 'target1400'
  | 'target1900'
  | 'moyashiTarget1900'
  | 'systan';

export const DATASET_OPTIONS: DatasetKey[] = [
  'kinhure',
  'leap',
  'exjun1',
  'target1400',
  'target1900',
  'moyashiTarget1900',
  'systan',
];

export const DATASETS: Record<DatasetKey, { label: string; words: Word[] }> = {
  kinhure: { label: '金フレ', words: WORD_LIST_KIN_HURE },
  leap: { label: 'LEAP', words: WORD_LIST_LEAP },
  exjun1: { label: 'EX準1', words: WORD_LIST_EXJUN1 },
  target1400: { label: 'Target 1400', words: WORD_LIST_TARGET1400 },
  target1900: { label: 'Target 1900', words: WORD_LIST_TARGET1900 },
  moyashiTarget1900: { label: 'Moyashi Target 1900', words: WORD_LIST_MOYASHI_TARGET1900 },
  systan: { label: 'シスタン', words: WORD_LIST_SYSTAN },
};
