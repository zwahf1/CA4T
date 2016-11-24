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

  $scope.items=[
    {date: getDateStringI(7), value: 57.2},
    {date: getDateStringI(6), value: 56.4},
    {date: getDateStringI(5), value: 58.2},
    {date: getDateStringI(4), value: 57.7},
  ];
  var aDate = new Array();
  aDate= [
    getDateStringI(7),
    getDateStringI(6),
    getDateStringI(5),
    getDateStringI(4),
    getDateStringI(3),
    getDateStringI(2),
    getDateStringI(1),
  ];
  var aValue = new Array();
  aValue = [
    57.2,
    56.4,
    58.2,
    57.7
  ]


  var $configLine = {
    name: '.ct-chartLine',
    labels: 'Week',
    series: "[12, 9, 7, 8, 5, 9, 10]",
    fullWidth: "true",
    showArea: "false",
  };
  var chartLine = new ChartJS($configLine);
  chartLine.line();

var a = new Array();
a= [12, 9, 7, 8, 5, 9, 10];

var valuesToArray = function() {
    a.push($scope.items.pop());
  }
  var showChart = function(){
    new Chartist.Line($config['name'], {
      labels: $config['labels'],
      series: [aValue]
      },
      {
      fullWidth: $config["fullWidth"],
      low: 0,
      showArea: $config["showArea"],
      chartPadding: {
        right: 40
      }
    });
  }

  $scope.addValue = function(val){
    if(!isNaN(val)){
      $scope.items.push({date: getDateStringI(0),value: val});
      aValue.push(val);
    }
    this.form = {
      value: ''
    };
      showChart();
    };

    var chartLine = new ChartJS($configLine);
    chartLine.line();



  function getDateStringI(i){
  var d = new Date();
  d.setDate(d.getDate() - i);
  var t = d.getDate();
  var m = d.getMonth();
  var y = d.getFullYear();
  return t+"."+m+"."+y;
  }


})

.controller('SugarCtrl', function($scope, Chart) {
//  Chart.drawChart();
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
