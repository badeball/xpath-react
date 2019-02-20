import XPathEvaluator, { XPathResult, XPathResultType } from "xpath-evaluator";

import ReactDocument from "./types/react_document";

const XPath = new XPathEvaluator<React.ReactElement | string>(ReactDocument);

export function find (element: React.ReactElement | string, expression: string) {
  const result = XPath.evaluate(
    expression,
    element,
    null,
    XPathResult.ANY_TYPE);

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

export function evaluate (
  expression: string,
  context: React.ReactElement | string,
  nsResolver: XPathNSResolver | ((prefix: string) => string | null) | null,
  type: XPathResultType
) {
  return XPath.evaluate(expression, context, nsResolver, type);
}

export function createExpression (expression: string, nsResolver: XPathNSResolver) {
  return XPath.createExpression(expression, nsResolver);
}

export function createNSResolver (nodeResolver?: Node) {
  return XPath.createNSResolver(nodeResolver)
}

export { XPathResult };
