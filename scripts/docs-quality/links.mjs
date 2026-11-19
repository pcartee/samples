#!/usr/bin/env node
// Link checks with the pinned lychee binary.
//
//   node scripts/docs-quality/links.mjs internal
//       Checks every link and anchor in the built site (run `npm run build` first).
//       Runs offline, so it never fails because of the network.
//
//   node scripts/docs-quality/links.mjs external --base <ref> [--report <file>]
//       Checks web links in docs files changed since <ref>.
//
//   node scripts/docs-quality/links.mjs external --all [--report <file>]
//       Checks web links in every docs file (weekly scheduled check).
//
// Settings for external checks (retries, timeouts, caching) are in lychee.toml.
// Excluded URLs are in .lycheeignore.

import { execFileSync, spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdtempSync, readdirSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { toolPath } from './install-tools.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const DOC_FILE = /\.mdx?$/i;

function lychee(args) {
  const bin = toolPath('lychee');
  if (!existsSync(bin)) {
    console.error('lychee isn\'t installed. Run `npm run setup`.');
    return 2;
  }
  const result = spawnSync(bin, args, { cwd: ROOT, stdio: 'inherit' });
  return result.status ?? 1;
}

function walkDocs(dir, out = []) {
  for (const entry of readdirSync(join(ROOT, dir))) {
    const child = `${dir}/${entry}`;
    if (statSync(join(ROOT, child)).isDirectory()) walkDocs(child, out);
    else if (DOC_FILE.test(entry)) out.push(child);
  }
  return out;
}

async function internal() {
  const buildDir = join(ROOT, 'build');
  if (!existsSync(join(buildDir, 'index.html'))) {
    console.error('No built site found. Run `npm run build` first.');
    return 2;
  }
  // The site is served under baseUrl (for example, /samples/), so recreate that
  // layout before resolving root-relative links.
  const config = (await import(pathToFileURL(join(ROOT, 'docusaurus.config.js')).href)).default;
  const baseUrl = config.baseUrl.replace(/^\/|\/$/g, '');
  const siteRoot = mkdtempSync(join(tmpdir(), 'docs-site-'));
  try {
    const servedDir = baseUrl ? join(siteRoot, ...baseUrl.split('/')) : siteRoot;
    cpSync(buildDir, servedDir, { recursive: true });
    console.log(`Checking internal links and anchors in the built site (baseUrl /${baseUrl}${baseUrl ? '/' : ''})...`);
    return lychee([
      '--offline', '--no-progress', '--include-fragments',
      '--root-dir', siteRoot, '--index-files', 'index.html',
      '--format', 'compact',
      `${servedDir}/**/*.html`,
    ]);
  } finally {
    rmSync(siteRoot, { recursive: true, force: true });
  }
}

function external(args) {
  let files;
  if (args.includes('--all')) {
    files = walkDocs('docs');
  } else {
    const base = args[args.indexOf('--base') + 1];
    if (!args.includes('--base') || !base) {
      console.error('Use --base <ref> or --all.');
      return 2;
    }
    const output = execFileSync('git', ['-c', 'core.quotePath=false', 'diff', '--name-only', '--diff-filter=ACMR', `${base}...HEAD`, '--', 'docs'], { cwd: ROOT, encoding: 'utf8' });
    files = output.split('\n').filter((f) => DOC_FILE.test(f));
  }
  if (files.length === 0) {
    console.log('No changed docs files, so there are no external links to check.');
    return 0;
  }
  // --root-dir resolves root-relative paths like /img/x.png to local files,
  // which this web-only check skips (the internal check covers them).
  const lycheeArgs = ['--config', join(ROOT, 'lychee.toml'), '--root-dir', join(ROOT, 'static')];
  const reportIndex = args.indexOf('--report');
  if (reportIndex !== -1) lycheeArgs.push('--format', 'markdown', '--output', resolve(args[reportIndex + 1]));
  else lycheeArgs.push('--format', 'compact');
  console.log(`Checking external links in ${files.length} file(s)...`);
  return lychee([...lycheeArgs, ...files]);
}

const [command, ...rest] = process.argv.slice(2);
let code;
if (command === 'internal') code = await internal();
else if (command === 'external') code = external(rest);
else {
  console.error('Usage: links.mjs internal | external (--base <ref> | --all) [--report <file>]');
  code = 2;
}
process.exitCode = code;
