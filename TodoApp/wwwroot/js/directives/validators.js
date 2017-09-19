(function () {
    'use strict';

    angular.module("appTodoList")
        .directive("invalidDate", invalidDate);

    function invalidDate() {
        return {
            require: "ngModel",
            restrict: "A", // Attributes only
            link: function (scope, element, attrs, ctrl) {
                ctrl.$validators.invalidDate = function (value) {
                    return moment(value, ["DD/MM/YYYY HH:mm"]).isValid();
                }
            }
        };
    }
})();