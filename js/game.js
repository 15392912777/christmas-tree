/**
 * 圣诞树默契问答 · 原创版 —— 游戏引擎
 * ---------------------------------------------------------------------------
 * 世界坐标：圣诞树占 320×640 单位；镜头用 translateY / scale 在树上取景。
 * 每答对一题，玩家的圣诞球上升一层、该层彩灯点亮、顶部花环亮一颗。
 * 所有插画来自 js/art.js（场景/UI）与 js/mascots.js（狐狸与松鼠）；本文件不含图片。
 */
(function () {
  'use strict';

  var Q = window.XM_QUIZ;
  var A = window.XM_ART;
  var M = window.XM_MASCOTS;
  var SND = window.XMSound || null;
  var C = Q.copy;
  var $ = function (id) { return document.getElementById(id); };

  var W = 320, H = 640, CX = 160;
  var TIER_Y = A.tierY;
  var NOTCH_SIDE = [-.16, .14, -.5, .46, -.44, .5, -.46, .42, -.4, .2];
  var DECO_SIDE = [-.08, -.52, .48, -.5, .52, -.46, .5, -.5, .44, -.42];
  var DECOS = ['bell', 'candy-cane', 'bow', 'gingerbread', 'snowflake', 'red', 'present', 'pinecone', 'heart', 'icicle'];
  var GARLAND_BULBS = [.062, .163, .264, .362, .46, .557, .656, .752, .853, .953];
  var BULB_COLORS = ['#FF6B6B', '#FFD34D', '#7FD1AE', '#FF7EB0', '#7FB6FF'];
  var BAUBLE_COLORS = [['#FF8A7A', '#B4342C'], ['#FFE07A', '#C99A12'], ['#6FD69A', '#23704A'], ['#7FA9F0', '#2B5AA6'],
    ['#FF8FBC', '#C7336A'], ['#AD8CF0', '#6340A6'], ['#C3D0E8', '#66779C']];
  var ZONE_SPOTS = {
    top: [[160, 100], [132, 158], [188, 158], [160, 224]],
    front: [[160, 300], [104, 324], [216, 324], [160, 356]],
    bottom: [[222, 452], [98, 452], [160, 474], [280, 474]],
    box: [[112, 520], [94, 528], [130, 528], [112, 534]]
  };

  var S = { name: '', score: 0, index: 0, locked: false, built: false, streakR: 0 };
  var els = {};
  var cam = null, resultCam = null;
  var playerBall = null, playerBallResult = null, rivalEls = [];

  // ── helpers ─────────────────────────────────────────────────────────────────
  function f(n) { return Math.round(n * 10) / 10; }
  function tf(tpl, vars) {
    return String(tpl == null ? '' : tpl).replace(/\{(\w+)\}/g, function (m, k) {
      return vars && vars[k] != null ? String(vars[k]) : m;
    });
  }
  function vars(extra) {
    var v = {
      creator: Q.creator, them: Q.pronouns.them, their: Q.pronouns.their,
      mood: Q.mood, top: Q.top, total: Q.questions.length, name: S.name || '你'
    };
    if (extra) { for (var k in extra) { v[k] = extra[k]; } }
    return v;
  }
  function tt(tpl, extra) { return tf(tpl, vars(extra)); }
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function marked(text, extra) {
    var src = tt(text, extra), parts = String(src).split(Q.creator), out = '';
    for (var i = 0; i < parts.length; i++) {
      out += esc(parts[i]);
      if (i < parts.length - 1) { out += '<span class="name">' + esc(Q.creator) + '</span>'; }
    }
    return out;
  }
  var TIER_HW = A.tierWidths;
  /** The tree's half width at height y — matches the drawn tiers so lights/ornaments/baubles sit on branches. */
  function halfWidth(y) {
    if (y >= TIER_Y[0]) { return TIER_HW[0]; }
    if (y <= TIER_Y[9]) { return Math.max(5, TIER_HW[9] * y / TIER_Y[9]); }
    for (var i = 1; i <= 9; i++) {
      if (y >= TIER_Y[i]) {
        var t = (y - TIER_Y[i]) / (TIER_Y[i - 1] - TIER_Y[i]);
        return TIER_HW[i] + (TIER_HW[i - 1] - TIER_HW[i]) * t;
      }
    }
    return TIER_HW[0];
  }
  function notchPoint(n) {
    if (n <= 0) { return [112, 520]; }
    var y = TIER_Y[n - 1] - 20;
    return [CX + NOTCH_SIDE[n - 1] * halfWidth(y + 8), y];
  }
  function decoPoint(n) {
    var y = TIER_Y[n - 1] - 16;
    return [CX + DECO_SIDE[n - 1] * halfWidth(y + 8), y];
  }
  function colorOf(name) {
    var hsh = 2166136261, s = name || '?';
    for (var i = 0; i < s.length; i++) { hsh ^= s.charCodeAt(i); hsh = Math.imul(hsh, 16777619); }
    return BAUBLE_COLORS[(hsh >>> 0) % BAUBLE_COLORS.length];
  }
  function sfx(name, arg) { try { if (SND) { SND.sfx(name, arg); } } catch (e) {} }
  function buzz(ms) { try { if (navigator.vibrate) { navigator.vibrate(ms); } } catch (e) {} }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function stripEmoji(s) {
    try { return String(s).replace(/\s*[\p{Extended_Pictographic}\uFE0F]+$/u, ''); }
    catch (e) { return String(s).replace(/\s*[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}]\uFE0F?$/u, ''); }
  }
  function zoneOfScore(score, n) {
    n = n || Q.questions.length;
    return score >= Math.ceil(n * 0.9) ? 'top' : score >= Math.ceil(n * 0.7) ? 'front'
      : score >= Math.ceil(n * 0.5) ? 'bottom' : 'box';
  }

  // ── art builders ────────────────────────────────────────────────────────────
  function lightsSVG(prefix) {
    var s = '<svg viewBox="0 0 320 640" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">';
    s += '<rect class="dimmer" width="320" height="640" fill="#06171D"/>';
    for (var n = 1; n <= 10; n++) {
      var y = TIER_Y[n - 1], hw = halfWidth(y) * .82, x0 = CX - hw, x2 = CX + hw, y0 = y - 8, y1 = y + 14;
      s += '<g class="tier" data-n="' + n + '">';
      s += '<path class="path" d="M' + f(x0) + ' ' + f(y0) + ' Q' + CX + ' ' + f(y1) + ' ' + f(x2) + ' ' + f(y0) + '"/>';
      var count = Math.max(3, Math.round(hw * 2 / 22));
      for (var j = 0; j < count; j++) {
        var t = (j + .5) / count;
        var bx = (1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * CX + t * t * x2;
        var by = (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * y1 + t * t * y0;
        var c = BULB_COLORS[(j + n) % BULB_COLORS.length];
        s += '<circle class="glow" cx="' + f(bx) + '" cy="' + f(by + 3) + '" r="8" fill="' + c + '" style="animation-delay:-' + ((j * 7 + n * 3) % 10) / 5 + 's"/>'
          + '<circle class="bulb" cx="' + f(bx) + '" cy="' + f(by + 3) + '" r="3.6" style="--c:' + c + '"/>';
      }
      s += '</g>';
    }
    s += '</svg>';
    return s;
  }

  function treeLayerHTML(prefix, lit) {
    return '<div class="tree-art">'
      + '<div class="room-svg">' + A.room(prefix + '-room') + '</div>'
      + '<div class="tree-svg">' + A.tree(prefix + '-tree', lit) + '</div>'
      + '<div class="lights-svg">' + lightsSVG(prefix + '-lights') + '</div>'
      + '</div>'
      + '<div class="box-front" style="left:' + f(112 / W * 100) + '%;top:' + f(578 / H * 100) + '%">' + A.box() + '</div>';
  }

  function decorate(layer) {
    for (var n = 1; n <= 10; n++) {
      var pt = decoPoint(n);
      var el = document.createElement('div');
      el.className = 'deco';
      el.innerHTML = A.ornament(DECOS[n - 1]);
      el.style.left = f(pt[0] / W * 100) + '%';
      el.style.top = f(pt[1] / H * 100) + '%';
      layer.appendChild(el);
    }
  }

  function baubleEl(name, cls) {
    var c = colorOf(name);
    var el = document.createElement('div');
    el.className = 'bauble ' + (cls || '');
    el.style.setProperty('--b1', c[0]);
    el.style.setProperty('--b2', c[1]);
    el.innerHTML = '<i class="bauble-shadow"></i><span class="bauble-swing"><i class="bauble-cap"></i>'
      + '<span class="bauble-glass"><span class="bauble-name"></span></span></span>' + A.twig();
    setBaubleName(el, name);
    return el;
  }

  function setBaubleName(el, name) {
    if (!el) { return; }
    var chars = Array.from(name || '?');
    var mono = chars.length > 5;
    el.querySelector('.bauble-name').textContent = mono ? chars[0] : (name || '?');
    el.classList.toggle('is-mono', mono);
    var swing = el.querySelector('.bauble-swing');
    var tag = el.querySelector('.bauble-tag');
    if (mono) {
      el.style.setProperty('--fs', 1);
      if (!tag && swing) {
        tag = document.createElement('span');
        tag.className = 'bauble-tag';
        swing.appendChild(tag);
      }
      if (tag) { tag.textContent = name; }
    } else {
      if (tag) { tag.remove(); }
      el.style.setProperty('--fs', Math.round(Math.min(1, 3.6 / Math.max(1, chars.length)) * 100) / 100);
    }
    var c = colorOf(name || '?');
    el.style.setProperty('--b1', c[0]);
    el.style.setProperty('--b2', c[1]);
  }

  function pose(el, who, name) {
    if (!el || !M) { return; }
    var fn = who === 'elf' ? M.squirrel : M.fox;
    if (typeof fn !== 'function') { return; }
    var html = fn(name);
    if (el._pose !== name) { el.innerHTML = html; el._pose = name; }
  }
  function hop(el) {
    if (!el) { return; }
    el.classList.remove('hop');
    void el.offsetWidth;
    el.classList.add('hop');
    setTimeout(function () { el.classList.remove('hop'); }, 700);
  }

  // ── camera ──────────────────────────────────────────────────────────────────
  function makeCam(camEl, layerEl, opts) {
    opts = opts || {};
    function sizeLayer() {
      var cw = camEl.clientWidth, ch = camEl.clientHeight;
      var lw = Math.max(cw, ch / 2);
      layerEl.style.width = lw + 'px';
      layerEl.style.height = (lw * 2) + 'px';
      layerEl.style.left = ((cw - lw) / 2) + 'px';
    }
    function focus(y, instant) {
      camEl.classList.remove('is-wide');
      var camH = camEl.clientHeight, LH = layerEl.offsetHeight;
      var ty = Math.max(camH - LH, Math.min(0, camH / 2 - y / H * LH));
      if (instant) { layerEl.style.transition = 'none'; }
      layerEl.style.transform = 'translateY(' + f(ty) + 'px)';
      if (instant) { layerEl.offsetHeight; layerEl.style.transition = ''; }
      ctl.last = ['focus', y];
    }
    function clearTop(objH) {
      var top = 0, bottom = camEl.clientHeight - 30;
      if (opts.garland) { top = opts.garland.offsetTop + opts.garland.offsetHeight * .8; }
      (opts.cast || []).forEach(function (c) {
        if (c && c.style.visibility !== 'hidden') { bottom = Math.min(bottom, c.offsetTop + 6); }
      });
      if (bottom - 72 - top >= objH + 8) { bottom -= 72; }
      else if (bottom - 40 - top >= objH + 8) { bottom -= 40; }
      return bottom - top >= objH + 8 ? top + (bottom - top - objH) / 2 : top + 4;
    }
    function focusAt(y, screenY, instant) {
      camEl.classList.remove('is-wide');
      var camH = camEl.clientHeight, LH = layerEl.offsetHeight, ty = screenY - y / H * LH, s = 1;
      if (ty < camH - LH && y < H) {
        s = Math.min(1.4, Math.max(1, (camH - screenY) / (LH * (1 - y / H))));
        ty = Math.max(camH - LH * s, screenY - y / H * LH * s);
      }
      if (instant) { layerEl.style.transition = 'none'; }
      layerEl.style.transform = 'translateY(' + f(Math.min(0, ty)) + 'px)' + (s > 1 ? ' scale(' + f(s * 1000) / 1000 + ')' : '');
      if (instant) { layerEl.offsetHeight; layerEl.style.transition = ''; }
      ctl.last = ['at', y, screenY];
    }
    function focusOn(y, objH) { focusAt(y, clearTop(objH || 100)); ctl.last = ['on', y, objH]; }
    function wide(top) {
      top = top || 0;
      camEl.classList.add('is-wide');
      var camH = camEl.clientHeight, s = (camH - top) / layerEl.offsetHeight;
      layerEl.style.transform = 'translateY(' + top + 'px) scale(' + f(s * 1000) / 1000 + ')';
      ctl.last = ['wide', top];
    }
    function light(n, on, delay) {
      var g = layerEl.querySelector('.tier[data-n="' + n + '"]');
      if (!g) { return; }
      if (delay) { setTimeout(function () { g.classList.add('is-on'); }, delay); }
      else { g.classList.toggle('is-on', on !== false); }
    }
    function lightAll(step) { for (var n = 1; n <= 10; n++) { light(n, true, n * (step || 0)); } }
    function place(el, pt) {
      if (!el.parentNode) { layerEl.appendChild(el); }
      el.style.left = f(pt[0] / W * 100) + '%';
      el.style.top = f(pt[1] / H * 100) + '%';
      if (el.classList.contains('bauble')) {
        el.classList.remove('is-landed');
        void el.offsetWidth;
        setTimeout(function () { el.classList.add('is-landed'); }, 60);
      }
      return el;
    }
    function toCam(pt) {
      var lr = layerEl.getBoundingClientRect(), cr = camEl.getBoundingClientRect();
      return [lr.left - cr.left + pt[0] / W * lr.width, lr.top - cr.top + pt[1] / H * lr.height];
    }
    function punch() { var sh = camEl.querySelector('.shot'); if (!sh) { return; } sh.classList.remove('punch'); void sh.offsetWidth; sh.classList.add('punch'); }
    function shake() { var sh = camEl.querySelector('.shot'); if (!sh) { return; } sh.classList.remove('shake'); void sh.offsetWidth; sh.classList.add('shake'); }
    function dim(on) { camEl.classList.toggle('is-dim', on !== false); }
    function star(on) { var g = layerEl.querySelector('.star-glow'); if (g) { g.style.opacity = on === false ? '0' : '.9'; } }
    function fizzle(n) {
      var g = layerEl.querySelector('.tier[data-n="' + Math.min(10, Math.max(1, n)) + '"]');
      if (!g) { return; }
      var bulbs = g.querySelectorAll('.bulb');
      if (!bulbs.length) { return; }
      var b = bulbs[Math.floor(Math.random() * bulbs.length)];
      b.classList.remove('is-fizzle'); void b.getBoundingClientRect(); b.classList.add('is-fizzle');
    }
    var ctl = { el: camEl, layer: layerEl, focus: focus, focusAt: focusAt, focusOn: focusOn, wide: wide, light: light, lightAll: lightAll, place: place, toCam: toCam, punch: punch, shake: shake, dim: dim, star: star, fizzle: fizzle };
    sizeLayer();
    if (window.ResizeObserver) {
      ctl.ro = new ResizeObserver(function () {
        sizeLayer();
        if (!ctl.last) { return; }
        var l = ctl.last;
        if (l[0] === 'wide') { wide(l[1]); }
        else if (l[0] === 'on') { focusOn(l[1], l[2]); }
        else if (l[0] === 'at') { focusAt(l[1], l[2]); }
        else { focus(l[1], true); }
      });
      ctl.ro.observe(camEl);
    }
    return ctl;
  }

  // ── snow / sparkles / speech ────────────────────────────────────────────────
  function makeSnow(host, n) {
    var html = '';
    for (var i = 0; i < n; i++) {
      var size = (Math.random() * 4 + 2).toFixed(1);
      html += '<i style="left:' + (Math.random() * 100).toFixed(1) + '%;width:' + size + 'px;height:' + size + 'px;'
        + '--drift:' + (Math.random() * 50 - 25).toFixed(0) + 'px;'
        + 'animation-duration:' + (Math.random() * 7 + 6).toFixed(1) + 's;'
        + 'animation-delay:-' + (Math.random() * 12).toFixed(1) + 's;'
        + 'opacity:' + (Math.random() * .5 + .4).toFixed(2) + '"></i>';
    }
    host.innerHTML = html;
  }
  function sparkle(host, x, y, n) {
    var chars = ['✨', '⭐', '✦', '💫'];
    for (var i = 0; i < n; i++) {
      var s = document.createElement('span');
      s.className = 'sparkle';
      s.textContent = chars[Math.floor(Math.random() * chars.length)];
      s.style.left = (x + (Math.random() * 40 - 20)) + 'px';
      s.style.top = (y + (Math.random() * 24 - 12)) + 'px';
      s.style.fontSize = (Math.random() * 10 + 12).toFixed(0) + 'px';
      s.style.animationDelay = (Math.random() * .12).toFixed(2) + 's';
      host.appendChild(s);
      (function (el) { setTimeout(function () { el.remove(); }, 1200); })(s);
    }
  }
  var sayTimers = { elf: null, host: null };
  function sayEl(who) { return who === 'host' ? els.speechHost : els.speech; }
  function clearSpeech(who) {
    ['elf', 'host'].forEach(function (w) {
      if (who && w !== who) { return; }
      if (sayTimers[w]) { clearInterval(sayTimers[w]); sayTimers[w] = null; }
      var el = sayEl(w);
      el.classList.remove('is-on');
      el.textContent = '';
      if (el._hold) { clearTimeout(el._hold); el._hold = null; }
    });
  }
  function say(who, text, hold) {
    who = who === 'host' ? 'host' : 'elf';
    clearSpeech(who);
    var el = sayEl(who);
    el.className = 'speech is-' + who;
    el.style.setProperty('--tail', (who === 'elf' ? 26 : 34) + 'px');
    el.textContent = '';
    el.classList.add('is-on');
    var chars = Array.from(text), i = 0;
    sayTimers[who] = setInterval(function () {
      i++;
      el.textContent = chars.slice(0, i).join('');
      if (i >= chars.length) { clearInterval(sayTimers[who]); sayTimers[who] = null; }
      if (i === 2) { sfx('pop'); }
    }, 34);
    if (hold) { el._hold = setTimeout(function () { clearSpeech(who); }, hold); }
  }

  // ── question flow ───────────────────────────────────────────────────────────
  function ask(i) {
    var q = Q.questions[i];
    S.index = i;
    S.locked = false;
    els.ribbonText.textContent = tf(C.ribbonTag, { k: i + 1, n: Q.questions.length });
    els.qText.innerHTML = marked(q.q);
    var opts = shuffle(q.options.slice());
    els.opts.innerHTML = '';
    els.opts.classList.remove('is-locked');
    opts.forEach(function (o) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'opt';
      b.dataset.correct = o.correct ? '1' : '0';
      b.dataset.tone = o.tone || 'berry';
      b.innerHTML = '<span class="holly">' + A.holly() + '</span>'
        + '<span class="opt-visual"><span class="plate"></span>'
        + '<span class="spark s1">✦</span><span class="spark s2">✦</span><span class="spark s3">✧</span><span class="spark s4">✧</span>'
        + '<span class="opt-emoji">' + esc(o.emoji || '🎄') + '</span></span>'
        + '<span class="opt-text">' + esc(o.text) + '</span>';
      b.addEventListener('click', function () { choose(b, o); });
      els.opts.appendChild(b);
    });
    pose(els.elf, 'elf', 'board');
    pose(els.host, 'host', 'wave');
    frameBall(notchPoint(S.score), true);
    if (SND) { SND.sfx('page'); }
  }

  function choose(btn, option) {
    if (S.locked) { return; }
    S.locked = true;
    els.opts.classList.add('is-locked');
    btn.classList.add('is-picked');
    sfx('tap');
    sfx('bear-nervous');
    buzz(12);
    pose(els.host, 'host', 'nervous');
    setTimeout(function () {
      if (option.correct) { onRight(btn); } else { onWrong(btn); }
      setTimeout(nextQuestion, 2350);
    }, 420);
  }

  function nextQuestion() {
    var next = S.index + 1;
    if (next >= Q.questions.length) { finish(); return; }
    if (S.index === 2 && S.score >= 2) {
      pose(els.host, 'host', 'gasp');
      say('host', C.host.goingUp, 1500);
      setTimeout(function () { ask(next); }, 1100);
      return;
    }
    if (next === Q.questions.length - 1) {
      clearSpeech();
      cam.dim(true);
      cam.focus(notchPoint(Math.max(1, S.score))[1] - 40);
      setTimeout(function () {
        say('elf', S.score >= 8 ? C.lastQuestion[0] : C.lastQuestion[1], 1500);
      }, 500);
      setTimeout(function () { cam.dim(false); ask(next); }, 2100);
      return;
    }
    ask(next);
  }

  function onRight(btn) {
    btn.classList.remove('is-picked');
    btn.classList.add('is-right');
    S.score++;
    S.streakR++;
    var notch = Math.min(10, S.score);
    var bulb = els.garlandBulbs.querySelector('[data-n="' + notch + '"]');
    if (bulb) { bulb.classList.add('is-on'); }
    var pt = notchPoint(notch);
    frameBall(pt);
    cam.place(playerBall, pt);
    pose(els.elf, 'elf', 'hmph');
    sfx('rise');
    (function trail(k) {
      if (k <= 0) { return; }
      var r = playerBall.getBoundingClientRect(), c = cam.el.getBoundingClientRect();
      sparkle(cam.el, r.left - c.left + r.width / 2, r.top - c.top + r.height * .6, 2);
      setTimeout(function () { trail(k - 1); }, 110);
    })(5);
    setTimeout(function () {
      cam.punch();
      cam.light(notch, true);
      sfx('correct');
      sfx('bulb', notch);
      sfx(notch >= 7 ? 'woohoo' : 'cheer');
      var p = cam.toCam([pt[0], pt[1] + 20]);
      sparkle(cam.el, p[0], p[1], 9);
      pose(els.host, 'host', 'cheer');
      hop(els.host);
      if (S.streakR === 3) {
        say('host', C.host.streak, 1700);
      } else if (passedRival(notch - 1)) {
        say('elf', tt(C.host.passed, { name: passedRival(notch - 1) }), 1700);
      } else if (Math.random() < .35) {
        say('host', pick(C.host.right), 1500);
      } else {
        say('elf', pick(C.elf.right), 1700);
      }
    }, 720);
  }

  function onWrong(btn) {
    btn.classList.remove('is-picked');
    btn.classList.add('is-wrong');
    var correctBtn = els.opts.querySelector('.opt[data-correct="1"]');
    if (correctBtn && correctBtn !== btn) { correctBtn.classList.add('is-answer'); }
    cam.shake();
    sfx('wrong');
    buzz(30);
    cam.fizzle(S.score + 1);
    pose(els.host, 'host', 'facepalm');
    pose(els.elf, 'elf', 'chuckle');
    if (SND) { SND.sfx('elf-hmph'); }
    setTimeout(function () {
      say('elf', tt(pick(C.elf.wrong)), 1900);
      if (Math.random() < .35) {
        setTimeout(function () { say('host', pick(C.host.wrong), 1600); }, 700);
      }
    }, 380);
  }

  function passedRival(score) {
    for (var i = 0; i < (Q.others || []).length; i++) {
      if (Math.min(10, Math.max(1, Q.others[i].score)) === score) { return Q.others[i].name; }
    }
    return null;
  }

  function frameBall(pt, instant) {
    if (!cam) { return; }
    if (pt[1] >= 500) { cam.focus(pt[1] + 40, instant); }
    else { cam.focusOn(pt[1], playerBall ? playerBall.offsetHeight : 100); }
  }

  // ── ending / result ─────────────────────────────────────────────────────────
  function finish() {
    var score = S.score;
    var zone = zoneOfScore(score);
    buildResult(zone, score);
    setTimeout(function () {
      showScene(els.scResult);
      sfx('bell');
      setTimeout(function () {
        if (!resultCam) { return; }
        var pt = (playerBallResult && playerBallResult._pt) || [160, 300];
        if (zone === 'top' || zone === 'front') {
          resultCam.wide(0);
          var s = els.camResult.clientHeight / Math.max(1, els.layerResult.offsetHeight);
          if (playerBallResult) { playerBallResult.style.setProperty('--bw', (78 / s).toFixed(1) + 'px'); }
        } else {
          resultCam.focus(pt[1] + 120);
        }
        if (zone !== 'box') { resultCam.lightAll(140); resultCam.star(true); }
        sfx('woohoo');
        sfx('correct');
        var c = els.camResult.getBoundingClientRect();
        if (zone === 'top') {
          sparkle(els.camResult, c.width / 2, c.height * .2, 14);
          setTimeout(function () { sparkle(els.camResult, c.width * .3, c.height * .45, 10); }, 500);
          setTimeout(function () { sparkle(els.camResult, c.width * .7, c.height * .35, 10); }, 900);
        }
      }, 60);
    }, 720);
  }

  function buildResult(zone, score) {
    var playerName = S.name || '你';
    var perfect = score === Q.questions.length;
    els.layerResult.innerHTML = treeLayerHTML('result', zone !== 'box');
    decorate(els.layerResult);
    var starGlow = els.layerResult.querySelector('.star-glow');
    if (starGlow) { starGlow.style.opacity = zone === 'box' ? '0' : '.9'; }

    var rivalSpots = zone === 'top'
      ? [[112, 176], [208, 176], [160, 226]]
      : [[160, 88], [116, 152], [204, 152]];
    (Q.others || []).slice().sort(function (a, b) { return b.score - a.score; }).forEach(function (p, idx) {
      var b = baubleEl(p.name, 'is-rival' + (idx === 0 && zone !== 'top' ? ' is-hook' : ''));
      var spot = rivalSpots[Math.min(idx, rivalSpots.length - 1)];
      els.layerResult.appendChild(b);
      b.style.left = f(spot[0] / W * 100) + '%';
      b.style.top = f(spot[1] / H * 100) + '%';
    });
    var cls = 'is-friend is-you' + (zone === 'top' ? ' is-hook' : '') + (zone === 'front' ? ' is-front' : '') + (perfect ? ' is-gold' : '');
    playerBallResult = baubleEl(playerName, cls);
    els.layerResult.appendChild(playerBallResult);
    var spot = ZONE_SPOTS[zone][0];
    playerBallResult._pt = spot;
    playerBallResult.style.left = f(spot[0] / W * 100) + '%';
    playerBallResult.style.top = f(spot[1] / H * 100) + '%';
    playerBallResult.classList.toggle('is-boxed', zone === 'box');

    if (resultCam && resultCam.ro) { resultCam.ro.disconnect(); }
    resultCam = makeCam(els.camResult, els.layerResult, {});

    var ending = C.endings[zone];
    els.resultTitle.textContent = stripEmoji(ending.title);
    els.scoreLine.innerHTML = marked(C.result.score, { n: score, total: Q.questions.length });
    els.perfectBadge.hidden = !perfect;
    els.perfectBadge.textContent = C.result.perfect;
    var topLine = zone === 'top' && ending.line;
    els.endingLine.hidden = !topLine;
    els.endingLine.innerHTML = topLine ? marked(ending.line) : '';
    els.boxLine.hidden = zone !== 'box';
    els.boxLine.innerHTML = zone === 'box' ? marked(ending.line) : '';
    els.comebackLine.innerHTML = marked(C.comeback, { zoneName: C.zones[zone] });

    var hostPose = zone === 'top' ? 'cheer' : zone === 'box' ? 'laugh' : zone === 'bottom' ? 'laugh' : 'admire';
    var elfPose = zone === 'top' ? (perfect ? 'hat' : 'hmph') : zone === 'box' ? 'eyeroll' : 'hmph';
    if (zone === 'front') { hostPose = 'admire'; elfPose = 'hmph'; }
    pose(els.hostResult, 'host', hostPose);
    pose(els.elfResult, 'elf', elfPose);

    try { localStorage.setItem('xm_tree_last', JSON.stringify({ name: playerName, score: score, zone: zone, at: Date.now() })); } catch (e) {}
    S.zone = zone;
  }

  // ── board + share ───────────────────────────────────────────────────────────
  function openBoard() {
    var rows = (Q.others || []).map(function (p) { return { name: p.name, score: p.score, me: false }; });
    if (S.name && S.zone) { rows.push({ name: S.name, score: S.score, me: true, zone: S.zone }); }
    rows.sort(function (a, b) { return b.score - a.score; });
    els.sheetTitle.textContent = tt(C.board.title);
    els.sheetCount.textContent = tt(C.board.count, { n: rows.length });
    els.sheetList.innerHTML = rows.map(function (r, i) {
      var zone = r.zone || zoneOfScore(r.score);
      var c = colorOf(r.name);
      return '<div class="sheet-row' + (i === 0 ? ' is-top' : '') + '">'
        + '<span class="sheet-rank">' + (i + 1) + '</span>'
        + '<i class="mini" style="--b1:' + c[0] + ';--b2:' + c[1] + '"></i>'
        + '<span class="who">' + (r.me ? '<em>' + esc(r.name) + '</em>' : esc(r.name)) + '</span>'
        + '<span class="zone">' + esc(C.zones[zone]) + '</span>'
        + '<span class="sc">' + r.score + ' / ' + Q.questions.length + '</span></div>';
    }).join('');
    els.sheetBackdrop.hidden = false;
    els.sheet.hidden = false;
    requestAnimationFrame(function () {
      els.sheetBackdrop.classList.add('is-on');
      els.sheet.classList.add('is-on');
    });
    sfx('swipe');
  }
  function closeBoard() {
    els.sheetBackdrop.classList.remove('is-on');
    els.sheet.classList.remove('is-on');
    setTimeout(function () { els.sheet.hidden = true; els.sheetBackdrop.hidden = true; }, 320);
  }
  function toast(msg) {
    els.shareToast.textContent = msg;
    els.shareToast.classList.add('is-on');
    clearTimeout(els.shareToast._t);
    els.shareToast._t = setTimeout(function () { els.shareToast.classList.remove('is-on'); }, 1800);
  }
  function legacyCopy(text) {
    return new Promise(function (resolve, reject) {
      try {
        var ta = document.createElement('textarea');
        ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select();
        var ok = document.execCommand('copy');
        ta.remove();
        ok ? resolve() : reject(new Error('copy failed'));
      } catch (e) { reject(e); }
    });
  }
  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).catch(function () { return legacyCopy(text); });
    }
    return legacyCopy(text);
  }
  function shareLink() {
    if (Q.shareUrl) { return Q.shareUrl; }
    return location.protocol === 'http:' || location.protocol === 'https:' ? location.href.split('#')[0] : '';
  }
  function shareResult() {
    var zone = S.zone || zoneOfScore(S.score);
    var tpl = zone === 'top' ? C.share.top : zone === 'box' ? C.share.low : C.share.mid;
    var txt = tt(tpl, { n: S.score, zoneName: C.zones[zone] });
    var link = shareLink();
    if (link) { txt += ' ' + link; }
    if (navigator.share) {
      navigator.share({ title: document.title, text: txt }).then(function () { sfx('pop'); }, function () {});
      return;
    }
    copyText(txt).then(function () { sfx('pop'); toast(C.share.toast); }, function () { toast(C.share.fail); });
  }

  // ── scenes / building ───────────────────────────────────────────────────────
  function showScene(sc) {
    [els.scLanding, els.scClimb, els.scResult].forEach(function (s) {
      if (s) { s.classList.toggle('is-active', s === sc); }
    });
    if (sc !== els.scClimb) { clearSpeech(); }
    window.scrollTo(0, 0);
  }

  function resetClimb() {
    Array.prototype.forEach.call(els.layer.querySelectorAll('.tier'), function (g) { g.classList.remove('is-on'); });
    Array.prototype.forEach.call(els.garlandBulbs.children, function (b) { b.classList.remove('is-on'); });
    var starGlow = els.layer.querySelector('.star-glow');
    if (starGlow) { starGlow.style.opacity = '0'; }
    els.cam.classList.remove('is-dim', 'is-wide');
    playerBall.style.opacity = '0';
    playerBall.classList.remove('is-landed');
    cam.place(playerBall, [112, 520]);
    (Q.others || []).forEach(function (p, idx) {
      if (!rivalEls[idx]) { return; }
      var score = Math.min(10, Math.max(1, p.score));
      var y = TIER_Y[score - 1] - 20;
      var side = NOTCH_SIDE[score - 1] > 0 ? -1 : 1;
      var x = CX + side * .62 * halfWidth(y + 8);
      cam.place(rivalEls[idx], [x, y]);
    });
    cam.focus(560, true);
    els.qpanel.classList.add('is-questionless');
    els.ribbonText.textContent = tf(C.ribbonTag, { k: 1, n: Q.questions.length });
    els.qText.innerHTML = marked(Q.questions[0].q);
    els.opts.innerHTML = '';
    pose(els.elf, 'elf', 'board');
    pose(els.host, 'host', 'wave');
    els.elf.style.visibility = 'hidden';
    els.host.style.visibility = 'hidden';
    setBaubleName(playerBall, S.name);
    S.score = 0; S.index = 0; S.locked = true; S.streakR = 0;
  }

  function runIntro() {
    setTimeout(function () {
      els.host.style.visibility = '';
      pose(els.host, 'host', 'arrive');
      sfx('bear-hello');
      say('host', tf(C.intro.host, { name: S.name }), 1700);
    }, 400);
    setTimeout(function () {
      els.elf.style.visibility = '';
      pose(els.elf, 'elf', 'dropbox');
      sfx('pop');
    }, 900);
    setTimeout(function () {
      playerBall.style.opacity = '';
      cam.place(playerBall, [112, 520]);
      sfx('drop');
    }, 1150);
    setTimeout(function () {
      pose(els.host, 'host', 'wave');
      say('elf', tf(C.intro.helper), 2200);
    }, 1900);
    setTimeout(function () {
      pose(els.elf, 'elf', 'board');
      sfx('swipe');
      els.qpanel.classList.remove('is-questionless');
    }, 4200);
    setTimeout(function () { S.locked = false; ask(0); }, 4450);
  }

  function start() {
    if (S.launching) { return; }
    var name = (els.nameInput.value || '').trim();
    if (!name) {
      els.error.textContent = C.landing.nameError;
      els.error.classList.add('is-on');
      els.nameInput.classList.add('is-shake');
      setTimeout(function () { els.nameInput.classList.remove('is-shake'); }, 420);
      els.nameInput.focus();
      sfx('wrong');
      return;
    }
    els.error.classList.remove('is-on');
    S.name = name.slice(0, 15);
    S.launching = true;
    els.startBtn.disabled = true;
    try { localStorage.setItem('xm_tree_name', S.name); } catch (e) {}
    sfx('whoosh');
    els.envelope.classList.add('is-launch');
    setTimeout(function () {
      showScene(els.scClimb);
      resetClimb();
      if (SND) { SND.music(true); }
      runIntro();
    }, 520);
  }

  function buildClimb() {
    if (S.built) { return; }
    els.layer.innerHTML = treeLayerHTML('climb', false);
    decorate(els.layer);
    playerBall = baubleEl(S.name, 'is-friend');
    els.layer.appendChild(playerBall);
    rivalEls = [];
    (Q.others || []).forEach(function (p) {
      var b = baubleEl(p.name, 'is-rival');
      els.layer.appendChild(b);
      rivalEls.push(b);
    });
    cam = makeCam(els.cam, els.layer, { garland: els.garland, cast: [els.elf, els.host] });
    S.built = true;
  }

  function paintBig(name) {
    var ball = els.scLanding.querySelector('.bauble.is-big');
    if (!ball) { return; }
    ball.querySelector('.bauble-name').textContent = name || '?';
    ball.classList.toggle('is-blank', !name);
    var c = colorOf(name);
    ball.style.setProperty('--b1', c[0]);
    ball.style.setProperty('--b2', c[1]);
    var fs = !name ? 1 : Math.min(1, 3.2 / Math.max(1, Array.from(name).length));
    ball.style.setProperty('--fs', Math.round(fs * 100) / 100);
  }

  function init() {
    els = {
      scLanding: $('sc-landing'), scClimb: $('sc-climb'), scResult: $('sc-result'),
      envelope: $('envelope'), nameInput: $('name-input'), error: $('name-error'), startBtn: $('start-btn'),
      cam: $('cam'), layer: $('layer'), garland: $('garland'), garlandBulbs: $('garland-bulbs'),
      elf: $('elf'), host: $('host'), speech: $('speech'), speechHost: $('speech-host'),
      qpanel: $('qpanel'), ribbonText: $('ribbon-text'), qText: $('q-text'), opts: $('opts'),
      camResult: $('cam-result'), layerResult: $('layer-result'),
      elfResult: $('elf-result'), hostResult: $('host-result'),
      resultTitle: $('result-title'), endingLine: $('ending-line'), perfectBadge: $('perfect-badge'),
      scoreLine: $('score-line'), boxLine: $('box-line'), comebackLine: $('comeback-line'),
      againBtn: $('again-btn'), shareBtn: $('share-btn'), boardBtn: $('board-btn'), shareToast: $('share-toast'),
      sheet: $('sheet'), sheetBackdrop: $('sheet-backdrop'), sheetTitle: $('sheet-title'),
      sheetCount: $('sheet-count'), sheetList: $('sheet-list'), sheetClose: $('sheet-close'),
      docked: $('docked')
    };

    // static copy from data.js
    if (C.meta) {
      if (C.meta.title) { document.title = C.meta.title; }
      var md = document.querySelector('meta[name="description"]');
      if (md && C.meta.description) { md.setAttribute('content', C.meta.description); }
    }
    $('landing-title').innerHTML = marked(C.landing.title);
    $('landing-sticker').textContent = tt(C.landing.sticker);
    $('proof-count').textContent = tt(C.landing.proofCount, { n: (Q.others || []).length });
    $('proof-top').textContent = tt(C.landing.proofTop);
    $('landing-rule').innerHTML = marked(C.landing.rule);
    els.nameInput.setAttribute('placeholder', C.landing.namePlaceholder);
    els.nameInput.setAttribute('aria-label', C.landing.namePlaceholder);
    els.startBtn.textContent = C.landing.cta;
    $('polaroid-name').textContent = Q.creator;
    els.againBtn.textContent = C.result.cta;
    els.shareBtn.textContent = C.result.share;
    els.boardBtn.textContent = C.result.board;
    els.sheetTitle.textContent = tt(C.board.title);
    els.sheetCount.textContent = '';
    $('rotate-hint').textContent = C.rotate;
    els.sheetClose.setAttribute('aria-label', C.board.close);

    // artwork
    $('polaroid-art').innerHTML = A.postcard();
    var heroBg = document.querySelector('.hero-bg');
    if (heroBg) { heroBg.innerHTML = A.heroScene(); }
    $('snow-edge-landing').innerHTML = A.snowEdge();
    $('snow-edge-q').innerHTML = A.snowEdge();
    $('snow-edge-r').innerHTML = A.snowEdge();
    $('ribbon-art').innerHTML = A.ribbon();
    $('result-ribbon-art').innerHTML = A.ribbon();
    $('garland-bg').innerHTML = A.garland();
    $('cam-backdrop').innerHTML = A.room('cam-room');
    $('cam-result-backdrop').innerHTML = A.room('res-room');
    els.garlandBulbs.innerHTML = GARLAND_BULBS.map(function (x, i) {
      return '<i data-n="' + (i + 1) + '" style="left:' + (x * 100) + '%"></i>';
    }).join('');
    makeSnow($('snow-landing'), 26);

    // sound button
    if (SND) {
      try {
        var b = SND.button({ on: '🔊', off: '🔇' });
        if (b) {
          b.setAttribute('aria-label', '声音');
          b.setAttribute('title', '声音');
          b.addEventListener('click', function () {
            setTimeout(function () { b.setAttribute('aria-label', '声音'); b.setAttribute('title', '声音'); }, 0);
          });
          els.docked.appendChild(b);
        }
      } catch (e) {}
    }

    // events
    els.nameInput.addEventListener('input', function () {
      if (els.error.classList.contains('is-on')) { els.error.classList.remove('is-on'); }
      paintBig(els.nameInput.value.trim());
    });
    els.nameInput.addEventListener('keydown', function (e) { if (e.key === 'Enter') { start(); } });
    els.startBtn.addEventListener('click', start);
    els.sheetClose.addEventListener('click', closeBoard);
    els.sheetBackdrop.addEventListener('click', closeBoard);
    els.boardBtn.addEventListener('click', openBoard);
    els.shareBtn.addEventListener('click', shareResult);
    els.againBtn.addEventListener('click', function () {
      S.launching = false;
      els.startBtn.disabled = false;
      showScene(els.scLanding);
      els.envelope.classList.remove('is-launch');
      paintBig(els.nameInput.value.trim());
      if (SND) { SND.music(false); }
    });

    try {
      var last = localStorage.getItem('xm_tree_name');
      if (last) { els.nameInput.value = last; paintBig(last); }
    } catch (e) {}

    buildClimb();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, false);
  } else {
    init();
  }
})();
