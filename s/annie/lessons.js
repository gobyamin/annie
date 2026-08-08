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
    words: ['hello', 'nice', 'bye-going', 'bye-stay', 'good', 'sleepwell', 'n-kimareum'],
    can: ['cd-greet']
  }

  ,{
    n: 2,
    date: '2026-08-07',
    title: 'All forty letters, in one very long day',
    did: ['자모 40', 'numbers', 'family', '받침', '존댓말'],
    summary: 'My connection ruined the first lesson, so we did a second one at night. ' +
             'Between them we got through the whole alphabet, one to ten, your family words ' +
             'and about thirty words. That is a lot for one day. None of it is homework.',
    items: [
      { kind:'deck', file:'l-260807.html',
        label:'Everything from Friday', sub:'12 cards. Tap the tiles, they say themselves' },
      { kind:'tool', file:'blocks.html',
        label:'Build a word', sub:'커피 · 타투 · 차은우 · 올리브영. Or type your own' }
    ],
    words: [
      'w-coffee','w-radio','w-school','w-friend','w-house','w-mountain',
      'w-karaoke','w-daebak','w-mwohae','w-aegyo','w-me','w-you','w-cha',
      'w-dog','w-cat','w-babo','w-hand','w-money','w-room',
      'f-mom','f-dad','f-oppa','f-nuna','f-eonni','f-dongsaeng','f-maknae',
      'num-1','num-2','num-3','num-4','num-5','num-6','num-7','num-8','num-9','num-10',
      'thanks','s-eaten','s-fine','s-tea','s-yes','s-no',
      'n-eunwoo','n-astro','sp-1','sp-2'
    ],
    can: ['cd-vowels','cd-cons','cd-bias','cd-loanword',
          'cd-intro','cd-count','cd-family','cd-polite']
  }

  /* 3회차는 수업이 끝난 뒤에 여기에. 위 덩어리를 복사해서 날짜와 내용만 바꾼다.
     ⚠️ 지나간 회차는 고치지 않는다. */


];
