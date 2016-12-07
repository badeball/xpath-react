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

var Wrapper = React.createClass({
  render: function () {
    return React.Children.only(this.props.children);
  }
});

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

      var elb = <B />;
      var el = <Wrapper><A content={elb} /></Wrapper>;
      var output = ReactDom.render(el, div);
      
      var p = XPathUtils.find(".//B", output);
      Assert.equal(p.type, B);
    });

    it("should find B with key in rendered component", function () {
      
      initDOM();

      var div = document.createElement("div");
      document.body.appendChild(div);

      var eldiv = <div><B key="1" /><B key="2" /><B key="3" /></div>;
      var el = React.createElement(A, { content: eldiv });
      var output = ReactDom.render(el, div);
      
      var p = XPathUtils.find(".//B[@key='1']", output);
      Assert.equal(p.type, B);
    });

    it("should find input in rendered component", function () {
      
      initDOM();

      var div = document.createElement("div");
      document.body.appendChild(div);

      var el = React.createElement(A, { content: React.createElement(B) });
      var output = ReactDom.render(el, div);
      
      var p = XPathUtils.find(".//input[@type='text']", output);
      Assert.equal(p.tagName, "INPUT");
      Assert.equal(p.type, "text");
      Assert.equal(p.name, "test");

      var p2 = XPathUtils.find(".//B//*[@type='text']", output);
      Assert.equal(p, p2);
    });

    it("should not find B in rendered component (demonstrate difference between evaluation on component tree and elements))", function () {
      
      initDOM();

      var div = document.createElement("div");
      document.body.appendChild(div);

      var el = React.createElement(A, { content: React.createElement(B) });
      var output = ReactDom.render(el, div)._reactInternalInstance._currentElement;

      var p = XPathUtils.find(".//input[@type='text']", output);
      Assert.equal(!!p, false);

      var p2 = XPathUtils.find(".//B//*[@type='text']", output);
      Assert.equal(!!p2, false);

      var p3 = XPathUtils.find(".//A", output);
      Assert.equal(p3.type, A);
    });


  });
});
