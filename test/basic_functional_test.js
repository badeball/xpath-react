/* eslint-env mocha, node */

"use strict";

/* eslint-disable no-unused-vars */
var React = require("react");
/* eslint-enable no-unused-vars */

var Helper = require("./helper");

var document = (
    <body>
      <div id='n1' title='1' className='26'>
        <dl id='n2' title='2' className='3'>
          <dt id='n3' title='3' className='1'>dt</dt>
          <dd id='n4' title='4' className='2'>dd</dd>
        </dl>
        <center id='n5' title='5' className='22'>
          <h1 id='n6' title='6' className='6'>
            <em id='n7' title='7' className='4'>em</em>
            <strong id='n8' title='8' className='5'>strong</strong>
          </h1>
          <h2 id='n9' title='9' className='9'>
            <b id='n10' title='10' className='7'>b</b>
            <s id='n11' title='11' className='8'>s</s>
          </h2>
          <blockquote id='n12' title='12' className='15'>
            blockquoteText1:
            <br id='n13' title='13' className='10'/>
            blockquoteText2
            <p id='n14' title='14' className='13'>
              <del id='n15' title='15' className='11'>del</del>
              <ins id='n16' title='16' className='12'>ins</ins>
            </p>
            <font id='n17' title='17' className='14' face='n8 n26'>font</font>
          </blockquote>
          <h3 id='n18' title='18' className='18'>
            <dfn id='n19' title='19' className='16'>dfn</dfn>
            <a id='n20' title='20' className='17'>a</a>
          </h3>
          <h4 id='n21' title='21' className='21'>
            <sub id='n22' title='22' className='19'>sub</sub>
            <sup id='n23' title='23' className='20'>sup</sup>
          </h4>
        </center>
        <span id='n24' title='24' className='25'>
          <acronym id='n25' title='25' className='23'>acronym</acronym>
          <q id='n26' title='26' className='24' cite='n8 n17'>q</q>
        </span>
      </div>
    </body>
);

var assertEvaluatesToNodeSet = Helper.assertEvaluatesToNodeSet.bind(null, document);

suite("XPathDOM", function () {
  suite("basic functional", function () {
    test("00", function () {
      assertEvaluatesToNodeSet(".//blockquote/*", ["br", "p", "font"]);
    });

    test("01", function () {
      assertEvaluatesToNodeSet(".//blockquote/child::*", ["br", "p", "font"]);
    });

    test.skip("02", function () {
      assertEvaluatesToNodeSet(".//blockquote/parent::*", ["center"]);
    });

    test("03", function () {
      assertEvaluatesToNodeSet(".//blockquote/descendant::*", ["br", "p", "del", "ins", "font"]);
    });

    test("04", function () {
      assertEvaluatesToNodeSet(".//blockquote/descendant-or-self::*", ["blockquote", "br", "p", "del", "ins", "font"]);
    });

    test.skip("05", function () {
      assertEvaluatesToNodeSet(".//blockquote/ancestor::*", ["html", "body", "div", "center"]);
    });

    test.skip("06", function () {
      assertEvaluatesToNodeSet(".//blockquote/ancestor-or-self::*", ["html", "body", "div", "center", "blockquote"]);
    });

    test.skip("07", function () {
      assertEvaluatesToNodeSet(".//blockquote/following-sibling::*", ["h3", "h4"]);
    });

    test.skip("08", function () {
      assertEvaluatesToNodeSet(".//blockquote/preceding-sibling::*", ["h1", "h2"]);
    });

    test.skip("09", function () {
      assertEvaluatesToNodeSet(".//blockquote/following::*", ["h3", "dfn", "a", "h4", "sub", "sup", "span", "acronym", "q"]);
    });

    test.skip("10", function () {
      assertEvaluatesToNodeSet(".//blockquote/preceding::*", ["head", "title", "dl", "dt", "dd", "h1", "em", "strong", "h2", "b", "s"]);
    });

    test("11", function () {
      assertEvaluatesToNodeSet(".//blockquote/self::*", ["blockquote"]);
    });

    test.skip("12", function () {
      assertEvaluatesToNodeSet(".//blockquote/attribute::id/parent::*", ["blockquote"]);
    });

    test.skip("13", function () {
      assertEvaluatesToNodeSet(".//blockquote/@id/parent::*", ["blockquote"]);
    });

    test("14", function () {
      assertEvaluatesToNodeSet(".//*[blockquote]", ["center"]);
    });

    test("15", function () {
      assertEvaluatesToNodeSet(".//*[child::blockquote]", ["center"]);
    });

    test.skip("16", function () {
      assertEvaluatesToNodeSet(".//*[parent::blockquote]", ["br", "p", "font"]);
    });

    test("17", function () {
      assertEvaluatesToNodeSet(".//*[descendant::blockquote]", ["div", "center"]);
    });

    test("18", function () {
      assertEvaluatesToNodeSet(".//*[descendant-or-self::blockquote]", ["div", "center", "blockquote"]);
    });

    test.skip("19", function () {
      assertEvaluatesToNodeSet(".//*[ancestor::blockquote]", ["br", "p", "del", "ins", "font"]);
    });

    test.skip("20", function () {
      assertEvaluatesToNodeSet(".//*[ancestor-or-self::blockquote]", ["blockquote", "br", "p", "del", "ins", "font"]);
    });

    test.skip("21", function () {
      assertEvaluatesToNodeSet(".//*[following-sibling::blockquote]", ["h1", "h2"]);
    });

    test.skip("22", function () {
      assertEvaluatesToNodeSet(".//*[preceding-sibling::blockquote]", ["h3", "h4"]);
    });

    test.skip("23", function () {
      assertEvaluatesToNodeSet(".//*[following::blockquote]", ["dl", "dt", "dd", "h1", "em", "strong", "h2", "b", "s"]);
    });

    test.skip("24", function () {
      assertEvaluatesToNodeSet(".//*[preceding::blockquote]", ["h3", "dfn", "a", "h4", "sub", "sup", "span", "acronym", "q"]);
    });

    test("25", function () {
      assertEvaluatesToNodeSet(".//*[self::blockquote]", ["blockquote"]);
    });

    test("26", function () {
      assertEvaluatesToNodeSet(".//*[@id]", ["div", "dl", "dt", "dd", "center", "h1", "em", "strong", "h2", "b", "s", "blockquote", "br", "p", "del", "ins", "font", "h3", "dfn", "a", "h4", "sub", "sup", "span", "acronym", "q"]);
    });

    test("27", function () {
      assertEvaluatesToNodeSet(".//*[attribute::id]", ["div", "dl", "dt", "dd", "center", "h1", "em", "strong", "h2", "b", "s", "blockquote", "br", "p", "del", "ins", "font", "h3", "dfn", "a", "h4", "sub", "sup", "span", "acronym", "q"]);
    });

    test("28", function () {
      assertEvaluatesToNodeSet(".//blockquote/text()", [
        "text(blockquoteText1:)",
        "text(blockquoteText2)"
      ]);
    });

    test("29", function () {
      assertEvaluatesToNodeSet(".//blockquote/p", ["p"]);
    });

    test("30", function () {
      assertEvaluatesToNodeSet(".//blockquote/*", ["br", "p", "font"]);
    });

    test.skip("31", function () {
      assertEvaluatesToNodeSet(".//*[child::* and preceding::font]", ["h3", "h4", "span"]);
    });

    test.skip("32", function () {
      assertEvaluatesToNodeSet(".//*[not(child::*) and preceding::font]", ["dfn", "a", "sub", "sup", "acronym", "q"]);
    });

    test.skip("33", function () {
      assertEvaluatesToNodeSet(".//*[preceding::blockquote or following::blockquote]", ["dl", "dt", "dd", "h1", "em", "strong", "h2", "b", "s", "h3", "dfn", "a", "h4", "sub", "sup", "span", "acronym", "q"]);
    });

    test.skip("34", function () {
      assertEvaluatesToNodeSet(".//blockquote/ancestor::* | .//blockquote/descendant::*", ["html", "body", "div", "center", "br", "p", "del", "ins", "font"]);
    });

    test("35", function () {
      assertEvaluatesToNodeSet(".//*[.='sub']", ["sub"]);
    });

    test("36", function () {
      assertEvaluatesToNodeSet(".//*[@title > 12 and @class < 15]", ["br", "p", "del", "ins", "font"]);
    });

    test("37", function () {
      assertEvaluatesToNodeSet(".//*[@title != @class]", ["div", "dl", "dt", "dd", "center", "em", "strong", "b", "s", "blockquote", "br", "p", "del", "ins", "font", "dfn", "a", "sub", "sup", "span", "acronym", "q"]);
    });

    test("38", function () {
      assertEvaluatesToNodeSet(".//*[((@class * @class + @title * @title) div (@class + @title)) > ((@class - @title) * (@class - @title))]", ["dl", "h1", "h2", "s", "blockquote", "br", "p", "font", "h3", "dfn", "a", "h4", "sub", "sup", "span", "acronym", "q"]);
    });

    test("39", function () {
      assertEvaluatesToNodeSet(".//*[@title mod 2 = 0]", ["dl", "dd", "h1", "strong", "b", "blockquote", "p", "ins", "h3", "a", "sub", "span", "q"]);
    });

    test("40", function () {
      assertEvaluatesToNodeSet(".//blockquote/child::*[last()]", ["font"]);
    });

    test("41", function () {
      assertEvaluatesToNodeSet(".//blockquote/descendant::*[position() < 4]", ["br", "p", "del"]);
    });

    test("42", function () {
      assertEvaluatesToNodeSet("id(.//font/@face)", ["strong", "q"]);
    });

    test("45", function () {
      assertEvaluatesToNodeSet(".//blockquote/child::*[2]", ["p"]);
    });

    test("46", function () {
      assertEvaluatesToNodeSet(".//blockquote/descendant::*[4]", ["ins"]);
    });

    test("47", function () {
      assertEvaluatesToNodeSet(".//blockquote/descendant-or-self::*[4]", ["del"]);
    });

    test.skip("48", function () {
      assertEvaluatesToNodeSet(".//blockquote/ancestor::*[2]", ["div"]);
    });

    test.skip("49", function () {
      assertEvaluatesToNodeSet(".//blockquote/ancestor-or-self::*[2]", ["center"]);
    });

    test.skip("50", function () {
      assertEvaluatesToNodeSet(".//blockquote/following-sibling::*[1]", ["h3"]);
    });

    test.skip("51", function () {
      assertEvaluatesToNodeSet(".//blockquote/preceding-sibling::*[1]", ["h2"]);
    });

    test.skip("52", function () {
      assertEvaluatesToNodeSet(".//blockquote/following::*[4]", ["h4"]);
    });

    test.skip("53", function () {
      assertEvaluatesToNodeSet(".//blockquote/preceding::*[4]", ["strong"]);
    });

    test("54", function () {
      assertEvaluatesToNodeSet(".//*[starts-with(.,'s')]", ["strong", "s", "h4", "sub", "sup"]);
    });

    test("55", function () {
      assertEvaluatesToNodeSet(".//*[string(@title - 1) = '0']", ["div"]);
    });

    test("56", function () {
      assertEvaluatesToNodeSet(".//*[string() = 'sub']", ["sub"]);
    });

    test("57", function () {
      assertEvaluatesToNodeSet(".//*[string(.) = 'sub']", ["sub"]);
    });

    test.skip("58", function () {
      assertEvaluatesToNodeSet(".//*[normalize-space(concat(.,..)) = 'sub sub sup']", ["sub"]);
    });

    test("59", function () {
      assertEvaluatesToNodeSet("/sub[concat(.,..) = 'subsub sup ']", []);
    });

    test.skip("60", function () {
      assertEvaluatesToNodeSet(".//node()[normalize-space(concat(.,..,../..)) = 'bb b s']", ["text(b)"]);
    });

    test.skip("61", function () {
      assertEvaluatesToNodeSet(".//node()[concat(.,..,../..) = 'bbb s ']", []);
    });

    test("62", function () {
      assertEvaluatesToNodeSet(".//*[substring-before(.,'u') = 's']", ["h4", "sub", "sup"]);
    });

    test("63", function () {
      assertEvaluatesToNodeSet(".//*[substring-after(.,'on') = 't']", ["blockquote", "font"]);
    });

    test("64", function () {
      assertEvaluatesToNodeSet(".//*[substring(.,2,1) = 'u']", ["h4", "sub", "sup"]);
    });

    test("65", function () {
      assertEvaluatesToNodeSet(".//*[substring(.,2) = 'up']", ["sup"]);
    });

    test("66", function () {
      assertEvaluatesToNodeSet(".//*[contains(.,'b')]", ["div", "center", "h2", "b", "blockquote", "h4", "sub"]);
    });

    test("67", function () {
      assertEvaluatesToNodeSet(".//*[name() != 'dt' and name() != 'dd' and string-length() = 3]", ["del", "ins", "dfn", "sub", "sup"]);
    });

    test("68", function () {
      assertEvaluatesToNodeSet(".//*[string-length(normalize-space(.)) = 3]", ["del", "ins", "dfn", "sub", "sup"]);
    });

    test("69", function () {
      assertEvaluatesToNodeSet(".//*[.=translate(normalize-space('  s  u  b  '),' ','')]", ["sub"]);
    });

    test("70", function () {
      assertEvaluatesToNodeSet(".//*[normalize-space()='q']", ["q"]);
    });

    test("71", function () {
      assertEvaluatesToNodeSet(".//*[boolean(@title - 1) = false()]", ["div"]);
    });

    test("72", function () {
      assertEvaluatesToNodeSet(".//*[not(@title - 1) = true()]", ["div"]);
    });

    test("73", function () {
      assertEvaluatesToNodeSet(".//*[number(@title) < number(@class)]", ["div", "dl", "center", "blockquote", "span"]);
    });

    test.skip("74", function () {
      assertEvaluatesToNodeSet(".//*[sum(ancestor::*/@title) < sum(descendant::*/@title)]", ["div", "dl", "center", "h1", "h2", "blockquote", "p", "h3", "h4", "span"]);
    });

    test("75", function () {
      assertEvaluatesToNodeSet(".//*[floor(@title div @class) = 1]", ["h1", "em", "strong", "h2", "b", "s", "br", "p", "del", "ins", "font", "h3", "dfn", "a", "h4", "sub", "sup", "acronym", "q"]);
    });

    test("76", function () {
      assertEvaluatesToNodeSet(".//*[ceiling(@title div @class) = 1]", ["div", "dl", "center", "h1", "h2", "blockquote", "h3", "h4", "span"]);
    });

    test("77", function () {
      assertEvaluatesToNodeSet(".//*[round(@title div @class) = 1]", ["dl", "h1", "h2", "b", "s", "blockquote", "br", "p", "del", "ins", "font", "h3", "dfn", "a", "h4", "sub", "sup", "span", "acronym", "q"]);
    });

    test.skip("78", function () {
      assertEvaluatesToNodeSet("/..", []);
    });
  });
});
