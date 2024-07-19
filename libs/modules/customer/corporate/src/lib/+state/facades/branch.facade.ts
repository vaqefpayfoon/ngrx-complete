import { Injectable } from '@angular/core';

// NgRx Store
import { Store } from '@ngrx/store';

// Reducers
import { ICorporateState } from '../reducers';

// Selector
import { branchesQuery, OffDaysQuery } from '../selectors';

// Action
import { BranchesActions, OffDaysActions } from '../actions';

// Models
import { IBranches } from '../../models';

@Injectable()
export class BranchFacade {
  branches$ = this.store.select(branchesQuery.getAllBranches);

  schedulesOffDays$ = this.store.select(OffDaysQuery.getAllOffDays);

  offDaysConfig$ = this.store.select(OffDaysQuery.getOffDaysConfig);

  countryNames$ = this.store.select(branchesQuery.getAllCountryNames);

  selectedCountry$ = this.store.select(branchesQuery.getCountrySelected);

  selectedBranch$ = this.store.select(branchesQuery.getSelectedBranch);

  total$ = this.store.select(OffDaysQuery.getOffDaysTotal);

  loaded$ = this.store.select(branchesQuery.getBranchesLoaded);

  loading$ = this.store.select(branchesQuery.getBranchesLoading);

  error$ = this.store.select(branchesQuery.getBranchesError);

  getOffDaysPage$ = this.store.select(OffDaysQuery.getOffDaysPage);

  constructor(private store: Store<ICorporateState>) {}

  onLoad(corporateUuid: string) {
    this.store.dispatch(
      BranchesActions.LoadBranches({ payload: corporateUuid })
    );
  }

  onSchedulesOffDays(payload: string) {
    this.store.dispatch(OffDaysActions.loadOffDaysList({payload}));
  }

  onCreate(branch: IBranches.ICreate) {
    this.store.dispatch(BranchesActions.CreateBranch({ payload: branch }));
  }

  onUpdate(branch: IBranches.IDocument) {
    this.store.dispatch(BranchesActions.UpdateBranch({ payload: branch }));
  }

  onLoadStates(country: string) {
    this.store.dispatch(BranchesActions.GetCountry({ payload: country }));
  }

  onReset() {
    this.store.dispatch(BranchesActions.ResetBranch());
  }

  onCreateSchedule(branch: IBranches.ISchedulesPayload) {
    this.store.dispatch(BranchesActions.CreateSchedular({ payload: branch }));
  }

  onUpdateSchedule(branch: IBranches.ISchedulesPayload) {
    this.store.dispatch(BranchesActions.UpdateSchedular({ payload: branch }));
  }

  onCreateScheduleOffDays(branch: IBranches.IOffDaysPayload) {
    this.store.dispatch(
      BranchesActions.CreateSchedulesOffDays({ payload: branch })
    );
  }

  onUpdateScheduleOffDays(branch: IBranches.IOffDaysPayload) {
    this.store.dispatch(
      BranchesActions.UpdateSchedulesOffDays({ payload: branch })
    );
  }

  onDeleteSchedule(branch: IBranches.ISchedulesPayload) {
    this.store.dispatch(BranchesActions.DeleteSchedular({ payload: branch }));
  }

  onDeleteScheduleOffDays(branch: IBranches.IOffDaysPayload) {
    this.store.dispatch(BranchesActions.DeleteSchedularOffDays({ payload: branch }));
  }

  onGetBranch(uuid: string): void {
    this.store.dispatch(BranchesActions.GetBranch({ payload: uuid }));
  }

  onCreateScheduleTeam(branch: IBranches.ITeamPayload) {
    this.store.dispatch(
      BranchesActions.CreateSchedularTeam({ payload: branch })
    );
  }

  onUpdateScheduleTeam(branch: IBranches.ITeamPayload) {
    this.store.dispatch(
      BranchesActions.UpdateSchedularTeam({ payload: branch })
    );
  }

  onDeleteScheduleTeam(branch: IBranches.ITeamPayload) {
    this.store.dispatch(
      BranchesActions.DeleteSchedularTeam({ payload: branch })
    );
  }

  onRedirectToTeams() {
    this.store.dispatch(BranchesActions.RedirectToTeams());
  }

  onRedirectToOffDays() {
    this.store.dispatch(BranchesActions.RedirectToOffDays());
  }

  resetOffDaysPage(uuid: string) {
    const params: IBranches.IConfig = {
      page: 1,
      limit: 10,
    };
    this.store.dispatch(
      OffDaysActions.SetOffDaysListPage({ payload: params, uuid })
    );
  }
  
  changeOffDaysPage(config: IBranches.IConfig, uuid: string) {
    this.store.dispatch(
      OffDaysActions.ChangeOffDaysListPage({ payload: config, uuid })
    );
  }
}
