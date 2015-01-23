(function () {
    'use strict';

    var app = angular.module('app');

    app.controller('PagerController', [pagerController]);
    
    function pagerController() {
        var vm = this;
        vm.pagerSettings = {};

        vm.pagerSettings.enablePageInput = true;
        vm.pagerSettings.enablePageArrows = true;
        vm.pagerSettings.enableFirstLastPageArrows = true;

        vm.pageSizes = [5, 10, 25, 50, 100];
        vm.pagerSettings.pageSize = 10;
        vm.pagerSettings.totalNumberOfRecords = 100;

        vm.maxNumberPagerButtonsOptions = _.range(5, 101);
        vm.pagerSettings.maxExplicitPages = 7;
    };
})();