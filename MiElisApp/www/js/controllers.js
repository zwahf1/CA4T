/*************************************************
All controllers from the views in the app.

10.11.2016 zwahf1
*************************************************/
angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal) {

})

.controller('HomeCtrl', function($scope, $state, I4MIMidataService) {

  if(I4MIMidataService.loggedIn() != true) {
      $state.go("app.LoggedOut");
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

.controller('SugarCtrl', function($scope) {
  google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);

var a = [
  ['Zeit', 'Glucose mmol/L'],
  [getDateStringI(7),  5.3],
  [getDateStringI(6),  13.4],
  [getDateStringI(5),  7.6],
  [getDateStringI(4),  6.9],
  [getDateStringI(3),  5.6],
  [getDateStringI(2),  9.5],
  [getDateStringI(1),  8.6]];

function drawChart() {
  var a_short = [
    ['Zeit', 'Glucose mmol/L'],
    a[a.length-7],
    a[a.length-6],
    a[a.length-5],
    a[a.length-4],
    a[a.length-3],
    a[a.length-2],
    a[a.length-1]
  ];
  var data = google.visualization.arrayToDataTable(a_short);


  var options = {
  fontSize: 20,
  title: "Elisabeth's Diabetes",
  curveType: 'none',
  pointSize: 50,
  legend: { position: 'bottom' }

  };

  var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

  chart.draw(data, options);
}

function newValue(){
  var r = (Math.random()*5 );
  var last = a[a.length-1][1]-2;
  var act = last+r;
  document.getElementById("w_value").value = act.toFixed(1);
  document.getElementById("b_add").disabled = false;
}

function addA(){
var v = document.getElementById("w_value").value;
document.getElementById("w_value").value ='';
a.push([getDateString(), Number(v)]);
drawChart();
}

function getDateString(){
var d = new Date();
var h = d.getHours();
var min = d.getMinutes();
var y = d.getFullYear();
return h+":"+min+".";
}
function getDateStringI(i){
var d = new Date();
d.setHours(14);
//d.setMinutes(00);
d.setTime(d.getTime() - (i*28800000));
var h = d.getHours();
var min = d.getMinutes();
var y = d.getFullYear();
return h+':'+'00';
}

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
      username: 'schmk3@bfh.ch',
      password: 'PW4clapps@midata',
      server: 'https://test.midata.coop:9000'
    }

    if(I4MIMidataService.loggedIn() == true) {
        $state.go("app.Home");
    }

});
