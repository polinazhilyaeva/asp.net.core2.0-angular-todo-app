(function () {
    "use strict";

    angular.module("appTodoList")
        .factory('todoList', function () {
            var todoList = {
                list: []
            };

            todoList.get = function () {
                return todoList.list;
            };

            todoList.set = function (list) {
                todoList.list = list;
            }

            todoList.addTodo = function (todo) {
                todoList.list.push(todo);
            };
            
            todoList.removeTodo = function (index) {
                todoList.list.splice(index, 1);
            };

            todoList.setTodoAtIndex = function (todo, index) {
                todoList.list[index] = todo;
            };

            return todoList;
        });
})();