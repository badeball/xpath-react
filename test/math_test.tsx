import React from "react";

import { assertEvaluatesToNodeSet as unboundAssertEvaluatesToNodeSet } from "./helper";

const document = (
  <html>
    <body>
      <div id='with' x-price='2' x-count='3'></div>
      <div id='without' x-price='2' x-count='4'></div>
    </body>
  </html>
);

const assertEvaluatesToNodeSet = unboundAssertEvaluatesToNodeSet.bind(null, document);

suite("XPathReact", function () {
  suite("math", function () {
    test("00", function () {
      assertEvaluatesToNodeSet("//*[@x-price * (@x-count + @x-count) = 12]", ["div#with"]);
    });

    test("01", function () {
      assertEvaluatesToNodeSet("//*[@x-price * @x-count + @x-count = 12]", ["div#without"]);
    });
  });
});
