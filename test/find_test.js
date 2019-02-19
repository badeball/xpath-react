import Assert from "assert";

import { find } from "../lib";

import React from "react";

import { shallow } from "./helper";

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
        var output = shallow(<Foo />);

        var p = find(output, ".//p");

        Assert.equal(p.props.children, "Hello world!");
      });

      it("should return null when no elements match the expression", function () {
        var output = shallow(<Foo />);

        var ul = find(output, ".//ul");

        Assert.equal(ul, null);
      });

      it("should support returning string types", function () {
        var output = shallow(<Foo />);

        var buttonText = find(output, "string(.//p)");

        Assert.equal(buttonText, "Hello world!");
      });

      it("should support returning number types", function () {
        var output = shallow(<Foo />);

        var nButtons = find(output, "count(.//button)");

        Assert.equal(nButtons, 1);
      });

      it("should support returning boolean types", function () {
        var output = shallow(<Foo />);

        var hasBarButton = find(output, "count(.//button[contains(., 'Bar')]) = 1");

        Assert.equal(hasBarButton, true);
      });

      it("should throw an error when provided something other than a React element", function () {
        Assert.throws(function () {
          var notReactElement = {foo: "bar"};

          find(notReactElement, "/*");
        }, /Expected a React element/);
      });
    });
  });
});
