var Assert = require("assert");

var ReactDOMServer = require("react-dom/server");

var XPathUtils = require("xpath-react/utils");

var React = require("react");

var Sinon = require("sinon");

var List = require("../lib/list_component");

function assertHasXPath (element, expression) {
  Assert.ok(XPathUtils.find(element, expression), "Expected element to have expression " + expression);
}

describe("ListComponent", function () {
  describe("when isLoading is true", function () {
    it("should render a loading text", function () {
      var rendering = ReactDOMServer.renderToString(<List isLoading={true} />);

      Assert.ok(rendering.includes("Loading items.."));
    });
  });

  describe("when isLoading is false", function () {
    it("should render the given items", function () {
      var items = ["foo", "bar"];

      var element = XPathUtils.render(<List isLoading={false} items={items} />);

      assertHasXPath(element, ".//li[contains(., 'foo')]");
      assertHasXPath(element, ".//li[contains(., 'bar')]");
    });

    it("should render a delete button for each item", function () {
      var items = ["foo", "bar"];

      var element = XPathUtils.render(<List isLoading={false} items={items} />);

      assertHasXPath(element, ".//li[contains(., 'foo')]/button[contains(., 'Delete')]");
      assertHasXPath(element, ".//li[contains(., 'bar')]/button[contains(., 'Delete')]");
    });

    it("should invoke a callback upon pressing a delete button", function () {
      var items = ["foo"];

      var onRemove = Sinon.spy();

      var element = XPathUtils.render(<List isLoading={false} items={items} onRemove={onRemove} />);

      XPathUtils.Simulate.click(element, ".//button[contains(., 'Delete')]");

      Assert.ok(onRemove.called);
    });

    it("should render the given form value", function () {
      var element = XPathUtils.render(<List isLoading={false} formValue="foo" />);

      var textarea = XPathUtils.find(element, ".//textarea");

      Assert.equal(textarea.props.value, "foo");
    });

    it("should render an add item button", function () {
      var element = XPathUtils.render(<List isLoading={false} />);

      assertHasXPath(element, ".//button[contains(., 'Add')]");
    });

    it("should invoke a callback upon pressing the add button", function () {
      var onAdd = Sinon.spy();

      var element = XPathUtils.render(<List isLoading={false} onAdd={onAdd} formValue="foo" />);

      XPathUtils.Simulate.click(element, ".//button[contains(., 'Add')]");

      Assert.ok(onAdd.calledWith("foo"));
    });
  });
});
