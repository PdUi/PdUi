(function () {
    'use strict';

    var app = angular.module('app');

    app.controller('GridController', ['$scope', 'individualFactory', gridController]);

    function gridController($scope, individualFactory) {
        var vm = this;

        vm.numberOfRecords = vm.numberOfRecords || 20;
        vm.gridSettings = { enableInlineEditing: false };

        vm.edit = function (individual) {
            console.log('edit:' + individual.id);
        };

        vm.sort = function (column, sortDirection) {
            var sortedRows = _.sortBy(vm.gridData.rows, column.id);
            if (sortDirection === 'descending') {
                sortedRows.reverse();
            }
            console.log('sort:' + column.id);

            return sortedRows;
        };
        
        vm.view = function (individual) {
            console.log('view:' + individual.id);
        };
        
        vm.delete = function (individual) {
            console.log('delete:' + individual.id);
        };

        vm.addAction = function (actionName) {
            var action = _.find(vm.gridActions, function (gridAction) { return gridAction.name.toLowerCase() === actionName; });
            
            if (!action) {
                if (actionName === 'view') {
                    vm.gridActions.push({ name: 'View', action: vm.view });
                } else if (actionName === 'edit') {
                    vm.gridActions.push({ name: 'Edit', action: vm.edit });
                } else if (actionName === 'delete') {
                    vm.gridActions.push({ name: 'Delete', action: vm.delete });
                } else if (actionName === 'sort') {
                    vm.gridActions.push({ name: 'Sort', action: vm.sort });
                } else {
                    
                }
            } else {
                vm.gridActions = _.filter(vm.gridActions, function (gridAction) { return gridAction.name.toLowerCase() !== actionName; });
            }
        };

        //vm.userEnteredFunction = '';
        //vm.userEnteredFunctionName = '';

        //vm.createGridFunction = function() {
        //    if (vm.userEnteredFunction !== '' && vm.userEnteredFunctionName != '') {
        //        vm.gridActions.push({ name: vm.userEnteredFunctionName, action: Function(vm.userEnteredFunction) });
        //    }
        //}
        
        //http://stackoverflow.com/questions/196972/convert-string-to-title-case-with-javascript
        //function toTitleCase(str) {
        //    return str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
        //}
        
        vm.gridActions = [];

        vm.gridData = {
            columnDefinitions: [
                { id: 'firstName', title: 'First Name' },
                { id: 'lastName', title: 'Last Name' }
            ],
            rows: generateGridRows()
        };
        
        $scope.$watch(
            'gvm.numberOfRecords',
            function () {
                vm.gridData.rows = generateGridRows();
            },
            true
        );

        function generateGridRows() {
            var rows = [];

            if (vm.numberOfRecords > 0) {
                for (var i = 0; i < vm.numberOfRecords; i++) {
                    rows.push(new individualFactory.CreateIndividual());
                }
            }

            return rows;
        }
    };
})();