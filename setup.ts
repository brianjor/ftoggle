import { $ } from 'bun';
import ora from 'ora';

const deps = ora('- Installing dependencies').start();
await $`bun install --silent`;
deps.succeed();

const git = ora('- Updating local git config for better *.lockb diffs').start();
await $`git config diff.lockb.textconv bun`;
await $`git config diff.lockb.binary true`;
git.succeed();
