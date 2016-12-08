/*!
 * Copyright 2016 PREGIOTEK
 * http://pregiotek.com/
 *
 * ion-floating-menu
 * Material UI-like Floating Action Button and Menu for Ionic applications.
 *
 * By @ennedigi
 *
 * Licensed under the MIT license. Please see LICENSE for more information.
 *
 */

(function () {
    'use strict';

    angular.module('ion-floating-menu', [])

            .directive('ionFloatingButton', ionFloatingButton)
            .directive('ionFloatingMenu', ionFloatingMenu)
            .directive('ionFloatingItem', ionFloatingItem)
            .factory('$ionicBackdropIon', $ionicBackdropIon);


    function ionFloatingButton() {
        return {
            restrict: 'E',
            scope: {
                click: '&?',
                buttonColor: '@?',
                buttonClass: '@?',
                icon: '@?',
                iconColor: '@?',
                hasFooter: '=?',
                isCentered: '=?',
                text: '@?',
                textClass: '@?',
                bottom: '@?'},
            template: '<ul ng-click="click()" id="floating-button" ng-class="{\'center\': isCentered}" ng-style="{\'bottom\' : \'{{bottom}}\' }">' +
                    '<li ng-class="buttonClass" ng-style="{\'background-color\': buttonColor }">' +
                    '<a><span ng-if="text" class="label-container"><span class="label" ng-class="textClass" ng-bind="text"></span></span><i class="icon menu-icon" ng-class="{ \'{{icon}}\' : true}" ng-style="{\'color\': iconColor }"></i></a>' +
                    '</li>' +
                    '</ul>',
            replace: false,
            transclude: true,
            controller: ionFloatingButtonCtrl
        };
    }

    ionFloatingButtonCtrl.$inject = ['$scope'];
    function ionFloatingButtonCtrl($scope) {
        $scope.buttonColor = $scope.buttonColor || '#2AC9AA';
        $scope.icon = $scope.icon || 'ion-plus';
        $scope.iconColor = $scope.iconColor || '#fff';
        $scope.hasFooter = $scope.hasFooter || false;
        $scope.isCentered = $scope.isCentered || false;

        if ($scope.hasFooter) {
            $scope.bottom = '60px';
        } else {
            $scope.bottom = $scope.bottom || '20px';
        }
    }

    function ionFloatingMenu() {
        return {
            restrict: 'E',
            scope: {
                menuOpenColor: '@?',
                menuOpenIcon: '@?',
                menuOpenIconColor: '@?',
                menuColor: '@?',
                menuIcon: '@?',
                menuIconColor: '@?',
                hasFooter: '=?',
                backdrop: '=?',
                bottom: '@?'
            },
            template: '<ul id="floating-menu"  \n\
                                ng-style="{\'bottom\' : \'{{bottom}}\'}" \n\
                                ng-class="{\'active\' : isOpen}" \n\
                                ng-click="open()">' +
                       '<div ng-transclude></div>' +
                       '<span><li class="menu-button icon menu-icon" ng-class="icon" ng-style="{\'background-color\' : buttonColor, \'color\': iconColor}"></li></span>' +
                       '</ul>',
            replace: false,
            transclude: true,
            link: function (scope, element, attrs, ctrl, transclude)
            {
                element.find('div').replaceWith(transclude());
            },
            controller: ionFloatingMenuCtrl
        };
    }

    ionFloatingMenuCtrl.$inject = ['$scope', '$rootScope', '$ionicBackdropIon'];
    function ionFloatingMenuCtrl($scope, $rootScope, $ionicBackdropIon) {
        $scope.isOpen = false;
        $scope.open = function () {
            $scope.isOpen = !$scope.isOpen;
            if ($scope.isOpen) {
                $scope.setOpen();
            } else {
                $scope.setClose();
            }
        };
        $scope.setOpen = function () {
            $scope.buttonColor = menuOpenColor;
            $scope.icon = menuOpenIcon;
            $scope.iconColor = menuOpenIconColor;
            if (backdrop) {
                $ionicBackdropIon.retain();
            }
            $rootScope.$broadcast('floating-menu:open');
        };
        $scope.setClose = function () {
            $scope.buttonColor = menuColor;
            $scope.icon = menuIcon;
            $scope.iconColor = menuIconColor;
            if (backdrop) {
                $ionicBackdropIon.release();
            }
            $rootScope.$broadcast('floating-menu:close');
        };

        $scope.$on('floating-menu:set-close', function() {
            if ($scope.isOpen) {
                $scope.isOpen = false;
                $scope.setClose();
            }
        });

        var menuColor = $scope.menuColor || '#2AC9AA';
        var menuIcon = $scope.menuIcon || 'ion-plus';
        var menuIconColor = $scope.menuIconColor || '#fff';
        var menuOpenColor = $scope.menuOpenColor || '#2AC9AA';
        var menuOpenIcon = $scope.menuOpenIcon || 'ion-minus';
        var menuOpenIconColor = $scope.menuOpenIconColor || '#fff';
        var backdrop = $scope.backdrop || false;

        $scope.setClose();
        $scope.hasFooter = $scope.hasFooter || false;
        if ($scope.hasFooter) {
            $scope.bottom = '60px';
        } else {
            $scope.bottom = $scope.bottom || '20px';
        }

    }

    function ionFloatingItem() {
        return {
            restrict: 'E',
            require: ['^ionFloatingMenu'],
            scope: {
                click: '&?',
                icon: '@',
                iconColor: '@?',
                buttonColor: '@?',
                buttonClass: '@?',
                iconImagePath: '@?',
                iconImageClass: '@?',
                text: '@?',
                textClass: '@?'},
            template:
            '<li ng-click="click($event)" ng-class="buttonClass" ng-style="{\'background-color\': buttonColor }">' +
            '<span ng-if="text" ng-click="ignore($event);" class="label-container"><span class="label" ng-class="textClass" ng-bind="text"></span></span>' +
            '<i ng-if="!iconImagePath" class="icon menu-icon" ng-class="{ \'{{icon}}\' : true}" ng-style="{\'color\': iconColor }"></i>' +
            '</li>',
            replace: false,
            controller: ionFloatingItemCtrl
        };
    }

    ionFloatingItemCtrl.$inject = ['$scope'];
    function ionFloatingItemCtrl($scope) {
        $scope.buttonColor = $scope.buttonColor || '#2AC9AA';
        $scope.iconColor = $scope.iconColor || '#fff';
        $scope.ignore = function($event) {
          $event.stopPropagation();
          return false;
        };
    }


    $ionicBackdropIon.$inject = ['$rootScope'];
    function $ionicBackdropIon($rootScope) {

        return {
            /**
             * @ngdoc method
             * @name $ionicBackdrop#retain
             * @description Retains the backdrop.
             */
            retain: retain,
            /**
             * @ngdoc method
             * @name $ionicBackdrop#release
             * @description
             * Releases the backdrop.
             */
            release: release
        };

        function removeBackdrops() {
            var elements = document.querySelectorAll('.cbackdrop');
            if (elements) {
                for (var i = 0; i < elements.length; i++) {
                    var backdropElement = elements[i];
                    backdropElement.parentNode.removeChild(backdropElement);
                }
            }
        }

        function createBackdrops() {
            var el = angular.element('<div class="backdrop cbackdrop active visible">');
            var views = document.querySelectorAll('ion-view');
            if (views) {
                for (var i = 0; i < views.length; i++) {
                    var viewElement = views[i];
                    angular.element(viewElement).append(el[0]);
                }
            }
        }

        function retain() {
            removeBackdrops();
            createBackdrops();
            $rootScope.$broadcast('backdrop.shown');
        }

        function release() {
            removeBackdrops();
            $rootScope.$broadcast('backdrop.hidden');
        }

    }
})();
