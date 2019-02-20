import { IAdapter } from "xpath-evaluator";

import React from "react";

export interface IAbstractDocumentElement extends IAdapter<React.ReactElement | string> {
  getId(): string
  getChildNodes(): IAbstractDocumentElement[];
  getFollowingSiblings(): IAbstractDocumentElement[];
  getPrecedingSiblings(): IAbstractDocumentElement[];
  getAttributes(): IAbstractDocumentElement[];
  getParent(): IAbstractDocumentElement;
  getOwnerDocument(): IAbstractDocumentElement;
  getElementById(id: string): IAbstractDocumentElement | null;
	compareDocumentPosition(node: IAbstractDocumentElement): -1 | 0 | 1;
}

export interface IReactElementAdapter extends IAdapter<React.ReactElement | string> {
  getId(): string
  getChildNodes(): IReactElementAdapter[];
  getFollowingSiblings(): IReactElementAdapter[];
  getPrecedingSiblings(): IReactElementAdapter[];
  getAttributes(): IReactElementAdapter[];
  getParent(): IAbstractDocumentElement | IReactElementAdapter;
  getOwnerDocument(): IAbstractDocumentElement;
  getElementById(id: string): IReactElementAdapter | null;
	compareDocumentPosition(node: IAbstractDocumentElement | IReactElementAdapter): -1 | 0 | 1;
}
