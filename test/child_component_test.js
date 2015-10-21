/* eslint-env mocha, node */

"use strict";

var Assert = require("assert");

var XPathEvaluator = require("../register");

var XPathUtils = require("../utils");

/* eslint-disable no-unused-vars */
var React = require("react");

var Foo = React.createClass({
  render: function () {
    return (
      <div>
        <p>Hello world!</p>
      </div>
    );
  }
});

var Bar = React.createClass({
  render: function () {
    return (
      <div>
        Foo: <Foo />
      </div>
    );
  }
});
/* eslint-enable no-unused-vars */

suite("XPathReact", function () {
  suite("child component", function () {
    test("00", function () {
      var document = XPathUtils.render(<Bar />);

      var expression = ".//Foo";

      var result = XPathEvaluator.evaluate(expression, document, null, XPathEvaluator.XPathResult.ANY_UNORDERED_NODE_TYPE);

      Assert.equal(result.singleNodeValue.type, Foo);
    });

    test("00", function () {
      var document = XPathUtils.render(<Bar />);

      var expression = "string(.//Foo/parent::*)";

      var result = XPathEvaluator.evaluate(expression, document, null, XPathEvaluator.XPathResult.STRING_TYPE);

      Assert.equal(result.stringValue, "Foo: ");
    });
  });
});
