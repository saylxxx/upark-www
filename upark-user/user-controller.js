angular.module('upark.user', ['upark'])

.controller('UserCtrl', function($scope, CommonService) {
  $scope.htmlStr = CommonService.htmlStr;
  $scope.changeView = CommonService.changeView;

})
