// Opens the built page in a real browser, captures it at three widths, and checks what can only be seen once it
// is rendered. Prints PASS, FAIL or NOTE for each check. This is the mechanical half of the Look step in section 7.
//
//   node look.mjs <project folder | URL> [--out <folder>] [--asked-for-split] [--asked-for-drawing] [--showpiece] [--ui-sdk-ruled-out "<words>"] [--no-agent-bridge "<words>"] [--json]
//
//   <project folder>   a static site with index.html: it is served locally for the run
//   <URL>              a page that is already being served, e.g. http://localhost:5173/
//   --out              where the captures and report go (default: .interface-design/review in the current folder)
//   --asked-for-split  the user's brief or mockup asks for text on one side and a picture on the other
//   --asked-for-drawing  the user asked for illustration, or the brand already uses an engraved or hatched style
//   --showpiece        check the page as a showpiece; normally read from "Register: showpiece" in .interface-design/*.md
// A piece (one object the person acts on: a game, a kiosk, a configurator) is read from "Register: piece" in the same
// record, and its object is the one element marked data-stage. A line `Look: supplied: "<the request's words>"` there
// says the request names the look, which allows a drawn picture.
//   --ui-sdk-ruled-out "<words>"  the user's own words that rule UI SDK out, quoted: they name another component
//                      library, say no UI SDK, no external libraries, or that the page must work offline, or the work
//                      restyles a front-end that already exists. The UI SDK check then becomes a NOTE.
//                      "Plain HTML, CSS and JavaScript", "a static page", "a single file" and "no build step" do NOT
//                      rule it out: its web components are HTML tags and one script tag. With such words the check
//                      still fails.
//   --no-agent-bridge "<words>"  the user's own words saying the page must not be operable by an AI agent, quoted.
//                      The agent bridge check then becomes a NOTE.
//
// Besides contrast, overflow, focus and console errors, it checks the habits of generated pages: the first-screen
// layout, dots and badges, lines beside headings, paper props, several controls that lead to one place, arrows on
// controls, a slogan headline, italic fragments in headings, icon size and alignment, and whether the controls are
// UI SDK parts (references/ui-sdk.md).
// Captures: desktop.png, tablet.png, phone.png (first screen) and desktop-full.png, phone-full.png (whole page).
// The exit code is 1 when any line is a FAIL, and 2 when no browser could be started or the in-page checks broke.
// Needs Node 18 or later and any Chromium-based browser: one that Playwright or Puppeteer downloaded, or Chrome,
// Chromium or Edge. Set CHROME=/path/to/browser to choose one. No packages to install.
import { spawn, execFileSync } from "node:child_process";
import { createServer } from "node:http";
import { readFile, writeFile, mkdir, mkdtemp, rm, readdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { tmpdir, homedir } from "node:os";
import { join, extname, normalize, resolve } from "node:path";
import { measure, pictureTexture } from "./palette.mjs";
import { HABITS } from "./habits.mjs";

const argv = process.argv.slice(2);
const flag = (name) => argv.includes(name);
const option = (name) => { const i = argv.indexOf(name); return i >= 0 ? argv[i + 1] : null; };
const target = argv.find((a, i) => !a.startsWith("--") && argv[i - 1] !== "--out" && argv[i - 1] !== "--ui-sdk-ruled-out" && argv[i - 1] !== "--no-agent-bridge");
if (!target) { console.error("usage: node look.mjs <project folder | URL> [--out <folder>] [--asked-for-split] [--asked-for-drawing] [--showpiece] [--ui-sdk-ruled-out \"<the user's words>\"] [--no-agent-bridge \"<the user's words>\"] [--json]"); process.exit(2); }
const outDir = resolve(option("--out") || ".interface-design/review");
// The register the builder declared in the design record. A showpiece (the page for a game, a film, a festival, an
// exhibition, a launch) lifts three restraint checks and adds three of its own. A line that lists several registers
// is the form's placeholder, not a declaration.
const REGISTERS = ["utility", "between", "expression", "showpiece", "piece"];
// Showpiece limits, set from 33 expressive real sites (games, studios, launches, festivals, museums). With these
// limits 22 of the 33 pass the first-screen check, 18 the word count (their menus and cookie notices are counted),
// 27 the length and 21 the motion check; 6 pass all four and 21 pass three. Together they are a target.
const SHOW_PICTURE = 60, SHOW_LINE = 70, SHOW_WORDS = 80, SHOW_SCREENS = 4;
// Limits for habits of section layout, set by measuring 36 well-known real sites
const SECTION_SAME = 3, CAP_LABELS = 6;
// A piece (a game, a kiosk, a configurator: one object the person acts on) is declared by "Register: piece". Its object
// is the one element marked data-stage. The floor is the showpiece floor; the word limit stops the marker being put on
// the page instead of the object. Ten builds of pieces measured 30% to 69% (median 42%), and all fit on one screen.
const STAGE_SHARE = 60, STAGE_WORDS = 80;
// UI SDK (references/ui-sdk.md). A new web front-end takes its controls from it. A project that already has one of
// these component libraries keeps it. package.json is looked for in the project folder and up to two folders above
// (a built "dist" sits inside its project); with a URL, in the current folder.
const OTHER_LIBS = /^(@radix-ui\/|radix-ui$|react-aria|@react-aria\/|@base-ui|@headlessui\/|@mui\/|@chakra-ui\/|antd$|@mantine\/|@ark-ui\/|bits-ui$|@melt-ui\/|@kobalte\/|reka-ui$|radix-vue$|vuetify$|primevue$|@angular\/material$|bootstrap$|@nextui-org\/|@heroui\/|@fluentui\/|@shoelace-style\/|flowbite)/;
// Words from the user that rule the library out. A request for plain HTML, a static page or no build step is not among them.
const RULED_OUT = /ui[\s-]?sdk|\bno (external|third[- ]party|outside|extra) (librar|dependenc|script|code|package)|without (any )?(external |third[- ]party )?(librar|dependenc|package)|\bno (dependenc|librar)|offline|air[- ]?gapped|radix|react[- ]aria|base ui|headless ?ui|shadcn|\bmui\b|material ui|chakra|ant design|mantine|ark ui|bootstrap|shoelace|vuetify|primevue|existing|already (has|uses|built)|restyle|keep (the|its) (markup|controls|components|html)/i;
const ruledOutWords = (() => { const i = argv.indexOf("--ui-sdk-ruled-out"); if (i < 0) return null; const w = argv[i + 1]; return w && !w.startsWith("--") ? w : ""; })();
const noBridgeWords = (() => { const i = argv.indexOf("--no-agent-bridge"); if (i < 0) return null; const w = argv[i + 1]; return w && !w.startsWith("--") ? w : ""; })();
const NO_BRIDGE = /agent|web ?mcp|\bai\b|assistant|bridge|bots?\b|automat/i;
async function projectLibraries() {
  let dir = /^https?:\/\//.test(target) ? process.cwd() : resolve(target);
  for (let i = 0; i < 3; i++, dir = resolve(dir, "..")) {
    if (!existsSync(join(dir, "package.json"))) continue;
    try { const pkg = JSON.parse(await readFile(join(dir, "package.json"), "utf8")), deps = Object.keys({ ...pkg.dependencies, ...pkg.devDependencies, ...pkg.peerDependencies });
      return { sdk: deps.some((d) => d.startsWith("@ui-sdk/")), other: deps.find((d) => OTHER_LIBS.test(d)) || (existsSync(join(dir, "components.json")) ? "shadcn/ui" : null) }; } catch { return { sdk: false, other: null }; }
  }
  return { sdk: false, other: null };
}
// The Look line of the design record. `Look: supplied: "<the request's words>"` says the request names a look (a period,
// a material, a way of printing or drawing). Without quoted words it counts as open: a bare word is not a switch.
// The Picture line of the design record, as written. A drawing that explains (a diagram, a labeled drawing, a plan, a map)
// is what the skill asks of a place or a service with no photographs, so the old-print check must not fail it.
async function declaredPicture() {
  if (/^https?:/i.test(target)) return "";
  const dir = join(resolve(target), ".interface-design");
  let files = []; try { files = (await readdir(dir)).filter((f) => f.endsWith(".md")).sort(); } catch { return ""; }
  for (const f of files) { let text = ""; try { text = await readFile(join(dir, f), "utf8"); } catch { continue; }
    for (const line of text.split(/\r?\n/)) { const m = line.match(/^[\s>*_`#-]{0,6}picture\b[\s*_`:]*(.*)$/i); if (m) return m[1].trim(); } }
  return "";
}
async function declaredLook() {
  if (/^https?:/i.test(target)) return { supplied: false };
  const dir = join(resolve(target), ".interface-design");
  let files = []; try { files = (await readdir(dir)).filter((f) => f.endsWith(".md")).sort(); } catch { return { supplied: false }; }
  for (const f of files) { let text = ""; try { text = await readFile(join(dir, f), "utf8"); } catch { continue; }
    for (const line of text.split(/\r?\n/)) { const m = line.match(/^[\s>*_`#-]{0,6}look\b[\s*_`:]*(.*)$/i); if (!m) continue;
      const q = m[1].match(/supplied\b[^"\u201C]*["\u201C]([^"\u201D]{6,})["\u201D]/i); return q ? { supplied: true, words: q[1].trim() } : { supplied: false, bare: /supplied/i.test(m[1]) }; } }
  return { supplied: false };
}
async function declaredRegister() {
  if (flag("--showpiece")) return { name: "showpiece", from: "the --showpiece option" };
  if (/^https?:/i.test(target)) return { name: null, from: null };
  const dir = join(resolve(target), ".interface-design");
  let files = []; try { files = (await readdir(dir)).filter((f) => f.endsWith(".md")).sort(); } catch { return { name: null, from: null }; }
  for (const f of files) { let text = ""; try { text = await readFile(join(dir, f), "utf8"); } catch { continue; }
    for (const line of text.split(/\r?\n/)) { if (!/register/i.test(line)) continue; const after = line.slice(line.search(/register/i) + 8, line.search(/register/i) + 60).toLowerCase();
      const named = REGISTERS.filter((r) => new RegExp("\\b" + r + "\\b").test(after)); if (named.length === 1) return { name: named[0], from: ".interface-design/" + f }; } }
  return { name: null, from: null };
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---- find a browser
async function findBrowser() {
  const named = [process.env.CHROME, process.env.CHROME_BIN, process.env.PUPPETEER_EXECUTABLE_PATH].filter(Boolean);
  const fixed = ["/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", "/Applications/Chromium.app/Contents/MacOS/Chromium", "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
    "/usr/bin/google-chrome", "/usr/bin/google-chrome-stable", "/usr/bin/chromium", "/usr/bin/chromium-browser", "/snap/bin/chromium",
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"];
  const cached = [];
  for (const base of [join(homedir(), "Library/Caches/ms-playwright"), join(homedir(), ".cache/ms-playwright"), join(homedir(), "AppData/Local/ms-playwright"), join(homedir(), ".cache/puppeteer")]) {
    let dirs = []; try { dirs = (await readdir(base)).sort().reverse(); } catch { continue; }
    for (const d of dirs) for (const rel of ["chrome-headless-shell-mac-arm64/chrome-headless-shell", "chrome-headless-shell-mac-x64/chrome-headless-shell", "chrome-headless-shell-linux64/chrome-headless-shell", "chrome-headless-shell-linux/chrome-headless-shell",
      "chrome-mac/Chromium.app/Contents/MacOS/Chromium", "chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing", "chrome-linux/chrome", "chrome-linux64/chrome", "chrome-win/chrome.exe", "chrome-win64/chrome.exe"])
      cached.push(join(base, d, rel));
  }
  for (const p of [...named, ...cached, ...fixed]) if (p && existsSync(p)) return p;
  for (const name of ["chromium", "google-chrome", "chromium-browser", "chrome"]) { try { const p = execFileSync("which", [name], { encoding: "utf8" }).trim(); if (p) return p; } catch {} }
  return null;
}
const browserPath = await findBrowser();
if (!browserPath) {
  console.log("No Chromium-based browser was found, so the page could not be opened.\nSet CHROME=/path/to/chrome and run this again, or capture the page with any other tool and run\n  node palette.mjs <capture.png>\non the desktop capture. Say at hand-over that the rendered checks did not run.");
  process.exit(2);
}

// ---- serve a folder, or use the URL
let site = target, server = null;
if (!/^https?:\/\//.test(target)) {
  const root = resolve(target);
  if (!existsSync(join(root, "index.html"))) { console.error(`No index.html in ${root}. Pass the folder that holds the built page, or the URL where it is served.`); process.exit(2); }
  const TYPES = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".mjs": "text/javascript", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp",
    ".avif": "image/avif", ".gif": "image/gif", ".json": "application/json", ".woff2": "font/woff2", ".woff": "font/woff", ".ttf": "font/ttf", ".otf": "font/otf", ".ico": "image/x-icon", ".mp4": "video/mp4", ".webm": "video/webm", ".txt": "text/plain" };
  server = createServer(async (req, res) => {
    try { let p = decodeURIComponent(new URL(req.url, "http://x").pathname); if (p.endsWith("/")) p += "index.html";
      const file = normalize(join(root, p)); if (!file.startsWith(root)) { res.writeHead(403).end(); return; }
      if ((await stat(file)).isDirectory()) { res.writeHead(302, { location: p + "/" }).end(); return; }
      res.writeHead(200, { "content-type": TYPES[extname(file).toLowerCase()] || "application/octet-stream" }).end(await readFile(file));
    } catch { res.writeHead(404).end("not found"); }
  });
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  site = `http://127.0.0.1:${server.address().port}/`;
}

// ---- drive the browser over the DevTools protocol
const profile = await mkdtemp(join(tmpdir(), "look-"));
const chrome = spawn(browserPath, [/headless[-_]shell/.test(browserPath) ? "--headless" : "--headless=new", "--remote-debugging-port=0", `--user-data-dir=${profile}`, "--hide-scrollbars", "--no-first-run", "--no-default-browser-check", "--disable-gpu", "about:blank"], { stdio: ["ignore", "ignore", "pipe"] });
const cleanup = async () => { try { chrome.kill(); } catch {} if (server) server.close(); await sleep(300); await rm(profile, { recursive: true, force: true }).catch(() => {}); };
let wsUrl;
try { wsUrl = await new Promise((res, rej) => { let buf = ""; const t = setTimeout(() => rej(new Error("the browser did not start within 20 seconds")), 20000);
  chrome.stderr.on("data", (d) => { buf += d; const m = buf.match(/DevTools listening on (ws:\/\/\S+)/); if (m) { clearTimeout(t); res(m[1]); } }); chrome.on("exit", () => rej(new Error("the browser exited at once"))); }); }
catch (e) { console.log(`Could not start ${browserPath}: ${e.message}. Set CHROME to another browser and run this again.`); await cleanup(); process.exit(2); }
const page = await (await fetch(`http://127.0.0.1:${new URL(wsUrl).port}/json/new?about:blank`, { method: "PUT" })).json();
const ws = new WebSocket(page.webSocketDebuggerUrl); await new Promise((r) => (ws.onopen = r));
let seq = 0; const pending = new Map(); let events = [];
ws.onmessage = (m) => { const msg = JSON.parse(m.data); if (msg.id && pending.has(msg.id)) { const { res, rej } = pending.get(msg.id); pending.delete(msg.id); msg.error ? rej(new Error(msg.error.message)) : res(msg.result); } else if (msg.method) events.push(msg); };
const cdp = (method, params = {}) => new Promise((res, rej) => { const id = ++seq; pending.set(id, { res, rej }); ws.send(JSON.stringify({ id, method, params })); setTimeout(() => { if (pending.has(id)) { pending.delete(id); rej(new Error("timed out: " + method)); } }, 45000); });
const evaluate = async (expression) => (await cdp("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true })).result.value;
await mkdir(outDir, { recursive: true });
await cdp("Page.enable"); await cdp("Runtime.enable"); await cdp("Network.enable"); await cdp("Log.enable");
// A stand-in for document.modelContext (WebMCP), put in place before any page script runs, so the tools a page registers
// with a browser's agent can be counted. UI SDK's registerTools calls it. It returns a promise, as the real one does.
await cdp("Page.addScriptToEvaluateOnNewDocument", { source: `(() => { try { if (document.modelContext) return; const tools = []; Object.defineProperty(window, "__lookAgentTools", { value: tools, configurable: true });
  Object.defineProperty(document, "modelContext", { configurable: true, value: { registerTool(tool) { tools.push(String(tool && tool.name || "tool")); return Promise.resolve(); }, unregisterTool() { return Promise.resolve(); } } }); } catch {} })()` });

const load = async (settle = 1800) => { events = []; await cdp("Page.navigate", { url: site });
  for (let i = 0; i < 150 && !events.some((e) => e.method === "Page.loadEventFired"); i++) await sleep(100);
  await evaluate("document.fonts.ready.then(() => 1)"); await sleep(settle); };
const shot = async (file, clip) => { const { data } = await cdp("Page.captureScreenshot", { format: "png", captureBeyondViewport: !!clip, ...(clip ? { clip } : {}) }); await writeFile(join(outDir, file), Buffer.from(data, "base64")); };

// ---- checks that run inside the page
const LAYOUT = (width) => `(() => { const de = document.documentElement, vw = ${width};
  const past = [...document.querySelectorAll("body *")].filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.right > vw + 1 && getComputedStyle(e).position !== "fixed"; });
  const small = [...document.querySelectorAll("a,button,input:not([type=hidden]),select,summary,[role=button]")].filter(e => { const r = e.getBoundingClientRect(), s = getComputedStyle(e); return r.width > 1 && r.height > 1 && s.display !== "inline" && r.height < 24 && !(r.width <= 2 || s.clip !== "auto" || s.clipPath !== "none"); });
  const sizes = [...new Set([...document.querySelectorAll("body *")].filter(e => [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()) && e.getClientRects().length).map(e => Math.round(parseFloat(getComputedStyle(e).fontSize) * 10) / 10))].sort((a, b) => a - b);
  return { height: de.scrollHeight, overflow: de.scrollWidth > vw + 1, overflowBy: de.scrollWidth - vw, small: small.slice(0, 5).map(e => (e.getAttribute("aria-label") || e.textContent || e.tagName).trim().replace(/\\s+/g, " ").slice(0, 28)), smallCount: small.length, sizes }; })()`;

const READABILITY = `(() => {
  const cv = document.createElement("canvas"); cv.width = cv.height = 1; const cx = cv.getContext("2d", { willReadFrequently: true });
  const rgba = (c) => { cx.clearRect(0, 0, 1, 1); cx.fillStyle = "#000"; cx.fillStyle = c; cx.fillRect(0, 0, 1, 1); const d = cx.getImageData(0, 0, 1, 1).data; return [d[0], d[1], d[2], d[3] / 255]; };
  const over = (top, under) => top.slice(0, 3).map((v, i) => v * top[3] + under[i] * (1 - top[3])).concat(1);
  const lum = (c) => { const f = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]); };
  const ratio = (a, b) => { const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x); return (hi + 0.05) / (lo + 0.05); };
  const backdrop = (el) => { const layers = []; for (let e = el; e; e = e.parentElement) { const s = getComputedStyle(e); if (s.backgroundImage !== "none") return null; const c = rgba(s.backgroundColor); if (c[3] > 0) { layers.push(c); if (c[3] === 1) break; } }
    return layers.reverse().reduce((under, top) => over(top, under), [255, 255, 255, 1]); };
  let checked = 0, skipped = 0; const low = [];
  for (const el of document.querySelectorAll("body *")) {
    if (![...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())) continue;
    const s = getComputedStyle(el), r = el.getBoundingClientRect();
    if (r.width <= 1 || r.height <= 1 || s.visibility === "hidden" || el.closest("[disabled],[aria-disabled=true],[hidden]")) continue;
    const bg = backdrop(el); if (!bg) { skipped++; continue; }
    let alpha = 1; for (let e = el; e; e = e.parentElement) alpha *= parseFloat(getComputedStyle(e).opacity);
    const fg = rgba(s.color); fg[3] *= alpha; const size = parseFloat(s.fontSize), large = size >= 24 || (size >= 18.66 && parseInt(s.fontWeight) >= 700);
    const cr = ratio(over(fg, bg), bg); checked++;
    if (cr < (large ? 3 : 4.5) - 0.01) low.push('"' + el.textContent.trim().replace(/\\s+/g, " ").slice(0, 24) + '" ' + (Math.round(cr * 10) / 10) + ":1");
  }
  const named = (e) => (e.getAttribute("aria-label") || e.title || (e.getAttribute("aria-labelledby") || "").split(/\\s+/).map(id => (document.getElementById(id) || {}).textContent || "").join("")).trim();
  const tag = (e) => e.outerHTML.replace(/\\s+/g, " ").slice(0, 60);
  const buttons = [...document.querySelectorAll("button,a[href],[role=button]")].filter(e => e.getClientRects().length && !e.textContent.trim() && !named(e) && !e.querySelector("img[alt]:not([alt='']),svg title")).map(tag);
  const fields = [...document.querySelectorAll("input:not([type=hidden]):not([type=submit]):not([type=button]),select,textarea")].filter(e => e.getClientRects().length && !named(e) && !(e.labels && e.labels.length)).map(tag);
  return { checked, skipped, low: [...new Set(low)], buttons, fields, broken: [...document.images].filter(i => i.complete && !i.naturalWidth).map(i => i.getAttribute("src")) };
})()`;

// The shape of the first screen: where the headline sits, what the main visual is and where, and three habits of
// generated pages around them.
const FIRST_SCREEN = `(() => {
  const vw = innerWidth, vh = innerHeight, area = (r) => Math.max(0, Math.min(r.right, vw) - Math.max(r.left, 0)) * Math.max(0, Math.min(r.bottom, vh) - Math.max(r.top, 0));
  const shown = (e) => { const r = e.getBoundingClientRect(), s = getComputedStyle(e); return r.width > 4 && r.height > 4 && r.top < vh && r.bottom > 0 && s.visibility !== "hidden" && +s.opacity > 0.05 && s.display !== "none"; };
  const h = [...document.querySelectorAll("h1")].filter(shown).filter(e => e.textContent.trim().length > 3)[0];
  if (!h) return { headline: null };
  const hr = h.getBoundingClientRect(), hs = getComputedStyle(h), text = h.innerText.trim().replace(/\\s+/g, " ");
  const inter = (a, b) => Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left)) * Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
  const pictures = [];
  for (const e of document.querySelectorAll("body *")) { if (e.contains(h) || h.contains(e)) continue; const r = e.getBoundingClientRect(), a = area(r); if (a < 0.07 * vw * vh || !shown(e)) continue;
    const tag = e.tagName.toLowerCase(), s = getComputedStyle(e);
    if (["img", "video", "canvas", "picture", "svg"].includes(tag) || /url\\(/.test(s.backgroundImage)) pictures.push({ r, a, e }); }
  const v = pictures.sort((x, y) => y.a - x.a)[0] || null, hx = (hr.left + hr.right) / 2;
  let split = false, textOver = false;
  if (v) { const vx = (v.r.left + v.r.right) / 2, overlapY = Math.min(v.r.bottom, hr.bottom) - Math.max(v.r.top, hr.top);
    textOver = inter(v.r, hr) > 0.5 * hr.width * hr.height;
    split = !textOver && overlapY > 0.3 * hr.height && Math.abs(vx - hx) > 0.25 * vw; }
  let label = null;
  for (const e of document.querySelectorAll("body *")) { if (e.contains(h) || !shown(e) || e.children.length > 2 || e.closest("nav,[role=navigation]")) continue; const r = e.getBoundingClientRect(), t = (e.innerText || "").trim();
    if (!t || t.length > 48 || r.bottom > hr.top + 6 || r.bottom < hr.top - 90 || r.right < hr.left || r.left > hr.right) continue; const s = getComputedStyle(e); if (parseFloat(s.fontSize) > 20) continue;
    const upper = s.textTransform === "uppercase" || (t === t.toUpperCase() && /[A-Z]{3}/.test(t)), track = s.letterSpacing === "normal" ? 0 : parseFloat(s.letterSpacing) / parseFloat(s.fontSize);
    if (upper || track >= 0.04) { label = t.replace(/\\s+/g, " ").slice(0, 40); break; } }
  let card = null;
  if (v) for (const e of document.querySelectorAll("body *")) { if (e === v.e || e.contains(v.e) || e.contains(h) || !shown(e)) continue; const r = e.getBoundingClientRect(), a = r.width * r.height, s = getComputedStyle(e), t = (e.innerText || "").trim();
    if (a < 0.004 * vw * vh || a > 0.09 * vw * vh || !t || t.length > 160 || inter(r, v.r) < 0.15 * a) continue;
    if (s.backgroundColor === "rgba(0, 0, 0, 0)" || (s.boxShadow === "none" && s.borderTopWidth === "0px")) continue;
    if (e.closest("nav,header") && !v.e.closest("header")) continue;
    if (["a", "button"].includes(e.tagName.toLowerCase()) && t.length < 32 && !/\\n/.test(t)) continue; // a plain button over a picture is not a card
    card = t.replace(/\\s+/g, " ").slice(0, 40); break; }
  // A work screen (it has a data table) carrying a picture that is not part of the data
  const rowsOfData = Math.max(0, ...[...document.querySelectorAll("table")].map(t => t.querySelectorAll("tbody tr").length));
  const deco = rowsOfData >= 5 ? [...document.querySelectorAll("img")].filter(shown).filter(e => !e.closest("table,a,figure") && area(e.getBoundingClientRect()) > 0.012 * vw * vh)[0] : null;
  return { decorativePicture: deco ? (deco.getAttribute("alt") || deco.getAttribute("src") || "image").slice(0, 50) : null, headline: text.slice(0, 80), px: Math.round(parseFloat(hs.fontSize)), tracking: hs.letterSpacing === "normal" ? 0 : Math.round(1000 * parseFloat(hs.letterSpacing) / parseFloat(hs.fontSize)) / 1000, uppercase: hs.textTransform === "uppercase", split: split ? (hx < (v.r.left + v.r.right) / 2 ? "text on the left, picture on the right" : "picture on the left, text on the right") : null, textOver, picture: !!v, label, card };
})()`;

const out = { site, captures: outDir, widths: {} }, lines = []; let failed = 0, broken = false;
const REG = await declaredRegister(), SHOW = REG.name === "showpiece", PIECE = REG.name === "piece", LOOK = await declaredLook(), PICTURE = await declaredPicture(), EXPLAINS = /(?<!\b(?:no|not|without|never)\b[^.]{0,14})\b(?:diagrams?|label+ed|elevations?|plans?|maps?|charts?|schematics?|blueprints?|cutaways?|exploded views?)\b/i.test(PICTURE); out.register = REG; out.look = LOOK;
const say = (kind, name, text) => { if (kind === "FAIL") failed++; lines.push(`${kind}  ${name.padEnd(22)} ${text}`); };
const list = (a, n = 4) => a.slice(0, n).join("; ") + (a.length > n ? `; and ${a.length - n} more` : "");

try {
  const VIEWS = [["desktop", 1440, 900, 1, false], ["tablet", 768, 1024, 1, false], ["phone", 390, 844, 2, true]];
  for (const [name, width, height, scale, mobile] of VIEWS) {
    await cdp("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: scale, mobile });
    await cdp("Emulation.setTouchEmulationEnabled", { enabled: mobile });
    await load();
    await shot(`${name}.png`);
    const total = await evaluate(`(async () => { const h = () => document.documentElement.scrollHeight; for (let y = 0; y < h(); y += Math.round(innerHeight * 0.6)) { scrollTo({ top: y, left: 0, behavior: "instant" }); await new Promise(r => setTimeout(r, 120)); } scrollTo({ top: 0, left: 0, behavior: "instant" }); await new Promise(r => setTimeout(r, 400)); return h(); })()`);
    if (name !== "tablet") await shot(`${name}-full.png`, { x: 0, y: 0, width, height: total, scale: Math.min(1, 6000 / (total * scale)) });
    const errors = [...new Set(events.map((e) => e.method === "Runtime.exceptionThrown" ? (e.params.exceptionDetails.exception?.description || e.params.exceptionDetails.text)
      : e.method === "Log.entryAdded" && e.params.entry.level === "error" ? e.params.entry.text + " " + (e.params.entry.url || "")
      : e.method === "Runtime.consoleAPICalled" && e.params.type === "error" ? e.params.args.map((a) => a.value ?? a.description ?? "").join(" ") : null).filter(Boolean).map((t) => t.replace(/\s+/g, " ").slice(0, 140)))];
    out.widths[name] = { width, ...(await evaluate(LAYOUT(width))), ...(await evaluate(READABILITY)), errors, firstScreen: name === "desktop" ? await evaluate(FIRST_SCREEN) : undefined };
  }
  const D = out.widths.desktop, T = out.widths.tablet, P = out.widths.phone;

  // Rendering
  const errs = [...new Set([...D.errors, ...T.errors, ...P.errors])];
  say(errs.length ? "FAIL" : "PASS", "console errors", errs.length ? `${errs.length}: ${list(errs, 2)}` : "none on load at any width");
  const broken = [...new Set([...D.broken, ...P.broken])];
  if (broken.length) say("FAIL", "broken images", list(broken));
  const wide = [["phone", P], ["tablet", T], ["desktop", D]].filter(([, v]) => v.overflow);
  say(wide.length ? "FAIL" : "PASS", "fits the screen", wide.length ? wide.map(([n, v]) => `${n} (${v.width}px) scrolls sideways by ${v.overflowBy}px`).join("; ") : "no sideways scroll at 390, 768 or 1440");
  const low = [...new Set([...D.low, ...P.low])];
  say(low.length ? "FAIL" : "PASS", "text contrast", low.length ? `${low.length} text${low.length > 1 ? "s" : ""} under 4.5:1 (3:1 for large text): ${list(low)}` : `${D.checked} texts checked` + (D.skipped ? `, ${D.skipped} over an image or gradient not checked` : ""));
  const unnamed = [...new Set([...D.buttons, ...D.fields])];
  say(unnamed.length ? "FAIL" : "PASS", "names and labels", unnamed.length ? `${unnamed.length} control${unnamed.length > 1 ? "s" : ""} with no accessible name or label: ${list(unnamed, 3)}` : "every button, link and field has one");
  say(P.smallCount ? "NOTE" : "PASS", "touch targets", P.smallCount ? `${P.smallCount} control${P.smallCount > 1 ? "s" : ""} under 24px tall at phone width (aim for 44px): ${list(P.small)}` : "no control under 24px tall at phone width");

  // Keyboard focus
  await cdp("Emulation.setDeviceMetricsOverride", { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await cdp("Emulation.setTouchEmulationEnabled", { enabled: false });
  await load(900); await cdp("Page.bringToFront");
  const look = `s.boxShadow + "|" + s.borderColor + "|" + s.backgroundColor + "|" + s.color + "|" + s.textDecorationLine + "|" + (e.parentElement ? (p => p.boxShadow + p.borderColor + p.outlineStyle + p.outlineWidth)(getComputedStyle(e.parentElement)) : "")`;
  await evaluate(`(() => { window.__pre = new Map([...document.querySelectorAll("a[href],button,input,select,textarea,summary,[tabindex]")].map(e => { const s = getComputedStyle(e); return [e, ${look}]; })); window.__seen = new Set(); return 1; })()`);
  const stops = [];
  for (let i = 0; i < 16; i++) {
    for (const type of ["rawKeyDown", "keyUp"]) await cdp("Input.dispatchKeyEvent", { type, key: "Tab", code: "Tab", windowsVirtualKeyCode: 9 });
    await sleep(220);
    const stop = await evaluate(`(() => { const e = document.activeElement; if (!e || e === document.body || window.__seen.has(e)) return null; window.__seen.add(e); const s = getComputedStyle(e);
      return { el: (e.tagName.toLowerCase() + " " + (e.getAttribute("aria-label") || e.textContent || e.placeholder || e.name || "").trim().replace(/\\s+/g, " ").slice(0, 24)).trim(), ring: (s.outlineStyle !== "none" && parseFloat(s.outlineWidth) > 0) || (window.__pre.has(e) && window.__pre.get(e) !== ${look}) }; })()`);
    if (stop) stops.push(stop);
  }
  const invisible = stops.filter((s) => !s.ring).map((s) => s.el);
  if (stops.length) say(invisible.length ? "FAIL" : "PASS", "keyboard focus", invisible.length ? `no visible change on focus for: ${list(invisible)}` : `visible on the first ${stops.length} stops`);
  else say("NOTE", "keyboard focus", "Tab reached nothing; check that the page has focusable controls");

  // First screen
  const F = D.firstScreen;
  if (!F || !F.headline) say("NOTE", "first screen", "no h1 is visible on the first screen at 1440 wide");
  else {
    if (F.card) say("NOTE", "card over the picture", `a small card ("${F.card}") is laid over the main picture. If it stands in for the product, show the real interface at a size that can be read.`);
    if (F.split && (SHOW || PIECE)) say("PASS", "first-screen layout", `${F.split} (allowed in a ${REG.name})`);
    else if (F.split) say(flag("--asked-for-split") ? "NOTE" : "FAIL", "first-screen layout", `${F.split}: the arrangement every generated page opens with` + (flag("--asked-for-split") ? " (allowed: the brief asks for it)." : ". Build the arrangement on the brief's First screen line. If the user's own brief or mockup asks for this split, run again with --asked-for-split."));
    else say("PASS", "first-screen layout", F.textOver ? "the headline sits over the picture" : F.picture ? "headline and picture are stacked" : "type and interface, no large picture");
    if (/[.!]$/.test(F.headline) && F.headline.split(" ").length <= 7) say("NOTE", "headline", `"${F.headline}" is a short line ending in a full stop, the shape generated pages favor. 29 of 38 well-known sites end theirs without one, and most say plainly what the product is.`);
    say(F.decorativePicture ? "FAIL" : "PASS", "picture on a work screen", F.decorativePicture ? `"${F.decorativePicture}" sits on a screen that has a data table. A work screen carries no illustration: take it out. If it is something the person works with (a product photo, a map of real routes, a document), mark it up as a <figure> with a caption.` : "none");
    if (SHOW || PIECE) say("PASS", "headline size", `${F.px}px (no limit in a ${REG.name})`);
    else say(F.px > 96 ? "FAIL" : "PASS", "headline size", F.px > 96 ? `${F.px}px at 1440 wide (limit 96px). Of 28 well-known sites measured, none set its main headline larger.` : `${F.px}px`);
    say(F.tracking < -0.06 ? "FAIL" : "PASS", "headline letter spacing", F.tracking < -0.06 ? `${F.tracking}em (no tighter than -0.06em). Letters this close lose their shapes. About -0.02em is usual, and none of 28 well-known sites went past -0.06em.` : `${F.tracking}em`);
    if (F.uppercase) say("NOTE", "headline case", "the main headline is set in capitals. Of 28 well-known sites measured, none did that.");
  }
  if (D.sizes.length > 9) say("NOTE", "sizes on screen", `${D.sizes.length} different text sizes are rendered: ${D.sizes.join(", ")}px`);

  // Small habits across the whole page, at desktop width
  const H = await evaluate(HABITS); out.habits = H;
  // If the in-page checks did not run, say so loudly: a page must never pass because the script broke.
  if (!H || !H.dots) { broken = true; lines.push("ERROR habit checks           the in-page checks did not run on this page. This is a fault in look.mjs or habits.mjs, not in the page: the result below is incomplete."); }
  const quote = (a, n = 4) => list([...new Set(a)].map((t) => `"${t}"`), n);
  if (H && H.dots) {
    say(H.dots.tintedBox.length ? "FAIL" : "PASS", "status shown once", H.dots.tintedBox.length ? `${H.dots.tintedBox.length} label${H.dots.tintedBox.length > 1 ? "s put" : " puts"} a dot inside a tinted chip beside the word (${quote(H.dots.tintedBox, 3)}). Show a status one way: colored text with an icon, a dot with plain text, or a tinted chip with text.` : "no dot inside a tinted chip");
    const notes = [...new Set([...H.dots.caveat, ...H.chips.caveat])];
    say(notes.length ? "FAIL" : "PASS", "notes as badges", notes.length ? `${quote(notes)}: a note about the content is dressed as a badge or given a status dot. Write it as a short plain sentence near what it describes, or leave it out.` : "none");
    if (H.dots.outsideData.length > 3) say("NOTE", "dot labels", `${H.dots.outsideData.length} labels outside rows of data carry a dot (${quote(H.dots.outsideData)}). A dot is for a state that can change; take it off anything that is always the same.`);
    const beside = [...H.aboveHeadings.map((a) => `"${a.text}" above "${a.heading}" (${a.style})`), ...H.underHeadings.map((a) => `"${a.text}" under "${a.heading}" (${a.style})`)];
    say(beside.length ? "FAIL" : "PASS", "lines beside headings", beside.length ? `${beside.length}: ${list(beside, 3)}. A heading stands alone. Remove the line, or put what it says into the heading or the sentence after it.` : "no small styled line above or under a heading");
    const C = H.corners;
    say(C.firstScreenBoxed ? "FAIL" : "PASS", "boxed first screen", C.firstScreenBoxed ? `the first screen sits inside a rounded card (${C.firstScreenBoxed}px corners). Let it sit on the page, or run the field of color to the edges of the screen.` : "the first screen is not wrapped in a rounded card");
    if (C.pillButtons && C.otherRounded) say("NOTE", "button shape", `${C.pillButtons} pill button${C.pillButtons > 1 ? "s" : ""} beside ${C.otherRounded} with other corners. The brief's Shape line names one button shape; check these follow it.`);
    if (C.bigRoundedMax >= 12 && C.pillButtons) say("NOTE", "soft shape", `large containers with ${C.bigRoundedMax}px corners together with pill buttons: the stock shape of a generated page. It is right only if the brief's Shape line chose a round character for this subject.`);
    const dashShort = [...new Set([...H.dashes.inHeadings, ...H.dashes.inShortText])], dense = H.dashes.total >= 5 && H.dashes.total / Math.max(1, H.dashes.chars) > 1 / 600;
    say(dashShort.length || dense ? "FAIL" : "PASS", "long dashes", dashShort.length ? `in headings, labels or buttons: ${quote(dashShort, 3)}. Use a comma, a colon or two sentences.` : dense ? `${H.dashes.total} in ${H.dashes.chars} characters of text. One or two on a page is ordinary; this many reads as generated.` : `${H.dashes.total} on the page`);
    const P = H.props;
    if (P) {
      const tiltTop = P.tilted.filter((t) => t.top), tiltLow = P.tilted.filter((t) => !t.top), deg = (list) => quote(list.map((t) => `${t.text}, ${t.degrees} degrees`), 2);
      say(tiltTop.length ? "FAIL" : "PASS", "tilted block", tiltTop.length ? `${tiltTop.length} block${tiltTop.length > 1 ? "s" : ""} with words on the first screen ${tiltTop.length > 1 ? "are" : "is"} set at an angle (${deg(tiltTop)}): a page dressed as a paper object. None of 38 well-known sites does that. Set it upright in a plain rectangle.` : "nothing with words on the first screen is set at an angle");
      if (tiltLow.length) say("NOTE", "tilted block", `${tiltLow.length} block${tiltLow.length > 1 ? "s" : ""} with words lower on the page ${tiltLow.length > 1 ? "are" : "is"} set at an angle (${deg(tiltLow)}). 4 of 38 well-known sites have one. Keep it only if the brief asks for it.`);
      say(P.paper.length ? "FAIL" : "PASS", "paper behind content", P.paper.length ? `squared or dotted paper is drawn behind the first screen (${quote(P.paper, 3)}). One of 38 well-known sites does that. Use a plain background.` : "no squared or dotted paper behind the first screen");
      say(P.dashed.length ? "FAIL" : "PASS", "dashed rules", P.dashed.length ? `${P.dashed.length} dashed or dotted rule${P.dashed.length > 1 ? "s" : ""} (${quote(P.dashed, 3)}): the perforation of a drawn ticket or receipt. One of 38 well-known sites has any. Use a solid hairline, or space.` : "no dashed or dotted rules");
      const shortPage = P.toTop && P.screens < 6;
      say(shortPage ? "FAIL" : "PASS", "back to top", shortPage ? `"${P.toTop}" on a page ${P.screens} screens tall. 11 of 12 generated landing pages carry this link; 2 of 38 well-known sites do, both on very long pages. Remove it.` : P.toTop ? `the page is ${P.screens} screens tall, long enough for one` : "no back-to-top link");
    }
    const A = H.acts;
    if (A) {
      const groups = A.repeated.map((g) => g.map((x) => `"${x}"`).join(", "));
      say(groups.length ? "FAIL" : "PASS", "one place, several controls", groups.length ? `on the first screen ${groups.length > 1 ? "these groups each lead" : "these controls all lead"} to one place: ${groups.slice(0, 3).join("; ")}. Keep one, where the visitor will look for it, and remove the rest. ${A.workScreen ? "Three to one place is too many on any screen." : "Three or more to one place appears on 1 of 39 well-known sites."}` : "no two controls on the first screen lead to the same place");
      const manyArrows = A.arrowsFirst.length >= 2 || (A.arrowsPage >= 3 && A.arrowsPage * 2 >= A.actionControls);
      say(manyArrows ? "FAIL" : "PASS", "arrows on controls", manyArrows ? `${A.arrowsFirst.length} control${A.arrowsFirst.length === 1 ? "" : "s"} on the first screen and ${A.arrowsPage} of ${A.actionControls} on the page end in an arrow (${quote(A.arrowsFirst, 4)}). Two or more on a first screen appears on 2 of 39 well-known sites. A button needs no arrow; keep at most one, where it says something: the link leaves the site, or the button moves to the next step.` : `${A.arrowsFirst.length} on the first screen, ${A.arrowsPage} on the page`);
      if (A.slogan) say("FAIL", "slogan headline", `"${A.slogan}" is a slogan shape and names no kind of product, service or place. Cover the logo: would a stranger know what this is? Say what it is and who or where it is for.`); else say("PASS", "slogan headline", "the main headline is not one of the stock slogan shapes");
      say(A.italicHeads.length ? "FAIL" : "PASS", "italics in headings", A.italicHeads.length ? `${A.italicHeads.length} heading${A.italicHeads.length > 1 ? "s carry" : " carries"} an italic fragment (${quote(A.italicHeads, 3)}). One of 39 well-known sites does that. Set the whole heading in one style.` : "no heading mixes in an italic fragment");
      if (A.beside && (SHOW || PIECE)) say("PASS", "beside the headline", `a block shares the headline's row (allowed in a ${REG.name})`);
      else if (A.beside && !F.split) say(flag("--asked-for-split") ? "NOTE" : "FAIL", "beside the headline", `the main headline sits on the left with a block beside it ("${A.beside}"): the arrangement the last builds all shared. 10 of 39 well-known sites do this; most give the headline its row to itself. Do the same here and put this under it` + (flag("--asked-for-split") ? " (allowed: the brief asks for it)." : "."));
      else if (!F.split) say("PASS", "beside the headline", "the main headline has its row to itself");
      const I = A.icons, offMany = I.off.length >= 3 && I.off.length > 0.2 * I.inline;
      say(offMany ? "FAIL" : "PASS", "icon alignment", offMany ? `${I.off.length} of ${I.inline} icons sit more than 2.5px off the middle of the text beside them (${quote(I.off, 4)}). Center each icon on its line of text.` : `${I.inline} icons beside text, ${I.off.length} off the line`);
      const Z = H.sections;
      if (Z) {
        if (PIECE && Z.strip) say("PASS", "facts strip", `a status line sits by the object ("${Z.strip.slice(0, 60)}"): allowed in a piece, where a score, a price or a total docks beside it`);
        else say(Z.strip ? "FAIL" : "PASS", "facts strip", Z.strip ? `a band of short facts sits directly under the first screen ("${Z.strip}"). It is a stats bar, the same on every generated page, and most of what it holds is not what the visitor came for. Put the one or two facts that decide a visit (when, where, how much) in the first screen as a plain line, move the rest to the section they belong to, and delete what is left.` : "no band of facts under the first screen");
        const side = Z.sideBySide.length, headed = side + Z.centered + Z.above, same = side >= SECTION_SAME && side * 2 > headed;
        say(same ? "FAIL" : "PASS", "section layout", same ? `${side} of ${headed} sections put the heading on the left and the content on the right (${quote(Z.sideBySide, 4)}). One arrangement repeated down the page is a template. Keep it for at most ${SECTION_SAME - 1}, and give the others their own: heading above, centered, or no heading where the content speaks for itself.` : `${side} of ${headed} sections put the heading on the left with the content on the right`);
        say(Z.boxedMarks.length ? "FAIL" : "PASS", "boxed marks", Z.boxedMarks.length ? `${Z.boxedMarks.length} ${Z.boxedMarks.length > 1 ? "marks each sit" : "mark sits"} in a small tinted or bordered box (${list([...new Set(Z.boxedMarks)], 4)}). A number in a box is a number pretending to be an icon, and a frame adds nothing to an icon. Take the box away: a step is numbered in plain text, and an icon stands beside its label.` : "no number or icon is set in a box of its own");
        say(Z.padded >= 3 ? "FAIL" : "PASS", "numbered markers", Z.padded >= 3 ? `${Z.padded} markers are written 01, 02, 03. None of 32 well-known sites carries three or more. Number real steps 1, 2, 3 in plain text, and number nothing else.` : `${Z.padded} zero-padded markers`);
        say(Z.figs.length ? "FAIL" : "PASS", "figure captions", Z.figs.length ? `${quote(Z.figs, 3)}: a caption numbered like a plate in a manual, which none of 32 well-known sites does. Say what the picture shows.` : "no picture is captioned as a numbered figure");
        say(Z.capLabels.length > CAP_LABELS ? "FAIL" : "PASS", "capital labels", Z.capLabels.length > CAP_LABELS ? `${Z.capLabels.length} small labels are set in spaced capitals (${quote(Z.capLabels, 5)}); the limit is ${CAP_LABELS}. Spaced capitals on every small line are a costume. Write labels in ordinary letters and keep capitals for the few that are truly headings of columns.` : `${Z.capLabels.length} small labels in spaced capitals`);
      }
      const K = H.sdk;
      if (K) { const lib = await projectLibraries(), here = lib.sdk || K.script || K.defined, label = "controls from UI SDK", what = `${K.controls} control${K.controls === 1 ? "" : "s"}`, bad = K.undefinedTags;
        if (!K.controls && !bad.length) say("PASS", label, "no button, field or widget on this page, so there is nothing for the library to drive");
        else if (ruledOutWords && RULED_OUT.test(ruledOutWords)) say("NOTE", label, `${K.controls - K.loose} of ${what} are UI SDK parts. Not required here, on the user's words: "${ruledOutWords.slice(0, 140)}". Repeat them at hand-over.`);
        else if (!here && lib.other) say("PASS", label, `the project keeps the component library it already has (${lib.other})`);
        else if (!here) say("FAIL", label, `${what} and no UI SDK on the page${K.looseSamples.length ? ` (${quote(K.looseSamples, 4)})` : ""}. A new web front-end takes the behavior of its controls from UI SDK, so people get its keyboard and focus handling and an agent can find each control. Read references/ui-sdk.md, load the library, and make every button, field, dialog and widget one of its parts. A page asked for as plain HTML, CSS and JavaScript, as a static page, as one file or with no build step still uses it: its web components are HTML tags and one script tag.${ruledOutWords !== null ? ` --ui-sdk-ruled-out was given, but ${ruledOutWords ? `"${ruledOutWords.slice(0, 100)}" does` : "no words came with it, and that does"} not rule the library out.` : ""}`);
        else if (bad.length && !K.defined) say("FAIL", label, `the UI SDK elements on this page did not start (${list(bad, 4)}). Its script did not load: check the address, the console, and that this machine is online.`);
        else if (bad.length) say("FAIL", label, `${list(bad, 5)} ${bad.length > 1 ? "are not UI SDK elements, so they do" : "is not a UI SDK element, so it does"} nothing. Tag names are not guessed: each component's page in the library's documentation lists its tags and the markup they need.`);
        else if (K.loose) say("FAIL", label, `${K.loose} of ${what} ${K.loose > 1 ? "are" : "is"} not a UI SDK part (${quote(K.looseSamples, 5)}). Loading the library is not enough: each button, field, dialog and widget is wrapped in, or replaced by, its UI SDK part. The component's page in the library's documentation shows the markup.`);
        else say("PASS", label, `${what}, every one a UI SDK part`);
        // The agent bridge: with UI SDK parts on the page, an agent can use them only once the page has created the
        // library's bridge and registered it. Counted from what the page registered with the stand-in above.
        const parts = K.controls - K.loose, lifted = ruledOutWords && RULED_OUT.test(ruledOutWords), tools = K.tools || [];
        if (parts > 0 && here && !lifted) { const bridge = "agent bridge";
          if (tools.length) say("PASS", bridge, `the page registers ${tools.length} tool${tools.length > 1 ? "s" : ""} for a browser's agent (${list(tools, 4)})`);
          else if (noBridgeWords && NO_BRIDGE.test(noBridgeWords)) say("NOTE", bridge, `no agent bridge. Not required here, on the user's words: "${noBridgeWords.slice(0, 140)}". Repeat them at hand-over.`);
          else say("FAIL", bridge, `the controls are UI SDK parts, but the page registers nothing for an agent, so an agent still cannot read or use them. Create the library's bridge (createAgent) and register it (registerTools), in the same bundle as the components: see "The agent bridge" in references/ui-sdk.md. The copy of the library on ui-sdk.dev has no bridge, so a page with no build step bundles the packages into one local file.${noBridgeWords !== null ? ` --no-agent-bridge was given, but ${noBridgeWords ? `"${noBridgeWords.slice(0, 100)}" does` : "no words came with it, and that does"} not say the user ruled agents out.` : ""}`);
        }
      }
      if (PIECE) { const T = H.stage || { count: 0 }, label = "piece: the object";
        if (!T.count) say("FAIL", label, "the design record says this is a piece, and no element is marked data-stage. Put that attribute on the one element that is the object: the thing the person acts on. See references/piece.md.");
        else if (T.count > 1) say("FAIL", label, `${T.count} elements are marked data-stage. A piece has one object: mark that element only.`);
        else if (T.words > STAGE_WORDS) say("FAIL", label, `the element marked data-stage holds ${T.words} words of text (limit ${STAGE_WORDS}). That is the page, not the object. Mark the object itself, and let it take the screen.`);
        else if (T.share < STAGE_SHARE) say("FAIL", label, `the object covers ${T.share}% of the first screen (floor ${STAGE_SHARE}%). At that size it is one panel of a product screen. Take out the header band, the page title and the box around it, let the object fill the screen, and put the controls on it or in one dock along an edge.`);
        else if (!T.spansX && !T.spansY) say("FAIL", label, `the object covers ${T.share}% of the first screen but sits inside margins on every side. It runs from one edge of the screen to the opposite edge: left to right, or top to bottom.`);
        else say("PASS", label, `the object covers ${T.share}% of the first screen and runs ${T.spansX && T.spansY ? "to every edge" : T.spansX ? "from the left edge to the right" : "from the top edge to the bottom"}`);
      }
      if (SHOW && H.show) { const S = H.show, pic = S.picture ? S.picture.share : 0, dominant = pic >= SHOW_PICTURE || S.widestLine >= SHOW_LINE;
        say(dominant ? "PASS" : "FAIL", "showpiece: first screen", dominant ? (pic >= SHOW_PICTURE ? `a ${S.picture.kind} covers ${pic}% of the first screen` : `the title spans ${S.widestLine}% of the width`) : `nothing dominates the first screen: the largest picture covers ${pic}% of it and the widest line of the title spans ${S.widestLine}% of the width. Let the art, the film or the object fill the screen (${SHOW_PICTURE}% or more), or set the title across the full width (${SHOW_LINE}% or more).`);
        say(S.words <= SHOW_WORDS ? "PASS" : "FAIL", "showpiece: words", S.words <= SHOW_WORDS ? `${S.words} words on the first screen` : `${S.words} words on the first screen (limit ${SHOW_WORDS}). The first screen of a showpiece shows the thing; the explaining comes further down.`);
        say(S.screens >= SHOW_SCREENS ? "PASS" : "FAIL", "showpiece: scenes", S.screens >= SHOW_SCREENS ? `the page runs to ${S.screens} screens` : `the page is ${S.screens} screens long. A showpiece unfolds: four in five of those measured run to ${SHOW_SCREENS} screens or more, with a median of 7. Give each thing worth seeing a screen of its own, as the Scenes line of the brief lists them. Do not pad.`);
        say(S.moves.length ? "PASS" : "FAIL", "showpiece: motion", S.moves.length ? S.moves.join(", ") : "nothing on the page moves: no animation, no film, no canvas, no scroll scene. A showpiece has at least one authored moment. Build one that serves the concept, and switch it off under prefers-reduced-motion.");
      }
      say(I.mixed.length ? "FAIL" : "PASS", "icon sizes", I.mixed.length ? I.mixed.slice(0, 2).map((g) => `icons beside ${g.text}px text come in ${g.sizes.length} sizes (${g.sizes.join(", ")}px)`).join("; ") + ". One text size takes one icon size." : "one icon size for each text size");
    }
  }

  // Controls that do nothing: a button outside a form, or a link whose address is "#", empty, missing or a fragment
  // with no target, that has no inline handler and no click, pointer or key listener on it or on any ancestor up to
  // the window. A page whose framework listens at the root passes, because the script cannot tell there.
  let deadButtons = [];
  try {
    const count = await evaluate(`(() => { const nowhere = (a) => { const h = a.getAttribute("href"); if (h === null) return !a.hasAttribute("role"); if (h === "" || h === "#") return true; if (/^javascript:/i.test(h)) return /void|^javascript:;?$/i.test(h);
        if (h.startsWith("#")) { try { const id = decodeURIComponent(h.slice(1)); return !document.getElementById(id) && !document.getElementsByName(id).length; } catch { return false; } } return false; };
      window.__btns = [...document.querySelectorAll("button,[role=button],a")].filter(b => { const r = b.getBoundingClientRect(); if (r.width <= 2 || r.height <= 2 || b.disabled || b.getAttribute("aria-disabled") === "true" || b.closest("[inert],summary,label,dialog:not([open])") || b.hasAttribute("onclick")) return false;
        return b.tagName === "A" ? nowhere(b) : !(b.form && b.type !== "button") && !b.hasAttribute("popovertarget") && !b.hasAttribute("commandfor"); }).slice(0, 120);
      window.__chain = [...new Set(window.__btns.flatMap(b => { const c = []; for (let e = b; e; e = e.parentNode) c.push(e); return c; }))].concat([window]).slice(0, 900); return window.__btns.length; })()`);
    if (count) {
      const chainLength = await evaluate("window.__chain.length"), live = new Set(), liveLib = new Set(), ACT = /^(click|mousedown|mouseup|pointerdown|pointerup|touchstart|touchend|keydown|keyup|keypress|dblclick)$/;
      // A listener that UI SDK attached is the action of a tab, a trigger or a toggle, but not of a plain Button part:
      // wrapping a button in <ui-button> must not hide that it does nothing. Scripts whose address names ui-sdk are the library's.
      const libScripts = new Set();
      try { const from = events.length; await cdp("Debugger.enable"); await sleep(120); for (const e of events.slice(from)) if (e.method === "Debugger.scriptParsed" && /ui-sdk/.test(e.params.url || "")) libScripts.add(e.params.scriptId); await cdp("Debugger.disable"); } catch {}
      for (let i = 0; i < chainLength; i++) { const { result } = await cdp("Runtime.evaluate", { expression: `window.__chain[${i}]`, objectGroup: "look" }); if (!result.objectId) continue;
        const { listeners } = await cdp("DOMDebugger.getEventListeners", { objectId: result.objectId }); if (listeners.some((l) => ACT.test(l.type) && !libScripts.has(l.scriptId))) live.add(i); if (listeners.some((l) => ACT.test(l.type) && libScripts.has(l.scriptId))) liveLib.add(i); }
      const chains = await evaluate(`window.__btns.map(b => { const idx = []; for (let e = b; e; e = e.parentNode) idx.push(window.__chain.indexOf(e)); idx.push(window.__chain.length - 1); return { label: (b.getAttribute("aria-label") || b.innerText || b.title || "control").trim().replace(/\\s+/g, " ").slice(0, 28) + (b.tagName === "A" ? " [link to " + (b.getAttribute("href") ?? "nowhere") + "]" : " [button with no action]"), idx, slot: b.getAttribute("data-slot") }; })`);
      deadButtons = chains.filter((c) => !c.idx.some((i) => live.has(i)) && !(c.slot && c.slot !== "button" && c.idx.some((i) => liveLib.has(i)))).map((c) => c.label);
      await cdp("Runtime.releaseObjectGroup", { objectGroup: "look" });
    }
  } catch (e) { say("NOTE", "controls that do nothing", "the button check could not run: " + e.message); }
  const dead = deadButtons;
  say(dead.length ? "FAIL" : "PASS", "controls that do nothing", dead.length ? `${dead.length}: ${list([...new Set(dead)], 5)}. Make each one work, remove it, or disable it visibly (disabled or aria-disabled="true") and list it at hand-over.` : "every link goes somewhere and every button has an action");

  // Color, from the desktop capture
  // Pictures on the first screen, so a photograph in natural color is not mistaken for a tinted interface
  await evaluate('scrollTo({ top: 0, left: 0, behavior: "instant" })'); await sleep(200);
  const pictures = await evaluate(`[...document.querySelectorAll("body *")].filter(e => { const r = e.getBoundingClientRect(); if (r.width < 40 || r.height < 40 || r.top >= innerHeight || r.bottom <= 0) return false; const t = e.tagName.toLowerCase(); return ["img", "video", "canvas", "picture"].includes(t) || /url\\(/.test(getComputedStyle(e).backgroundImage); }).map(e => { const r = e.getBoundingClientRect(); return { x: Math.max(0, r.left), y: Math.max(0, r.top), width: Math.min(innerWidth, r.right) - Math.max(0, r.left), height: Math.min(innerHeight, r.bottom) - Math.max(0, r.top) }; })`);
  out.pictures = pictures || [];
  // A drawing in hatched, engraved or woodcut linework: sharp light-dark jumps inside the picture, on a flat ground.
  // A photograph of leaves or film grain jumps as often, but it runs to its own edges, so the ground test leaves it out.
  const HATCHED = 5, GROUND = 45, drawn = out.pictures.filter((r) => r.width * r.height >= 0.03 * 1440 * 900 && r.width * r.height < 0.9 * 1440 * 900).map((r) => ({ ...r, ...pictureTexture(join(outDir, "desktop.png"), r) })).filter((r) => r.edges >= HATCHED && r.ground >= GROUND);
  out.hatchedPictures = drawn;
  const stageRect = PIECE && out.habits && out.habits.stage && out.habits.stage.rect, inStage = (r) => stageRect && r.x >= stageRect.x - 2 && r.y >= stageRect.y - 2 && r.x + r.width <= stageRect.x + stageRect.width + 2 && r.y + r.height <= stageRect.y + stageRect.height + 2;
  const loose = drawn.filter((r) => !inStage(r));
  if (drawn.length && !loose.length) say("PASS", "old-print drawing", `${drawn.length} drawn picture${drawn.length > 1 ? "s are" : " is"} part of the piece's object`);
  else if (drawn.length && LOOK.supplied) say("NOTE", "old-print drawing", `${drawn.length} picture${drawn.length > 1 ? "s" : ""} on the first screen ${drawn.length > 1 ? "are" : "is"} drawn in hatched or engraved linework. Allowed: the design record says the request supplies the look ("${LOOK.words.slice(0, 120)}"). Repeat those words at hand-over.`);
  else if (drawn.length && EXPLAINS) say("NOTE", "old-print drawing", `${drawn.length} picture${drawn.length > 1 ? "s" : ""} on the first screen ${drawn.length > 1 ? "are" : "is"} drawn in fine linework. Allowed: the Picture line calls it a drawing that explains ("${PICTURE.slice(0, 110)}"). It has to carry labels that name what it shows. An engraving set beside the headline for decoration is still out.`);
  else if (drawn.length) say(flag("--asked-for-drawing") ? "NOTE" : "FAIL", "old-print drawing", `${drawn.length} picture${drawn.length > 1 ? "s" : ""} on the first screen ${drawn.length > 1 ? "are" : "is"} drawn in hatched or engraved linework` + (flag("--asked-for-drawing") ? " (allowed: the user asked for illustration)." : `. That is the picture a generated page reaches for. Follow the brief's Picture line: the interface for software, a plain photograph for a product, a drawing that explains (with its labels) for a place or service without photographs. If the user asked for illustration or the brand uses this style, run again with --asked-for-drawing.`));
  else say("PASS", "old-print drawing", "no hatched or engraved drawing on the first screen");
  const m = measure(join(outDir, "desktop.png"), { pictures: pictures || [] });
  out.palette = m;
  const top = [...m.families].sort((a, b) => b.tinted - a.tinted)[0];
  say(m.tinted > 10 ? "FAIL" : "PASS", "one-hue wash", m.tinted > 10 ? `${m.tinted}% of the first screen is gray that leans ${top ? top.name : "toward a hue"} (limit 10%${m.naturalPicturesLeftOut ? ", photographs in natural color left out" : ""}). Make the neutrals gray, and give any picture printed in the accent's ink its own colors or black and white.` : `${m.neutral}% neutral, ${m.tinted}% tinted gray, ${m.colored}% color on the first screen` + (m.naturalPicturesLeftOut ? `, leaving out ${m.naturalPicturesLeftOut} picture${m.naturalPicturesLeftOut > 1 ? "s" : ""} in natural color` : ""));
  if (m.colored > 25) say("NOTE", "color area", `${m.colored}% of the first screen is plain color. That is right only if the Palette line names a flooded field or the screen is mostly photograph.`);

  await writeFile(join(outDir, "report.json"), JSON.stringify(out, null, 1));
  if (flag("--json")) console.log(JSON.stringify(out));
  else {
    console.log(`better-design look: ${target}`);
    console.log(`register: ${REG.name ? `${REG.name} (from ${REG.from})` : "not declared, so the page is checked as an ordinary page. A showpiece or a piece is declared by a line \"Register: showpiece\" or \"Register: piece\" in .interface-design/"}\n`);
    console.log(lines.join("\n"));
    console.log(`\nCaptures and report.json are in ${outDir}`);
    console.log(`${failed ? failed + " FAIL. Fix these and run it again." : "No FAIL."} Now open desktop.png and phone-full.png and go through the checks in section 7 with your own eyes. This script cannot judge whether the page was designed.`);
  }
} finally { try { ws.close(); } catch {} await cleanup(); }
process.exit(broken ? 2 : failed ? 1 : 0);
