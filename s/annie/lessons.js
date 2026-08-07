/* 애니 · 회차 기록
   ────────────────────────────────────────────────────────────
   수업이 끝나면 여기에 한 덩어리를 추가한다. 위든 아래든 상관없다.
   선반이 날짜순으로 알아서 정렬한다.

   items 의 kind
     deck  이 폴더 안의 카드덱 html      file
     pdf   이 폴더 안의 배부물            file
     app   공용 앱 (전 학생이 같이 씀)     app  ← ?s=annie 가 자동으로 붙는다
     tool  수업 중에 같이 본 교구          file

   words 는 은행(bank/items.js)의 id 만 적는다. 한국어·영어·소리는 은행이 갖고 있다.
   "지금까지 배운 것 전부" 에 자동으로 쌓이고 중복은 걸러진다.

   ⚠️ 지나간 회차는 고치지 않는다. 오타가 있어도 다음 회차에서 바로잡는다.
      다시 쓰면 "이때 이걸 배웠구나" 가 성립하지 않는다.
   ──────────────────────────────────────────────────────────── */

var LESSONS = [

  {
    n: 1,
    date: '2026-08-05',
    title: 'Hello, and your Korean name',
    did: ['greetings', 'your name', 'why Korean'],
    summary: 'We talked more than we studied, and that was the right call. ' +
             'No Hangul yet. You left with a Korean name and seven things you can already say.',
    items: [
      { kind:'deck', file:'l-260805.html', from:'2026-08-05_선물_궁금했던것_안나.html',
        label:'Things you asked about', sub:'cards you can flip through' },
      { kind:'pdf',  file:'h-260805.pdf', from:'2026-08-05_배부물_애니.pdf',
        label:'Lesson 1 handout', sub:'2 pages, print or read on the phone' }
    ],
    /* 소리로만 나갔고 글자로는 아직 안 봤다. 그래도 말할 수 있으면 배운 것이다. */
    words: ['hello', 'nice', 'bye-going', 'bye-stay', 'good', 'sleepwell', 'n-kimareum']
  }

  /* 2회차(8/7)는 수업이 끝난 뒤에 여기 추가한다. 틀은 이렇다:

  ,{
    n: 2,
    date: '2026-08-07',
    title: 'Five vowels you already know',
    did: ['ㅏㅔㅣㅗㅜ', 'ㅇ', 'ㄴ', '애니 쓰기'],
    summary: '',
    items: [
      { kind:'app', app:'01d-vowels.html', label:'The vowels', sub:'tap any one to hear it' },
      { kind:'app', app:'02-syllable-builder.html', label:'Build your name', sub:'아 + 니 = 애니' }
    ],
    words: ['v-a','v-e','v-i','v-o','v-u','c-ng','c-n']
  }

  */

];
