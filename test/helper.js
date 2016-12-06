/* eslint-env node */

/* eslint-disable no-loop-func */

"use strict";

var assert = require("assert");
var ReactTestUtils = require("react-addons-test-utils");
var XPathEvaluator = require("../index");

var XPathResult = XPathEvaluator.XPathResult;

module.exports = {
  render: function(el) {
    var shallowRenderer = ReactTestUtils.createRenderer();
    shallowRenderer.render(el);
    return shallowRenderer.getRenderOutput()
  },

  assertEvaluatesToNodeSet: function (contextNode, expression, nodes) {
    var result = XPathEvaluator.evaluate(expression, contextNode, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE);

    var match;

    for (var i = 0; i < result.snapshotLength; i++) {
      if (result.snapshotItem(i).type) {
        match = nodes[i].match(/(\w+)(?:#([^.]+))?(?:\.([\w\d-]+))?/);

        var tagName = match[1],
            idName = match[2],
            className = match[3];

        if (tagName) {
          assert.equal(result.snapshotItem(i).type, tagName);
        }

        if (idName) {
          assert.equal(result.snapshotItem(i).props.id, idName);
        }

        if (className) {
          assert.equal(result.snapshotItem(i).props.className, className);
        }
      } else {
        match = nodes[i].match(/^(\w+)(?:\(([^\)]*)\))?$/);

        var nodeType = match[1],
            nodeValue = match[2];

        if (nodeType !== "text") {
          throw new Error("Unable to make assertions about anything other than text nodes");
        }

        assert.equal(result.snapshotItem(i), nodeValue);
      }
    }

    assert.equal(result.snapshotLength, nodes.length);
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
