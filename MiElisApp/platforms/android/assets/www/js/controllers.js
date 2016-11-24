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
  var stacksDiv = document.getElementById("myDiv");
  var traces = [
      {x: [1,2,3], y: [2,2,2], fill: ''},
      {x: [1,2,3], y: [1,1,2], fill: ''},
      {x: [1,2,3], y: [3,0,2], fill: 'tonexty'}
  ];
  function stackedArea(traces) {
      for(var i=1; i<traces.length; i++) {
          for(var j=0; j<(Math.min(traces[i]['y'].length, traces[i-1]['y'].length)); j++) {
              traces[i]['y'][j] += traces[i-1]['y'][j];
          }
      }
      return traces;
  }

  Plotly.newPlot(stacksDiv, stackedArea(traces), {title: 'stacked and filled line chart'});

  /*
  var $configLine = {
    name: '.ct-chartLine',
    labels: 'Week',
    series: "[12, 9, 7, 8, 5, 9, 0]",
    fullWidth: "true",
    showArea: "false",
  };


  var chartLine = new ChartJS($configLine);
  chartLine.line();
*/
})

.controller('SugarCtrl', function($scope, Chart) {
//  Chart.drawChart();
})

.controller('PulseCtrl', function($scope) {
  var ctx = document.getElementById("myChart");
  var myChart = new Chart(ctx, {
      type: 'bar',
      data: {
          labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
          datasets: [{
              label: '# of Votes',
              data: [12, 19, 3, 5, 2, 3],
              backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)'
              ],
              borderColor: [
                  'rgba(255,99,132,1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)'
              ],
              borderWidth: 1
          }]
      },
      options: {
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero:true
                  }
              }]
          }
      }
  });
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
