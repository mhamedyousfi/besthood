'use strict';

angular.module('core.admin').run(['Menus',
  function (Menus) {
    Menus.addMenuItem('topbar', {
      title: 'Admin',
      state: 'admin',
      type: 'dropdown',
      roles: ['admin']
    });

    Menus.addMenuItem('topbar', {
      title: 'Communities',
      state: 'communities',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'communities', {
      title: 'List Communities',
      state: 'communities.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'communities', {
      title: 'Create Community',
      state: 'communities.create',
      roles: ['user']
    });
  }
]);
