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
      <section>
        <div id='parent'>
          <div id='child-1'>
            <div id='grand-child-1-1'></div>
            <p>dust</p>
            <div id='grand-child-1-2'></div>
            <p>dust</p>
            <div id='grand-child-1-3'></div>
          </div>
          <p>dust</p>
          <div id='child-2'>
            <div id='grand-child-2-1'></div>
            <p>dust</p>
            <div id='grand-child-2-2'></div>
            <p>dust</p>
            <div id='grand-child-2-3'></div>
          </div>
        </div>
      </section>
    );
  }
});

var div = document.createElement("div");
document.body.appendChild(div);
var output = ReactDom.render(<Doc />, div);

var assertEvaluatesToNodeSet = Helper.assertEvaluatesToNodeSet.bind(null, output);

suite("XPathReact", function () {
  suite("double slash and descendant", function () {
    test("00", function () {
      assertEvaluatesToNodeSet("/descendant::div", ["div#parent", "div#child-1", "div#grand-child-1-1", "div#grand-child-1-2", "div#grand-child-1-3", "div#child-2", "div#grand-child-2-1", "div#grand-child-2-2", "div#grand-child-2-3"]);
    });

    test("01", function () {
      assertEvaluatesToNodeSet("//section/descendant::*", ["div#parent", "div#child-1", "div#grand-child-1-1", "p", "div#grand-child-1-2", "p", "div#grand-child-1-3", "p", "div#child-2", "div#grand-child-2-1", "p", "div#grand-child-2-2", "p", "div#grand-child-2-3"]);
    });

    test("02", function () {
      assertEvaluatesToNodeSet("/descendant::div[1]", ["div#parent"]);
    });

    test("03", function () {
      assertEvaluatesToNodeSet("//div", ["div#parent", "div#child-1", "div#grand-child-1-1", "div#grand-child-1-2", "div#grand-child-1-3", "div#child-2", "div#grand-child-2-1", "div#grand-child-2-2", "div#grand-child-2-3"]);
    });

    test("04", function () {
      assertEvaluatesToNodeSet("//section//*", ["div#parent", "div#child-1", "div#grand-child-1-1", "p", "div#grand-child-1-2", "p", "div#grand-child-1-3", "p", "div#child-2", "div#grand-child-2-1", "p", "div#grand-child-2-2", "p", "div#grand-child-2-3"]);
    });

    test("05", function () {
      assertEvaluatesToNodeSet("//div[1]", ["div#parent", "div#child-1", "div#grand-child-1-1", "div#grand-child-2-1"]);
    });

    test("06", function () {
      assertEvaluatesToNodeSet("//div[contains(@id, 'grand-child')]", ["div#grand-child-1-1", "div#grand-child-1-2", "div#grand-child-1-3", "div#grand-child-2-1", "div#grand-child-2-2", "div#grand-child-2-3"]);
    });
  });
});
