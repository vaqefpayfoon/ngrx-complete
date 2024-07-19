import { Injectable } from '@angular/core';

// NgRx Store
import { Store } from '@ngrx/store';

// Reducers
import { IReservationsState } from '../reducer';

// Selector
import { BranchTeamsQuery } from '../selectors';

// Action
import { BranchTeamActions } from '../actions';

// Models
import { IBranchTeams } from '../../models';

@Injectable()
export class BranchTeamFacade {
  branchTeams$ = this.store.select(BranchTeamsQuery.getBranchTeams);

  loading$ = this.store.select(BranchTeamsQuery.getBranchTeamsLoading);

  loaded$ = this.store.select(BranchTeamsQuery.getBranchTeamsLoaded);

  error$ = this.store.select(BranchTeamsQuery.getBranchTeamsError);

  constructor(private store: Store<IReservationsState>) {}

  onLoad() {
    this.store.dispatch(BranchTeamActions.LoadBranchTeam());
  }

  onReset() {
    this.store.dispatch(BranchTeamActions.ResetBranchTeam());
  }
}
