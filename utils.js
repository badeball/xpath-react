"use strict";

var { XPathResult } = require("xpath-evaluator");

var XPath = require("./lib");

module.exports = {
  find: function (element, expression) {

    var result = XPath.evaluate(
      expression,
      element,
      null,
      XPathResult.ANY_TYPE, null);

    switch (result.resultType) {
      case XPathResult.UNORDERED_NODE_ITERATOR_TYPE:
        return result.iterateNext();

      case XPathResult.STRING_TYPE:
        return result.stringValue;

      case XPathResult.NUMBER_TYPE:
        return result.numberValue;

      case XPathResult.BOOLEAN_TYPE:
        return result.booleanValue;
    }
  }
};
