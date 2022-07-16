import { askProjectName, askLang, askPackageManager } from './inquirer.js';
import { clearCommandLine, createGitIgnore, createIndex, createProjectDirectory, createSrc, createTsConfig, editPackageJson, projectInit } from './utils.js';

export const start = async () => {
  let projectInitialized = false;

  await askProjectName();
  await askLang();
  await askPackageManager();
  await clearCommandLine();
  await createProjectDirectory()
    .then(() =>
      projectInit()
        .then(status => {
          if (status === 'success') projectInitialized = true;
        })
        .catch(() => {})
    )
    .then(() => {
      if (projectInitialized) createSrc().then(() => createIndex());
    })
    .then(() => {
      if (projectInitialized) createTsConfig().then(() => createGitIgnore()?.then(async () => await editPackageJson()));
    });
};
