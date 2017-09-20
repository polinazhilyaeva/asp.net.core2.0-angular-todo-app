(function () {
    'use strict';

    angular.module("appTodoList")
        .controller("viewTodoController", viewTodoController);

    function viewTodoController($scope, $http, $routeParams, todoItem) {
        var todoProperties = todoItem.properties;

        $scope.todo = {};

        $scope.errorMessage = "";
        $scope.isBusy = true;

        $scope.getStars = todoItem.getStarsMarkup;

        // If a task to view was passed from another view
        if (todoProperties.id !== null) {
            angular.copy(todoProperties, $scope.todo);

            $scope.isBusy = false;
            todoItem.reset(); 
            
            $scope.todo.dueDateTime = todoItem.getDateFormattedForClient($scope.todo.dueDateTime);
            $scope.priorityName = todoItem.getPriorityName($scope.todo.priority);
        }
        /* If 'Info View' was not opened from another view 
         * or if a page has been refreshed */
        else {
            $scope = todoItem.getFromServer($routeParams.todoId, $scope);
        }
    }
})();