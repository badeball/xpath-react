import { DOCUMENT_NODE, ELEMENT_NODE, TEXT_NODE } from "xpath-evaluator";

import wrapNativeElements from "./wrap_native_elements";

import compareDocumentPosition from "./compare_document_position";

export default class ReactDocument {
  constructor(nativeChildOrChildren) {
    this.children = wrapNativeElements(this, nativeChildOrChildren);
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
    let textContent = "";

    this.getChildNodes().forEach(function (child) {
      if (child.getNodeType() === ELEMENT_NODE ||
          child.getNodeType() === TEXT_NODE) {
        textContent = textContent + child.asString();
      }
    });

    return textContent;
  }

  asNumber() {
    return +this.asString();
  }

  getNodeType() {
    return DOCUMENT_NODE;
  }

  getChildNodes() {
    return this.children;
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
    return this;
  }

  getElementById(id) {
    for (let i = 0; i < this.children.length; i++) {
      /* eslint-disable no-underscore-dangle */
      const result = this.children[i]._getElementById(id);
      /* eslint-enable no-underscore-dangle */

      if (result) {
        return result;
      }
    }
  }

  toString() {
    return "Node<document>";
  }

  compareDocumentPosition(other) {
    return compareDocumentPosition(this, other);
  }
}
