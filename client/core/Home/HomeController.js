'use strict';
MarkovModule = angular.module('MarkovModule');
MarkovModule.controller('HomeController', ['$scope', 'mySocket', function($scope, mySocket) {
    mySocket.on('connect', function() {
        console.log('Connected!');
    });

    mySocket.on('generated', function(paragraph) {
        $scope.loading = false;
        $scope.drumpfParagraph = paragraph;
    });

    $scope.generateParagraph = function () {
        mySocket.emit('generateParagraph');
        $scope.loading = true;
    };
}]);