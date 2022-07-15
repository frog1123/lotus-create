#! /usr/bin/env node

import { askProjectName, askLang, askPackageManager } from './inquirer.js';
import { clearCommandLine, createIndex, createProjectDirectory, createSrc, projectInit } from './utils.js';

(async () => {
  askProjectName()
    .then(() => askLang())
    .then(() => askPackageManager())
    .then(() => clearCommandLine())
    .then(() =>
      createProjectDirectory()
        .then(() => projectInit())
        .catch(() => {})
        .then(() => createSrc())
        .catch(() => {})
        .then(() => createIndex())
    );
})();
