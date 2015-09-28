/* eslint-env mocha, node */

"use strict";

var Chai = require("chai");

Chai.should();

Chai.use(require("sinon-chai"));
Chai.use(require("chai-xpath-react"));

var Sinon = require("sinon");

beforeEach(function() {
  this.sinon = Sinon.sandbox.create();
});

afterEach(function(){
  this.sinon.restore();
});

var TestUtils = require("react/addons").addons.TestUtils;

var XPath = require("xpath-react/register");

var events = [
  "click",
  "blur",
  "focus"
  // etc ..
];

module.exports = {
  render: function (reactElement) {
    var renderer = TestUtils.createRenderer();
    renderer.render(reactElement);
    return renderer.getRenderOutput();
  },

  find: function (element, expression) {
    return XPath.evaluate(
      expression,
      element,
      null,
      XPath.XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  },

  Simulate: events.reduce(function (simulate, event) {
    simulate[event] = function (element, eventData) {
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
