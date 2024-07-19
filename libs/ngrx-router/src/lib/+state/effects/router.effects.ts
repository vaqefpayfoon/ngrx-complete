import { Injectable } from '@angular/core';

// Router
import { Router, ActivationEnd } from '@angular/router';

// Location
import { Location } from '@angular/common';

// NgRx effect and actions
import { Store } from '@ngrx/store';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { RouterActions } from '../actions';

// RxJs
import { tap, map, filter, switchMap } from 'rxjs/operators';

@Injectable()
export class NgrxRouterEffects {
  constructor(
    private actions$: Actions<RouterActions.RouterActionsUnion>,
    private router: Router,
    private location: Location,
    private store: Store<any>
  ) {
    this._listenToRouter();
  }

  navigate$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(RouterActions.Go.type),
        map(action => {
          return action.payload;
        }),
        tap(({ path, query: queryParams, extras }) => {
          this.router.navigate(path, { queryParams, ...extras });
        })
      ),
    {
      dispatch: false
    }
  );

  navigateBack$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(RouterActions.Back.type),
        tap(() => this.location.back())
      ),
    {
      dispatch: false
    }
  );

  navigateForward$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(RouterActions.Forward.type),
        tap(() => this.location.forward())
      ),
    {
      dispatch: false
    }
  );

  private _listenToRouter() {
    this.router.events
      .pipe(filter(event => event instanceof ActivationEnd))
      .subscribe((event: ActivationEnd) =>
        this.store.dispatch(
          RouterActions.RouteChange({
            payload: {
              params: { ...event.snapshot.params },
              path: event.snapshot.routeConfig.path
            }
          })
        )
      );
  }
}
