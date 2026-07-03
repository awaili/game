/* Slowpapa portal — catalog, search, filter, render, theme, best-score badges. */
(function () {
  "use strict";

  const GAMES = [
    { id: "2048",        path: "games/01_2048/index.html",       icon: "🔢", name: "2048",      cat: "logic",  tag: "逻辑", desc: "滑动合并数字，挑战 2048 与更高", grad: "linear-gradient(135deg,#f59e0b,#ef4444)" },
    { id: "sudoku",      path: "games/02_sudoku/index.html",      icon: "📝", name: "数独",      cat: "logic",  tag: "数学", desc: "经典 9×9 数独，三档难度",         grad: "linear-gradient(135deg,#38bdf8,#6366f1)" },
    { id: "mine",        path: "games/03_minesweeper/index.html", icon: "💣", name: "扫雷",      cat: "logic",  tag: "推理", desc: "点开安全格，标记隐藏的地雷",     grad: "linear-gradient(135deg,#64748b,#0ea5e9)" },
    { id: "nonogram",    path: "games/04_nonogram/index.html",    icon: "🎨", name: "数织",      cat: "logic",  tag: "绘图", desc: "按行列提示数填出像素画",         grad: "linear-gradient(135deg,#ec4899,#8b5cf6)" },
    { id: "tetris",      path: "games/05_tetris/index.html",      icon: "🧱", name: "俄罗斯方块", cat: "reflex", tag: "反应", desc: "经典方块消除，旋转下落",         grad: "linear-gradient(135deg,#06b6d4,#3b82f6)" },
    { id: "sokoban",     path: "games/06_sokoban/index.html",     icon: "📦", name: "推箱子",    cat: "plan",   tag: "规划", desc: "把所有箱子推到目标点",           grad: "linear-gradient(135deg,#f97316,#f43f5e)" },
    { id: "klotski",     path: "games/07_klotski/index.html",     icon: "🧩", name: "华容道",    cat: "plan",   tag: "古风", desc: "滑动方块，让曹操从底部脱身",     grad: "linear-gradient(135deg,#b45309,#a16207)" },
    { id: "tangram",     path: "games/08_tangram/index.html",     icon: "🔺", name: "七巧板",    cat: "plan",   tag: "几何", desc: "七块拼出指定轮廓图形",           grad: "linear-gradient(135deg,#10b981,#06b6d4)" },
    { id: "watermelon",  path: "games/09_watermelon/index.html",  icon: "🍉", name: "合成大西瓜",cat: "phys",   tag: "物理", desc: "水果相碰合成，不要溢出顶部",     grad: "linear-gradient(135deg,#22c55e,#16a34a)" },
    { id: "link",        path: "games/10_linkgame/index.html",   icon: "🔗", name: "连连看",    cat: "vision", tag: "眼力", desc: "消除可折线连通的相同图案",         grad: "linear-gradient(135deg,#f43f5e,#ec4899)" },
    { id: "watersort",   path: "games/11_watersort/index.html",  icon: "🧪", name: "倒水排序",  cat: "logic",  tag: "分类", desc: "把每支试管倒成单一颜色",         grad: "linear-gradient(135deg,#06b6d4,#22d3ee)" },
    { id: "gomoku",      path: "games/12_gomoku/index.html",     icon: "⚫", name: "五子棋",    cat: "strat",  tag: "对战", desc: "人机对弈，先连五子者胜",         grad: "linear-gradient(135deg,#475569,#1e293b)" },
    { id: "hanoi",       path: "games/13_hanoi/index.html",      icon: "🗼", name: "汉诺塔",    cat: "logic",  tag: "递归", desc: "用最少步数把圆盘移到第三柱",     grad: "linear-gradient(135deg,#a855f7,#6366f1)" },
    { id: "memory",      path: "games/14_memory/index.html",    icon: "🃏", name: "翻牌记忆",  cat: "memory", tag: "记忆", desc: "翻开两张相同图案即消除",         grad: "linear-gradient(135deg,#f59e0b,#eab308)" },
    { id: "pin",         path: "games/15_pin/index.html",       icon: "📍", name: "见缝插针",  cat: "reflex", tag: "手速", desc: "在旋转的轮盘空隙中插入飞针",     grad: "linear-gradient(135deg,#ef4444,#f97316)" },
    { id: "idiom",       path: "games/16_idiom/index.html",      icon: "📖", name: "成语接龙",  cat: "know",   tag: "知识", desc: "首尾相接，挑战成语词汇量",       grad: "linear-gradient(135deg,#0ea5e9,#6366f1)" },
    { id: "snake",       path: "games/17_snake/index.html",       icon: "🐍", name: "贪吃蛇",    cat: "reflex", tag: "手速", desc: "控制蛇身吃食物变长，别撞墙",     grad: "linear-gradient(135deg,#22c55e,#65a30d)" },
    { id: "brick",       path: "games/18_brick/index.html",       icon: "💥", name: "打砖块",    cat: "reflex", tag: "手速", desc: "移动挡板接球，敲碎所有砖块",     grad: "linear-gradient(135deg,#f97316,#ef4444)" },
    { id: "flappy",      path: "games/19_flappy/index.html",       icon: "🐤", name: "像素鸟",    cat: "reflex", tag: "手速", desc: "点击让小鸟跳跃穿越管道",         grad: "linear-gradient(135deg,#38bdf8,#0ea5e9)" },
    { id: "maze",        path: "games/20_maze/index.html",         icon: "🌀", name: "迷宫",      cat: "plan",   tag: "路径", desc: "在随机迷宫中找到出口",           grad: "linear-gradient(135deg,#8b5cf6,#6366f1)" },
    { id: "24point",     path: "games/21_24point/index.html",      icon: "➗", name: "24点",      cat: "logic",  tag: "运算", desc: "用四个数字与运算符凑出 24",       grad: "linear-gradient(135deg,#6366f1,#8b5cf6)" },
    { id: "match3",      path: "games/22_match3/index.html",       icon: "💎", name: "消消乐",    cat: "vision", tag: "消除", desc: "交换宝石三连消除，连击得分",     grad: "linear-gradient(135deg,#ec4899,#a855f7)" },
    { id: "tictactoe",   path: "games/23_tictactoe/index.html",    icon: "⭕", name: "井字棋",    cat: "strat",  tag: "对战", desc: "三子连线即胜，挑战 AI",            grad: "linear-gradient(135deg,#475569,#334155)" },
    { id: "sliding",     path: "games/24_sliding/index.html",      icon: "🔲", name: "数字华容道",cat: "logic",  tag: "拼图", desc: "滑动方块按 1 至 N 顺序排好",     grad: "linear-gradient(135deg,#0ea5e9,#3b82f6)" },
    { id: "slingshot",   path: "games/25_slingshot/index.html",     icon: "🐦", name: "弹弓小鸟",  cat: "phys",   tag: "物理", desc: "拉弓发射，击落所有小猪过关",     grad: "linear-gradient(135deg,#ef4444,#f59e0b)" },
  ];

  const CATS = [
    { id: "all",     label: "全部" },
    { id: "logic",   label: "逻辑" },
    { id: "reflex",  label: "反应" },
    { id: "plan",    label: "规划" },
    { id: "vision",  label: "眼力" },
    { id: "strat",   label: "策略" },
    { id: "memory",  label: "记忆" },
    { id: "phys",    label: "物理" },
    { id: "know",    label: "知识" },
  ];

  const THEME_KEY = "slowpapa-theme";
  let state = { cat: "all", q: "" };

  /* ---- theme ---- */
  function applyTheme() {
    const t = localStorage.getItem(THEME_KEY) || (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
    document.documentElement.setAttribute("data-theme", t);
    const btn = document.getElementById("theme-btn");
    if (btn) btn.textContent = t === "dark" ? "☀︎" : "☾";
  }
  function toggleTheme() {
    const cur = document.documentElement.getAttribute("data-theme") || "dark";
    const next = cur === "dark" ? "light" : "dark";
    localStorage.setItem(THEME_KEY, next);
    applyTheme();
  }

  function bestFor(id) {
    return parseInt(localStorage.getItem("slowpapa-best-" + id) || "0", 10) || 0;
  }

  /* ---- render ---- */
  function render() {
    const grid = document.getElementById("grid");
    const q = state.q.trim().toLowerCase();
    const list = GAMES.filter(g =>
      (state.cat === "all" || g.cat === state.cat) &&
      (!q || g.name.toLowerCase().includes(q) || g.desc.toLowerCase().includes(q) || g.tag.includes(q))
    );
    document.getElementById("count").textContent = list.length + " 款";

    if (!list.length) {
      grid.innerHTML = '<div class="empty">没有匹配的游戏，换个关键词试试 🎲</div>';
      return;
    }

    grid.innerHTML = list.map((g, i) => {
      const best = bestFor(g.id);
      const bestBadge = best > 0
        ? '<span class="best">★ ' + best + "</span>" : "";
      return (
        '<a class="card" href="' + g.path + '" style="--card-grad:' + g.grad + ';--i:' + i + '">' +
        bestBadge +
        '<div class="ico">' + g.icon + "</div>" +
        '<div class="name">' + g.name + "</div>" +
        '<div class="desc">' + g.desc + "</div>" +
        '<div class="meta">' +
        '<span class="tag">' + g.tag + "</span>" +
        '<span class="play">开始 <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></span>' +
        "</div>" +
        "</a>"
      );
    }).join("");
  }

  function buildFilters() {
    const box = document.getElementById("filters");
    box.innerHTML = CATS.map(c =>
      '<button class="chip" data-cat="' + c.id + '" aria-pressed="' + (c.id === state.cat) + '">' + c.label + "</button>"
    ).join("");
    box.addEventListener("click", e => {
      const b = e.target.closest(".chip");
      if (!b) return;
      state.cat = b.dataset.cat;
      box.querySelectorAll(".chip").forEach(x => x.setAttribute("aria-pressed", String(x.dataset.cat === state.cat)));
      render();
    });
  }

  /* ---- 游戏热度追踪 ---- */
  function trackPlay(gameId) {
    const key = "slowpapa-plays-" + gameId;
    const count = parseInt(localStorage.getItem(key) || "0", 10) + 1;
    localStorage.setItem(key, String(count));
  }

  function getPlayCount(gameId) {
    return parseInt(localStorage.getItem("slowpapa-plays-" + gameId) || "0", 10);
  }

  /* ---- 预加载游戏资源 ---- */
  function preloadGame(path) {
    const link = document.createElement("link");
    link.rel = "prefetch";
    link.href = path;
    link.as = "document";
    document.head.appendChild(link);
  }

  /* ---- 键盘快捷键 ---- */
  function setupHotkeys() {
    document.addEventListener("keydown", e => {
      // Ctrl/Cmd + K: 聚焦搜索框
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        document.getElementById("search").focus();
      }
      // R: 随机游戏
      if (e.key === "r" && !e.ctrlKey && !e.metaKey && document.activeElement === document.body) {
        document.getElementById("random-btn").click();
      }
      // /: 聚焦搜索
      if (e.key === "/" && document.activeElement === document.body) {
        e.preventDefault();
        document.getElementById("search").focus();
      }
    });
  }

  function init() {
    applyTheme();
    buildFilters();
    setupHotkeys();

    const search = document.getElementById("search");
    search.addEventListener("input", e => { state.q = e.target.value; render(); });

    document.getElementById("theme-btn").addEventListener("click", toggleTheme);

    document.getElementById("random-btn").addEventListener("click", () => {
      const g = GAMES[Math.floor(Math.random() * GAMES.length)];
      location.href = g.path;
    });

    // 点击卡片时追踪和预加载
    document.getElementById("grid").addEventListener("click", e => {
      const card = e.target.closest(".card");
      if (card) {
        const href = card.getAttribute("href");
        const game = GAMES.find(g => g.path === href);
        if (game) trackPlay(game.id);
      }
    });

    // 鼠标悬停时预加载游戏
    document.getElementById("grid").addEventListener("mouseenter", e => {
      const card = e.target.closest(".card");
      if (card) {
        const href = card.getAttribute("href");
        if (href) preloadGame(href);
      }
    }, true);

    render();

    // refresh best badges when returning to the tab
    document.addEventListener("visibilitychange", () => { if (!document.hidden) render(); });
  }

  document.addEventListener("DOMContentLoaded", init);
})();