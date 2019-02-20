import { isValidElement } from "react";

import { DOCUMENT_NODE } from "xpath-evaluator";

import { IAbstractDocumentElement, IReactElementAdapter } from "./react_element_adapter";

import ReactElement from "./react_element";

import compareDocumentPosition from "./compare_document_position";

export default class ReactDocument implements IAbstractDocumentElement {
  private readonly elementNode: ReactElement;

  constructor(nativeNode: React.ReactElement) {
    if (!isValidElement(nativeNode)) {
      throw new Error("Expected a React element");
    }

    this.elementNode = new ReactElement(nativeNode, this, 0);
  }

  getId() {
    return "0";
  }

  isEqual(node: IReactElementAdapter) {
    return this.getId() === node.getId();
  }

  getNativeNode(): React.ReactElement {
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

  getParent(): IReactElementAdapter {
    throw new Error("Unexpcted call to ReactDocument.getParent()");
  }

  getFollowingSiblings(): IReactElementAdapter[] {
    return [];
  }

  getPrecedingSiblings(): IReactElementAdapter[] {
    return [];
  }

  getName(): string {
    return undefined as any as string;
  }

  getAttributes(): IReactElementAdapter[] {
    return [];
  }

  getOwnerDocument(): IAbstractDocumentElement {
    return this;
  }

  getElementById(id: string) {
    return this.elementNode._getElementById(id);
  }

  toString() {
    return "Node<document>";
  }

  compareDocumentPosition(other: IReactElementAdapter): 1 | 0 | -1 {
    return compareDocumentPosition(this, other);
  }
}
