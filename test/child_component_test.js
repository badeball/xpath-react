"use strict";

var Assert = require("assert");

var XPathEvaluator = require("../index");

var Helper = require("./helper");

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

suite("XPathReact", function () {
  suite("child component", function () {
    test("unrendered child component", function () {
      var document = Helper.render(<Bar />);

      var expression = ".//Foo";

      var result = XPathEvaluator.evaluate(expression, document, null, XPathEvaluator.XPathResult.ANY_UNORDERED_NODE_TYPE);

      Assert.equal(result.singleNodeValue.type, Foo);
    });

    test("unrendered child component (complex)", function () {
      var document = Helper.render(<Bar />);

      var expression = "string(.//Foo/parent::*)";

      var result = XPathEvaluator.evaluate(expression, document, null, XPathEvaluator.XPathResult.STRING_TYPE);

      Assert.equal(result.stringValue, "Foo: ");
    });

    test("unrendered child component (functional component)", function () {
      function Qux () {
        return "Hello world!";
      }

      function Norf () {
        return <p><Qux /></p>;
      }

      var document = Helper.render(<Norf />);

      var expression = ".//Qux";

      var result = XPathEvaluator.evaluate(expression, document, null, XPathEvaluator.XPathResult.ANY_UNORDERED_NODE_TYPE);

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

      var document = Helper.render(<Qux />);

      var expression = "count(//p)";

      var result = XPathEvaluator.evaluate(expression, document, null, XPathEvaluator.XPathResult.NUMBER_TYPE);

      Assert.equal(result.numberValue, 4);
    });
  });
});
