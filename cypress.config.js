const { defineConfig } = require("cypress");

module.exports = defineConfig({

  projectId: "ybdoft",
  //baseUrl:"http://localhost:4200/",
  //ignoreTestFiles:"**/examples/*",  
  viewportHeight: 1080,
  viewportWidth:1920,

    // import the multi reports from this URL: https://docs.cypress.io/guides/tooling/reporters  copy-paste the code
    reporter: 'cypress-multi-reporters',
      reporterOptions: {
        configFile: 'reporter-config.json',
      },

    // copy paste the config.js code from site after installing mochawesome install command
    // reporter: 'mochawesome',
    // reporterOptions: {
    //   reportDir: 'cypress/results/mochawesome',
    //   overwrite: false,
    //   html: false,
    //   json: true,
    // },

      env: {
      username:'kedar@mailinator.com',
      password:'admin123',
      apiURL:'https://conduit-api.bondaracademy.com/'
    },

    retries: {
      openMode: 0,
      runMode:2
    },

    component: {
      excludeSpecPattern: "**/examples/*"
    },
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here

      // const username = process.env.DB_USERNAME    // add the listener for username which is already added from package.json
      // const password = process.env.PASSWORD

      // if(!password) {
      //   throw new Error(`missing password environment variable`)
      // }

      // config.env = {username,password}
      // return config   
    },

    baseUrl:'https://conduit.bondaracademy.com/',
    specPattern: 'cypress/e2e/**/*.spec.{js,jsx,ts,tsx}'
  },
});
