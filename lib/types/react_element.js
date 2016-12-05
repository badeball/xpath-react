"use strict";

var React = require("react");
var ReactInternals = require("../ReactInternals");
var XPathEvaluator = require("xpath-evaluator");

var XPathReactAttribute = require("./react_attribute");
var XPathReactText = require("./react_text");


function XPathReactElement (nativeNode, parent, nChild) {
  this.nativeNode = nativeNode;
  this.parent = parent;
  this.nChild = nChild;
}

XPathReactElement.prototype.getId = function () {
  return this.getParent().getId() + "." + this.nChild;
};

XPathReactElement.prototype.isEqual = function (node) {
  return this.getId() === node.getId();
};

XPathReactElement.prototype.getNativeNode = function () {
  if (ReactInternals.isCompositeComponent(this.nativeNode)) {
    return this.nativeNode._reactInternalInstance && this.nativeNode._reactInternalInstance._currentElement;
  } else {
    return this.nativeNode;
  }
};

XPathReactElement.prototype.asString = function () {
  var textContent = "";

  this.getChildNodes().forEach(function (child) {
    if (child.getNodeType() === XPathEvaluator.Node.ELEMENT_NODE || child.getNodeType() === XPathEvaluator.Node.TEXT_NODE) {
      textContent = textContent + child.asString();
    }
  });

  return textContent;
};

XPathReactElement.prototype.asNumber = function () {
  return +this.asString();
};

XPathReactElement.prototype.getNodeType = function () {
  return XPathEvaluator.Node.ELEMENT_NODE;
};

XPathReactElement.prototype.getParent = function () {
  return this.parent;
};

XPathReactElement.prototype.getChildNodes = function () {
  var children = [];
  if (ReactInternals.isDOMComponent(this.nativeNode)) {
    var domInternalInstance = ReactInternals.getInternalInstance(this.nativeNode);
    if (domInternalInstance._renderedChildren) {
      var renderedChildren = domInternalInstance._renderedChildren;
  
      for (var key in domInternalInstance._renderedChildren) {
        if (!renderedChildren.hasOwnProperty(key) || !renderedChildren[key]) {
          continue;
        }

        if (renderedChildren[key]._stringText) {
          children.push(new XPathReactText(renderedChildren[key]._stringText, this, children.length));
        } else {
          children.push(new XPathReactElement(renderedChildren[key].getPublicInstance(), this, children.length));
        }
      }

    } else if (domInternalInstance._currentElement.props && domInternalInstance._currentElement.props.children) {
      React.Children.forEach(domInternalInstance._currentElement.props.children, function(child) {
        children.push(new XPathReactText(child, this, children.length));
      }.bind(this));

    }

  } else if (ReactInternals.isCompositeComponent(this.nativeNode)) {
    var internalInstance = ReactInternals.getInternalInstance(this.nativeNode);
    if (internalInstance._renderedComponent) {
      children.push(new XPathReactElement(internalInstance._renderedComponent.getPublicInstance(), this, 0));
    }

  } else if (this.nativeNode.props && this.nativeNode.props.children) {
    React.Children.forEach(this.nativeNode.props.children, function(child) {
      if (typeof child === "string") {
        children.push(new XPathReactText(child, this, children.length));
      } else {
        children.push(new XPathReactElement(child, this, children.length));
      }
    }.bind(this));
  } 

  return children;
};

XPathReactElement.prototype.getFollowingSiblings = function () {
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

XPathReactElement.prototype.getPrecedingSiblings = function () {
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

XPathReactElement.prototype.getName = function () {
  var el = this.getNativeNode();
  if (ReactInternals.isDOMComponent(el)) {
    return el.localName;
  } else if (typeof el.type === "function") {
    return el.type.displayName || el.type.name;
  } else if (typeof el.type === "string") {
    return el.type;
  }
};

XPathReactElement.prototype.getAttributes = function () {
  var props;
  var attributes = [];
  var i = 0;

  if (ReactInternals.isDOMComponent(this.nativeNode)) {
    var domInternalInstance = ReactInternals.getInternalInstance(this.nativeNode);
    props = domInternalInstance._currentElement.props;

  } else if (ReactInternals.isCompositeComponent(this.nativeNode)) {
    var internalInstance = ReactInternals.getInternalInstance(this.nativeNode);
    var key = internalInstance && internalInstance._currentElement && internalInstance._currentElement.key;
    if (key) {
      attributes.push(new XPathReactAttribute("key", key, this, i++));
    }
    props = internalInstance._currentElement.props;

  } else {
    props = this.nativeNode.props;
  }

  if (!props) {
    return attributes;
  }

  for (var attribute in props) {
    if (props.hasOwnProperty(attribute) && attribute !== "children") {
      attributes.push(new XPathReactAttribute(attribute, props[attribute], this, i++));
    }
  }

  return attributes;
};

XPathReactElement.prototype.getOwnerDocument = function () {
  if (this.getParent().getNodeType() === XPathEvaluator.Node.DOCUMENT_NODE) {
    return this.getParent();
  } else {
    return this.getParent().getOwnerDocument();
  }
};

/* eslint-disable no-underscore-dangle */
XPathReactElement.prototype._getElementById = function (id) {
  var props = this.nativeNode.props;
  if (props && props.id === id) {
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

XPathReactElement.prototype.toString = function () {
  var name = this.getName();
  var props = this.nativeNode.props;
  if (props) {
    if (props.className) {
      name = name + "." + props.className.split(/\s+/g).join(".");
    }

    if (props.id) {
      name = name + "#" + props.id;
    }
  }

  return "Node<" + name + ">";
};

module.exports = XPathReactElement;
