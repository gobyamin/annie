/* ============================================================
   선반 — 학생 한 명의 수업 목록 (전 학생 공용, 이 파일 하나뿐)

   학생 폴더에는 데이터(lessons.js, pack.js)만 둔다. 디자인은 여기 한 곳이다.
   학생이 열 개로 늘어도 고칠 곳은 여기다.

   얼굴은 앱 16개와 같은 것을 쓴다(한지·색동·낙관, apps/assets/_ui.css).
   선반이 앱으로 들어가는 문이라 다른 얼굴이면 딴 서비스처럼 보인다.

   지나간 회차 덱은 그때 만든 그대로 링크만 건다. 다시 굽지 않는다.
   덱을 다시 구우면 "이때 이걸 배웠구나" 가 성립하지 않는다.
   ============================================================ */

(function () {
  var A = '../../apps/';                        // 앱 한 벌은 전 학생이 같이 쓴다
  var BK = '../../bank/';
  var S = (typeof STUDENT !== 'undefined') ? STUDENT : { name: '', slug: '' };
  var B = (typeof BANK !== 'undefined') ? BANK : {};
  var L = (typeof LESSONS !== 'undefined') ? LESSONS.slice() : [];

  L.sort(function (a, b) { return (b.date || '').localeCompare(a.date || ''); });

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  /* 8월 7일 (금) — 학생이 읽는 건 영어지만 날짜는 짧게 */
  function when(iso) {
    var p = (iso || '').split('-');
    if (p.length !== 3) return iso || '';
    var d = new Date(+p[0], +p[1] - 1, +p[2]);
    var wd = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()];
    return (+p[1]) + '/' + (+p[2]) + ' ' + wd;
  }

  var pr = window.Progress || null;
  var state = pr ? pr.get() : { visited: {}, done: {} };

  /* 회차는 id 만 적는다. 한국어·영어·소리는 은행이 갖고 있다. */
  function resolve(x) {
    if (typeof x === 'string') return B[x] || { kr: x, en: '' };
    return x;
  }

  var KIND = { deck:'📖', pdf:'📄', app:'🎮', tool:'🧩', note:'✏️' };

  function itemHref(it) {
    if (it.kind === 'app') return A + it.app + '?s=' + encodeURIComponent(S.slug);
    return it.file;
  }

  function itemRow(it) {
    return '<a class="it" href="' + esc(itemHref(it)) + '"' +
      (it.kind === 'app' ? '' : ' target="_blank" rel="noopener"') + '>' +
      '<span class="ic">' + (KIND[it.kind] || KIND.note) + '</span>' +
      '<span class="lb">' + esc(it.label) +
      (it.sub ? '<small>' + esc(it.sub) + '</small>' : '') + '</span>' +
      '<span class="go">›</span></a>';
  }

  function lessonCard(x, isLatest) {
    var tags = (x.did || []).map(function (t) {
      return '<span class="tag">' + esc(t) + '</span>';
    }).join('');
    var items = (x.items || []).map(itemRow).join('');
    return '<section class="lesson' + (isLatest ? ' latest' : '') + '">' +
      '<div class="lhead">' +
        '<div class="seal">' + (x.n < 10 ? '0' + x.n : x.n) + '</div>' +
        '<div class="lmeta">' +
          '<div class="ldate">' + esc(when(x.date)) + (isLatest ? ' <b>· newest</b>' : '') + '</div>' +
          '<h2>' + esc(x.title || '') + '</h2>' +
        '</div>' +
      '</div>' +
      (tags ? '<div class="tags">' + tags + '</div>' : '') +
      (x.summary ? '<p class="sum">' + esc(x.summary) + '</p>' : '') +
      (items ? '<div class="items">' + items + '</div>'
             : '<p class="sum empty">Nothing to take home from this one.</p>') +
      '</section>';
  }

  /* 지금까지 배운 것 전부 — 이게 이 선반이 교재를 대신하는 지점이다.
     낱개 자료 스무 개는 교재가 아니다. 7과가 1~6과를 복습시켜야 교재다. */
  function allSoFar() {
    var out = [], seen = {};
    L.forEach(function (x) {
      (x.words || []).forEach(function (id) {
        var key = typeof id === 'string' ? id : (id.kr || '');
        if (seen[key]) return;
        seen[key] = 1;
        out.push(resolve(id));
      });
    });
    if (!out.length) return '';
    return '<section class="lesson sofar">' +
      '<div class="lhead"><div class="seal">\u2211</div><div class="lmeta">' +
        '<div class="ldate">every lesson</div><h2>Everything so far</h2></div></div>' +
      '<p class="sum">' + out.length + ' things you have met. Tap one to hear it again.</p>' +
      '<div class="words">' + out.map(function (w) {
        var has = w.mine || w.tts;
        return '<button class="w' + (has ? '' : ' mute') + '"' +
          ' data-mine="' + esc(w.mine || '') + '" data-tts="' + esc(w.tts || '') + '"' +
          (w.note ? ' title="' + esc(w.note) + '"' : '') + '>' +
          '<b class="kr">' + esc(w.kr) + '</b>' +
          (w.en ? '<small>' + esc(w.en) + '</small>' : '') +
          (has ? '<i class="spk">\uD83D\uDD0A</i>' : '') +
          '</button>';
      }).join('') + '</div>' +
      '<p class="sum tiny">The ones with a speaker are recorded. The rest are not, yet.</p>' +
      '</section>';
  }


  /* 할 수 있는 것. 회차가 켠 것은 날짜와 함께, 아직인 것은 흐리게.
     꺼진 것도 보여준다. 다음이 뭔지 알면 불안이 줄어든다.
     전체 대비 퍼센트는 절대 안 보인다. 남은 것을 세면 절망이 된다. */
  function canDo() {
    var LIST = (typeof CANDO !== 'undefined') ? CANDO : [];
    if (!LIST.length) return '';
    var when = {};
    L.forEach(function (x) {
      (x.can || []).forEach(function (id) {
        if (!when[id] || x.date < when[id]) when[id] = x.date;
      });
    });
    var done = LIST.filter(function (c) { return when[c.id]; });
    if (!done.length) return '';
    var rows = LIST.map(function (c) {
      var d = when[c.id];
      return '<li class="cd' + (d ? ' on' : '') + '">' +
        '<span class="bx">' + (d ? '✓' : '') + '</span>' +
        '<span class="tx">' + esc(c.en) +
        (d ? '<i>' + esc(whenShort(d)) + '</i>' : '') +
        (d && c.note ? '<small>' + esc(c.note) + '</small>' : '') +
        '</span></li>';
    }).join('');
    return '<section class="lesson cando">' +
      '<div class="lhead"><div class="seal">✓</div><div class="lmeta">' +
        '<div class="ldate">' + done.length + ' so far</div>' +
        '<h2>What you can do now</h2></div></div>' +
      '<p class="sum">Not a score. Just the things that actually work. ' +
        'The grey ones are what comes next, so you know where this is going.</p>' +
      '<ul class="cdlist">' + rows + '</ul>' +
      '</section>';
  }

  function whenShort(iso) {
    var p = (iso || '').split('-');
    return p.length === 3 ? (+p[1]) + '/' + (+p[2]) : iso;
  }

  document.title = (S.name ? S.name + ' · ' : '') + 'Korean';

  /* ── 오늘 할 것 ────────────────────────────────────────────
     선반 맨 위. 학생이 열었을 때 처음 보이는 것이 "5개만 하면 끝" 이어야 한다.
     목차가 먼저 보이면 안 연다. 덱은 아래로 내려 기록이 된다.

     한글을 읽을 수 있는지는 can-do 에서 자동으로 안다.
     자모 두 개가 켜져 있으면 읽는 것이고, 아니면 소리 방향만 연다.
     팩을 여기서 읽지 않는 이유는 선반이 pack.js 를 안 부르기 때문이다. */
  function reviewPool() {
    var out = [], seen = {};
    L.forEach(function (x) {
      (x.words || []).forEach(function (id) {
        if (typeof id !== 'string' || seen[id] || !B[id]) return;
        seen[id] = 1;
        var w = B[id];
        out.push({ id:id, kr:w.kr, en:w.en, tag:w.tag||'', mine:w.mine||'', tts:w.tts||'',
                   ask:w.ask||'' });
      });
    });
    return out;
  }
  function canReadHangul() {
    var on = {};
    L.forEach(function (x) { (x.can || []).forEach(function (c) { on[c] = 1; }); });
    return !!(on['cd-vowels'] && on['cd-cons']);
  }
  function weakIds() {
    var out = [];
    L.forEach(function (x) {
      (x.weak || []).forEach(function (id) { if (out.indexOf(id) < 0) out.push(id); });
    });
    return out;
  }

  var RV = null;
  if (window.Review) {
    RV = window.Review.init({
      slug: S.slug,
      teacher: 'Seungmin',
      pool: reviewPool(),
      weak: weakIds(),
      canRead: canReadHangul(),
      play: function (it) {
        if (it.mine) {
          loadVoiceBank(function () {
            var vb = (typeof VOICEBANK !== 'undefined') ? VOICEBANK : null;
            if (vb && vb[it.mine]) sound(vb[it.mine]);
            else if (it.tts) sound(A + 'assets/voice/' + it.tts + '.wav');
          });
        } else if (it.tts) sound(A + 'assets/voice/' + it.tts + '.wav');
      }
    });
  }

  /* ── 하단 탭 넷 ────────────────────────────────────────────
     전부 세로로 쌓으면 애니 기준 can-do 22줄 + 낱말 51개라 스크롤이 길다.
     길면 안 읽고, 안 읽으면 "오늘 할 것" 도 같이 묻힌다.

     아민 앱과 같은 방식이다. 그 앱 주석에 이유가 이렇게 적혀 있다.
       "전에는 화면마다 '← 홈' 을 찾아 눌러야 했습니다. 그건 웹페이지의 몸짓입니다.
        폰 앱은 엄지가 닿는 자리에 늘 같은 네 칸이 있고, 어디에 있든 한 번에 이동합니다."

     그래서 드릴다운을 아예 없앴다. 무엇이든 한 번 누르면 나온다.

     ⚠️ 아민·HSK 둘 다 비어 있던 두 가지를 여기서는 채운다.
        1) 탭을 바꾸면 스크롤을 맨 위로 (아민은 이게 없어서 위치가 남는다)
        2) 주소에 남겨서 새로고침해도 그 탭 (다만 replaceState 라 히스토리는 안 쌓는다.
           탭 다섯 번 누르고 뒤로 다섯 번 누르게 하지 않는다. 네이티브 앱과 같다) */
  var TABS = [
    { id:'today',  label:'Today'    },
    { id:'lessons',label:'Lessons'  },
    { id:'words',  label:'Words'    },
    { id:'me',     label:'Progress' }
  ];

  /* 아이콘은 인라인 SVG 에 stroke="currentColor". 이모지도 아이콘 폰트도 안 쓴다.
     켜진 탭 색 한 줄이면 글자와 그림이 같이 물든다. 의존성도 0 이다. */
  function icon(id) {
    var o = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" ' +
            'stroke="currentColor" stroke-width="1.9" stroke-linecap="round" ' +
            'stroke-linejoin="round" aria-hidden="true">';
    if (id === 'today')   return o + '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>';
    if (id === 'lessons') return o + '<path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H11v16H5.5A1.5 1.5 0 0 1 4 18.5z"/>' +
                                     '<path d="M20 5.5A1.5 1.5 0 0 0 18.5 4H13v16h5.5a1.5 1.5 0 0 0 1.5-1.5z"/></svg>';
    if (id === 'words')   return o + '<rect x="9" y="3" width="6" height="11" rx="3"/>' +
                                     '<path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>';
    return o + '<path d="M4 19V5M4 19h16M8 16v-4M12 16V8M16 16v-6"/></svg>';
  }

  var PANE = {
    today:   function () {
      return '<div id="rvHost">' + (RV ? RV.cardHtml() : '') + '</div>' +
        (RV && RV.pool.length ? '' :
          '<section class="lesson"><p class="sum">Nothing to review yet. ' +
          'After your next lesson this is where it starts.</p></section>') +
        '<div class="foot">Made for ' + esc(S.name || 'you') + '.</div>';
    },
    lessons: function () {
      return (L.length
        ? L.map(function (x, i) { return lessonCard(x, i === 0); }).join('')
        : '<section class="lesson"><p class="sum empty">No lessons yet.</p></section>') +
        '<div class="foot">Old lessons never change, ' +
        'so you can always come back to them.</div>';
    },
    words:   function () {
      return allSoFar() ||
        '<section class="lesson"><p class="sum empty">No words yet.</p></section>';
    },
    me:      function () {
      return canDo() ||
        '<section class="lesson"><p class="sum empty">' +
        'This fills up as you go.</p></section>';
    }
  };

  document.body.innerHTML =
    '<div class="app has-tabbar">' +
      '<header class="top">' +
        '<h1><span class="hseal kr">한</span>' + esc(S.name ? S.name + '’s Korean' : 'Korean') + '</h1>' +
        '<div class="sub" id="shSub"></div>' +
      '</header>' +
      '<main id="shPane"></main>' +
    '</div>' +
    '<nav class="tabbar" id="shTabs">' +
      TABS.map(function (t) {
        return '<button class="tab" data-tab="' + t.id + '" aria-label="' + esc(t.label) + '">' +
          '<span class="tab-icon">' + icon(t.id) + '</span>' +
          '<span class="tab-label">' + esc(t.label) + '</span></button>';
      }).join('') +
    '</nav>';

  var SUB = {
    today:   'Five things. That is the whole ask.',
    lessons: L.length + ' lesson' + (L.length === 1 ? '' : 's') + ' so far. Newest first.',
    words:   'Everything you have met. Tap one to hear it.',
    me:      'What actually works now.'
  };

  var pane = document.getElementById('shPane');
  var sub = document.getElementById('shSub');
  var tab = '';

  function show(id, push) {
    if (!PANE[id]) id = 'today';
    tab = id;
    pane.innerHTML = PANE[id]();
    sub.textContent = SUB[id];
    document.querySelectorAll('#shTabs .tab').forEach(function (b) {
      var on = b.getAttribute('data-tab') === id;
      b.className = on ? 'tab tab-on' : 'tab';
      if (on) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current');
    });
    /* 아민이 비워둔 자리. 탭을 바꿨는데 스크롤이 남아 있으면 딴 화면처럼 보인다 */
    try { window.scrollTo(0, 0); } catch (e) {}
    if (push && history.replaceState) {
      try { history.replaceState(null, '', '#' + id); } catch (e) {}
    }
  }

  document.getElementById('shTabs').addEventListener('click', function (e) {
    var t = e.target;
    while (t && t !== this && !t.getAttribute('data-tab')) t = t.parentNode;
    if (!t || t === this) return;
    show(t.getAttribute('data-tab'), true);
  });

  show((location.hash || '').replace(/^#/, '') || 'today', false);

  /* ── 소리 ──────────────────────────────────────────────────
     선생님 목소리 은행은 428KB 라 처음부터 받지 않는다.
     학생이 단어를 처음 누를 때 그때 script 로 끌어온다.
     file:// 에서는 fetch 가 막히므로 script 태그여야 한다. */
  var vbState = 'idle', vbQueue = [];
  function loadVoiceBank(then) {
    /* 이미 들어와 있으면 기다리지 않는다. 안 그러면 다른 경로로 은행이
       먼저 올라온 경우에 콜백이 영영 대기한다 (소리가 조용히 안 남) */
    if (vbState !== 'ready' && typeof VOICEBANK !== 'undefined') vbState = 'ready';
    if (vbState === 'ready' || vbState === 'failed') { then(); return; }
    vbQueue.push(then);
    if (vbState === 'loading') return;
    vbState = 'loading';
    var sc = document.createElement('script');
    sc.src = BK + 'voice.js';
    sc.onload = function () {
      vbState = (typeof VOICEBANK !== 'undefined') ? 'ready' : 'failed';
      vbQueue.splice(0).forEach(function (f) { f(); });
    };
    sc.onerror = function () {
      vbState = 'failed';
      vbQueue.splice(0).forEach(function (f) { f(); });
    };
    document.head.appendChild(sc);
  }

  var playing = null;
  function sound(src) {
    if (playing) { try { playing.pause(); } catch (e) {} }
    try {
      playing = new Audio(src);
      var p = playing.play();
      if (p && p.catch) p.catch(function () {});
    } catch (e) {}
  }

  document.addEventListener('click', function (e) {
    var t = e.target;
    while (t && t !== document && !(t.classList && t.classList.contains('w'))) t = t.parentNode;
    if (!t || t === document) return;
    var mine = t.getAttribute('data-mine'), tts = t.getAttribute('data-tts');
    if (mine) {
      t.classList.add('busy');
      loadVoiceBank(function () {
        t.classList.remove('busy');
        var vb = (typeof VOICEBANK !== 'undefined') ? VOICEBANK : null;
        if (vb && vb[mine]) sound(vb[mine]);
        else if (tts) sound(A + 'assets/voice/' + tts + '.wav');
      });
      return;
    }
    if (tts) sound(A + 'assets/voice/' + tts + '.wav');
  });

  /* 오늘 할 것 시작. 카드는 다시 그려지므로 위임으로 받는다.
     복습은 첫 문제부터 소리가 필요해서, 열기 전에 은행을 미리 받아둔다.
     1.1MB 라 처음 누를 때 한 번 기다린다. 그다음부터는 즉시 열린다. */
  document.addEventListener('click', function (e) {
    var t = e.target;
    while (t && t !== document && t.id !== 'rvGo') t = t.parentNode;
    if (!t || t === document || !RV) return;
    t.disabled = true;
    var was = t.textContent;
    t.textContent = 'One moment…';
    loadVoiceBank(function () {
      t.disabled = false; t.textContent = was;
      RV.start();
    });
  });

  if (pr) pr.visit('shelf');
})();
