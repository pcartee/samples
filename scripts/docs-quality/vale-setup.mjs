// Keeps Vale's vocabulary in sync with docs-review/docs-terms.txt and makes
// sure the pinned style packages are downloaded.
//
// docs-terms.txt is the only word list. Vale needs its vocabulary at a fixed
// path, so this script generates that file (it's git-ignored) on every run.

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { toolPath } from './install-tools.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
export const TERMS_FILE = join(ROOT, 'docs-review', 'docs-terms.txt');
const VOCAB_FILE = join(ROOT, '.vale', 'styles', 'config', 'vocabularies', 'Docs', 'accept.txt');

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export function syncValeVocabulary() {
  const terms = readFileSync(TERMS_FILE, 'utf8')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'));
  // Vale reads each line as a regular expression; escape terms like "docusaurus.config".
  const content = `# Generated from docs-review/docs-terms.txt by scripts/docs-quality/vale-setup.mjs. Don't edit.\n${terms.map(escapeRegex).join('\n')}\n`;
  mkdirSync(dirname(VOCAB_FILE), { recursive: true });
  if (!existsSync(VOCAB_FILE) || readFileSync(VOCAB_FILE, 'utf8') !== content) writeFileSync(VOCAB_FILE, content);
}

export function ensureValeStyles(force = false) {
  if (!force && existsSync(join(ROOT, '.vale', 'styles', 'Microsoft'))) return;
  execFileSync(toolPath('vale'), ['sync'], { cwd: ROOT, stdio: ['ignore', 'ignore', 'inherit'] });
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  syncValeVocabulary();
  ensureValeStyles(true);
  console.log('Vale styles and vocabulary are up to date.');
}
