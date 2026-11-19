#!/usr/bin/env node
// One-time (and after-upgrade) setup for the docs quality checks:
// installs the pinned Vale and lychee binaries, downloads the pinned Vale
// style packages, and generates Vale's vocabulary from docs-terms.txt.
// Run it with `npm run setup`, which also runs `npm install` first.

import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { syncValeVocabulary, ensureValeStyles } from './vale-setup.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const result = spawnSync(process.execPath, [join(here, 'install-tools.mjs'), ...process.argv.slice(2)], { stdio: 'inherit' });
if (result.status !== 0) process.exit(result.status ?? 1);

if (process.argv.slice(2).length === 0 || process.argv.includes('vale')) {
  syncValeVocabulary();
  ensureValeStyles(true);
  console.log('Vale styles and vocabulary are ready.');
}
console.log('\nSetup complete. Open the repository in VS Code and install the recommended extensions when prompted.');
