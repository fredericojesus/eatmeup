(function() {
    'use strict';

    angular
        .module('app')
        .config(configure);

    configure.$inject = ['$mdIconProvider', '$mdThemingProvider'];
    /*@ngInject*/
    function configure($mdIconProvider, $mdThemingProvider) {
        $mdIconProvider
            .iconSet('navigation', 'images/material-design-icons/navigation-icons.svg', 24)
            .iconSet('action', 'images/material-design-icons/action-icons.svg', 24)
            .iconSet('content', 'images/material-design-icons/content-icons.svg', 24)
            .iconSet('device', 'images/material-design-icons/device-icons.svg', 24)
            .iconSet('editor', 'images/material-design-icons/editor-icons.svg', 24);
            
        $mdThemingProvider.theme('default')
            .primaryPalette('orange')
            .accentPalette('green', {
                'default': '500'
            });
    }

})();