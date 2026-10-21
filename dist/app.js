import {
  clamp,
  fromHex,
  hex,
  hsv,
  hsl,
  hsi,
  rgbHsv,
  rgbHsl,
  rgbHsi,
  lab,
  fromLab,
  database,
  values,
  parseColor,
} from "./colors.js";
const $ = (s) => document.querySelector(s);
let lastResultRender = 0;
let state = { rgb: fromHex("#A8D991"), model: "HSV", h: 100, s: 0.33, v: 0.85 },
  results = [],
  timer,
  drag = false,
  raf,
  renderTimer;
let favorites = [];
try {
  favorites = JSON.parse(localStorage.getItem("chroma-colors") || "[]").filter(
    (x) => /^#[0-9A-F]{6}$/i.test(x),
  );
} catch {}
function toast(t) {
  $("#toast").textContent = t;
  $("#toast").classList.add("show");
  clearTimeout(timer);
  timer = setTimeout(() => $("#toast").classList.remove("show"), 1700);
}
async function copy(t) {
  try {
    await navigator.clipboard.writeText(t);
    toast("已复制 " + t);
  } catch {
    let el = document.createElement("textarea");
    el.value = t;
    document.body.append(el);
    el.select();
    let ok = document.execCommand("copy");
    el.remove();
    toast(ok ? "已复制 " + t : "复制失败，请从输入框手动复制");
  }
}
function ryb(h) {
  const stops = [
    [0, 0],
    [60, 35],
    [120, 60],
    [180, 120],
    [240, 240],
    [300, 290],
    [360, 360],
  ];
  for (let i = 1; i < stops.length; i++)
    if (h <= stops[i][0])
      return (
        stops[i - 1][1] +
        ((h - stops[i - 1][0]) / (stops[i][0] - stops[i - 1][0])) *
          (stops[i][1] - stops[i - 1][1])
      );
  return h;
}
function unryb(h) {
  let best = 0,
    dist = 1e9;
  for (let i = 0; i < 360; i++) {
    let d = Math.abs(ryb(i) - h);
    if (d < dist) {
      dist = d;
      best = i;
    }
  }
  return best;
}
function wheelRgb(h, s, v) {
  return state.model === "HSL"
    ? hsl(h, s, v)
    : state.model === "HSI"
      ? hsi(h, s, v)
      : hsv(state.model === "RYB" ? ryb(h) : h, s, v);
}
function syncCoordinates() {
  let x =
    state.model === "HSL"
      ? rgbHsl(state.rgb)
      : state.model === "HSI"
        ? rgbHsi(state.rgb)
        : rgbHsv(state.rgb);
  [state.h, state.s, state.v] = x;
  if (state.model === "RYB") state.h = unryb(state.h);
}
function drawWheel() {
  const cv = $("#wheel"),
    ctx = cv.getContext("2d"),
    n = 600;
  cv.width = cv.height = n;
  let img = ctx.createImageData(n, n),
    v = state.v;
  for (let y = 0; y < n; y++)
    for (let x = 0; x < n; x++) {
      let dx = (x - n / 2) / (n / 2),
        dy = (n / 2 - y) / (n / 2),
        s = Math.hypot(dx, dy);
      if (s > 1) continue;
      let h = ((Math.atan2(dy, dx) * 180) / Math.PI + 360) % 360,
        rgb = wheelRgb(h, s, v),
        i = (y * n + x) * 4;
      for (let j = 0; j < 3; j++) img.data[i + j] = clamp(rgb[j]) * 255;
      img.data[i + 3] = 255;
    }
  ctx.putImageData(img, 0, 0);
}
function textColor(rgb) {
  return lab(rgb)[0] > 0.7 ? "#263227" : "#ffffff";
}

function update(animate = false) {
  $("#inputError").textContent = "";
  $("#status").textContent = wheelRgb(state.h, state.s, state.v).some(
    (v) => v < -0.0001 || v > 1.0001,
  )
    ? "● HSI 超出 sRGB，预览已裁切"
    : "● sRGB COLOR SPACE";
  let color = hex(state.rgb);
  $("#colorInput").value = color;
  $("#currentSwatch").style.background = color;
  document.documentElement.style.setProperty("--accent", color);
  $("#picker").style.left =
    50 + 43 * state.s * Math.cos((state.h * Math.PI) / 180) + "%";
  $("#picker").style.top =
    50 - 43 * state.s * Math.sin((state.h * Math.PI) / 180) + "%";
  $("#picker").style.background = color;
  $("#wheel").setAttribute("aria-valuenow", Math.round(state.h));
  $("#wheel").setAttribute(
    "aria-valuetext",
    color +
      "，色相 " +
      Math.round(state.h) +
      "°，饱和度 " +
      Math.round(state.s * 100) +
      "%",
  );
  $("#level").value = state.v * 100;
  $("#levelValue").textContent = Math.round(state.v * 100) + "%";
  $("#level").style.background =
    `linear-gradient(90deg,#181d19,${hex(wheelRgb(state.h, state.s, 1))})`;
  $("#rangeLabel").textContent =
    state.model === "HSL" ? "亮度" : state.model === "HSI" ? "强度" : "明度";
  $("#favorite").textContent = favorites.includes(color) ? "★" : "☆";
  $("#savedCount").textContent = favorites.length;
  let vals = values(state.rgb);
  $("#formats").replaceChildren(
    ...["RGB", "HSL", "HSI", "OKLCH"].map((k) => {
      let b = document.createElement("button");
      b.textContent = vals[k];
      b.title = "点击复制 " + k;
      b.onclick = () => copy(vals[k]);
      return b;
    }),
  );
  if (drag) {
    if (performance.now() - lastResultRender > 110) {
      lastResultRender = performance.now();
      renderResults(false);
    }
  } else {
    clearTimeout(renderTimer);
    renderTimer = setTimeout(() => renderResults(animate), 0);
  }
}
function renderResults(animate = true) {
  let target = lab(state.rgb),
    lib = $("#library").value,
    seen = new Set();
  results = database
    .filter((c) => lib === "all" || c.lib === lib)
    .map((c) => ({
      ...c,
      d: Math.hypot(...c.lab.map((x, i) => x - target[i])),
    }))
    .sort((a, b) => a.d - b.d)
    .filter((c) => {
      if (seen.has(c.hex)) return false;
      seen.add(c.hex);
      return true;
    })
    .slice(0, 5);
  $("#results").innerHTML = results
    .map(
      (c, i) =>
        `<article class="color-card" style="--i:${i};${animate ? "" : "animation:none"}"><div class="card-swatch" style="background:${c.hex};color:${textColor(c.rgb)}"><span class="card-index">0${i + 1}</span><button class="card-copy" data-copy="${i}" aria-label="复制 ${c.hex}">${c.hex} ⧉</button></div><button data-open="${i}" class="card-info" style="border:0;background:white;width:100%;text-align:left;cursor:pointer"><div><div class="card-title">${c.name}${c.cn ? `<small>${c.cn}</small>` : ""}</div><div class="card-meta">${c.hex} &nbsp; · &nbsp; ΔE OK ${(c.d * 100).toFixed(2)} &nbsp; · &nbsp; ${c.lib === "css" ? "CSS COLOR" : "中国传统色"}</div></div><span class="card-arrow">↗</span></button></article>`,
    )
    .join("");
  document
    .querySelectorAll("[data-copy]")
    .forEach((b) => (b.onclick = () => copy(results[b.dataset.copy].hex)));
  document
    .querySelectorAll("[data-open]")
    .forEach((b) => (b.onclick = () => openDetail(results[b.dataset.open])));
  document.querySelectorAll(".card-swatch").forEach(
    (el, i) =>
      (el.onclick = (e) => {
        if (!e.target.closest("button")) openDetail(results[i]);
      }),
  );
}
function openDetail(c) {
  let vals = values(c.rgb),
    v = values(state.rgb);
  $("#detailContent").innerHTML =
    `<div class="detail-hero" style="background:${c.hex};color:${textColor(c.rgb)}">${c.hex}</div><span class="eyebrow">COLOR NOTES / 色彩档案</span><h2 class="detail-name">${c.name}</h2><div class="detail-cn">${c.cn || "暂无中文名"}</div><p>${c.lib === "css" ? "CSS 标准命名色。中文名称为便于理解的参考译名，并非 CSS 标准定义。" : "中国传统色精选。英文为参考译名，传统色在不同资料与媒介中的色值可能不同。"}</p><div class="detail-values">${Object.entries(
      vals,
    )
      .map(
        ([k, v]) =>
          `<button data-value="${k}">${k} &nbsp; ${v} &nbsp; ⧉</button>`,
      )
      .join(
        "",
      )}</div><span class="eyebrow">YOUR COLOR / NAMED COLOR</span><div class="compare" style="margin-top:10px"><span style="background:${v.HEX};color:${textColor(state.rgb)}">原色 ${v.HEX}</span><span style="background:${c.hex};color:${textColor(c.rgb)}">${c.hex}</span></div><p>感知色差 ΔE OK：${(c.d * 100).toFixed(2)}（Oklab 欧氏距离 × 100，越小越接近）。${Math.abs(c.lab[0] - lab(state.rgb)[0]) < 0.01 ? "两种颜色明度十分接近。" : c.lab[0] > lab(state.rgb)[0] ? "这个命名色比你选的颜色更明亮。" : "这个命名色比你选的颜色更深。"}<br>色名匹配基于当前色名库；没有完全对应时，展示最接近的候选。</p><a class="source-link" href="${c.lib === "css" ? "https://www.w3.org/TR/css-color-4/#named-colors" : "https://zhongguose.com/"}" target="_blank" rel="noopener">查看色名来源 ↗</a><button id="useColor" class="copy-main" style="float:right">以此色继续探索 ↗</button>`;
  $("#detail").showModal();
  document
    .querySelectorAll("[data-value]")
    .forEach((b) => (b.onclick = () => copy(vals[b.dataset.value])));
  $("#useColor").onclick = () => {
    state.rgb = c.rgb.slice();
    syncCoordinates();
    drawWheel();
    update(true);
    $("#detail").close();
  };
}
function pick(e) {
  const r = $("#wheel").getBoundingClientRect(),
    x = (e.clientX - r.left - r.width / 2) / (r.width / 2),
    y = (r.top + r.height / 2 - e.clientY) / (r.height / 2);
  state.h = ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
  state.s = clamp(Math.hypot(x, y));
  let raw = wheelRgb(state.h, state.s, state.v);
  state.rgb = raw.map((v) => clamp(v));
  $("#status").textContent = raw.some((v) => v < 0 || v > 1)
    ? "● HSI 超出 sRGB，预览已裁切"
    : "● sRGB COLOR SPACE";
  update(false);
}
$("#wheel").onpointerdown = (e) => {
  drag = true;
  $("#wheel").setPointerCapture(e.pointerId);
  pick(e);
};
$("#wheel").onpointermove = (e) => {
  if (drag) {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => pick(e));
  }
};
$("#wheel").onpointerup = (e) => {
  cancelAnimationFrame(raf);
  pick(e);
  drag = false;
  update(true);
};
$("#wheel").onpointercancel = () => {
  drag = false;
};
$("#wheel").onkeydown = (e) => {
  if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key))
    return;
  e.preventDefault();
  state.h =
    (state.h +
      (e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0) +
      360) %
    360;
  state.s = clamp(
    state.s + (e.key === "ArrowUp" ? 0.01 : e.key === "ArrowDown" ? -0.01 : 0),
  );
  state.rgb = wheelRgb(state.h, state.s, state.v).map((v) => clamp(v));
  update(false);
};
$("#level").oninput = () => {
  state.v = +$("#level").value / 100;
  state.rgb = wheelRgb(state.h, state.s, state.v).map((v) => clamp(v));
  cancelAnimationFrame(raf);
  raf = requestAnimationFrame(() => {
    drawWheel();
    update(false);
  });
};
$("#level").onchange = () => update(true);
document.querySelectorAll("[data-model]").forEach(
  (b) =>
    (b.onclick = () => {
      state.model = b.dataset.model;
      document
        .querySelectorAll("[data-model]")
        .forEach((x) => x.classList.toggle("active", x === b));
      $("#modelHint").textContent = {
        HSV: "色相 · 饱和度 · 明度",
        HSL: "色相 · 饱和度 · 亮度",
        HSI: "色相 · 饱和度 · 强度 · 超色域会裁切",
        RYB: "艺术家色环 · 红黄蓝色相映射",
      }[state.model];
      syncCoordinates();
      drawWheel();
      update(false);
    }),
);

$("#colorInput").onkeydown = (e) => {
  if (e.key === "Enter") {
    try {
      state.rgb = parseColor(e.target.value, toast);
      $("#inputError").textContent = "";
      syncCoordinates();
      drawWheel();
      update(true);
    } catch (err) {
      $("#inputError").textContent = err.message;
    }
  }
};
$("#copyCurrent").onclick = () => copy(hex(state.rgb));
$("#library").onchange = () => renderResults(true);
function saveFavorites() {
  try {
    localStorage.setItem("chroma-colors", JSON.stringify(favorites));
  } catch {
    toast("浏览器无法持久保存，收藏仅本次有效");
  }
  $("#savedCount").textContent = favorites.length;
}
$("#favorite").onclick = () => {
  let c = hex(state.rgb);
  if (favorites.includes(c)) {
    favorites = favorites.filter((x) => x !== c);
    toast("已取消收藏");
  } else {
    favorites.push(c);
    toast("已收藏 " + c);
  }
  saveFavorites();
  update(false);
};
function renderSaved() {
  $("#savedList").replaceChildren();
  if (!favorites.length) {
    $("#savedList").innerHTML =
      "<p>还没有收藏。点击色号右侧的 ☆，留下喜欢的颜色。</p>";
    return;
  }
  favorites.forEach((c) => {
    let row = document.createElement("div");
    row.className = "saved-item";
    let sw = document.createElement("i");
    sw.style.background = c;
    let b = document.createElement("button");
    b.textContent = c + " ↗";
    b.onclick = () => {
      state.rgb = fromHex(c);
      syncCoordinates();
      drawWheel();
      update(true);
      $("#saved").close();
    };
    let cp = document.createElement("button");
    cp.textContent = "复制";
    cp.onclick = () => copy(c);
    let rm = document.createElement("button");
    rm.textContent = "移除";
    rm.className = "remove";
    rm.onclick = () => {
      favorites = favorites.filter((x) => x !== c);
      saveFavorites();
      renderSaved();
      update(false);
    };
    row.append(sw, b, cp, rm);
    $("#savedList").append(row);
  });
}
$("#savedBtn").onclick = () => {
  renderSaved();
  $("#saved").showModal();
};
$("#closeSaved").onclick = () => $("#saved").close();
$("#closeDetail").onclick = () => $("#detail").close();
document.querySelectorAll("dialog").forEach(
  (d) =>
    (d.onclick = (e) => {
      if (e.target === d) {
        const r = d.getBoundingClientRect();
        if (
          e.clientX < r.left ||
          e.clientX > r.right ||
          e.clientY < r.top ||
          e.clientY > r.bottom
        )
          d.close();
      }
    }),
);
syncCoordinates();
drawWheel();
update(true);
