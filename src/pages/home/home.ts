import { Component } from '@angular/core';
import { IBeacon, IBeaconPluginResult } from '@ionic-native/ibeacon';
import { Platform } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private uuid: string = '00000000-0000-0000-0000-000000000000';

  constructor(private readonly ibeacon: IBeacon, private readonly platform: Platform) {
  }

  public onStartClicked(): void {
    this.platform.ready().then(() => {
      this.startBleFun();
    });
  }

  public startBleFun(): void {

    // Request permission to use location on iOS
    this.ibeacon.requestAlwaysAuthorization();
    // create a new delegate and register it with the native layer
    let delegate = this.ibeacon.Delegate();

    // Subscribe to some of the delegate's event handlers
    delegate.didRangeBeaconsInRegion().subscribe(
      (pluginResult: IBeaconPluginResult) => console.log('didRangeBeaconsInRegion: ', pluginResult),
      (error: any) => console.error(`Failure during ranging: `, error)
    );
    delegate.didStartMonitoringForRegion().subscribe(
      (pluginResult: IBeaconPluginResult) => console.log('didStartMonitoringForRegion: ', pluginResult),
      (error: any) => console.error(`Failure during starting of monitoring: `, error)
    );

    delegate.didEnterRegion().subscribe(
      (pluginResult: IBeaconPluginResult) => {
        console.log('didEnterRegion: ', pluginResult);
      }
    );

    delegate.didExitRegion().subscribe(
      (pluginResult: IBeaconPluginResult) => {
        console.log('didExitRegion: ', pluginResult);
      }
    );

    console.log(`Creating BeaconRegion with UUID of: `, this.uuid);
    const beaconRegion = this.ibeacon.BeaconRegion('nullBeaconRegion', this.uuid, 1, 1);

    this.ibeacon.startMonitoringForRegion(beaconRegion).then(
      () => console.log('Native layer recieved the request to monitoring'),
      (error: any) => console.error('Native layer failed to begin monitoring: ', error)
    );

    this.ibeacon.startRangingBeaconsInRegion(beaconRegion)
      .then(() => {
        console.log(`Started ranging beacon region: `, beaconRegion);
      })
      .catch((error: any) => {
        console.error(`Failed to start ranging beacon region: `, beaconRegion);
      });
  }

}
