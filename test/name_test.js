"use strict";

var React = require("react");

var Helper = require("./helper");

var Doc = React.createClass({
  render: function () {
    return (
      <html>
        <body>
          <div name='single' id='single'>div element 1</div>
          <div name='duplicate' id='duplicate_1'>div element 2</div>
          <div name='duplicate' id='duplicate_2'>div element 3</div>
          <div name='duplicate' id='duplicate_3'>div element 4</div>
        </body>
      </html>
    );
  }
});

var document = Helper.render(<Doc/>);

var assertEvaluatesToNodeSet = Helper.assertEvaluatesToNodeSet.bind(null, document);

suite("XPathReact", function () {
  suite("name", function () {
    test("unique name", function () {
      assertEvaluatesToNodeSet("//*[@name='single']", ["div#single"]);
    });

    test("01", function () {
      assertEvaluatesToNodeSet("//*[@name='duplicate']", ["div#duplicate_1", "div#duplicate_2", "div#duplicate_3"]);
    });
  });
});
