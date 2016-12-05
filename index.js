"use strict";

var XPathEvaluator = require("xpath-evaluator");
var XPathReactDocument = require("./lib/types/react_document");

XPathEvaluator.setAdapter(XPathReactDocument);

module.exports = XPathEvaluator;
