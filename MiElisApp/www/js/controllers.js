/*************************************************
All controllers from the views in the app.

10.11.2016 zwahf1
*************************************************/
angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal) {

})

.controller('HomeCtrl', function($scope, $state, I4MIMidataService) {

  var dumiData = {
    firstName : 'Elisabeth',
    lastName : 'Brönnimann'
  };

  localStorage.setItem("data", JSON.stringify(dumiData));

  var data = JSON.parse(localStorage.getItem("data"));

  $scope.firstName =   data.firstName;
  $scope.lastName = data.lastName;


  if(I4MIMidataService.loggedIn() != true) {
      $state.go("LoggedOut");
  }
})

.controller('WeightCtrl', function($scope) {
//***********************//
//all functions by schmk3//
//***********************//
//test itmes, used by development

  $scope.items=[
    {date: getDateStringI(7), value: 57.2},
    {date: getDateStringI(6), value: 56.4},
    {date: getDateStringI(5), value: 58.2},
    {date: getDateStringI(4), value: 57.7},
  ];

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
var sugarChart = {};
var sugarData =   [
  ['Datum', "Blutzucker"],
  [getDateStringI(3), 4.2],
  [getDateStringI(2), 8.3],
  [getDateStringI(1), 5.1],
];

sugarChart.type = "LineChart";
sugarChart.data = sugarData;
sugarChart.options = {
    displayExactValues: true,
//    width: 400,
//    height: 200,
    is3D: true,
//    chartArea: {left:10,top:10,bottom:0,height:"100%"},
    pointSize: 50,
    lineWidth: 0,
};
//sugarChart.formatters = {};
$scope.mySugrChart = sugarChart;
$scope.addGlucoValue = function(val){
  sugarData.push(
    [getDateStringI(0), val]
  );
  $scope.value = sugarData;
};

  function getDateStringI(i){
    var d = new Date();
    d.setDate(d.getDate() - i);
    return d;
  }
})

.controller('PulseCtrl', function($scope) {
/*  var chart1 = {};
  chart1.type = "AreaChart";
  chart1.data = [
  //  ['date', 'Systolischer BD', 'Diastolischer BD'],
    [getDateStringI(-1), 132, 132, 65, 65],
    [getDateStringI(1), 160, 160, 110, 110],
    [getDateStringI(2), 122, 122, 85, 85],

  ];
  chart1.options = {
    isStacked: 'absolute',
    series: [{color: 'white',  lineWidth: 0}, {color: 'purple', lineWidth: 0}],
    hAxis: {
      format: 'EE, d.MMM y'
    },
    vAxis: {minValue: 0},
    pointSize: 50,
  };

  $scope.myChartObject = chart1;
  */
  function getDateStringI(i){
    var d = new Date();
    d.setDate(d.getDate() - i);
    return d;
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
