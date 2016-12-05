"use strict";

var XPathEvaluator = require("xpath-evaluator");

function XPathReactText (textContent, parent, nChild) {
  this.textContent = textContent;
  this.parent = parent;
  this.nChild = nChild;
}

XPathReactText.prototype.getId = function () {
  return this.getParent().getId() + "." + this.nChild;
};

XPathReactText.prototype.isEqual = function (node) {
  return this.getId() === node.getId();
};

XPathReactText.prototype.getNativeNode = function () {
  return this.textContent;
};

XPathReactText.prototype.asString = function () {
  return this.textContent;
};

XPathReactText.prototype.asNumber = function () {
  return +this.asString();
};

XPathReactText.prototype.getNodeType = function () {
  return XPathEvaluator.Node.TEXT_NODE;
};

XPathReactText.prototype.getParent = function () {
  return this.parent;
};

XPathReactText.prototype.getChildNodes = function () {
  return undefined;
};

XPathReactText.prototype.getFollowingSiblings = function () {
  var followingSiblings = [];

  var siblings = this.getParent().getChildNodes();

  var thisSiblingIndex = siblings.findIndex(function (sibling) {
    return sibling.getNativeNode() === this.getNativeNode();
  }.bind(this));

  for (var i = thisSiblingIndex + 1; i < siblings.length; i++) {
    followingSiblings.push(siblings[i]);
  }

  return followingSiblings;
};

XPathReactText.prototype.getPrecedingSiblings = function () {
  var precedingSiblings = [];

  var siblings = this.getParent().getChildNodes();

  var thisSiblingIndex = siblings.findIndex(function (sibling) {
    return sibling.getNativeNode() === this.getNativeNode();
  }.bind(this));

  for (var i = 0; i < thisSiblingIndex; i++) {
    precedingSiblings.push(siblings[i]);
  }

  return precedingSiblings;
};

XPathReactText.prototype.getName = function () {
  return undefined;
};

XPathReactText.prototype.getAttributes = function () {
  return undefined;
};

XPathReactText.prototype.getOwnerDocument = function () {
  return this.getParent().getOwnerDocument();
};

XPathReactText.prototype.toString = function () {
  return "Node<text(" + this.textContent + ")>";
};

module.exports = XPathReactText;
