'use strict';
angular.module('core').controller('ContactFormController', ['$scope', '$http','$state',
    function($scope, $http, $state) {
        // the naming of our data model is consistent
        $scope.guest = {};
        $scope.sent = false;

        // when the user submits it triggers processForm()
        $scope.processForm = function() {

            // *** IMPORTANT IMPORTANT ***
            // an http request is posted to the server
            // *** IMPORTANT IMPORTANT ***

            $http.post('/contact-form')
                .success(function(response) {
                    console.log('Success! :D');
                }).error(function(response) {
                    console.log(response);
                });

            $scope.contactForm.$setPristine();
            $scope.guest = {};
            $scope.sent = true;


        };
    }]);
