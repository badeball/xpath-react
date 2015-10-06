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

var assertEvaluatesToValue = Helper.assertEvaluatesToValue.bind(null, document);

suite("XPathReact", function () {
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

    test("with id by function in a attribute node context", function () {
      assertEvaluatesToValue("boolean(//attribute::*[id('uniqueid')])", true);
    });

    test("with id by function in a text node context", function () {
      assertEvaluatesToValue("boolean(//text()[id('uniqueid')])", true);
    });

    test("with id by function in a element node context", function () {
      assertEvaluatesToValue("boolean(//child::*[id('uniqueid')])", true);
    });
  });
});
