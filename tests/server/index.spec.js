var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;

var main = require('../../server/main');

describe('main tests', function() {
    it('should be defined', function() {
        expect(main).to.not.be.undefined;
    });
});