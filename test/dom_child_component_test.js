"use strict";

var Assert = require("assert");

var XPathEvaluator = require("../index");

var React = require("react");
var ReactDom = require("react-dom");

var jsdom = require("jsdom");

function initDOM() {
  global.document = jsdom.jsdom("");
  global.window = document.defaultView;
  global.navigator = window.navigator;
}

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
    test("Child component", function () {
      initDOM();

      var div = document.createElement("div");
      document.body.appendChild(div);
      var output = ReactDom.render(<Bar />, div);

      var expression = ".//Foo";

      var result = XPathEvaluator.evaluate(expression, output, null, XPathEvaluator.XPathResult.ANY_UNORDERED_NODE_TYPE);

      Assert.equal(result.singleNodeValue.type, Foo);
    });

    test("Child component (complex)", function () {
      initDOM();

      var div = document.createElement("div");
      document.body.appendChild(div);
      var output = ReactDom.render(<Bar />, div);

      var expression = "string(.//Foo/parent::*)";

      var result = XPathEvaluator.evaluate(expression, output, null, XPathEvaluator.XPathResult.STRING_TYPE);

      Assert.equal(result.stringValue, "Foo: Hello world!");
    });

    test("Child component (functional component)", function () {
      function Qux () {
        return <span>Hello world!</span>;
      }

      var Norf = React.createClass({
        render: function () {
          return <p><Qux /></p>;
        }
      });

      initDOM();

      var div = document.createElement("div");
      document.body.appendChild(div);
      var output = ReactDom.render(<Norf />, div);

      var expression = ".//Qux";

      var result = XPathEvaluator.evaluate(expression, output, null, XPathEvaluator.XPathResult.ANY_UNORDERED_NODE_TYPE);

      Assert.equal(result.singleNodeValue.type, Qux);
    });

    test("two-dimensional child components", function () {
      var Qux = React.createClass({
        render: function() {
          return (
            <div>
              <p />
              {[1, 2, 3].map(function (number) {
                return <p key={number} />;
              })}
            </div>
          );
        }
      });

      initDOM();

      var div = document.createElement("div");
      document.body.appendChild(div);
      var output = ReactDom.render(<Qux />, div);
      
      var expression = "count(//p)";

      var result = XPathEvaluator.evaluate(expression, output, null, XPathEvaluator.XPathResult.NUMBER_TYPE);

      Assert.equal(result.numberValue, 4);
    });
  });
});
