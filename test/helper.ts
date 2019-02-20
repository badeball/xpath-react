import assert from "assert";

import { createRenderer } from "react-test-renderer/shallow";

import { evaluate, XPathResult } from "../lib";

export function shallow (component: React.ReactElement) {
  const renderer = createRenderer();
  renderer.render(component);
  return renderer.getRenderOutput();
}

export function assertEvaluatesToNodeSet (contextNode: React.ReactElement, expression: string, nodes: string[]) {
  const result = evaluate(expression, contextNode, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE);

  let match;

  for (let i = 0; i < result.snapshotLength; i++) {
    const item = result.snapshotItem(i);

    if (typeof item !== "string") {
      match = nodes[i].match(/(\w+)(?:#([^.]+))?(?:\.([\w\d-]+))?/);

      const tagName = match![1],
            idName = match![2],
            className = match![3];

      if (tagName) {
        assert.equal(item!.type, tagName);
      }

      if (idName) {
        assert.equal(item!.props.id, idName);
      }

      if (className) {
        assert.equal(item!.props.className, className);
      }
    } else {
      match = nodes[i].match(/^(\w+)(?:\(([^\)]*)\))?$/);

      const nodeType = match![1],
            nodeValue = match![2];

      if (nodeType !== "text") {
        throw new Error("Unable to make assertions about anything other than text nodes");
      }

      assert.equal(item, nodeValue);
    }
  }

  assert.equal(result.snapshotLength, nodes.length);
}

export function assertEvaluatesToValue (contextNode: React.ReactElement, expression: string, value: number | string | boolean) {
  const result = evaluate(expression, contextNode, null, XPathResult.ANY_TYPE);

  switch (result.resultType) {
    case XPathResult.NUMBER_TYPE:
      assert.equal(value, result.numberValue);
      break;

    case XPathResult.STRING_TYPE:
      assert.equal(value, result.stringValue);
      break;

    case XPathResult.BOOLEAN_TYPE:
      assert.equal(value, result.booleanValue);
      break;

    default:
      throw new Error("Unknown result type " + result.resultType);
  }
}
