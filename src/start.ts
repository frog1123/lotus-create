import { askProjectName, askLang, askPackageManager, askLicense, askHolder } from './inquirer.js';
import { clearCommandLine, createGitIgnore, createIndex, createProjectDirectory, createSrc, createTsConfig, editPackageJson, generateLicense, projectInit } from './utils.js';

export const start = async () => {
  let projectInitialized = false;

  await askProjectName();
  await askLang();
  await askPackageManager();
  await askLicense();
  await askHolder();
  await clearCommandLine();
  await createProjectDirectory();
  await projectInit()
    .then(status => {
      if (status === 'success') projectInitialized = true;
    })
    .catch(() => {})
    .then(() => {
      if (projectInitialized) createSrc().then(createIndex);
    })
    .then(() => {
      if (projectInitialized)
        createTsConfig().then(() =>
          createGitIgnore()
            ?.then(async () => await editPackageJson())
            .then(() => generateLicense())
        );
    });
};
