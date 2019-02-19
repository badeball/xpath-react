import { ATTRIBUTE_NODE } from "xpath-evaluator";

import compareDocumentPosition from "./compare_document_position";

export default class ReactAttribute {
  constructor(attributeName, textContent, parent, nChild) {
    this.attributeName = attributeName;
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

  asString() {
    return this.textContent;
  }

  asNumber() {
    return +this.asString();
  }

  getNodeType() {
    return ATTRIBUTE_NODE;
  }

  getParent() {
    return this.parent;
  }

  getChildNodes() {
    return undefined;
  }

  getFollowingSiblings() {
    return undefined;
  }

  getPrecedingSiblings() {
    return undefined;
  }

  getName() {
    switch (this.attributeName) {
      case "className":
        return "class";
      case "htmlFor":
        return "for";
      default:
        return this.attributeName;
    }
  }

  getAttributes() {
    return undefined;
  }

  getOwnerDocument() {
    return this.getParent().getOwnerDocument();
  }

  toString() {
    return "Node<" + this.attributeName + ">";
  }

  compareDocumentPosition(other) {
    return compareDocumentPosition(this, other);
  }
}
