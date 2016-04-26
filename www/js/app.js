// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('med', ['ionic','ngCordova', 'med.controllers', 'med.services', 'ngResource'])

.run(function($ionicPlatform, $cordovaSQLite) {
  $ionicPlatform.ready(function() {
      if(window.cordova && window.cordova.plugins.Keyboard) {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

        // Don't remove this line unless you know what you are doing. It stops the viewport
        // from snapping when text inputs are focused. Ionic handles this internally for
        // a much nicer keyboard experience.
        cordova.plugins.Keyboard.disableScroll(true);
      }

      if(window.StatusBar) {
        StatusBar.styleDefault();
      }

      if(window.cordova){
          db = $cordovaSQLite.openDB("med.db");
      }else{
          db = window.openDatabase("med.db", "1.0", "Med", -1);
      }

      //$cordovaSQLite.execute(db, "DROP TABLE med");
      //$cordovaSQLite.execute(db, "DROP TABLE hours");
      //$cordovaSQLite.execute(db, "DROP TABLE tomas");
      //$cordovaSQLite.execute(db, "DROP TABLE config");
      $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS config (avatar text default 'p1')");
      $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS med (id integer primary key, cn text, name text, dosis text, category text, type_units text, pactivo text,instructions text, days text, date_ini datetime, date_end datetime, alarm INTEGER DEFAULT 0, suspend INTEGER DEFAULT 0, units integer, frequency INTEGER, hour_ini datetime)");
      $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS hours (id integer primary key, med_id integer, hour text)");
      $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS tomas (id integer primary key, med_id integer, med_name text, date date, tomada INTEGER DEFAULT 0)");
  });
})


.config(function($stateProvider, $urlRouterProvider){

  $stateProvider
    .state("home", {
        url: "/home",
        abstract: true,
        cache: false,
        templateUrl: "templates/home.html",
        controller: "homeCtrl"
    })
    .state('home.inicio', {
        url: '/inicio',
        cache: false,
        views: {
            'menuContent': {
                templateUrl: 'templates/inicio.html',
                controller: 'homeCtrl'
            }
        }
    })
    .state("home.avatar", {
        url: "/avatar",
        views: {
            'menuContent': {
                templateUrl: "templates/avatar.html",
                controller: "homeCtrl"
            }
        }
    })
    .state("home.medicinas",{
      url: "/medicinas",
      cache: false,
      views: {
        'menuContent': {
          templateUrl: "templates/medicinas.html",
          controller: 'medicinasCtrl',
        }
      }
    })
    .state("home.editMedicina", {
        url: "/editMedicina",
        views: {
            'menuContent': {
                templateUrl: 'templates/edit.html',
                controller: 'medicinasCtrl'
            }
        }
    })
    .state("home.medicamento", {
        url: '/medicamento/:userId',
        views: {
            'menuContent': {
                templateUrl: 'templates/medicamento.html',
                controller: 'medicinasCtrl'
            }
        }
    })
    .state("home.tomas",{
      url: "/tomas",
      cache: false,
      views: {
        'menuContent': {
          templateUrl: "templates/tomas.html",
          controller: 'tomasCtrl'
        }
      }
    })
    .state("home.toma", {
        url: "/toma/:tomaId",
        cache: false,
        views: {
            'menuContent': {
                templateUrl: "templates/toma.html",
                controller: 'tomasCtrl'
            }
        }
    })
    .state("home.tomaok", {
        url: "/tomaok",
        cache: false,
        views: {
            'menuContent': {
                templateUrl: 'templates/tomaok.html',
                controller: 'tomasCtrl'
            }
        }
    })
    .state("home.seguimiento", {
        url: "/seguimiento",
        cache: false,
        views: {
            'menuContent': {
                templateUrl: 'templates/seguimiento.html',
                controller: 'seguimientoCtrl'
            }
        }
    })
    .state("home.seguimientodia", {
        url: "/seguimiento/:dia",
        views: {
            'menuContent': {
                templateUrl: 'templates/seguimientodia.html',
                controller: 'seguimientoCtrl'
            }
        }
    })
    .state("home.telecumple", {
        url: "/telecumple",
        views: {
            'menuContent': {
                templateUrl: 'templates/telecumple.html'
            }
        }
    })
    .state('home.addUser', {
        url: '/addUser/:medId',
        views: {
            'menuContent': {
                templateUrl: 'templates/add.html',
                controller: 'medicinasCtrl'
            }
        }
    })
    .state('home.categorias', {
        url: '/categorias',
        views: {
            'menuContent': {
                templateUrl: 'templates/categorias.html',
                controller: 'medicinasCtrl'
            }
        }
    })
    .state('home.medicamentos', {
        url: '/medicamentos/:catId',
        views: {
            'menuContent': {
                templateUrl: 'templates/medicamentos.html',
                controller: 'medicinasCtrl'
            }
        }
    });

    $urlRouterProvider.otherwise("/home/inicio");
})
