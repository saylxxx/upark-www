angular.module('upark.map')

.factory('IconService', function() {
  var data = {
      icon1: {
        image: {
          url: 'img/beachflag.png',
          // This marker is 20 pixels wide by 32 pixels high.
          size: new google.maps.Size(20, 32),
          // The origin for this image is (0, 0).
          origin: new google.maps.Point(0, 0),
          // The anchor for this image is the base of the flagpole at (0, 32).
          anchor: new google.maps.Point(0, 32)
        },
        shape: {
          coords: [1, 1, 1, 20, 18, 20, 18, 1],
          type: 'poly'
        }
      },
      icon2: {
        image: {
          url: 'img/beachflag.png',
          // This marker is 20 pixels wide by 32 pixels high.
          size: new google.maps.Size(20, 32),
          // The origin for this image is (0, 0).
          origin: new google.maps.Point(0, 0),
          // The anchor for this image is the base of the flagpole at (0, 32).
          anchor: new google.maps.Point(0, 32)
        },
        shape: {
          coords: [1, 1, 1, 20, 18, 20, 18, 1],
          type: 'poly'
        }
      }
  };

  return {
    icon1: data.icon1,
    icon2: data.icon2
  };
})

.factory('MapService', function() {
  var data =
    {
      mapInstance: undefined,
      history: [],
      markerData: {
        name: ""
      }
    };

  var rad = function(x) {
    return x * Math.PI / 180;
  };

  var getDistance = function(p1, p2) {
    var R = 6378137; // Earth’s mean radius in meter
    var dLat = rad(p2.lat() - p1.lat());
    var dLong = rad(p2.lng() - p1.lng());
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(rad(p1.lat())) * Math.cos(rad(p2.lat())) *
      Math.sin(dLong / 2) * Math.sin(dLong / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d; // returns the distance in meter
  };

  var getBoundsZoomLevel = function(bounds, mapDim) {
    var WORLD_DIM = { height: 256, width: 256 };
    var ZOOM_MAX = 21;

    function latRad(lat) {
        var sin = Math.sin(lat * Math.PI / 180);
        var radX2 = Math.log((1 + sin) / (1 - sin)) / 2;
        return Math.max(Math.min(radX2, Math.PI), -Math.PI) / 2;
    }

    function zoom(mapPx, worldPx, fraction) {
        return Math.floor(Math.log(mapPx / worldPx / fraction) / Math.LN2);
    }

    var ne = bounds.getNorthEast();
    var sw = bounds.getSouthWest();

    var latFraction = (latRad(ne.lat()) - latRad(sw.lat())) / Math.PI;

    var lngDiff = ne.lng() - sw.lng();
    var lngFraction = ((lngDiff < 0) ? (lngDiff + 360) : lngDiff) / 360;

    var latZoom = zoom(mapDim.height, WORLD_DIM.height, latFraction);
    var lngZoom = zoom(mapDim.width, WORLD_DIM.width, lngFraction);

    return Math.min(latZoom, lngZoom, ZOOM_MAX);
  }

  return {
    markerData: data.markerData,
    setMap: function(map){
      data.mapInstance = map;
    },
    getMap: function(){
      return data.mapInstance;
    },
    getDistance: function(p1, p2){
      return getDistance(p1, p2);
    },
    getBoundsZoomLevel: function(bounds, mapDim){
      return getBoundsZoomLevel(bounds, mapDim);
    },
    pushHistory: function(position){
      data.history.push(position);
    },
    getLastHistory: function(){
      return data.history[data.history.length -1];
    },
    getHistory: function(){
      return data.history;
    }
  };
})

.factory('GeoService', function($timeout, $rootScope) {
  var watchID = 0;
  var data = {lat: 0,lng: 0};
  var option = { maximumAge: 10000, timeout: 10000, enableHighAccuracy: true };
  var onSuccess = function(position) {
      data.lat = position.coords.latitude;
      data.lng = position.coords.longitude;
      console.log("watchID: " + watchID + " >> (" + data.lat +", "+ data.lng +")");
      /**
      alert('Latitude: '          + position.coords.latitude          + '\n' +
            'Longitude: '         + position.coords.longitude         + '\n' +
            'Altitude: '          + position.coords.altitude          + '\n' +
            'Accuracy: '          + position.coords.accuracy          + '\n' +
            'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
            'Heading: '           + position.coords.heading           + '\n' +
            'Speed: '             + position.coords.speed             + '\n' +
            'Timestamp: '         + position.timestamp                + '\n');
            **/
    // notify
    $rootScope.$emit('geo-change-event');
  };

  var onError = function(error) {
      console.log('code: '    + error.code    + '\n' + 'message: ' + error.message + '\n');
      /**
      alert('code: '    + error.code    + '\n' +
            'message: ' + error.message + '\n');
            **/
  }

  var refreshLatLng = function(){
    var allInOneId = navigator.geolocation.watchPosition(function(position)
      {
            data.lat = position.coords.latitude;
            data.lng = position.coords.longitude;
            console.log("allInOne..watchID: " + watchID + " >> (" + data.lat +", "+ data.lng +")");
            $rootScope.$emit('geo-change-event');
            allInOneId = navigator.geolocation.clearWatch(allInOneId);
      }, onError, option);
  }

  return {
    currentLatLng: function(){
      return new google.maps.LatLng(data.lat, data.lng);
    },
    refresh: function() {
      refreshLatLng();
    },
    start: function() {
      // watchID = navigator.geolocation.watchPosition(onSuccess, onError, option);
    },
    stop: function(){
      navigator.geolocation.clearWatch(watchID);
    },
    subscribe: function(scope, callback) {
      var handler = $rootScope.$on('geo-change-event', callback);
      scope.$on('$destroy', handler);
    },
    allInOne: function(scope, callback) {
      var handler = $rootScope.$on('geo-change-event', callback);
      refreshLatLng();
      scope.$on('$destroy', handler);
    },
  };
})
;
