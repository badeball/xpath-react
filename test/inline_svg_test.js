"use strict";

/* eslint-disable no-unused-vars */
var React = require("react");
/* eslint-enable no-unused-vars */

var Helper = require("./helper");

var document = (
  <html>
    <body>
      <svg id='svg' xmlns='http://www.w3.org/2000/svg' version='1.1' viewBox='0 0 1000 50'>
        <rect id='rect' fill='red' stroke='none' height='12' width='12' y='20' x='100'></rect>
        <text id='text' fill='black' font-size='12' font-family='Arial' y='30' x='115'>Apple</text>
        <path id='path' d='M 200 26 L 600 26' stroke='red' stroke-width='1em'/>
      </svg>
    </body>
  </html>
);

var assertEvaluatesToNodeSet = Helper.assertEvaluatesToNodeSet.bind(null, document);

// TODO: Use a namespace prefix once support for namespaces are implemented.

suite("XPathReact", function () {
  suite("inline svg", function () {
    test("00", function () {
      assertEvaluatesToNodeSet("//svg", ["svg#svg"]);
    });

    test("01", function () {
      assertEvaluatesToNodeSet("//rect", ["rect#rect"]);
    });

    test("02", function () {
      assertEvaluatesToNodeSet("//text", ["text#text"]);
    });

    test("03", function () {
      assertEvaluatesToNodeSet("//path", ["path#path"]);
    });
  });
});
