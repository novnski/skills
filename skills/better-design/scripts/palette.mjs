// How color is spread over a screenshot, measured from the pixels, so "one hue everywhere" becomes a number.
//
//   node palette.mjs <screenshot.png> [<more.png> ...]      a short report per image
//   node palette.mjs --json <screenshot.png> ...            one line of JSON per image
//
// Every pixel is converted to OKLCH and put in one of three bands by chroma:
//   neutral  C up to 0.012         reads as white, gray or black
//   tinted   C from 0.012 to 0.04  a gray, off-white or near-black that leans toward a hue
//   colored  C of 0.04 or more     plainly a color
// A page built from gray neutrals and one accent is almost all neutral, with a little colored and next to no tinted.
// A page whose background, text, borders and dark panels all lean toward the accent shows a large tinted share in
// one hue family. That is the one-hue wash.
//
// Reads 8-bit RGB or RGBA PNGs that are not interlaced, which is what browser screenshots are. No dependencies.
import { readFileSync } from "node:fs";
import { inflateSync } from "node:zlib";
import { basename } from "node:path";

export const NEUTRAL_MAX = 0.012;
export const COLORED_MIN = 0.04;

export function decodePng(file) {
  const b = readFileSync(file);
  let p = 8, width = 0, height = 0, type = 0; const idat = [];
  while (p < b.length) {
    const len = b.readUInt32BE(p), kind = b.toString("latin1", p + 4, p + 8), data = b.subarray(p + 8, p + 8 + len);
    if (kind === "IHDR") { width = data.readUInt32BE(0); height = data.readUInt32BE(4); type = data[9];
      if (data[8] !== 8 || (type !== 2 && type !== 6) || data[12] !== 0) throw new Error("unsupported PNG (need 8-bit RGB or RGBA, not interlaced): " + file); }
    else if (kind === "IDAT") idat.push(data);
    p += 12 + len;
  }
  const bpp = type === 6 ? 4 : 3, stride = width * bpp, raw = inflateSync(Buffer.concat(idat)), out = Buffer.alloc(stride * height);
  for (let y = 0; y < height; y++) {
    const f = raw[y * (stride + 1)], src = y * (stride + 1) + 1, dst = y * stride;
    for (let x = 0; x < stride; x++) {
      const a = x >= bpp ? out[dst + x - bpp] : 0, up = y ? out[dst + x - stride] : 0, c = x >= bpp && y ? out[dst + x - stride - bpp] : 0;
      let v = raw[src + x];
      if (f === 1) v += a; else if (f === 2) v += up; else if (f === 3) v += (a + up) >> 1;
      else if (f === 4) { const pa = Math.abs(up - c), pb = Math.abs(a - c), pc = Math.abs(a + up - 2 * c); v += pa <= pb && pa <= pc ? a : pb <= pc ? up : c; }
      out[dst + x] = v & 255;
    }
  }
  return { width, height, bpp, data: out };
}

const lin = new Float64Array(256).map((_, i) => { const v = i / 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; });
/** sRGB bytes to [lightness 0..1, chroma, hue in degrees]. */
export function oklch(r, g, b) {
  const R = lin[r], G = lin[g], B = lin[b];
  const l = Math.cbrt(0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B), m = Math.cbrt(0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B), s = Math.cbrt(0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B);
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s, Bb = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  return [0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, Math.hypot(A, Bb), (Math.atan2(Bb, A) * 180 / Math.PI + 360) % 360];
}
export const family = (h) => h < 30 || h >= 350 ? "red" : h < 70 ? "orange" : h < 110 ? "yellow" : h < 170 ? "green" : h < 210 ? "teal" : h < 270 ? "blue" : h < 320 ? "purple" : "pink";

/**
 * Measure a screenshot. `pictures` is an optional list of rectangles ({ x, y, width, height } in image pixels) that hold
 * photographs or illustrations. A picture in natural color (two or more hue families each filling at least 8% of it)
 * is left out of the count, because a photograph of a blue wall is not a tinted interface. A picture printed in one
 * ink is counted like everything else.
 */
export function measure(file, { pictures = [] } = {}) {
  const { width, height, bpp, data } = decodePng(file);
  const cache = new Map();
  const classify = (i) => { const key = (data[i] << 16) | (data[i + 1] << 8) | data[i + 2]; let e = cache.get(key);
    if (!e) { const [, C, H] = oklch(data[i], data[i + 1], data[i + 2]); e = C <= NEUTRAL_MAX ? ["neutral", ""] : [C < COLORED_MIN ? "tinted" : "colored", family(H)]; cache.set(key, e); } return e; };
  // Which pictures are in natural color?
  const skip = new Uint8Array(width * height); let natural = 0;
  for (const p of pictures) { const x0 = Math.max(0, Math.round(p.x)), y0 = Math.max(0, Math.round(p.y)), x1 = Math.min(width, Math.round(p.x + p.width)), y1 = Math.min(height, Math.round(p.y + p.height));
    if (x1 - x0 < 8 || y1 - y0 < 8) continue; const fams = {}; let n = 0;
    for (let y = y0; y < y1; y += 2) for (let x = x0; x < x1; x += 2) { const e = classify((y * width + x) * bpp); n++; if (e[1]) fams[e[1]] = (fams[e[1]] || 0) + 1; }
    if (Object.values(fams).filter((c) => c / n >= 0.08).length >= 2) { natural++; for (let y = y0; y < y1; y++) skip.fill(1, y * width + x0, y * width + x1); } }
  const band = { neutral: 0, tinted: 0, colored: 0 }, fam = {}; let total = 0;
  for (let px = 0, i = 0; i < data.length; i += bpp, px++) {
    if (skip[px]) continue; total++;
    const e = classify(i);
    band[e[0]]++;
    if (e[1]) { fam[e[1]] ??= { tinted: 0, colored: 0 }; fam[e[1]][e[0]]++; }
  }
  total = Math.max(1, total);
  const pct = (n) => Math.round((n / total) * 1000) / 10;
  const families = Object.entries(fam).map(([name, v]) => ({ name, tinted: pct(v.tinted), colored: pct(v.colored), all: pct(v.tinted + v.colored) })).sort((a, b) => b.all - a.all);
  return { image: basename(file), size: `${width}x${height}`, naturalPicturesLeftOut: natural, neutral: pct(band.neutral), tinted: pct(band.tinted), colored: pct(band.colored),
    wash: families[0] ? families[0].all : 0, washHue: families[0] ? families[0].name : "none", families: families.filter((f) => f.all >= 1) };
}

/**
 * How a picture is drawn, read from a screenshot.
 * `edges`: the share of neighboring pixels that jump sharply in lightness. Hatching and engraved or woodcut linework give
 * a high share. So do photographs of leaves, gravel, hair and film grain.
 * `ground`: the share of the picture's own edge that is one flat color. A drawing sits on a ground, paper or a field of
 * color. A photograph runs to its edges. Nine drawings measured 63% to 99%, three photographs 8% to 32%.
 * `rect` is { x, y, width, height } in image pixels.
 */
export function pictureTexture(file, rect) {
  const { width, height, bpp, data } = decodePng(file);
  const x0 = Math.max(0, Math.round(rect.x)), y0 = Math.max(0, Math.round(rect.y)), x1 = Math.min(width, Math.round(rect.x + rect.width)), y1 = Math.min(height, Math.round(rect.y + rect.height));
  let pairs = 0, jumps = 0;
  for (let y = y0; y < y1; y += 2) { let prev = null; for (let x = x0; x < x1; x++) { const i = (y * width + x) * bpp, l = oklch(data[i], data[i + 1], data[i + 2])[0];
      if (prev !== null) { pairs++; if (Math.abs(l - prev) >= 0.18) jumps++; } prev = l; } }
  const rim = [], put = (x, y) => { const i = (y * width + x) * bpp; rim.push([data[i], data[i + 1], data[i + 2]]); };
  for (let x = x0 + 2; x < x1 - 2; x++) for (const y of [y0 + 2, y0 + 4, y1 - 5, y1 - 3]) if (y > y0 && y < y1) put(x, y);
  for (let y = y0 + 2; y < y1 - 2; y++) for (const x of [x0 + 2, x0 + 4, x1 - 5, x1 - 3]) if (x > x0 && x < x1) put(x, y);
  const bins = new Map(); for (const [r, g, b] of rim) { const k = ((r >> 4) << 8) | ((g >> 4) << 4) | (b >> 4), v = bins.get(k) || [0, 0, 0, 0]; v[0]++; v[1] += r; v[2] += g; v[3] += b; bins.set(k, v); }
  const top = [...bins.values()].sort((p, q) => q[0] - p[0])[0], m = top ? [top[1] / top[0], top[2] / top[0], top[3] / top[0]] : [0, 0, 0];
  const ground = rim.length ? Math.round((100 * rim.filter(([r, g, b]) => Math.hypot(r - m[0], g - m[1], b - m[2]) <= 24).length) / rim.length) : 0;
  return { edges: pairs ? Math.round((1000 * jumps) / pairs) / 10 : 0, ground };
}

function report(m) {
  const lines = [`${m.image}  ${m.size}`, `  neutral ${m.neutral}%   tinted ${m.tinted}%   colored ${m.colored}%`];
  if (m.families.length) lines.push("  hues: " + m.families.map((f) => `${f.name} ${f.all}% (tinted ${f.tinted}, colored ${f.colored})`).join("; "));
  const top = [...m.families].sort((a, b) => b.tinted - a.tinted)[0];
  if (m.tinted > 10 && top) lines.push(`  FAIL   ${m.tinted}% of this image is gray that leans toward a hue, mostly ${top.name} (limit 10%). That is a one-hue wash.`,
    "         Find what carries it: neutral tokens above 0.01 chroma, a tinted panel or section, or an illustration printed in the accent's ink.",
    "         Make the neutrals gray, and give pictures their own colors or black and white. A full-color photograph is the one exception.");
  else lines.push(`  PASS   the grays are gray (tinted share ${m.tinted}%, limit 10%).`);
  if (m.colored > 25) lines.push(`  NOTE   ${m.colored}% of this image is plain color. That is right only if the brief's Palette line names a flooded field or the`, "         screen is mostly photographs.");
  const strong = m.families.filter((f) => f.colored >= 1).map((f) => f.name);
  if (strong.length) lines.push(`  hues with real color on screen: ${strong.join(", ")}. Each one should be named on the Palette line or be a status color or a photograph.`);
  return lines.join("\n");
}

if (process.argv[1] && process.argv[1].endsWith("palette.mjs")) {
  const args = process.argv.slice(2), json = args.includes("--json"), files = args.filter((a) => a !== "--json");
  if (!files.length) { console.error("usage: node palette.mjs [--json] <screenshot.png> [...]"); process.exit(2); }
  let failed = false;
  for (const f of files) { const m = measure(f); if (m.tinted > 10) failed = true; console.log(json ? JSON.stringify(m) : report(m)); }
  if (!json) console.log("\nFor scale: of the first screens of 32 well-known product and brand sites, 20 had under 5% tinted. Tinted is the share to keep low. How much is plainly colored is the design's own decision.");
  process.exit(failed ? 1 : 0);
}
