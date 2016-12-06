"use strict";

var React = require("react");
var ReactDom = require("react-dom");

var Helper = require("./helper");

var jsdom = require("jsdom");

global.document = jsdom.jsdom("");
global.window = document.defaultView;
global.navigator = window.navigator;

var Doc = React.createClass({
  render: function () {
    return (
      <div>
        <svg id='svg' xmlns='http://www.w3.org/2000/svg' version='1.1' viewBox='0 0 1000 50'>
          <rect id='rect' fill='red' stroke='none' height='12' width='12' y='20' x='100'></rect>
          <text id='text' fill='black' fontSize='12' fontFamily='Arial' y='30' x='115'>Apple</text>
          <path id='path' d='M 200 26 L 600 26' stroke='red' strokeWidth='1em'/>
        </svg>
      </div>
    );
  }
});

var div = document.createElement("div");
document.body.appendChild(div);
var output = ReactDom.render(<Doc />, div);

var assertEvaluatesToNodeSet = Helper.assertEvaluatesToNodeSet.bind(null, output);

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
