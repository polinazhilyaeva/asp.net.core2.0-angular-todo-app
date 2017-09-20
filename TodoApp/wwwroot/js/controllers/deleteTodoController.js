(function () {
    'use strict';

    angular.module("appTodoList")
        .controller("deleteTodoController", deleteTodoController);

    function deleteTodoController($scope, $http, todoList, todoItem) {
        var todoIndex = todoItem.index,
            todoId = todoItem.properties.id;
        
        $scope.deleteModalId = "deleteTodoModal";
        todoItem.reset();

        $scope.deleteTodo = function () {
            $http.delete("/api/todos/" + todoId)
                .then(function () {
                    todoList.removeTodo(todoIndex);
                }, function (response) {
                    $scope.errorMessage = "Failed to delete a task from the server";
                });
        }
    }
})();