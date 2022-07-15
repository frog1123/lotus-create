import inquirer from 'inquirer';
import gradient from 'gradient-string';

interface Options {
  projectName: string | null;
  language: string | null;
  packageManager: string | null;
}

export const options: Options = {
  projectName: null,
  language: null,
  packageManager: null
};

const color = gradient(['#72ea84', '#35ce4c', '#07af20']);

export const askProjectName = async () => {
  await inquirer
    .prompt([
      {
        type: 'input',
        name: 'projectName',
        message: `Choose a ${color('project name')}`,
        default: () => 'new-project'
      }
    ])
    .then(({ projectName }) => {
      options.projectName = projectName;
    });
};

export const askLang = async () => {
  await inquirer
    .prompt([
      {
        type: 'list',
        name: 'language',
        message: `Choose a ${color('language')}`,
        choices: ['javascript', 'typescript']
      }
    ])
    .then(({ language }) => {
      options.language = language;
    });
};

export const askPackageManager = async () => {
  await inquirer
    .prompt([
      {
        type: 'list',
        name: 'packageManager',
        message: `Choose a ${color('package manager')}`,
        choices: ['npm', 'yarn', 'pnpm']
      }
    ])
    .then(({ packageManager }) => {
      options.packageManager = packageManager;
    });
};
