import XPathEvaluator, { XPathResult } from "xpath-evaluator";

import ReactDocument from "./types/react_document";

var XPath = new XPathEvaluator(ReactDocument);

export function find (element, expression) {
  var result = XPath.evaluate(
    expression,
    element,
    null,
    XPathResult.ANY_TYPE, null);

  switch (result.resultType) {
    case XPathResult.UNORDERED_NODE_ITERATOR_TYPE:
      return result.iterateNext();

    case XPathResult.STRING_TYPE:
      return result.stringValue;

    case XPathResult.NUMBER_TYPE:
      return result.numberValue;

    case XPathResult.BOOLEAN_TYPE:
      return result.booleanValue;
  }
}

export function evaluate (expression, context, nsResolver, type) {
  return XPath.evaluate(expression, context, nsResolver, type);
}

export function createExpression (expression, nsResolver) {
  return XPath.createExpression(expression, nsResolver);
}

export function createNSResolver (nodeResolver) {
  return XPath.createNSResolver(nodeResolver);
}

export { XPathResult };
