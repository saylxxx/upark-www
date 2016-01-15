angular.module('upark.share.admin', ['upark', 'ngMap'])

.controller('ShareAdminDetailCtrl', function($scope, $stateParams, $ionicPopup,
  AdminService, CommonService,
  UparkCheckService, UparkCheckAdminService) {

  $scope.changeView = CommonService.changeView;
  $scope.admin = AdminService.admin;
  $scope.upark_check_id = $stateParams.id;
  $scope.item = {};
  UparkCheckService.getItem(
    $scope.upark_check_id,
    function(result){
      $scope.item = result;
      $scope.item.progress = UparkCheckService.getProgressValue(result.status);
      console.log("success progress: " + $scope.item.progress);
    },
    function(result){
      console.log("error result: " + result);
    }
  );
})

.controller('ShareAdminResultCtrl', function($scope, $stateParams, $ionicPopup,
  AdminService, CommonService,
  UparkCheckService, UparkCheckAdminService) {

  $scope.changeView = CommonService.changeView;
  $scope.admin = AdminService.admin;
  $scope.upark_check_id = $stateParams.id;
  $scope.upark_check_log_id = $stateParams.log_id;
  $scope.item = {};
  UparkCheckService.getItemLog(
    $scope.upark_check_log_id,
    function(result){
      $scope.item = result;
      $scope.item.progress = UparkCheckService.getProgressValue(result.status);
      console.log("success progress: " + $scope.item.progress);
    },
    function(result){
      console.log("error result: " + result);
    }
  );

})

.controller('ShareAdminPendingCtrl', function($scope, $stateParams, $ionicPopup,
  AdminService, CommonService,
  UparkCheckService, UparkCheckAdminService) {

  $scope.changeView = CommonService.changeView;
  $scope.admin = AdminService.admin;
  $scope.upark_check_id = $stateParams.id;
  $scope.item = {};
  UparkCheckService.getItem(
    $scope.upark_check_id,
    function(result){
      $scope.item = result;
      $scope.item.progress = UparkCheckService.getProgressValue(result.status);
      console.log("success progress: " + $scope.item.progress);
    },
    function(result){
      console.log("error result: " + result);
    }
  );

  $scope.startCheck = function(){
    var confirmPopup = $ionicPopup.confirm({
      title: '訊息',
      template: '確定審核此車位?',
      cancelText: '取消', // String (default: 'Cancel'). The text of the Cancel button.
      cancelType: 'button-positive', // String (default: 'button-default'). The type of the Cancel button.
      okText: '確定', // String (default: 'OK'). The text of the OK button.
      okType: 'button-default' // String (default: 'button-positive'). The type of the OK button.
    });
    confirmPopup.then(function(res) {
      if(res) {
        console.log('You are sure');
        UparkCheckAdminService.setUparkCheckStart(
          $scope.admin.id,
          $scope.upark_check_id,
          function(result){
            console.log("success result: " + result);
            var alertPopup = $ionicPopup.alert({
              title: '訊息',
              template: '此車位已新增至您的審核項目，謝謝'
            });
            alertPopup.then(function(res) {
              $scope.changeView('/app/admin-main');
            });
          },
          function(result){
            console.log("error result: " + result);
            var alertPopup = $ionicPopup.alert({
              title: '訊息',
              template: '發生錯誤了, 請稍後再試'
            });
          }
        );
      } else {
        console.log('You are not sure');
      }
    });
  }
})

.controller('ShareAdminCtrl', function($scope, $stateParams, $ionicPopup,
  AdminService, CommonService,
  UparkCheckService, UparkCheckAdminService) {

  $scope.changeView = CommonService.changeView;
  $scope.admin = AdminService.admin;
  $scope.upark_check_id = $stateParams.id;
  $scope.upark_check_log_id = $stateParams.log_id;
  $scope.upark_type = $stateParams.upark_type;
  $scope.item = {};
  UparkCheckService.getItemLog(
    $scope.upark_check_log_id,
    function(result){
      $scope.item = result;
      $scope.item.progress = UparkCheckService.getProgressValue(result.status);
      console.log("success progress: " + $scope.item.progress);
    },
    function(result){
      console.log("error result: " + result);
    }
  );

  $scope.checkOk = function(){
    AdminService.changeViewAdminConfirm($scope.upark_type, $scope.upark_check_id, $scope.upark_check_log_id);
  }

  $scope.checkKo = function(){
    AdminService.changeViewAdminDecline($scope.upark_type, $scope.upark_check_id, $scope.upark_check_log_id);
  }
})

.controller('ShareAdminDeclineCtrl', function($scope, $state, $stateParams, $ionicPopup,
  AdminService, CommonService,
  UparkCheckService, UparkCheckAdminService) {

  $scope.changeView = CommonService.changeView;
  $scope.admin = AdminService.admin;
  $scope.upark_check_id = $stateParams.id;
  $scope.upark_check_log_id = $stateParams.log_id;
  $scope.upark_type = $stateParams.upark_type;
  $scope.item = {};
  UparkCheckService.getItemLog(
    $scope.upark_check_log_id,
    function(result){
      $scope.item = result;
      $scope.item.progress = UparkCheckService.getProgressValue(result.status);
      //console.log("success progress: " + $scope.item.progress);
    },
    function(result){
      console.log("error result: " + result);
    }
  );

  $scope.cancel = function(){
    AdminService.changeViewAdminCancel($scope.upark_type, $scope.upark_check_id, $scope.upark_check_log_id);
  }

  $scope.checkKo = function(){
      var confirmPopup = $ionicPopup.confirm({
        title: '訊息',
        template: '審核不通過嗎?',
        cancelText: '取消', // String (default: 'Cancel'). The text of the Cancel button.
        cancelType: 'button-positive', // String (default: 'button-default'). The type of the Cancel button.
        okText: '審核不通過', // String (default: 'OK'). The text of the OK button.
        okType: 'button-default' // String (default: 'button-positive'). The type of the OK button.
      });
      confirmPopup.then(function(res) {
        if(res) {
          console.log('You are sure');
          UparkCheckAdminService.setUparkCheckKo(
            $scope.admin.id,
            $scope.upark_check_log_id,
            $scope.item.report,
            function(result){
              console.log("success result: " + result);
              var alertPopup = $ionicPopup.alert({
                title: '訊息',
                template: '審核不通過，完成'
              });
              alertPopup.then(function(res) {
                CommonService.changeViewNoBack('/app/admin-log');
              });
            },
            function(result){
              console.log("error result: " + result);
              var alertPopup = $ionicPopup.alert({
                title: '訊息',
                template: '發生錯誤了, 請稍後再試'
              });
            }
          );
        } else {
          console.log('You are not sure');
        }
      });
  }
})

.controller('ShareAdminConfirmCtrl', function($scope, $stateParams, $ionicPopup,
  AdminService, CommonService,
  UparkCheckService, UparkCheckAdminService,
  StateService, GeoService, MapService) {

  $scope.changeView = CommonService.changeView;
  $scope.admin = AdminService.admin;
  $scope.upark_check_id = $stateParams.id;
  $scope.upark_check_log_id = $stateParams.log_id;
  $scope.upark_type = $stateParams.upark_type;
  $scope.item = {};
  UparkCheckService.getItemLog(
    $scope.upark_check_log_id,
    function(result){
      $scope.item = result;
      $scope.item.progress = UparkCheckService.getProgressValue(result.status);
      console.log("success progress: " + $scope.item.progress);
    },
    function(result){
      console.log("error result: " + result);
    }
  );

  $scope.$on('mapInitialized', function(event, evtMap) {
    // init
    MapService.setMap(evtMap);
  });

  /**
  // tmp solution for autocomplete
  $scope.disableTap = function(){
    container = document.getElementsByClassName('pac-container');
    // disable ionic data tab
    angular.element(container).attr('data-tap-disabled', 'true');
    // leave input field if google-address-entry is selected
    angular.element(container).on("click", function(){
        document.getElementById('addrInput').blur();
    });
  };

  $scope.placeChanged = function() {
    $scope.place = this.getPlace();
    $scope.lat = $scope.place.geometry.location.lat();
    $scope.lng = $scope.place.geometry.location.lng();
    var map = MapService.getMap();
    var next = new google.maps.LatLng($scope.lat,$scope.lng);
    map.setCenter(next);
    map.setZoom(18);

    // log
    MapService.pushHistory(next);
    console.log("history: " + MapService.getHistory());
  }
  **/

  $scope.cancel = function(){
    AdminService.changeViewAdminCancel($scope.upark_type, $scope.upark_check_id, $scope.upark_check_log_id);
  }

  $scope.gps = function(){
    // check gps
    if(StateService.checkLocation()){
      // get location
      GeoService.allInOne($scope, function(result){
        var latLng = GeoService.currentLatLng();
        $scope.item.latitude = latLng.lat();
        $scope.item.longitude = latLng.lng();
        // update everything
        $scope.$digest();
      });
    }
  }

  $scope.checkOk = function(){
    var map = MapService.getMap();
    var mapCenter = map.getCenter();
    var confirmPopup = $ionicPopup.confirm({
      title: '訊息',
      template: '審核通過嗎?',
      cancelText: '取消', // String (default: 'Cancel'). The text of the Cancel button.
      cancelType: 'button-positive', // String (default: 'button-default'). The type of the Cancel button.
      okText: '審核通過', // String (default: 'OK'). The text of the OK button.
      okType: 'button-default' // String (default: 'button-positive'). The type of the OK button.
    });
    confirmPopup.then(function(res) {
      if(res) {
        console.log('You are sure');
        UparkCheckAdminService.setUparkCheckOk(
          {
            "id": $scope.admin.id,
            "log_id": $scope.upark_check_log_id,
            "report": $scope.item.report,
            "addr_lng": mapCenter.lng(),
            "addr_lat": mapCenter.lat(),
            "longitude": $scope.item.longitude,
            "latitude": $scope.item.latitude
          },
          function(result){
            console.log("success result: " + result);
            var alertPopup = $ionicPopup.alert({
              title: '訊息',
              template: '審核通過，完成'
            });
            alertPopup.then(function(res) {
              CommonService.changeViewNoBack('/app/admin-log');
            });
          },
          function(result){
            console.log("error result: " + result);
            var alertPopup = $ionicPopup.alert({
              title: '訊息',
              template: '發生錯誤了, 請稍後再試'
            });
          }
        );
      } else {
        console.log('You are not sure');
      }
    });
  }
})

.controller('ShareAdminGroupConfirmCtrl', function($scope, $stateParams, $ionicPopup,
  AdminService, CommonService,
  UparkCheckService, UparkCheckAdminService,
  MapService) {

  $scope.changeView = CommonService.changeView;
  $scope.admin = AdminService.admin;
  $scope.upark_check_id = $stateParams.id;
  $scope.upark_check_log_id = $stateParams.log_id;
  $scope.upark_type = $stateParams.upark_type;
  $scope.item = {};
  UparkCheckService.getItemLog(
    $scope.upark_check_log_id,
    function(result){
      $scope.item = result;
      $scope.item.progress = UparkCheckService.getProgressValue(result.status);
      console.log("success progress: " + $scope.item.progress);
    },
    function(result){
      console.log("error result: " + result);
    }
  );

  $scope.$on('mapInitialized', function(event, evtMap) {
    // init
    MapService.setMap(evtMap);
  });

  $scope.cancel = function(){
    AdminService.changeViewAdminCancel($scope.upark_type, $scope.upark_check_id, $scope.upark_check_log_id);
  }

  $scope.checkOk = function(){
    var map = MapService.getMap();
    var mapCenter = map.getCenter();
    var confirmPopup = $ionicPopup.confirm({
      title: '訊息',
      template: '審核通過嗎?',
      cancelText: '取消', // String (default: 'Cancel'). The text of the Cancel button.
      cancelType: 'button-positive', // String (default: 'button-default'). The type of the Cancel button.
      okText: '審核通過', // String (default: 'OK'). The text of the OK button.
      okType: 'button-default' // String (default: 'button-positive'). The type of the OK button.
    });
    confirmPopup.then(function(res) {
      if(res) {
        console.log('You are sure');
        UparkCheckAdminService.setUparkCheckGroupOk(
          {
            "id": $scope.admin.id,
            "log_id": $scope.upark_check_log_id,
            "report": $scope.item.report,
            "addr_lng": mapCenter.lng(),
            "addr_lat": mapCenter.lat()
          },
          function(result){
            console.log("success result: " + result);
            var alertPopup = $ionicPopup.alert({
              title: '訊息',
              template: '審核通過，完成'
            });
            alertPopup.then(function(res) {
              CommonService.changeViewNoBack('/app/admin-log');
            });
          },
          function(result){
            console.log("error result: " + result);
            var alertPopup = $ionicPopup.alert({
              title: '訊息',
              template: '發生錯誤了, 請稍後再試'
            });
          }
        );
      } else {
        console.log('You are not sure');
      }
    });
  }
})
