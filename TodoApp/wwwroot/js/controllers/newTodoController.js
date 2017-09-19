(function () {
    'use strict';

    angular.module("appTodoList")
        .controller("newTodoController", newTodoController);

    function newTodoController($scope, $http, $location, moment, sharedData, todoList, todoItem) {
        $scope.priorityOptions = todoItem.priorityOptions;

        $scope.addTodo = function () {
            var utcOffset = moment().utcOffset(),
                momentObject = moment($scope.newTodo.dueDateTime, 'DD-MM-YYYY HH:mm'),
                momentDate = momentObject.add(utcOffset, 'm').format('YYYY-MM-DD HH:mm'),
                dateFormatted = new Date(momentDate);

            $scope.newTodo.dueDateTime = dateFormatted;
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