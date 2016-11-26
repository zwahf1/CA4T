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
//***********************//
//all functions by schmk3//
//***********************//
//test itmes, used by development
/*
  $scope.items=[
    {date: getDateStringI(7), value: 57.2},
    {date: getDateStringI(6), value: 56.4},
    {date: getDateStringI(5), value: 58.2},
    {date: getDateStringI(4), value: 57.7},
  ];
*/
  //Array with the dates to the values
  var aDate = new Array();
  aDate= [
    getDateStringI(4),
    getDateStringI(3),
    getDateStringI(2),
    getDateStringI(1),
  ];

  //example array with the weight-values
  var aValue = new Array();
  aValue = [
    57.2,
    56.4,
    58.2,
    57.7
  ]

//instruction from readMe
  var $configLine = {
    name: '.ct-chartLine',
    labels: aDate,
    series: aValue,
//    series2: [67.2, 66.4, 68.2, 67.7],
    fullWidth: "true",
    showArea: "false",

  };
  var chartLine = new ChartJS($configLine);
  chartLine.line();


//function to generate the chart. is called after input verification
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

/*function to add a value.
after verification, that it's a numeric value, the value is added to value array

*/
  $scope.addValue = function(val){
    if(!isNaN(val)){
//      $scope.items.push({date: getDateStringI(0),value: val});
      aValue.push(val);
      aDate.push(getDateStringI(0));
    }
    this.form = {
      value: ''
    };
      showChart();
    };



//returns the current date (TT.mm.YYYY)
  function getDateStringI(i){
  var d = new Date();
  d.setDate(d.getDate() - i);
  var t = d.getDate();
  var m = d.getMonth()+1;
  var y = d.getFullYear();
  return t+"."+m+"."+y;
  }


})

.controller('SugarCtrl', function($scope, Chart) {

})

.controller('PulseCtrl', function($scope) {
  $scope.myChartObject = {
    "type": "AreaChart",
    "displayed": false,
    "data": {
      "cols": [
        {
          "id": "month",
          "label": "Month",
          "type": "string",
          "p": {}
        },
        {
          "id": "laptop-id",
          "label": "Laptop",
          "type": "number",
          "p": {}
        },
        {
          "id": "desktop-id",
          "label": "Desktop",
          "type": "number",
          "p": {}
        },
        {
          "id": "server-id",
          "label": "Server",
          "type": "number",
          "p": {}
        },
        {
          "id": "cost-id",
          "label": "Shipping",
          "type": "number"
        }
      ],
      "rows": [
        {
          "c": [
            {
              "v": "January"
            },
            {
              "v": 19,
              "f": "42 items"
            },
            {
              "v": 12,
              "f": "Ony 12 items"
            },
            {
              "v": 7,
              "f": "7 servers"
            },
            {
              "v": 4
            }
          ]
        },
        {
          "c": [
            {
              "v": "February"
            },
            {
              "v": 13
            },
            {
              "v": 1,
              "f": "1 unit (Out of stock this month)"
            },
            {
              "v": 12
            },
            {
              "v": 2
            }
          ]
        },
        {
          "c": [
            {
              "v": "March"
            },
            {
              "v": 24
            },
            {
              "v": 5
            },
            {
              "v": 11
            },
            {
              "v": 6
            }
          ]
        }
      ]
    },
    "options": {
      "title": "Sales per month",
      "isStacked": "true",
      "fill": 20,
      "displayExactValues": true,
      "vAxis": {
        "title": "Sales unit",
        "gridlines": {
          "count": 10
        }
      },
      "hAxis": {
        "title": "Date"
      }
    },
    "formatters": {}
  }
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
