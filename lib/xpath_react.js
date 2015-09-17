/* eslint-env node */

"use strict";

var XPathEvaluator = require("xpath-evaluator");

function XPathReact (nativeNode) {
  if (!nativeNode) {
    throw new Error("This should not happen!");
  }

  this.nativeNode = nativeNode;
}

XPathReact.prototype.getNativeNode = function () {
  return this.nativeNode;
};

XPathReact.prototype.asString = function () {
  if (this.nativeNode.textContent) {
    return this.nativeNode.textContent;
  }

  if (typeof this.nativeNode === "string") {
    return this.nativeNode;
  }

  var textContent = "";

  this.getChildNodes().forEach(function (child) {
    textContent = textContent + child.asString();
  });

  return textContent;
};

XPathReact.prototype.asNumber = function () {
  return +this.asString();
};

XPathReact.prototype.getNodeType = function () {
  if (typeof this.nativeNode === "string") {
    return XPathEvaluator.Node.TEXT_NODE;
  } else {
    return XPathEvaluator.Node.ELEMENT_NODE;
  }
};

XPathReact.prototype.getChildNodes = function () {
  if (typeof this.nativeNode === "string") {
    return [];
  }

  if (!this.nativeNode.props.children) {
    return [];
  }

  if (Array.isArray(this.nativeNode.props.children)) {
    var children = [];

    for (var i = 0; i < this.nativeNode.props.children.length; i++) {
      if (this.nativeNode.props.children[i]) {
        children.push(new XPathReact(this.nativeNode.props.children[i]));
      }
    }

    return children;
  } else {
    return [new XPathReact(this.nativeNode.props.children)];
  }
};

XPathReact.prototype.getFollowingSiblings = function () {
  throw new Error("Following siblings of nodes are not available!");
};

XPathReact.prototype.getPrecedingSiblings = function () {
  throw new Error("Preceding siblings of nodes are not available!");
};

XPathReact.prototype.getName = function () {
  return this.nativeNode.type;
};

XPathReact.prototype.getAttributes = function () {
  if (!this.nativeNode.props) {
    return [];
  }

  var attributes = [];

  function translateAttributeName (name) {
    switch (name) {
      case "className":
        return "class";
      case "htmlFor":
        return "for";
      default:
        return name;
    }
  }

  for (var attribute in this.nativeNode.props) {
    if (this.nativeNode.props.hasOwnProperty(attribute)) {
      attributes.push(new XPathReact({
        type: translateAttributeName(attribute),
        textContent: this.nativeNode.props[attribute],
        owner: this.nativeNode
      }));
    }
  }

  return attributes;
};

XPathReact.prototype.getParent = function () {
  throw new Error("Parent of nodes are not available!");
};

XPathReact.prototype.getOwnerDocument = function () {
  return this;
};

XPathReact.prototype.getElementById = function (id) {
  if (typeof this.nativeNode === "string") {
    return null;
  }

  if (this.nativeNode.props.id === id) {
    return this;
  }

  return this.getChildNodes().map(function (child) {
    return child.getElementById(id);
  }).find(function (node) {
    return node;
  });
};

XPathReact.prototype.toString = function () {
  var name;

  if (typeof this.nativeNode === "string") {
    name = "text(" + this.nativeNode + ")";
  } else {
    name = this.nativeNode.type;
  }

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

module.exports = XPathReact;
