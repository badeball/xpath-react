import { isValidElement } from "react";

import ReactElement from "./react_element";

import ReactText from "./react_text";

import ReactNumber from "./react_number";

function flatten (array) {
  return array.reduce(function(memo, el) {
    const items = Array.isArray(el) ? flatten(el) : [el];
    return memo.concat(items);
  }, []);
}

function wrapNativeElement (parent, nativeElement, index) {
  if (typeof nativeElement === "string") {
    return new ReactText(nativeElement, parent, index);
  } else if (typeof nativeElement === "number") {
    return new ReactNumber(nativeElement, parent, index);
  } else if (isValidElement(nativeElement)) {
    return new ReactElement(nativeElement, parent, index);
  } else {
    throw new Error("Expected a React element");
  }
}

function notNoopElement (nativeElement) {
  return nativeElement != null && typeof nativeElement !== "boolean";
}

export default function wrapNativeElements (parent, nativeElements) {
  return flatten([nativeElements]).filter(notNoopElement).map(wrapNativeElement.bind(null, parent));
}
