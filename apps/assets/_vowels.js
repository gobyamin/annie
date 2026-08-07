/* ============================================================
   모음 21개: 연상 데이터 (단일 출처)
   기본 12 + 결합 9 = 21. 90 Day Korean "Old fAther, new sOn" 체계
   (나뭇가지·새싹·뿌리·개울·나무·달걀) 그대로 사용: 검증된 제3자 자료.

   ⚠️ 2026-08-06 정정: 이전 기획서에서 결합모음을 "8개"라 적었는데
   ㅖ(ㅕ+ㅣ)를 빠뜨려서 실제로는 9개였습니다.
   여기서 "기본 12"는 진짜 기본 10자에 ㅐ·ㅔ를 더한 것입니다: 이 둘은
   역사적으로는 결합이지만 지금은 단모음이라 그림 한 장으로 가르치는 쪽이 맞습니다.

   결합모음은 새 그림을 그리지 않습니다. 이미 배운 기본모음 그림
   두 장이 화면에서 합쳐지는 것으로 처리합니다 (한글 창제 원리와 동일).
   ============================================================ */

var VOWELS_BASIC = [
  { c:'ㅏ', id:'a',  fam:'branch', kr:'가지 하나 · 오른쪽', obj:'mn-a-branch',  sound:'vowel-a',
    mn:'“Old f<b>A</b>ther”: the twig points OUT to the right.' },
  { c:'ㅑ', id:'ya', fam:'branch', kr:'가지 둘 · 오른쪽', obj:'mn-ya-branch2', sound:'vowel-ya',
    mn:'\u314f with a second twig, and that second twig adds a <b>y</b>: a \u2192 ya.' },
  { c:'ㅓ', id:'eo', fam:'branch', kr:'가지 하나 · 왼쪽', obj:'mn-eo-branch',  sound:'vowel-eo',
    mn:'“new s<b>O</b>n”: the twig points IN to the left.' },
  { c:'ㅕ', id:'yeo',fam:'branch', kr:'가지 둘 · 왼쪽', obj:'mn-yeo-branch2', sound:'vowel-yeo',
    mn:'\u3153 with a second twig, and that second twig adds a <b>y</b>: eo \u2192 yeo.' },
  { c:'ㅗ', id:'o',  fam:'sprout', kr:'새싹 하나', obj:'mn-o-sprout',   sound:'vowel-o',
    mn:'“<b>O</b>ld”: a sprout growing UP out of the soil.' },
  { c:'ㅛ', id:'yo', fam:'sprout', kr:'새싹 둘', obj:'mn-yo-sprout2',  sound:'vowel-yo',
    mn:'\u3157 with a second sprout, and that second sprout adds a <b>y</b>: o \u2192 yo.' },
  { c:'ㅜ', id:'u',  fam:'root',   kr:'뿌리 하나', obj:'mn-u-root',     sound:'vowel-u',
    mn:'“n<b>ew</b>”: a root growing DOWN into the soil.' },
  { c:'ㅠ', id:'yu', fam:'root',   kr:'뿌리 둘', obj:'mn-yu-root2',    sound:'vowel-yu',
    mn:'\u315c with a second root, and that second root adds a <b>y</b>: u \u2192 yu.' },
  { c:'ㅡ', id:'eu', fam:'flat',   kr:'잔잔한 개울', obj:'mn-eu-brook',   sound:'vowel-eu',
    mn:'A calm flat brook, seen edge-on: the shape IS the sound.' },
  { c:'ㅣ', id:'i',  fam:'flat',   kr:'곧은 나무', obj:'mn-i-tree',      sound:'vowel-i',
    mn:'One tall straight tree: the shape IS the sound.' },
  { c:'ㅐ', id:'ae', fam:'egg',    kr:'달걀 + 막대 둘', obj:'mn-ae-egg',    sound:'vowel-ae',
    mn:'An egg between two sticks: ㅏ with one extra stroke.' },
  { c:'ㅔ', id:'e',  fam:'egg',    kr:'달걀 + 막대 하나', obj:'mn-e-egg',   sound:'vowel-e',
    mn:'The egg sits OUTSIDE, to the left of both sticks. \u3153 with one extra stroke.',
    note:'Sounds identical to ㅐ in modern Korean. Even native speakers cannot tell them apart by ear: only the spelling differs.' }
];

/* 결합모음 9: 새 그림 없음. parts 의 두 기본모음 그림이 화면에서 합쳐진다. */
var VOWELS_COMPOUND = [
  { c:'ㅘ', id:'wa',  parts:['o','a'],   sound:'vowel-wa',  note:'ㅗ + ㅏ, said fast, blend into “wa”.' },
  { c:'ㅙ', id:'wae', parts:['o','ae'],  sound:'vowel-wae', note:'ㅗ + ㅐ → “wae”.' },
  { c:'ㅚ', id:'oe',  parts:['o','i'],   sound:'vowel-oe',  note:'ㅗ + ㅣ, but said as “wae”: identical to ㅙ in modern speech.' },
  { c:'ㅝ', id:'wo',  parts:['u','eo'],  sound:'vowel-wo',  note:'\u315c + \u3153 \u2192 \u201cwo\u201d as in \u201cwonder\u201d, not as in \u201cwoe\u201d.' },
  { c:'ㅞ', id:'we',  parts:['u','e'],   sound:'vowel-we',  note:'ㅜ + ㅔ → “we”. Sounds the same as ㅙ/ㅚ to most ears.' },
  { c:'ㅟ', id:'wi',  parts:['u','i'],   sound:'vowel-wi',  note:'\u315c + \u3163 \u2192 \u201cwi\u201d, the vowel in English \u201cweek\u201d. Not the same as \u315e.' },
  { c:'ㅢ', id:'ui',  parts:['eu','i'],  sound:'vowel-ui',  note:'ㅡ then ㅣ, glued fast. Often just said as “i” or “e” depending on the word.' },
  { c:'ㅒ', id:'yae', parts:['ya','i'],  sound:'vowel-yae', note:'ㅑ + ㅣ → “yae”. Rare: few words use it.' },
  { c:'ㅖ', id:'ye',  parts:['yeo','i'], sound:'vowel-ye',  note:'ㅕ + ㅣ → “ye”, like English “yes”.' }
];
/* ㅑ, ㅛ, ㅠ 자체는 기본모음(위 목록)에 이미 있음: 헷갈리지 않도록 여기 다시 안 넣음.
   기본 12 + 결합 9 = 21. */

if (typeof module !== 'undefined') module.exports = { VOWELS_BASIC, VOWELS_COMPOUND };
