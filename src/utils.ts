import { exec } from 'child_process';
import { access, mkdir, writeFile } from 'fs';
import chalk from 'chalk';

export const clearCommandLine = () => console.clear();

export const createProjectDirectory = async () => {
  const path = await global.options.projectName;

  const directory: Promise<string> = new Promise((resolve, reject) => {
    access(path, (error: any) => {
      if (error) {
        mkdir(path, (error: any) => {
          if (error) {
            console.log(error);
            reject(path);
          } else {
            resolve(path);
            console.log(`${chalk.green('✔')} created new directory: ${path}`);
          }
        });
      } else {
        console.log(`${chalk.red('✘')} directory already exists`);
        reject(path);
      }
    });
  });

  return directory;
};

export const projectInit = () => {
  exec(`cd ${global.options.projectName} && ${global.options.packageManager} init -y`, err => {
    if (err) {
      console.log(`${chalk.red('✘')} failed to initialize the project`);

      let coloredText;

      if (global.options.packageManager === 'npm') coloredText = chalk.red('npm');
      if (global.options.packageManager === 'yarn') coloredText = chalk.hex('#02acf4')('yarn');
      if (global.options.packageManager === 'pnpm') coloredText = chalk.hex('#f4b802')('pnpm');

      console.log(`are you sure you have ${coloredText} installed?`);
    } else console.log(`${chalk.green('✔')} initialized ${global.options.packageManager} project`);
  });

  return new Promise(resolve => {
    resolve(null);
  });
};

export const createSrc = () => {
  const directory: Promise<null> = new Promise((resolve, reject) => {
    exec(`cd ${global.options.projectName} && mkdir src`, () => {
      resolve(null);
    });
  });

  return directory;
};

export const createIndex = () => {
  writeFile(`${global.options.projectName}/src/index.js`, `console.log('hello world')`, err => {
    if (err !== null) {
      console.log(`${chalk.red('✘')} failed to create index.js`);
      return;
    }
    console.log(`${chalk.green('✔')} created index.js`);
  });
};
