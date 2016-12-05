"use strict";

var domReactInternalInstancePropertyKey = null;

var REACT_ELEMENT_TYPE = typeof Symbol === "function" && Symbol["for"] && Symbol["for"]("react.element") || 0xeac7;

function isValidElement(object) {
  return typeof object === "object" && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
}

function isDOMComponent(inst) {
  return !!(inst && inst.nodeType === 1 && inst.tagName);
}

function isCompositeComponent(inst) {
  if (isDOMComponent(inst)) {
    return false;
  }
  return inst != null && typeof inst.render === "function" && typeof inst.setState === "function";
}

function getInternalInstance(inst) {
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
  } else if (isCompositeComponent(inst)) {
    return inst._reactInternalInstance;
  }
}

function findTopLevelCompositeComponentAtDOMNode(dom) {
  var inst = getInternalInstance(dom);
  var containerInfo = inst && (inst._nativeContainerInfo || inst && inst._hostContainerInfo);
  return containerInfo && containerInfo._topLevelWrapper._renderedComponent.getPublicInstance();
}

module.exports = {
  isValidElement: isValidElement,
  isDOMComponent: isDOMComponent,
  isCompositeComponent: isCompositeComponent,
  getInternalInstance: getInternalInstance,
  findTopLevelCompositeComponentAtDOMNode: findTopLevelCompositeComponentAtDOMNode
};
