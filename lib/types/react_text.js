import { TEXT_NODE } from "xpath-evaluator";

import compareDocumentPosition from "./compare_document_position";

export default class ReactText {
  constructor (textContent, parent, nChild) {
    this.textContent = textContent;
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
    return this.textContent;
  }

  asString() {
    return this.textContent;
  }

  asNumber() {
    return +this.asString();
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
    return "Node<text(" + this.textContent + ")>";
  }

  compareDocumentPosition(other) {
    return compareDocumentPosition(this, other);
  }
}
