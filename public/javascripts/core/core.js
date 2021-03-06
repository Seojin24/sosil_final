var id = 0;

var app = angular.module('mainApp', [
    'ngRoute', 
    'ngFileUpload',   
    'ngCookies', 
    'ngSanitize',
    'angular-thumbnails',
    'LocalStorageModule'
]);

app.filter('offset', function() {
    return function(input, start) {
        if (!input || !input.length) { return; }
        start = +start; //parse to int
        return input.slice(start);
    };
});


// Session storage 초기화.
app.config(function (localStorageServiceProvider) {
    localStorageServiceProvider
        .setPrefix('sessionS')
        .setStorageType('sessionStorage')
        .setNotify(true, true)
});

app.run(['$rootScope', '$http', '$location', '$controller', function($rootScope, $http,$location, $controller) {

    $http.get('/member/getSession').then(function(data) {
        if(!data.error)
            $rootScope.session = data.data;
    });


  //로그인 상태인지 체크
    $rootScope.loginInterceptor = function() {
        if(!$rootScope.session){
            $location.path( "/main#/login" );
        }

    };
  //로그아웃 상태인지 체크
    $rootScope.logoutInterceptor = function() {
        if($rootScope.session){
            $location.path( "/main#/" );
        }
    };
}]);




app.config(function ($routeProvider) {
    $routeProvider
    //template
    .when('/', {
        controller: 'mainCtrl',
        templateUrl: '/views/main.html'
    })
        .when('/login', {
            // controller: 'loginCtrl',
            templateUrl: '/views/login.html'
        })
        .when('/cart', {
            controller: 'cartCtrl',
            templateUrl: '/views/cart.html'
        })
        .when('/admin', {
            controller: 'mainCtrl',
            templateUrl: '/views/admin.html'
        })
        .when('/item/register',{
            controller:'itemCtrl',
            templateUrl:'/views/item_register.html'
        })
        .when('/item/:category',{
            controller:'itemCtrl',
            templateUrl:'/views/item_layout.html'
        })
        .when('/member/info', {
            controller: 'memberCtrl',
            templateUrl: '/views/member-info.html'
        })
    .otherwise({
      redirectTo: '/'
    });
});

app.config(['$compileProvider', function ($compileProvider) {
    $compileProvider.debugInfoEnabled(false);
}]);

//unsafe javascript:void(0) 앞 unsafe 딱지 때줌
app.config(function($compileProvider){
  $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|javascript):/);
});
