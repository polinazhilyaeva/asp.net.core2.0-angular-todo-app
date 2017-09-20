(function () {
    'use strict';

    angular.module("appTodoList")
        .controller("editTodoController", editTodoController);

    function editTodoController($scope, $http, $routeParams, $location, todoList, todoItem) {
        var todoProperties = todoItem.properties,
            index = todoItem.index;

        $scope.todo = {};
        $scope.list = todoList;

        $scope.errorMessage = "";
        $scope.isBusy = true;

        // If a task to edit was passed from another view
        if (todoProperties.id !== null) {
            angular.copy(todoProperties, $scope.todo);
            todoItem.reset();
            $scope.isBusy = false;

            $scope.priorityOptions = todoItem.priorityOptions;
            $scope.priority = $scope.todo.priority.toString();
            $scope.todo.dueDateTime = todoItem.getDateFormattedForClient($scope.todo.dueDateTime);
        }
        /* If 'Edit View' was not opened from another view
         * or if a page has been refreshed */
        else {
            $scope = todoItem.getFromServer($routeParams.todoId, $scope);
        }

        $scope.updateTodo = function () {
            $scope.todo.dueDateTime = todoItem.getDateFormattedForServer($scope.todo.dueDateTime);
            $scope.todo.priority = $scope.priority;
            $scope.isBusy = true;

            $scope = todoItem.updateOnServer($routeParams.todoId, index, $scope);
        }
    }
})();