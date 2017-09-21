(function () {
    "use strict";

    angular.module("appTodoList")
        .factory("todoItem", function (moment, $http, $location, $sce, todoList) {
            var todoItem = {
                properties: {
                    id: null,
                    name: null,
                    priority: null,
                    dueDateTime: null,
                    comment: null
                },

                index: null,

                priorityOptions: [
                    {
                        value: "1",
                        name: "Low"
                    },
                    {
                        value: "2",
                        name: "Normal"
                    },
                    {
                        value: "3",
                        name: "High"
                    }
                ],

                /*
                    This function gets called by click handlers
                    of 'view', 'edit' and 'complete' buttons of a list item.
                    It passes corresponding data and saves it
                    to the 'todoItem' object
                */
                set: function (todo, index) {
                    angular.copy(todo, todoItem.properties);
                    if (index === "undefined") {
                        todoItem.index = null;
                    }
                    else {
                        todoItem.index = index;
                    }
                },

                /*
                    Gets called after 'view', 'edit' or 'complete'
                    operation is done on a list item so that 'todoItem'
                    object can be used by another operation
                */
                reset: function () {
                    todoItem.properties = {
                        id: null,
                        name: null,
                        priority: null,
                        dueDateTime: null,
                        comment: null
                    };

                    todoItem.index = null;
                },

                /*
                    Functions whith REST API requests
                */

                saveNewTodo: function (scope) {
                    return function () {
                        var date = scope.todo.dueDateTime,
                            todo = {};

                        todo.name = scope.todo.name;
                        todo.priority = scope.todo.priority;
                        todo.dueDateTime = todoItem.toServerFormat(date);
                        todo.comment = scope.todo.comment;

                        scope.isBusy = true;
                        scope.errorMessage = "";

                        $http.post("/api/todos", todo)
                            .then(function (response) {
                                todoList.addTodo(response.data);
                                $location.path("#/");
                            }, function (response) {
                                scope.errorMessage = "Failed to save a task to the server";
                            })
                            .finally(function () {
                                scope.isBusy = false;
                            });
                    }
                },

                updateTodo: function (scope) {
                    return function () {                      
                        scope.todo.dueDateTime = todoItem.toServerFormat(scope.todo.dueDateTime);

                        scope.isBusy = true;
                        scope.errorMessage = "";

                        $http.put("/api/todos/" + scope.todo.id, scope.todo)
                            .then(function () {
                                todoList.setTodoAtIndex(scope.todo, todoItem.index);
                                todoItem.reset();
                                $location.path("#/");
                            }, function (response) {
                                scope.errorMessage = "Failed to update a task on the server";
                            })
                            .finally(function () {
                                scope.isBusy = false;
                            });
                    }
                },

                removeTodo: function (scope) {
                    return function () {
                        scope.errorMessage = "";

                        $http.delete("/api/todos/" + todoItem.properties.id)
                            .then(function () {
                                todoList.removeTodo(todoItem.index);
                                todoItem.reset();
                            }, function (response) {
                                scope.errorMessage = "Failed to delete a task from the server";
                            });
                    }
                },

                /*
                    Formatting helper functions
                */

                getDeadlineColor: function (todo) {
                    var now = moment().format(todoItem.serverDatetimeFormat),
                        utcOffset = moment().utcOffset(),
                        deadline = todo.dueDateTime,
                        color = "red",
                        date;

                    date = moment(deadline, todoItem.serverDatetimeFormat)
                        .add(utcOffset, 'm');

                    if (date.isSameOrAfter(now)) {
                        color = "green";
                    }

                    return color;
                },

                getStarsMarkup: function (priority) {
                    var html = "",
                        i;

                    for (i = 1; i <= priority; i++) {
                        html += '<i class="fa fa-star"></i>';
                    }

                    return $sce.trustAsHtml(html);
                },

                getPriorityName: function (priority) {
                    var found;

                    found = todoItem.priorityOptions.find(function (option) {
                        return option.value == priority.toString();
                    });

                    return found.name;
                },

                /*
                    Date/Time formatting helpers
                */

                toClientFormat: function (fromDate) {
                    var fromFormat = "YYYY-MM-DD HH:mm:ss",
                        toFormat = "DD/MM/YYYY HH:mm",
                        toServerFlag = false;
                    return getDateFormatted(fromDate, fromFormat, toFormat, toServerFlag);
                },

                toClientShortFormat: function (fromDate) {
                    var fromFormat = "YYYY-MM-DD HH:mm:ss",
                        toFormat = "DD/MM/YYYY",
                        toServerFlag = false;
                    return getDateFormatted(fromDate, fromFormat, toFormat, toServerFlag);
                },

                toServerFormat: function (fromDate) {
                    var toFormat = "YYYY-MM-DD HH:mm:ss",
                        fromFormat = "DD/MM/YYYY HH:mm",
                        toServerFlag = true;

                    return getDateFormatted(fromDate, fromFormat, toFormat, toServerFlag);
                },

                /*
                    Setting up initial data for views

                    1 - If a view was opened from the list view
                */

                setUpInfoScope: function (scope) {
                    var date = todoItem.properties.dueDateTime,
                        priority = todoItem.properties.priority;

                    scope.todo = {};

                    scope.todo.name = todoItem.properties.name;
                    scope.todo.dueDateTime = todoItem.toClientFormat(date);
                    scope.todo.comment = todoItem.properties.comment;

                    scope.stars = todoItem.getStarsMarkup(priority);
                    scope.priorityName = todoItem.getPriorityName(priority);
                },

                setUpEditScope: function (scope) {
                    var date = todoItem.properties.dueDateTime,
                        priority = todoItem.properties.priority;

                    scope.todo = {};

                    scope.todo.id = todoItem.properties.id;
                    scope.todo.name = todoItem.properties.name;
                    scope.todo.dueDateTime = todoItem.toClientFormat(date);
                    scope.todo.comment = todoItem.properties.comment;

                    scope.priorityOptions = todoItem.priorityOptions;
                    scope.todo.priority = priority.toString();
                },

                /*
                    2 - If a view was not opened from the list view (page has been refreshed)
                */

                setUpEditScopeFromServer: function (todoId, scope) {
                    var setUpFunc = todoItem.setUpEditScope;

                    return setUpScopeFromServer(todoId, scope, setUpFunc);
                },

                setUpInfoScopeFromServer: function (todoId, scope) {
                    var setUpFunc = todoItem.setUpInfoScope;

                    return setUpScopeFromServer(todoId, scope, setUpFunc);
                },
            };

            function getDateFormatted(fromDate, fromFormat, toFormat, toServerFlag) {
                var utcOffset = moment().utcOffset(),
                    date, dateFormatted;

                date = moment(fromDate, fromFormat);

                if (toServerFlag) {
                    date = date.subtract(utcOffset, 'm');
                }
                else {
                    date = date.add(utcOffset, 'm');
                }

                dateFormatted = date.format(toFormat);
                return dateFormatted;
            }

            function setUpScopeFromServer(todoId, scope, setUpFunc) {
                scope.isBusy = true;
                scope.errorMessage = "";

                $http.get("/api/todos/" + todoId)
                    .then(function (response) {
                        angular.copy(response.data, todoItem.properties);
                        setUpFunc(scope);
                        todoItem.reset();
                    }, function () {
                        scope.errorMessage = "Failed to load data from the server. Check the link and try again";
                    })
                    .finally(function () {
                        scope.isBusy = false;
                    });
            }

            return todoItem;
        });
})();