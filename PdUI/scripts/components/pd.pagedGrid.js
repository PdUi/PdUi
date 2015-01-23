(function () {
    'use strict';

    angular.module('app')
           .directive('pdPagedGrid', pdPagedGridDirective)
           .controller('PdPagedGridController', ['$scope', pdPagedGridController]);

    function pdPagedGridDirective() {
        return {
            scope: {
                'pageAction': '=',
                'gridActions': '=',
                'data': '=',
                'settings': '='
            },
            templateUrl: 'templates/components/pd.pagedGrid.html',
            controller: 'PdPagedGridController',
            controllerAs: 'pagedGridVm',
            restrict: 'E'
        };
    }

    function pdPagedGridController($scope) {
        var vm = this;

        vm.pageAction = $scope.pageAction;

        vm.gridActions = $scope.gridActions || [];
        vm.data = $scope.data || {};
        vm.settings = $scope.settings || {};

        vm.pagerSettings = vm.settings.pager || {};
        vm.pagerSettings.totalNumberOfRecords =  vm.data.totalNumberOfRecords || 0;

        vm.gridSettings = vm.settings.grid || {};

        vm.data.columnDefinitions = vm.data.columnDefinitions || [];
        vm.data.rows = vm.data.rows || [];

        $scope.$watch(
            'pagedGridVm.pagerSettings.currentPage',
            function (newVal, oldVal) {
                if(newVal != oldVal){
                    vm.pageAction(newVal);
                }
            },
            true
        );
    }
})();