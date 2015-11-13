"use strict";

var React = require("react");

var Helper = require("./helper");

var document = (
  <html>
    <head>
      <title>title</title>
    </head>
    <body>
      <div>
        <p className='1'></p>
        <ul>
          <li id='t1'></li>
          <li></li>
          <li id='t2'></li>
        </ul>
        <p className='2'></p>
      </div>
      <div>
       <p className='3'></p>
       <ul>
         <li id='t3'></li>
         <li></li>
         <li id='t4'></li>
       </ul>
       <p className='4'></p>
      </div>
    </body>
  </html>
);

var assertEvaluatesToNodeSet = Helper.assertEvaluatesToNodeSet.bind(null, document);

suite("XPathReact", function () {
  suite("preceding and following", function () {
    test("00", function () {
      assertEvaluatesToNodeSet("id('t1')/following::*", ["li", "li#t2", "p.2", "div", "p.3", "ul", "li#t3", "li", "li#t4", "p.4"]);
    });

    test("01", function () {
      assertEvaluatesToNodeSet("id('t2')/following::*", ["p.2", "div", "p.3", "ul", "li#t3", "li", "li#t4", "p.4"]);
    });

    test("02", function () {
      assertEvaluatesToNodeSet("id('t3')/following::*", ["li", "li#t4", "p.4"]);
    });

    test("03", function () {
      assertEvaluatesToNodeSet("id('t4')/following::*", ["p.4"]);
    });

    test("04", function () {
      assertEvaluatesToNodeSet("id('t3 t4')/following::*", ["li", "li#t4", "p.4"]);
    });

    test("05", function () {
      assertEvaluatesToNodeSet("id('t2 t3 t4')/following::*", ["p.2", "div", "p.3", "ul", "li#t3", "li", "li#t4", "p.4"]);
    });

    test("06", function () {
      assertEvaluatesToNodeSet("id('t1 t2 t3 t4')/following::*", ["li", "li#t2", "p.2", "div", "p.3", "ul", "li#t3", "li", "li#t4", "p.4"]);
    });

    test("07", function () {
      assertEvaluatesToNodeSet("id('t1 t2 t3 t4')/preceding::*", ["head", "title", "div", "p.1", "ul", "li#t1", "li", "li#t2", "p.2", "p.3", "li#t3", "li"]);
    });

    test("08", function () {
      assertEvaluatesToNodeSet("id('t1 t2 t3')/preceding::*", ["head", "title", "div", "p.1", "ul", "li#t1", "li", "li#t2", "p.2", "p.3"]);
    });

    test("09", function () {
      assertEvaluatesToNodeSet("id('t1 t2')/preceding::*", ["head", "title", "p.1", "li#t1", "li"]);
    });

    test("10", function () {
      assertEvaluatesToNodeSet("id('t1')/preceding::*", ["head", "title", "p.1"]);
    });

    test("11", function () {
      assertEvaluatesToNodeSet("id('t2')/preceding::*", ["head", "title", "p.1", "li#t1", "li"]);
    });

    test("12", function () {
      assertEvaluatesToNodeSet("id('t3')/preceding::*", ["head", "title", "div", "p.1", "ul", "li#t1", "li", "li#t2", "p.2", "p.3"]);
    });

    test("13", function () {
      assertEvaluatesToNodeSet("id('t4')/preceding::*", ["head", "title", "div", "p.1", "ul", "li#t1", "li", "li#t2", "p.2", "p.3", "li#t3", "li"]);
    });

    test("14", function () {
      assertEvaluatesToNodeSet("id('t1')/following::*[1]", ["li"]);
    });

    test("15", function () {
      assertEvaluatesToNodeSet("id('t2')/following::*[1]", ["p.2"]);
    });

    test("16", function () {
      assertEvaluatesToNodeSet("id(\"t3\")/following::*[1]", ["li"]);
    });

    test("17", function () {
      assertEvaluatesToNodeSet("id(\"t4\")/following::*[1]", ["p.4"]);
    });

    test("18", function () {
      assertEvaluatesToNodeSet("id(\"t3 t4\")/following::*[1]", ["li", "p.4"]);
    });

    test("19", function () {
      assertEvaluatesToNodeSet("id(\"t2 t3 t4\")/following::*[1]", ["p.2", "li", "p.4"]);
    });

    test("20", function () {
      assertEvaluatesToNodeSet("id(\"t1 t2 t3 t4\")/following::*[1]", ["li", "p.2", "li", "p.4"]);
    });

    test("21", function () {
      assertEvaluatesToNodeSet("id(\"t1 t2 t3 t4\")/preceding::*[1]", ["p.1", "li", "p.3", "li"]);
    });

    test("22", function () {
      assertEvaluatesToNodeSet("id(\"t1 t2 t3\")/preceding::*[1]", ["p.1", "li", "p.3"]);
    });

    test("23", function () {
      assertEvaluatesToNodeSet("id(\"t1 t2\")/preceding::*[1]", ["p.1", "li"]);
    });

    test("24", function () {
      assertEvaluatesToNodeSet("id(\"t1\")/preceding::*[1]", ["p.1"]);
    });

    test("25", function () {
      assertEvaluatesToNodeSet("id(\"t2\")/preceding::*[1]", ["li"]);
    });

    test("26", function () {
      assertEvaluatesToNodeSet("id(\"t3\")/preceding::*[1]", ["p.3"]);
    });

    test("27", function () {
      assertEvaluatesToNodeSet("id(\"t4\")/preceding::*[1]", ["li"]);
    });
  });
});
