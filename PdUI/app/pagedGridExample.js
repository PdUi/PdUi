(function () {
    'use strict';

    var app = angular.module('app');

    app.controller('PagedGridController', ['individualFactory', pagedGridController]);

    function pagedGridController(individualFactory) {
        var vm = this;

        var allRecords = [];

        vm.settings = {
            pager: {
                pageSize: 10,
                currentPage: 1
            },
            grid: {
                enableInlineEditing: false
            }
        }

        vm.data = {
            totalNumberOfRecords: 100,
            columnDefinitions: [{ id: 'firstName', title: 'First Name' }, { id: 'lastName', title: 'Last Name' }]
        }

        vm.pageAction = function(pageIndex){
            var index = pageIndex || vm.settings.pager.currentPage;
            vm.data.rows = _.first(_.rest(allRecords, (index - 1) * vm.settings.pager.pageSize), vm.settings.pager.pageSize);
        }

        vm.gridActions = [];

        vm.sort = function (column, sortDirection) {
            allRecords = _.sortBy(allRecords, column.id);
            if (sortDirection === 'descending') {
                allRecords.reverse();
            }

            return _.first(_.rest(allRecords, (vm.settings.pager.currentPage - 1) * vm.settings.pager.pageSize), vm.settings.pager.pageSize);
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

        var generateGridRows = function () {
            if (vm.data.totalNumberOfRecords > 0 && !allRecords.length) {
                for (var i = 0; i < vm.data.totalNumberOfRecords; i++) {
                    allRecords.push(new individualFactory.CreateIndividual());
                }
            }

            vm.pageAction();
        }

        generateGridRows();
    };
})();