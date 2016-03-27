angular.module('com.unarin.cordova.proximity.quickstart', [
	'ionic',
	'com.unarin.cordova.proximity.quickstart.proximity-manager',
	'com.unarin.cordova.proximity.quickstart.monitoring',
	'com.unarin.cordova.proximity.quickstart.eventlog',
	'com.unarin.cordova.proximity.quickstart.ranging'
]).config(function ($stateProvider, $urlRouterProvider) {

	window.console.debug('Configuring com.unarin.cordova.proximity.quickstart');

	$urlRouterProvider.otherwise('/eventlog');

}).run(function ($log, $timeout, proximityManager) {

	console.debug('Running com.unarin.cordova.proximity.quickstart');

	if (window.cordova && window.cordova.plugins.Keyboard) {
		cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
	}
	if (window.StatusBar) {
		// Set the statusbar to use the default style, tweak this to
		// remove the status bar on iOS or change it to use white instead of dark colors.
		StatusBar.styleDefault();
	}

	$timeout(function () {
		
        $log.info('Starting proximity manager ...');
		
		window.proximityManager = proximityManager;
        
		proximityManager.start().then(function (proximityStatusReport) {
			$log.info('Proximity manager started successfully. Status report: ', proximityStatusReport);
		}).catch(function (anError) {
			$log.warn('Proximity manager did not start: ', anError);
		});
		
	}, 250);

});

window.ionic.Platform.ready(function () {
	angular.bootstrap(document, ['com.unarin.cordova.proximity.quickstart']);
});
