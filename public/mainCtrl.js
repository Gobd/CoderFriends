angular.module('app').controller('mainCtrl', function($scope, githubService, $window) {

    $scope.getAuth = function() {
        $window.location = '/auth/github';
    }

    $scope.getFollowing = function() {
        githubService.getFollowing().then(function(res) {
            $scope.following = res.data;
        })
    }

    $scope.getActivity = function(user) {
        githubService.getActivity(user).then(function(res) {
            $scope.activity = res.data;
        })
    }

})