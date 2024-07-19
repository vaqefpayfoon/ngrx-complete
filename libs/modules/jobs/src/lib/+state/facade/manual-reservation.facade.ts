import { Injectable } from '@angular/core';

// NgRx Store
import { Store } from '@ngrx/store';

// Reducers
import { ICalendarState } from '@neural/modules/calendar';

// Selector
import { manualReservationQuery } from '../selectors';

// Action
import { CalendarsActions } from '@neural/modules/calendar';
import { ManualReservationsActions } from '../actions';

// Model
import { ICalendars } from '@neural/modules/calendar';
import { IManualReservations } from '../../models';

import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { default as _rollupMoment } from 'moment';
import { Observable } from 'rxjs';

@Injectable()
export class ManualReservationFacade {
  loading$ = this.store.select(
    manualReservationQuery.getManualReservationsLoading
  );

  loaded$ = this.store.select(
    manualReservationQuery.getManualReservationsLoaded
  );

  dmsVehiclesloaded$ = this.store.select(
    manualReservationQuery.dmsVehiclesLoaded
  );

  dmsCustomersloading$ = this.store.select(
    manualReservationQuery.dmsCustomersLoading
  );

  dmsVehiclesloading$ = this.store.select(
    manualReservationQuery.dmsVehiclesLoading
  );

  error$ = this.store.select(manualReservationQuery.getManualReservationsError);

  manualReservations$ = this.store.select(
    manualReservationQuery.getAllManualReservations
  );

  manualReservation$ = this.store.select(
    manualReservationQuery.getSelectedManualReservation
  );

  manualReservationsConfig$ = this.store.select(
    manualReservationQuery.getManualReservationsPage
  );

  manualReservationsFilter$ = this.store.select(
    manualReservationQuery.getManualReservationsFilter
  );

  selectedSlot$ = this.store.select(manualReservationQuery.getSelectedSlot);

  selectedDay$ = this.store.select(manualReservationQuery.getSelectedDay);

  total$ = this.store.select(manualReservationQuery.getManualReservationsTotal);

  operations$ = this.store.select(manualReservationQuery.getOperations);

  dmsCustomers$ = this.store.select(manualReservationQuery.getDmsCustomers);

  dmsVehicles$ = this.store.select(manualReservationQuery.getDmsVehicles);

  vehicleMakes$ = this.store.select(manualReservationQuery.getVehicleMakes);

  vehicleModels$ = this.store.select(manualReservationQuery.getVehicleModels);

  vehicleYearMakes$ = this.store.select(manualReservationQuery.getVehicleYearMakes);

  constructor(private store: Store<ICalendarState>) {}

  changeManualReservationsPage(payload: IManualReservations.IConfig) {
    this.store.dispatch(
      ManualReservationsActions.ChangeManualReservations({
        payload,
      })
    );
  }

  selectSlot(payload: {
    selectedDay: ICalendars.IDocument;
    selectedSlot: ICalendars.ISlot;
  }) {
    this.store.dispatch(
      ManualReservationsActions.SelectCalendarSlot({ payload })
    );
  }

  loadAlloperations() {
    this.store.dispatch(
      ManualReservationsActions.GetManualReservationOperations()
    );
  }

  create(payload: IManualReservations.ICreate) {
    this.store.dispatch(
      ManualReservationsActions.CreateManualReservation({ payload })
    );
  }

  update(payload: IManualReservations.IDocument) {
    this.store.dispatch(
      ManualReservationsActions.UpdateManualReservation({ payload })
    );
  }

  delete(payload: IManualReservations.IDocument) {
    this.store.dispatch(
      ManualReservationsActions.DeleteManualReservation({ payload })
    );
  }

  deleteMobileReservation(payload: IManualReservations.IDocument) {
    this.store.dispatch(
      ManualReservationsActions.DeleteManualMobileReservation({ payload })
    );
  }

  deleteManualReservation(payload: IManualReservations.IDocument) {
    this.store.dispatch(
      ManualReservationsActions.DeleteManualServiceReservation({ payload })
    );
  }

  completeManualReservation(payload: IManualReservations.IDocument) {
    this.store.dispatch(
      ManualReservationsActions.CompleteManualReservation({ payload })
    );
  }

  cancelManualReservation(payload: IManualReservations.IDocument) {
    this.store.dispatch(
      ManualReservationsActions.CancelManualReservation({ payload })
    );
  }

  resetManualReservation(payload: IManualReservations.IDocument) {
    this.store.dispatch(
      ManualReservationsActions.ResetManualReservation({ payload })
    );
  }

  resetDmsVehicles() {
    this.store.dispatch(ManualReservationsActions.ResetDMSVehicles());
  }

  loadAll() {
    this.store.dispatch(ManualReservationsActions.LoadManualReservations());
  }

  onRedirect() {
    this.store.dispatch(ManualReservationsActions.GoToReservationsList());
  }

  getVehicleMakes() {
    const payload: IManualReservations.IConfig = {
      page: 1,
      limit: 1000
    }
    this.store.dispatch(ManualReservationsActions.GetVehicleMakes({payload}));
  }

  getManualReservation(uuid: string) {
    this.store.dispatch(
      ManualReservationsActions.GetManualReservation({ payload: uuid })
    );
  }

  addNewManualReservation() {
    this.store.dispatch(ManualReservationsActions.AddNewManualReservation());
  }

  getDMSCustomers(payload: {
    dms: IManualReservations.IDMSFilter
  }) {
    this.store.dispatch(ManualReservationsActions.GetDMSCustomers({ payload }));
  }

  getDMSVehicles(payload: string) {
    this.store.dispatch(ManualReservationsActions.GetDMSVehicles({ payload }));
  }

  resetDmsVehiclesLoaded() {
    this.store.dispatch(ManualReservationsActions.ResetDMSVehiclesLoaded());
  }

  resetDmsCustomers() {
    this.store.dispatch(ManualReservationsActions.ResetDMSCustomers());
  }

  getVehicleModels(payload: string) {
    this.store.dispatch(ManualReservationsActions.GetVehicleModels({ payload }));
  }

  getVehicleYearMakes(makeId: string, modelId: string) {
    this.store.dispatch(ManualReservationsActions.GetVehicleYearMakes({ makeId, modelId }));
  }
}
