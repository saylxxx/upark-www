angular.module('upark.booking', ['upark'])

.controller('BookingDetailCtrl', function($scope, $stateParams, ItemService) {
  $scope.item = ItemService.get($stateParams.id);
})

.controller('BookingCtrl', function($scope, $ionicPopup, CommonService, ItemService) {
  $scope.htmlStr = CommonService.htmlStr;
  $scope.changeView = CommonService.changeView;
  $scope.items = ItemService.all();
})

;
