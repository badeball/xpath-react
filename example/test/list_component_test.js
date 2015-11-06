"use strict";

var ReactDOMServer = require("react-dom/server");

var XPathUtils = require("xpath-react/utils");

/* eslint-disable no-unused-vars */
var React = require("react");

var List = require("../lib/list_component");
/* eslint-enable no-unused-vars */

describe("ListComponent", function () {
  describe("when isLoading is true", function () {
    it("should render a loading text", function () {
      var rendering = ReactDOMServer.renderToString(<List isLoading={true} />);

      rendering.should.include("Loading items..");
    });
  });

  describe("when isLoading is false", function () {
    it("should render the given items", function () {
      var items = ["foo", "bar"];

      var element = XPathUtils.render(<List isLoading={false} items={items} />);

      element.should.have.xpath(".//li[contains(., 'foo')]");
      element.should.have.xpath(".//li[contains(., 'bar')]");
    });

    it("should render a delete button for each item", function () {
      var items = ["foo", "bar"];

      var element = XPathUtils.render(<List isLoading={false} items={items} />);

      element.should.have.xpath(".//li[contains(., 'foo')]/button[contains(., 'Delete')]");
      element.should.have.xpath(".//li[contains(., 'bar')]/button[contains(., 'Delete')]");
    });

    it("should invoke a callback upon pressing a delete button", function () {
      var items = ["foo"];

      var onRemove = this.sinon.spy();

      var element = XPathUtils.render(<List isLoading={false} items={items} onRemove={onRemove} />);

      var deleteButton = XPathUtils.find(element, ".//button[contains(., 'Delete')]");

      XPathUtils.Simulate.click(deleteButton);

      onRemove.should.have.been.calledWith(0);
    });

    it("should render the given form value", function () {
      var element = XPathUtils.render(<List isLoading={false} formValue="foo" />);

      var textarea = XPathUtils.find(element, ".//textarea");

      textarea.props.value.should.equal("foo");
    });

    it("should render an add item button", function () {
      var element = XPathUtils.render(<List isLoading={false} />);

      element.should.have.xpath(".//button[contains(., 'Add')]");
    });

    it("should invoke a callback upon pressing the add button", function () {
      var onAdd = this.sinon.spy();

      var element = XPathUtils.render(<List isLoading={false} onAdd={onAdd} formValue="foo" />);

      var addButton = XPathUtils.find(element, ".//button[contains(., 'Add')]");

      XPathUtils.Simulate.click(addButton);

      onAdd.should.have.been.calledWith("foo");
    });
  });
});
