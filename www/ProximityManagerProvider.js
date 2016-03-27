angular.module('com.unarin.cordova.proximity.quickstart.proximity-manager', [

    'LocalForageModule'

]).config(function () {

    window.console.debug('Configured com.unarin.cordova.proximity.quickstart.proximity-provider successfully.');

}).provider('proximityManager', function ProximityProviderFactory() {
    'use strict';

    var provider = this;

    this.$get = function ($q, $log, $window, $rootScope, $localForage) {

        var self = null;

        var ProximityManager = function () {
            this._delegate = null;
            this._didDetermineStateForRegionHandlers = [];
            this._didStartMonitoringForRegionHandlers = [];
            this._didRangeBeaconsInRegionHandlers = [];
            this._didEnterRegionHandlers = [];
            this._didExitRegionHandlers = [];
        };

        ProximityManager.MONITORED_REGIONS_KEY =
            'com.unarin.cordova.proximity.quickstart.proximity-provider.MONITORED_REGIONS';

        ProximityManager.RANGED_REGIONS_KEY =
            'com.unarin.cordova.proximity.quickstart.proximity-provider.RANGED_REGIONS';

        ProximityManager.prototype.getDelegate = function () {
            return self._delegate;
        };

        ProximityManager.prototype.setDelegate = function (aDelegate) {
            self._delegate = aDelegate;
        };

        ProximityManager.prototype.getRangedRegions = function () {

            return $localForage.getItem(ProximityManager.RANGED_REGIONS_KEY)

                .then(function onPersistedRangedRegionsRetrieved(theRangedRegions) {

                    if (!angular.isArray(theRangedRegions)) {
                        theRangedRegions = [];
                    }
                    return theRangedRegions;

                }).catch(function onGetPersistedRangedRegionsFail(anError) {
                    var anErrorReport = {};
                    anErrorReport.message = 'Failed to retrieve the persistent regions for ranging: ';
                    anErrorReport.exception = anError;
                    $log.error(anErrorReport);
                    throw anErrorReport;
                });
        };

        ProximityManager.prototype.getMonitoredRegions = function () {

            return $localForage.getItem(ProximityManager.MONITORED_REGIONS_KEY)

                .then(function onPersistedMonitoredRegionsRetrieved(theMonitoredRegions) {

                    if (!angular.isArray(theMonitoredRegions)) {
                        theMonitoredRegions = [];
                    }
                    return theMonitoredRegions;

                }).catch(function onGetPersistedMonitoredRegionsFail(anError) {
                    var anErrorReport = {};
                    anErrorReport.message = 'Failed to retrieve the persistent regions for monitoring: ';
                    anErrorReport.exception = anError;
                    $log.error(anErrorReport);
                    throw anErrorReport;
                });
        };

        ProximityManager.prototype.addMonitoredRegion = function (aBeaconRegion) {

            return self.getMonitoredRegions().then(function (theMonitoredRegions) {

                if (!ProximityManager.arrayContainsBeaconRegion(theMonitoredRegions, aBeaconRegion)) {
                    theMonitoredRegions.push(aBeaconRegion);
                    return self.setMonitoredRegions(theMonitoredRegions).then(function () {
                        
                        var beaconRegion = cordova.plugins.locationManager.Regions.fromJson(aBeaconRegion);

                        $log.debug('Will MONITOR Parsed BeaconRegion instance:', JSON.stringify(beaconRegion, null, '\t'));

                        $window.cordova.plugins.locationManager.startMonitoringForRegion(beaconRegion)
                            .fail($log.error)
                            .done();
                    });
                }
            });
        };

        ProximityManager.prototype.addRangedRegion = function (aBeaconRegion) {

            return self.getRangedRegions().then(function (theRangedRegions) {

                if (!ProximityManager.arrayContainsBeaconRegion(theRangedRegions, aBeaconRegion)) {
                    theRangedRegions.push(aBeaconRegion);
                    return self.setRangedRegions(theRangedRegions).then(function () {
                        
                        var beaconRegion = cordova.plugins.locationManager.Regions.fromJson(aBeaconRegion);

                        $log.debug('Will RANGE Parsed BeaconRegion instance:', JSON.stringify(beaconRegion, null, '\t'));

                        $window.cordova.plugins.locationManager.startRangingBeaconsInRegion(beaconRegion)
                            .fail($log.error)
                            .done();
                    });
                }
            });
        };

        ProximityManager.prototype.removeMonitoredRegion = function (aBeaconRegionToRemove) {

            return self.getMonitoredRegions().then(function (theMonitoredRegions) {

                theMonitoredRegions = theMonitoredRegions.filter(function (aMonitoredBeaconRegion) {
                    return self.areEqualBeaconRegions(aMonitoredBeaconRegion, aBeaconRegionToRemove);
                });

                return self.setMonitoredRegions(theMonitoredRegions);

            }).catch(function onRemoveMonitoredRegionFail(anError) {
                $log.error('Failed to remove beacon region from monitoring: ', anError, aBeaconRegionToRemove);
            });
        };

        ProximityManager.prototype.setRangedRegions = function (theRangedRegions) {
            return $localForage.setItem(ProximityManager.RANGED_REGIONS_KEY, theRangedRegions);
        };

        ProximityManager.prototype.setMonitoredRegions = function (theMonitoredRegions) {
            return $localForage.setItem(ProximityManager.MONITORED_REGIONS_KEY, theMonitoredRegions);
        };

        ProximityManager.arrayContainsBeaconRegion = function (anArray, aBeaconRegion) {

            if (!angular.isArray(anArray)) {
                return false;
            }

            var isContained = false;

            angular.forEach(anArray, function checkArrayForBeaconRegionContainment(anotherBeaconRegion) {

                if (self.areEqualBeaconRegions(anotherBeaconRegion, aBeaconRegion)) {
                    isContained = true;
                }
            });

            return isContained;
        };

        ProximityManager.prototype.areEqualBeaconRegions = function (regionA, regionB) {

            try {

                if (regionA === regionB) {
                    return true;
                }

                if (!angular.isObject(regionA) || !angular.isObject(regionB)) {
                    return false;
                }

                var majorA = JSON.stringify(parseInt(regionA.major));
                var majorB = JSON.stringify(parseInt(regionA.major));

                var minorA = JSON.stringify(parseInt(regionA.minor));
                var minorB = JSON.stringify(parseInt(regionA.minor));

                var uuidA = JSON.stringify(parseInt(regionA.uuid));
                var uuidB = JSON.stringify(parseInt(regionA.uuid));

                return majorA === majorB && minorA === minorB && uuidA === uuidB;

            } catch (anException) {
                $log.error('Failed to compare beacon regions for equality: ', anException, regionA, regionB);
                return false;
            }
        };

        ProximityManager.prototype.onDidDetermineStateForRegion = function (aCallback) {
            if (!angular.isFunction(aCallback)) {
                throw new TypeError('First parameter must be type of Function, got ' + typeof(aCallback));
            }
            self._didDetermineStateForRegionHandlers.push(aCallback);
        };

        ProximityManager.prototype.onDidRangeBeaconsInRegion = function (aCallback) {
            if (!angular.isFunction(aCallback)) {
                throw new TypeError('First parameter must be type of Function, got ' + typeof(aCallback));
            }
            self._didRangeBeaconsInRegionHandlers.push(aCallback);
        };

        ProximityManager.prototype.onDidStartMonitoringForRegion = function (aCallback) {
            if (!angular.isFunction(aCallback)) {
                throw new TypeError('First parameter must be type of Function, got ' + typeof(aCallback));
            }
            self._didStartMonitoringForRegionHandlers.push(aCallback);
        };

        ProximityManager.prototype.onDidEnterRegion = function (aCallback) {
            if (!angular.isFunction(aCallback)) {
                throw new TypeError('First parameter must be type of Function, got ' + typeof(aCallback));
            }
            self._didEnterRegionHandlers.push(aCallback);
        };

        ProximityManager.prototype.onDidExitRegion = function (aCallback) {
            if (!angular.isFunction(aCallback)) {
                throw new TypeError('First parameter must be type of Function, got ' + typeof(aCallback));
            }
            self._didExitRegionHandlers.push(aCallback);
        };

        ProximityManager.prototype.start = function () {

            var deferred = $q.defer();

            if (!angular.isObject($window.cordova)) {

                deferred.reject('Global cordova reference is not an object. You either forgot to include the ' +
                    'cordova.js script or the application is not running in a WebView (non desktop browser)' +
                    ' Will not start the ProximityManager ...');

                return deferred.promise;
            }

            try {

                var delegate = new $window.cordova.plugins.locationManager.Delegate();

                delegate.didDetermineStateForRegion = function (pluginResult) {
                    $log.debug('didDetermineStateForRegion()', pluginResult);
                    self._didDetermineStateForRegionHandlers.forEach(function (aCallback) {
                        try {
                            aCallback(pluginResult);
                        } catch (anException) {
                            $log.error('ProximityManager handler failed: ', anException);
                        }
                    });
                };

                delegate.didStartMonitoringForRegion = function (pluginResult) {
                    $log.debug('didStartMonitoringForRegion:', pluginResult);
                    self._didStartMonitoringForRegionHandlers.forEach(function (aCallback) {
                        try {
                            aCallback(pluginResult);
                        } catch (anException) {
                            $log.error('ProximityManager handler failed: ', anException);
                        }
                    });
                };

                delegate.didRangeBeaconsInRegion = function (pluginResult) {
                    $log.debug('didRangeBeaconsInRegion()', pluginResult);
                    self._didRangeBeaconsInRegionHandlers.forEach(function (aCallback) {
                        try {
                            aCallback(pluginResult);
                        } catch (anException) {
                            $log.error('ProximityManager handler failed: ', anException);
                        }
                    });
                };

                delegate.didEnterRegion = function (pluginResult) {
                    $log.debug('didEnterRegion()', pluginResult);
                    self._didEnterRegionHandlers.forEach(function (aCallback) {
                        try {
                            aCallback(pluginResult);
                        } catch (anException) {
                            $log.error('ProximityManager handler failed: ', anException);
                        }
                    });
                };

                delegate.didExitRegion = function (pluginResult) {
                    $log.debug('didExitRegion()', pluginResult);
                    self._didExitRegionHandlers.forEach(function (aCallback) {
                        try {
                            aCallback(pluginResult);
                        } catch (anException) {
                            $log.error('ProximityManager handler failed: ', anException);
                        }
                    });
                };

                self.setDelegate(delegate);

                $window.cordova.plugins.locationManager.setDelegate(delegate);
                $window.cordova.plugins.locationManager.requestAlwaysAuthorization();

                self.getMonitoredRegions().then(function (theMonitoredRegions) {

                    theMonitoredRegions.forEach(function (aBeaconRegionJson) {

                        var beaconRegion = cordova.plugins.locationManager.Regions.fromJson(aBeaconRegionJson);

                        $log.debug('Will MONITOR Parsed BeaconRegion instance:', JSON.stringify(beaconRegion, null, '\t'));

                        $window.cordova.plugins.locationManager.startMonitoringForRegion(beaconRegion)
                            .fail($log.error)
                            .done();
                    });

                    self.getRangedRegions().then(function onRangedRegionsRetrievedOk(theRangedRegions) {

                        theRangedRegions.forEach(function (aBeaconRegionJson) {

                            var beaconRegion = cordova.plugins.locationManager.Regions.fromJson(aBeaconRegionJson);

                            $log.debug('Will RANGE Parsed BeaconRegion instance:', JSON.stringify(beaconRegion, null, '\t'));

                            $window.cordova.plugins.locationManager.startRangingBeaconsInRegion(beaconRegion)
                                .fail($log.error)
                                .done();

                        });

                        $log.info('Finished bootstrapping the monitoring/ranging.', theMonitoredRegions, theRangedRegions);

                        deferred.resolve({
                            theMonitoredRegions: theMonitoredRegions,
                            theRangedRegions: theRangedRegions
                        });

                    }).catch(function rangedRegionsRetrievalFail(anError) {
                        var anErrorReport = {};
                        anErrorReport.message = 'Failed to obtain ranged regions, ProximityManager cannot start.';
                        anErrorReport.exception = anError;
                        $log.error(anErrorReport);
                        deferred.reject(anErrorReport);
                    });

                }).catch(function onGetMonitoredRegionsFail(anError) {
                    var anErrorReport = {};
                    anErrorReport.message = 'Failed to obtain monitored regions, ProximityManager cannot start.';
                    anErrorReport.exception = anError;
                    $log.error(anErrorReport);
                    deferred.reject(anErrorReport);
                });

            } catch (anException) {

                var anErrorReport = {
                    message: 'Failed to start up ProximityProvider: ',
                    exception: anException
                };

                $log.error(anErrorReport);
                deferred.reject(anErrorReport)
            }
            return deferred.promise;
        };

        if (self === null) {
            self = new ProximityManager();
        }
        return self;
    };

});