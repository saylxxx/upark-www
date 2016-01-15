angular.module('upark')

// cancel edit
.directive('cancelEdit', ['CommonService', function(CommonService){
  function link(scope, element, attrs) {
    element.on('click', function(event) {
      event.preventDefault();
      CommonService.reloadView();
    });
  }
  return {
    restrict: 'AE',
    templateUrl: 'templates/form/cancel-edit-directive.html',
    link: link
  }
}])

// applytime
.directive('applytimeView', function() {
  return {
    restrict: 'AE',
    scope: {
      item: '=model'
    },
    templateUrl: 'templates/form/applytime-view-directive.html'
  };
})

// charge
.directive('chargeView', function() {
  return {
    restrict: 'AE',
    scope: {
      item: '=model'
    },
    templateUrl: 'templates/form/charge-view-directive.html'
  };
})
.directive('chargeInput', ['DBConfig', function(DBConfig){
  function link(scope, element, attrs) {
    scope.toggleCharge = function(){
      if(scope.item.charge_type == DBConfig.upark_group.charge_type.none){
        scope.item.charge_type = DBConfig.upark_group.charge_type.hourly;
      }else{
        scope.item.charge_type = DBConfig.upark_group.charge_type.none;
      }
      scope.resetModeCharge();
    }
    scope.resetModeCharge = function(){
      scope.mode.css.setChargeBtn = scope.chargeBtnCss[scope.item.charge_type];
      scope.mode.charge = !(scope.item.charge_type == DBConfig.upark_group.charge_type.none);
      //console.log("initModeCharge..item.charge_type: " + $scope.item.charge_type);
      //console.log("initModeCharge..mode.charge: " + $scope.mode.charge);
    }
  }
  return {
    restrict: 'AE',
    scope: {
      chargeBtnCss: { // 收費方式,0:未設定,1:每小時扣點
        '0' : 'button button-outline button-stable',
        '1' : 'button button-outline button-assertive'
      },
      item: '=model',
      mode: '=mode'
    },
    templateUrl: 'templates/form/charge-input-directive.html',
    link: link
  }
}])

// photo
.directive('photoView', function() {
  return {
    restrict: 'AE',
    scope: {
      item: '=model'
    },
    templateUrl: 'templates/form/photo-view-directive.html'
  };
})
.directive('photoInput', ['CameraUtil', 'FileUtil', function(CameraUtil, FileUtil){
  function link(scope, element, attrs) {
    scope.uploadPhoto = function(){
      if(typeof scope.imgURI == 'undefined'){
        console.log("imgURI not found..");
        return;
      }
      // do upload
      FileUtil.upload(
        scope.imgURI,
        function successHandler(r) {
          console.log("Code = " + r.responseCode);
          console.log("Response = " + r.response);
          console.log("Sent = " + r.bytesSent);

          var obj = JSON.parse(r.response);
          scope.item.photo_1 = obj.seq_no;

          console.log("seq_no: " + FileUtil.getPhotoPath(scope.item.photo_1));
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
    scope.takePhoto = function(){
      CameraUtil.takePhoto(
        function(imageData){
          scope.imgURI = imageData; //$scope.imgURI = "data:image/jpeg;base64," + imageData;
          // auto upload
          scope.uploadPhoto();
        });
    };
    scope.choosePhoto = function(){
      CameraUtil.choosePhoto(
        function(imageData){
          scope.imgURI = imageData; //$scope.imgURI = "data:image/jpeg;base64," + imageData;
          // auto upload
          scope.uploadPhoto();
        });
    };
  }
  return {
    restrict: 'AE',
    scope: {
      item: '=model'
    },
    templateUrl: 'templates/form/photo-input-directive.html',
    link: link
  }
}])

// email
.directive('emailView', function() {
  return {
    restrict: 'AE',
    scope: {
      item: '=model'
    },
    templateUrl: 'templates/form/email-view-directive.html'
  };
})
.directive('emailInput', function() {
  return {
    restrict: 'AE',
    scope: {
      myForm: '=form',
      item: '=model'
    },
    templateUrl: 'templates/form/email-input-directive.html'
  };
})

// mobile
.directive('mobileView', function() {
  return {
    restrict: 'AE',
    scope: {
      item: '=model'
    },
    templateUrl: 'templates/form/mobile-view-directive.html'
  };
})
.directive('mobileInput', function() {
  return {
    restrict: 'AE',
    scope: {
      myForm: '=form',
      item: '=model'
    },
    templateUrl: 'templates/form/mobile-input-directive.html'
  };
})

// district
.directive('districtView', function() {
  return {
    restrict: 'AE',
    scope: {
      item: '=model'
    },
    templateUrl: 'templates/form/district-view-directive.html'
  };
})
.directive('districtInput', function() {
  return {
    restrict: 'AE',
    scope: {
      myForm: '=form',
      item: '=model'
    },
    templateUrl: 'templates/form/district-input-directive.html'
  };
})

// descriptions_1
.directive('descriptions1View', function() {
  return {
    restrict: 'AE',
    scope: {
      item: '=model'
    },
    templateUrl: 'templates/form/descriptions1-view-directive.html'
  };
})
.directive('descriptions1Input', function() {
  return {
    restrict: 'AE',
    scope: {
      myForm: '=form',
      item: '=model'
    },
    templateUrl: 'templates/form/descriptions1-input-directive.html'
  };
})

// descriptions_2
.directive('descriptions2View', function() {
  return {
    restrict: 'AE',
    scope: {
      item: '=model'
    },
    templateUrl: 'templates/form/descriptions2-view-directive.html'
  };
})
.directive('descriptions2Input', function() {
  return {
    restrict: 'AE',
    scope: {
      myForm: '=form',
      item: '=model'
    },
    templateUrl: 'templates/form/descriptions2-input-directive.html'
  };
})

// addr
.directive('addrView', function() {
  return {
    restrict: 'AE',
    scope: {
      item: '=model'
    },
    templateUrl: 'templates/form/addr-view-directive.html'
  };
})
.directive('addrInput', function() {
  return {
    restrict: 'AE',
    scope: {
      myForm: '=form',
      item: '=model'
    },
    templateUrl: 'templates/form/addr-input-directive.html'
  };
})

// remarks
.directive('remarksView', function() {
  return {
    restrict: 'AE',
    scope: {
      item: '=model'
    },
    templateUrl: 'templates/form/remarks-view-directive.html'
  };
})
.directive('remarksInput', function() {
  return {
    restrict: 'AE',
    scope: {
      myForm: '=form',
      item: '=model',
      maxlength: '@maxlength'
    },
    templateUrl: 'templates/form/remarks-input-directive.html'
  };
})

// size
.directive('sizeView', function() {
  return {
    restrict: 'AE',
    scope: {
      item: '=model'
    },
    templateUrl: 'templates/form/size-view-directive.html'
  };
})
.directive('sizeInput', function() {
  return {
    restrict: 'AE',
    scope: {
      myForm: '=form',
      item: '=model'
    },
    templateUrl: 'templates/form/size-input-directive.html'
  };
})

// meta
.directive('metaView', function() {
  return {
    restrict: 'AE',
    scope: {
      mode: '=mode'
    },
    templateUrl: 'templates/form/meta-view-directive.html'
  };
})
.directive('metaInput', function() {
  return {
    restrict: 'AE',
    scope: {
      mode: '=mode'
    },
    templateUrl: 'templates/form/meta-input-directive.html'
  };
})

// date
.directive('dateView', function() {
  return {
    restrict: 'AE',
    scope: {
      item: '=model',
      mode: '=mode'
    },
    templateUrl: 'templates/form/date-view-directive.html'
  };
})

// createtime
.directive('createtimeView', function() {
  return {
    restrict: 'AE',
    scope: {
      item: '=model'
    },
    templateUrl: 'templates/form/createtime-view-directive.html'
  };
})

// updatetime
.directive('updatetimeView', function() {
  return {
    restrict: 'AE',
    scope: {
      item: '=model',
      mode: '=mode'
    },
    templateUrl: 'templates/form/updatetime-view-directive.html'
  };
})
