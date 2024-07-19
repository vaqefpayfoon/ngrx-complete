import { Injectable } from '@angular/core';

// Create Effects
import { createEffect, Actions, ofType } from '@ngrx/effects';

// Actions
import { CampaignTargetsActions } from '../actions';

// Services
import { CampaignTargetsService } from '../../services';

// Models
import { ICampaignTargets } from '../../models';

// RxJs
import { of } from 'rxjs';
import { map, switchMap, catchError, withLatestFrom } from 'rxjs/operators';

import { MatSnackBar } from '@angular/material/snack-bar';

// Facades
import { CampaignTargetsFacade } from '../facades';

// NgRx Router
import * as fromRoot from '@neural/ngrx-router';

import { AuthFacade } from '@neural/auth';

@Injectable()
export class CampaignTargetsEffects {
  constructor(
    private actions$: Actions<
      CampaignTargetsActions.CampaignTargetActionsUnion
    >,
    private campaignTargetsService: CampaignTargetsService,
    private campaignTargetsFacade: CampaignTargetsFacade,
    private authFacade: AuthFacade,
    private snackBar: MatSnackBar
  ) {}

  setCampaignTargetsPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CampaignTargetsActions.SetCampaignTargetsPage.type),
      map(() => CampaignTargetsActions.LoadCampaignTargets())
    )
  );

  loadCampaignTargets$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CampaignTargetsActions.LoadCampaignTargets.type),
      withLatestFrom(
        this.campaignTargetsFacade.campaignsConfig$,
        this.campaignTargetsFacade.campaignsFilter$,
        this.authFacade.selectedCorporate
      ),
      switchMap(([_, config, filters, selectedCorporate]) => {
        const { uuid } = selectedCorporate;
        const filterParams = [...filters, { corporateUuid: uuid }];
        return this.campaignTargetsService
          .getCampaignTargets(config, filterParams)
          .pipe(
            map((data: ICampaignTargets.IData) =>
              CampaignTargetsActions.LoadCampaignTargetsSuccess({
                campaignTargets: data.docs,
                pagination: {
                  limit: data.limit,
                  page: data.page,
                  pages: data.pages,
                  total: data.total
                }
              })
            ),
            catchError((res: any) => {
              const message =
                res.status !== 401 ? res.error.response.message : null;
              return of(
                CampaignTargetsActions.LoadCampaignTargetsFail({
                  payload: {
                    status: res.status,
                    message
                  }
                })
              );
            })
          );
      })
    )
  );

  toggleSnackbar(message: string) {
    return this.snackBar.open(message, '', {
      duration: 5000,
      verticalPosition: 'top',
      panelClass: ['snackbar--custom']
    });
  }
}
