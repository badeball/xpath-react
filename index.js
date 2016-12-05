"use strict";

var XPathEvaluator = require("xpath-evaluator");
var ReactInternals = require("./lib/ReactInternals");
var XPathReactDocument = require("./lib/types/react_document");

XPathEvaluator.setAdapter(XPathReactDocument);

var XPathReact = {

  XPathResult: XPathEvaluator.XPathResult,

  evaluate: function(expression, element, nsResolver, type) {
    return XPathEvaluator.evaluate(expression, element, nsResolver, type);
  },

  find: function(expression, element) {

    var result = XPathReact.evaluate(expression, element, null, XPathReact.XPathResult.ANY_TYPE);

    var results = [];
    switch (result.resultType) {
      case XPathReact.XPathResult.UNORDERED_NODE_ITERATOR_TYPE:
        var el;
        while (el = result.iterateNext()) {
          results.push(el);
        }
        break;

      case XPathReact.XPathResult.STRING_TYPE:
        results.push(result.stringValue);
        break;

      case XPathReact.XPathResult.NUMBER_TYPE:
        results.push(result.numberValue);
        break;

      case XPathReact.XPathResult.BOOLEAN_TYPE:
        results.push(result.booleanValue);
        break;
    }

    return results;

  },

  findReactRoot: function(path) {
    var xpath = path || '//*[@data-reactroot]';
    var xpathResult = document.evaluate(xpath, document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    if (xpathResult.snapshotLength == 0) {
        throw 'No react application root was found with path ' + xpath;
    } else if (xpathResult.snapshotLength > 1) {
        throw 'Multiple react application roots were found with path ' + xpath;
    }
    return ReactInternals.findTopLevelCompositeComponentAtDOMNode(xpathResult.snapshotItem(0));
  }

};

module.exports = XPathReact;
