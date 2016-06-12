(function() {
    'use strict';

    angular
        .module('app')
        .config(configure);

    configure.$inject = ['$mdIconProvider', '$mdThemingProvider'];
    /*@ngInject*/
    function configure($mdIconProvider, $mdThemingProvider) {
        $mdIconProvider
            .iconSet('navigation', '/client/images/material-design-icons/navigation-icons.svg', 24)
            .iconSet('action', '/client/images/material-design-icons/action-icons.svg', 24)
            .iconSet('content', '/client/images/material-design-icons/content-icons.svg', 24)
            .iconSet('device', '/client/images/material-design-icons/device-icons.svg', 24)
            .iconSet('editor', '/client/images/material-design-icons/editor-icons.svg', 24);
            
        $mdThemingProvider.theme('default')
            .primaryPalette('orange')
            .accentPalette('light-green');
    }

})();