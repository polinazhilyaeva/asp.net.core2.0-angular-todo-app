(function () {
    'use strict';

    angular.module("appTodoList")
        .controller("editTodoController", editTodoController);

    function editTodoController($scope, $routeParams, todoItem) {
        /* If a task to edit was passed from another view -
           no need to send a request to server */
        if (todoItem.properties.id !== null) {
            todoItem.setUpEditScope($scope);
        }
        /* Otherwise, if 'Edit View' was not opened from another view 
         * or if a page has been refreshed - get data from server */
        else {
            todoItem.setUpEditScopeFromServer($routeParams.todoId, $scope);
        }

        // Set on-click action of 'Save' button
        $scope.saveTodo = todoItem.updateTodo($scope);
    }
})();