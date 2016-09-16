# xpath-react

[![Build Status](https://travis-ci.org/badeball/xpath-react.svg?branch=master)](https://travis-ci.org/badeball/xpath-react)
[![Code Climate](https://codeclimate.com/github/badeball/xpath-react/badges/gpa.svg)](https://codeclimate.com/github/badeball/xpath-react)
[![Test Coverage](https://codeclimate.com/github/badeball/xpath-react/badges/coverage.svg)](https://codeclimate.com/github/badeball/xpath-react/coverage)

A React adapter for [xpath-evaluator][xpath-evaluator]. Together with its
dependencies, it allows you to query the internal DOM of [React][react] with
XPath 1.0 expressions and thus testing it without a real DOM.

## Table of Contents

[xpath-evaluator]: https://github.com/badeball/xpath-evaluator
[react]: https://facebook.github.io/react/

* [Installation](#installation)
* [Usage](#usage)
  * [evaluate](#xpathevaluate)
  * [render](#xpathutilsrender)
  * [find](#xpathutilsfind)
  * [Simulate.\<eventName\>](#xpathutilssimulateeventname)
* [Known issues & limitations](#known-issues--limitations)

## Installation

The package can be installed with `npm`.

```
$ npm install xpath-react
```

A couple peer dependencies is expected to be available. The library is
compatible with both react-0.14.x and react-15.x.x.

```
$ npm install xpath-evaluator react react-addons-test-utils
```

## Usage

The library provides a basic `evaluate` method that you might commonly know as
[Document.evaluate][document-evaluate]. Additionally, three convenience method
exist to make usage more practical, as `evaluate` is a bit cumbersome. A
practical example can be found in [example/][example].

[example]: example/

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

You can also use it to assert presence of unrendered child components, as shown
below. This assumes that the child component has a `displayName` property.

```javascript
var Bar = React.createClass({
  render: function () {
    return (
      <div>
        <Foo />
      </div>
    );
  }
});

var output = XPathUtils.render(<Bar />);

XPathUtils.find(output, "count(.//Foo)"); // => 1
```

### XPathUtils.Simulate.{eventName}

```
XPathUtils.Simulate.{eventName} (
  ReactElement element,
  [DOMString expression],
  [Object eventData]
)
```

Invokes the event handler of an element with optional event data. It also
accepts an expression argument, where which the matching element's event
handler will be invoked.

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

XPathUtils.Simulate.click(output, ".//button[contains(., 'Hello world!')]");

var button = XPathUtils.find(output, ".//button[contains(., 'Hello world!')]");

XPathUtils.Simulate.click(button);

onClick.should.have.been.calledTwice;
```

## Known issues & limitations

* An abstract document node is created internally around the context node
  provided by the user. This can however not be returned, meaning that the
  following XPath expression would yield an error.

  ```xpath
  /self::node()
  ```

* Namespaces are not supported because JSX does not support them.
