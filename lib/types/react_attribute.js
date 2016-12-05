"use strict";

var XPathEvaluator = require("xpath-evaluator");

function XPathReactAttribute (attributeName, textContent, parent, nChild) {
  this.attributeName = attributeName;
  this.textContent = textContent;
  this.parent = parent;
  this.nChild = nChild;
}

XPathReactAttribute.prototype.getId = function () {
  return this.getParent().getId() + "." + this.nChild;
};

XPathReactAttribute.prototype.isEqual = function (node) {
  return this.getId() === node.getId();
};

XPathReactAttribute.prototype.asString = function () {
  return this.textContent;
};

XPathReactAttribute.prototype.asNumber = function () {
  return +this.asString();
};

XPathReactAttribute.prototype.getNodeType = function () {
  return XPathEvaluator.Node.ATTRIBUTE_NODE;
};

XPathReactAttribute.prototype.getParent = function () {
  return this.parent;
};

XPathReactAttribute.prototype.getChildNodes = function () {
  return undefined;
};

XPathReactAttribute.prototype.getFollowingSiblings = function () {
  return undefined;
};

XPathReactAttribute.prototype.getPrecedingSiblings = function () {
  return undefined;
};

XPathReactAttribute.prototype.getName = function () {
  switch (this.attributeName) {
    case "className":
      return "class";
    case "htmlFor":
      return "for";
    default:
      return this.attributeName;
  }
};

XPathReactAttribute.prototype.getAttributes = function () {
  return undefined;
};

XPathReactAttribute.prototype.getOwnerDocument = function () {
  return this.getParent().getOwnerDocument();
};

XPathReactAttribute.prototype.toString = function () {
  return "Node<" + this.attributeName + ">";
};

module.exports = XPathReactAttribute;
