import { Component, OnInit, AfterViewInit } from '@angular/core';

import { select } from "@angular-redux/store";
import { Observable, Subject } from "rxjs";
import { first } from "rxjs/operators";

import { StatusBar } from "@ionic-native/status-bar/ngx";
import { ScreenOrientation } from "@ionic-native/screen-orientation/ngx";
import { Diagnostic } from "@ionic-native/diagnostic/ngx";
import { NativeStorage } from "@ionic-native/native-storage/ngx";

import { constants } from '../../utils/constants';

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

  constructor(
    private statusBar: StatusBar,
    private screenOrientation: ScreenOrientation,
    private diagnosticService: Diagnostic,
    private nativeStorage: NativeStorage
  ) {
    this.authFlagsRetrieve$ = new Subject<void>();
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

  ngAfterViewInit()
  {
    
  }
}
