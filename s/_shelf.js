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

  document.body.innerHTML =
    '<header class="top">' +
      '<h1><span class="hseal kr">한</span>' + esc(S.name ? S.name + '’s Korean' : 'Korean') + '</h1>' +
      '<div class="sub">' + L.length + ' lesson' + (L.length === 1 ? '' : 's') + ' so far. ' +
        'Newest first. Everything stays here.</div>' +
    '</header>' +
    '<main>' +
      canDo() +
      L.map(function (x, i) { return lessonCard(x, i === 0); }).join('') +
      allSoFar() +
      '<div class="foot">Made for ' + esc(S.name || 'you') + '. ' +
        'Old lessons never change, so you can always come back to them.</div>' +
    '</main>';

  /* ── 소리 ──────────────────────────────────────────────────
     선생님 목소리 은행은 428KB 라 처음부터 받지 않는다.
     학생이 단어를 처음 누를 때 그때 script 로 끌어온다.
     file:// 에서는 fetch 가 막히므로 script 태그여야 한다. */
  var vbState = 'idle', vbQueue = [];
  function loadVoiceBank(then) {
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

  if (pr) pr.visit('shelf');
})();
