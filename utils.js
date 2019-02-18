"use strict";

var XPath = require("./lib");

module.exports = {
  find: function (element, expression) {
    var result = XPath.evaluate(
      expression,
      element,
      null,
      XPath.XPathResult.ANY_TYPE, null);

    switch (result.resultType) {
      case XPath.XPathResult.UNORDERED_NODE_ITERATOR_TYPE:
        return result.iterateNext();

      case XPath.XPathResult.STRING_TYPE:
        return result.stringValue;

      case XPath.XPathResult.NUMBER_TYPE:
        return result.numberValue;

      case XPath.XPathResult.BOOLEAN_TYPE:
        return result.booleanValue;
    }
  }
};
