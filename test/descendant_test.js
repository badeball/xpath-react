/* eslint-env mocha, node */

"use strict";

/* eslint-disable no-unused-vars */
var React = require("react");
/* eslint-enable no-unused-vars */

var Helper = require("./helper");

var document = (
  <html>
    <head>
      <title>title</title>
    </head>
    <body>
      <h1>foo</h1>
    </body>
  </html>
);

var assertEvaluatesToNodeSet = Helper.assertEvaluatesToNodeSet.bind(null, document);

suite("XPathReact", function () {
  suite("descendant", function () {
    test("00", function () {
      assertEvaluatesToNodeSet("//*", ["html", "head", "title", "body", "h1"]);
    });

    test("01", function () {
      assertEvaluatesToNodeSet("//node()", ["html", "head", "title", "text(title)", "body", "h1", "text(foo)"]);
    });

    test("02", function () {
      assertEvaluatesToNodeSet("/descendant::*", ["html", "head", "title", "body", "h1"]);
    });

    test("03", function () {
      assertEvaluatesToNodeSet("/descendant::node()", ["html", "head", "title", "text(title)", "body", "h1", "text(foo)"]);
    });

    test("04", function () {
      assertEvaluatesToNodeSet("/descendant-or-self::*", ["html", "head", "title", "body", "h1"]);
    });

    test.skip("05", function () {
      assertEvaluatesToNodeSet("/self::node()", ["document()", "html", "head", "title", "text(title)", "body", "h1", "text(foo)"]);
    });

    test("06", function () {
      assertEvaluatesToNodeSet("//*//*", ["head", "title", "body", "h1"]);
    });

    test("07", function () {
      assertEvaluatesToNodeSet("//node()//node()", ["head", "title", "text(title)", "body", "h1", "text(foo)"]);
    });

    test("08", function () {
      assertEvaluatesToNodeSet("//*/descendant::*", ["head", "title", "body", "h1"]);
    });

    test("09", function () {
      assertEvaluatesToNodeSet("//node()/descendant::node()", ["head", "title", "text(title)", "body", "h1", "text(foo)"]);
    });

    test("10", function () {
      assertEvaluatesToNodeSet("//*/descendant-or-self::*", ["html", "head", "title", "body", "h1"]);
    });

    test("11", function () {
      assertEvaluatesToNodeSet("//node()/descendant-or-self::node()", ["html", "head", "title", "text(title)", "body", "h1", "text(foo)"]);
    });

    test("12", function () {
      assertEvaluatesToNodeSet("//*[1]", ["html", "head", "title", "h1"]);
    });

    test("13", function () {
      assertEvaluatesToNodeSet("//node()[1]", ["html", "head", "title", "text(title)", "h1", "text(foo)"]);
    });

    test("14", function () {
      assertEvaluatesToNodeSet("/descendant::*[1]", ["html"]);
    });

    test("15", function () {
      assertEvaluatesToNodeSet("/descendant::node()[1]", ["html"]);
    });

    test("16", function () {
      assertEvaluatesToNodeSet("/descendant-or-self::*[1]", ["html"]);
    });

    test.skip("17", function () {
      assertEvaluatesToNodeSet("/descendant-or-self::node()[1]", ["document()"]);
    });

    test("18", function () {
      assertEvaluatesToNodeSet("//*//*[1]", ["head", "title", "h1"]);
    });

    test("19", function () {
      assertEvaluatesToNodeSet("//node()//node()[1]", ["head", "title", "text(title)", "h1", "text(foo)"]);
    });

    test("20", function () {
      assertEvaluatesToNodeSet("//*/descendant::*[1]", ["head", "title", "h1"]);
    });

    test("21", function () {
      assertEvaluatesToNodeSet("//node()/descendant::node()[1]", ["head", "title", "text(title)", "h1", "text(foo)"]);
    });

    test("22", function () {
      assertEvaluatesToNodeSet("//*/descendant-or-self::*[1]", ["html", "head", "title", "body", "h1"]);
    });

    test("23", function () {
      assertEvaluatesToNodeSet("//node()/descendant-or-self::node()[1]", ["html", "head", "title", "text(title)", "body", "h1", "text(foo)"]);
    });
  });
});
