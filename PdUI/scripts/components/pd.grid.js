(function () {
    'use strict';

    angular.module('app')
           .directive('pdGrid', pdGridDirective)
           .controller('PdGridCtrl', ['$scope', '$timeout', pdGridController]);

    function pdGridDirective() {
        return {
            scope: {
                'actions': '=',
                'data': '=',
                'settings': '='
            },
            templateUrl: 'templates/components/pd.grid.html',
            controller: 'PdGridCtrl',
            controllerAs: 'gridVm',
            restrict: 'E'
        };
    }

    function pdGridController($scope, $timeout) {
        var vm = this;

        vm.actions = $scope.actions || [];
        vm.data = $scope.data || {};
        vm.settings = $scope.settings || {};
        
        vm.gridActions = _.filter(vm.actions, function (action) { return action.name.toLowerCase() !== 'sort'; });
        
        vm.columnDefinitions = vm.data.columnDefinitions || [];
        vm.rows = vm.data.rows || [];

        vm.selectedColumnDefinitionId = '';
        vm.selectedRowId = 0;
        vm.onclick = function (event, columnDefinition, row) {
            if (vm.settings.enableInlineEditing) {
                vm.selectedColumnDefinitionId = columnDefinition.id;
                vm.selectedRowId = row.id;
            
                var inputElement = angular.element(event.currentTarget).children()[0];
                 $timeout(function () {
                    inputElement.select();
                    
                }, 1);
            }
        };

        vm.onblur = function() {
            vm.selectedColumnDefinitionId = '';
            vm.selectedRowId = 0;
        };
        
        vm.sortedColumn = '';
        vm.sortDirection = 'none';
        
        vm.sort = function(columnDefinition) {
            var sortAction = _.find(vm.actions, function (action) { return action.name.toLowerCase() === 'sort'; });
            
            if (sortAction) {
                if (vm.sortedColumn !== columnDefinition.id) {
                    vm.sortDirection = 'none';
                }

                if (vm.sortDirection === 'none') {
                    vm.sortedColumn = columnDefinition.id;
                    vm.sortDirection = 'ascending';
                } else if (vm.sortDirection === 'ascending') {
                    vm.sortedColumn = columnDefinition.id;
                    vm.sortDirection = 'descending';
                } else {
                    vm.sortedColumn = '';
                    vm.sortDirection = 'none';
                }
                
                var sortResults = sortAction.action(columnDefinition, vm.sortDirection);
                vm.rows = sortResults;
            }
        };
        
        $scope.$watch(
            'data',
            function () {
                vm.rows = vm.data.rows;
            },
            true
        );

        $scope.$watch(
            'actions',
            function () {
                vm.gridActions = _.filter($scope.actions, function (action) { return action.name.toLowerCase() !== 'sort'; });
            },
            true
        );
    }
})();