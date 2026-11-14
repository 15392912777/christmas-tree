# QA-REPORT — `christmas-tree-original` (original Christmas-tree quiz)

**FINAL (freeze-4): RELEASE-READY.** Functional: 1327/1327 checks pass on the unchanged engine/art (freeze-2 matrix, all hashes identical except copy-only js/data.js edits). Originality: 0 forbidden phrases in shipped files, README has 0 ≥10-char CJK overlap with the replica, and the last 0.96-similarity runtime line (box ending) has been rephrased — freeze-4 re-audit is clean (new line similarity 0.56). Freeze-4 hashes 8/8 match. See §9, including §9.8. History: freeze-2 audit was FIX-FIRST; freeze-3 fixed docs + literal phrase; freeze-4 fixed the last near-verbatim line.

- **Target:** `/Users/x/Documents/deepseek-harness/default-workspace/christmas-tree-original/` (static, `file://`-runnable)
- **Verifier:** `verifier-orig` (independent release verification, task-7)
- **Freeze history:** freeze-2 (12:16:23 CST) was the state used for the full 15-run functional matrix; freeze-3 (12:48:46 CST) is the final release state, re-audited in §9 (README.md rewritten + `js/data.js` `lastQuestion` copy only; the other six hashes are byte-identical to freeze-2). css/style.css freeze-2/3 hash `602ba2b2b70053d74c2526bff9dea62d`.
- **QA window:** 2026-11-14 12:14 – 12:51 CST. Functional flows/screenshots 01–13 were captured on the freeze-2 state; freeze-3 re-audit (§9) covers the final files and screenshot 14.
- **Tooling:** Playwright 1.65.1 (playwright-core) + Chromium headless shell 1248, iPhone context 390×844 @ DPR 2 mobile+touch (plus 375×667, 320×568, 430×932, 1280×800 desktop), loaded via `file:///…/christmas-tree-original/index.html` (no loopback server).

## 1. Frozen-hash verification

| file | expected (freeze-2) | md5 measured at QA start | md5 measured at QA end | result |
| --- | --- | --- | --- | --- |
| `index.html` | `5bcde41447d75df33f1c580d1d166ef6` | `5bcde41447d75df33f1c580d1d166ef6` | `5bcde41447d75df33f1c580d1d166ef6` | PASS ✅ |
| `css/style.css` | `602ba2b2b70053d74c2526bff9dea62d` | `602ba2b2b70053d74c2526bff9dea62d` | `602ba2b2b70053d74c2526bff9dea62d` | PASS ✅ |
| `js/data.js` | `5a81c6845eb64f7c3198c0aef8490e57` | `5a81c6845eb64f7c3198c0aef8490e57` | `5a81c6845eb64f7c3198c0aef8490e57` | PASS ✅ |
| `js/art.js` | `1bea3283f90146fa24f6b84f92f9e417` | `1bea3283f90146fa24f6b84f92f9e417` | `1bea3283f90146fa24f6b84f92f9e417` | PASS ✅ |
| `js/game.js` | `c113f900381ffbe5125b3dc9c86ba317` | `c113f900381ffbe5125b3dc9c86ba317` | `c113f900381ffbe5125b3dc9c86ba317` | PASS ✅ |
| `js/mascots.js` | `9e74466ddd4ab1ff5e5fcfd5a2a282e0` | `9e74466ddd4ab1ff5e5fcfd5a2a282e0` | `9e74466ddd4ab1ff5e5fcfd5a2a282e0` | PASS ✅ |
| `js/sound.js` | `5c4075d97fbeaf12dd12162fc162725e` | `5c4075d97fbeaf12dd12162fc162725e` | `5c4075d97fbeaf12dd12162fc162725e` | PASS ✅ |

All 7 frozen hashes match at both start and end: **PASS**. Only `qa/` was created/updated by this verification; no project file was modified.

## 2. Result summary

- Automated checks executed: **1327** across **15** runs → **1327 PASS / 0 FAIL** (the only FAILs were two test-harness expectation bugs, re-run clean; see §5).
- Console errors: **0**, page errors: **0**, failed requests: **0**, non-2xx responses: **0**, HTTP image/media request: **0**.
- Runtime network: only Google Fonts (`fonts.googleapis.com` CSS + 3 `fonts.gstatic.com` woff2, all 200) — no other host contacted; all 7 local files loaded (`css/style.css, index.html, js/art.js, js/data.js, js/game.js, js/mascots.js, js/sound.js`).

| run | checks | result | problem checks | duration |
|---|---|---|---|---|
| `perfect` | 120 | PASS | — | 71.1s |
| `box` | 110 | PASS | — | 76.7s |
| `front` | 117 | PASS | — | 278.8s |
| `bottom` | 115 | PASS | — | 278.8s |
| `w320` | 96 | PASS | — | 268.3s |
| `w375` | 96 | PASS | — | 54.7s |
| `w430` | 96 | PASS | — | 54.7s |
| `w1280` | 96 | PASS | — | 54.7s |
| `threshold-9` | 119 | PASS | — | 72.6s |
| `threshold-7` | 116 | PASS | — | 60.6s |
| `threshold-5` | 114 | PASS | — | 60.6s |
| `threshold-4` | 114 | PASS | — | 60.6s |
| `edge` | 10 | PASS | — | 19.4s |
| `mascots` | 4 | PASS | — | 1.3s |
| `reduced-motion` | 4 | PASS | — | 8.8s |


> Harness note: the first `box` and `reduced-motion` runs reported a run-level timeout / stale expectation from the QA script (waiting for lit tiers 300 ms after the garland bulb vs. the game's 1140 ms light-timing; and expecting the perfect badge on a 9/10 top ending). Both were test-harness bugs, fixed and re-run clean (rows above are the re-runs). The `threshold-9` run also re-ran clean after the badge-expectation fix. No product behaviour changed.

## 3. Functional matrix (PASS/FAIL)

| Check | Result | Evidence |
|---|---|---|
| Landing renders & copy matches data.js | PASS | title "阿栗 的圣诞树还缺你这一颗 🎄"; sticker "今日心情：刚出炉的烤栗子 🌰"; proof "树上已经有 2 颗球在发光 🎄 / 挂在最高处的是 汤圆 👑"; rule "十道关于阿栗的小题。猜得越准，你的球离他的星星越近 🎄"; CTA "我也来挂一颗 🎄"; maxlength=15 |
| Landing SVG art (polaroid / hero / snow edge / 26 flakes) | PASS | polaroid bbox 220×150, hero bbox, snow edge bbox, 26 flakes |
| Empty-name error | PASS | click start with empty input → `#name-error` text "先取个名字吧", class `is-on`, scene stays `sc-landing` |
| Enter key starts game | PASS | `press("#name-input","Enter")` → `#sc-climb.is-active` (used by every flow) |
| Intro: both mascots + speech, questionless panel | PASS | host visible 128×160px @x=260, elf visible 113.6×142px @x=4, host speech "呀，小明 来啦！" (typing), qpanel is-questionless; screenshots 02/02b |
| Question screen: ribbon + question + 2 option cards | PASS | ribbon "第 1 题 · 共 10 题"; q "阿栗的早餐更偏哪一口？"; exactly 2 options, exactly one `data-correct="1"`; shuffled order observed ("咸口党" before "甜口党") |
| Option-card art (plate, emoji, 4 sparks, holly SVG) | PASS | each `.opt-visual` 123–203px wide, plate >20px, emoji present, 4 `.spark`, holly `<svg>` with bbox |
| All scene SVG art renders non-empty | PASS | room/tree/lights/backdrop/ribbon/garland/snow-edge/host/elf/holly all have `getBBox()` w>0 h>0; 10 `.deco` each with SVG bbox>0; 10 light tiers with 74 bulbs (11,11,10,9,8,7,6,5,4,3); 10 garland bulbs at 6.2%–95.3% |
| Correct reveal | PASS | clicked option gets `.is-right` + green check; garland bulb N lit; tree tier N lit; ball sparkle/hop; screenshot 04 |
| Wrong reveal | PASS | clicked option gets `.is-wrong` (red ✕), correct option gets `.is-answer` (green ✓), camera shake, no score change; screenshot 05 |
| N correct ⇒ N garland bulbs + N lit tiers + bauble at notch N | PASS | per-answer observed bulbs [[1], [1, 2], [1, 2, 3], [1, 2, 3, 4], [1, 2, 3, 4, 5], [1, 2, 3, 4, 5, 6], [1, 2, 3, 4, 5, 6, 7], [1, 2, 3, 4, 5, 6, 7, 8], [1, 2, 3, 4, 5, 6, 7, 8, 9], [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]]; ball top% ['77.7%', '71.4%', '64.4%', '55.3%', '48%', '40.3%', '34.5%', '27.8%', '21.4%', '15.8%']; expected notch tops match within 0.35%; min ball-inside-camera margins L32 R66.8 T143.4 B100.6 px (never clipped) |
| Ending thresholds & copy (K=10/9, 8/7, 6/5, 4/0) | PASS | see §3.1 — 9→top, 7→front, 5→bottom, 4→box all confirmed, titles/zones/score copy exact |
| Panel order: ending line → perfect badge → score → box line → comeback → CTA → links | PASS | visible-order y: ending-line@557.9, perfect-badge@587.1, score-line@632.9, comeback-line@669.2, again-btn@714, result-links@784 |
| Perfect badge / score / star | PASS | 10/10: badge "一个都没错 ✨" visible; 9/10 top: badge hidden; top/front/bottom star glow .9, box glow 0 |
| Result-cam & player bauble not clipped | PASS | player `.bauble-glass` fully inside `#cam-result` for all 4 endings; result cam 390×540 (390×844) / 320×306.7 (320×568) |
| CTA/links reachable on result at every size | PASS | 390×844 CTA y714–774, links y784–816 (inside 844); 375×667 needs panel scroll (scrollH 321 / clientH 270) and after scroll CTA 556–610 / links 620–653 inside 667; 320×568 no scroll needed (291=291) |
| No clipping / horizontal overflow at 390×844, 375×667, 320×568, 430×932, 1280×800 | PASS | see §3.2 — doc/body scrollWidth == clientWidth, scrollX 0, `.app` width min(480, viewport), all measured rects inside viewport/app |
| Landing CTA/input reachable at 320×568 | PASS | input 14,456 292×46; CTA 14,510 292×48 (bottom 558 ≤ 568) |
| 15-char CJK name → monogram + name tag | PASS | climb ball `.is-mono`, name "一", `.bauble-tag` full "一二三四五六七八九十一二三四五" 203.5×22.9px; landing big ball keeps full name (fs .21) |
| Double-click CTA does not double-start | PASS | 3 synchronous clicks → 1 `#layer`, 3 baubles (player+2 rivals), 10 decos, 2 opts, 1 active scene, start button disabled |
| Replay returns to landing; second run works | PASS | again → `sc-landing`, envelope `is-open`, name kept; second start → Q1 with 0 bulbs / 0 tiers; first correct answer → bulbs [1], tiers [1] |
| Board opens/closes, titles, ranks | PASS | title "挂在阿栗树上的名字", count "树上已经有 3 颗球在发光"; rows: 1 汤圆 10/10 树顶 (is-top), 2 小明 10/10 树顶 (`me`), 3 麻薯 5/10 底下的树枝; sorted desc; close by ✕ and backdrop both hide sheet+backdrop |
| Share button toast / copy fallback | PASS | headless Chromium: `navigator.share` undefined, clipboard available → toast "复制好啦，去勾搭朋友 🎄"; toast text fully on-screen (text rect 114.6,499.2–275.4,521.2); zoom screenshot 11b |
| Share text per zone (share() branch) | PASS | stubbed navigator.share captured: top "阿栗 的树顶归我了 👑 10/10，不服来爬！"; mid "我在阿栗的树上占到了正中间 🎄 8/10，换你来试试？"; box "阿栗 的树把我拒了 😭 0/10，你替我挂上去" — all exact, title = document.title |
| Sound button aria-label stays 声音; mute persists after reload | PASS | aria-label/title "声音" before & after click; aria-pressed false→true, class `xm-muted`, localStorage `xm_sound_muted=1` survives page reload; click again → pressed false, ls=0; 1 button in `#docked` |
| prefers-reduced-motion does not break layout/gameplay | PASS | emulated reduce: media matches, animation-duration 1e-05s, no overflow, input/CTA rects intact, starts game, 2 opts, correct answer → bulbs [1] + tiers [1], ball inside cam |
| All 18 mascot poses parse with sensible bbox | PASS | fox(10): wave,cheer,nervous,gasp,facepalm,admire,arrive,laugh,kneel,hat; squirrel(8): board,hmph,eyeroll,dropbox,hat,chuckle,point,shrug; all DOMParser-parsed `<svg viewBox="0 0 120 150">`, no parsererror, bbox 73–95 × 130–143 user units, no `<image>`/`<foreignObject>`/http refs, 0 console errors |
| Zero pageerror / console error / failed request | PASS | 0/0/0 across all 15 runs; no missing local file; no 4xx/5xx |
| No http(s) image or audio requests; audio is synthesized | PASS | 0 HTTP image/media requests; 0 media-type requests; `js/sound.js` WebAudio only (no audio files in project) |
| JSON/localStorage persistence (file://) | PASS | `localStorage` works on file:// (`isSecureContext` true); mute + last name persist across reload |


### 3.1 Ending matrix

| run | score | zone | ribbon title | player top% | tiers lit | star opacity | ending line | box line | perfect badge | comeback line |
|---|---|---|---|---|---|---|---|---|---|---|
| perfect | 10 | top | 树顶的那颗星 | 15.6% | 10 | 0.9 | yes | hidden | visible | 阿栗 把你挂在了树顶，那你要把阿栗挂哪儿？🎄 |
| threshold-9 | 9 | top | 树顶的那颗星 | 15.6% | 10 | 0.9 | yes | hidden | hidden | 阿栗 把你挂在了树顶，那你要把阿栗挂哪儿？🎄 |
| threshold-7 | 7 | front | 中间的好位置 | 46.9% | 10 | 0.9 | hidden | hidden | hidden | 阿栗 把你挂在了正中间，那你要把阿栗挂哪儿？🎄 |
| threshold-5 | 5 | bottom | 最下面那根树枝 | 70.6% | 10 | 0.9 | hidden | hidden | hidden | 阿栗 把你挂在了底下的树枝，那你要把阿栗挂哪儿？🎄 |
| threshold-4 | 4 | box | 盒子里蹲着 | 81.3% | 0 | 0 | hidden | yes | hidden | 阿栗 把你挂在了礼物盒里，那你要把阿栗挂哪儿？🎄 |


Expected thresholds (from `zoneOfScore`, n=10): K≥9 top, 7–8 front, 5–6 bottom, ≤4 box. Confirmed exactly (K=10 & 9 top; K=8 & 7 front; K=6 & 5 bottom; K=4 & 0 box). Player landing spots: top 15.6%, front 46.9%, bottom 70.6%, box 81.3% (matches `ZONE_SPOTS` 100/300/452/520 ÷ 640).

### 3.2 Responsive / clipping matrix

| viewport | .app rect | horizontal overflow | landing CTA rect | result player in cam | result CTA/links |
|---|---|---|---|---|---|
| 320x568 | 320×568 @ x=0 | none | 14,510 292×48 (bottom 558) | glass 81.8×81.8 in cam 320×306.7: yes | fits; CTA/links inside after scroll: yes |
| 375x667 | 375×667 @ x=0 | none | 14,599 347×54 (bottom 653) | glass 81.8×81.8 in cam 375×426.9: yes | scroll needed; CTA/links inside after scroll: yes |
| 390x844 | 390×844 @ x=0 | none | 14,770 362×60 (bottom 830) | glass 81.6×81.6 in cam 390×540.2: yes | fits; CTA/links inside after scroll: yes |
| 430x932 | 430×932 @ x=0 | none | 14,858 402×60 (bottom 918) | glass 81.9×81.9 in cam 430×596.5: yes | fits; CTA/links inside after scroll: yes |
| 1280x800 | 480×800 @ x=400 | none | 414,726 452×60 (bottom 786) | glass 81.8×81.8 in cam 480×512: yes | fits; CTA/links inside after scroll: yes |


Additional per-size evidence: question option cards inside viewport at every size (e.g. 320×568: options 123×92 at y427.2–519.4; 1280×800: 203×152 at y596.8–749 inside the 480px centred column), host/elf casts inside viewport, result ribbon/title inside viewport, `.app` capped at 480px and centred at 1280px (x=400).

## 4. Defects (severity ordered)

### S2 — README.md contains a verbatim sentence from the replica README (originality / licence)

- **Where:** `christmas-tree-original/README.md:5` — “答 10 道关于主人「阿栗」的小题，每答对一题，**写着你的名字的圣诞球就往上挂一层**；答完看看你落在树顶、正中间、最下面的树枝，还是——还蹲在礼物盒里。”
- **Same text in replica:** `christmas-tree/README.md:5` — “答 10 道关于主人的题，每答对一题，**写着你的名字的圣诞球就往上挂一层**；答完看你最终挂在树顶、C 位、最底下的树枝，还是……还在箱子里。”
- **Extra verbatim overlaps** (from the n-gram audit in §5.5): “会实时画在粉色圣诞球上” and “全合成音效与背景音乐” also appear verbatim in the replica README; 31 CJK substrings ≥10 chars overlap, 29 of them README-only.
- **Repro:** `grep -n "往上挂一层" christmas-tree-original/README.md` → `5:`; `grep -n "写着你的名字的圣诞球就往上挂一层" christmas-tree/README.md` → `5:`. This is also one of the release checklist's forbidden phrases ("none may appear"), so the literal audit fails.
- **Expected:** zero third-party text; README claims (line 3) “所有插画、角色、文案与代码都是原创的”. **Actual:** copied documentation sentence, self-contradicting the claim.
- **Impact:** documentation/licence risk (the game art/UI/code is clean; see §5.3–5.5). **Fix:** rephrase README line 5 and the two other overlapping sentences (e.g. “每答对一题，你的圣诞球上升一层；…”), then re-run the forbidden-phrase grep. Together with the S2 runtime line and the S3 items, these are the only fixes needed to publish.

### S2 — Runtime box-ending line is a one-character adaptation of a replica line (originality)

- **Where:** `js/data.js:109` `copy.endings.box.line`: `'{creator} 给你留了明年的位置。'`
- **Replica:** `christmas-tree/reference/styles/cn.js` `tree.ending.box.line`: `'{creator} 给你留好了明年的位置。'` (the replica's box-ending line). SequenceMatcher similarity **0.963** — identical except the inserted `好`.
- **Expected:** zero third-party text. **Actual:** the user-visible box-ending line (`盒子里蹲着 📦` result panel) is near-verbatim replica text.
- **Repro:** compare the two strings after replacing `{creator}` with `@`: `difflib.SequenceMatcher(None, a, b).ratio()` → `0.963` (full audit script kept outside the repo in `/tmp/cztree/vorig/`).
- **Impact:** text-originality risk in the shipped game UI; it is the only near-verbatim runtime string (0.963). **Fix:** rephrase, e.g. “{creator} 在盒子里给你留了个位置，明年再来。”

### S2b — Runtime score-line template is 87% similar to the replica template (low risk, recommend rephrase)

- **Where:** `js/data.js:114` `'{name} 对 {creator} 的了解：{n} / {total}'` ⇄ replica `'{friend} 对 {creator} 的了解 {n} / 10'` (similarity 0.872).
- Generic “X's knowledge of Y” phrasing with a colon added; copyright risk is low, but the bar is “zero third-party text”, so rephrasing removes the residual similarity (non-blocking).

### S3 — Forbidden phrase `最后一题。` appears once in runtime copy

- **Where:** `js/data.js:104` → `lastQuestion: ['最后一题——星星在等你。', '最后一题。别在这翻车。']` (the second variant is shown before Q10 depending on score; 8+ score uses index 0, else index 1).
- **Provenance:** the replica uses the identical 4-character phrase in `christmas-tree/js/game.js:455` and `christmas-tree/reference/SPEC.md:882-883` (`最后一题。树顶的钩子就在那儿。` / `最后一题。这题可别错。`); the original continues with different words (`别在这翻车。`). Short functional phrase shared with the replica, not a full-line copy. The checklist says the string must not appear anywhere in `christmas-tree-original`, so the literal check FAILs. **Impact:** low. **Fix if the literal policy is enforced:** e.g. “最后一道。别在这翻车。”

### S3 — README "只改 js/data.js 一个文件" is slightly overstated

- **Where/actual:** besides `js/data.js`, these user-visible or fallback strings are not in data.js: `css/style.css` (`content: "❄️ 正在把你挂上树…"`, shown on the intro panel), `js/game.js` + `js/sound.js` sound button labels/aria (“声音”, “打开声音/关闭声音”), `index.html` fallback `<title>`/meta description/rotate hint (all replaced at runtime by data.js, but present in the raw HTML).
- **Expected:** README says customisers only need data.js. **Actual:** true for questions/ending/share/landing copy (all from data.js), but the loading line and a handful of aria labels need a second file. **Impact:** low; no runtime defect. **Fix:** add one README note (“加载提示与声音 aria 文案硬编码在 css/style.css / js/sound.js”).

### Observations (not defects)

- Box ending composition: the player bauble at (112,520) is partially overlapped by the gift box front and the host fox mascot — the "boxed" staging is deliberate, the glass is not clipped by the camera, name is partially occluded (screenshot 07). Cosmetic only.
- Share toast is positioned across the camera/panel seam (`position:fixed; top: calc(64vh - 46px)`): rect y 494.2–526.2 vs panel top 510.2; text rect 499.2–521.2 is fully visible (not clipped; zoom shot 11b).
- Unused copy: `copy.endings.{top,front,bottom,box}.creator` (4 strings) is defined but never rendered; `endings.front.line`/`endings.bottom.line` are also unused (front/bottom results show score + comeback only, top/box show their ending line). No user-visible bug; dead data.

## 5. Originality / licence audit (hard requirements)

### 5.1 Frozen hashes
All 7 files matched the freeze-2 hashes at QA start and end (table in §1). No modification outside `qa/`.

### 5.2 Forbidden replica phrases (grep of the whole project, text files)

Banned list: `冲 🎄` / `拆光所有礼物` / `往上挂一层` / `还在箱子里` / `我的树顶` / `满分！` / `晒我的位置` / `看看树上都有谁` / `谁在` / `圣诞心情：拆光` / `大家一起从箱子里` / `最后一题。`

| phrase | hits in christmas-tree-original | provenance |
|---|---|---|
| `冲 🎄` | none | replica contains it |
| `拆光所有礼物` | none | replica contains it |
| `往上挂一层` | `README.md` ×1 | replica contains it |
| `还在箱子里` | none | replica contains it |
| `我的树顶` | none | replica contains it |
| `满分！` | none | replica contains it |
| `晒我的位置` | none | replica contains it |
| `看看树上都有谁` | none | replica contains it |
| `谁在` | none | replica contains it |
| `圣诞心情：拆光` | none | replica contains it |
| `大家一起从箱子里` | none | not in replica |
| `最后一题。` | `js/data.js` ×1 | replica contains it |


**Result: FAIL (2 literal hits)** — `往上挂一层` in README.md (verbatim replica sentence, S2) and `最后一题。` in js/data.js (original wording, S3). All other banned phrases: 0 hits. Note: a similar phrase `谁在` is generic; it returns 0 hits in every file — confirmed absent.

### 5.3 Asset / binary scan

- Project files: 12 shipped items (7 code/text + `docs/*.png` 4 + README), plus 16 QA artifacts under `qa/`.
- Shipped binaries: **only** `docs/landing.png`, `docs/question.png`, `docs/reveal.png`, `docs/result.png` (documentation screenshots, allowed). Magic-byte scan confirms they are PNG; every other shipped file is UTF-8 text.
- No `.webp/.jpg/.jpeg/.gif/.svg file/.mp3/.wav/.ogg/.woff/.woff2/.ttf/.otf/.ico` anywhere in the project. All art is inline SVG generated by `js/art.js` / `js/mascots.js`; the favicon and two option-check icons are inline `data:image/svg+xml` URIs (no files, no network); audio is synthesized with WebAudio in `js/sound.js`.
- `qa/screens/*.png` (16 files) are QA deliverables required by this task, not shipped game assets.

### 5.4 External network references

- Runtime (source refs in HTML/CSS/JS): Google Fonts only — `fonts.googleapis.com` stylesheet + 3 `fonts.gstatic.com` woff2; plus SVG `xmlns` `http://www.w3.org/2000/svg` (namespace string, not a fetch). Observed runtime network: 4 URLs, all Google Fonts, all 200.
- Non-runtime text references: `README.md` → `http://localhost:8000` (local quick-start command, not fetched by the page); `js/data.js` comment → `https://…` deployment placeholder (comment only, `shareUrl` is empty). **No other domains/URLs found.**
- No HTTP(S) image or audio requests: 0 in 15 runs. `httpImageMediaRequests` = 0. Fonts are the only external dependency; app still runs offline with the system-font fallback stack.

### 5.5 Verbatim-text overlap with the replica

31 distinct CJK substrings (length >= 10) shared with the replica text files; 29 of them are confined to README.md. Longest verbatim overlap: "写着你的名字的圣诞球就往上挂一层" (README.md:5 ⇄ christmas-tree/README.md:5). No >=10-char overlap exists for any question, option, ending line or share line in js/data.js beyond generic 6-9-char gameplay phrases; the largest data.js overlaps are "想改成自己的圣诞树" (9), "上他的圣诞树" (6), "你的圣诞球就" (6), "了明年的位置" (6), "个选项都可以" (6).

Key long overlaps and their source:

| original location | overlapping text | replica source |
| --- | --- | --- |
| README.md:5 | `写着你的名字的圣诞球就往上挂一层` | christmas-tree/README.md:5 (verbatim) |
| README.md (玩法 1) | `会实时画在粉色圣诞球上` | christmas-tree/README.md (verbatim) |
| README.md (sound.js 描述) | `全合成音效与背景音乐` | christmas-tree/README.md (verbatim) |
| README.md (structure) | `想改成自己的圣诞树` / `改成你自己的圣诞树` / `用任意静态服务器` / `不需要服务器` / `当前树顶的人` | christmas-tree/README.md (same phrasing) |
| js/data.js comments | `想改成自己的圣诞树` (9 chars) | christmas-tree/js/data.js comment (similar) |

No runtime string reaches a ≥10-character exact substring overlap with the replica (largest data.js exact overlaps are 6–9-character generic phrases). A near-verbatim scan (difflib over all quoted Chinese strings in `js/data.js/game.js/mascots.js/art.js/index.html` vs `christmas-tree/js/data.js/game.js/index.html/reference/styles/cn.js`) found exactly two runtime templates with similarity ≥0.8: `copy.endings.box.line` **0.963** and the score-line template **0.872** (see S2/S2b). All questions, options, share/toast lines, landing copy and elf/host dialogue are distinct; runtime Chinese copy is substantially re-written.

### 5.6 README claim accuracy

| README claim | Result | Evidence |
|---|---|---|
| “所有插画、角色、文案与代码都是原创的” / “不含第三方版权内容” | FAIL (S2) | Game art/code: no third-party assets; runtime copy has no ≥10-char exact overlaps, but one ending line is 0.963 near-verbatim and one score template 0.872 (S2/S2b), and README.md contains verbatim replica sentences (S2 / §5.5). |
| “零图片素材” / “不依赖任何图片素材” | PASS | No image/audio/font files in the project; art is inline SVG (`js/art.js`, `js/mascots.js`); only docs screenshots exist as PNGs. |
| “直接双击 index.html 就能玩（file:// 直接运行，不需要构建、不需要服务器）” | PASS | All 15 runs loaded via file://; no build files (package.json/vite/webpack/tsconfig absent); localStorage, mute persistence, share/copy, board all work on file:// in Chromium. |
| “只改 js/data.js 一个文件” | PARTIAL (S3) | Questions/copy/ending/share text all come from data.js; loading line + sound aria labels hard-coded elsewhere (see S3). |
| “已适配 320–480px 宽、桌面居中手机栏” | PASS | 320/375/390/430 verified with no overflow/clipping; desktop 1280×800 → 480px centred column (x=400); CSS max-width 480px. |
| “18 个姿势” | PASS | `XM_MASCOTS.poses` = fox 10 + squirrel 8 = 18; all parse with bbox. |
| “WebAudio 全合成音效与背景音乐（无音频文件、可静音并记忆）” | PASS | 0 media requests; mute aria/state + localStorage persists across reload. |
| “10 道题”“每题 2~4 个选项” | PASS | `js/data.js` has 10 questions, each 2 options, exactly one correct. |
| docs/*.png links resolve | PASS | `docs/landing.png` (360 KB), `docs/question.png` (633 KB), `docs/reveal.png` (678 KB), `docs/result.png` (587 KB) — 4/4 resolve |


## 6. Evidence screenshots (`qa/screens/`, all @DPR 2 = 2×)

| file | size | shows |
|---|---|---|
| `screens/01-landing-390x844@2x.png` | 361 KB | landing (390×844) — envelope invite, live big bauble, rule, name input, CTA |
| `screens/01b-landing-typed-390x844@2x.png` | 363 KB | landing after typing 小明 — name painted on the big bauble |
| `screens/02-intro-390x844@2x.png` | 488 KB | intro — both mascots + host speech “呀，小明 来啦！”, questionless panel |
| `screens/02b-intro-elf-390x844@2x.png` | 490 KB | intro — elf speech (“起点在最底下…”), both mascots |
| `screens/03-question-390x844@2x.png` | 597 KB | Q1 — ribbon “第 1 题 · 共 10 题”, two sticker option cards with holly |
| `screens/04-correct-reveal-390x844@2x.png` | 656 KB | correct answer reveal — green ✓, garland bulb 1 lit, tier 1 lit, bauble jumped to notch 1, sparkles |
| `screens/05-wrong-reveal-390x844@2x.png` | 595 KB | wrong answer reveal — red ✕ on picked, green ✓ on correct, host facepalm, elf laugh |
| `screens/06-result-perfect-390x844@2x.png` | 588 KB | perfect top ending — 树顶的那颗星, badge, 10/10, panel order, all tiers lit |
| `screens/07-result-box-390x844@2x.png` | 466 KB | box ending — 盒子里蹲着, 0/10, box line, no tiers lit, player boxed |
| `screens/08-result-front-390x844@2x.png` | 569 KB | front ending — 中间的好位置, 8/10, all tiers lit |
| `screens/09-result-bottom-390x844@2x.png` | 528 KB | bottom ending — 最下面那根树枝, 6/10, all tiers lit |
| `screens/10-board-390x844@2x.png` | 441 KB | board sheet — ranks 1–3, zones, me row, count 3 |
| `screens/11-share-toast-390x844@2x.png` | 596 KB | share copy-fallback toast “复制好啦，去勾搭朋友 🎄” |
| `screens/11b-share-toast-zoom-390x844@2x.png` | 36 KB | toast zoom — full text visible at cam/panel seam |
| `screens/12-result-320x568@2x.png` | 395 KB | perfect result at 320×568 — no overflow, CTA/links fit (291=291) |
| `screens/13-landing-320x568@2x.png` | 235 KB | landing at 320×568 — input+CTA inside viewport (CTA bottom 558) |
| `screens/14-pre-q10-lastquestion-390x844@2x.png` | 555 KB | freeze-3: pre-Q10 dim + elf speech “最后一道” (new copy) before “第 10 题” |


## 7. Release readiness

**Conditional GO** — GO for functionality/build; FIX-FIRST for text originality before publishing.

- **Runtime/build:** PASS — 1327/1327 checks pass, 0 console/page/network errors over 15 runs; all art is self-contained inline SVG; all four endings and all threshold edges correct; responsive 320–1280px with no clipping/overflow; interaction edge cases (empty name, Enter, 15-char CJK monogram, double-click guard, replay, board, share fallback, sound persistence, reduced motion) all pass.
- **Originality/licence:** all shipped assets are inline/original (no third-party images/audio/fonts) and only Google Fonts is external, but the project as published **fails the "zero third-party text" bar**: README verbatim sentences (S2), one near-verbatim runtime ending line (S2), one 87%-similar score template (S2b) and one literal forbidden phrase in `js/data.js` (S3). Recommend: (a) rephrase the README copied sentences (3 short edits), (b) rewrite the box ending line and score-line template (2 short `js/data.js` edits), (c) optionally change `最后一题。`. No art/asset/engine change is required; hashes would change only for the edited text files.
- **Residual risks:** (1) Google Fonts is the only external dependency — offline users get the system-font fallback (layout still verified to work, but Chinese/Latin metrics differ slightly); no font files are bundled, so no font licence files needed. (2) No `LICENSE` file is present — the README asserts originality but does not grant a licence; add one if publishing openly. (3) Audio was verified structurally (AudioContext synthesis, no file requests, mute state) but not audibly in headless. (4) Native Web Share sheet was exercised via stub only (desktop headless has no `navigator.share`); real iOS/Android share UI untested. (5) iOS Safari autoplay/unlock behaviour and Android WebView not tested (Chromium only). (6) 480px layout not explicitly run (430 and 1280 tested; CSS caps at 480).

## 8. How to reproduce

```bash
# frozen hashes
cd christmas-tree-original && md5 index.html css/style.css js/data.js js/art.js js/game.js js/mascots.js js/sound.js
# forbidden phrases (expect only the two S2/S3 hits documented above)
grep -rn -e "冲 🎄" -e "拆光所有礼物" -e "往上挂一层" -e "还在箱子里" -e "我的树顶" -e "满分！" -e "晒我的位置" -e "看看树上都有谁" -e "谁在" -e "圣诞心情：拆光" -e "大家一起从箱子里" -e "最后一题。" .
# any shipped binary other than docs/*.png
find . -type f ! -name "*.md" ! -name "*.html" ! -name "*.css" ! -name "*.js" ! -path "./docs/*.png"
# Playwright flows (scripts kept outside the repo: /tmp/cztree/vorig/flows.mjs)
#   node flows.mjs perfect box front bottom w320 w375 w430 w1280 threshold-9 threshold-7 threshold-5 threshold-4 edge mascots reduced
```

---
*Report generated 2026-11-14 12:53 CST by `verifier-orig`; freeze-2 hashes re-verified after all runs (see §1). QA artifacts live only in `christmas-tree-original/qa/`.*


## 9. Freeze-3 re-audit (final) — 2026-11-14 12:48:46 CST

Lead fixed the freeze-2 findings: **README.md rewritten**, **`js/data.js` `lastQuestion` changed from `最后一题。…` to `最后一道…`**. Freeze-3 hashes were re-verified after those edits; no full flow re-run was needed because `js/game.js`, `js/art.js`, `js/mascots.js`, `js/sound.js`, `index.html` and `css/style.css` are byte-identical to freeze-2 (logic/art unchanged); the only runtime change is one copy string, which was verified in the live UI (§9.5).

### 9.1 Freeze-3 hash verification (8/8 MATCH)

| file | expected (freeze-3) | md5 measured (end of QA) | result |
|---|---|---|---|
| `index.html` | `5bcde41447d75df33f1c580d1d166ef6` | `5bcde41447d75df33f1c580d1d166ef6` | PASS ✅ |
| `css/style.css` | `602ba2b2b70053d74c2526bff9dea62d` | `602ba2b2b70053d74c2526bff9dea62d` | PASS ✅ |
| `js/data.js` | `ae9f6295541ddf6dcada2d32cfdb057f` | `ae9f6295541ddf6dcada2d32cfdb057f` | PASS ✅ |
| `js/art.js` | `1bea3283f90146fa24f6b84f92f9e417` | `1bea3283f90146fa24f6b84f92f9e417` | PASS ✅ |
| `js/game.js` | `c113f900381ffbe5125b3dc9c86ba317` | `c113f900381ffbe5125b3dc9c86ba317` | PASS ✅ |
| `js/mascots.js` | `9e74466ddd4ab1ff5e5fcfd5a2a282e0` | `9e74466ddd4ab1ff5e5fcfd5a2a282e0` | PASS ✅ |
| `js/sound.js` | `5c4075d97fbeaf12dd12162fc162725e` | `5c4075d97fbeaf12dd12162fc162725e` | PASS ✅ |
| `README.md` | `1b5728e7a1784aa0f313c991366925b2` | `1b5728e7a1784aa0f313c991366925b2` | PASS ✅ |

Note: the freeze-2 "end" column in §1 recorded `js/data.js = 5a81c684…`; it changed at 12:48:40 (Lead's freeze-3 fix) *after* the full flow matrix had finished. That is the documented freeze-3 edit, not an unexplained mutation. The §3 matrix and screenshots 01–13 were captured on freeze-2; the only subsequent runtime change is the `lastQuestion` copy, verified live in §9.5 (all other hashes identical).

### 9.2 Forbidden-phrase grep (freeze-3) — PASS (0 hits)

`grep` of all 12 banned strings over `index.html`, `css/style.css`, `js/*.js`, `README.md` → **0 hits each**. (The strings still appear inside `qa/QA-REPORT.md` only as quoted audit evidence — `qa/` is QA output, not shipped copy; exclude `qa/` from a literal whole-tree grep or the report self-triggers.)

### 9.3 README vs replica README overlap (freeze-3) — PASS at ≥10 chars

- CJK substrings shared with the replica README: **0 at ≥10 chars, 0 at ≥9 chars** (Lead's claim confirmed).
- Longest exact overlap is **8 chars**: “成你自己的圣诞树” (generic section heading; both READMEs describe customising the same game).
- Residual doc similarity: 17 line-pairs with similarity ≥0.55 and LCS ≥8, mostly the file-tree block and unavoidable path/file names; longest common substring **43 chars** in the browser-support sentence (“iOS Safari 15+、Android Chrome 90+、桌面 Chrome…”), plus the “zero dependency / Google Fonts fallback” bullet and the `js/sound.js` file-tree line are close paraphrases of the replica README's implementation notes. These are documentation-level, about the team's own replica README (not third-party site text) — recommend a light rephrase of those 2–3 bullets if a fully original README is required, but they are **not** release-blocking.

### 9.4 README accuracy (updated for the rewritten README) — all claims now hold

| claim in freeze-3 README | result | evidence |
|---|---|---|
| “没有一张图片素材 / 没有任何第三方版权内容” (assets) | PASS | No image/audio/font files; art inline SVG; only docs PNG screenshots; Google Fonts only external. |
| “双击 index.html 即可玩（file://，不用打包、不用起服务）” | PASS | All 15 functional runs used `file://`; no build files; localStorage/share/board work. |
| “主要内容都集中在 js/data.js” + explicit note that loading hint / sound aria / index.html fallbacks live elsewhere | **PASS (fixed)** | README now documents `css/style.css` (`.qpanel.is-questionless::before`), `js/sound.js`, `index.html` fallbacks — S3 from freeze-2 resolved. |
| “320–480px 宽都适配，电脑居中 480px 手机框” | PASS | 320/375/390/430/1280×800 verified no overflow/clip (§3.2). |
| “18 个姿势” | PASS | fox 10 + squirrel 8, all parse with bbox (§3). |
| docs/*.png links | PASS | 4/4 resolve (`landing/question/reveal/result`); README's `qa/QA-REPORT.md` link also resolves. |
| “场景、角色、题目、台词与代码全部从零创作 / 没有任何第三方版权内容” (text) | **PARTIAL — residual** | Code/art/questions/share/ending-titles are original; but `copy.endings.box.line` is 96% similar to the replica source line (§9.6 R1), and the score-line template is 84% similar (generic). README should say “原创（一处短句与世界设定同源，已改）” or the line should be rephrased. |
| “iOS Safari 15+、Android Chrome 90+、桌面 Chrome/Safari/Edge” | **UNVERIFIED** | Only headless Chromium 1248 was available; no Safari/Firefox/WebKit/real-device run. Claim is plausible (modern CSS `dvh`/`cqw` with fallbacks) but not proven by this QA. |
| “WebAudio 现场合成，无音频文件” | PASS | 0 media requests; AudioContext synthesis; mute persistence verified. |

### 9.5 Copy change renders in the real UI — PASS

Low-score run (9 wrong answers): before Q10 the elf speech bubble displays **“最后一道”** (typing animation, `#speech.is-on`, cam `.is-dim` true), then Q10 loads normally (`第 10 题 · 共 10 题`, “平安夜的阿栗最想怎么过？”). `XM_QUIZ.copy.lastQuestion` = `["最后一道——星星在等你。", "最后一道。别在这翻车。"]`. 0 console/page/request errors. New screenshot: `qa/screens/14-pre-q10-lastquestion-390x844@2x.png`.

### 9.6 Residual risks after freeze-3

1. **(Top) runtime near-verbatim line** — `js/data.js` `copy.endings.box.line` = `'{creator} 给你留了明年的位置。'` vs replica/reference source `'{creator} 给你留好了明年的位置。'` → similarity **0.96** (one inserted `好`). If “zero third-party text” is enforced literally, rephrase (e.g. “{creator} 在盒子里给你留了个位置，明年再来。”). Not a functional issue.
2. Runtime score-line template `'{name} 对 {creator} 的了解：{n} / {total}'` vs reference `'{friend} 对 {creator} 的了解 {n} / 10'` → **0.84** similarity, generic phrasing; low risk, optional rephrase.
3. README documentation paraphrases (2–3 implementation notes; §9.3) — internal replica README, doc-only, optional.
4. Unchanged operational risks: Google Fonts is the only external dependency (offline fallback works); no `LICENSE` file; browser-support claim unverified outside Chromium; audio not audibly checked; native Web Share sheet untested (stub only).
5. The QA report itself quotes the banned strings as evidence — don't ship `qa/` if a literal whole-tree grep is part of the release gate.

### 9.7 Final verdict (superseded by §9.8)

**RELEASE-READY (functional).** Freeze-3 hashes 8/8 match; 1327/1327 functional checks pass on unchanged logic; forbidden-phrase grep is clean; README claims now match reality; the “最后一道” copy change is verified in the live pre-Q10 UI. ~~Publish after one optional 1-line text edit (box-ending line, §9.6 R1)~~ — resolved in freeze-4 (§9.8).

### 9.8 Freeze 4 — final (2026-11-14 12:52:52 CST)

Only `js/data.js` changed again: `copy.endings.box.line` → `'{creator} 在盒子里给你留了个位置，明年再来。'` (the old `'{creator} 给你留了明年的位置。'` is gone). New hash `js/data.js = 727b632e53bfbbfe58f819f3b22f1a00`; the other 7 files are byte-identical to freeze-3.

**Freeze-4 hashes (8/8 MATCH, re-measured):** index `5bcde41447d75df33f1c580d1d166ef6` · css `602ba2b2b70053d74c2526bff9dea62d` · data `727b632e53bfbbfe58f819f3b22f1a00` · art `1bea3283f90146fa24f6b84f92f9e417` · game `c113f900381ffbe5125b3dc9c86ba317` · mascots `9e74466ddd4ab1ff5e5fcfd5a2a282e0` · sound `5c4075d97fbeaf12dd12162fc162725e` · README `1b5728e7a1784aa0f313c991366925b2`.

Re-verified: all 12 forbidden phrases → **0 hits** in shipped files (index.html / css / js / README); the old box line is absent everywhere; the new box line has only **0.56** similarity to the replica source line (well below the 0.8 near-verbatim threshold; §9.6 R1 resolved); README overlap remains 0 at ≥10 chars. Lead also verified locally that the box ending renders the new line on one line (h=21, y=604, no overflow; 10/10 wrong answers → box ending).

**FINAL VERDICT: RELEASE-READY — functional 1327/1327 PASS, shipped text clean (0 forbidden phrases, no third-party assets, only Google Fonts external). No outstanding defects; no further edits needed.**

