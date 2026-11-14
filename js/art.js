/**
 * 圣诞树默契问答 · 原创版 —— 全部场景美术（纯手写 SVG，无任何图片素材）
 * ---------------------------------------------------------------------------
 * 统一"纸艺贴纸"画风：粗描边、平涂色块、简单几何形。
 * 坐标系与世界一致：一棵树占 320×640 单位；房间、树、彩灯、装饰都在这个坐标系里。
 * 所有函数返回可直接 innerHTML 的 SVG 字符串；需要多个实例时传不同 prefix 避免 id 冲突。
 */
(function () {
  'use strict';

  var OUT = '#3A2A24';
  var C = {
    outline: OUT,
    wall: '#F6E3C8', wall2: '#EAC9A3', wall3: '#DFB68B',
    wood: '#C08457', woodDark: '#8A5334', woodLight: '#D9A272',
    floor: '#D1966A', floorDark: '#B4774E',
    green1: '#12432F', green2: '#1F6B4A', green3: '#2E8A5F', green4: '#4CB07E',
    cream: '#FFF6E7', paper: '#FBE6C8', snow: '#F4F9FF', ice: '#C7DDEB',
    red: '#C93B5B', redDark: '#8E2440', redLight: '#E56A85',
    gold: '#F4C14E', goldDark: '#C99A12', goldLight: '#FFE39A',
    fox: '#E9813B', foxLight: '#F4A15C', cream2: '#FFF0DC', brown: '#6B3A22',
    sweater: '#2F6B4E', berry: '#B6385A', cocoa: '#7A4A2A', plum: '#6B4A8E', sky: '#3E6B8E'
  };

  function svg(vb, body, cls, extra) {
    return '<svg class="' + (cls || 'art') + '" viewBox="' + vb + '" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" '
      + (extra || 'preserveAspectRatio="xMidYMax meet"') + '>' + body + '</svg>';
  }
  function r(n) { return Math.round(n * 10) / 10; }

  // ── the cozy room behind the tree (320×640) ─────────────────────────────────────────────
  function room(prefix) {
    prefix = prefix || 'room';
    var s = '';
    s += '<defs>'
      + '<linearGradient id="' + prefix + '-wall" x1="0" y1="0" x2="0" y2="1">'
      + '<stop offset="0" stop-color="' + C.wall + '"/><stop offset="1" stop-color="' + C.wall2 + '"/></linearGradient>'
      + '<linearGradient id="' + prefix + '-floor" x1="0" y1="0" x2="0" y2="1">'
      + '<stop offset="0" stop-color="' + C.floor + '"/><stop offset="1" stop-color="' + C.floorDark + '"/></linearGradient>'
      + '<linearGradient id="' + prefix + '-night" x1="0" y1="0" x2="0" y2="1">'
      + '<stop offset="0" stop-color="#0B2630"/><stop offset="1" stop-color="#17454F"/></linearGradient>'
      + '<radialGradient id="' + prefix + '-fire" cx=".5" cy=".6" r=".6">'
      + '<stop offset="0" stop-color="#FFDF9A" stop-opacity=".95"/><stop offset="1" stop-color="#FFB35C" stop-opacity="0"/></radialGradient>'
      + '</defs>';
    // wall + beams
    s += '<rect width="320" height="640" fill="url(#' + prefix + '-wall)"/>';
    s += '<path d="M0 0H320V26L0 92Z" fill="' + C.wall3 + '" opacity=".55"/>';
    // wallpaper stripes
    var st = '';
    for (var sx = 18; sx < 320; sx += 34) {
      st += '<path d="M' + sx + ' 26V520" stroke="' + C.wall3 + '" stroke-width="7" opacity=".28"/>';
    }
    s += st;
    // little framed star picture
    s += '<g transform="translate(24 148) rotate(-3)">'
      + '<rect width="46" height="56" rx="5" fill="' + C.woodDark + '" stroke="' + OUT + '" stroke-width="2.5"/>'
      + '<rect x="5" y="5" width="36" height="46" rx="3" fill="' + C.cream + '"/>'
      + '<path d="M23 14l3 8 9 1-7 6 2 9-7-5-7 5 2-9-7-6 9-1Z" fill="' + C.gold + '" stroke="' + OUT + '" stroke-width="1.6"/>'
      + '</g>';
    s += '<path d="M0 0L120 0L0 64Z" fill="' + C.woodDark + '" opacity=".55"/>';
    s += '<path d="M320 0L200 0L320 64Z" fill="' + C.woodDark + '" opacity=".55"/>';
    // snowy window
    s += '<g transform="translate(226 150)">'
      + '<rect x="-8" y="-8" width="96" height="150" rx="10" fill="' + C.woodDark + '"/>'
      + '<rect x="0" y="0" width="80" height="134" rx="6" fill="url(#' + prefix + '-night)"/>'
      + '<path d="M40 0V134M0 67H80" stroke="' + C.cream + '" stroke-width="3" opacity=".9"/>'
      + '<circle cx="16" cy="26" r="2" fill="#fff" opacity=".9"/><circle cx="58" cy="18" r="1.6" fill="#fff" opacity=".8"/>'
      + '<circle cx="30" cy="48" r="1.8" fill="#fff" opacity=".75"/><circle cx="66" cy="58" r="1.4" fill="#fff" opacity=".7"/>'
      + '<circle cx="22" cy="92" r="2.2" fill="#fff" opacity=".8"/><circle cx="52" cy="110" r="1.6" fill="#fff" opacity=".75"/>'
      + '<path d="M0 118Q20 108 40 118T80 118V134H0Z" fill="#E8F2FA" opacity=".85"/>'
      + '<path d="M-8 0q-14 12 -10 34l18 6V-8Z" fill="' + C.red + '" opacity=".85"/>'
      + '<path d="M88 0q14 12 10 34l-18 6V-8Z" fill="' + C.red + '" opacity=".85"/>'
      + '</g>';
    // mantel with stockings + fire
    s += '<g transform="translate(0 356)">'
      + '<rect x="0" y="26" width="118" height="16" rx="4" fill="' + C.woodDark + '"/>'
      + '<rect x="6" y="42" width="106" height="120" rx="6" fill="#8E5A3C"/>'
      + '<path d="M18 42v120M36 42v120M54 42v120M72 42v120M90 42v120" stroke="#74452C" stroke-width="3" opacity=".7"/>'
      + '<path d="M30 42v120M48 42v120M66 42v120M84 42v120" stroke="#A9714C" stroke-width="3" opacity=".7"/>'
      + '<ellipse cx="58" cy="128" rx="34" ry="20" fill="url(#' + prefix + '-fire)"/>'
      + '<path d="M46 150c0-10 8-12 8-22 0 6 8 8 8 22z" fill="#FFB35C"/>'
      + '<path d="M54 150c0-7 6-8 6-16 0 5 6 6 6 16z" fill="#FFE6A8"/>'
      + '<g stroke="' + OUT + '" stroke-width="2" fill="' + C.red + '">'
      + '<path d="M16 34h20v14q0 10-10 10t-10-10z"/><path d="M76 34h20v14q0 10-10 10t-10-10z"/>'
      + '</g>'
      + '<g fill="' + C.cream + '"><rect x="12" y="32" width="28" height="8" rx="3"/><rect x="72" y="32" width="28" height="8" rx="3"/></g>'
      + '</g>';
    // little shelf with gifts at the left
    s += '<g transform="translate(8 214)">'
      + '<rect x="0" y="36" width="92" height="7" rx="3" fill="' + C.woodDark + '"/>'
      + '<rect x="8" y="12" width="24" height="24" rx="4" fill="' + C.berry + '" stroke="' + OUT + '" stroke-width="2"/>'
      + '<rect x="14" y="12" width="12" height="24" fill="' + C.gold + '"/>'
      + '<rect x="40" y="0" width="22" height="36" rx="4" fill="' + C.sky + '" stroke="' + OUT + '" stroke-width="2"/>'
      + '<rect x="44" y="0" width="14" height="36" fill="' + C.goldLight + '"/>'
      + '<circle cx="74" cy="26" r="10" fill="' + C.gold + '" stroke="' + OUT + '" stroke-width="2"/>'
      + '</g>';
    // floor
    s += '<rect y="520" width="320" height="120" fill="url(#' + prefix + '-floor)"/>';
    s += '<path d="M0 540H320M0 570H320M0 604H320" stroke="' + C.floorDark + '" stroke-width="3" opacity=".5"/>';
    s += '<path d="M120 520v120M232 520v120" stroke="' + C.floorDark + '" stroke-width="3" opacity=".4"/>';
    // rug
    s += '<ellipse cx="160" cy="600" rx="138" ry="44" fill="' + C.red + '" opacity=".92"/>';
    s += '<ellipse cx="160" cy="600" rx="112" ry="32" fill="none" stroke="' + C.cream + '" stroke-width="3" stroke-dasharray="8 8" opacity=".9"/>';
    // base snow
    s += '<path d="M0 612q30-16 62-4t58 2 58-8 60 6 42-2 40 6v28H0Z" fill="' + C.snow + '"/>';
    s += '<path d="M0 626q36-10 70-2t64 2 62-6 66 6 58-2v16H0Z" fill="#EAF3FB" opacity=".9"/>';
    return s;
  }

  // ── the tree (320×640), one reusable body ───────────────────────────────────────────────
  var TIER_Y = [517, 477, 432, 374, 327, 278, 241, 198, 157, 121];
  var TIER_HW = [152, 141, 129, 117, 105, 92, 79, 67, 56, 44];

  function tierPath(n) {
    var bottom = TIER_Y[n - 1] + 12;
    var top = TIER_Y[n - 1] - 68;
    var hw = TIER_HW[n - 1];
    var hwt = hw * .64;
    var bumps = 4 + Math.round(hw / 52);
    var step = (hw * 2) / bumps;
    // top-left → rounded top → top-right → right side → scalloped bottom (right→left) → close
    var d = 'M' + r(160 - hwt) + ' ' + r(top + 3)
      + 'Q160 ' + r(top - 16) + ' ' + r(160 + hwt) + ' ' + r(top + 3)
      + 'L' + r(160 + hw) + ' ' + r(bottom);
    for (var i = 0; i < bumps; i++) {
      var x0 = 160 + hw - i * step;
      d += 'Q' + r(x0 - step / 2) + ' ' + r(bottom + 14) + ' ' + r(x0 - step) + ' ' + r(bottom);
    }
    d += 'Z';
    return d;
  }

  function treeBody(prefix, lit) {
    prefix = prefix || 'tree';
    var s = '';
    s += '<defs>'
      + '<linearGradient id="' + prefix + '-tg" x1="0" y1="0" x2="0" y2="1">'
      + '<stop offset="0" stop-color="' + C.green4 + '"/><stop offset=".55" stop-color="' + C.green3 + '"/>'
      + '<stop offset="1" stop-color="' + C.green2 + '"/></linearGradient>'
      + '<linearGradient id="' + prefix + '-trunk" x1="0" y1="0" x2="1" y2="0">'
      + '<stop offset="0" stop-color="' + C.woodDark + '"/><stop offset=".5" stop-color="' + C.wood + '"/>'
      + '<stop offset="1" stop-color="' + C.woodDark + '"/></linearGradient>'
      + '<linearGradient id="' + prefix + '-tub" x1="0" y1="0" x2="0" y2="1">'
      + '<stop offset="0" stop-color="' + C.woodLight + '"/><stop offset="1" stop-color="' + C.woodDark + '"/></linearGradient>'
      + '<radialGradient id="' + prefix + '-glow" cx=".5" cy=".5" r=".5">'
      + '<stop offset="0" stop-color="#FFF3B0" stop-opacity=".9"/><stop offset=".45" stop-color="#FFD34D" stop-opacity=".35"/>'
      + '<stop offset="1" stop-color="#FFD34D" stop-opacity="0"/></radialGradient>'
      + '</defs>';
    // trunk + wooden tub
    s += '<rect x="148" y="492" width="24" height="112" rx="8" fill="url(#' + prefix + '-trunk)" stroke="' + OUT + '" stroke-width="3"/>';
    s += '<path d="M152 512v84M166 508v88" stroke="' + C.brown + '" stroke-width="2" opacity=".5"/>';
    s += '<path d="M116 596h88l12 40h-112Z" fill="url(#' + prefix + '-tub)" stroke="' + OUT + '" stroke-width="3" stroke-linejoin="round"/>';
    s += '<path d="M120 608h80M116 620h88" stroke="' + C.woodDark + '" stroke-width="4" opacity=".7"/>';
    s += '<ellipse cx="160" cy="596" rx="44" ry="8" fill="#6E4A2E"/>';
    // tiers, bottom to top
    for (var n = 1; n <= 10; n++) {
      var d = tierPath(n);
      s += '<path d="' + d + '" fill="url(#' + prefix + '-tg)" stroke="' + OUT + '" stroke-width="3" stroke-linejoin="round"/>';
      // paper-cut highlight along the left slope
      s += '<path d="M160 ' + r(TIER_Y[n - 1] - 66) + 'L' + r(160 - TIER_HW[n - 1] * .82) + ' ' + r(TIER_Y[n - 1] + 2)
        + 'L' + r(160 - TIER_HW[n - 1] * .55) + ' ' + r(TIER_Y[n - 1] + 4) + 'Z" fill="' + C.green4 + '" opacity=".35"/>';
    }
    // star
    var pts = [], cx = 160, cy = 46, R = 27, r2 = 11.5;
    for (var k = 0; k < 10; k++) {
      var ang = -Math.PI / 2 + k * Math.PI / 5;
      var rad = k % 2 ? r2 : R;
      pts.push(r(cx + Math.cos(ang) * rad) + ',' + r(cy + Math.sin(ang) * rad));
    }
    s += '<circle cx="160" cy="46" r="52" fill="url(#' + prefix + '-glow)" class="star-glow"/>';
    s += '<polygon points="' + pts.join(' ') + '" fill="' + C.gold + '" stroke="' + OUT + '" stroke-width="3" stroke-linejoin="round"/>';
    s += '<polygon points="' + pts.slice(0, 3).join(' ') + ' ' + r(cx + 18) + ',' + r(cy - 6) + '" fill="' + C.goldLight + '" opacity=".85"/>';
    return s;
  }

  // ── small props ─────────────────────────────────────────────────────────────────────────
  function box() {
    var s = '<defs><linearGradient id="boxG" x1="0" y1="0" x2="0" y2="1">'
      + '<stop offset="0" stop-color="#D9A272"/><stop offset="1" stop-color="#A96A44"/></linearGradient></defs>';
    s += '<ellipse cx="70" cy="112" rx="52" ry="9" fill="#000" opacity=".18"/>';
    s += '<path d="M8 44L18 12l44 10-8 30Z" fill="#C08457" stroke="' + OUT + '" stroke-width="2.5" stroke-linejoin="round"/>';
    s += '<path d="M132 44L122 12l-44 10 8 30Z" fill="#C08457" stroke="' + OUT + '" stroke-width="2.5" stroke-linejoin="round"/>';
    s += '<path d="M22 48h96l-6 64H28Z" fill="url(#boxG)" stroke="' + OUT + '" stroke-width="2.5" stroke-linejoin="round"/>';
    s += '<path d="M24 48h92v12H24Z" fill="#E4B489" opacity=".65"/>';
    s += '<g stroke="' + C.cream + '" stroke-width="2.5" opacity=".9" fill="none">'
      + '<path d="M40 62q10 8 20 0t20 2"/><path d="M46 86q14-10 34-2"/></g>';
    s += '<g fill="' + C.gold + '"><circle cx="52" cy="72" r="3"/><circle cx="86" cy="70" r="2.5"/><circle cx="98" cy="88" r="3"/></g>';
    s += '<g stroke="' + C.red + '" stroke-width="3" fill="none" stroke-linecap="round">'
      + '<path d="M64 56q-8-14 4-18"/><path d="M78 54q6-16 18-12"/><path d="M92 58q12-8 16 2"/></g>';
    return svg('0 0 140 120', s, 'art box-art');
  }

  // ornaments: 10 originals, 40×40 units
  function ornament(name) {
    var s = '';
    var hook = '<path d="M20 3v6" stroke="' + C.goldDark + '" stroke-width="2.2" stroke-linecap="round"/>';
    switch (name) {
      case 'bell':
        s = hook + '<path d="M12 12h16l3 14q0 6-11 6T9 26Z" fill="' + C.gold + '" stroke="' + OUT + '" stroke-width="2.4" stroke-linejoin="round"/>'
          + '<circle cx="20" cy="34" r="3.2" fill="' + C.goldDark + '" stroke="' + OUT + '" stroke-width="2"/>'
          + '<path d="M15 18q5-3 10 0" stroke="#FFF3B0" stroke-width="2.2" fill="none"/>';
        break;
      case 'candy-cane':
        s = hook + '<path d="M22 8q10 2 10 12t-12 12" fill="none" stroke="#FFF6E7" stroke-width="7" stroke-linecap="round"/>'
          + '<path d="M22 8q10 2 10 12t-12 12" fill="none" stroke="' + C.red + '" stroke-width="7" stroke-dasharray="4 5" stroke-linecap="round"/>'
          + '<path d="M22 8q10 2 10 12t-12 12" fill="none" stroke="' + OUT + '" stroke-width="1.4" opacity=".5"/>';
        break;
      case 'bow':
        s = hook + '<path d="M20 18c-8-8-16-4-14 4 1 5 8 6 14 2 6 4 13 3 14-2 2-8-6-12-14-4Z" fill="' + C.red + '" stroke="' + OUT + '" stroke-width="2.4" stroke-linejoin="round"/>'
          + '<path d="M20 20l-6 14 6-3 6 3-6-14Z" fill="' + C.redDark + '" stroke="' + OUT + '" stroke-width="2" stroke-linejoin="round"/>'
          + '<circle cx="20" cy="19" r="3.4" fill="' + C.redLight + '" stroke="' + OUT + '" stroke-width="2"/>';
        break;
      case 'gingerbread':
        s = hook + '<g fill="#B9773F" stroke="' + OUT + '" stroke-width="2.2" stroke-linejoin="round">'
          + '<circle cx="20" cy="11" r="7"/><path d="M15 18h10l6 8-3 3-5-3v10l-6 0V26l-5 3-3-3Z"/></g>'
          + '<g fill="' + C.cream + '"><circle cx="17.5" cy="10" r="1.2"/><circle cx="22.5" cy="10" r="1.2"/><path d="M17 14q3 2 6 0" fill="none" stroke="' + C.cream + '" stroke-width="1.6"/></g>';
        break;
      case 'snowflake':
        s = '<g stroke="#DCEFFA" stroke-width="3" stroke-linecap="round" fill="none">'
          + '<path d="M20 4v32M6 12l28 16M34 12L6 28"/>'
          + '<path d="M20 10l-4 5M20 10l4 5M20 30l-4-5M20 30l4-5M9 15l5 1M9 25l5-1M31 15l-5 1M31 25l-5-1"/></g>'
          + '<circle cx="20" cy="20" r="3" fill="#fff" stroke="#DCEFFA" stroke-width="2"/>';
        break;
      case 'red':
        s = hook + '<circle cx="20" cy="23" r="13" fill="' + C.red + '" stroke="' + OUT + '" stroke-width="2.4"/>'
          + '<path d="M13 17q3-3 6-3" stroke="#FFD9DF" stroke-width="2.5" stroke-linecap="round" fill="none"/>'
          + '<rect x="16" y="8" width="8" height="5" rx="2" fill="' + C.gold + '" stroke="' + OUT + '" stroke-width="2"/>';
        break;
      case 'present':
        s = hook + '<rect x="7" y="14" width="26" height="20" rx="3" fill="' + C.berry + '" stroke="' + OUT + '" stroke-width="2.4"/>'
          + '<rect x="18" y="14" width="4" height="20" fill="' + C.gold + '"/><rect x="7" y="21" width="26" height="4" fill="' + C.gold + '"/>'
          + '<path d="M20 14q-8-6-9 0t9 1q9-2 9-5t-9 4" fill="' + C.goldLight + '" stroke="' + OUT + '" stroke-width="1.6"/>';
        break;
      case 'pinecone':
        s = hook + '<ellipse cx="20" cy="24" rx="9" ry="13" fill="#9A6238" stroke="' + OUT + '" stroke-width="2.2"/>'
          + '<g stroke="' + OUT + '" stroke-width="1.4" fill="#B9773F">'
          + '<path d="M13 16q7 4 14 0M12 22q8 4 16 0M13 28q7 4 14 0M15 33q5 2 10 0"/></g>';
        break;
      case 'heart':
        s = hook + '<path d="M20 34S6 24 6 15c0-5 4-8 8-8 3 0 5 2 6 4 1-2 3-4 6-4 4 0 8 3 8 8 0 9-14 19-14 19Z" fill="' + C.berry + '" stroke="' + OUT + '" stroke-width="2.4" stroke-linejoin="round"/>'
          + '<path d="M12 12q2-2 4-1" stroke="#FFD9DF" stroke-width="2.2" stroke-linecap="round" fill="none"/>';
        break;
      default: // icicle
        s = hook + '<path d="M14 10h12l-3 8 2 20-10 0 2-20Z" fill="' + C.ice + '" stroke="' + OUT + '" stroke-width="2.2" stroke-linejoin="round"/>'
          + '<path d="M18 14v20" stroke="#fff" stroke-width="2" opacity=".8"/>';
    }
    return svg('0 0 40 40', s, 'deco-art');
  }

  // ── UI pieces ───────────────────────────────────────────────────────────────────────────
  function ribbon() {
    var s = '<defs><linearGradient id="ribG" x1="0" y1="0" x2="0" y2="1">'
      + '<stop offset="0" stop-color="#E56A85"/><stop offset=".55" stop-color="' + C.red + '"/><stop offset="1" stop-color="' + C.redDark + '"/></linearGradient></defs>';
    // tails
    s += '<path d="M62 20L4 14l14 22L4 58l58-8Z" fill="' + C.redDark + '" stroke="' + OUT + '" stroke-width="2.5" stroke-linejoin="round"/>';
    s += '<path d="M178 20l58-6-14 22 14 22-58-8Z" fill="' + C.redDark + '" stroke="' + OUT + '" stroke-width="2.5" stroke-linejoin="round"/>';
    // band
    s += '<rect x="52" y="14" width="136" height="44" rx="9" fill="url(#ribG)" stroke="' + OUT + '" stroke-width="2.8"/>';
    // folds
    s += '<path d="M58 16l-8 40 12-4 6-32Z" fill="' + C.redDark + '" opacity=".55"/>';
    s += '<path d="M182 16l8 40-12-4-6-32Z" fill="' + C.redDark + '" opacity=".55"/>';
    // highlight
    s += '<path d="M64 22h112" stroke="#FFB9C6" stroke-width="3" stroke-linecap="round" opacity=".55"/>';
    return svg('0 0 240 72', s, 'ribbon-art');
  }

  function garland() {
    var s = '';
    var greens = ['#2E8A5F', '#46A873', '#5FBE8B', '#3A9A6C'];
    // rope
    s += '<path d="M0 66Q100 44 200 64T400 60" fill="none" stroke="#6B3A22" stroke-width="4" opacity=".8"/>';
    for (var x = 10; x <= 398; x += 22) {
      var y = 66 - 11 * Math.sin(x / 58);
      var g = greens[(x / 22) % 4 | 0];
      for (var i = 0; i < 7; i++) {
        var a = -78 + i * 24 + (x % 3) * 5;
        s += '<ellipse cx="' + r(x) + '" cy="' + r(y) + '" rx="18" ry="5" fill="' + g + '" transform="rotate(' + r(a) + ' ' + r(x) + ' ' + r(y) + ')"/>';
      }
      s += '<ellipse cx="' + r(x) + '" cy="' + r(y - 2) + '" rx="13" ry="4" fill="#6FD69A" opacity=".55"/>';
      if (x % 66 === 10) {
        s += '<circle cx="' + r(x + 9) + '" cy="' + r(y + 9) + '" r="4" fill="' + C.berry + '" stroke="' + OUT + '" stroke-width="1.6"/>';
        s += '<circle cx="' + r(x - 6) + '" cy="' + r(y + 11) + '" r="3" fill="' + C.gold + '" stroke="' + OUT + '" stroke-width="1.4"/>';
      }
    }
    return svg('0 0 400 120', s, 'garland-art');
  }

  function snowEdge() {
    var d = 'M0 14';
    for (var x = 0; x <= 400; x += 40) {
      d += 'Q' + (x + 20) + ' 0 ' + (x + 40) + ' 14';
    }
    d += 'V44H0Z';
    var s = '<path d="' + d + '" fill="#DCE9F3" opacity=".7" transform="translate(0 3)"/>';
    s += '<path d="' + d + '" fill="' + C.cream + '"/>';
    s += '<path d="' + d + '" fill="none" stroke="#fff" stroke-width="2" opacity=".8"/>';
    return svg('0 0 400 44', s, 'snow-art');
  }

  function holly() {
    var s = '<g stroke="' + OUT + '" stroke-width="2" stroke-linejoin="round">'
      + '<path d="M20 18C10 12 4 20 8 26c4 5 12 2 12-8Z" fill="' + C.green2 + '"/>'
      + '<path d="M22 16C30 8 38 14 36 22c-2 7-12 7-14-6Z" fill="' + C.green3 + '"/>'
      + '</g>'
      + '<circle cx="18" cy="27" r="4" fill="' + C.berry + '" stroke="' + OUT + '" stroke-width="1.8"/>'
      + '<circle cx="27" cy="28" r="3.6" fill="' + C.red + '" stroke="' + OUT + '" stroke-width="1.8"/>'
      + '<circle cx="23" cy="33" r="3" fill="' + C.berry + '" stroke="' + OUT + '" stroke-width="1.8"/>';
    return svg('0 0 44 40', s, 'holly-art');
  }

  function twig() {
    return svg('0 0 100 40',
      '<path d="M0 4H100V20Q88 40 72 24Q50 46 28 24Q12 40 0 20Z" fill="' + C.green3 + '" stroke="' + OUT + '" stroke-width="2.6" stroke-linejoin="round"/>'
      + '<path d="M0 12Q14 30 28 16Q50 38 72 16Q88 32 100 12" fill="none" stroke="' + C.green2 + '" stroke-width="3" opacity=".7"/>',
      'bauble-twig');
  }

  // the landing polaroid: a mini self-portrait of the room + tree + host
  function postcard() {
    var fox = (window.XM_MASCOTS ? window.XM_MASCOTS.fox('wave') : '');
    var foxInner = fox.replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
    var s = '<defs>'
      + '<linearGradient id="pc-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + C.wall + '"/><stop offset="1" stop-color="' + C.wall2 + '"/></linearGradient>'
      + '<linearGradient id="pc-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + C.floor + '"/><stop offset="1" stop-color="' + C.floorDark + '"/></linearGradient>'
      + '</defs>';
    s += '<rect width="220" height="150" fill="url(#pc-wall)"/>';
    // window
    s += '<g transform="translate(150 16)"><rect width="56" height="66" rx="6" fill="#12323C" stroke="' + C.woodDark + '" stroke-width="4"/>'
      + '<path d="M28 0v66M0 33h56" stroke="' + C.cream + '" stroke-width="2.6"/>'
      + '<circle cx="12" cy="14" r="1.6" fill="#fff"/><circle cx="38" cy="22" r="1.3" fill="#fff"/><circle cx="20" cy="44" r="1.5" fill="#fff"/></g>';
    // floor + rug
    s += '<rect y="112" width="220" height="38" fill="url(#pc-floor)"/>';
    s += '<ellipse cx="96" cy="132" rx="86" ry="16" fill="' + C.red + '"/>';
    s += '<ellipse cx="96" cy="132" rx="70" ry="11" fill="none" stroke="' + C.cream + '" stroke-width="2" stroke-dasharray="5 5"/>';
    // tree
    s += '<g transform="translate(16 6) scale(0.19)" opacity=".98">'
      + '<svg x="0" y="0" width="320" height="640" viewBox="0 0 320 640" preserveAspectRatio="xMidYMax meet">'
      + treeBody('pc', true) + '</svg></g>';
    // fox
    s += '<g transform="translate(118 58) scale(0.62)"><g transform="translate(0 0)">' + foxInner + '</g></g>';
    // warm vignette + snow at the bottom
    s += '<rect width="220" height="150" fill="' + C.goldLight + '" opacity=".06"/>';
    s += '<path d="M0 140q28-8 52-2t44 0 44-4 44 2 36-2v16H0Z" fill="#fff" opacity=".75"/>';
    return svg('0 0 220 150', s, 'postcard-art', 'preserveAspectRatio="xMidYMid slice"');
  }



  // ── the night outside the invitation (fills the landing hero) ────────────────────────────
  function heroScene() {
    var s = '<defs>'
      + '<linearGradient id="hs-sky" x1="0" y1="0" x2="0" y2="1">'
      + '<stop offset="0" stop-color="#071B23"/><stop offset=".55" stop-color="#0D2C36"/>'
      + '<stop offset="1" stop-color="#1B5560"/></linearGradient>'
      + '<radialGradient id="hs-moon" cx=".5" cy=".5" r=".5">'
      + '<stop offset="0" stop-color="#FFF4CF" stop-opacity=".85"/><stop offset=".45" stop-color="#FFE39A" stop-opacity=".28"/>'
      + '<stop offset="1" stop-color="#FFE39A" stop-opacity="0"/></radialGradient>'
      + '<linearGradient id="hs-hill" x1="0" y1="0" x2="0" y2="1">'
      + '<stop offset="0" stop-color="#2C6470"/><stop offset="1" stop-color="#17454F"/></linearGradient>'
      + '</defs>';
    s += '<rect width="390" height="560" fill="url(#hs-sky)"/>';
    // stars
    var stars = [[28, 46, 1.8], [64, 92, 1.3], [110, 40, 1.2], [148, 108, 1.6], [186, 58, 1.1], [244, 34, 1.4],
      [286, 96, 1.2], [330, 52, 1.7], [364, 118, 1.2], [46, 148, 1.1], [206, 140, 1.3], [120, 176, 1], [300, 160, 1.2]];
    for (var i = 0; i < stars.length; i++) {
      var st2 = stars[i];
      s += '<circle cx="' + st2[0] + '" cy="' + st2[1] + '" r="' + st2[2] + '" fill="#fff" opacity="' + (.55 + (i % 3) * .15) + '"/>';
    }
    // moon
    s += '<circle cx="338" cy="42" r="58" fill="url(#hs-moon)"/>';
    s += '<circle cx="338" cy="42" r="24" fill="#FFF4CF" opacity=".95"/>';
    s += '<circle cx="344" cy="37" r="21" fill="url(#hs-sky)" opacity=".92"/>';
    // distant pines
    s += '<g fill="#0F333D" opacity=".85">';
    [[54, 470, 46], [86, 486, 34], [330, 470, 44], [360, 482, 30]].forEach(function (t) {
      s += '<path d="M' + t[0] + ' ' + (t[1] - t[2] * 2.2) + 'L' + (t[0] - t[2]) + ' ' + t[1]
        + 'L' + (t[0] + t[2]) + ' ' + t[1] + 'Z"/>';
      s += '<rect x="' + (t[0] - 3) + '" y="' + t[1] + '" width="6" height="10" fill="#0F333D"/>';
    });
    s += '</g>';
    // snowy hills
    s += '<path d="M0 500q64-44 132-8t126-10 132 12v66H0Z" fill="url(#hs-hill)"/>';
    s += '<path d="M0 524q58-26 116-4t118-2 156 8v34H0Z" fill="#2C6470"/>';
    s += '<path d="M0 542q66-14 128 0t132-6 130 4v20H0Z" fill="#EAF4FB" opacity=".92"/>';
    // a warm string of lights across the top
    s += '<path d="M-10 34Q100 62 200 40T400 44" fill="none" stroke="#6B3A22" stroke-width="2.4" opacity=".7"/>';
    for (var lx = 8; lx < 400; lx += 28) {
      var ly = 34 + 10 * Math.sin(lx / 90) - 6 * Math.sin(lx / 42);
      s += '<circle cx="' + lx + '" cy="' + r(ly + 6) + '" r="3" fill="' + (lx % 56 === 8 ? C.gold : '#FFE39A') + '" opacity=".85"/>';
    }
    return svg('0 0 390 560', s, 'hero-art', 'preserveAspectRatio="xMidYMid slice"');
  }

  window.XM_ART = {
    palette: C,
    room: function (prefix) { return svg('0 0 320 640', room(prefix || 'room'), 'room-art', 'preserveAspectRatio="xMidYMid slice"'); },
    tree: function (prefix, lit) { return svg('0 0 320 640', treeBody(prefix || 'tree', lit), 'tree-art-svg'); },
    box: box,
    ornament: ornament,
    ribbon: ribbon,
    garland: garland,
    snowEdge: snowEdge,
    holly: holly,
    twig: twig,
    postcard: postcard,
    heroScene: heroScene,
    tierY: TIER_Y,
    tierWidths: TIER_HW
  };
})();
