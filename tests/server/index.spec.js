var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;

var index = require('../../server/main');

describe('index', function() {
    it('should be defined', function() {
        expect(index).to.not.be.undefined;
    })
})