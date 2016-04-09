(function () {
  'use strict';

  angular
    .module('donates')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Donates',
      state: 'donates',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'donates', {
      title: 'List Donates',
      state: 'donates.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'donates', {
      title: 'Create Donate',
      state: 'donates.create',
      roles: ['user']
    });
  }
})();
