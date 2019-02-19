/* eslint-env node */

/* eslint-disable no-loop-func */

import assert from "assert";

import ShallowRenderer from "react-test-renderer/shallow";

import { evaluate, XPathResult } from "../lib";

export function shallow (component) {
  const renderer = new ShallowRenderer();
  renderer.render(component);
  return renderer.getRenderOutput();
}

export function assertEvaluatesToNodeSet (contextNode, expression, nodes) {
  const result = evaluate(expression, contextNode, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE);

  let match;

  for (let i = 0; i < result.snapshotLength; i++) {
    if (result.snapshotItem(i).type) {
      match = nodes[i].match(/(\w+)(?:#([^.]+))?(?:\.([\w\d-]+))?/);

      const tagName = match[1];
      const idName = match[2];
      const className = match[3];

      if (tagName) {
        assert.equal(result.snapshotItem(i).type, tagName);
      }

      if (idName) {
        assert.equal(result.snapshotItem(i).props.id, idName);
      }

      if (className) {
        assert.equal(result.snapshotItem(i).props.className, className);
      }
    } else {
      match = nodes[i].match(/^(\w+)(?:\(([^\)]*)\))?$/);

      const nodeType = match[1];
      const nodeValue = match[2];

      if (nodeType !== "text") {
        throw new Error("Unable to make assertions about anything other than text nodes");
      }

      assert.equal(result.snapshotItem(i), nodeValue);
    }
  }

  assert.equal(result.snapshotLength, nodes.length);
}

export function assertEvaluatesToValue (contextNode, expression, value) {
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
