import { Component, OnInit, AfterViewInit } from '@angular/core';

import { select } from "@angular-redux/store";
import { Observable, Subject } from "rxjs";
import { first, takeUntil, filter } from "rxjs/operators";

import { StatusBar } from "@ionic-native/status-bar/ngx";
import { ScreenOrientation } from "@ionic-native/screen-orientation/ngx";
import { Diagnostic } from "@ionic-native/diagnostic/ngx";
import { NativeStorage } from "@ionic-native/native-storage/ngx";

import { SpinnerActions } from "../../store";

import { SensorsService } from "../../services/sensors.service";

import { constants } from '../../utils/constants';

enum ARError {
  INTERNAL_AR_ERROR = "INTERNAL_AR_ERROR",
  SENSORS_ERROR = "SENSORS_ERROR",
  GPS_NOT_ENABLED = "GPS_NOT_ENABLED",
  LOCATION_PERMISSION_NOT_GRANTED = "LOCATION_PERMISSION_NOT_GRANTED",
  CAMERA_PERMISSION_NOT_GRANTED = "CAMERA_PERMISSION_NOT_GRANTED",
  CAMERA_SYSTEM_NOT_FOUND = "CAMERA_SYSTEM_NOT_FOUND",
  LOCATION_SERVICE_DISABLED = "LOCATION_SERVICE_DISABLED"
}

@Component({
  selector: 'app-augmented-reality',
  templateUrl: './augmented-reality.page.html',
  styleUrls: ['./augmented-reality.page.scss'],
})
export class AugmentedRealityPage implements OnInit, AfterViewInit
{
  @select(["platformDevice", "infos", "platform"])
  os$: Observable<string>;

  private cameraPresent: boolean;
  private cameraAuthorized: boolean;
  private locationEnabled: boolean;
  private locationAvailable: boolean;
  private locationAuthorized: boolean;
  private firstLocationAuthorization: boolean;
  private preloadAuthorizationError: boolean = false;
  private authFlagsRetrieve$: Subject<void>;

  @select(["accelerometer", "error"])
  accelerometerCoordinatesError$: Observable<boolean>;
  @select(["gyroscope", "error"])
  gyroscopeCoordinatesError$: Observable<boolean>;
  @select(["magnetometer", "error"])
  magnetometerCoordinatesError$: Observable<boolean>;
  private sensorsErrors$: Subject<void>;

  constructor(
    private statusBar: StatusBar,
    private screenOrientation: ScreenOrientation,
    private diagnosticService: Diagnostic,
    private nativeStorage: NativeStorage,
    private spinnerActions: SpinnerActions,
    private sensorsService: SensorsService
  ) {
    this.authFlagsRetrieve$ = new Subject<void>();
    this.sensorsErrors$ = new Subject<void>();
  }

  async ngOnInit()
  {
    this.statusBar.hide();
    
    this.os$.pipe(first()).subscribe(os => {
      if (os === 'ios')
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE_SECONDARY);
      else if (os === 'android')
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE_PRIMARY);
    });

    try
    {
      this.cameraPresent = await this.diagnosticService.isCameraPresent();
      this.cameraAuthorized = await this.diagnosticService.isCameraAuthorized();
      this.locationAvailable = await this.diagnosticService.isLocationAvailable();
      this.locationEnabled = await this.diagnosticService.isLocationEnabled();
      this.locationAuthorized = await this.diagnosticService.isLocationAuthorized();
    }
    catch(error)
    {
      console.log("Error auth flags: ", error);
      this.preloadAuthorizationError = true;
    }

    try
    {
      let data = this.nativeStorage.getItem(constants.FIRST_LOCATION_PERMISSION_REQUEST);
      
      console.log("first permission flag: ", data);
      if (!data)
        this.firstLocationAuthorization = true;
      else
        this.firstLocationAuthorization = false;
    }
    catch(error)
    {
      console.log("No error: simply app shortcut flag not in memory: ", error);
      this.firstLocationAuthorization = true;
    }

    this.authFlagsRetrieve$.next();
    this.authFlagsRetrieve$.complete();
  }

  async ngAfterViewInit()
  {
    await this.authFlagsRetrieve$.toPromise();

    if (this.preloadAuthorizationError)
      this.manageARSystemsErrors(ARError.INTERNAL_AR_ERROR);

    this.spinnerActions.showLoader();

    //Start fused orientation service (accelerometer, gyroscope, magnetometer)
    //The data is not subscribed yet. The app initially verifies if the device as accelerometer, gyroscope and magnetomer,
    // and it verifies permissions too
    this.sensorsService.startSensors();

    this.accelerometerCoordinatesError$
      .pipe(
        takeUntil(this.sensorsErrors$),
        takeUntil(this.gyroscopeCoordinatesError$),
        takeUntil(this.magnetometerCoordinatesError$),
        filter(data => data != null && data != undefined))
      .subscribe(flag => {
        if (flag) this.manageARSystemsErrors(ARError.SENSORS_ERROR);
      });

    this.gyroscopeCoordinatesError$
      .pipe(
        takeUntil(this.sensorsErrors$),
        takeUntil(this.accelerometerCoordinatesError$),
        takeUntil(this.magnetometerCoordinatesError$),
        filter(data => data != null && data != undefined))
      .subscribe(flag => {
        if (flag) this.manageARSystemsErrors(ARError.SENSORS_ERROR);
      });

    this.magnetometerCoordinatesError$
      .pipe(
        takeUntil(this.sensorsErrors$),
        takeUntil(this.accelerometerCoordinatesError$),
        takeUntil(this.magnetometerCoordinatesError$),
        filter(data => data != null && data != undefined))
      .subscribe(flag => {
        if (flag) this.manageARSystemsErrors(ARError.SENSORS_ERROR);
      });

    this.
  }

  private manageARSystemsErrors(errorType: ARError)
  {
    //this.spinnerService.dismissLoader();
    //this.alertService.showSensorsError(errorType);
  }
}
