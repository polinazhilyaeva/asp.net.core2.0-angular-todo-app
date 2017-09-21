(function () {
    'use strict';

    angular.module("appTodoList")
        .controller("newTodoController", newTodoController);

    function newTodoController($scope, todoItem) {
        // Set options in dropdown list
        $scope.priorityOptions = todoItem.priorityOptions;

        // Set on-click action of 'Save' button
        $scope.addTodo = todoItem.saveNewTodo($scope);
    }
})();