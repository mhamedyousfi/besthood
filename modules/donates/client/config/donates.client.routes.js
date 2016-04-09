(function () {
  'use strict';

  angular
    .module('donates')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('donates', {
        abstract: true,
        url: '/donates',
        template: '<ui-view/>'
      })
      .state('donates.list', {
        url: '',
        templateUrl: 'modules/donates/client/views/list-donates.client.view.html',
        controller: 'DonatesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Donates List'
        }
      })
      .state('donates.create', {
        url: '/create',
        templateUrl: 'modules/donates/client/views/form-donate.client.view.html',
        controller: 'DonatesController',
        controllerAs: 'vm',
        resolve: {
          donateResolve: newDonate
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Donates Create'
        }
      })
      .state('donates.edit', {
        url: '/:donateId/edit',
        templateUrl: 'modules/donates/client/views/form-donate.client.view.html',
        controller: 'DonatesController',
        controllerAs: 'vm',
        resolve: {
          donateResolve: getDonate
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Donate {{ donateResolve.name }}'
        }
      })
      .state('donates.view', {
        url: '/:donateId',
        templateUrl: 'modules/donates/client/views/view-donate.client.view.html',
        controller: 'DonatesController',
        controllerAs: 'vm',
        resolve: {
          donateResolve: getDonate
        },
        data:{
          pageTitle: 'Donate {{ articleResolve.name }}'
        }
      });
  }

  getDonate.$inject = ['$stateParams', 'DonatesService'];

  function getDonate($stateParams, DonatesService) {
    return DonatesService.get({
      donateId: $stateParams.donateId
    }).$promise;
  }

  newDonate.$inject = ['DonatesService'];

  function newDonate(DonatesService) {
    return new DonatesService();
  }
})();
