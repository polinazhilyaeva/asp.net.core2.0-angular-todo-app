(function () {
    'use strict';

    angular.module("appTodoList")
        .controller("viewTodoController", viewTodoController);

    function viewTodoController($scope, $http, $routeParams, todoItem) {
        /* If a task to view was passed from another view -
           no need to send a request to server */
        if (todoItem.properties.id !== null) {
            todoItem.setUpInfoScope($scope);
        }
        /* Otherwise, if 'Info View' was not opened from another view 
         * or if a page has been refreshed - get data from server */
        else {
            todoItem.setUpInfoScopeFromServer($routeParams.todoId, $scope);
        }
    }
})();