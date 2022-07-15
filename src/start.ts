import { askProjectName, askLang, askPackageManager } from './inquirer.js';
import { clearCommandLine, createGitIgnore, createIndex, createProjectDirectory, createSrc, createTsConfig, projectInit } from './utils.js';

export const start = async () => {
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
            createSrc().then(() => createIndex());
            initializedProject = true;
          } else initializedProject = false;
        })
        .then(() => {
          if (initializedProject) createTsConfig();
        })
        .then(() => {
          if (initializedProject) createGitIgnore();
        })
    );
};
