angular.module('upark')

.service('DBConfig', function() {
  this.upark =
  {
    status: {empty: '0', reserved: '1', closed: '4'},
    charge_type: {none: '0', hourly: '1'},
    guard_type: {none: '0', normal: '1'},
    space_type: {none: '0', normal: '1'},
    valet_type: {none: '0', normal: '1'},
    disabled_type: {none: '0', normal: '1'},
    allnight_type: {none: '0', normal: '1'},
    holiday_type: {none: '0', normal: '1'}
  };
  this.upark_group =
  {
    status: {empty: '0', closed: '4'},
    charge_type: {none: '0', hourly: '1'},
    guard_type: {none: '0', normal: '1'},
    space_type: {none: '0', normal: '1'},
    valet_type: {none: '0', normal: '1'},
    disabled_type: {none: '0', normal: '1'},
    allnight_type: {none: '0', normal: '1'},
    holiday_type: {none: '0', normal: '1'}
  };
})

.service('DBParse', function() {
  this.mysqlTime2TimeValue = function(mysqlTime){ // "hh:mm:ss"
    if(mysqlTime !== undefined && mysqlTime !== null){
      var t = mysqlTime.split(/[- :]/);
      return parseInt(t[0]) * 3600 + parseInt(t[1]) * 60; // + parseInt(t[2]);
    }else{
      return 0;
    }
  };
  this.timeValue2MysqlTime = function(timeValue){ // to "hh:mm:ss"
    if(timeValue !== undefined && timeValue !== null){
      var d = new Date(timeValue * 1000);
      var hour = d.getUTCHours();
      var min = d.getUTCMinutes();
      if (hour < 10) {
        hour = ['0', hour].join('');
      }
      if (min < 10) {
        min = ['0', min].join('');
      }
      return [hour, ':', min, ':00'].join('');
    }else{
      return '00:00:00';
    }
  };
})

.service('AjaxUtil', function(API_ROOT, API_KEY_1) {
  this.ajax = function(method_path, type, data, successHandler, errorHandler){
    $.ajax({
      url: API_ROOT + method_path,
      type: type,
      dataType: "json",
      beforeSend: function (request){
        request.setRequestHeader("X-API-KEY", API_KEY_1);
      },
      data: data,
      success: successHandler,
      error: errorHandler,
    });
  };
})

.factory('UparkGroupService', function(AjaxUtil){
  var path = '/upark_group';
  return {
    getItemByCheckId: function(user_id, upark_check_id, successHandler, errorHandler){
      AjaxUtil.ajax(path + '/get_item_by_check_id', 'get',
        {
          "id": user_id,
          "check_id": upark_check_id
        },
        successHandler, errorHandler
      );
    },
    getItem: function(user_id, group_id, successHandler, errorHandler){
      AjaxUtil.ajax(path + '/get_item_by_id', 'get',
        {
          "id": user_id,
          "group_id": group_id
        },
        successHandler, errorHandler
      );
    },
    getOwnerItems: function(user_id, successHandler, errorHandler){
      AjaxUtil.ajax(path + '/get_item_by_owner_id', 'get',
        {
          "id": user_id
        },
        successHandler, errorHandler
      );
    },
    getItems: function(user_id, lat, lng, kms, successHandler, errorHandler){
      AjaxUtil.ajax(path + '/get_center_item', 'get',
        {
          "id": user_id,
          "lat": lat,
          "lng": lng,
          "kms": kms
        },
        successHandler, errorHandler
      );
    },
    startShare: function(data, successHandler, errorHandler){
      AjaxUtil.ajax(path + '/start_share', 'post',
        data,
        successHandler, errorHandler
      );
    },
    stopShare: function(data, successHandler, errorHandler){
      AjaxUtil.ajax(path + '/stop_share', 'post',
        data,
        successHandler, errorHandler
      );
    },
    updateItem: function(data, successHandler, errorHandler){
      AjaxUtil.ajax(path + '/update_item', 'post',
        data,
        successHandler, errorHandler
      );
    }
  };
})

.factory('UparkService', function(AjaxUtil){
  var path = '/upark';
  return {
    getItemByCheckId: function(user_id, upark_check_id, successHandler, errorHandler){
      AjaxUtil.ajax(path + '/get_item_by_check_id', 'get',
        {
          "id": user_id,
          "check_id": upark_check_id
        },
        successHandler, errorHandler
      );
    },
    getItem: function(user_id, upark_id, successHandler, errorHandler){
      AjaxUtil.ajax(path + '/get_item_by_id', 'get',
        {
          "id": user_id,
          "upark_id": upark_id
        },
        successHandler, errorHandler
      );
    },
    getOwnerItems: function(user_id, successHandler, errorHandler){
      AjaxUtil.ajax(path + '/get_item_by_owner_id', 'get',
        {
          "id": user_id
        },
        successHandler, errorHandler
      );
    },
    getItems: function(user_id, lat, lng, kms, successHandler, errorHandler){
      AjaxUtil.ajax(path + '/get_center_item', 'get',
        {
          "id": user_id,
          "lat": lat,
          "lng": lng,
          "kms": kms
        },
        successHandler, errorHandler
      );
    },
    startShare: function(data, successHandler, errorHandler){
      AjaxUtil.ajax(path + '/start_share', 'post',
        data,
        successHandler, errorHandler
      );
    },
    stopShare: function(data, successHandler, errorHandler){
      AjaxUtil.ajax(path + '/stop_share', 'post',
        data,
        successHandler, errorHandler
      );
    },
    updateItem: function(data, successHandler, errorHandler){
      AjaxUtil.ajax(path + '/update_item', 'post',
        data,
        successHandler, errorHandler
      );
    }
  };
})

.factory('UparkCheckService', function(AjaxUtil){
  var path = '/upark_check';
  return {
    getProgressValue: function(status){
      var progress = 0;
      switch(status){
        case '0':
          progress = 12; // 0:待審核
          break;
        case '1':
          progress = 100;// 1:審核通過
          break;
        case '2':
          progress = 50; // 2:審核不通過
          break;
        case '3':
          progress = 0; // 3:使用者取消
          break;
        case '4':
          progress = 65; // 4:審核進行中
          break;
        default:
          progress = 1;
      }
      return progress;
    },
    getItem: function(upark_check_id, successHandler, errorHandler){
      AjaxUtil.ajax(path + '/get_item', 'get',
        {
          "id": upark_check_id
        },
        successHandler, errorHandler
      );
    },
    getItemLog: function(upark_check_log_id, successHandler, errorHandler){
      AjaxUtil.ajax(path + '/get_item_log', 'get',
        {
          "log_id": upark_check_log_id
        },
        successHandler, errorHandler
      );
    },
    getItems: function(owner_id, successHandler, errorHandler){
      AjaxUtil.ajax(path + '/get_owner_item', 'get',
        {
          "id": owner_id
        },
        successHandler, errorHandler
      );
    },
    createItem: function(data, successHandler, errorHandler){
      AjaxUtil.ajax(path + '/create_item', 'put',
        data,
        successHandler, errorHandler
      );
    },
    createDefaultGroupItem: function(data, successHandler, errorHandler){
      AjaxUtil.ajax(path + '/create_default_group_item', 'put',
        data,
        successHandler, errorHandler
      );
    },
    updateItem: function(data, successHandler, errorHandler){
      AjaxUtil.ajax(path + '/update_item', 'post',
        data,
        successHandler, errorHandler
      );
    },
    cancelItem: function(owner_id, upark_check_id, successHandler, errorHandler){
      AjaxUtil.ajax(path + '/owner_cancel', 'post',
        {
          "user_id": owner_id,
          "id": upark_check_id
        },
        successHandler, errorHandler
      );
    }
  };
})
;
