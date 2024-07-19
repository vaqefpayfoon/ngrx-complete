import { Injectable } from '@angular/core';
import { Auth, AuthFacade } from '@neural/auth';
import * as fromRoot from '@neural/ngrx-router';
import { AccountsService, ISalesAdvisor } from '@neural/modules/administration';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { ILead, ILeadNotes, ILeadTestDrive, IWishList, leadPurchaseQuotes } from '../../models';
import { LeadService } from '../../services/lead.service';
import { LeadsAction } from '../actions';

import { LeadFacade } from '../facades/lead.facade';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class LeadEffects {
  constructor(
    private actions$: Actions<LeadsAction.LeadManagementsActionsUnion>,
    private leadService: LeadService,
    private accountsService: AccountsService,
    private authFacade: AuthFacade,
    private snackBar: MatSnackBar,
    private leadFacade: LeadFacade
  ) {}

  loadLeadManagement$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(LeadsAction.loadLeadManagements.type),
      withLatestFrom(
        this.leadFacade.getLeadConfig$,
        this.authFacade.selectedCorporate,
        this.authFacade.selectedBranch,
        this.leadFacade.getLeadsFilters$,
        this.leadFacade.getLeadsSorts$,
        this.authFacade.account$
      ),
      switchMap(
        ([
          _,
          params,
          corporate,
          branch,
          selectedFilters,
          selectedSorts,
          account,
        ]) => {
          let filters = {
            ['corporate.uuid']: corporate.uuid,
            ['branch.uuid']: branch.uuid,
            ...selectedFilters,
          };

          const sorts = {
            ...selectedSorts,
          };

          if (
            !!account &&
            !!account?.permissions?.operationRole &&
            (account?.permissions?.operationRole === Auth.OperationRole.SA ||
              account?.permissions?.operationRole ===
                Auth.OperationRole.SALES_ADVISOR)
          ) {
            filters = {
              ...filters,
              ['saleAdvisor.uuid']: account.uuid,
            };
          }

          if (!account?.isSuperAdmin) {
            params = {
              ...params,
              corporateUuid: corporate.uuid,
            };
          }
          return this.leadService.getLeads(params, filters, sorts).pipe(
            map((data: ILead.IData) => {
              return LeadsAction.loadLeadManagementsSuccess({
                leads: data.docs,
                pagination: {
                  limit: data.limit,
                  page: data.page,
                  pages: data.pages,
                  total: data.total,
                },
              });
            }),
            catchError((res: any) => {
              const message =
                res.status !== 401 ? res.error.response.message : null;
              return of(
                LeadsAction.loadLeadManagementsFailed({
                  payload: {
                    status: res.status,
                    message,
                  },
                })
              );
            })
          );
        }
      )
    );
  });
  setLeadManagementPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LeadsAction.SetLeadManagementsPage.type),
      map(() => LeadsAction.loadLeadManagements())
    )
  );
  changeLeadManagementPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LeadsAction.ChangeLeadManagementsPage.type),
      map(() => LeadsAction.loadLeadManagements())
    )
  );
  setLeadManagementFilters$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LeadsAction.SetLeadManagementsFilters.type),
      map(() => LeadsAction.loadLeadManagements())
    )
  );
  getLeadManagement$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LeadsAction.GetLeadManagement.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.leadService.getLead(payload).pipe(
          map((data: ILead.IDocument) =>
            LeadsAction.GetLeadManagementSuccess({
              payload: data,
            })
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              LeadsAction.GetLeadManagementFail({
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
  getSalesAdvisor$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LeadsAction.GetSalesAdvisor.type),
      map((action) => action.payload),
      switchMap((payload) => {
        const corporateUuid = payload.corporate;
        const branchUuid = payload.branch;
        const brand = payload.brand;
        return this.accountsService
          .getSalesAdvisor({ corporateUuid, branchUuid, brand })
          .pipe(
            map((data: ISalesAdvisor.ISADocument[]) =>
              LeadsAction.GetSalesAdvisorSuccess({
                payload: data,
              })
            ),
            catchError((res: any) => {
              const message =
                res.status !== 401 ? res.error.response.message : null;
              return of(
                LeadsAction.GetSalesAdvisorFail({
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
  handleGetLeadManagementFail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LeadsAction.GetLeadManagementFail.type),
      map((action) => {
        const { message } = action.payload;
        this.toggleSnackbar(message);
        return action.payload;
      }),
      map(() => LeadsAction.RedirectToLeadManagement())
    )
  );
  createLeadManagement$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LeadsAction.CreateLeadManagement.type),
      map((action) => action.payload),
      switchMap((payload: ILead.ICreate) => {
        return this.leadService.createLead(payload).pipe(
          map((lead: ILead.IDocument) => {
            return LeadsAction.CreateLeadManagementSuccess({
              payload: lead,
            });
          }),
          catchError((res: any) => {
            const message =
                res.status !== 401 ? res.error.response.message : null;
            return of(
              LeadsAction.CreateLeadManagementFail({ payload: message })
            );
          })
        );
      })
    )
  );
  updateLeadManagement$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LeadsAction.UpdateLeadManagement.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.leadService.updateLead(payload).pipe(
          map((data) => {
            return LeadsAction.UpdateLeadManagementSuccess({
              payload: {
                id: data.uuid,
                changes: data,
              },
            });
          }),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              LeadsAction.UpdateLeadManagementFail({
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
  handleCreateLeadManagementFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(LeadsAction.CreateLeadManagementFail.type),
        map((action) => {
          return this.toggleSnackbar(`${action.payload}`);
        })
      ),
    { dispatch: false }
  );
  handleUpdateLeadManagementSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(LeadsAction.UpdateLeadManagementSuccess.type),
        map((action) => {
          return this.toggleSnackbar(`Lead has been updated.`);
        })
      ),
    { dispatch: false }
  );
  handleCreateLeadManagement$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LeadsAction.CreateLeadManagementSuccess.type),
      map((action) => {
        this.toggleSnackbar(`lead has been created.`);
        return action.payload;
      }),
      map(() => LeadsAction.RedirectToLeadManagement())
    )
  );
  handleUpdateLeadManagementFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(LeadsAction.UpdateLeadManagementFail.type),
        map((action) => {
          return this.toggleSnackbar(`${action.payload.message}`);
        })
      ),
    { dispatch: false }
  );
  handleRedirectToLeadManagement$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LeadsAction.RedirectToLeadManagement.type),
      map(() => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: ['/app/hub/lead/leadList'],
          },
        });
      })
    )
  );
  getWishList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LeadsAction.GetWishList.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.leadService.getWishList(payload).pipe(
          map((data: IWishList.IData) =>
            LeadsAction.GetWishListSuccess({
              payload: data,
            })
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              LeadsAction.GetWishListFail({
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
  getPurchaseQuote$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LeadsAction.GetPurchaseQuote.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.leadService.getPurchaseQuotes(payload).pipe(
          map((data: leadPurchaseQuotes.IData) =>
            LeadsAction.GetPurchaseQuoteSuccess({
              payload: data,
            })
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              LeadsAction.GetPurchaseQuoteFail({
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
  getTestDrive$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LeadsAction.GetTestDrive.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.leadService.gettestDriver(payload).pipe(
          map((data: ILeadTestDrive.IData) =>
            LeadsAction.GetTestDriveSuccess({
              payload: data,
            })
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              LeadsAction.GetTestDriveFail({
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
  getGlobalBrands$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LeadsAction.GetGlobalBrands.type),
      switchMap(() => {
        return this.accountsService.getGlobalVehicleBrands().pipe(
          map((payload) => LeadsAction.GetGlobalBrandsSuccess({ payload })),
          catchError((res) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(LeadsAction.GetGlobalBrandsFail({ payload: message }));
          })
        );
      })
    )
  );
  createLeadNote$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LeadsAction.CreateLeadNote.type),
      map((action) => action.payload),
      switchMap((payload: ILeadNotes.ISaveNote) => {
        return this.leadService.createLeadNote(payload).pipe(
          map((lead: ILead.IDocument) => {
            return LeadsAction.CreateLeadNoteSuccess({
              payload: lead,
            });
          }),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(LeadsAction.CreateLeadNoteFail({ payload: message }));
          })
        );
      })
    )
  );
  updateLeadNote$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LeadsAction.UpdateLeadNote.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.leadService
          .updateLeadNote(payload.changes, payload.noteUuid)
          .pipe(
            map((data) => {
              return LeadsAction.UpdateLeadNoteSuccess({
                payload: {
                  id: data.uuid,
                  changes: data,
                },
              });
            }),
            catchError((res: any) => {
              const message =
                res.status !== 401 ? res.error.response.message : null;
              return of(
                LeadsAction.UpdateLeadNoteFail({
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
  deleteLeadNote$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LeadsAction.DeleteLeadNote.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.leadService
          .deleteLeadNote(payload.uuid, payload.noteUuid)
          .pipe(
            map((data) => {
              return LeadsAction.DeleteLeadNoteSuccess({
                payload: data
              });
            }),
            catchError((res: any) => {
              const message =
                res.status !== 401 ? res.error.response.message : null;
              return of(
                LeadsAction.DeleteLeadNoteFail({
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
  handleCreateLeadNoteSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(LeadsAction.CreateLeadNoteSuccess.type),
        map((action) => {
          // const { email } = action.payload;
          return this.toggleSnackbar(`note has been created.`);
        })
      ),
    { dispatch: false }
  );
  handleUpdateNoteFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(LeadsAction.UpdateLeadNoteFail.type),
        map((action) => {
          return this.toggleSnackbar(`${action.payload.message}`);
        })
      ),
    { dispatch: false }
  );
  handleDeleteNoteFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(LeadsAction.DeleteLeadNoteFail.type),
        map((action) => {
          return this.toggleSnackbar(action.payload.message);
        })
      ),
    { dispatch: false }
  );
  sendManualInvitation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LeadsAction.SendManualInvitation.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.leadService.sendManualInvitation(payload).pipe(
          map(() =>
            LeadsAction.SendManualInvitationSuccess()
          ),
          catchError((res: any) => {
            let message = '';
            if(res) {
              message = res.status !== 401 ? res.message : null;
            }
            return of(
              LeadsAction.SendManualInvitationFail({
                payload: message,
              })
            );
          })
        );
      })
    )
  );
  handleSendManulaInvitationSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(LeadsAction.SendManualInvitationSuccess.type),
        map((action) => {
          return this.toggleSnackbar(`sending manual invitation succeed.`);
        })
      ),
    { dispatch: false }
  );
  handleSendManulaInvitationFaild$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(LeadsAction.SendManualInvitationFail.type),
        map((action) => {
          return this.toggleSnackbar('there is problem to sending email');
        })
      ),
    { dispatch: false }
  );
  toggleSnackbar(message: string) {
    return this.snackBar.open(message, '', {
      duration: 5000,
      verticalPosition: 'top',
      panelClass: ['snackbar--custom'],
    });
  }
}
