#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read commit message from file
const commitMsgFile = process.argv[2];
const commitMsg = fs.readFileSync(commitMsgFile, 'utf8').trim();

// Conventional commit pattern
const conventionalCommitPattern = /^(feat|fix|docs|style|refactor|perf|test|chore|ci|build|revert)(\(.+\))?: .+/;

if (!conventionalCommitPattern.test(commitMsg)) {
  console.error('❌ Invalid commit message format!');
  console.error('');
  console.error('Commit message must follow conventional commits format:');
  console.error('');
  console.error('  feat: add new feature');
  console.error('  fix: fix bug');
  console.error('  docs: update documentation');
  console.error('  style: format code');
  console.error('  refactor: refactor code');
  console.error('  perf: improve performance');
  console.error('  test: add tests');
  console.error('  chore: maintenance tasks');
  console.error('  ci: CI/CD changes');
  console.error('  build: build system changes');
  console.error('  revert: revert previous commit');
  console.error('');
  console.error('Your commit message:');
  console.error(`  ${commitMsg}`);
  console.error('');
  process.exit(1);
}

console.log('✅ Commit message is valid!');
process.exit(0);









