angular.module('upark')

// addr luncher
.directive('addrLuncher', ['LaunchNavigator', function(LaunchNavigator){
  function link(scope, element, attrs) {
    element.on('click', function(event) {
      event.preventDefault();
      LaunchNavigator.launchAddr4Current(scope.item.addr);
    });
  }
  return {
    restrict: 'AE',
    templateUrl: 'templates/addr-luncher-directive.html',
    link: link
  }
}])

// progress item
.directive('progressItem', function() {
  return {
    restrict: 'AE',
    scope: {
      item: '=model'
    },
    templateUrl: 'templates/progress-item-directive.html'
  };
})
