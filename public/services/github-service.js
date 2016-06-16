angular.module('app').service('githubService', function($http) {

    this.getFollowing = function() {
        return $http.get('/api/github/following')
    }

    this.getActivity = function(user) {
      return $http.get(`/api/github/${user}/activity`)
    }

})