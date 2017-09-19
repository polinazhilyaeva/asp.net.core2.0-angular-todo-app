(function () {
    'use strict';

    angular.module("appTodoList")
        .controller("todoListController", todoListController);

    function todoListController($scope, $http, $location, moment, todoList, todoItem) {
        var serverDatetimeFormat = "YYYY-MM-DD HH:mm:ss",
            clientDatetimeFormat = "DD/MM/YYYY",
            utcOffset = moment().utcOffset(),
            now = moment().format(serverDatetimeFormat);

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

        $scope.getDeadlineColor = function (todo) {
            var deadline = todo.dueDateTime,
                color = "red",
                date;

            date = moment(deadline, serverDatetimeFormat)
                .add(utcOffset, 'm');

            if (date.isSameOrAfter(now)) {
                color = "green";
            }

            return color;
        }

        $scope.getDeadline = function (todo) {
            var utcOffset = moment().utcOffset(),
                date, dateFormatted;

            date = moment(todo.dueDateTime, serverDatetimeFormat)
                .add(utcOffset, 'm');
            dateFormatted = date.format(clientDatetimeFormat);

            return dateFormatted;
        }

        $scope.getArray = function (priority) {
            return new Array(parseInt(priority));
        }

        $scope.viewTodo = function (todo) {
            todoItem.set(todo);
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