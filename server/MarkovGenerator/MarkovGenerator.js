/**
 * Created by rimbakus on 1/28/17.
 */

var Q = require('q');
var fs = require('fs');
var Random = require('random-js');
var generateRandom = new Random(Random.engines.mt19937().autoSeed());

var qReadFile = Q.denodeify(fs.readFile);

var rawText = '';
// Private helper functions
var _isPunctuation = function (fragment) {
    return fragment.match(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g);
};

var _endsSentence = function (fragment) {
    return fragment.match(/[.!?]/g);
}

var _generateRandomInt = function (max, min) {
    return generateRandom.integer(min || 1, max);
};

var _capitalizeFirstLetter = function (fragment) {
    if (fragment) {
        return fragment[0].toUpperCase() + fragment.slice(1);
    }
};

var _selectWord = function(cleanFrequencyDictionary, markovChain, fragment) {
    if (_endsSentence(fragment)) {
        return fragment;
    }
    var seed = _generateRandomInt(markovChain[fragment.toLowerCase()].length) - 1;
    var nextFragment = markovChain[fragment.toLowerCase()][seed];
    if (_isPunctuation(nextFragment)) {
        return fragment + _selectWord(cleanFrequencyDictionary, markovChain, nextFragment);
    } else {
        return fragment + ' ' + _selectWord(cleanFrequencyDictionary, markovChain, nextFragment);
    }
}

// Public functions
var MarkovGenerator = function () {

};

MarkovGenerator.prototype.readText = function (readFile) {
    var deferred = Q.defer();
    qReadFile(readFile, 'utf8')
        .then(function success(rawData) {
            deferred.resolve(rawData);
        }, function error(err) {
            deferred.reject(err);
        });
    return deferred.promise;
};

MarkovGenerator.prototype.createFrequencyDictionary = function (rawText) {
    // Split if word begins with # or @
    var rawSpecial = rawText.split(/(#[a-z\d-]+|@[a-z\d-]+)/g);
    var strippedSpecial = [];
    var rawFrequencyDictionary = [];
    rawSpecial.map(function (fragment) {
        if (fragment != ' ' && fragment.length > 0) {
            if (fragment.indexOf('#') == -1 && fragment.indexOf('@') == -1) {
                strippedSpecial.push(fragment);
            }
        }
    });
    strippedSpecial.map(function (piece) {
        // Split into individual words and puncutuation
        var brokenDown = piece.match(/[\w-']+|[^\w\s]+/g);
        brokenDown.map(function (element) {
            rawFrequencyDictionary.push(element);
        });
    });
    return rawFrequencyDictionary;
};

MarkovGenerator.prototype.createMarkovChain = function (rawFrequencyDictionary) {
    var markovChain = {};
    var position = 0;
    rawFrequencyDictionary.map(function (fragment) {
        // Make lowercase
        fragment = fragment.toLowerCase();
        // Check if at end of array
        if (rawFrequencyDictionary.length != position + 1) {
            // If property does not exist, init property and array then add the next word to the array
            if (!markovChain.hasOwnProperty(fragment)) {
                markovChain[fragment] = [];
            }
            markovChain[fragment].push(rawFrequencyDictionary[position + 1].toLowerCase());
        }
        position++;
    });
    return markovChain;
};

MarkovGenerator.prototype.cleanFrequencyDictionary = function (rawFrequencyDictionary) {
    var cleanFrequencyDictionary = [];
    rawFrequencyDictionary.map(function (fragment) {
        if (!_isPunctuation(fragment)) {
            cleanFrequencyDictionary.push(fragment.toLowerCase());
        }
    });
    return cleanFrequencyDictionary;
}

MarkovGenerator.prototype.generateSentence = function (cleanFrequencyDictionary, markovChain) {
    var initialSeed = _generateRandomInt(cleanFrequencyDictionary.length) - 1;
    var initialWord = cleanFrequencyDictionary[initialSeed];
    var sentence = _selectWord(cleanFrequencyDictionary, markovChain, _capitalizeFirstLetter(initialWord));
    return sentence;
}

MarkovGenerator.prototype.generateParagraph = function (cleanFrequencyDictionary, markovChain) {
    var paragraphLength = _generateRandomInt(12, 8);
    var paragraph = "";
    for (var sentenceNumber = 0; sentenceNumber < paragraphLength; sentenceNumber++) {
        var sentence = this.generateSentence(cleanFrequencyDictionary, markovChain);
        paragraph += " " + sentence;
    }
    return paragraph;
}

exports.MarkovGenerator = MarkovGenerator;