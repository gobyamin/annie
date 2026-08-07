/* ============================================================
   2바퀴: 조음 데이터 (단일 출처)
   「입 안에서 무슨 일이 일어나나」

   1바퀴(이야기·모양)를 끝낸 학생이 같은 14자를 다시 도는 층위.
   1바퀴에서는 ㄱ·ㅋ 를 "총"과 "열쇠"로 따로 외웠지만,
   2바퀴에서 둘이 **같은 자리에서 나는 소리이고 공기 세기만 다르다**를 본다.

   그림은 assets/img/art/mouth-side.webp 한 장만 쓴다.
   자음마다 바뀌는 것은 마커 좌표 하나뿐. CSS 로 얹으므로 이미지에 굽지 않는다.
   ============================================================ */

/* 조음 위치 5구역: 측면 두상 그림 위의 백분율 좌표.
   그림이 왼쪽을 보고 있으므로 입술이 왼쪽, 목구멍이 오른쪽 아래. */
var PLACES = {
  lips:   { x:16, y:56, en:'Your lips',            kr:'입술',       tip:'Both lips press together and let go.' },
  ridge:  { x:33, y:52, en:'Behind your teeth',    kr:'잇몸',       tip:'The tip of your tongue goes to the bump behind your top teeth. Touching it for \u3137\u314c\u3138\u3134\u3139, almost touching for \u3145\u3146.' },
  palate: { x:44, y:48, en:'The roof of the mouth',kr:'센입천장',   tip:'The blade of your tongue presses the hard roof.' },
  velar:  { x:56, y:52, en:'The back of the mouth',kr:'여린입천장', tip:'The back of your tongue lifts and blocks the soft roof.' },
  throat: { x:60, y:76, en:'Your throat',          kr:'목구멍',     tip:'Nothing touches. Air just rushes out of the throat.' }
};

/* 기식 3종: 종이 실험이 그대로 설명이 된다 */
var AIRS = {
  plain:  { en:'Plain',     kr:'평음', paper:'The paper barely moves.',
            tip:'Soft, almost no air. Hold a slip of paper in front of your mouth and it twitches, but only slightly.' },
  aspir:  { en:'Aspirated', kr:'격음', paper:'The paper blows away.',
            tip:'A hard puff of air. The paper jumps. In writing the aspirated letter carries an extra stroke: \u3131\u2192\u314b, \u3137\u2192\u314c, \u3148\u2192\u314a. \u3142\u2192\u314d is the odd one out.' },
  tense:  { en:'Tense',     kr:'경음', paper:'The paper stays still, but your throat is tight.',
            tip:'Squeeze your throat and let no air out at all. In writing, the letter is DOUBLED.' },
  nasal:  { en:'Nasal',     kr:'비음', paper:'Air comes out of your nose, not your mouth.',
            tip:'Pinch your nose and the sound dies. That is how you know it is a nasal.' },
  liquid: { en:'Liquid',    kr:'유음', paper:'One quick flick of the tongue.',
            tip:'A single tap, somewhere between English r and l.' },
  tenseFric:{ en:'Tense', kr:'경음', paper:'A sharp hard hiss. The paper flutters.',
            tip:'The same hiss as \u3145 but stronger and longer, with your throat tight. In writing, the letter is DOUBLED.' },
  fric:   { en:'Fricative', kr:'마찰음', paper:'A steady hiss, not a burst.',
            tip:'Air squeezes through a narrow gap. You can hold this sound as long as your breath.' }
};


/* 공기 흐름: ㄱ 과 ㅋ 은 자리가 같아 마커로는 구별이 안 된다.
   나가는 공기를 그려야 눈으로 갈린다. (2026-08-06) */
var FLOW = {
  plain:  { arrow:'short', puffs:0, squeeze:false, paper:'nudge' },
  aspir:  { arrow:'long',  puffs:3, squeeze:false, paper:'blow'  },
  tense:  { arrow:'none',  puffs:0, squeeze:true,  paper:'still' },
  nasal:  { arrow:'nose',  puffs:0, squeeze:false, paper:'still' },
  liquid: { arrow:'flick', puffs:0, squeeze:false, paper:'nudge' },
  tenseFric:{arrow:'stream',puffs:2, squeeze:true,  paper:'flutter' },
  fric:   { arrow:'stream',puffs:2, squeeze:false, paper:'flutter' }
};

/* 자음 19개. same = 같은 자리에서 나는 형제들 (2바퀴의 핵심 학습점)
   obj = 1바퀴에서 쓴 연상 그림 (assets/img/obj/<obj>.webp).
         여기 적어두면 복습·점검 앱이 파일명을 다시 하드코딩하지 않아도 된다. */
var ARTIC = [
  { c:'ㅂ', place:'lips',   air:'plain', sound:'sound-b', name:'letter-b',  same:['ㅂ','ㅍ','ㅃ'], obj:'mn-b-bucket' },
  { c:'ㅍ', place:'lips',   air:'aspir', sound:'sound-p', name:'letter-p',  same:['ㅂ','ㅍ','ㅃ'], obj:'mn-p-porch' },
  { c:'ㅃ', place:'lips',   air:'tense', sound:'sound-pp', name:'letter-pp',        same:['ㅂ','ㅍ','ㅃ'], obj:'mn-pp-buckets' },
  { c:'ㅁ', place:'lips',   air:'nasal', sound:'sound-m', name:'letter-m',  same:['ㅁ'], obj:'mn-m-mail' },

  { c:'ㄷ', place:'ridge',  air:'plain', sound:'sound-d', name:'letter-d',  same:['ㄷ','ㅌ','ㄸ'], obj:'mn-d-door' },
  { c:'ㅌ', place:'ridge',  air:'aspir', sound:'sound-t', name:'letter-t',  same:['ㄷ','ㅌ','ㄸ'], obj:'mn-t-tooth' },
  { c:'ㄸ', place:'ridge',  air:'tense', sound:'sound-tt', name:'letter-tt',        same:['ㄷ','ㅌ','ㄸ'], obj:'mn-tt-doors' },
  { c:'ㄴ', place:'ridge',  air:'nasal', sound:'sound-n', name:'letter-n',  same:['ㄴ'], obj:'mn-n-nose' },
  { c:'ㄹ', place:'ridge',  air:'liquid',sound:'sound-r', name:'letter-r',  same:['ㄹ'], obj:'mn-r-ladder' },
  { c:'ㅅ', place:'ridge',  air:'fric',  sound:'sound-s', name:'letter-s',  same:['ㅅ','ㅆ'], obj:'mn-s-seashell' },
  { c:'ㅆ', place:'ridge',  air:'tenseFric', sound:'sound-ss', name:'letter-ss',        same:['ㅅ','ㅆ'], obj:'mn-ss-shells' },

  { c:'ㅈ', place:'palate', air:'plain', sound:'sound-j', name:'letter-j',  same:['ㅈ','ㅊ','ㅉ'], obj:'mn-j-jug' },
  { c:'ㅊ', place:'palate', air:'aspir', sound:'sound-ch', name:'letter-ch', same:['ㅈ','ㅊ','ㅉ'], obj:'mn-ch-church' },
  { c:'ㅉ', place:'palate', air:'tense', sound:'sound-jj', name:'letter-jj',        same:['ㅈ','ㅊ','ㅉ'], obj:'mn-jj-jugs' },

  { c:'ㄱ', place:'velar',  air:'plain', sound:'sound-g', name:'letter-g',  same:['ㄱ','ㅋ','ㄲ'], obj:'mn-g-gun' },
  { c:'ㅋ', place:'velar',  air:'aspir', sound:'sound-k', name:'letter-k',  same:['ㄱ','ㅋ','ㄲ'], obj:'mn-k-key' },
  { c:'ㄲ', place:'velar',  air:'tense', sound:'sound-kk', name:'letter-kk',        same:['ㄱ','ㅋ','ㄲ'], obj:'mn-kk-guns' },
  { c:'ㅇ', place:'velar',  air:'nasal', sound:'sound-ng', name:'letter-ng', same:['ㅇ'], obj:'mn-ng-ring',
    note:'Only at the BOTTOM of a block. At the front it makes no sound at all.' },

  { c:'ㅎ', place:'throat', air:'fric',  sound:'sound-h', name:'letter-h',  same:['ㅎ'], obj:'mn-h-hat' }
];

if (typeof module !== 'undefined') module.exports = { PLACES, AIRS, FLOW, ARTIC };
