#! /usr/bin/env node

import { askProjectName, askLang, askPackageManager } from './inquirer.js';
import { createProjectDirectory, projectInit } from './utils.js';

(async () => {
  askProjectName()
    .then(() => askLang())
    .then(() => askPackageManager())
    .then(() =>
      createProjectDirectory()
        .then(() => projectInit())
        .catch(() => {})
    );
})();
