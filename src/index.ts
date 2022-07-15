#! /usr/bin/env node

import { options, askProjectName, askLang, askPackageManager } from './inquirer.js';

(async () => {
  askProjectName()
    .then(() => askLang())
    .then(() => askPackageManager())
    .then(() => console.log(`options: ${JSON.stringify(options)}`));
})();
