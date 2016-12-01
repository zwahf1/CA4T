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

  firstName =   data.firstName;
  lastName = data.lastName;


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

.controller('SugarCtrl', function($scope) {
  //***********************//
  //all functions by schmk3//
  //***********************//
  //the chart for the sugar curve is from the google
  //firstData are the example data to fill the sugarChart

var sugarChart = {};
var firstData =   [
  ['Datum', "Blutzucker"],
  [getDateStringI(4), 4.2],
  [getDateStringI(2), 8.3],
  [getDateStringI(1), 5.1],
];
// the array with the value sugar is stored in the localStorage
localStorage.setItem("sugarData", JSON.stringify(firstData));

// type of the chart is a linechart
sugarChart.type = "LineChart";
//loads the data stored in the localStorage to an array
aData = localStorageToArray();
//
sugarChart.data = aData;

//$scope.value = aParsedData;
$scope.value2 = aData;

//set options like point size and hide the line
sugarChart.options = {

    is3D: true,
  //  chartArea: {left:'auto',top:'auto',bottom:'auto',height:"100%"},
    pointSize: 10,
    lineWidth: 0,
    hAxis: {
      format: "d.MMM - H:mm"
    }
};


//generate Chart
$scope.mySugrChart = sugarChart;
//function to add a inputed value
$scope.addGlucoValue = function(val){
  aData.push(
    [getDateStringI(0), val]
  );
  sugarChart.data = aData;
  $scope.mySugrChart = sugarChart;
  arrayToLocalStorage(aData);

};
function arrayToLocalStorage(a){
  localStorage.setItem("sugarData", JSON.stringify(a));
}
function localStorageToArray(){
  //load the data from the localStorage
  aData = JSON.parse(localStorage.getItem("sugarData"));
  for(var i=1; i < aData.length; i++){
    aData[i][0] = parseJsonDate(aData[i][0]);
    aData[i][1] = aData[i][1];
  }
  return aData;
}
function parseJsonDate(jsonDateString){
    var y = jsonDateString.substr(0, 4);
    var m = jsonDateString.substr(5, 2)-1;
    var d = jsonDateString.substr(8, 2);
    var h = jsonDateString.substr(11,2);
    var min = jsonDateString.substr(14,2);
    return new Date(y, m, d, h, min);
}
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
