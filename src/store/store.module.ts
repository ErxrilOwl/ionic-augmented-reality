import { CommonModule } from "@angular/common";
import { NgModule, Optional, SkipSelf } from "@angular/core";

import { NgReduxModule, NgRedux, DevToolsExtension } from "@angular-redux/store";
//import { NgReduxRouter, NgReduxRouterModule } from '@angular-redux/router';
import { createLogger } from "redux-logger";
import { persistStore } from 'redux-persist';
import { FluxStandardAction } from 'flux-standard-action';
import { createEpicMiddleware } from 'redux-observable-es6-compat';
import createSagaMiddleware from 'redux-saga';

import { rootReducer } from "./store.reducer";
import { AppState, INITIAL_STATE } from "./store.model";
import
{
  SpinnerActions,
} from "./index";

//import { RootEpics } from './epics';
//import rootSaga from './sagas';

//import { DiscoverDataEpics } from './discover-data/discover-data.epics';
//import { WsEpics } from './ws/ws.epics';

//import { StorageService } from "../services/storage.service";

//import { Converter } from "../util/converter";

const ACTIONS = [
  SpinnerActions
];

const RESOLVERS = [
  /*RootEpics,
  DiscoverDataEpics,
  WsEpics*/
];

@NgModule({
  imports: [CommonModule, NgReduxModule/*, NgReduxRouterModule.forRoot()*/],
  providers: [...ACTIONS, ...RESOLVERS]
})
export class StoreModule
{
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: StoreModule,
    public ngRedux: NgRedux<AppState>,
    devTools: DevToolsExtension,
    //storageService: StorageService,
    //rootEpics: RootEpics,
    //ngReduxRouter: NgReduxRouter,
  )
  {
    if (parentModule)
    {
      throw new Error(
        "StoreModule is already loaded. Import it in the AppModule only"
      );
    }

    /*const persistConfig = {
      key: 'root',
      storage: storageService,
      //storage,
      blacklist: ['spinner', 'ws', 'gps', 'discoverData', 'events', 'router', 'platformDevice']
    };
    const persistedReducer = persistReducer(persistConfig, rootReducer);*/

    //MIDDLEWARES
    const dataNormalizer = () => store => next => action =>
    {
      if (action.payload)
      {

      }

      return next(action);
    };

    const epicMiddleware = createEpicMiddleware<FluxStandardAction<any, any>, FluxStandardAction<any, any>, AppState>();

    const sagaMiddleware = createSagaMiddleware();

    const logger = createLogger({ level: 'log' });

    const middlewares = [dataNormalizer(), epicMiddleware, sagaMiddleware, logger];

    //ENHANCERS
    const enhancers = devTools.isEnabled() ? [devTools.enhancer()] : [];

    ngRedux.configureStore(
      //rootReducer(storageService),
      rootReducer(null),
      INITIAL_STATE,
      middlewares,
      enhancers as any
    );

    // Enable syncing of Angular router state with our Redux store.
    //if (ngReduxRouter)
    //ngReduxRouter.initialize();

    persistStore(ngRedux);

    //Executing epics
    //epicMiddleware.run(rootEpics.createEpics());

    //Executing sagas
    //sagaMiddleware.run(rootSaga);
  }
}