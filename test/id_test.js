/* eslint-env mocha, node */

"use strict";

/* eslint-disable no-unused-vars */
var React = require("react");
/* eslint-enable no-unused-vars */

var Helper = require("./helper");

var document = (
  <html>
    <body>
      <div id='dupeid'>My id is dupeid</div>
      <div id='dupeid'>My id is also dupeid</div>
      <div id='uniqueid'>My id is uniqueid</div>
    </body>
  </html>
);

var assertEvaluatesToNodeSet = Helper.assertEvaluatesToNodeSet.bind(null, document);

suite("XPathDOM", function () {
  suite("id", function () {
    test("with unique id by function", function () {
      assertEvaluatesToNodeSet("id('uniqueid')", ["div#uniqueid"]);
    });

    test("with dupe id by function", function () {
      assertEvaluatesToNodeSet("id('dupeid')", ["div#dupeid"]);
    });

    test("with unique id by attribute", function () {
      assertEvaluatesToNodeSet("//*[@id='uniqueid']", ["div#uniqueid"]);
    });

    test("with dupe id by attribute", function () {
      assertEvaluatesToNodeSet("//*[@id='dupeid']", ["div#dupeid", "div#dupeid"]);
    });
  });
});
