//Donates service used to communicate Donates REST endpoints
(function () {
  'use strict';

  angular
    .module('donates')
    .factory('DonatesService', DonatesService);

  DonatesService.$inject = ['$resource'];

  function DonatesService($resource) {
    return $resource('api/donates/:donateId', {
      donateId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
