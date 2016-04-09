(function () {
  'use strict';

  // Donates controller
  angular
    .module('donates')
    .controller('DonatesController', DonatesController);

  DonatesController.$inject = ['$scope', '$state', 'Authentication', 'donateResolve'];

  function DonatesController ($scope, $state, Authentication, donate) {
    var vm = this;

    vm.authentication = Authentication;
    vm.donate = donate;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Donate
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.donate.$remove($state.go('donates.list'));
      }
    }

    // Save Donate
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.donateForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.donate._id) {
        vm.donate.$update(successCallback, errorCallback);
      } else {
        vm.donate.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('donates.view', {
          donateId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
