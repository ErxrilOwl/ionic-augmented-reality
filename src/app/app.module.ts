import { NgModule } from '@angular/core';
import { NgReduxRouterModule } from '@angular-redux/router';
import { NgReduxModule } from '@angular-redux/store';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { Device } from "@ionic-native/device/ngx";
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Globalization } from '@ionic-native/globalization/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import { Network } from '@ionic-native/network/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { DeviceMotion } from '@ionic-native/device-motion/ngx';
import { Gyroscope } from '@ionic-native/gyroscope/ngx';
import { Magnetometer } from '@ionic-native/magnetometer/ngx';
import { CameraPreview } from '@ionic-native/camera-preview/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

//Components
import { SplashModule } from '../components/splash/splash.module';
import { SpinnerModule } from '../components/spinner/spinner.module';

//Providers
import { Api } from '../providers/api/api';
import { PoisProvider } from '../providers';

//Services
//import { NetworkService } from '../services/network.service';
import { StorageService } from '../services/storage.service';
import { SensorsService } from '../services/sensors.service';
import { AlertService } from '../services/alert.service';
//import { ToastService } from '../services/toast.service';

//Redux store
import { StoreModule } from '../store/store.module';

import
{
  getDevice,
  getHTTP,
  getNetwork,
  getNativeStorage,
  getScreenOrientation,
  getDiagnostic,
  getLocationAccuracy,
  getGeolocation,
  getDeviceMotion,
  getGyroscope,
  getMagnetometer,
  getCameraPreview,
} from './app.providers';

export function createTranslateLoader(http: HttpClient)
{
  return new TranslateHttpLoader(http, '../assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    HttpClientModule,
    StoreModule,
    SplashModule,
    SpinnerModule,
    NgReduxModule,
    NgReduxRouterModule.forRoot(),
    IonicModule.forRoot({
      mode: 'md'
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [
          HttpClient
        ]
      }
    }),
    AppRoutingModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: Device, useClass: getDevice() },
    { provide: HTTP, useClass: getHTTP() },    //HTTP mocked with empty functions. Calls managed with mocked json data
    { provide: Network, useClass: getNetwork() },
    { provide: NativeStorage, useClass: getNativeStorage() },
    { provide: ScreenOrientation, useClass: getScreenOrientation() },
    { provide: Diagnostic, useClass: getDiagnostic() },
    { provide: LocationAccuracy, useClass: getLocationAccuracy() },
    { provide: Geolocation, useClass: getGeolocation() },
    { provide: DeviceMotion, useClass: getDeviceMotion() },
    { provide: Gyroscope, useClass: getGyroscope() },
    { provide: Magnetometer, useClass: getMagnetometer() },
    { provide: CameraPreview, useClass: getCameraPreview() },
    Globalization,  //Globalization not mocked. Calls managed directly in app.component
    //NetworkService,
    StorageService,
    SensorsService,
    AlertService,
    //ToastService,
    PoisProvider,
    Api,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
