angular.module('upark.money', ['upark'])

.controller('MoneyCtrl', function($scope, CommonService) {
  $scope.htmlStr = CommonService.htmlStr;
  $scope.changeView = CommonService.changeView;

})
