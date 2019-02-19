import Assert from "assert";

import { evaluate, XPathResult } from "../lib";

import React from "react";

import createReactClass from "create-react-class";

import { shallow } from "./helper";

const Foo = function () {
  return (
    <div>
      <p>Hello world!</p>
    </div>
  );
};

const Bar = function () {
  return (
    <div>
      Foo: <Foo />
    </div>
  );
};

suite("XPathReact", function () {
  suite("child component", function () {
    test("unrendered child component", function () {
      const document = shallow(<Bar />);

      const expression = ".//Foo";

      const result = evaluate(expression, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE);

      Assert.equal(result.singleNodeValue.type, Foo);
    });

    test("unrendered child component (complex)", function () {
      const document = shallow(<Bar />);

      const expression = "string(.//Foo/parent::*)";

      const result = evaluate(expression, document, null, XPathResult.STRING_TYPE);

      Assert.equal(result.stringValue, "Foo: ");
    });

    test("unrendered child component (createReactClass)", function () {
      const Qux = createReactClass({
        displayName: "Qux",
        render: function () {
          return "Hello world!";
        }
      });

      const Norf = createReactClass({
        render: function () {
          return <p><Qux /></p>;
        }
      });

      const document = shallow(<Norf />);

      const expression = ".//Qux";

      const result = evaluate(expression, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE);

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

      const document = shallow(<Qux />);

      const expression = "count(//p)";

      const result = evaluate(expression, document, null, XPathResult.NUMBER_TYPE);

      Assert.equal(result.numberValue, 4);
    });
  });
});
