const path = require('path');
const { defineConfig } = require('cypress');

module.exports = defineConfig({
  chromeWebSecurity: false,
  e2e: {
    setupNodeEvents (on, config) {
      on('before:browser:launch', (browser = {}, launchOptions) => {
        if (browser.family === 'chromium' && browser.name !== 'electron') {
          const extensionPath = path.resolve('./build');
          launchOptions.args.push(`--load-extension=${extensionPath}`);
          launchOptions.args.push('--auto-open-devtools-for-tabs');
        }
        return launchOptions;
      });
    },
  },
});
