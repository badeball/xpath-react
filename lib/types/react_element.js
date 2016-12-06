"use strict";

var ReactInternals = require("../ReactInternals");
var XPathEvaluator = require("xpath-evaluator");

var XPathReactAttribute = require("./react_attribute");
var XPathReactText = require("./react_text");

function getChildElementNode(child) {
  var pubInst = child.getPublicInstance();
  if (pubInst) {
    if (ReactInternals.isDOMComponent(pubInst) && !ReactInternals.getDOMInternalInstance(pubInst)) {
      // workaround for react 0.14 not having link from dom node to react internal instance
      return {
        _domNode: pubInst,
        _reactInternalInstance: child
      };
    } else {
      return pubInst;
    }
  } else {
    return child._currentElement;
  }
}

function XPathReactElement(nativeNode, parent, nChild) {
  this.nativeNode = nativeNode;
  this.parent = parent;
  this.nChild = nChild;
}

XPathReactElement.prototype.getId = function() {
  return this.getParent().getId() + "." + this.nChild;
};

XPathReactElement.prototype.isEqual = function(node) {
  return this.getId() === node.getId();
};

XPathReactElement.prototype.getNativeNode = function() {
  if (ReactInternals.isCompositeComponent(this.nativeNode)) {
    return this.nativeNode._reactInternalInstance._currentElement;
  } else {
    return this.nativeNode._domNode || this.nativeNode;
  }
};

XPathReactElement.prototype.asString = function() {
  var textContent = "";

  this.getChildNodes().forEach(function(child) {
    if (child.getNodeType() === XPathEvaluator.Node.ELEMENT_NODE || child.getNodeType() === XPathEvaluator.Node.TEXT_NODE) {
      textContent = textContent + child.asString();
    }
  });

  return textContent;
};

XPathReactElement.prototype.asNumber = function() {
  return +this.asString();
};

XPathReactElement.prototype.getNodeType = function() {
  return XPathEvaluator.Node.ELEMENT_NODE;
};

XPathReactElement.prototype.getParent = function() {
  return this.parent;
};

XPathReactElement.prototype.getChildNodes = function() {
  var children = [];
  if (ReactInternals.isDOMComponent(this.getNativeNode())) {
    var domInternalInstance = ReactInternals.getDOMInternalInstance(this.nativeNode) || this.nativeNode._reactInternalInstance;
    if (domInternalInstance._renderedChildren) {
      var renderedChildren = domInternalInstance._renderedChildren;
  
      for (var key in domInternalInstance._renderedChildren) {
        if (!renderedChildren.hasOwnProperty(key) || !renderedChildren[key]) {
          continue;
        }

        if (renderedChildren[key]._stringText) {
          children.push(new XPathReactText(renderedChildren[key]._stringText, this, children.length));
        } else {
          children.push(new XPathReactElement(getChildElementNode(renderedChildren[key]), this, children.length));
        }
      }

    } else if (domInternalInstance._currentElement.props && domInternalInstance._currentElement.props.children) {
      ReactInternals.forEachChild(domInternalInstance._currentElement.props.children, function(child) {
        children.push(new XPathReactText(child, this, children.length));
      }, this);

    }

  } else if (ReactInternals.isCompositeComponent(this.nativeNode)) {
    var internalInstance = this.nativeNode._reactInternalInstance;
    if (internalInstance._renderedComponent) {
      children.push(new XPathReactElement(getChildElementNode(internalInstance._renderedComponent), this, 0));
    }

  } else if (this.nativeNode.props && this.nativeNode.props.children) {
    ReactInternals.forEachChild(this.nativeNode.props.children, function(child) {
      if (typeof child === "string") {
        children.push(new XPathReactText(child, this, children.length));
      } else {
        children.push(new XPathReactElement(child, this, children.length));
      }
    }, this);
  } 

  return children;
};

XPathReactElement.prototype.getFollowingSiblings = function() {
  var followingSiblings = [];

  var siblings = this.getParent().getChildNodes();

  var thisSiblingIndex = siblings.findIndex(function(sibling) {
    return sibling.isEqual(this);
  }.bind(this));

  for (var i = thisSiblingIndex + 1; i < siblings.length; i++) {
    followingSiblings.push(siblings[i]);
  }

  return followingSiblings;
};

XPathReactElement.prototype.getPrecedingSiblings = function() {
  var precedingSiblings = [];

  var siblings = this.getParent().getChildNodes();

  var thisSiblingIndex = siblings.findIndex(function(sibling) {
    return sibling.isEqual(this);
  }.bind(this));

  for (var i = 0; i < thisSiblingIndex; i++) {
    precedingSiblings.push(siblings[i]);
  }

  return precedingSiblings;
};

XPathReactElement.prototype.getName = function() {
  var el = this.getNativeNode();
  if (ReactInternals.isDOMComponent(el)) {
    return el.localName;
  } else if (typeof el.type === "function") {
    return el.type.displayName || el.type.name;
  } else if (typeof el.type === "string") {
    return el.type;
  }
};

XPathReactElement.prototype.getAttributes = function() {
  var props;
  var attributes = [];
  var i = 0;

  if (ReactInternals.isDOMComponent(this.getNativeNode())) {
    var domInternalInstance = ReactInternals.getDOMInternalInstance(this.nativeNode) || this.nativeNode._reactInternalInstance;
    props = domInternalInstance._currentElement && domInternalInstance._currentElement.props;

  } else if (ReactInternals.isCompositeComponent(this.nativeNode)) {
    var internalInstance = this.nativeNode._reactInternalInstance;
    var key = internalInstance._currentElement && internalInstance._currentElement.key;
    if (key) {
      attributes.push(new XPathReactAttribute("key", key, this, i++));
    }
    props = internalInstance._currentElement && internalInstance._currentElement.props;

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

XPathReactElement.prototype.getOwnerDocument = function() {
  if (this.getParent().getNodeType() === XPathEvaluator.Node.DOCUMENT_NODE) {
    return this.getParent();
  } else {
    return this.getParent().getOwnerDocument();
  }
};

/* eslint-disable no-underscore-dangle */
XPathReactElement.prototype._getElementById = function(id) {
  var props;
  if (ReactInternals.isDOMComponent(this.getNativeNode())) {
    var domInternalInstance = ReactInternals.getDOMInternalInstance(this.nativeNode) || this.nativeNode._reactInternalInstance;
    props = domInternalInstance._currentElement && domInternalInstance._currentElement.props;

  } else if (ReactInternals.isCompositeComponent(this.nativeNode)) {
    var internalInstance = this.nativeNode._reactInternalInstance;
    props = internalInstance._currentElement && internalInstance._currentElement.props;

  } else {
    props = this.nativeNode.props;
  }

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

XPathReactElement.prototype.toString = function() {
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
