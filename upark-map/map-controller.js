angular.module('upark.map', ['upark', 'ngMap', 'upark.filter'])

.controller('MapDetailCtrl', function($scope, $stateParams, ItemService) {
  $scope.item = ItemService.get($stateParams.id);
})

.controller('MapCtrl', function($scope,
  UserService,
  CommonService, MapService, GeoService,
  IconService) {
  $scope.info = {
    refresh_distance: 800, // 地圖中央移動多少跟server要資料 (單位: 公尺)
    refresh_data_distance_km: 1, // 每次與server要半徑多少的資料 (單位: 公里)
    isMap: true, // 是否為地圖模式
    selected: false, // 是否選取矛點
    count: 0 // 本次資料數
  };
  $scope.htmlStr = CommonService.htmlStr;
  $scope.changeView = CommonService.changeView;
  $scope.inputValue = CommonService.inputValue;

  var infoBubble = new InfoBubble({
    shadowStyle: 1,
    padding: 10,
    backgroundColor: 'rgb(255,255,255)',
    borderRadius: 10,
    arrowSize: 10,
    minWidth: '100px',
    maxWidth: '150px',
    minHeight: '50px',
    maxHeight: '80px',
    borderWidth: 1,
    borderColor: '#ccc',
    disableAutoPan: true,
    hideCloseButton: true,
    arrowPosition: 50,
    backgroundClassName: 'transparent',
    arrowStyle: 2
  });

  // tmp solution for autocomplete
  $scope.disableTap = function(){
    container = document.getElementsByClassName('pac-container');
    // disable ionic data tab
    angular.element(container).attr('data-tap-disabled', 'true');
    // leave input field if google-address-entry is selected
    angular.element(container).on("click", function(){
        document.getElementById('searchInput').blur();
    });
  }

  $scope.toggleMap = function(){
    $scope.info.isMap = !$scope.info.isMap;
  }

  $scope.placeChanged = function() {
    $scope.place = this.getPlace();
    $scope.lat = $scope.place.geometry.location.lat();
    $scope.lng = $scope.place.geometry.location.lng();
    var map = MapService.getMap();
    var next = new google.maps.LatLng($scope.lat,$scope.lng);
    map.setCenter(next);
    //map.setZoom(16);

    // log
    MapService.pushHistory(next);
    console.log("history: " + MapService.getHistory());

    // refresh items
    //$scope.refreshItemsFitBounds();
  }

  $scope.createMarker = function(map, item){
    // get distance
    item.distance = MapService.getDistance(
        GeoService.currentLatLng(),
        new google.maps.LatLng(item.addr_lat, item.addr_lng)
      );

    // init marker
    var marker = new google.maps.Marker({
        map: map,
        data: item,
        draggable: false,
        //animation: google.maps.Animation.DROP,
        //position: {lat: Number(item.latitude), lng: Number(item.longitude)},
        position: {lat: Number(item.addr_lat), lng: Number(item.addr_lng)},
        icon: IconService.icon1.image,
        shape: IconService.icon1.shape
      });
    marker.addListener('click', function onMarkerClicked() {
      // data
      $scope.markerData = this.data;

      console.log("$scope.markerData.addr: "+ $scope.markerData.addr);

      //console.log("MapService.markerData.name: "+ MapService.markerData.name);

      // info window
      //infoBubble.setContent($scope.markerData.descriptions_1);
      //infoBubble.open(MapService.getMap(), this);

      //setTimeout(function () { infoBubble.close(); }, 10000);

      // animation
      /**
      if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
      } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
      }**/
      // pan to
      MapService.getMap().panTo(this.getPosition());
      // set selected
      $scope.info.selected = true;
      // update everything
      $scope.$digest();
    });
    return marker;
  }

  $scope.dynMarkers = [];
  $scope.refreshUparkResultHandler = function(result){
    $scope.items = result;

    if($scope.markerClusterer !== undefined){
      $scope.markerClusterer.setMap(null);
    }

    if($scope.dynMarkers !== undefined){
      for (var markerKey in $scope.dynMarkers) {
        $scope.dynMarkers[markerKey].setMap(null);
        $scope.dynMarkers[markerKey].setAnimation(null);
      }
      $scope.dynMarkers = [];
    }

    var map = MapService.getMap();
    //var bounds = new google.maps.LatLngBounds();
    if(result.length > 0){
      for (var key in result) {
        var marker = $scope.createMarker(map, result[key]);
        $scope.dynMarkers.push(marker);
        //bounds.extend(marker.getPosition());
      }
      // update markerCluster
      $scope.markerClusterer = new MarkerClusterer(map, $scope.dynMarkers, {});
    }
    //  Fit these bounds to the map
    //map.fitBounds(bounds);
    // update length
    $scope.info.count = result.length;
    // set selected
    $scope.info.selected = false;
    // update everything
    $scope.$digest();
  }

  $scope.listenCenterChangedToItems = function(){
    var map = MapService.getMap();
    var mapCenterListener = map.addListener('center_changed', function() {
      var center = map.getCenter();
      //var moved = MapService.getDistance(newCenter, UserService.user.upark_refreshed_center);
      //console.log("center_changed..lat:" + newCenter.lat() + ", lng:" + newCenter.lng() + ", distance(m): " + moved);

      console.log("listenCenterChangedToItems..center: " + center);

      if(UserService.user.upark_refreshed_center == undefined ||
        MapService.getDistance(center, UserService.user.upark_refreshed_center) > $scope.info.refresh_distance){
        // remove listener
        google.maps.event.removeListener(mapCenterListener);
        // lock map ?
        // refresh items
        UserService.refreshUparkItems(center, $scope.info.refresh_data_distance_km,
          function(result){
            $scope.refreshUparkResultHandler(result);
            // listen center angain
            $scope.listenCenterChangedToItems();
            // release lock map ?
          },
          function(error){
            $scope.refreshUparkResultHandler([]);
            // listen center angain
            $scope.listenCenterChangedToItems();
            // release lock map ?
          }
        );
      }
    });
  }

  /**
  $scope.refreshItemsFitBounds = function(){
    var map = MapService.getMap();
    var mapCenterListener = map.addListener('center_changed', function() {
      // remove listener
      google.maps.event.removeListener(mapCenterListener);
      var center = map.getCenter();
      console.log("refreshItemsFitBounds..addListener..center_changed..lat:" + center.lat() + ", lng:" + center.lng());
      // refresh items
    });
  }
  **/

  /**
  $scope.refreshItems = function(){
    var map = MapService.getMap();
    var mapCenterListener = map.addListener('center_changed', function() {
      google.maps.event.removeListener(mapCenterListener);
      var center = map.getCenter();
      console.log("refreshItems..addListener..center_changed..lat:" + center.lat() + ", lng:" + center.lng());
      // refresh items
      UserService.refreshUparkItems(center.lat(), center.lng(),
        function(result){
          $scope.items = result;
          $scope.dynMarkers = [];
          for (var key in result) {
            $scope.dynMarkers.push($scope.createMarker(map, $scope.items[key]));
          }
          $scope.markerClusterer = new MarkerClusterer(map, $scope.dynMarkers, {});
        }
      );
    });
  }
  **/

  // set item
  //$scope.items = ItemService.all();

  /**
  * @see http://stackoverflow.com/questions/6048975/google-maps-v3-how-to-calculate-the-zoom-level-for-a-given-bounds
  */
  $scope.listenZoomChangedToItems = function(){
    var map = MapService.getMap();
    var mapCenterListener = map.addListener('zoom_changed', function() {
      var $mapDiv = $('#mapElementId');
      var mapDim = { height: $mapDiv.height(), width: $mapDiv.width() };
      // get max zoom to fit ??? bound
      //var zoomBound = MapService.getBoundsZoomLevel(???, mapDim);
      //console.log("mapDim>> height:" + mapDim.height + ", width: " + mapDim.width + ", bound: " + zoomBound);
    });
  }

  // set map
  $scope.$on('mapInitialized', function(event, evtMap) {
    console.log("mapInitialized..");
    MapService.setMap(evtMap);

    // listen center_changed
    $scope.listenCenterChangedToItems();

    // listen zoom_changed
    //$scope.listenZoomChangedToItems();

    // init
    var map = MapService.getMap();
    var myStyles =[{
        featureType: "poi",
        elementType: "labels",
        stylers: [{ visibility: "off" }]
      }];
    map.setOptions({
      minZoom: 12,
      maxZoom: 18,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      styles: myStyles,
      disableDefaultUI: true
    });

    // get items
    //$scope.refreshItems();
    //$scope.refreshItemsFitBounds();



    // set markers
    /**
    for (var key in $scope.items) {
      $scope.dynMarkers.push($scope.createMarker(map, $scope.items[key]));
    }
    $scope.markerClusterer = new MarkerClusterer(map, $scope.dynMarkers, {});
    **/

    /**
    for (var i=0; i<10; i++) {
      var latLng = new google.maps.LatLng(markers[i].position[0], markers[i].position[1]);
      $scope.dynMarkers.push(new google.maps.Marker({position:latLng}));
    }
    $scope.markerClusterer = new MarkerClusterer(map, $scope.dynMarkers, {});
    **/
  });
})

;
