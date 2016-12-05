'use strict';

var template = "";
template += "<div ng-animate-children=\"true\">";
template += "  <div class=\"action-button-small-container\" ng-click=\"$ctrl.closeMenu({type: 'main', backgroundClick: true})\">";
template += "    <div class=\"action-button-small-container--individual\" ng-repeat=\"button in $ctrl.options.buttons\" ng-click=\"$ctrl.buttonClicked({type: 'secondary', index: $index})\">";
template += "      <span class=\"action-button-small--label\" ng-if=\"button.label\">{{button.label}}<\/span>";
template += "      <button class=\"action-button-small\" ng-style=\"{'backgroundColor': button.backgroundColor, 'color': button.iconColor}\">";
template += "        <i class=\"action-button-small--icon icon\" ng-class=\"button.icon\"><span class=\"action-button-small--icon__label\" ng-if=\"!button.icon\">{{button.letter || button.label[0]}}<\/span><\/i>";
template += "      <\/button>";
template += "    <\/div>";
template += "  <\/div>";
template += "  <button class=\"action-button\" ng-click=\"$ctrl.buttonClicked({type: 'main'})\" ng-style=\"{'backgroundColor': $ctrl.options.mainAction.backgroundColor}\">";
template += "      <i class='action-button--icon icon action-button--icon__main' ng-class=\"$ctrl.options.mainAction.icon\" ng-style=\"{'color': $ctrl.options.mainAction.textColor}\"><\/i>";
template += "      <i class='action-button--icon action-button-icon__close ion-android-close' ng-style=\"{'color': $ctrl.options.mainAction.textColor}\"><\/i>";
template += "    <\/button>";
template += "<\/div>";
template += "";


function actionButtonFactory($rootScope, $compile, $ionicBody, $animate) {

  return {
    create: actionButton
  };

  function actionButton(options) {
    var scope = $rootScope.$new(true);
    var visible = true;

    scope.options = options;
    scope.options.removeOnStateChange = true;
    scope.menuOpened = false;

    // Compile the template
    var element = scope.element = $compile('<material-action-button class="mab" on-create="show()" options="options" dispatcher="buttonClicked(data)"></material-action-button>')(scope);

    var mainButtonElement;
    var secondaryButtonsContainer;

    //append to the body
    $ionicBody.append(element);

    scope.removeButton = function() {
      if (scope.removed) {
        return;
      }

      scope.removed = true;
      return $animate
        .addClass(mainButtonElement, 'action-button-hide')
        .then(function() {
          visible = false;
          scope.$destroy();
          element.remove();
          return;
        })
    }

    scope.buttonClicked = function(data) {
      //we handle main button clicks
      if (data.type === 'main') {
        //if we have secondary actions...
        if (data.openMenu) {
          //if menu is opened, we close it
          if (scope.menuOpened) {
            element.removeClass('action-button-menu-show');
            element.addClass('action-button-menu-hide');
            $animate.addClass(secondaryButtonsContainer, 'action-button-small-hide')
              .then(function() {
                secondaryButtonsContainer.removeClass('action-button-small-show');
                secondaryButtonsContainer.removeClass('action-button-small-hide');
                secondaryButtonsContainer.addClass('action-button-small-container__hidden');
                scope.menuOpened = false;
              })
          } else {
            //if menu is closed, we open it
            element.removeClass('action-button-menu-hide');
            element.addClass('action-button-menu-show');


            secondaryButtonsContainer.removeClass('action-button-small-container__hidden');
            $animate.addClass(secondaryButtonsContainer, 'action-button-small-show')
              .then(function() {
                scope.menuOpened = true;
              })

          }
        } else {
          //if we don't have secondary actions
          if (scope.options.mainAction.onClick) {
            return scope.options.mainAction.onClick();
          }
          return;
        }
      }

      if (data.type === 'secondary') {
        if (scope.options.buttons[data.index].onClick) {
          return scope.options.buttons[data.index].onClick();
        }
        return;
      }
    }

    scope.show = function() {

      $animate.addClass(element, 'button-active') //hack to wait till the element is appended? dont know...
        .then(function() {
          visible = true;
          mainButtonElement = angular.element(element[0].getElementsByClassName('action-button'));
          secondaryButtonsContainer = angular.element(element[0].getElementsByClassName('action-button-small-container'));

          if (scope.options.startHidden) {
            return;
          }
          return $animate.addClass(mainButtonElement, 'action-button-show');
        });
    }

    scope.showButton = function() {
      return $animate.addClass(mainButtonElement, 'action-button-show')
        .then(function() {
          visible = true;
          return;
        })
    }

    scope.hideButton = function() {
      return $animate
        .addClass(mainButtonElement, 'action-button-hide')
        .then(function() {
          mainButtonElement.removeClass('action-button-show');
          mainButtonElement.removeClass('action-button-hide');
          element.removeClass('action-button-menu-hide');
          visible = false;
          return;
        });
    }

    //auto remove when state changes
    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams, options) {
        console.log(toState.name);
        if (toState.name == "tabs.dashboard.main"){
            scope.show();
        } else {
            scope.hideButton();
        }
    //   if (scope.options.removeOnStateChange) {
    //     scope.removeButton();
    //     // scope.hideButton();
    //     return;
    //   }
    });


    return {
      show: function() {
        return scope.showButton();
      },
      hide: function() {
        return scope.hideButton();
      },
      visible: function() {
        return visible;
      }
    }
  }
}


angular.module('$actionButton', ['ngAnimate'])
  .factory('$actionButton', ['$rootScope',
    '$compile', '$ionicBody', '$animate', actionButtonFactory
  ])
  .component('materialActionButton', {
    template: template,
    bindings: {
      options: '<',
      dispatcher: '&',
      onCreate: '&'
    },
    controller: ['$timeout', function($timeout) {
      var _this = this;
      // this.opened = false;

      this.closeMenu = function(data) {
        //we simulate a main button touch order to close
        data.openMenu = true;
        _this.dispatcher({
          data: data
        });
        return;
      }

      this.$postLink = function() {
        $timeout(function() {
          console.log('create')
          _this.onCreate();
        })
      }

      this.buttonClicked = function(data) {

        //if the element has no buttons configured...
        if (!_this.options.buttons || !_this.options.buttons.length) {
          _this.dispatcher({
            data: data
          });
          return;
        }

        //if the element has buttons configured...
        //we pass the openMenu true prop...
        if (data.type === 'main') {
          data.openMenu = true;
          _this.dispatcher({
            data: data
          });
          return;
        }

        //any other click here has to be from a small button
        _this.dispatcher({
          data: data
        });

      };
    }]
  });
