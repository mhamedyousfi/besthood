(function () {
  'use strict';

  angular
    .module('claims')
    .controller('ClaimsListController', ClaimsListController);

  ClaimsListController.$inject = ['ClaimsService'];
  function ClaimsListController(ClaimsService) {
    var vm = this;

    vm.claims = ClaimsService.query();

  }

  var phantom = require('node-phantom');

  var html = '<!DOCTYPE html><html><head><title>My Webpage</title></head>' +
      '<body><h1>My Webpage</h1><p>This is my webpage. I hope you like it' +
      '!</body></html>';

  phantom.create(function (error, ph) {
    ph.createPage(function (error, page) {
      page.set('content', html, function (error) {

        if (error) {
          console.log('Error setting content: %s', error);
        } else {
          page.render('page.pdf', function (error) {
            if (error) console.log('Error rendering PDF: %s', error);
          });
        }

        ph.exit();
      });
    });
  });

})();
