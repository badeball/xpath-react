import { isValidElement } from "react";

import { DOCUMENT_NODE } from "xpath-evaluator";

import ReactElement from "./react_element";

import compareDocumentPosition from "./compare_document_position";

export default class ReactDocument {
  constructor(nativeNode) {
    if (!isValidElement(nativeNode)) {
      throw new Error("Expected a React element");
    }

    this.elementNode = new ReactElement(nativeNode, this, 0);
  }

  getId() {
    return "0";
  }

  isEqual(node) {
    return this.getId() === node.getId();
  }

  getNativeNode() {
    throw new Error("Accessing the abstract document node is not allowed");
  }

  asString() {
    return this.elementNode.asString();
  }

  asNumber() {
    return +this.asString();
  }

  getNodeType() {
    return DOCUMENT_NODE;
  }

  getChildNodes() {
    return [this.elementNode];
  }

  getFollowingSiblings() {
    return undefined;
  }

  getPrecedingSiblings() {
    return undefined;
  }

  getName() {
    return undefined;
  }

  getAttributes() {
    return undefined;
  }

  getOwnerDocument() {
    return undefined;
  }

  getElementById(id) {
    /* eslint-disable no-underscore-dangle */
    return this.elementNode._getElementById(id);
    /* eslint-enable no-underscore-dangle */
  }

  toString() {
    return "Node<document>";
  }

  compareDocumentPosition(other) {
    return compareDocumentPosition(this, other);
  }
}
