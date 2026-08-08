/* ============================================================
   할 수 있는 것 목록 (전 학생 공용)

   왜: 학생이 불안한 이유는 "못 배우고 있어서" 가 아니라
   "배운 게 안 보여서" 다. 언어는 원어민과 비교하게 되는데
   그 거리는 3주가 지나든 3개월이 지나든 똑같이 멀어 보인다.
   40자를 익혔는데 체감은 "여전히 드라마가 안 들린다" 다.

   그래서 점수 대신 **구체적으로 할 수 있는 일**을 목록으로 둔다.
   CEFR·ACTFL 이 언어 교육에서 쓰는 방식 그대로다.
   "72점" 은 추상적이고 "커피를 주문할 수 있다" 는 확인이 된다.

   ⚠️ 꺼진 항목도 보여준다. 다음이 뭔지 알면 불안이 줄어든다.
      다만 전체 대비 퍼센트는 절대 보이지 않는다.
      "3% 완료" 는 남은 97% 를 보여줘서 절망을 만든다.

   문장은 학생이 읽는다. 영어로, 1인칭으로, 구체적으로 쓴다.
   "자모를 안다" 가 아니라 "내 최애 이름을 읽을 수 있다".

   id 는 한 번 정하면 바꾸지 않는다. 지나간 회차가 가리키고 있다.
   ============================================================ */

var CANDO = [

  /* ── 소리와 글자 ─────────────────────────────────────── */
  { id:'cd-vowels',   en:'recognise every Korean vowel',            tag:'letters' },
  { id:'cd-cons',     en:'recognise every basic consonant',         tag:'letters' },
  { id:'cd-bias',     en:'read my bias’s name',                tag:'letters' },
  { id:'cd-loanword', en:'read a foreign word written in Hangul',   tag:'letters',
    note:'coffee, tattoo, chocolate. They are already words you know.' },
  { id:'cd-myname',   en:'write my own name in Hangul',             tag:'letters' },
  { id:'cd-menu',     en:'read a Korean cafe menu',                 tag:'letters' },
  { id:'cd-title',    en:'read a K-drama title',                    tag:'letters' },

  /* ── 말하기 ──────────────────────────────────────────── */
  { id:'cd-greet',    en:'greet someone politely',                  tag:'speaking' },
  { id:'cd-intro',    en:'say my name in Korean',                   tag:'speaking' },
  { id:'cd-count',    en:'count from one to ten',                   tag:'speaking' },
  { id:'cd-family',   en:'name the people in my family',            tag:'speaking' },
  { id:'cd-polite',   en:'switch between polite and casual',        tag:'speaking',
    note:'The 요 at the end. You worked this out yourself.' },
  { id:'cd-order',    en:'order something in a shop',               tag:'speaking' },
  { id:'cd-ask',      en:'ask someone how they are',                tag:'speaking' },
  { id:'cd-nothanks', en:'say no politely',                         tag:'speaking' },
  { id:'cd-lost',     en:'say I do not understand',                 tag:'speaking' },

  /* ── 듣기 ────────────────────────────────────────────── */
  { id:'cd-hear-3',   en:'hear the difference between ㄱ ㅋ ㄲ',     tag:'listening',
    note:'The one you said was hardest. It will come.' },
  { id:'cd-catch',    en:'catch a word I know in a drama',          tag:'listening' },
  { id:'cd-numbers',  en:'understand a number when someone says it', tag:'listening' }

];

if (typeof module !== 'undefined') module.exports = { CANDO };
