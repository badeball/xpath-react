var Sinon = require("sinon");

beforeEach(function() {
  this.sinon = Sinon.sandbox.create();
});

afterEach(function(){
  this.sinon.restore();
});
