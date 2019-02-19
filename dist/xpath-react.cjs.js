'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var XPathEvaluator = require('xpath-evaluator');
var XPathEvaluator__default = _interopDefault(XPathEvaluator);
var react = require('react');

function compareDocumentPosition (a, b) {
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
}

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
  return XPathEvaluator.ATTRIBUTE_NODE;
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
  return XPathEvaluator.TEXT_NODE;
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

ReactText.prototype.compareDocumentPosition = function (other) {
  return compareDocumentPosition(this, other);
};

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
    if (child.getNodeType() === XPathEvaluator.ELEMENT_NODE ||
        child.getNodeType() === XPathEvaluator.TEXT_NODE) {
      textContent = textContent + child.asString();
    }
  });

  return textContent;
};

ReactElement.prototype.asNumber = function () {
  return +this.asString();
};

ReactElement.prototype.getNodeType = function () {
  return XPathEvaluator.ELEMENT_NODE;
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
  if (this.getParent().getNodeType() === XPathEvaluator.DOCUMENT_NODE) {
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
      if (children[i].getNodeType() === XPathEvaluator.ELEMENT_NODE) {
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

ReactElement.prototype.compareDocumentPosition = function (other) {
  return compareDocumentPosition(this, other);
};

function ReactDocument (nativeNode) {
  if (!react.isValidElement(nativeNode)) {
    throw new Error("Expected a React element");
  }

  this.elementNode = new ReactElement(nativeNode, this, 0);
}

ReactDocument.prototype.getId = function () {
  return "0";
};

ReactDocument.prototype.isEqual = function (node) {
  return this.getId() === node.getId();
};

ReactDocument.prototype.getNativeNode = function () {
  throw new Error("Accessing the abstract document node is not allowed");
};

ReactDocument.prototype.asString = function () {
  return this.elementNode.asString();
};

ReactDocument.prototype.asNumber = function () {
  return +this.asString();
};

ReactDocument.prototype.getNodeType = function () {
  return XPathEvaluator.DOCUMENT_NODE;
};

ReactDocument.prototype.getChildNodes = function () {
  return [this.elementNode];
};

ReactDocument.prototype.getFollowingSiblings = function () {
  return undefined;
};

ReactDocument.prototype.getPrecedingSiblings = function () {
  return undefined;
};

ReactDocument.prototype.getName = function () {
  return undefined;
};

ReactDocument.prototype.getAttributes = function () {
  return undefined;
};

ReactDocument.prototype.getOwnerDocument = function () {
  return undefined;
};

ReactDocument.prototype.getElementById = function (id) {
  /* eslint-disable no-underscore-dangle */
  return this.elementNode._getElementById(id);
  /* eslint-enable no-underscore-dangle */
};

ReactDocument.prototype.toString = function () {
  return "Node<document>";
};

ReactDocument.prototype.compareDocumentPosition = function (other) {
  return compareDocumentPosition(this, other);
};

var XPath = new XPathEvaluator__default(ReactDocument);

function find (element, expression) {
  var result = XPath.evaluate(
    expression,
    element,
    null,
    XPathEvaluator.XPathResult.ANY_TYPE, null);

  switch (result.resultType) {
    case XPathEvaluator.XPathResult.UNORDERED_NODE_ITERATOR_TYPE:
      return result.iterateNext();

    case XPathEvaluator.XPathResult.STRING_TYPE:
      return result.stringValue;

    case XPathEvaluator.XPathResult.NUMBER_TYPE:
      return result.numberValue;

    case XPathEvaluator.XPathResult.BOOLEAN_TYPE:
      return result.booleanValue;
  }
}

function evaluate (expression, context, nsResolver, type) {
  return XPath.evaluate(expression, context, nsResolver, type);
}

function createExpression (expression, nsResolver) {
  return XPath.createExpression(expression, nsResolver);
}

function createNSResolver (nodeResolver) {
  return XPath.createNSResolver(nodeResolver);
}

Object.defineProperty(exports, 'XPathResult', {
  enumerable: true,
  get: function () {
    return XPathEvaluator.XPathResult;
  }
});
exports.createExpression = createExpression;
exports.createNSResolver = createNSResolver;
exports.evaluate = evaluate;
exports.find = find;
