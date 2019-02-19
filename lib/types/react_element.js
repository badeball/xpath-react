"use strict";

var { DOCUMENT_NODE, ELEMENT_NODE, TEXT_NODE } = require("xpath-evaluator");

var ReactAttribute = require("./react_attribute");

var ReactText = require("./react_text");

var compareDocumentPosition = require("./compare_document_position");

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
    if (child.getNodeType() === ELEMENT_NODE ||
        child.getNodeType() === TEXT_NODE) {
      textContent = textContent + child.asString();
    }
  });

  return textContent;
};

ReactElement.prototype.asNumber = function () {
  return +this.asString();
};

ReactElement.prototype.getNodeType = function () {
  return ELEMENT_NODE;
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

  function flatten (array) {
    return array.reduce(function(memo, el) {
      var items = Array.isArray(el) ? flatten(el) : [el];
      return memo.concat(items);
    }, []);
  }

  var flattenedChildren = flatten([this.nativeNode.props.children]);

  for (var i = 0; i < flattenedChildren.length; i++) {
    addChild(flattenedChildren[i], i);
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
  if (this.getParent().getNodeType() === DOCUMENT_NODE) {
    return this.getParent();
  } else {
    return this.getParent().getOwnerDocument();
  }
};

ReactElement.prototype._getElementById = function (id) {
  if (this.nativeNode.props && this.nativeNode.props.id === id) {
    return this;
  } else {
    var children = this.getChildNodes();

    for (var i = 0; i < children.length; i++) {
      if (children[i].getNodeType() === ELEMENT_NODE) {
        var elementWithId = children[i]._getElementById(id);

        if (elementWithId) {
          return elementWithId;
        }
      }
    }
  }
};

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

ReactElement.prototype.compareDocumentPosition = function (other) {
  return compareDocumentPosition(this, other);
};

module.exports = ReactElement;
