import { TEXT_NODE } from "xpath-evaluator";

import { IReactElementAdapter } from "./react_element_adapter";

import compareDocumentPosition from "./compare_document_position";

export default class ReactText implements IReactElementAdapter {
  constructor (
    private readonly textContent: string,
    private readonly parent: IReactElementAdapter,
    private readonly nChild: number
  ) { }

  getId() {
    return this.getParent().getId() + "." + this.nChild;
  }

  isEqual(node: IReactElementAdapter) {
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

  getChildNodes(): IReactElementAdapter[] {
    return [];
    throw new Error("Unexpcted call to ReactText.getChildNodes()");
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

  getName(): string {
    return undefined as any as string;
    throw new Error("Unexpcted call to ReactText.getName()");
  }

  getAttributes(): IReactElementAdapter[] {
    return [];
    throw new Error("Unexpcted call to ReactText.getAttributes()");
  }

  getOwnerDocument() {
    return this.getParent().getOwnerDocument();
  }

  getElementById(id: string) {
    return this.getOwnerDocument().getElementById(id);
  }

  toString() {
    return "Node<text(" + this.textContent + ")>";
  }

  compareDocumentPosition(other: IReactElementAdapter): 1 | 0 | -1 {
    return compareDocumentPosition(this, other);
  }
}
