/* eslint-env node */

/* eslint-disable no-loop-func */

"use strict";

var assert = require("assert");

var XPathEvaluator = require("../register");

var XPathResult = XPathEvaluator.XPathResult;

module.exports = {
  assertEvaluatesToNodeSet: function (contextNode, expression, nodes) {
    var result = XPathEvaluator.evaluate(expression, contextNode, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE);

    var match;

    for (var i = 0; i < result.snapshotLength; i++) {
      var nodeIndex;

      if (result.snapshotItem(i).type) {
        nodeIndex = nodes.findIndex(function (node) {
          match = node.match(/(\w+)(?:#([^.]+))?(?:\.([\w\d-]+))?/);

          var tagName = match[1],
              idName = match[2],
              className = match[3];

          if (tagName && result.snapshotItem(i).type !== tagName) {
            return false;
          }

          if (idName && result.snapshotItem(i).props.id !== idName) {
            return false;
          }

          if (className && result.snapshotItem(i).props.className !== className) {
            return false;
          }

          return true;
        });
      } else {
        nodeIndex = nodes.findIndex(function (node) {
          match = node.match(/^(\w+)(?:\(([^\)]*)\))?$/);

          var nodeType = match[1],
              nodeValue = match[2];

          if (nodeType !== "text") {
            throw new Error("Unable to make assertions about anything other than text nodes");
          }

          if (result.snapshotItem(i) !== nodeValue) {
            return false;
          }

          return true;
        });
      }

      if (nodeIndex === -1) {
        console.log(result.snapshotItem(i));
        throw new Error("Unexpected node");
      } else {
        nodes.splice(nodeIndex, 1);
      }
    }

    assert.deepEqual(nodes, []);
  },

  assertEvaluatesToValue: function (contextNode, expression, value) {
    var result = XPathEvaluator.evaluate(expression, contextNode, null, XPathResult.ANY_TYPE);

    switch (result.resultType) {
      case XPathResult.NUMBER_TYPE:
        assert.equal(value, result.numberValue);
        break;

      case XPathResult.STRING_TYPE:
        assert.equal(value, result.stringValue);
        break;

      case XPathResult.BOOLEAN_TYPE:
        assert.equal(value, result.booleanValue);
        break;

      default:
        throw new Error("Unknown result type " + result.resultType);
    }
  }
};
