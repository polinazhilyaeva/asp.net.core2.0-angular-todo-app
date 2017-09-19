(function () {
    "use strict";

    angular.module("appTodoList")
        .factory('todoItem', function (moment) {
            var todoItem = {
                index: null,
                properties: {
                    id: null,
                    name: null,
                    priority: null,
                    dueDateTime: null,
                    comment: null
                },
                serverDatetimeFormat: "YYYY-MM-DD HH:mm:ss",
                clientDatetimeFormat: "DD/MM/YYYY HH:mm",
                priorityOptions: [
                    {
                        value: "1",
                        name: "Low ★"
                    },
                    {
                        value: "2",
                        name: "Normal ★ ★"
                    },
                    {
                        value: "3",
                        name: "High ★ ★ ★"
                    }
                ]
            };

            todoItem.set = function (_todo, _index) {
                angular.copy(_todo, todoItem.properties);
                if (_index === "undefined") {
                    todoItem.index = null;
                }
                else {
                    todoItem.index = _index;
                }
            };

            todoItem.reset = function () {
                todoItem.properties = {
                    id: null,
                    name: null,
                    priority: null,
                    dueDateTime: null,
                    comment: null
                };
                todoItem.index = null;
            }

            todoItem.getIndex = function () {
                return todoItem.index;
            };

            todoItem.getProperties = function () {
                return todoItem.properties;
            };

            todoItem.getPriorityOptions = function () {
                return todoItem.priorityOptions;
            };

            todoItem.getDateFormattedForClient = function (fromDate) {
                var utcOffset = moment().utcOffset(),
                    date, dateFormatted;

                date = moment(fromDate, todoItem.serverDatetimeFormat)
                    .add(utcOffset, 'm');
                dateFormatted = date.format(todoItem.clientDatetimeFormat);
                return dateFormatted;
            }

            todoItem.getDateFormattedForServer = function (fromDate) {
                var utcOffset = moment().utcOffset(),
                    date, dateFormatted;

                date = moment(fromDate, todoItem.clientDatetimeFormat)
                    .subtract(utcOffset, 'm');

                dateFormatted = date.format(todoItem.serverDatetimeFormat);
                return dateFormatted;
            }
            
            return todoItem;
        });
})();