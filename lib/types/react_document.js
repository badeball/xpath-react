"use strict";

var TestUtils = require("react-addons-test-utils");

var XPathEvaluator = require("xpath-evaluator");

var ReactElement = require("./react_element");

function ReactDocument (nativeNode) {
  if (!TestUtils.isElement(nativeNode)) {
    throw new Error("Expected a React element");
  }

  this.elementNode = new ReactElement(nativeNode, this, 0);
}

ReactDocument.prototype.getId = function () {
  return "0";
};

ReactDocument.prototype.isEqual = function (node) {
  return this.getId() === node.getId();
};

ReactDocument.prototype.getNativeNode = function () {
  throw new Error("Accessing the abstract document node is not allowed");
};

ReactDocument.prototype.asString = function () {
  return this.elementNode.asString();
};

ReactDocument.prototype.asNumber = function () {
  return +this.asString();
};

ReactDocument.prototype.getNodeType = function () {
  return XPathEvaluator.Node.DOCUMENT_NODE;
};

ReactDocument.prototype.getChildNodes = function () {
  return [this.elementNode];
};

ReactDocument.prototype.getFollowingSiblings = function () {
  return undefined;
};

ReactDocument.prototype.getPrecedingSiblings = function () {
  return undefined;
};

ReactDocument.prototype.getName = function () {
  return undefined;
};

ReactDocument.prototype.getAttributes = function () {
  return undefined;
};

ReactDocument.prototype.getOwnerDocument = function () {
  return undefined;
};

ReactDocument.prototype.getElementById = function (id) {
  /* eslint-disable no-underscore-dangle */
  return this.elementNode._getElementById(id);
  /* eslint-enable no-underscore-dangle */
};

ReactDocument.prototype.toString = function () {
  return "Node<document>";
};

ReactDocument.compareDocumentPosition = function (a, b) {
  a = a.getId();
  b = b.getId();

  if (a === b) {
    return 0;
  }

  a = a.split(".").map(function (number) {
    return parseInt(number, 10);
  });

  b = b.split(".").map(function (number) {
    return parseInt(number, 10);
  });

  for (var i = 0; i < a.length; i++) {
    if (i === b.length) {
      return 1;
    }

    if (a[i] < b[i]) {
      return -1;
    }

    if (a[i] > b[i]) {
      return 1;
    }
  }

  return -1;
};

module.exports = ReactDocument;
