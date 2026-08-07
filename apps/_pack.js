/* 주소의 ?s=<학생> 를 보고 그 학생 팩을 먼저 읽어들인다.
   없으면 아무것도 안 하고, 앱은 내장 기본 덱으로 돈다. 생성물이므로 직접 고치지 말 것. */
(function () {
  var m = /[?&]s=([a-z0-9_-]+)/i.exec(location.search);
  if (!m) return;
  document.write('<scr' + 'ipt src="../s/' + m[1] + '/pack.js"></scr' + 'ipt>');
})();
