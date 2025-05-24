const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    specPattern: "cypress/e2e/**/*.cy.js",
    supportFile: "cypress/support/e2e.js",
  },

  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
    projectId: "g4yzfo",
  },
});
