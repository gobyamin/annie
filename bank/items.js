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
,

  /* 2회차(8/7) 에 나간 것 */
  'w-coffee':      { kr:'커피', en:'coffee', tag:'word', tts:'word-keopi', mine:'w-coffee' },
  'w-radio':       { kr:'라디오', en:'radio', tag:'word', tts:'word-radio', mine:'w-radio' },
  'w-school':      { kr:'학교', en:'school', tag:'word', tts:'word-hakgyo', mine:'w-school' },
  'w-friend':      { kr:'친구', en:'friend', tag:'word', tts:'word-chingu', mine:'w-friend' },
  'w-house':       { kr:'집', en:'house', tag:'word', tts:'word-jip' },
  'w-mountain':    { kr:'산', en:'mountain', tag:'word', tts:'word-san', mine:'w-mountain' },
  'w-karaoke':     { kr:'노래방', en:'karaoke room', tag:'word', mine:'w-karaoke' },
  'w-daebak':      { kr:'대박', en:'no way!', tag:'word', mine:'w-daebak' },
  'w-mwohae':      { kr:'뭐해', en:'whatcha doing', tag:'word', mine:'w-mwohae' },
  'w-aegyo':       { kr:'애교', en:'cute act', tag:'word', mine:'w-aegyo' },
  'w-me':          { kr:'나', en:'me', tag:'word', mine:'w-me' },
  'w-you':         { kr:'너', en:'you', tag:'word', mine:'w-you' },
  'w-cha':         { kr:'차', en:'car, and also tea', tag:'word', mine:'w-cha' },
  'w-dog':         { kr:'개', en:'dog', tag:'word', mine:'w-dog' },
  'w-cat':         { kr:'고양이', en:'cat', tag:'word', mine:'w-cat' },
  'w-babo':        { kr:'바보', en:'silly', tag:'word', mine:'w-babo' },
  'w-hand':        { kr:'손', en:'hand', tag:'word' },
  'w-money':       { kr:'돈', en:'money', tag:'word', mine:'w-money' },
  'w-room':        { kr:'방', en:'room', tag:'word' },
  /* 가족. 애니는 8남매의 막내다 */
  'f-mom':         { kr:'엄마', en:'mum', tag:'family', mine:'fam-eomma' },
  'f-dad':         { kr:'아빠', en:'dad', tag:'family', mine:'fam-appa' },
  'f-oppa':        { kr:'오빠', en:'older brother (she says)', tag:'family', mine:'fam-oppa' },
  'f-nuna':        { kr:'누나', en:'older sister (he says)', tag:'family', mine:'fam-nuna' },
  'f-eonni':       { kr:'언니', en:'older sister (she says)', tag:'family', mine:'fam-eonni' },
  'f-dongsaeng':   { kr:'동생', en:'younger sibling', tag:'family', mine:'fam-dongsaeng' },
  'f-maknae':      { kr:'막내', en:'the youngest one', tag:'family', mine:'fam-maknae' },
  /* 고유어 숫자 1~10 */
  'num-0':         { kr:'영', en:'zero', tag:'number', mine:'num-yeong' },
  'num-1':         { kr:'하나', en:'one', tag:'number', mine:'num-hana' },
  'num-2':         { kr:'둘', en:'two', tag:'number', mine:'num-dul' },
  'num-3':         { kr:'셋', en:'three', tag:'number', mine:'num-set' },
  'num-4':         { kr:'넷', en:'four', tag:'number', mine:'num-net' },
  'num-5':         { kr:'다섯', en:'five', tag:'number', mine:'num-daseot' },
  'num-6':         { kr:'여섯', en:'six', tag:'number', mine:'num-yeoseot' },
  'num-7':         { kr:'일곱', en:'seven', tag:'number', mine:'num-ilgop' },
  'num-8':         { kr:'여덟', en:'eight', tag:'number', mine:'num-yeodeol' },
  'num-9':         { kr:'아홉', en:'nine', tag:'number', mine:'num-ahop' },
  'num-10':        { kr:'열', en:'ten', tag:'number', mine:'num-yeol' },
  /* 문장 */
  's-eaten':       { kr:'밥 먹었어요?', en:'have you eaten (= are you doing okay)', tag:'phrase', mine:'s-eaten' },
  's-fine':        { kr:'괜찮아요', en:'I am fine / no thanks', tag:'phrase', mine:'s-fine' },
  's-tea':         { kr:'차 주세요', en:'tea, please (she built this herself)', tag:'phrase', mine:'s-tea' },
  's-yes':         { kr:'네', en:'yes, polite', tag:'phrase', mine:'s-ne' },
  's-no':          { kr:'아니요', en:'no, polite', tag:'phrase', mine:'p-aniyo' },

  /* 최애와 매운맛. 2회차 뒤 추가 */
  'n-eunwoo':      { kr:'차은우', en:'Cha Eun-woo, ASTRO', tag:'name',
                     note:'Her bias. Every letter is one she already knows.', mine:'name-eunwoo' },
  'n-astro':       { kr:'아스트로', en:'ASTRO', tag:'name' },
  'sp-1':          { kr:'개새끼', en:'strong insult, aimed at a person', tag:'spicy',
                     note:'Understand pile, not say pile. She asked for it.' },
  'sp-2':          { kr:'씨발', en:'the strongest one, like the f word', tag:'spicy',
                     note:'Never to someone older. She will hear it in every drama.' }
};

if (typeof module !== 'undefined') module.exports = { BANK };
