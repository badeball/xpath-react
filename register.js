/* eslint-env node */

var XPathEvaluator = require("xpath-evaluator");

var XPathReact = require("./lib/xpath_react");

XPathEvaluator.setAdapter(XPathReact);

module.exports = XPathEvaluator;
