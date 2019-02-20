"use strict";

const babelify = require("babelify"),
    browserify = require("browserify"),
    express = require("express"),
    path = require("path");

const application = express();

application.get("/application.js", function (request, response) {
  browserify(path.join(__dirname, "application.js")).transform(babelify).bundle().pipe(response);
});

application.get("/", function (request, response) {
  response.sendFile(path.join(__dirname, "index.html"));
});

application.listen(8080, function () {
  console.log("listening on port 8080");
});
