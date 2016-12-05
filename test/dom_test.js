"use strict";

var Assert = require("assert");

var XPathUtils = require("../utils");

var Helper = require("./helper");

var React = require("react");
var ReactDom = require('react-dom');
var ReactTestUtils = require("react-addons-test-utils");

var jsdom = require('jsdom');

global.document = jsdom.jsdom('');
global.window = document.defaultView;
global.navigator = window.navigator;

var A = React.createClass({
  render: function () {
    return <div>{ this.props.content }</div>;
  }
});

var B = React.createClass({
  render: function () {
    return <div>label: <input type='text' name='test'></input></div>;
  }
});

describe("XPathReact", function () {
  describe("Dom", function () {
    it("should find B in rendered component", function () {
      
      var div = document.createElement("div");
      document.body.appendChild(div);

      var el = React.createElement(A, { content: React.createElement(B) });
      ReactDom.render(el, div);
      
      var p = XPathUtils.find(XPathUtils.findReactRoot(), ".//B");
      Assert.equal(p.type, B);
      var p2 = XPathUtils.find(XPathUtils.findReactRoot(), './/input[@type="text"]');
      Assert.equal(p2.tagName, 'INPUT');
      Assert.equal(p2.type, 'text');
      Assert.equal(p2.name, 'test');
    });

  });
});
