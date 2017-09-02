import { Component } from '@angular/core';
import { IBeacon, IBeaconPluginResult } from '@ionic-native/ibeacon';
import { Platform } from 'ionic-angular';

@Component({
  selector: 'page-advertising',
  templateUrl: 'advertising.html'
})
export class AdvertisingPage {

  private isAdvertisingAvailable: boolean = null;

  private uuid: string = '11111111-2222-3333-4444-555555555555';
  private major: number = 11;
  private minor: number = 11;

  constructor(private readonly ibeacon: IBeacon, private readonly platform: Platform) {
    this.fetchIsAdvertisingAvailable();
  }

  public fetchIsAdvertisingAvailable(): void {
    this.platform.ready().then(async () => {
      this.isAdvertisingAvailable = await this.ibeacon.isAdvertisingAvailable();
      console.debug(`AdvertisingPage::fetchIsAdvertisingAvailable::isAdvertisingAvailable=>${this.isAdvertisingAvailable}`);
    });
  }

  public onAdvertiseClicked(): void {
    this.platform.ready().then(() => {
      this.startBleAdvertising();
    });
  }

  public startBleAdvertising(): void {

    // Request permission to use location on iOS
    this.ibeacon.requestAlwaysAuthorization();

    this.ibeacon.enableDebugLogs();

    // create a new delegate and register it with the native layer
    let delegate = this.ibeacon.Delegate();

    // Event when advertising starts (there may be a short delay after the request)
    // The property 'region' provides details of the broadcasting Beacon
    delegate.peripheralManagerDidStartAdvertising().subscribe((pluginResult: IBeaconPluginResult) => {
      console.debug(`AdvertisingPage::startBleAdvertising::peripheralManagerDidStartAdvertising::pluginResult=>`, pluginResult);
    });

    // Event when bluetooth transmission state changes
    // If 'state' is not set to BluetoothManagerStatePoweredOn when advertising cannot start
    delegate.peripheralManagerDidUpdateState().subscribe((pluginResult: IBeaconPluginResult) => {
      console.debug(`AdvertisingPage::startBleAdvertising::peripheralManagerDidUpdateState::pluginResult=>`, pluginResult);
    });

    const beaconRegion = this.ibeacon.BeaconRegion('nullBeaconRegion', this.uuid, this.major, this.minor);
    this.ibeacon.startAdvertising(beaconRegion);
  }

}
