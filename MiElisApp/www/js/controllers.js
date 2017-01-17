/*************************************************
All controllers from the views in the app.

10.11.2016 zwahf1
 *************************************************/
angular.module('starter.controllers', [])

  .controller('AppCtrl', function($scope, $state, $ionicModal, midataService, $timeout) {

    // Check if selfmade picture is saved and load it
    // otherwise load defaultpicture
    $scope.checkImg = function() {
      $scope.localStorageImg = localStorage.getItem("Picture");
      if ($scope.localStorageImg != null) {
        document.getElementById("bMe").removeAttribute("src");
        document.getElementById("bMe").setAttribute("src", $scope.localStorageImg);
      } else if ($scope.localStorageImg == null || $scope.localStorageImg == undefined) {
        document.getElementById("bMe").setAttribute("src", "img/Elisabeth.jpg");
      }
    }

    //Save a given value to the given observation resource in MIDATA
    $scope.saveObservation = function(val, res) {
      var datetime = new Date();
      if (res == "w") {
        midataService.saveWeight(val, datetime);
      } else if (res == "p") {
        midataService.savePulse(val, datetime);
      } else if (res == "bp") {
        midataService.saveBloodPressure(val[0], val[1], datetime);
      } else if (res == "g") {
        midataService.saveGlucose(val, datetime);
      }
      console.log("saved: " + val + " to res: " + res + " at " + datetime);
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
      finish = false;
      midataService.search(res, params).then(function(observations) {
        result = [];
        //--> only pulses
        for (var i = 0; i < observations.length; i++) {
          if (observations[i]._fhir == null) {
            if (observations[i].code.coding["0"].display == "Herzschlag" ||
              observations[i].code.coding["0"].display == "Herzfrequenz") {
              result.push({
                category: observations[i].category["0"].coding["0"].display,
                ressource: "Pulse",
                time: observations[i].effectiveDateTime,
                value: observations[i].valueQuantity.value,
                unit: observations[i].valueQuantity.unit
              });
            }
          }
        }
        localStorage.setItem("pulse", JSON.stringify(result));
        result = [];
        //--> only weights
        for (var i = 0; i < observations.length; i++) {
          if (observations[i]._fhir != null) {
            if (observations[i]._fhir.code.coding["0"].display == "Weight Measured" ||
              observations[i]._fhir.code.coding["0"].display == "Body weight Measured" ||
              observations[i]._fhir.code.coding["0"].display == "Gewicht") {
              result.push({
                category: observations[i]._fhir.category["0"].coding["0"].display,
                ressource: "Weight",
                time: observations[i]._fhir.effectiveDateTime,
                value: observations[i]._fhir.valueQuantity.value,
                unit: observations[i]._fhir.valueQuantity.unit
              });
            }
          }
        }
        localStorage.setItem("weight", JSON.stringify(result));
        result = [];
        //--> only blood pressures
        for (var i = 0; i < observations.length; i++) {
          if (observations[i]._fhir == null) {
            if (observations[i].code.coding["0"].display == "Blood Pressure") {
              result.push({
                category: observations[i].category["0"].coding["0"].display,
                ressource: "Blood Pressure",
                time: observations[i].effectiveDateTime,
                valueSys: observations[i].component["0"].valueQuantity.value,
                valueDia: observations[i].component["1"].valueQuantity.value,
                unit: observations[i].valueQuantity.unit
              });
            } else if (observations[i].code.coding["0"].display == "Diastolischer Blutdruck") {
              for (var j = 0; j < observations.length; j++) {
                if (observations[j]._fhir == null) {
                  if (observations[j].code.coding["0"].display == "Systolischer Blutdruck") {
                    if (observations[i].effectiveDateTime == observations[j].effectiveDateTime) {
                      result.push({
                        category: "Blood Pressure",
                        ressource: observations[i].code.coding["0"].display,
                        time: observations[i].effectiveDateTime,
                        valueSys: observations[j].valueQuantity.value,
                        valueDia: observations[i].valueQuantity.value,
                        unit: observations[i].valueQuantity.unit
                      });

                    }
                  }
                }
              }
            }
          }
        }
        localStorage.setItem("bloodPressure", JSON.stringify(result));
        result = [];
        // --> only glucose
        for (var i = 0; i < observations.length; i++) {
          if (observations[i]._fhir == null) {
            if (observations[i].code.coding["0"].display == "Glucose [Moles/volume] in blood" ||
              observations[i].code.coding["0"].display == "Glucose in blood") {
              result.push({
                category: observations[i].category["0"].coding["0"].display,
                ressource: "Glucose",
                time: observations[i].effectiveDateTime,
                value: observations[i].valueQuantity.value,
                unit: observations[i].valueQuantity.unit
              });
            }
          }
        }
        localStorage.setItem("glucose", JSON.stringify(result));
        localStorage.setItem("observations", JSON.stringify(observations));
        finish = true;
      });
      var timer = $timeout(function refresh() {
        if (finish) {
        } else {
          timer = $timeout(refresh, 1000);
        }
     }, 1000);
    }

    $scope.getPerson = function() {
      res = "Person";
      params = {};
      result = [];
      midataService.search(res, params).then(function(persons) {
        result = persons;
        localStorage.setItem("persons", JSON.stringify(result));
      });
    }
  })

  .controller('HomeCtrl', function($scope, $state, midataService, $timeout) {

    $scope.changeView = function() {
      $state.go("app.Me");
    }

    var dumiData = {
      firstName: 'Elisabeth',
      lastName: 'Brönnimann',
      adress: 'Kreuzweg 11',
      zip: '2500',
      city: 'Biel',
      city: 'Biel',
      nkp1: 'Kurt Brönnimann',
      tkp1: '032 456 12 78',
      nkp2: 'Markus Brönnimann',
      tkp2: '079 123 45 67',
    };
    localStorage.setItem("data", JSON.stringify(dumiData));
    var data = JSON.parse(localStorage.getItem("data"));
    firstName = data.firstName;
    lastName = data.lastName;

    // Check if already logged in
    // if not and no login is defined  --> change to view LoggedOut
    // if not but login data is in the localstorage (not the first usage) --> autologin
    if (midataService.loggedIn() != true) {
      if (localStorage.login == undefined || localStorage.login == null || localStorage.login == '') {
        // create localStorage variable login (empty)
        localStorage.setItem("login", "{}");
        // change to view LoggedOut
        $state.go("LoggedOut");
      } else {
        // login to MIDATA with the login data from localStorage (as JSON)
        midataService.login(JSON.parse(localStorage.getItem("login")));
        var timer = $timeout(function refresh() {
          if (midataService.loggedIn()) {
            $scope.getObservation();
            $scope.checkImg();
          } else {
            timer = $timeout(refresh, 1000);
          }
       }, 1000);
      }
    }
  })

  .controller('LoginCtrl', function($scope, $state, midataService, $timeout) {
    $scope.login = {};
    // Perform the login action when the user submits the login form
    // Use for testing the development environment

    $scope.login.User = 'gruppe4@bfh.ch';
    $scope.login.Password = 'PW4clapps@midata';

    // save the username and password from input fields
    $scope.saveUserdata = function() {
      var user = {}; //JSON.parse(localStorage.getItem("login"));
      user.User = $scope.login.User;
      user.Password = $scope.login.Password;
      localStorage.setItem("login", JSON.stringify(user));
    }

    // Login to MIDATA with username and password from localstorage
    $scope.loginMIDATA = function() {
      var user = JSON.parse(localStorage.getItem("login"));
      midataService.login(user);
      var timer = $timeout(function refresh() {
        if (midataService.loggedIn()) {
          $scope.getObservation();
          document.getElementById("bLogin").setAttribute("style","background: lightgreen");
        } else {
          document.getElementById("bLogin").setAttribute("style","background: red");
          timer = $timeout(refresh, 1000);
        }
      }, 1000);
    }

    //Logout from MIDATA
    $scope.logoutMIDATA = function() {
      midataService.logout();
    }

  })

  .controller('WeightCtrl', function($scope, midataService) {

    //***********************//
    //all functions by schmk3//
    //***********************//

    //loads the weight data of MIDATA from localStorage to local variable
    var weightDataFromJSON = JSON.parse(localStorage.getItem("weight"));
    //sorts the data, if unsorted no chart can be generated

    var aData = [];

    //parsing the data from the localStorage to a usable array
    for (i = 0; i < weightDataFromJSON.length; i++) {
      var time = weightDataFromJSON[i].time;
      var value = weightDataFromJSON[i].value;
      var tempArray = [Date.parse(time), value];
      aData.push(tempArray);
    }
    aData.sort();

    //Generate the weightChart in the div tag named 'container'
    //more information in technical documentation or on the website of Highcharts
    var weightChart = {};
    weightChart = Highcharts.chart('container', {
      chart: {
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
        labels: {
          formatter: function() {
            return this.value + ' kg';
          }
        },
      },
      tooltip: {
        valueSuffix: ' kg'
      },
      legend: {
        enabled: false,
      },
      exporting: {
        enabled: false,
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
    after verification, that it's not empty, the value is added to array with actual time
    */
    $scope.addWValue = function(val) {
      if (val) {
        midataService.saveWeight(val, new Date());
        aData.push([getDateStringI(0), val]);
        weightChart.series[0].setData(aData);
        this.weightValue = '';
      }
    };

    //returns the current date (TT.mm.YYYY), called by addWValue function
    function getDateStringI(i) {
      var d = new Date();
      d.setTime(d.getTime() - (i * 3600000 * 12));
      return d.getTime();
    }
  })

  .controller('SugarCtrl', function($scope, midataService) {
    //***********************//
    //all functions by schmk3//
    //***********************//

    //loads the glucose data of MIDATA from localStorage to local variable
    var glucoseDataFromJSON = JSON.parse(localStorage.getItem("glucose"));
    //sorts the data, if unsorted the chart can not be generated
    glucoseDataFromJSON.sort();

    var aData = [];

    //parsing the data from the localStorage to a usable array
    for (i = 0; i < glucoseDataFromJSON.length; i++) {
      var time = glucoseDataFromJSON[i].time;
      var value = glucoseDataFromJSON[i].value;
      var tempArray = [Date.parse(time), value];
      aData.push(tempArray);
    }
    aData.sort();

    //if no lower limit stored, it takes the default value, 4.5
    if (localStorage.limitLow == undefined || localStorage.limitLow == null || localStorage.limitLow == '') {
      var limitLower = 4.5;
      localStorage.setItem("limitLow", JSON.stringify(limitLower));
    }
    //if no upper limit stored, it takes the default value, 7.2
    if (localStorage.limitUp == undefined || localStorage.limitUp == null || localStorage.limitUp == '') {
      var limitUpper = 7.2;
      localStorage.setItem("limitUp", JSON.stringify(limitUpper));
    }
    //call the lower and upper limit from localStorage
    limitLower = JSON.parse(localStorage.getItem("limitLow"));
    limitUpper = JSON.parse(localStorage.getItem("limitUp"));

    //Generate the sugarChart in the div tag named 'container'
    //more information in technical documentation or on the website of Highcharts
    var sugarChart = {};
    var sugarChart = Highcharts.chart('container', {
      chart: {
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
        plotBands: [{
          from: limitLower,
          to: limitUpper,
          color: '#90ff90'
        }],
        labels: {
          formatter: function() {
            return this.value + ' mmol/L';
          }
        },
      },
      tooltip: {
        valueSuffix: ' mmol/L'
      },
      legend: {
        enabled: false,
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

    /*function to add a value.
    after verification, that it's not empty, the value is added to array with actual time
    */
    $scope.addGlucoValue = function(val) {
      if (val) {
        midataService.saveGlucose(val, new Date());
        aData.push([getDateStringI(0), val]);
        sugarChart.series[0].setData(aData);
        this.glucoseValue = '';
      }
    };
    //returns the current date (TT.mm.YYYY), called by addWValue function
    function getDateStringI(i) {
      var d = new Date();
      d.setTime(d.getTime() - (i * 3600000 * 6));
      return d.getTime();
    }
  })

  .controller('PulseCtrl', function($scope, I4MIMidataService, midataService) {
    //***********************//
    //all functions by schmk3//
    //***********************//

    //loads the blood pressure data of MIDATA from localStorage to local variable
    var bpDataFromJSON = JSON.parse(localStorage.getItem("bloodPressure"));
    bpDataFromJSON.sort();
    //loads the pulse data of MIDATA from localStorage to local variable
    var pulseDataFromJSON = JSON.parse(localStorage.getItem("pulse"));
    //sorts the data, if unsorted the chart can not be generated
    pulseDataFromJSON.sort();

    var aData = [];
    var bData = [];

    //parsing the data from the localStorage to a usable array
    for (i = 0; i < bpDataFromJSON.length; i++) {
      var time = bpDataFromJSON[i].time;
      var valueSys = bpDataFromJSON[i].valueSys;
      var valueDia = bpDataFromJSON[i].valueDia;
      var tempArray = [Date.parse(time), valueSys, valueDia];
      aData.push(tempArray);
    }
    for (i = 0; i < pulseDataFromJSON.length; i++) {
      var time = pulseDataFromJSON[i].time;
      var valuePulse = pulseDataFromJSON[i].value;
      var tempArray = [Date.parse(time), valuePulse];
      bData.push(tempArray);
    }

    aData.sort();
    bData.sort();

    //Generate the bloodpressure and pulse Chart in the div-tag named 'container'
    //more information in technical documentation or on the website of Highcharts
    var BPChart = {};
    BPChart = Highcharts.chart('container', {
      legend: {
        enabled: false,
      },
      exporting: {
        enabled: false
      },
      xAxis: {
        type: 'datetime'
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Blutdruck<br/>Puls',
        },
      },
      title: {
        text: ''
      },
      series: [{
          type: 'columnrange',
          name: 'Blutdruck',
          tooltip: {
            valueSuffix: ' mmHg'
          },
          data: aData,
        },
        {
          type: 'spline',
          name: 'Puls',
          tooltip: {
            valueSuffix: ' /min'
          },
          data: bData,
          lineWidth: 0,
        }
      ]
    });

    //function is called by the button to add some values.
    //add a systolic and diastolic value to the chart, if they're not empty
    $scope.addBPValue = function(sysVal, diaVal) {
      if (sysVal & diaVal) {
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
      d.setTime(d.getTime() - (i * 3600000 * 24));
      return d.getTime();
    }
  })

  .controller('MeCtrl', function($scope) {
    $scope.fname = JSON.parse(localStorage.getItem("data"))['firstName'];
    $scope.lname = JSON.parse(localStorage.getItem("data"))['lastName'];
    $scope.adress = JSON.parse(localStorage.getItem("data"))['adress'];
    $scope.zip = JSON.parse(localStorage.getItem("data"))['zip'];
    $scope.city = JSON.parse(localStorage.getItem("data"))['city'];
    $scope.n1 = JSON.parse(localStorage.getItem("data"))['nkp1'];
    $scope.t1 = JSON.parse(localStorage.getItem("data"))['tkp1'];
    $scope.n2 = JSON.parse(localStorage.getItem("data"))['nkp2'];
    $scope.t2 = JSON.parse(localStorage.getItem("data"))['tkp2'];

    //if no anamnese and diagnose information available, it will filled with default data from E. Brönnimann
    if (localStorage.anamnese == undefined || localStorage.anamnese == null || localStorage.anamnese == '') {
      var anamneseArray = [{
          desc: 'St.n.Pneumonie 1942',
        },
        {
          desc: 'St n.Appendektomie 1946',
        },
        {
          desc: 'St n. offener Cholezystektomie 1986',
        },
        {
          desc: 'St n.Nephrolithiasis links mit ESWL im Inselspital Bern 1998',
        },
      ];
      localStorage.setItem("anamnese", JSON.stringify(anamneseArray));
    }
    if (localStorage.diagnose == undefined || localStorage.diagnose == null || localStorage.diagnose == '') {
      var diagnoseArray = [{
          desc: 'Diabetes mellitus Typ I mit Nephropathie, Polyneuropathie, Retinopathie, Katarakt beideseits'
        },
        {
          desc: 'Primäre Coxarthrose beideseits'
        },
        {
          desc: 'Hypertonie'
        },
        {
          desc: 'Vorhofflimmern (Ätiologie unklar)'
        },
      ];
      localStorage.setItem("diagnose", JSON.stringify(diagnoseArray));
    }
    $scope.anamneseItems = JSON.parse(localStorage.getItem("anamnese"));
    $scope.diagnoseItems = JSON.parse(localStorage.getItem("diagnose"));
  })

  //if no anamnese and diagnose information available, it will filled with default data from E. Brönnimann

  .controller('SettingsCtrl', function($scope, $cordovaCamera, $ionicPopup) {

    //Start the Camera, Take a Photo, Show the Picture
    $scope.takePicture = function() {
      var options = {
        quality: 75,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.CAMERA,
        allowEdit: true,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 250,
        targetHeight: 250,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: false
      };

      $cordovaCamera.getPicture(options).then(function(imageData) {
        $scope.imgURI = "data:image/jpeg;base64," + imageData;
        localStorage.setItem("Picture", $scope.imgURI)
      }, function(err) {
        // An error occured. Show a message to the user
      })
    };


    $scope.fname = JSON.parse(localStorage.getItem("data"))['firstName'];
    $scope.lname = JSON.parse(localStorage.getItem("data"))['lastName'];
    $scope.adress = JSON.parse(localStorage.getItem("data"))['adress'];
    $scope.zip = JSON.parse(localStorage.getItem("data"))['zip'];
    $scope.city = JSON.parse(localStorage.getItem("data"))['city'];
    $scope.n1 = JSON.parse(localStorage.getItem("data"))['nkp1'];
    $scope.t1 = JSON.parse(localStorage.getItem("data"))['tkp1'];
    $scope.n2 = JSON.parse(localStorage.getItem("data"))['nkp2'];
    $scope.t2 = JSON.parse(localStorage.getItem("data"))['tkp2'];

    $scope.changeFName = function() {
      if (this.fNameField) {
        persData = JSON.parse(localStorage.getItem("data"));
        persData.firstName = this.fNameField;
        localStorage.setItem("data", JSON.stringify(persData));
      } else {
        this.firstName = persData.fname;
      }
    }
    $scope.changeLName = function() {
      if (this.lNameField) {
        persData = JSON.parse(localStorage.getItem("data"));
        persData.lastName = this.lNameField;
        localStorage.setItem("data", JSON.stringify(persData));
      } else {
        this.lastName = persData.lname;
      }
    }
    $scope.changeAdress = function() {
      if (this.adressField) {
        persData = JSON.parse(localStorage.getItem("data"));
        persData.adress = this.adressField;
        localStorage.setItem("data", JSON.stringify(persData));
      } else {
        this.adress = persData.adress;
      }
    }
    $scope.changeZIP = function() {
      if (this.zipField) {
        persData = JSON.parse(localStorage.getItem("data"));
        persData.zip = this.zipField;
        localStorage.setItem("data", JSON.stringify(persData));
      } else {
        this.zip = persData.zip;
      }
    }
    $scope.changeCity = function() {
      if (this.cityField) {
        persData = JSON.parse(localStorage.getItem("data"));
        persData.city = this.cityField;
        localStorage.setItem("data", JSON.stringify(persData));
      } else {
        this.city = persData.city;
      }
    }
    $scope.changedName1 = function() {
      if (this.name1) {
        persData = JSON.parse(localStorage.getItem("data"));
        persData.nkp1= this.name1;
        localStorage.setItem("data", JSON.stringify(persData));
      } else {
        this.name1 = persData.nkp1;
      }
    }
    $scope.changedName2 = function() {
      if (this.name2) {
        persData = JSON.parse(localStorage.getItem("data"));
        persData.nkp2= this.name2;
        localStorage.setItem("data", JSON.stringify(persData));
      } else {
        this.name2 = persData.nkp2;
      }
    }
    $scope.changedTel1 = function() {
      if (this.tel1) {
        persData = JSON.parse(localStorage.getItem("data"));
        persData.tkp1= this.tel1;
        localStorage.setItem("data", JSON.stringify(persData));
      } else {
        this.name1 = persData.tkp1;
      }
    }
    $scope.changedTel2 = function() {
      if (this.tel2) {
        persData = JSON.parse(localStorage.getItem("data"));
        persData.tkp2= this.tel2;
        localStorage.setItem("data", JSON.stringify(persData));
      } else {
        this.name2 = persData.tkp2;
      }
    }

    if (localStorage.anamnese == undefined || localStorage.anamnese == null || localStorage.anamnese == '') {
      var anamneseArray = [{
          desc: 'St.n.Pneumonie 1942',
        },
        {
          desc: 'St n.Appendektomie 1946',
        },
        {
          desc: 'St n. offener Cholezystektomie 1986',
        },
        {
          desc: 'St n.Nephrolithiasis links mit ESWL im Inselspital Bern 1998',
        },
      ];
      localStorage.setItem("anamnese", JSON.stringify(anamneseArray));
    }
    if (localStorage.diagnose == undefined || localStorage.diagnose == null || localStorage.diagnose == '') {
      var diagnoseArray = [{
          desc: 'Diabetes mellitus Typ I mit Nephropathie, Polyneuropathie, Retinopathie, Katarakt beideseits'
        },
        {
          desc: 'Primäre Coxarthrose beideseits'
        },
        {
          desc: 'Hypertonie'
        },
        {
          desc: 'Vorhofflimmern (Ätiologie unklar)'
        },
      ];
      localStorage.setItem("diagnose", JSON.stringify(diagnoseArray));
    }
    $scope.anamneseItems = JSON.parse(localStorage.getItem("anamnese"));
    $scope.diagnoseItems = JSON.parse(localStorage.getItem("diagnose"));

    //function to move the items in diagnose and anamnese list
    $scope.moveItem = function(items, item, fromIndex, toIndex) {
      items.splice(fromIndex, 1);
      items.splice(toIndex, 0, item);
      localStorage.setItem("anamnese", JSON.stringify($scope.anamneseItems));
      localStorage.setItem("diagnose", JSON.stringify($scope.diagnoseItems));
    };

    //function to remove items in diagnose and anamnese list
    $scope.onItemDelete = function(items, item) {
      items.splice(items.indexOf(item), 1);
      localStorage.setItem("anamnese", JSON.stringify($scope.anamneseItems));
      localStorage.setItem("diagnose", JSON.stringify($scope.diagnoseItems));

    };

    //function to add a new anamnese
    $scope.addAnamnese = function(text) {
      if (text) {
        var newItem = {};
        newItem.desc = text;
        this.anamneseItems.push(newItem);
        this.newAnamnese = '';
        localStorage.setItem("anamnese", JSON.stringify($scope.anamneseItems));
      }
    }

    //function to add a new diagnose
    $scope.addDiagnose = function(text) {
      if (text) {
        var newItem = {};
        newItem.desc = text;
        $scope.diagnoseItems.push(newItem);
        this.newDiagnose = '';
        localStorage.setItem("diagnose", JSON.stringify($scope.diagnoseItems));
      }
    }
    //if no lower limit stored, it takes the default value, 4.5
    if (localStorage.limitLow == undefined || localStorage.limitLow == null || localStorage.limitLow == '') {
      var limitLower = 4.5;
      localStorage.setItem("limitLow", JSON.stringify(limitLower));
    }
    //if no upper limit stored, it takes the default value, 7.2
    if (localStorage.limitUp == undefined || localStorage.limitUp == null || localStorage.limitUp == '') {
      var limitUpper = 7.2;
      localStorage.setItem("limitUp", JSON.stringify(limitUpper));
    }
    //call the lower and upper limit from localStorage
    limitLower = JSON.parse(localStorage.getItem("limitLow"));
    $scope.Lower = limitLower;
    limitUpper = JSON.parse(localStorage.getItem("limitUp"));
    $scope.Upper = limitUpper;

    //functions to configure the targetrange of blood sugar
    $scope.changeLowerGlucoLevel = function() {
      if (this.LowerGlucoValue) {
        limitLower = this.LowerGlucoValue;
        localStorage.setItem("limitLow", JSON.stringify(limitLower));
      } else {
        this.Lower = limitLower;
      }
    }
    $scope.changeUpperGlucoLevel = function() {
      if (this.UpperGlucoValue) {
        limitUpper = this.UpperGlucoValue;
        localStorage.setItem("limitUp", JSON.stringify(limitUpper));
      } else {
        this.Upper = limitUpper;
      }
    }
    // An alert dialog
    $scope.showAlert = function() {
      var alertPopup = $ionicPopup.alert({
        title: '<h2>Datenschutzerklärung</h2>',
        template: "<div><h3>Haftungsausschluss</h3>Der Autor übernimmt keinerlei Gewähr hinsichtlich der inhaltlichen Richtigkeit, Genauigkeit, Aktualität, Zuverlässigkeit und Vollständigkeit der Informationen. Haftungsansprüche gegen den Autor wegen Schäden materieller oder immaterieller Art, welche aus dem Zugriff oder der Nutzung bzw. Nichtnutzung der veröffentlichten Informationen, durch Missbrauch der Verbindung oder durch technische Störungen entstanden sind, werden ausgeschlossen. Alle Angebote sind unverbindlich. Der Autor behält es sich ausdrücklich vor, Teile der Seiten oder das gesamte Angebot ohne gesonderte Ankündigung zu verändern, zu ergänzen, zu löschen oder die Veröffentlichung zeitweise oder endgültig einzustellen.</div> <br/> <div><h3>Urheberrechte</h3> Die Urheber- und alle anderen Rechte an Inhalten, Bildern, Fotos oder anderen Dateien auf der Website gehören ausschliesslich muk mikmiu oder den speziell genannten Rechtsinhabern. Für die Reproduktion jeglicher Elemente ist die schriftliche Zustimmung der Urheberrechtsträger im Voraus einzuholen.</div> <br/> <div><h3>Datenschutz</h3> Gestützt auf Artikel 13 der schweizerischen Bundesverfassung und die datenschutzrechtlichen Bestimmungen des Bundes (Datenschutzgesetz, DSG) hat jede Person Anspruch auf Schutz ihrer Privatsphäre sowie auf Schutz vor Missbrauch ihrer persönlichen Daten. Wir halten diese  Bestimmungen ein. Persönliche Daten werden streng vertraulich behandelt und weder an Dritte verkauft noch weiter gegeben. In enger Zusammenarbeit mit unseren Hosting-Providern bemühen wir uns, die Datenbanken so gut wie möglich vor fremden Zugriffen, Verlusten, Missbrauch oder vor Fälschung zu schützen. Beim Zugriff auf unsere Webseiten werden folgende Daten in Logfiles gespeichert: IP-Adresse, Datum, Uhrzeit, Browser-Anfrage und allg. übertragene Informationen zum Betriebssystem resp. Browser. Diese Nutzungsdaten bilden die Basis für statistische, anonyme Auswertungen, so dass Trends erkennbar sind, anhand derer wir unsere Angebote entsprechend verbessern können.</div>",
        okText: 'Schliessen',
      });
    };

  })

  .controller('LoggedOutCtrl', function($scope, I4MIMidataService) {

  })
