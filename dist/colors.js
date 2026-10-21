const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const cssData = `AliceBlue:f0f8ff AntiqueWhite:faebd7 Aqua:00ffff Aquamarine:7fffd4 Azure:f0ffff Beige:f5f5dc Bisque:ffe4c4 Black:000000 BlanchedAlmond:ffebcd Blue:0000ff BlueViolet:8a2be2 Brown:a52a2a BurlyWood:deb887 CadetBlue:5f9ea0 Chartreuse:7fff00 Chocolate:d2691e Coral:ff7f50 CornflowerBlue:6495ed Cornsilk:fff8dc Crimson:dc143c Cyan:00ffff DarkBlue:00008b DarkCyan:008b8b DarkGoldenRod:b8860b DarkGray:a9a9a9 DarkGreen:006400 DarkKhaki:bdb76b DarkMagenta:8b008b DarkOliveGreen:556b2f DarkOrange:ff8c00 DarkOrchid:9932cc DarkRed:8b0000 DarkSalmon:e9967a DarkSeaGreen:8fbc8f DarkSlateBlue:483d8b DarkSlateGray:2f4f4f DarkTurquoise:00ced1 DarkViolet:9400d3 DeepPink:ff1493 DeepSkyBlue:00bfff DimGray:696969 DodgerBlue:1e90ff FireBrick:b22222 FloralWhite:fffaf0 ForestGreen:228b22 Fuchsia:ff00ff Gainsboro:dcdcdc GhostWhite:f8f8ff Gold:ffd700 GoldenRod:daa520 Gray:808080 Green:008000 GreenYellow:adff2f HoneyDew:f0fff0 HotPink:ff69b4 IndianRed:cd5c5c Indigo:4b0082 Ivory:fffff0 Khaki:f0e68c Lavender:e6e6fa LavenderBlush:fff0f5 LawnGreen:7cfc00 LemonChiffon:fffacd LightBlue:add8e6 LightCoral:f08080 LightCyan:e0ffff LightGoldenRodYellow:fafad2 LightGray:d3d3d3 LightGreen:90ee90 LightPink:ffb6c1 LightSalmon:ffa07a LightSeaGreen:20b2aa LightSkyBlue:87cefa LightSlateGray:778899 LightSteelBlue:b0c4de LightYellow:ffffe0 Lime:00ff00 LimeGreen:32cd32 Linen:faf0e6 Magenta:ff00ff Maroon:800000 MediumAquaMarine:66cdaa MediumBlue:0000cd MediumOrchid:ba55d3 MediumPurple:9370db MediumSeaGreen:3cb371 MediumSlateBlue:7b68ee MediumSpringGreen:00fa9a MediumTurquoise:48d1cc MediumVioletRed:c71585 MidnightBlue:191970 MintCream:f5fffa MistyRose:ffe4e1 Moccasin:ffe4b5 NavajoWhite:ffdead Navy:000080 OldLace:fdf5e6 Olive:808000 OliveDrab:6b8e23 Orange:ffa500 OrangeRed:ff4500 Orchid:da70d6 PaleGoldenRod:eee8aa PaleGreen:98fb98 PaleTurquoise:afeeee PaleVioletRed:db7093 PapayaWhip:ffefd5 PeachPuff:ffdab9 Peru:cd853f Pink:ffc0cb Plum:dda0dd PowderBlue:b0e0e6 Purple:800080 RebeccaPurple:663399 Red:ff0000 RosyBrown:bc8f8f RoyalBlue:4169e1 SaddleBrown:8b4513 Salmon:fa8072 SandyBrown:f4a460 SeaGreen:2e8b57 SeaShell:fff5ee Sienna:a0522d Silver:c0c0c0 SkyBlue:87ceeb SlateBlue:6a5acd SlateGray:708090 Snow:fffafa SpringGreen:00ff7f SteelBlue:4682b4 Tan:d2b48c Teal:008080 Thistle:d8bfd8 Tomato:ff6347 Turquoise:40e0d0 Violet:ee82ee Wheat:f5deb3 White:ffffff WhiteSmoke:f5f5f5 Yellow:ffff00 YellowGreen:9acd32`;
const cn = {
  AliceBlue: "爱丽丝蓝",
  Aquamarine: "碧绿色",
  Azure: "蔚蓝色",
  Beige: "米色",
  Black: "黑色",
  Blue: "蓝色",
  BlueViolet: "蓝紫色",
  Brown: "棕色",
  CadetBlue: "军校蓝",
  Chartreuse: "查特酒绿",
  Chocolate: "巧克力色",
  Coral: "珊瑚色",
  CornflowerBlue: "矢车菊蓝",
  Crimson: "绯红色",
  DarkGreen: "深绿色",
  DarkSeaGreen: "深海绿",
  ForestGreen: "森林绿",
  Gold: "金色",
  Green: "绿色",
  HoneyDew: "蜜瓜色",
  Indigo: "靛蓝色",
  Ivory: "象牙白",
  Khaki: "卡其色",
  Lavender: "薰衣草紫",
  LightBlue: "浅蓝色",
  LightGreen: "浅绿色",
  LightPink: "浅粉色",
  Lime: "青柠绿",
  LimeGreen: "青柠绿色",
  MintCream: "薄荷奶油色",
  MistyRose: "雾玫瑰色",
  Navy: "海军蓝",
  Olive: "橄榄色",
  Orange: "橙色",
  Orchid: "兰花紫",
  PaleGreen: "淡绿色",
  PeachPuff: "桃色",
  Pink: "粉色",
  Plum: "李子紫",
  PowderBlue: "粉蓝色",
  Purple: "紫色",
  Red: "红色",
  Salmon: "鲑鱼色",
  SeaGreen: "海绿色",
  SkyBlue: "天空蓝",
  Snow: "雪白",
  SteelBlue: "钢蓝色",
  Teal: "水鸭色",
  Tomato: "番茄红",
  Turquoise: "绿松石色",
  Violet: "紫罗兰色",
  Wheat: "小麦色",
  White: "白色",
  Yellow: "黄色",
  YellowGreen: "黄绿色",
};
function fromHex(s) {
  s = s.replace("#", "");
  if (s.length === 3)
    s = s
      .split("")
      .map((x) => x + x)
      .join("");
  return [0, 2, 4].map((i) => parseInt(s.slice(i, i + 2), 16) / 255);
}
function hex(rgb) {
  return (
    "#" +
    rgb
      .map((v) =>
        Math.round(clamp(v) * 255)
          .toString(16)
          .padStart(2, "0"),
      )
      .join("")
      .toUpperCase()
  );
}
function hsv(h, s, v) {
  h = ((h % 360) + 360) % 360;
  const c = v * s,
    x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
    m = v - c;
  return (
    h < 60
      ? [c, x, 0]
      : h < 120
        ? [x, c, 0]
        : h < 180
          ? [0, c, x]
          : h < 240
            ? [0, x, c]
            : h < 300
              ? [x, 0, c]
              : [c, 0, x]
  ).map((x) => x + m);
}
function hsl(h, s, l) {
  const v = l + s * Math.min(l, 1 - l);
  return hsv(h, v ? 2 * (1 - l / v) : 0, v);
}
function hsi(h, s, i) {
  h = ((h % 360) + 360) % 360;
  let rgb;
  const x = ((h % 120) * Math.PI) / 180,
    a = i * (1 - s),
    b = i * (1 + (s * Math.cos(x)) / Math.cos(Math.PI / 3 - x)),
    c = 3 * i - a - b;
  rgb = h < 120 ? [b, c, a] : h < 240 ? [a, b, c] : [c, a, b];
  return rgb;
}
function rgbHsv([r, g, b]) {
  let max = Math.max(r, g, b),
    min = Math.min(r, g, b),
    d = max - min,
    h = d
      ? max === r
        ? (((g - b) / d) % 6) * 60
        : max === g
          ? ((b - r) / d + 2) * 60
          : ((r - g) / d + 4) * 60
      : 0;
  return [(h + 360) % 360, max ? d / max : 0, max];
}
function rgbHsl(rgb) {
  const [h, s, v] = rgbHsv(rgb),
    l = v * (1 - s / 2);
  return [h, l === 0 || l === 1 ? 0 : (v - l) / Math.min(l, 1 - l), l];
}
function rgbHsi([r, g, b]) {
  let i = (r + g + b) / 3,
    den = Math.sqrt((r - g) ** 2 + (r - b) * (g - b)),
    h = den
      ? (Math.acos(clamp((r - g + (r - b)) / 2 / den, -1, 1)) * 180) / Math.PI
      : 0;
  return [b > g ? 360 - h : h, i ? 1 - Math.min(r, g, b) / i : 0, i];
}
function lab(rgb) {
  let [r, g, b] = rgb.map((v) =>
    v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4,
  );
  let l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b),
    m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b),
    s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}
function fromLab([L, a, b]) {
  let l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3,
    m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3,
    s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ].map((v) =>
    v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055,
  );
}
let database = cssData.split(" ").map((v) => {
  let [name, col] = v.split(":");
  return {
    name: name.replace(/([a-z])([A-Z])/g, "$1 $2"),
    key: name,
    cn: cn[name] || "",
    hex: "#" + col.toUpperCase(),
    lib: "css",
  };
});
// Curated traditional-color reference swatches; RGB values are not universal standards.
database.push(
  ...[
    ["天青", "Sky Cyan", "2EC3E7"],
    ["竹青", "Bamboo Green", "789262"],
    ["豆绿", "Bean Green", "9ED048"],
    ["柳绿", "Willow Green", "AFDD22"],
    ["松花绿", "Pine Pollen Green", "BCE672"],
    ["葱绿", "Scallion Green", "9ED900"],
    ["水绿", "Water Green", "D4F2E7"],
    ["碧玉", "Jade", "2ADD9C"],
    ["月白", "Moon White", "D6ECF0"],
    ["藕荷", "Lotus Mauve", "E4C6D0"],
    ["胭脂", "Rouge", "9D2933"],
    ["朱砂", "Cinnabar", "FF461F"],
    ["鹅黄", "Gosling Yellow", "FFF143"],
    ["秋香色", "Autumn Fragrance", "D9B611"],
  ].map(([cn, name, col]) => ({
    name,
    cn,
    hex: "#" + col,
    lib: "traditional",
  })),
);
database.forEach((c) => {
  c.rgb = fromHex(c.hex);
  c.lab = lab(c.rgb);
});

function values(rgb) {
  let [h, s, l] = rgbHsl(rgb),
    [hh, ss, v] = rgbHsv(rgb),
    [hi, si, ii] = rgbHsi(rgb),
    [L, a, b] = lab(rgb),
    C = Math.hypot(a, b),
    H = ((Math.atan2(b, a) * 180) / Math.PI + 360) % 360;
  return {
    HEX: hex(rgb),
    RGB: `rgb(${rgb.map((x) => Math.round(clamp(x) * 255)).join(", ")})`,
    HSL: `hsl(${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`,
    HSV: `hsv(${Math.round(hh)}, ${Math.round(ss * 100)}%, ${Math.round(v * 100)}%)`,
    HSI: `hsi(${Math.round(hi)}, ${Math.round(si * 100)}%, ${Math.round(ii * 100)}%)`,
    OKLCH: `oklch(${(L * 100).toFixed(1)}% ${C.toFixed(3)} ${H.toFixed(1)})`,
  };
}
function parseColor(text, onGamut = () => {}) {
  let s = text.trim();
  if (/^#?([\da-f]{3}|[\da-f]{6})$/i.test(s)) return fromHex(s);
  let named = database.find(
    (c) =>
      c.key?.toLowerCase() === s.toLowerCase() ||
      c.name.toLowerCase() === s.toLowerCase() ||
      c.cn === s,
  );
  if (named) return named.rgb.slice();
  let m = s.match(/^(rgb|hsl|hsv|hsi|oklch)\((.*)\)$/i);
  if (!m) throw Error("请输入有效的 HEX、RGB、HSL、HSV、HSI 或 OKLCH。");
  let parts = m[2].replace(/,/g, " ").trim().split(/\s+/);
  if (
    parts.length !== 3 ||
    parts.some((p) => !/^[-+]?(?:\d*\.)?\d+(?:%|deg)?$/.test(p))
  )
    throw Error("需要三个有效数值，不支持透明度。");
  let mode = m[1].toLowerCase(),
    nums = parts.map(parseFloat);
  if (
    parts.some(
      (p, i) =>
        p.endsWith("deg") &&
        (mode === "rgb" || i !== (mode === "oklch" ? 2 : 0)),
    )
  )
    throw Error("deg 单位仅用于色相。");
  if (
    (mode !== "rgb" && parts[mode === "oklch" ? 2 : 0].endsWith("%")) ||
    (mode === "oklch" && parts[1].endsWith("%"))
  )
    throw Error("请使用数值色相，OKLCH 色度使用小数。");
  let rgb;
  if (mode === "rgb") {
    if (nums.some((v, i) => v < 0 || v > (parts[i].endsWith("%") ? 100 : 255)))
      throw Error("RGB 数值范围为 0–255 或 0–100%。");
    rgb = nums.map((v, i) => v / (parts[i].endsWith("%") ? 100 : 255));
  } else if (mode === "oklch") {
    let [l, c, h] = nums;
    l /= parts[0].endsWith("%") ? 100 : 1;
    if (l < 0 || l > 1 || c < 0) throw Error("请检查 OKLCH 明度和色度范围。");
    rgb = fromLab([
      l,
      c * Math.cos((h * Math.PI) / 180),
      c * Math.sin((h * Math.PI) / 180),
    ]);
  } else {
    let [h, s, l] = nums;
    s /= 100;
    l /= 100;
    if (s < 0 || s > 1 || l < 0 || l > 1)
      throw Error("饱和度及明度范围为 0–100%。");
    rgb = { hsl, hsv, hsi }[mode](h, s, l);
  }
  if (rgb.some((v) => !Number.isFinite(v))) throw Error("无法转换这个颜色。");
  if (rgb.some((v) => v < -0.0001 || v > 1.0001))
    onGamut("超出 sRGB 色域，已裁切为可显示颜色");
  return rgb.map((v) => clamp(v));
}
export {
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
};
