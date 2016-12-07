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
          <h1>foo</h1>
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
  suite("descendant", function () {
    test("00", function () {
      assertEvaluatesToNodeSet("//*", ["Doc", "section", "div", "h1"]);
    });

    test("01", function () {
      assertEvaluatesToNodeSet("//node()", ["Doc", "section", "div", "h1", "text(foo)"]);
    });

    test("02", function () {
      assertEvaluatesToNodeSet("/descendant::*", ["Doc", "section", "div", "h1"]);
    });

    test("03", function () {
      assertEvaluatesToNodeSet("/descendant::node()", ["Doc", "section", "div", "h1", "text(foo)"]);
    });

    test("04", function () {
      assertEvaluatesToNodeSet("/descendant-or-self::*", ["Doc", "section", "div", "h1"]);
    });

    test.skip("05", function () {
      assertEvaluatesToNodeSet("/self::node()", ["document()", "Doc", "section", "div", "h1", "text(foo)"]);
    });

    test("06", function () {
      assertEvaluatesToNodeSet("//*//*", ["section", "div", "h1"]);
    });

    test("07", function () {
      assertEvaluatesToNodeSet("//node()//node()", ["section", "div", "h1", "text(foo)"]);
    });

    test("08", function () {
      assertEvaluatesToNodeSet("//*/descendant::*", ["section", "div", "h1"]);
    });

    test("09", function () {
      assertEvaluatesToNodeSet("//node()/descendant::node()", ["section", "div", "h1", "text(foo)"]);
    });

    test("10", function () {
      assertEvaluatesToNodeSet("//*/descendant-or-self::*", ["Doc", "section", "div", "h1"]);
    });

    test("11", function () {
      assertEvaluatesToNodeSet("//node()/descendant-or-self::node()", ["Doc", "section", "div", "h1", "text(foo)"]);
    });

    test("12", function () {
      assertEvaluatesToNodeSet("//*[1]", ["Doc", "section", "div", "h1"]);
    });

    test("13", function () {
      assertEvaluatesToNodeSet("//node()[1]", ["Doc", "section", "div", "h1", "text(foo)"]);
    });

    test("14", function () {
      assertEvaluatesToNodeSet("/descendant::*[1]", ["Doc"]);
    });

    test("15", function () {
      assertEvaluatesToNodeSet("/descendant::node()[1]", ["Doc"]);
    });

    test("16", function () {
      assertEvaluatesToNodeSet("/descendant-or-self::*[1]", ["Doc"]);
    });

    test.skip("17", function () {
      assertEvaluatesToNodeSet("/descendant-or-self::node()[1]", ["document()"]);
    });

    test("18", function () {
      assertEvaluatesToNodeSet("//*//*[1]", ["section", "div", "h1"]);
    });

    test("19", function () {
      assertEvaluatesToNodeSet("//node()//node()[1]", ["section", "div", "h1", "text(foo)"]);
    });

    test("20", function () {
      assertEvaluatesToNodeSet("//*/descendant::*[1]", ["section", "div", "h1"]);
    });

    test("21", function () {
      assertEvaluatesToNodeSet("//node()/descendant::node()[1]", ["section", "div", "h1", "text(foo)"]);
    });

    test("22", function () {
      assertEvaluatesToNodeSet("//*/descendant-or-self::*[1]", ["Doc", "section", "div", "h1"]);
    });

    test("23", function () {
      assertEvaluatesToNodeSet("//node()/descendant-or-self::node()[1]", ["Doc", "section", "div", "h1", "text(foo)"]);
    });
  });
});
