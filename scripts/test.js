#!/usr/bin/env node
const inquirer = require('inquirer');
const program = require('commander');
const childProcess = require('child_process');
const chalk = require('chalk');
const log = require('npmlog');
const path = require('path');

log.heading = 'storybook';
const prefix = 'test';
log.addLevel('aborted', 3001, { fg: 'red', bold: true });

const spawn = command => {
  const out = childProcess.spawnSync(`${command}`, {
    shell: true,
    stdio: 'inherit',
  });

  if (out.status !== 0) {
    process.exit(out.status);
  }

  return out;
};

const main = program.version('3.0.0').option('--all', `Test everything ${chalk.gray('(all)')}`);

const createProject = ({ defaultValue, option, name, projectLocation, isJest, script }) => ({
  value: false,
  defaultValue: defaultValue || false,
  option: option || undefined,
  name: name || 'unnamed task',
  script,
  projectLocation,
  isJest,
});
const createOption = ({ defaultValue, option, name, extraParam }) => ({
  value: false,
  defaultValue: defaultValue || false,
  option: option || undefined,
  name: name || 'unnamed task',
  extraParam,
});

const tasks = {
  core: createProject({
    name: `Core & React & Vue & Polymer & Angular & Svelte ${chalk.gray('(core)')}`,
    defaultValue: true,
    option: '--core',
    projectLocation: path.join(__dirname, '..'),
    isJest: true,
  }),
  'react-native-vanilla': createProject({
    name: `React-Native example ${chalk.gray('(react-native-vanilla)')}`,
    defaultValue: true,
    option: '--reactnative',
    projectLocation: path.join(__dirname, '..', 'examples/react-native-vanilla'),
    isJest: true,
  }),
  image: createProject({
    name: `Image snapshots for Official storybook ${chalk.gray('(image)')}`,
    defaultValue: false,
    option: '--image',
    projectLocation: path.join(__dirname, '..', 'examples/official-storybook/image-snapshots'),
    isJest: true,
  }),
  // 'crna-kitchen-sink': createProject({
  //   name: `React-Native-App example ${chalk.gray('(crna-kitchen-sink)')}  ${chalk.red(
  //     '[not implemented yet]'
  //   )}`,
  //   defaultValue: false,
  //   option: '--reactnativeapp',
  //   projectLocation: './examples/crna-kitchen-sink',
  //   isJest: true,
  // }),
  cli: createProject({
    name: `Command Line Interface ${chalk.gray('(cli)')}`,
    defaultValue: false,
    option: '--cli',
    projectLocation: './lib/cli',
  }),
  watchmode: createOption({
    name: `Run in watch-mode ${chalk.gray('(watchmode)')}`,
    defaultValue: false,
    option: '--watch',
    extraParam: '--watch',
  }),
  coverage: createOption({
    name: `Output coverage reports ${chalk.gray('(coverage)')}`,
    defaultValue: false,
    option: '--coverage',
    extraParam: '--coverage',
  }),
  runInBand: createOption({
    name: `Run all tests serially in the current process ${chalk.gray('(runInBand)')}`,
    defaultValue: false,
    option: '--runInBand',
    extraParam: '--runInBand',
  }),
  update: createOption({
    name: `Update all snapshots ${chalk.gray('(update)')}`,
    defaultValue: false,
    option: '--update',
    extraParam: '-u --updateSnapshot',
  }),
  teamcity: createOption({
    name: `Use TeamCity reporter`,
    defaultValue: false,
    option: '--teamcity',
    extraParam: '--testResultsProcessor=jest-teamcity-reporter',
  }),
};

const getProjects = list => list.filter(key => key.projectLocation);

const getScripts = list => list.filter(key => key.script);

const getExtraParams = list => list.filter(key => key.extraParam).map(key => key.extraParam);

Object.keys(tasks)
  .reduce((acc, key) => acc.option(tasks[key].option, tasks[key].name), main)
  .parse(process.argv);

Object.keys(tasks).forEach(key => {
  tasks[key].value =
    program[tasks[key].option.replace('--', '')] || (program.all && tasks[key].projectLocation);
});

let selection;

if (
  !Object.keys(tasks)
    .map(key => tasks[key].value)
    .filter(Boolean).length
) {
  selection = inquirer
    .prompt([
      {
        type: 'checkbox',
        message: 'Select which tests to run',
        name: 'todo',
        pageSize: 18,
        choices: Object.values(tasks)
          .filter(key => !key.extraParam)
          .map(key => ({
            name: key.name,
            checked: key.defaultValue,
          }))
          .concat(new inquirer.Separator())
          .concat(
            Object.keys(tasks)
              .map(key => tasks[key])
              .filter(key => key.extraParam)
              .map(key => ({
                name: key.name,
                checked: key.defaultValue,
              }))
          ),
      },
    ])
    .then(({ todo }) =>
      todo.map(name => tasks[Object.keys(tasks).find(i => tasks[i].name === name)])
    );
} else {
  selection = Promise.resolve(
    Object.keys(tasks)
      .map(key => tasks[key])
      .filter(item => item.value === true)
  );
}

selection
  .then(list => {
    if (list.length === 0) {
      log.warn(prefix, 'Nothing to test');
    } else {
      const projects = getProjects(list);
      const jestProjects = projects.filter(key => key.isJest).map(key => key.projectLocation);
      const nonJestProjects = projects.filter(key => !key.isJest);
      const extraParams = getExtraParams(list).join(' ');
      if (jestProjects.length > 0) {
        spawn(`jest --projects ${jestProjects.join(' ')} ${extraParams}`);
      }
      nonJestProjects.forEach(key =>
        spawn(`npm --prefix ${key.projectLocation} test -- ${extraParams}`)
      );
      const scripts = getScripts(list);
      scripts.forEach(key => spawn(`${key.script} -- ${extraParams}`));

      process.stdout.write('\x07');
    }
  })
  .catch(e => {
    log.aborted(prefix, chalk.red(e.message));
    log.silly(prefix, e);
    process.exit(1);
  });
