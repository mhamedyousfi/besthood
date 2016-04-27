'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication','weatherService',
  function ($scope, Authentication,weatherService) {
    // This provides Authentication context.
    $scope.authentication = Authentication;

    function fetchWeather(place) {
      weatherService.getWeather(place).then(function(data){
        $scope.place = data;

      });
    }


    fetchWeather('ariana');
    $scope.findWeather = function(place) {
      $scope.place = '';
      fetchWeather(place);
    };
  }

]);
