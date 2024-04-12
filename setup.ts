import { $ } from 'bun';
import ora, { Ora } from 'ora';

const ROOT = (await $`pwd`.text()).replace('\n', '');
const DB = `${ROOT}/packages/db`;
const API = `${ROOT}/packages/api`;

const spinner = ora();

spinner.start('- Installing dependencies');
await $`bun install --silent`;
spinner.succeed();

spinner.start('- Updating local git config for better *.lockb diffs');
await $`git config diff.lockb.textconv bun`;
await $`git config diff.lockb.binary true`;
spinner.succeed();

spinner.start('- Setting up environments');
await createEnvFile(API, spinner);
await createEnvFile(DB, spinner);
spinner.succeed();

//
//  _____                 _   _
// |  ___|   _ _ __   ___| |_(_) ___  _ __  ___
// | |_ | | | | '_ \ / __| __| |/ _ \| '_ \/ __|
// |  _|| |_| | | | | (__| |_| | (_) | | | \__ \
// |_|   \__,_|_| |_|\___|\__|_|\___/|_| |_|___/
//

async function createEnvFile(
  /** directory to add .env file to */
  dir: string,
  /** Ora spinner */
  spinner: Ora,
) {
  try {
    // Check if .env already exists, throws if it doesn't
    await $`ls ./.env`.quiet().cwd(dir);
  } catch (err) {
    spinner.info(`${spinner.text}: Creating '.env' file at ${dir}`);
    await $`touch .env`.cwd(dir);
    await $`cat example.env > .env`.cwd(dir);
  }
}
