import React from "react";

import { assertEvaluatesToValue as unboundAssertEvaluatesToValue } from "./helper";

var document = <h1 />;

var assertEvaluatesToValue = unboundAssertEvaluatesToValue.bind(null, document);

suite("XPathDOM", function () {
  suite("boolean", function () {
    test("00", function () {
      assertEvaluatesToValue("//h1 and //h1", true);
    });

    test("01", function () {
      assertEvaluatesToValue("//h1 and //foo", false);
    });

    test("02", function () {
      assertEvaluatesToValue("//h1 or //h1", true);
    });

    test("03", function () {
      assertEvaluatesToValue("//h1 or //foo", true);
    });

    test("04", function () {
      assertEvaluatesToValue("//foo or //h1", true);
    });

    test("05", function () {
      assertEvaluatesToValue("//foo or //bar", false);
    });
  });
});
