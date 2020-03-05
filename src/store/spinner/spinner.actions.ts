import { Injectable } from "@angular/core";

import { dispatch, NgRedux } from "@angular-redux/store";
import { Action } from "redux";
import { AppState } from '../store.model';

import { environment } from '../../environments/environment';
import { constants } from '../../utils/constants';

export interface SpinnerAction extends Action
{
    payload?: any;
}

@Injectable()
export class SpinnerActions
{
    static readonly SHOW_SPINNER = 'SHOW_SPINNER';
    static readonly HIDE_SPINNER = 'HIDE_SPINNER';

    constructor() { }

    @dispatch()
    showLoader = (): SpinnerAction => ({
        type: SpinnerActions.SHOW_SPINNER
    });

    @dispatch()
    dismissLoader = (): SpinnerAction => ({
        type: SpinnerActions.HIDE_SPINNER
    });
}
