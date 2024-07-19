import { Injectable } from '@angular/core';

// Create Effects
import { createEffect, Actions, ofType } from '@ngrx/effects';

// Actions
import { PromotionsActions } from '../actions';

// Services
import { RewardsService } from '../../services';

// Models
import { IPromotions } from '../../models';

// RxJs
import { of } from 'rxjs';
import { map, switchMap, catchError, withLatestFrom } from 'rxjs/operators';

import { MatSnackBar } from '@angular/material/snack-bar';

// Facades
import { PromotionsFacade } from '../facades';

// NgRx Router
import * as fromRoot from '@neural/ngrx-router';

import { AuthFacade, AuthActions } from '@neural/auth';
import { IVehicle } from '@neural/modules/customer/vehicles';

@Injectable()
export class PromotionsEffects {
  constructor(
    private actions$: Actions<
      PromotionsActions.PromotionsActionsUnion | AuthActions.AuthActionsUnion
    >,
    private rewardsService: RewardsService,
    private promotionsFacade: PromotionsFacade,
    private authFacade: AuthFacade,
    private snackBar: MatSnackBar
  ) {}

  setPromotionsPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PromotionsActions.SetPromotionsPage.type),
      map(() => PromotionsActions.LoadPromotions())
    )
  );

  changePromotionsPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PromotionsActions.ChangePromotionsPage.type),
      map(() => PromotionsActions.LoadPromotions())
    )
  );

  setPromotionsFilters$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PromotionsActions.SetPromotionsFilters.type),
      map(() => PromotionsActions.LoadPromotions())
    )
  );

  loadPromotions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PromotionsActions.LoadPromotions.type),
      withLatestFrom(
        this.promotionsFacade.promotionsConfig$,
        this.authFacade.selectedCorporate,
        this.promotionsFacade.promotionsFilters$,
        this.promotionsFacade.promotionsSorts$
      ),
      switchMap(([_, params, corporate, selectedFilters, selectedSorts]) => {
        const filters = {
          ['corporateUuid']: corporate.uuid,
          ...selectedFilters,
        };

        const sorts = {
          ...selectedSorts,
        };

        return this.rewardsService.getPromotions(params, filters, sorts).pipe(
          map((data: IPromotions.IData) =>
            PromotionsActions.LoadPromotionsSuccess({
              promotions: data.docs,
              pagination: {
                limit: data.limit,
                page: data.page,
                pages: data.pages,
                total: data.total,
              },
            })
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              PromotionsActions.LoadPromotionsFail({
                payload: {
                  status: res.status,
                  message,
                },
              })
            );
          })
        );
      })
    )
  );

  getPromotion$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PromotionsActions.GetPromotion.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.rewardsService.getPromotion(payload).pipe(
          map((data: IPromotions.IDocument) => {
            const uuids = data?.eligibility?.customers?.uuids;
            const vins = data?.eligibility?.vehicles?.vins;
            
            return PromotionsActions.GetPromotionSuccess({
              payload: data,
              vehicles: Object.keys(vins).map((uuid) => vins[uuid]),
              accounts: Object.keys(uuids).map((uuid) => uuids[uuid]),

            })}
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              PromotionsActions.GetPromotionFail({
                payload: {
                  status: res.status,
                  message,
                },
              })
            );
          })
        );
      })
    )
  );

  handleGetPromotionFail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PromotionsActions.GetPromotionFail.type),
      map((action) => {
        return this.toggleSnackbar(`${action.payload.message}`);
      }),
      map(() => PromotionsActions.RedirectToPromotions())
    )
  );

  createPromotion$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PromotionsActions.CreatePromotion.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.rewardsService.createPromotions(payload).pipe(
          map((promo) =>
            PromotionsActions.CreatePromotionSuccess({ payload: promo })
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res?.error?.response?.message : null;
            return of(
              PromotionsActions.CreatePromotionFail({
                payload: {
                  message,
                  status: res.status,
                  data: res.error.response.data,
                },
              })
            );
          })
        );
      })
    )
  );

  handleCreatePromotionSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PromotionsActions.CreatePromotionSuccess.type),
      map((action) => {
        const { code } = action.payload;
        this.toggleSnackbar(`${code} has been created.`);
        return action.payload;
      }),
      map(() => PromotionsActions.RedirectToPromotions())
    )
  );

  handleCreatePromotionFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(PromotionsActions.CreatePromotionFail.type),
        map((action) => {
          const { message, data } = action.payload;
          this.toggleSnackbar(message);

          const linkSource = `data:text/plain;base64,${data}`;
          const downloadLink = document.createElement('a');
          downloadLink.href = linkSource;
          downloadLink.download = 'error file ' + new Date().toDateString();

          downloadLink.click();
          this.toggleSnackbar(message);
          return action.payload;
        })
      ),
    {
      dispatch: false,
    }
  );

  updatePromotion$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PromotionsActions.UpdatePromotion.type),
      map((action) => action.payload),
      switchMap((payload: IPromotions.IDocument) => {
        return this.rewardsService.updatePromotions(payload).pipe(
          map((promo: IPromotions.IDocument) => {
            return PromotionsActions.UpdatePromotionSuccess({
              payload: {
                id: promo.uuid,
                changes: promo,
              },
            });
          }),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              PromotionsActions.UpdatePromotionFail({
                payload: {
                  message,
                  status: res.status,
                  data: res.error.response.data,
                },
              })
            );
          })
        );
      })
    )
  );

  handleUpdatePromotionSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PromotionsActions.UpdatePromotionSuccess.type),
      map((action) => {
        const { code } = action.payload.changes;
        this.toggleSnackbar(`${code} has been updated.`);
        return action.payload;
      }),
      map(() => PromotionsActions.RedirectToPromotions())
    )
  );

  handleUpdatePromotionFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(PromotionsActions.UpdatePromotionFail.type),
        map((action) => {
          const { message, data } = action.payload;
          this.toggleSnackbar(message);

          const linkSource = `data:text/plain;base64,${data}`;
          const downloadLink = document.createElement('a');
          downloadLink.href = linkSource;
          downloadLink.download = 'error file ' + new Date().toDateString();

          downloadLink.click();

          return action.payload;
        })
      ),
    {
      dispatch: false,
    }
  );

  activePromotion$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PromotionsActions.ActivatePromotion.type),
      map((action) => action.payload),
      switchMap((promo: IPromotions.IDocument) => {
        return this.rewardsService.activatePromotion(promo).pipe(
          map(() =>
            PromotionsActions.ActivatePromotionsSuccess({
              payload: {
                id: promo.uuid,
                changes: {
                  active: !promo.active,
                  code: promo.code,
                },
              },
            })
          ),
          catchError((res) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              PromotionsActions.ActivatePromotionFail({
                payload: {
                  message,
                  status: res.status,
                },
              })
            );
          })
        );
      })
    )
  );

  handleActivatePromotionsSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(PromotionsActions.ActivatePromotionsSuccess.type),
        map((action) => {
          const { code } = action.payload.changes;
          this.toggleSnackbar(`${code} has been activated.`);
          return action.payload;
        })
      ),
    {
      dispatch: false,
    }
  );

  handleActivatePromotionFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(PromotionsActions.ActivatePromotionFail.type),
        map((action) => {
          const { message } = action.payload;
          this.toggleSnackbar(message);
          return action.payload;
        })
      ),
    {
      dispatch: false,
    }
  );

  deactivatePromotion$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PromotionsActions.DeactivatePromotion.type),
      map((action) => action.payload),
      switchMap((promo: IPromotions.IDocument) => {
        return this.rewardsService.deactivatePromotion(promo).pipe(
          map(() =>
            PromotionsActions.DeactivatePromotionSuccess({
              payload: {
                id: promo.uuid,
                changes: {
                  active: !promo.active,
                  code: promo.code,
                },
              },
            })
          ),
          catchError((res) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              PromotionsActions.DeactivatePromotionFail({
                payload: {
                  message,
                  status: res.status,
                },
              })
            );
          })
        );
      })
    )
  );

  handleDeactivatePromotionsSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(PromotionsActions.DeactivatePromotionSuccess.type),
        map((action) => {
          const { code } = action.payload.changes;
          this.toggleSnackbar(`${code} has been deactivated.`);
          return action.payload;
        })
      ),
    {
      dispatch: false,
    }
  );

  handleDeactivatePromotionFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(PromotionsActions.DeactivatePromotionFail.type),
        map((action) => {
          const { message } = action.payload;
          this.toggleSnackbar(message);
          return action.payload;
        })
      ),
    {
      dispatch: false,
    }
  );

  checkCodeValidity$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PromotionsActions.CodeValidation.type),
      map((action) => action.payload),
      withLatestFrom(this.authFacade.selectedCorporate),
      switchMap(([payload, corporate]) => {
        const codeValidateValue = {
          promo: payload.code,
          corporateUuid: corporate.uuid,
        };

        return this.rewardsService
          .validatePromotionCode(codeValidateValue)
          .pipe(
            map((message) =>
              PromotionsActions.CodeValidationSuccess({
                payload: message,
              })
            ),
            catchError((res) => {
              const message =
                res.status !== 401 ? res.error.response.message : null;

              return of(
                PromotionsActions.CodeValidationFail({
                  payload: {
                    status: res.status,
                    message,
                  },
                })
              );
            })
          );
      })
    )
  );

  handleCheckCodeValiditySuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(PromotionsActions.CodeValidationSuccess.type),
        map((action) => {
          const message = action.payload;
          this.toggleSnackbar(message);
          return action.payload;
        })
      ),
    {
      dispatch: false,
    }
  );

  handleCheckCodeValidityFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(PromotionsActions.CodeValidationFail.type),
        map((action) => {
          const { message } = action.payload;
          this.toggleSnackbar(message);
          return action.payload;
        })
      ),
    {
      dispatch: false,
    }
  );

  getAccountByEmail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PromotionsActions.GetAccountByEmail.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.rewardsService.getAccountByEmail(payload).pipe(
          map((message) =>
            PromotionsActions.GetAccountByEmailSuccess({
              payload: message,
            })
          ),
          catchError((res) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;

            return of(
              PromotionsActions.GetAccountByEmailFail({
                payload: {
                  status: res.status,
                  message,
                },
              })
            );
          })
        );
      })
    )
  );

  handleGetAccountByEmailFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(PromotionsActions.GetAccountByEmailFail.type),
        map((action) => {
          const { message } = action.payload;
          this.toggleSnackbar(message);
          return action.payload;
        })
      ),
    {
      dispatch: false,
    }
  );



  getBrands$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PromotionsActions.GetBrands.type),
      withLatestFrom(this.authFacade.selectedCorporate),
      switchMap(([_, selectedCorporate]) => {
        return this.rewardsService
          .getVehicleReferenceBrandModelList(selectedCorporate.uuid)
          .pipe(
            map((data) =>
              PromotionsActions.GetBrandsSuccess({
                payload: data,
              })
            ),
            catchError((res) => {
              const message =
                res.status !== 401 ? res.error.response.message : null;

              return of(
                PromotionsActions.GetBrandsFail({
                  payload: {
                    status: res.status,
                    message,
                  },
                })
              );
            })
          );
      })
    )
  );

  handleGetBrandsFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(PromotionsActions.GetBrandsFail.type),
        map((action) => {
          const { message } = action.payload;
          this.toggleSnackbar(message);
          return action.payload;
        })
      ),
    {
      dispatch: false,
    }
  );

  handleRedirectToPromotions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PromotionsActions.RedirectToPromotions.type),
      map(() => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: ['/app/rewards/voucher'],
          },
        });
      })
    )
  );

  activeRedeemPromotion$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PromotionsActions.ActivateRedeemPromotion.type),
      map((action) => action.payload),
      switchMap((promo: IPromotions.IDocument) => {
        return this.rewardsService.updatePromotions(promo).pipe(
          map(() =>
            PromotionsActions.ActivateRedeemPromotionsSuccess({
              payload: {
                id: promo.uuid,
                changes: {
                  autoRedeem: promo.autoRedeem,
                  code: promo.code,
                },
              },
            })
          ),
          catchError((res) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              PromotionsActions.ActivateRedeemPromotionFail({
                payload: {
                  message,
                  status: res.status,
                },
              })
            );
          })
        );
      })
    )
  );

  handleActivateRedeemPromotionsSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(PromotionsActions.ActivateRedeemPromotionsSuccess.type),
        map((action) => {
          const { code } = action.payload.changes;
          this.toggleSnackbar(`${code} has been updated.`);
          return action.payload;
        })
      ),
    {
      dispatch: false,
    }
  );

  handleActivateRedeemPromotionFail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PromotionsActions.ActivateRedeemPromotionFail.type),
      map((action) => {
        const { message } = action.payload;
        this.toggleSnackbar(message);
        return action.payload;
      }),
      map(() => PromotionsActions.LoadPromotions())
    )
  );

  deactivateRedeemPromotion$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PromotionsActions.DeactivateRedeemPromotion.type),
      map((action) => action.payload),
      switchMap((promo: IPromotions.IDocument) => {
        return this.rewardsService.updatePromotions(promo).pipe(
          map(() =>
            PromotionsActions.DeactivateRedeemPromotionSuccess({
              payload: {
                id: promo.uuid,
                changes: {
                  autoRedeem: promo.autoRedeem,
                  code: promo.code,
                },
              },
            })
          ),
          catchError((res) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              PromotionsActions.DeactivateRedeemPromotionFail({
                payload: {
                  message,
                  status: res.status,
                },
              })
            );
          })
        );
      })
    )
  );

  handleDeactivateRedeemPromotionsSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(PromotionsActions.DeactivateRedeemPromotionSuccess.type),
        map((action) => {
          const { code } = action.payload.changes;
          this.toggleSnackbar(`${code} has been updated.`);
          return action.payload;
        })
      ),
    {
      dispatch: false,
    }
  );

  handleDeactivateRedeemPromotionFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(PromotionsActions.DeactivateRedeemPromotionFail.type),
        map((action) => {
          const { message } = action.payload;
          this.toggleSnackbar(message);
          return action.payload;
        }),
        map(() => PromotionsActions.LoadPromotions())
      ),
    {
      dispatch: false,
    }
  );

  getInboxAccounts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PromotionsActions.GetInboxAccounts.type),
      map((action) => action.payload),
      withLatestFrom(this.authFacade.selectedCorporate),
      switchMap(([payload, selectedCorporate]) => {
        const filters: IPromotions.IFilter = {
          ...payload,
        };
        const config: IPromotions.IConfig = {
          corporateUuid: selectedCorporate.uuid,
          limit: 1000,
          page: 1,
        };

        return this.rewardsService.getAccounts(config, filters).pipe(
          map((acounts: IPromotions.IAccountData) => {
            return PromotionsActions.GetInboxAccountsSuccess({
              payload: acounts.docs,
            });
          }),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              PromotionsActions.GetInboxAccountsFail({
                payload: {
                  message,
                  status: res.status,
                },
              })
            );
          })
        );
      })
    )
  );

  handleGetInboxAccountsFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(PromotionsActions.GetInboxAccountsFail.type),
        map((action) => {
          const { message } = action.payload;
          this.toggleSnackbar(message);
          return action.payload;
        })
      ),
    {
      dispatch: false,
    }
  );

  loadVehicles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PromotionsActions.LoadVehicles.type),
      map((action) => action.payload),
      withLatestFrom(this.authFacade.selectedCorporate),
      switchMap(([params, corporate]) => {
        const { uuid } = corporate;
        return this.rewardsService.getVehicles(params, uuid).pipe(
          map((data: IVehicle.IData) =>
            PromotionsActions.LoadVehiclesSuccess({
              payload: data.docs,
            })
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              PromotionsActions.LoadVehiclesFail({ payload: message })
            );
          })
        );
      })
    )
  );

  handleLoadVehiclesFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(PromotionsActions.LoadVehiclesFail.type),
        map((action) => {
          const message = action.payload;
          this.toggleSnackbar(message);
          return action.payload;
        })
      ),
    {
      dispatch: false,
    }
  );

  toggleSnackbar(message: string) {
    return this.snackBar.open(message, '', {
      duration: 5000,
      verticalPosition: 'top',
      panelClass: ['snackbar--custom'],
    });
  }
}
