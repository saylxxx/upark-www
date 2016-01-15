angular.module('upark.test', ['upark'])

.controller('TestCtrl', function($scope, CommonService, UparkCheckService) {
  $scope.htmlStr = CommonService.htmlStr;
  $scope.changeView = CommonService.changeView;

  $scope.SERVER_ROOT = "http://192.168.0.175:80";

  $scope.ajax = function(url, type, data, successHandler, errorHandler){
    $.ajax({
      url: url,
			type: type,
			dataType: "json",
      beforeSend: function (request){
        request.setRequestHeader("X-API-KEY", "0og0ww4o8000owo0c8csg8g0wssokgw8sosoc08k");
      },
			data: data,
      success: successHandler,
      error: errorHandler,
    });
  }

  $scope.createKey = function(){
    $scope.ajax($scope.SERVER_ROOT + '/restserver/index.php/api/key', 'put',
      {},
      function(result){console.log(result);},
      function(result){console.log(result);}
    );
  }

  $scope.ajaxGet = function(){
    UparkCheckService.getItems(
      1,
      function(result){console.log(result);},
      function(result){console.log(result);}
    );
  }

  $scope.ajaxPut = function(){
    UparkCheckService.createItem(
      {
        "owner_id": '1',
        //"district": '成功社區嗎?',
        "addr": '台北市大安區某地址',
        "descriptions_1": '有車位',
        "mobile": '0953123456',
        "email": 'test@altob.com'
      },
      function(result){console.log(result);},
      function(result){console.log(result);}
    );
  }

  $scope.ajaxPost = function(){
    UparkCheckService.updateItem(
      {
        "id": '2',
        "email": 'test_updated@altob.com',
        "status": '1',
        "mobile": '12345666666'
      },
      function(result){console.log(result);},
      function(result){console.log(result);}
    );
  }

  $scope.ajaxDelete = function(){
    UparkCheckService.deleteItem(
      {
        "id": '1',
        "status": '1'
      },
      function(result){console.log(result);},
      function(result){console.log(result);}
    );
  }


  /**
  $scope.REST_url = $scope.SERVER_ROOT + "/restserver/index.php/api/upark_check";

  $scope.ajaxGet = function(){
    $scope.ajax($scope.REST_url + '/get_item', 'get',
      {
        "id": 1
      },
      function(result){console.log(result);},
      function(result){console.log(result);}
    );
  }

  $scope.ajaxPut = function(){
    $scope.ajax($scope.REST_url + '/create_item', 'put',
      {
        "owner_id": '1',
        //"district": '成功社區嗎?',
        "addr": '台北市大安區某地址',
        "descriptions_1": '有車位',
        "mobile": '0953123456',
        "email": 'test@altob.com'
      },
      function(result){console.log(result);},
      function(result){console.log(result);}
    );
  }

  $scope.ajaxPost = function(){
    $scope.ajax($scope.REST_url + '/update_item', 'post',
      {
        "id": '1',
        "email": 'test_updated@altob.com',
        "status": '1'
      },
      function(result){console.log(result);},
      function(result){console.log(result);}
    );
  }

  $scope.ajaxDelete = function(){
    $scope.ajax($scope.REST_url + '/delete_item', 'delete',
      {
        "id": '1',
        "status": '1'
      },
      function(result){console.log(result);},
      function(result){console.log(result);}
    );
  }
  **/

  /**
  * ngr
  */
  $scope.ngrGet = function(){
    var result = UparkCheck.get(
      {id:1},
      function(data) {
        console.log("success: " + data);
      }, function(error) {
        console.log("error: " + error);
      }
    );
    console.log("result: " + result);
  }

  $scope.ngrPut = function(){
    var item = new UparkCheck();
    item.owner_id = '1';
    item.addr = '台北市大安區某地址';
    item.descriptions_1 = '有車位';
    item.mobile = '0953123456';
    item.email = 'test@altob.com';
    item.$save(function(u, putResponseHeaders) {
      console.log("u: " + u);
      console.log("putResponseHeaders: " + putResponseHeaders);
      //u => saved user object
      //putResponseHeaders => $http header getter
    });
  }

  $scope.ngrPost = function(){
    var item = UparkCheck.get({id:1},
      function(data) {
        console.log("success: " + data);
      }, function(error) {
        console.log("error: " + error);
      }
    );
    item.email = 'test_ngr@altob.com';
    item.status = '1';
    UparkCheck.update(
      { id: '1'},
      function(data) {
        console.log("success: " + data);
      }, function(error) {
        console.log("error: " + error);
      }
    );
  }
/**
  $scope.ngrGet = function(){
    UparkCheck.get_item(
      { id: '1'},
      function(data) {
        console.log("success: " + data);
      }, function(error) {
        console.log("error: " + error);
      }
    );
  }

  $scope.ngrPut = function(){
    UparkCheck.create_item(
      {
        "owner_id": '1',
        "addr": '台北市大安區某地址',
        "descriptions_1": '有車位',
        "mobile": '0953123456',
        "email": 'test@altob.com'
      },
      function(data) {
        console.log("success: " + data);
      }, function(error) {
        console.log("error: " + error);
      }
    );
  }

  $scope.ngrPost = function(){
    var item = UparkCheck.get_item(
      { id: '1'},
      function(data) {
        console.log("success: " + data);
      }, function(error) {
        console.log("error: " + error);
      }
    );
    item.email = 'test_ngr@altob.com';
    item.status = '1';
    UparkCheck.update_item(
      { id: '1'},
      function(data) {
        console.log("success: " + data);
      }, function(error) {
        console.log("error: " + error);
      }
    );
  }
**/

  /**
    // ajax
    $.ajax({
      type: "GET",
      dataType: "json",
      url: $scope.RESTurl + '/users',
      success: function(result)
      {
        console.log(result);
      },
      error: function(result)
      {
        console.log(result);
      },
    });


    $.ajax
            	({
            		url: "<?=APP_URL?>user_query",
                	type: "post",
                	dataType:"json",
                	data: {},
                	success: function(jdata)
                	{
                	}
            	});

    $.ajax
					({
						url:"<?=APP_URL?>user_delete",
						type:"post",
						dataType:"text",
						data:{"login_name":login_name},
						success:function(jdata)
						{
							if (jdata == 'ok')
							{
								alertify_success("刪除成功 !");
								show_item("user_query", "user_query");
							}
							else
							{
								alertify_error("發生未預期錯誤");
							}
						}
					});
    **/
})
