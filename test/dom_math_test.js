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
        <div id='with' data-price='2' data-count='3'></div>
        <div id='without' data-price='2' data-count='4'></div>
      </div>
    );
  }
});

var div = document.createElement("div");
document.body.appendChild(div);
var output = ReactDom.render(<Doc />, div);

var assertEvaluatesToNodeSet = Helper.assertEvaluatesToNodeSet.bind(null, output);

suite("XPathReact", function () {
  suite("math", function () {
    test("00", function () {
      assertEvaluatesToNodeSet("//*[@data-price * (@data-count + @data-count) = 12]", ["div#with"]);
    });

    test("01", function () {
      assertEvaluatesToNodeSet("//*[@data-price * @data-count + @data-count = 12]", ["div#without"]);
    });
  });
});
