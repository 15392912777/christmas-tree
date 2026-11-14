/*!
 * 圣诞树默契问答 · 原创版 —— 吉祥物 SVG
 * ===========================================================================
 * 狐狸「阿栗」(host) + 松鼠「豆豆」(helper)
 * 全部图形由代码原创手绘：平面「纸雕」儿童绘本风（粗轮廓、平涂、圆角）。
 * 纯 ES5，无依赖，无 <style>/<script>/外部引用/渐变，不使用任何 id
 * （因此同页多份也不会发生 id 冲突）。
 *
 * 用法：
 *   window.XM_MASCOTS.fox('wave')        -> 完整 <svg> 字符串
 *   window.XM_MASCOTS.squirrel('board')  -> 完整 <svg> 字符串
 *   可用 pose 见 window.XM_MASCOTS.poses
 *
 * 画布 120x150；角色脚底约 y=146；背景透明；CSS 负责设定高度。
 * 每只角色的所有 pose 共用同一套身体/头部几何，仅手臂、表情与道具变化，
 * 保证同一角色在不同 pose 间形象一致。
 * ===========================================================================
 */
(function (win) {
  'use strict';

  var OUT = '#3A2A24';            // 统一深棕轮廓
  var GOLD = '#F2C46B';           // 小星星/闪光
  var SWEAT = '#A9DCEA';          // 汗滴
  var TONGUE = '#D2637E';         // 舌头

  /* 狐狸调色板 */
  var FP = {
    fur: '#E9813B', light: '#F4A15C', cream: '#FFF0DC', inner: '#FFC9A3',
    dark: '#6B3A22', sweater: '#2F6B4E', knit: '#F6E6C4', scarf: '#C93B5B',
    blush: '#F29B7C'
  };
  /* 松鼠调色板 */
  var SP = {
    fur: '#B9855A', light: '#DDB184', belly: '#F7E6CB', dark: '#8E5E3B',
    hat: '#C93B5B', trim: '#FFF0DC', board: '#B06A3B', paper: '#FFF6E7',
    blush: '#DB997F'
  };

  /* 五官几何（所有 pose 共用，保证同一角色形象一致） */
  var FGEOM = {
    eyeL: [47, 42], eyeR: [73, 42], eyeRX: 4.1, eyeRY: 5.3,
    mouth: [60, 59], blushL: [35.5, 57], blushR: [84.5, 57], browY: 31
  };
  var SGEOM = {
    eyeL: [50, 53], eyeR: [70, 53], eyeRX: 3.5, eyeRY: 4.5,
    mouth: [60, 72], blushL: [42, 64.5], blushR: [77, 64.5], browY: 44
  };

  /* ============================ 基础绘图工具 ============================ */

  function svgWrap(inner) {
    return '<svg viewBox="0 0 120 150" xmlns="http://www.w3.org/2000/svg" ' +
      'aria-hidden="true" preserveAspectRatio="xMidYMax meet">' + inner + '</svg>';
  }

  function path(d, fill, sw) {
    return '<path d="' + d + '" fill="' + fill + '" stroke="' + OUT +
      '" stroke-width="' + (sw || 2.7) + '" stroke-linejoin="round" stroke-linecap="round"/>';
  }

  function line(d, color, w) {
    return '<path d="' + d + '" fill="none" stroke="' + color + '" stroke-width="' + w +
      '" stroke-linecap="round" stroke-linejoin="round"/>';
  }

  function circle(x, y, r, fill, sw) {
    return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + fill + '"' +
      (sw ? ' stroke="' + OUT + '" stroke-width="' + sw + '"' : '') + '/>';
  }

  function ellipse(x, y, rx, ry, fill, sw) {
    return '<ellipse cx="' + x + '" cy="' + y + '" rx="' + rx + '" ry="' + ry +
      '" fill="' + fill + '"' +
      (sw ? ' stroke="' + OUT + '" stroke-width="' + sw + '"' : '') + '/>';
  }

  function rect(x, y, w, h, r, fill, sw) {
    return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h +
      '" rx="' + r + '" fill="' + fill + '"' +
      (sw ? ' stroke="' + OUT + '" stroke-width="' + sw + '" stroke-linejoin="round"' : '') + '/>';
  }

  /* 折线肢体：先画粗一圈的深色轮廓，再画内层颜色 —— 得到纸雕式粗描边肢体 */
  function chain(pts, w, color, out) {
    var d = 'M' + pts[0][0] + ',' + pts[0][1], i;
    for (i = 1; i < pts.length; i++) {
      d += 'L' + pts[i][0] + ',' + pts[i][1];
    }
    return line(d, OUT, w + (out || 5)) + line(d, color, w);
  }

  function paw(x, y, r, fill) {
    return circle(x, y, r, fill, 2.3);
  }

  /* 四角星 / 闪光 */
  function sparkle(x, y, r, fill, sw) {
    var k = r * 0.2;
    return '<path d="M' + x + ',' + (y - r) +
      'Q' + (x + k) + ',' + (y - k) + ' ' + (x + r) + ',' + y +
      'Q' + (x + k) + ',' + (y + k) + ' ' + x + ',' + (y + r) +
      'Q' + (x - k) + ',' + (y + k) + ' ' + (x - r) + ',' + y +
      'Q' + (x - k) + ',' + (y - k) + ' ' + x + ',' + (y - r) + 'Z" fill="' + fill + '"' +
      (sw ? ' stroke="' + OUT + '" stroke-width="' + sw + '" stroke-linejoin="round"' : '') + '/>';
  }

  /* 雪花（纯线条，毛衣胸口装饰） */
  function snowflake(cx, cy, r, color) {
    var s = '<g stroke="' + color + '" stroke-width="2" stroke-linecap="round" fill="none">';
    var i, a, d, e, x1, y1, x2, y2, bx, by, ca, sa;
    for (i = 0; i < 3; i++) {
      a = i * Math.PI / 3;
      d = Math.cos(a);
      e = Math.sin(a);
      x1 = cx - d * r;
      y1 = cy - e * r;
      x2 = cx + d * r;
      y2 = cy + e * r;
      s += '<path d="M' + x1.toFixed(1) + ',' + y1.toFixed(1) + 'L' + x2.toFixed(1) + ',' + y2.toFixed(1) + '"/>';
      /* 每条主枝两个小叉 */
      ca = Math.cos(a + 0.9) * 0.34 * r;
      sa = Math.sin(a + 0.9) * 0.34 * r;
      bx = cx + d * r * 0.64;
      by = cy + e * r * 0.64;
      s += '<path d="M' + bx.toFixed(1) + ',' + by.toFixed(1) + 'l' + ca.toFixed(1) + ',' + sa.toFixed(1) + '"/>';
      s += '<path d="M' + bx.toFixed(1) + ',' + by.toFixed(1) + 'l' + (d * -0.3 * r + ca).toFixed(1) + ',' +
        (e * -0.3 * r + sa).toFixed(1) + '"/>';
      bx = cx - d * r * 0.64;
      by = cy - e * r * 0.64;
      s += '<path d="M' + bx.toFixed(1) + ',' + by.toFixed(1) + 'l' + ca.toFixed(1) + ',' + sa.toFixed(1) + '"/>';
      s += '<path d="M' + bx.toFixed(1) + ',' + by.toFixed(1) + 'l' + (d * 0.3 * r + ca).toFixed(1) + ',' +
        (e * 0.3 * r + sa).toFixed(1) + '"/>';
    }
    return s + '</g>';
  }

  /* 小物件组合（配置覆盖） */
  function mix(base, over) {
    var o = {}, k;
    for (k in base) {
      if (Object.prototype.hasOwnProperty.call(base, k)) o[k] = base[k];
    }
    for (k in over) {
      if (Object.prototype.hasOwnProperty.call(over, k)) o[k] = over[k];
    }
    return o;
  }

  /* =============================== 五官 =============================== */

  function eyeOpen(g, x, y, look, big) {
    var ox = look === 'l' ? -1.1 : look === 'r' ? 1.1 : 0;
    var oy = look === 'u' ? -1.2 : look === 'd' ? 1.2 : 0;
    var rx = g.eyeRX * (big ? 1.18 : 1);
    var ry = g.eyeRY * (big ? 1.16 : 1);
    var s = ellipse(x, y, rx, ry, OUT);
    s += circle(x - rx * 0.38 + ox, y - ry * 0.4 + oy, big ? 1.9 : 1.45, '#FFFFFF');
    s += circle(x + rx * 0.4 + ox, y + ry * 0.42 + oy, big ? 1.15 : 0.95, '#FFFFFF');
    return s;
  }

  function eyeHappy(x, y) {
    return line('M' + (x - 5.2) + ',' + (y + 2) + 'Q' + x + ',' + (y - 4.4) + ' ' +
      (x + 5.2) + ',' + (y + 2), OUT, 2.9);
  }

  function eyeSparkle(x, y) {
    return ellipse(x, y, 4.3, 5.4, OUT) + sparkle(x, y, 3, '#FFFFFF') +
      circle(x + 2.4, y + 2.6, 0.9, '#FFFFFF');
  }

  function eyeHalf(g, x, y, look) {
    var rx = g.eyeRX;
    var ry = g.eyeRY;
    var s = '<path d="M' + (x - rx) + ',' + (y - 1.2) + 'Q' + x + ',' + (y + ry * 1.45) + ' ' +
      (x + rx) + ',' + (y - 1.2) + 'Z" fill="' + OUT + '"/>';
    s += line('M' + (x - rx - 1) + ',' + (y - 1.7) + 'L' + (x + rx + 1) + ',' + (y - 1.7), OUT, 2.5);
    s += circle(x + (look === 'u' ? 0.7 : 0), y + (look === 'u' ? 0.2 : 1.5), 1.05, '#FFFFFF');
    return s;
  }

  function eyeSqueeze(x, y, mirror) {
    return line('M' + (x - 4 * mirror) + ',' + (y - 2) + 'L' + (x + 3 * mirror) + ',' + y +
      'L' + (x - 4 * mirror) + ',' + (y + 2), OUT, 2.8);
  }

  function eyes(g, cfg) {
    var kind = cfg.eyes || 'open';
    var look = cfg.look || 'c';
    var L = g.eyeL, R = g.eyeR, s = '';
    if (kind === 'happy') {
      s += eyeHappy(L[0], L[1] - 1) + eyeHappy(R[0], R[1] - 1);
    } else if (kind === 'sparkle') {
      s += eyeSparkle(L[0], L[1]) + eyeSparkle(R[0], R[1]);
    } else if (kind === 'wide') {
      s += eyeOpen(g, L[0], L[1], look, true) + eyeOpen(g, R[0], R[1], look, true);
    } else if (kind === 'half') {
      s += eyeHalf(g, L[0], L[1], look) + eyeHalf(g, R[0], R[1], look);
    } else if (kind === 'squeeze') {
      s += eyeSqueeze(L[0], L[1], -1) + eyeSqueeze(R[0], R[1], 1);
    } else {
      s += eyeOpen(g, L[0], L[1], look) + eyeOpen(g, R[0], R[1], look);
    }
    return s;
  }

  function mouth(g, cfg) {
    var kind = cfg.mouth || 'smile';
    var x = g.mouth[0], y = g.mouth[1], s = '';
    if (kind === 'smile') {
      s = line('M' + (x - 7) + ',' + y + 'Q' + x + ',' + (y + 5.6) + ' ' + (x + 7) + ',' + y, OUT, 2.6);
    } else if (kind === 'open') {
      s = '<path d="M' + (x - 7) + ',' + y + 'Q' + x + ',' + (y - 2.4) + ' ' + (x + 7) + ',' + y +
        'Q' + (x + 8) + ',' + (y + 9) + ' ' + x + ',' + (y + 9.6) +
        'Q' + (x - 8) + ',' + (y + 9) + ' ' + (x - 7) + ',' + y + 'Z" fill="' + OUT + '"/>';
      s += ellipse(x, y + 6.2, 4.2, 2.5, TONGUE);
    } else if (kind === 'laugh') {
      s = '<path d="M' + (x - 8) + ',' + (y - 1) + 'Q' + x + ',' + (y - 4) + ' ' + (x + 8) + ',' + (y - 1) +
        'Q' + (x + 9) + ',' + (y + 9.6) + ' ' + x + ',' + (y + 10.6) +
        'Q' + (x - 9) + ',' + (y + 9.6) + ' ' + (x - 8) + ',' + (y - 1) + 'Z" fill="' + OUT + '"/>';
      s += ellipse(x, y + 7, 5, 2.9, TONGUE);
    } else if (kind === 'o') {
      s = ellipse(x, y + 2.4, 4.4, 5.4, OUT);
    } else if (kind === 'wobble') {
      s = line('M' + (x - 7) + ',' + (y + 1) + 'q3.5,-3 7,0q3.5,3 7,0', OUT, 2.5);
    } else if (kind === 'grimace') {
      s = '<path d="M' + (x - 7) + ',' + (y - 1) + 'L' + (x + 7) + ',' + (y - 1) + 'L' + (x + 7) + ',' +
        (y + 3) + 'Q' + x + ',' + (y + 5.5) + ' ' + (x - 7) + ',' + (y + 3) + 'Z" fill="' + SP.paper +
        '" stroke="' + OUT + '" stroke-width="2.2" stroke-linejoin="round"/>';
      s += line('M' + (x - 2.4) + ',' + (y - 0.3) + 'L' + (x - 2.4) + ',' + (y + 3.4), OUT, 1.7);
      s += line('M' + (x + 2.4) + ',' + (y - 0.3) + 'L' + (x + 2.4) + ',' + (y + 3.4), OUT, 1.7);
    } else if (kind === 'flat') {
      s = line('M' + (x - 5.5) + ',' + (y + 0.5) + 'L' + (x + 5.5) + ',' + (y + 0.5), OUT, 2.5);
    } else if (kind === 'pout') {
      s = line('M' + (x - 3.4) + ',' + (y + 1.6) + 'Q' + x + ',' + (y - 3) + ' ' + (x + 3.4) + ',' + (y + 1.6), OUT, 2.5);
    } else if (kind === 'smirk') {
      s = line('M' + (x - 6.5) + ',' + (y + 1.5) + 'Q' + (x + 1) + ',' + (y + 5) + ' ' + (x + 7) + ',' + (y - 1.5), OUT, 2.5);
    } else if (kind === 'tiny') {
      s = circle(x, y + 1, 2.2, OUT);
    } else if (kind === 'teeth') {
      s = line('M' + (x - 5) + ',' + (y + 1) + 'Q' + x + ',' + (y + 4.6) + ' ' + (x + 5) + ',' + (y + 1), OUT, 2.4);
      s += rect(x - 3.2, y + 1.2, 6.4, 3.6, 1.2, SP.paper, 1.6);
    }
    return s;
  }

  function brows(g, kind) {
    var y = g.browY, L = g.eyeL, R = g.eyeR, s = '';
    if (kind === 'worried') {
      s += line('M' + (L[0] - 7) + ',' + (y + 2) + 'L' + (L[0] + 5) + ',' + (y - 1), OUT, 2.4);
      s += line('M' + (R[0] + 7) + ',' + (y + 2) + 'L' + (R[0] - 5) + ',' + (y - 1), OUT, 2.4);
    } else if (kind === 'angry') {
      s += line('M' + (L[0] - 6) + ',' + (y - 1) + 'L' + (L[0] + 5) + ',' + (y + 2), OUT, 2.4);
      s += line('M' + (R[0] + 6) + ',' + (y - 1) + 'L' + (R[0] - 5) + ',' + (y + 2), OUT, 2.4);
    } else if (kind === 'up') {
      s += line('M' + (L[0] - 5) + ',' + (y + 1) + 'Q' + L[0] + ',' + (y - 3) + ' ' + (L[0] + 5) + ',' + (y + 1), OUT, 2.3);
      s += line('M' + (R[0] - 5) + ',' + (y + 1) + 'Q' + R[0] + ',' + (y - 3) + ' ' + (R[0] + 5) + ',' + (y + 1), OUT, 2.3);
    } else if (kind === 'one') {
      s += line('M' + (L[0] - 5) + ',' + (y + 0.5) + 'L' + (L[0] + 4) + ',' + (y + 0.5), OUT, 2.3);
      s += line('M' + (R[0] - 5) + ',' + (y + 1) + 'Q' + R[0] + ',' + (y - 3.4) + ' ' + (R[0] + 5) + ',' + (y + 1), OUT, 2.3);
    } else if (kind === 'flat') {
      s += line('M' + (L[0] - 5) + ',' + (y + 0.5) + 'L' + (L[0] + 4) + ',' + (y + 0.5), OUT, 2.2);
      s += line('M' + (R[0] - 4) + ',' + (y + 0.5) + 'L' + (R[0] + 5) + ',' + (y + 0.5), OUT, 2.2);
    }
    return s;
  }

  function blushPair(g, color, mode) {
    var s = ellipse(g.blushL[0], g.blushL[1], 4.6, 2.9, color);
    if (mode === 'bigR') {
      s += ellipse(g.blushR[0] - 1.5, g.blushR[1], 5.2, 3.4, color);
    } else {
      s += ellipse(g.blushR[0], g.blushR[1], 4.6, 2.9, color);
    }
    return s;
  }

  /* ============================ 狐狸「阿栗」 ============================ */

  function foxEars() {
    var ear = path('M38,27 L29,8 L55,18 Z', FP.fur, 2.7);
    ear += '<path d="M32.5,10.9 L38.8,24.8 L50.0,17.8 Z" fill="' + FP.inner + '"/>';
    ear += '<path d="M29,8 L32.1,14.5 L37.8,11.4 Z" fill="' + FP.dark + '"/>';
    return ear + '<g transform="translate(120,0) scale(-1,1)">' + ear + '</g>';
  }

  function foxMuzzle() {
    return path('M60,52 C53,46.5 41.5,47.5 39.5,55 C37.8,61.5 45,67.5 53,65.5 ' +
      'C56,64.7 58,64 60,66 C62,64 64,64.7 67,65.5 C75,67.5 82.2,61.5 80.5,55 ' +
      'C78.5,47.5 67,46.5 60,52 Z', FP.cream, 2.4);
  }

  function foxNose() {
    var s = '<path d="M55.4,50.6 Q60,48.4 64.6,50.6 Q63,55.6 60,56.8 Q57,55.6 55.4,50.6 Z" fill="' + OUT + '"/>';
    s += line('M60,56.8 L60,58.6', OUT, 2.2);
    return s;
  }

  function foxHead(c) {
    var s = '<g transform="rotate(' + (c.tilt || 0) + ' 60 76)">';
    s += foxEars();
    s += ellipse(60, 47, 31, 28, FP.fur, 2.8);
    s += foxMuzzle();
    s += eyes(FGEOM, c);
    s += foxNose();
    s += mouth(FGEOM, c);
    if (c.blush) s += blushPair(FGEOM, FP.blush, c.blush);
    if (c.brows) s += brows(FGEOM, c.brows);
    if (c.faceExtra) s += c.faceExtra;
    if (c.hat) s += foxHat();
    return s + '</g>';
  }

  function foxHat() {
    return '<g transform="rotate(5 60 26)">' +
      path('M35,25 Q60,15 85,24 L84,33 Q60,23 36,34 Z', FP.cream, 2.5) +
      path('M41,26 Q48,4 76,7 Q66,16 63,26 Z', FP.scarf, 2.6) +
      circle(79, 7, 4.6, FP.cream, 2.3) +
      '</g>';
  }

  function foxTail(rot) {
    var d = 'M79,123 C97,128 107,112 104,93 C102,80 93,74 87,81';
    return '<g transform="rotate(' + rot + ' 79 123)">' +
      line(d, OUT, 24) + line(d, FP.fur, 19.5) +
      line('M87,113 C95,110 100,104 101,97', FP.light, 3.4) +
      '</g>';
  }

  function foxLegs(mode) {
    if (mode === 'step') {
      return chain([[50, 124], [48.5, 139]], 10.5, FP.dark) +
        chain([[68, 124], [77, 133], [83, 139]], 10.5, FP.dark);
    }
    return chain([[50, 124], [48.5, 139]], 10.5, FP.dark) +
      chain([[70, 124], [71.5, 139]], 10.5, FP.dark);
  }

  function foxKneelLegs() {
    return chain([[50, 131], [40, 139], [47, 141]], 10, FP.dark, 4.6) +
      chain([[70, 131], [80, 139], [73, 141]], 10, FP.dark, 4.6);
  }

  function foxBody() {
    var s = path('M38,80 L82,80 L87,117 Q88,126 80,126 L40,126 Q32,126 33,117 Z', FP.sweater, 2.8);
    s += line('M35,120.5 L85,120.5', FP.knit, 2.2);
    s += snowflake(63, 103, 9.6, FP.knit);
    return s;
  }

  function foxScarf() {
    var s = path('M36,73 Q60,87 84,73 L85,81 Q60,95 35,81 Z', FP.scarf, 2.6);
    s += path('M41,83 L53,86 L51,103 Q50,107 45,105 L41,102 Z', FP.scarf, 2.5);
    s += line('M44,101 L43,106', FP.knit, 1.8);
    s += line('M48,102 L47,106', FP.knit, 1.8);
    return s;
  }

  function foxArm(pts, pawR) {
    var s = chain(pts, 9.5, FP.fur, 5);
    var sh = pts[0], el = pts[1];
    var mx = sh[0] + (el[0] - sh[0]) * 0.44;
    var my = sh[1] + (el[1] - sh[1]) * 0.44;
    var cx = sh[0] + (el[0] - sh[0]) * 0.62;
    var cy = sh[1] + (el[1] - sh[1]) * 0.62;
    s += chain([sh, [mx, my]], 11.5, FP.sweater, 5);
    var end = pts[pts.length - 1];
    s += paw(end[0], end[1], pawR || 5.2, FP.dark);
    return s;
  }

  function foxArms(arms, pawL, pawR) {
    return foxArm(arms.L, pawL) + foxArm(arms.R, pawR);
  }

  var FOX_BASE = {
    eyes: 'open', look: 'c', mouth: 'smile', brows: '', blush: 1,
    tilt: 0, tail: 0, shift: 0, legs: 'stand',
    arms: {
      L: [[39, 87], [34, 102], [41, 114]],
      R: [[81, 87], [86, 102], [79, 114]]
    },
    hat: false, faceExtra: '', extra: ''
  };

  var FOX_POSES = {
    /* 挥手打招呼 */
    wave: {
      tilt: -5, tail: -6,
      arms: { L: [[39, 87], [34, 102], [41, 114]], R: [[81, 87], [94, 75], [102, 57]] },
      extra: sparkle(108, 46, 3, GOLD)
    },
    /* 双手举起欢呼 */
    cheer: {
      eyes: 'happy', mouth: 'open', tail: -10,
      arms: { L: [[39, 87], [27, 73], [29, 56]], R: [[81, 87], [93, 73], [91, 56]] },
      extra: sparkle(23, 43, 3, GOLD) + sparkle(98, 41, 2.6, GOLD)
    },
    /* 紧张搓手 */
    nervous: {
      look: 'l', brows: 'worried', mouth: 'wobble', tilt: 4, tail: -3,
      arms: { L: [[39, 87], [47, 99], [56, 95]], R: [[81, 87], [73, 99], [64, 95]] },
      faceExtra: '<path d="M86,27 C89,32 90.5,35 86,36.5 C81.5,35 83,32 86,27 Z" fill="' + SWEAT +
        '" stroke="' + OUT + '" stroke-width="2"/>'
    },
    /* 双手捂脸惊讶 */
    gasp: {
      eyes: 'wide', mouth: 'o', tilt: -3, tail: -8,
      arms: { L: [[39, 87], [31, 74], [36, 62]], R: [[81, 87], [89, 74], [84, 62]] }
    },
    /* 捂眼不忍看 */
    facepalm: {
      eyes: 'squeeze', mouth: 'grimace', tilt: 7, tail: 2, pawR: 8.2,
      arms: { L: [[39, 87], [33, 103], [40, 115]], R: [[81, 87], [74, 68], [64, 46]] }
    },
    /* 双手托腮星星眼 */
    admire: {
      eyes: 'sparkle', mouth: 'smile', tilt: -4, tail: -4,
      arms: { L: [[39, 87], [46, 78], [55, 74]], R: [[81, 87], [74, 78], [65, 74]] },
      extra: sparkle(24, 32, 3.2, GOLD) + sparkle(97, 25, 2.4, GOLD) + sparkle(101, 52, 2, GOLD)
    },
    /* 到场，伸出一只手 */
    arrive: {
      tilt: 3, tail: -2, legs: 'step',
      arms: { L: [[39, 87], [27, 84], [15, 82]], R: [[81, 87], [86, 102], [79, 114]] }
    },
    /* 捂着肚子大笑 */
    laugh: {
      eyes: 'happy', mouth: 'laugh', tilt: -8, tail: 4,
      arms: { L: [[39, 87], [34, 103], [41, 115]], R: [[81, 87], [74, 101], [67, 110]] }
    },
    /* 跪坐仰望 */
    kneel: {
      look: 'u', tilt: -10, shift: 7, legs: 'kneel',
      arms: { L: [[39, 87], [31, 105], [40, 124]], R: [[81, 87], [89, 105], [80, 124]] }
    },
    /* 戴圣诞帽，开心 */
    hat: {
      eyes: 'happy', mouth: 'smile', tilt: 2, tail: -4, hat: true,
      arms: { L: [[39, 87], [34, 102], [41, 114]], R: [[81, 87], [87, 66], [82, 38]] }
    }
  };

  function fox(pose) {
    var c = mix(FOX_BASE, FOX_POSES[pose] || FOX_POSES.wave);
    var s = '';
    if (c.legs === 'kneel') s += foxKneelLegs();
    s += '<g' + (c.shift ? ' transform="translate(0,' + c.shift + ')"' : '') + '>';
    s += foxTail(c.tail);
    if (c.legs !== 'kneel') s += foxLegs(c.legs);
    s += foxBody();
    s += foxScarf();
    s += foxHead(c);
    s += foxArms(c.arms, c.pawL, c.pawR);
    if (c.extra) s += c.extra;
    s += '</g>';
    return svgWrap(s);
  }

  /* ============================ 松鼠「豆豆」 ============================ */

  function sqEars() {
    var ear = path('M44,45 L31,28 L55,37 Z', SP.fur, 2.6);
    ear += '<path d="M45.6,41.2 L36.2,31.9 L50.6,36.9 Z" fill="' + SP.light + '"/>';
    return ear + '<g transform="translate(120,0) scale(-1,1)">' + ear + '</g>';
  }

  function sqNose() {
    return '<path d="M56.6,63 Q60,61.4 63.4,63 Q62,66.8 60,67.5 Q58,66.8 56.6,63 Z" fill="' + OUT + '"/>' +
      line('M60,67.5 L60,69', OUT, 2);
  }

  function sqMuzzle() {
    return ellipse(60, 69, 13.5, 8.5, SP.belly, 2.3);
  }

  function sqHat(rot, lift) {
    return '<g transform="translate(0,' + ((lift || 0) + 2) + ') rotate(' + rot + ' 60 36)">' +
      path('M37,35 Q60,25 83,33 L84,42 Q60,32 37,43 Z', SP.trim, 2.4) +
      path('M40,35 Q49,15 73,7 Q65,20 61,34 Z', SP.hat, 2.5) +
      circle(75.5, 8, 4.7, SP.trim, 2.2) +
      '</g>';
  }

  function sqHead(c) {
    var s = '<g transform="rotate(' + (c.tilt || 0) + ' 60 80)">';
    if (c.puff) s += circle(86, 61, 9.8, SP.fur, 2.7);
    s += sqEars();
    s += ellipse(60, 56, 25, 23, SP.fur, 2.8);
    s += sqMuzzle();
    s += eyes(SGEOM, c);
    s += sqNose();
    s += mouth(SGEOM, c);
    if (c.blush) s += blushPair(SGEOM, SP.blush, c.blush);
    if (c.brows) s += brows(SGEOM, c.brows);
    if (c.faceExtra) s += c.faceExtra;
    s += sqHat(c.hatTilt || 0, c.hatLift || 0);
    return s + '</g>';
  }

  function sqTail(rot) {
    var d = 'M79,123 C101,127 108,104 103,86 C99,70 86,64 80,75 C76,83 82,93 90,89';
    return '<g transform="rotate(' + rot + ' 79 123)">' +
      line(d, OUT, 22) + line(d, SP.dark, 17) + line(d, SP.fur, 11) +
      circle(90, 89, 6.2, SP.light, 2.2) +
      '</g>';
  }

  function sqLegs() {
    return chain([[52, 123], [51, 138]], 8.5, SP.fur, 4.6) +
      chain([[68, 123], [69, 138]], 8.5, SP.fur, 4.6) +
      ellipse(51, 141.5, 4.9, 3.3, SP.dark, 2.1) +
      ellipse(69, 141.5, 4.9, 3.3, SP.dark, 2.1);
  }

  function sqBody() {
    return ellipse(60, 102, 20, 25, SP.fur, 2.8) +
      ellipse(60, 107, 12.5, 15.5, SP.belly, 2.3);
  }

  function sqArm(pts) {
    var s = chain(pts, 7.5, SP.fur, 4.6);
    var end = pts[pts.length - 1];
    s += paw(end[0], end[1], 4.5, SP.dark);
    return s;
  }

  function sqArms(arms) {
    return sqArm(arms.L) + sqArm(arms.R);
  }

  /* 写字板 + 铅笔 */
  function clipboard(x, y, rot) {
    var s = '<g transform="translate(' + x + ',' + y + ') rotate(' + rot + ')">';
    s += rect(-12, -15, 24, 30, 3, SP.board, 2.5);
    s += rect(-8.5, -11, 17, 22, 2, SP.paper, 2);
    s += rect(-5, -17.5, 10, 6.5, 2, SP.dark, 2.2);
    s += line('M-5,-5 L5,-5', '#C49A78', 1.6);
    s += line('M-5,0 L5,0', '#C49A78', 1.6);
    s += line('M-5,5 L2,5', '#C49A78', 1.6);
    s += '<g transform="rotate(18 6 -2)">' +
      rect(4, -15, 4.4, 14, 1.5, FP.fur, 1.9);
    s += '<path d="M4,-15 L6.2,-18.8 L8.4,-15 Z" fill="' + OUT + '"/>';
    s += line('M4,-6.5 L8.4,-6.5', OUT, 1.5);
    s += '</g></g>';
    return s;
  }

  /* 小礼物盒 */
  function giftBox(x, y, rot) {
    var s = '<g transform="translate(' + x + ',' + y + ') rotate(' + rot + ')">';
    s += rect(-12, -9, 24, 18, 2.5, SP.hat, 2.5);
    s += rect(-12.5, -11.5, 25, 5.5, 1.5, SP.trim, 2.2);
    s += line('M0,-9 L0,9', SP.trim, 3.4);
    s += line('M0,-11 L0,-9', SP.trim, 3.4);
    s += ellipse(-5, -14.2, 4.4, 2.8, SP.trim, 1.8);
    s += ellipse(5, -14.2, 4.4, 2.8, SP.trim, 1.8);
    s += circle(0, -13.6, 2.2, SP.trim, 1.6);
    return s + '</g>';
  }

  var SQ_BASE = {
    eyes: 'open', look: 'c', mouth: 'smile', brows: '', blush: 1,
    tilt: 0, tail: 0, shift: 0, puff: false, hatTilt: 0, hatLift: 0,
    arms: {
      L: [[42, 93], [38, 106], [45, 114]],
      R: [[78, 93], [82, 106], [75, 114]]
    },
    board: null, box: null, extra: '', faceExtra: ''
  };

  var SQ_POSES = {
    /* 抱着写字板，一本正经 */
    board: {
      mouth: 'flat', brows: 'flat',
      board: { x: 60, y: 108, rot: -6 },
      arms: { L: [[42, 93], [46, 105], [49, 113]], R: [[78, 93], [74, 105], [71, 113]] }
    },
    /* 抱臂哼一声，鼓脸颊 */
    hmph: {
      eyes: 'half', look: 'r', brows: 'angry', mouth: 'pout', tilt: 6, tail: -6,
      puff: true, blush: 'bigR',
      arms: { L: [[42, 93], [55, 100], [67, 104]], R: [[78, 93], [65, 100], [53, 104]] }
    },
    /* 翻白眼，看上面 */
    eyeroll: {
      eyes: 'half', look: 'u', brows: 'one', mouth: 'flat', tilt: -6, tail: 4,
      board: { x: 87, y: 111, rot: 8 },
      arms: { L: [[42, 93], [34, 103], [42, 110]], R: [[78, 93], [86, 106], [82, 116]] }
    },
    /* 递出小礼物盒 */
    dropbox: {
      tilt: 3, tail: 0,
      box: { x: 60, y: 115, rot: -3 },
      arms: { L: [[42, 93], [46, 106], [48, 114]], R: [[78, 93], [74, 106], [72, 114]] }
    },
    /* 掀一掀圣诞帽，得意 */
    hat: {
      eyes: 'half', look: 'r', brows: 'one', mouth: 'smirk', tilt: -5, tail: 3,
      hatTilt: -14, hatLift: 3,
      arms: { L: [[42, 93], [34, 103], [41, 110]], R: [[78, 93], [86, 68], [85, 39]] }
    },
    /* 捂嘴偷笑 */
    chuckle: {
      eyes: 'happy', mouth: 'smile', tilt: 5, tail: 6,
      arms: { L: [[42, 93], [47, 103], [53, 109]], R: [[78, 93], [70, 81], [62, 74]] }
    },
    /* 指向圣诞树 */
    point: {
      look: 'u', brows: 'up', mouth: 'open', tilt: -7, tail: 3,
      board: { x: 87, y: 112, rot: 8 },
      arms: { L: [[42, 93], [32, 70], [26, 44]], R: [[78, 93], [84, 106], [82, 116]] },
      extra: chain([[26, 42], [21, 36]], 4, SP.dark, 4.4)
    },
    /* 摊手，随便啦 */
    shrug: {
      brows: 'up', mouth: 'flat', tilt: -3, tail: 0,
      arms: { L: [[42, 93], [27, 91], [18, 84]], R: [[78, 93], [93, 91], [102, 84]] },
      extra: ellipse(18, 82.6, 2.7, 1.7, SP.light) + ellipse(102, 82.6, 2.7, 1.7, SP.light)
    }
  };

  function squirrel(pose) {
    var c = mix(SQ_BASE, SQ_POSES[pose] || SQ_POSES.board);
    var s = '';
    s += sqTail(c.tail);
    s += sqLegs();
    s += sqBody();
    s += sqHead(c);
    if (c.board) s += clipboard(c.board.x, c.board.y, c.board.rot);
    if (c.box) s += giftBox(c.box.x, c.box.y, c.box.rot);
    s += sqArms(c.arms);
    if (c.extra) s += c.extra;
    return svgWrap(s);
  }

  /* ============================== 导出 ============================== */

  win.XM_MASCOTS = {
    fox: fox,
    squirrel: squirrel,
    poses: {
      fox: ['wave', 'cheer', 'nervous', 'gasp', 'facepalm', 'admire', 'arrive', 'laugh', 'kneel', 'hat'],
      squirrel: ['board', 'hmph', 'eyeroll', 'dropbox', 'hat', 'chuckle', 'point', 'shrug']
    },
    version: '1.0.0'
  };
}(window));
