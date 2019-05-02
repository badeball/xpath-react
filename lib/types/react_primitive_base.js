import { TEXT_NODE } from "xpath-evaluator";

import compareDocumentPosition from "./compare_document_position";

export default class ReactPrimitiveBase {
  constructor (nativeNode, parent, nChild) {
    this.nativeNode = nativeNode;
    this.parent = parent;
    this.nChild = nChild;
  }

  getId() {
    return this.getParent().getId() + "." + this.nChild;
  }

  isEqual(node) {
    return this.getId() === node.getId();
  }

  getNativeNode() {
    return this.nativeNode;
  }

  getNodeType() {
    return TEXT_NODE;
  }

  getParent() {
    return this.parent;
  }

  getChildNodes() {
    return undefined;
  }

  getFollowingSiblings() {
    const followingSiblings = [];

    const siblings = this.getParent().getChildNodes();

    const thisSiblingIndex = siblings.findIndex((sibling) => {
      return sibling.getNativeNode() === this.getNativeNode();
    });

    for (let i = thisSiblingIndex + 1; i < siblings.length; i++) {
      followingSiblings.push(siblings[i]);
    }

    return followingSiblings;
  }

  getPrecedingSiblings() {
    const precedingSiblings = [];

    const siblings = this.getParent().getChildNodes();

    const thisSiblingIndex = siblings.findIndex((sibling) => {
      return sibling.getNativeNode() === this.getNativeNode();
    });

    for (let i = 0; i < thisSiblingIndex; i++) {
      precedingSiblings.push(siblings[i]);
    }

    return precedingSiblings;
  }

  getName() {
    return undefined;
  }

  getAttributes() {
    return undefined;
  }

  getOwnerDocument() {
    return this.getParent().getOwnerDocument();
  }

  toString() {
    return "Node<primitive(" + this.nativeNode + ")>";
  }

  compareDocumentPosition(other) {
    return compareDocumentPosition(this, other);
  }
}
