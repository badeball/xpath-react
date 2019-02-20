import { DOCUMENT_NODE, ELEMENT_NODE, TEXT_NODE } from "xpath-evaluator";

import { IReactElementAdapter } from "./react_element_adapter";

import ReactAttribute from "./react_attribute";

import ReactText from "./react_text";

import compareDocumentPosition from "./compare_document_position";

export default class ReactElement implements IReactElementAdapter {
  constructor(
    private readonly nativeNode: React.ReactElement,
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
    return this.nativeNode;
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
    return ELEMENT_NODE;
  }

  getParent() {
    return this.parent;
  }

  getChildNodes(): IReactElementAdapter[] {
    if (this.nativeNode == null) {
      return [];
    }

    if (typeof this.nativeNode === "string") {
      return [];
    }

    if (typeof this.nativeNode === "number") {
      return [];
    }

    if (typeof this.nativeNode === "boolean") {
      return [];
    }

    if (!this.nativeNode.props || !this.nativeNode.props.children) {
      return [];
    }

    const children: IReactElementAdapter[] = [];

    const addChild = (child: React.ReactElement, i: number) => {
      if (child) {
        if (typeof child === "string") {
          children.push(new ReactText(child, this, i));
        } else {
          children.push(new ReactElement(child, this, i));
        }
      }
    };

    function flatten<T> (array: T[]): T[] {
      return array.reduce(function(memo, el) {
        const items: T[] = Array.isArray(el) ? flatten(el) : [el];
        return memo.concat(items);
      }, [] as T[]);
    }

    const flattenedChildren = flatten([this.nativeNode.props.children]);

    for (let i = 0; i < flattenedChildren.length; i++) {
      addChild(flattenedChildren[i], i);
    }

    return children;
  }

  getFollowingSiblings() {
    const followingSiblings = [];

    const siblings = this.getParent().getChildNodes();

    const thisSiblingIndex = siblings.findIndex((sibling) => {
      return sibling.isEqual(this);
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
      return sibling.isEqual(this);
    });

    for (let i = 0; i < thisSiblingIndex; i++) {
      precedingSiblings.push(siblings[i]);
    }

    return precedingSiblings;
  }

  getName() {
    if (typeof this.nativeNode.type === "string") {
      return this.nativeNode.type;
    } else if (typeof this.nativeNode.type === "function") {
      return (this.nativeNode.type as any).displayName || this.nativeNode.type.name;
    }

    throw Error("Unable to determine Component's name");
  }

  getAttributes() {
    if (!this.nativeNode.props) {
      return [];
    }

    const attributes: ReactAttribute[] = [];

    let i = 0;

    for (let attribute in this.nativeNode.props) {
      if (attribute !== "children") {
        attributes.push(new ReactAttribute(attribute, this.nativeNode.props[attribute], this, i++));
      }
    }

    return attributes;
  }

  getOwnerDocument() {
    if (this.getParent().getNodeType() === DOCUMENT_NODE) {
      return this.getParent();
    } else {
      return this.getParent().getOwnerDocument();
    }
  }

  getElementById(id: string) {
    return this.getOwnerDocument().getElementById(id);
  }

  _getElementById(id: string): ReactElement | null {
    if (this.nativeNode.props && this.nativeNode.props.id === id) {
      return this;
    } else {
      const children = this.getChildNodes();

      for (let child of children) {
        if (child instanceof ReactElement) {
          const elementWithId = child._getElementById(id);

          if (elementWithId) {
            return elementWithId;
          }
        }
      }

      return null;
    }
  }

  toString() {
    let name = this.getName();

    if (this.nativeNode.props) {
      if (this.nativeNode.props.className) {
        name = name + "." + this.nativeNode.props.className.split(/\s+/g).join(".");
      }

      if (this.nativeNode.props.id) {
        name = name + "#" + this.nativeNode.props.id;
      }
    }

    return "Node<" + name + ">";
  }

  compareDocumentPosition(other: IReactElementAdapter): 1 | 0 | -1 {
    return compareDocumentPosition(this, other);
  }
}
