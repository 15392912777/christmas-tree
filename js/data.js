/**
 * 圣诞树默契问答 · 原创版 —— 题库 / 人设 / 全部文案
 * ---------------------------------------------------------------------------
 * 想改成自己的圣诞树，只改这一个文件：
 *   creator / pronouns / mood / top / others / questions / copy
 * 其余代码不需要动。每题 2~4 个选项都可以，correct:true 的那个是标准答案；
 * emoji 与 tone（berry|mint|gold|sky|cocoa|plum|moss|peach）决定选项卡的插画风格。
 * 文案里可以用这些占位符：
 *   {creator} 主人名  {them} {their} 主人的代词  {name} 玩家名
 *   {n} 数量  {k} 当前第几题  {total} 总题数  {mood} 今日心情  {top} 树顶的人
 *   {zoneName} 结局分区名
 * ---------------------------------------------------------------------------
 */
window.XM_QUIZ = {
  creator: '阿栗',
  pronouns: { them: '他', their: '他的' },
  mood: '刚出炉的烤栗子 🌰',
  top: '汤圆',
  others: [
    { name: '汤圆', score: 10 },
    { name: '麻薯', score: 5 }
  ],
  // 部署到线上后填你的分享链接（https://…）；留空则分享文案不带链接
  shareUrl: 'https://15392912777.github.io/christmas-tree/',

  // ── 10 道题：都是关于主人日常的小毛病，朋友可以放心大胆地猜 ────────────────
  questions: [
    { id: 'q1', q: '阿栗的早餐更偏哪一口？', options: [
      { text: '甜口党 🥞', correct: true, emoji: '🥞', tone: 'gold' },
      { text: '咸口党 🍳', correct: false, emoji: '🍳', tone: 'moss' }
    ] },
    { id: 'q2', q: '闹钟响了，阿栗的第一反应是？', options: [
      { text: '秒速弹起来 ☀️', correct: false, emoji: '☀️', tone: 'peach' },
      { text: '按掉再赖三次 😴', correct: true, emoji: '😴', tone: 'plum' }
    ] },
    { id: 'q3', q: '阿栗点奶茶的固定操作是？', options: [
      { text: '三分糖、去冰 🧋', correct: true, emoji: '🧋', tone: 'cocoa' },
      { text: '全糖加满冰 🧊', correct: false, emoji: '🧊', tone: 'sky' }
    ] },
    { id: 'q4', q: '周末的阿栗大概率在干嘛？', options: [
      { text: '早起去爬山 🌄', correct: false, emoji: '🌄', tone: 'sky' },
      { text: '在家躺一天 🛋️', correct: true, emoji: '🛋️', tone: 'cocoa' }
    ] },
    { id: 'q5', q: 'KTV 里的阿栗是哪一种？', options: [
      { text: '全程霸着麦 🎤', correct: false, emoji: '🎤', tone: 'berry' },
      { text: '安静点歌，副歌才开嗓 🎧', correct: true, emoji: '🎧', tone: 'plum' }
    ] },
    { id: 'q6', q: '阿栗最向往的假期长什么样？', options: [
      { text: '去山里住几天 🏔️', correct: true, emoji: '🏔️', tone: 'moss' },
      { text: '去海边躺几天 🏖️', correct: false, emoji: '🏖️', tone: 'peach' }
    ] },
    { id: 'q7', q: '猫派还是狗派，阿栗站哪边？', options: [
      { text: '狗派 🐶', correct: false, emoji: '🐶', tone: 'gold' },
      { text: '猫派 🐱', correct: true, emoji: '🐱', tone: 'berry' }
    ] },
    { id: 'q8', q: '收到礼物的阿栗，第一件事是？', options: [
      { text: '先拍照再拆 📸', correct: true, emoji: '📸', tone: 'mint' },
      { text: '一秒撕开包装 🎁', correct: false, emoji: '🎁', tone: 'berry' }
    ] },
    { id: 'q9', q: '阿栗的购物车常年是什么状态？', options: [
      { text: '清得干干净净 🧹', correct: false, emoji: '🧹', tone: 'mint' },
      { text: '加满，但不下单 🛒', correct: true, emoji: '🛒', tone: 'cocoa' }
    ] },
    { id: 'q10', q: '平安夜的阿栗最想怎么过？', options: [
      { text: '和朋友吃火锅 🍲', correct: true, emoji: '🍲', tone: 'berry' },
      { text: '一个人看恐怖片 🎬', correct: false, emoji: '🎬', tone: 'plum' }
    ] }
  ],

  // ── 全部界面文案：换一种说法，语气暖一点、皮一点 ────────────────────────
  copy: {
    meta: {
      title: '你有多懂阿栗？🎄 十道题，一路挂上他的圣诞树',
      description: '十道关于阿栗的小题。答得越准，你的圣诞球就挂得越高，看看你能到哪一层 ✨'
    },
    landing: {
      title: '{creator} 的圣诞树还缺你这一颗 🎄',
      sticker: '今日心情：{mood}',
      proofCount: '树上已经有 {n} 颗球在发光 🎄',
      proofTop: '挂在最高处的是 {top} 👑',
      rule: '十道关于{creator}的小题。猜得越准，你的球离{their}星星越近 🎄',
      namePlaceholder: '给你的球取个名字',
      cta: '我也来挂一颗 🎄',
      nameError: '先取个名字吧'
    },
    intro: {
      host: '呀，{name} 来啦！',
      helper: '起点在最底下那只礼物盒。摸清{creator}的底细，才能往上挪。'
    },
    ribbonTag: '第 {k} 题 · 共 {n} 题',
    elf: {
      right: ['哼，算你没白来。', '挪高一格，快点。', '这题你居然会？', '还行，别偷笑。',
        '栗子壳记你一分。', '对就对，安静点。', '往上，别让我催。', '行吧，记你一功。'],
      wrong: ['错。原地待好。', '连{them}都不懂？', '这答案，松鼠摇头。', '我尾巴都替你急。',
        '真的假的啊你？', '别瞎猜，用心点。', '错一次，记一笔。', '勇气很足，答案很偏。']
    },
    host: {
      right: ['嘿嘿，这题归你。', '有点懂我哦。', '这题，你赢了。'],
      wrong: ['不会吧，我们白认识了？', '啊？你确定了解我？', '这题我记你一辈子。'],
      goingUp: '哟，真往上爬了？',
      passed: '{name} 的球被你超了 👀',
      streak: '稳着点，路还长。'
    },
    lastQuestion: ['最后一道——星星在等你。', '最后一道。别在这翻车。'],
    endings: {
      top: { title: '树顶的那颗星 ⭐', line: '站得最高的人，活该被所有人看见。', creator: '这位置，你值得。' },
      front: { title: '中间的好位置 🎄', line: '不上不下，刚好把每个人都看清。', creator: '一抬头就是你。' },
      bottom: { title: '最下面那根树枝 🌿', line: '离礼物最近，也算一种本事。', creator: '挺配你的，别不服。' },
      box: { title: '盒子里蹲着 📦', line: '{creator} 在盒子里给你留了个位置，明年再来。', creator: '明年往上挪一点？' }
    },
    comeback: '{creator} 把你挂在了{zoneName}，那你要把{creator}挂哪儿？🎄',
    zones: { top: '树顶', front: '正中间', bottom: '底下的树枝', box: '礼物盒里' },
    result: {
      score: '{name} 对 {creator} 的了解：{n} / {total}',
      perfect: '一个都没错 ✨',
      cta: '轮到我种树了 🎄',
      share: '看看我挂在哪',
      board: '树上的邻居们'
    },
    board: { title: '挂在{creator}树上的名字', count: '树上已经有 {n} 颗球在发光', close: '收起' },
    share: {
      top: '{creator} 的树顶归我了 👑 {n}/{total}，不服来爬！',
      low: '{creator} 的树把我拒了 😭 {n}/{total}，你替我挂上去',
      mid: '我在{creator}的树上占到了{zoneName} 🎄 {n}/{total}，换你来试试？',
      toast: '复制好啦，去勾搭朋友 🎄',
      fail: '复制没成功，长按文字自己选吧'
    },
    rotate: '竖着玩才看得见星星 📱'
  }
};
