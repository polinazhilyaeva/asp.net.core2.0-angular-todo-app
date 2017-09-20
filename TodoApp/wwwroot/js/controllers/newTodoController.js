(function () {
    'use strict';

    angular.module("appTodoList")
        .controller("newTodoController", newTodoController);

    function newTodoController($scope, $http, $location, todoList, todoItem) {
        $scope.priorityOptions = todoItem.priorityOptions;

        $scope.addTodo = function () {
            var date = $scope.newTodo.dueDateTime;

            $scope.newTodo.dueDateTime = todoItem.getDateFormattedForServer(date);
            $scope.newTodo.priority = $scope.priority;
            $scope.errorMessage = "";

            $http.post("/api/todos", $scope.newTodo)
                .then(function (response) {
                    todoList.addTodo(response.data);
                    $location.path("#/");
                }, function (response) {
                    $scope.errorMessage = "Failed to save a task to the server";
                });
        };
    }
})();