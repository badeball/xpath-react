import React from "react";

import {
  assertEvaluatesToNodeSet as unboundAssertEvaluatesToNodeSet,
  assertEvaluatesToValue as unboundAssertEvaluatesToValue
} from "./helper";

const document = (
  <html>
    <body>
      <div id='dupeid'>My id is dupeid</div>
      <div id='dupeid'>My id is also dupeid</div>
      <div id='uniqueid'>My id is uniqueid</div>
    </body>
  </html>
);

const assertEvaluatesToNodeSet = unboundAssertEvaluatesToNodeSet.bind(null, document);

const assertEvaluatesToValue = unboundAssertEvaluatesToValue.bind(null, document);

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
