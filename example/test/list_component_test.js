/* eslint-env mocha, node */

"use strict";

var React = require("react");

var Helper = require("./helper");

/* eslint-disable no-unused-vars */
var List = require("../lib/list_component");
/* eslint-enable no-unused-vars */

describe("ListComponent", function () {
  describe("when isLoading is true", function () {
    it("should render a loading text", function () {
      var rendering = React.renderToString(<List isLoading={true} />);

      rendering.should.include("Loading items..");
    });
  });

  describe("when isLoading is false", function () {
    it("should render the given items", function () {
      var items = ["foo", "bar"];

      var element = Helper.render(<List isLoading={false} items={items} />);

      element.should.have.xpath(".//li[contains(., 'foo')]");
      element.should.have.xpath(".//li[contains(., 'bar')]");
    });

    it("should render a delete button for each item", function () {
      var items = ["foo", "bar"];

      var element = Helper.render(<List isLoading={false} items={items} />);

      element.should.have.xpath(".//li[contains(., 'foo')]/button[contains(., 'Delete')]");
      element.should.have.xpath(".//li[contains(., 'bar')]/button[contains(., 'Delete')]");
    });

    it("should invoke a callback upon pressing a delete button", function () {
      var items = ["foo"];

      var onRemove = this.sinon.spy();

      var element = Helper.render(<List isLoading={false} items={items} onRemove={onRemove} />);

      var deleteButton = Helper.find(element, ".//button[contains(., 'Delete')]");

      Helper.Simulate.click(deleteButton);

      onRemove.should.have.been.calledWith(0);
    });

    it("should render the given form value", function () {
      var element = Helper.render(<List isLoading={false} formValue="foo" />);

      var textarea = Helper.find(element, ".//textarea");

      textarea.props.value.should.equal("foo");
    });

    it("should render an add item button", function () {
      var element = Helper.render(<List isLoading={false} />);

      element.should.have.xpath(".//button[contains(., 'Add')]");
    });

    it("should invoke a callback upon pressing the add button", function () {
      var onAdd = this.sinon.spy();

      var element = Helper.render(<List isLoading={false} onAdd={onAdd} formValue="foo" />);

      var addButton = Helper.find(element, ".//button[contains(., 'Add')]");

      Helper.Simulate.click(addButton);

      onAdd.should.have.been.calledWith("foo");
    });
  });
});
