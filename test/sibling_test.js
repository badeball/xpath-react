"use strict";

var React = require("react");

var Helper = require("./helper");

var document = (
  <html>
    <head>
      <title>title</title>
    </head>
    <body>
      <div><span id='first' className='1'></span>foo<span className='2'></span>bar<span className='3'></span>baz<span id='last' className='4'></span></div>
    </body>
  </html>
);

var assertEvaluatesToNodeSet = Helper.assertEvaluatesToNodeSet.bind(null, document);

suite("XPathReact", function () {
  suite("sibling", function () {
    test("00", function () {
      assertEvaluatesToNodeSet("id(\"first\")/following-sibling::*", ["span.2", "span.3", "span.4"]);
    });

    test("01", function () {
      assertEvaluatesToNodeSet("id(\"first\")/following-sibling::node()", ["text(foo)", "span.2", "text(bar)", "span.3", "text(baz)", "span.4"]);
    });

    test("02", function () {
      assertEvaluatesToNodeSet("id(\"first\")/following-sibling::*/following-sibling::*", ["span.3", "span.4"]);
    });

    test("03", function () {
      assertEvaluatesToNodeSet("id(\"first\")/following-sibling::node()/following-sibling::node()", ["span.2", "text(bar)", "span.3", "text(baz)", "span.4"]);
    });

    test("04", function () {
      assertEvaluatesToNodeSet("id(\"first\")/following-sibling::*[1]", ["span.2"]);
    });

    test("05", function () {
      assertEvaluatesToNodeSet("id(\"first\")/following-sibling::node()[1]", ["text(foo)"]);
    });

    test("06", function () {
      assertEvaluatesToNodeSet("id(\"first\")/following-sibling::*/following-sibling::*[1]", ["span.3", "span.4"]);
    });

    test("07", function () {
      assertEvaluatesToNodeSet("id(\"first\")/following-sibling::node()/following-sibling::node()[1]", ["span.2", "text(bar)", "span.3", "text(baz)", "span.4"]);
    });

    test("08", function () {
      assertEvaluatesToNodeSet("id(\"last\")/preceding-sibling::*", ["span.1", "span.2", "span.3"]);
    });

    test("09", function () {
      assertEvaluatesToNodeSet("id(\"last\")/preceding-sibling::node()", ["span.1", "text(foo)", "span.2", "text(bar)", "span.3", "text(baz)"]);
    });

    test("10", function () {
      assertEvaluatesToNodeSet("id(\"last\")/preceding-sibling::*/preceding-sibling::*", ["span.1", "span.2"]);
    });

    test("11", function () {
      assertEvaluatesToNodeSet("id(\"last\")/preceding-sibling::node()/preceding-sibling::node()", ["span.1", "text(foo)", "span.2", "text(bar)", "span.3"]);
    });

    test("12", function () {
      assertEvaluatesToNodeSet("id(\"last\")/preceding-sibling::*[1]", ["span.3"]);
    });

    test("13", function () {
      assertEvaluatesToNodeSet("id(\"last\")/preceding-sibling::node()[1]", ["text(baz)"]);
    });

    test("14", function () {
      assertEvaluatesToNodeSet("id(\"last\")/preceding-sibling::*/preceding-sibling::*[1]", ["span.1", "span.2"]);
    });

    test("15", function () {
      assertEvaluatesToNodeSet("id(\"last\")/preceding-sibling::node()/preceding-sibling::node()[1]", ["span.1", "text(foo)", "span.2", "text(bar)", "span.3"]);
    });
  });
});
