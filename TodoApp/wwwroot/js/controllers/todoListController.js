(function () {
    'use strict';

    angular.module("appTodoList")
        .controller("todoListController", todoListController);

    function todoListController($scope, $http, $location, todoList, todoItem) {         
        $scope.todoList = todoList.get();

        if ($scope.todoList.length == 0) {
            $scope.isBusy = true;
            $scope.errorMessage = "";

            $http.get("/api/todos")
                .then(function (response) {
                    angular.copy(response.data, $scope.todoList);
                    todoList.set($scope.todoList);
                }, function () {
                    $scope.errorMessage = "Failed to load todo list from the server";
                })
                .finally(function () {
                    $scope.isBusy = false;
                });
        }

        $scope.getDeadlineColor = todoItem.getDeadlineColor;

        $scope.getDeadline = todoItem.getDateFormattedForClientShort;

        $scope.getStars = todoItem.getStarsMarkup;
        
        $scope.viewTodo = function (todo) {
            todoItem.set(todo);
            $location.path("/view/" + todo.id);
        }

        $scope.editTodo = function (todo, index) {
            todoItem.set(todo, index);
            $location.path("/edit/" + todo.id);
        }

        $scope.completeTodo = function (todo, index) {
            todoItem.set(todo, index);
        }
    }
})();