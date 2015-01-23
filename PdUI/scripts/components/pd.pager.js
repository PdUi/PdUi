(function () {
    'use strict';

    angular.module('app')
           .directive('pdPager', pdPagerDirective)
           .controller('PdPagerCtrl', ['$scope', pdPagerController]);
    
    function pdPagerDirective() {
        return {
            scope: {
                'settings': '='
            },
            templateUrl: 'templates/components/pd.pager.html',
            controller: 'PdPagerCtrl',
            controllerAs: 'pagerVm',
            restrict: 'E'
        };
    }

    function pdPagerController($scope) {
		var vm = this;
		vm.settings = $scope.settings || {};
        vm.isValidPageInput = true;

        vm.pageBackward = function () {
            if (vm.canPageBackward) {
                vm.settings.currentPage--;
            }
        };

        vm.pageForward = function () {
            if (vm.canPageForward) {
                vm.settings.currentPage++;
            }
        };

        vm.pageTo = function (pageNumber) {
            vm.settings.currentPage = pageNumber;
        };

        vm.pageToFirst = function () {
            vm.settings.currentPage = 1;
        };

        vm.pageToLast = function () {
            vm.settings.currentPage = vm.totalPages;
        };

		vm.updateCurrentPage = function() {
			if (vm.pageInput && !isNaN(vm.pageInput) && vm.pageInput >= 1 && vm.pageInput <= vm.totalPages) {
                    vm.isValidPageInput = true;
                    vm.settings.currentPage = vm.pageInput;
                } else {
                    vm.isValidPageInput = false;
                }
		};

        $scope.$watch(
            'pagerVm.settings',
            function () {
                updateViewState(vm.settings.currentPage);
            },
            true
        );

        function updateViewState(newPageInput) {
            vm.pageSize = parseInt(vm.settings.pageSize) || 10;
            vm.totalNumberOfRecords = parseInt(vm.settings.totalNumberOfRecords) || 0;
            vm.maxExplicitPages = window.Math.max((parseInt(vm.settings.maxExplicitPages) || 7), 5);
            vm.totalPages = vm.totalNumberOfRecords > 0 ? window.Math.ceil(vm.totalNumberOfRecords / vm.pageSize) : 0;
            vm.settings.currentPage = parseInt(vm.settings.currentPage) || 1;
            newPageInput = newPageInput || vm.settings.currentPage;
            vm.enablePageInput = !angular.isUndefined(vm.settings.enablePageInput) ? vm.settings.enablePageInput && vm.totalPages > 1 : vm.totalPages > 1;
            vm.pageInput = newPageInput;
            vm.enablePageArrows = !angular.isUndefined(vm.settings.enablePageArrows) ? vm.settings.enablePageArrows && vm.totalPages > 1 : vm.totalPages > 1;
            vm.enableFirstLastPageArrows = !angular.isUndefined(vm.settings.enableFirstLastPageArrows) ? vm.enablePageArrows && vm.settings.enableFirstLastPageArrows : vm.enablePageArrows; // also vm.totalPages > 2?
            vm.canPageBackward = newPageInput > 1;
            vm.canPageForward = newPageInput < vm.totalPages;

            calculateButtonStates();
        }

        function calculateButtonStates() {
            var firstPage = 1;
            vm.hasMorePagesBackward = false;
            vm.hasMorePagesForward = false;

            if (vm.settings.currentPage > firstPage + 2 && vm.totalPages > vm.maxExplicitPages) {
                vm.hasMorePagesBackward = true;
            }

            if (vm.settings.currentPage < vm.totalPages - 2 && vm.totalPages > vm.maxExplicitPages) {
                vm.hasMorePagesForward = true;
            }

            var rangeStart;
            var rangeEnd;
            if (!vm.hasMorePagesBackward && !vm.hasMorePagesForward) {
                rangeStart = firstPage + 1;
                rangeEnd = vm.totalPages;
            } else if (!vm.hasMorePagesBackward) {
                rangeStart = firstPage + 1;
                rangeEnd = vm.maxExplicitPages - 1;
            } else if (!vm.hasMorePagesForward) {
                rangeEnd = vm.totalPages;
                rangeStart = vm.totalPages - vm.maxExplicitPages + 3;
            } else {
                var hasOddNumberOfButtons = (vm.maxExplicitPages % 2) === 1;
                var x = window.Math.ceil((vm.maxExplicitPages - 5) / 2);

                if (vm.settings.currentPage + x === vm.totalPages - 2) {
                    vm.hasMorePagesForward = false;
                    rangeStart = vm.settings.currentPage - x;
                    rangeEnd = vm.totalPages;
                } else
                    if (hasOddNumberOfButtons) {
                        rangeStart = vm.settings.currentPage - x;
                        rangeEnd = vm.settings.currentPage + x + 1;
                    } else {
                        rangeStart = vm.settings.currentPage - x + 1;
                        rangeEnd = vm.settings.currentPage + x + 1;
                    }
            }

            vm.range = _.range(rangeStart, rangeEnd);
        }
    }
})();