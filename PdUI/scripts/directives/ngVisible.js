(function() {
    'use strict';

    angular.module('app')
           .directive('ngVisible', ngVisibleDirective);

    function ngVisibleDirective() {
        return {
            restrict: 'A',
            multiElement: true,
            link: function (scope, element, attr) {
                scope.$watch(attr.ngVisible, function ngVisibleWatchAction(value) {
                    if (value) {
                        element.css('visibility', 'visible');
                    } else {
                        element.css('visibility', 'hidden');
                    }
                });
            }
        };
    }
})();