/*************************************************
All controllers from the views in the app.

10.11.2016 zwahf1
 *************************************************/
angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, json, midataService) {

  // Login to MIDATA with username and password from localstorage
  $scope.loginMIDATA = function() {
    var user = JSON.parse(localStorage.getItem("login"));
    try {
      midataService.login(user);
      return "Successful"
    } catch (err){
      return err
    }
  }

  //Logout from MIDATA
  $scope.logoutMIDATA = function() {
    midataService.logout();
  }

  //Save a given value to the given observation resource in MIDATA
  $scope.saveObservation = function(val, res) {
    var datetime = new Date();
    if(res == "w") {
      midataService.saveWeight(val, datetime);
    } else if(res == "p") {
      midataService.savePulse(val, new Date());
    } else if(res == "bp") {
      midataService.saveBloodPressure(val[0], val[1], new Date());
    } else if(res == "g") {
      midataService.saveGlucose(json, val);
    }
  }

// Function to get all observations from midata
// parameter: resource -> define for specific observations
// w: all Weights
// p: all Pulses
// bp: all Blood Pressures
//empty: all observations
  $scope.getObservation = function() {
    res = "Observation";
    params = {};
    midataService.search(res,params).then(function(observations) {
      result = [];
      //--> only pulses
      for (var i = 0; i < observations.length; i++) {
        if(observations[i]._fhir == null) {
          if(observations[i].code.coding["0"].display == "Herzschlag" ||
              observations[i].code.coding["0"].display == "Herzfrequenz")
          {
            result.push({time: observations[i].effectiveDateTime,
                        value: observations[i].valueQuantity.value});
          }
        }
      }
      localStorage.setItem("pulse",JSON.stringify(result));
      result = [];
    //--> only weights
      for (var i = 0; i < observations.length; i++) {
        if(observations[i]._fhir != null) {
          if(observations[i]._fhir.code.coding["0"].display == "Weight Measured" ||
              observations[i]._fhir.code.coding["0"].display == "Body weight Measured" ||
              observations[i]._fhir.code.coding["0"].display == "Gewicht")
          {
            result.push({time: observations[i]._fhir.effectiveDateTime,
                        value: observations[i]._fhir.valueQuantity.value});
          }
        }
      }
      localStorage.setItem("weight",JSON.stringify(result));
      result = [];
    //--> only blood pressures
      for (var i = 0; i < observations.length; i++) {
        if(observations[i]._fhir == null) {
          if(observations[i].code.coding["0"].display == "Blood Pressure") {
            result.push({time: observations[i].effectiveDateTime,
                        valueSys: observations[i].component["0"].valueQuantity.value,
                        valueDia: observations[i].component["1"].valueQuantity.value});
          }
          else if (observations[i].code.coding["0"].display == "Diastolischer Blutdruck") {
            for (var j = 0; j < observations.length; j++) {
              if(observations[j]._fhir == null) {
                if (observations[j].code.coding["0"].display == "Systolischer Blutdruck") {
                  if (observations[i].effectiveDateTime == observations[j].effectiveDateTime) {
                    result.push({time: observations[i].effectiveDateTime,
                                valueSys: observations[j].valueQuantity.value,
                                valueDia: observations[i].valueQuantity.value});

                  }
                }
              }
            }
          }
        }
      }
      localStorage.setItem("bloodPressure",JSON.stringify(result));
      localStorage.setItem("observations",JSON.stringify(observations));
      console.log(JSON.parse(localStorage.getItem("weight")));
      console.log(JSON.parse(localStorage.getItem("pulse")));
      console.log(JSON.parse(localStorage.getItem("bloodPressure")));
      console.log(JSON.parse(localStorage.getItem("observations")));
    });
  }

  $scope.getPerson = function() {
    res = "Person";
    params = {};
    result = [];
    midataService.search(res,params).then(function(persons) {
      console.log(persons);
    });

  }
})

.controller('HomeCtrl', function($scope, $state, midataService) {

  var dumiData = {
		firstName: 'Elisabeth',
		lastName: 'Brönnimann'
	};
	localStorage.setItem("data", JSON.stringify(dumiData));
  var data = JSON.parse(localStorage.getItem("data"));
  firstName =   data.firstName;
  lastName = data.lastName;

  // Check if already logged in
  // if not and no login is defined  --> change to view LoggedOut
  // if not but login data is in the localstorage (not the first usage) --> autologin
  if(midataService.loggedIn != true) {
    if(localStorage.login == undefined || localStorage.login == null || localStorage.login == ''){
      // create localStorage variable login (empty)
      localStorage.setItem("login", "{}");
      // change to view LoggedOut
      $state.go("LoggedOut");
    } else {
      // login to MIDATA with the login data from localStorage (as JSON)
      midataService.login(JSON.parse(localStorage.getItem("login")));
    }
  }
})

.controller('LoginCtrl', function($scope, $state, midataService) {
  $scope.login = {};
  // Perform the login action when the user submits the login form
  // Use for testing the development environment

  $scope.login.User = 'gruppe4@bfh.ch';
  $scope.login.Password = 'PW4clapps@midata';

  // save the username and password from input fields
  $scope.saveUserdata = function() {
    var user = JSON.parse(localStorage.getItem("login"));
    user.User = $scope.login.User;
    user.Password = $scope.login.Password;
    localStorage.setItem("login",JSON.stringify(user));
  }

  //return a message to the textfield
  // - logged in
  // - failed
  $scope.setLoginMessage = function(err) {
    $scope.msgHead = err;
  }
})

.controller('WeightCtrl', function($scope, midataService) {

//***********************//
//all functions by schmk3//
//***********************//
//test itmes, used by development

var weightDataFromJSON = JSON.parse(localStorage.getItem("weight"));
weightDataFromJSON.sort();
$scope.wDataJSON = weightDataFromJSON;
var aData = [];

for(i = 0; i < weightDataFromJSON.length; i++){
  var time = weightDataFromJSON[i].time;
  var value = weightDataFromJSON[i].value;
  var tempArray = [Date.parse(time), value];
  aData.push(tempArray);
}
aData.sort();

var weightChart = {};

weightChart = Highcharts.chart('container', {
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
    min: 0,
  },
/*
  tooltip: {
    formatter: function() {
      return '<button on-click="removeWeightValue()">löschen</button>';
    }
  },
  */
  exporting: {
    enabled: false,
  },
  plotOptions: {
      series: {
         point: {
              events: {
                /*
                  click: function () {
                      alert('Category: ' + this.category + ', value: ' + this.y);
                  }
                */
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
$scope.removeWeightValue = function(){
  alert('Category: ' + this.category + ', value: ' + this.y);
}
$scope.addWValue = function (val) {
  if(val){

    midataService.saveWeight(val, new Date());
    aData.push([getDateStringI(0), val]);
    weightChart.series[0].setData(aData);
    this.weightValue = '';
  }
};

	//returns the current date (TT.mm.YYYY)
  function getDateStringI(i) {
		var d = new Date();
		d.setTime(d.getTime()-(i*3600000*12));
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
      min: 0,
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

.controller('PulseCtrl', function ($scope, I4MIMidataService, midataService) {
	//***********************//
	//all functions by schmk3//
	//***********************//

  var bpDataFromJSON = JSON.parse(localStorage.getItem("bloodPressure"));
  bpDataFromJSON.sort();
  var pulseDataFromJSON = JSON.parse(localStorage.getItem("pulse"));
  pulseDataFromJSON.sort();

  var aData = [];
  var bData = [];

  for(i = 0; i < bpDataFromJSON.length; i++){
    var time = bpDataFromJSON[i].time;
    var valueSys = bpDataFromJSON[i].valueSys;
    var valueDia = bpDataFromJSON[i].valueDia;
    var tempArray = [Date.parse(time), valueSys, valueDia];
    aData.push(tempArray);
  }
  for(i = 0; i < pulseDataFromJSON.length; i++){
    var time = pulseDataFromJSON[i].time;
    var valuePulse = pulseDataFromJSON[i].value;
    var tempArray = [Date.parse(time), valuePulse];
    bData.push(tempArray);
  }

  aData.sort();
  bData.sort();

//Generate chart with blood pressure values7
  var BPChart = {};
  BPChart = Highcharts.chart('container', {
/*
		chart: {
			type: 'columnrange',
		},
*/
		exporting: {
			enabled: false
		},
    xAxis:{
      type: 'datetime'
    },
		yAxis:{
				min: 0,
        /*
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
      */
			title: {
				text: 'Blutdruck',
			}
		},
		title:{
			text: 'Blutdruck'
		},
		series: [
      {
        type: 'columnrange',
        name: 'Blutdruck',
        data: aData,
      },
      {
        type: 'spline',
        name: 'Puls',
        data: bData,
        lineWidth: 0,
      }
    ]

	});

//function is called by the button to add some values.
//add a systolic and diastolic value to the chart
	$scope.addBPValue = function (sysVal, diaVal) {
		if(sysVal & diaVal){
      midataService.saveBloodPressure(sysVal, diaVal, new Date());
			this.BPSysValue = '';
			this.BPDiaValue = '';
			aData.push([getDateStringI(0), sysVal, diaVal]);
			BPChart.series[0].setData(aData);
		}
	};

//returns a date (now subtract i * 6h)
	function getDateStringI(i) {
		var d = new Date();
		d.setTime(d.getTime()-(i*3600000*24));
		return d.getTime();
	}
})

.controller('MeCtrl', function ($scope) {

})

.controller('LoggedOutCtrl', function($scope, I4MIMidataService) {



})

.controller('SettingsCtrl', function($scope) {
  if(localStorage.limitLow == undefined || localStorage.limitLow == null || localStorage.limitLow == ''){
    var limitLower = 4.5;
    localStorage.setItem("limitLow", JSON.stringify(limitLower));
  }
  if(localStorage.limitUp == undefined || localStorage.limitUp == null || localStorage.limitUp == ''){
    var limitUpper = 7.2;
    localStorage.setItem("limitUp", JSON.stringify(limitUpper));
  }
  limitLower = JSON.parse(localStorage.getItem("limitLow"));
  $scope.Lower = limitLower;
  limitUpper = JSON.parse(localStorage.getItem("limitUp"));
  $scope.Upper = limitUpper;

  $scope.changeLowerGlucoLevel = function(){
    if(this.LowerGlucoValue){
      limitLower = this.LowerGlucoValue;
      localStorage.setItem("limitLow", JSON.stringify(limitLower));
    }else{
      this.Lower = limitLower;
    }
  }
  $scope.changeUpperGlucoLevel = function(){
    if(this.UpperGlucoValue){
    limitUpper = this.UpperGlucoValue;
    localStorage.setItem("limitUp", JSON.stringify(limitUpper));
    }else{
      this.Upper = limitUpper;
    }
  }
});
