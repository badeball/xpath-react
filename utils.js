"use strict";

var TestUtils = require("react-dom/test-utils");

var ShallowRenderer = require("react-test-renderer/shallow");

var XPath = require("./lib");

module.exports = {
  render: function (component) {
    var renderer = new ShallowRenderer();
    renderer.render(component);
    return renderer.getRenderOutput();
  },

  find: function (element, expression) {
    var result = XPath.evaluate(
      expression,
      element,
      null,
      XPath.XPathResult.ANY_TYPE, null);

    switch (result.resultType) {
      case XPath.XPathResult.UNORDERED_NODE_ITERATOR_TYPE:
        return result.iterateNext();

      case XPath.XPathResult.STRING_TYPE:
        return result.stringValue;

      case XPath.XPathResult.NUMBER_TYPE:
        return result.numberValue;

      case XPath.XPathResult.BOOLEAN_TYPE:
        return result.booleanValue;
    }
  },

  Simulate: Object.keys(TestUtils.Simulate).reduce(function (simulate, event) {
    simulate[event] = function (element, expression, eventData) {
      if (typeof expression === "string") {
        element = module.exports.find(element, expression);
      } else {
        eventData = expression;
      }

      var eventName = "on" + event.charAt(0).toUpperCase() + event.slice(1);

      if (element.props[eventName]) {
        element.props[eventName](eventData);
      } else {
        throw new Error("No event handler for " + eventName);
      }
    };

    return simulate;
  }, {})
};
