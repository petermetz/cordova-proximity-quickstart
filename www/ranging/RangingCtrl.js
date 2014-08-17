angular.module('com.unarin.cordova.proximity.quickstart.ranging')

	.controller('RangingCtrl', ['$log', '$rootScope', '$scope', '$localForage', function ($log, $rootScope, $scope, $localForage) {

		$log.debug('Loaded RangingCtrl successfully.');

		$scope.updateRangedRegions = function () {
			cordova.plugins.locationManager.getRangedRegions().then(function (rangedRegions) {
				$log.debug('Ranged regions:', JSON.stringify(rangedRegions, null, '\t'));
				$scope.rangedRegions = rangedRegions;
			});
		};

		$scope.startRanging = function () {
			$log.debug('startRanging()');

			var beaconRegion = cordova.plugins.locationManager.Regions.fromJson($scope.region);
			$log.debug('Parsed BeaconRegion object:', JSON.stringify(beaconRegion, null, '\t'));

			cordova.plugins.locationManager.startRangingBeaconsInRegion(beaconRegion)
				.fail($log.error)
				.done();


		};

		var delegate = new cordova.plugins.locationManager.Delegate().implement({

			didRangeBeaconsInRegion: function (pluginResult) {

				$log.debug('didRangeBeaconsInRegion()');
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
			}
		});


		//
		// Init
		//
		cordova.plugins.locationManager.setDelegate(delegate);

		$scope.region = {};

		$scope.updateRangedRegions();
	}]);