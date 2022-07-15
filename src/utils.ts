import { options } from './inquirer.js';

import { exec } from 'child_process';
import { access, mkdir } from 'fs';

// const path = `./${options.projectName}`;
const path = `./new-proj`;

const createProjectDirectory = () => {
  access(path, (error: any) => {
    if (error) {
      mkdir(path, (error: any) => {
        if (error) console.log(error);
        else console.log(`Created new directory: ${options.projectName}`);
      });
    } else {
      console.log('Directory already exists');
    }
  });
};

createProjectDirectory();
