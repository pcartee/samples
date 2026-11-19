#!/usr/bin/env node
// Downloads the pinned Vale and lychee binaries into .tools/bin and verifies
// each archive against the SHA-256 checksum published with the release.
// VS Code, the pre-commit hook, and CI all run these exact binaries, so a
// writer never sees a CI result they couldn't reproduce locally.
//
// To upgrade a tool, change its version and checksums below (copy them from
// the release's checksum files), then run `npm run setup`.

import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { chmodSync, existsSync, mkdirSync, mkdtempSync, readdirSync, renameSync, rmSync, statSync, writeFileSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const BIN_DIR = join(ROOT, '.tools', 'bin');
const isWindows = process.platform === 'win32';
const platformKey = `${process.platform}-${process.arch}`;

export const TOOLS = {
  vale: {
    version: '3.26.0',
    url: (asset) => `https://github.com/vale-cli/vale/releases/download/v3.26.0/${asset}`,
    assets: {
      'linux-x64': ['vale_3.26.0_Linux_64-bit.tar.gz', '22aa69a556558e4a9dfc63c17030777383d8d3c48dcdfad655fa98e839d666ed'],
      'linux-arm64': ['vale_3.26.0_Linux_arm64.tar.gz', '3154179f4611140c9af54a8b3bc6a90bc02b73fe6c1f635369604dde0490406d'],
      'darwin-x64': ['vale_3.26.0_macOS_64-bit.tar.gz', 'df42b317be6ece6a6a70d06b952deec581d047046eb93ea4632f58da56a86ff9'],
      'darwin-arm64': ['vale_3.26.0_macOS_arm64.tar.gz', 'a6c3370f53bad93086c6b85f3163676e44e08049d69743afdcc13f3aab5b7482'],
      'win32-x64': ['vale_3.26.0_Windows_64-bit.zip', 'c42f4b413aa29b6b36fa4e3ac0c18322588a54ac860db4c84b8255997f7d1ec2'],
    },
  },
  lychee: {
    version: '0.24.2',
    url: (asset) => `https://github.com/lycheeverse/lychee/releases/download/lychee-v0.24.2/${asset}`,
    assets: {
      'linux-x64': ['lychee-x86_64-unknown-linux-gnu.tar.gz', '1f4e0ef7f6554a6ed33dd7ac144fb2e1bbed98598e7af973042fc5cd43951c9a'],
      'linux-arm64': ['lychee-aarch64-unknown-linux-gnu.tar.gz', '91a7bd65685da41b90ccb9bc867a3d649a7818042dae04ff405e55a25bddee4c'],
      'darwin-x64': ['lychee-x86_64-apple-darwin.tar.gz', '887503a9cff667d322b8d0892b40bf49976eb9507af8483220a3706cdad55978'],
      'darwin-arm64': ['lychee-aarch64-apple-darwin.tar.gz', 'c9d3740ea2d891854d37116c9fba840f37b6e7c89d330e7db84ac333631c4977'],
      'win32-x64': ['lychee-x86_64-pc-windows-msvc.zip', '32975d1493ee1a975d6bb41e4fb56fe419cb442ded628bb772ba2e614acfacad'],
    },
  },
};

export function toolPath(name) {
  return join(BIN_DIR, isWindows ? `${name}.exe` : name);
}

function findFile(dir, fileName) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      const found = findFile(full, fileName);
      if (found) return found;
    } else if (entry === fileName) {
      return full;
    }
  }
  return null;
}

async function install(name) {
  const tool = TOOLS[name];
  const stamp = join(BIN_DIR, `.${name}-version`);
  const target = toolPath(name);
  if (existsSync(target) && existsSync(stamp) && readFileSync(stamp, 'utf8').trim() === tool.version) {
    console.log(`${name} ${tool.version} is already installed.`);
    return;
  }

  const asset = tool.assets[platformKey];
  if (!asset) {
    throw new Error(`No pinned ${name} build for ${platformKey}. Add one to scripts/docs-quality/install-tools.mjs.`);
  }
  const [fileName, expected] = asset;
  console.log(`Downloading ${name} ${tool.version} (${fileName})...`);
  const response = await fetch(tool.url(fileName));
  if (!response.ok) throw new Error(`Download failed for ${fileName}: HTTP ${response.status}`);
  const data = Buffer.from(await response.arrayBuffer());
  const actual = createHash('sha256').update(data).digest('hex');
  if (actual !== expected) {
    throw new Error(`Checksum mismatch for ${fileName}: expected ${expected}, got ${actual}. Nothing was installed.`);
  }

  const work = mkdtempSync(join(tmpdir(), `${name}-`));
  try {
    const archive = join(work, fileName);
    writeFileSync(archive, data);
    // bsdtar (macOS, Windows 10+) and GNU tar (Linux) both extract .tar.gz;
    // bsdtar also extracts .zip, which is the Windows format.
    execFileSync('tar', ['-xf', archive, '-C', work], { stdio: 'inherit' });
    const binary = findFile(work, isWindows ? `${name}.exe` : name);
    if (!binary) throw new Error(`Couldn't find the ${name} binary in ${fileName}.`);
    mkdirSync(BIN_DIR, { recursive: true });
    rmSync(target, { force: true });
    renameSync(binary, target);
    if (!isWindows) chmodSync(target, 0o755);
    writeFileSync(stamp, `${tool.version}\n`);
    console.log(`Installed ${name} ${tool.version} to ${target}`);
  } finally {
    rmSync(work, { recursive: true, force: true });
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const names = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(TOOLS);
  for (const name of names) {
    if (!TOOLS[name]) throw new Error(`Unknown tool: ${name}`);
    await install(name);
  }
}
