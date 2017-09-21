(function () {
    'use strict';

    angular.module("appTodoList")
        .controller("todoListController", todoListController);

    function todoListController($scope, $location, todoList, todoItem) {         
        $scope.todoList = todoList.get();

        if ($scope.todoList.length == 0) {
            todoList.getFromServer($scope)
        }

        $scope.getDeadlineColor = todoItem.getDeadlineColor;

        $scope.getDeadline = todoItem.toClientShortFormat;

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