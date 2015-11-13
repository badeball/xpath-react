"use strict";

var React = require("react");

var Helper = require("./helper");

var document = (
  <html>
    <head>
      <title>title</title>
    </head>
    <body>
      <select id='target'>
        <option>foo</option>
        <option>bar</option>
        <option>baz</option>
      </select>
      <div>
        <select name='target2' id='a'>
          <option>foo</option>
          <option>bar</option>
          <option>baz</option>
        </select>
        <select name='target2' id='b'>
          <option>foo</option>
          <option>bar</option>
          <option>baz</option>
        </select>
      </div>
    </body>
  </html>
);

var assertEvaluatesToNodeSet = Helper.assertEvaluatesToNodeSet.bind(null, document);

suite("XPathReact", function () {
  suite("element had length property", function () {
    test("00", function () {
      assertEvaluatesToNodeSet("id('target')", ["select#target"]);
    });

    test("01", function () {
      assertEvaluatesToNodeSet("//*[@id='target']", ["select#target"]);
    });

    test("02", function () {
      assertEvaluatesToNodeSet("//select[@id='target']", ["select#target"]);
    });

    test("03", function () {
      assertEvaluatesToNodeSet("//node()[@id='target']", ["select#target"]);
    });

    test("04", function () {
      assertEvaluatesToNodeSet("//body/*[@id='target']", ["select#target"]);
    });

    test("05", function () {
      assertEvaluatesToNodeSet("//body/select[@id='target']", ["select#target"]);
    });

    test("06", function () {
      assertEvaluatesToNodeSet("//body/node()[@id='target']", ["select#target"]);
    });

    test("08", function () {
      assertEvaluatesToNodeSet("//*[@name='target2']", ["select#a", "select#b"]);
    });

    test("09", function () {
      assertEvaluatesToNodeSet("//select[@name='target2']", ["select#a", "select#b"]);
    });

    test("10", function () {
      assertEvaluatesToNodeSet("//node()[@name='target2']", ["select#a", "select#b"]);
    });

    test("11", function () {
      assertEvaluatesToNodeSet("//body/div/*[@name='target2']", ["select#a", "select#b"]);
    });

    test("12", function () {
      assertEvaluatesToNodeSet("//body/div/select[@name='target2']", ["select#a", "select#b"]);
    });

    test("13", function () {
      assertEvaluatesToNodeSet("//body/div/node()[@name='target2']", ["select#a", "select#b"]);
    });
  });
});
