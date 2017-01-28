/**
 * Created by rimbakus on 1/28/17.
 */
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var MarkovGeneartor = require('./MarkovGenerator/MarkovGenerator').MarkovGenerator;
var generator = new MarkovGeneartor;

var files = {};
files.sampleShort = "./data/sample-short.txt";
files.sampleMedium = "./data/sample-medium.txt";
files.sampleLong = "./data/sample-long.txt";
files.tweets = "./data/tweets.txt";

http.listen(3000, function() {
    console.log('[Main] Listening on *:3000')
});

io.on('connection', function(socket){
    console.log('[Main] User ' + socket.id + ' has connected.');
    socket.on('disconnect', function(){
        console.log('[Main] User ' + socket.id + ' has disconnected.');
    });

    socket.on('generateParagraph', function() {
        var readText = generator.readText(files.tweets);

        readText.then(function (rawText) {
            var rawFrequencyDictionary = generator.createFrequencyDictionary(rawText);
            var markovChain = generator.createMarkovChain(rawFrequencyDictionary);
            var cleanFrequencyDictionary = generator.cleanFrequencyDictionary(rawFrequencyDictionary);
            var paragraph = generator.generateParagraph(cleanFrequencyDictionary, markovChain);

            socket.emit('generated', paragraph);
        });
    });
});
