// Checks every skill in skills/ against the Agent Skills format and this repository's rules.
//
//   node scripts/validate.mjs
//
// What it fails, for each folder under skills/:
//   1. no SKILL.md, or no frontmatter block at its top
//   2. no name; a name that is not lowercase letters, digits and hyphens, is longer than 64 characters,
//      or differs from the folder name
//   3. no description, or one longer than 1024 characters
//   4. a frontmatter key outside: name, description, license, compatibility, allowed-tools, metadata
//   5. a file SKILL.md names under references/ or scripts/ that does not exist
//   6. a script (.js, .mjs, .cjs) that does not parse
//   7. files that should not ship: .DS_Store, node_modules, .env
//   8. a skill the README does not mention with "--skill <name>"
// What it only warns about: a SKILL.md over 500 lines (agents load the whole file; move detail to references/).
// The exit code is 1 when anything fails. No dependencies beyond Node 18 or later.
import { readFile, readdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join, dirname, extname, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const skillsDir = join(root, "skills");
const ALLOWED = ["name", "description", "license", "compatibility", "allowed-tools", "metadata"];
let failed = 0, warned = 0;
const fail = (skill, text) => { failed++; console.log(`FAIL  ${skill}: ${text}`); };
const warn = (skill, text) => { warned++; console.log(`WARN  ${skill}: ${text}`); };

// The top-level keys of a frontmatter block, with the value of each simple "key: value" line. Nested maps keep their key only.
function frontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!m) return null;
  const out = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z][\w-]*):\s*(.*)$/);
    if (!kv) continue;
    let value = kv[2].trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
    out[kv[1]] = value;
  }
  return out;
}

async function walk(dir, out = []) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) { out.push(p + "/"); if (e.name !== "node_modules") await walk(p, out); } else out.push(p);
  }
  return out;
}

const readme = existsSync(join(root, "README.md")) ? await readFile(join(root, "README.md"), "utf8") : "";
const folders = existsSync(skillsDir) ? (await readdir(skillsDir, { withFileTypes: true })).filter((e) => e.isDirectory() && !e.name.startsWith(".")).map((e) => e.name).sort() : [];
if (!folders.length) { console.log("FAIL  no skills found in skills/"); process.exit(1); }

for (const folder of folders) {
  const dir = join(skillsDir, folder), file = join(dir, "SKILL.md"), before = failed;
  if (!existsSync(file)) { fail(folder, "no SKILL.md"); continue; }
  const text = await readFile(file, "utf8"), fm = frontmatter(text);
  if (!fm) { fail(folder, "SKILL.md does not start with a frontmatter block between --- lines"); continue; }

  if (!fm.name) fail(folder, "frontmatter has no name");
  else {
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(fm.name) || fm.name.length > 64) fail(folder, `name "${fm.name}" must be lowercase letters, digits and single hyphens, 64 characters at most`);
    if (fm.name !== folder) fail(folder, `name "${fm.name}" differs from the folder name`);
  }
  if (!fm.description) fail(folder, "frontmatter has no description");
  else if (fm.description.length > 1024) fail(folder, `description is ${fm.description.length} characters (limit 1024)`);
  const extra = Object.keys(fm).filter((k) => !ALLOWED.includes(k));
  if (extra.length) fail(folder, `frontmatter keys outside the format: ${extra.join(", ")}`);

  const lines = text.replace(/\r?\n$/, "").split("\n").length; // a final newline ends the last line, it does not start another
  if (lines > 500) warn(folder, `SKILL.md is ${lines} lines (aim for 500 at most)`);

  const named = [...new Set([...text.matchAll(/`((?:references|scripts)\/[\w./-]+\.\w+)`/g)].map((m) => m[1]))];
  for (const rel of named) if (!existsSync(join(dir, rel))) fail(folder, `SKILL.md names ${rel}, which does not exist`);

  const files = await walk(dir);
  for (const f of files) {
    const rel = relative(dir, f);
    if (/(^|\/)(\.DS_Store|\.env(\..*)?)$/.test(rel) || /(^|\/)node_modules\/$/.test(rel)) fail(folder, `${rel} should not ship with a skill`);
    if ([".js", ".mjs", ".cjs"].includes(extname(f))) {
      try { execFileSync(process.execPath, ["--check", f], { stdio: "pipe" }); } catch (e) { fail(folder, `${rel} does not parse: ${String(e.stderr || e.message).split("\n").find((l) => /Error/.test(l)) || "syntax error"}`); }
    }
  }

  if (!readme.includes(`--skill ${fm.name || folder}`) && !readme.includes(`skills/${folder})`)) fail(folder, "the README does not list this skill");
  if (failed === before) console.log(`ok    ${folder}: ${lines} lines, ${files.filter((f) => !f.endsWith("/")).length} files`);
}

console.log(`\n${folders.length} skill${folders.length === 1 ? "" : "s"} checked, ${failed} failed, ${warned} warning${warned === 1 ? "" : "s"}.`);
process.exit(failed ? 1 : 0);
