angular.module('upark.share', ['upark', 'upark.filter'])

/**
.filter('myDate', function($filter) {
    var angularDateFilter = $filter('date');
    return function(theDate) {
       return angularDateFilter(theDate, 'dd MMMM @ HH:mm:ss');
    }
})

.controller('ShareDetailCtrl', function($scope, $stateParams, ItemService) {
  $scope.item = ItemService.get($stateParams.id);
})

.controller('ShareDetailCtrl', function($scope, $stateParams, $ionicPopup, $ionicHistory,
  UserService, CommonService,
  UparkService) {

  $scope.changeView = CommonService.changeView;
  $scope.user = UserService.user;
  $scope.upark_check_id = $stateParams.id;
  $scope.item = {};
  $scope.mode = {
    edit: false,
    guard_type: false,
    space_type: false,
    valet_type: false,
    disabled_type: false,
    allnight_type: false,
    holiday_type: false
  };

  UparkService.getItemByCheckId(
    $scope.user.id,
    $scope.upark_check_id,
    function(result){
      $scope.item = result;
      $scope.mode.guard_type = (result.guard_type == 1);
      $scope.mode.space_type = (result.space_type == 1);
      $scope.mode.valet_type = (result.valet_type == 1);
      $scope.mode.disabled_type = (result.disabled_type == 1);
      $scope.mode.allnight_type = (result.allnight_type == 1);
      $scope.mode.holiday_type = (result.holiday_type == 1);
    },
    function(result){
      console.log("error result: " + result);
    }
  );

  $scope.cancelItem = function(){
    UparkService.cancelItem(
      $scope.user.id,
      $scope.upark_id,
      function(result){
        console.log("success result: " + result);
        // msg
        var alertPopup = $ionicPopup.alert({
          title: '訊息',
          template: '已取消!! 謝謝'
        });
        alertPopup.then(function(res) {
          $ionicHistory.backView();
        });
      },
      function(result){
        console.log("error result: " + result);
        var alertPopup = $ionicPopup.alert({
          title: '訊息',
          template: '處理失敗, 請稍後再試'
        });
      }
    );
  }

  $scope.edit = function(){
    $scope.mode.edit = true;
  }

  $scope.cancelEdit = function(){
    $scope.mode.edit = false;
  }

  $scope.submitEdit = function(){
    var item = $scope.item;
    UparkService.updateItem(
      {
        "id": $scope.upark_check_id,
        "addr": item.addr,
        "descriptions_1": item.descriptions_1,
        "mobile": item.mobile,
        "email": item.email,
        "district": item.district,
        "remarks": item.remarks
      },
      function(result){
        console.log("success result: " + result);
        // msg
        var alertPopup = $ionicPopup.alert({
          title: '訊息',
          template: '更新完成!!'
        });
        $scope.mode.edit = false;
      },
      function(result){
        console.log("error result: " + result);
        var alertPopup = $ionicPopup.alert({
          title: '訊息',
          template: '更新失敗..oops'
        });
      }
    );
  }
})

**/

.controller('SharePendingCtrl', function($scope, $stateParams, $ionicPopup,
  UserService, CommonService,
  UparkCheckService) {

  $scope.changeView = CommonService.changeView;
  $scope.user = UserService.user;
  $scope.upark_check_id = $stateParams.id;
  $scope.item = {};
  $scope.mode = {
    edit: false
  };
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

  $scope.cancelItem = function(){
    UparkCheckService.cancelItem(
      $scope.user.id,
      $scope.upark_check_id,
      function(result){
        console.log("success result: " + result);
        // msg
        var alertPopup = $ionicPopup.alert({
          title: '訊息',
          template: '已取消!! 謝謝'
        });
        alertPopup.then(function(res) {
          $scope.changeView('/app/share-main');
        });
      },
      function(result){
        console.log("error result: " + result);
        var alertPopup = $ionicPopup.alert({
          title: '訊息',
          template: '處理失敗, 請稍後再試'
        });
      }
    );
  }

  $scope.edit = function(){
    $scope.mode.edit = true;
  }

  $scope.submitEdit = function(){
    var item = $scope.item;
    UparkCheckService.updateItem(
      {
        "id": $scope.upark_check_id,
        "addr": item.addr,
        "descriptions_1": item.descriptions_1,
        "photo_1": item.photo_1,
        "mobile": item.mobile,
        "email": item.email,
        "district": item.district,
        "remarks": item.remarks
      },
      function(result){
        console.log("success result: " + result);
        // msg
        var alertPopup = $ionicPopup.alert({
          title: '訊息',
          template: '更新完成!!'
        });
        $scope.mode.edit = false;
      },
      function(result){
        console.log("error result: " + result);
        var alertPopup = $ionicPopup.alert({
          title: '訊息',
          template: '更新失敗..oops'
        });
      }
    );
  }
})

.controller('ShareGroupPendingCtrl', function($scope, $stateParams, $ionicPopup,
  CameraUtil, FileUtil,
  UserService, CommonService,
  UparkCheckService) {

  $scope.changeView = CommonService.changeView;
  $scope.user = UserService.user;
  $scope.upark_check_id = $stateParams.id;
  $scope.item = {};
  $scope.mode = {
    edit: false
  };
  UparkCheckService.getItem(
    $scope.upark_check_id,
    function(result){
      $scope.item = result;
      $scope.item.progress = UparkCheckService.getProgressValue(result.status);
      console.log("success progress: " + $scope.item.progress);
      // number input bug @see http://stackoverflow.com/questions/19404969/angular-data-binding-input-type-number
      var stopWatchUparkCount = $scope.$watch('item.upark_count',function(val,old){
        $scope.item.upark_count = parseInt(val);
        stopWatchUparkCount();
      });
    },
    function(result){
      console.log("error result: " + result);
    }
  );

  $scope.uploadPhoto = function(){
    if(typeof $scope.imgURI == 'undefined'){
      console.log("imgURI not found..");
      return;
    }
    // do upload
    FileUtil.upload(
      $scope.imgURI,
      function successHandler(r) {
        console.log("Code = " + r.responseCode);
        console.log("Response = " + r.response);
        console.log("Sent = " + r.bytesSent);

        var obj = JSON.parse(r.response);
        $scope.item.photo_1 = obj.seq_no;

        console.log("seq_no: " + FileUtil.getPhotoPath($scope.item.photo_1));
      },
      function errorHandler(error) {
        console.log("An error has occurred: Code = " + error.code);
        console.log("upload error source " + error.source);
        console.log("upload error target " + error.target);
      },
      function(progressEvent) {
        if (progressEvent.lengthComputable) {
          console.log("progressEvent: " + progressEvent.loaded / progressEvent.total);
          //loadingStatus.setPercentage(progressEvent.loaded / progressEvent.total);
        } else {
          //loadingStatus.increment();
        }
      }
    );
  };
  $scope.takePhoto = function(){
    CameraUtil.takePhoto(
      function(imageData){
        $scope.imgURI = imageData; //$scope.imgURI = "data:image/jpeg;base64," + imageData;
        // auto upload
        $scope.uploadPhoto();
      });
  };
  $scope.choosePhoto = function(){
    CameraUtil.choosePhoto(
      function(imageData){
        $scope.imgURI = imageData; //$scope.imgURI = "data:image/jpeg;base64," + imageData;
        // auto upload
        $scope.uploadPhoto();
      });
  };

  $scope.cancelItem = function(){
    UparkCheckService.cancelItem(
      $scope.user.id,
      $scope.upark_check_id,
      function(result){
        console.log("success result: " + result);
        // msg
        var alertPopup = $ionicPopup.alert({
          title: '訊息',
          template: '已取消!! 謝謝'
        });
        alertPopup.then(function(res) {
          $scope.changeView('/app/share-group-main');
        });
      },
      function(result){
        console.log("error result: " + result);
        var alertPopup = $ionicPopup.alert({
          title: '訊息',
          template: '處理失敗, 請稍後再試'
        });
      }
    );
  }

  $scope.edit = function(){
    $scope.mode.edit = true;
  }

  $scope.cancelEdit = function(){
    //$scope.mode.edit = false;
    CommonService.reloadView();
    //console.log("cancelEdit..");
  }

  $scope.submitEdit = function(){
    var item = $scope.item;
    UparkCheckService.updateItem(
      {
        "id": $scope.upark_check_id,
        "addr": item.addr,
        "upark_count": item.upark_count,
        "descriptions_1": item.descriptions_1,
        "photo_1": item.photo_1,
        "mobile": item.mobile,
        "email": item.email,
        "district": item.district,
        "remarks": item.remarks
      },
      function(result){
        console.log("success result: " + result);
        // msg
        var alertPopup = $ionicPopup.alert({
          title: '訊息',
          template: '更新完成!!'
        });
        $scope.mode.edit = false;
      },
      function(result){
        console.log("error result: " + result);
        var alertPopup = $ionicPopup.alert({
          title: '訊息',
          template: '更新失敗..oops'
        });
      }
    );
  }
})

.controller('ShareCreateCtrl', function($scope, $ionicPopup,
  CameraUtil, FileUtil,
  UserService, CommonService, UparkCheckService) {
  $scope.changeView = CommonService.changeView;
  $scope.user = UserService.user;
  $scope.item = {};
  $scope.uploadPhoto = function(){
    if(typeof $scope.imgURI == 'undefined'){
      console.log("imgURI not found..");
      return;
    }
    // do upload
    FileUtil.upload(
      $scope.imgURI,
      function successHandler(r) {
        console.log("Code = " + r.responseCode);
        console.log("Response = " + r.response);
        console.log("Sent = " + r.bytesSent);

        var obj = JSON.parse(r.response);
        $scope.item.photo_1 = obj.seq_no;

        console.log("seq_no: " + FileUtil.getPhotoPath($scope.item.photo_1));
      },
      function errorHandler(error) {
        console.log("An error has occurred: Code = " + error.code);
        console.log("upload error source " + error.source);
        console.log("upload error target " + error.target);
      },
      function(progressEvent) {
        if (progressEvent.lengthComputable) {
          console.log("progressEvent: " + progressEvent.loaded / progressEvent.total);
          //loadingStatus.setPercentage(progressEvent.loaded / progressEvent.total);
        } else {
          //loadingStatus.increment();
        }
      }
    );
  };
  $scope.takePhoto = function(){
    CameraUtil.takePhoto(
      function(imageData){
        $scope.imgURI = imageData; //$scope.imgURI = "data:image/jpeg;base64," + imageData;
        // auto upload
        $scope.uploadPhoto();
      });
  };
  $scope.choosePhoto = function(){
    CameraUtil.choosePhoto(
      function(imageData){
        $scope.imgURI = imageData; //$scope.imgURI = "data:image/jpeg;base64," + imageData;
        // auto upload
        $scope.uploadPhoto();
      });
  };
  $scope.createItem = function(){
    var item = $scope.item;
    if(typeof item.photo_1 == 'undefined'){
      $ionicPopup.alert({
        title: '訊息',
        template: '請拍一張車位照片上傳，謝謝'
      });
      return;
    }
    // do create
    UparkCheckService.createItem(
      {
        "owner_id": $scope.user.id,
        "addr": item.addr,
        "descriptions_1": item.descriptions_1,
        "photo_1": item.photo_1,
        "mobile": item.mobile,
        "email": item.email
      },
      function(result){
        console.log("success result: " + result);
      },
      function(result){
        console.log("error result: " + result);
      }
    );
    // msg
    var alertPopup = $ionicPopup.alert({
      title: '訊息',
      template: 'UPark會盡快與您連絡，謝謝'
    });
    alertPopup.then(function(res) {
      $scope.changeView('/app/share-main');
    });
  };
})

.controller('ShareGroupCreateCtrl', function($scope, $ionicPopup,
  CameraUtil, FileUtil,
  UserService, CommonService, UparkCheckService) {
  $scope.changeView = CommonService.changeView;
  $scope.user = UserService.user;
  $scope.item = {};
  $scope.uploadPhoto = function(){
    if(typeof $scope.imgURI == 'undefined'){
      console.log("imgURI not found..");
      return;
    }
    // do upload
    FileUtil.upload(
      $scope.imgURI,
      function successHandler(r) {
        console.log("Code = " + r.responseCode);
        console.log("Response = " + r.response);
        console.log("Sent = " + r.bytesSent);

        var obj = JSON.parse(r.response);
        $scope.item.photo_1 = obj.seq_no;

        console.log("seq_no: " + FileUtil.getPhotoPath($scope.item.photo_1));
      },
      function errorHandler(error) {
        console.log("An error has occurred: Code = " + error.code);
        console.log("upload error source " + error.source);
        console.log("upload error target " + error.target);
      },
      function(progressEvent) {
        if (progressEvent.lengthComputable) {
          console.log("progressEvent: " + progressEvent.loaded / progressEvent.total);
          //loadingStatus.setPercentage(progressEvent.loaded / progressEvent.total);
        } else {
          //loadingStatus.increment();
        }
      }
    );
  };
  $scope.takePhoto = function(){
    CameraUtil.takePhoto(
      function(imageData){
        $scope.imgURI = imageData; //$scope.imgURI = "data:image/jpeg;base64," + imageData;
        // auto upload
        $scope.uploadPhoto();
      });
  };
  $scope.choosePhoto = function(){
    CameraUtil.choosePhoto(
      function(imageData){
        $scope.imgURI = imageData; //$scope.imgURI = "data:image/jpeg;base64," + imageData;
        // auto upload
        $scope.uploadPhoto();
      });
  };
  $scope.createItem = function(){
    var item = $scope.item;
    UparkCheckService.createDefaultGroupItem(
      {
        "owner_id": $scope.user.id,
        "addr": item.addr,
        "upark_count": item.upark_count,
        "descriptions_1": item.descriptions_1,
        "photo_1": item.photo_1,
        "mobile": item.mobile,
        "email": item.email
      },
      function(result){
        console.log("success result: " + result);
      },
      function(result){
        console.log("error result: " + result);
      }
    );
    // msg
    var alertPopup = $ionicPopup.alert({
      title: '訊息',
      template: 'UPark會盡快與您連絡，謝謝'
    });
    alertPopup.then(function(res) {
      $scope.changeView('/app/share-group-main');
    });
  };
})

.controller('ShareMainCtrl', function($scope, UserService, CommonService) {
  $scope.htmlStr = CommonService.htmlStr;
  $scope.changeView = CommonService.changeView;
  $scope.user = UserService.user;
})
;
