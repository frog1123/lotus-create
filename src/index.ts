#! /usr/bin/env node

import { askProjectName, askLang, askPackageManager } from './inquirer.js';
import { clearCommandLine, createGitIgnore, createIndex, createProjectDirectory, createSrc, createTsConfig, projectInit } from './utils.js';

(async () => {
  let initializedProject: boolean;

  askProjectName()
    .then(() => askLang())
    .then(() => askPackageManager())
    .then(() => clearCommandLine())
    .then(() =>
      createProjectDirectory()
        .then(() => projectInit())
        .catch(() => {})
        .then(status => {
          if (status === 'worked') {
            initializedProject = true;
            createSrc();
          } else initializedProject = false;
        })
        .catch(() => {})
        .then(() => {
          if (initializedProject) createTsConfig();
        })
        .then(() => {
          if (initializedProject) createIndex();
        })
        .then(() => {
          if (initializedProject) createGitIgnore();
        })
    );
})();
