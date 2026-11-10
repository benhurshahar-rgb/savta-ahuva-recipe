/* ספר המתכונים של סבתא אהובה — vanilla JS app (Capacitor) */
(function () {
'use strict';
var CFG = window.CONFIG || {};
var BASE = window.RECIPES, CH = window.CHAPTERS, CH_ORDER = window.CH_ORDER, CH_ICON = window.CH_ICON, ILL = window.ILL, LOGO = window.LOGO;
var TAGS = ['פרווה', 'בשרי', 'חלבי', 'טבעוני'];
var PENDING = ['פשטידת פטריות', 'שוקיים ברוטב', 'קציצות גזר (?)'];

/* ---------------------------------------------------------------- helpers */
function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
function $(sel, root) { return (root || document).querySelector(sel); }
function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
var P = {
  back: '<path d="M9 5l7 7-7 7"/>', next: '<path d="M15 5l-7 7 7 7"/>',
  grid: '<rect x="4" y="4" width="7" height="7" rx="1"/><rect x="13" y="4" width="7" height="7" rx="1"/><rect x="4" y="13" width="7" height="7" rx="1"/><rect x="13" y="13" width="7" height="7" rx="1"/>',
  cam: '<path d="M4 8h3l2-3h6l2 3h3a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V9a1 1 0 011-1z"/><circle cx="12" cy="13.5" r="3.5"/>',
  pen: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13 7l4 4"/>',
  doc: '<path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5"/><path d="M10 13h6M10 17h6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>', x: '<path d="M6 6l12 12M18 6L6 18"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>',
  merge: '<path d="M7 4v6a4 4 0 004 4h6"/><path d="M14 11l3 3-3 3"/><path d="M7 20v-3"/>',
  check: '<path d="M5 12l5 5 9-10"/>', minus: '<path d="M5 12h14"/>',
  img: '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-8 8"/>',
  trash: '<path d="M5 7h14M10 7V4h4v3M7 7l1 13h8l1-13"/>', link: '<path d="M10 14a4 4 0 006 0l3-3a4 4 0 00-6-6l-1 1"/><path d="M14 10a4 4 0 00-6 0l-3 3a4 4 0 006 6l1-1"/>'
};
function ic(n, size, color, sw) { return '<svg width="' + (size || 22) + '" height="' + (size || 22) + '" viewBox="0 0 24 24" fill="none" stroke="' + (color || 'currentColor') + '" stroke-width="' + (sw || 1.8) + '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + P[n] + '</svg>'; }
var GRAIN = '<svg class="grain" aria-hidden="true"><rect width="100%" height="100%" filter="url(#grain)"/></svg>';
function ornament(w) { return '<svg aria-hidden="true" width="' + (w || 170) + '" height="14" viewBox="0 0 170 14" style="display:block;margin:0 auto"><path d="M4 7C30 1 52 13 74 7M96 7C118 1 140 13 166 7" fill="none" stroke="#B8893F" stroke-width="1.2" stroke-linecap="round"/><path d="M85 2l5 5-5 5-5-5z" fill="#B8893F"/><circle cx="76" cy="7" r="1.6" fill="#B8893F"/><circle cx="94" cy="7" r="1.6" fill="#B8893F"/></svg>'; }
function heading(t) { return '<div class="hd"><i></i><h2>' + esc(t) + '</h2><i></i></div>'; }
function logo(s) { return '<img class="logo" src="' + LOGO + '" alt="סבתא אהובה" style="width:' + s + 'px;height:' + s + 'px">'; }
function toast(t) {
  var el = document.createElement('div'); el.className = 'toast fade-in'; el.textContent = t; document.body.appendChild(el);
  setTimeout(function () { el.remove(); }, 2600);
}
function busy(t) {
  var el = document.createElement('div'); el.className = 'busy fade-in';
  el.innerHTML = '<div class="paper"><div class="spin"></div><div style="font-weight:700;font-size:17px;color:var(--brown)">' + esc(t) + '</div></div>';
  document.body.appendChild(el); return function () { el.remove(); };
}
function norm(s) { return String(s || '').replace(/[֑-ׇ]/g, '').replace(/[ךםןףץ]/g, function (c) { return { 'ך': 'כ', 'ם': 'מ', 'ן': 'נ', 'ף': 'פ', 'ץ': 'צ' }[c]; }).replace(/[^א-תa-z0-9 ]/gi, ' ').replace(/\s+/g, ' ').trim(); }
function ingText(groups) {
  return (groups || []).map(function (g) { return (g.name ? g.name + ':\n' : '') + g.items.join('\n'); }).join('\n\n');
}
function parseIng(txt) {
  var out = [], cur = { name: '', items: [] };
  txt.split('\n').forEach(function (l) {
    l = l.trim(); if (!l) return;
    if (/[:׃]$/.test(l) && l.length < 40) { if (cur.items.length || cur.name) out.push(cur); cur = { name: l.replace(/[:׃]$/, '').trim(), items: [] }; }
    else cur.items.push(l.replace(/^[-•*]\s*/, ''));
  });
  if (cur.items.length || cur.name) out.push(cur);
  return out.length ? out : [{ name: '', items: [] }];
}
function lines(t) { return String(t || '').split('\n').map(function (x) { return x.replace(/^\s*(\d+[.)]|[-•*])\s*/, '').trim(); }).filter(Boolean); }
function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }

function readFile(file, as) {
  return new Promise(function (res, rej) { var r = new FileReader(); r.onload = function () { res(r.result); }; r.onerror = rej; r[as || 'readAsDataURL'](file); });
}
function compress(file, max, q) {
  return readFile(file).then(function (url) {
    return new Promise(function (res, rej) {
      var im = new Image();
      im.onload = function () {
        var s = Math.min(1, max / Math.max(im.width, im.height));
        var c = document.createElement('canvas'); c.width = Math.round(im.width * s); c.height = Math.round(im.height * s);
        c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
        res(c.toDataURL('image/jpeg', q || 0.75));
      };
      im.onerror = rej; im.src = url;
    });
  });
}

/* ---------------------------------------------------------------- shared family data (Firestore) */
var S = { edits: {}, photos: {}, merges: {}, added: {}, pages: {} };
var COLLS = ['edits', 'photos', 'merges', 'added', 'pages'];
var LS = 'savta-cache-v1';
try { var cached = JSON.parse(localStorage.getItem(LS) || 'null'); if (cached) COLLS.forEach(function (c) { if (c !== 'photos' && c !== 'pages' && cached[c]) S[c] = cached[c]; }); } catch (e) {}
function persist() { try { localStorage.setItem(LS, JSON.stringify({ edits: S.edits, merges: S.merges, added: S.added })); } catch (e) {} }
var db = null, online = 'local';
function initCloud() {
  if (!window.FB || !CFG.firebase || !CFG.firebase.apiKey) { online = 'local'; return; }
  try {
    var FB = window.FB, app = FB.initializeApp(CFG.firebase);
    db = FB.initializeFirestore(app, { localCache: FB.persistentLocalCache() });
    var auth = FB.getAuth(app);
    online = 'connecting';
    FB.onAuthStateChanged(auth, function (u) {
      if (!u) return;
      online = 'ok'; updateSync();
      COLLS.forEach(function (c) {
        FB.onSnapshot(FB.collection(db, c), function (snap) {
          var m = {};
          snap.forEach(function (d) { m[d.id] = d.data(); });
          if (c === 'merges') { var mm = {}; Object.keys(m).forEach(function (k) { mm[k] = m[k].into; }); m = mm; }
          S[c] = m; persist(); dataChanged();
        }, function (err) { console.warn(c, err); online = 'err'; updateSync(); });
      });
    });
    FB.signInAnonymously(auth).catch(function (e) { console.warn(e); online = 'err'; updateSync(); });
  } catch (e) { console.warn(e); online = 'err'; }
}
function put(coll, id, data) {
  if (coll === 'merges') S.merges[id] = data.into; else S[coll][id] = data;
  persist();
  if (db) { var FB = window.FB; data = Object.assign({}, data, { at: FB.serverTimestamp() }); return FB.setDoc(FB.doc(db, coll, id), data).catch(function (e) { console.warn(e); toast('השמירה לענן נכשלה. בדקו חיבור לאינטרנט.'); }); }
  return Promise.resolve();
}
function del(coll, id) {
  delete S[coll][id]; persist();
  if (db) { var FB = window.FB; return FB.deleteDoc(FB.doc(db, coll, id)).catch(function (e) { console.warn(e); }); }
  return Promise.resolve();
}
function syncLabel() { return { ok: 'משותף עם כל המשפחה', connecting: 'מתחבר…', err: 'אין חיבור לענן כרגע', local: 'שמור רק במכשיר הזה' }[online]; }
function updateSync() { $$('.sync').forEach(function (el) { el.textContent = syncLabel(); }); }

/* ---------------------------------------------------------------- recipe model */
function pageSrc(p) { if (p.indexOf('fs:') === 0) { var d = S.pages[p.slice(3)]; return d ? d.data : ''; } return p; }
function all() {
  var list = BASE.map(function (r) { return r; });
  Object.keys(S.added).forEach(function (k) {
    var a = S.added[k];
    list.push({ k: k, num: 1000, created: a.created || 0, title: a.title, chId: a.chId, tags: a.tags || [], check: !!a.check, groups: a.groups || [], steps: a.steps || [], tip: a.tip || '',
      pages: a.pages || [], suggest: '', img: ILL[CH_ICON[a.chId]] || ILL.parve, photo: false, credit: '', pos: '50% 50%', icon: CH_ICON[a.chId], added: true });
  });
  return list.map(eff);
}
function eff(r) {
  var e = S.edits[r.k], ph = S.photos[r.k], out = r;
  if (e) {
    out = Object.assign({}, r, e, { check: false, pages: r.pages.concat(e.extraPages || []) });
    if (e.chId != null && !r.photo && !ph) { out.img = ILL[CH_ICON[e.chId]]; }
  }
  if (ph) out = Object.assign({}, out, { img: ph.data, photo: true, pos: '50% 50%', credit: ph.credit || 'צילום של המשפחה', own: true });
  out.ch = CH[out.chId];
  return out;
}
var visCache = null;
function vis() {
  if (visCache) return visCache;
  var list = all().filter(function (r) { return !S.merges[r.k]; });
  list.sort(function (a, b) { return (CH_ORDER.indexOf(a.chId) - CH_ORDER.indexOf(b.chId)) || (a.num - b.num) || ((a.created || 0) - (b.created || 0)); });
  list.forEach(function (r, i) { r.n = i + 1; });
  return (visCache = list);
}
function byKey(k) { var a = all(); for (var i = 0; i < a.length; i++) if (a[i].k === k) return a[i]; return null; }
function idxOf(k) { var v = vis(); for (var i = 0; i < v.length; i++) if (v[i].k === k) return i; return -1; }

/* ---------------------------------------------------------------- navigation */
var stage = $('#stage'), layer = $('#layer');
var nav = [{ name: 'cover' }], ui = { q: '', chip: -1, editing: null, note: null };
var formOpen = false, pendingRender = false;
function cur() { return nav[nav.length - 1]; }
function go(v, anim) { nav.push(v); show(anim); }
function replace(v, anim) { nav[nav.length - 1] = v; show(anim); }
function back() {
  if (layer.firstChild) { closeLayer(); return true; }
  if (ui.editing) { ui.editing = null; formOpen = false; show(); return true; }
  if (nav.length > 1) { nav.pop(); show('back'); return true; }
  return false;
}
function dataChanged() { visCache = null; if (formOpen) { pendingRender = true; return; } show(null, true); }

function show(anim, keepScroll) {
  visCache = null;
  var v = cur(), old = stage.firstElementChild;
  var scrollTop = keepScroll && old && $('.scroll', old) ? $('.scroll', old).scrollTop : 0;
  var el = document.createElement('div');
  el.className = 'screen linen';
  var html = SCREENS[v.name](v);
  el.innerHTML = html;
  if (v.name === 'cover') el.classList.add('cover');
  formOpen = !!(ui.editing || /^add/.test(v.name));
  pendingRender = false;
  if (old && anim === 'next') {
    stage.appendChild(el); stage.appendChild(old);
    old.classList.add('turn-out'); old.style.transformOrigin = 'right center';
    setTimeout(function () { old.remove(); }, 640);
  } else if (old && anim === 'back') {
    stage.appendChild(old); el.style.transformOrigin = 'right center'; el.classList.add('turn-back'); stage.appendChild(el);
    setTimeout(function () { old.remove(); el.classList.remove('turn-back'); }, 640);
  } else {
    stage.innerHTML = ''; stage.appendChild(el);
    if (anim === 'fade') el.classList.add('fade-in');
  }
  if (keepScroll && $('.scroll', el)) $('.scroll', el).scrollTop = scrollTop;
  (BIND[v.name] || function () {})(el, v);
}

/* ---------------------------------------------------------------- screens */
var SCREENS = {}, BIND = {};

function miniCard(title, icon, x, y, rot, w) {
  return '<div class="mini paper" aria-hidden="true" style="left:' + x + ';bottom:' + y + 'px;transform:rotate(' + rot + 'deg);' + (w ? 'width:' + w + 'px' : '') + '"><img src="' + ILL[icon] + '" alt=""><span>' + esc(title) + '</span><i style="width:90%"></i><i style="width:70%"></i><i style="width:80%"></i></div>';
}
SCREENS.cover = function () {
  var n = vis().length;
  return '<div class="cork" aria-hidden="true"><svg width="580" height="580" style="position:absolute;inset:0"><rect width="580" height="580" filter="url(#cork)"/></svg></div>'
    + miniCard('סלט עגבניות מבושל', 'salad', '4%', 40, -10) + miniCard('עוגת שוקולד', 'sweet', 'calc(96% - 118px)', 46, 9) + miniCard('מרק קובה', 'soup', 'calc(50% - 56px)', 14, 2, 112)
    + '<div class="cover-inner"><img class="cover-logo" src="' + LOGO + '" alt="המתכונים של סבתא, ציור של סבתא אהובה">'
    + '<div class="welcome paper frame">' + GRAIN
    + '<h1>ברוכים הבאים</h1>' + ornament(150)
    + '<p>כל המתכונים מהמחברת של סבתא אהובה, כתובים מחדש ומסודרים בכרטיסים. מבשלים, טועמים, ומוסיפים מתכונים חדשים. בתיאבון!</p>'
    + '<span class="meta">' + n + ' מתכונים · ' + CH_ORDER.length + ' פרקים</span>'
    + '<button class="btn solid big" data-a="open">לפתוח את הספר' + ic('next', 18, '#FBF4E4', 2.2) + '</button>'
    + '</div></div>';
};
BIND.cover = function (el) { $('[data-a=open]', el).onclick = function () { go({ name: 'contents' }, 'next'); }; };

function matches(r, q) {
  if (!q) return true;
  q = norm(q);
  if (norm(r.title).indexOf(q) !== -1) return true;
  return r.groups.some(function (g) { return g.items.some(function (i) { return norm(i).indexOf(q) !== -1; }); });
}
function cardsHtml() {
  var V = vis(), q = ui.q.trim(), out = '';
  CH_ORDER.forEach(function (c) {
    if (ui.chip !== -1 && ui.chip !== c) return;
    var list = V.filter(function (r) { return r.chId === c && matches(r, q); });
    if (!list.length) return;
    out += '<div class="sec-h"><h2>' + esc(CH[c]) + '</h2><i></i><span>' + list.length + '</span></div><div class="grid">';
    list.forEach(function (r) {
      out += '<button class="card paper frame" data-k="' + esc(r.k) + '"><span class="num">' + r.n + '</span>'
        + '<img class="' + (r.photo ? 'ph' : 'il') + '" src="' + esc(r.img) + '" alt="" loading="lazy" style="object-position:' + esc(r.pos) + '">'
        + '<span class="t">' + esc(r.title) + '</span>' + (r.check ? '<span class="chk">לבדיקה של סבתא</span>' : '') + '</button>';
    });
    out += '</div>';
  });
  if (!out) out = '<p style="text-align:center;font-size:17px;color:var(--muted);margin:30px 0">לא נמצא מתכון. אפשר לנסות מילה אחרת.</p>';
  return out;
}
SCREENS.contents = function () {
  var chips = '<button class="chip" data-c="-1" aria-pressed="' + (ui.chip === -1) + '">הכול</button>' + CH_ORDER.map(function (c) { return '<button class="chip" data-c="' + c + '" aria-pressed="' + (ui.chip === c) + '">' + esc(CH[c]) + '</button>'; }).join('');
  return '<div class="top"><button data-a="cover" aria-label="לכריכה" style="border:0;background:none;padding:0;border-radius:50%">' + logo(52) + '</button>'
    + '<div style="flex:1;display:flex;flex-direction:column;line-height:1.05"><span class="kicker">סבתא אהובה</span><h1>כל המתכונים</h1><span class="sync">' + syncLabel() + '</span></div>'
    + '<div class="count paper"><b>' + vis().length + '</b><span>מתכונים</span></div></div>'
    + '<div style="display:flex;gap:8px;padding:2px 18px 8px;align-items:center"><label class="search">' + ic('search', 22, '#5B3A1E', 2.2)
    + '<input type="search" aria-label="חיפוש מתכון" placeholder="לחפש מתכון או מצרך…" value="' + esc(ui.q) + '"></label>'
    + '<button class="round solid" data-a="scan" aria-label="לצלם מתכון">' + ic('cam', 24, '#FBF4E4', 2) + '</button></div>'
    + '<div class="chips hs">' + chips + '</div>'
    + '<div class="scroll" style="padding:0 14px 24px">'
    + '<button class="addnew" data-a="add">' + ic('plus', 22, '#5B3A1E', 2) + 'להוסיף מתכון חדש</button>'
    + '<div id="cards">' + cardsHtml() + '</div>'
    + '<div class="pending paper frame"><h2 style="margin:0 0 6px;font-family:var(--script);font-weight:400;font-size:26px;color:var(--brown)">דפים שעוד לא נכנסו</h2>'
    + '<p style="margin:0 0 8px;font-size:15px;line-height:1.5">שמות שמופיעים במחברת בלי מתכון, או שהכתב דהוי מדי. סבתא תשלים אותם.</p><div>'
    + PENDING.map(function (p) { return '<span class="pill">' + esc(p) + '</span>'; }).join('') + '</div></div></div>';
};
BIND.contents = function (el) {
  $('[data-a=cover]', el).onclick = function () { nav = [{ name: 'cover' }]; show('back'); };
  $('[data-a=add]', el).onclick = function () { go({ name: 'add' }, 'fade'); };
  $('[data-a=scan]', el).onclick = function () { go({ name: 'addScan' }, 'fade'); };
  var inp = $('input[type=search]', el), cards = $('#cards', el);
  function bindCards() { $$('.card', cards).forEach(function (b) { b.onclick = function () { go({ name: 'recipe', k: b.dataset.k }, 'next'); }; }); }
  inp.oninput = function () { ui.q = inp.value; cards.innerHTML = cardsHtml(); bindCards(); };
  $$('.chip', el).forEach(function (b) { b.onclick = function () { ui.chip = +b.dataset.c; $$('.chip', el).forEach(function (x) { x.setAttribute('aria-pressed', x === b); }); cards.innerHTML = cardsHtml(); bindCards(); }; });
  bindCards();
};

function groupsHtml(groups) {
  return groups.map(function (g) {
    return (g.name ? '<h3 class="grp">' + esc(g.name) + '</h3>' : '') + '<ul class="ing">' + g.items.map(function (i) { return '<li><span>' + esc(i) + '</span></li>'; }).join('') + '</ul>';
  }).join('');
}
function stepsHtml(steps) { return '<ol class="steps">' + steps.map(function (s, i) { return '<li><b>' + (i + 1) + '.</b><span>' + esc(s) + '</span></li>'; }).join('') + '</ol>'; }

SCREENS.recipe = function (v) {
  var V = vis(), i = idxOf(v.k);
  if (i < 0) { var t = S.merges[v.k]; v.k = t && idxOf(t) >= 0 ? t : (V[0] && V[0].k); i = idxOf(v.k); }
  var r = V[i], editing = ui.editing === r.k;
  var sug = null;
  if (r.suggest && !S.merges[r.k]) { var si = idxOf(r.suggest); if (si >= 0) sug = V[si]; }
  var children = all().filter(function (x) { return S.merges[x.k] === r.k; });
  var h = '<div class="top" style="justify-content:space-between;padding:12px 16px 6px">'
    + '<button class="round paper" data-a="contents" aria-label="לכל המתכונים">' + ic('grid', 22, '#5B3A1E') + '</button>'
    + '<div style="display:flex;flex-direction:column;align-items:center;line-height:1.1"><span class="kicker">' + esc(r.ch) + '</span><span style="font-size:15px;color:var(--brown)">מתכון ' + r.n + ' מתוך ' + V.length + '</span></div>'
    + logo(46) + '</div>'
    + '<div class="rcard paper frame">' + GRAIN + '<div class="scroll">'
    + '<div class="hero"><img class="' + (r.photo ? 'ph' : 'il') + '" src="' + esc(r.img) + '" alt="' + esc(r.title) + '" style="object-position:' + esc(r.pos) + '">'
    + '<button class="swap" data-a="photo">' + ic('cam', 16, '#5B3A1E', 2) + (r.own ? 'להחליף שוב' : 'להחליף תמונה') + '</button>'
    + (r.credit ? '<span class="credit">' + esc(r.credit) + '</span>' : '') + '</div>'
    + '<h1 class="rtitle">' + esc(r.title) + '</h1>' + ornament()
    + '<div class="tags">' + r.tags.map(function (t) { return '<span class="tag">' + esc(t) + '</span>'; }).join('') + (r.check ? '<span class="tag warn">נקרא מכתב יד · לבדיקה</span>' : '') + '</div>'
    + (ui.note && ui.note.k === r.k ? '<div class="note">' + esc(ui.note.t) + '</div>' : '');
  if (editing) h += editForm(r);
  else {
    h += '<div class="actions"><button class="btn" data-a="edit">' + ic('pen', 16, '#5B3A1E', 2) + 'לערוך ולתקן</button><button class="btn" data-a="merge">' + ic('merge', 16, '#5B3A1E', 2) + 'לשלב במתכון אחר</button></div>';
    if (sug) h += '<div class="suggest"><span>נראה שזה שייך ל־<b>״' + esc(sug.title) + '״</b> (מתכון ' + sug.n + ')</span><button class="btn solid" data-a="sug">' + ic('merge', 16, '#FBF4E4', 2) + 'לשלב שם</button></div>';
    h += '<section>' + heading('מצרכים') + groupsHtml(r.groups) + '</section>'
      + '<section>' + heading('אופן ההכנה') + stepsHtml(r.steps) + '</section>'
      + (r.tip ? '<p class="tip"><b>טיפ של סבתא · </b>' + esc(r.tip) + '</p>' : '');
    children.forEach(function (c) {
      h += '<div class="child"><h3>' + esc(c.title) + '</h3>' + groupsHtml(c.groups) + stepsHtml(c.steps) + (c.tip ? '<p class="tip">' + esc(c.tip) + '</p>' : '')
        + '<button class="btn" data-unmerge="' + esc(c.k) + '" style="margin-top:8px">להפריד לכרטיס נפרד</button></div>';
    });
  }
  var pages = r.pages.map(pageSrc).filter(Boolean);
  if (pages.length) h += '<section>' + heading('מהמחברת') + '<p style="margin:0 0 2px;text-align:center;font-size:13px;color:var(--muted)">לוחצים על הדף כדי לראות אותו בגדול</p><div class="thumbs hs">'
    + pages.map(function (p, j) { return '<button data-page="' + j + '" aria-label="לפתוח את הדף המקורי בגדול" style="transform:rotate(' + (j % 2 ? 4 : -4) + 'deg)"><img src="' + esc(p) + '" alt="דף מהמחברת" loading="lazy"></button>'; }).join('') + '</div></section>';
  if (r.added && !editing) h += '<div style="text-align:center;margin-top:8px"><button class="btn" data-a="delete">' + ic('trash', 16, '#9A4F24', 2) + 'למחוק את המתכון</button></div>';
  h += '</div></div>'
    + '<div class="navbar"><button class="round paper" data-a="prev" aria-label="לכרטיס הקודם"' + (i === 0 ? ' disabled style="opacity:.4"' : '') + '>' + ic('back', 22, '#5B3A1E', 2) + '</button>'
    + '<span>מחליקים כדי לדפדף</span>'
    + '<button class="round solid" data-a="next" aria-label="לכרטיס הבא"' + (i === V.length - 1 ? ' disabled style="opacity:.4"' : '') + '>' + ic('next', 22, '#FBF4E4', 2.2) + '</button></div>';
  return h;
};
function chapterSelect(sel) { return '<select class="inp" name="ch">' + CH_ORDER.map(function (c) { return '<option value="' + c + '"' + (c === sel ? ' selected' : '') + '>' + esc(CH[c]) + '</option>'; }).join('') + '</select>'; }
function tagChecks(tags) { return '<div class="radio">' + TAGS.map(function (t) { return '<label><input type="checkbox" name="tag" value="' + t + '"' + (tags.indexOf(t) !== -1 ? ' checked' : '') + '>' + t + '</label>'; }).join('') + '</div>'; }
function recipeFields(r) {
  return '<label class="field"><span>שם המתכון</span><input class="inp" name="title" value="' + esc(r.title) + '"></label>'
    + '<label class="field"><span>פרק</span>' + chapterSelect(r.chId) + '</label>'
    + '<div class="field"><span>סוג</span>' + tagChecks(r.tags || []) + '</div>'
    + '<label class="field"><span>מצרכים</span><small>מצרך בכל שורה. כותרת של חלק מסיימים בנקודתיים, למשל ״לרוטב:״</small><textarea class="inp" name="ing">' + esc(ingText(r.groups)) + '</textarea></label>'
    + '<label class="field"><span>אופן ההכנה</span><small>שלב בכל שורה</small><textarea class="inp" name="steps">' + esc((r.steps || []).join('\n')) + '</textarea></label>'
    + '<label class="field"><span>טיפ של סבתא</span><textarea class="inp" name="tip" style="min-height:70px">' + esc(r.tip || '') + '</textarea></label>';
}
function readFields(form) {
  return {
    title: form.title.value.trim(), chId: +form.ch.value,
    tags: $$('input[name=tag]:checked', form).map(function (x) { return x.value; }),
    groups: parseIng(form.ing.value), steps: lines(form.steps.value), tip: form.tip.value.trim()
  };
}
function editForm(r) {
  return '<form class="edit-box" onsubmit="return false"><h3>עריכה של סבתא</h3>' + recipeFields(r)
    + '<div class="actions"><button class="btn solid" data-a="save">' + ic('check', 18, '#FBF4E4', 2.2) + 'לשמור</button><button class="btn" data-a="cancel" type="button">ביטול</button></div></form>';
}
BIND.recipe = function (el, v) {
  var V = vis(), i = idxOf(v.k), r = V[i];
  function a(n, f) { var b = $('[data-a=' + n + ']', el); if (b) b.onclick = f; }
  a('contents', function () { if (nav.length > 1 && nav[nav.length - 2].name === 'contents') back(); else replace({ name: 'contents' }, 'back'); });
  function step(d) { var j = i + d; if (j < 0 || j >= V.length) return; ui.editing = null; ui.note = null; replace({ name: 'recipe', k: V[j].k }, d > 0 ? 'next' : 'back'); }
  a('prev', function () { step(-1); }); a('next', function () { step(1); });
  a('edit', function () { ui.editing = r.k; ui.note = null; show(null, true); });
  a('cancel', function () { ui.editing = null; show(null, true); if (pendingRender) dataChanged(); });
  a('save', function () {
    var f = readFields($('form', el)); if (!f.title) f.title = r.title;
    var e = Object.assign({}, S.edits[r.k] || {}, f);
    if (r.added) { var ad = Object.assign({}, S.added[r.k], f, { check: false }); put('added', r.k, ad); }
    else put('edits', r.k, e);
    ui.editing = null; ui.note = { k: r.k, t: 'נשמר. תודה סבתא!' }; show(null, true);
  });
  a('merge', function () { mergeSheet(r); });
  a('sug', function () { doMerge(r.k, r.suggest); });
  a('photo', function () { photoSheet(r); });
  a('delete', function () { if (confirm('למחוק את ״' + r.title + '״?')) { del('added', r.k); ui.note = null; replace({ name: 'contents' }, 'back'); toast('המתכון נמחק'); } });
  $$('[data-unmerge]', el).forEach(function (b) { b.onclick = function () { del('merges', b.dataset.unmerge); show(null, true); toast('הופרד לכרטיס נפרד'); }; });
  var pages = r.pages.map(pageSrc).filter(Boolean);
  $$('[data-page]', el).forEach(function (b) { b.onclick = function () { viewer(pages, +b.dataset.page); }; });
  // swipe between cards (RTL: swipe right = next)
  var sx = null, sy = null, card = $('.rcard', el);
  card.addEventListener('touchstart', function (e) { if (ui.editing) return; sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
  card.addEventListener('touchend', function (e) {
    if (sx == null) return; var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy; sx = null;
    if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.6) step(dx > 0 ? 1 : -1);
  }, { passive: true });
};
function doMerge(src, dst) {
  put('merges', src, { into: dst });
  var t = byKey(src).title;
  ui.note = { k: dst, t: '״' + t + '״ שולב כאן.' }; ui.editing = null;
  closeLayer(); replace({ name: 'recipe', k: dst }, 'fade');
}

/* ---------------------------------------------------------------- layers: sheets & viewer */
function closeLayer() { layer.innerHTML = ''; }
function sheet(html) {
  layer.innerHTML = '<div class="sheet-bg fade-in"><div class="sheet paper">' + html + '</div></div>';
  var bg = $('.sheet-bg', layer);
  bg.onclick = function (e) { if (e.target === bg) closeLayer(); };
  return $('.sheet', layer);
}
function mergeSheet(r) {
  var el = sheet('<h3>לשלב את ״' + esc(r.title) + '״ בתוך…</h3><span style="font-size:14px;color:var(--muted);margin:4px 0 10px">הכרטיס יעבור לתוך המתכון שתבחרו, והמספור יתעדכן.</span>'
    + '<label class="search" style="flex:none">' + ic('search', 20, '#5B3A1E', 2) + '<input type="search" placeholder="לחפש לפי שם…"></label><div class="list"></div>'
    + '<button class="btn" data-a="close" style="margin-top:10px">ביטול</button>');
  var list = $('.list', el), inp = $('input', el);
  function fill() {
    var q = norm(inp.value);
    list.innerHTML = vis().filter(function (x) { return x.k !== r.k && (!q || norm(x.title).indexOf(q) !== -1); })
      .map(function (x) { return '<button class="row" data-k="' + esc(x.k) + '"><b>' + x.n + '</b>' + esc(x.title) + '</button>'; }).join('');
    $$('.row', list).forEach(function (b) { b.onclick = function () { doMerge(r.k, b.dataset.k); }; });
  }
  inp.oninput = fill; fill();
  $('[data-a=close]', el).onclick = closeLayer;
}
function pickFile(accept, capture, multiple) {
  return new Promise(function (res) {
    var i = document.createElement('input'); i.type = 'file'; i.accept = accept; if (capture) i.setAttribute('capture', 'environment'); if (multiple) i.multiple = true;
    i.onchange = function () { res(Array.prototype.slice.call(i.files || [])); };
    i.click();
  });
}
function photoSheet(r) {
  var el = sheet('<h3>תמונה ל״' + esc(r.title) + '״</h3><div style="display:flex;flex-direction:column;gap:10px;margin-top:14px">'
    + '<button class="btn solid big" data-a="cam">' + ic('cam', 20, '#FBF4E4', 2) + 'לצלם עכשיו</button>'
    + '<button class="btn big" data-a="gal">' + ic('img', 20, '#5B3A1E', 2) + 'לבחור מהגלריה</button>'
    + (S.photos[r.k] ? '<button class="btn" data-a="reset">לחזור לתמונה הקודמת</button>' : '')
    + '<button class="btn" data-a="close">ביטול</button></div>');
  function use(files) {
    if (!files.length) return; closeLayer();
    var done = busy('שומרים את התמונה…');
    compress(files[0], 1000, 0.72).then(function (d) { return put('photos', r.k, { data: d, credit: 'צילום של המשפחה' }); })
      .then(function () { done(); ui.note = { k: r.k, t: 'התמונה הוחלפה.' }; show(null, true); }, function () { done(); toast('לא הצלחנו לקרוא את התמונה'); });
  }
  $('[data-a=cam]', el).onclick = function () { pickFile('image/*', true).then(use); };
  $('[data-a=gal]', el).onclick = function () { pickFile('image/*').then(use); };
  if ($('[data-a=reset]', el)) $('[data-a=reset]', el).onclick = function () { del('photos', r.k); closeLayer(); show(null, true); };
  $('[data-a=close]', el).onclick = closeLayer;
}
function viewer(pages, i) {
  layer.innerHTML = '<div class="viewer fade-in"><div class="bar"><button class="vb" data-a="x" aria-label="לסגור">' + ic('x', 22, '#FBF4E4', 2.2) + '</button>'
    + '<span class="lbl"></span><div style="display:flex;gap:6px"><button class="vb" data-a="out" aria-label="להקטין">' + ic('minus', 22, '#FBF4E4', 2.2) + '</button><button class="vb" data-a="in" aria-label="להגדיל">' + ic('plus', 22, '#FBF4E4', 2.2) + '</button></div></div>'
    + '<div class="area"><img alt="הדף המקורי מהמחברת"></div>'
    + (pages.length > 1 ? '<div class="bar"><button class="vb" data-a="p" aria-label="הדף הקודם">' + ic('back', 22, '#FBF4E4', 2.2) + '</button><span style="font-size:14px">החלקה בשתי אצבעות לזום</span><button class="vb" data-a="n" aria-label="הדף הבא">' + ic('next', 22, '#FBF4E4', 2.2) + '</button></div>' : '<div class="bar" style="justify-content:center"><span style="font-size:14px">צביטה בשתי אצבעות או לחיצה כפולה לזום</span></div>')
    + '</div>';
  var root = $('.viewer', layer), img = $('img', root), area = $('.area', root), lbl = $('.lbl', root);
  var z = 1, tx = 0, ty = 0;
  function apply() { img.style.transform = 'translate(-50%,-50%) translate(' + tx + 'px,' + ty + 'px) scale(' + z + ')'; }
  function load() { img.src = pages[i]; z = 1; tx = ty = 0; apply(); lbl.textContent = 'דף ' + (i + 1) + ' מתוך ' + pages.length; }
  function zoom(f) { z = Math.max(1, Math.min(5, z * f)); if (z === 1) { tx = ty = 0; } apply(); }
  $('[data-a=x]', root).onclick = closeLayer;
  $('[data-a=in]', root).onclick = function () { zoom(1.5); };
  $('[data-a=out]', root).onclick = function () { zoom(1 / 1.5); };
  if ($('[data-a=p]', root)) { $('[data-a=p]', root).onclick = function () { i = (i - 1 + pages.length) % pages.length; load(); }; $('[data-a=n]', root).onclick = function () { i = (i + 1) % pages.length; load(); }; }
  var pts = {}, start = null, lastTap = 0;
  area.addEventListener('pointerdown', function (e) {
    area.setPointerCapture(e.pointerId); pts[e.pointerId] = { x: e.clientX, y: e.clientY };
    var ids = Object.keys(pts);
    if (ids.length === 1) {
      var now = Date.now(); if (now - lastTap < 300) { if (z > 1) { z = 1; tx = ty = 0; } else z = 2.5; apply(); } lastTap = now;
    }
    start = snap();
  });
  function snap() { var ids = Object.keys(pts), a = pts[ids[0]], b = pts[ids[1]]; return { z: z, tx: tx, ty: ty, a: a && { x: a.x, y: a.y }, d: b ? Math.hypot(a.x - b.x, a.y - b.y) : 0 }; }
  area.addEventListener('pointermove', function (e) {
    if (!pts[e.pointerId]) return; pts[e.pointerId] = { x: e.clientX, y: e.clientY };
    var ids = Object.keys(pts);
    if (ids.length >= 2 && start.d) { var a = pts[ids[0]], b = pts[ids[1]]; z = Math.max(1, Math.min(5, start.z * Math.hypot(a.x - b.x, a.y - b.y) / start.d)); apply(); }
    else if (ids.length === 1 && z > 1) { var p = pts[ids[0]]; tx = start.tx + p.x - start.a.x; ty = start.ty + p.y - start.a.y; apply(); }
  });
  function up(e) { delete pts[e.pointerId]; start = snap(); if (z === 1) { tx = ty = 0; apply(); } }
  area.addEventListener('pointerup', up); area.addEventListener('pointercancel', up);
  load();
}

/* ---------------------------------------------------------------- add recipe */
function addTop(title) {
  return '<div class="top"><button class="round paper" data-a="back" aria-label="חזרה">' + ic('back', 22, '#5B3A1E', 2) + '</button>'
    + '<div style="flex:1;display:flex;flex-direction:column;line-height:1.05"><span class="kicker">מתכון חדש</span><h1>' + esc(title) + '</h1></div>' + logo(46) + '</div>';
}
function bindBack(el) { $('[data-a=back]', el).onclick = function () { back(); }; }
SCREENS.add = function () {
  function opt(a, icon, t, d) { return '<button class="opt paper frame" data-a="' + a + '">' + GRAIN + '<span class="ic">' + ic(icon, 26, '#FBF4E4', 2) + '</span><span><b>' + t + '</b><small>' + d + '</small></span></button>'; }
  return addTop('להוסיף מתכון') + '<div class="scroll" style="padding:8px 16px 24px">'
    + opt('write', 'pen', 'לכתוב בעצמי', 'תבנית פשוטה: שם, מצרכים, אופן ההכנה.')
    + opt('scan', 'cam', 'לצלם דף מהמחברת', 'מצלמים את הדף, והאפליקציה קוראת את כתב היד וממלאת לבד. אפשר לבדוק ולתקן לפני השמירה.')
    + opt('file', 'doc', 'מקובץ או ממסמך', 'קובץ וורד מהטלפון, או קישור למסמך של גוגל.')
    + '</div>';
};
BIND.add = function (el) {
  bindBack(el);
  $('[data-a=write]', el).onclick = function () { replace({ name: 'addWrite' }, 'fade'); };
  $('[data-a=scan]', el).onclick = function () { replace({ name: 'addScan' }, 'fade'); };
  $('[data-a=file]', el).onclick = function () { replace({ name: 'addFile' }, 'fade'); };
};
SCREENS.addWrite = function () {
  return addTop('לכתוב מתכון') + '<div class="scroll" style="padding:8px 16px 24px"><form class="edit-box paper frame" onsubmit="return false" style="background:none">'
    + '<div style="position:relative;z-index:1;display:flex;flex-direction:column;gap:12px">' + recipeFields({ title: '', chId: 0, tags: [], groups: [], steps: [], tip: '' })
    + '<button class="btn solid big" data-a="save">' + ic('check', 18, '#FBF4E4', 2.2) + 'לשמור בספר</button></div></form></div>';
};
function saveNew(f, pages, check) {
  var k = 'n_' + uid();
  put('added', k, Object.assign({}, f, { pages: pages || [], check: !!check, created: Date.now() }));
  return k;
}
BIND.addWrite = function (el) {
  bindBack(el);
  $('[data-a=save]', el).onclick = function () {
    var f = readFields($('form', el));
    if (!f.title) { toast('צריך לכתוב שם למתכון'); return; }
    var k = saveNew(f);
    ui.note = { k: k, t: 'המתכון נוסף לספר!' };
    replace({ name: 'recipe', k: k }, 'next');
  };
};

/* ---- Gemini: read handwriting / structure text */
var MODELS = ['gemini-2.5-flash', 'gemini-flash-latest'];
function gemini(parts) {
  var key = CFG.geminiKey;
  if (!key) return Promise.reject(new Error('nokey'));
  var body = JSON.stringify({ contents: [{ role: 'user', parts: parts }], generationConfig: { responseMimeType: 'application/json', temperature: 0.2 } });
  function tryModel(i) {
    return fetch('https://generativelanguage.googleapis.com/v1beta/models/' + MODELS[i] + ':generateContent?key=' + encodeURIComponent(key), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: body })
      .then(function (res) {
        if (res.status === 404 && i + 1 < MODELS.length) return tryModel(i + 1);
        if (!res.ok) return res.text().then(function (t) { throw new Error('http ' + res.status + ' ' + t.slice(0, 200)); });
        return res.json().then(function (j) {
          var t = j.candidates && j.candidates[0] && j.candidates[0].content && j.candidates[0].content.parts.map(function (p) { return p.text || ''; }).join('');
          t = (t || '').replace(/^```(json)?/, '').replace(/```$/, '').trim();
          var o = JSON.parse(t);
          return (o.recipes || (Array.isArray(o) ? o : [o])).filter(function (r) { return r && r.title; });
        });
      });
  }
  return tryModel(0);
}
var PROMPT = 'אתה עוזר להעתיק מתכונים ממחברת של סבתא בכתב יד עברי. '
  + 'החזר JSON בלבד במבנה: {"recipes":[{"title":"","chapter":"","tags":[],"groups":[{"name":"","items":[""]}],"steps":[""],"tip":"","unclear":false}]}. '
  + 'chapter חייב להיות אחד מ: ' + CH.join(' | ') + '. tags: תת-קבוצה של ' + TAGS.join(', ') + '. '
  + 'groups: רשימות מצרכים עם כמויות כפי שכתוב; name ריק אם אין חלוקה (למשל "לבצק", "לרוטב"). '
  + 'steps: שלבי הכנה קצרים וברורים בלשון מקור ("לערבב...", "לאפות..."). tip: הערה או טיפ אם יש. '
  + 'אל תמציא מצרכים או כמויות. אם מילה לא ברורה כתוב את הניחוש הטוב ביותר עם (?) וסמן unclear=true. '
  + 'אם יש כמה מתכונים בדף, החזר את כולם.';
function chapterId(name) { var i = CH.indexOf(name); if (i >= 0) return i; for (var j = 0; j < CH.length; j++) if (name && (CH[j].indexOf(name) !== -1 || name.indexOf(CH[j].split(' ')[0]) !== -1)) return j; return 0; }
function cleanRecipe(r) {
  return { title: String(r.title || '').trim(), chId: chapterId(r.chapter), tags: (r.tags || []).filter(function (t) { return TAGS.indexOf(t) !== -1; }),
    groups: (r.groups || []).map(function (g) { return { name: String(g.name || ''), items: (g.items || []).map(String).filter(Boolean) }; }).filter(function (g) { return g.items.length; }),
    steps: (r.steps || []).map(String).filter(Boolean), tip: String(r.tip || ''), unclear: !!r.unclear };
}
function findDup(title) {
  var t = norm(title), tw = t.split(' ').filter(function (w) { return w.length > 1; }), best = null, bs = 0;
  vis().concat(all().filter(function (x) { return S.merges[x.k]; })).forEach(function (r) {
    var n = norm(r.title); var s = 0;
    if (n === t) s = 1;
    else if (n && t && (n.indexOf(t) !== -1 || t.indexOf(n) !== -1)) s = 0.8;
    else { var rw = n.split(' ').filter(function (w) { return w.length > 1; }), common = tw.filter(function (w) { return rw.indexOf(w) !== -1; }).length; s = common / Math.max(1, Math.max(tw.length, rw.length)); }
    if (s > bs) { bs = s; best = r; }
  });
  return bs >= 0.6 ? best : null;
}

SCREENS.addScan = function () {
  return addTop('לצלם דף') + '<div class="scroll" style="padding:8px 16px 24px" id="scanbody">'
    + '<div class="found paper frame" style="text-align:center">' + GRAIN
    + '<p style="font-size:16px;line-height:1.55;margin:4px 0 14px">מצלמים את הדף ישר ובאור טוב. אפשר לצלם כמה דפים של אותו מתכון יחד.</p>'
    + '<div style="display:flex;flex-direction:column;gap:10px"><button class="btn solid big" data-a="cam">' + ic('cam', 20, '#FBF4E4', 2) + 'לצלם עכשיו</button>'
    + '<button class="btn big" data-a="gal">' + ic('img', 20, '#5B3A1E', 2) + 'לבחור תמונות מהגלריה</button></div>'
    + (CFG.geminiKey ? '' : '<p class="dup" style="margin-top:12px">קריאת כתב היד עוד לא הופעלה בגרסה הזו. אפשר לצלם, ואז למלא את המתכון ידנית.</p>')
    + '</div><div id="shots" class="thumbs hs"></div><div id="results"></div></div>';
};
BIND.addScan = function (el) {
  bindBack(el);
  var shots = [];
  function got(files) {
    if (!files.length) return;
    var done = busy('מכינים את התמונות…');
    Promise.all(files.map(function (f) { return compress(f, 1600, 0.8); })).then(function (urls) {
      done(); shots = shots.concat(urls);
      $('#shots', el).innerHTML = shots.map(function (u) { return '<button><img src="' + u + '" alt=""></button>'; }).join('');
      read();
    }, function () { done(); toast('לא הצלחנו לפתוח את התמונה'); });
  }
  $('[data-a=cam]', el).onclick = function () { pickFile('image/*', true).then(got); };
  $('[data-a=gal]', el).onclick = function () { pickFile('image/*', false, true).then(got); };
  function read() {
    if (!CFG.geminiKey) { review(el, [cleanRecipe({ title: '', steps: [] })], shots); return; }
    var done = busy('קוראים את כתב היד… זה לוקח כמה שניות');
    var parts = [{ text: PROMPT }].concat(shots.map(function (u) { return { inline_data: { mime_type: 'image/jpeg', data: u.split(',')[1] } }; }));
    gemini(parts).then(function (rs) {
      done();
      if (!rs.length) { toast('לא מצאנו מתכון בתמונה. אפשר לנסות שוב או למלא ידנית.'); rs = [{ title: '' }]; }
      review(el, rs.map(cleanRecipe), shots);
    }, function (e) { done(); console.warn(e); toast('הקריאה לא הצליחה (' + (navigator.onLine ? 'שגיאה' : 'אין אינטרנט') + '). אפשר למלא ידנית.'); review(el, [cleanRecipe({ title: '' })], shots); });
  }
};
/* review screen for recipes found by OCR / file import */
function review(el, recipes, shots) {
  var box = $('#results', el) || $('.scroll', el);
  box.innerHTML = '<div class="sec-h"><h2>' + (recipes.length > 1 ? 'נמצאו ' + recipes.length + ' מתכונים' : 'מה שקראנו') + '</h2><i></i></div>'
    + recipes.map(function (r, i) {
      var d = r.title && findDup(r.title);
      return '<form class="found paper frame" data-i="' + i + '" onsubmit="return false">' + GRAIN + '<div style="display:flex;flex-direction:column;gap:12px">'
        + (r.unclear ? '<p class="dup" style="margin:0">חלק מהמילים לא היו ברורות, מסומנות ב־(?). כדאי לבדוק.</p>' : '')
        + (d ? '<div class="dup">נראה שהמתכון כבר בספר: ״' + esc(d.title) + '״' + (d.n ? ' (מתכון ' + d.n + ')' : '') + '</div>'
          + '<div class="radio"><label><input type="radio" name="mode' + i + '" value="new">להוסיף כמתכון נפרד</label><label><input type="radio" name="mode' + i + '" value="upd" checked>לעדכן את הקיים</label><label><input type="radio" name="mode' + i + '" value="skip">לדלג</label></div>'
          + '<input type="hidden" name="dup" value="' + esc(d.k) + '">' : '')
        + recipeFields(r) + '</div></form>';
    }).join('')
    + '<button class="btn solid big" data-a="saveall" style="width:100%">' + ic('check', 18, '#FBF4E4', 2.2) + 'לשמור בספר</button>';
  $('[data-a=saveall]', box).onclick = function () {
    var pageIds = [];
    var done = busy('שומרים…');
    var savePages = (shots || []).map(function (u) { var id = uid(); pageIds.push('fs:' + id); return put('pages', id, { data: u }); });
    Promise.all(savePages).then(function () {
      var first = null, n = 0;
      $$('form[data-i]', box).forEach(function (form) {
        var i = +form.dataset.i, mode = (form.querySelector('input[type=radio]:checked') || {}).value || 'new';
        var f = readFields(form);
        if (mode === 'skip' || !f.title) return;
        if (mode === 'upd' && form.dup) {
          var k = form.dup.value, target = byKey(k);
          if (target.added) put('added', k, Object.assign({}, S.added[k], f, { pages: (S.added[k].pages || []).concat(pageIds) }));
          else put('edits', k, Object.assign({}, S.edits[k] || {}, f, { extraPages: ((S.edits[k] || {}).extraPages || []).concat(pageIds) }));
          if (S.merges[k]) del('merges', k);
          first = first || k;
        } else first = first || saveNew(f, pageIds, recipes[i].unclear);
        n++;
      });
      done();
      if (!first) { toast('לא נשמר כלום'); return; }
      ui.note = { k: first, t: n > 1 ? n + ' מתכונים נשמרו בספר!' : 'נשמר בספר!' };
      formOpen = false; nav = [{ name: 'cover' }, { name: 'contents' }, { name: 'recipe', k: first }]; show('next');
    });
  };
  box.scrollIntoView && setTimeout(function () { box.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 60);
}

SCREENS.addFile = function () {
  return addTop('מקובץ') + '<div class="scroll" style="padding:8px 16px 24px">'
    + '<div class="found paper frame">' + GRAIN + '<div style="display:flex;flex-direction:column;gap:12px">'
    + '<b style="font-family:var(--script);font-weight:400;font-size:26px;color:var(--brown)">קובץ מהטלפון</b>'
    + '<p style="margin:0;font-size:15px">קובץ Word מסוג docx, או קובץ טקסט.</p>'
    + '<button class="btn solid big" data-a="pick">' + ic('doc', 20, '#FBF4E4', 2) + 'לבחור קובץ</button></div></div>'
    + '<div class="found paper frame">' + GRAIN + '<div style="display:flex;flex-direction:column;gap:12px">'
    + '<b style="font-family:var(--script);font-weight:400;font-size:26px;color:var(--brown)">קישור ל־Google Docs</b>'
    + '<p style="margin:0;font-size:15px">המסמך צריך להיות משותף ל״כל מי שיש לו את הקישור״.</p>'
    + '<input class="inp" name="url" dir="ltr" placeholder="https://docs.google.com/document/d/…">'
    + '<button class="btn big" data-a="link">' + ic('link', 20, '#5B3A1E', 2) + 'לקרוא מהקישור</button></div></div>'
    + '<div id="results"></div></div>';
};
function structureText(el, text) {
  text = String(text || '').trim();
  if (!text) { toast('הקובץ ריק'); return; }
  if (!CFG.geminiKey) {
    var ls = text.split('\n').map(function (x) { return x.trim(); }).filter(Boolean);
    review(el, [{ title: ls[0] || '', chId: 0, tags: [], groups: [{ name: '', items: [] }], steps: ls.slice(1), tip: '' }], []);
    return;
  }
  var done = busy('מסדרים את המתכון…');
  gemini([{ text: PROMPT + '\nהנה הטקסט של המתכון (לא כתב יד, רק לסדר):\n\n' + text.slice(0, 30000) }]).then(function (rs) { done(); review(el, rs.map(cleanRecipe), []); },
    function (e) { done(); console.warn(e); var ls = text.split('\n').filter(Boolean); review(el, [{ title: ls[0] || '', chId: 0, tags: [], groups: [], steps: ls.slice(1), tip: '' }], []); });
}
function getText(url) {
  var H = window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform() && window.Capacitor.Plugins.CapacitorHttp;
  if (H) return H.get({ url: url, responseType: 'text' }).then(function (r) { if (r.status >= 400) throw new Error(r.status); return typeof r.data === 'string' ? r.data : JSON.stringify(r.data); });
  return fetch(url).then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); });
}
BIND.addFile = function (el) {
  bindBack(el);
  $('[data-a=pick]', el).onclick = function () {
    pickFile('.docx,.txt,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain').then(function (files) {
      var f = files[0]; if (!f) return;
      if (/\.doc$/i.test(f.name)) { toast('קובץ doc ישן לא נתמך. אפשר לשמור אותו מחדש כ־docx.'); return; }
      if (/\.txt$/i.test(f.name) || f.type === 'text/plain') { readFile(f, 'readAsText').then(function (t) { structureText(el, t); }); return; }
      readFile(f, 'readAsArrayBuffer').then(function (buf) { return window.mammoth.extractRawText({ arrayBuffer: buf }); })
        .then(function (r) { structureText(el, r.value); }, function () { toast('לא הצלחנו לקרוא את הקובץ'); });
    });
  };
  $('[data-a=link]', el).onclick = function () {
    var u = $('input[name=url]', el).value.trim(), m = u.match(/\/document\/d\/([\w-]+)/);
    if (!m) { toast('זה לא נראה כמו קישור ל־Google Docs'); return; }
    var done = busy('קוראים את המסמך…');
    getText('https://docs.google.com/document/d/' + m[1] + '/export?format=txt')
      .then(function (t) { done(); if (/<html/i.test(t.slice(0, 200))) throw new Error('private'); structureText(el, t); })
      .catch(function () { done(); toast('לא הצלחנו לפתוח. בדקו שהמסמך משותף לכל מי שיש לו את הקישור.'); });
  };
};

/* ---------------------------------------------------------------- boot */
document.addEventListener('backbutton', function (e) { e.preventDefault(); back(); });
try {
  var Cap = window.Capacitor;
  if (Cap && Cap.Plugins && Cap.Plugins.App) Cap.Plugins.App.addListener('backButton', function () { if (!back()) Cap.Plugins.App.exitApp(); });
} catch (e) {}
show();
initCloud();
})();
