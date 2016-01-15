angular.module('upark')
.factory('UparkCheck', ['$resource', function($resource) {
  var SERVER_ROOT = "http://192.168.0.175:80";
  var REST_UPARK_CHECK = SERVER_ROOT+ "/restserver/index.php/api/upark_check";
  var API_KEY = "0og0ww4o8000owo0c8csg8g0wssokgw8sosoc08k";

return $resource(REST_UPARK_CHECK + '/:id',{userId:'@id'},
  {
    'get':    {headers: {'X-API-KEY': API_KEY}, method:'GET'},
    'save':   {headers: {'X-API-KEY': API_KEY}, method:'POST'},
    'query':  {headers: {'X-API-KEY': API_KEY}, method:'GET', isArray:true},
    'remove': {headers: {'X-API-KEY': API_KEY}, method:'DELETE'},
    'delete': {headers: {'X-API-KEY': API_KEY}, method:'DELETE'}
  });
}])
;

/**
.factory('UparkCheck', ['$resource', function($resource) {
  var SERVER_ROOT = "http://192.168.0.175:80";
  var REST_UPARK_CHECK = SERVER_ROOT+ "/restserver/index.php/api/upark_check";
  var API_KEY = "0og0ww4o8000owo0c8csg8g0wssokgw8sosoc08k";

return $resource("", null,
    {
        'get_item': {
          url: REST_UPARK_CHECK + '/get_item',
          headers: {'X-API-KEY': API_KEY},
          method:'get',
          isArray: true
        },
        'create_item': {
          url: REST_UPARK_CHECK + '/create_item',
          headers: {'X-API-KEY': API_KEY},
          method:'put'
        },
        'update_item': {
          url: REST_UPARK_CHECK + '/update_item',
          headers: {'X-API-KEY': API_KEY},
          method:'post'
        },
        'delete_item': {
          url: REST_UPARK_CHECK + '/delete_item',
          headers: {'X-API-KEY': API_KEY},
          method:'delete'
        }
    });
}])
;
**/
