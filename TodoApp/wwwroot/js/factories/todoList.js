(function () {
    "use strict";

    angular.module("appTodoList")
        .factory("todoList", function () {
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
                }
            };

            return todoList;
        });
})();