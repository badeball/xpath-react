"use strict";

var Assert = require("assert");

var XPathUtils = require("../utils");

var React = require("react");

var Helper = require("./helper");

var Foo = function (props) {
  return (
    <div>
      <p>Hello world!</p>
      <button onClick={props.onClick}>
        Bar
      </button>
    </div>
  );
};

describe("XPathReact", function () {
  describe("Utils", function () {
    describe("find()", function () {
      it("should return the first element matching the expression", function () {
        var output = Helper.shallow(<Foo />);

        var p = XPathUtils.find(output, ".//p");

        Assert.equal(p.props.children, "Hello world!");
      });

      it("should return null when no elements match the expression", function () {
        var output = Helper.shallow(<Foo />);

        var ul = XPathUtils.find(output, ".//ul");

        Assert.equal(ul, null);
      });

      it("should support returning string types", function () {
        var output = Helper.shallow(<Foo />);

        var buttonText = XPathUtils.find(output, "string(.//p)");

        Assert.equal(buttonText, "Hello world!");
      });

      it("should support returning number types", function () {
        var output = Helper.shallow(<Foo />);

        var nButtons = XPathUtils.find(output, "count(.//button)");

        Assert.equal(nButtons, 1);
      });

      it("should support returning boolean types", function () {
        var output = Helper.shallow(<Foo />);

        var hasBarButton = XPathUtils.find(output, "count(.//button[contains(., 'Bar')]) = 1");

        Assert.equal(hasBarButton, true);
      });

      it("should throw an error when provided something other than a React element", function () {
        Assert.throws(function () {
          var notReactElement = {foo: "bar"};

          XPathUtils.find(notReactElement, "/*");
        }, /Expected a React element/);
      });
    });
  });
});
