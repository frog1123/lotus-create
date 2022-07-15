import { exec } from 'child_process';
import { access, mkdir, writeFileSync } from 'fs';
import chalk from 'chalk';

export const clearCommandLine = () => console.clear();

export const createProjectDirectory: () => Promise<string> = async () => {
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

export const projectInit: () => Promise<string> = () => {
  const worked: Promise<string> = new Promise((resolve, reject) => {
    exec(`cd ${global.options.projectName} && ${global.options.packageManager} init -y`, err => {
      if (err) {
        console.log(`${chalk.red('✘')} failed to initialize the project`);

        let coloredText;

        if (global.options.packageManager === 'npm') coloredText = chalk.red('npm');
        if (global.options.packageManager === 'yarn') coloredText = chalk.hex('#02acf4')('yarn');
        if (global.options.packageManager === 'pnpm') coloredText = chalk.hex('#f4b802')('pnpm');

        console.log(`are you sure you have ${coloredText} installed?`);
        reject('failed');
      } else {
        resolve('worked');
        console.log(`${chalk.green('✔')} initialized ${global.options.packageManager} project`);
      }
    });
  });

  return worked;
};

export const createSrc = () => {
  const directory: Promise<null> = new Promise((resolve, reject) => {
    exec(`cd ${global.options.projectName} && mkdir src`, err => {
      console.log(`${chalk.green('✔')} created new directory: ${global.options.projectName}/src`);

      if (err) {
        console.log(`${chalk.red('✘')} fail to create ${global.options.projectName}/src`);
        reject(null);
      }

      resolve(null);
    });
  });

  return directory;
};

export const createIndex = () => {
  const langShort = global.options.language === 'typescript' ? 'ts' : 'js';

  try {
    writeFileSync(`${global.options.projectName}/src/index.${langShort}`, `console.log('hello world')`);
    console.log(`${chalk.green('✔')} created index.${langShort}`);
  } catch (err) {
    console.log(err);
    console.log(`${chalk.red('✘')} failed to create index.${langShort}`);
  }

  return new Promise(resolve => {
    resolve(null);
  });
};

export const createTsConfig = () => {
  if (global.options.language === 'typescript') {
    const options = '{\r\n  "compilerOptions": {\r\n    "target": "esnext",\r\n    "module": "esnext",\r\n    "lib": ["dom", "es6", "es2017", "esnext.asynciterable"],\r\n    "skipLibCheck": true,\r\n    "sourceMap": true,\r\n    "outDir": "./dist",\r\n    "moduleResolution": "node",\r\n    "removeComments": true,\r\n    "noImplicitAny": true,\r\n    "strictNullChecks": true,\r\n    "strictFunctionTypes": true,\r\n    "noImplicitThis": true,\r\n    "noUnusedLocals": false,\r\n    "noUnusedParameters": false,\r\n    "noImplicitReturns": false,\r\n    "noFallthroughCasesInSwitch": true,\r\n    "allowSyntheticDefaultImports": true,\r\n    "esModuleInterop": true,\r\n    "emitDecoratorMetadata": true,\r\n    "experimentalDecorators": true,\r\n    "resolveJsonModule": true,\r\n    "baseUrl": "."\r\n  },\r\n  "include": ["src/*"]\r\n}\r\n';

    try {
      writeFileSync(`${global.options.projectName}/tsconfig.json`, options);
      console.log(`${chalk.green('✔')} created tsconfig.json`);
    } catch {
      console.log(`${chalk.red('✘')} failed to create tsconfig.json`);
    }
  }

  return new Promise(resolve => {
    resolve(null);
  });
};

export const createGitIgnore = () => {
  try {
    writeFileSync(`${global.options.projectName}/.gitignore`, 'node_modules\n*.env');
    console.log(`${chalk.green('✔')} created .gitignore`);
  } catch {
    console.log(`${chalk.red('✘')} failed to create .gitignore`);
    return;
  }
};
