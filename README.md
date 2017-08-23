Cordova Proximity Quick Start
=====================

A starting project for the [Cordova Proximity Plugin](https://github.com/petermetz/cordova-plugin-ibeacon).

* After launching the app, you can start monitoring or ranging beacons by pressing the similarly named buttons on the
second and the third tabs of the application.

* The messages produced by iOS will get populated on the first tab.

* To see any of the aforementioned in action, you have to edit the properties of the monitored/ranged beacon either by
typing them in on the device's keyboard, or modifying the default values in the source code (see the .html files).

## Usage

After a clean checkout, make sure to add one or all of the supported platforms and the plugin itself before running.

Install the Ionic Framework globally:
```bash
$ npm install -g ionic@3.9.2
```

Install Apache Cordova globally:
```bash
$ npm install -g cordova@7.0.1
```

Install local npm dependencies
```bash
$ npm install
```

```bash
$ ionic cordova run android -lcs
```

You may need to manually enable location permissions for the application from the settings menu of the Android device.

### Development


https://ionicframework.com/docs/native/ibeacon/
https://ionicframework.com/docs/
