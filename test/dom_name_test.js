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
        <div name='single' id='single'>div element 1</div>
        <div name='duplicate' id='duplicate_1'>div element 2</div>
        <div name='duplicate' id='duplicate_2'>div element 3</div>
        <div name='duplicate' id='duplicate_3'>div element 4</div>
      </div>
    );
  }
});

var div = document.createElement("div");
document.body.appendChild(div);
var output = ReactDom.render(<Doc />, div);

var assertEvaluatesToNodeSet = Helper.assertEvaluatesToNodeSet.bind(null, output);

suite("XPathReact", function () {
  suite("name", function () {
    test("unique name", function () {
      assertEvaluatesToNodeSet("//*[@name='single']", ["div#single"]);
    });

    test("01", function () {
      assertEvaluatesToNodeSet("//*[@name='duplicate']", ["div#duplicate_1", "div#duplicate_2", "div#duplicate_3"]);
    });
  });
});
