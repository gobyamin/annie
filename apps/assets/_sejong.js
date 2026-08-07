/* ============================================================
   앱00 「한글의 탄생」: 세종의 실제 창제 원리
   자음: 발음기관 모방(상형) + 가획(획 더하기)
   모음: 천지인(하늘·땅·사람) 삼재

   12장면. 전면 이미지 + 헤드라인 + 서브 한 줄. 탭으로 진행.
   S12 끝에 앱01(아민의 여정)로 자연스럽게 넘어감: 같은 물총 이미지 사용.
   ============================================================ */

var SEJONG = [
  { id:'s01-before', kr:null,
    en:'Before 1443, Koreans spoke Korean…',
    sub:'but wrote everything in borrowed Chinese characters.' },

  { id:'s02-study', kr:null,
    en:'It took years to learn thousands of characters.',
    sub:'Most ordinary people never could.' },

  { id:'s03-sejong', kr:'세종대왕',
    en:'King Sejong decided his people deserved their own alphabet.',
    sub:'1443, in the palace at Hanyang (today’s Seoul).' },

  { id:'s04-idea', kr:null,
    en:'He studied what his own mouth was doing.',
    sub:'What if each letter were simply a picture of the sound being made?' },

  { id:'s05-tongue', kr:'ㄱ',
    en:'ㄱ: the back of the tongue blocking the throat.',
    sub:'Say “g” slowly and feel where your tongue goes. That shape became the letter.' },

  { id:'s06-four', kr:'ㄴ ㅁ ㅅ ㅇ',
    en:'Four more letters, four more mouth-shapes.',
    sub:'ㄴ tongue tip · ㅁ closed lips · ㅅ a tooth · ㅇ the open throat.' },

  { id:'s07-stroke', kr:null,
    en:'A stronger, breathier sound? Add one stroke.',
    sub:'ㄱ becomes ㅋ. ㄷ becomes ㅌ. The shape carries the rule.' },

  { id:'s08-samjae', kr:'천지인',
    en:'Vowels come from a different idea: three symbols.',
    sub:'A round sky, a flat earth, a standing person.' },

  { id:'s09-combine', kr:'ㆍ ㅡ ㅣ',
    en:'Combine them, and every vowel appears.',
    sub:'Sky above earth is ㅗ. Earth above sky is ㅜ. Person beside sky is ㅏ or ㅓ.' },

  { id:'s10-proclaim', kr:'나랏말싸미 듕귁에 달아',
    krRoman:'na-ran-mal-ssa-mi dyung-gwi-ge da-ra',
    en:'“The speech of this country differs from that of China.”',
    sub:'Sejong’s preface, proclaimed 1446. This Korean wording is the 1459 translation of it.',
    voice:'sejong-preface' },

  { id:'s11-today', kr:null,
    en:'Today, linguists call it one of the most logical alphabets ever designed.',
    sub:'Most of those shapes are still on your keyboard, six hundred years later.' },

  { id:'s12-yourturn', kr:null,
    en:'Your turn.',
    sub:'Let’s meet the first letter.',
    voice:'cue-ready', next:'01-hangul-letter-lab.html' }
];

if (typeof module !== 'undefined') module.exports = { SEJONG };
