/* ============================================================
   이야기 대본: 단일 출처
   「아민의 되게 긴 하루」 · 기본 자음 14개를 4챕터로

   글자 하나 = 두 박자
     scene  이야기 장면. 사물이 크게 나오고 그 자체가 글자 모양
     zoom   장면이 사물로 확대 → 깨끗한 사물 사진 → 빨간 획이 그려짐

   규칙 (2026-08-06 인계 문서에서 실패했던 것들)
     · 그림에 사람을 그리지 않는다. 아민만 나온다. 학생은 {name} 문구로만 존재
     · 장면 그림 자체가 글자를 품는다. 확대용 사물만 닮으면 안 된다
     · 낱자 이름은 한 번만 재생한다. 뒤에 음가를 붙이지 않는다
     · 효과음은 말이 아니라 Web Audio 합성음 (snore splash spray bang thud creak chime)
   ============================================================ */

var CHAPTERS = [
  {
    id: 'ch1', title: 'A Bad Morning', kr: '고약한 아침', letters: 'ㄱ ㄴ ㄷ',
    beats: [
      { kind:'open', img:'story-0-sleep', sfx:'snore',
        cap:'<em>{name}</em> woke up early and felt like playing a trick.<br>Amin was still fast asleep.',
        hint:'Three letters are hiding in this chapter. Watch the shapes.' },

      { kind:'scene', letter:'ㄱ', img:'story-1-gun', fx:'splash', sfx:'splash',
        cap:'So <em>{name}</em> fired a water gun at him. <b>SPLASH!</b>',
        hint:'Now look at the water gun itself…' },
      { kind:'zoom', letter:'ㄱ', obj:'mn-g-gun', focus:'78% 38%',
        rom:'g / k', mn:'A <b>G</b>un. <b>G</b>.', voice:'sound-g', nameVoice:'letter-g', word:'word-gabang', wordKr:'가방', wordEn:'bag',
        cap:'Barrel across the top, grip straight down.<br>That corner <b>is</b> the letter.' },

      { kind:'scene', letter:'ㄴ', img:'story-2-nose', fx:'splash', sfx:'spray',
        cap:'The water shot straight up his <b>nose</b>.',
        hint:'Now look at that nose from the side…' },
      { kind:'zoom', letter:'ㄴ', obj:'mn-n-nose', focus:'22% 44%',
        rom:'n', mn:'A <b>N</b>ose in profile. <b>N</b>.', voice:'sound-n', nameVoice:'letter-n', word:'word-namu', wordKr:'나무', wordEn:'tree',
        cap:'Down the bridge, then out along the base.' },

      { kind:'scene', letter:'ㄷ', img:'story-3-door', fx:'shake', sfx:'bang',
        cap:'Furious, Amin kicked the <b>door</b> off its hinges to chase <em>{name}</em>.',
        hint:'Look at what is left standing…' },
      { kind:'zoom', letter:'ㄷ', obj:'mn-d-door', focus:'26% 50%',
        rom:'d / t', mn:'A <b>D</b>oorway. <b>D</b>.', voice:'sound-d', nameVoice:'letter-d', word:'word-dari', wordKr:'다리', wordEn:'bridge, leg',
        cap:'Top, side, bottom, and wide open on the right.' }
    ]
  },

  {
    id: 'ch2', title: 'The Chase', kr: '추격', letters: 'ㄹ ㅁ ㅂ ㅅ',
    beats: [
      { kind:'scene', letter:'ㄹ', img:'story-4-ladder', sfx:'creak',
        cap:'<em>{name}</em> was over the garden wall already.<br>Amin found a folding <b>ladder</b> and went up.',
        hint:'Three steps, zigzagging…' },
      { kind:'zoom', letter:'ㄹ', obj:'mn-r-ladder', focus:'50% 50%',
        rom:'r / l', mn:'A folded <b>L</b>adde<b>r</b>: that in-between R/L sound.',
        voice:'sound-r', nameVoice:'letter-r', word:'word-radio', wordKr:'라디오', wordEn:'radio',
        cap:'Right, back left, right again.<br>The zigzag <b>is</b> the letter.' },

      { kind:'scene', letter:'ㅁ', img:'story-5-parcel', fx:'shake', sfx:'thud',
        cap:'He came down the other side: straight into a square <b>parcel</b>.',
        hint:'Four straight sides…' },
      { kind:'zoom', letter:'ㅁ', obj:'mn-m-mail', focus:'50% 50%',
        rom:'m', mn:'A square piece of <b>M</b>ail. <b>M</b>.',
        voice:'sound-m', nameVoice:'letter-m', word:'word-mul', wordKr:'물', wordEn:'water',
        cap:'A closed box. Nothing gets out.' },

      { kind:'scene', letter:'ㅂ', img:'story-6-bucket', fx:'splash', sfx:'splash',
        cap:'Climbing out, he stepped right into a <b>bucket</b>. Wet again.',
        hint:'Look at the two handles standing up…' },
      { kind:'zoom', letter:'ㅂ', obj:'mn-b-bucket', focus:'50% 50%',
        rom:'b / p', mn:'A <b>B</b>ucket with two handles. <b>B</b>.',
        voice:'sound-b', nameVoice:'letter-b', word:'word-bada', wordKr:'바다', wordEn:'the sea',
        cap:'Two posts up, two bars across.' },

      { kind:'scene', letter:'ㅅ', img:'story-7-shell', sfx:'chime',
        cap:'The chase reached the shore, and he stubbed his foot on a <b>seashell</b>.',
        hint:'A fan opening downward…' },
      { kind:'zoom', letter:'ㅅ', obj:'mn-s-seashell', focus:'50% 52%',
        rom:'s', mn:'A <b>S</b>eashell. <b>S</b>.',
        voice:'sound-s', nameVoice:'letter-s', word:'word-san', wordKr:'산', wordEn:'mountain',
        cap:'One point at the top, two legs spreading down.' }
    ]
  },

  {
    id: 'ch3', title: 'At the Shore', kr: '바닷가', letters: 'ㅇ ㅈ ㅊ ㅋ',
    beats: [
      { kind:'scene', letter:'ㅇ', img:'story-8-ring', sfx:'chime',
        cap:'Something glinted in the sand. A gold <b>ring</b>.',
        hint:'The simplest shape of all…' },
      { kind:'zoom', letter:'ㅇ', obj:'mn-ng-ring', focus:'50% 50%',
        rom:'(silent) / ng', mn:'A <b>ring</b>: silent at the front, <b>ng</b> at the bottom.',
        voice:'sound-ng', nameVoice:'letter-ng', word:'word-uyu', wordKr:'우유', wordEn:'milk',
        cap:'At the start of a block it makes no sound at all.<br>It is just holding the seat.' },

      { kind:'scene', letter:'ㅈ', img:'story-9-jug', sfx:'pour',
        cap:'All that running made him thirsty. He found a water <b>jug</b>.',
        hint:'A flat lid, and the body opening out below…' },
      { kind:'zoom', letter:'ㅈ', obj:'mn-j-jug', focus:'50% 48%',
        rom:'j / ch', mn:'A <b>J</b>ug. <b>J</b>.',
        voice:'sound-j', nameVoice:'letter-j', word:'word-jip', wordKr:'집', wordEn:'house, home',
        cap:'A bar on top, spout and handle flaring down.' },

      { kind:'scene', letter:'ㅊ', img:'story-10-church', sfx:'bell',
        cap:'Up on the hill a little <b>church</b> bell started ringing.',
        hint:'A spike, a roof, and walls going down…' },
      { kind:'zoom', letter:'ㅊ', obj:'mn-ch-church', focus:'50% 50%',
        rom:'ch', mn:'A <b>CH</b>urch with a steeple hat. <b>CH</b>.',
        voice:'sound-ch', nameVoice:'letter-ch', word:'word-chingu', wordKr:'친구', wordEn:'friend',
        cap:'It is ㅈ with a hat on.<br>That hat is the extra puff of air.' },

      { kind:'scene', letter:'ㅋ', img:'story-11-key', sfx:'chime',
        cap:'And there by the door: his own house <b>key</b>, dropped in the grass.',
        hint:'Look at the teeth hanging down…' },
      { kind:'zoom', letter:'ㅋ', obj:'mn-k-key', focus:'50% 50%',
        rom:'k', mn:'A <b>K</b>ey. <b>K</b>.',
        voice:'sound-k', nameVoice:'letter-k', word:'word-keopi', wordKr:'커피', wordEn:'coffee',
        cap:'It is ㄱ with one extra bar.<br>The extra bar is the extra air.' }
    ]
  },

  {
    id: 'ch4', title: 'Back Home', kr: '집으로', letters: 'ㅌ ㅍ ㅎ',
    beats: [
      { kind:'scene', letter:'ㅌ', img:'story-12-tooth', fx:'shake', sfx:'thud',
        cap:'He bit into a rock-hard biscuit, and out came a <b>tooth</b>.',
        hint:'On its side, two roots pointing out…' },
      { kind:'zoom', letter:'ㅌ', obj:'mn-t-tooth', focus:'50% 50%',
        rom:'t', mn:'A <b>T</b>ooth on its side. <b>T</b>.',
        voice:'sound-t', nameVoice:'letter-t', word:'word-tokki', wordKr:'토끼', wordEn:'rabbit',
        cap:'It is ㄷ with one extra bar.<br>Again: extra bar, extra air.' },

      { kind:'scene', letter:'ㅍ', img:'story-13-porch', sfx:'thud',
        cap:'He dragged himself the last few steps onto his own <b>porch</b>.',
        hint:'A beam on top, two posts, a deck below…' },
      { kind:'zoom', letter:'ㅍ', obj:'mn-p-porch', focus:'50% 50%',
        rom:'p', mn:'A <b>P</b>orch. <b>P</b>.',
        voice:'sound-p', nameVoice:'letter-p', word:'word-pijeu', wordKr:'피자', wordEn:'pizza',
        cap:'A beam across the top, two posts, a deck across the bottom.<br>Four strokes, and it is the letter.' },

      { kind:'scene', letter:'ㅎ', img:'story-14-hat', sfx:'chime',
        cap:'Then the wind dropped a <b>hat</b> on his head, and Amin finally laughed.',
        hint:'A knob, a brim, and a round head…' },
      { kind:'zoom', letter:'ㅎ', obj:'mn-h-hat', focus:'50% 50%',
        rom:'h', mn:'A <b>H</b>ead in a hat. <b>H</b>.',
        voice:'sound-h', nameVoice:'letter-h', word:'word-hakgyo', wordKr:'학교', wordEn:'school',
        cap:'A little knob, a wide brim, a circle underneath.' },

      { kind:'recap',
        cap:'That is every basic consonant in Korean: all fourteen of them.<br>' +
            '<b class="kr">ㄱ ㄴ ㄷ ㄹ ㅁ ㅂ ㅅ ㅇ ㅈ ㅊ ㅋ ㅌ ㅍ ㅎ</b>',
        hint:'Tap any letter to hear it. Tap the word to hear a real word using it.' }
    ]
  }
];

/* 획 데이터. 100×100 좌표계, 사물 사진에 맞춰 눈으로 정합 확인함 */
var STROKES = {
  'ㄱ':['M10,26 H78 L72,82'],
  'ㄴ':['M48,10 L28,66 H74'],
  'ㄷ':['M17,11 H58','M17,11 V77 H57'],
  'ㄹ':['M22,20 H76 V44','M22,44 H76','M22,44 V76 H80'],
  'ㅁ':['M22,20 V80','M22,20 H78 V80','M22,80 H78'],
  'ㅂ':['M22,18 V82','M78,18 V82','M22,52 H78','M22,82 H78'],
  'ㅅ':['M50,20 L22,84','M50,20 L78,84'],
  'ㅇ':['M50,20 a30,30 0 1,0 0.1,0'],
  'ㅈ':['M20,24 H80','M50,24 L24,84','M50,24 L76,84'],
  'ㅊ':['M38,12 H62','M20,36 H80','M50,36 L26,86','M50,36 L74,86'],
  'ㅋ':['M18,24 H80 L64,84','M32,52 H74'],
  'ㅌ':['M20,22 H80','M20,50 H78','M20,22 V78 H80'],
  'ㅍ':['M16,28 H84','M36,28 V72','M64,28 V72','M16,72 H84'],
  'ㅎ':['M36,12 H64','M20,34 H80','M50,48 a19,19 0 1,0 0.1,0']
};

if (typeof module !== 'undefined') module.exports = { CHAPTERS, STROKES };
