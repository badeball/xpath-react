"use strict";

var domReactInternalInstancePropertyKey = null;

// from react/lib/ReactElementSymbol.js
var REACT_ELEMENT_TYPE = typeof Symbol === "function" && Symbol.for && Symbol.for("react.element") || 0xeac7;
// ----------

// from react/lib/ReactElement.js
function isValidElement(inst) {
  return typeof inst === "object" && inst !== null && inst.$$typeof === REACT_ELEMENT_TYPE;
}
// ----------

// from react-dom/lib/ReactTestUtils.js
function isDOMComponent(inst) {
  return !!(inst && inst.nodeType === 1 && inst.tagName);
}

function isCompositeComponent(inst) {
  if (isDOMComponent(inst)) {
    return false;
  }
  return inst != null && typeof inst.render === "function" && typeof inst.setState === "function";
}
// ----------

// deduced from browser and test data and react-dom/lib/ReactDOMComponentTree.js
function getDOMInternalInstance(inst) {
  if (isDOMComponent(inst)) {
    if (!domReactInternalInstancePropertyKey) {
      for (var key in inst) {
        if (key.startsWith("__reactInternalInstance$")) {
          domReactInternalInstancePropertyKey = key;
          break;
        }
      }
    }
    return inst[domReactInternalInstancePropertyKey];
  }
}

function findTopLevelCompositeComponentAtDOMNode(dom) {
  if (!dom) {
    return null;
  }

  var inst = getDOMInternalInstance(dom);
  var containerInfo = inst && (inst._nativeContainerInfo || inst._hostContainerInfo);
  return containerInfo && containerInfo._topLevelWrapper._renderedComponent.getPublicInstance();
}
// ----------

// from react/lib/getIteratorFn.js
var ITERATOR_SYMBOL = typeof Symbol === "function" && Symbol.iterator;
var FAUX_ITERATOR_SYMBOL = "@@iterator"; // Before Symbol spec.

function getIteratorFn(maybeIterable) {
  var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
  if (typeof iteratorFn === "function") {
    return iteratorFn;
  }
}
// ----------

// from react/lib/traverseAllChildren.js
function forEachChild(children, callback, context) {
  var type = typeof children;

  if (type === "undefined" || type === "boolean") {
    // All of the above are perceived as null.
    children = null;
  }

  if (children === null || type === "string" || type === "number" ||
  // The following is inlined from ReactElement. This means we can optimize
  // some checks. React Fiber also inlines this logic for similar purposes.
  type === "object" && children.$$typeof === REACT_ELEMENT_TYPE) {
    callback.call(context, children);
    return;
  }

  var child;

  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      child = children[i];
      forEachChild(child, callback, context);
    }
  } else {
    var iteratorFn = getIteratorFn(children);
    if (iteratorFn) {
      var iterator = iteratorFn.call(children);
      var step;
      if (iteratorFn !== children.entries) {
        while (!(step = iterator.next()).done) {
          child = step.value;
          forEachChild(child, callback, context);
        }
      } else {
        // Iterator will provide entry [k,v] tuples rather than values.
        while (!(step = iterator.next()).done) {
          var entry = step.value;
          if (entry) {
            child = entry[1];
            forEachChild(child, callback, context);
          }
        }
      }
    }
  }
}
// ----------

module.exports = {
  isValidElement: isValidElement,
  isDOMComponent: isDOMComponent,
  isCompositeComponent: isCompositeComponent,
  getDOMInternalInstance: getDOMInternalInstance,
  findTopLevelCompositeComponentAtDOMNode: findTopLevelCompositeComponentAtDOMNode,
  forEachChild: forEachChild
};
