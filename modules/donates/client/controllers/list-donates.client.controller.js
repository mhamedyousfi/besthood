(function () {
  'use strict';

  angular
    .module('donates')
    .controller('DonatesListController', DonatesListController);

  DonatesListController.$inject = ['DonatesService'];

  function DonatesListController(DonatesService) {
    var vm = this;

    vm.donates = DonatesService.query();
  }
})();
