#!/usr/bin/env node
/* eslint-disable no-console,@typescript-eslint/naming-convention */
const { execSync } = require('child_process');
const { readFileSync } = require('fs');
const { join } = require('path');

const { default: input } = require('@inquirer/input');
const { default: select } = require('@inquirer/select');

const cwd = process.cwd();

const MIGRATION_NAME_REGEX = /^([a-zA-Z0-9-]+)$/g;

const buildActions = [
  { value: 'run', description: 'Runs all pending migrations' },
  { value: 'revert', description: 'Reverts last executed migration' },
  {
    value: 'show',
    description: 'Show all migrations and whether they have been run or not',
  },
];

const allActions = [
  { value: 'create', description: 'Creates a new migration file' },
  { value: 'run', description: 'Runs all pending migrations' },
  { value: 'revert', description: 'Reverts last executed migration' },
  {
    value: 'generate',
    description:
      'Generates a new migration file with sql needs to be executed to update schema',
  },
  {
    value: 'show',
    description: 'Show all migrations and whether they have been run or not',
  },
];

function logAndExit(text) {
  console.log(text);
  process.exit(1);
}

function getSourceDir() {
  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    return 'src';
  }

  const regex = /"outDir": "([^"]+)"/;
  const tryFileNames = ['tsconfig.build.json', 'tsconfig.json'];

  let result;

  for (const fileName of tryFileNames) {
    result = regex.exec(readFileSync(fileName, { encoding: 'utf8' }))?.[1];
  }

  if (!result) {
    throw new Error(
      `Cannot find source dir in files "${tryFileNames.join(' | ')}" with option "outDir"`,
    );
  }

  return join(result);
}

async function promptAction(actions) {
  return select({
    message: 'Choose action:',
    pageSize: actions.length,
    choices: actions,
  });
}

async function promptName() {
  return input({
    message: 'Enter migration name:',
    validate: (text) =>
      MIGRATION_NAME_REGEX.test(text) ||
      'Please enter a valid name (a-zA-Z0-9-)',
  });
}

async function processing() {
  const sourceDir = getSourceDir();
  const isDevelopment = sourceDir === 'src';
  const actions = isDevelopment ? allActions : buildActions;

  // Provide and validate input args
  const action = process.argv[2] || (await promptAction(actions));

  if (!actions.some(({ value }) => value === action)) {
    return logAndExit(`Action "${action}" does not exist`);
  }

  let migrationName = '';

  if (['create', 'generate'].includes(action)) {
    if (process.argv.length > 4) {
      return logAndExit(`Incorrect usage, args too much`);
    }

    if (process.argv[3]) {
      if (!MIGRATION_NAME_REGEX.test(process.argv[3])) {
        return logAndExit(
          'Migration name invalid, valid symbols is "a-zA-Z0-9-"',
        );
      }

      migrationName = process.argv[3];
    } else {
      migrationName = await promptName();
    }
  } else {
    if (process.argv.length > 3) {
      return logAndExit(`Incorrect usage, args too much`);
    }
  }

  const migrationPathBase = join(sourceDir, 'common', 'database');

  const migrationPath =
    './' + join(migrationPathBase, 'migrations', migrationName);

  const cliFileExtension = isDevelopment ? 'ts' : 'js';
  const migrationDataSourcePath =
    './' +
    join(migrationPathBase, 'database-ormconfig.cli.' + cliFileExtension);

  const actionToOptions = {
    create: () => [migrationPath],
    run: () => [`-d ${migrationDataSourcePath}`],
    revert: () => [`-d ${migrationDataSourcePath}`],
    generate: () => [`-d ${migrationDataSourcePath}`, migrationPath],
    show: () => [`-d ${migrationDataSourcePath}`],
  };

  const start_command = isDevelopment
    ? 'NODE_ENV=development ts-node'
    : `TS_NODE_BASEURL=./${sourceDir} node`;

  const command = [
    start_command,
    '-r tsconfig-paths/register',
    './node_modules/.bin/typeorm',
    `migration:${action}`,
    ...actionToOptions[action](),
  ].join(' ');

  console.log(`Executing command: "${command}"`);
  execSync(`cd ${cwd} && ${command}`, { stdio: 'inherit' });
  console.log('Done!');
}

processing();
