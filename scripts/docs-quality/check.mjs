#!/usr/bin/env node
// Runs Vale, markdownlint, cspell, and the suppression-policy check on docs
// content and reports only findings on lines you added or changed.
//
// The pre-commit hook, CI, and the npm scripts all call this one script, so
// every environment applies the same tools, versions, and filtering.
//
// Usage:
//   node scripts/docs-quality/check.mjs --base origin/main   Lines changed since the merge base with origin/main
//   node scripts/docs-quality/check.mjs --staged [files...]  Staged lines (pre-commit hook)
//   node scripts/docs-quality/check.mjs --all                Every line in every doc (baseline counts)
// Options:
//   --checks vale,markdownlint,cspell,suppressions   Run a subset of checks
//   --json <file>                                    Also write findings and counts as JSON

import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { syncValeVocabulary, ensureValeStyles } from './vale-setup.mjs';
import { toolPath } from './install-tools.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const DOC_DIRS = ['docs'];
const DOC_FILE = /\.mdx?$/i;
const LINK_IGNORE_FILE = '.lycheeignore';
const ALL_CHECKS = ['vale', 'markdownlint', 'cspell', 'suppressions'];

// ---------------------------------------------------------------------------
// Arguments

function parseArgs(argv) {
  const args = { mode: null, base: null, files: [], checks: ALL_CHECKS, json: null };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--all') args.mode = 'all';
    else if (arg === '--staged') args.mode = 'staged';
    else if (arg === '--base') { args.mode = 'base'; args.base = argv[++i]; }
    else if (arg === '--checks') args.checks = argv[++i].split(',').map((c) => c.trim()).filter(Boolean);
    else if (arg === '--json') args.json = argv[++i];
    else if (arg.startsWith('--')) throw new Error(`Unknown option: ${arg}`);
    else args.files.push(arg);
  }
  if (!args.mode) throw new Error('Choose a mode: --base <ref>, --staged, or --all.');
  for (const check of args.checks) {
    if (!ALL_CHECKS.includes(check)) throw new Error(`Unknown check: ${check}`);
  }
  return args;
}

// ---------------------------------------------------------------------------
// Files and changed lines

const toPosix = (p) => p.split(sep).join('/');
const rel = (p) => toPosix(relative(ROOT, isAbsolute(p) ? p : resolve(ROOT, p)));
const isDoc = (p) => DOC_DIRS.some((dir) => p.startsWith(`${dir}/`)) && DOC_FILE.test(p);
const isInScope = (p) => isDoc(p) || p === LINK_IGNORE_FILE;

function git(args) {
  return execFileSync('git', ['-c', 'core.quotePath=false', ...args], { cwd: ROOT, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
}

function walkDocs(dir, out = []) {
  for (const entry of readdirSync(join(ROOT, dir))) {
    const child = `${dir}/${entry}`;
    if (statSync(join(ROOT, child)).isDirectory()) walkDocs(child, out);
    else if (DOC_FILE.test(entry)) out.push(child);
  }
  return out;
}

// Parses `git diff --unified=0` output into Map<file, Set<lineNumber>> for the new side.
function parseDiff(diffText) {
  const changed = new Map();
  let current = null;
  for (const line of diffText.split('\n')) {
    if (line.startsWith('+++ ')) {
      const target = line.slice(4).replace(/\t$/, '');
      current = target === '/dev/null' ? null : target.replace(/^b\//, '');
      if (current && !changed.has(current)) changed.set(current, new Set());
    } else if (current && line.startsWith('@@')) {
      const match = /\+(\d+)(?:,(\d+))?/.exec(line);
      if (!match) continue;
      const start = Number(match[1]);
      const count = match[2] === undefined ? 1 : Number(match[2]);
      for (let n = start; n < start + count; n += 1) changed.get(current).add(n);
    }
  }
  return changed;
}

function collectTargets(args) {
  if (args.mode === 'all') {
    const files = DOC_DIRS.flatMap((dir) => walkDocs(dir));
    if (existsSync(join(ROOT, LINK_IGNORE_FILE))) files.push(LINK_IGNORE_FILE);
    return new Map(files.map((f) => [f, null])); // null = every line counts
  }
  const diffArgs = args.mode === 'staged'
    ? ['diff', '--cached', '--unified=0', '--no-color', '--no-ext-diff', '-M', '--diff-filter=ACMR']
    : ['diff', '--unified=0', '--no-color', '--no-ext-diff', '-M', '--diff-filter=ACMR', `${args.base}...HEAD`];
  const changed = parseDiff(git([...diffArgs, '--', ...DOC_DIRS, LINK_IGNORE_FILE]));
  const only = args.files.length ? new Set(args.files.map(rel)) : null;
  const targets = new Map();
  for (const [file, lines] of changed) {
    if (!isInScope(file)) continue;
    if (only && !only.has(file)) continue;
    if (lines.size === 0) continue;
    targets.set(file, lines);
  }
  return targets;
}

// ---------------------------------------------------------------------------
// Checks. Each returns findings: { file, line, column, check, rule, message, severity }

function runVale(files) {
  const vale = toolPath('vale');
  if (!existsSync(vale)) throw new Error('Vale isn\'t installed. Run `npm run setup`.');
  syncValeVocabulary();
  ensureValeStyles();
  const output = execFileSync(vale, ['--output=JSON', '--no-exit', ...files], { cwd: ROOT, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  const results = output.trim() ? JSON.parse(output) : {};
  if (results.Code && results.Text) throw new Error(`Vale failed: ${results.Text}`);
  const findings = [];
  for (const [file, alerts] of Object.entries(results)) {
    for (const alert of alerts) {
      findings.push({
        file: rel(file), line: alert.Line, column: alert.Span?.[0] ?? 1, check: 'vale',
        rule: alert.Check, message: alert.Message,
        // Suggestions show in VS Code but never block.
        severity: alert.Severity === 'suggestion' ? 'info' : 'error',
      });
    }
  }
  return findings;
}

async function runMarkdownlint(files) {
  const { main } = await import('markdownlint-cli2');
  let results = [];
  const formatter = (options) => { results = options.results; };
  const exitCode = await main({
    directory: ROOT,
    // A leading ":" tells markdownlint-cli2 to treat the argument as a literal path.
    argv: files.map((f) => `:${f}`),
    optionsOverride: { outputFormatters: [[formatter]] },
    logMessage: () => {},
    logError: (message) => console.error(message),
  });
  if (exitCode === 2) throw new Error('markdownlint-cli2 couldn\'t run. Check .markdownlint.json and .markdownlint-cli2.jsonc.');
  return results.map((r) => ({
    file: rel(r.fileName), line: r.lineNumber, column: r.errorRange?.[0] ?? 1, check: 'markdownlint',
    rule: r.ruleNames.slice(0, 2).join('/'),
    message: `${r.ruleDescription}${r.errorDetail ? ` [${r.errorDetail}]` : ''}`,
    severity: r.severity === 'warning' ? 'info' : 'error',
  }));
}

async function runCspell(files) {
  const { lint } = await import('cspell');
  const findings = [];
  const reporter = {
    issue: (issue) => {
      findings.push({
        file: rel(fileURLToPath(issue.uri)), line: issue.row, column: issue.col, check: 'cspell',
        rule: 'unknown-word',
        message: `Unknown word "${issue.text}". If it's correct, add it to docs-review/docs-terms.txt.`,
        severity: 'error',
      });
    },
    info: () => {}, debug: () => {}, progress: () => {},
    error: (message, error) => { console.error(message, error); },
    result: () => {},
  };
  const result = await lint(files.map((f) => join(ROOT, f)), { root: ROOT, config: join(ROOT, 'cspell.json'), mustFindFiles: false, progress: false, summary: false }, reporter);
  if (result.errors > 0) throw new Error('cspell reported configuration errors.');
  return findings;
}

// Inline suppressions: each must turn off exactly one rule for one line or a
// short block, and carry a <!-- reason: ... --> comment on the same line.
const COMMENT = /<!--([\s\S]*?)-->/g;
const REASON = /^\s*reason:\s*(\S.{9,})$/i;
const VALE_BLOCK_LIMIT = 20;

function checkSuppressions(file, lines) {
  const text = readFileSync(join(ROOT, file), 'utf8');
  const fileLines = text.split(/\r?\n/);
  const findings = [];
  const add = (line, column, rule, message) => findings.push({ file, line, column, check: 'suppressions', rule, message, severity: 'error' });

  if (file === LINK_IGNORE_FILE) {
    fileLines.forEach((content, index) => {
      const lineNumber = index + 1;
      if (lines && !lines.has(lineNumber)) return;
      const trimmed = content.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const previous = (fileLines[index - 1] || '').trim();
      if (!/^#\s*reason:\s*\S.{9,}$/i.test(previous)) {
        add(lineNumber, 1, 'link-exclusion-reason', 'Put a "# reason: ..." comment (10+ characters) on the line above each link exclusion.');
      }
      if (/^\.\*$|^\^?\.\*\$?$|^https?:\/\/?\.?\*?$/.test(trimmed)) {
        add(lineNumber, 1, 'link-exclusion-scope', 'Link exclusions must match specific URLs, not every link.');
      }
    });
    return findings;
  }

  fileLines.forEach((content, index) => {
    const lineNumber = index + 1;
    if (lines && !lines.has(lineNumber)) return;
    const comments = [...content.matchAll(COMMENT)].map((m) => ({ body: m[1].trim(), column: m.index + 1 }));
    const hasReason = comments.some((c) => REASON.test(c.body));

    for (const { body, column } of comments) {
      // Vale: <!-- vale Style.Rule = NO --> ... <!-- vale Style.Rule = YES -->
      if (/^vale\b/i.test(body)) {
        if (/^vale\s+on$/i.test(body)) continue; // Turning checks back on is always fine.
        const match = /^vale\s+([\w-]+)\.([\w-]+)\s*=\s*(NO|YES)$/.exec(body);
        if (!match) {
          add(lineNumber, column, 'vale-scope', 'Vale exceptions must name one rule, like <!-- vale Microsoft.Passive = NO -->. "vale off" and style-wide exceptions aren\'t allowed.');
          continue;
        }
        if (match[3] === 'NO') {
          if (!hasReason) add(lineNumber, column, 'reason-required', 'Add <!-- reason: ... --> (10+ characters) on the same line as the exception.');
          const closing = new RegExp(`<!--\\s*vale\\s+${match[1]}\\.${match[2]}\\s*=\\s*YES\\s*-->`);
          const end = fileLines.slice(index + 1, index + 1 + VALE_BLOCK_LIMIT).findIndex((l) => closing.test(l));
          if (end === -1) add(lineNumber, column, 'vale-block-length', `Turn the rule back on with <!-- vale ${match[1]}.${match[2]} = YES --> within ${VALE_BLOCK_LIMIT} lines.`);
        }
        continue;
      }
      // markdownlint: only disable-line / disable-next-line with exactly one rule.
      if (/^markdownlint-/i.test(body)) {
        if (/^markdownlint-(enable|restore|capture)\b/i.test(body)) continue;
        const match = /^markdownlint-(disable-next-line|disable-line)\s+([\w/-]+)$/.exec(body);
        if (!match) {
          add(lineNumber, column, 'markdownlint-scope', 'markdownlint exceptions must use disable-next-line or disable-line with exactly one rule, like <!-- markdownlint-disable-next-line MD045 -->.');
        } else if (!hasReason) {
          add(lineNumber, column, 'reason-required', 'Add <!-- reason: ... --> (10+ characters) on the same line as the exception.');
        }
        continue;
      }
      // cspell: only disable-next-line. Other directives affect a whole file or block.
      if (/^(?:cspell|spell-?checker)\s*:/i.test(body)) {
        if (!/^(?:cspell|spell-?checker)\s*:\s*disable-next-line$/i.test(body)) {
          add(lineNumber, column, 'cspell-scope', 'Spelling exceptions must use <!-- cspell:disable-next-line -->. To accept a word everywhere, add it to docs-review/docs-terms.txt.');
        } else if (!hasReason) {
          add(lineNumber, column, 'reason-required', 'Add <!-- reason: ... --> (10+ characters) on the same line as the exception.');
        }
      }
    }
  });
  return findings;
}

// ---------------------------------------------------------------------------
// Reporting

function annotate(f) {
  const escape = (s) => String(s).replace(/%/g, '%25').replace(/\r/g, '%0D').replace(/\n/g, '%0A');
  const props = (s) => escape(s).replace(/:/g, '%3A').replace(/,/g, '%2C');
  return `::error file=${props(f.file)},line=${f.line},col=${f.column},title=${props(`${f.check}: ${f.rule}`)}::${escape(f.message)}`;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const targets = collectTargets(args);
  const docFiles = [...targets.keys()].filter(isDoc);
  const inGitHub = process.env.GITHUB_ACTIONS === 'true';

  if (targets.size === 0) {
    console.log('No changed documentation lines to check.');
    if (args.json) writeFileSync(args.json, JSON.stringify({ mode: args.mode, files: 0, counts: {}, findings: [] }, null, 2));
    return 0;
  }

  let findings = [];
  if (docFiles.length) {
    if (args.checks.includes('vale')) findings.push(...runVale(docFiles));
    if (args.checks.includes('markdownlint')) findings.push(...await runMarkdownlint(docFiles));
    if (args.checks.includes('cspell')) findings.push(...await runCspell(docFiles));
  }
  if (args.checks.includes('suppressions')) {
    for (const [file, lines] of targets) findings.push(...checkSuppressions(file, lines));
  }

  // Keep findings on added or changed lines only.
  findings = findings.filter((f) => {
    const lines = targets.get(f.file);
    return lines === null || (lines && lines.has(f.line));
  });
  findings.sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line || a.column - b.column);

  const blocking = findings.filter((f) => f.severity === 'error');
  const counts = {};
  for (const f of blocking) {
    counts[f.check] ??= { total: 0, rules: {} };
    counts[f.check].total += 1;
    counts[f.check].rules[f.rule] = (counts[f.check].rules[f.rule] || 0) + 1;
  }

  if (args.mode !== 'all' || !args.json) {
    for (const f of blocking) {
      console.log(`${f.file}:${f.line}:${f.column}  ${f.check} ${f.rule}  ${f.message}`);
      if (inGitHub) console.log(annotate(f));
    }
  }

  const scope = args.mode === 'all' ? 'all lines' : 'added or changed lines';
  console.log(`\nChecked ${targets.size} file(s), ${scope}.`);
  for (const check of args.checks) {
    console.log(`  ${check.padEnd(13)} ${counts[check]?.total ?? 0} issue(s)`);
  }

  if (args.json) {
    writeFileSync(args.json, JSON.stringify({ mode: args.mode, files: targets.size, counts, findings: blocking }, null, 2));
  }
  if (blocking.length) {
    console.log('\nFix these issues, or see CONTRIBUTING.md for how to request an exception.');
    return 1;
  }
  console.log('All documentation checks passed.');
  return 0;
}

main().then((code) => { process.exitCode = code; }).catch((error) => {
  console.error(error.message || error);
  process.exitCode = 2;
});
