"use strict";

var XPathEvaluator = require("xpath-evaluator");

var ReactAttribute = require("./react_attribute");

var ReactText = require("./react_text");

function ReactElement (nativeNode, parent, nChild) {
  this.nativeNode = nativeNode;
  this.parent = parent;
  this.nChild = nChild;
}

ReactElement.prototype.getId = function () {
  return this.getParent().getId() + "." + this.nChild;
};

ReactElement.prototype.isEqual = function (node) {
  return this.getId() === node.getId();
};

ReactElement.prototype.getNativeNode = function () {
  return this.nativeNode;
};

ReactElement.prototype.asString = function () {
  var textContent = "";

  this.getChildNodes().forEach(function (child) {
    if (child.getNodeType() === XPathEvaluator.Node.ELEMENT_NODE ||
        child.getNodeType() === XPathEvaluator.Node.TEXT_NODE) {
      textContent = textContent + child.asString();
    }
  });

  return textContent;
};

ReactElement.prototype.asNumber = function () {
  return +this.asString();
};

ReactElement.prototype.getNodeType = function () {
  return XPathEvaluator.Node.ELEMENT_NODE;
};

ReactElement.prototype.getParent = function () {
  return this.parent;
};

ReactElement.prototype.getChildNodes = function () {
  if (!this.nativeNode.props || !this.nativeNode.props.children) {
    return [];
  }

  var children = [];

  var addChild = function (child, i) {
    if (child) {
      if (typeof child === "string") {
        children.push(new ReactText(child, this, i));
      } else {
        children.push(new ReactElement(child, this, i));
      }
    }
  }.bind(this);

  if (Array.isArray(this.nativeNode.props.children)) {
    for (var i = 0; i < this.nativeNode.props.children.length; i++) {
      addChild(this.nativeNode.props.children[i], i);
    }
  } else {
    addChild(this.nativeNode.props.children, 0);
  }

  return children;
};

ReactElement.prototype.getFollowingSiblings = function () {
  var followingSiblings = [];

  var siblings = this.getParent().getChildNodes();

  var thisSiblingIndex = siblings.findIndex(function (sibling) {
    return sibling.isEqual(this);
  }.bind(this));

  for (var i = thisSiblingIndex + 1; i < siblings.length; i++) {
    followingSiblings.push(siblings[i]);
  }

  return followingSiblings;
};

ReactElement.prototype.getPrecedingSiblings = function () {
  var precedingSiblings = [];

  var siblings = this.getParent().getChildNodes();

  var thisSiblingIndex = siblings.findIndex(function (sibling) {
    return sibling.isEqual(this);
  }.bind(this));

  for (var i = 0; i < thisSiblingIndex; i++) {
    precedingSiblings.push(siblings[i]);
  }

  return precedingSiblings;
};

ReactElement.prototype.getName = function () {
  if (typeof this.nativeNode.type === "string") {
    return this.nativeNode.type;
  } else if (typeof this.nativeNode.type === "function") {
    return this.nativeNode.type.displayName || this.nativeNode.type.name;
  }
};

ReactElement.prototype.getAttributes = function () {
  if (!this.nativeNode.props) {
    return [];
  }

  var attributes = [];

  var i = 0;

  for (var attribute in this.nativeNode.props) {
    if (this.nativeNode.props.hasOwnProperty(attribute) && attribute !== "children") {
      attributes.push(new ReactAttribute(attribute, this.nativeNode.props[attribute], this, i++));
    }
  }

  return attributes;
};

ReactElement.prototype.getOwnerDocument = function () {
  if (this.getParent().getNodeType() === XPathEvaluator.Node.DOCUMENT_NODE) {
    return this.getParent();
  } else {
    return this.getParent().getOwnerDocument();
  }
};

/* eslint-disable no-underscore-dangle */
ReactElement.prototype._getElementById = function (id) {
  if (this.nativeNode.props && this.nativeNode.props.id === id) {
    return this;
  } else {
    var children = this.getChildNodes();

    for (var i = 0; i < children.length; i++) {
      if (children[i].getNodeType() === XPathEvaluator.Node.ELEMENT_NODE) {
        var elementWithId = children[i]._getElementById(id);

        if (elementWithId) {
          return elementWithId;
        }
      }
    }
  }
};
/* eslint-enable no-underscore-dangle */

ReactElement.prototype.toString = function () {
  var name = this.getName();

  if (this.nativeNode.props) {
    if (this.nativeNode.props.className) {
      name = name + "." + this.nativeNode.props.className.split(/\s+/g).join(".");
    }

    if (this.nativeNode.props.id) {
      name = name + "#" + this.nativeNode.props.id;
    }
  }

  return "Node<" + name + ">";
};

module.exports = ReactElement;
