"use strict";

var React = require("react");

var Helper = require("./helper");

var document = (
  <html>
    <head>
      <title>Title</title>
    </head>
    <body>
      <ul id='container'>
        <li id='li-1'></li>
        <li id='li-2'></li>
        <li id='li-3'></li>
        <li id='li-4'></li>
      </ul>
      <ul id='container-0'>
        <li id='li-5'></li>
        <li id='li-6'></li>
        <li id='li-7'></li>
        <li id='li-8'></li>
      </ul>
    </body>
  </html>
);

var assertEvaluatesToNodeSet = Helper.assertEvaluatesToNodeSet.bind(null, document);

suite("XPathReact", function () {
  suite("sort and merge", function () {
    test("00", function () {
      assertEvaluatesToNodeSet("id('container')/*[1]", ["li#li-1"]);
    });

    test("01", function () {
      assertEvaluatesToNodeSet("id('container')/*[2]", ["li#li-2"]);
    });

    test("02", function () {
      assertEvaluatesToNodeSet("id('container')/*[3]", ["li#li-3"]);
    });

    test("03", function () {
      assertEvaluatesToNodeSet("id('container')/*[4]", ["li#li-4"]);
    });

    test("04", function () {
      assertEvaluatesToNodeSet("id('container')/*[3] | id('container')/*[4] | id('container')/*[2] | id('container')/*[1]", ["li#li-1", "li#li-2", "li#li-3", "li#li-4"]);
    });

    test("05", function () {
      assertEvaluatesToNodeSet("id('container')/*[4] | id('container')/*[2] | id('container')/*[4] | id('container')/*[3]", ["li#li-2", "li#li-3", "li#li-4"]);
    });

    test("06", function () {
      assertEvaluatesToNodeSet("id('li-1 li-2 li-3 li-4')", ["li#li-1", "li#li-2", "li#li-3", "li#li-4"]);
    });

    test("07", function () {
      assertEvaluatesToNodeSet("id('li-4 li-3 li-2 li-1')", ["li#li-1", "li#li-2", "li#li-3", "li#li-4"]);
    });

    test("08", function () {
      assertEvaluatesToNodeSet("id('li-2 li-2 li-1 li-1')", ["li#li-1", "li#li-2"]);
    });

    test("09", function () {
      assertEvaluatesToNodeSet("id('container')/* | id('container-0')/*", ["li#li-1", "li#li-2", "li#li-3", "li#li-4", "li#li-5", "li#li-6", "li#li-7", "li#li-8"]);
    });

    test("10", function () {
      assertEvaluatesToNodeSet("id('container-0')/* | id('container')/*", ["li#li-1", "li#li-2", "li#li-3", "li#li-4", "li#li-5", "li#li-6", "li#li-7", "li#li-8"]);
    });

    test("11", function () {
      assertEvaluatesToNodeSet("id('container-0')/* | id('container')/* | id('container-0')/*", ["li#li-1", "li#li-2", "li#li-3", "li#li-4", "li#li-5", "li#li-6", "li#li-7", "li#li-8"]);
    });
  });
});
