import { Injectable } from '@angular/core';

//import { combineEpics } from 'redux-observable';
import { combineEpics } from 'redux-observable-es6-compat';

import { SplashEpics } from './splash/splash.epics';

@Injectable()
export class RootEpics
{
    constructor(private splashEpics: SplashEpics) { }

    createEpics()
    {
        return combineEpics(
            this.splashEpics.createSplashAnimation()
        );
    }
}