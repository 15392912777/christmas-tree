/* XMSound - fully synthesized audio for the Christmas tree quiz. Plain ES5,
   no deps, no audio files: oscillators, filtered noise, reverb.
   Music is an original gentle 8-bar C-major waltz (music box + sleigh bell).
   Works on file:// and static hosts; silent no-op without Web Audio, never
   throws. API: sfx(name,arg) | music(on) | button({on,off}) | muted().
   Mute persists in localStorage "xm_sound_muted". */
(function (window, document) {
  'use strict';

  var AC = window.AudioContext || window.webkitAudioContext;
  var LSK = 'xm_sound_muted', FADE = 1.2, THR = .03, MVO = .26, BEAT = .52, LB = 24;
  var ctx = null, tried = false, out = null, sOut = null, mOut = null, rev = null;
  var muted = false, noise = null, last = {}, mOn = false, mRun = null;
  var btn = null, lOn = '关闭声音', lOff = '打开声音', gest = false;

  try {  /* localStorage can throw on file:// or in private mode */
    var sv = window.localStorage.getItem(LSK);
    muted = (sv === '1' || sv === 'true');
  } catch (e) {}

  /* -- audio graph -- */

  function initCtx() {  /* lazy: returns null when Web Audio is unavailable */
    if (ctx || tried) return ctx;
    tried = true;
    if (!AC) return null;
    try {
      ctx = new AC();
      out = ctx.createGain(); out.gain.value = muted ? 0 : 1; out.connect(ctx.destination);
      sOut = ctx.createGain(); sOut.gain.value = .9; sOut.connect(out);
      mOut = ctx.createGain(); mOut.gain.value = 1; mOut.connect(out);
      var conv = ctx.createConvolver(); conv.buffer = ir(1.4, 2.6);
      rev = ctx.createGain(); rev.gain.value = .35; rev.connect(conv); conv.connect(out);
      var wet = ctx.createGain(); wet.gain.value = .18;  /* room on the music */
      mOut.connect(wet); wet.connect(rev);
    } catch (e) {
      ctx = null; out = sOut = mOut = rev = null;
    }
    return ctx;
  }

  /* -- synth helpers -- */

  function hz(midi) { return 440 * Math.pow(2, (midi - 69) / 12); }

  function nBuf() {  /* cached 2 s of white noise */
    if (noise) return noise;
    var len = Math.floor(ctx.sampleRate * 2), i;
    noise = ctx.createBuffer(1, len, ctx.sampleRate);
    var d = noise.getChannelData(0);
    for (i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    return noise;
  }

  function ir(seconds, decay) {  /* decaying stereo noise = reverb impulse */
    var len = Math.floor(ctx.sampleRate * seconds), ch, i, d;
    var buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (ch = 0; ch < 2; ch++) {
      d = buf.getChannelData(ch);
      for (i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
    }
    return buf;
  }

  function bqf(f, t, d) {  /* f = [type, freq, endFreq, Q] */
    var b = ctx.createBiquadFilter();
    b.type = f[0];
    b.frequency.setValueAtTime(Math.max(20, f[1]), t);
    if (f[2] && f[2] !== f[1]) b.frequency.exponentialRampToValueAtTime(Math.max(20, f[2]), t + d);
    b.Q.value = f[3] == null ? .8 : f[3];
    return b;
  }

  /* Oscillator voice with attack/decay envelope.
     {type,f,f2,t,d,v,a,filt,vib,bus,rev,run} - all optional except f. */
  function tone(o) {
    if (!ctx) return;
    var t = o.t || ctx.currentTime, d = o.d || .2, a = o.a == null ? .005 : o.a;
    var v = o.v == null ? .15 : o.v;
    if (d < a + .01) d = a + .01;
    var g = ctx.createGain();
    g.gain.setValueAtTime(.0001, t);
    g.gain.linearRampToValueAtTime(Math.max(.0001, v), t + a);
    g.gain.exponentialRampToValueAtTime(.0001, t + d);
    var src = ctx.createOscillator(), node = src, end = t + d + .02;
    src.type = o.type || 'sine';
    src.frequency.setValueAtTime(o.f, t);
    if (o.f2 && o.f2 > 0) src.frequency.exponentialRampToValueAtTime(o.f2, t + d);
    if (o.filt) { var b = bqf(o.filt, t, d); node.connect(b); node = b; }
    node.connect(g); g.connect(o.bus || sOut);
    if (o.rev && rev) g.connect(rev);
    if (o.vib) {  /* vibrato LFO on the oscillator frequency */
      var lfo = ctx.createOscillator(), dep = ctx.createGain();
      lfo.frequency.setValueAtTime(o.vib[0], t);
      dep.gain.setValueAtTime(o.vib[1], t);
      lfo.connect(dep); dep.connect(src.frequency);
      lfo.start(t); lfo.stop(end);
    }
    src.start(t); src.stop(end);
    if (o.run) o.run.nodes.push({ src: src, end: end });
  }

  /* Filtered-noise voice; same envelope/options as tone(). */
  function hiss(o) {
    if (!ctx) return;
    var t = o.t || ctx.currentTime, d = o.d || .2, a = o.a == null ? .004 : o.a;
    var v = o.v == null ? .1 : o.v;
    if (d < a + .01) d = a + .01;
    var g = ctx.createGain();
    g.gain.setValueAtTime(.0001, t);
    g.gain.linearRampToValueAtTime(Math.max(.0001, v), t + a);
    g.gain.exponentialRampToValueAtTime(.0001, t + d);
    var src = ctx.createBufferSource(), node = src, end = t + d + .02;
    src.buffer = nBuf(); src.loop = true;
    if (o.filt) { var b = bqf(o.filt, t, d); node.connect(b); node = b; }
    node.connect(g); g.connect(o.bus || sOut);
    if (o.rev && rev) g.connect(rev);
    src.start(t, Math.random() * 1.6); src.stop(end);
    if (o.run) o.run.nodes.push({ src: src, end: end });
  }

  /* Music-box voice: sine fundamental + bell partials + tine transient. */
  function mbox(midi, t, d, v, bus, run, rv) {
    var f = hz(midi), parts = [[1, 1], [2, .34], [4, .12]], i;
    for (i = 0; i < parts.length; i++) {
      tone({ type: 'sine', f: f * parts[i][0], t: t, d: d * (i ? .72 : 1),
             v: v * parts[i][1], a: .004, bus: bus, run: run, rev: rv });
    }
    hiss({ t: t, d: .025, v: v * .35, a: .001, filt: ['highpass', 4200, 4200, .7], bus: bus, run: run, rev: rv });
  }

  /* One sleigh bell: noisy jingle + bright inharmonic partials. */
  function jingle(t, v, bus, run, rv) {
    hiss({ t: t, d: .3, v: v * .55, a: .002, filt: ['bandpass', 5200, 3600, .9], bus: bus, run: run, rev: rv });
    tone({ type: 'sine', f: 2093, t: t, d: .24, v: v * .45, a: .002, bus: bus, run: run, rev: rv });
    tone({ type: 'sine', f: 2637, t: t, d: .2, v: v * .3, a: .002, bus: bus, run: run, rev: rv });
    tone({ type: 'sine', f: 3520, t: t, d: .16, v: v * .2, a: .002, bus: bus, run: run, rev: rv });
  }

  /* -- original music -- */

  /* 8 bars of 3/4 in C major (C Am F G C Am Dm G), written for this project.
     Each row: [midi note, start beat in the 24-beat loop, length in beats]. */
  var MEL = [
    [72, 0, 1], [76, 1, 1], [79, 2, 1], [81, 3, 1], [76, 4, 1], [72, 5, 1],
    [77, 6, 1], [81, 7, 1], [84, 8, 1], [83, 9, 1], [79, 10, 1], [74, 11, 1],
    [72, 12, 1], [76, 13, 1], [79, 14, 1], [81, 15, 1], [79, 16, 1], [76, 17, 1],
    [74, 18, 1], [77, 19, 1], [81, 20, 1], [79, 21, 1], [74, 22, 1], [71, 23, 1]
  ];
  var BAS = [48, 45, 53, 55, 48, 45, 50, 43], MAT = {};
  for (var mi = 0; mi < MEL.length; mi++) (MAT[MEL[mi][1]] || (MAT[MEL[mi][1]] = [])).push(MEL[mi]);

  function beatAt(run, beat, t) {
    var bar = Math.floor(beat / 3), b = beat % 3, list = MAT[beat], i;
    if (list) for (i = 0; i < list.length; i++) mbox(list[i][0], t, list[i][2] * BEAT * .98, .085, run.gain, run);
    if (b === 0) {  /* downbeat: soft bass + sleigh bell */
      tone({ type: 'triangle', f: hz(BAS[bar]), t: t, d: .85, v: .06, a: .03,
             filt: ['lowpass', 800, 800, .7], bus: run.gain, run: run });
      jingle(t, .05, run.gain, run);
    } else if (b === 2) jingle(t, .02, run.gain, run);  /* quiet tick */
  }

  function prune(list) {
    var lim = ctx.currentTime + 1.5, outList = [], i;
    for (i = 0; i < list.length; i++) if (list[i].end > lim) outList.push(list[i]);
    return outList;
  }

  /* Look-ahead scheduler: queues the next .6 s of music every 120 ms. */
  function pump(run) {
    try {
      if (!ctx || !mOn || run !== mRun) return;
      var now = ctx.currentTime;
      if (run.loopStart + run.beat * BEAT < now - .25) {  /* tab was suspended */
        run.loopStart = now + .12;
        run.beat = 0;
      }
      var horizon = now + .6, guard = 0;
      while (guard++ < 32) {
        var t = run.loopStart + run.beat * BEAT;
        if (t > horizon) break;
        beatAt(run, run.beat, t);
        run.beat++;
        if (run.beat >= LB) { run.loopStart += LB * BEAT; run.beat = 0; run.nodes = prune(run.nodes); }
      }
    } catch (e) {}
  }

  function startM() {
    try {
      var t = ctx.currentTime;
      /* Fresh gain per start: restart fades the old loop out and the new one
         in, with no clicks and no overlapping beats. */
      var run = { gain: ctx.createGain(), nodes: [], beat: 0, loopStart: t + .15, timer: null };
      run.gain.gain.setValueAtTime(0, t);
      run.gain.gain.linearRampToValueAtTime(MVO, t + FADE);
      run.gain.connect(mOut);
      mRun = run;
      pump(run);
      run.timer = window.setInterval(function () { pump(run); }, 120);
    } catch (e) {}
  }

  function stopM() {
    var run = mRun;
    mRun = null;
    if (!ctx || !run) return;
    try {
      if (run.timer) { window.clearInterval(run.timer); run.timer = null; }
      var t = ctx.currentTime, end = t + FADE, g = run.gain.gain, i;
      g.cancelScheduledValues(t);
      g.setValueAtTime(g.value, t);
      g.linearRampToValueAtTime(0, end);
      for (i = 0; i < run.nodes.length; i++) {  /* cut anything past the fade */
        if (run.nodes[i].end > end) { try { run.nodes[i].src.stop(end + .05); } catch (e2) {} }
      }
      run.nodes = [];
      window.setTimeout(function () { try { run.gain.disconnect(); } catch (e3) {} }, FADE * 1000 + 300);
    } catch (e) {}
  }

  /* -- 24 one-shots (original) -- */
  /* osc(type, f, f2, t, dur, vol, atk, filt, vib)
     nz(t, dur, vol, filt, atk, rev) */
  function osc(type, f, f2, t, d, v, a, filt, vib) {
    tone({ type: type, f: f, f2: f2, t: t, d: d, v: v, a: a, filt: filt, vib: vib });
  }
  function nz(t, d, v, filt, a, rv) { hiss({ t: t, d: d, v: v, filt: filt, a: a, rev: rv }); }

  var S = {};

  S.tap = function (t) {
    nz(t, .035, .13, ['bandpass', 2500, 1800, 1.2], .001); osc('sine', 900, 700, t, .06, .1, .002);
  };
  S.click = function (t) {
    nz(t, .018, .09, ['highpass', 3000, 3000, .7], .001); osc('triangle', 1600, 1300, t, .035, .045, .001);
  };
  S.pop = function (t) {
    osc('sine', 400, 1150, t, .09, .16, .002); nz(t, .03, .05, ['bandpass', 1800, 2600, 1.4], .001);
  };
  S.drop = function (t) {
    osc('sine', 820, 270, t, .24, .15, .004); nz(t, .06, .04, ['lowpass', 1100, 1100, .7], .002);
  };
  S.rise = function (t) {  /* bauble flying up: ascending sparkle */
    osc('sine', 380, 1500, t, .55, .09, .02); osc('sine', 760, 3000, t + .03, .45, .045, .02);
    for (var i = 0; i < 4; i++) tone({ type: 'sine', f: hz(88 + i * 3), t: t + .18 + i * .08, d: .24, v: .045, rev: true });
  };
  S.correct = function (t) {  /* happy 3-note chime */
    var notes = [72, 76, 79], i;
    for (i = 0; i < notes.length; i++) mbox(notes[i], t + i * .1, .9, .15, sOut, null, true);
    jingle(t + .2, .08, sOut, null, true);
  };
  S.wrong = function (t) {  /* soft low thud + gentle buzz */
    osc('sine', 150, 78, t, .3, .22, .005, ['lowpass', 500, 400, .8]);
    osc('square', 108, 92, t, .16, .045, .005, ['lowpass', 380, 380, .8]);
    nz(t, .08, .04, ['lowpass', 300, 300, .7], .002);
  };
  S.swipe = function (t) { nz(t, .26, .15, ['bandpass', 500, 2600, 1.3], .03); };
  S.whoosh = function (t) {
    nz(t, .55, .16, ['bandpass', 220, 1500, 1.0], .08);
    nz(t + .05, .4, .07, ['lowpass', 700, 2200, .8], .05);
  };
  S.sparkle = function (t) {
    var notes = [84, 88, 91, 96, 100], i;
    for (i = 0; i < notes.length; i++) tone({ type: 'sine', f: hz(notes[i]), t: t + i * .045, d: .42 - i * .02, v: .06, a: .002, rev: true });
    jingle(t + .12, .04, sOut, null, true);
  };
  S.footsteps = function (t) {
    for (var i = 0; i < 2; i++) {
      var tt = t + i * .19;
      nz(tt, .07, .1, ['lowpass', 420, 380, .8], .002);
      osc('sine', 112, 72, tt, .09, .09, .003);
    }
  };
  S.bulb = function (t, arg) {  /* tier 1..10 -> pitch rises */
    var n = parseInt(arg, 10);
    if (!(n >= 1 && n <= 10)) n = 1;
    var midi = 60 + (n - 1) * 2;
    osc('sine', hz(midi), null, t, .45, .14, .004);
    tone({ type: 'sine', f: hz(midi + 12), t: t, d: .3, v: .06, a: .004, rev: true });
    nz(t, .02, .035, ['highpass', 4000, 4000, .7], .001);
  };
  S['elf-hmph'] = function (t) {
    osc('sawtooth', 210, 128, t, .17, .08, .01, ['lowpass', 750, 450, 1]);
    nz(t + .02, .12, .045, ['bandpass', 600, 320, 1.1], .01);
  };
  S['elf-hm'] = function (t) {
    osc('sine', 240, 212, t, .32, .1, .03, ['lowpass', 1200, 1000, .7], [5, 6]);
  };
  S.cheer = function (t) {  /* host / crowd cheer, abstract but warm */
    var i;
    for (i = 0; i < 3; i++) nz(t + i * .09, .55 + i * .1, .085, ['bandpass', 900 + i * 250, 1600 + i * 300, .8], .08);
    for (i = 0; i < 4; i++) osc('sine', 640 + i * 40, 950 + i * 60, t + .08 + i * .1, .3, .03, .05);
  };
  S.woohoo = function (t) {  /* host "woo-hoo" pitch shape */
    osc('sine', 520, 900, t, .2, .12, .01, null, [9, 12]);
    osc('sine', 880, 640, t + .2, .35, .11, .01, null, [9, 14]);
  };
  function hello(type, a, b, v) {  /* two warm hello notes, bear/cat variants */
    return function (t) {
      osc(type, hz(a), null, t, .22, v, .01, ['lowpass', 900, 900, .7]);
      osc(type, hz(b), null, t + .16, .3, v * .9, .01, ['lowpass', 800, 800, .7]);
    };
  }
  S['bear-hello'] = hello('triangle', 53, 48, .15);
  S['cat-hello'] = hello('sine', 79, 84, .09);
  function nervous(type, f, v, wob) {  /* low/high anxious wobble */
    return function (t) {
      osc(type, hz(f), hz(f - 2), t, .42, v, .02, ['lowpass', 600, 500, .7], [7, wob]);
      nz(t, .3, v * .2, ['lowpass', 380, 380, .7], .02);
    };
  }
  S['bear-nervous'] = nervous('triangle', 45, .12, 16);
  S['cat-nervous'] = nervous('sine', 86, .07, 30);
  S.bell = function (t) { jingle(t, .3, sOut, null, true); };
  S.ribbon = function (t) {
    nz(t, .3, .11, ['bandpass', 1200, 450, .9], .03);
    tone({ type: 'sine', f: 1400, f2: 900, t: t + .04, d: .2, v: .035, a: .02, rev: true });
  };
  S.page = function (t) {
    nz(t, .15, .09, ['highpass', 1800, 2600, .7], .012);
    nz(t + .11, .18, .06, ['bandpass', 2400, 1500, .9], .03);
  };
  S.star = function (t) {  /* magical twinkle for the tree topper */
    var notes = [72, 76, 79, 84, 88], i;
    for (i = 0; i < notes.length; i++) tone({ type: 'sine', f: hz(notes[i]), t: t + i * .06, d: .9, v: .055, a: .005, rev: true });
    jingle(t + .22, .05, sOut, null, true);
  };

  /* -- mute button -- */

  function sync() {
    if (!btn) return;
    var label = muted ? lOff : lOn;
    btn.setAttribute('aria-pressed', muted ? 'true' : 'false');
    btn.setAttribute('aria-label', label);
    btn.setAttribute('title', label);
    btn.className = muted ? 'xm-sound-btn xm-muted' : 'xm-sound-btn';
    if (btn.textContent !== label) btn.textContent = label;
  }

  function setMut(m) {
    muted = !!m;
    try { window.localStorage.setItem(LSK, muted ? '1' : '0'); } catch (e) {}
    try {
      if (ctx && out) {
        var t = ctx.currentTime, g = out.gain;
        g.cancelScheduledValues(t);
        g.setValueAtTime(g.value, t);
        g.linearRampToValueAtTime(muted ? 0 : 1, t + .12);
      }
    } catch (e2) {}
    sync();
  }

  function onClick(e) {
    if (e && e.stopPropagation) e.stopPropagation();
    if (e && e.preventDefault) e.preventDefault();
    setMut(!muted);
    if (!muted) window.XMSound.sfx('click');  /* audible confirmation */
  }

  function attachLater() {
    if (btn && !btn.parentNode && document.body) document.body.appendChild(btn);
  }

  /* -- unlock -- */

  /* Resume the context on the first user gesture; listeners stay bound so a
     later OS-level suspension also self-heals. */
  function unlock() {
    try {
      if (!initCtx()) return;
      if (ctx.state !== 'running' && ctx.resume) {
        var p = ctx.resume();
        if (p && p.catch) p.catch(function () {});
      }
    } catch (e) {}
  }

  function bindGest() {
    if (gest) return;
    gest = true;
    var events = ['pointerdown', 'keydown', 'touchstart', 'mousedown'], i;
    for (i = 0; i < events.length; i++) {
      try { window.addEventListener(events[i], unlock, true); } catch (e) {}
    }
  }

  /* -- public API -- */

  window.XMSound = {
    sfx: function (name, arg) {
      try {
        if (muted) return;
        var fn = S[name];
        if (!fn) return;  /* unknown names are silently ignored */
        if (!initCtx()) return;
        if (ctx.state !== 'running' && ctx.resume) {
          var p = ctx.resume();
          if (p && p.catch) p.catch(function () {});
        }
        var t = ctx.currentTime;
        if (last[name] !== undefined && t - last[name] < THR) return;
        last[name] = t;
        fn(t, arg);
      } catch (e) { /* audio must never break gameplay */ }
    },

    music: function (on) {
      try {
        on = !!on;
        if (on === mOn) return;
        if (!initCtx()) { mOn = on; return; }
        if (ctx.state !== 'running' && ctx.resume) {
          var p = ctx.resume();
          if (p && p.catch) p.catch(function () {});
        }
        mOn = on;
        if (on) startM(); else stopM();
      } catch (e) {}
    },

    button: function (labels) {
      try {
        labels = labels || {};
        if (labels.on) lOn = String(labels.on);
        if (labels.off) lOff = String(labels.off);
        if (!btn && document) {
          btn = document.createElement('button');
          btn.setAttribute('type', 'button');
          btn.className = 'xm-sound-btn';
          btn.addEventListener('click', onClick, false);
          sync();
          /* Created once and dropped in <body>; the page may move it. */
          if (document.body) document.body.appendChild(btn);
          else document.addEventListener('DOMContentLoaded', attachLater, false);
        } else sync();
        return btn || null;
      } catch (e) { return null; }
    },

    muted: function () { return !!muted; }
  };

  bindGest();
})(window, document);
