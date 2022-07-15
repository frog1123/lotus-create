#! /usr/bin/env node

import { options, askProjectName, askLang, askPackageManager } from './utils.js';

(async () => {
  askProjectName()
    .then(() => askLang())
    .then(() => askPackageManager())
    .then(() => console.log(`options: ${JSON.stringify(options)}`));
})();
