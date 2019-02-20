"use strict";

const Benchmark = require("benchmark");

const React = require("react");

const ReactDOM = require("react-dom");

const TestUtils = require("react-addons-test-utils");

const XPathReact = require("../../lib");

const Suite = new Benchmark.Suite();

const expression = ".//p[contains(., 'Hello world!')]";

const Foo = React.createClass({
  render: function () {
    return (
      <div>
        <p>Hello world!</p>
      </div>
    );
  }
});

Suite.

add("document#evaluate", function () {
  const component = ReactDOM.findDOMNode(TestUtils.renderIntoDocument(<Foo />));

  document.evaluate(expression, component, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
}).

add("XPathReact#evaluate", function () {
  const renderer = TestUtils.createRenderer();
  renderer.render(<Foo />);
  const output = renderer.getRenderOutput();

  XPathReact.evaluate(expression, output, null, XPathReact.XPathResult.FIRST_ORDERED_NODE_TYPE, null);
}).

on("cycle", function(event) {
  document.write(String(event.target) + "\n");
}).

on("complete", function() {
  document.write("Fastest is " + this.filter("fastest").pluck("name") + "\n");
}).

run({async: true});
