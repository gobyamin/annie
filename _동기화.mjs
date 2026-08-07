/* 올릴 폴더 하나를 만든다.

     node _동기화.mjs

   왜 필요한가: 앱은 `C:\Users\User\Preply\games` 에 있고 학생 자료는
   `30_프레플리\9_학생_*` 에 있다. GitHub 에 손으로 올리려면 두 군데서
   골라 담아야 하는데, 그러다 보면 반드시 하나를 빠뜨린다.
   이 스크립트가 `_웹\` 한 폴더로 모아준다. 그 폴더만 올리면 된다.

   원본은 건드리지 않는다. `_웹\` 은 언제든 지우고 다시 만들어도 되는
   생성물이다. 사람이 손으로 고쳐야 하는 것은 `s\<학생>\` 안의 데이터뿐이고,
   그건 이 스크립트가 덮어쓰지 않는다.
*/

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const APPSRC = 'C:/Users/User/Preply/games';
const OUT = path.join(HERE, 'apps');

/* 실행 중에 앱이 실제로 부르는 것만 가져간다.
   assets/img/src(88MB) _anchors _rejects 는 생성용 원본이라 뺀다. */
const IMG_DIRS = ['art', 'obj', 'sejong', 'story'];

if (!fs.existsSync(APPSRC)) {
  console.log('앱 원본을 못 찾음: ' + APPSRC);
  process.exit(1);
}

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, 'assets', 'img'), { recursive: true });

/* ── 앱 HTML ──────────────────────────────────────────────
   팩 연결을 바꾼다. 원래는 같은 폴더의 pack.js 를 부르는데,
   호스팅에서는 앱 한 벌을 전 학생이 같이 쓰므로
   주소의 ?s=annie 를 보고 s/annie/pack.js 를 부르게 한다. */
const htmls = fs.readdirSync(APPSRC).filter(f => f.endsWith('.html') && !f.startsWith('_'));
const needed = new Set();
let swapped = 0;

for (const f of htmls) {
  let s = fs.readFileSync(path.join(APPSRC, f), 'utf8');
  for (const m of s.matchAll(/(?:src|href)="(assets\/[^"]+)"/g)) needed.add(m[1]);
  if (s.includes('<script src="pack.js"></script>')) {
    s = s.replace('<script src="pack.js"></script>', '<script src="_pack.js"></script>');
    swapped++;
  }
  fs.writeFileSync(path.join(OUT, f), s, 'utf8');
}

/* 앱이 <script src="assets/..."> 로 부르는 데이터 파일은 스캔해서 자동으로 챙긴다.
   목록을 손으로 관리하면 새 앱을 넣을 때 반드시 빠뜨린다. */
const missing = [];
for (const rel of needed) {
  const src = path.join(APPSRC, rel);
  if (!fs.existsSync(src)) { missing.push(rel); continue; }
  const dest = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

for (const d of IMG_DIRS) {
  const src = path.join(APPSRC, 'assets', 'img', d);
  if (fs.existsSync(src)) fs.cpSync(src, path.join(OUT, 'assets', 'img', d), { recursive: true });
}
const voice = path.join(APPSRC, 'assets', 'voice');
if (fs.existsSync(voice)) {
  fs.cpSync(voice, path.join(OUT, 'assets', 'voice'), {
    recursive: true,
    filter: (p) => path.basename(p) !== '_test',   // 목소리 후보 비교용, 학생과 무관
  });
}

/* ── 팩 연결기 ────────────────────────────────────────────
   parse 중에 document.write 로 넣어야 앱 본 스크립트보다 먼저 실행된다.
   fetch 를 쓰면 file:// 에서 막히므로 script 태그여야 한다. */
fs.writeFileSync(path.join(OUT, '_pack.js'), `/* 주소의 ?s=<학생> 를 보고 그 학생 팩을 먼저 읽어들인다.
   없으면 아무것도 안 하고, 앱은 내장 기본 덱으로 돈다. 생성물이므로 직접 고치지 말 것. */
(function () {
  var m = /[?&]s=([a-z0-9_-]+)/i.exec(location.search);
  if (!m) return;
  document.write('<scr' + 'ipt src="../s/' + m[1] + '/pack.js"></scr' + 'ipt>');
})();
`, 'utf8');

/* ── 목소리 은행 ──────────────────────────────────────────
   선생님이 직접 녹음한 것. 2_교구 / _내목소리 / 목소리은행.json 이 원본이고
   웹에서는 fetch 가 file:// 에서 막히므로 script 로 읽을 수 있게 감싼다.
   녹음을 새로 하면 _목소리교체.mjs 를 돌린 뒤 이 스크립트를 다시 돌린다. */
const BANKF = path.join(HERE, 'bank', 'items.js');
let BANKITEMS = {};
if (fs.existsSync(BANKF)) {
  try { BANKITEMS = new Function(fs.readFileSync(BANKF, 'utf8') + '; return BANK;')(); }
  catch (e) { console.log('⚠ bank/items.js 를 못 읽음: ' + e.message); }
}
const VOICEKEYS = new Set();

const VBSRC = path.join(HERE, '..', '2_교구', '_내목소리', '목소리은행.json');
let vb = 0;
if (fs.existsSync(VBSRC)) {
  const raw = fs.readFileSync(VBSRC, 'utf8');
  const vbo = JSON.parse(raw);
  Object.keys(vbo).forEach(k => VOICEKEYS.add(k));
  vb = Object.keys(vbo).length;
  fs.mkdirSync(path.join(HERE, 'bank'), { recursive: true });
  const head = '/* 생성물. 직접 고치지 말 것. 원본은 목소리은행.json 이다. */';
  fs.writeFileSync(path.join(HERE, 'bank', 'voice.js'),
    head + '\nvar VOICEBANK = ' + raw + ';\n', 'utf8');
}

/* ── 학생 회차 덱 ─────────────────────────────────────────
   lessons.js 가 선언한 것만 가져온다. 날짜로 짐작하면 수업 중에만 쓴 교구까지
   학생에게 딸려 나간다. from 은 그 학생 materials 폴더 안의 원본 이름,
   file 은 선반 폴더에 놓일 이름이다.

   ⚠️ 이미 있는 파일은 절대 덮어쓰지 않는다. 한 번 나간 회차는 그대로 둔다. */
const STUDENTS = [
  { dir: '9_학생_애니', slug: 'annie' },
  { dir: '9_학생_머피', slug: 'murphy' },
];
let decks = 0, kept = 0;
const problems = [];

for (const st of STUDENTS) {
  const dst = path.join(HERE, 's', st.slug);
  const lf = path.join(dst, 'lessons.js');
  if (!fs.existsSync(lf)) continue;

  let LESSONS = [];
  try { LESSONS = new Function(fs.readFileSync(lf, 'utf8') + '; return LESSONS;')(); }
  catch (e) { problems.push(st.slug + ' lessons.js 를 못 읽음: ' + e.message); continue; }

  for (const les of LESSONS) {
    for (const it of (les.items || [])) {
      if (it.kind === 'app') {
        if (!fs.existsSync(path.join(OUT, it.app)))
          problems.push(st.slug + ' ' + les.n + '회차: 없는 앱 ' + it.app);
        continue;
      }
      if (!it.file) { problems.push(st.slug + ' ' + les.n + '회차: file 이 없는 항목'); continue; }
      const target = path.join(dst, it.file);
      if (fs.existsSync(target)) { kept++; continue; }
      if (!it.from) { problems.push(st.slug + ' ' + les.n + '회차: ' + it.file + ' 가 없고 from 도 안 적힘'); continue; }
      const src = path.join(HERE, '..', st.dir, 'materials', it.from);
      if (!fs.existsSync(src)) { problems.push(st.slug + ' ' + les.n + '회차: 원본 없음 ' + it.from); continue; }
      fs.copyFileSync(src, target);
      decks++;
    }
    /* 회차가 부르는 낱말이 은행에 있나 */
    for (const w of (les.words || [])) {
      if (typeof w === 'string' && !BANKITEMS[w])
        problems.push(st.slug + ' ' + les.n + '회차: 은행에 없는 낱말 id "' + w + '"');
    }
  }
}

/* ── 은행 정합성 ──────────────────────────────────────────
   mine 은 선생님 녹음, tts 는 앱 음원. 어느 쪽이든 실제로 있어야 한다.
   없으면 학생 화면에서 버튼만 있고 소리가 안 난다. */
for (const id in BANKITEMS) {
  const it = BANKITEMS[id];
  if (it.mine && !VOICEKEYS.has(it.mine)) problems.push('은행 "' + id + '": 녹음 ' + it.mine + ' 없음');
  if (it.tts && !fs.existsSync(path.join(OUT, 'assets', 'voice', it.tts + '.wav')))
    problems.push('은행 "' + id + '": 음원 ' + it.tts + '.wav 없음');
}

function size(p) {
  let n = 0;
  for (const e of fs.readdirSync(p, { withFileTypes: true })) {
    if (e.name === '.git') continue;   // 저장소 자체는 올라가는 용량이 아니다
    const q = path.join(p, e.name);
    n += e.isDirectory() ? size(q) : fs.statSync(q).size;
  }
  return n;
}

console.log('목소리 ' + vb + '개 (선생님 녹음)');
console.log('앱 ' + htmls.length + '개, 팩 연결 바꾼 것 ' + swapped + '개');
console.log('회차 덱 새로 담음 ' + decks + '개, 그대로 둠 ' + kept + '개');
if (missing.length) console.log('⚠ 앱이 부르는데 없는 파일: ' + missing.join(', '));
if (problems.length) {
  console.log('');
  console.log('⚠ 고쳐야 할 것 ' + problems.length + '건');
  problems.forEach(p => console.log('   ' + p));
  console.log('');
}
console.log('_웹 전체 ' + (size(HERE) / 1048576).toFixed(1) + 'MB  ← 이 폴더를 올리면 됩니다');
