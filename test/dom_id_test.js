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
          <div id='dupeid'>My id is dupeid</div>
          <div id='dupeid'>My id is also dupeid</div>
          <div id='uniqueid'>My id is uniqueid</div>
      </div>
    );
  }
});

var div = document.createElement("div");
document.body.appendChild(div);
var output = ReactDom.render(<Doc />, div);

var assertEvaluatesToNodeSet = Helper.assertEvaluatesToNodeSet.bind(null, output);

var assertEvaluatesToValue = Helper.assertEvaluatesToValue.bind(null, output);

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
