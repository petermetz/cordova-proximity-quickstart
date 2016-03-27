angular.module('com.unarin.cordova.proximity.quickstart.ranging')

	.controller('RangingCtrl', ['$log', '$rootScope', '$scope', '$window', '$localForage', 'proximityManager', function ($log, $rootScope, $scope, $window, $localForage, proximityManager) {

		$log.debug('Loaded RangingCtrl successfully.');

		$scope.updateRangedRegions = function () {
			$window.cordova.plugins.locationManager.getRangedRegions().then(function (rangedRegions) {
				$log.debug('Ranged regions:', JSON.stringify(rangedRegions, null, '\t'));
				$scope.rangedRegions = rangedRegions;
			});
		};

		$scope.startRanging = function () {
			$log.debug('startRanging()');
			proximityManager.addRangedRegion($scope.region);
		};

		proximityManager.onDidRangeBeaconsInRegion(function (pluginResult) {

			$log.debug('didRangeBeaconsInRegion()', pluginResult);
			pluginResult.id = new Date().getTime();
			pluginResult.timestamp = new Date();

			$localForage.getItem('ranging_events')
				.then(function (rangingEvents) {
					if (!angular.isArray(rangingEvents)) {
						rangingEvents = [];
					}

					rangingEvents.push(pluginResult);

					return rangingEvents;

				}).then(function (rangingEvents) {
					return $localForage.setItem('ranging_events', rangingEvents);
				}).then(function () {
					$rootScope.$broadcast('updated_ranging_events');
				});
		});

		$scope.region = {};

		$scope.updateRangedRegions();
	}]);