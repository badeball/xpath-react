import { isValidElement } from "react";

import { DOCUMENT_NODE } from "xpath-evaluator";

import ReactElement from "./react_element";

import compareDocumentPosition from "./compare_document_position";

function ReactDocument (nativeNode) {
  if (!isValidElement(nativeNode)) {
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
  return DOCUMENT_NODE;
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
  return this.elementNode._getElementById(id);
};

ReactDocument.prototype.toString = function () {
  return "Node<document>";
};

ReactDocument.prototype.compareDocumentPosition = function (other) {
  return compareDocumentPosition(this, other);
};

export default ReactDocument;
