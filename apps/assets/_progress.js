/* ============================================================
   진도 기록 — 15개 화면이 공유하는 단 하나의 저장소

   왜: 화면이 15개인데 학생은 자기가 어디쯤 왔는지 알 방법이 없었다.
   다음 수업에 열면 늘 처음부터였고, 01e 점검 결과도 창을 닫으면 사라졌다.

   설계 원칙 세 가지

   1. 없어도 앱이 멀쩡해야 한다.
      file:// 로 열면 브라우저에 따라 localStorage 가 막힌다.
      막히면 진도가 안 남을 뿐, 어떤 앱도 깨지지 않는다. 전부 try/catch.

   2. 학생별로 칸이 갈린다.
      구운 학생판은 자기 폴더라 상관없지만, 선생님이 기본형 하나를
      여러 학생과 함께 쓰면 진도가 섞인다. 팩의 이름으로 칸을 나눈다.

   3. 점수를 남기지 않는다.
      "열어봤다"와 "끝냈다"만 기록한다. 몇 점인지를 저장하면
      학생이 그걸 신경 쓰기 시작한다. 이건 시험이 아니다.
   ============================================================ */

(function (w) {
  var BASE = 'kr-progress';

  function whose() {
    try {
      var p = w.STUDENT_PACK;
      if (p && typeof p === 'object' && p.student) return BASE + ':' + p.student;
    } catch (e) {}
    return BASE;
  }

  var KEY = whose();
  var available = false;
  try {
    w.localStorage.setItem(BASE + ':probe', '1');
    w.localStorage.removeItem(BASE + ':probe');
    available = true;
  } catch (e) { available = false; }

  function read() {
    if (!available) return { visited: {}, done: {} };
    try {
      var raw = w.localStorage.getItem(KEY);
      if (!raw) return { visited: {}, done: {} };
      var o = JSON.parse(raw);
      return { visited: o.visited || {}, done: o.done || {} };
    } catch (e) { return { visited: {}, done: {} }; }
  }

  function write(o) {
    if (!available) return;
    try { w.localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) {}
  }

  /* 날짜만 남긴다. 시각까지 남기면 "언제 몇 분 했나"가 되고,
     그건 학생을 감시하는 도구가 된다. */
  function today() {
    var d = new Date();
    return d.getFullYear() + '-' +
           ('0' + (d.getMonth() + 1)).slice(-2) + '-' +
           ('0' + d.getDate()).slice(-2);
  }

  w.Progress = {
    available: available,

    /* 화면을 열었다 */
    visit: function (id) {
      if (!id) return;
      var o = read();
      if (!o.visited[id]) { o.visited[id] = today(); write(o); }
    },

    /* 끝까지 갔다. 점검 앱이라면 흔들린 글자만 넘겨받아 다음에 보여준다 */
    done: function (id, shaky) {
      if (!id) return;
      var o = read();
      o.visited[id] = o.visited[id] || today();
      o.done[id] = { on: today() };
      if (shaky && shaky.length) o.done[id].shaky = shaky.slice(0, 12);
      write(o);
    },

    isVisited: function (id) { return !!read().visited[id]; },
    isDone:    function (id) { return !!read().done[id]; },
    get:       read,

    /* 흔들린 글자를 다음 세션에서 다시 물어보려고 꺼낸다 */
    shaky: function (id) {
      var d = read().done[id];
      return (d && d.shaky) || [];
    },

    reset: function () {
      if (!available) return;
      try { w.localStorage.removeItem(KEY); } catch (e) {}
    }
  };
})(window);
