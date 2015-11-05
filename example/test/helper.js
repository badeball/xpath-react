"use strict";

var Chai = require("chai");

Chai.should();

Chai.use(require("sinon-chai"));
Chai.use(require("chai-xpath-react"));

var Sinon = require("sinon");

beforeEach(function() {
  this.sinon = Sinon.sandbox.create();
});

afterEach(function(){
  this.sinon.restore();
});
