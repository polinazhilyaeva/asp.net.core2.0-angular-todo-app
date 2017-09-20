(function () {
    'use strict';

    angular.module("elements", [])
        .directive("loadingSpinner", loadingSpinner);

    angular.module("elements")
        .directive("deleteConfirmModal", deleteConfirmModal);
    
    function loadingSpinner () {
        return {
            scope: {
                show: "=displayWhen"
            },
            templateUrl: "/views/loadingSpinner.html"
        };
    }

    function deleteConfirmModal() {
        return {
            templateUrl: "/views/deleteConfirmModal.html",
            controller: "deleteTodoController"
        };
    }
})();