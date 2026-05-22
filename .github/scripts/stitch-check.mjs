/**
 * Stitch drift checker — Phase 14 MVP.
 *
 * Compares MD fenced `<!-- stitch:props v1 -->` block с TSX prop types.
 * Pairing: Design_system/<Name>.md ↔ src/components/<Name>.tsx
 *
 * Statuses:
 *   green  — props match (по name)
 *   yellow — TSX has extra props (informational)
 *   red    — MD prop missing in TSX (breaking — sync будет ломать render)
 *   purple — TSX not found или not parses
 *   gray   — opt-out: frontmatter `driftCheck: false`
 *
 * Posts results via GitHub Checks API (`checks: write` permission required).
 *
 * Single source of truth: vadimpianov/stitch repo, copied via workflow init.
 */

import fs from "node:fs";
import path from "node:path";

const MD_DIR = "Design_system";
const TSX_DIR = "src/components";

// ===== MD parser (subset of @stitch/editor parser) =====
function parseFrontmatter(text) {
  const out = {};
  for (const line of text.split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const idx = t.indexOf(":");
    if (idx < 0) continue;
    let v = t.slice(idx + 1).trim();
    if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1);
    out[t.slice(0, idx).trim()] = v;
  }
  return out;
}

function parseMd(source) {
  const fmRe = /^---\s*\n([\s\S]*?)\n---\s*\n/;
  const propsRe = /<!--\s*stitch:props v1\s*-->\s*([\s\S]*?)<!--\s*\/stitch:props v1\s*-->/;
  const fm = fmRe.exec(source);
  if (!fm) return null;
  const frontmatter = parseFrontmatter(fm[1] || "");
  const id = frontmatter.id;
  const name = frontmatter.name;
  if (!id || !name) return null;
  const props = [];
  const pm = propsRe.exec(source);
  if (pm) {
    let current = null;
    for (const raw of pm[1].split("\n")) {
      if (!raw.trim()) continue;
      if (raw.startsWith("- ")) {
        if (current) props.push(current);
        current = {};
        const rest = raw.slice(2).trim();
        const idx = rest.indexOf(":");
        if (idx > 0) current[rest.slice(0, idx).trim()] = rest.slice(idx + 1).trim();
      } else if (current && /^\s+/.test(raw)) {
        const t = raw.trim();
        const idx = t.indexOf(":");
        if (idx > 0) current[t.slice(0, idx).trim()] = t.slice(idx + 1).trim();
      }
    }
    if (current) props.push(current);
  }
  return { id, name, frontmatter, props };
}

// ===== TSX parser (regex-based MVP, не full AST) =====
function parseTsxProps(source, componentName) {
  const candidates = [
    new RegExp(`interface\\s+${componentName}Props\\s*\\{([\\s\\S]*?)^\\}`, "m"),
    new RegExp(`type\\s+${componentName}Props\\s*=\\s*\\{([\\s\\S]*?)^\\}`, "m"),
    new RegExp(`interface\\s+Props\\s*\\{([\\s\\S]*?)^\\}`, "m"),
    new RegExp(`type\\s+Props\\s*=\\s*\\{([\\s\\S]*?)^\\}`, "m"),
  ];
  let body = null;
  for (const re of candidates) {
    const m = re.exec(source);
    if (m) {
      body = m[1];
      break;
    }
  }
  if (body == null) return null;
  // Strip nested braces (ignore inline object types для simplicity)
  const cleaned = body.replace(/\{[^}]*\}/g, "__obj__");
  const props = [];
  // Split by ; or newline (cleaned body)
  for (const raw of cleaned.split(/;|\n/)) {
    const stmt = raw.trim().replace(/,$/, "");
    if (!stmt || stmt.startsWith("//") || stmt.startsWith("/*")) continue;
    const m = /^(\w+)\??\s*:\s*(.+)$/.exec(stmt);
    if (m) props.push({ name: m[1], type: m[2].trim() });
  }
  return props;
}

// ===== Compare =====
function compareDrift(mdProps, tsxProps) {
  const mdNames = new Set(mdProps.map((p) => p.name));
  const tsxNames = new Set(tsxProps.map((p) => p.name));
  const mdOnly = [...mdNames].filter((n) => !tsxNames.has(n));
  const tsxOnly = [...tsxNames].filter((n) => !mdNames.has(n));
  let status = "green";
  if (mdOnly.length > 0) status = "red";
  else if (tsxOnly.length > 0) status = "yellow";
  return { status, mdOnly, tsxOnly };
}

// ===== Walk MDs =====
function runChecks() {
  if (!fs.existsSync(MD_DIR)) {
    return { summary: `No ${MD_DIR}/ directory`, counts: {}, components: [] };
  }
  const mdFiles = fs.readdirSync(MD_DIR).filter((f) => f.endsWith(".md"));
  const results = [];
  for (const fname of mdFiles) {
    const filePath = `${MD_DIR}/${fname}`;
    const md = fs.readFileSync(filePath, "utf8");
    const parsed = parseMd(md);
    if (!parsed) {
      results.push({
        filePath,
        status: "purple",
        details: { parseError: "No frontmatter id+name (legacy MD?)" },
      });
      continue;
    }
    if (parsed.frontmatter.driftCheck === "false") {
      results.push({
        filePath,
        status: "gray",
        details: { reason: "frontmatter driftCheck: false (opt-out)" },
      });
      continue;
    }
    const tsxPath = path.join(TSX_DIR, `${parsed.name}.tsx`);
    if (!fs.existsSync(tsxPath)) {
      results.push({
        filePath,
        status: "purple",
        details: { parseError: `TSX not found: ${tsxPath}` },
      });
      continue;
    }
    const tsx = fs.readFileSync(tsxPath, "utf8");
    const tsxProps = parseTsxProps(tsx, parsed.name);
    if (tsxProps == null) {
      results.push({
        filePath,
        status: "purple",
        details: { parseError: `Could not parse ${parsed.name}Props в TSX` },
      });
      continue;
    }
    const cmp = compareDrift(parsed.props, tsxProps);
    results.push({
      filePath,
      status: cmp.status,
      details: { mdOnly: cmp.mdOnly, tsxOnly: cmp.tsxOnly },
    });
  }
  const counts = { green: 0, yellow: 0, red: 0, purple: 0, gray: 0 };
  for (const r of results) counts[r.status]++;
  const summary = `${counts.green} green · ${counts.yellow} yellow · ${counts.red} red · ${counts.purple} purple · ${counts.gray} gray`;
  return { summary, counts, components: results };
}

// ===== Build markdown report =====
function buildMarkdown(result) {
  const icon = { green: "🟢", yellow: "🟡", red: "🔴", purple: "🟣", gray: "⚪" };
  const lines = [
    "## Stitch drift check",
    "",
    `**${result.summary}**`,
    "",
    "| Component | Status | Details |",
    "|---|---|---|",
  ];
  for (const r of result.components) {
    const det = [];
    if (r.details.mdOnly?.length) det.push(`MD-only: \`${r.details.mdOnly.join("`, `")}\``);
    if (r.details.tsxOnly?.length) det.push(`TSX-only: \`${r.details.tsxOnly.join("`, `")}\``);
    if (r.details.parseError) det.push(`parse: ${r.details.parseError}`);
    if (r.details.reason) det.push(r.details.reason);
    lines.push(
      `| \`${r.filePath}\` | ${icon[r.status] || "?"} ${r.status} | ${det.join("; ") || "—"} |`
    );
  }
  return lines.join("\n");
}

// ===== Post check_run =====
async function postCheckRun(result) {
  const { GITHUB_TOKEN, COMMIT_SHA, REPO } = process.env;
  if (!GITHUB_TOKEN || !COMMIT_SHA || !REPO) {
    console.error("Missing GITHUB_TOKEN / COMMIT_SHA / REPO env");
    process.exit(1);
  }
  const conclusion =
    result.counts.red > 0
      ? "failure"
      : result.counts.purple > 0 || result.counts.yellow > 0
        ? "neutral"
        : "success";
  const text = buildMarkdown(result);
  const externalId = JSON.stringify(result.components).slice(0, 9000);
  const payload = {
    name: "Stitch drift check",
    head_sha: COMMIT_SHA,
    status: "completed",
    conclusion,
    output: {
      title: result.summary,
      summary: result.summary,
      text,
    },
    external_id: externalId,
  };
  const res = await fetch(`https://api.github.com/repos/${REPO}/check-runs`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
      "User-Agent": "stitch-check",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const t = await res.text();
    console.error(`check_run API failed: ${res.status}`, t.slice(0, 300));
    process.exit(1);
  }
  const body = await res.json();
  console.log(`✓ check_run posted: id=${body.id} conclusion=${conclusion}`);
  console.log(text);
}

const result = runChecks();
if (process.env.DRY_RUN === "1") {
  console.log(JSON.stringify(result, null, 2));
  console.log("\n--- markdown ---\n");
  console.log(buildMarkdown(result));
  process.exit(0);
}
await postCheckRun(result);
