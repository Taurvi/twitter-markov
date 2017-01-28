'use strict';

var MarkovModule = angular.module('MarkovModule',
    [
        'ui.router',
        'ngAnimate',
        'btford.socket-io',
        'mgcrea.ngStrap'
    ]);

MarkovModule.factory('mySocket', ['socketFactory', function (socketFactory) {
    var myIoSocket = io.connect('http://54.202.37.114:3000');
    var mySocket = socketFactory({
        ioSocket: myIoSocket
    });
    return mySocket;
}]);

MarkovModule.config([
    '$stateProvider',
    '$urlRouterProvider',
    '$locationProvider',
    '$httpProvider',
    function ($stateProvider, $urlRouterProvider, $locationProvider) {
        $locationProvider.html5Mode(true);
        $stateProvider
            .state('home', {
                url: '/',
                views: {
                    'content': {
                        templateUrl: 'views/HomeView.html',
                        controller: 'HomeController'
                    },
                    'footer': {
                        templateUrl: 'views/FooterView.html',
                    }
                }
            });
        $urlRouterProvider.otherwise('/');
    }]);