/*************************************************
All controllers from the views in the app.

10.11.2016 zwahf1
 *************************************************/
angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, I4MIMidataService, json) {
  $scope.entry = {};

  $scope.entryFields = json.getEntryFields();

  $scope.fhirGroup = json.getFHIRGroup();

  $scope.fhir = json.getFHIR();

  $scope.saveMIDATA = function() {
    I4MIMidataService.newEntry($scope.entry, $scope.entryFields, $scope.fhir, { /* options */ });
  }

  $scope.getMIDATA = function() {
    I4MIMidataService.search(["data","valueQuantity", "value"],$scope.fhir).then(function(response) {
      console.log(response);
    });
  }
})

.controller('HomeCtrl', function($scope, $state, I4MIMidataService) {
	var dumiData = {
		firstName: 'Elisabeth',
		lastName: 'Brönnimann'
	};

	localStorage.setItem("data", JSON.stringify(dumiData));

	var data = JSON.parse(localStorage.getItem("data"));

	firstName = data.firstName;
	lastName = data.lastName;

  var data = JSON.parse(localStorage.getItem("data"));

  firstName =   data.firstName;
  lastName = data.lastName;

  var user = {
    username: 'gruppe4@bfh.ch',
    password: 'PW4clapps@midata',
    server: 'https://test.midata.coop:9000'
  }
  localStorage.setItem("userData", JSON.stringify(user));

  if(I4MIMidataService.loggedIn() != true) {
    if(localStorage.userData.username == undefined || localStorage.userData.username == null || localStorage.userData.username == '') {
      $state.go("LoggedOut");
    } else {
      var user = {
        username: localStorage.userData.username,
        password: localStorage.userData.password,
        server: localStorage.userData.server
      }
      I4MIMidataService.login(user);
    }
  }
})

.controller('LoginCtrl', function($scope, $state, I4MIMidataService) {
  // Perform the login action when the user submits the login form
    // Use for testing the development environment
    $scope.user = {
      username: 'gruppe4@bfh.ch',
      password: 'PW4clapps@midata',
      server: 'https://test.midata.coop:9000'
    }

    if(I4MIMidataService.loggedIn() != true) {
      var user = {
        username: $scope.user.username,
        password: $scope.user.password,
        server: $scope.user.server
      }
      localStorage.setItem("userData", JSON.stringify(user));
    }
})

.controller('WeightCtrl', function($scope) {
//***********************//
//all functions by schmk3//
//***********************//
//test itmes, used by development

var aData = null;
var weightChart = {};
if(localStorage.weightData == undefined || localStorage.weightData == null || localStorage.weightData == ''){
  var firstData = [
    [getDateStringI(7), 56.5],
    [getDateStringI(6), 55.9],
    [getDateStringI(4), 56.8],
    [getDateStringI(3), 57.4],
    [getDateStringI(2), 57.1],
    [getDateStringI(1), 56.7],
  ];
  localStorage.setItem("weightData", JSON.stringify(firstData));
}

aData = JSON.parse(localStorage.getItem("weightData"));

var weightChart = Highcharts.chart('container', {
  chart:{
    type: 'spline'
  },
  title: {
    text: 'Gewicht',
  },
  xAxis: {
    type: 'datetime',
  },
  yAxis: {

  },
  exporting: {
    enabled: false,
  },
  plotOptions: {
      series: {
         point: {
              events: {
                  click: function () {
                      alert('Category: ' + this.category + ', value: ' + this.y);
                  }
              }
          }
      }
  },
  series: [{
    name: 'Gewicht',
    data: aData,
    marker: {
      radius: 10
    },
  }]
});

/*function to add a value.
after verification, that it's a numeric value, the value is added to value array
*/
$scope.addWValue = function (val) {
  if(val){
    aData.push([getDateStringI(0), val]);
    weightChart.series[0].setData(aData);
    localStorage.setItem("weightData", JSON.stringify(aData));
    this.weightValue = '';
  }
};

	//returns the current date (TT.mm.YYYY)
  function getDateStringI(i) {
		var d = new Date();
		d.setTime(d.getTime()-(i*3600000*6));
		return d.getTime();
	}
})

.controller('SugarCtrl', function ($scope) {
	//***********************//
	//all functions by schmk3//
	//***********************//
	//the chart for the sugar curve is from the google
	//firstData are the example data to fill the sugarChart
  var aData;
	var sugarChart = {};
  if(localStorage.sugarData == undefined || localStorage.sugarData == null || localStorage.sugarData == ''){
  	var firstData = [
  		[getDateStringI(5), 6.4],
  		[getDateStringI(4), 4.2],
  		[getDateStringI(2), 8.3],
  		[getDateStringI(1), 5.1],
  	];
    localStorage.setItem("sugarData", JSON.stringify(firstData));
  }
  if(localStorage.limitLow == undefined || localStorage.limitLow == null || localStorage.limitLow == ''){
    var limitLower = 4.5;
    localStorage.setItem("limitLow", JSON.stringify(limitLower));
  }
  if(localStorage.limitUp == undefined || localStorage.limitUp == null || localStorage.limitUp == ''){
    var limitUpper = 7.2;
    localStorage.setItem("limitUp", JSON.stringify(limitUpper));
  }
  limitLower = JSON.parse(localStorage.getItem("limitLow"));
  limitUpper = JSON.parse(localStorage.getItem("limitUp"));
	// the array with the value sugar is stored in the localStorage


  aData = JSON.parse(localStorage.getItem("sugarData"));
//  var limitLower = JSON.parse(localStorage.getItem("limitLow"));
//  var limitUpper = JSON.parse(localStorage.getItem("limitUp"));

  var sugarChart = Highcharts.chart('container', {
    chart:{
      type: 'spline'
    },
    title: {
      text: 'Blutzucker',
    },
    xAxis: {
      type: 'datetime',
    },
    yAxis: {
      plotBands: [
        {
          from: limitLower,
          to: limitUpper,
          color: '#90ff90'
        }
      ]
    },
    exporting: {
      enabled: false,
    },
    series: [{
      name: 'Blutzucker',
      data: aData,
      marker: {
        radius: 10
      },
      lineWidth: 0,
      states: {
        hover: {
          lineWidthPlus: 0
        }
      }
    }]
  });

$scope.Lower = limitLower;
$scope.Upper = limitUpper;
	//function to add a inputed value
	$scope.addGlucoValue = function (val) {
		if(val){
			aData.push([getDateStringI(0), val]);
      sugarChart.series[0].setData(aData);
			localStorage.setItem("sugarData", JSON.stringify(aData));
			this.glucoseValue = '';
		}
	};
  $scope.changeLowerGlucoLevel = function(){
    if(this.LowerGlucoValue){
      limitLower = this.LowerGlucoValue;
      localStorage.setItem("limitLow", JSON.stringify(limitLower));
      sugarChart.yAxis[0].removePlotBand();
      sugarChart.yAxis[0].addPlotBand({
        color: '#90ff90',
        from: limitLower,
        to: limitUpper
      });
    }else{
      this.Lower = limitLower;
    }
  }
  $scope.changeUpperGlucoLevel = function(){
    if(this.UpperGlucoValue){
    limitUpper = this.UpperGlucoValue;
    localStorage.setItem("limitUp", JSON.stringify(limitUpper));
    sugarChart.yAxis[0].removePlotBand();
    sugarChart.yAxis[0].addPlotBand({
        color: '#90ff90',
        from: limitLower,
        to: limitUpper
      });
    }else{
      this.Upper = limitUpper;
    }
  }

	//parses a new date from a string
	function parseJsonDate(jsonDateString) {
		var y = jsonDateString.substr(0, 4);
		var m = jsonDateString.substr(5, 2) - 1;
		var d = jsonDateString.substr(8, 2);
		var h = jsonDateString.substr(11, 2);
		var min = jsonDateString.substr(14, 2);
		return new Date(y, m, d, h, min);
	}
  function getDateStringI(i) {
		var d = new Date();
		d.setTime(d.getTime()-(i*3600000*6));
		return d.getTime();
	}
})

.controller('PulseCtrl', function ($scope, I4MIMidataService) {
	//***********************//
	//all functions by schmk3//
	//***********************//
  if(localStorage.BPData == undefined || localStorage.BPData == null || localStorage.BPData == ''){
    //Sample data for blood pressure
  var firstData = [
    	[getDateStringI(6), 125, 85],
    	[getDateStringI(5),135, 90],
    	[getDateStringI(4),132, 88],
    	[getDateStringI(3),128, 82],
    	[getDateStringI(2),138, 93],
    	[getDateStringI(1),136, 92]
    ];
    //store in localStorage with tag "BPData"
    localStorage.setItem("BPData", JSON.stringify(firstData));
  }

//load the data from the localStorage
aData = JSON.parse(localStorage.getItem("BPData"));
//Generate chart with blood pressure values
var BPChart = Highcharts.chart('container', {
		chart: {
			type: 'columnrange',
		},
		exporting: {
			enabled: false
		},
    xAxis:{
      type: 'datetime'
    },
		yAxis:{
		//		min: 0,
			plotBands: [
				{
					from: 60,
					to: 80,
					color: '#90ff90'
				},{
					from: 80,
					to: 90,
					color: ''
				},{
					from: 90,
					to: 120,
					color: '#90ff90'
				},
			],
			title: {
				text: 'Blutdruck',
			}
		},
		title:{
			text: 'Blutdruck'
		},
		series: [{
				name: 'Blutdruck',
				data: aData
			}
		]

	});

//function is called by the button to add some values.
//add a systolic and diastolic value to the chart
	$scope.addBPValue = function (sysVal, diaVal) {
		if(sysVal & diaVal){
			this.BPSysValue = '';
			this.BPDiaValue = '';
			aData.push([getDateStringI(0), sysVal, diaVal]);
			BPChart.series[0].setData(aData);
			localStorage.setItem("BPData", JSON.stringify(aData));
		}
	};

//returns a date (now subtract i * 6h)
	function getDateStringI(i) {
		var d = new Date();
		d.setTime(d.getTime()-(i*3600000*6));
		return d.getTime();
	}
})

.controller('MeCtrl', function ($scope) {

})

.controller('LoggedOutCtrl', function($scope, I4MIMidataService) {



})

.controller('SettingsCtrl', function($scope) {
});
