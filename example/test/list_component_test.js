const Assert = require("assert");

const ReactDOMServer = require("react-dom/server");

const ShallowRenderer = require("react-test-renderer/shallow");

const XPathUtils = require("xpath-react/utils");

const React = require("react");

const Sinon = require("sinon");

const List = require("../lib/list_component");

function shallow (component) {
  const renderer = new ShallowRenderer();
  renderer.render(component);
  return renderer.getRenderOutput();
}

function assertHasXPath (element, expression) {
  Assert.ok(XPathUtils.find(element, expression), "Expected element to have expression " + expression);
}

describe("ListComponent", function () {
  describe("when isLoading is true", function () {
    it("should render a loading text", function () {
      const rendering = ReactDOMServer.renderToString(<List isLoading={true} />);

      Assert.ok(rendering.includes("Loading items.."));
    });
  });

  describe("when isLoading is false", function () {
    it("should render the given items", function () {
      const items = ["foo", "bar"];

      const element = shallow(<List isLoading={false} items={items} />);

      assertHasXPath(element, ".//li[contains(., 'foo')]");
      assertHasXPath(element, ".//li[contains(., 'bar')]");
    });

    it("should render a delete button for each item", function () {
      const items = ["foo", "bar"];

      const element = shallow(<List isLoading={false} items={items} />);

      assertHasXPath(element, ".//li[contains(., 'foo')]/button[contains(., 'Delete')]");
      assertHasXPath(element, ".//li[contains(., 'bar')]/button[contains(., 'Delete')]");
    });

    it("should invoke a callback upon pressing a delete button", function () {
      const items = ["foo"];

      const onRemove = Sinon.spy();

      const element = shallow(<List isLoading={false} items={items} onRemove={onRemove} />);

      XPathUtils.Simulate.click(element, ".//button[contains(., 'Delete')]");

      Assert.ok(onRemove.called);
    });

    it("should render the given form value", function () {
      const element = shallow(<List isLoading={false} formValue="foo" />);

      const textarea = XPathUtils.find(element, ".//textarea");

      Assert.equal(textarea.props.value, "foo");
    });

    it("should render an add item button", function () {
      const element = shallow(<List isLoading={false} />);

      assertHasXPath(element, ".//button[contains(., 'Add')]");
    });

    it("should invoke a callback upon pressing the add button", function () {
      const onAdd = Sinon.spy();

      const element = shallow(<List isLoading={false} onAdd={onAdd} formValue="foo" />);

      XPathUtils.Simulate.click(element, ".//button[contains(., 'Add')]");

      Assert.ok(onAdd.calledWith("foo"));
    });
  });
});
