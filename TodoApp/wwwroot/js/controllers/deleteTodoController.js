(function () {
    'use strict';

    angular.module("appTodoList")
        .controller("deleteTodoController", deleteTodoController);

    function deleteTodoController($scope, todoItem) {
        // Set CSS id of a modal window
        $scope.deleteModalId = "deleteTodoModal";

        // Set on-click action of 'Complete task' button
        $scope.deleteTodo = todoItem.removeTodo($scope);
    }
})();