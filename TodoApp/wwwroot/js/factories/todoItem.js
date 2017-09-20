(function () {
    "use strict";

    angular.module("appTodoList")
        .factory("todoItem", function (moment, $http, $location, $sce) {
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

                set: function (_todo, _index) {
                    angular.copy(_todo, todoItem.properties);
                    if (_index === "undefined") {
                        todoItem.index = null;
                    }
                    else {
                        todoItem.index = _index;
                    }
                },

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

                getFromServer: function (todoId, scope) {
                    $http.get("/api/todos/" + todoId)
                        .then(function (response) {
                            angular.copy(response.data, scope.todo);
                            scope.priorityName = todoItem.getPriorityName(scope.todo.priority);
                            scope.todo.dueDateTime = todoItem.getDateFormattedForClient(scope.todo.dueDateTime);
                        }, function () {
                            scope.errorMessage = "Failed to load data from the server. Check the link and try again";
                        })
                        .finally(function () {
                            scope.isBusy = false;
                        });

                    return scope;
                },

                updateOnServer: function (todoId, todoIndex, scope) {
                    $http.put("/api/todos/" + todoId, scope.todo)
                        .then(function () {
                            scope.isBusy = false;
                            scope.list.setTodoAtIndex(scope.todo, todoIndex);
                            $location.path("#/");
                        }, function (response) {
                            scope.errorMessage = "Failed to update a task on the server";
                        })
                        .finally(function () {
                            scope.isBusy = false;
                        });

                    return scope;
                },

                getDateFormattedForClient: function (fromDate) {
                    var fromFormat = "YYYY-MM-DD HH:mm:ss",
                        toFormat = "DD/MM/YYYY HH:mm",
                        toServerFlag = false;
                    return getDateFormatted(fromDate, fromFormat, toFormat, toServerFlag);
                },

                getDateFormattedForClientShort: function (fromDate) {
                    var fromFormat = "YYYY-MM-DD HH:mm:ss",
                        toFormat = "DD/MM/YYYY",
                        toServerFlag = false;
                    return getDateFormatted(fromDate, fromFormat, toFormat, toServerFlag);
                },

                getDateFormattedForServer: function (fromDate) {
                    var toFormat = "YYYY-MM-DD HH:mm:ss",
                        fromFormat = "DD/MM/YYYY HH:mm",
                        toServerFlag = true;

                    return getDateFormatted(fromDate, fromFormat, toFormat, toServerFlag);
                },

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
                }
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

            return todoItem;
        });
})();