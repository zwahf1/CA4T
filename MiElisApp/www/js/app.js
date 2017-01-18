/*************************************************
Ionic starter app

Statehandling for the diffrent views and loading the html files and controllers

10.11.2016 zwahf1
*************************************************/

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'ionic-datepicker', 'ionic-timepicker', 'formlyIonic', 'nvd3', 'i4mi', 'jsonFormatter', 'googlechart', 'ngStorage', 'ngCordova', 'services'])
// 'chart.service',
.constant('APPNAME','MiElisApp')
.constant('APPSECRET','MEA2016HSCA4T')

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('LoggedOut', {
    url: '/LoggedOut',
    templateUrl: 'templates/LoggedOut.html',
    controller: 'LoggedOutCtrl'
  })

  .state('app.Home', {
    url: '/Home',
    views: {
      'menuContent': {
        templateUrl: 'templates/Home.html',
        controller: 'HomeCtrl'
      }
    }
  })

  .state('app.login', {
    url: '/login',
    views: {
      'menuContent': {
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
      }
    }
  })

  .state('app.Weight', {
    url: '/Weight',
    views: {
      'menuContent': {
        templateUrl: 'templates/Weight.html',
        controller: 'WeightCtrl'
      }
    }
  })

  .state('app.Sugar', {
    url: '/Sugar',
    views: {
      'menuContent': {
        templateUrl: 'templates/Sugar.html',
        controller: 'SugarCtrl'
      }
    }
  })

  .state('app.Pulse', {
    url: '/Pulse',
    views: {
      'menuContent': {
        templateUrl: 'templates/Pulse.html',
        controller: 'PulseCtrl'
      }
    }
  })

  .state('app.Me', {
    url: '/Me',
    views: {
      'menuContent': {
        templateUrl: 'templates/Me.html',
        controller: 'MeCtrl'
      }
    }
  })

  .state('app.Settings', {
    url: '/Settings',
    views: {
      'menuContent': {
        templateUrl: 'templates/Settings.html',
        controller: 'SettingsCtrl'
      }
    }
  })

  .state('app.DetailContact', {
    url: '/DetailContact',
    views: {
      'menuContent': {
        templateUrl: 'templates/DetailContact.html',
        controller: 'DetailContactCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/Home');
});
