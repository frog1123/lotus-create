import { exec } from 'child_process';
import { access, mkdir } from 'fs';
import chalk from 'chalk';

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
            console.log(`${chalk.green('✔')} Created new directory: ${path}`);
          }
        });
      } else {
        console.log(`${chalk.red('✘')} Directory already exists`);
        reject(path);
      }
    });
  });

  return directory;
};

export const projectInit = () => {
  exec(`cd ${global.options.projectName} && ${global.options.packageManager} init -y`, err => {
    if (err) {
      console.log(`${chalk.red('✘')} Something went wrong :/`);
      console.log('Are you sure you have this package manager installed?');
    } else console.log(`Initialized ${global.options.packageManager} project`);
  });
};
