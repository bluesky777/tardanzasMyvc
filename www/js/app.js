// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ionic-monthpicker'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs).
    // The reason we default this to hidden is that native apps don't usually show an accessory bar, at
    // least on iOS. It's a dead giveaway that an app is using a Web View. However, it's sometimes
    // useful especially with forms, though we would prefer giving the user a little more room
    // to interact with the app.
    if (window.cordova && window.Keyboard) {
      window.Keyboard.hideKeyboardAccessoryBar(true);
    }

    if (window.StatusBar) {
      // Set the statusbar to use the default style, tweak this to
      // remove the status bar on iOS or change it to use white instead of dark colors.
      StatusBar.styleDefault();
    }
  });
})


.config(function($stateProvider, $urlRouterProvider, $httpProvider, $ionicConfigProvider) {

  $httpProvider.defaults.useXDomain = true;
  delete $httpProvider.defaults.headers.common['X-Requested-With'];

  $ionicConfigProvider.tabs.position('bottom');
  localStorage.trabajar_sin_conexion = true;


  $stateProvider

  .state('tab', {
    url: '/tab',
    abstract: true,
    cache: false,
    controller:"TabsCtrl",
    templateUrl: 'templates/tabs.html'
  })

  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl'
  })
  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
    cache: false,
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })
  .state('tab.periodos', {
    url: '/dash/:year_id',
    cache: false,
    views: {
      'tab-dash': {
        templateUrl: 'templates/dash-periodos.html',
        controller: 'DashPeriodosCtrl'
      }
    }
  })

  .state('tab.grupos', {
      url: '/grupos',
      cache: false,
      views: {
        'tab-grupos': {
          templateUrl: 'templates/tab-grupos.html',
          controller: 'GruposCtrl'
        }
      }
    })
    .state('tab.grupo-alumnos', {
      url: '/grupos/:grupo_id',
      cache: false,
      views: {
        'tab-grupos': {
          templateUrl: 'templates/grupo-alumnos.html',
          controller: 'GrupoAlumnosCtrl'
        }
      }
    })
    .state('tab.detalle-alumno', {
      url: '/detalle-alumno',
      cache: false,
      views: {
        'tab-grupos': {
          templateUrl: 'templates/detalle-alumno.html',
          controller: 'DetalleAlumnoCtrl'
        }
      }
    })

  .state('tab.account', {
    url: '/account',
    cache: false,
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  })
  .state('tab.ver-cambios-hechos', {
    url: '/ver_cambios_hechos',
    views: {
      'tab-account': {
        templateUrl: 'templates/ver-cambios-hechos.html',
        controller: 'VerCambiosHechosCtrl'
      }
    },
    cache: false
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

});
