/* ============================================================
   받침: 블록 아래칸 (단일 출처)

   왜 따로 앱이 필요한가: 02 는 받침을 "골라서 조립해보는" 기능만 있다.
   어느 글자가 어느 소리로 나는지, 그리고 뒤에 모음이 오면 어떻게 되는지는
   어디에도 없었다. 초보가 실제로 무너지는 지점이 정확히 거기다.

   가르치는 것은 소리 일곱 개뿐이다. 표기는 27가지지만 소리는 7개로 무너진다.
   근거: 표준발음법 제8~11항 (음절의 끝소리 규칙).

   ⚠️ 음원 제약 (2026-08-06)
   받침 있는 단어 음원이 다섯 개뿐이다: 학교·산·물·집·가방.
   ㄷ 과 ㅁ 은 음원이 없어 wav 가 null 이다. 앱은 그 자리에
   "선생님이 읽어주세요" 칩을 띄운다 (앱04 의 Teacher reads 와 같은 방식).
   나중에 구울 것: word-mom(몸) 또는 word-gim(김), word-got(곧) 또는 word-ot(옷).
   ============================================================ */

/* 일곱 소리. spells = 이 소리로 무너지는 홑받침들 */
var BATCHIM = [
  { id:'k', c:'ㄱ', ipa:'k', spells:['ㄱ','ㅋ','ㄲ'],
    say:'Cut the sound off with the back of your tongue. No puff at the end.',
    word:'학교', wordEn:'school', wordSay:'hak-gyo', block:'학', wav:'word-hakgyo' },

  { id:'n', c:'ㄴ', ipa:'n', spells:['ㄴ'],
    say:'Tongue stays on the ridge behind your teeth and the sound goes up your nose.',
    word:'산', wordEn:'mountain', wordSay:'san', block:'산', wav:'word-san' },

  { id:'t', c:'ㄷ', ipa:'t', spells:['ㄷ','ㅅ','ㅆ','ㅈ','ㅊ','ㅌ','ㅎ'],
    say:'Tongue stops on the ridge and stays there. Nothing is released.',
    word:'옷', wordEn:'clothes', wordSay:'ot', block:'옷', wav:null,
    big:true, note:'Seven different letters, one single sound. This is the one that surprises everyone.' },

  { id:'l', c:'ㄹ', ipa:'l', spells:['ㄹ'],
    say:'Not the tap you hear at the front of a block. At the bottom it is a full English L.',
    word:'물', wordEn:'water', wordSay:'mul', block:'물', wav:'word-mul' },

  { id:'m', c:'ㅁ', ipa:'m', spells:['ㅁ'],
    say:'Lips shut and stay shut. The sound goes up your nose.',
    word:'봄', wordEn:'spring', wordSay:'bom', block:'봄', wav:null },

  { id:'p', c:'ㅂ', ipa:'p', spells:['ㅂ','ㅍ'],
    say:'Lips shut and stay shut, with no air let out. Almost silent.',
    word:'집', wordEn:'house', wordSay:'jip', block:'집', wav:'word-jip' },

  { id:'ng', c:'ㅇ', ipa:'ng', spells:['ㅇ'],
    say:'At the FRONT of a block this letter is silent. At the bottom it finally has a sound.',
    word:'가방', wordEn:'bag', wordSay:'ga-bang', block:'방', wav:'word-gabang' }
];

/* 연음: 뒤에 모음이 오면 받침이 그쪽으로 넘어간다.
   초보가 글자를 다 읽을 줄 알게 된 직후 바로 부딪히는 벽이다.
   from/to 는 화면에서 글자가 옮겨가는 애니메이션에 그대로 쓴다. */
var LINKING = [
  { w:'집이',   say:'지비',   en:'the house (as subject)',
    of:'집', tail:'ㅂ', next:'이',
    why:'The ㅂ has nowhere to sit, so it jumps into the empty seat of 이.' },
  { w:'한국어', say:'한구거', en:'the Korean language',
    of:'국', tail:'ㄱ', next:'어',
    why:'ㄱ leaves 국 and lands in 어. You hear 구거, never 국어.' },
  { w:'음악',   say:'으막',   en:'music',
    of:'음', tail:'ㅁ', next:'악',
    why:'ㅁ slides over. The written 음악 and the spoken 으막 look nothing alike.' },
  { w:'꽃이',   say:'꼬치',   en:'the flower (as subject)',
    of:'꽃', tail:'ㅊ', next:'이',
    why:'Alone, 꽃 is said 꼳. But when 이 follows, the original ㅊ comes back and jumps over.' }
];

/* 겹받침은 여기서 가르치지 않는다. 왕초보에게는 이르고,
   홑받침 일곱 소리를 먼저 굳히는 편이 낫다. 존재만 알린다. */
var DOUBLE_NOTE =
  'Some blocks carry TWO letters at the bottom (ㄳ ㄵ ㄶ ㄺ ㄻ ㄼ ㅄ). ' +
  'Only one of them gets said, and it is still one of the seven sounds above. ' +
  'Leave those for later. Nothing you read this month will need them.';

if (typeof module !== 'undefined') module.exports = { BATCHIM, LINKING, DOUBLE_NOTE };
