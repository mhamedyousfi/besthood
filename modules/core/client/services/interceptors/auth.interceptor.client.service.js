'use strict';

angular.module('core').factory('authInterceptor', ['$q', '$injector', 'Authentication',
  function ($q, $injector, Authentication) {
    return {
      responseError: function(rejection) {
        if (!rejection.config.ignoreAuthModule) {
          switch (rejection.status) {
            case 401:
              // Deauthenticate the global user
              Authentication.user = null;
              $injector.get('$state').transitionTo('authentication.signin');
              break;
            case 403:
              $injector.get('$state').transitionTo('forbidden');
              break;
          }
        }
        // otherwise, default behaviour
        return $q.reject(rejection);
      }
    };
  }
]);

angular.module('core').factory('weatherService', ['$http', '$q', function ($http, $q){
  function getWeather (place) {
    var deferred = $q.defer();
    $http.get('https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22'+place+'%2C%20tn%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys')
        .success(function(data){
          deferred.resolve(data.query.results.channel);
        })
        .error(function(err){
          console.log('Error retrieving markets');
          deferred.reject(err);
        });
    return deferred.promise;
  }

  return {
    getWeather: getWeather
  };
}]);
