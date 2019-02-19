import { isValidElement } from 'react';

var lexer = new RegExp([
    "\\$?(?:(?![0-9-])[\\w-]+:)?(?![0-9-])[\\w-]+",
    "\\d+\\.\\d+",
    "\\.\\d+",
    "\\d+",
    "\\/\\/",
    "/",
    "\\.\\.",
    "\\.",
    "\\s+",
    "::",
    ",",
    "@",
    "-",
    "=",
    "!=",
    "<=",
    "<",
    ">=",
    ">",
    "\\|",
    "\\+",
    "\\*",
    "\\(",
    "\\)",
    "\\[",
    "\\]",
    "\"[^\"]*\"",
    "'[^']*'"
].join("|"), "g");
class XPathLexer {
    constructor(expression) {
        var match = expression.match(lexer);
        if (match === null) {
            throw new Error("Invalid character at position 0");
        }
        if (match.join("") !== expression) {
            var position = 0;
            for (var i = 0; i < match.length; i++) {
                if (expression.indexOf(match[i]) !== position) {
                    break;
                }
                position += match[i].length;
            }
            throw new Error("Invalid character at position " + position);
        }
        this.tokens = match.map(function (token) {
            return {
                value: token,
                position: 0
            };
        });
        this.tokens.reduce(function (previousToken, nextToken) {
            nextToken.position = previousToken.position + previousToken.value.length;
            return nextToken;
        });
        this.tokens = this.tokens.filter(function (token) {
            return !/^\s+$/.test(token.value);
        });
        this.index = 0;
    }
    length() {
        return this.tokens.length;
    }
    next() {
        if (this.index === this.tokens.length) {
            return null;
        }
        else {
            var token = this.tokens[this.index++];
            return token && token.value;
        }
    }
    back() {
        if (this.index > 0) {
            this.index--;
        }
    }
    peak(n) {
        var token = this.tokens[this.index + (n || 0)];
        return token && token.value;
    }
    empty() {
        return this.tokens.length <= this.index;
    }
    position() {
        if (this.index === this.tokens.length) {
            var lastToken = this.tokens[this.index - 1];
            return lastToken.position + lastToken.value.length;
        }
        else {
            return this.tokens[this.index].position;
        }
    }
}

var ABSOLUTE_LOCATION_PATH = "absolute-location-path";
var ADDITIVE = "additive";
var AND = "and";
var DIVISIONAL = "divisional";
var EQUALITY = "equality";
var FILTER = "filter";
var FUNCTION_CALL = "function-call";
var GREATER_THAN = "greater-than";
var GREATER_THAN_OR_EQUAL = "greater-than-or-equal";
var INEQUALITY = "inequality";
var LESS_THAN = "less-than";
var LESS_THAN_OR_EQUAL = "less-than-or-equal";
var LITERAL = "literal";
var MODULUS = "modulus";
var MULTIPLICATIVE = "multiplicative";
var NEGATION = "negation";
var NUMBER = "number";
var OR = "or";
var PATH = "path";
var RELATIVE_LOCATION_PATH = "relative-location-path";
var SUBTRACTIVE = "subtractive";
var UNION = "union";

var ANCESTOR = "ancestor";
var ANCESTOR_OR_SELF = "ancestor-or-self";
var ATTRIBUTE = "attribute";
var CHILD = "child";
var DESCENDANT = "descendant";
var DESCENDANT_OR_SELF = "descendant-or-self";
var FOLLOWING = "following";
var FOLLOWING_SIBLING = "following-sibling";
var NAMESPACE = "namespace";
var PARENT = "parent";
var PRECEDING = "preceding";
var PRECEDING_SIBLING = "preceding-sibling";
var SELF = "self";

var AXES = [
  ANCESTOR,
  ANCESTOR_OR_SELF,
  ATTRIBUTE,
  CHILD,
  DESCENDANT,
  DESCENDANT_OR_SELF,
  FOLLOWING,
  FOLLOWING_SIBLING,
  NAMESPACE,
  PARENT,
  PRECEDING,
  PRECEDING_SIBLING,
  SELF
];

var COMMENT = "comment";
var NODE = "node";
var PROCESSING_INSTRUCTION = "processing-instruction";
var TEXT = "text";

var NODE_TYPES = [
  COMMENT,
  NODE,
  PROCESSING_INSTRUCTION,
  TEXT
];

function parse (rootParser, lexer) {
  lexer.next();

  var predicate = rootParser.parse(lexer);

  if (lexer.peak() === "]") {
    lexer.next();
  } else {
    throw new Error("Invalid token at position " + lexer.position() + ", expected closing bracket");
  }

  return predicate;
}

function isValid (type) {
  for (var i = 0; i < NODE_TYPES.length; i++) {
    if (NODE_TYPES[i] === type) {
      return true;
    }
  }

  return false;
}

function parse$1 (rootParser, lexer) {
  var functionCall = {
    type: FUNCTION_CALL,
    name: lexer.next()
  };

  lexer.next();

  if (lexer.peak() === ")") {
    lexer.next();
  } else {
    functionCall.args = [];

    while (lexer.peak() !== ")") {
      functionCall.args.push(rootParser.parse(lexer));

      if (lexer.peak() === ",") {
        lexer.next();
      }
    }

    lexer.next();
  }

  return functionCall;
}

function parse$2 (rootParser, lexer) {
  var token = lexer.peak(),
      ch = token && token[0];

  if (ch === "(") {
    lexer.next();

    var expr = rootParser.parse(lexer);

    if (lexer.peak() === ")") {
      lexer.next();
    } else {
      throw new Error("Invalid token at position " + lexer.position() + ", expected closing parenthesis");
    }

    return expr;
  }

  if (ch === "\"" || ch === "'") {
    lexer.next();

    return {
      type: LITERAL,
      string: token.slice(1, -1)
    };
  }

  if (ch === "$") {
    throw Error("Variable reference are not implemented");
  }

  if (/^\d+$/.test(token) || /^(\d+)?\.\d+$/.test(token)) {
    lexer.next();

    return {
      type: NUMBER,
      number: parseFloat(token)
    };
  }

  if (lexer.peak(1) === "(" && !isValid(lexer.peak())) {
    return parse$1(rootParser, lexer);
  }
}

function isValidOp (lexer) {
  var token = lexer.peak(),
      ch = token && token[0];

  return ch === "(" ||
    ch === "\"" ||
    ch === "'" ||
    ch === "$" ||
    /^\d+$/.test(token) ||
    /^(\d+)?\.\d+$/.test(token) ||
    (lexer.peak(1) === "(" && !isValid(lexer.peak()));
}

function parse$3 (rootParser, lexer) {
  var primary = parse$2(rootParser, lexer);

  if (lexer.peak() === "[") {
    var filter = {
      type: FILTER,
      primary: primary,
      predicates: []
    };

    while (lexer.peak() === "[") {
      filter.predicates.push(parse(rootParser, lexer));
    }

    return filter;
  } else {
    return primary;
  }
}

function isValidOp$1 (lexer) {
  return isValidOp(lexer);
}

function isValid$1 (specifier) {
  for (var i = 0; i < AXES.length; i++) {
    if (AXES[i] === specifier) {
      return true;
    }
  }

  return false;
}

function parse$4 (rootParser, lexer) {
  if (lexer.peak() === "*") {
    lexer.next();

    return {
      name: "*"
    };
  }

  if (lexer.peak(1) === "(") {
    if (isValid(lexer.peak())) {
      var test = {
        type: lexer.next()
      };

      lexer.next();

      if (test.type === PROCESSING_INSTRUCTION) {
        var token = lexer.peak(),
            ch = token && token[0];

        if (ch === "\"" || ch === "'") {
          test.name = lexer.next().slice(1, -1);
        }
      }

      if (lexer.peak() !== ")") {
        throw new Error("Invalid token at position " + lexer.position() + ", expected closing parenthesis");
      } else {
        lexer.next();
      }

      return test;
    } else {
      throw new Error("Invalid node type at position " + lexer.position());
    }
  }

  return {
    name: lexer.next()
  };
}

function parse$5 (rootParser, lexer) {
  var step = {};

  if (lexer.peak(1) === "::") {
    if (isValid$1(lexer.peak())) {
      step.axis = lexer.next();

      lexer.next();
    } else {
      throw new Error("Invalid axis specifier at position " + lexer.position());
    }
  } else if (lexer.peak() === "@") {
    lexer.next();

    step.axis = ATTRIBUTE;
  } else if (lexer.peak() === "..") {
    lexer.next();

    return {
      axis: PARENT,
      test: {
        type: NODE
      }
    };
  } else if (lexer.peak() === ".") {
    lexer.next();

    return {
      axis: SELF,
      test: {
        type: NODE
      }
    };
  } else {
    step.axis = CHILD;
  }

  step.test = parse$4(rootParser, lexer);

  while (lexer.peak() === "[") {
    if (!step.predicates) {
      step.predicates = [];
    }

    step.predicates.push(parse(rootParser, lexer));
  }

  return step;
}

function isValidOp$2 (lexer) {
  var token = lexer.peak();

  if (typeof token !== "string") {
    return false;
  }

  return token === "." ||
    token === ".." ||
    token === "@" ||
    token === "*" ||
    /^\w/.test(token);
}

function parse$6 (rootParser, lexer) {
  var absoluteLocation = {
    type: ABSOLUTE_LOCATION_PATH
  };

  while (!lexer.empty() && lexer.peak()[0] === "/") {
    if (!absoluteLocation.steps) {
      absoluteLocation.steps = [];
    }

    if (lexer.next() === "/") {
      if (isValidOp$2(lexer)) {
        absoluteLocation.steps.push(parse$5(rootParser, lexer));
      }
    } else {
      absoluteLocation.steps.push({
        axis: DESCENDANT_OR_SELF,
        test: {
          type: NODE
        }
      });

      absoluteLocation.steps.push(parse$5(rootParser, lexer));
    }
  }

  return absoluteLocation;
}

function parse$7 (rootParser, lexer) {
  var relativeLocation = {
    type: RELATIVE_LOCATION_PATH
  };

  relativeLocation.steps = [parse$5(rootParser, lexer)];

  while (!lexer.empty() && lexer.peak()[0] === "/") {
    if (lexer.next() === "//") {
      relativeLocation.steps.push({
        axis: DESCENDANT_OR_SELF,
        test: {
          type: NODE
        }
      });
    }

    relativeLocation.steps.push(parse$5(rootParser, lexer));
  }

  return relativeLocation;
}

function parse$8 (rootParser, lexer) {
  var token = lexer.peak(),
      ch = token && token[0];

  if (ch === "/") {
    return parse$6(rootParser, lexer);
  } else {
    return parse$7(rootParser, lexer);
  }
}

function parse$9 (rootParser, lexer) {
  if (isValidOp$1(lexer)) {
    var filter = parse$3(rootParser, lexer);

    if (!lexer.empty() && lexer.peak()[0] === "/") {
      var path = {
        type: PATH,
        filter: filter,
        steps: []
      };

      while (!lexer.empty() && lexer.peak()[0] === "/") {
        if (lexer.next() === "//") {
          path.steps.push({
            axis: DESCENDANT_OR_SELF,
            test: {
              type: NODE
            }
          });
        }

        path.steps.push(parse$5(rootParser, lexer));
      }

      return path;
    } else {
      return filter;
    }
  } else {
    return parse$8(rootParser, lexer);
  }
}

function parse$a (rootParser, lexer) {
  var lhs = parse$9(rootParser, lexer);

  if (lexer.peak() === "|") {
    lexer.next();

    var rhs = parse$a(rootParser, lexer);

    return {
      type: UNION,
      lhs: lhs,
      rhs: rhs
    };
  } else {
    return lhs;
  }
}

function parse$b (rootParser, lexer) {
  if (lexer.peak() === "-") {
    lexer.next();

    return {
      type: NEGATION,
      lhs: parse$b(rootParser, lexer)
    };
  } else {
    return parse$a(rootParser, lexer);
  }
}

function parse$c (rootParser, lexer) {
  var lhs = parse$b(rootParser, lexer);

  var multiplicativeTypes = {
    "*": MULTIPLICATIVE,
    "div": DIVISIONAL,
    "mod": MODULUS
  };

  if (multiplicativeTypes.hasOwnProperty(lexer.peak())) {
    var op = lexer.next();

    var rhs = parse$c(rootParser, lexer);

    return {
      type: multiplicativeTypes[op],
      lhs: lhs,
      rhs: rhs
    };
  } else {
    return lhs;
  }
}

function parse$d (rootParser, lexer) {
  var lhs = parse$c(rootParser, lexer);

  var additiveTypes = {
    "+": ADDITIVE,
    "-": SUBTRACTIVE
  };

  if (additiveTypes.hasOwnProperty(lexer.peak())) {
    var op = lexer.next();

    var rhs = parse$d(rootParser, lexer);

    return {
      type: additiveTypes[op],
      lhs: lhs,
      rhs: rhs
    };
  } else {
    return lhs;
  }
}

function parse$e (rootParser, lexer) {
  var lhs = parse$d(rootParser, lexer);

  var relationalTypes = {
    "<": LESS_THAN,
    ">": GREATER_THAN,
    "<=": LESS_THAN_OR_EQUAL,
    ">=": GREATER_THAN_OR_EQUAL
  };

  if (relationalTypes.hasOwnProperty(lexer.peak())) {
    var op = lexer.next();

    var rhs = parse$e(rootParser, lexer);

    return {
      type: relationalTypes[op],
      lhs: lhs,
      rhs: rhs
    };
  } else {
    return lhs;
  }
}

function parse$f (rootParser, lexer) {
  var lhs = parse$e(rootParser, lexer);

  var equalityTypes = {
    "=": EQUALITY,
    "!=": INEQUALITY
  };

  if (equalityTypes.hasOwnProperty(lexer.peak())) {
    var op = lexer.next();

    var rhs = parse$f(rootParser, lexer);

    return {
      type: equalityTypes[op],
      lhs: lhs,
      rhs: rhs
    };
  } else {
    return lhs;
  }
}

function parse$g (rootParser, lexer) {
  var lhs = parse$f(rootParser, lexer);

  if (lexer.peak() === "and") {
    lexer.next();

    var rhs = parse$g(rootParser, lexer);

    return {
      type: AND,
      lhs: lhs,
      rhs: rhs
    };
  } else {
    return lhs;
  }
}

function parse$h (rootParser, lexer) {
  var lhs = parse$g(rootParser, lexer);

  if (lexer.peak() === "or") {
    lexer.next();

    var rhs = parse$h(rootParser, lexer);

    return {
      type: OR,
      lhs: lhs,
      rhs: rhs
    };
  } else {
    return lhs;
  }
}

function parse$i (lexer) {
  return parse$h({ parse: parse$i }, lexer);
}

function XPathAnalyzer (expression) {
  this.lexer = new XPathLexer(expression);
}

XPathAnalyzer.prototype.parse = function () {
  var ast = parse$i(this.lexer);

  if (this.lexer.empty()) {
    return ast;
  } else {
    throw new Error("Unexpected token at position " + this.lexer.position());
  }
};

function Context (node, position, last) {
  this.node = node;
  this.position = position;
  this.last = last;
}

Context.prototype.getNode = function () {
  return this.node;
};

Context.prototype.getPosition = function () {
  return this.position;
};

Context.prototype.getLast = function () {
  return this.last;
};

Context.prototype.toString = function () {
  return "Context<" + this.node + ">";
};

var ELEMENT_NODE = 1;
var ATTRIBUTE_NODE = 2;
var TEXT_NODE = 3;
var PROCESSING_INSTRUCTION_NODE = 7;
var COMMENT_NODE = 8;
var DOCUMENT_NODE = 9;

/* eslint-disable no-underscore-dangle */

function Iterator (list, reversed) {
  this.list = list;
  this.reversed = reversed;
  this.current = reversed ? list.last_ : list.first_;
  this.lastReturned = null;
  this.i = 0;
}

Iterator.prototype.next = function () {
  this.i++;

  if (this.i > 10000) {
    throw new Error("An error has probably ocurred!");
  }

  if (this.current) {
    this.lastReturned = this.current;

    if (this.reversed) {
      this.current = this.current.previous;
    } else {
      this.current = this.current.next;
    }

    return this.lastReturned.node;
  }
};

Iterator.prototype.remove = function () {
  if (!this.lastReturned) {
    throw new Error("remove was called before iterating!");
  }

  var next = this.lastReturned.next,
      previous = this.lastReturned.previous;

  if (next) {
    next.previous = previous;
  } else {
    this.list.last_ = previous;
  }

  if (previous) {
    previous.next = next;
  } else {
    this.list.first_ = next;
  }

  this.lastReturned = null;
  this.list.length_--;
};

/* eslint-disable no-underscore-dangle */

function Entry (node) {
  this.node = node;
}

function XPathNodeSet (value) {
  this.first_ = null;
  this.last_ = null;
  this.length_ = 0;

  if (value) {
    value.forEach(function (node) {
      this.push(node);
    }, this);
  }
}

XPathNodeSet.prototype.iterator = function (reversed) {
  return new Iterator(this, reversed);
};

XPathNodeSet.prototype.first = function () {
  return this.first_.node;
};

XPathNodeSet.prototype.last = function () {
  return this.last_.node;
};

XPathNodeSet.prototype.length = function () {
  return this.length_;
};

XPathNodeSet.prototype.empty = function () {
  return this.length() === 0;
};

XPathNodeSet.prototype.asString = function () {
  if (this.empty()) {
    return "";
  } else {
    return this.first().asString();
  }
};

XPathNodeSet.prototype.asNumber = function () {
  return +this.asString();
};

XPathNodeSet.prototype.asBoolean = function () {
  return this.length() !== 0;
};

XPathNodeSet.prototype.merge = function (b) {
  return XPathNodeSet.merge(this, b);
};

XPathNodeSet.prototype.push = function (node) {
  var entry = new Entry(node);

  entry.next = null;
  entry.previous = this.last_;

  if (this.first_) {
    this.last_.next = entry;
  } else {
    this.first_ = entry;
  }

  this.last_ = entry;
  this.length_++;

  return this;
};

XPathNodeSet.prototype.unshift = function (node) {
  var entry = new Entry(node);

  entry.previous = null;
  entry.next = this.first_;

  if (this.first_) {
    this.first_.previous = entry;
  } else {
    this.last_ = entry;
  }

  this.first_ = entry;
  this.length_++;

  return this;
};

XPathNodeSet.prototype.filter = function (condition) {
  var node, iter = this.iterator();

  while ((node = iter.next())) {
    if (!condition(node)) {
      iter.remove();
    }
  }

  return this;
};

XPathNodeSet.merge = function (a, b) {
  if (!a.first_) {
    return b;
  } else if (!b.first_) {
    return a;
  }

  var aCurr = a.first_;
  var bCurr = b.first_;
  var merged = a, tail = null, next = null, length = 0;

  while (aCurr && bCurr) {
    if (aCurr.node.isEqual(bCurr.node)) {
      next = aCurr;
      aCurr = aCurr.next;
      bCurr = bCurr.next;
    } else {
      var compareResult = aCurr.node.compareDocumentPosition(bCurr.node);

      if (compareResult > 0) {
        next = bCurr;
        bCurr = bCurr.next;
      } else {
        next = aCurr;
        aCurr = aCurr.next;
      }
    }

    next.previous = tail;

    if (tail) {
      tail.next = next;
    } else {
      merged.first_ = next;
    }

    tail = next;
    length++;
  }

  next = aCurr || bCurr;

  while (next) {
    next.previous = tail;
    tail.next = next;
    tail = next;
    length++;
    next = next.next;
  }

  merged.last_ = tail;
  merged.length_ = length;

  return merged;
};

XPathNodeSet.mergeWithoutOrder = function (a, b) {
  var nodes = [], node, iter = a.iterator();

  while ((node = iter.next())) {
    nodes.push(node);
  }

  iter = b.iterator();

  while ((node = iter.next())) {
    var keep = nodes.every(function (addedNode) {
      return !addedNode.isEqual(node);
    });

    if (keep) {
      nodes.push(node);
    }
  }

  return new XPathNodeSet(nodes);
};

XPathNodeSet.prototype.toString = function () {
  var node, iter = this.iterator();

  var nodes = [];

  while ((node = iter.next())) {
    nodes.push("" + node);
  }

  return "NodeSet<" + nodes.join(", ") + ">";
};

function evaluate(rootEvaluator, context) {
  var nodes = new XPathNodeSet();

  if (context.getNode().getNodeType() !== DOCUMENT_NODE) {
    nodes = nodes.unshift(context.getNode().getParent());

    nodes = nodes.merge(evaluate(rootEvaluator, new Context(context.getNode().getParent())));
  }

  return nodes;
}

function evaluate$1 (rootEvaluator, context) {
  var nodes = new XPathNodeSet([context.getNode()], true);

  return evaluate(rootEvaluator, context).merge(nodes);
}

function evaluate$2 (rootEvaluator, context) {
  return new XPathNodeSet(context.getNode().getAttributes());
}

function evaluate$3 (rootEvaluator, context) {
  return new XPathNodeSet(context.getNode().getChildNodes());
}

function evaluate$4 (rootEvaluator, context) {
  var nodes = new XPathNodeSet();

  var children = new XPathNodeSet(context.getNode().getChildNodes());

  var child, iter = children.iterator();

  while ((child = iter.next())) {
    nodes = nodes.push(child);

    nodes = nodes.merge(evaluate$4(rootEvaluator, new Context(child)));
  }

  return nodes;
}

function evaluate$5 (rootEvaluator, context) {
  var nodes = new XPathNodeSet([context.getNode()]);

  return nodes.merge(evaluate$4(rootEvaluator, context));
}

function evaluate$6 (rootEvaluator, context) {
  return rootEvaluator.evaluate({
    type: RELATIVE_LOCATION_PATH,
    steps: [{
      axis: ANCESTOR_OR_SELF,
      test: {
        type: NODE
      }
    }, {
      axis: FOLLOWING_SIBLING,
      test: {
        type: NODE
      }
    }, {
      axis: DESCENDANT_OR_SELF,
      test: {
        type: NODE
      }
    }]
  }, context);
}

function evaluate$7 (rootEvaluator, context) {
  return new XPathNodeSet(context.getNode().getFollowingSiblings());
}

function Namespace () {
  throw new Error("Namespace axis is not implemented");
}

function evaluate$8 (rootEvaluator, context) {
  var nodes = new XPathNodeSet();

  if (context.getNode().getNodeType() !== DOCUMENT_NODE) {
    nodes = nodes.push(context.getNode().getParent());
  }

  return nodes;
}

function evaluate$9 (rootEvaluator, context) {
  return rootEvaluator.evaluate({
    type: RELATIVE_LOCATION_PATH,
    steps: [{
      axis: ANCESTOR_OR_SELF,
      test: {
        type: NODE
      }
    }, {
      axis: PRECEDING_SIBLING,
      test: {
        type: NODE
      }
    }, {
      axis: DESCENDANT_OR_SELF,
      test: {
        type: NODE
      }
    }]
  }, context);
}

function evaluate$a (rootEvaluator, context) {
  return new XPathNodeSet(context.getNode().getPrecedingSiblings());
}

function evaluate$b (rootEvaluator, context) {
  return new XPathNodeSet([context.getNode()]);
}

var Axes = {};

Axes[ANCESTOR] = evaluate;
Axes[ANCESTOR_OR_SELF] = evaluate$1;
Axes[ATTRIBUTE] = evaluate$2;
Axes[CHILD] = evaluate$3;
Axes[DESCENDANT] = evaluate$4;
Axes[DESCENDANT_OR_SELF] = evaluate$5;
Axes[FOLLOWING] = evaluate$6;
Axes[FOLLOWING_SIBLING] = evaluate$7;
Axes[NAMESPACE] = Namespace;
Axes[PARENT] = evaluate$8;
Axes[PRECEDING] = evaluate$9;
Axes[PRECEDING_SIBLING] = evaluate$a;
Axes[SELF] = evaluate$b;

function XPathNumber (value) {
  this.value = value;
}

XPathNumber.prototype.asString = function () {
  return "" + this.value;
};

XPathNumber.prototype.asNumber = function () {
  return this.value;
};

XPathNumber.prototype.asBoolean = function () {
  return !!this.value;
};

function evaluate$c (rootEvaluator, step, context, type) {
  var nodes;

  var axisEvaluator = Axes[step.axis];

  if (axisEvaluator) {
    nodes = axisEvaluator(rootEvaluator, context, type);
  } else {
    throw new Error("Unknown axis specifier " + step.axis);
  }

  if (step.test.name) {
    var name = step.test.name;

    nodes = nodes.filter(function (node) {
      return (name === "*" && node.getName()) || node.getName() === step.test.name;
    });
  }

  if (step.test.type && step.test.type !== NODE) {
    var nodeType;

    switch (step.test.type) {
      case COMMENT:
        nodeType = COMMENT_NODE;
        break;

      case PROCESSING_INSTRUCTION:
        nodeType = PROCESSING_INSTRUCTION_NODE;
        break;

      case TEXT:
        nodeType = TEXT_NODE;
        break;

      default:
        throw new Error("Unknown node nodeType " + step.test.nodeType);
    }

    nodes = nodes.filter(function (node) {
      return node.getNodeType() === nodeType;
    });
  }

  if (step.predicates) {
    var reversed = (
      step.axis === ANCESTOR ||
      step.axis === ANCESTOR_OR_SELF ||
      step.axis === PRECEDING ||
      step.axis === PRECEDING_SIBLING);

    var node, position = 0, filteredNodes = [], iter = nodes.iterator(reversed);

    while ((node = iter.next())) {
      position++;

      var keep = step.predicates.every(function (predicate) {
        var result = rootEvaluator.evaluate(predicate, new Context(node, position, nodes.length()), type);

        if (result === null) {
          return false;
        }

        if (result instanceof XPathNumber) {
          return result.asNumber() === position;
        } else {
          return result.asBoolean();
        }
      });

      if (keep) {
        filteredNodes.push(node);
      }
    }

    nodes = new XPathNodeSet(filteredNodes);
  }

  return nodes;
}

function evaluate$d (rootEvaluator, ast, context, type) {
  var nodeSet = new XPathNodeSet([context.getNode()]),
      nextNodeSet = new XPathNodeSet();

  if (ast.steps) {
    for (var i = 0; i < ast.steps.length; i++) {
      var node, iter = nodeSet.iterator();

      while ((node = iter.next())) {
        var stepResult = evaluate$c(rootEvaluator, ast.steps[i], new Context(node), type);

        nextNodeSet = nextNodeSet.merge(stepResult);
      }

      nodeSet = nextNodeSet;
      nextNodeSet = new XPathNodeSet();
    }
  }

  return nodeSet;
}

function evaluate$e (rootEvaluator, ast, context, type) {
  if (context.getNode().getNodeType() !== DOCUMENT_NODE) {
    context = new Context(context.getNode().getOwnerDocument());
  }

  return evaluate$d(rootEvaluator, ast, context, type);
}

function evaluate$f (rootEvaluator, ast, context, type) {
  var lhs = rootEvaluator.evaluate(ast.lhs, context, type);

  var rhs = rootEvaluator.evaluate(ast.rhs, context, type);

  return new XPathNumber(lhs.asNumber() + rhs.asNumber());
}

function XPathBoolean (value) {
  this.value = value;
}

XPathBoolean.prototype.asString = function () {
  return "" + this.value;
};

XPathBoolean.prototype.asNumber = function () {
  return this.value ? 1 : 0;
};

XPathBoolean.prototype.asBoolean = function () {
  return this.value;
};

function evaluate$g (rootEvaluator, ast, context, type) {
  var lhs = rootEvaluator.evaluate(ast.lhs, context, type);

  if (!lhs.asBoolean()) {
    return new XPathBoolean(false);
  }

  return rootEvaluator.evaluate(ast.rhs, context, type);
}

function evaluate$h (rootEvaluator, ast, context, type) {
  var lhs = rootEvaluator.evaluate(ast.lhs, context, type);

  var rhs = rootEvaluator.evaluate(ast.rhs, context, type);

  return new XPathNumber(lhs.asNumber() / rhs.asNumber());
}

function XPathString (value) {
  this.value = value;
}

XPathString.prototype.asString = function () {
  return this.value;
};

XPathString.prototype.asNumber = function () {
  return +this.value;
};

XPathString.prototype.asBoolean = function () {
  return this.value.length !== 0;
};

function compareNodes (type, lhs, rhs, comparator) {
  if (lhs instanceof XPathNodeSet && rhs instanceof XPathNodeSet) {
    var lNode, lIter = lhs.iterator();

    while ((lNode = lIter.next())) {
      var rNode, rIter = rhs.iterator();

      while ((rNode = rIter.next())) {
        if (comparator(lNode.asString(), rNode.asString())) {
          return new XPathBoolean(true);
        }
      }
    }

    return new XPathBoolean(false);
  }

  if (lhs instanceof XPathNodeSet || rhs instanceof XPathNodeSet) {
    var nodeSet, primitive;

    if (lhs instanceof XPathNodeSet) {
      nodeSet = lhs;
      primitive = rhs;
    } else {
      nodeSet = rhs;
      primitive = lhs;
    }

    var node, iter = nodeSet.iterator();

    while ((node = iter.next())) {
      if (primitive instanceof XPathNumber) {
        if (comparator(node.asNumber(), primitive.asNumber())) {
          return new XPathBoolean(true);
        }
      } else if (primitive instanceof XPathBoolean) {
        if (comparator(node.asBoolean(), primitive.asBoolean())) {
          return new XPathBoolean(true);
        }
      } else if (primitive instanceof XPathString) {
        if (comparator(node.asString(), primitive.asString())) {
          return new XPathBoolean(true);
        }
      } else {
        throw new Error("Unknown value type");
      }
    }

    return new XPathBoolean(false);
  }

  // Neither object is a NodeSet at this point.


  if (type === EQUALITY ||
      type === INEQUALITY) {
    if (lhs instanceof XPathBoolean || rhs instanceof XPathBoolean) {
      if (comparator(lhs.asBoolean(), rhs.asBoolean())) {
        return new XPathBoolean(true);
      }
    } else if (rhs instanceof XPathNumber || rhs instanceof XPathNumber) {
      if (comparator(lhs.asNumber(), rhs.asNumber())) {
        return new XPathBoolean(true);
      }
    } else if (rhs instanceof XPathString || rhs instanceof XPathString) {
      if (comparator(lhs.asString(), rhs.asString())) {
        return new XPathBoolean(true);
      }
    } else {
      throw new Error("Unknown value types");
    }

    return new XPathBoolean(false);
  } else {
    return new XPathBoolean(comparator(lhs.asNumber(), rhs.asNumber()));
  }
}

function evaluate$i (rootEvaluator, ast, context, type) {
  return compareNodes(
    ast.type,
    rootEvaluator.evaluate(ast.lhs, context, type),
    rootEvaluator.evaluate(ast.rhs, context, type),
    function (lhs, rhs) {
      return lhs === rhs;
    }
  );
}

function evaluate$j (rootEvaluator, ast, context, type) {
  var nodes = rootEvaluator.evaluate(ast.primary, context, type);

  var node, position = 0, filteredNodes = [], iter = nodes.iterator();

  while ((node = iter.next())) {
    position++;

    var keep = ast.predicates.every(function (predicate) {
      var result = rootEvaluator.evaluate(predicate, new Context(node, position, nodes.length()), type);

      if (result === null) {
        return false;
      }

      if (result instanceof XPathNumber) {
        return result.asNumber() === position;
      } else {
        return result.asBoolean();
      }
    });

    if (keep) {
      filteredNodes.push(node);
    }
  }

  return new XPathNodeSet(filteredNodes);
}

function evaluate$k (context, value) {
  if (!value) {
    throw new Error("Missing argument");
  }

  if (arguments.length > 2) {
    throw new Error("Unknown argument(s)");
  }

  return new XPathBoolean(value.asBoolean());
}

function evaluate$l (context, number) {
  if (!number) {
    throw new Error("Missing argument");
  }

  if (arguments.length > 2) {
    throw new Error("Unknown argument(s)");
  }

  if (!(number instanceof XPathNumber)) {
    throw new Error("Wrong type of argument");
  }

  return new XPathNumber(Math.ceil(number.asNumber()));
}

function evaluate$m () {
  var args = [].slice.call(arguments);

  args.shift();

  if (args.length === 0) {
    throw new Error("Expected some arguments");
  }

  args = args.map(function (arg) {
    return arg.asString();
  });

  return new XPathString(args.join(""));
}

function evaluate$n (context, base, contains) {
  if (!contains) {
    throw new Error("Expected two arguments");
  }

  base = base.asString();

  contains = contains.asString();

  return new XPathBoolean(base.indexOf(contains) !== -1);
}

function evaluate$o (context, nodeset) {
  if (!nodeset) {
    throw new Error("Missing argument");
  }

  if (arguments.length > 2) {
    throw new Error("Unknown argument(s)");
  }

  if (!(nodeset instanceof XPathNodeSet)) {
    throw new Error("Wrong type of argument");
  }

  return new XPathNumber(nodeset.length());
}

function evaluate$p () {
  return new XPathBoolean(false);
}

function evaluate$q (context, number) {
  if (!number) {
    throw new Error("Missing argument");
  }

  if (arguments.length > 2) {
    throw new Error("Unknown argument(s)");
  }

  if (!(number instanceof XPathNumber)) {
    throw new Error("Wrong type of argument");
  }

  return new XPathNumber(Math.floor(number.asNumber()));
}

function evaluate$r (context, value) {
  if (!value) {
    throw new Error("Missing argument");
  }

  if (arguments.length > 2) {
    throw new Error("Unknown argument(s)");
  }

  var node, ids = [];

  if (value instanceof XPathNodeSet) {
    var iter = value.iterator();

    while ((node = iter.next())) {
      ids = ids.concat(node.asString().split(/\s+/g));
    }
  } else if (value instanceof XPathString) {
    ids = value.asString().split(/\s+/g);
  } else {
    ids.push(value.asString());
  }

  var nodes = new XPathNodeSet();

  for (var i = 0; i < ids.length; i++) {
    if (context.getNode().getNodeType() === DOCUMENT_NODE) {
      node = context.getNode().getElementById(ids[i]);
    } else {
      node = context.getNode().getOwnerDocument().getElementById(ids[i]);
    }

    if (node) {
      nodes = nodes.merge(new XPathNodeSet([node]));
    }
  }

  return nodes;
}

function evaluate$s (context) {
  return new XPathNumber(context.getLast());
}

function evaluate$t (context, nodeset) {
  if (!nodeset) {
    nodeset = new XPathNodeSet([context.getNode()]);
  }

  if (arguments.length > 2) {
    throw new Error("Unknown argument(s)");
  }

  if (!(nodeset instanceof XPathNodeSet)) {
    throw new Error("Wrong type of argument");
  }

  if (nodeset.empty()) {
    return new XPathString("");
  } else {
    return new XPathString(nodeset.first().getName());
  }
}

function evaluate$u (context, nodeset) {
  if (!nodeset) {
    return new XPathString(context.getNode().getName());
  } else {
    if (arguments.length > 2) {
      throw new Error("Unknown argument(s)");
    }

    if (!(nodeset instanceof XPathNodeSet)) {
      throw new Error("Wrong type of argument");
    }

    if (nodeset.empty()) {
      return new XPathString("");
    } else {
      return new XPathString(nodeset.first().getName());
    }
  }
}

function evaluate$v (context, value) {
  var string;

  if (!value) {
    string = context.getNode().asString();
  } else {
    if (arguments.length > 2) {
      throw new Error("Unknown argument(s)");
    }

    string = value.asString();
  }

  return new XPathString(string.trim().replace(/\s{2,}/g, " "));
}

function evaluate$w (context, value) {
  if (!value) {
    throw new Error("Missing argument");
  }

  if (arguments.length > 2) {
    throw new Error("Unknown argument(s)");
  }

  return new XPathBoolean(!value.asBoolean());
}

function evaluate$x (context, value) {
  if (!value) {
    throw new Error("Missing argument");
  }

  if (arguments.length > 2) {
    throw new Error("Unknown argument(s)");
  }

  return new XPathNumber(value.asNumber());
}

function evaluate$y (context) {
  return new XPathNumber(context.getPosition());
}

function evaluate$z (context, number) {
  if (!number) {
    throw new Error("Missing argument");
  }

  if (arguments.length > 2) {
    throw new Error("Unknown argument(s)");
  }

  if (!(number instanceof XPathNumber)) {
    throw new Error("Wrong type of argument");
  }

  return new XPathNumber(Math.round(number.asNumber()));
}

function evaluate$A (context, base, substring) {
  if (!substring) {
    throw new Error("Expected two arguments");
  }

  base = base.asString();

  substring = substring.asString();

  var index = base.indexOf(substring);

  return new XPathBoolean(index === 0);
}

function evaluate$B (context, string) {
  if (!string) {
    string = context.getNode().asString();
  } else {
    if (arguments.length > 2) {
      throw new Error("Unknown argument(s)");
    }

    if (!(string instanceof XPathString)) {
      throw new Error("Wrong type of argument");
    }

    string = string.asString();
  }

  return new XPathNumber(string.length);
}

function evaluate$C (context, value) {
  if (!value) {
    value = new XPathNodeSet([context.getNode()]);
  }

  if (arguments.length > 2) {
    throw new Error("Unknown argument(s)");
  }

  return new XPathString(value.asString());
}

function evaluate$D (context, base, substring) {
  if (!substring) {
    throw new Error("Expected two arguments");
  }

  base = base.asString();

  substring = substring.asString();

  var index = base.indexOf(substring);

  if (index === -1) {
    return new XPathString("");
  } else {
    return new XPathString(base.substring(index + substring.length));
  }
}

function evaluate$E (context, base, substring) {
  if (!substring) {
    throw new Error("Expected two arguments");
  }

  base = base.asString();

  substring = substring.asString();

  var index = base.indexOf(substring);

  if (index === -1) {
    return new XPathString("");
  } else {
    return new XPathString(base.substring(0, index));
  }
}

function evaluate$F (context, base, start, length) {
  if (!start) {
    throw new Error("Expected two or three arguments");
  }

  base = base.asString();

  start = Math.round(start.asNumber());

  if (isNaN(start) || start === Infinity || start === -Infinity) {
    return new XPathString("");
  }

  if (length) {
    length = Math.round(length.asNumber());

    if (isNaN(length) || length === -Infinity) {
      return new XPathString("");
    }
  }

  if (length) {
    return new XPathString(base.substring(start - 1, start + length - 1));
  } else {
    return new XPathString(base.substring(start - 1));
  }
}

function evaluate$G (context, nodeset) {
  if (!nodeset) {
    throw new Error("Missing argument");
  }

  if (arguments.length > 2) {
    throw new Error("Unknown argument(s)");
  }

  if (!(nodeset instanceof XPathNodeSet)) {
    throw new Error("Wrong type of argument");
  }

  var sum = 0, node, iter = nodeset.iterator();

  while ((node = iter.next())) {
    sum = sum + node.asNumber();
  }

  return new XPathNumber(sum);
}

function evaluate$H (context, base, mapFrom, mapTo) {
  if (!mapTo) {
    throw new Error("Expected three arguments");
  }

  if (!(base instanceof XPathString) ||
      !(mapFrom instanceof XPathString) ||
      !(mapTo instanceof XPathString)) {
    throw new Error("Expected string arguments");
  }

  base = base.asString();

  mapFrom = mapFrom.asString();

  mapTo = mapTo.asString();

  for (var i = 0; i < mapFrom.length; i++) {
    if (i < mapTo.length) {
      base = base.replace(new RegExp(mapFrom[i], "g"), mapTo[i]);
    } else {
      base = base.replace(new RegExp(mapFrom[i], "g"), "");
    }
  }

  return new XPathString(base);
}

function evaluate$I () {
  return new XPathBoolean(true);
}

/* eslint-disable no-underscore-dangle */

/* eslint-disable dot-notation */
var Functions = {
  "boolean": evaluate$k,
  "ceiling": evaluate$l,
  "concat": evaluate$m,
  "contains": evaluate$n,
  "count": evaluate$o,
  "false": evaluate$p,
  "floor": evaluate$q,
  "id": evaluate$r,
  "last": evaluate$s,
  "local-name": evaluate$t,
  "name": evaluate$u,
  "normalize-space": evaluate$v,
  "not": evaluate$w,
  "number": evaluate$x,
  "position": evaluate$y,
  "round": evaluate$z,
  "starts-with": evaluate$A,
  "string-length": evaluate$B,
  "string": evaluate$C,
  "substring-after": evaluate$D,
  "substring-before": evaluate$E,
  "substring": evaluate$F,
  "sum": evaluate$G,
  "translate": evaluate$H,
  "true": evaluate$I
};
/* eslint-enable dot-notation */

function evaluate$J (rootEvaluator, ast, context, type) {
  var args = (ast.args || []).map(function (arg) {
    return rootEvaluator.evaluate(arg, context, type);
  });

  args.unshift(context);

  var functionEvaluator = Functions[ast.name];

  if (functionEvaluator) {
    return functionEvaluator.apply(null, args);
  } else {
    throw new Error("Unknown function " + ast.name);
  }
}

function evaluate$K (rootEvaluator, ast, context, type) {
  return compareNodes(
    ast.type,
    rootEvaluator.evaluate(ast.lhs, context, type),
    rootEvaluator.evaluate(ast.rhs, context, type),
    function (lhs, rhs) {
      return lhs > rhs;
    }
  );
}

function evaluate$L (rootEvaluator, ast, context, type) {
  return compareNodes(
    ast.type,
    rootEvaluator.evaluate(ast.lhs, context, type),
    rootEvaluator.evaluate(ast.rhs, context, type),
    function (lhs, rhs) {
      return lhs >= rhs;
    }
  );
}

function evaluate$M (rootEvaluator, ast, context, type) {
  return compareNodes(
    ast.type,
    rootEvaluator.evaluate(ast.lhs, context, type),
    rootEvaluator.evaluate(ast.rhs, context, type),
    function (lhs, rhs) {
      return lhs !== rhs;
    }
  );
}

function evaluate$N (rootEvaluator, ast, context, type) {
  return compareNodes(
    ast.type,
    rootEvaluator.evaluate(ast.lhs, context, type),
    rootEvaluator.evaluate(ast.rhs, context, type),
    function (lhs, rhs) {
      return lhs < rhs;
    }
  );
}

function evaluate$O (rootEvaluator, ast, context, type) {
  return compareNodes(
    ast.type,
    rootEvaluator.evaluate(ast.lhs, context, type),
    rootEvaluator.evaluate(ast.rhs, context, type),
    function (lhs, rhs) {
      return lhs <= rhs;
    }
  );
}

function evaluate$P (rootEvaluator, ast) {
  return new XPathString(ast.string);
}

function evaluate$Q (rootEvaluator, ast, context, type) {
  var lhs = rootEvaluator.evaluate(ast.lhs, context, type);

  var rhs = rootEvaluator.evaluate(ast.rhs, context, type);

  return new XPathNumber(lhs.asNumber() % rhs.asNumber());
}

function evaluate$R (rootEvaluator, ast, context, type) {
  var lhs = rootEvaluator.evaluate(ast.lhs, context, type);

  var rhs = rootEvaluator.evaluate(ast.rhs, context, type);

  return new XPathNumber(lhs.asNumber() * rhs.asNumber());
}

function evaluate$S (rootEvaluator, ast, context, type) {
  var lhs = rootEvaluator.evaluate(ast.lhs, context, type);

  return new XPathNumber(-lhs.asNumber());
}

function evaluate$T (rootEvaluator, ast) {
  return new XPathNumber(ast.number);
}

function evaluate$U (rootEvaluator, ast, context, type) {
  var lhs = rootEvaluator.evaluate(ast.lhs, context, type);

  if (lhs.asBoolean()) {
    return new XPathBoolean(true);
  }

  return rootEvaluator.evaluate(ast.rhs, context, type);
}

function evaluate$V (rootEvaluator, ast, context, type) {
  var nodes = rootEvaluator.evaluate(ast.filter, context, type);

  if (ast.steps) {
    var nodeSets = [], node, iter = nodes.iterator();

    while ((node = iter.next())) {
      nodeSets.push(evaluate$d(rootEvaluator, ast, new Context(node), type));
    }

    nodes = nodeSets.reduce(function (previousValue, currentValue) {
      return previousValue.merge(currentValue);
    });
  }

  return nodes;
}

function evaluate$W (rootEvaluator, ast, context, type) {
  var lhs = rootEvaluator.evaluate(ast.lhs, context, type);

  var rhs = rootEvaluator.evaluate(ast.rhs, context, type);

  return new XPathNumber(lhs.asNumber() - rhs.asNumber());
}

function evaluate$X (rootEvaluator, ast, context, type) {
  var lhs = rootEvaluator.evaluate(ast.lhs, context, type);

  var rhs = rootEvaluator.evaluate(ast.rhs, context, type);

  return lhs.merge(rhs);
}

var Evaluators = {};

Evaluators[ABSOLUTE_LOCATION_PATH] = evaluate$e;
Evaluators[ADDITIVE] = evaluate$f;
Evaluators[AND] = evaluate$g;
Evaluators[DIVISIONAL] = evaluate$h;
Evaluators[EQUALITY] = evaluate$i;
Evaluators[FILTER] = evaluate$j;
Evaluators[FUNCTION_CALL] = evaluate$J;
Evaluators[GREATER_THAN] = evaluate$K;
Evaluators[GREATER_THAN_OR_EQUAL] = evaluate$L;
Evaluators[INEQUALITY] = evaluate$M;
Evaluators[LESS_THAN] = evaluate$N;
Evaluators[LESS_THAN_OR_EQUAL] = evaluate$O;
Evaluators[LITERAL] = evaluate$P;
Evaluators[MODULUS] = evaluate$Q;
Evaluators[MULTIPLICATIVE] = evaluate$R;
Evaluators[NEGATION] = evaluate$S;
Evaluators[NUMBER] = evaluate$T;
Evaluators[OR] = evaluate$U;
Evaluators[PATH] = evaluate$V;
Evaluators[RELATIVE_LOCATION_PATH] = evaluate$d;
Evaluators[SUBTRACTIVE] = evaluate$W;
Evaluators[UNION] = evaluate$X;

function XPathExpression (expression) {
  this.expression = expression;
}

XPathExpression.evaluate = function (ast, context, type) {
  var evaluator = Evaluators[ast.type];

  return evaluator(XPathExpression, ast, context, type);
};

XPathExpression.prototype.evaluate = function (context, type, Adapter) {
  var ast = new XPathAnalyzer(this.expression).parse();

  return XPathExpression.evaluate(ast, new Context(new Adapter(context)), type);
};

function XPathException (code, message) {
  this.code = code;
  this.message = message;
}

var TYPE_ERR = 52;

var ANY_TYPE = 0;
var NUMBER_TYPE = 1;
var STRING_TYPE = 2;
var BOOLEAN_TYPE = 3;
var UNORDERED_NODE_ITERATOR_TYPE = 4;
var ORDERED_NODE_ITERATOR_TYPE = 5;
var UNORDERED_NODE_SNAPSHOT_TYPE = 6;
var ORDERED_NODE_SNAPSHOT_TYPE = 7;
var ANY_UNORDERED_NODE_TYPE = 8;
var FIRST_ORDERED_NODE_TYPE = 9;

function XPathResult (type, value) {
  this.value = value;

  if (type === ANY_TYPE) {
    if (value instanceof XPathNodeSet) {
      this.resultType = UNORDERED_NODE_ITERATOR_TYPE;
    } else if (value instanceof XPathString) {
      this.resultType = STRING_TYPE;
    } else if (value instanceof XPathNumber) {
      this.resultType = NUMBER_TYPE;
    } else if (value instanceof XPathBoolean) {
      this.resultType = BOOLEAN_TYPE;
    } else {
      throw new Error("Unexpected evaluation result");
    }
  } else {
    this.resultType = type;
  }

  if (this.resultType !== STRING_TYPE &&
      this.resultType !== NUMBER_TYPE &&
      this.resultType !== BOOLEAN_TYPE &&
      !(value instanceof XPathNodeSet)) {
    throw Error("Value could not be converted to the specified type");
  }

  if (this.resultType === UNORDERED_NODE_ITERATOR_TYPE ||
      this.resultType === ORDERED_NODE_ITERATOR_TYPE ||
      this.resultType === UNORDERED_NODE_SNAPSHOT_TYPE ||
      this.resultType === ORDERED_NODE_SNAPSHOT_TYPE) {
    this.nodes = [];

    var node, iter = this.value.iterator();

    while ((node = iter.next())) {
      this.nodes.push(node.getNativeNode());
    }
  }

  var self = this;

  var hasDefineProperty = true;

  try {
    Object.defineProperty({}, "x", {});
  } catch (e) {
    hasDefineProperty = false;
  }

  if (hasDefineProperty) {
    Object.defineProperty(this, "numberValue", {get: function () {
      if (self.resultType !== NUMBER_TYPE) {
        throw new XPathException(TYPE_ERR, "resultType is not NUMBER_TYPE");
      }

      return self.value.asNumber();
    }});

    Object.defineProperty(this, "stringValue", {get: function () {
      if (self.resultType !== STRING_TYPE) {
        throw new XPathException(TYPE_ERR, "resultType is not STRING_TYPE");
      }

      return self.value.asString();
    }});

    Object.defineProperty(this, "booleanValue", {get: function () {
      if (self.resultType !== BOOLEAN_TYPE) {
        throw new XPathException(TYPE_ERR, "resultType is not BOOLEAN_TYPE");
      }

      return self.value.asBoolean();
    }});

    Object.defineProperty(this, "singleNodeValue", {get: function () {
      if (self.resultType !== FIRST_ORDERED_NODE_TYPE &&
          self.resultType !== ANY_UNORDERED_NODE_TYPE) {
        throw new XPathException(TYPE_ERR, "resultType is not a node set");
      }

      return self.value.empty() ? null : self.value.first().getNativeNode();
    }});

    Object.defineProperty(this, "invalidIteratorState", {get: function () {
      throw new Error("invalidIteratorState is not implemented");
    }});

    Object.defineProperty(this, "snapshotLength", {get: function () {
      if (self.resultType !== ORDERED_NODE_SNAPSHOT_TYPE &&
          self.resultType !== UNORDERED_NODE_SNAPSHOT_TYPE) {
        throw new XPathException(TYPE_ERR, "resultType is not a node set");
      }

      return self.value.length();
    }});
  } else {
    if (self.resultType === NUMBER_TYPE) {
      self.numberValue = self.value.asNumber();
    }

    if (self.resultType === STRING_TYPE) {
      self.stringValue = self.value.asString();
    }

    if (self.resultType === BOOLEAN_TYPE) {
      self.booleanValue = self.value.asBoolean();
    }

    if (self.resultType === FIRST_ORDERED_NODE_TYPE ||
        self.resultType === ANY_UNORDERED_NODE_TYPE) {
      self.singleNodeValue = self.value.empty() ? null : self.value.first().getNativeNode();
    }

    if (self.resultType === ORDERED_NODE_SNAPSHOT_TYPE ||
        self.resultType === UNORDERED_NODE_SNAPSHOT_TYPE) {
      self.snapshotLength = self.value.length();
    }
  }
}

XPathResult.prototype.iterateNext = function () {
  if (this.resultType !== ORDERED_NODE_ITERATOR_TYPE &&
      this.resultType !== UNORDERED_NODE_ITERATOR_TYPE) {
    throw new XPathException(TYPE_ERR, "iterateNext called with wrong result type");
  }

  this.index = this.index || 0;

  return (this.index >= this.nodes.length) ? null : this.nodes[this.index++];
};

XPathResult.prototype.snapshotItem = function (index) {
  if (this.resultType !== ORDERED_NODE_SNAPSHOT_TYPE &&
      this.resultType !== UNORDERED_NODE_SNAPSHOT_TYPE) {
    throw new XPathException(TYPE_ERR, "snapshotItem called with wrong result type");
  }

  return this.nodes[index] || null;
};

XPathResult.ANY_TYPE = ANY_TYPE;
XPathResult.NUMBER_TYPE = NUMBER_TYPE;
XPathResult.STRING_TYPE = STRING_TYPE;
XPathResult.BOOLEAN_TYPE = BOOLEAN_TYPE;
XPathResult.UNORDERED_NODE_ITERATOR_TYPE = UNORDERED_NODE_ITERATOR_TYPE;
XPathResult.ORDERED_NODE_ITERATOR_TYPE = ORDERED_NODE_ITERATOR_TYPE;
XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE = UNORDERED_NODE_SNAPSHOT_TYPE;
XPathResult.ORDERED_NODE_SNAPSHOT_TYPE = ORDERED_NODE_SNAPSHOT_TYPE;
XPathResult.ANY_UNORDERED_NODE_TYPE = ANY_UNORDERED_NODE_TYPE;
XPathResult.FIRST_ORDERED_NODE_TYPE = FIRST_ORDERED_NODE_TYPE;

function throwNotImplemented () {
  throw new Error("Namespaces are not implemented");
}

function XPathEvaluator (adapter) {
  this.adapter = adapter;
}

XPathEvaluator.prototype.evaluate = function (expression, context, nsResolver, type) {
  if (nsResolver) {
    throwNotImplemented();
  }

  var value = this.createExpression(expression).evaluate(context, type, this.adapter);

  return new XPathResult(type, value);
};

XPathEvaluator.prototype.createExpression = function (expression, nsResolver) {
  if (nsResolver) {
    throwNotImplemented();
  }

  return new XPathExpression(expression);
};

XPathEvaluator.prototype.createNSResolver = function () {
  throwNotImplemented();
};

function compareDocumentPosition (a, b) {
  a = a.getId();
  b = b.getId();

  if (a === b) {
    return 0;
  }

  a = a.split(".").map(function (number) {
    return parseInt(number, 10);
  });

  b = b.split(".").map(function (number) {
    return parseInt(number, 10);
  });

  for (let i = 0; i < a.length; i++) {
    if (i === b.length) {
      return 1;
    }

    if (a[i] < b[i]) {
      return -1;
    }

    if (a[i] > b[i]) {
      return 1;
    }
  }

  return -1;
}

class ReactAttribute {
  constructor(attributeName, textContent, parent, nChild) {
    this.attributeName = attributeName;
    this.textContent = textContent;
    this.parent = parent;
    this.nChild = nChild;
  }

  getId() {
    return this.getParent().getId() + "." + this.nChild;
  }

  isEqual(node) {
    return this.getId() === node.getId();
  }

  asString() {
    return this.textContent;
  }

  asNumber() {
    return +this.asString();
  }

  getNodeType() {
    return ATTRIBUTE_NODE;
  }

  getParent() {
    return this.parent;
  }

  getChildNodes() {
    return undefined;
  }

  getFollowingSiblings() {
    return undefined;
  }

  getPrecedingSiblings() {
    return undefined;
  }

  getName() {
    switch (this.attributeName) {
      case "className":
        return "class";
      case "htmlFor":
        return "for";
      default:
        return this.attributeName;
    }
  }

  getAttributes() {
    return undefined;
  }

  getOwnerDocument() {
    return this.getParent().getOwnerDocument();
  }

  toString() {
    return "Node<" + this.attributeName + ">";
  }

  compareDocumentPosition(other) {
    return compareDocumentPosition(this, other);
  }
}

class ReactText {
  constructor (textContent, parent, nChild) {
    this.textContent = textContent;
    this.parent = parent;
    this.nChild = nChild;
  }

  getId() {
    return this.getParent().getId() + "." + this.nChild;
  }

  isEqual(node) {
    return this.getId() === node.getId();
  }

  getNativeNode() {
    return this.textContent;
  }

  asString() {
    return this.textContent;
  }

  asNumber() {
    return +this.asString();
  }

  getNodeType() {
    return TEXT_NODE;
  }

  getParent() {
    return this.parent;
  }

  getChildNodes() {
    return undefined;
  }

  getFollowingSiblings() {
    const followingSiblings = [];

    const siblings = this.getParent().getChildNodes();

    const thisSiblingIndex = siblings.findIndex((sibling) => {
      return sibling.getNativeNode() === this.getNativeNode();
    });

    for (let i = thisSiblingIndex + 1; i < siblings.length; i++) {
      followingSiblings.push(siblings[i]);
    }

    return followingSiblings;
  }

  getPrecedingSiblings() {
    const precedingSiblings = [];

    const siblings = this.getParent().getChildNodes();

    const thisSiblingIndex = siblings.findIndex((sibling) => {
      return sibling.getNativeNode() === this.getNativeNode();
    });

    for (let i = 0; i < thisSiblingIndex; i++) {
      precedingSiblings.push(siblings[i]);
    }

    return precedingSiblings;
  }

  getName() {
    return undefined;
  }

  getAttributes() {
    return undefined;
  }

  getOwnerDocument() {
    return this.getParent().getOwnerDocument();
  }

  toString() {
    return "Node<text(" + this.textContent + ")>";
  }

  compareDocumentPosition(other) {
    return compareDocumentPosition(this, other);
  }
}

class ReactElement {
  constructor(nativeNode, parent, nChild) {
    this.nativeNode = nativeNode;
    this.parent = parent;
    this.nChild = nChild;
  }

  getId() {
    return this.getParent().getId() + "." + this.nChild;
  }

  isEqual(node) {
    return this.getId() === node.getId();
  }

  getNativeNode() {
    return this.nativeNode;
  }

  asString() {
    let textContent = "";

    this.getChildNodes().forEach(function (child) {
      if (child.getNodeType() === ELEMENT_NODE ||
          child.getNodeType() === TEXT_NODE) {
        textContent = textContent + child.asString();
      }
    });

    return textContent;
  }

  asNumber() {
    return +this.asString();
  }

  getNodeType() {
    return ELEMENT_NODE;
  }

  getParent() {
    return this.parent;
  }

  getChildNodes() {
    if (!this.nativeNode.props || !this.nativeNode.props.children) {
      return [];
    }

    const children = [];

    const addChild = (child, i) => {
      if (child) {
        if (typeof child === "string") {
          children.push(new ReactText(child, this, i));
        } else {
          children.push(new ReactElement(child, this, i));
        }
      }
    };

    function flatten (array) {
      return array.reduce(function(memo, el) {
        const items = Array.isArray(el) ? flatten(el) : [el];
        return memo.concat(items);
      }, []);
    }

    const flattenedChildren = flatten([this.nativeNode.props.children]);

    for (let i = 0; i < flattenedChildren.length; i++) {
      addChild(flattenedChildren[i], i);
    }

    return children;
  }

  getFollowingSiblings() {
    const followingSiblings = [];

    const siblings = this.getParent().getChildNodes();

    const thisSiblingIndex = siblings.findIndex((sibling) => {
      return sibling.isEqual(this);
    });

    for (let i = thisSiblingIndex + 1; i < siblings.length; i++) {
      followingSiblings.push(siblings[i]);
    }

    return followingSiblings;
  }

  getPrecedingSiblings() {
    const precedingSiblings = [];

    const siblings = this.getParent().getChildNodes();

    const thisSiblingIndex = siblings.findIndex((sibling) => {
      return sibling.isEqual(this);
    });

    for (let i = 0; i < thisSiblingIndex; i++) {
      precedingSiblings.push(siblings[i]);
    }

    return precedingSiblings;
  }

  getName() {
    if (typeof this.nativeNode.type === "string") {
      return this.nativeNode.type;
    } else if (typeof this.nativeNode.type === "function") {
      return this.nativeNode.type.displayName || this.nativeNode.type.name;
    }
  }

  getAttributes() {
    if (!this.nativeNode.props) {
      return [];
    }

    const attributes = [];

    let i = 0;

    for (let attribute in this.nativeNode.props) {
      if (attribute !== "children") {
        attributes.push(new ReactAttribute(attribute, this.nativeNode.props[attribute], this, i++));
      }
    }

    return attributes;
  }

  getOwnerDocument() {
    if (this.getParent().getNodeType() === DOCUMENT_NODE) {
      return this.getParent();
    } else {
      return this.getParent().getOwnerDocument();
    }
  }

  _getElementById(id) {
    if (this.nativeNode.props && this.nativeNode.props.id === id) {
      return this;
    } else {
      const children = this.getChildNodes();

      for (let child of children) {
        if (child.getNodeType() === ELEMENT_NODE) {
          const elementWithId = child._getElementById(id);

          if (elementWithId) {
            return elementWithId;
          }
        }
      }
    }
  }

  toString() {
    let name = this.getName();

    if (this.nativeNode.props) {
      if (this.nativeNode.props.className) {
        name = name + "." + this.nativeNode.props.className.split(/\s+/g).join(".");
      }

      if (this.nativeNode.props.id) {
        name = name + "#" + this.nativeNode.props.id;
      }
    }

    return "Node<" + name + ">";
  }

  compareDocumentPosition(other) {
    return compareDocumentPosition(this, other);
  }
}

class ReactDocument {
  constructor(nativeNode) {
    if (!isValidElement(nativeNode)) {
      throw new Error("Expected a React element");
    }

    this.elementNode = new ReactElement(nativeNode, this, 0);
  }

  getId() {
    return "0";
  }

  isEqual(node) {
    return this.getId() === node.getId();
  }

  getNativeNode() {
    throw new Error("Accessing the abstract document node is not allowed");
  }

  asString() {
    return this.elementNode.asString();
  }

  asNumber() {
    return +this.asString();
  }

  getNodeType() {
    return DOCUMENT_NODE;
  }

  getChildNodes() {
    return [this.elementNode];
  }

  getFollowingSiblings() {
    return undefined;
  }

  getPrecedingSiblings() {
    return undefined;
  }

  getName() {
    return undefined;
  }

  getAttributes() {
    return undefined;
  }

  getOwnerDocument() {
    return undefined;
  }

  getElementById(id) {
    return this.elementNode._getElementById(id);
  }

  toString() {
    return "Node<document>";
  }

  compareDocumentPosition(other) {
    return compareDocumentPosition(this, other);
  }
}

const XPath = new XPathEvaluator(ReactDocument);

function find (element, expression) {
  const result = XPath.evaluate(
    expression,
    element,
    null,
    XPathResult.ANY_TYPE, null);

  switch (result.resultType) {
    case XPathResult.UNORDERED_NODE_ITERATOR_TYPE:
      return result.iterateNext();

    case XPathResult.STRING_TYPE:
      return result.stringValue;

    case XPathResult.NUMBER_TYPE:
      return result.numberValue;

    case XPathResult.BOOLEAN_TYPE:
      return result.booleanValue;
  }
}

function evaluate$Y (expression, context, nsResolver, type) {
  return XPath.evaluate(expression, context, nsResolver, type);
}

function createExpression (expression, nsResolver) {
  return XPath.createExpression(expression, nsResolver);
}

function createNSResolver (nodeResolver) {
  return XPath.createNSResolver(nodeResolver)
}

export { find, evaluate$Y as evaluate, createExpression, createNSResolver, XPathResult };
