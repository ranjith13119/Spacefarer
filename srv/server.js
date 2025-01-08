"use strict";

const cds = require("@sap/cds");
const helmet = require("helmet");
const cdsSwagger = require("cds-swagger-ui-express");

cds.on("bootstrap", (app) =>
  app.use(
    // helmet({
    //   // Creating a Content Security Policy (CSP) is a major building block in securing your web application.
    //   contentSecurityPolicy: {
    //     directives: {
    //       ...helmet.contentSecurityPolicy.getDefaultDirectives(),
    //     },
    //   },
    // }),
    cdsSwagger({
      //Exposing the service as a Swagger api
      basePath: "/swagger",
      diagram: "true",
    })
  )
 
);

module.exports = cds.server;