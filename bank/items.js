/* ============================================================
   은행 — 가르치는 것 하나하나 (전 학생 공용)

   왜: 같은 "안녕하세요" 를 학생마다 다시 적으면, 번역을 고칠 때
   학생 수만큼 고쳐야 한다. 여기 한 번 적고 회차에서는 id 로만 부른다.

   소리는 두 갈래다. 녹음목록에 적어두신 원칙을 그대로 따른다.
     mine  선생님 목소리 (bank/voice.js). 사람에 붙는 것 = 이름·인사·칭찬
     tts   기계 목소리 (apps/assets/voice/*.wav). 자모·단어 드릴
   둘 다 없으면 글자만 보여준다. 그것도 괜찮다.

   새 항목을 넣을 때: id 는 한 번 정하면 바꾸지 않는다.
   지나간 회차가 그 id 를 가리키고 있어서, 바꾸면 옛 기록이 깨진다.
   ============================================================ */

var BANK = {

  /* ── 인사·칭찬. 선생님 목소리. 학생이 몇이든 매번 나온다 ────── */
  'hello':      { kr:'안녕하세요',   en:'hello',                 tag:'greeting', mine:'annyeonghaseyo' },
  'nice':       { kr:'반가워요',     en:'nice to meet you',      tag:'greeting', mine:'bangawoyo' },
  'thanks':     { kr:'감사합니다',   en:'thank you',             tag:'greeting', mine:'kamsahamnida' },
  'thanks-cas': { kr:'고마워',       en:'thanks',                tag:'greeting', mine:'gomawo',
                  note:'To a friend. Never to someone older.' },
  'welldone':   { kr:'잘했어요',     en:'well done',             tag:'praise',   mine:'jalhaesseoyo' },
  'fighting':   { kr:'화이팅',       en:'you can do it',         tag:'praise',   mine:'hwaiting' },
  'good':       { kr:'좋아요',       en:'I like it / good',      tag:'greeting', mine:'joayo' },
  'bye-going':  { kr:'잘 가요',      en:'bye (they leave)',      tag:'greeting', mine:'jalgayo' },
  'bye-stay':   { kr:'안녕히 계세요', en:'bye (you leave)',       tag:'greeting', mine:'annyeonghi' },
  'again':      { kr:'또 만나요',    en:'see you again',         tag:'greeting', mine:'ttomannayo' },

  /* ── 이름. 선생님 목소리 ─────────────────────────────────── */
  'n-seungmin': { kr:'승민',   en:'Seungmin',      tag:'name', mine:'seungmin' },
  'n-amin':     { kr:'아민',   en:'Amin',          tag:'name', mine:'amin' },
  'n-kimareum': { kr:'김아름', en:'Kim Areum',     tag:'name', mine:'kimareum' },
  'n-areum':    { kr:'아름',   en:'Areum',         tag:'name', mine:'areum' },

  /* ── 아직 소리가 없는 것. 글자만 나간다 ──────────────────── */
  'sleepwell':  { kr:'잘 자',    en:'sleep well',   tag:'greeting',
                  note:'Casual. She picked this up from a drama.' },
  'money':      { kr:'돈 주세요', en:'give me money', tag:'fun',
                  note:'Came up as a joke in lesson 1. She remembered it.' },

  /* ── 모음. 기계 목소리(TTS) 를 그대로 쓴다 ────────────────── */
  'v-a':  { kr:'ㅏ', en:'a  as in Spanish "casa"', tag:'vowel', tts:'vowel-a' },
  'v-e':  { kr:'ㅔ', en:'e  as in Spanish "mesa"', tag:'vowel', tts:'vowel-e' },
  'v-i':  { kr:'ㅣ', en:'i  as in Spanish "sí"',   tag:'vowel', tts:'vowel-i' },
  'v-o':  { kr:'ㅗ', en:'o  as in Spanish "todo"', tag:'vowel', tts:'vowel-o' },
  'v-u':  { kr:'ㅜ', en:'u  as in Spanish "luna"', tag:'vowel', tts:'vowel-u' },
  'v-eo': { kr:'ㅓ', en:'eo  no Spanish match',    tag:'vowel', tts:'vowel-eo',
            note:'The hard one. Spanish has nothing like it.' },
  'v-eu': { kr:'ㅡ', en:'eu  no Spanish match',    tag:'vowel', tts:'vowel-eu',
            note:'The other hard one.' },

  /* ── 자음 ────────────────────────────────────────────────── */
  'c-n':  { kr:'ㄴ', en:'n', tag:'consonant', tts:'sound-n' },
  'c-ng': { kr:'ㅇ', en:'silent at the front', tag:'consonant', tts:'sound-ng',
            note:'At the front of a block it just holds the seat.' }

};

if (typeof module !== 'undefined') module.exports = { BANK };
