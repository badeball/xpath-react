"use strict";

var ReactInternals = require("../ReactInternals");
var XPathEvaluator = require("xpath-evaluator");

var XPathReactElement = require("./react_element");

function XPathReactDocument (nativeNode) {
  if (!ReactInternals.isValidElement(nativeNode) && !ReactInternals.isCompositeComponent(nativeNode)) {
    throw "Expected a React element or composite component";
  }
  this.elementNode = new XPathReactElement(nativeNode, this, 0);
}

XPathReactDocument.prototype.getId = function () {
  return "0";
};

XPathReactDocument.prototype.isEqual = function (node) {
  return this.getId() === node.getId();
};

XPathReactDocument.prototype.getNativeNode = function () {
  throw new Error("Accessing the abstract document node is not allowed");
};

XPathReactDocument.prototype.asString = function () {
  return this.elementNode.asString();
};

XPathReactDocument.prototype.asNumber = function () {
  return +this.asString();
};

XPathReactDocument.prototype.getNodeType = function () {
  return XPathEvaluator.Node.DOCUMENT_NODE;
};

XPathReactDocument.prototype.getChildNodes = function () {
  return [this.elementNode];
};

XPathReactDocument.prototype.getFollowingSiblings = function () {
  return undefined;
};

XPathReactDocument.prototype.getPrecedingSiblings = function () {
  return undefined;
};

XPathReactDocument.prototype.getName = function () {
  return undefined;
};

XPathReactDocument.prototype.getAttributes = function () {
  return undefined;
};

XPathReactDocument.prototype.getOwnerDocument = function () {
  return undefined;
};

XPathReactDocument.prototype.getElementById = function (id) {
  /* eslint-disable no-underscore-dangle */
  return this.elementNode._getElementById(id);
  /* eslint-enable no-underscore-dangle */
};

XPathReactDocument.prototype.toString = function () {
  return "Node<document>";
};

XPathReactDocument.compareDocumentPosition = function (a, b) {
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

module.exports = XPathReactDocument;
