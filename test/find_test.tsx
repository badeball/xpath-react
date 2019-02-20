import Assert from "assert";

import { find } from "../lib";

import React from "react";

import { shallow } from "./helper";

const Foo = function (props: { onClick?: () => {}}) {
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
        const output = shallow(<Foo />);

        const p = find(output, ".//p");

        Assert.equal((p as React.ReactElement).props.children, "Hello world!");
      });

      it("should return null when no elements match the expression", function () {
        const output = shallow(<Foo />);

        const ul = find(output, ".//ul");

        Assert.equal(ul, null);
      });

      it("should support returning string types", function () {
        const output = shallow(<Foo />);

        const buttonText = find(output, "string(.//p)");

        Assert.equal(buttonText, "Hello world!");
      });

      it("should support returning number types", function () {
        const output = shallow(<Foo />);

        const nButtons = find(output, "count(.//button)");

        Assert.equal(nButtons, 1);
      });

      it("should support returning boolean types", function () {
        const output = shallow(<Foo />);

        const hasBarButton = find(output, "count(.//button[contains(., 'Bar')]) = 1");

        Assert.equal(hasBarButton, true);
      });

      it("should throw an error when provided something other than a React element", function () {
        Assert.throws(function () {
          const notReactElement = {foo: "bar"};

          find(notReactElement as any as React.ReactElement, "/*");
        }, /Expected a React element/);
      });
    });
  });
});
