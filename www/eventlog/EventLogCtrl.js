angular.module('com.unarin.cordova.proximity.quickstart.eventlog').controller('EventLogCtrl', ['$log', '$scope', '$localForage', function ($log, $scope, $localForage) {

	$log.debug('EventLogCtrl is loaded.');

	$scope.events = [];

	$scope.updateEvents = function () {

		$log.debug('updateEvents()');

		$localForage.getItem('monitoring_events').then(function (monitoringEvents) {
			$scope.events = monitoringEvents;
		});
	};

	$scope.updateRangingEvents = function () {
		$log.debug('updateRangingEvents()');

		$localForage.getItem('ranging_events').then(function (rangingEvents) {
			$scope.events = rangingEvents;
		});
	};


	//$scope.$on('updated_monitoring_events', $scope.updateEvents);

	$log.debug('Subscribing for updates of ranging events.');
	$scope.$on('updated_ranging_events', $scope.updateRangingEvents);

	//$scope.updateEvents();


}]);