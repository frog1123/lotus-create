import inquirer from 'inquirer';
import gradient from 'gradient-string';
import chalk from 'chalk';

interface Options {
  projectName: string;
  language: string;
  packageManager: string;
  useNodemon: boolean;
  license: string;
  holder: string;
}

global.options = {} as Options;

const color = gradient(['#72ea84', '#35ce4c', '#07af20']);

export const askProjectName = async () => {
  await inquirer
    .prompt([
      {
        type: 'input',
        name: 'projectName',
        message: `choose a ${color('project name')}`,
        default: () => 'new-project'
      }
    ])
    .then(({ projectName }) => {
      global.options.projectName = projectName;
    });
};

export const askLang = async () => {
  await inquirer
    .prompt([
      {
        type: 'list',
        name: 'language',
        message: `choose a ${color('language')}`,
        choices: [chalk.yellow('javascript'), chalk.blueBright('typescript')]
      }
    ])
    .then(({ language }) => {
      let tmp;

      if (language === '\x1B[33mjavascript\x1B[39m') tmp = 'javascript';
      if (language === '\x1B[94mtypescript\x1B[39m') tmp = 'typescript';

      global.options.language = tmp;
    });
};

export const askPackageManager = async () => {
  await inquirer
    .prompt([
      {
        type: 'list',
        name: 'packageManager',
        message: `choose a ${color('package manager')}`,
        choices: [chalk.red('npm'), chalk.hex('#02acf4')('yarn'), chalk.hex('#f4b802')('pnpm')]
      }
    ])
    .then(({ packageManager }) => {
      let tmp;

      if (packageManager === '\x1B[31mnpm\x1B[39m') tmp = 'npm';
      if (packageManager === '\x1B[38;2;2;172;244myarn\x1B[39m') tmp = 'yarn';
      if (packageManager === '\x1B[38;2;244;184;2mpnpm\x1B[39m') tmp = 'pnpm';

      global.options.packageManager = tmp;
    });
};

export const askNodemon = async () => {
  await inquirer
    .prompt([
      {
        type: 'list',
        name: 'useNodemon',
        message: 'use nodemon',
        choices: ['yes', 'no']
      }
    ])
    .then(({ useNodemon }) => {
      const tmp = useNodemon === 'yes' ? true : false;
      global.options.useNodemon = tmp;
    });
};

export const askLicense = async () => {
  await inquirer
    .prompt([
      {
        type: 'list',
        name: 'license',
        message: `choose a ${color('package manager')}`,
        choices: ['mit', 'none']
      }
    ])
    .then(({ license }) => {
      global.options.license = license;
    });
};

export const askHolder = async () => {
  if (global.options.license !== 'none') {
    await inquirer
      .prompt([
        {
          type: 'input',
          name: 'holder',
          message: 'holder: '
        }
      ])
      .then(({ holder }) => (global.options.holder = holder));
  }
};
