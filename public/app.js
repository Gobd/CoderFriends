angular.module('app', ['ui.router'])

.config(function($stateProvider, $urlRouterProvider, $httpProvider) {

    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
    $httpProvider.interceptors.push('myHttpInterceptor');

    $urlRouterProvider.otherwise("/");

    $stateProvider
        .state('home', {
            url: "/home",
            templateUrl: "./templates/home.html"
        })
        .state('friend', {
            url: "/friend/:github_username",
            templateUrl: "./templates/friend.html"
        });

})

.factory('myHttpInterceptor', function($q) {
    return {
        'responseError': function(rejection) {
            if (rejection.status == 403) {
                document.location = '/';
                return;
            }
            return $q.reject(rejection);
        }
    };
});