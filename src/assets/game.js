/* Slowpapa shared game helpers. Each game may use whichever it needs. */
(function () {
  "use strict";
  window.SG = window.SG || {};

  /* ---- Theme (persisted, shared with portal via localStorage key) ---- */
  const KEY = "slowpapa-theme";
  function applyTheme() {
    const t = localStorage.getItem(KEY) || "dark";
    document.documentElement.setAttribute("data-theme", t);
    return t;
  }
  SG.applyTheme = applyTheme;
  SG.toggleTheme = function () {
    const cur = document.documentElement.getAttribute("data-theme") || "dark";
    const next = cur === "dark" ? "light" : "dark";
    localStorage.setItem(KEY, next);
    document.documentElement.setAttribute("data-theme", next);
    return next;
  };
  applyTheme();

  /* ---- Best score per game in localStorage ---- */
  SG.best = function (key, val) {
    const k = "slowpapa-best-" + key;
    if (val === undefined) return parseInt(localStorage.getItem(k) || "0", 10) || 0;
    const prev = SG.best(key);
    if (val > prev) localStorage.setItem(k, String(val));
    return Math.max(prev, val);
  };

  /* ---- Modal / overlay (game over / win / how-to) ----
     Usage:
       const ov = SG.overlay({ title, body, score, buttons:[{text,kind,onClick}] });
       ov.show(); ov.hide();
  */
  SG.overlay = function (cfg) {
    const el = document.createElement("div");
    el.className = "overlay";
    const buttons = (cfg.buttons || [{ text: "继续", kind: "primary", onClick: () => ov.hide() }])
      .map(b => {
        const btn = document.createElement("button");
        btn.className = "btn " + (b.kind || "");
        btn.textContent = b.text;
        btn.onclick = () => { (b.onClick || (() => {}))(); };
        return btn;
      });
    const actions = document.createElement("div");
    actions.className = "actions";
    buttons.forEach(b => actions.appendChild(b));

    el.innerHTML =
      '<div class="dialog">' +
      '<h2></h2>' +
      (cfg.score !== undefined ? '<div class="big-score"></div>' : "") +
      '<p></p>' +
      '</div>';
    el.querySelector("h2").textContent = cfg.title || "";
    if (cfg.score !== undefined) el.querySelector(".big-score").textContent = cfg.score;
    el.querySelector("p").innerHTML = cfg.body || "";
    el.querySelector(".dialog").appendChild(actions);

    document.body.appendChild(el);
    const ov = {
      el,
      show() { el.classList.add("show"); },
      hide() { el.classList.remove("show"); },
      set(k, v) {
        if (k === "score") el.querySelector(".big-score").textContent = v;
        else if (k === "title") el.querySelector("h2").textContent = v;
        else if (k === "body") el.querySelector("p").innerHTML = v;
      },
    };
    return ov;
  };

  /* ---- Swipe detection on an element ----
     onSwipe(dir) where dir in 'up|down|left|right'
  */
  SG.swipe = function (el, onSwipe, opts) {
    opts = opts || {};
    const thr = opts.threshold || 24;
    let sx = 0, sy = 0, active = false;
    el.addEventListener("touchstart", e => {
      const t = e.changedTouches[0];
      sx = t.clientX; sy = t.clientY; active = true;
    }, { passive: true });
    el.addEventListener("touchend", e => {
      if (!active) return; active = false;
      const t = e.changedTouches[0];
      const dx = t.clientX - sx, dy = t.clientY - sy;
      if (Math.abs(dx) < thr && Math.abs(dy) < thr) return;
      if (Math.abs(dx) > Math.abs(dy)) onSwipe(dx > 0 ? "right" : "left");
      else onSwipe(dy > 0 ? "down" : "up");
    }, { passive: true });
  };

  /* ---- Tiny toast ---- */
  SG.toast = function (msg, ms) {
    let t = document.querySelector(".sg-toast");
    if (!t) {
      t = document.createElement("div");
      t.className = "sg-toast";
      t.style.cssText =
        "position:fixed;left:50%;bottom:calc(28px + env(safe-area-inset-bottom));" +
        "transform:translateX(-50%);background:var(--surface-2);border:1px solid var(--border);" +
        "color:var(--text);padding:10px 18px;border-radius:999px;font-size:13px;font-weight:600;" +
        "box-shadow:var(--shadow);z-index:60;opacity:0;transition:opacity .2s ease,transform .2s ease";
      document.body.appendChild(t);
    }
    t.textContent = msg;
    requestAnimationFrame(() => { t.style.opacity = "1"; t.style.transform = "translateX(-50%) translateY(0)"; });
    clearTimeout(t._timer);
    t._timer = setTimeout(() => { t.style.opacity = "0"; }, ms || 1600);
  };

  /* ---- standard topbar builder (optional) ---- */
  SG.buildTopbar = function (cfg) {
    const bar = document.createElement("div");
    bar.className = "game-topbar";
    bar.innerHTML =
      '<a class="back" href="/" aria-label="返回">‹</a>' +
      '<div class="title"></div>' +
      '<div class="stats"></div>' +
      (cfg.actions || []).map(a =>
        '<button class="icon-btn" data-act="' + a.id + '" aria-label="' + a.label + '">' + a.icon + "</button>"
      ).join("");
    bar.querySelector(".title").innerHTML = "<span>" + (cfg.title || "") + "</span>" +
      (cfg.subtitle ? "<small>" + cfg.subtitle + "</small>" : "");
    const statsEl = bar.querySelector(".stats");
    (cfg.stats || []).forEach(s => {
      const d = document.createElement("div");
      d.className = "stat";
      d.innerHTML = '<span class="k"></span><span class="v"></span>';
      d.querySelector(".k").textContent = s.k;
      d.querySelector(".v").textContent = s.v;
      if (s.accent) d.querySelector(".v").classList.add("accent");
      d.dataset.stat = s.id;
      statsEl.appendChild(d);
    });
    return bar;
  };

  /* ---- Game lifecycle manager ---- */
  SG.Game = function (cfg) {
    const game = {
      paused: false,
      over: false,
      won: false,
      _listeners: [],
      _cleanups: [],

      // 注册清理函数
      onCleanup(fn) { this._cleanups.push(fn); },

      // 统一事件监听管理
      on(target, event, handler, opts) {
        target.addEventListener(event, handler, opts);
        this._listeners.push({ target, event, handler, opts });
      },

      // 清理所有监听器
      cleanup() {
        this._listeners.forEach(({ target, event, handler, opts }) => {
          target.removeEventListener(event, handler, opts);
        });
        this._cleanups.forEach(fn => fn());
        this._listeners = [];
        this._cleanups = [];
      },

      // 重置游戏状态
      reset() {
        this.paused = false;
        this.over = false;
        this.won = false;
        if (cfg.onReset) cfg.onReset();
      },

      // 结束游戏
      end(result) {
        this.over = true;
        if (result === "win") this.won = true;
        if (cfg.onEnd) cfg.onEnd(result);
      },
    };
    return game;
  };

  /* ---- 性能监控 ---- */
  SG.perf = {
    mark(name) {
      if (performance.mark) performance.mark(name);
    },
    measure(name, start, end) {
      if (performance.measure) {
        try { performance.measure(name, start, end); } catch (e) {}
      }
    },
  };

  /* ---- 错误上报 ---- */
  SG.reportError = function (error, context) {
    console.error("[Game Error]", error, context);
    // 可扩展：发送到后端分析服务
  };
})();