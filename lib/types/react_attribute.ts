import { ATTRIBUTE_NODE } from "xpath-evaluator";

import { IReactElementAdapter } from "./react_element_adapter";

import compareDocumentPosition from "./compare_document_position";

export default class ReactAttribute implements IReactElementAdapter {
  constructor(
    private readonly attributeName: string,
    private readonly textContent: string,
    private readonly parent: IReactElementAdapter,
    private readonly nChild: number
  ) { }

  getId(): string {
    return this.getParent().getId() + "." + this.nChild;
  }

  isEqual(node: IReactElementAdapter): boolean {
    return this.getId() === node.getId();
  }

  asString(): string {
    return this.textContent;
  }

  asNumber(): number {
    return +this.asString();
  }

  getNodeType(): number {
    return ATTRIBUTE_NODE;
  }

  getParent(): IReactElementAdapter {
    return this.parent;
  }

  getNativeNode(): React.ReactElement {
    throw new Error("Unexpcted call to ReactAttribute.getNativeNode()");
  }

  getElementById(id: string): IReactElementAdapter | null {
    throw new Error("Unexpcted call to ReactAttribute.getElementById()");
  }

  getChildNodes(): IReactElementAdapter[] {
    throw new Error("Unexpcted call to ReactAttribute.getChildNodes()");
  }

  getFollowingSiblings(): IReactElementAdapter[] {
    throw new Error("Unexpcted call to ReactAttribute.getFollowingSiblings()");
  }

  getPrecedingSiblings(): IReactElementAdapter[] {
    throw new Error("Unexpcted call to ReactAttribute.getPrecedingSiblings()");
  }

  getAttributes(): IReactElementAdapter[] {
    throw new Error("Unexpcted call to ReactAttribute.getAttributes()");
  }

  getName(): string {
    switch (this.attributeName) {
      case "className":
        return "class";
      case "htmlFor":
        return "for";
      default:
        return this.attributeName;
    }
  }

  getOwnerDocument(): IReactElementAdapter {
    return this.getParent().getOwnerDocument();
  }

  toString(): string {
    return "Node<" + this.attributeName + ">";
  }

  compareDocumentPosition(other: IReactElementAdapter): 1 | 0 | -1 {
    return compareDocumentPosition(this, other);
  }
}
