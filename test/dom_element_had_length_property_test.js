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
      </section>
    );
  }
});

var div = document.createElement("div");
document.body.appendChild(div);
var output = ReactDom.render(<Doc />, div);

var assertEvaluatesToNodeSet = Helper.assertEvaluatesToNodeSet.bind(null, output);

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
      assertEvaluatesToNodeSet("//section/*[@id='target']", ["select#target"]);
    });

    test("05", function () {
      assertEvaluatesToNodeSet("//section/select[@id='target']", ["select#target"]);
    });

    test("06", function () {
      assertEvaluatesToNodeSet("//section/node()[@id='target']", ["select#target"]);
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
      assertEvaluatesToNodeSet("//section/div/*[@name='target2']", ["select#a", "select#b"]);
    });

    test("12", function () {
      assertEvaluatesToNodeSet("//section/div/select[@name='target2']", ["select#a", "select#b"]);
    });

    test("13", function () {
      assertEvaluatesToNodeSet("//section/div/node()[@name='target2']", ["select#a", "select#b"]);
    });
  });
});
