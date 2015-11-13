"use strict";

/* eslint-disable no-unused-vars */
var React = require("react");
/* eslint-enable no-unused-vars */

var Helper = require("./helper");

var document = (
  <html>
    <head>
      <title>Title</title>
    </head>
    <body>
      <div>
        <span id='a'>hoge</span>
        <span id='b'>3</span>
      </div>
      <ol id='numbers'>
        <li>1</li>
        <li>2</li>
        <li>3</li>
        <li>4</li>
        <li>5</li>
      </ol>
    </body>
  </html>
);

var DOCUMENT_AS_STRING = "Titlehoge312345";

var assertEvaluatesToNodeSet = Helper.assertEvaluatesToNodeSet.bind(null, document);

var assertEvaluatesToValue = Helper.assertEvaluatesToValue.bind(null, document);

suite("XPathReact", function () {
  suite("simple value", function () {
    test("00", function () {
      assertEvaluatesToValue("local-name(/html)", "html");
    });

    test("01", function () {
      assertEvaluatesToValue("count(/)", 1);
    });

    test("02", function () {
      assertEvaluatesToValue("count(//li)", 5);
    });

    test("03", function () {
      assertEvaluatesToValue("boolean(id('b'))", true);
    });

    test("04", function () {
      assertEvaluatesToValue("boolean(/..)", false);
    });

    test("05", function () {
      assertEvaluatesToValue("boolean(0)", false);
    });

    test("06", function () {
      assertEvaluatesToValue("boolean(NaN)", false);
    });

    test("07", function () {
      assertEvaluatesToValue("boolean(1)", true);
    });

    test("08", function () {
      assertEvaluatesToValue("boolean(-1)", true);
    });

    test("09", function () {
      assertEvaluatesToValue("boolean('')", false);
    });

    test("10", function () {
      assertEvaluatesToValue("boolean('Nice boat.')", true);
    });

    test("11", function () {
      assertEvaluatesToValue("not(true())", false);
    });

    test("12", function () {
      assertEvaluatesToValue("true() and true()", true);
    });

    test("13", function () {
      assertEvaluatesToValue("true() or  false()", true);
    });

    test("14", function () {
      assertEvaluatesToValue("number(id('b'))", 3);
    });

    test("15", function () {
      assertEvaluatesToValue("number('1')", 1);
    });

    test("16", function () {
      assertEvaluatesToValue("number('-1')", -1);
    });

    test("17", function () {
      assertEvaluatesToValue("number(' 1')", 1);
    });

    test("18", function () {
      assertEvaluatesToValue("number(' -1')", -1);
    });

    test("19", function () {
      assertEvaluatesToValue("number(true())", 1);
    });

    test("20", function () {
      assertEvaluatesToValue("number(false())", 0);
    });

    test("21", function () {
      assertEvaluatesToValue("sum(id('numbers')/li)", 15);
    });

    test("22", function () {
      assertEvaluatesToValue("1 + 1", 2);
    });

    test("23", function () {
      assertEvaluatesToValue("1+1", 2);
    });

    test("24", function () {
      assertEvaluatesToValue("1 - 1", 0);
    });

    test("25", function () {
      assertEvaluatesToValue("1-1", 0);
    });

    test("26", function () {
      assertEvaluatesToValue("string(/ - /)", "NaN");
    });

    test("27", function () {
      assertEvaluatesToValue("normalize-space(string())", DOCUMENT_AS_STRING);
    });

    test("28", function () {
      assertEvaluatesToValue("normalize-space(string(.))", DOCUMENT_AS_STRING);
    });

    test("29", function () {
      assertEvaluatesToValue("normalize-space(string(/))", DOCUMENT_AS_STRING);
    });

    test("30", function () {
      assertEvaluatesToValue("normalize-space(string(/html))", DOCUMENT_AS_STRING);
    });

    test("31", function () {
      assertEvaluatesToValue("normalize-space(string(//div))", "hoge3");
    });

    test("32", function () {
      assertEvaluatesToValue("string(//*//*//*)", "Title");
    });

    test("33", function () {
      assertEvaluatesToValue("string(/..)", "");
    });

    test("34", function () {
      assertEvaluatesToValue("string(number('Nice boat.'))", "NaN");
    });

    test("35", function () {
      assertEvaluatesToValue("string(1 div 0)", "Infinity");
    });

    test("36", function () {
      assertEvaluatesToValue("string(1 div -0)", "-Infinity");
    });

    test("37", function () {
      assertEvaluatesToValue("string(0)", "0");
    });

    test("38", function () {
      assertEvaluatesToValue("string(-0)", "0");
    });

    test("39", function () {
      assertEvaluatesToValue("string(1)", "1");
    });

    test("40", function () {
      assertEvaluatesToValue("string(-1)", "-1");
    });

    test("41", function () {
      assertEvaluatesToValue("string(true())", "true");
    });

    test("42", function () {
      assertEvaluatesToValue("string(false())", "false");
    });

    test("43", function () {
      assertEvaluatesToValue("string-length('')", 0);
    });

    test("44", function () {
      assertEvaluatesToValue("string-length('a')", 1);
    });

    test("45", function () {
      assertEvaluatesToValue("contains('abcdefg', 'def')", true);
    });

    test("46", function () {
      assertEvaluatesToValue("contains('abcdefg', 'zzz')", false);
    });

    test("47", function () {
      assertEvaluatesToValue("starts-with('abcdefg', 'abc')", true);
    });

    test("48", function () {
      assertEvaluatesToValue("starts-with('abcdefg', 'def')", false);
    });

    test("49", function () {
      assertEvaluatesToValue("concat('abc', 'def')", "abcdef");
    });

    test("50", function () {
      assertEvaluatesToValue("concat('abc', 'def', 'ghi')", "abcdefghi");
    });

    test("51", function () {
      assertEvaluatesToValue("concat('abc', 'def', 'ghi', 'jkl')", "abcdefghijkl");
    });

    test("52", function () {
      assertEvaluatesToValue("translate('bar','abc','ABC')", "BAr");
    });

    test("53", function () {
      assertEvaluatesToValue("translate('--aaa--','abc-','ABC')", "AAA");
    });

    test("54", function () {
      assertEvaluatesToValue("substring('12345', 2, 3)", "234");
    });

    test("55", function () {
      assertEvaluatesToValue("substring('12345', 2)", "2345");
    });

    test("56", function () {
      assertEvaluatesToValue("substring('12345', 1.5, 2.6)", "234");
    });

    test("57", function () {
      assertEvaluatesToValue("substring('12345', 0, 3)", "12");
    });

    test("58", function () {
      assertEvaluatesToValue("substring('12345', 0 div 0, 3)", "");
    });

    test("59", function () {
      assertEvaluatesToValue("substring('12345', 1, 0 div 0)", "");
    });

    test("60", function () {
      assertEvaluatesToValue("substring('12345', -42, 1 div 0)", "12345");
    });

    test("61", function () {
      assertEvaluatesToValue("substring('12345', -1 div 0, 1 div 0)", "");
    });

    test("62", function () {
      assertEvaluatesToValue("substring-after('1999/04/01','/')", "04/01");
    });

    test("63", function () {
      assertEvaluatesToValue("substring-after('1999/04/01','19')", "99/04/01");
    });

    test("64", function () {
      assertEvaluatesToValue("substring-before('1999/04/01','/')", "1999");
    });

    test("65", function () {
      assertEvaluatesToValue("normalize-space(id('numbers')/li) = '1'", true);
    });

    test("66", function () {
      assertEvaluatesToValue("id('numbers')/li = id('numbers')/li", true);
    });

    test("67", function () {
      assertEvaluatesToValue("'' = false()", true);
    });

    test("68", function () {
      assertEvaluatesToValue("false() = ''", true);
    });

    test("69", function () {
      assertEvaluatesToValue("'1' = 1", true);
    });

    test("70", function () {
      assertEvaluatesToValue("1 = '1'", true);
    });

    test("71", function () {
      assertEvaluatesToValue("'1' = '1'", true);
    });

    test("72", function () {
      assertEvaluatesToNodeSet("html-html", []);
    });
  });
});
