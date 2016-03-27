angular.module('com.unarin.cordova.proximity.quickstart.monitoring')

	.controller('MonitoringCtrl', ['$log', '$scope', '$window', '$localForage', 'proximityManager', function ($log, $scope, $window, $localForage, proximityManager) {

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
			proximityManager.addMonitoredRegion($scope.region);
		};

		proximityManager.onDidDetermineStateForRegion(function handleDidDetermineStateForRegion(pluginResult) {

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
		});

		proximityManager.onDidStartMonitoringForRegion(function (pluginResult) {
			$log.debug('didStartMonitoringForRegion:', pluginResult);
			$scope.updateRangedRegions();
		});

		$scope.region = {};
		$scope.updateRangedRegions();
	}]);