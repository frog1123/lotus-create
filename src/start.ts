import { askProjectName, askLang, askPackageManager, askLicense, askHolder, askNodemon } from './inquirer.js';
import { addNodemon, clearCommandLine, createGitIgnore, createIndex, createProjectDirectory, createSrc, createTsConfig, editPackageJson, generateLicense, projectInit } from './utils.js';

export const start = async () => {
  let projectInitialized = false;

  await askProjectName();
  await askLang();
  await askPackageManager();
  await askNodemon();
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
      if (projectInitialized) addNodemon().then(createSrc).then(createIndex);
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
