# xpath-react

[![Build Status](https://travis-ci.org/badeball/xpath-react.svg?branch=master)](https://travis-ci.org/badeball/xpath-react)

A React adapter for [xpath-evaluator][xpath-evaluator]. Together with its
dependencies, it allows you to query the internal DOM of [React][react] with
XPath 1.0 expressions.

## Table of Contents

[xpath-evaluator]: https://github.com/badeball/xpath-evaluator
[react]: https://facebook.github.io/react/

* [Installation](#installation)
* [Usage](#usage)
  * [evaluate](#xpathevaluate)
  * [render](#xpathutilsrender)
  * [find](#xpathutilsfind)
  * [Simulate.\<eventName\>](#xpathutilssimulateeventname)
* [Known issues](#known-issues)

## Installation

The package can be installed with `npm`.

```
$ npm install xpath-react
```

## Usage

The library provides a basic `evaluate` method that you might commonly know as
[Document.evaluate][document-evaluate]. Additionally, three convenience method
exist to make usage more practical, as `evaluate` is a bit cumbersome. A
practical example can be found in [example/][example]. You may also find a blog
post about it [here][blog], which also contains some examples.

[example]: example/
[blog]: http://badeball.github.io/2015/09/29/unit-testing-react-components-with-xpath.html

### XPath.evaluate

```
XPathResult XPath.evaluate (
  DOMString expression,
  ReactElement contextNode,
  XPathNSResolver resolver,
  XPathResultType type,
  XPathResult result
)
```

This method works in the same way as [Document.evaluate][document-evaluate],
but accepts a `ReactElement` instead of a `Node`.

#### Example

```javascript
var XPath = require("xpath-react/register");

var Foo = (
  <ul>
    <li>bar</li>
    <li>baz</li>
  </ul>
);

var result = XPath.evaluate("string(.//li[1])", Foo, null, XPath.XPathResult.STRING_TYPE);

result.stringValue; // => "bar"
```

[document-evaluate]: https://developer.mozilla.org/en-US/docs/Web/API/Document/evaluate

### XPathUtils.render

```
ReactElement XPathUtils.render (
  ReactComponent element
)
```

[Shallowly render][shallow-rendering] a component.

[shallow-rendering]: https://facebook.github.io/react/docs/test-utils.html#shallow-rendering

##### Example

```javascript
var XPathUtils = require("xpath-react/utils");

var Foo = React.createClass({
  render: function () {
    return (
      <div>
        <p>Hello world!</p>
      </div>
    );
  }
});

var output = XPathUtils.render(<Foo />);

output.props.children.props.children; // => "Hello world!"
```

### XPathUtils.find

```
(ReactElement | String | Number | Boolean) XPathUtils.find (
  ReactElement element,
  DOMString expression
)
```

Finds React elements inside another element. It can also be used to query for
string, number and boolean values (e.g. attributes, element counts and
conditions, respectively).

##### Example

```javascript
var XPathUtils = require("xpath-react/utils");

var Foo = React.createClass({
  render: function () {
    return (
      <div>
        <p>Hello world!</p>
      </div>
    );
  }
});

var output = XPathUtils.render(<Foo />);

XPathUtils.find(output, ".//p"); // => ReactElement { type: "p", ... }
XPathUtils.find(output, "string(.//p)"); // => "Hello world!"
XPathUtils.find(output, "count(.//p)"); // => 1
XPathUtils.find(output, "count(.//p) = 1"); // => true
```

### XPathUtils.Simulate.{eventName}

```
XPathUtils.Simulate.{eventName} (
  ReactElement element,
  [Object eventData]
)
```

Invokes the event handler of an element with optional event data.

##### Example

```javascript
var XPathUtils = require("xpath-react/utils");

var Foo = React.createClass({
  render: function () {
    return (
      <div>
        <button onClick={this.props.onClick}>
          Hello world!
        </button>
      </div>
    );
  }
});

var onClick = Sinon.spy();

var output = XPathUtils.render(<Foo onClick={onClick} />);

var button = XPathUtils.find(output, ".//button[contains(., 'Hello world!')]");

XPathUtils.Simulate.click(button);

onClick.should.have.been.called;
```

## Known issues

* There are no document root element in React's internal DOM. Instead, the
  first element will act as the root element. This means that while the
  following normal XPath expression would yield the HTML node, it would yield
  blank with xpath-react.

  ```xpath
  /html
  ```

* The `id()` function is context depdendant, i.e. it will only find elements
  with the id in the object tree of the context.

* The `ancestor`, `ancestor-or-self`, `following`, `following-sibling`,
  `parent`, `preceding` and `preceding-sibling` axes are not suppoerted. This
  is due to the inability to determine the parent of a React element and the
  inability to comparing document positions.

* The `..` abbreviation is not supported. This is due to the inability to
  determine the parent of a React element.

* Result type of `ORDERED_NODE_ITERATOR_TYPE` and `ORDERED_NODE_SNAPSHOT_TYPE`
  may not actually be orderered. Result of type `FIRST_ORDERED_NODE_TYPE` may
  not actually be the first node. The reason for this is the inability to
  comparing document positions.

* Absolute location paths are not supported. This is due to the inability to
  determine the parent of a React element and therefore the root node.

* Namespaces are not supported because JSX does not support them.
