import React from "react";

import { assertEvaluatesToNodeSet as unboundAssertEvaluatesToNodeSet } from "./helper";

/* eslint-disable no-script-url */
const document = (
  <html>
    <body>
      <a id='id0-0' href='javascript:doFoo(a, b)'>foo</a>
      <a id='id0-1' href='javascript:doFoo(a, %20b)'>foo</a>
      <a id='id0-2' href='javascript:doFoo(%61, %20b)'>foo</a>
      <a id='id1-0' href='http://example.com/a b'>foo</a>
      <a id='id1-1' href='http://example.com/a%20b'>foo</a>
      <a id='id1-2' href='http://example.com/%61%20b'>foo</a>
    </body>
  </html>
);
/* eslint-ena enable no-script-url */

const assertEvaluatesToNodeSet = unboundAssertEvaluatesToNodeSet.bind(null, document);

suite("XPathReact", function () {
  suite("complex href", function () {
    test("00", function () {
      assertEvaluatesToNodeSet("//a[@href='javascript:doFoo(a, b)']", ["a#id0-0"]);
    });

    test("01", function () {
      assertEvaluatesToNodeSet("//a[@href='javascript:doFoo(a, %20b)']", ["a#id0-1"]);
    });

    test("02", function () {
      assertEvaluatesToNodeSet("//a[@href='javascript:doFoo(%61, %20b)']", ["a#id0-2"]);
    });

    test("03", function () {
      assertEvaluatesToNodeSet("//a[@href='http://example.com/a b']", ["a#id1-0"]);
    });

    test("04", function () {
      assertEvaluatesToNodeSet("//a[@href='http://example.com/a%20b']", ["a#id1-1"]);
    });

    test("05", function () {
      assertEvaluatesToNodeSet("//a[@href='http://example.com/%61%20b']", ["a#id1-2"]);
    });

    test("06", function () {
      assertEvaluatesToNodeSet("//*[@href='http://example.com/a b'][@href='http://example.com/a b']", ["a#id1-0"]);
    });
  });
});
