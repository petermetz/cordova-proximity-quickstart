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
    
    # Install NPM dependencies
    npm install
    
    # Running a gulp task which will run bower
    node ./node_modules/gulp/bin/gulp.js install
    
    # Adds iOS as a platform to your project
    cordova platform add ios 
    
    # Installs the proximity plugin from GitHub
    cordova plugin add https://github.com/petermetz/cordova-plugin-ibeacon.git
    
    # Opens the project in XCode, where you can run it
    open platforms/ios/Cordova\ Proximity\ Quickstart.xcodeproj
    
### Development

After making a change to the Javascript/SCSS code, execute ```gulp default ; cordova prepare``` in order to compile your styles and copy your changes into the 
platform directories. This is necessary before you'll be able to see the changes on a device.