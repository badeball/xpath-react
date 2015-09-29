# xpath-react

[![Build Status](https://travis-ci.org/badeball/xpath-react.svg?branch=master)](https://travis-ci.org/badeball/xpath-react)

A React adapter for [xpath-evaluator][xpath-evaluator]. Together with its
dependencies, it allows you to query the internal DOM of [React][react] with
XPath 1.0 expressions.

[xpath-evaluator]: https://github.com/badeball/xpath-evaluator
[react]: https://facebook.github.io/react/

## Installation

The package can be installed with `npm`.

```
$ npm install xpath-react
```

## Usage

[This][example] example shows how you can make assertions about the renderings
of a React component, as well as to create a helper utility to simulate user
interaction without depending on a browser environment at all. You may also
find a blog post about it [here][blog], which also contains some examples.

[example]: example/
[blog]: http://badeball.github.io/2015/09/29/unit-testing-react-components-with-xpath.html

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
  `parent`, `preceding` and `preceding-sibling` are not suppoerted. This is due
  to the inability to determine the parent of a React element and the inability
  to comparing document positions.

* The `..` abbreviation is not supported. This is due to the inability to
  determine the parent of a React element.

* Result type of `ORDERED_NODE_ITERATOR_TYPE` and `ORDERED_NODE_SNAPSHOT_TYPE`
  may not actually be orderered. Result of type `FIRST_ORDERED_NODE_TYPE` may
  not actually be the first node. The reason for this is the inability to
  comparing document positions.

* Absolute location paths are not supported. This is due to the inability to
  determine the parent of a React element and therefore the root node.

* Namespaces are not supported because JSX does not support them.
