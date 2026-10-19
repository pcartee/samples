#!/usr/bin/env bash
set -euo pipefail

repo_root="$(git rev-parse --show-toplevel)"
build_dir="$repo_root/build"
worktree_dir="$(mktemp -d)"
cleanup() {
  git -C "$repo_root" worktree remove --force "$worktree_dir" >/dev/null 2>&1 || true
  rmdir "$worktree_dir" >/dev/null 2>&1 || true
}
trap cleanup EXIT

if [[ ! -d "$build_dir" ]]; then
  echo "Build output directory not found: $build_dir" >&2
  exit 1
fi

if git ls-remote --exit-code --heads origin gh-pages >/dev/null 2>&1; then
  git fetch origin refs/heads/gh-pages:refs/remotes/origin/gh-pages
  git -C "$repo_root" worktree add -B gh-pages "$worktree_dir" origin/gh-pages
else
  git -C "$repo_root" worktree add --orphan gh-pages "$worktree_dir"
fi

# Keep PR previews, replace the production site, and remove stale production files.
find "$worktree_dir" -mindepth 1 -maxdepth 1 \
  ! -name .git \
  ! -name pr-preview \
  -exec rm -rf -- {} +
cp -a "$build_dir"/. "$worktree_dir"/
touch "$worktree_dir/.nojekyll"

git -C "$worktree_dir" add --all
if git -C "$worktree_dir" diff --cached --quiet; then
  echo "GitHub Pages is already up to date"
  exit 0
fi

git -C "$worktree_dir" config user.name "github-actions[bot]"
git -C "$worktree_dir" config user.email "41898282+github-actions[bot]@users.noreply.github.com"
git -C "$worktree_dir" commit -m "Deploy GitHub Pages site"
git -C "$worktree_dir" push origin HEAD:gh-pages
