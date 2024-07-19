import { Injectable } from '@angular/core';

// Create Effects
import { createEffect, Actions, ofType } from '@ngrx/effects';

// Actions
import { InboxMessagesActions } from '../actions';

// Services
import { InboxMessageService } from '../../services';

// Models
import { IInboxMessages } from '../../models';

// RxJs
import { of } from 'rxjs';
import { map, switchMap, catchError, withLatestFrom } from 'rxjs/operators';

import { MatSnackBar } from '@angular/material/snack-bar';

// Facades
import { InboxMessagesFacade } from '../facades';

// NgRx Router
import * as fromRoot from '@neural/ngrx-router';

import { Auth, AuthFacade } from '@neural/auth';
import { IVehicle } from '@neural/modules/customer/vehicles';

@Injectable()
export class InboxMessagesEffects {
  constructor(
    private actions$: Actions<InboxMessagesActions.InboxMessagesActionsUnion>,
    private inboxMessageService: InboxMessageService,
    private inboxMessagesFacade: InboxMessagesFacade,
    private authFacade: AuthFacade,
    private snackBar: MatSnackBar
  ) {}

  setInboxMessagesPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InboxMessagesActions.SetInboxMessagesPage.type),
      map(() => InboxMessagesActions.LoadInboxMessages())
    )
  );

  setInboxMessagesFilters$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InboxMessagesActions.SetInboxMessagesFilters.type),
      map(() => InboxMessagesActions.LoadInboxMessages())
    )
  );

  loadInboxMessages$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InboxMessagesActions.LoadInboxMessages.type),
      withLatestFrom(
        this.inboxMessagesFacade.inboxMessagesConfig$,
        this.authFacade.selectedCorporate,
        this.inboxMessagesFacade.getInboxMessagesFilters$
      ),
      switchMap(([_, params, corporate, selectedFilters]) => {
        const { uuid } = corporate;
        let filters = {
          ...selectedFilters,
        };
        return this.inboxMessageService
          .getInboxMessages(params, uuid, filters)
          .pipe(
            map((data: IInboxMessages.IData) =>
              InboxMessagesActions.LoadInboxMessagesSuccess({
                inboxMessages: data.docs,
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
                InboxMessagesActions.LoadInboxMessagesFail({
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

  createInboxMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InboxMessagesActions.CreateInboxMessage.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.inboxMessageService.createInboxMessage(payload).pipe(
          map((campaign: IInboxMessages.IDocument) => {
            return InboxMessagesActions.CreateInboxMessageSuccess({
              payload: campaign,
            });
          }),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              InboxMessagesActions.CreateInboxMessageFail({ payload: message })
            );
          })
        );
      })
    )
  );

  handleCreateInboxMessageSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InboxMessagesActions.CreateInboxMessageSuccess.type),
      map((action) => {
        const {
          payload: { title },
        } = action.payload;
        this.toggleSnackbar(`${title} has been created`);
        return action.payload;
      }),
      map(() => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: [`/app/marketing/inbox-messages`],
          },
        });
      })
    )
  );

  handleCreateInboxMessageFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(InboxMessagesActions.CreateInboxMessageFail.type),
        map((action) => {
          this.toggleSnackbar(action.payload);
          return action.payload;
        })
      ),
    {
      dispatch: false,
    }
  );

  sendInboxMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InboxMessagesActions.SendInboxMessage.type),
      map((action) => action.payload),
      switchMap((payload) => {
        return this.inboxMessageService.sendInboxMessage(payload).pipe(
          map(() => InboxMessagesActions.SendInboxMessageSuccess()),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              InboxMessagesActions.SendInboxMessageFail({ payload: message })
            );
          })
        );
      })
    )
  );

  handleSendInboxMessageFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(InboxMessagesActions.SendInboxMessageFail.type),
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

  handleSendInboxMessageSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InboxMessagesActions.SendInboxMessageSuccess.type),
      map(() => {
        return this.toggleSnackbar(`inbox message has been sent`);
      }),
      map(() => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: [`/app/marketing/inbox-messages`],
          },
        });
      })
    )
  );

  getInboxAccounts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InboxMessagesActions.GetInboxAccounts.type),
      map((action) => action.payload),
      withLatestFrom(this.authFacade.selectedCorporate),
      switchMap(([payload, selectedCorporate]) => {
        const filters: IInboxMessages.IFilter = {
          ...payload,
        };
        const config: IInboxMessages.IFilter = {
          corporateUuid: selectedCorporate.uuid,
          limit: IInboxMessages.Config.UNLIMITED,
          page: 1,
        };

        return this.inboxMessageService.getAccounts(config, filters).pipe(
          map((acounts: IInboxMessages.IAccountData) => {
            return InboxMessagesActions.GetInboxAccountsSuccess({
              payload: acounts.docs,
            });
          }),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              InboxMessagesActions.GetInboxAccountsFail({
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
        ofType(InboxMessagesActions.GetInboxAccountsFail.type),
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

  handleRedirectToInboxMessages$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InboxMessagesActions.RedirectToInboxMessages.type),
      map(() => {
        return fromRoot.RouterActions.Go({
          payload: {
            path: ['/app/marketing/inbox-messages'],
          },
        });
      })
    )
  );

  loadVehicles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InboxMessagesActions.LoadVehicles.type),
      map(action => action.payload),
      withLatestFrom(
        this.authFacade.selectedCorporate
      ),
      switchMap(([params, corporate]) => {
        
        const { uuid } = corporate;
        return this.inboxMessageService.getVehicles(params, uuid).pipe(
          map((data: IVehicle.IData) =>
            InboxMessagesActions.LoadVehiclesSuccess({
              payload: data.docs,
            })
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(InboxMessagesActions.LoadVehiclesFail({ payload: message }));
          })
        );
      })
    )
  );

  handleLoadVehiclesFail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(InboxMessagesActions.LoadVehiclesFail.type),
        map((action) => {
          const  message  = action.payload;
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
