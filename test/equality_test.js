import React from "react";

import { assertEvaluatesToValue as unboundAssertEvaluatesToValue } from "./helper";

const document = (
  <body>
    <div>
      <span>a</span>
      <span>b</span>
      <span>c</span>
      <span>d</span>
    </div>
    <div>",
      <span>1</span>
      <span>2</span>
      <span>3</span>
      <span>4</span>
    </div>
  </body>
);

const assertEvaluatesToValue = unboundAssertEvaluatesToValue.bind(null, document);

suite("XPathDOM", function () {
  suite("equality", function () {
    // Comparing two node-sets
    test("00", function () {
      assertEvaluatesToValue("//div[1]/span[position() = 1] = //div[1]/span[position() = 1]", true);
    });

    test("01", function () {
      assertEvaluatesToValue("//div[1]/span[position() = 1] != //div[1]/span[position() = 1]", false);
    });

    test("02", function () {
      assertEvaluatesToValue("//div[1]/span = //div[1]/span", true);
    });

    test("03", function () {
      assertEvaluatesToValue("//div[1]/span != //div[1]/span", true);
    });

    test("04", function () {
      assertEvaluatesToValue("//div[1]/span[position() = 1] >= //div[1]/span[position() = 1]", true);
    });

    test("05", function () {
      assertEvaluatesToValue("//div[1]/span[position() = 1] > //div[1]/span[position() = 1]", false);
    });

    test("06", function () {
      assertEvaluatesToValue("//div[1]/span[position() = 2] > //div[1]/span[position() = 1]", true);
    });

    test("07", function () {
      assertEvaluatesToValue("//div[1]/span[position() = 1] > //div[1]/span[position() > 1]", false);
    });

    test("08", function () {
      assertEvaluatesToValue("//div[1]/span[position() = 1] > //div[1]/span", false);
    });

    test("09", function () {
      assertEvaluatesToValue("//div[1]/span[position() = 2] > //div[1]/span", true);
    });

    // Comparing a node-set with a number
    test("10", function () {
      assertEvaluatesToValue("//div[2]/span[position() = 1] > 1", false);
    });

    test("11", function () {
      assertEvaluatesToValue("//div[2]/span[position() = 1] >= 1", true);
    });

    test("12", function () {
      assertEvaluatesToValue("//div[2]/span[position() = 2] > 1", true);
    });

    test("13", function () {
      assertEvaluatesToValue("//div[2]/span[position() < 3] > 1", true);
    });

    // Comparing a node-set with a string
    test("14", function () {
      assertEvaluatesToValue("//div[1]/span[position() = 1] > 'a'", false);
    });

    test("15", function () {
      assertEvaluatesToValue("//div[1]/span[position() = 2] > 'a'", true);
    });

    test("16", function () {
      assertEvaluatesToValue("//div[1]/span[position() < 3] > 'a'", true);
    });

    // Comparing a node-set with a boolean
    test("17", function () {
      assertEvaluatesToValue("//div[1]/span[true()] = true()", true);
    });

    test("18", function () {
      assertEvaluatesToValue("//div[1]/span[false()] = true()", false);
    });

    // Comparing a boolean with a boolean
    test("19", function () {
      assertEvaluatesToValue("true() = true()", true);
    });

    test("20", function () {
      assertEvaluatesToValue("true() != true()", false);
    });

    // Comparing a boolean with a number
    test("21", function () {
      assertEvaluatesToValue("true() = 1", true);
    });

    test("22", function () {
      assertEvaluatesToValue("true() = 0", false);
    });

    test("23", function () {
      assertEvaluatesToValue("true() = -1", true);
    });

    test("24", function () {
      assertEvaluatesToValue("1 = true()", true);
    });

    test("25", function () {
      assertEvaluatesToValue("0 = true()", false);
    });

    test("26", function () {
      assertEvaluatesToValue("-1 = true()", true);
    });

    // Comparing a boolean with a string
    test("27", function () {
      assertEvaluatesToValue("false() = ''", true);
    });

    test("28", function () {
      assertEvaluatesToValue("false() = 'false'", false);
    });

    test("29", function () {
      assertEvaluatesToValue("true() = ''", false);
    });

    test("30", function () {
      assertEvaluatesToValue("true() = 'foo'", true);
    });

    test("31", function () {
      assertEvaluatesToValue("'' = false()", true);
    });

    test("32", function () {
      assertEvaluatesToValue("'false' = false()", false);
    });

    test("33", function () {
      assertEvaluatesToValue("'' = true()", false);
    });

    test("34", function () {
      assertEvaluatesToValue("'foo' = true()", true);
    });

    // Comparing a number with a number
    test("35", function () {
      assertEvaluatesToValue("1 = 1", true);
    });

    test("36", function () {
      assertEvaluatesToValue("1 != 2", true);
    });

    // Comparing a number with a string
    test("37", function () {
      // NaN isn't equal NaN, which explains some of the proceeding tests.
      assertEvaluatesToValue("number('foo') = number('foo')", false);
    });

    test("38", function () {
      assertEvaluatesToValue("number('foo') = 'foo'", false);
    });

    test("39", function () {
      assertEvaluatesToValue("number('foo') = 'NaN'", false);
    });

    test("40", function () {
      assertEvaluatesToValue("1 = '1'", true);
    });

    test("41", function () {
      assertEvaluatesToValue("'foo' = number('foo')", false);
    });

    test("42", function () {
      assertEvaluatesToValue("'NaN' = number('foo')", false);
    });

    test("43", function () {
      assertEvaluatesToValue("'1' = 1", true);
    });

    // Comparing a string with a string
    test("44", function () {
      assertEvaluatesToValue("'a' = 'a'", true);
    });

    test("45", function () {
      assertEvaluatesToValue("'a' != 'b'", true);
    });

    // Comparison using <=, <, >= or >, not involving node-sets
    test("46", function () {
      assertEvaluatesToValue("'a' < 'b'", false);
    });

    test("47", function () {
      assertEvaluatesToValue("1 > false()", true);
    });

    test("48", function () {
      assertEvaluatesToValue("1 > true()", false);
    });

    test("49", function () {
      assertEvaluatesToValue("1 >= true()", true);
    });
  });
});
