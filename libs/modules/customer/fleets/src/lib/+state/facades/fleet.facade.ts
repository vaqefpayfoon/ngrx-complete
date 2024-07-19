import { Injectable } from '@angular/core';

// NgRx Store
import { select, Store } from '@ngrx/store';

// Reducers
import { IFleetState } from '../reducers';

// Selector
import { fleetsQuery } from '../selectors';

// Action
import { FleetsActions } from '../actions';

// Models
import { IFleet } from '../../models';

@Injectable()
export class FleetFacade {
  fleets$ = this.store.select(fleetsQuery.getAllFleets);

  total$ = this.store.select(fleetsQuery.getFleetsTotal);

  fleet$ = this.store.select(fleetsQuery.getSelectedFleet);

  loading$ = this.store.select(fleetsQuery.getFleetsLoading);

  loaded$ = this.store.select(fleetsQuery.getFleetsLoaded);

  error$ = this.store.select(fleetsQuery.getFleetsError);

  fleetsConfig$ = this.store.select(fleetsQuery.getFleetsPage);

  constructor(private store: Store<IFleetState>) {}

  setFleetPage(branchUuid: string, config: IFleet.IConfig) {
    this.store.dispatch(
      FleetsActions.SetFleetsPage({
        payload: {
          config,
          branchUuid,
        },
      })
    );
  }

  toggleStatus(fleet: IFleet.IDocument) {
    if (fleet.active) {
      this.store.dispatch(FleetsActions.DeactivateFleet({ payload: fleet }));
    } else {
      this.store.dispatch(FleetsActions.ActivateFleet({ payload: fleet }));
    }
  }

  resetToggle(fleet: IFleet.IDocument) {
    this.store.dispatch(
      FleetsActions.ResetFleetStatus({
        payload: {
          id: fleet.uuid,
          changes: {
            active: fleet.active,
          },
        },
      })
    );
  }

  onLoad() {
    this.store.dispatch(FleetsActions.LoadFleets());
  }

  onResetSelectedFleet() {
    this.store.dispatch(FleetsActions.ResetSelectedFleet());
  }

  create(event: IFleet.ICreate) {
    this.store.dispatch(FleetsActions.CreateFleet({ payload: event }));
  }

  update(event: IFleet.IDocument) {
    this.store.dispatch(FleetsActions.UpdateFleet({ payload: event }));
  }

  branchChange() {
    this.store.dispatch(FleetsActions.GoToFleetsList());
  }

  getFleet(uuid: string) {
    this.store.dispatch(FleetsActions.GetFleet({ payload: uuid }));
  }
}
