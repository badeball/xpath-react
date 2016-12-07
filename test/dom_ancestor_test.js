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
        <div>
          <h1 id='t'>foo</h1>
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
  suite("ancestor", function () {
    test("00", function () {
      assertEvaluatesToNodeSet("id('t')/ancestor::*", ["Doc", "section", "div"]);
    });

    test.skip("01", function () {
      assertEvaluatesToNodeSet("id('t')/ancestor::node()", ["document()", "Doc", "section", "div"]);
    });

    test("02", function () {
      assertEvaluatesToNodeSet("id('t')/ancestor-or-self::*", ["Doc", "section", "div", "h1"]);
    });

    test.skip("03", function () {
      assertEvaluatesToNodeSet("id('t')/ancestor-or-self::node()", ["document()", "Doc", "section", "div", "h1"]);
    });

    test("04", function () {
      assertEvaluatesToNodeSet("id('t')/ancestor-or-self::node()/ancestor::*", ["Doc", "section", "div"]);
    });

    test.skip("05", function () {
      assertEvaluatesToNodeSet("id('t')/ancestor-or-self::node()/ancestor::node()", ["document()", "Doc", "section", "div"]);
    });

    test("06", function () {
      assertEvaluatesToNodeSet("id('t')/ancestor-or-self::node()/ancestor-or-self::*", ["Doc", "section", "div", "h1"]);
    });

    test.skip("07", function () {
      assertEvaluatesToNodeSet("id('t')/ancestor-or-self::node()/ancestor-or-self::node()", ["document()", "Doc", "section", "div", "h1"]);
    });

    test("08", function () {
      assertEvaluatesToNodeSet("id('t')/ancestor::*[1]", ["div"]);
    });

    test("09", function () {
      assertEvaluatesToNodeSet("id('t')/ancestor::node()[1]", ["div"]);
    });

    test("10", function () {
      assertEvaluatesToNodeSet("id('t')/ancestor-or-self::*[1]", ["h1"]);
    });

    test("11", function () {
      assertEvaluatesToNodeSet("id('t')/ancestor-or-self::node()[1]", ["h1"]);
    });

    test("12", function () {
      assertEvaluatesToNodeSet("id('t')/ancestor-or-self::node()/ancestor::*[1]", ["Doc", "section", "div"]);
    });

    test.skip("13", function () {
      assertEvaluatesToNodeSet("id('t')/ancestor-or-self::node()/ancestor::node()[1]", ["document()", "Doc", "section", "div"]);
    });

    test("14", function () {
      assertEvaluatesToNodeSet("id('t')/ancestor-or-self::node()/ancestor-or-self::*[1]", ["Doc", "section", "div", "h1"]);
    });

    test.skip("15", function () {
      assertEvaluatesToNodeSet("id('t')/ancestor-or-self::node()/ancestor-or-self::node()[1]", ["document()", "Doc", "section", "div", "h1"]);
    });
  });
});
