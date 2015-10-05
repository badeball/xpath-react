/* eslint-env node */

var XPathEvaluator = require("xpath-evaluator");

var ReactDocument = require("./lib/types/react_document");

XPathEvaluator.setAdapter(ReactDocument);

module.exports = XPathEvaluator;
