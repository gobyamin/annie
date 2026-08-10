/* ============================================================
   오늘 할 것 — 30~40초짜리 복습 (전 학생 공용, 이 파일 하나뿐)

   왜 이게 필요한가: 선반이 덱으로 가는 목차이기만 하면 복습이 안 된다.
   덱은 한 번 읽고 끝나는 물건이다. 학생이 링크를 열었을 때 처음 보이는 것이
   "5개만 하면 끝"이어야 연다. 목차가 먼저 보이면 안 연다.

   설계에서 정한 것 (바꾸려면 이 주석부터 고칠 것)
     · 하루 5문제. 3개는 열었다는 느낌이 안 남고 10개는 안 연다
     · 연속 기록(streak) 대신 이번 주 횟수. 연속은 하루 놓치면
       그만두는 이유가 되어서 오히려 해가 된다
     · 낱말 하나에 상태 하나. 방향마다 따로 두면 상태가 4배로 늘고
       복습량도 4배가 된다. 대신 익을수록 어려운 방향으로 올린다
     · 전체 대비 퍼센트는 절대 안 보인다. 남은 것을 세면 절망이 된다

   ⚠️ 방향은 학생 상태에 따라 열린다.
      한글을 아직 모르는 학생(pack 에 letters 가 없음)에게 글자를 들이밀면
      화면이 백지가 되거나 못 읽는 것을 묻게 된다. 소리 방향만 연다.

   클래스는 전부 rv- 접두사를 쓴다. 선반·앱과 부딪히지 않게.
   ============================================================ */

(function () {

  /* ── 상태 ────────────────────────────────────────────────
     학생마다 JSON 한 덩어리. 나중에 서버로 통째로 옮길 수 있는 모양이다.
     브라우저에만 있으므로 기기를 옮기면 사라진다. 알고 있는 한계다. */
  var KEY, ST;

  function today() {
    var d = new Date();
    return d.getFullYear() + '-' +
      ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
  }
  function plusDays(n) {
    var d = new Date(); d.setDate(d.getDate() + n);
    return d.getFullYear() + '-' +
      ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
  }

  function load(slug) {
    KEY = 'korean.' + slug;
    try { ST = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { ST = null; }
    if (!ST || ST.v !== 1) ST = { v: 1, words: {}, days: [] };
    if (!ST.words) ST.words = {};
    if (!ST.days) ST.days = [];
    return ST;
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(ST)); } catch (e) {}
  }

  /* 이번 주 몇 번 했나. 월요일 시작 */
  function weekCount() {
    var d = new Date(), dow = (d.getDay() + 6) % 7;   // 월=0
    d.setDate(d.getDate() - dow);
    var mon = d.getFullYear() + '-' +
      ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
    return ST.days.filter(function (x) { return x >= mon; }).length;
  }
  function doneToday() { return ST.days.indexOf(today()) >= 0; }

  /* ── 상자 ────────────────────────────────────────────────
     맞히면 한 칸 위로, 틀리면 1번으로. 간격은 주 2회 수업 기준이다. */
  var GAP = [0, 1, 2, 5, 12, 30];
  function bump(id, ok) {
    var w = ST.words[id] || { box: 1, due: today(), wrong: 0 };
    if (ok) w.box = Math.min(w.box + 1, GAP.length - 1);
    else { w.box = 1; w.wrong = (w.wrong || 0) + 1; }
    w.due = plusDays(GAP[w.box]);
    ST.words[id] = w;
  }

  /* ── 방향 ────────────────────────────────────────────────
     hear-mean  소리 듣고 뜻 고르기          가장 쉬움
     read-mean  글자 보고 뜻 고르기          한글을 읽어야 함
     hear-read  소리 듣고 글자 고르기        한글을 읽어야 함
     mean-recall 뜻 보고 떠올리기 → 스스로 확인  가장 어려움

     익을수록 어려운 쪽으로 올린다. 같은 낱말이 반복되는데 매번 조금씩
     어려워지므로 상태는 낱말당 하나로 단순하게 유지된다. */
  /* 긴 것은 보기로 못 낸다. 문장 넷을 늘어놓으면 읽다가 끝난다.
     나중에 문장이 들어와도 이 한 줄이 알아서 걸러준다. */
  function isLong(it) {
    return (it.kr || '').replace(/\s/g, '').length >= 6 || /\s/.test((it.kr || '').trim());
  }

  function pickDir(box, canRead, it) {
    /* ⚠️ 말하기가 가운데다. 끝이 아니다.
       고르기는 알아보는 능력만 늘리고 말할 때는 안 나온다.
       5단계 중 3단계를 말하기로 둔 것은 그래서다. */
    if (it && isLong(it) && box > 1) return 'say';    // 문장·긴 표현은 바로 말하기로
    if (box <= 2) return 'hear-mean';                 // 처음엔 알아보기. 이때는 이게 맞다
    if (box === 3) return canRead ? 'read-mean' : 'say';
    if (box === 4) return 'say';
    return canRead ? 'hear-read' : 'say';
  }

  /* ── 오늘 뽑기 ───────────────────────────────────────────
     순서: 선생님이 찍은 약점 → 복습 때 된 것 → 최근 회차 → 나머지 */
  function pickToday(pool, weak, n) {
    var t = today(), rank = {};
    pool.forEach(function (w, i) {
      var st = ST.words[w.id];
      var r;
      if (weak.indexOf(w.id) >= 0) r = 0;
      else if (st && st.due <= t) r = 1;
      else if (!st) r = 2;                 // 아직 한 번도 안 나온 것
      else r = 3;
      rank[w.id] = r * 1000 + i;
    });
    return pool.slice()
      .sort(function (a, b) { return rank[a.id] - rank[b.id]; })
      .slice(0, n);
  }

  /* 보기 3개. 같은 분류에서 먼저 뽑는다. 헷갈려야 실력이 된다 */
  function distractors(item, pool, n) {
    var same = pool.filter(function (w) {
      return w.id !== item.id && w.tag === item.tag;
    });
    var rest = pool.filter(function (w) {
      return w.id !== item.id && w.tag !== item.tag;
    });
    shuffle(same); shuffle(rest);
    return same.concat(rest).slice(0, n);
  }
  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  /* ── 겉모습 ──────────────────────────────────────────────
     선반·앱과 같은 얼굴을 쓴다. 색은 _ui.css 의 변수에서 가져온다 */
  var CSS =
  '.rv-card{background:var(--card);border:3px solid var(--line);border-radius:18px;' +
  'box-shadow:var(--sh);padding:18px 18px 16px;margin:0 0 18px}' +
  '.rv-card h2{margin:0 0 4px;font-size:20px;letter-spacing:-.01em}' +
  '.rv-card p{margin:0 0 14px;color:var(--muted);font-weight:600;font-size:14px;line-height:1.5}' +
  '.rv-go{display:block;width:100%;background:var(--seal);color:var(--seal-ink);' +
  'border:0;border-radius:13px;padding:15px;font:inherit;font-weight:800;font-size:17px;' +
  'cursor:pointer;box-shadow:0 4px 0 var(--seal-rim)}' +
  '.rv-go:active{transform:translateY(3px);box-shadow:none}' +
  '.rv-go[disabled]{opacity:.55;cursor:default;transform:none;box-shadow:0 4px 0 var(--seal-rim)}' +
  '.rv-week{display:flex;gap:5px;margin:0 0 13px}' +
  '.rv-week i{width:22px;height:7px;border-radius:4px;background:var(--line)}' +
  '.rv-week i.on{background:var(--seal)}' +
  '.rv-more{display:block;width:100%;margin-top:9px;background:none;border:0;' +
  'color:var(--muted);font:inherit;font-weight:700;font-size:13px;cursor:pointer;' +
  'text-decoration:underline;padding:6px}' +

  '.rv-wrap{position:fixed;inset:0;background:var(--bg);z-index:9999;' +
  'display:flex;flex-direction:column;overflow-y:auto}' +
  '.rv-bar{display:flex;gap:5px;padding:16px 18px 0}' +
  '.rv-bar i{flex:1;height:6px;border-radius:3px;background:var(--line)}' +
  '.rv-bar i.on{background:var(--seal)}' +
  '.rv-x{position:absolute;top:12px;right:14px;background:none;border:0;' +
  'font-size:26px;line-height:1;color:var(--muted);cursor:pointer;padding:6px 10px}' +
  '.rv-q{flex:1;display:flex;flex-direction:column;justify-content:center;' +
  'padding:30px 18px;max-width:520px;margin:0 auto;width:100%;box-sizing:border-box}' +
  '.rv-ask{text-align:center;margin-bottom:26px}' +
  '.rv-hint{color:var(--muted);font-weight:700;font-size:13px;margin-bottom:14px}' +
  '.rv-big{font-size:40px;font-weight:800;letter-spacing:-.02em;line-height:1.25}' +
  '.rv-mid{font-size:26px;font-weight:800;line-height:1.3}' +
  '.rv-spk{width:96px;height:96px;border-radius:50%;border:3px solid var(--line);' +
  'background:var(--card);box-shadow:var(--sh);font-size:38px;cursor:pointer;' +
  'display:inline-flex;align-items:center;justify-content:center}' +
  '.rv-spk:active{transform:translateY(3px)}' +
  '.rv-opts{display:grid;gap:10px}' +
  '.rv-opt{background:var(--card);border:3px solid var(--line);border-radius:14px;' +
  'padding:15px 16px;font:inherit;font-weight:700;font-size:16px;text-align:left;' +
  'cursor:pointer;box-shadow:var(--sh);color:var(--ink)}' +
  '.rv-opt:active{transform:translate(2px,2px);box-shadow:1px 1px 0 var(--line)}' +
  '.rv-opt .k{display:block;font-size:22px;font-weight:800;margin-bottom:2px}' +
  '.rv-opt.ok{border-color:#3aa000;background:#eefbe6}' +
  '.rv-opt.no{border-color:#e04141;background:#fdecec;opacity:.9}' +
  '.rv-opt[disabled]{cursor:default}' +
  '.rv-tell{margin-top:18px;text-align:center;font-weight:700;font-size:15px;' +
  'color:var(--muted);line-height:1.6}' +
  '.rv-tell b{color:var(--ink);font-size:19px}' +
  '.rv-next{margin-top:16px;width:100%;background:var(--seal);color:var(--seal-ink);' +
  'border:0;border-radius:13px;padding:14px;font:inherit;font-weight:800;font-size:16px;' +
  'cursor:pointer;box-shadow:0 4px 0 var(--seal-rim)}' +
  '.rv-next:active{transform:translateY(3px);box-shadow:none}' +
  '.rv-self{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:16px}' +

  /* 말하기 — 녹음 단추. 멈춤 버튼은 없다. 말이 끝나면 알아서 선다 */
  '.rv-mic{position:relative;width:112px;height:112px;border-radius:50%;' +
  'border:3px solid var(--line);background:var(--card);box-shadow:var(--sh);' +
  'font-size:40px;cursor:pointer;display:inline-flex;align-items:center;' +
  'justify-content:center;color:var(--ink);padding:0}' +
  '.rv-mic:active{transform:translateY(3px)}' +
  '.rv-mic.rec{border-color:var(--red);background:#fff0f0}' +
  /* 음량 고리. 자동 정지는 보이지 않으면 못 믿는다 */
  '.rv-mic .ring{position:absolute;inset:-9px;border-radius:50%;border:3px solid var(--red);' +
  'opacity:0;transform:scale(.9);pointer-events:none;transition:transform .08s,opacity .08s}' +
  '.rv-mic.rec .ring{opacity:.55}' +
  '.rv-say{margin-top:14px;color:var(--muted);font-weight:700;font-size:13.5px;min-height:19px}' +
  '.rv-pair{display:grid;gap:9px;margin-top:16px}' +
  '.rv-pl{display:flex;align-items:center;gap:11px;background:var(--card);' +
  'border:3px solid var(--line);border-radius:14px;padding:12px 14px;box-shadow:var(--sh1);' +
  'font:inherit;font-weight:800;font-size:15px;color:var(--ink);cursor:pointer;text-align:left}' +
  '.rv-pl:active{transform:translate(2px,2px);box-shadow:none}' +
  '.rv-pl .who{flex:1;min-width:0}' +
  '.rv-pl .who small{display:block;color:var(--muted);font-weight:700;font-size:12px;margin-top:1px}' +
  '.rv-pl.mine{background:var(--amber)}' +
  '.rv-warn{margin-top:12px;color:var(--muted);font-weight:700;font-size:12.5px;line-height:1.5}' +
  '.rv-end{text-align:center;padding:40px 18px}' +
  '.rv-end .big{font-size:52px;margin-bottom:10px}' +
  '.rv-end h2{font-size:26px;margin:0 0 8px}' +
  '.rv-end p{color:var(--muted);font-weight:600;margin:0 0 22px;line-height:1.6}';

  function css() {
    if (document.getElementById('rv-css')) return;
    var s = document.createElement('style');
    s.id = 'rv-css'; s.textContent = CSS;
    document.head.appendChild(s);
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  /* ── 공개 ────────────────────────────────────────────────
     선반이 부른다. pool 은 [{id,kr,en,tag,mine,tts}], play 는 소리 재생 함수 */
  window.Review = {
    init: function (opt) {
      load(opt.slug);
      css();
      this.canRead = !!opt.canRead;

      /* 한글을 못 읽는 학생에게 소리 없는 낱말은 죽은 문제다.
         정답을 글자로 보여줘도 못 읽고, 들려줄 소리도 없다.
         녹음이 되면 자동으로 다시 들어온다. */
      var cr = this.canRead;
      this.pool = (opt.pool || []).filter(function (w) {
        return cr || w.mine || w.tts;
      });
      this.dropped = (opt.pool || []).length - this.pool.length;

      this.weak = opt.weak || [];
      this.play = opt.play || function () {};
      this.slug = opt.slug;
      this.teacher = opt.teacher || 'Teacher';
      this.mic = null;
      this.N = 5;
      return this;
    },

    /* 선반 맨 위에 놓을 카드 */
    cardHtml: function () {
      if (!this.pool.length) return '';
      var wc = weekCount(), done = doneToday();
      var dots = '';
      for (var i = 0; i < 7; i++) dots += '<i class="' + (i < wc ? 'on' : '') + '"></i>';

      if (done) {
        return '<section class="rv-card">' +
          '<h2>Done for today</h2>' +
          '<div class="rv-week">' + dots + '</div>' +
          '<p>' + wc + ' ' + (wc === 1 ? 'day' : 'days') + ' this week. ' +
            'Come back tomorrow, that is all it takes.</p>' +
          '<button class="rv-more" id="rvGo">One more round anyway</button>' +
          '</section>';
      }
      return '<section class="rv-card">' +
        '<h2>Today</h2>' +
        (wc ? '<div class="rv-week">' + dots + '</div>' : '') +
        '<p>' + this.N + ' things. About forty seconds.' +
          (wc ? ' ' + wc + ' ' + (wc === 1 ? 'day' : 'days') + ' this week so far.' : '') +
        '</p>' +
        '<button class="rv-go" id="rvGo">Start</button>' +
        '</section>';
    },

    start: function () {
      var self = this;
      var q = pickToday(this.pool, this.weak, this.N);
      if (!q.length) return;

      var wrap = document.createElement('div');
      wrap.className = 'rv-wrap';
      document.body.appendChild(wrap);
      var i = 0, right = 0;
      var recording = false, curCleanup = null;
      var S_NAME = self.teacher || 'Teacher';

      /* 내 녹음처럼 은행 밖의 소리를 틀 때. self.play 는 은행 항목만 받는다 */
      var beep = null;
      function sfx(url) {
        try { if (beep) beep.pause(); } catch (e) {}
        try { beep = new Audio(url); var p = beep.play(); if (p && p.catch) p.catch(function () {}); }
        catch (e) {}
      }

      function close() {
        /* ⚠️ 마이크를 반드시 놓아준다. 안 그러면 탭의 녹음 표시가 켜진 채 남는다.
           아민월드가 걸음마다 STEP_CLEANUP 을 두는 이유가 이것이다. */
        if (curCleanup) { try { curCleanup(); } catch (e) {} curCleanup = null; }
        if (self.mic) { self.mic.release(); self.mic = null; }
        try { if (beep) beep.pause(); } catch (e) {}
        if (wrap.parentNode) wrap.parentNode.removeChild(wrap);
        /* 선반의 카드를 새로 그린다 */
        var host = document.getElementById('rvHost');
        if (host) {
          host.innerHTML = self.cardHtml();
        }
      }

      function bar() {
        var h = '';
        for (var k = 0; k < q.length; k++) h += '<i class="' + (k < i ? 'on' : '') + '"></i>';
        return '<div class="rv-bar">' + h + '</div>' +
               '<button class="rv-x" title="close">×</button>';
      }

      function finish() {
        var t = today();
        if (ST.days.indexOf(t) < 0) ST.days.push(t);
        save();
        var wc = weekCount();
        wrap.innerHTML =
          '<div class="rv-end">' +
            '<div class="big">✓</div>' +
            '<h2>Done</h2>' +
            '<p>' + right + ' of ' + q.length + ' first time.<br>' +
              'That is ' + wc + ' ' + (wc === 1 ? 'day' : 'days') + ' this week.</p>' +
            '<button class="rv-next" id="rvClose">Back</button>' +
          '</div>';
        wrap.querySelector('#rvClose').addEventListener('click', close);
      }

      function step() {
        /* 앞 문제가 마이크나 타이머를 쥐고 있으면 여기서 끊는다 */
        if (curCleanup) { try { curCleanup(); } catch (e) {} curCleanup = null; }
        if (i >= q.length) { finish(); return; }
        var it = q[i];
        var st = ST.words[it.id];
        var box = st ? st.box : 1;
        var dir = pickDir(box, self.canRead, it);

        /* 소리가 없으면 소리를 요구하는 방향은 못 쓴다 */
        var hasAudio = !!(it.mine || it.tts);
        if (!hasAudio && dir.indexOf('hear') === 0) dir = self.canRead ? 'read-mean' : 'mean-recall';

        var others = distractors(it, self.pool, 3);
        var opts = shuffle([it].concat(others));

        var ask, hint, optHtml, selfCheck = false;

        if (dir === 'hear-mean') {
          hint = 'Listen. Which one is it?';
          ask = '<button class="rv-spk" id="rvPlay">🔊</button>';
          optHtml = opts.map(function (o) {
            return '<button class="rv-opt" data-id="' + esc(o.id) + '">' + esc(o.en) + '</button>';
          }).join('');
        } else if (dir === 'read-mean') {
          hint = 'What does this mean?';
          ask = '<div class="rv-big kr">' + esc(it.kr) + '</div>';
          optHtml = opts.map(function (o) {
            return '<button class="rv-opt" data-id="' + esc(o.id) + '">' + esc(o.en) + '</button>';
          }).join('');
        } else if (dir === 'hear-read') {
          hint = 'Listen. Which spelling?';
          ask = '<button class="rv-spk" id="rvPlay">🔊</button>';
          optHtml = opts.map(function (o) {
            return '<button class="rv-opt" data-id="' + esc(o.id) + '">' +
              '<span class="k kr">' + esc(o.kr) + '</span></button>';
          }).join('');
        } else {
          /* ── 말하기 ────────────────────────────────────────
             ⚠️ 순서가 전부다. **답을 듣기 전에 먼저 말해야 한다.**
             모델을 먼저 들려주면 따라 말하기가 되고 그건 훨씬 약하다.
             떠올리려고 애쓰는 그 몇 초가 기억을 만든다. */
          selfCheck = true;
          hint = it.ask ? '' : 'Say it in Korean.';
          ask = '<div class="rv-mid">' + esc(it.ask || it.en) + '</div>' +
                (it.ask ? '' : '');
          optHtml =
            '<div style="text-align:center">' +
              '<button class="rv-mic" id="rvMic" aria-label="record">' +
                '<span class="ring" id="rvRing"></span>🎤</button>' +
              '<div class="rv-say" id="rvSay">Tap, then say it out loud</div>' +
            '</div>' +
            '<button class="rv-more" id="rvSkip">Skip the recording</button>';
        }

        wrap.innerHTML = bar() +
          '<div class="rv-q">' +
            '<div class="rv-ask"><div class="rv-hint">' + esc(hint) + '</div>' + ask + '</div>' +
            '<div class="rv-opts" id="rvOpts">' + optHtml + '</div>' +
            '<div id="rvTell"></div>' +
          '</div>';

        wrap.querySelector('.rv-x').addEventListener('click', function () {
          save(); close();
        });

        var pb = wrap.querySelector('#rvPlay');
        if (pb) {
          pb.addEventListener('click', function () { self.play(it); });
          self.play(it);                       // 들어오자마자 한 번 들려준다
        }

        if (selfCheck) {
          var micBtn = wrap.querySelector('#rvMic');
          var ring   = wrap.querySelector('#rvRing');
          var sayTx  = wrap.querySelector('#rvSay');
          var myBlob = null;

          /* 답을 보여주고 소리를 붙인다.
             ⚠️ 여기서 처음으로 정답이 나온다. 그 전까지는 절대 안 보인다.
             선생님 것을 먼저, 내 것을 그 뒤에. 붙여 들어야 차이가 들린다. */
          function reveal() {
            stopMic();
            var mineRow = myBlob
              ? '<button class="rv-pl mine" id="rvMy">🔊<span class="who">You' +
                '<small>just now</small></span></button>' : '';
            wrap.querySelector('#rvOpts').innerHTML =
              '<div class="rv-tell"><b class="kr">' + esc(it.kr) + '</b>' +
                (it.ask ? '<br>' + esc(it.en) : '') + '</div>' +
              '<div class="rv-pair">' +
                (hasAudio ? '<button class="rv-pl" id="rvRef">🔊<span class="who">' +
                  esc(S_NAME) + '<small>the model</small></span></button>' : '') +
                mineRow +
              '</div>' +
              '<div class="rv-self">' +
                '<button class="rv-opt" data-self="0">Not yet</button>' +
                '<button class="rv-opt" data-self="1">I had it</button>' +
              '</div>';

            var myUrl = myBlob ? URL.createObjectURL(myBlob) : '';
            function playMine() { if (myUrl) sfx(myUrl); }
            var rf = wrap.querySelector('#rvRef'), my = wrap.querySelector('#rvMy');
            if (rf) rf.addEventListener('click', function () { self.play(it); });
            if (my) my.addEventListener('click', playMine);

            /* 자동으로 한 번: 선생님 → 내 것. 이 붙임이 이 화면의 요점이다 */
            if (hasAudio) self.play(it);
            if (myUrl) setTimeout(playMine, hasAudio ? 1500 : 200);

            wrap.querySelectorAll('[data-self]').forEach(function (b) {
              b.addEventListener('click', function () {
                if (myUrl) URL.revokeObjectURL(myUrl);
                var ok = b.getAttribute('data-self') === '1';
                bump(it.id, ok); if (ok) right++;
                if (myBlob && window.Clips) Clips.save(self.slug, it.id, myBlob);
                save(); i++; step();
              });
            });
          }

          wrap.querySelector('#rvSkip').addEventListener('click', reveal);

          if (!window.Mic) { sayTx.textContent = 'Say it out loud, then tap below.'; return; }

          micBtn.addEventListener('click', function () {
            if (recording) return;
            micBtn.disabled = true;
            sayTx.textContent = 'Opening the microphone…';

            /* ⚠️ 마이크는 사용자가 누른 이 순간에만 열린다.
               미리 열어두려 하면 iOS 가 조용히 막는다. */
            if (!self.mic) self.mic = new Mic();
            self.mic.prepare().then(function (r) {
              if (!r.ok) {
                micBtn.disabled = false;
                sayTx.innerHTML = '<span class="rv-warn">' + esc(r.why) + '</span>';
                return;
              }
              micBtn.disabled = false;
              micBtn.classList.add('rec');
              recording = true;
              sayTx.textContent = 'Listening… it stops on its own';
              return self.mic.start({
                onLevel: function (s) {
                  /* 자동 정지는 보이지 않으면 못 믿는다.
                     "내 말을 듣고 있는 건가?" 를 눈으로 확인시킨다 */
                  ring.style.transform = 'scale(' + (0.9 + s.level * 0.35).toFixed(3) + ')';
                },
                onAutoStop: function () { stopMic(true); }
              });
            }).catch(function () {
              micBtn.disabled = false;
              sayTx.innerHTML = '<span class="rv-warn">Could not start recording.</span>';
            });
          });

          function stopMic(thenReveal) {
            if (!recording || !self.mic) { if (thenReveal) reveal(); return; }
            recording = false;
            micBtn.classList.remove('rec');
            self.mic.stop().then(function (b) {
              myBlob = b;
              if (thenReveal) reveal();
            });
          }
          curCleanup = function () { if (recording && self.mic) { recording = false; self.mic.stop(); } };
          return;
        }

        wrap.querySelectorAll('.rv-opt').forEach(function (b) {
          b.addEventListener('click', function () {
            var ok = b.getAttribute('data-id') === it.id;
            wrap.querySelectorAll('.rv-opt').forEach(function (x) {
              x.disabled = true;
              if (x.getAttribute('data-id') === it.id) x.classList.add('ok');
            });
            if (!ok) b.classList.add('no');
            bump(it.id, ok); if (ok) right++;
            save();

            /* 틀렸을 때가 실제로 배우는 지점이다. 그냥 넘기지 않는다.
               맞혔을 때는 이미 들려준 방향이면 다시 안 튼다. 틀면 다음 문제가
               550ms 만에 끊어버려서 오히려 소리가 잘린다. */
            var heard = dir.indexOf('hear') === 0;
            if (ok) {
              if (hasAudio && !heard) self.play(it);
              setTimeout(function () { i++; step(); }, heard ? 500 : 950);
            } else {
              if (hasAudio) self.play(it);
              wrap.querySelector('#rvTell').innerHTML =
                '<div class="rv-tell"><b class="kr">' + esc(it.kr) + '</b><br>' +
                  esc(it.en) + '</div>' +
                '<button class="rv-next" id="rvNext">Got it</button>';
              wrap.querySelector('#rvNext').addEventListener('click', function () {
                i++; step();
              });
            }
          });
        });
      }

      step();
    }
  };

  /* 시험용. 브라우저에서는 안 쓴다 */
  if (typeof module !== 'undefined') {
    module.exports = { pickDir: pickDir, GAP: GAP };
  }
})();
