angular.module('com.unarin.cordova.proximity.quickstart', [
	'ionic',
	'com.unarin.cordova.proximity.quickstart.monitoring',
	'com.unarin.cordova.proximity.quickstart.eventlog',
	'com.unarin.cordova.proximity.quickstart.ranging'
]).config(function ($stateProvider, $urlRouterProvider) {

	window.console.debug('Configuring com.unarin.cordova.proximity.quickstart');

	$urlRouterProvider.otherwise('/eventlog');

}).run(function () {

	console.debug('Running com.unarin.cordova.proximity.quickstart');

	if (window.cordova && window.cordova.plugins.Keyboard) {
		cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
	}
	if (window.StatusBar) {
		// Set the statusbar to use the default style, tweak this to
		// remove the status bar on iOS or change it to use white instead of dark colors.
		StatusBar.styleDefault();
	}

});

window.ionic.Platform.ready(function () {
	angular.bootstrap(document, ['com.unarin.cordova.proximity.quickstart']);
});
