// Counts the limits from section 7 of the skill in a project's source and prints PASS, FAIL or NOTE for each.
//
//   node check.mjs <project folder or file> [<more files or folders> ...] [--brand-font "Family Name"]
//
// --brand-font names a typeface the user or an existing brand supplied, so it is not reported as a reflex choice.
// It can be given more than once.
//
// It reads .css files, <style> blocks and style attributes in .html, .htm, .vue, .svelte and .astro files, and the
// text of headings in HTML. It skips node_modules and folders whose name starts with a dot. For a project that
// styles with utility classes (Tailwind and similar), point it at the compiled stylesheet as well.
// The exit code is 1 when any line is a FAIL. A NOTE is something to look at and decide.
// No dependencies beyond Node 18 or later.
import { readFile, readdir, stat } from "node:fs/promises";
import { join, extname, resolve, relative } from "node:path";
import { oklch, family, NEUTRAL_MAX, COLORED_MIN } from "./palette.mjs";

const argv = process.argv.slice(2), brandFonts = [], args = [];
for (let i = 0; i < argv.length; i++) { if (argv[i] === "--brand-font") brandFonts.push((argv[++i] || "").toLowerCase()); else args.push(argv[i]); }
if (!args.length) { console.error('usage: node check.mjs <project folder or file> [...] [--brand-font "Family Name"]'); process.exit(2); }
const STYLE_EXT = [".css"], MARKUP_EXT = [".html", ".htm", ".vue", ".svelte", ".astro"];

async function walk(p) {
  const s = await stat(p);
  if (s.isFile()) return [p];
  const out = [];
  for (const e of await readdir(p, { withFileTypes: true })) {
    if (e.name === "node_modules" || e.name.startsWith(".")) continue;
    const child = join(p, e.name);
    if (e.isDirectory()) out.push(...(await walk(child)));
    else if ([...STYLE_EXT, ...MARKUP_EXT].includes(extname(e.name).toLowerCase())) out.push(child);
  }
  return out;
}

const root = resolve(args[0]);
const files = [...new Set((await Promise.all(args.map((a) => walk(resolve(a))))).flat())];
let css = "", html = "", staticSite = true;
try { await stat(join((await stat(root)).isDirectory() ? root : resolve(root, ".."), "package.json")); staticSite = false; } catch {}
for (const f of files) {
  const text = await readFile(f, "utf8");
  if (STYLE_EXT.includes(extname(f).toLowerCase())) { css += "\n" + text; continue; }
  html += "\n" + text;
  for (const m of text.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)) css += "\n" + m[1];
  for (const m of text.matchAll(/\sstyle\s*=\s*"([^"]*)"/gi)) css += `\n.inline-style{${m[1]}}`;
}
css = css.replace(/\/\*[\s\S]*?\*\//g, "");
if (!css.trim()) { console.log("No CSS found in " + files.length + " files. Pass the folder that holds the stylesheets, or the compiled stylesheet itself."); process.exit(2); }

// ---- declarations and tokens
const decls = [...css.matchAll(/(?:^|[;{}\s])(-{0,2}[a-zA-Z][\w-]*)\s*:\s*([^;{}]+)(?=[;}])/g)].map((m) => [m[1].toLowerCase(), m[2].trim()]);
const tokens = new Map();
for (const [p, v] of decls) if (p.startsWith("--") && !tokens.has(p)) tokens.set(p, v);
const resolveVars = (v, depth = 0) => depth > 6 ? v : v.replace(/var\(\s*(--[\w-]+)\s*(?:,\s*([^()]*(?:\([^()]*\))?[^()]*))?\)/g,
  (_, n, fb) => tokens.has(n) ? resolveVars(tokens.get(n), depth + 1) : (fb ? resolveVars(fb.trim(), depth + 1) : `var(${n})`));
const plain = decls.filter(([p]) => !p.startsWith("--"));
const uniq = (a) => [...new Set(a)];
// Split on a separator only outside parentheses and quotes, so clamp(1rem, 2vw, 2rem) stays one value.
const splitTop = (v, sep) => { const out = []; let depth = 0, quote = "", cur = "";
  for (const ch of v) { if (quote) { cur += ch; if (ch === quote) quote = ""; continue; } if (ch === '"' || ch === "'") { quote = ch; cur += ch; continue; }
    if (ch === "(") depth++; if (ch === ")") depth--; if (!depth && sep.test(ch)) { if (cur) out.push(cur); cur = ""; continue; } cur += ch; }
  if (cur) out.push(cur); return out; };
// The font shorthand: [style] [weight] size[/line-height] family. Returns the size and the family list.
const parseFont = (v) => { const parts = splitTop(v, /\s/), i = parts.findIndex((t) => /^(\d*\.?\d+(px|rem|em|%|vw)|clamp\(|calc\(|min\(|max\(|var\()/.test(t)); if (i < 0) return null;
  let rest = parts.slice(i + 1); if (rest[0] === "/") rest = rest.slice(2); else if (rest[0] && rest[0].startsWith("/")) rest = rest.slice(1);
  return { size: splitTop(parts[i], /\//)[0], family: rest.join(" ") }; };
const toPx = (v) => { const c = v.match(/^clamp\(\s*([^,]+),/); if (c) return toPx(c[1].trim()); const m = v.match(/^(-?\d*\.?\d+)(px|rem)$/); return m ? Math.round(parseFloat(m[1]) * (m[2] === "rem" ? 16 : 1) * 100) / 100 : null; };

const lines = []; let failed = 0;
const say = (kind, name, text) => { if (kind === "FAIL") failed++; lines.push(`${kind}  ${name.padEnd(24)} ${text}`); };
const list = (a, n = 6) => a.slice(0, n).join(", ") + (a.length > n ? `, and ${a.length - n} more` : "");

// ---- type
const sizeDecls = plain.filter(([p]) => p === "font-size").map(([, v]) => v);
const shorthands = plain.filter(([p]) => p === "font").map(([, v]) => parseFont(resolveVars(v))).filter(Boolean);
const shorthandSizes = shorthands.map((f) => f.size);
const sizes = uniq([...sizeDecls.map((v) => resolveVars(v)), ...shorthandSizes]).filter((v) => !/^(inherit|1em|100%)$/.test(v));
const px = sizes.map(toPx).filter((n) => n !== null).sort((a, b) => a - b);
say(sizes.length <= 7 ? "PASS" : "FAIL", "font sizes", `${sizes.length} distinct (limit 7)` + (sizes.length > 7 ? ": " + list(sizes, 12) : ""));
if (px.length) say(px[0] >= 12 ? "PASS" : "FAIL", "smallest font size", `${px[0]}px (minimum 12px)` + (px[0] < 12 ? ": " + list(px.filter((n) => n < 12).map((n) => n + "px")) : ""));
const rawSizes = sizeDecls.filter((v) => !/^var\(/.test(v) && !/^(inherit|1em|100%)$/.test(v));
say(rawSizes.length ? "FAIL" : "PASS", "sizes outside tokens", `${rawSizes.length} of ${sizeDecls.length} font-size declarations are not var(--token)` + (rawSizes.length ? ": " + list(uniq(rawSizes)) : ""));

const SYSTEM = /^(system-ui|ui-sans-serif|ui-serif|ui-monospace|ui-rounded|-apple-system|blinkmacsystemfont|segoe ui|helvetica neue|helvetica|arial|georgia|times new roman|times|courier new|courier|menlo|monaco|consolas|sfmono-regular|sf mono|liberation mono|sans-serif|serif|monospace|cursive|inherit|initial)$/i;
const MONO = /mono|menlo|monaco|consolas|courier/i;
const stacks = [...plain.filter(([p]) => p === "font-family").map(([, v]) => resolveVars(v)),
  ...shorthands.map((f) => f.family).filter(Boolean)];
const firsts = uniq(stacks.map((v) => v.split(",")[0].replace(/["']/g, "").trim()).filter((v) => v && !/^(inherit|initial|unset)$/.test(v)));
const textFamilies = uniq(firsts.filter((f) => !MONO.test(f)).map((f) => (SYSTEM.test(f) ? "system font" : f)));
say(textFamilies.length <= 2 ? "PASS" : "FAIL", "font families", `${textFamilies.length}${firsts.some((f) => MONO.test(f)) ? " plus monospace" : ""} (limit 2): ${list(textFamilies)}`);
const loaded = [...css.matchAll(/@font-face\s*{[^}]*font-family\s*:\s*["']?([^;"'}]+)/gi)].map((m) => m[1].trim().toLowerCase())
  .concat([...(css + html).matchAll(/family=([^&"')\s:;]+)/g)].map((m) => decodeURIComponent(m[1]).replace(/\+/g, " ").toLowerCase()))
  .concat([...(css + html).matchAll(/f\[\]=([a-z0-9-]+)@/gi)].map((m) => m[1].replace(/-/g, " ").toLowerCase()));
const hostedElsewhere = /use\.typekit\.net|fonts\.adobe\.com|next\/font|@fontsource/i.test(css + html);
const notLoaded = firsts.filter((f) => !SYSTEM.test(f) && !loaded.includes(f.toLowerCase()));
if (notLoaded.length) say(staticSite && !hostedElsewhere ? "FAIL" : "NOTE", "fonts not loaded", `${list(notLoaded)} ${notLoaded.length > 1 ? "are" : "is"} first in a stack, and no @font-face rule or font link loads ${notLoaded.length > 1 ? "them" : "it"}`);
else say("PASS", "fonts not loaded", "every named font is loaded or is a system font");

// Faces that generated pages reach for whatever the subject (references/typography.md, "Reflex picks")
const REFLEX = ["dm sans", "dm serif", "space grotesk", "space mono", "playfair display", "fraunces", "newsreader", "lora", "cormorant", "instrument serif", "instrument sans", "plus jakarta sans", "outfit", "manrope", "poppins", "montserrat",
  "syne", "bricolage grotesque", "sora", "urbanist", "barlow condensed", "bebas neue", "anton", "oswald", "chivo", "work sans", "gloock"];
const reflexUsed = firsts.filter((f) => REFLEX.some((r) => f.toLowerCase().startsWith(r)) && !brandFonts.includes(f.toLowerCase()));
say(reflexUsed.length ? "FAIL" : "PASS", "reflex typefaces", reflexUsed.length ? `${list(reflexUsed)}: among the faces generated pages use whatever the subject. Find one from this subject's own lettering (references/typography.md, "Finding a face"). If the user or an existing brand supplied it, run again with --brand-font "${reflexUsed[0]}".` : "none of the usual faces");

// ---- color
const COLOR = /#[0-9a-fA-F]{3,8}\b|\b(?:rgba?|hsla?|oklch|oklab|lch|lab|hwb|color)\([^)]*\)|\b(?:white|black)\b/g;
const colorProps = /color|background|border|outline|shadow|fill|stroke|gradient|caret|accent|decoration/;
const rawColors = plain.filter(([p]) => colorProps.test(p)).flatMap(([p, v]) => (v.replace(/var\([^)]*\)/g, "").replace(/color-mix\(in [a-z]+/g, "").match(COLOR) || []).map((c) => `${p}: ${c}`));
say(rawColors.length ? "FAIL" : "PASS", "colors outside tokens", `${rawColors.length} color literals in ordinary declarations` + (rawColors.length ? ", e.g. " + list(uniq(rawColors), 4) : ""));

const toLch = (c) => {
  let m = c.match(/^#([0-9a-f]{3,8})$/i);
  if (m) { let h = m[1]; if (h.length <= 4) h = [...h].map((x) => x + x).join(""); return oklch(parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)); }
  m = c.match(/^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/i); if (m) return oklch(Math.round(+m[1]), Math.round(+m[2]), Math.round(+m[3]));
  m = c.match(/^oklch\(\s*([\d.]+)(%?)\s+([\d.]+)(%?)\s+([\d.]+)/i); if (m) return [m[2] ? +m[1] / 100 : +m[1], m[4] ? +m[3] * 0.004 : +m[3], +m[5]];
  return null;
};
const STATUS = /success|warn|danger|error|info|positive|negative|alert|critical|status|late|fail|delivered|scheduled|pending/i;
const tinted = {}, colored = {}; let colorTokens = 0, neutralTokens = 0;
for (const [name, value] of tokens) {
  const lit = resolveVars(value).match(/#[0-9a-fA-F]{3,8}\b|\b(?:rgba?|oklch)\([^)]*\)/); if (!lit) continue;
  const lch = toLch(lit[0]); if (!lch) continue;
  colorTokens++;
  if (lch[1] <= NEUTRAL_MAX) { neutralTokens++; continue; }
  const bucket = lch[1] < COLORED_MIN ? tinted : colored, fam = family(lch[2]);
  (bucket[fam] ??= []).push(`${name} ${lit[0]} (chroma ${lch[1].toFixed(3)}${STATUS.test(name) ? ", status" : ""})`);
}
if (colorTokens) {
  const washed = Object.entries(tinted).map(([fam, names]) => [fam, names.filter((n) => !n.includes(", status"))]).filter(([, names]) => names.length > 2);
  if (washed.length) for (const [fam, names] of washed) say("FAIL", "tinted neutrals", `${names.length} tokens are grays that lean ${fam} (limit 2 per hue; neutral chroma should be 0.01 or less): ${list(names, 5)}`);
  else say("PASS", "tinted neutrals", `${neutralTokens} of ${colorTokens} color tokens are plain neutral; no hue has more than 2 tinted grays`);
  const hues = Object.entries(colored).map(([fam, names]) => `${fam} (${names.length} token${names.length > 1 ? "s" : ""}${names.every((n) => n.includes(", status")) ? ", all status" : ""})`);
  say("NOTE", "hues in use", hues.length ? `${hues.join(", ")}. Each hue that is not a status color must be named on the brief's Palette line.` : "none: the palette is neutral only");
} else say("NOTE", "tinted neutrals", "no color tokens found, so the neutrals could not be checked. Define colors as custom properties first.");

// ---- the accent against the brief
// The design record carries one line, "Accent: <word>": the hue the count selected, "none", or "supplied" when
// the user or a brand gave the color. Each hue has a core range of OKLCH hue angles. Two bands belong to no hue,
// because they are where a generated page lands whatever was asked for: 31 to 44 (vermilion, coral, rust) and
// 109 to 124 (lime). The accent is the hue token the stylesheet uses most; status colors are left out.
const CORE = { red: [[350, 360], [0, 30]], orange: [[45, 72]], yellow: [[80, 108]], green: [[125, 170]], teal: [[170, 210]], blue: [[210, 270]], purple: [[270, 320]], pink: [[320, 350]] };
const inCore = (fam, h) => CORE[fam].some(([a, b]) => h >= a && h <= b);
const rangeOf = (fam) => fam === "red" ? "350 to 30" : `${CORE[fam][0][0]} to ${CORE[fam][0][1]}`;
// ---- the count that chooses the direction. The Chosen line quotes the first sentence of the request, gives its number
// of words, and names the direction: remainder 0 is (a), 1 is (b), 2 is (c). The request is the one thing the builder did
// not write. A name it made up could be made to fit, which is how six one-line requests came out with one first screen.
{
  let base = root; try { if (!(await stat(root)).isDirectory()) base = resolve(root, ".."); } catch {}
  let chosen = null;
  try { for (const f of (await readdir(join(base, ".interface-design"))).filter((f) => f.endsWith(".md")).sort()) {
    const lines = (await readFile(join(base, ".interface-design", f), "utf8")).split(/\r?\n/); const i = lines.findIndex((l) => /^[\s>*_`#-]{0,6}chosen\b/i.test(l));
    if (i >= 0) { chosen = lines.slice(i, i + 3).join(" "); break; } } } catch {}
  if (chosen !== null) { const label = "chosen by the count", WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen", "twenty", "twenty-one", "twenty-two", "twenty-three", "twenty-four", "twenty-five", "twenty-six", "twenty-seven", "twenty-eight", "twenty-nine", "thirty"];
    const q = chosen.match(/["\u201C]([^"\u201D]{3,})["\u201D]/), sentence = q ? q[1].trim() : "", n = sentence.split(/\s+/).filter((t) => /[A-Za-z0-9]/.test(t)).length;
    const rest = q ? chosen.slice(chosen.indexOf(q[0]) + q[0].length) : chosen, nums = [...rest.matchAll(/\b(\d{1,3})\b/g)].map((m) => +m[1]).concat(WORDS.map((w, k) => (new RegExp("\\b" + w + "\\b", "i").test(rest) ? k : -1)).filter((k) => k >= 0));
    const letter = (rest.match(/\(([abc])\)/i) || rest.match(/\b(?:direction|selects|choose[sn]?|picks?)\s+\(?([abc])\b/i) || [])[1], want = "abc"[n % 3];
    if (!q || n < 3) say("FAIL", label, `the Chosen line does not quote the first sentence of the request. Quote it in quotation marks, give its number of words, and name the direction that number selects: remainder 0 is (a), 1 is (b), 2 is (c). The name is not counted.`);
    else if (!nums.includes(n)) say("FAIL", label, `the sentence quoted on the Chosen line ("${sentence.slice(0, 60)}${sentence.length > 60 ? "…" : ""}") has ${n} words, and the line gives ${nums.length ? nums.slice(0, 3).join(", ") : "no number"}. ${n} leaves a remainder of ${n % 3}, which selects (${want}). Build that direction.`);
    else if (letter && letter.toLowerCase() !== want) say("FAIL", label, `${n} words leaves a remainder of ${n % 3}, which selects (${want}), and the Chosen line names (${letter.toLowerCase()}). Build direction (${want}), and take the accent and the typefaces by the same number.`);
    else say("PASS", label, `${n} words in the quoted sentence, remainder ${n % 3}, direction (${want})`);
  }
}
async function declaredAccent() {
  let base = root; try { if (!(await stat(root)).isDirectory()) base = resolve(root, ".."); } catch {}
  const dir = join(base, ".interface-design"); let records = [];
  try { records = (await readdir(dir)).filter((f) => f.endsWith(".md")).sort(); } catch { return { record: false }; }
  if (!records.length) return { record: false };
  const WORDS = [...Object.keys(CORE), "none", "supplied"];
  for (const f of records) { let text = ""; try { text = await readFile(join(dir, f), "utf8"); } catch { continue; }
    for (const line of text.split(/\r?\n/)) { const at = line.search(/\baccent\b/i); if (at < 0 || at > 12) continue;
      const after = line.slice(at + 6, at + 70).toLowerCase(), named = WORDS.filter((w) => new RegExp("\\b" + w + "\\b").test(after));
      if (named.length === 1) return { record: true, word: named[0], from: ".interface-design/" + f }; } }
  return { record: true, word: null };
}
const hslToLch = (c) => { const m = c.match(/^hsla?\(\s*([\d.]+)(?:deg)?[,\s]+([\d.]+)%[,\s]+([\d.]+)%/i); if (!m) return null; const h = +m[1] / 360, s = +m[2] / 100, l = +m[3] / 100;
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q, ch = (t) => { t = (t + 1) % 1; return t < 1 / 6 ? p + (q - p) * 6 * t : t < 1 / 2 ? q : t < 2 / 3 ? p + (q - p) * (2 / 3 - t) * 6 : p; };
  return oklch(Math.round(ch(h + 1 / 3) * 255), Math.round(ch(h) * 255), Math.round(ch(h - 1 / 3) * 255)); };
const accent = await declaredAccent();
if (accent.record) {
  const everything = css + "\n" + html, candidates = [];
  for (const [name, value] of tokens) { if (STATUS.test(name)) continue;
    const lit = resolveVars(value).match(/#[0-9a-fA-F]{3,8}\b|\b(?:rgba?|oklch|hsla?)\([^)]*\)/); if (!lit) continue;
    const lch = toLch(lit[0]) || hslToLch(lit[0]); if (!lch || lch[1] < COLORED_MIN) continue;
    const uses = (everything.match(new RegExp("var\\(\\s*" + name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\s*[,)]", "g")) || []).length;
    candidates.push({ name, lit: lit[0], hue: Math.round(lch[2]) % 360, chroma: lch[1], uses }); }
  const used = candidates.filter((c) => c.uses > 0).sort((a, b) => b.uses - a.uses || b.chroma - a.chroma), top = used[0], label = "accent matches the brief";
  const WORDLIST = `${Object.keys(CORE).join(", ")}`;
  if (!accent.word) say("FAIL", label, `the design record has no Accent line. Add one line with one word on it: the hue the count selected (${WORDLIST}), "none" if the selected name is black, white or gray, or "supplied" if the user or a brand gave the color.`);
  else if (accent.word === "supplied") say("PASS", label, "the record says the color was supplied by the user or a brand");
  else if (accent.word === "none") say(used.length ? "FAIL" : "PASS", label, used.length ? `the design record says this page has no accent hue, but ${list(used.map((c) => `${c.name} ${c.lit} (${c.uses} use${c.uses > 1 ? "s" : ""})`), 3)} is in use. Black does the accent's work on this page: take the hue out. Change the line only if the count was read wrong.` : "no accent hue, as the record says");
  else if (!top) say("FAIL", label, `the design record says "Accent: ${accent.word}", but no ${accent.word} token is used anywhere in the stylesheet.`);
  else { const ok = inCore(accent.word, top.hue), actual = Object.keys(CORE).find((f) => inCore(f, top.hue));
    const where = top.hue > 30 && top.hue < 45 ? "between red and orange (vermilion, coral, rust), the band generated pages land in whatever was asked for" : top.hue > 108 && top.hue < 125 ? "between yellow and green (lime), a band generated pages land in whatever was asked for" : actual ? `which is ${actual}` : "between two hues";
    say(ok ? "PASS" : "FAIL", label, ok ? `${accent.word}: ${top.name} ${top.lit}, hue ${top.hue}` : `the design record says "Accent: ${accent.word}", but the color the page uses most (${top.name} ${top.lit}, ${top.uses} use${top.uses > 1 ? "s" : ""}) has an OKLCH hue of ${top.hue}, ${where}. A ${accent.word} has a hue of ${rangeOf(accent.word)}. Change the color to match the line, and any picture that was made in the old color. Change the line only if the count was read wrong.`); }
}

// ---- where color is used: rules with their selectors
function rules(text, out = []) { let i = 0;
  while (i < text.length) { const open = text.indexOf("{", i); if (open < 0) break; let depth = 1, j = open + 1;
    while (j < text.length && depth) { if (text[j] === "{") depth++; else if (text[j] === "}") depth--; j++; }
    const prelude = text.slice(i, open).split(/[;}]/).pop().trim(), block = text.slice(open + 1, j - 1);
    if (/^@(media|supports|layer|container)/.test(prelude)) rules(block, out); else if (!prelude.startsWith("@")) out.push([prelude, block.replace(/[^{}]*\{[^{}]*\}/g, "")]);
    i = j; } return out; }
const firstColor = (v) => { const lit = resolveVars(v).match(/#[0-9a-fA-F]{3,8}\b|\b(?:rgba?|oklch)\([^)]*\)/); return lit ? toLch(lit[0]) : null; };
let colorDecls = 0, hueDecls = 0; const hueFamilies = {}, coloredText = [];
for (const [selector, body] of rules(css)) for (const m of body.matchAll(/(?:^|;|\s)(color|background|background-color|border(?:-[a-z]+)*|outline(?:-color)?|fill|stroke)\s*:\s*([^;]+)/g)) {
  if (STATUS.test(m[2])) continue;
  const lch = firstColor(m[2]); if (!lch) continue;
  colorDecls++;
  if (lch[1] < COLORED_MIN) continue;
  hueDecls++; const fam = family(lch[2]); hueFamilies[fam] = (hueFamilies[fam] || 0) + 1;
  // Text set in a hue: the subject of the selector is the page, a paragraph or a heading (an emphasized phrase inside a heading is counted elsewhere)
  if (m[1] === "color" && selector.split(",").some((part) => /(^|[\s>+~])(body|html|p|h[1-4])(\.[\w-]+|:[\w-]+(\([^)]*\))?)*$/.test(part.trim()))) coloredText.push(`${selector.replace(/\s+/g, " ").slice(0, 40)} (${fam})`);
}
if (colorDecls) {
  say(coloredText.length ? "FAIL" : "PASS", "text in a hue", coloredText.length ? `headings and body text are black, white or gray, and these are colored: ${list(uniq(coloredText), 5)}` : "headings and body text are neutral");
  const share = Math.round((100 * hueDecls) / colorDecls);
  say(share > 30 ? "FAIL" : "PASS", "color spend", `${hueDecls} of ${colorDecls} color declarations use a hue, status colors aside (${share}%, limit 30%)` + (hueDecls ? ": " + Object.entries(hueFamilies).map(([f, n]) => `${f} ${n}`).join(", ") : "") + (share > 30 ? ". The accent is on too many things to mark any of them." : ""));
}

// ---- shape and space
const FULL = /^(50%|9{3,}px|9{3,}(\.\d+)?px|100vmax|calc\(infinity)/;
const radii = uniq(plain.filter(([p]) => /^border(-[a-z]+)*-radius$/.test(p)).flatMap(([, v]) => splitTop(resolveVars(v), /[\s/]/)).filter((v) => v && v !== "0" && v !== "0px" && v !== "inherit").map((v) => (FULL.test(v) ? "full" : v)));
say(radii.length <= 4 ? "PASS" : "FAIL", "radius values", `${radii.length} distinct (limit 4): ${list(radii, 10)}`);
const spacing = plain.filter(([p]) => /^(margin|padding|gap|row-gap|column-gap)(-|$)/.test(p)).map(([, v]) => v);
const spacingRaw = spacing.filter((v) => /\d/.test(v.replace(/var\([^)]*\)/g, "").replace(/\b0\b/g, "")));
if (spacing.length) say("NOTE", "spacing", `${spacing.length - spacingRaw.length} of ${spacing.length} spacing declarations use only tokens. The rest should be steps on the spacing scale` + (spacingRaw.length ? `, e.g. ${list(uniq(spacingRaw), 5)}` : ""));

// ---- motion and focus
const transitionAll = (css.match(/transition(-property)?\s*:\s*all\b/g) || []).length;
say(transitionAll ? "FAIL" : "PASS", "transition: all", `${transitionAll} (name the properties that change)`);
const hasMotion = /\b(transition|animation)(-[a-z]+)?\s*:/.test(css) || /@keyframes/.test(css);
if (hasMotion) say(/prefers-reduced-motion/.test(css) ? "PASS" : "FAIL", "reduced motion", /prefers-reduced-motion/.test(css) ? "a prefers-reduced-motion rule exists" : "the page has transitions or animations and no prefers-reduced-motion rule");
const outlineOff = (css.match(/outline\s*:\s*(none|0)\b/g) || []).length;
if (outlineOff) say(/:focus-visible/.test(css) ? "NOTE" : "FAIL", "focus outline", `outline is removed ${outlineOff} time${outlineOff > 1 ? "s" : ""}` + (/:focus-visible/.test(css) ? "; confirm each of those elements gets a visible :focus-visible style" : " and no :focus-visible rule replaces it"));

// ---- markup
if (html.trim()) {
  const text = (s) => s.replace(/<br\s*\/?>/gi, " ").replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
  const heads = [...html.matchAll(/<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/gi)].map((m) => text(m[1])).filter(Boolean);
  const twoFragment = heads.filter((h) => /^[^.!?]{2,40}[.!?]\s*[^.!?]{2,40}[.!?]$/.test(h));
  if (heads.length) say(twoFragment.length > 1 ? "FAIL" : twoFragment.length ? "NOTE" : "PASS", "two-fragment headings", `${twoFragment.length} of ${heads.length} headings are two short fragments (limit 1)` + (twoFragment.length ? ": " + list(twoFragment.map((h) => `"${h}"`), 4) : ""));
  const imgs = [...html.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0]);
  const noAlt = imgs.filter((i) => !/\salt\s*=/.test(i)).length, noSize = imgs.filter((i) => !/\swidth\s*=/.test(i) || !/\sheight\s*=/.test(i)).length;
  if (imgs.length) { say(noAlt ? "FAIL" : "PASS", "image alt text", `${noAlt} of ${imgs.length} images have no alt attribute`); if (noSize) say("NOTE", "image dimensions", `${noSize} of ${imgs.length} images have no width and height, so the page may shift as they load`); }
  if (/user-scalable\s*=\s*no|maximum-scale\s*=\s*1(\.0)?\b/.test(html)) say("FAIL", "zoom", "the viewport meta tag stops people zooming");
  if (/<html\b/i.test(html)) {
    const missing = [[/<html\b[^>]*\slang\s*=/i, "lang on <html>"], [/<title>[^<]+<\/title>/i, "a title"], [/<meta[^>]+name=["']description["']/i, "a meta description"], [/<meta[^>]+name=["']viewport["']/i, "a viewport meta tag"],
      [/<link[^>]+rel=["'][^"']*icon/i, "an icon"], [/<meta[^>]+property=["']og:image["']/i, "a social preview image"]].filter(([re]) => !re.test(html)).map(([, name]) => name);
    say(missing.length ? "NOTE" : "PASS", "page basics", missing.length ? "missing " + list(missing, 8) : "lang, title, description, viewport, icon and social preview are present");
  }
  const filler = uniq((text(html).match(/lorem ipsum|john doe|jane doe|acme (inc|corp|co)\b|your (company|name|logo) here|placeholder text/gi) || []).map((s) => s.toLowerCase()));
  if (filler.length) say("FAIL", "placeholder content", list(filler));
}

console.log(`better-design check: ${relative(process.cwd(), root) || "."}  (${files.length} file${files.length === 1 ? "" : "s"} read, ${tokens.size} tokens)\n`);
console.log(lines.join("\n"));
console.log(`\n${failed ? failed + " FAIL. Fix these, then run the check again." : "No FAIL."} A NOTE is something to look at and decide. This script counts; it cannot tell whether the page was designed. Do the Look step as well.`);
process.exit(failed ? 1 : 0);
