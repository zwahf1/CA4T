angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
})

.controller('HomeCtrl', function($scope, $stateParams) {
})

.controller('WeightCtrl', function($scope, $stateParams) {
})

.controller('SugarCtrl', function($scope, $stateParams) {
})

.controller('PulseCtrl', function($scope, $stateParams) {
})

.controller('LoginCtrl', function($scope, I4MIMidataService) {
  // Perform the login action when the user submits the login form
    // Use for testing the development environment
    $scope.user = {
      username: 'faebu.zwahlen@outlook.com',
      server: 'https://test.midata.coop:9000'
    }
});
