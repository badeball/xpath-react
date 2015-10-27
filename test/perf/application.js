var Benchmark = require("benchmark");

var React = require("react");

var ReactDOM = require("react-dom");

var TestUtils = require("react-addons-test-utils");

var XPathReact = require("../../register");

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

  document.evaluate(expression, component, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}).

add("XPathReact#evaluate", function () {
  var renderer = TestUtils.createRenderer();
  renderer.render(<Foo />);
  var output = renderer.getRenderOutput();

  XPathReact.evaluate(expression, output, null, XPathReact.XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}).

on("cycle", function(event) {
  console.log(String(event.target));
}).

on("complete", function() {
  console.log("Fastest is " + this.filter("fastest").pluck("name"));
}).

run({async: true});
