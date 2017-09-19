(function () {
    'use strict';

    angular.module("appTodoList")
        .controller("editTodoController", editTodoController);

    function editTodoController($scope, $http, $routeParams, $location, moment, todoList, todoItem) {
        var index = todoItem.getIndex(),
            todoProperties = todoItem.getProperties();

        $scope.todo = {};
        $scope.errorMessage = "";
        $scope.isBusy = true;

        $scope.updateTodo = function () {
            $scope.todo.dueDateTime = todoItem.getDateFormattedForServer($scope.todo.dueDateTime);
            $scope.todo.priority = $scope.priority;
            $scope.isBusy = true;

            $http.put("/api/todos/" + $routeParams.todoId, $scope.todo)
                .then(function () {
                    $scope.isBusy = false;
                    todoList.setTodoAtIndex($scope.todo, index);
                    $location.path("#/");
                }, function (response) {
                    $scope.errorMessage = "Failed to update a task on the server";
                })
                .finally(function () {
                    $scope.isBusy = false;
                });
        }

        if (todoProperties.id !== null) {
            /* If a task to edit was passed from another view
            */
            angular.copy(todoProperties, $scope.todo);
            todoItem.reset();
            setupTodoView();
            $scope.isBusy = false;
        }
        else {
            /* If 'Edit View' was not opened from another view 
             * or if a page has been refreshed
             */
            $http.get("/api/todos/" + $routeParams.todoId)
                .then(function (response) {
                    angular.copy(response.data, $scope.todo);
                    setupTodoView();
                }, function () {
                    $scope.errorMessage = "Failed to load data from the server. Check the link and try again";
                })
                .finally(function () {
                    $scope.isBusy = false;
                });
        }

        function setupTodoView() {
            $scope.priorityOptions = todoItem.getPriorityOptions();
            $scope.priority = $scope.todo.priority.toString();
            $scope.todo.dueDateTime = todoItem.getDateFormattedForClient($scope.todo.dueDateTime);
        }
    }
})();