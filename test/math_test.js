"use strict";

var React = require("react");

var Helper = require("./helper");

var Doc = React.createClass({
  render: function () {
    return (
      <html>
        <body>
          <div id='with' price='2' count='3'></div>
          <div id='without' price='2' count='4'></div>
        </body>
      </html>
    );
  }
});

var document = Helper.render(<Doc/>);

var assertEvaluatesToNodeSet = Helper.assertEvaluatesToNodeSet.bind(null, document);

suite("XPathReact", function () {
  suite("math", function () {
    test("00", function () {
      assertEvaluatesToNodeSet("//*[@price * (@count + @count) = 12]", ["div#with"]);
    });

    test("01", function () {
      assertEvaluatesToNodeSet("//*[@price * @count + @count = 12]", ["div#without"]);
    });
  });
});
