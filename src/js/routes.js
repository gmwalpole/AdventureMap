'use strict';

angular.module('mainscreen').config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){

  $urlRouterProvider.otherwise('/');

  $stateProvider.state('map', {
    url: '/',
    templateUrl: 'templates/map.tpl.html',
    controller: 'mapCtrl'

  });
  
  $stateProvider.state('menu', {
    url: '/menu',
    templateUrl: 'templates/menu.tpl.html',
    controller: 'menuCtrl'

  });
  
}]);