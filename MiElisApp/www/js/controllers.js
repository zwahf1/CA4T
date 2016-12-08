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


	//Array with the dates to the values
	var aDate = new Array();
	aDate = [
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
	var showChart = function () {
		new Chartist.Line($config['name'], {
			labels: $config['labels'],
			series: [aValue]
		}, {
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
	$scope.addValue = function (val) {
		if (!isNaN(val)) {
			aValue.push(val);
			aDate.push(getDateStringI(0));
		}
		this.form = {
			value: ''
		};
		showChart();
	};

	//returns the current date (TT.mm.YYYY)
	function getDateStringI(i) {
		var d = new Date();
		d.setDate(d.getDate() - i);
		var t = d.getDate();
		var m = d.getMonth() + 1;
		var y = d.getFullYear();
		return t + "." + m + "." + y;
	}

})

.controller('SugarCtrl', function ($scope) {
	//***********************//
	//all functions by schmk3//
	//***********************//
	//the chart for the sugar curve is from the google
	//firstData are the example data to fill the sugarChart

	var sugarChart = {};
	var firstData = [
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
	//loads the data into the chart
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
			type: 'date',
			format: "d.MMM - H:mm"
		}
	};

	//generate Chart
	$scope.mySugrChart = sugarChart;
	//function to add a inputed value
	$scope.addGlucoValue = function (val) {
		if(val){
			aData.push([getDateStringI(0), val]);
			sugarChart.data = aData;
			$scope.mySugrChart = sugarChart;
			localStorage.setItem("sugarData", JSON.stringify(aData));
			this.glucoseValue = '';
		}
	};
	//load the data from the localStorage to an array
	function localStorageToArray() {
		aData = JSON.parse(localStorage.getItem("sugarData"));
		for (var i = 1; i < aData.length; i++) {
			aData[i][0] = parseJsonDate(aData[i][0]);
			aData[i][1] = aData[i][1];
		}
		return aData;
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
		d.setDate(d.getDate() - i);
		return d;
	}
})

.controller('PulseCtrl', function ($scope, I4MIMidataService) {
	//***********************//
	//all functions by schmk3//
	//***********************//

//Sample data for blood pressure
var firstData = [
	[getDateStringI(6), 110, 65],
	[getDateStringI(5),90, 60],
	[getDateStringI(4),85, 55],
	[getDateStringI(3),118, 69],
	[getDateStringI(2),134, 81],
	[getDateStringI(1),126, 73]
];
//store in localStorage with tag "BPData"
localStorage.setItem("BPData", JSON.stringify(firstData));

//load the data from the localStorage to an array
aData = localStorageToArray();

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
	//load the data from the localStorage
	function localStorageToArray() {
		aData = JSON.parse(localStorage.getItem("BPData"));
		return aData;
	}
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
