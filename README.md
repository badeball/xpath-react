# xpath-react

[![Build Status](https://travis-ci.org/badeball/xpath-react.svg?branch=master)](https://travis-ci.org/badeball/xpath-react)
[![Code Climate](https://codeclimate.com/github/badeball/xpath-react/badges/gpa.svg)](https://codeclimate.com/github/badeball/xpath-react)
[![Test Coverage](https://codeclimate.com/github/badeball/xpath-react/badges/coverage.svg)](https://codeclimate.com/github/badeball/xpath-react/coverage)

`xpath-react` is a library that allows you to query the virtual DOM of
[React][react] with XPath 1.0 expressions and thus testing it without a real
DOM.

## Table of Contents

[xpath-evaluator]: https://github.com/badeball/xpath-evaluator
[react]: https://facebook.github.io/react/

* [Installation](#installation)
* [Usage](#usage)
  * [evaluate()](#xpathevaluate)
  * [find()](#xpathutilsfind)
* [Known issues & limitations](#known-issues--limitations)

## Installation

The package can be installed with `npm`.

```
$ npm install xpath-react
```

React is a peer dependency and is expected to be available. The library is
compatible with both react-15.5.x and react-16.x.x.

```
$ npm install react
```

## Usage

The library provides a basic `evaluate` method that you might commonly know as
[Document.evaluate][document-evaluate]. Additionally, a convenience method
exist to make usage more practical, as `evaluate` is a bit cumbersome. A
practical example can be found in [example/][example].

[example]: example/

### evaluate()

```
XPathResult evaluate (
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
import { evaluate, XPathResult } from "xpath-react";

const Foo = (
  <ul>
    <li>bar</li>
    <li>baz</li>
  </ul>
);

const result = evaluate("string(.//li[1])", Foo, null, XPathResult.STRING_TYPE);

result.stringValue; // => "bar"
```

[document-evaluate]: https://developer.mozilla.org/en-US/docs/Web/API/Document/evaluate

### find()

```
(ReactElement | String | Number | Boolean) find (
  ReactElement element,
  DOMString expression
)
```

Finds React elements inside another element. It can also be used to query for
string, number and boolean values (e.g. attributes, element counts and
conditions, respectively).

##### Example

```javascript
import ShallowRenderer from "react-test-renderer/shallow";

import { find } from "xpath-react";

function shallow (component) {
  const renderer = new ShallowRenderer();
  renderer.render(component);
  return renderer.getRenderOutput();
}

class Foo extends React.Component {
  render() {
    return (
      <div>
        <p>Hello world!</p>
      </div>
    );
  }
}

const output = shallow(<Foo />);

find(output, ".//p"); // => ReactElement { type: "p", ... }
find(output, "string(.//p)"); // => "Hello world!"
find(output, "count(.//p)"); // => 1
find(output, "count(.//p) = 1"); // => true
```

You can also use it to assert presence of unrendered child components, as shown
below. This assumes that the child component has a `displayName` property.

```javascript
class Bar extends React.Component {
  render() {
    return (
      <div>
        <Foo />
      </div>
    );
  }
}

const output = shallow(<Bar />);

find(output, "count(.//Foo)"); // => 1
```

## Known issues & limitations

* An abstract document node is created internally around the context node
  provided by the user. This can however not be returned, meaning that the
  following XPath expression would yield an error.

  ```xpath
  /self::node()
  ```

* Namespaces are not supported because JSX does not support them.
