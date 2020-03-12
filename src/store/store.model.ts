import { Action } from 'redux';

// import every model
import { PlatformDeviceState, INITIAL_STATE_PLATFORM_DEVICE } from "./platform-device/platform-device.model";
import { GpsState, INITIAL_STATE_GPS } from './gps/gps.model';
import { AccelerometerState, INITIAL_STATE_ACCELEROMETER } from './accelerometer/accelerometer.model';
import { GyroscopeState, INITIAL_STATE_GYROSCOPE } from './gyroscope/gyroscope.model';
import { MagnetometerState, INITIAL_STATE_MAGNETOMETER } from './magnetometer/magnetometer.model';
import { ARState, INITIAL_STATE_AR } from './ar-infos/ar.model';
import { WsState, INITIAL_STATE_WEB_SERVICES } from './ws/ws.model';

export interface AppState
{
    spinner: boolean,
    splash: string;
    platformDevice: PlatformDeviceState,
    gps: GpsState,
    accelerometer: AccelerometerState,
    gyroscope: GyroscopeState,
    magnetometer: MagnetometerState,
    ar: ARState,
    ws: WsState
}

export const INITIAL_STATE: AppState = {
    spinner: false,
    splash: 'inactive',
    platformDevice: INITIAL_STATE_PLATFORM_DEVICE,
    gps: INITIAL_STATE_GPS,
    accelerometer: INITIAL_STATE_ACCELEROMETER,
    gyroscope: INITIAL_STATE_GYROSCOPE,
    magnetometer: INITIAL_STATE_MAGNETOMETER,
    //poi: INITIAL_STATE_POI,
    ar: INITIAL_STATE_AR,
    ws: INITIAL_STATE_WEB_SERVICES
};

export interface PayloadAction extends Action
{
    payload?: any;
}