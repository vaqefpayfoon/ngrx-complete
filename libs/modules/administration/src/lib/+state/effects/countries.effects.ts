import { Injectable } from '@angular/core';

// Create Effects
import { createEffect, Actions, ofType } from '@ngrx/effects';

// Actions
import { CountriesActions } from '../actions';

// Services
import { CountryService } from '../../services';

// Models
import { ICountry } from '../../models';

// RxJs
import { of } from 'rxjs';
import { map, switchMap, catchError, tap, debounceTime } from 'rxjs/operators';

import { MatSnackBar } from '@angular/material/snack-bar';

// NgRx Router
import * as fromRoot from '@neural/ngrx-router';

@Injectable()
export class CountriesEffects {
  constructor(
    private actions$: Actions<CountriesActions.CountiesActionsUnion>,
    private countryService: CountryService,
    private snackBar: MatSnackBar
  ) {}

  loadCountries$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CountriesActions.LoadCountries.type),
      switchMap(() => {
        return this.countryService.getCountries().pipe(
          map((countries: ICountry.IDocument[]) =>
            CountriesActions.LoadCountriesSuccess({ payload: countries })
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(CountriesActions.LoadCountriesFail({ payload: message }));
          })
        );
      })
    )
  );

  loadCountryNames$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CountriesActions.LoadCountryNames.type),
      switchMap(() => {
        return this.countryService.getCountryNames().pipe(
          map((countries: string[]) =>
            CountriesActions.LoadCountryNamesSuccess({ payload: countries })
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              CountriesActions.LoadCountryNamesFail({ payload: message })
            );
          })
        );
      })
    )
  );

  createCountry$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CountriesActions.CreateCountry.type),
      map(action => action.payload),
      switchMap((payload: ICountry.ICreate) => {
        return this.countryService.createCountry(payload).pipe(
          map((country: ICountry.IDocument) => {
            return CountriesActions.CreateCountrySuccess({ payload: country });
          }),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(CountriesActions.CreateCountryFail({ payload: message }));
          })
        );
      })
    )
  );

  updateCountry$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CountriesActions.UpdateCountry.type),
      map(action => action.payload),
      switchMap((payload: ICountry.IUpdate) => {
        return this.countryService.updateCountry(payload).pipe(
          map((country: ICountry.IDocument) => {
            return CountriesActions.UpdateCountrySuccess({
              payload: {
                id: country.uuid,
                changes: country
              }
            });
          }),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(CountriesActions.UpdateCountryFail({ payload: message }));
          })
        );
      })
    )
  );

  getCountry$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CountriesActions.GetCountry.type),
      map(action => action.payload),
      switchMap(payload => {
        return this.countryService.getCountryByName(payload).pipe(
          map((country: ICountry.IGetCountry) =>
            CountriesActions.GetCountrySuccess({ payload: country })
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(CountriesActions.GetCountryFail({ payload: message }));
          })
        );
      })
    )
  );

  activeAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CountriesActions.ActivateCountry.type),
      map(action => action.payload),
      switchMap((country: ICountry.IDocument) => {
        return this.countryService.activateCountry(country).pipe(
          map(() =>
            CountriesActions.ActivateCountrySuccess({
              payload: {
                id: country.uuid,
                changes: {
                  name: country.name,
                  isActive: !country.isActive
                }
              }
            })
          ),
          catchError(res => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              CountriesActions.ActivateCountrySuccess({ payload: message })
            );
          })
        );
      })
    )
  );

  deactivateAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CountriesActions.DeactivateCountry.type),
      map(action => action.payload),
      switchMap((country: ICountry.IDocument) => {
        return this.countryService.deactivateCountry(country).pipe(
          map(() =>
            CountriesActions.DeactivateCountrySuccess({
              payload: {
                id: country.uuid,
                changes: {
                  name: country.name,
                  isActive: !country.isActive
                }
              }
            })
          ),
          catchError(res => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              CountriesActions.DeactivateCountryFail({ payload: message })
            );
          })
        );
      })
    )
  );

  handleCreateCountrySuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CountriesActions.CreateCountrySuccess.type),
      map(action => {
        const { name } = action.payload;
        this.toggleSnackbar(`${name} has been created.`);
        return action.payload;
      }),
      debounceTime(1000),
      map(() => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: ['/app/administration/countries']
          }
        });
      })
    )
  );

  handleUpdateCountrySuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CountriesActions.UpdateCountrySuccess.type),
      map(action => {
        const { name } = action.payload.changes;
        this.toggleSnackbar(`${name} has been updated.`);
        return action.payload;
      }),
      debounceTime(1000),
      map(() => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: ['/app/administration/countries']
          }
        });
      })
    )
  );

  handleActivateCountrySuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CountriesActions.ActivateCountrySuccess.type),
        map(action => {
          const { name } = action.payload.changes;
          return this.toggleSnackbar(`${name} has been activated.`);
        })
      ),
    { dispatch: false }
  );

  handleDeactivateCountrySuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CountriesActions.DeactivateCountrySuccess.type),
        map(action => {
          const { name } = action.payload.changes;
          return this.toggleSnackbar(`${name} has been deactivated.`);
        })
      ),
    { dispatch: false }
  );

  toggleSnackbar(message: string) {
    return this.snackBar.open(message, '', {
      duration: 5000,
      verticalPosition: 'top',
      panelClass: ['snackbar--custom']
    });
  }
}
