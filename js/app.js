// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('upark',
  ['ionic', 'ngCordova', 'ngMap',
  'ngMessages',
  'angularMoment',
  //'relativeDate',
  //'ngResource',
  'upark.booking',
  'upark.share',
  'upark.share.admin',
  'upark.money',
  'upark.user',
  'upark.map',
  'upark.menu',
  'upark.admin',
  'upark.item'
  //'upark.test'
])

.constant('SERVER_ROOT', 'http://192.168.0.175:80')
.constant('API_ROOT', 'http://192.168.0.175:80/restserver/index.php/api')
.constant('UPLOAD_USER_IMAGE_URL', 'http://192.168.0.175/restserver/index.php/upload/user_image')
.constant('UPLOAD_DIR', 'http://192.168.0.175/restserver/uploads')
.constant('API_KEY_1', '0og0ww4o8000owo0c8csg8g0wssokgw8sosoc08k')
.constant('API_KEY_ADMIN', 'sgkg4s04o8ccg44soow0csokwgw0sskk0004s8k0')

.run(function($ionicPlatform, $ionicPopup, amMoment, StateService) {
  $ionicPlatform.ready(function() {

    // check internet first
    if(window.Connection) {
      if(navigator.connection.type == Connection.NONE) {
        $ionicPopup.alert({
          title: "oops..您的裝置沒連上網路",
          content: "請先連上網路，感謝您!"
        })
        .then(function(result) {
          ionic.Platform.exitApp();
          //if(!result) { ionic.Platform.exitApp();}
        });
      }
    }

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

    // set ready
    StateService.onDocumentReady();
  });

  // init moment locale
  amMoment.changeLocale('zh-tw');
})

.config(function($stateProvider, $urlRouterProvider) {
    /**
     *  ALL STATE
    **/
    $stateProvider

    .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'upark-menu/menu.html',
      controller: 'MenuCtrl'
    })

    .state('app.upark-item', {
      url: '/upark-item/:id',
      cache: false,
      views: {
        'menuContent': {
          templateUrl: 'components/item-main.html',
          controller: 'UparkItemCtrl'
        }
      }
    })
    .state('app.upark-item-view', {
      url: '/upark-item-view/:id',
      views: {
        'menuContent': {
          templateUrl: 'components/item-view.html',
          controller: 'UparkItemCtrl'
        }
      }
    })

    .state('app.upark-item-group', {
      url: '/upark-item-group/:id',
      cache: false,
      views: {
        'menuContent': {
          templateUrl: 'components/item-group-main.html',
          controller: 'UparkItemGroupCtrl'
        }
      }
    })

    /**
      * upark-admin
    **/
    .state('app.admin-main', {
      url: '/admin-main',
      views: {
        'menuContent': {
          templateUrl: 'upark-admin/admin-main.html',
          controller: 'AdminCtrl'
        }
      },
      onEnter: function(StateService, AdminService){
        // CHECK ADMIN

        // GET DATA
        console.log("app.admin-main..onEnter");
        if(StateService.checkConnection()){
          AdminService.refreshPendingItems();
        }
      }
    })
    .state('app.admin-log', {
      url: '/admin-log',
      views: {
        'menuContent': {
          templateUrl: 'upark-admin/admin-log.html',
          controller: 'AdminCtrl'
        }
      },
      onEnter: function(StateService, AdminService){
        // CHECK ADMIN

        // GET DATA
        console.log("app.admin-log..onEnter");
        if(StateService.checkConnection()){
          AdminService.refreshCheckerItems();
        }
      }
    })

    /**
      * upark-map
    **/
    .state('app.map-main', {
      url: '/map-main',
      views: {
        'menuContent': {
          templateUrl: 'upark-map/map-main.html',
          controller: 'MapCtrl'
        }
      },
      onEnter: function(StateService, UserService, GeoService){
        console.log("app.map-main..onEnter");
        if(StateService.checkConnection()){
          // check location
          StateService.checkLocation();
        }
        //if(!StateService.data.isNetworkEnabled || !StateService.data.isGpsLocationEnabled){CommonService.changeViewNoBack("#/app");}
      },
      onExit: function(){
        //console.log("app.map-main..onExit");
        //GeoService.stop();
      }
    })
    /**
    .state('app.map-list', {
      url: '/map-list',
      views: {
        'menuContent': {
          templateUrl: 'upark-map/map-list.html',
          controller: 'MapCtrl'
        }
      }
    })
    **/
    .state('app.map-detail', {
      url: '/map-detail/:id',
      views: {
        'menuContent': {
          templateUrl: 'upark-map/map-detail.html',
          controller: 'MapDetailCtrl'
        }
      }
    })
    .state('app.map-time', {
      url: '/map-time',
      views: {
        'menuContent': {
          templateUrl: 'upark-map/map-time.html',
          controller: 'MapCtrl'
        }
      }
    })

    /**
      * upark-user
    **/
    .state('app.user-main', {
      url: '/user-main',
      views: {
        'menuContent': {
          templateUrl: 'upark-user/user-main.html',
          controller: 'UserCtrl'
        }
      }
    })
    .state('app.user-login', {
      url: '/user-login',
      views: {
        'menuContent': {
          templateUrl: 'upark-user/user-login.html',
          controller: 'UserCtrl'
        }
      }
    })
    .state('app.user-create', {
      url: '/user-create',
      views: {
        'menuContent': {
          templateUrl: 'upark-user/user-create.html',
          controller: 'UserCtrl'
        }
      }
    })

    /**
      * upark-money
    **/
    .state('app.money-main', {
      url: '/money-main',
      views: {
        'menuContent': {
          templateUrl: 'upark-money/money-main.html',
          controller: 'MoneyCtrl'
        }
      }
    })

    /**
      * upark-share
    **/
    .state('app.share-main', {
      url: '/share-main',
      views: {
        'menuContent': {
          templateUrl: 'upark-share/share-main.html',
          controller: 'ShareMainCtrl'
        }
      },
      onEnter: function(StateService, UserService){
        console.log("app.share-main..onEnter");
        if(StateService.checkConnection()){
          // owner items
          UserService.refreshOwnerItems();
          // check items
          UserService.refreshUparkCheckItems();
        }
      }
    })
    .state('app.share-group-main', {
      url: '/share-group-main',
      views: {
        'menuContent': {
          templateUrl: 'upark-share/share-group-main.html',
          controller: 'ShareMainCtrl'
        }
      },
      onEnter: function(StateService, UserService){
        console.log("app.share-main..onEnter");
        if(StateService.checkConnection()){
          // owner groups
          UserService.refreshOwnerGroups();
          // check items
          UserService.refreshUparkCheckItems();
        }
      }
    })
    .state('app.share-create', {
      url: '/share-create',
      views: {
        'menuContent': {
          templateUrl: 'upark-share/share-create.html',
          controller: 'ShareCreateCtrl'
        }
      }
    })
    .state('app.share-group-create', {
      url: '/share-group-create',
      views: {
        'menuContent': {
          templateUrl: 'upark-share/share-group-create.html',
          controller: 'ShareGroupCreateCtrl'
        }
      }
    })
    .state('app.share-pending', {
      url: '/share-pending/:id',
      cache: false,
      views: {
        'menuContent': {
          templateUrl: 'upark-share/share-pending.html',
          controller: 'SharePendingCtrl'
        }
      }
    })
    .state('app.share-group-pending', {
      url: '/share-group-pending/:id',
      cache: false,
      views: {
        'menuContent': {
          templateUrl: 'upark-share/share-group-pending.html',
          controller: 'ShareGroupPendingCtrl'
        }
      }
    })
    .state('app.share-admin', {
      url: '/share-admin/:id/:log_id/:upark_type',
      views: {
        'menuContent': {
          templateUrl: 'upark-share/share-admin.html',
          controller: 'ShareAdminCtrl'
        }
      }
    })
    .state('app.share-admin-group', {
      url: '/share-admin-group/:id/:log_id/:upark_type',
      views: {
        'menuContent': {
          templateUrl: 'upark-share/share-admin-group.html',
          controller: 'ShareAdminCtrl'
        }
      }
    })
    .state('app.share-admin-pending', {
      url: '/share-admin-pending/:id',
      views: {
        'menuContent': {
          templateUrl: 'upark-share/share-admin-pending.html',
          controller: 'ShareAdminPendingCtrl'
        }
      }
    })
    .state('app.share-admin-group-pending', {
      url: '/share-admin-group-pending/:id',
      views: {
        'menuContent': {
          templateUrl: 'upark-share/share-admin-group-pending.html',
          controller: 'ShareAdminPendingCtrl'
        }
      }
    })
    .state('app.share-admin-result', {
      url: '/share-admin-result/:id/:log_id',
      views: {
        'menuContent': {
          templateUrl: 'upark-share/share-admin-result.html',
          controller: 'ShareAdminResultCtrl'
        }
      }
    })
    .state('app.share-admin-confirm', {
      url: '/share-admin-confirm/:id/:log_id/:upark_type',
      views: {
        'menuContent': {
          templateUrl: 'upark-share/share-admin-confirm.html',
          controller: 'ShareAdminConfirmCtrl'
        }
      }
    })
    .state('app.share-admin-group-confirm', {
      url: '/share-admin-group-confirm/:id/:log_id/:upark_type',
      views: {
        'menuContent': {
          templateUrl: 'upark-share/share-admin-group-confirm.html',
          controller: 'ShareAdminGroupConfirmCtrl'
        }
      }
    })
    .state('app.share-admin-decline', {
      url: '/share-admin-decline/:id/:log_id/:upark_type',
      views: {
        'menuContent': {
          templateUrl: 'upark-share/share-admin-decline.html',
          controller: 'ShareAdminDeclineCtrl'
        }
      }
    })
    .state('app.share-admin-group-decline', {
      url: '/share-admin-group-decline/:id/:log_id/:upark_type',
      views: {
        'menuContent': {
          templateUrl: 'upark-share/share-admin-group-decline.html',
          controller: 'ShareAdminDeclineCtrl'
        }
      }
    })
    .state('app.share-admin-detail', {
      url: '/share-admin-detail/:id',
      views: {
        'menuContent': {
          templateUrl: 'upark-share/share-admin-detail.html',
          controller: 'ShareAdminDetailCtrl'
        }
      }
    })

    /**
      * upark-booking
    **/
    .state('app.booking-main', {
      url: '/booking-main',
      views: {
        'menuContent': {
          templateUrl: 'upark-booking/booking-main.html',
          controller: 'BookingCtrl'
        }
      }
    })
    .state('app.booking-detail', {
      url: '/booking-detail/:id',
      views: {
        'menuContent': {
          templateUrl: 'upark-booking/booking-detail.html',
          controller: 'BookingDetailCtrl'
        }
      }
    })

    .state('app.error', {
      url: '/error',
      views: {
        'menuContent': {
          templateUrl: 'templates/error.html'
        }
      },
      onEnter: function(){
        console.log("app.error..onEnter");
      },
      onExit: function(){
        console.log("app.error..onExit");
      }
    })

    /**
      * test
    **/
    /*
    .state('app.test', {
      url: '/test',
      views: {
        'menuContent': {
          templateUrl: 'templates/test.html',
          controller: 'TestCtrl'
        }
      },
      onEnter: function(){
        console.log("app.test..onEnter");
      },
      onExit: function(){
        console.log("app.test..onExit");
      }
    })
    .state('app.search', {
      url: '/search',
      views: {
        'menuContent': {
          templateUrl: 'templates/search.html'
        }
      }
    })
    */

    .state('app.start', {
      url: '/start',
      views: {
        'menuContent': {
          templateUrl: 'templates/start.html'
        }
      },
      onEnter: function(){
        console.log("app.start..onEnter");
      },
      onExit: function(){
        console.log("app.start..onExit");
      }
    })

    // if none of the above states are matched, use this as the fallback
    //$urlRouterProvider.otherwise('/app/playlists');
    $urlRouterProvider.otherwise('/app/start');
})
;
