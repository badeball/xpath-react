"use strict";

var XPathEvaluator = require("xpath-evaluator");

var compareDocumentPosition = require("./compare_document_position");

function ReactAttribute (attributeName, textContent, parent, nChild) {
  this.attributeName = attributeName;
  this.textContent = textContent;
  this.parent = parent;
  this.nChild = nChild;
}

ReactAttribute.prototype.getId = function () {
  return this.getParent().getId() + "." + this.nChild;
};

ReactAttribute.prototype.isEqual = function (node) {
  return this.getId() === node.getId();
};

ReactAttribute.prototype.asString = function () {
  return this.textContent;
};

ReactAttribute.prototype.asNumber = function () {
  return +this.asString();
};

ReactAttribute.prototype.getNodeType = function () {
  return XPathEvaluator.Node.ATTRIBUTE_NODE;
};

ReactAttribute.prototype.getParent = function () {
  return this.parent;
};

ReactAttribute.prototype.getChildNodes = function () {
  return undefined;
};

ReactAttribute.prototype.getFollowingSiblings = function () {
  return undefined;
};

ReactAttribute.prototype.getPrecedingSiblings = function () {
  return undefined;
};

ReactAttribute.prototype.getName = function () {
  switch (this.attributeName) {
    case "className":
      return "class";
    case "htmlFor":
      return "for";
    default:
      return this.attributeName;
  }
};

ReactAttribute.prototype.getAttributes = function () {
  return undefined;
};

ReactAttribute.prototype.getOwnerDocument = function () {
  return this.getParent().getOwnerDocument();
};

ReactAttribute.prototype.toString = function () {
  return "Node<" + this.attributeName + ">";
};

ReactAttribute.prototype.compareDocumentPosition = function (other) {
  return compareDocumentPosition(this, other);
};

module.exports = ReactAttribute;
