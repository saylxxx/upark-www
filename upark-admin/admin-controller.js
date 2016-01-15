angular.module('upark.admin', ['upark'])

.controller('AdminCtrl', function($scope, $stateParams, AdminService, CommonService) {
  $scope.changeView = CommonService.changeView;
  $scope.admin = AdminService.admin;
})
