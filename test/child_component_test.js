"use strict";

var Assert = require("assert");

var XPathEvaluator = require("../lib");

var { XPathResult } = require("xpath-evaluator");

var XPathUtils = require("../utils");

var React = require("react");

var Helper = require("./helper");

var Foo = function () {
  return (
    <div>
      <p>Hello world!</p>
    </div>
  );
};

var Bar = function () {
  return (
    <div>
      Foo: <Foo />
    </div>
  );
};

suite("XPathReact", function () {
  suite("child component", function () {
    test("unrendered child component", function () {
      var document = Helper.shallow(<Bar />);

      var expression = ".//Foo";

      var result = XPathEvaluator.evaluate(expression, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE);

      Assert.equal(result.singleNodeValue.type, Foo);
    });

    test("unrendered child component (complex)", function () {
      var document = Helper.shallow(<Bar />);

      var expression = "string(.//Foo/parent::*)";

      var result = XPathEvaluator.evaluate(expression, document, null, XPathResult.STRING_TYPE);

      Assert.equal(result.stringValue, "Foo: ");
    });

    test("unrendered child component (createClass)", function () {
      if (!React.createClass) {
        return this.skip();
      }

      var Qux = React.createClass({
        render: function () {
          return "Hello world!";
        }
      });

      var Norf = React.createClass({
        render: function () {
          return <p><Qux /></p>;
        }
      });

      var document = Helper.shallow(<Norf />);

      var expression = ".//Qux";

      var result = XPathEvaluator.evaluate(expression, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE);

      Assert.equal(result.singleNodeValue.type, Qux);
    });

    test("two-dimensional child components", function () {
      function Qux () {
        return (
          <div>
            <p />
            {[1, 2, 3].map(function (number) {
              return <p key={number} />;
            })}
          </div>
        );
      }

      var document = Helper.shallow(<Qux />);

      var expression = "count(//p)";

      var result = XPathEvaluator.evaluate(expression, document, null, XPathResult.NUMBER_TYPE);

      Assert.equal(result.numberValue, 4);
    });
  });
});
