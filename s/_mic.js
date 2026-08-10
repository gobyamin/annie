/* ============================================================
   마이크 — 녹음하고, 자기 목소리를 선생님 목소리 옆에 붙여 듣는다.

   왜: 점수는 "82점" 이라고만 말하고 뭐가 틀렸는지 못 알려준다.
   자기 소리를 원어민 바로 뒤에 붙여 들으면 본인 귀가 알아낸다.
   한국어 초보가 제일 많이 틀리는 음절 길이와 끝 억양은
   숫자로는 전달이 안 되고 들으면 즉시 안다.

   그리고 이게 곧 목소리 기록이다. 두 달 뒤 8월 것과 10월 것을 나란히 틀면
   "늘었어요" 백 번보다 강하다.

   ── 아민 앱(2_앱판/src/browser/recorder.ts)에서 가져온 것 ──
     · 말이 끝나면 스스로 멈추는 판정 (VAD). "멈춤" 버튼을 없앤다
     · 마이크가 안 열릴 때의 오류 구분. 실제로 데어보고 쓴 것이라 값이 있다
     · iOS 에서 AudioContext 를 사용자 동작 안에서 만들어야 산다는 것

   ── 일부러 안 가져온 것 ──
     · 원시 샘플 16kHz 추출. 아민은 강세를 재려고 그렇게 한다.
       우리는 재생만 하므로 MediaRecorder 로 충분하고, 2초에 64KB 대 4KB 로
       16배 차이가 난다. 낱말마다 쌓을 것이라 저장에서 갈린다
     · 발음 점수. 아민 채점은 영어 강세 기반이라 한국어에 안 맞는다.
       한국어는 강세 언어가 아니다. 억지로 점수를 내면 틀린 걸 맞다고 한다

   ⚠️ AGC(자동 음량 조절)는 끈다. 지금은 재생만 하니 켜도 되지만,
      나중에 파형을 겹쳐 그릴 때 AGC 가 켜져 있으면 측정이 평평해진다.
      끄고 시작하는 편이 낫다.
   ============================================================ */

(function () {

  var CONSTRAINTS = {
    echoCancellation: false,
    noiseSuppression: false,
    autoGainControl: false,
    channelCount: 1
  };

  /* 말이 끝난 것을 스스로 알아채는 값.
     사람마다 말을 시작하기까지 걸리는 시간이 다르다 — 바로 하는 사람도,
     3초쯤 뜸 들이는 사람도 있다. 그래서 멈춤 버튼을 없앤다. */
  var VAD = {
    silenceSec: 1.0,     // 이만큼 조용하면 끝난 것으로 본다
    minSpeechSec: 0.25,  // 소리를 낸 뒤로 최소 이만큼은 녹음한다
    maxTotalSec: 12,     // 아무 말도 안 하면 여기서 그냥 멈춘다
    speechFactor: 3      // 소음 바닥의 몇 배를 넘어야 말하는 중인가
  };

  function Mic() {
    this.stream = null;
    this.ctx = null;
    this.rec = null;
    this.chunks = [];
    this.raf = 0;
    this._preparing = null;
  }

  /* 마이크를 연다.
     ⚠️ 반드시 사용자가 버튼을 누른 직후에 불러야 한다.
        iOS 사파리는 사용자 동작 없이 오디오를 시작하면 조용히 막는다. */
  Mic.prototype.prepare = function () {
    var self = this;
    if (this._preparing) return this._preparing;     // 연타로 스트림이 두 개 새는 것을 막는다
    if (this.stream && this.ctx) return Promise.resolve({ ok: true });

    this._preparing = (function () {
      /* http 로 연 폰을 먼저 거른다. https 가 아니면 브라우저가 mediaDevices 를
         아예 안 만들어준다. 그걸 보고 "이 브라우저는 마이크를 지원 안 함" 이라고
         하면 거짓말이 된다. 브라우저는 멀쩡하고 주소가 문제다. */
      if (!window.isSecureContext) {
        return Promise.resolve({ ok: false,
          why: 'This page is on http, so the browser blocked the microphone. ' +
               'Open the https link instead.' });
      }
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        return Promise.resolve({ ok: false, why: 'This browser cannot use the microphone.' });
      }
      if (typeof MediaRecorder === 'undefined') {
        return Promise.resolve({ ok: false, why: 'This browser cannot record audio.' });
      }

      return navigator.mediaDevices.getUserMedia({ audio: CONSTRAINTS })
        .then(function (s) {
          self.stream = s;
          var AC = window.AudioContext || window.webkitAudioContext;
          self.ctx = new AC();
          if (self.ctx.state === 'suspended') return self.ctx.resume().then(function () {
            return { ok: true };
          });
          return { ok: true };
        })
        .catch(function (e) {
          var n = (e && e.name) || '';
          /* 한 번 거절하면 브라우저가 다시 안 묻는다. "허용해 주세요" 라고만 하면
             어디서 허용하는지 몰라 그대로 나간다. 어디를 눌러야 하는지 적는다. */
          if (n === 'NotAllowedError' || n === 'PermissionDeniedError') {
            return { ok: false, denied: true,
              why: 'The microphone is blocked. Tap the lock icon (or ⓘ) next to the ' +
                   'address bar, set Microphone to Allow, then reload.' };
          }
          if (n === 'NotFoundError' || n === 'DevicesNotFoundError') {
            return { ok: false, why: 'No microphone found. If you have earphones in, try removing them.' };
          }
          if (n === 'NotReadableError' || n === 'TrackStartError') {
            return { ok: false, why: 'Another app is using the microphone. Close it and try again.' };
          }
          return { ok: false, why: 'Could not open the microphone (' + (n || e) + ').' };
        });
    })();

    return this._preparing.then(function (r) { self._preparing = null; return r; },
                                function (e) { self._preparing = null; throw e; });
  };

  /* 녹음 시작. onLevel 로 음량을 넘겨준다 — 자동 정지는 보이지 않으면 못 믿는다.
     "내 말을 듣고 있는 건가?" 싶을 때 확인할 수 있어야 한다. */
  Mic.prototype.start = function (opt) {
    var self = this;
    opt = opt || {};
    if (!this.stream || !this.ctx) return Promise.reject(new Error('prepare() first'));

    /* iOS 는 화면 잠금·전화·앱 전환 뒤에 AudioContext 가 멈춰 있다.
       그대로 시작하면 "녹음은 됐다는데 소리가 하나도 안 잡힘" 이 된다. */
    var wake = this.ctx.state !== 'running' ? this.ctx.resume() : Promise.resolve();

    return wake.then(function () {
      self.chunks = [];

      var mime = '';
      var want = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg;codecs=opus'];
      for (var i = 0; i < want.length; i++) {
        if (MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(want[i])) { mime = want[i]; break; }
      }
      self.rec = mime ? new MediaRecorder(self.stream, { mimeType: mime })
                      : new MediaRecorder(self.stream);
      self.rec.ondataavailable = function (e) { if (e.data && e.data.size) self.chunks.push(e.data); };
      self.rec.start();

      /* 음량 재기. ScriptProcessor 는 폐기 예정이라 AnalyserNode 를 쓴다.
         프레임마다 RMS 를 재서 소음 바닥과 견준다. */
      var src = self.ctx.createMediaStreamSource(self.stream);
      var an = self.ctx.createAnalyser();
      an.fftSize = 1024;
      src.connect(an);
      var buf = new Float32Array(an.fftSize);

      var floor = 0, nFloor = 0, started = false, silent = 0, total = 0;
      var last = (self.ctx.currentTime);

      function tick() {
        if (!self.rec || self.rec.state !== 'recording') return;
        self.raf = requestAnimationFrame(tick);

        an.getFloatTimeDomainData(buf);
        var sum = 0;
        for (var i = 0; i < buf.length; i++) sum += buf[i] * buf[i];
        var rms = Math.sqrt(sum / buf.length);

        var now = self.ctx.currentTime;
        var dt = Math.max(0, Math.min(0.25, now - last));
        last = now;
        total += dt;

        /* 처음 몇 프레임은 소음 바닥을 재는 데 쓴다 (아직 말을 안 시작했을 것) */
        if (nFloor < 10) {
          floor = (floor * nFloor + rms) / (nFloor + 1);
          nFloor++;
          if (opt.onLevel) opt.onLevel({ level: Math.min(1, rms * 8), speaking: false, started: false });
          return;
        }

        var speaking = rms > Math.max(floor * VAD.speechFactor, 0.004);
        if (speaking) { started = true; silent = 0; }
        else {
          silent += dt;
          /* 아직 말을 시작 안 했으면 소음 바닥을 계속 다듬는다.
             도중에 에어컨이 켜지는 상황을 견디기 위해서다. */
          if (!started) floor = floor * 0.9 + rms * 0.1;
        }

        if (opt.onLevel) opt.onLevel({
          level: Math.min(1, rms * 8), speaking: speaking, started: started,
          stopsIn: Math.max(0, VAD.silenceSec - silent)
        });

        var enough = started && total >= VAD.minSpeechSec;
        if ((enough && silent >= VAD.silenceSec) || total >= VAD.maxTotalSec) {
          if (opt.onAutoStop) setTimeout(opt.onAutoStop, 0);
        }
      }
      self.raf = requestAnimationFrame(tick);
      return true;
    });
  };

  /* 멈추고 재생할 수 있는 것을 돌려준다 */
  Mic.prototype.stop = function () {
    var self = this;
    if (this.raf) { cancelAnimationFrame(this.raf); this.raf = 0; }
    return new Promise(function (res) {
      var r = self.rec;
      if (!r || r.state === 'inactive') { res(null); return; }
      r.onstop = function () {
        var blob = new Blob(self.chunks, { type: (self.chunks[0] && self.chunks[0].type) || 'audio/webm' });
        self.chunks = []; self.rec = null;
        res(blob.size ? blob : null);
      };
      try { r.stop(); } catch (e) { self.rec = null; res(null); }
    });
  };

  /* 마이크를 놓아준다. 탭의 녹음 표시가 사라진다 */
  Mic.prototype.release = function () {
    if (this.raf) { cancelAnimationFrame(this.raf); this.raf = 0; }
    if (this.stream) { this.stream.getTracks().forEach(function (t) { t.stop(); }); this.stream = null; }
    if (this.ctx) { try { this.ctx.close(); } catch (e) {} this.ctx = null; }
    this.rec = null; this.chunks = [];
  };


  /* ── 저장 ──────────────────────────────────────────────────
     오디오를 localStorage 에 넣으면 금방 터진다 (보통 5MB, 문자열이라 base64 로
     1.37배 부푼다). IndexedDB 에 Blob 그대로 넣는다.

     낱말마다 최근 2개만 남긴다. 하나는 최신, 하나는 처음 것.
     "처음 것" 을 남기는 게 요점이다 — 나중에 나란히 들려주려면
     제일 못했을 때가 남아 있어야 한다. */
  var DB = null, DBNAME = 'korean-voice', STORE = 'clips';

  function open() {
    if (DB) return Promise.resolve(DB);
    return new Promise(function (res, rej) {
      if (!window.indexedDB) { rej(new Error('no indexedDB')); return; }
      var q = indexedDB.open(DBNAME, 1);
      q.onupgradeneeded = function () {
        var db = q.result;
        if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
      };
      q.onsuccess = function () { DB = q.result; res(DB); };
      q.onerror = function () { rej(q.error); };
    });
  }
  function tx(mode, fn) {
    return open().then(function (db) {
      return new Promise(function (res, rej) {
        var t = db.transaction(STORE, mode), s = t.objectStore(STORE), out;
        out = fn(s);
        t.oncomplete = function () { res(out && out.result !== undefined ? out.result : out); };
        t.onerror = function () { rej(t.error); };
      });
    });
  }

  var Clips = {
    /* key 는 학생+낱말. 첫 녹음과 최신 녹음 둘만 든다 */
    save: function (slug, id, blob) {
      var k = slug + '|' + id;
      return tx('readwrite', function (s) { return s.get(k); }).then(function (old) {
        var rec = old || { first: null, firstAt: '', last: null, lastAt: '', n: 0 };
        var now = new Date().toISOString().slice(0, 10);
        if (!rec.first) { rec.first = blob; rec.firstAt = now; }
        rec.last = blob; rec.lastAt = now; rec.n = (rec.n || 0) + 1;
        return tx('readwrite', function (s) { s.put(rec, k); return rec; });
      }).catch(function () { return null; });      // 저장 실패로 복습을 막지 않는다
    },
    get: function (slug, id) {
      return tx('readonly', function (s) { return s.get(slug + '|' + id); })
        .catch(function () { return null; });
    },
    /* 몇 개나 쌓였나 — 목소리 기록 카드에서 쓴다 */
    count: function (slug) {
      return open().then(function (db) {
        return new Promise(function (res) {
          var t = db.transaction(STORE, 'readonly'), s = t.objectStore(STORE);
          var q = s.getAllKeys(), n = 0;
          q.onsuccess = function () {
            (q.result || []).forEach(function (k) { if (String(k).indexOf(slug + '|') === 0) n++; });
            res(n);
          };
          q.onerror = function () { res(0); };
        });
      }).catch(function () { return 0; });
    }
  };

  window.Mic = Mic;
  window.Clips = Clips;
  window.MIC_VAD = VAD;
})();
