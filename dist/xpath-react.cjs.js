'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var react = require('react');

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

const ABSOLUTE_LOCATION_PATH = "absolute-location-path";
const ADDITIVE = "additive";
const AND = "and";
const DIVISIONAL = "divisional";
const EQUALITY = "equality";
const FILTER = "filter";
const FUNCTION_CALL = "function-call";
const GREATER_THAN = "greater-than";
const GREATER_THAN_OR_EQUAL = "greater-than-or-equal";
const INEQUALITY = "inequality";
const LESS_THAN = "less-than";
const LESS_THAN_OR_EQUAL = "less-than-or-equal";
const LITERAL = "literal";
const MODULUS = "modulus";
const MULTIPLICATIVE = "multiplicative";
const NEGATION = "negation";
const NUMBER = "number";
const OR = "or";
const PATH = "path";
const RELATIVE_LOCATION_PATH = "relative-location-path";
const SUBTRACTIVE = "subtractive";
const UNION = "union";
const NODE_NAME_TEST = "node-name-test";
const NODE_TYPE_TEST = "node-type-test";
const PROCESSING_INSTRUCTION_TEST = "processing-instruction-test";

const ANCESTOR = "ancestor";
const ANCESTOR_OR_SELF = "ancestor-or-self";
const ATTRIBUTE = "attribute";
const CHILD = "child";
const DESCENDANT = "descendant";
const DESCENDANT_OR_SELF = "descendant-or-self";
const FOLLOWING = "following";
const FOLLOWING_SIBLING = "following-sibling";
const NAMESPACE = "namespace";
const PARENT = "parent";
const PRECEDING = "preceding";
const PRECEDING_SIBLING = "preceding-sibling";
const SELF = "self";

const COMMENT = "comment";
const NODE = "node";
const PROCESSING_INSTRUCTION = "processing-instruction";
const TEXT = "text";

function parse(rootParser, lexer) {
    lexer.next();
    var predicate = rootParser.parse(lexer);
    if (lexer.peak() === "]") {
        lexer.next();
    }
    else {
        throw new Error("Invalid token at position " + lexer.position() + ", expected closing bracket");
    }
    return predicate;
}

function isValid(type) {
    return type == COMMENT ||
        type == NODE ||
        type == PROCESSING_INSTRUCTION ||
        type == TEXT;
}

const BOOLEAN = "boolean";
const CEILING = "ceiling";
const CONCAT = "concat";
const CONTAINS = "contains";
const COUNT = "count";
const FALSE = "false";
const FLOOR = "floor";
const ID = "id";
const LAST = "last";
const LOCAL_NAME = "local-name";
const NAME = "name";
const NORMALIZE_SPACE = "normalize-space";
const NOT = "not";
const POSITION = "position";
const ROUND = "round";
const STARTS_WITH = "starts-with";
const STRING_LENGTH = "string-length";
const STRING = "string";
const SUBSTRING_AFTER = "substring-after";
const SUBSTRING_BEFORE = "substring-before";
const SUBSTRING = "substring";
const SUM = "sum";
const TRANSLATE = "translate";
const TRUE = "true";

function isValid$1(name) {
    return name == BOOLEAN ||
        name == CEILING ||
        name == CONCAT ||
        name == CONTAINS ||
        name == COUNT ||
        name == FALSE ||
        name == FLOOR ||
        name == ID ||
        name == LAST ||
        name == LOCAL_NAME ||
        name == NAME ||
        name == NORMALIZE_SPACE ||
        name == NOT ||
        name == NUMBER ||
        name == POSITION ||
        name == ROUND ||
        name == STARTS_WITH ||
        name == STRING_LENGTH ||
        name == STRING ||
        name == SUBSTRING_AFTER ||
        name == SUBSTRING_BEFORE ||
        name == SUBSTRING ||
        name == SUM ||
        name == TRANSLATE ||
        name == TRUE;
}

function parse$1(rootParser, lexer) {
    var functionName = lexer.peak();
    if (!isValid$1(functionName)) {
        throw new Error("Invalid function at position " + lexer.position());
    }
    lexer.next();
    var functionCall = {
        type: FUNCTION_CALL,
        name: functionName,
        args: []
    };
    lexer.next();
    if (lexer.peak() === ")") {
        lexer.next();
    }
    else {
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

function parse$2(rootParser, lexer) {
    var token = lexer.peak(), ch = token && token[0];
    if (ch === "(") {
        lexer.next();
        var expr = rootParser.parse(lexer);
        if (lexer.peak() === ")") {
            lexer.next();
        }
        else {
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
    throw new Error("Unexpected token at position " + lexer.position());
}
function isValidOp(lexer) {
    var token = lexer.peak(), ch = token && token[0];
    return ch === "(" ||
        ch === "\"" ||
        ch === "'" ||
        ch === "$" ||
        /^\d+$/.test(token) ||
        /^(\d+)?\.\d+$/.test(token) ||
        (lexer.peak(1) === "(" && !isValid(lexer.peak()));
}

function parse$3(rootParser, lexer) {
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
    }
    else {
        return primary;
    }
}
function isValidOp$1(lexer) {
    return isValidOp(lexer);
}

function isValid$2(specifier) {
    return specifier == ANCESTOR ||
        specifier == ANCESTOR_OR_SELF ||
        specifier == ATTRIBUTE ||
        specifier == CHILD ||
        specifier == DESCENDANT ||
        specifier == DESCENDANT_OR_SELF ||
        specifier == FOLLOWING ||
        specifier == FOLLOWING_SIBLING ||
        specifier == NAMESPACE ||
        specifier == PARENT ||
        specifier == PRECEDING ||
        specifier == PRECEDING_SIBLING ||
        specifier == SELF;
}

function parse$4(rootParser, lexer) {
    if (lexer.peak() === "*") {
        lexer.next();
        return {
            type: NODE_NAME_TEST,
            name: "*"
        };
    }
    if (lexer.peak(1) === "(") {
        if (isValid(lexer.peak())) {
            var test, type = lexer.next();
            lexer.next();
            if (type === PROCESSING_INSTRUCTION) {
                var token = lexer.peak(), ch = token && token[0];
                test = {
                    type: PROCESSING_INSTRUCTION_TEST,
                    name: (ch === "\"" || ch === "'") ? lexer.next().slice(1, -1) : undefined
                };
            }
            else {
                test = {
                    type: NODE_TYPE_TEST,
                    name: type
                };
            }
            if (lexer.peak() !== ")") {
                throw new Error("Invalid token at position " + lexer.position() + ", expected closing parenthesis");
            }
            else {
                lexer.next();
            }
            return test;
        }
        else {
            throw new Error("Invalid node type at position " + lexer.position());
        }
    }
    return {
        type: NODE_NAME_TEST,
        name: lexer.next()
    };
}

function parse$5(rootParser, lexer) {
    if (lexer.peak() === "..") {
        lexer.next();
        return {
            axis: PARENT,
            test: {
                type: NODE_TYPE_TEST,
                name: NODE
            },
            predicates: []
        };
    }
    else if (lexer.peak() === ".") {
        lexer.next();
        return {
            axis: SELF,
            test: {
                type: NODE_TYPE_TEST,
                name: NODE
            },
            predicates: []
        };
    }
    var axis;
    if (lexer.peak(1) === "::") {
        var possiblyAxis = lexer.peak();
        if (isValid$2(possiblyAxis)) {
            axis = possiblyAxis;
            lexer.next();
            lexer.next();
        }
        else {
            throw new Error("Invalid axis specifier at position " + lexer.position());
        }
    }
    else if (lexer.peak() === "@") {
        lexer.next();
        axis = ATTRIBUTE;
    }
    else {
        axis = CHILD;
    }
    var step = {
        axis: axis,
        test: parse$4(rootParser, lexer),
        predicates: []
    };
    while (lexer.peak() === "[") {
        step.predicates.push(parse(rootParser, lexer));
    }
    return step;
}
function isValidOp$2(lexer) {
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

function parse$6(rootParser, lexer) {
    var absoluteLocation = {
        type: ABSOLUTE_LOCATION_PATH,
        steps: []
    };
    while (!lexer.empty() && lexer.peak()[0] === "/") {
        if (lexer.next() === "/") {
            if (isValidOp$2(lexer)) {
                absoluteLocation.steps.push(parse$5(rootParser, lexer));
            }
        }
        else {
            absoluteLocation.steps.push({
                axis: DESCENDANT_OR_SELF,
                test: {
                    type: NODE_TYPE_TEST,
                    name: NODE
                },
                predicates: []
            });
            absoluteLocation.steps.push(parse$5(rootParser, lexer));
        }
    }
    return absoluteLocation;
}

function parse$7(rootParser, lexer) {
    var relativeLocation = {
        type: RELATIVE_LOCATION_PATH,
        steps: [parse$5(rootParser, lexer)]
    };
    while (!lexer.empty() && lexer.peak()[0] === "/") {
        if (lexer.next() === "//") {
            relativeLocation.steps.push({
                axis: DESCENDANT_OR_SELF,
                test: {
                    type: NODE_TYPE_TEST,
                    name: NODE
                },
                predicates: []
            });
        }
        relativeLocation.steps.push(parse$5(rootParser, lexer));
    }
    return relativeLocation;
}

function parse$8(rootParser, lexer) {
    var token = lexer.peak(), ch = token && token[0];
    if (ch === "/") {
        return parse$6(rootParser, lexer);
    }
    else {
        return parse$7(rootParser, lexer);
    }
}

function parse$9(rootParser, lexer) {
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
                            type: NODE_TYPE_TEST,
                            name: NODE
                        },
                        predicates: []
                    });
                }
                path.steps.push(parse$5(rootParser, lexer));
            }
            return path;
        }
        else {
            return filter;
        }
    }
    else {
        return parse$8(rootParser, lexer);
    }
}

function parse$a(rootParser, lexer) {
    var lhs = parse$9(rootParser, lexer);
    if (lexer.peak() === "|") {
        lexer.next();
        var rhs = parse$a(rootParser, lexer);
        return {
            type: UNION,
            lhs: lhs,
            rhs: rhs
        };
    }
    else {
        return lhs;
    }
}

function parse$b(rootParser, lexer) {
    if (lexer.peak() === "-") {
        lexer.next();
        return {
            type: NEGATION,
            lhs: parse$b(rootParser, lexer)
        };
    }
    else {
        return parse$a(rootParser, lexer);
    }
}

function parse$c(rootParser, lexer) {
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
    }
    else {
        return lhs;
    }
}

function parse$d(rootParser, lexer) {
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
    }
    else {
        return lhs;
    }
}

function parse$e(rootParser, lexer) {
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
    }
    else {
        return lhs;
    }
}

function parse$f(rootParser, lexer) {
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
    }
    else {
        return lhs;
    }
}

function parse$g(rootParser, lexer) {
    var lhs = parse$f(rootParser, lexer);
    if (lexer.peak() === "and") {
        lexer.next();
        var rhs = parse$g(rootParser, lexer);
        return {
            type: AND,
            lhs: lhs,
            rhs: rhs
        };
    }
    else {
        return lhs;
    }
}

function parse$h(rootParser, lexer) {
    var lhs = parse$g(rootParser, lexer);
    if (lexer.peak() === "or") {
        lexer.next();
        var rhs = parse$h(rootParser, lexer);
        return {
            type: OR,
            lhs: lhs,
            rhs: rhs
        };
    }
    else {
        return lhs;
    }
}

function parse$i(lexer) {
    return parse$h({ parse: parse$i }, lexer);
}

class XPathAnalyzer {
    constructor(expression) {
        this.lexer = new XPathLexer(expression);
    }
    parse() {
        var ast = parse$i(this.lexer);
        if (this.lexer.empty()) {
            return ast;
        }
        else {
            throw new Error("Unexpected token at position " + this.lexer.position());
        }
    }
}

class Context {
    constructor(node, position, last) {
        this.node = node;
        this.position = position;
        this.last = last;
    }
    getNode() {
        return this.node;
    }
    getPosition() {
        return this.position;
    }
    getLast() {
        return this.last;
    }
    toString() {
        return "Context<" + this.node + ">";
    }
}

class NodeWrapper {
    constructor(node) {
        this.node = node;
    }
}
class ListBounds {
    constructor(head, tail) {
        this.head = head;
        this.tail = tail;
    }
}
class EmptyIterator {
    [Symbol.iterator]() {
        return this;
    }
    next() {
        return {
            done: true,
            value: null
        };
    }
    remove() { }
}
class Iterator {
    constructor(list, reversed = false) {
        this.list = list;
        this.reversed = reversed;
        this.current = reversed ? list.tail() : list.head();
        this.lastReturned = null;
        this.i = 0;
    }
    [Symbol.iterator]() {
        return this;
    }
    next() {
        this.i++;
        if (this.i > 10000) {
            throw new Error("An error has probably ocurred!");
        }
        if (this.current) {
            this.lastReturned = this.current;
            if (this.reversed) {
                this.current = this.current.previous;
            }
            else {
                this.current = this.current.next;
            }
            return {
                done: false,
                value: this.lastReturned.node
            };
        }
        else {
            /**
             * Somehwere along the road, iterators and strictNullChecks stopped working well together.
             *
             * @see https://github.com/Microsoft/TypeScript/issues/11375
             */
            return {
                done: true,
                value: null
            };
        }
    }
    remove() {
        if (!this.lastReturned) {
            throw new Error("Iterator.remove() was called before iterating");
        }
        if (!this.list.bounds_) {
            throw new Error("Iterator.remove() was somehow invoked on an empty list");
        }
        var next = this.lastReturned.next, previous = this.lastReturned.previous;
        if (next && previous) {
            next.previous = previous;
            previous.next = next;
        }
        else if (next) {
            next.previous = previous;
            this.list.bounds_.head = next;
        }
        else if (previous) {
            previous.next = next;
            this.list.bounds_.tail = previous;
        }
        else {
            this.list.bounds_ = null;
        }
        this.lastReturned = null;
        this.list.length_--;
    }
}
class LinkedList {
    constructor(nodes) {
        this.length_ = 0;
        if (nodes) {
            nodes.forEach(function (node) {
                this.push(node);
            }, this);
        }
    }
    iterator(reversed) {
        if (this.bounds_) {
            return new Iterator(this, reversed);
        }
        else {
            return new EmptyIterator();
        }
    }
    head() {
        return this.bounds_ && this.bounds_.head;
    }
    tail() {
        return this.bounds_ && this.bounds_.tail;
    }
    length() {
        return this.length_;
    }
    empty() {
        return this.length_ === 0;
    }
    push(node) {
        var entry = new NodeWrapper(node);
        if (this.bounds_) {
            entry.previous = this.bounds_.tail;
            this.bounds_.tail.next = entry;
            this.bounds_.tail = entry;
        }
        else {
            this.bounds_ = new ListBounds(entry, entry);
        }
        this.length_++;
        return this;
    }
    unshift(node) {
        var entry = new NodeWrapper(node);
        if (this.bounds_) {
            entry.next = this.bounds_.head;
            this.bounds_.head.previous = entry;
            this.bounds_.head = entry;
        }
        else {
            this.bounds_ = new ListBounds(entry, entry);
        }
        this.length_++;
        return this;
    }
    filter(condition) {
        var iter = this.iterator();
        for (var node of iter) {
            if (!condition(node)) {
                iter.remove();
            }
        }
        return this;
    }
}

class XPathNodeSet extends LinkedList {
    asString() {
        var first = this.first();
        if (first) {
            return first.asString();
        }
        else {
            return "";
        }
    }
    first() {
        return this.bounds_ && this.bounds_.head.node;
    }
    last() {
        return this.bounds_ && this.bounds_.tail.node;
    }
    asNumber() {
        return +this.asString();
    }
    asBoolean() {
        return this.length() !== 0;
    }
    merge(b) {
        var a = this;
        var merged = new XPathNodeSet();
        var aCurr = a.bounds_ && a.bounds_.head;
        var bCurr = b.bounds_ && b.bounds_.head;
        while (aCurr && bCurr) {
            if (aCurr.node.isEqual(bCurr.node)) {
                merged.push(aCurr.node);
                aCurr = aCurr.next;
                bCurr = bCurr.next;
            }
            else {
                var compareResult = aCurr.node.compareDocumentPosition(bCurr.node);
                if (compareResult > 0) {
                    merged.push(bCurr.node);
                    bCurr = bCurr.next;
                }
                else {
                    merged.push(aCurr.node);
                    aCurr = aCurr.next;
                }
            }
        }
        var next = aCurr || bCurr;
        while (next) {
            merged.push(next.node);
            next = next.next;
        }
        return merged;
    }
    toString() {
        var nodes = [];
        for (var node of this.iterator()) {
            nodes.push("" + node);
        }
        return "NodeSet<" + nodes.join(", ") + ">";
    }
}

const ELEMENT_NODE = 1;
const ATTRIBUTE_NODE = 2;
const TEXT_NODE = 3;
const PROCESSING_INSTRUCTION_NODE = 7;
const COMMENT_NODE = 8;
const DOCUMENT_NODE = 9;

function evaluate(rootEvaluator, context, type) {
    var nodes = new XPathNodeSet();
    if (context.getNode().getNodeType() !== DOCUMENT_NODE) {
        nodes = nodes.unshift(context.getNode().getParent());
        nodes = nodes.merge(evaluate(rootEvaluator, new Context(context.getNode().getParent(), 1, 1), type));
    }
    return nodes;
}

function evaluate$1(rootEvaluator, context, type) {
    var nodes = new XPathNodeSet([context.getNode()]);
    return evaluate(rootEvaluator, context, type).merge(nodes);
}

function evaluate$2(rootEvaluator, context, type) {
    return new XPathNodeSet(context.getNode().getAttributes());
}

function evaluate$3(rootEvaluator, context, type) {
    return new XPathNodeSet(context.getNode().getChildNodes());
}

function evaluate$4(rootEvaluator, context, type) {
    var nodes = new XPathNodeSet();
    var children = new XPathNodeSet(context.getNode().getChildNodes());
    for (var child of children.iterator()) {
        nodes = nodes.push(child);
        nodes = nodes.merge(evaluate$4(rootEvaluator, new Context(child, 1, 1), type));
    }
    return nodes;
}

function evaluate$5(rootEvaluator, context, type) {
    var nodes = new XPathNodeSet([context.getNode()]);
    return nodes.merge(evaluate$4(rootEvaluator, context, type));
}

function evaluate$6(rootEvaluator, context, type) {
    return rootEvaluator.evaluate({
        type: RELATIVE_LOCATION_PATH,
        steps: [{
                axis: ANCESTOR_OR_SELF,
                test: {
                    type: NODE_TYPE_TEST,
                    name: NODE
                },
                predicates: []
            }, {
                axis: FOLLOWING_SIBLING,
                test: {
                    type: NODE_TYPE_TEST,
                    name: NODE
                },
                predicates: []
            }, {
                axis: DESCENDANT_OR_SELF,
                test: {
                    type: NODE_TYPE_TEST,
                    name: NODE
                },
                predicates: []
            }]
    }, context, type);
}

function evaluate$7(rootEvaluator, context, type) {
    return new XPathNodeSet(context.getNode().getFollowingSiblings());
}

function evaluate$8(rootEvaluator, context, type) {
    throw new Error("Namespace axis is not implemented");
}

function evaluate$9(rootEvaluator, context, type) {
    var nodes = new XPathNodeSet();
    if (context.getNode().getNodeType() !== DOCUMENT_NODE) {
        nodes = nodes.push(context.getNode().getParent());
    }
    return nodes;
}

function evaluate$a(rootEvaluator, context, type) {
    return rootEvaluator.evaluate({
        type: RELATIVE_LOCATION_PATH,
        steps: [{
                axis: ANCESTOR_OR_SELF,
                test: {
                    type: NODE_TYPE_TEST,
                    name: NODE
                },
                predicates: []
            }, {
                axis: PRECEDING_SIBLING,
                test: {
                    type: NODE_TYPE_TEST,
                    name: NODE
                },
                predicates: []
            }, {
                axis: DESCENDANT_OR_SELF,
                test: {
                    type: NODE_TYPE_TEST,
                    name: NODE
                },
                predicates: []
            }]
    }, context, type);
}

function evaluate$b(rootEvaluator, context, type) {
    return new XPathNodeSet(context.getNode().getPrecedingSiblings());
}

function evaluate$c(rootEvaluator, context, type) {
    return new XPathNodeSet([context.getNode()]);
}

class XPathNumber {
    constructor(value) {
        this.value = value;
    }
    asString() {
        return "" + this.value;
    }
    asNumber() {
        return this.value;
    }
    asBoolean() {
        return !!this.value;
    }
}

function getAxisEvaluator(axis) {
    switch (axis) {
        case ANCESTOR: return evaluate;
        case ANCESTOR_OR_SELF: return evaluate$1;
        case ATTRIBUTE: return evaluate$2;
        case CHILD: return evaluate$3;
        case DESCENDANT: return evaluate$4;
        case DESCENDANT_OR_SELF: return evaluate$5;
        case FOLLOWING: return evaluate$6;
        case FOLLOWING_SIBLING: return evaluate$7;
        case NAMESPACE: return evaluate$8;
        case PARENT: return evaluate$9;
        case PRECEDING: return evaluate$a;
        case PRECEDING_SIBLING: return evaluate$b;
        case SELF: return evaluate$c;
    }
}
function evaluate$d(rootEvaluator, ast, context, type) {
    var nodes = getAxisEvaluator(ast.axis)(rootEvaluator, context, type);
    var test = ast.test;
    if (test.type === NODE_NAME_TEST || (test.type == PROCESSING_INSTRUCTION_TEST && test.name)) {
        var name = ast.test.name;
        nodes = nodes.filter(function (node) {
            return (name === "*" && !!node.getName()) || node.getName() === ast.test.name;
        });
    }
    if ((test.type === NODE_TYPE_TEST && test.name !== NODE) || test.type === PROCESSING_INSTRUCTION_TEST) {
        var nodeType;
        if (test.type === NODE_TYPE_TEST) {
            switch (test.name) {
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
                    throw new Error("Unknown node nodeType " + test.name);
            }
        }
        else {
            nodeType = PROCESSING_INSTRUCTION_NODE;
        }
        nodes = nodes.filter(function (node) {
            return node.getNodeType() === nodeType;
        });
    }
    if (ast.predicates.length > 0) {
        var reversed = (ast.axis === ANCESTOR ||
            ast.axis === ANCESTOR_OR_SELF ||
            ast.axis === PRECEDING ||
            ast.axis === PRECEDING_SIBLING);
        var position = 0, length = nodes.length(), iter = nodes.iterator(reversed);
        for (var node of iter) {
            position++;
            var keep = ast.predicates.every(function (predicate) {
                var result = rootEvaluator.evaluate(predicate, new Context(node, position, length), type);
                if (result === null) {
                    return false;
                }
                if (result instanceof XPathNumber) {
                    return result.asNumber() === position;
                }
                else {
                    return result.asBoolean();
                }
            });
            if (!keep) {
                iter.remove();
            }
        }
    }
    return nodes;
}

function evaluate$e(rootEvaluator, ast, context, type) {
    var nodeSet = new XPathNodeSet([context.getNode()]), nextNodeSet = new XPathNodeSet();
    if (ast.steps) {
        for (var i = 0; i < ast.steps.length; i++) {
            for (var node of nodeSet.iterator()) {
                var stepResult = evaluate$d(rootEvaluator, ast.steps[i], new Context(node, 1, 1), type);
                nextNodeSet = nextNodeSet.merge(stepResult);
            }
            nodeSet = nextNodeSet;
            nextNodeSet = new XPathNodeSet();
        }
    }
    return nodeSet;
}

function evaluate$f(rootEvaluator, ast, context, type) {
    return evaluate$e(rootEvaluator, {
        type: RELATIVE_LOCATION_PATH,
        steps: ast.steps
    }, new Context(context.getNode().getOwnerDocument(), 1, 1), type);
}

function evaluate$g(rootEvaluator, ast, context, type) {
    var lhs = rootEvaluator.evaluate(ast.lhs, context, type);
    var rhs = rootEvaluator.evaluate(ast.rhs, context, type);
    return new XPathNumber(lhs.asNumber() + rhs.asNumber());
}

class XPathBoolean {
    constructor(value) {
        this.value = value;
    }
    asString() {
        return "" + this.value;
    }
    asNumber() {
        return this.value ? 1 : 0;
    }
    asBoolean() {
        return this.value;
    }
}

function evaluate$h(rootEvaluator, ast, context, type) {
    var lhs = rootEvaluator.evaluate(ast.lhs, context, type);
    if (!lhs.asBoolean()) {
        return new XPathBoolean(false);
    }
    var rhs = rootEvaluator.evaluate(ast.rhs, context, type);
    return new XPathBoolean(rhs.asBoolean());
}

function evaluate$i(rootEvaluator, ast, context, type) {
    var lhs = rootEvaluator.evaluate(ast.lhs, context, type);
    var rhs = rootEvaluator.evaluate(ast.rhs, context, type);
    return new XPathNumber(lhs.asNumber() / rhs.asNumber());
}

class XPathString {
    constructor(value) {
        this.value = value;
    }
    asString() {
        return this.value;
    }
    asNumber() {
        return +this.value;
    }
    asBoolean() {
        return this.value.length !== 0;
    }
}

function compareNodes(type, lhs, rhs, comparator) {
    if (lhs instanceof XPathNodeSet && rhs instanceof XPathNodeSet) {
        for (var lNode of lhs.iterator()) {
            for (var rNode of rhs.iterator()) {
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
        }
        else {
            nodeSet = rhs;
            primitive = lhs;
        }
        if (primitive instanceof XPathBoolean) {
            if (comparator(nodeSet.asBoolean(), primitive.asBoolean())) {
                return new XPathBoolean(true);
            }
        }
        else {
            for (var node of nodeSet.iterator()) {
                if (primitive instanceof XPathNumber) {
                    if (comparator(node.asNumber(), primitive.asNumber())) {
                        return new XPathBoolean(true);
                    }
                }
                else if (primitive instanceof XPathString) {
                    if (comparator(node.asString(), primitive.asString())) {
                        return new XPathBoolean(true);
                    }
                }
                else {
                    throw new Error("Unknown value type");
                }
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
        }
        else if (lhs instanceof XPathNumber || rhs instanceof XPathNumber) {
            if (comparator(lhs.asNumber(), rhs.asNumber())) {
                return new XPathBoolean(true);
            }
        }
        else if (lhs instanceof XPathString || rhs instanceof XPathString) {
            if (comparator(lhs.asString(), rhs.asString())) {
                return new XPathBoolean(true);
            }
        }
        else {
            throw new Error("Unknown value types");
        }
        return new XPathBoolean(false);
    }
    else {
        return new XPathBoolean(comparator(lhs.asNumber(), rhs.asNumber()));
    }
}

function evaluate$j(rootEvaluator, ast, context, type) {
    return compareNodes(ast.type, rootEvaluator.evaluate(ast.lhs, context, type), rootEvaluator.evaluate(ast.rhs, context, type), function (lhs, rhs) {
        return lhs === rhs;
    });
}

function evaluate$k(rootEvaluator, ast, context, type) {
    const nodes = rootEvaluator.evaluate(ast.primary, context, type);
    if (!(nodes instanceof XPathNodeSet)) {
        throw new Error("Predicates can only be used when primary expression yields a node-set");
    }
    var position = 0, length = nodes.length(), iter = nodes.iterator();
    for (var node of iter) {
        position++;
        var keep = ast.predicates.every(function (predicate) {
            var result = rootEvaluator.evaluate(predicate, new Context(node, position, length), type);
            if (result === null) {
                return false;
            }
            if (result instanceof XPathNumber) {
                return result.asNumber() === position;
            }
            else {
                return result.asBoolean();
            }
        });
        if (!keep) {
            iter.remove();
        }
    }
    return nodes;
}

function evaluate$l(context, ...args) {
    if (args.length !== 1) {
        throw new Error("Expected a single argument");
    }
    return new XPathBoolean(args[0].asBoolean());
}

function evaluate$m(context, ...args) {
    if (args.length !== 1) {
        throw new Error("Expected a single argument");
    }
    var number = args[0];
    if (!(number instanceof XPathNumber)) {
        throw new Error("Wrong type of argument");
    }
    return new XPathNumber(Math.ceil(number.asNumber()));
}

function evaluate$n(context, ...args) {
    if (args.length === 0) {
        throw new Error("Expected some arguments");
    }
    return new XPathString(args.map(function (arg) {
        return arg.asString();
    }).join(""));
}

function evaluate$o(context, ...args) {
    if (args.length !== 2) {
        throw new Error("Expected two arguments");
    }
    var base = args[0].asString();
    var contains = args[1].asString();
    return new XPathBoolean(base.indexOf(contains) !== -1);
}

function evaluate$p(context, ...args) {
    if (args.length !== 1) {
        throw new Error("Expected a single argument");
    }
    var nodeset = args[0];
    if (!(nodeset instanceof XPathNodeSet)) {
        throw new Error("Wrong type of argument");
    }
    return new XPathNumber(nodeset.length());
}

function evaluate$q(context, ...args) {
    return new XPathBoolean(false);
}

function evaluate$r(context, ...args) {
    if (args.length !== 1) {
        throw new Error("Expected a single argument");
    }
    var number = args[0];
    if (!(number instanceof XPathNumber)) {
        throw new Error("Wrong type of argument");
    }
    return new XPathNumber(Math.floor(number.asNumber()));
}

function evaluate$s(context, ...args) {
    if (args.length !== 1) {
        throw new Error("Expected a single argument");
    }
    var value = args[0];
    var node, ids = [];
    if (value instanceof XPathNodeSet) {
        for (node of value.iterator()) {
            ids = ids.concat(node.asString().split(/\s+/g));
        }
    }
    else if (value instanceof XPathString) {
        ids = value.asString().split(/\s+/g);
    }
    else {
        ids.push(value.asString());
    }
    var nodes = new XPathNodeSet();
    for (var i = 0; i < ids.length; i++) {
        node = context.getNode().getOwnerDocument().getElementById(ids[i]);
        if (node) {
            nodes = nodes.merge(new XPathNodeSet([node]));
        }
    }
    return nodes;
}

function evaluate$t(context, ...args) {
    return new XPathNumber(context.getLast());
}

function evaluate$u(context, ...args) {
    var nodeset = args[0];
    if (!nodeset) {
        nodeset = new XPathNodeSet([context.getNode()]);
    }
    if (args.length > 1) {
        throw new Error("Expected at most one argument");
    }
    if (!(nodeset instanceof XPathNodeSet)) {
        throw new Error("Wrong type of argument");
    }
    var first = nodeset.first();
    if (first) {
        return new XPathString(first.getName());
    }
    else {
        return new XPathString("");
    }
}

function evaluate$v(context, ...args) {
    var nodeset = args[0];
    if (!nodeset) {
        return new XPathString(context.getNode().getName());
    }
    else {
        if (args.length > 1) {
            throw new Error("Expected at most one argument");
        }
        if (!(nodeset instanceof XPathNodeSet)) {
            throw new Error("Wrong type of argument");
        }
        if (nodeset.empty()) {
            return new XPathString("");
        }
        else {
            return new XPathString(nodeset.first().getName());
        }
    }
}

function evaluate$w(context, ...args) {
    var value = args[0];
    var string;
    if (!value) {
        string = context.getNode().asString();
    }
    else {
        if (args.length > 1) {
            throw new Error("Expected at most one argument");
        }
        string = value.asString();
    }
    return new XPathString(string.trim().replace(/\s{2,}/g, " "));
}

function evaluate$x(context, ...args) {
    if (args.length !== 1) {
        throw new Error("Expected a single argument");
    }
    return new XPathBoolean(!args[0].asBoolean());
}

function evaluate$y(context, ...args) {
    if (args.length !== 1) {
        throw new Error("Expected a single argument");
    }
    return new XPathNumber(args[0].asNumber());
}

function evaluate$z(context, ...args) {
    return new XPathNumber(context.getPosition());
}

function evaluate$A(context, ...args) {
    if (args.length !== 1) {
        throw new Error("Expected a single argument");
    }
    var number = args[0];
    if (!(number instanceof XPathNumber)) {
        throw new Error("Wrong type of argument");
    }
    return new XPathNumber(Math.round(number.asNumber()));
}

function evaluate$B(context, ...args) {
    if (args.length !== 2) {
        throw new Error("Expected two arguments");
    }
    var base = args[0].asString();
    var substring = args[1].asString();
    var index = base.indexOf(substring);
    return new XPathBoolean(index === 0);
}

function evaluate$C(context, ...args) {
    var string = args[0];
    if (!string) {
        return new XPathNumber(context.getNode().asString().length);
    }
    else {
        if (args.length > 1) {
            throw new Error("Expected at most one argument");
        }
        if (!(string instanceof XPathString)) {
            throw new Error("Wrong type of argument");
        }
        return new XPathNumber(string.asString().length);
    }
}

function evaluate$D(context, ...args) {
    var value = args[0];
    if (!value) {
        value = new XPathNodeSet([context.getNode()]);
    }
    if (args.length > 1) {
        throw new Error("Expected at most one argument");
    }
    return new XPathString(value.asString());
}

function evaluate$E(context, ...args) {
    if (args.length !== 2) {
        throw new Error("Expected two arguments");
    }
    var base = args[0].asString();
    var substring = args[1].asString();
    var index = base.indexOf(substring);
    if (index === -1) {
        return new XPathString("");
    }
    else {
        return new XPathString(base.substring(index + substring.length));
    }
}

function evaluate$F(context, ...args) {
    if (args.length !== 2) {
        throw new Error("Expected two arguments");
    }
    var base = args[0].asString();
    var substring = args[1].asString();
    var index = base.indexOf(substring);
    if (index === -1) {
        return new XPathString("");
    }
    else {
        return new XPathString(base.substring(0, index));
    }
}

function evaluate$G(context, ...args) {
    if (args.length !== 2 && args.length !== 3) {
        throw new Error("Expected two or three arguments");
    }
    var base = args[0].asString();
    var start = Math.round(args[1].asNumber());
    var length = args[2];
    if (isNaN(start) || start === Infinity || start === -Infinity) {
        return new XPathString("");
    }
    if (length) {
        var roundedLength = Math.round(length.asNumber());
        if (isNaN(roundedLength) || roundedLength === -Infinity) {
            return new XPathString("");
        }
        return new XPathString(base.substring(start - 1, start + roundedLength - 1));
    }
    else {
        return new XPathString(base.substring(start - 1));
    }
}

function evaluate$H(context, ...args) {
    if (args.length !== 1) {
        throw new Error("Expected a single argument");
    }
    var nodeset = args[0];
    if (!(nodeset instanceof XPathNodeSet)) {
        throw new Error("Wrong type of argument");
    }
    var sum = 0;
    for (var node of nodeset.iterator()) {
        sum = sum + node.asNumber();
    }
    return new XPathNumber(sum);
}

function evaluate$I(context, ...args) {
    if (args.length !== 3) {
        throw new Error("Expected three arguments");
    }
    if (!(args[0] instanceof XPathString) ||
        !(args[1] instanceof XPathString) ||
        !(args[2] instanceof XPathString)) {
        throw new Error("Expected string arguments");
    }
    var base = args[0].asString(), mapFrom = args[1].asString(), mapTo = args[2].asString();
    for (var i = 0; i < mapFrom.length; i++) {
        if (i < mapTo.length) {
            base = base.replace(new RegExp(mapFrom[i], "g"), mapTo[i]);
        }
        else {
            base = base.replace(new RegExp(mapFrom[i], "g"), "");
        }
    }
    return new XPathString(base);
}

function evaluate$J(context, ...args) {
    return new XPathBoolean(true);
}

function getFunctionEvaluator(name) {
    switch (name) {
        case BOOLEAN: return evaluate$l;
        case CEILING: return evaluate$m;
        case CONCAT: return evaluate$n;
        case CONTAINS: return evaluate$o;
        case COUNT: return evaluate$p;
        case FALSE: return evaluate$q;
        case FLOOR: return evaluate$r;
        case ID: return evaluate$s;
        case LAST: return evaluate$t;
        case LOCAL_NAME: return evaluate$u;
        case NAME: return evaluate$v;
        case NORMALIZE_SPACE: return evaluate$w;
        case NOT: return evaluate$x;
        case NUMBER: return evaluate$y;
        case POSITION: return evaluate$z;
        case ROUND: return evaluate$A;
        case STARTS_WITH: return evaluate$B;
        case STRING_LENGTH: return evaluate$C;
        case STRING: return evaluate$D;
        case SUBSTRING_AFTER: return evaluate$E;
        case SUBSTRING_BEFORE: return evaluate$F;
        case SUBSTRING: return evaluate$G;
        case SUM: return evaluate$H;
        case TRANSLATE: return evaluate$I;
        case TRUE: return evaluate$J;
    }
}
function evaluate$K(rootEvaluator, ast, context, type) {
    var args = ast.args.map(function (arg) {
        return rootEvaluator.evaluate(arg, context, type);
    });
    return getFunctionEvaluator(ast.name)(context, ...args);
}

function evaluate$L(rootEvaluator, ast, context, type) {
    return compareNodes(ast.type, rootEvaluator.evaluate(ast.lhs, context, type), rootEvaluator.evaluate(ast.rhs, context, type), function (lhs, rhs) {
        return lhs > rhs;
    });
}

function evaluate$M(rootEvaluator, ast, context, type) {
    return compareNodes(ast.type, rootEvaluator.evaluate(ast.lhs, context, type), rootEvaluator.evaluate(ast.rhs, context, type), function (lhs, rhs) {
        return lhs >= rhs;
    });
}

function evaluate$N(rootEvaluator, ast, context, type) {
    return compareNodes(ast.type, rootEvaluator.evaluate(ast.lhs, context, type), rootEvaluator.evaluate(ast.rhs, context, type), function (lhs, rhs) {
        return lhs !== rhs;
    });
}

function evaluate$O(rootEvaluator, ast, context, type) {
    return compareNodes(ast.type, rootEvaluator.evaluate(ast.lhs, context, type), rootEvaluator.evaluate(ast.rhs, context, type), function (lhs, rhs) {
        return lhs < rhs;
    });
}

function evaluate$P(rootEvaluator, ast, context, type) {
    return compareNodes(ast.type, rootEvaluator.evaluate(ast.lhs, context, type), rootEvaluator.evaluate(ast.rhs, context, type), function (lhs, rhs) {
        return lhs <= rhs;
    });
}

function evaluate$Q(rootEvaluator, ast, context, type) {
    return new XPathString(ast.string);
}

function evaluate$R(rootEvaluator, ast, context, type) {
    var lhs = rootEvaluator.evaluate(ast.lhs, context, type);
    var rhs = rootEvaluator.evaluate(ast.rhs, context, type);
    return new XPathNumber(lhs.asNumber() % rhs.asNumber());
}

function evaluate$S(rootEvaluator, ast, context, type) {
    var lhs = rootEvaluator.evaluate(ast.lhs, context, type);
    var rhs = rootEvaluator.evaluate(ast.rhs, context, type);
    return new XPathNumber(lhs.asNumber() * rhs.asNumber());
}

function evaluate$T(rootEvaluator, ast, context, type) {
    var lhs = rootEvaluator.evaluate(ast.lhs, context, type);
    return new XPathNumber(-lhs.asNumber());
}

function evaluate$U(rootEvaluator, ast, context, type) {
    return new XPathNumber(ast.number);
}

function evaluate$V(rootEvaluator, ast, context, type) {
    var lhs = rootEvaluator.evaluate(ast.lhs, context, type);
    if (lhs.asBoolean()) {
        return new XPathBoolean(true);
    }
    var rhs = rootEvaluator.evaluate(ast.rhs, context, type);
    return new XPathBoolean(rhs.asBoolean());
}

function evaluate$W(rootEvaluator, ast, context, type) {
    var nodes = rootEvaluator.evaluate(ast.filter, context, type);
    if (!(nodes instanceof XPathNodeSet)) {
        throw new Error("Paths can only be used when filter expression yields a node-set");
    }
    var nodeSets = [];
    for (var node of nodes.iterator()) {
        nodeSets.push(evaluate$e(rootEvaluator, {
            type: RELATIVE_LOCATION_PATH,
            steps: ast.steps
        }, new Context(node, 1, 1), type));
    }
    return nodeSets.reduce(function (previousValue, currentValue) {
        return previousValue.merge(currentValue);
    });
}

function evaluate$X(rootEvaluator, ast, context, type) {
    var lhs = rootEvaluator.evaluate(ast.lhs, context, type);
    var rhs = rootEvaluator.evaluate(ast.rhs, context, type);
    return new XPathNumber(lhs.asNumber() - rhs.asNumber());
}

function evaluate$Y(rootEvaluator, ast, context, type) {
    var lhs = rootEvaluator.evaluate(ast.lhs, context, type);
    if (!(lhs instanceof XPathNodeSet)) {
        throw new Error("Union operator can only be used with expression yielding node-set");
    }
    var rhs = rootEvaluator.evaluate(ast.rhs, context, type);
    if (!(rhs instanceof XPathNodeSet)) {
        throw new Error("Union operator can only be used with expression yielding node-set");
    }
    return lhs.merge(rhs);
}

class XPathException {
    constructor(code, message) {
        this.code = code;
        this.message = message;
    }
}

const TYPE_ERR = 52;

const ANY_TYPE = 0;
const NUMBER_TYPE = 1;
const STRING_TYPE = 2;
const BOOLEAN_TYPE = 3;
const UNORDERED_NODE_ITERATOR_TYPE = 4;
const ORDERED_NODE_ITERATOR_TYPE = 5;
const UNORDERED_NODE_SNAPSHOT_TYPE = 6;
const ORDERED_NODE_SNAPSHOT_TYPE = 7;
const ANY_UNORDERED_NODE_TYPE = 8;
const FIRST_ORDERED_NODE_TYPE = 9;

class XPathResult {
    constructor(type, value) {
        this.invalidIteratorState = false;
        this.ANY_TYPE = ANY_TYPE;
        this.NUMBER_TYPE = NUMBER_TYPE;
        this.STRING_TYPE = STRING_TYPE;
        this.BOOLEAN_TYPE = BOOLEAN_TYPE;
        this.UNORDERED_NODE_ITERATOR_TYPE = UNORDERED_NODE_ITERATOR_TYPE;
        this.ORDERED_NODE_ITERATOR_TYPE = ORDERED_NODE_ITERATOR_TYPE;
        this.UNORDERED_NODE_SNAPSHOT_TYPE = UNORDERED_NODE_SNAPSHOT_TYPE;
        this.ORDERED_NODE_SNAPSHOT_TYPE = ORDERED_NODE_SNAPSHOT_TYPE;
        this.ANY_UNORDERED_NODE_TYPE = ANY_UNORDERED_NODE_TYPE;
        this.FIRST_ORDERED_NODE_TYPE = FIRST_ORDERED_NODE_TYPE;
        this.value = value;
        if (type === ANY_TYPE) {
            if (value instanceof XPathNodeSet) {
                this.resultType = UNORDERED_NODE_ITERATOR_TYPE;
            }
            else if (value instanceof XPathString) {
                this.resultType = STRING_TYPE;
            }
            else if (value instanceof XPathNumber) {
                this.resultType = NUMBER_TYPE;
            }
            else if (value instanceof XPathBoolean) {
                this.resultType = BOOLEAN_TYPE;
            }
            else {
                throw new Error("Unexpected evaluation result");
            }
        }
        else {
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
            for (var node of this.value.iterator()) {
                this.nodes.push(node.getNativeNode());
            }
        }
        var self = this;
        var hasDefineProperty = true;
        try {
            Object.defineProperty({}, "x", {});
        }
        catch (e) {
            hasDefineProperty = false;
        }
        if (hasDefineProperty) {
            Object.defineProperty(this, "numberValue", { get: function () {
                    if (self.resultType !== NUMBER_TYPE) {
                        throw new XPathException(TYPE_ERR, "resultType is not NUMBER_TYPE");
                    }
                    return self.value.asNumber();
                } });
            Object.defineProperty(this, "stringValue", { get: function () {
                    if (self.resultType !== STRING_TYPE) {
                        throw new XPathException(TYPE_ERR, "resultType is not STRING_TYPE");
                    }
                    return self.value.asString();
                } });
            Object.defineProperty(this, "booleanValue", { get: function () {
                    if (self.resultType !== BOOLEAN_TYPE) {
                        throw new XPathException(TYPE_ERR, "resultType is not BOOLEAN_TYPE");
                    }
                    return self.value.asBoolean();
                } });
            Object.defineProperty(this, "singleNodeValue", { get: function () {
                    if (self.resultType !== FIRST_ORDERED_NODE_TYPE &&
                        self.resultType !== ANY_UNORDERED_NODE_TYPE) {
                        throw new XPathException(TYPE_ERR, "resultType is not a node set");
                    }
                    var first = self.value.first();
                    return first && first.getNativeNode();
                } });
            Object.defineProperty(this, "invalidIteratorState", { get: function () {
                    throw new Error("invalidIteratorState is not implemented");
                } });
            Object.defineProperty(this, "snapshotLength", { get: function () {
                    if (self.resultType !== ORDERED_NODE_SNAPSHOT_TYPE &&
                        self.resultType !== UNORDERED_NODE_SNAPSHOT_TYPE) {
                        throw new XPathException(TYPE_ERR, "resultType is not a node set");
                    }
                    return self.value.length();
                } });
        }
        else {
            if (this.resultType === NUMBER_TYPE) {
                this.numberValue = this.value.asNumber();
            }
            if (this.resultType === STRING_TYPE) {
                this.stringValue = this.value.asString();
            }
            if (this.resultType === BOOLEAN_TYPE) {
                this.booleanValue = this.value.asBoolean();
            }
            if (this.resultType === FIRST_ORDERED_NODE_TYPE ||
                this.resultType === ANY_UNORDERED_NODE_TYPE) {
                var first = this.value.first();
                this.singleNodeValue = first && first.getNativeNode();
            }
            if (this.resultType === ORDERED_NODE_SNAPSHOT_TYPE ||
                this.resultType === UNORDERED_NODE_SNAPSHOT_TYPE) {
                this.snapshotLength = this.value.length();
            }
        }
    }
    iterateNext() {
        if (this.resultType !== ORDERED_NODE_ITERATOR_TYPE &&
            this.resultType !== UNORDERED_NODE_ITERATOR_TYPE) {
            throw new XPathException(TYPE_ERR, "iterateNext called with wrong result type");
        }
        this.index = this.index || 0;
        return (this.index >= this.nodes.length) ? null : this.nodes[this.index++];
    }
    snapshotItem(index) {
        if (this.resultType !== ORDERED_NODE_SNAPSHOT_TYPE &&
            this.resultType !== UNORDERED_NODE_SNAPSHOT_TYPE) {
            throw new XPathException(TYPE_ERR, "snapshotItem called with wrong result type");
        }
        return this.nodes[index] || null;
    }
}
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

class XPathExpression {
    constructor(expression, adapter) {
        this.ast = new XPathAnalyzer(expression).parse();
        this.adapter = adapter;
    }
    evaluate(nativeContext, type) {
        var Adapter = this.adapter;
        var evaluate = (ast, context, type) => {
            switch (ast.type) {
                case ABSOLUTE_LOCATION_PATH:
                    return evaluate$f({ evaluate }, ast, context, type);
                case ADDITIVE:
                    return evaluate$g({ evaluate }, ast, context, type);
                case AND:
                    return evaluate$h({ evaluate }, ast, context, type);
                case DIVISIONAL:
                    return evaluate$i({ evaluate }, ast, context, type);
                case EQUALITY:
                    return evaluate$j({ evaluate }, ast, context, type);
                case FILTER:
                    return evaluate$k({ evaluate }, ast, context, type);
                case FUNCTION_CALL:
                    return evaluate$K({ evaluate }, ast, context, type);
                case GREATER_THAN:
                    return evaluate$L({ evaluate }, ast, context, type);
                case GREATER_THAN_OR_EQUAL:
                    return evaluate$M({ evaluate }, ast, context, type);
                case INEQUALITY:
                    return evaluate$N({ evaluate }, ast, context, type);
                case LESS_THAN:
                    return evaluate$O({ evaluate }, ast, context, type);
                case LESS_THAN_OR_EQUAL:
                    return evaluate$P({ evaluate }, ast, context, type);
                case LITERAL:
                    return evaluate$Q({ evaluate }, ast, context, type);
                case MODULUS:
                    return evaluate$R({ evaluate }, ast, context, type);
                case MULTIPLICATIVE:
                    return evaluate$S({ evaluate }, ast, context, type);
                case NEGATION:
                    return evaluate$T({ evaluate }, ast, context, type);
                case NUMBER:
                    return evaluate$U({ evaluate }, ast, context, type);
                case OR:
                    return evaluate$V({ evaluate }, ast, context, type);
                case PATH:
                    return evaluate$W({ evaluate }, ast, context, type);
                case RELATIVE_LOCATION_PATH:
                    return evaluate$e({ evaluate }, ast, context, type);
                case SUBTRACTIVE:
                    return evaluate$X({ evaluate }, ast, context, type);
                case UNION:
                    return evaluate$Y({ evaluate }, ast, context, type);
            }
        };
        var value = evaluate(this.ast, new Context(new Adapter(nativeContext), 1, 1), type);
        return new XPathResult(type, value);
    }
}

function throwNotImplemented() {
    throw new Error("Namespaces are not implemented");
}
class XPathEvaluator {
    constructor(adapter) {
        this.adapter = adapter;
    }
    evaluate(expression, context, nsResolver, type, result) {
        if (nsResolver) {
            throwNotImplemented();
        }
        return this.createExpression(expression).evaluate(context, type);
    }
    createExpression(expression, nsResolver) {
        if (nsResolver) {
            throwNotImplemented();
        }
        return new XPathExpression(expression, this.adapter);
    }
    createNSResolver(resolver) {
        throwNotImplemented();
    }
}

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

    return wrapNativeElements(this, this.nativeNode.props.children);
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

  /* eslint-disable no-underscore-dangle */
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
  /* eslint-enable no-underscore-dangle */

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

class ReactPrimitiveBase {
  constructor (nativeNode, parent, nChild) {
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
    return "Node<primitive(" + this.nativeNode + ")>";
  }

  compareDocumentPosition(other) {
    return compareDocumentPosition(this, other);
  }
}

class ReactText extends ReactPrimitiveBase {
  asString() {
    return this.nativeNode;
  }

  asNumber() {
    return +this.asString();
  }
}

class ReactNumber extends ReactPrimitiveBase {
  asString() {
    return "" + this.asNumber();
  }

  asNumber() {
    return this.nativeNode;
  }
}

function flatten (array) {
  return array.reduce(function(memo, el) {
    const items = Array.isArray(el) ? flatten(el) : [el];
    return memo.concat(items);
  }, []);
}

function wrapNativeElement (parent, nativeElement, index) {
  if (typeof nativeElement === "string") {
    return new ReactText(nativeElement, parent, index);
  } else if (typeof nativeElement === "number") {
    return new ReactNumber(nativeElement, parent, index);
  } else if (react.isValidElement(nativeElement)) {
    return new ReactElement(nativeElement, parent, index);
  } else {
    throw new Error("Expected a React element");
  }
}

function notNoopElement (nativeElement) {
  return nativeElement != null && typeof nativeElement !== "boolean";
}

function wrapNativeElements (parent, nativeElements) {
  return flatten([nativeElements]).filter(notNoopElement).map(wrapNativeElement.bind(null, parent));
}

class ReactDocument {
  constructor(nativeChildOrChildren) {
    this.children = wrapNativeElements(this, nativeChildOrChildren);
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
    return DOCUMENT_NODE;
  }

  getChildNodes() {
    return this.children;
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
    return this;
  }

  getElementById(id) {
    for (let i = 0; i < this.children.length; i++) {
      /* eslint-disable no-underscore-dangle */
      const result = this.children[i]._getElementById(id);
      /* eslint-enable no-underscore-dangle */

      if (result) {
        return result;
      }
    }
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

function evaluate$Z (expression, context, nsResolver, type) {
  return XPath.evaluate(expression, context, nsResolver, type);
}

function createExpression (expression, nsResolver) {
  return XPath.createExpression(expression, nsResolver);
}

function createNSResolver (nodeResolver) {
  return XPath.createNSResolver(nodeResolver);
}

exports.XPathResult = XPathResult;
exports.createExpression = createExpression;
exports.createNSResolver = createNSResolver;
exports.evaluate = evaluate$Z;
exports.find = find;
