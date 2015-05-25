angular.module('com.unarin.cordova.proximity.quickstart.monitoring')

	.controller('MonitoringCtrl', ['$log', '$scope', '$window', '$localForage', function ($log, $scope, $window, $localForage) {

		window.$monitoringScope = $scope;
		$log.debug('MonitoringCtrl is loaded.');

		$scope.updateRangedRegions = function () {
			$window.cordova.plugins.locationManager.getMonitoredRegions().then(function (monitoredRegions) {
				$log.debug('Monitored regions:', JSON.stringify(monitoredRegions, null, '\t'));
				$scope.monitoredRegions = monitoredRegions;
			});
		};

		$scope.startMonitoring = function () {
			$log.debug('startMonitoring()');

			var beaconRegion = cordova.plugins.locationManager.Regions.fromJson($scope.region);
			$log.debug('Parsed BeaconRegion object:', JSON.stringify(beaconRegion, null, '\t'));

			$window.cordova.plugins.locationManager.startMonitoringForRegion(beaconRegion)
				.fail($log.error)
				.done();


		};

		var delegate = new cordova.plugins.locationManager.Delegate();

		delegate.didDetermineStateForRegion = function (pluginResult) {

			pluginResult.id = new Date().getTime();
			pluginResult.timestamp = new Date();

			$localForage.getItem('monitoring_events')
				.then(function (monitoringEvents) {
					if (!angular.isArray(monitoringEvents)) {
						monitoringEvents = [];
					}

					monitoringEvents.push(pluginResult);
					return monitoringEvents;
				}).then(function (monitoringEvents) {
					$localForage.setItem('monitoring_events', monitoringEvents);

					$scope.$broadcast('updated_monitoring_events');
				});
		};

		delegate.didStartMonitoringForRegion = function (pluginResult) {
			$log.debug('didStartMonitoringForRegion:', pluginResult);
			$scope.updateRangedRegions();
		};


		//
		// Init
		//
		$window.cordova.plugins.locationManager.setDelegate(delegate);

		$scope.region = {};

		$scope.updateRangedRegions();
	}]);