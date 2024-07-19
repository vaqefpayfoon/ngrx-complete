import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// http
import { HttpClientModule } from '@angular/common/http';

// Firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAnalyticsModule } from '@angular/fire/analytics';

// Animtion
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';

// Nx Module
import { NxModule } from '@nrwl/angular';

// Environment
import { ENVIRONMENT, Environment } from '@neural/environment';
import { environment } from '@nerv/env/environment';

// NgRx
import { StoreModule, MetaReducer, ActionReducer } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

// Router State
import { NgrxRouterModule } from '@neural/ngrx-router';

// Core
import { CoreModule } from '@neural/core';

// Auth Module
import { AuthModule } from '@neural/auth';

// Angular UI Material Moduels
import { UiModule } from '@neural/ui';
import { ServiceWorkerModule } from '@angular/service-worker';

// google map
import { AgmCoreModule } from '@agm/core';

// GA
import { NgxGoogleAnalyticsModule } from 'ngx-google-analytics';

// Meta Reducers
export const metaReducers: MetaReducer<any>[] = environment.development
  ? [debug]
  : [];

// console.log all actions
export function debug(reducer: ActionReducer<any>): ActionReducer<any> {
  return (state, action) => {
    const result = reducer(state, action);
    console.groupCollapsed(action.type);
    console.log('prev state', state);
    console.log('action', action);
    console.log('next state', result);
    console.groupEnd();

    return result;
  };
}

export function clearState(reducer) {
  return function (state, action) {
    if (action.type === '[Auth] Anonymous Token') {
      return reducer({}, action);
    }

    return reducer(state, action);
  };
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.google.firebase),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFirestoreModule,
    AngularFireAnalyticsModule,
    RouterModule.forRoot([], {
      initialNavigation: 'enabled',
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
      scrollOffset: [0, 0],
      relativeLinkResolution: 'legacy',
    }),
    NxModule.forRoot(),
    StoreModule.forRoot(
      {},
      {
        runtimeChecks: {
          strictStateImmutability: true,
          strictActionImmutability: true,
        },
        metaReducers: [...metaReducers, clearState],
      }
    ),
    EffectsModule.forRoot([]),
    environment.development ? StoreDevtoolsModule.instrument() : [],
    AuthModule.forRoot(),
    CoreModule.forRoot(),
    NgrxRouterModule,
    UiModule,
    AgmCoreModule.forRoot({
      apiKey: environment.google.firebase.apiKey,
      libraries: ['places'],
    }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !!environment.production
        ? environment.production
        : environment.sandbox,
    }),
    NgxGoogleAnalyticsModule.forRoot(environment.ga),
  ],
  providers: [
    { provide: ENVIRONMENT, useValue: environment as Environment },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
