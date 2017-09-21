(function () {
    "use strict";

    angular.module("appTodoList")
        .factory("todoList", function ($http) {
            var todoList = {
                list: [],

                get: function () {
                    return todoList.list;
                },

                set: function (list) {
                    todoList.list = list;
                },

                addTodo: function (todo) {
                    todoList.list.push(todo);
                },
            
                removeTodo: function (index) {
                    todoList.list.splice(index, 1);
                },

                setTodoAtIndex: function (todo, index) {
                    todoList.list[index] = todo;
                },

                getFromServer: function (scope) {
                    scope.isBusy = true;
                    scope.errorMessage = "";

                    $http.get("/api/todos")
                        .then(function (response) {
                            angular.copy(response.data, scope.todoList);
                            todoList.set(scope.todoList);
                        }, function () {
                            scope.errorMessage = "Failed to load todo list from the server";
                        })
                        .finally(function () {
                            scope.isBusy = false;
                        });
                }
            };

            return todoList;
        });
})();