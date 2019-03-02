import React from "react";

import Assert from "assert";

import { shallow } from "./helper";

import { evaluate, XPathResult } from "../lib";

const NullTest = function () {
  return null;
};

const UndefinedTest = function () {

};

const FalseTest = function () {
  return false;
};

const TrueTest = function () {
  return true;
};

const StringTest = function () {
  return "Foo";
};

const NumberTest = function () {
  return 123;
};

const FragmentTest = function () {
  return [
    "Foo",
    [[123]]
  ];
};

suite("XPathReact", function () {
  suite("ReactNode", function () {
    suite("null", function () {
      test("string value", function () {
        const document = shallow(<NullTest />);

        const expression = "string(/)";

        const result = evaluate(expression, document, null, XPathResult.STRING_TYPE);

        Assert.equal(result.stringValue, "");
      });

      test("node count", function () {
        const document = shallow(<NullTest />);

        const expression = "count(/*)";

        const result = evaluate(expression, document, null, XPathResult.NUMBER_TYPE);

        Assert.equal(result.numberValue, 0);
      });

      test("single node result", function () {
        const document = shallow(<NullTest />);

        const expression = "/*";

        const result = evaluate(expression, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE);

        Assert.equal(result.singleNodeValue, null);
      });
    });

    suite("undefined", function () {
      test("string value", function () {
        const document = shallow(<UndefinedTest />);

        const expression = "string(/)";

        const result = evaluate(expression, document, null, XPathResult.STRING_TYPE);

        Assert.equal(result.stringValue, "");
      });

      test("node count", function () {
        const document = shallow(<UndefinedTest />);

        const expression = "count(/*)";

        const result = evaluate(expression, document, null, XPathResult.NUMBER_TYPE);

        Assert.equal(result.numberValue, 0);
      });

      test("single node result", function () {
        const document = shallow(<UndefinedTest />);

        const expression = "/*";

        const result = evaluate(expression, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE);

        Assert.equal(result.singleNodeValue, null);
      });
    });

    suite("false", function () {
      test("string value", function () {
        const document = shallow(<FalseTest />);

        const expression = "string(/)";

        const result = evaluate(expression, document, null, XPathResult.STRING_TYPE);

        Assert.equal(result.stringValue, "");
      });

      test("node count", function () {
        const document = shallow(<FalseTest />);

        const expression = "count(/*)";

        const result = evaluate(expression, document, null, XPathResult.NUMBER_TYPE);

        Assert.equal(result.numberValue, 0);
      });

      test("single node result", function () {
        const document = shallow(<FalseTest />);

        const expression = "/*";

        const result = evaluate(expression, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE);

        Assert.equal(result.singleNodeValue, null);
      });
    });

    suite("true", function () {
      test("string value", function () {
        const document = shallow(<TrueTest />);

        const expression = "string(/)";

        const result = evaluate(expression, document, null, XPathResult.STRING_TYPE);

        Assert.equal(result.stringValue, "");
      });

      test("node count", function () {
        const document = shallow(<TrueTest />);

        const expression = "count(/*)";

        const result = evaluate(expression, document, null, XPathResult.NUMBER_TYPE);

        Assert.equal(result.numberValue, 0);
      });

      test("single node result", function () {
        const document = shallow(<TrueTest />);

        const expression = "/*";

        const result = evaluate(expression, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE);

        Assert.equal(result.singleNodeValue, null);
      });
    });

    suite("string", function () {
      test("string value", function () {
        const document = shallow(<StringTest />);

        const expression = "string(/)";

        const result = evaluate(expression, document, null, XPathResult.STRING_TYPE);

        Assert.equal(result.stringValue, "Foo");
      });

      test("node count", function () {
        const document = shallow(<StringTest />);

        const expression = "count(/node())";

        const result = evaluate(expression, document, null, XPathResult.NUMBER_TYPE);

        Assert.equal(result.numberValue, 1);
      });

      test("single node result", function () {
        const document = shallow(<StringTest />);

        const expression = "/node()";

        const result = evaluate(expression, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE);

        Assert.equal(result.singleNodeValue, "Foo");
      });
    });

    suite("number", function () {
      test("string value", function () {
        const document = shallow(<NumberTest />);

        const expression = "string(/)";

        const result = evaluate(expression, document, null, XPathResult.STRING_TYPE);

        Assert.equal(result.stringValue, "123");
      });

      test("number value", function () {
        const document = shallow(<NumberTest />);

        const expression = "number(/)";

        const result = evaluate(expression, document, null, XPathResult.NUMBER_TYPE);

        Assert.equal(result.numberValue, 123);
      });

      test("node count", function () {
        const document = shallow(<NumberTest />);

        const expression = "count(/node())";

        const result = evaluate(expression, document, null, XPathResult.NUMBER_TYPE);

        Assert.equal(result.numberValue, 1);
      });

      test("single node result", function () {
        const document = shallow(<NumberTest />);

        const expression = "/node()";

        const result = evaluate(expression, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE);

        Assert.equal(result.singleNodeValue, 123);
      });
    });

    suite("fragment", function () {
      test("string value", function () {
        const document = shallow(<FragmentTest />);

        const expression = "string(/)";

        const result = evaluate(expression, document, null, XPathResult.STRING_TYPE);

        Assert.equal(result.stringValue, "Foo123");
      });

      test("node count", function () {
        const document = shallow(<FragmentTest />);

        const expression = "count(/node())";

        const result = evaluate(expression, document, null, XPathResult.NUMBER_TYPE);

        Assert.equal(result.numberValue, 2);
      });

      test("node result", function () {
        const document = shallow(<FragmentTest />);

        const expression = "/node()";

        const result = evaluate(expression, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE);

        Assert.equal(result.snapshotItem(0), "Foo");
        Assert.equal(result.snapshotItem(1), 123);
      });
    });
  });
});
