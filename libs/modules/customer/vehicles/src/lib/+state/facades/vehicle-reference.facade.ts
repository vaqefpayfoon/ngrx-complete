import { Injectable } from '@angular/core';

// NgRx Store
import { Store } from '@ngrx/store';

// Reducers
import { IVehiclesState } from '../reducers';

// Selector
import { vehicleReferencesQuery } from '../selectors';

// Action
import { VehicleReferenceActions } from '../actions';

// Models
import { IVehicleReference } from '../../models';

@Injectable()
export class VehicleReferenceFacade {
  loaded$ = this.store.select(
    vehicleReferencesQuery.getVehicleReferencesLoaded
  );

  loading$ = this.store.select(
    vehicleReferencesQuery.getVehicleReferencesLoading
  );

  error$ = this.store.select(vehicleReferencesQuery.getVehicleReferencesError);

  entities$ = this.store.select(
    vehicleReferencesQuery.getVehicleReferencesEntities
  );

  references$ = this.store.select(
    vehicleReferencesQuery.getAllVehicleReferences
  );

  reference$ = this.store.select(
    vehicleReferencesQuery.getSelectedVehicleReference
  );

  vehicleReferencesConfig$ = this.store.select(
    vehicleReferencesQuery.getVehicleReferencesPage
  );

  vehicleReference$ = this.store.select(
    vehicleReferencesQuery.getSelectedVehicleReference
  );

  list$ = this.store.select(vehicleReferencesQuery.getVehicleReferenceList);

  total$ = this.store.select(vehicleReferencesQuery.getVehicleReferencesTotal);

  constructor(private store: Store<IVehiclesState>) {}

  setVehicleReferencesPage(config: IVehicleReference.IConfig) {
    this.store.dispatch(
      VehicleReferenceActions.SetVehicleReferencePage({ payload: config })
    );
  }

  toggleStatus(vehicleReference: IVehicleReference.IDocument) {
    if (vehicleReference.active) {
      this.store.dispatch(
        VehicleReferenceActions.DeactivateVehicleReference({
          payload: vehicleReference,
        })
      );
    } else {
      this.store.dispatch(
        VehicleReferenceActions.ActivateVehicleReference({
          payload: vehicleReference,
        })
      );
    }
  }

  resetToggle(vehicleReference: IVehicleReference.IDocument) {
    this.store.dispatch(
      VehicleReferenceActions.ResetVehicleReferenceStatus({
        payload: {
          id: vehicleReference.uuid,
          changes: {
            active: vehicleReference.active,
          },
        },
      })
    );
  }

  changeVehicleReferencesPage(config: IVehicleReference.IConfig) {
    this.store.dispatch(
      VehicleReferenceActions.ChangeVehicleReferencePage({ payload: config })
    );
  }

  resetVehicleReferencesPage() {
    const params: IVehicleReference.IConfig = {
      page: 1,
      limit: IVehicleReference.Config.LIMIT,
    };
    this.store.dispatch(
      VehicleReferenceActions.SetVehicleReferencePage({ payload: params })
    );
  }

  resetFilterVehicleReferences() {
    this.store.dispatch(VehicleReferenceActions.ResetFilterVehicleReference());
  }

  resetSortVehicleReferences() {
    this.store.dispatch(VehicleReferenceActions.ResetSortVehicleReference());
  }

  resetVehicleReferenceList(list: string) {
    this.store.dispatch(VehicleReferenceActions.ResetList({ payload: list }));
  }

  onResetSelectedVehicleReference() {
    this.store.dispatch(
      VehicleReferenceActions.ResetSelectedVehicleReference()
    );
  }

  onLoadBrand(type: string) {
    this.store.dispatch(
      VehicleReferenceActions.LoadVehicleReferenceBrands({
        payload: { type },
      })
    );
  }

  onLoadModel(type: string, brand: string) {
    this.store.dispatch(
      VehicleReferenceActions.LoadVehicleReferenceModels({
        payload: { type, brand },
      })
    );
  }

  onLoadVariant(type: string, brand: string, model: string) {
    this.store.dispatch(
      VehicleReferenceActions.LoadVehicleReferenceVariants({
        payload: { type, brand, model },
      })
    );
  }

  onSort(sort: IVehicleReference.ISort) {
    if (sort) {
      this.store.dispatch(
        VehicleReferenceActions.SortVehicleReference({ payload: sort })
      );
    }
  }

  onCreate(vehicleReference: IVehicleReference.ICreate) {
    this.store.dispatch(
      VehicleReferenceActions.CreateVehicleReference({
        payload: vehicleReference,
      })
    );
  }

  onUpdate(vehicleReference: IVehicleReference.IDocument) {
    this.store.dispatch(
      VehicleReferenceActions.UpdateVehicleReference({
        payload: vehicleReference,
      })
    );
  }

  onRedirect() {
    this.store.dispatch(VehicleReferenceActions.RedirectToVehicleReferences());
  }

  getVehicleReference(uuid: string) {
    this.store.dispatch(
      VehicleReferenceActions.GetVehicleReference({ payload: uuid })
    );
  }
}
