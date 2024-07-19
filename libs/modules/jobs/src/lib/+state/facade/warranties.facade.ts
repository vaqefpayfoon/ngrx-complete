import { Injectable } from '@angular/core';

// NgRx Store
import { Store } from '@ngrx/store';

// Reducers
import { IReservationsState } from '../reducer';

// Selector
import { warrantyQuery } from '../selectors';

// Action
import { WarrantiesActions } from '../actions';

// Models
import { IWarranties } from '../../models';

@Injectable()
export class WarrantiesFacade {
  vehicle$ = this.store.select(warrantyQuery.getWarrantiesVehicle);

  warranties$ = this.store.select(warrantyQuery.getAllWarranties);

  total$ = this.store.select(warrantyQuery.getWarrantiesTotal);

  warrantiesConfig$ = this.store.select(warrantyQuery.getWarrantiesPage);

  warranty$ = this.store.select(warrantyQuery.getSelectedWarranty);

  loading$ = this.store.select(warrantyQuery.getWarrantiesLoading);

  loaded$ = this.store.select(warrantyQuery.getWarrantiesLoaded);

  error$ = this.store.select(warrantyQuery.getWarrantiesError);

  reports$ = this.store.select(warrantyQuery.getAllWarrantiesReports);

  constructor(private store: Store<IReservationsState>) {}

  setWarrantiesPage(config: IWarranties.IConfig) {
    this.store.dispatch(
      WarrantiesActions.SetWarrantiesPage({ payload: config })
    );

    this.store.dispatch(WarrantiesActions.GetWarrantyReminderReport());
  }

  getVin(vin: IWarranties.IVin) {
    this.store.dispatch(WarrantiesActions.LoadAccountsByVin({ payload: vin }));
  }

  reset() {
    this.store.dispatch(WarrantiesActions.ResetAccountsByVinSuccess());
  }

  create({
    warranty,
    entity,
  }: {
    warranty: IWarranties.ICreate;
    entity: IWarranties.IDocumentVin;
  }) {
    this.store.dispatch(
      WarrantiesActions.CreateWarranty({ payload: { warranty, entity } })
    );
  }

  close({
    form,
    warranty,
  }: {
    form: IWarranties.IClose;
    warranty: IWarranties.IDocument;
  }) {
    this.store.dispatch(
      WarrantiesActions.CloseWarranty({ payload: { form, warranty } })
    );
  }

  branchChange() {
    this.store.dispatch(WarrantiesActions.GoToWarrantiesList());
  }

  onResetSelectedWarranty() {
    this.store.dispatch(WarrantiesActions.ResetSelectedWarranty());
  }

  getWarranty(uuid: string) {
    this.store.dispatch(WarrantiesActions.GetWarranty({ payload: uuid }));
  }
}
