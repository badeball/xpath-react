var XPathEvaluator = require("xpath-evaluator").default;

var ReactDocument = require("./types/react_document");

module.exports = new XPathEvaluator(ReactDocument);
