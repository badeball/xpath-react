"use strict";

var Assert = require("assert");

var XPathUtils = require("../utils");

var React = require("react");
var ReactDom = require("react-dom");

var jsdom = require("jsdom");

function initDOM() {
  global.document = jsdom.jsdom("");
  global.window = document.defaultView;
  global.navigator = window.navigator;
}

var A = React.createClass({
  render: function () {
    return <div>{ this.props.content }</div>;
  }
});

var B = React.createClass({
  render: function () {
    return <div><span>label:</span> <input type='text' name='test'></input></div>;
  }
});

describe("XPathReact", function () {
  describe("Dom", function () {
    it("should find B in rendered component", function () {
      
      initDOM();

      var div = document.createElement("div");
      document.body.appendChild(div);

      var el = React.createElement(A, { content: React.createElement(B) });
      ReactDom.render(el, div);
      
      var p = XPathUtils.find(XPathUtils.findReactRoot(), ".//B");
      Assert.equal(p.type, B);
    });

    it("should find B with key in rendered component", function () {
      
      initDOM();

      var div = document.createElement("div");
      document.body.appendChild(div);

      var eldiv = <div><B key="1" /><B key="2" /><B key="3" /></div>;
      var el = React.createElement(A, { content: eldiv });
      ReactDom.render(el, div);
      
      var p = XPathUtils.find(XPathUtils.findReactRoot(), ".//B[@key='1']');
      Assert.equal(p.type, B);
    });

    it("should find input in rendered component", function () {
      
      initDOM();

      var div = document.createElement("div");
      document.body.appendChild(div);

      var el = React.createElement(A, { content: React.createElement(B) });
      ReactDom.render(el, div);
      
      var p = XPathUtils.find(XPathUtils.findReactRoot(), ".//input[@type='text']);
      Assert.equal(p.tagName, "INPUT");
      Assert.equal(p.type, "text");
      Assert.equal(p.name, "test");
    });

  });
});
