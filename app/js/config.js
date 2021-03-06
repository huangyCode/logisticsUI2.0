/**`
 * Created by huangy on 2015/10/26.
 */
var appModule = angular.module('app', ['ui.router','ui.bootstrap','ngResource','ngMessages']);

appModule
    .run(['$rootScope', '$state', '$stateParams',
        function ($rootScope, $state, $stateParams) {
            $rootScope.state = $state;
            $rootScope.$stateParams = $stateParams;
            $rootScope.$on('$stateChangeStart', function () {
                if (!window.isPass) location.hash = "/index"
            });
        }
    ])
    //路由
   .config(['$stateProvider', '$urlRouterProvider',
        function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('/index');
            $stateProvider
                .state('index', {
                    url: '/index',
                    controller: 'mainCtrl',
                    templateUrl: 'tpls/main.html'
                })
            /*    .state('index.warehouse', {
                    url: '/warehouse',
                    templateUrl: 'tpls/bis/warehouselist.html'
                })
                .state('index.warehouseArea', {
                    url: '/warehousearea',
                    controller: 'bisWarehouseArea',
                    templateUrl: 'tpls/bis/bisWarehouseAreaList.html'
                })
                .state('index.warehouseLocation', {
                    url: '/warehouselocation',
                    templateUrl: 'tpls/bis/warehouseitem.html'
                })*/
        }
    ])
    .config(function ($httpProvider) {
        $httpProvider.interceptors.push('requestUrl');
        $httpProvider.interceptors.push('responseUrl');
        $httpProvider.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded;charset=utf-8";
    });
