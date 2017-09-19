(function () {
    'use strict';

    angular.module("appTodoList", ["elements", "ngRoute", "angularjs-datetime-picker", "angularMoment"])
        .config(function ($routeProvider, $locationProvider) {
            $routeProvider.when("/", {
                controller: "todoListController",
                templateUrl: "/views/todoListView.html"
            });

            $routeProvider.when("/edit/:todoId", {
                controller: "editTodoController",
                templateUrl: "/views/editTodoView.html"
            });
            
            $routeProvider.when("/new", {
                controller: "newTodoController",
                templateUrl: "/views/newTodoView.html"
            });

            $routeProvider.otherwise({
                redirectTo: "/"
            });

            $locationProvider.hashPrefix('');
        });
})();