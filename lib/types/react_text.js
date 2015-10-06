/* eslint-env node */

"use strict";

var XPathEvaluator = require("xpath-evaluator");

function ReactText (textContent, parent, nChild) {
  this.textContent = textContent;
  this.parent = parent;
  this.nChild = nChild;
}

ReactText.prototype.getId = function () {
  return this.getParent().getId() + "." + this.nChild;
};

ReactText.prototype.isEqual = function (node) {
  return this.getId() === node.getId();
};

ReactText.prototype.getNativeNode = function () {
  return this.textContent;
};

ReactText.prototype.asString = function () {
  return this.textContent;
};

ReactText.prototype.asNumber = function () {
  return +this.asString();
};

ReactText.prototype.getNodeType = function () {
  return XPathEvaluator.Node.TEXT_NODE;
};

ReactText.prototype.getParent = function () {
  return this.parent;
};

ReactText.prototype.getChildNodes = function () {
  return undefined;
};

ReactText.prototype.getFollowingSiblings = function () {
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

ReactText.prototype.getPrecedingSiblings = function () {
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

ReactText.prototype.getName = function () {
  return undefined;
};

ReactText.prototype.getAttributes = function () {
  return undefined;
};

ReactText.prototype.getOwnerDocument = function () {
  return this.getParent().getOwnerDocument();
};

ReactText.prototype.toString = function () {
  return "Node<text(" + this.textContent + ")>";
};

module.exports = ReactText;
