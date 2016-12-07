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
    return <div><B btag={this.props.tag} /></div>;
  }
});

var B = React.createClass({
  render: function () {
    return <div><span>{this.props.btag || "label"}:</span> <input type='text' name='test'></input></div>;
  }
});

describe("XPathReact", function () {
  describe("Dom", function () {
    it("should find B in rendered component", function () {
      
      initDOM();

      var div = document.createElement("div");
      document.body.appendChild(div);

      var output = ReactDom.render(<Wrapper><A tag="tag" /></Wrapper>, div);
      
      var p = XPathUtils.find(".//B", output);
      Assert.equal(p.type, B);

      var p2 = XPathUtils.find(".//*[@btag]", output);
      Assert.equal(p2, p);
    });

    it("should find B with key in rendered component", function () {
      
      initDOM();

      var div = document.createElement("div");
      document.body.appendChild(div);

      var output = ReactDom.render(<Wrapper><div><B key="1" /><B key="2" test="2" /><B key="3" /></div></Wrapper>, div);
      
      var p = XPathUtils.find(".//B[@key='2']", output);
      Assert.equal(p.type, B);
      Assert.equal(p.props.test, "2");
    });

    it("should find input in rendered component", function () {
      
      initDOM();

      var div = document.createElement("div");
      document.body.appendChild(div);

      var output = ReactDom.render(<A />, div);
      
      var p = XPathUtils.find(".//input", output);
      Assert.equal(p.tagName, "INPUT");
      Assert.equal(p.type, "text");
      Assert.equal(p.name, "test");

      var p2 = XPathUtils.find(".//B//*[@type='text']", output);
      Assert.equal(p2, p);
    });

    it("should not find B in rendered component (demonstrate difference between evaluation on component tree and elements))", function () {
      
      initDOM();

      var div = document.createElement("div");
      document.body.appendChild(div);

      var output = ReactDom.render(<A />, div)._reactInternalInstance._currentElement;

      var p = XPathUtils.find(".//input", output);
      Assert.equal(!!p, false);

      var p2 = XPathUtils.find(".//B//*[@type='text']", output);
      Assert.equal(!!p2, false);

      var p3 = XPathUtils.find(".//A", output);
      Assert.equal(p3.type, A);
    });


  });
});
