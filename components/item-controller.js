angular.module('upark.item', ['ionic-timepicker',
  'upark', 'upark.filter'])

  .controller('UparkItemGroupCtrl', function($scope, $stateParams, $ionicPopup, $ionicHistory,
    CameraUtil, FileUtil,
    UserService, CommonService, LaunchNavigator,
    UparkGroupService, DBConfig, DBParse) {

    $scope.changeView = CommonService.changeView;
    $scope.user = UserService.user;
    $scope.upark_group_id = $stateParams.id;
    $scope.item = {};
    $scope.chargeBtnCss = { // 收費方式,0:未設定,1:每小時扣點
      '0' : 'button button-outline button-stable',
      '1' : 'button button-outline button-assertive'
    };
    $scope.mode = {
      edit: false,
      updated: false,
      guard_type: false,
      space_type: false,
      valet_type: false,
      disabled_type: false,
      allnight_type: false,
      holiday_type: false,
      css: {
        setStatusBtn: "",
        setChargeBtn: ""
      },
      timeSelected: "",
      timePickerObject: {
        //inputEpochTime: ((new Date()).getHours() * 60 * 60),  //Optional
        step: 15,  //Optional
        format: 12,  //Optional
        titleLabel: '12小時制',  //Optional
        setLabel: '確定',  //Optional
        closeLabel: '取消',  //Optional
        //setButtonType: 'button-positive',  //Optional
        //closeButtonType: 'button-stable',  //Optional
        callback: function (val) {
          //console.log("$scope.item.start_time_1: " + $scope.item.start_time_1);
          //console.log("$scope.item.start_time_1 parse: " + Date.parse($scope.item.start_time_1));
          if (typeof (val) === 'undefined') {
            console.log('Time not selected');
          } else {
            var selectedTime = new Date(val * 1000);
            console.log('Selected epoch is : ', val, 'and the time is ', selectedTime.getUTCHours(), ':', selectedTime.getUTCMinutes(), 'in UTC');
            //console.log("timeSelected: " + $scope.mode.timeSelected);

            $scope.item[$scope.mode.timeSelected] = DBParse.timeValue2MysqlTime(val);
          }
        }
      }
    };

    $scope.timeSelectedSwitch = function(selected){
      $scope.mode.timeSelected = selected;
      console.log("timeSelectedSwitch: " + $scope.mode.timeSelected);
      var val = DBParse.mysqlTime2TimeValue($scope.item[$scope.mode.timeSelected]);
      if(val > 0){
        $scope.mode.timePickerObject.inputEpochTime = val;
      }else{
        $scope.mode.timePickerObject.inputEpochTime = ((new Date()).getHours() * 60 * 60);
      }
    }

    $scope.timeClearAll = function(start_time, end_time){
      $scope.item[start_time] = null;
      $scope.item[end_time] = null;
    }

    UparkGroupService.getItem(
      $scope.user.id,
      $scope.upark_group_id,
      function(result){
        $scope.item = result;

        //console.log("update_time:" + result.update_time + ", check: " + isNaN(Date.parse(result.update_time)));
        //console.log("create_time:" + result.create_time + ", check: " + isNaN(Date.parse(result.create_time)));

        $scope.mode.updated = isNaN(Date.parse(result.update_time));
        $scope.mode.guard_type = (result.guard_type == DBConfig.upark_group.guard_type.normal);
        $scope.mode.space_type = (result.space_type == DBConfig.upark_group.space_type.normal);
        $scope.mode.valet_type = (result.valet_type == DBConfig.upark_group.valet_type.normal);
        $scope.mode.disabled_type = (result.disabled_type == DBConfig.upark_group.disabled_type.normal);
        $scope.mode.allnight_type = (result.allnight_type == DBConfig.upark_group.allnight_type.normal);
        $scope.mode.holiday_type = (result.holiday_type == DBConfig.upark_group.holiday_type.normal);
        //$scope.mode.status = (result.status !== 4);
        $scope.resetModeStatus();
        $scope.resetModeCharge();

        // number input bug @see http://stackoverflow.com/questions/19404969/angular-data-binding-input-type-number
        // about watch      @see http://stackoverflow.com/questions/15715672/how-do-i-stop-watching-in-angularjs
        var stopWatchMaxHeight = $scope.$watch('item.max_height',function(val,old){
          $scope.item.max_height = parseInt(val);
          stopWatchMaxHeight();
        });
        var stopWatchMaxWidth = $scope.$watch('item.max_width',function(val,old){
          $scope.item.max_width = parseInt(val);
          stopWatchMaxWidth();
        });
        var stopWatchMaxLength = $scope.$watch('item.max_length',function(val,old){
          $scope.item.max_length = parseInt(val);
          stopWatchMaxLength();
        });

        /**
        console.log("test--- start");
        console.log("start_time_0: " + $scope.item.start_time_0 + ", parse: " + Date.parse($scope.item.start_time_0));
        console.log("end_time_0: " + $scope.item.end_time_0 + ", parse: " + Date.parse($scope.item.end_time_0));
        console.log("start_time_1: " + $scope.item.start_time_1 + ", parse: " + Date.parse($scope.item.start_time_1));
        console.log("end_time_1: " + $scope.item.end_time_1 + ", parse: " + Date.parse($scope.item.end_time_1));

        var t = $scope.item.start_time_1.split(/[- :]/);
        var d = new Date("", "", "", t[0], t[1], t[2]);
        var d0 = new Date("", "", "", "", "", "");
        console.log("test---d: " + d.getTime() + ", d0: " + d0.getTime() + ", (d-d0) / 1000: " + (d.getTime() - d0.getTime())/1000);
        **/
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

    $scope.resetModeCharge = function(){
      $scope.mode.css.setChargeBtn = $scope.chargeBtnCss[$scope.item.charge_type];
      $scope.mode.charge = !($scope.item.charge_type == DBConfig.upark_group.charge_type.none);
      //console.log("initModeCharge..item.charge_type: " + $scope.item.charge_type);
      //console.log("initModeCharge..mode.charge: " + $scope.mode.charge);
    }

    $scope.toggleCharge = function(){
      if($scope.item.charge_type == DBConfig.upark_group.charge_type.none){
        $scope.item.charge_type = DBConfig.upark_group.charge_type.hourly;
      }else{
        $scope.item.charge_type = DBConfig.upark_group.charge_type.none;
      }
      $scope.resetModeCharge();
    }

    $scope.resetModeStatus = function(){
      $scope.mode.status = !($scope.item.status == DBConfig.upark_group.status.closed);
      //console.log("initModeStatus..item.status: " + $scope.item.status);
      //console.log("initModeStatus..mode.status: " + $scope.mode.status);
    }

    $scope.toggleStatus = function(){
      if($scope.item.status == DBConfig.upark_group.status.closed){
        UparkGroupService.startShare(
          {
            "user_id": $scope.user.id,
            "group_id": $scope.item.upark_group_id
          },
          function(result){
            // msg
            var alertPopup = $ionicPopup.alert({
              title: '訊息',
              template: '已設為開放!! 謝謝'
            });
            $scope.item.status = DBConfig.upark_group.status.valid;
          },
          function(result){
            console.log("error result: " + result);
            var alertPopup = $ionicPopup.alert({
              title: '訊息',
              template: '處理失敗, 請稍後再試'
            });
            $scope.resetModeStatus();
          }
        );
      }else{
        UparkGroupService.stopShare(
          {
            "user_id": $scope.user.id,
            "group_id": $scope.item.upark_group_id
          },
          function(result){
            // msg
            var alertPopup = $ionicPopup.alert({
              title: '訊息',
              template: '已關閉!! 謝謝'
            });
            $scope.item.status = DBConfig.upark_group.status.closed;
          },
          function(result){
            var alertPopup = $ionicPopup.alert({
              title: '訊息',
              template: '處理失敗, 請稍後再試'
            });
            $scope.resetModeStatus();
          }
        );
      }
    }

    $scope.edit = function(){
      $scope.mode.edit = true;
    }

    $scope.cancelEdit = function(){
      //$scope.mode.edit = false;
      CommonService.reloadView();
    }

    $scope.submitEdit = function(){
      var item = $scope.item;

      //console.log("guard_type: " + ($scope.mode.guard_type ? 1:0));
      //console.log("space_type: " + ($scope.mode.space_type ? 1:0));

      UparkGroupService.updateItem(
        {
          "group_id": item.upark_group_id,
          //"addr": item.addr, // 不給改
          "district": item.district,
          "descriptions_1": item.descriptions_1,
          "descriptions_2": item.descriptions_2,
          "photo_1": item.photo_1,
          "max_height": item.max_height,
          "max_width": item.max_width,
          "max_length": item.max_length,
          "mobile": item.mobile,
          "email": item.email,
          "guard_type" : ($scope.mode.guard_type ? DBConfig.upark_group.guard_type.normal:DBConfig.upark_group.guard_type.none),
          "space_type" : ($scope.mode.space_type ? DBConfig.upark_group.space_type.normal:DBConfig.upark_group.space_type.none),
          "valet_type" : ($scope.mode.valet_type ? DBConfig.upark_group.valet_type.normal:DBConfig.upark_group.valet_type.none),
          "disabled_type" : ($scope.mode.disabled_type ? DBConfig.upark_group.disabled_type.normal:DBConfig.upark_group.disabled_type.none),
          "allnight_type" : ($scope.mode.allnight_type ? DBConfig.upark_group.allnight_type.normal:DBConfig.upark_group.allnight_type.none),
          "holiday_type" : ($scope.mode.holiday_type ? DBConfig.upark_group.holiday_type.normal:DBConfig.upark_group.holiday_type.none),
          "remarks": item.remarks,
          "charge_price": item.charge_price,
          "charge_type": item.charge_type,
          "start_time_0": item.start_time_0, "end_time_0": item.end_time_0,
          "start_time_1": item.start_time_1, "end_time_1": item.end_time_1,
          "start_time_2": item.start_time_2, "end_time_2": item.end_time_2,
          "start_time_3": item.start_time_3, "end_time_3": item.end_time_3,
          "start_time_4": item.start_time_4, "end_time_4": item.end_time_4,
          "start_time_5": item.start_time_5, "end_time_5": item.end_time_5,
          "start_time_6": item.start_time_6, "end_time_6": item.end_time_6
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


.controller('UparkItemCtrl', function($scope, $stateParams, $ionicPopup, $ionicHistory,
  CameraUtil, FileUtil,
  UserService, CommonService, LaunchNavigator,
  UparkService, DBConfig, DBParse) {

  $scope.changeView = CommonService.changeView;
  $scope.user = UserService.user;
  $scope.upark_id = $stateParams.id;
  $scope.item = {};
  $scope.chargeBtnCss = { // 收費方式,0:未設定,1:每小時扣點
    '0' : 'button button-outline button-stable',
    '1' : 'button button-outline button-assertive'
  };
  $scope.mode = {
    edit: false,
    updated: false,
    guard_type: false,
    space_type: false,
    valet_type: false,
    disabled_type: false,
    allnight_type: false,
    holiday_type: false,
    css: {
      setStatusBtn: "",
      setChargeBtn: ""
    },
    timeSelected: "",
    timePickerObject: {
      //inputEpochTime: ((new Date()).getHours() * 60 * 60),  //Optional
      step: 15,  //Optional
      format: 12,  //Optional
      titleLabel: '12小時制',  //Optional
      setLabel: '確定',  //Optional
      closeLabel: '取消',  //Optional
      //setButtonType: 'button-positive',  //Optional
      //closeButtonType: 'button-stable',  //Optional
      callback: function (val) {
        //console.log("$scope.item.start_time_1: " + $scope.item.start_time_1);
        //console.log("$scope.item.start_time_1 parse: " + Date.parse($scope.item.start_time_1));
        if (typeof (val) === 'undefined') {
          console.log('Time not selected');
        } else {
          var selectedTime = new Date(val * 1000);
          console.log('Selected epoch is : ', val, 'and the time is ', selectedTime.getUTCHours(), ':', selectedTime.getUTCMinutes(), 'in UTC');
          //console.log("timeSelected: " + $scope.mode.timeSelected);

          $scope.item[$scope.mode.timeSelected] = DBParse.timeValue2MysqlTime(val);
        }
      }
    }
  };

  $scope.timeSelectedSwitch = function(selected){
    $scope.mode.timeSelected = selected;
    console.log("timeSelectedSwitch: " + $scope.mode.timeSelected);
    var val = DBParse.mysqlTime2TimeValue($scope.item[$scope.mode.timeSelected]);
    if(val > 0){
      $scope.mode.timePickerObject.inputEpochTime = val;
    }else{
      $scope.mode.timePickerObject.inputEpochTime = ((new Date()).getHours() * 60 * 60);
    }
  }

  $scope.timeClearAll = function(start_time, end_time){
    $scope.item[start_time] = null;
    $scope.item[end_time] = null;
  }

  UparkService.getItem(
    $scope.user.id,
    $scope.upark_id,
    function(result){
      $scope.item = result;

      //console.log("update_time:" + result.update_time + ", check: " + isNaN(Date.parse(result.update_time)));
      //console.log("create_time:" + result.create_time + ", check: " + isNaN(Date.parse(result.create_time)));

      $scope.mode.updated = isNaN(Date.parse(result.update_time));
      $scope.mode.guard_type = (result.guard_type == DBConfig.upark.guard_type.normal);
      $scope.mode.space_type = (result.space_type == DBConfig.upark.space_type.normal);
      $scope.mode.valet_type = (result.valet_type == DBConfig.upark.valet_type.normal);
      $scope.mode.disabled_type = (result.disabled_type == DBConfig.upark.disabled_type.normal);
      $scope.mode.allnight_type = (result.allnight_type == DBConfig.upark.allnight_type.normal);
      $scope.mode.holiday_type = (result.holiday_type == DBConfig.upark.holiday_type.normal);
      //$scope.mode.status = (result.status !== 4);
      $scope.resetModeStatus();
      $scope.resetModeCharge();

      // number input bug @see http://stackoverflow.com/questions/19404969/angular-data-binding-input-type-number
      // about watch      @see http://stackoverflow.com/questions/15715672/how-do-i-stop-watching-in-angularjs
      var stopWatchMaxHeight = $scope.$watch('item.max_height',function(val,old){
        $scope.item.max_height = parseInt(val);
        stopWatchMaxHeight();
      });
      var stopWatchMaxWidth = $scope.$watch('item.max_width',function(val,old){
        $scope.item.max_width = parseInt(val);
        stopWatchMaxWidth();
      });
      var stopWatchMaxLength = $scope.$watch('item.max_length',function(val,old){
        $scope.item.max_length = parseInt(val);
        stopWatchMaxLength();
      });

      /**
      console.log("test--- start");
      console.log("start_time_0: " + $scope.item.start_time_0 + ", parse: " + Date.parse($scope.item.start_time_0));
      console.log("end_time_0: " + $scope.item.end_time_0 + ", parse: " + Date.parse($scope.item.end_time_0));
      console.log("start_time_1: " + $scope.item.start_time_1 + ", parse: " + Date.parse($scope.item.start_time_1));
      console.log("end_time_1: " + $scope.item.end_time_1 + ", parse: " + Date.parse($scope.item.end_time_1));

      var t = $scope.item.start_time_1.split(/[- :]/);
      var d = new Date("", "", "", t[0], t[1], t[2]);
      var d0 = new Date("", "", "", "", "", "");
      console.log("test---d: " + d.getTime() + ", d0: " + d0.getTime() + ", (d-d0) / 1000: " + (d.getTime() - d0.getTime())/1000);
      **/
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

  $scope.resetModeCharge = function(){
    $scope.mode.css.setChargeBtn = $scope.chargeBtnCss[$scope.item.charge_type];
    $scope.mode.charge = !($scope.item.charge_type == DBConfig.upark.charge_type.none);
    //console.log("initModeCharge..item.charge_type: " + $scope.item.charge_type);
    //console.log("initModeCharge..mode.charge: " + $scope.mode.charge);
  }

  $scope.toggleCharge = function(){
    if($scope.item.charge_type == DBConfig.upark.charge_type.none){
      $scope.item.charge_type = DBConfig.upark.charge_type.hourly;
    }else{
      $scope.item.charge_type = DBConfig.upark.charge_type.none;
    }
    $scope.resetModeCharge();
  }

  $scope.resetModeStatus = function(){
    $scope.mode.status = !($scope.item.status == DBConfig.upark.status.closed);
    //console.log("initModeStatus..item.status: " + $scope.item.status);
    //console.log("initModeStatus..mode.status: " + $scope.mode.status);
  }

  $scope.toggleStatus = function(){
    if($scope.item.status == DBConfig.upark.status.closed){
      UparkService.startShare(
        {
          "user_id": $scope.user.id,
          "upark_id": $scope.item.upark_id
        },
        function(result){
          // msg
          var alertPopup = $ionicPopup.alert({
            title: '訊息',
            template: '已設為開放!! 謝謝'
          });
          $scope.item.status = DBConfig.upark.status.valid;
        },
        function(result){
          console.log("error result: " + result);
          var alertPopup = $ionicPopup.alert({
            title: '訊息',
            template: '處理失敗, 請稍後再試'
          });
          $scope.resetModeStatus();
        }
      );
    }else{
      UparkService.stopShare(
        {
          "user_id": $scope.user.id,
          "upark_id": $scope.item.upark_id
        },
        function(result){
          // msg
          var alertPopup = $ionicPopup.alert({
            title: '訊息',
            template: '已關閉!! 謝謝'
          });
          $scope.item.status = DBConfig.upark.status.closed;
        },
        function(result){
          var alertPopup = $ionicPopup.alert({
            title: '訊息',
            template: '處理失敗, 請稍後再試'
          });
          $scope.resetModeStatus();
        }
      );
    }
  }

  $scope.edit = function(){
    $scope.mode.edit = true;
  }

  $scope.cancelEdit = function(){
    //$scope.mode.edit = false;
    CommonService.reloadView();
  }

  $scope.submitEdit = function(){
    var item = $scope.item;

    //console.log("guard_type: " + ($scope.mode.guard_type ? 1:0));
    //console.log("space_type: " + ($scope.mode.space_type ? 1:0));

    UparkService.updateItem(
      {
        "upark_id": item.upark_id,
        //"addr": item.addr, // 不給改
        "district": item.district,
        "descriptions_1": item.descriptions_1,
        "descriptions_2": item.descriptions_2,
        "photo_1": item.photo_1,
        "max_height": item.max_height,
        "max_width": item.max_width,
        "max_length": item.max_length,
        "mobile": item.mobile,
        "email": item.email,
        "guard_type" : ($scope.mode.guard_type ? DBConfig.upark.guard_type.normal:DBConfig.upark.guard_type.none),
        "space_type" : ($scope.mode.space_type ? DBConfig.upark.space_type.normal:DBConfig.upark.space_type.none),
        "valet_type" : ($scope.mode.valet_type ? DBConfig.upark.valet_type.normal:DBConfig.upark.valet_type.none),
        "disabled_type" : ($scope.mode.disabled_type ? DBConfig.upark.disabled_type.normal:DBConfig.upark.disabled_type.none),
        "allnight_type" : ($scope.mode.allnight_type ? DBConfig.upark.allnight_type.normal:DBConfig.upark.allnight_type.none),
        "holiday_type" : ($scope.mode.holiday_type ? DBConfig.upark.holiday_type.normal:DBConfig.upark.holiday_type.none),
        "remarks": item.remarks,
        "charge_price": item.charge_price,
        "charge_type": item.charge_type,
        "start_time_0": item.start_time_0, "end_time_0": item.end_time_0,
        "start_time_1": item.start_time_1, "end_time_1": item.end_time_1,
        "start_time_2": item.start_time_2, "end_time_2": item.end_time_2,
        "start_time_3": item.start_time_3, "end_time_3": item.end_time_3,
        "start_time_4": item.start_time_4, "end_time_4": item.end_time_4,
        "start_time_5": item.start_time_5, "end_time_5": item.end_time_5,
        "start_time_6": item.start_time_6, "end_time_6": item.end_time_6
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

/*
.controller('UparkItemViewCtrl', function($scope, $stateParams, $ionicPopup, $ionicHistory,
  UserService, CommonService,
  UparkService, DBConfig, DBParse) {
  $scope.changeView = CommonService.changeView;
  $scope.user = UserService.user;
  $scope.upark_id = $stateParams.id;
  $scope.item = {};
  $scope.chargeBtnCss = { // 收費方式,0:未設定,1:每小時扣點
    '0' : 'button button-outline button-stable',
    '1' : 'button button-outline button-assertive'
  };
  $scope.mode = {
    edit: false,
    updated: false,
    guard_type: false,
    space_type: false,
    valet_type: false,
    disabled_type: false,
    allnight_type: false,
    holiday_type: false,
    css: {
      setStatusBtn: "",
      setChargeBtn: ""
    },
    timeSelected: "",
    timePickerObject: {
      //inputEpochTime: ((new Date()).getHours() * 60 * 60),  //Optional
      step: 15,  //Optional
      format: 12,  //Optional
      titleLabel: '12小時制',  //Optional
      setLabel: '確定',  //Optional
      closeLabel: '取消',  //Optional
      //setButtonType: 'button-positive',  //Optional
      //closeButtonType: 'button-stable',  //Optional
      callback: function (val) {
        //console.log("$scope.item.start_time_1: " + $scope.item.start_time_1);
        //console.log("$scope.item.start_time_1 parse: " + Date.parse($scope.item.start_time_1));
        if (typeof (val) === 'undefined') {
          console.log('Time not selected');
        } else {
          var selectedTime = new Date(val * 1000);
          console.log('Selected epoch is : ', val, 'and the time is ', selectedTime.getUTCHours(), ':', selectedTime.getUTCMinutes(), 'in UTC');
          //console.log("timeSelected: " + $scope.mode.timeSelected);

          $scope.item[$scope.mode.timeSelected] = DBParse.timeValue2MysqlTime(val);
        }
      }
    }
  };

  UparkService.getItem(
    $scope.user.id,
    $scope.upark_id,
    function(result){
      $scope.item = result;

      //console.log("update_time:" + result.update_time + ", check: " + isNaN(Date.parse(result.update_time)));
      //console.log("create_time:" + result.create_time + ", check: " + isNaN(Date.parse(result.create_time)));
      $scope.mode.updated = isNaN(Date.parse(result.update_time));
      $scope.mode.guard_type = (result.guard_type == DBConfig.upark.guard_type.normal);
      $scope.mode.space_type = (result.space_type == DBConfig.upark.space_type.normal);
      $scope.mode.valet_type = (result.valet_type == DBConfig.upark.valet_type.normal);
      $scope.mode.disabled_type = (result.disabled_type == DBConfig.upark.disabled_type.normal);
      $scope.mode.allnight_type = (result.allnight_type == DBConfig.upark.allnight_type.normal);
      $scope.mode.holiday_type = (result.holiday_type == DBConfig.upark.holiday_type.normal);
      //$scope.mode.status = (result.status !== 4);
      $scope.resetModeStatus();
      $scope.resetModeCharge();

      // number input bug @see http://stackoverflow.com/questions/19404969/angular-data-binding-input-type-number
      // about watch      @see http://stackoverflow.com/questions/15715672/how-do-i-stop-watching-in-angularjs
      var stopWatchMaxHeight = $scope.$watch('item.max_height',function(val,old){
        $scope.item.max_height = parseInt(val);
        stopWatchMaxHeight();
      });
      var stopWatchMaxWidth = $scope.$watch('item.max_width',function(val,old){
        $scope.item.max_width = parseInt(val);
        stopWatchMaxWidth();
      });
      var stopWatchMaxLength = $scope.$watch('item.max_length',function(val,old){
        $scope.item.max_length = parseInt(val);
        stopWatchMaxLength();
      });
    },
    function(result){
      console.log("error result: " + result);
    }
  );

  $scope.resetModeCharge = function(){
    $scope.mode.css.setChargeBtn = $scope.chargeBtnCss[$scope.item.charge_type];
    $scope.mode.charge = !($scope.item.charge_type == DBConfig.upark.charge_type.none);
    //console.log("initModeCharge..item.charge_type: " + $scope.item.charge_type);
    //console.log("initModeCharge..mode.charge: " + $scope.mode.charge);
  }

  $scope.resetModeStatus = function(){
    $scope.mode.status = !($scope.item.status == DBConfig.upark.status.closed);
    //console.log("initModeStatus..item.status: " + $scope.item.status);
    //console.log("initModeStatus..mode.status: " + $scope.mode.status);
  }

})
*/
