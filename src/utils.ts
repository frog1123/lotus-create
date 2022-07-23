import { exec } from 'child_process';
import { access, mkdir, writeFileSync, readFileSync } from 'fs';
import chalk from 'chalk';
import { join } from 'path';

const __dirname = process.cwd();

export const clearCommandLine = () => console.clear();

export const createProjectDirectory = async (): Promise<void> => {
  const path = await global.options.projectName;

  access(path, (error: any) => {
    if (error) {
      mkdir(path, (error: any) => {
        if (error) {
          console.log(error);
        } else {
          console.log(`${chalk.green('✔')} created new directory: ${path}`);
        }
      });
    } else {
      console.log(`${chalk.red('✘')} directory already exists`);
    }
  });
};

export const projectInit = (): Promise<string> => {
  const worked: Promise<string> = new Promise((resolve, reject) => {
    exec(`cd ${global.options.projectName} && ${global.options.packageManager} init ${global.options.packageManager === 'npm' || global.options.packageManager === 'yarn' ? '-y' : ''}`, err => {
      if (err) {
        console.log(`${chalk.red('✘')} failed to initialize the project`);

        let coloredText;

        if (global.options.packageManager === 'npm') coloredText = chalk.red('npm');
        if (global.options.packageManager === 'yarn') coloredText = chalk.hex('#02acf4')('yarn');
        if (global.options.packageManager === 'pnpm') coloredText = chalk.hex('#f4b802')('pnpm');

        reject('error');
        console.log(`are you sure you have ${coloredText} installed?`);
      } else {
        resolve('success');
        console.log(`${chalk.green('✔')} initialized ${global.options.packageManager} project`);
      }
    });
  });

  return worked;
};

export const addNodemon = async (): Promise<void> => {
  let installCmd;

  if (global.options.packageManager === 'npm' || global.options.packageManager === 'pnpm') installCmd = 'i';
  if (global.options.packageManager === 'yarn') installCmd = 'add';

  if (global.options.useNodemon) {
    exec(`cd ${global.options.projectName} && ${global.options.packageManager} ${installCmd} nodemon`, err => {
      console.log(`${chalk.green('✔')} installed nodemon`);
      if (err) console.log(`${chalk.red('✘')} fail to install nodemon`);
    });
  }
};

export const createSrc = (): Promise<null> => {
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

export const createIndex = async (): Promise<void> => {
  const langShort = global.options.language === 'typescript' ? 'ts' : 'js';

  try {
    writeFileSync(join(__dirname, global.options.projectName, 'src', `index.${langShort}`), `console.log('hello world')`);
    console.log(`${chalk.green('✔')} created index.${langShort}`);
  } catch (err) {
    console.log(err);
    console.log(`${chalk.red('✘')} failed to create index.${langShort}`);
  }
};

export const createTsConfig = async (): Promise<void> => {
  if (global.options.language === 'typescript') {
    const options = '{\r\n  "compilerOptions": {\r\n    "target": "esnext",\r\n    "module": "esnext",\r\n    "lib": ["dom", "es6", "es2017", "esnext.asynciterable"],\r\n    "skipLibCheck": true,\r\n    "sourceMap": true,\r\n    "outDir": "./dist",\r\n    "moduleResolution": "node",\r\n    "removeComments": true,\r\n    "noImplicitAny": true,\r\n    "strictNullChecks": true,\r\n    "strictFunctionTypes": true,\r\n    "noImplicitThis": true,\r\n    "noUnusedLocals": false,\r\n    "noUnusedParameters": false,\r\n    "noImplicitReturns": false,\r\n    "noFallthroughCasesInSwitch": true,\r\n    "allowSyntheticDefaultImports": true,\r\n    "esModuleInterop": true,\r\n    "emitDecoratorMetadata": true,\r\n    "experimentalDecorators": true,\r\n    "resolveJsonModule": true,\r\n    "baseUrl": "."\r\n  },\r\n  "include": ["src/*"]\r\n}\r\n';

    try {
      writeFileSync(join(__dirname, global.options.projectName, '/', 'tsconfig.json'), options);
      console.log(`${chalk.green('✔')} created tsconfig.json`);
    } catch {
      console.log(`${chalk.red('✘')} failed to create tsconfig.json`);
    }
  }
};

export const createGitIgnore = async (): Promise<void> => {
  try {
    writeFileSync(join(__dirname, global.options.projectName, '/', '.gitignore'), `node_modules\n*.env\n${global.options.language === 'typescript' ? 'dist' : ''}`);
    console.log(`${chalk.green('✔')} created .gitignore`);
  } catch {
    console.log(`${chalk.red('✘')} failed to create .gitignore`);
    return;
  }
};

export const editPackageJson = async (): Promise<void> => {
  const data = await readFileSync(join(__dirname, global.options.projectName, '/', 'package.json'));
  const obj = JSON.parse(data.toString());

  if (global.options.language === 'javascript') {
    obj.main = 'src/index.js';
    if (global.options.useNodemon)
      obj.scripts = {
        'start:dev': 'nodemon src/index.js',
        'start:prod': 'node src/index.js'
      };
    else
      obj.scripts = {
        start: 'node src/index.js'
      };
  }

  if (global.options.language === 'typescript') {
    obj.main = 'dist/index.js';
    if (global.options.useNodemon)
      obj.scripts = {
        'start:dev': 'nodemon dist/index.js',
        'start:prod': 'node dist/index.js',
        'watch:dev': 'tsc -w',
        'build:prod': 'tsc'
      };
    else
      obj.scripts = {
        start: 'node dist/index.js',
        build: 'tsc',
        watch: 'tsc -w'
      };
  }

  await writeFileSync(join(__dirname, global.options.projectName, '/', 'package.json'), Buffer.from(JSON.stringify(obj, null, 2)));
};

export const generateLicense = async (): Promise<void> => {
  const date = new Date();

  const mitLicense = `Copyright (c) ${date.getFullYear()} ${global.options.holder}

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:
  
  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.
  
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.`;

  if (global.options.license !== 'none') {
    try {
      writeFileSync(join(__dirname, global.options.projectName, '/', 'LICENSE'), mitLicense);
      console.log(`${chalk.green('✔')} created LICENSE`);
    } catch (err) {
      console.log(err);
      console.log(`${chalk.red('✘')} failed to create LICENSE`);
    }
  }
};
