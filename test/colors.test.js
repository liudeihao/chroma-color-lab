import test from "node:test";
import assert from "node:assert/strict";
import {
  hsv,
  hsl,
  hsi,
  rgbHsv,
  rgbHsl,
  rgbHsi,
  lab,
  fromLab,
  parseColor,
  hex,
  database,
} from "../dist/colors.js";

function near(actual, expected, epsilon = 1e-6) {
  actual.forEach((n, i) =>
    assert.ok(Math.abs(n - expected[i]) < epsilon, `${actual} != ${expected}`),
  );
}
test("known primary colors and hue wrapping", () => {
  near(hsv(0, 1, 1), [1, 0, 0]);
  near(hsv(120, 1, 1), [0, 1, 0]);
  near(hsv(240, 1, 1), [0, 0, 1]);
  near(hsv(-120, 1, 1), [0, 0, 1]);
  near(hsl(360, 1, 0.5), [1, 0, 0]);
  near(hsi(0, 1, 1 / 3), [1, 0, 0]);
});
for (const [name, to, back] of [
  ["HSV", rgbHsv, hsv],
  ["HSL", rgbHsl, hsl],
  ["HSI", rgbHsi, hsi],
  ["Oklab", lab, fromLab],
]) {
  test(`${name} roundtrips primaries, grays and 125 RGB samples`, () => {
    for (const r of [0, 0.25, 0.5, 0.75, 1])
      for (const g of [0, 0.25, 0.5, 0.75, 1])
        for (const b of [0, 0.25, 0.5, 0.75, 1]) {
          const rgb = [r, g, b];
          const converted = to(rgb);
          assert.ok(converted.every(Number.isFinite));
          near(
            name === "Oklab" ? back(converted) : back(...converted),
            rgb,
            2e-6,
          );
        }
  });
}
test("parses short hex, case-insensitive names, percentages and CSS space syntax", () => {
  for (const input of [
    "#F00",
    "ff0000",
    "RED",
    "rgb(255, 0, 0)",
    "rgb(100% 0% 0%)",
    "hsl(0deg 100% 50%)",
    "hsv(360,100%,100%)",
    "hsi(0,100%,33.333333333%)",
  ])
    assert.equal(hex(parseColor(input)), "#FF0000");
  assert.equal(hex(parseColor("light blue")), "#ADD8E6");
  assert.equal(hex(parseColor("朱砂")), "#FF461F");
});
test("OKLCH matches a known Oklab red reference", () => {
  near(parseColor("oklch(62.7955% 0.257683 29.2339)"), [1, 0, 0], 0.00002);
});
test("rejects invalid ranges, units, alpha and malformed inputs", () => {
  for (const input of [
    "#12345",
    "rgb(256,0,0)",
    "rgb(1deg 0 0)",
    "hsl(0,101%,50%)",
    "hsl(30% 50% 50%)",
    "oklch(60% 20% 40)",
    "oklch(120% .2 30)",
    "hsl(10 20deg 30%)",
    "rgba(0,0,0,0.5)",
    "rgb(NaN 0 0)",
    "rgb(0 0 0 / 50%)",
    "<script>",
  ])
    assert.throws(() => parseColor(input), input);
});
test("out-of-gamut inputs warn and return displayable RGB", () => {
  let warning = "";
  const rgb = parseColor("oklch(70% .5 20)", (s) => (warning = s));
  assert.ok(warning);
  assert.ok(rgb.every((v) => v >= 0 && v <= 1));
});
test("named-color data contains valid hex and an exact Tomato match", () => {
  assert.ok(database.length >= 150);
  database.forEach((c) => {
    assert.match(c.hex, /^#[0-9A-F]{6}$/);
    assert.ok(c.lab.every(Number.isFinite));
  });
  const target = lab(parseColor("#FF6347"));
  const sorted = database
    .map((c) => ({ c, d: Math.hypot(...c.lab.map((x, i) => x - target[i])) }))
    .sort((a, b) => a.d - b.d);
  assert.equal(sorted[0].c.key, "Tomato");
  assert.equal(sorted[0].d, 0);
});
