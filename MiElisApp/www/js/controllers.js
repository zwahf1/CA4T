/*************************************************
All controllers from the views in the app.

10.11.2016 zwahf1
*************************************************/
angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal) {

})

.controller('HomeCtrl', function($scope, $state, I4MIMidataService) {

  if(I4MIMidataService.loggedIn() != true) {
      $state.go("LoggedOut");
  }
})

.controller('WeightCtrl', function($scope) {

  var $configLine = {
    name: '.ct-chartLine',
    labels: 'Week',
    series: "[12, 9, 7, 8, 5, 9, 0]",
    fullWidth: "true",
    showArea: "false",
  };

  var chartLine = new ChartJS($configLine);
  chartLine.line();

})

.controller('SugarCtrl', function($scope, Chart) {
  Chart.drawChart();
})

.controller('PulseCtrl', function($scope) {
})

.controller('MeCtrl', function($scope) {
})

.controller('LoggedOutCtrl', function($scope) {
})

.controller('SettingsCtrl', function($scope) {
})

.controller('LoginCtrl', function($scope, $state, I4MIMidataService) {
  // Perform the login action when the user submits the login form
    // Use for testing the development environment
    $scope.user = {
      username: 'gruppe4@bfh.ch',
      password: 'PW4clapps@midata',
      server: 'https://test.midata.coop:9000'
    }

    if(I4MIMidataService.loggedIn() == true) {
    }

});
