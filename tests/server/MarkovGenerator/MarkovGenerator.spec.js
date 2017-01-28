var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;

var MarkovGenerator = require('../../../server/MarkovGenerator/MarkovGenerator');

describe('MarkovGenerator', function() {
    it('should be defined', function() {
        expect(MarkovGenerator).to.not.be.undefined;
    });
});
