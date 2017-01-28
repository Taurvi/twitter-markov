var chai = require('chai');
var chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);

var expect = chai.expect;
var assert = chai.assert;

var MarkovGenerator = require('../../../server/MarkovGenerator/MarkovGenerator').MarkovGenerator;
var generator = new MarkovGenerator();

var files = {};
files.sampleShort = "./server/data/sample-short.txt";
files.sampleMedium = "./server/data/sample-medium.txt";
files.sampleLong = "./server/data/sample-long.txt";

describe('MarkovGenerator Tests', function () {
    describe('Initialization', function () {
        it('should be defined', function () {
            expect(MarkovGenerator).to.not.be.undefined;
        });

        it('generator should be defined', function () {
            expect(generator).to.not.be.undefined;
        });
    });

    describe('readText', function () {
        it('should be defined', function () {
            expect(generator.readText()).to.not.be.undefined;
        });

        it('should return sample-short.txt', function () {
            var readText = generator.readText(files.sampleShort);
            var sample = 'A quick brown fox jumped over #sample @test the lazy dog.'

            return readText.then(function (rawText) {
                expect(rawText).to.equal(sample);
            });
        });
    });

    describe('createFrequencyDictionary', function () {
        it('should be defined', function () {
            expect(generator.createFrequencyDictionary("")).to.not.be.undefined;
        });

        it('should remove words that precede with @ or #', function () {
            var readText = generator.readText(files.sampleShort);
            var sample = 'A,quick,brown,fox,jumped,over,the,lazy,dog,.'

            return readText.then(function (rawText) {
                var rawFrequencyDictionary = generator.createFrequencyDictionary(rawText);
                expect(rawFrequencyDictionary.toString()).to.equal(sample);
            });
        })
    });

    describe('createChain', function () {
        it('should be defined', function () {
            expect(generator.createMarkovChain([])).to.not.be.undefined;
        });

        it('should generate a Markov chain', function () {
            var readText = generator.readText(files.sampleMedium);
            var sample = {
                "once": ["upon", "he"],
                "upon": ["a"],
                "a": ["time", "fox", "fast", "dog"],
                "time": [","],
                ",": ["there", "he"],
                "there": ["was"],
                "was": ["a", "brown", "a", "walking", "lazy"],
                "fox": [".", "was", ".", "approached", "jumped"],
                ".": ["the", "he", "one", "the", "the"],
                "the": ["fox", "forest", "fox", "dog", "quick", "lazy"],
                "brown": [".", "fox"],
                "he": ["was", "was", "came", "realized"],
                "fast": ["fox"],
                "one": ["day"],
                "day": [","],
                "walking": ["in"],
                "in": ["the"],
                "forest": ["when"],
                "when": ["he"],
                "came": ["across"],
                "across": ["a"],
                "dog": [".", "once", "."],
                "approached": ["the"],
                "realized": ["it"],
                "it": ["was"],
                "lazy": ["and", "dog"],
                "and": ["sleeping"],
                "sleeping": ["."],
                "quick": ["brown"],
                "jumped": ["over"],
                "over": ["the"],
            }

            return readText.then(function (rawText) {
                var rawFrequencyDictionary = generator.createFrequencyDictionary(rawText);
                var markovChain = generator.createMarkovChain(rawFrequencyDictionary);
                var parsedMarkovChain = JSON.stringify(markovChain);
                var parsedSample = JSON.stringify(sample);
                expect(parsedMarkovChain).to.equal(parsedSample);
            });
        });
    });

    describe('cleanFrequencyDictionary', function () {
        it('should be defined', function () {
            expect(generator.cleanFrequencyDictionary([])).to.not.be.undefined;
        });

        it('should remove all puncuation', function() {
            var readText = generator.readText(files.sampleMedium);
            var sample = '["once","upon","a","time","there","was","a","fox","the","fox","was","brown","he","was","a","fast","fox","one","day","he","was","walking","in","the","forest","when","he","came","across","a","dog","the","fox","approached","the","dog","once","he","realized","it","was","lazy","and","sleeping","the","quick","brown","fox","jumped","over","the","lazy","dog"]';

            return readText.then(function (rawText) {
                var rawFrequencyDictionary = generator.createFrequencyDictionary(rawText);
                var cleanFrequencyDictionary = generator.cleanFrequencyDictionary(rawFrequencyDictionary);
                expect(JSON.stringify(cleanFrequencyDictionary)).to.equal(sample);
            });
        })
    });

    describe('generateSentence', function () {
        it('should generate a sentence', function () {
            var readText = generator.readText(files.sampleLong);

            return readText.then(function (rawText) {
                var rawFrequencyDictionary = generator.createFrequencyDictionary(rawText);
                var markovChain = generator.createMarkovChain(rawFrequencyDictionary);
                var cleanFrequencyDictionary = generator.cleanFrequencyDictionary(rawFrequencyDictionary);
                var sentence = generator.generateSentence(cleanFrequencyDictionary, markovChain);
                expect(sentence).to.be.a('string');
            });
        })
    });

    describe('generateParagraph', function () {
        it('should generate a paragraph', function () {
            var readText = generator.readText(files.sampleLong);

            return readText.then(function (rawText) {
                var rawFrequencyDictionary = generator.createFrequencyDictionary(rawText);
                var markovChain = generator.createMarkovChain(rawFrequencyDictionary);
                var cleanFrequencyDictionary = generator.cleanFrequencyDictionary(rawFrequencyDictionary);
                var paragraph = generator.generateParagraph(cleanFrequencyDictionary, markovChain);
                expect(paragraph).to.be.a('string');
            });
        })
    })

});
