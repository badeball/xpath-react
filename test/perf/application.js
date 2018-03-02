/* eslint-env browser */

"use strict";

var Benchmark = require("benchmark");

var React = require("react");

var ReactDOM = require("react-dom");

var TestUtils = require("react-addons-test-utils");

var XPathReact = require("../../lib");

var Suite = new Benchmark.Suite();

var expression = ".//p[contains(., 'Hello world!')]";

var Foo = React.createClass({
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
  var component = ReactDOM.findDOMNode(TestUtils.renderIntoDocument(<Foo />));

  document.evaluate(expression, component, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
}).

add("XPathReact#evaluate", function () {
  var renderer = TestUtils.createRenderer();
  renderer.render(<Foo />);
  var output = renderer.getRenderOutput();

  XPathReact.evaluate(expression, output, null, XPathReact.XPathResult.FIRST_ORDERED_NODE_TYPE, null);
}).

on("cycle", function(event) {
  document.write(String(event.target) + "\n");
}).

on("complete", function() {
  document.write("Fastest is " + this.filter("fastest").pluck("name") + "\n");
}).

run({async: true});
