angular.module('upark')

.service('LaunchNavigator', function($cordovaLaunchNavigator) {
  this.launch4Start = function(destination, start) {
    //var destination = [latitude, longitude];
    //var start = "Trento";
    $cordovaLaunchNavigator.navigate(destination, start).then(function() {
      console.log("Navigator launched");
    }, function (err) {
      console.error(err);
    });
  };

  this.launch4Current = function(latitude, longitude) {
    var destination = [latitude, longitude];
    $cordovaLaunchNavigator.navigate(destination, null).then(function() {
      console.log("Navigator launched");
    }, function (err) {
      console.error(err);
    });
  };

  this.launchAddr4Current = function(addr) {
    $cordovaLaunchNavigator.navigate(addr, null).then(function() {
      console.log("Navigator launched");
    }, function (err) {
      console.error(err);
    });
  };
})

/*
.service('LinkUtil', function() {
  // @see https://en.wikipedia.org/wiki/Geo_URI_scheme#Example
  this.getGeoURI  = function(longitude, latitude){
    return ['geo:', latitude, ',', longitude, ';u=35'].join('');
  };
})
*/

.service('FileUtil', function(UPLOAD_USER_IMAGE_URL, UPLOAD_DIR, $cordovaFileTransfer, UserService) {
  this.getPhotoPath = function(seqNo){
    return [UPLOAD_DIR, '/', UserService.user.id, '/', seqNo, '_photo.jpg'].join('');
  };

  this.getIconPath = function(seqNo){
    return [UPLOAD_DIR, '/', UserService.user.id, '/', seqNo, '_icon.jpg'].join('');
  };

  this.upload = function(fileURL, successHandler, errorHandler, progressHandler) {

    var options = new FileUploadOptions();
    options.fileKey="file";
    //options.fileName=fileURL.substr(fileURL.lastIndexOf('/')+1);
    options.mimeType="image/jpeg";
    //options.trustAllHosts = true;
    options.params = {user_id: UserService.user.id};
    //var headers={'headerParam':'headerValue'};
    //options.headers = headers;
    var ft = new FileTransfer();
    ft.onprogress = progressHandler;
    ft.upload(fileURL, encodeURI(UPLOAD_USER_IMAGE_URL), successHandler, errorHandler, options);
    //ft.abort();

    /*
    var filename = fileURL.split("/").pop();
    var options = {
          fileKey: "file",
          fileName: filename,
          chunkedMode: false,
          mimeType: "image/jpg"
        };
    $cordovaFileTransfer.upload(UPLOAD_URL, fileURL, {}).then(successHandler, errorHandler, progressHandler);
    */
  };
})

.service('CameraUtil', function($cordovaCamera, $ionicPopup) {
  this.takePhoto = function (successHandler) {
                    var options = {
                      quality: 100,
                      destinationType: Camera.DestinationType.FILE_URI ,
                      //destinationType: Camera.DestinationType.DATA_URL,
                      sourceType: Camera.PictureSourceType.CAMERA,
                      allowEdit: false, //allowEdit: true, // note: 編輯結果有問題, 先不給編輯
                      encodingType: Camera.EncodingType.JPEG,
                      //targetWidth: 512,
                      //targetHeight: 512,
                      popoverOptions: CameraPopoverOptions,
                      saveToPhotoAlbum: false
                    };
                    $cordovaCamera.getPicture(options).then(successHandler,
                      function (err) {
                        // An error occured. Show a message to the user
                        $ionicPopup.alert({
                          title: '訊息',
                          template: '拍照發生錯誤..orz'
                        });
                    });
                  };
  this.choosePhoto = function (successHandler) {
                    var options = {
                      quality: 100,
                      destinationType: Camera.DestinationType.FILE_URI ,
                      //destinationType: Camera.DestinationType.DATA_URL,
                      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                      allowEdit: true,
                      encodingType: Camera.EncodingType.JPEG,
                      targetWidth: 512,
                      targetHeight: 512,
                      popoverOptions: CameraPopoverOptions,
                      saveToPhotoAlbum: false
                    };
                    $cordovaCamera.getPicture(options).then(successHandler,
                      function (err) {
                        // An error occured. Show a message to the user
                        $ionicPopup.alert({
                          title: '訊息',
                          template: '選擇檔案發生錯誤..orz'
                        });
                    });
                  };
})

.factory('StateService', function($state, $ionicPopup, CommonService, GeoService) {
  var data =
    {
      isDocumentReady: false,
      isGpsLocationEnabled: false,
      isNetworkEnabled: false,
      networkState: 0
    };

  function checkConnection() {
    data.networkState = navigator.connection.type;
    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.CELL]     = 'Cell generic connection';
    states[Connection.NONE]     = 'No network connection';
    console.log('Connection type: ' + states[data.networkState]);

    switch(data.networkState){
      //case Connection.UNKNOWN: //  <- ex. internet by pc
      case Connection.NONE:
        data.isNetworkEnabled = false;
        // show msg
        var alertPopup = $ionicPopup.alert({
          title: '訊息',
          template: '請連上網路後再試，謝謝！'
        });
        alertPopup.then(function(res) {
          //$state.go('app.error');
          CommonService.changeViewNoBack('app.error');
        });
        break;
      default:
        data.isNetworkEnabled = true;
    }
    return data.isNetworkEnabled;
  }

  function checkLocation(){
    cordova.plugins.diagnostic.isGpsLocationEnabled(function(enabled){
      console.log("isGpsLocationEnabled: " + (enabled ? "enabled" : "disabled"));
      if(enabled){
        data.isGpsLocationEnabled = true;
        GeoService.refresh();
      }else{
        data.isGpsLocationEnabled = false;
        function onRequestSuccess(success){
          console.log("Successfully requested accuracy: "+success.message);
          data.isGpsLocationEnabled = true;
          GeoService.refresh();
        }
        function onRequestFailure(error){
            console.error("Accuracy request failed: error code="+error.code+"; error message="+error.message);
            if(error.code !== cordova.plugins.locationAccuracy.ERROR_USER_DISAGREED){
                if(window.confirm("位置設定失敗，前往設定選單?")){
                    cordova.plugins.diagnostic.switchToLocationSettings();
                }
            }else{
              // show msg
              var alertPopup = $ionicPopup.alert({
                title: '訊息',
                template: '請開啟GPS後再試，謝謝！'
              });
              alertPopup.then(function(res) {
                //$state.go('app.error');
                CommonService.changeViewNoBack('app.error');
              });
            }
        }
        cordova.plugins.locationAccuracy.request(onRequestSuccess, onRequestFailure, cordova.plugins.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY);
      }
    }, function(error){
      console.error("The following error occurred: "+error);
      //$state.go('app.error');
    });
    return data.isGpsLocationEnabled;
  }

  return {
    data: data,
    onDocumentReady: function(){
      data.isDocumentReady = true;
      /**
      cordova.plugins.diagnostic.isGpsLocationEnabled(function(enabled){
        console.log("GPS location is " + (enabled ? "enabled" : "disabled"));
      }, function(error){
        console.error("The following error occurred: "+error);
      });

      cordova.plugins.diagnostic.isNetworkLocationEnabled(function(enabled){
        console.log("Network location is " + (enabled ? "enabled" : "disabled"));
      }, function(error){
        console.error("The following error occurred: "+error);
      });

      cordova.plugins.diagnostic.getLocationMode(function(mode){
        console.log("Current location mode is: " + mode);
      }, function(error){
        console.error("The following error occurred: "+error);
      });
      **/

      // listen
      //document.addEventListener("offline", yourCallbackFunction, false);
      return true;
    },
    checkConnection : checkConnection,
    checkLocation : checkLocation
  };
})

.factory('CommonService', function($location, $ionicHistory, $state) {
  var inputValue =
    {
      search: "",
      setTime: ""
    };

  var htmlStr =
    {
      search: "你要去哪裡?",
      setTime: "停車時間"
    };

  return {
    inputValue: inputValue,
    htmlStr: htmlStr,
    reloadView : function(){
      $state.go($state.current, {}, {reload: true});
    },
    changeView : function(view){
      console.log("change view: " + view);
      $location.path(view); // path not hash
    },
    changeViewNoBack : function(view){
      //$ionicViewService.nextViewOptions({disableBack: true});
      $ionicHistory.clearHistory();
      $ionicHistory.nextViewOptions({
        disableAnimate: false,
        disableBack: true
      });
      $location.path(view); // path not hash
    }
  };
})

.factory('UserService', function(UparkCheckService, UparkService, UparkGroupService) {
  var user =
    {
      id: 1,
      upark_check_items: [],
      upark_owner_items: [],
      upark_owner_groups: [],
      upark_items: [],
      upark_refreshed_center: undefined,
      upark_refreshed_kms: 0
    };

  var isUparkLoaded = function(item){
    return upark_items[item.upark_id] !== undefined;
  }

  return {
    user: user,
    refreshOwnerItems : function(){
      UparkService.getOwnerItems(
        user.id,
        function(result){
          user.upark_owner_items = result;
          //console.log("success result: " + result);
        },
        function(error){
          console.log("error result: " + error);
          user.upark_owner_items = []; // clean
        }
      );
    },
    refreshOwnerGroups : function(){
      UparkGroupService.getOwnerItems(
        user.id,
        function(result){
          user.upark_owner_groups = result;
          //console.log("success result: " + result);
        },
        function(error){
          console.log("error result: " + error);
          user.upark_owner_groups = []; // clean
        }
      );
    },
    refreshUparkCheckItems : function(){
      UparkCheckService.getItems(
        user.id,
        function(result){
          user.upark_check_items = result;
          //console.log("success result: " + result);
        },
        function(error){
          console.log("error result: " + error);
          user.upark_check_items = []; // clean
        }
      );
    },
    refreshUparkItems : function(center, kms, successHandler, errorHandler){
      UparkService.getItems(
        user.id,
        center.lat(),
        center.lng(),
        kms,
        function(result){
          // update data
          for (var key in result) {
            var item = result[key];
            user.upark_items[item.upark_id] = item;
          }
          user.upark_refreshed_center = center;
          user.upark_refreshed_kms = kms;
          console.log("refreshUparkItems..upark_items: " + result);
          // update view
          successHandler(result);
        },
        function(error){
          console.log("error result: " + error);
          //user.upark_items = []; // clean
          errorHandler(error);
        }
      );
    }
  };
})

.factory('ItemService', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var items = [{
    id: 0,
    name: '車位 0',
    desc: '停車位置描述',
    price: 100,
    icon: 'img/ionic.png',
    lat: 25.05,
    lng: 121.53
  }, {
    id: 1,
    name: '車位 1',
    desc: '停車位置描述',
    price: 50,
    icon: 'img/ionic.png',
    lat: 25.01,
    lng: 121.51
  }, {
    id: 2,
    name: '車位 2',
    desc: '停車位置描述',
    price: 10,
    icon: 'img/ionic.png',
    lat: 25.03,
    lng: 121.55
  }, {
    id: 3,
    desc: '停車位置描述',
    name: '車位 3',
    price: 15,
    icon: 'img/ionic.png',
    lat: 25.02,
    lng: 121.51
  }];

  return {
    all: function() {
      return items;
    },
    remove: function(item) {
      items.splice(items.indexOf(item), 1);
    },
    get: function(itemId) {
      for (var i = 0; i < items.length; i++) {
        if (items[i].id === parseInt(itemId)) {
          return items[i];
        }
      }
      return null;
    }
  };
})
;
