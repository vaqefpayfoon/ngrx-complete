import { Injectable } from '@angular/core';

// Create Effects
import { createEffect, Actions, ofType } from '@ngrx/effects';

// Actions
import { BranchTeamActions } from '../actions';

// Services
import { BranchTeamService } from '../../services';

// Models
import { IBranchTeams } from '../../models';

// RxJs
import { of } from 'rxjs';
import { map, switchMap, catchError, withLatestFrom } from 'rxjs/operators';

// Facades
// import { ReservationsFacade } from '../facade';
import { AuthFacade } from '@neural/auth';

import { MatSnackBar } from '@angular/material/snack-bar';

// NgRx Router
import * as fromRoot from '@neural/ngrx-router';

@Injectable()
export class BranchTeamEffects {
  constructor(
    private actions$: Actions<BranchTeamActions.BranchTeamActionsUnion>,
    private branchTeamService: BranchTeamService,
    private authFacade: AuthFacade,
    private snackBar: MatSnackBar
  ) {}

  loadBranchTeam$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BranchTeamActions.LoadBranchTeam.type),
      withLatestFrom(this.authFacade.selectedBranch),
      switchMap(([_, params]) => {
        const { uuid } = params;
        return this.branchTeamService.getBranchTeam(uuid).pipe(
          map((branchTeams: IBranchTeams.IDocument) =>
            BranchTeamActions.LoadBranchTeamSuccess({ payload: branchTeams })
          ),
          catchError((res: any) => {
            const message =
              res.status !== 401 ? res.error.response.message : null;
            return of(
              BranchTeamActions.LoadBranchTeamFail({ payload: message })
            );
          })
        );
      })
    )
  );

  handleLoadBranchTeamFail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BranchTeamActions.LoadBranchTeamFail.type),
      map(action => {
        const message = action.payload;
        this.toggleSnackbar(message);
        return action.payload;
      })
    ), {
      dispatch: false
    }
  );

  toggleSnackbar(message: string) {
    return this.snackBar.open(message, '', {
      duration: 6000,
      verticalPosition: 'top',
      panelClass: ['snackbar--custom']
    });
  }
}
