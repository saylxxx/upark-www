angular.module('upark.admin')

.service('AjaxUtil', function(API_ROOT, API_KEY_ADMIN) {
  this.ajax = function(method_path, type, data, successHandler, errorHandler){
    $.ajax({
      url: API_ROOT + method_path,
      type: type,
      dataType: "json",
      beforeSend: function (request){
        request.setRequestHeader("X-API-KEY", API_KEY_ADMIN);
      },
      data: data,
      success: successHandler,
      error: errorHandler,
    });
  };
})

.factory('AdminService', function($location, UparkCheckAdminService) {
  var admin =
    {
      id: 1,
      pending_items: [],
      checker_items: []
    };

  return {
    admin: admin,
    changeViewAdminConfirm: function(upark_type, upark_check_id, upark_check_log_id){
      if(upark_type == 0){
        $location.path(['/app/share-admin-confirm/', upark_check_id, '/', upark_check_log_id, '/', upark_type].join(''));
      }else{
        $location.path(['/app/share-admin-group-confirm/', upark_check_id, '/', upark_check_log_id, '/', upark_type].join(''));
      }
    },
    changeViewAdminDecline: function(upark_type, upark_check_id, upark_check_log_id){
      if(upark_type == 0){
        $location.path(['/app/share-admin-decline/', upark_check_id, '/', upark_check_log_id, '/', upark_type].join(''));
      }else{
        $location.path(['/app/share-admin-group-decline/', upark_check_id, '/', upark_check_log_id, '/', upark_type].join(''));
      }
    },
    changeViewAdminCancel: function(upark_type, upark_check_id, upark_check_log_id){
      if(upark_type == 0){
        $location.path(['/app/share-admin/', upark_check_id, '/', upark_check_log_id, '/', upark_type].join(''));
      } else {
        $location.path(['/app/share-admin-group/', upark_check_id, '/', upark_check_log_id, '/', upark_type].join(''));
      }
    },
    refreshPendingItems : function(){
      UparkCheckAdminService.getPendingList(
        admin.id,
        function(result){
          admin.pending_items = result;
          console.log("success result: " + result);
        },
        function(result){
          console.log("error result: " + result);
          admin.pending_items = []; // clean
        }
      );
    },
    refreshCheckerItems : function(){
      UparkCheckAdminService.getCheckerItems(
        admin.id,
        function(result){
          admin.checker_items = result;
          console.log("success result: " + result);
        },
        function(result){
          console.log("error result: " + result);
          admin.checker_items = []; // clean
        }
      );
    }
  };
})

.factory('UparkCheckAdminService', function(AjaxUtil){
  var path = '/upark_check_admin';
  return {
    getPendingList: function(admin_id, successHandler, errorHandler){
      AjaxUtil.ajax([path, '/get_pending_list'].join(''), 'get',
        {
          "id": admin_id
        },
        successHandler, errorHandler
      );
    },
    getCheckerItems: function(admin_id, successHandler, errorHandler){
      AjaxUtil.ajax([path, '/get_checker_item'].join(''), 'get',
        {
          "id": admin_id
        },
        successHandler, errorHandler
      );
    },
    setUparkCheckStart: function(admin_id, upark_check_id, successHandler, errorHandler){
      AjaxUtil.ajax([path, '/set_upark_check_start'].join(''), 'post',
        {
          "id": admin_id,
          "check_id": upark_check_id
        },
        successHandler, errorHandler
      );
    },
    setUparkCheckOk: function(data, successHandler, errorHandler){
      AjaxUtil.ajax([path, '/set_upark_check_ok'].join(''), 'post',
        data,
        successHandler, errorHandler
      );
    },
    setUparkCheckGroupOk: function(data, successHandler, errorHandler){
      AjaxUtil.ajax([path, '/set_upark_check_group_ok'].join(''), 'post',
        data,
        successHandler, errorHandler
      );
    },
    setUparkCheckKo: function(admin_id, upark_check_log_id, report, successHandler, errorHandler){
      AjaxUtil.ajax([path, '/set_upark_check_ko'].join(''), 'post',
        {
          "id": admin_id,
          "log_id": upark_check_log_id,
          "report": report
        },
        successHandler, errorHandler
      );
    }
  };
})
;
