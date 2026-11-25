// Detectors for small habits of generated pages, run inside the rendered page by look.mjs.
// HABITS is a JavaScript expression (a string) that scrolls through the page once and returns counts with examples:
// dot labels, chips that are not controls, small styled lines above or under headings, corner shape, long dashes,
// links that lead nowhere, and paper props (words set at an angle, squared or dotted paper behind the first screen,
// dashed rules, a back-to-top link), controls that lead to one place, arrows on controls, the main headline (a
// slogan shape, a block sharing its row, italic fragments) and icons (size and alignment against their text).
// It reads rectangles and computed styles only and changes nothing on the page.
export const HABITS = `(async () => {
  // "instant" matters: a page with smooth scrolling would still be moving when the first screen is measured
  for (let y = 0; y < document.documentElement.scrollHeight; y += Math.round(innerHeight * 0.7)) { scrollTo({ top: y, left: 0, behavior: "instant" }); await new Promise(r => setTimeout(r, 80)); } scrollTo({ top: 0, left: 0, behavior: "instant" }); await new Promise(r => setTimeout(r, 250));
  const vw = innerWidth, vh = innerHeight;
  const txt = (e) => (e.innerText || "").trim().replace(/\\s+/g, " ");
  const all = [...document.querySelectorAll("body *")].filter(e => { const r = e.getBoundingClientRect(); return r.width > 2 && r.height > 2 && getComputedStyle(e).visibility !== "hidden"; });
  // color: chroma of a CSS color (0 for gray), null when fully transparent
  const cv = document.createElement("canvas"); cv.width = cv.height = 1; const cx = cv.getContext("2d", { willReadFrequently: true });
  const chroma = (c) => { cx.clearRect(0, 0, 1, 1); cx.fillStyle = "#000"; cx.fillStyle = c; cx.fillRect(0, 0, 1, 1); const d = cx.getImageData(0, 0, 1, 1).data; if (d[3] < 13) return null;
    const f = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }, R = f(d[0]), G = f(d[1]), B = f(d[2]);
    const l = Math.cbrt(0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B), m = Math.cbrt(0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B), s = Math.cbrt(0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B);
    return Math.hypot(1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s); };
  const painted = (c) => chroma(c) !== null;
  const radius = (s, r) => { const v = parseFloat(s.borderTopLeftRadius) || 0; return /%/.test(s.borderTopLeftRadius) ? v / 100 * Math.min(r.width, r.height) : v; };
  const control = (e) => !!e.closest("a[href],button,input,select,textarea,label,summary,[role=button],[role=tab],[role=option],[role=menuitem],[role=checkbox],[role=switch]");
  const CAVEAT = /\\b(sample|demo|example|interactive|preview|illustrative|mock(up)?|placeholder|prototype|simulated|fictional)\\b/i;
  const heads = all.filter(e => /^H[1-3]$/.test(e.tagName) && txt(e).length > 2);
  const mono = (s) => /mono|menlo|consolas|courier/i.test(s.fontFamily.split(",")[0]);

  // ---- 1. dot labels: a small filled circle beside a short piece of text
  const isDot = (w, h, br, bg) => w >= 4 && w <= 12 && Math.abs(w - h) <= 1.5 && br >= w / 2 - 0.6 && painted(bg);
  const boxOf = (el) => { for (let e = el, i = 0; e && i < 3; e = e.parentElement, i++) { const r = e.getBoundingClientRect(), s = getComputedStyle(e);
    if (r.height <= 46 && r.width < 420 && (painted(s.backgroundColor) || parseFloat(s.borderTopWidth) > 0)) return { tinted: (chroma(s.backgroundColor) || 0) > 0.012 || (parseFloat(s.borderTopWidth) > 0 && (chroma(s.borderTopColor) || 0) > 0.04) }; } return null; };
  const inLegend = (el) => { for (let e = el.parentElement, i = 0; e && i < 4; e = e.parentElement, i++) { const g = [...e.querySelectorAll("svg,canvas")].find(c => c.getBoundingClientRect().width >= 160 && c.getBoundingClientRect().height >= 80); if (g) return true; } return false; };
  const dots = [], seen = new Set();
  const note = (label, animated) => { if (seen.has(label)) return; const t = txt(label); if (t.length < 2 || t.length > 34) return; seen.add(label); const box = boxOf(label);
    dots.push({ text: t, boxed: !!box, tintedBox: !!(box && box.tinted), caveat: CAVEAT.test(t), inData: !!label.closest("table,tr,li,[role=row],[role=listitem]"), legend: inLegend(label), animated }); };
  for (const e of all) { const r = e.getBoundingClientRect(), s = getComputedStyle(e);
    if (!e.children.length && !txt(e) && isDot(r.width, r.height, radius(s, r), s.backgroundColor) && e.parentElement) note(e.parentElement, s.animationName !== "none");
    else if (e.children.length <= 3) { const t = txt(e); if (t.length >= 2 && t.length <= 34) for (const ps of ["::before", "::after"]) { const p = getComputedStyle(e, ps); if (p.content === "none" || p.content === "normal") continue; const w = parseFloat(p.width), h = parseFloat(p.height);
      if (isDot(w, h, /%/.test(p.borderTopLeftRadius) ? w : parseFloat(p.borderTopLeftRadius) || 0, p.backgroundColor)) note(e, p.animationName !== "none"); } } }

  // ---- 2. chips: a short piece of text in a small box that is not a control
  const chips = all.filter(e => { if (control(e) || e.children.length > 3) return false; const r = e.getBoundingClientRect(), s = getComputedStyle(e), t = txt(e);
    return t.length >= 2 && t.length <= 30 && r.height >= 16 && r.height <= 40 && r.width < 320 && (painted(s.backgroundColor) || parseFloat(s.borderTopWidth) > 0) && radius(s, r) >= 3 && !e.closest("table,thead"); }).filter((e, i, a) => !a.some(o => o !== e && o.contains(e)));

  // ---- 3. small lines above and under headings
  const styleOf = (e) => { const s = getComputedStyle(e), t = txt(e), upper = s.textTransform === "uppercase" || (t === t.toUpperCase() && /[A-Z]{3}/.test(t)), track = s.letterSpacing === "normal" ? 0 : parseFloat(s.letterSpacing) / parseFloat(s.fontSize);
    const rule = ["::before", "::after"].some(ps => { const p = getComputedStyle(e, ps); return p.content !== "none" && p.content !== "normal" && parseFloat(p.height) <= 3 && parseFloat(p.width) >= 12 && parseFloat(p.width) <= 96 && painted(p.backgroundColor); })
      || [...e.children].concat(e.previousElementSibling || []).some(c => { const r = c.getBoundingClientRect(); return !txt(c) && r.height <= 3 && r.width >= 12 && r.width <= 96 && painted(getComputedStyle(c).backgroundColor); });
    return upper ? "capitals" : track >= 0.08 ? "wide tracking" : s.fontStyle === "italic" ? "italic" : mono(s) ? "monospace" : rule ? "rule" : (painted(s.backgroundColor) || parseFloat(s.borderTopWidth) > 0) && e.getBoundingClientRect().height <= 40 ? "chip" : null; };
  const small = all.filter(e => { if (e.children.length > 3 || heads.some(h => e.contains(h) || h.contains(e))) return false; const t = txt(e); if (t.length < 2 || t.length > 60) return false;
    if (e.closest("nav,[role=navigation],[aria-label*=readcrumb i],table,form,button,a[href],label,figure,footer,time")) return false; return parseFloat(getComputedStyle(e).fontSize) <= 16; }).filter((e, i, a) => !a.some(o => o !== e && e.contains(o) && txt(o) === txt(e)));
  const above = [], under = [];
  for (const h of heads) { const hr = h.getBoundingClientRect();
    const up = small.filter(e => { const r = e.getBoundingClientRect(); return txt(e).length <= 48 && r.bottom <= hr.top + 6 && hr.top - r.bottom < 70 && r.left < hr.right && r.right > hr.left && r.height < 60; }).sort((a, b) => b.getBoundingClientRect().bottom - a.getBoundingClientRect().bottom)[0];
    if (up && styleOf(up)) above.push({ text: txt(up), style: styleOf(up), heading: txt(h).slice(0, 40), main: h.tagName === "H1" });
    const down = small.filter(e => { const r = e.getBoundingClientRect(); return r.top >= hr.bottom - 6 && r.top - hr.bottom < 36 && r.left < hr.right && r.right > hr.left && r.height < 60; }).sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top)[0];
    if (down && ["capitals", "wide tracking", "italic"].includes(styleOf(down))) under.push({ text: txt(down), style: styleOf(down), heading: txt(h).slice(0, 40) }); }

  // ---- 4. corner shape
  const buttons = all.filter(e => /^(A|BUTTON)$/.test(e.tagName) && (painted(getComputedStyle(e).backgroundColor) || parseFloat(getComputedStyle(e).borderTopWidth) > 0) && e.getBoundingClientRect().height >= 28 && e.getBoundingClientRect().height <= 64 && txt(e).length > 1);
  const pill = buttons.filter(e => { const r = e.getBoundingClientRect(); return radius(getComputedStyle(e), r) >= r.height / 2 - 1; });
  const boxy = (e) => { const s = getComputedStyle(e); return painted(s.backgroundColor) || parseFloat(s.borderTopWidth) > 0 || s.boxShadow !== "none"; };
  const big = all.filter(e => { const r = e.getBoundingClientRect(); return r.width >= 0.4 * vw && r.height >= 200 && radius(getComputedStyle(e), r) >= 12 && boxy(e); });
  const h1 = heads.find(h => h.tagName === "H1" && h.getBoundingClientRect().top < vh);
  const heroBox = h1 ? all.find(e => { if (!e.contains(h1) || e === h1) return false; const r = e.getBoundingClientRect(); return r.width >= 0.6 * vw && r.width < vw - 8 && radius(getComputedStyle(e), r) >= 12 && boxy(e); }) : null;

  // ---- 5. long dashes
  const body = document.body.innerText, dashIn = (list) => list.filter(e => /[\\u2014]|\\s--\\s/.test(txt(e)));
  const shortText = all.filter(e => !e.children.length && txt(e).length >= 2 && txt(e).length <= 60 && parseFloat(getComputedStyle(e).fontSize) <= 16 && !e.closest("p,li,td,blockquote"));

  // ---- 6. links that lead nowhere
  const dead = [...document.querySelectorAll("a")].filter(a => { const r = a.getBoundingClientRect(); if (r.width < 2 || r.height < 2 || a.getAttribute("aria-disabled") === "true" || a.closest("[inert]")) return false; const h = a.getAttribute("href");
    if (h === null) return !a.hasAttribute("role"); if (h === "" || h === "#" || /^javascript:/i.test(h)) return true; if (h.startsWith("#")) { try { return !document.getElementById(decodeURIComponent(h.slice(1))) && !document.getElementsByName(decodeURIComponent(h.slice(1))).length; } catch { return false; } } return false; });

  // ---- 7. paper props: words set at an angle, squared or dotted paper behind content, dashed "perforation" rules, a back-to-top link
  const tiltOf = (e) => { const s = getComputedStyle(e); let a = 0; const m = s.transform && s.transform.match(/^matrix(?:3d)?\\(([^)]+)\\)/);
    if (m) { const v = m[1].split(",").map(parseFloat); a = Math.atan2(v[1], v[0]) * 180 / Math.PI; }
    const r = s.rotate && s.rotate.match(/(-?[\\d.]+)(deg|rad|turn)/); if (r) a += parseFloat(r[1]) * (r[2] === "rad" ? 180 / Math.PI : r[2] === "turn" ? 360 : 1);
    return a; };
  const tilted = all.filter(e => { const r = e.getBoundingClientRect(); if (r.width < 140 || r.height < 90 || txt(e).length < 20) return false; const a = Math.abs(tiltOf(e)); return a >= 0.4 && a <= 25; })
    .map(e => ({ text: txt(e).slice(0, 32), degrees: Math.round(tiltOf(e) * 10) / 10, top: e.getBoundingClientRect().top < vh }));
  const splitTop = (v) => { const out = []; let d = 0, cur = ""; for (const ch of v) { if (ch === "(") d++; if (ch === ")") d--; if (ch === "," && d === 0) { out.push(cur.trim()); cur = ""; } else cur += ch; } if (cur.trim()) out.push(cur.trim()); return out; };
  const fine = (px) => px >= 4 && px <= 48;
  // the directions of the fine repeating lines in a background, or "dots"; squared paper has two directions
  const patternOf = (s) => { const img = s.backgroundImage || ""; if (!/gradient/.test(img)) return []; const imgs = splitTop(img), sizes = splitTop(s.backgroundSize || "auto"), reps = splitTop(s.backgroundRepeat || "repeat"), found = [];
    imgs.forEach((g, i) => { const size = sizes[i % sizes.length].split(/\\s+/), rep = reps[i % reps.length], w = /px$/.test(size[0]) ? parseFloat(size[0]) : null, h = size[1] ? (/px$/.test(size[1]) ? parseFloat(size[1]) : null) : w;
      const inner = g.slice(g.indexOf("(") + 1), deg = inner.match(/^(-?[\\d.]+)deg/), to = inner.match(/^to (top|bottom|left|right)/), angle = deg ? ((parseFloat(deg[1]) % 180) + 180) % 180 : to ? (/left|right/.test(to[1]) ? 90 : 0) : 0;
      if (/^repeating-linear-gradient/.test(g)) { const stops = (inner.match(/-?[\\d.]+px/g) || []).map(parseFloat); if (stops.length && fine(Math.max(...stops))) found.push(Math.round(angle)); }
      else if (/^linear-gradient/.test(g) && !/no-repeat/.test(rep)) { const along = angle === 90 ? w : angle === 0 ? h : (w ?? h); if (along !== null && fine(along)) found.push(Math.round(angle)); }
      else if (/^radial-gradient/.test(g) && !/no-repeat/.test(rep) && w !== null && h !== null && fine(w) && fine(h)) found.push("dots"); });
    return found; };
  const isPaper = (s) => { const f = patternOf(s); return f.includes("dots") || new Set(f).size >= 2; };
  const paper = [document.body, ...all].filter(e => { const r = e.getBoundingClientRect(); if (r.top >= vh || r.bottom <= 0) return false; const big = (w, h) => w >= 300 && h >= 200;
    if (big(r.width, Math.min(r.bottom, vh) - Math.max(r.top, 0)) && isPaper(getComputedStyle(e))) return true;
    return ["::before", "::after"].some(ps => { const p = getComputedStyle(e, ps); return p.content !== "none" && p.content !== "normal" && big(parseFloat(p.width) || 0, parseFloat(p.height) || 0) && isPaper(p); }); })
    .map(e => e === document.body ? "the page background" : (e.className && typeof e.className === "string" ? "." + e.className.trim().split(/\\s+/)[0] : e.tagName.toLowerCase()));
  const brokenSide = (w, st, c) => parseFloat(w) > 0 && (st === "dashed" || st === "dotted") && painted(c);
  const dashed = [...document.querySelectorAll("body *")].filter(e => { if (/^(INPUT|TEXTAREA|SELECT)$/.test(e.tagName)) return false; const r = e.getBoundingClientRect(), s = getComputedStyle(e); if ((r.width < 1 && r.height < 1) || s.visibility === "hidden") return false;
    const t = brokenSide(s.borderTopWidth, s.borderTopStyle, s.borderTopColor), b = brokenSide(s.borderBottomWidth, s.borderBottomStyle, s.borderBottomColor), l = brokenSide(s.borderLeftWidth, s.borderLeftStyle, s.borderLeftColor), rt = brokenSide(s.borderRightWidth, s.borderRightStyle, s.borderRightColor);
    if (t + b + l + rt >= 3) return false; return ((t || b) && r.width >= 150) || ((l || rt) && r.height >= 90); })
    .map(e => (txt(e).slice(0, 28) || (e.className && typeof e.className === "string" ? "." + e.className.trim().split(/\\s+/)[0] : e.tagName.toLowerCase())));
  const toTop = [...document.querySelectorAll("a,button,[role=button]")].find(e => { const r = e.getBoundingClientRect(); return r.width > 2 && r.height > 2 && /\\b(back|return|scroll|jump|go)?\\s*to (the )?top\\b/i.test(txt(e) + " " + (e.getAttribute("aria-label") || "") + " " + (e.title || "")); });
  const props = { tilted, paper, dashed, toTop: toTop ? (txt(toTop) || toTop.getAttribute("aria-label") || "to top").slice(0, 24) : null, screens: Math.round(document.documentElement.scrollHeight / vh * 10) / 10 };

  // ---- 8. actions, arrows, the main headline and icons
  const onFirst = (e) => { const r = e.getBoundingClientRect(); return r.top < vh && r.bottom > 0 && r.left < vw && r.right > 0; };
  // A work screen: no large headline, and either a data table or a vertical navigation (an app, not a page that sells or explains)
  const bigHeadline = [...document.querySelectorAll("h1")].some(h => txt(h).length > 2 && onFirst(h) && parseFloat(getComputedStyle(h).fontSize) >= 44);
  const workScreen = !bigHeadline && ([...document.querySelectorAll("table,[role=grid]")].some(t => t.querySelectorAll("tr,[role=row]").length >= 3 && t.getBoundingClientRect().width > 300)
    || [...document.querySelectorAll("nav,aside,[role=navigation]")].some(n => { const r = n.getBoundingClientRect(); return r.height > r.width && n.querySelectorAll("a,button").length >= 4; }));
  const ctl = [...document.querySelectorAll("a[href],button,[role=button]")].filter(e => { const r = e.getBoundingClientRect(), t = txt(e); return r.width >= 24 && r.height >= 16 && r.height <= 90 && r.width <= 560 && getComputedStyle(e).visibility !== "hidden" && t.length >= 2 && t.length < 44; });
  const buttonish = (e) => { const s = getComputedStyle(e); return painted(s.backgroundColor) || (parseFloat(s.borderTopWidth) > 0 && parseFloat(s.borderLeftWidth) > 0 && painted(s.borderTopColor)); };
  const navOnly = (e) => !!e.closest("nav,[role=navigation],aside") && !buttonish(e);
  // Where a control leads. Same-page links are grouped by where they land: the same target, or one target inside another, is one place.
  const here = location.origin + location.pathname;
  const targetOf = (a) => { const h = a.getAttribute("href") || ""; if (a.tagName !== "A" || !h.includes("#")) return null; try { const u = new URL(h, location.href); if (u.origin + u.pathname !== here || u.hash.length < 2) return null; return document.getElementById(decodeURIComponent(u.hash.slice(1))); } catch { return null; } };
  const atTop = (el) => el.getBoundingClientRect().top + scrollY < 0.5 * vh;
  const targets = [...new Set([...document.querySelectorAll("a[href]")].map(targetOf).filter(el => el && !atTop(el)))];
  const rootOf = (el) => targets.find(t => t !== el && t.contains(el) && !targets.some(o => o !== t && o.contains(t))) || el;
  const placeOf = (e) => { if (e.tagName !== "A") return null; const h = e.getAttribute("href") || ""; if (!h || h === "#" || /^(javascript|mailto|tel):/i.test(h)) return null; const el = targetOf(e);
    if (el) return atTop(el) ? null : "#" + targets.indexOf(rootOf(el)); try { const u = new URL(h, location.href), p = u.origin + u.pathname.replace(/\\/$/, ""); return p === here.replace(/\\/$/, "") || (u.origin === location.origin && u.pathname === "/") ? null : p + u.search; } catch { return null; } };
  const byPlace = new Map(); for (const e of ctl.filter(onFirst)) { const p = placeOf(e); if (p === null) continue; if (!byPlace.has(p)) byPlace.set(p, []); byPlace.get(p).push(e); }
  const repeated = [...byPlace.values()].filter(g => g.length >= (workScreen ? 3 : 2) && g.some(e => !navOnly(e))).map(g => g.map(e => txt(e).slice(0, 26)));
  const ARROW = /[\\u2192\\u2197\\u2198\\u2199\\u2193\\u2191\\u2794\\u279C\\u27F6\\u203A\\u00BB\\u21B3\\u21AA]/;
  const hasArrow = (e) => { const r = e.getBoundingClientRect(), t = txt(e); if (e.matches("[aria-haspopup=menu],[aria-haspopup=listbox],[aria-haspopup=true],[aria-haspopup=tree],[aria-haspopup=grid],[aria-expanded],summary,[role=combobox],[role=tab]") || t.replace(new RegExp(ARROW.source, "g"), "").trim().length < 2) return false;
    if (ARROW.test(t.slice(-2)) || ARROW.test(t.slice(0, 2))) return true;
    for (const ps of ["::after", "::before"]) { const p = getComputedStyle(e, ps); if (!p.content || p.content === "none" || p.content === "normal") continue; if (ARROW.test(p.content)) return true; const w = parseFloat(p.width), h = parseFloat(p.height);
      if (w >= 4 && w <= 28 && h >= 4 && h <= 28 && (parseFloat(p.borderTopWidth) > 0 || parseFloat(p.borderRightWidth) > 0 || painted(p.backgroundColor) || (p.maskImage && p.maskImage !== "none") || (p.backgroundImage && p.backgroundImage !== "none"))) return true; }
    return [...e.querySelectorAll("svg,img,i,span")].some(i => { if (!/svg/i.test(i.tagName) && txt(i).length > 1) return false; const ir = i.getBoundingClientRect(), named = /arrow|chevron|caret/i.test(i.getAttribute("class") || "");
      if (ir.left + ir.width / 2 <= r.left + r.width * 0.6 || ir.width > 28 || ir.height > 28 || ir.width < 1) return false; if (named) return true; if (ir.width < 6 || ir.height < 6) return false; if (/svg/i.test(i.tagName)) return named || [...i.querySelectorAll("path,polyline,line")].map(p => p.getAttribute("d") || p.getAttribute("points") || "").join(" ").length < 140;
      return named || [getComputedStyle(i), getComputedStyle(i, "::after"), getComputedStyle(i, "::before")].some(p => ARROW.test(p.content || "") || parseFloat(p.borderTopWidth) > 0 || parseFloat(p.borderRightWidth) > 0 || (p.maskImage && p.maskImage !== "none")); }); };
  const actionCtl = ctl.filter(e => buttonish(e) ? !e.closest("table") : !navOnly(e) && !e.closest("footer,table,p,li")), arrowed = actionCtl.filter(hasArrow);
  // the main headline: its words, whether a block shares its row, italic fragments in headings
  const h1First = [...document.querySelectorAll("h1")].find(h => txt(h).length > 2 && onFirst(h) && getComputedStyle(h).visibility !== "hidden");
  let beside = null, slogan = null;
  if (h1First && !workScreen) { const rg = document.createRange(); rg.selectNodeContents(h1First); const lines = [...rg.getClientRects()].filter(x => x.width > 2);
    if (lines.length) { const left = Math.min(...lines.map(x => x.left)), right = Math.max(...lines.map(x => x.right)), top = Math.min(...lines.map(x => x.top)), bottom = Math.max(...lines.map(x => x.bottom)), mid = (left + right) / 2;
      const centered = Math.abs(mid - vw / 2) < vw * 0.05 && left > vw * 0.1;
      if (!centered) { const b = all.filter(e => { if (e.contains(h1First) || h1First.contains(e) || e.closest("nav,[role=navigation],aside")) return false; const r = e.getBoundingClientRect(); if (r.width < 180 || r.height < 60 || r.width > vw * 0.62) return false; const overlap = Math.min(r.bottom, bottom) - Math.max(r.top, top); return r.left >= right - 24 && r.left >= vw * 0.42 && overlap > 0.3 * Math.min(r.height, bottom - top); }).filter((e, i, a) => !a.some(o => o !== e && o.contains(e)))[0];
        if (b) beside = txt(b).slice(0, 40) || b.tagName.toLowerCase(); } }
    const SLOGAN = /^(your|meet|say goodbye|unlock|elevate|supercharge|reimagine|transform|empower)\\b.{8,}|^one \\w+( \\w+)? for\\b|\\b(all[- ]in[- ]one|in one place|on one \\w+|made (simple|easy)|simplified|reimagined|effortless(ly)?|seamless(ly)?|that just works|done right|the future of|next[- ]generation|redefined|like never before)\\b/i;
    if (parseFloat(getComputedStyle(h1First).fontSize) >= 40 && SLOGAN.test(txt(h1First))) slogan = txt(h1First).slice(0, 70); }
  const italicHeads = heads.filter(h => getComputedStyle(h).fontStyle !== "italic" && [...h.querySelectorAll("*")].some(c => txt(c).length > 1 && getComputedStyle(c).fontStyle === "italic")).map(h => txt(h).slice(0, 44));
  // icons beside text: one size per text size, and centered on the line (or on the block, for a tile beside two lines)
  const firstTextIn = (el, skip) => { const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT); let n; while ((n = w.nextNode())) { if (skip.contains(n) || n.textContent.trim().length < 2) continue; const rg = document.createRange(); rg.selectNodeContents(n); const rs = [...rg.getClientRects()].filter(x => x.width > 2); if (rs.length) return { rect: rs[0], size: parseFloat(getComputedStyle(n.parentElement).fontSize) }; } return null; };
  const iconEls = [...document.querySelectorAll("svg,img,i,span")].filter(e => { if (e.parentElement && e.parentElement.closest("svg")) return false; const r = e.getBoundingClientRect(), m = Math.max(r.width, r.height); if (m < 12 || m > 40 || Math.min(r.width, r.height) < 8 || getComputedStyle(e).visibility === "hidden") return false;
    return !/^(I|SPAN)$/.test(e.tagName) || (txt(e).length === 0 && /icon|material|symbol|fa-|lucide|ph-|glyph/i.test(typeof e.className === "string" ? e.className : "")); });
  const icons = [];
  for (const ic of iconEls) { let box = ic.parentElement, found = null; for (let i = 0; i < 3 && box; i++, box = box.parentElement) { const t = txt(box); if (t.length >= 2 && t.length <= 70 && box.getBoundingClientRect().height <= 90) { found = box; break; } }
    if (!found) continue; const ft = firstTextIn(found, ic); if (!ft) continue; const ir = ic.getBoundingClientRect(), tr = ft.rect, fr = found.getBoundingClientRect();
    if (Math.min(ir.bottom, tr.bottom) - Math.max(ir.top, tr.top) <= 0.3 * Math.min(ir.height, tr.height) || Math.max(tr.left - ir.right, ir.left - tr.right) > 28) continue; const mid = (ir.top + ir.bottom) / 2;
    icons.push({ size: Math.round(Math.max(ir.width, ir.height)), textSize: Math.round(ft.size), ratio: Math.max(ir.width, ir.height) / ft.size, off: Math.min(Math.abs(mid - (tr.top + tr.bottom) / 2), Math.abs(mid - (fr.top + fr.bottom) / 2)), text: txt(found).slice(0, 22) }); }
  const inlineIcons = icons.filter(i => i.ratio <= 1.6), bySize = {}; for (const i of inlineIcons) (bySize[i.textSize] = bySize[i.textSize] || new Set()).add(i.size);
  const mixed = Object.entries(bySize).map(([k, s]) => ({ text: +k, sizes: [...s].sort((a, b) => a - b) })).filter(g => g.sizes.length >= 3 && g.sizes[g.sizes.length - 1] - g.sizes[0] >= 3);
  const acts = { workScreen, repeated, arrowsFirst: arrowed.filter(onFirst).map(e => txt(e).slice(0, 24)), arrowsPage: arrowed.length, actionControls: actionCtl.length, beside, slogan, italicHeads,
    icons: { inline: inlineIcons.length, off: inlineIcons.filter(i => i.off > 2.5).map(i => i.text), mixed } };

  // ---- 9. showpiece: what dominates the first screen, how many words are on it, and whether anything moves
  const shareOf = (e) => { const r = e.getBoundingClientRect(), w = Math.min(r.right, vw) - Math.max(r.left, 0), h = Math.min(r.bottom, vh) - Math.max(r.top, 0); return w > 0 && h > 0 ? w * h / (vw * vh) : 0; };
  const topPicture = [document.body, ...all].filter(e => /^(IMG|VIDEO|CANVAS|SVG|PICTURE)$/i.test(e.tagName) || (getComputedStyle(e).backgroundImage || "").includes("url(")).map(e => ({ kind: (getComputedStyle(e).backgroundImage || "").includes("url(") && !/^(IMG|VIDEO|CANVAS)$/.test(e.tagName) ? "background picture" : e.tagName.toLowerCase(), share: shareOf(e) })).sort((a, b) => b.share - a.share)[0];
  const widestLine = Math.max(0, ...heads.filter(onFirst).map(h => { const rg = document.createRange(); rg.selectNodeContents(h); return Math.max(0, ...[...rg.getClientRects()].map(x => Math.min(x.right, vw) - Math.max(x.left, 0))); })) / vw;
  let wordsFirst = 0; { const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n; while ((n = w.nextNode())) { const s = n.textContent.trim(); if (!s || !n.parentElement || /^(SCRIPT|STYLE|NOSCRIPT|TEMPLATE)$/.test(n.parentElement.tagName)) continue; const ps = getComputedStyle(n.parentElement); if (ps.visibility === "hidden" || parseFloat(ps.opacity) < 0.05) continue;
    const rg = document.createRange(); rg.selectNodeContents(n); if ([...rg.getClientRects()].some(x => x.width > 1 && x.height > 1 && x.top < vh && x.bottom > 0 && x.left < vw && x.right > 0)) wordsFirst += s.split(/\\s+/).length; } }
  const moves = []; { const sized = (e) => { const r = e.getBoundingClientRect(); return r.width >= 80 && r.height >= 24; };
    const animated = all.filter(e => { const s = getComputedStyle(e); return s.animationName && s.animationName !== "none" && parseFloat(s.animationDuration) >= 0.15 && sized(e); }).length; if (animated) moves.push(animated + " animated element" + (animated > 1 ? "s" : ""));
    const waapi = (document.getAnimations ? document.getAnimations() : []).filter(a => !(a instanceof CSSAnimation) && !(a instanceof CSSTransition)).length; if (waapi) moves.push(waapi + " scripted animation" + (waapi > 1 ? "s" : ""));
    const films = [...document.querySelectorAll("video")].filter(v => (v.autoplay || !v.paused) && sized(v)).length; if (films) moves.push(films + " playing film" + (films > 1 ? "s" : ""));
    const canvases = [...document.querySelectorAll("canvas")].filter(c => c.getBoundingClientRect().width >= 300).length; if (canvases) moves.push(canvases + " canvas" + (canvases > 1 ? "es" : ""));
    const scenes = all.filter(e => { const s = getComputedStyle(e); return (s.position === "sticky" && e.getBoundingClientRect().height >= 0.6 * vh) || (s.animationTimeline && s.animationTimeline !== "auto" && s.animationTimeline !== "none"); }).length; if (scenes) moves.push(scenes + " scroll scene" + (scenes > 1 ? "s" : "")); }
  const show = { picture: topPicture && topPicture.share > 0 ? { kind: topPicture.kind, share: Math.round(topPicture.share * 100) } : null, widestLine: Math.round(widestLine * 100), words: wordsFirst, moves, screens: Math.round(document.documentElement.scrollHeight / vh * 10) / 10 };

  // ---- 10. sections that repeat from page to page: a facts strip under the first screen, one section layout
  // used throughout, and small labels in tracked capitals
  const wordsOf = (s) => s.split(/\\s+/).filter(Boolean).length;
  const textLeaves = all.filter(e => [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim().length > 1));
  const bandEls = workScreen ? [] : all.filter(e => { const r = e.getBoundingClientRect(); return r.width >= vw * 0.8 && r.height >= 36 && r.height <= 190 && r.top >= 0.4 * vh && r.top <= 1.35 * vh && !/^(NAV|FOOTER|HEADER|TABLE|FORM|TR|THEAD|TBODY)$/.test(e.tagName) && !e.closest("nav,footer,table,form,[role=tablist]") && !e.querySelector("h1,h2,input,select,textarea,table"); });
  let strip = null;
  for (const e of bandEls) { const er = e.getBoundingClientRect(); if (bandEls.some(o => o !== e && e.contains(o) && o.getBoundingClientRect().height >= er.height * 0.7)) continue;
    const t = txt(e), inside = textLeaves.filter(l => e.contains(l)); if (!inside.length || wordsOf(t) > 45 || wordsOf(t) < 4 || e.querySelectorAll("a[href],button").length > 1) continue;
    const cols = new Set(inside.map(l => Math.round(l.getBoundingClientRect().left / (vw / 12)))).size, lines = new Set(inside.map(l => Math.round(l.getBoundingClientRect().top / 14))).size; if (cols < 3 || lines > 3) continue;
    const caps = inside.filter(l => { const x = txt(l); return getComputedStyle(l).textTransform === "uppercase" || (x === x.toUpperCase() && /[A-Z]{3}/.test(x)); }).length, figures = inside.filter(l => /\\d/.test(txt(l))).length;
    const marks = [...e.querySelectorAll("svg,img,i,span")].filter(g => { const r = g.getBoundingClientRect(); return r.width >= 6 && r.width <= 40 && r.height >= 6 && r.height <= 40 && txt(g).length <= 1; }).length;
    if (caps >= 3 || figures >= 2 || marks >= 3) { strip = t.slice(0, 80); break; } }
  const h2s = workScreen ? [] : [...document.querySelectorAll("h2")].filter(h => txt(h).length > 2 && getComputedStyle(h).visibility !== "hidden" && h.getBoundingClientRect().width > 2);
  const layout = { sideBySide: [], centered: 0, above: 0 };
  for (const h of h2s) { const rg = document.createRange(); rg.selectNodeContents(h); const ls = [...rg.getClientRects()].filter(x => x.width > 2); if (!ls.length) continue;
    const left = Math.min(...ls.map(x => x.left)), right = Math.max(...ls.map(x => x.right)), top = Math.min(...ls.map(x => x.top)), bottom = Math.max(...ls.map(x => x.bottom));
    if (Math.abs((left + right) / 2 - vw / 2) < vw * 0.05 && left > vw * 0.12) { layout.centered++; continue; }
    const beside = left < vw * 0.3 && all.some(e => { if (e.contains(h) || h.contains(e) || e.closest("nav")) return false; const r = e.getBoundingClientRect(); if (r.width < vw * 0.25 || r.height < 60 || r.width > vw * 0.7) return false; return r.left >= right - 24 && r.left >= vw * 0.4 && Math.min(r.bottom, bottom + 40) - Math.max(r.top, top) > 30; });
    if (beside) layout.sideBySide.push(txt(h).slice(0, 26)); else layout.above++; }
  const capLabels = textLeaves.filter(l => { const s = getComputedStyle(l), t = txt(l), track = s.letterSpacing === "normal" ? 0 : parseFloat(s.letterSpacing) / parseFloat(s.fontSize);
    return (s.textTransform === "uppercase" || (t === t.toUpperCase() && /[A-Z]{3}/.test(t))) && track >= 0.04 && parseFloat(s.fontSize) <= 14 && t.length <= 40 && !l.closest("table,nav,footer,button,a,label,[role=tablist]"); }).map(l => txt(l).slice(0, 24));
  // boxed marks: a number or an icon in its own small tinted or bordered box, where the box is not a control,
  // a person's initials, a count that follows its words, a step of a form's progress list, or a picture
  const boxLike = (w, h, s) => w >= 20 && w <= 64 && h >= 20 && h <= 64 && Math.abs(w - h) <= 10 && (painted(s.backgroundColor) || (parseFloat(s.borderTopWidth) > 0 && parseFloat(s.borderLeftWidth) > 0 && painted(s.borderTopColor)));
  const interactiveBox = (e) => !!e.closest("a[href],button,input,select,textarea,label,summary,[role=button],[role=tab],[role=checkbox],[role=radio],[role=switch],[role=menuitem],[role=option]");
  const inProgress = (e) => { for (let p = e.parentElement, i = 0; p && i < 5; p = p.parentElement, i++) { if ((/^(OL|UL|NAV)$/.test(p.tagName) && p.querySelector("[aria-current]")) || /^(progressbar|tablist)$/.test(p.getAttribute("role") || "")) return true; } return false; };
  const lineMates = (e) => { const r = e.getBoundingClientRect(); let before = false, after = false; const scope = (e.parentElement && e.parentElement.parentElement) || e.parentElement || document.body;
    const w = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT); let n; while ((n = w.nextNode())) { if (e.contains(n) || n.textContent.trim().length < 2) continue; const rg = document.createRange(); rg.selectNodeContents(n);
      for (const lr of rg.getClientRects()) { if (lr.width < 2 || Math.min(lr.bottom, r.bottom) - Math.max(lr.top, r.top) < 6) continue; if (lr.left >= r.right - 2 && lr.left - r.right <= 48) after = true; if (lr.right <= r.left + 2 && r.left - lr.right <= 28) before = true; } }
    return { before, after }; };
  const boxedMarks = [];
  for (const e of all) { if (/^(IMG|SVG|PICTURE|VIDEO|CANVAS|INPUT)$/i.test(e.tagName) || interactiveBox(e) || inProgress(e)) continue; const r = e.getBoundingClientRect(), s = getComputedStyle(e); if (!boxLike(r.width, r.height, s)) continue;
    const t = txt(e);
    if (/^\\d{1,3}[.)]?$/.test(t)) { const m = lineMates(e); if (m.after && !m.before) boxedMarks.push("the number " + t); continue; }
    if (t.length) continue;
    const icon = [...e.querySelectorAll("svg,i")].find(i => { const ir = i.getBoundingClientRect(); return ir.width >= 10 && ir.width <= r.width * 0.8 && ir.height >= 10 && ir.height <= r.height * 0.8; });
    if (icon && !e.querySelector("img,picture,video,canvas")) { const near = textLeaves.find(l => { if (e.contains(l)) return false; const lr = l.getBoundingClientRect(); return Math.min(lr.bottom, r.bottom + 30) - Math.max(lr.top, r.top) > 4 && lr.left - r.right <= 48 && lr.left >= r.left - 4; }); boxedMarks.push("an icon beside \\"" + (near ? txt(near).slice(0, 20) : "") + "\\""); } }
  for (const e of all) { if (interactiveBox(e) || inProgress(e)) continue; for (const ps of ["::before", "::after"]) { const p = getComputedStyle(e, ps); if (!p.content || p.content === "none" || p.content === "normal") continue; if (!/counter\\(|^"\\d{1,3}[.)]?"$/.test(p.content)) continue; if (boxLike(parseFloat(p.width) || 0, parseFloat(p.height) || 0, p)) boxedMarks.push("a counter number before \\"" + txt(e).slice(0, 20) + "\\""); } }
  const padded = textLeaves.filter(l => /^0[1-9][.)]?$/.test(txt(l)) && !l.closest("table,pre,code,time,[role=tablist]") && !interactiveBox(l)).length
    + all.filter(e => ["::before", "::after"].some(ps => /leading-zero/.test(getComputedStyle(e, ps).content || ""))).length;
  const figs = (document.body.innerText.match(/\\bFIG(?:URE)?\\.?\\s*0?\\d\\b/g) || []).slice(0, 4);
  const sections = { strip, sideBySide: layout.sideBySide, centered: layout.centered, above: layout.above, capLabels, boxedMarks, padded, figs };

  // ---- 11. controls and UI SDK. Once the library has run, every control it drives carries data-slot; a control it does
  // not drive carries none. A ui-* tag whose name was guessed stays an undefined element and does nothing.
  const uiTags = () => [...new Set([...document.querySelectorAll("*")].map(e => e.localName).filter(t => t.startsWith("ui-")))];
  for (let i = 0; i < 16 && uiTags().some(t => !customElements.get(t)); i++) await new Promise(r => setTimeout(r, 250));
  const WIDGET = ["tab", "tablist", "switch", "checkbox", "radio", "combobox", "listbox", "option", "menu", "menuitem", "slider", "spinbutton", "dialog", "alertdialog", "button"];
  const nativeControls = [...document.querySelectorAll("button, input:not([type=hidden]), select, textarea, dialog")];
  const roleControls = [...document.querySelectorAll("[role]")].filter(e => WIDGET.includes((e.getAttribute("role") || "").trim().toLowerCase()) && !nativeControls.includes(e));
  const controlList = [...nativeControls, ...roleControls].filter(e => !e.closest("template"));
  const controlName = (e) => (e.getAttribute("aria-label") || txt(e) || (e.labels && e.labels[0] ? txt(e.labels[0]) : "") || e.getAttribute("name") || e.getAttribute("placeholder") || e.getAttribute("role") || "").slice(0, 24);
  const loose = controlList.filter(e => !e.hasAttribute("data-slot"));
  const sdk = { controls: controlList.length, loose: loose.length, looseSamples: loose.slice(0, 6).map(e => "<" + e.localName + "> " + controlName(e)),
    undefinedTags: uiTags().filter(t => !customElements.get(t)), defined: uiTags().some(t => !!customElements.get(t)), tools: Array.isArray(window.__lookAgentTools) ? [...new Set(window.__lookAgentTools)] : [],
    script: [...document.scripts].some(s => /ui-sdk/.test(s.src)) || performance.getEntriesByType("resource").some(r => /ui-sdk/.test(r.name)) };

  const outside = dots.filter(d => !d.inData && !d.legend);
  return { props, acts, show, sections, sdk, dots: { total: dots.length, tintedBox: dots.filter(d => d.tintedBox).map(d => d.text), caveat: dots.filter(d => d.caveat).map(d => d.text), outsideData: outside.map(d => d.text), animated: dots.filter(d => d.animated).length },
    chips: { total: chips.length, caveat: chips.map(txt).filter(t => CAVEAT.test(t)), samples: chips.slice(0, 5).map(txt) },
    aboveHeadings: above, underHeadings: under,
    corners: { buttons: buttons.length, pillButtons: pill.length, otherRounded: buttons.filter(e => !pill.includes(e) && radius(getComputedStyle(e), e.getBoundingClientRect()) >= 3).length, bigRounded: big.length, bigRoundedMax: Math.round(Math.max(0, ...big.map(e => radius(getComputedStyle(e), e.getBoundingClientRect())))), firstScreenBoxed: heroBox ? Math.round(radius(getComputedStyle(heroBox), heroBox.getBoundingClientRect())) : 0 },
    dashes: { total: (body.match(/\\u2014/g) || []).length, chars: body.length, inHeadings: dashIn(heads).map(e => txt(e).slice(0, 50)), inShortText: dashIn(shortText).map(e => txt(e).slice(0, 50)) },
    deadLinks: dead.map(a => (txt(a) || a.getAttribute("aria-label") || "link").slice(0, 28) + " [" + (a.getAttribute("href") ?? "no href") + "]") };
})()`;
