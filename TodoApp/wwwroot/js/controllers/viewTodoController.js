(function () {
    'use strict';

    angular.module("appTodoList")
        .controller("viewTodoController", viewTodoController);

    function viewTodoController($scope, $http, sharedData) {
        var todoIndex = sharedData.deleteTodoIndex,
            todoId = sharedData.deleteTodoId,
            todos = sharedData.todoList;

        $scope.modalId = "viewTodoModal";

        $scope.deleteTodo = function () {
            $http.delete("/api/todos/" + todoId)
                .then(function () {
                    todos.splice(todoIndex, 1);
                }, function (response) {
                    $scope.errorMessage = "Failed to delete a task from the server";
                });
        }
    }
})();