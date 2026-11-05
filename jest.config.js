const path = require('path');
const config = require('@folio/jest-config-stripes');

const transformIgnorePatterns = config.transformIgnorePatterns.map(pattern => pattern.replace('|uuid', '|uuid|keyboardjs'));

module.exports = {
  ...config,
  setupFiles: [
    ...config.setupFiles,
    path.join(__dirname, './test/jest/setup-tests.js'),
  ],
  transformIgnorePatterns,
};
