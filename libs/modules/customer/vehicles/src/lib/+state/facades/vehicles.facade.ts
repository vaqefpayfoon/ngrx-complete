import { Injectable } from '@angular/core';

// NgRx Store
import { Store } from '@ngrx/store';

// Reducers
import { IVehiclesState } from '../reducers';

// Selector
import { vehiclesQuery } from '../selectors';

// Action
import { VehiclesActions } from '../actions';

// Models
import { IVehicle } from '../../models';

// Router
import * as fromRoot from '@neural/ngrx-router';

@Injectable()
export class VehiclesFacade {
  loaded$ = this.store.select(vehiclesQuery.getVehiclesLoaded);
  entities$ = this.store.select(vehiclesQuery.getVehiclesEntities);
  type$ = this.store.select(vehiclesQuery.getVehiclesType);
  loading$ = this.store.select(vehiclesQuery.getVehiclesLoading);
  error$ = this.store.select(vehiclesQuery.getVehiclesError);
  vehicles$ = this.store.select(vehiclesQuery.getAllVehicles);
  searchedVehicle$ = this.store.select(vehiclesQuery.getSearchedVehicle);

  tyre$ = this.store.select(vehiclesQuery.getTyreList);

  rearTyre$ = this.store.select(vehiclesQuery.getRearTyreList);

  vehiclesConfig$ = this.store.select(vehiclesQuery.getVehiclesPage);

  vehicle$ = this.store.select(vehiclesQuery.getSelectedVehicle);

  total$ = this.store.select(vehiclesQuery.getVehiclesTotal);

  list$ = this.store.select(vehiclesQuery.getVehicleList);

  router$ = this.store.select(fromRoot.getRouterState);

  constructor(private store: Store<IVehiclesState>) {}

  setVehiclesPage(config: IVehicle.IConfig) {
    this.store.dispatch(
      VehiclesActions.ChangeVehiclesPage({ payload: config })
    );
  }

  toggleStatus(vehicle: IVehicle.IDocument) {
    if (vehicle.active) {
      this.store.dispatch(
        VehiclesActions.DeactivateVehicle({ payload: vehicle })
      );
    } else {
      this.store.dispatch(
        VehiclesActions.ActivateVehicle({ payload: vehicle })
      );
    }
  }

  resetToggle(vehicle: IVehicle.IDocument) {
    this.store.dispatch(
      VehiclesActions.ResetVehicleStatus({
        payload: {
          id: vehicle.uuid,
          changes: {
            active: vehicle.active,
          },
        },
      })
    );
  }

  resetSearchedVehicleToggle(searchedVehicle: IVehicle.IDocument) {
    this.store.dispatch(
      VehiclesActions.ResetSearchedVehicleStatus({
        payload: {
          id: searchedVehicle.uuid,
          changes: {
            active: searchedVehicle.active,
          },
        },
      })
    );
  }

  changeVehiclesPage(config: IVehicle.IConfig) {
    this.store.dispatch(
      VehiclesActions.ChangeVehiclesPage({ payload: config })
    );
  }

  resetAccountPage() {
    const params: IVehicle.IConfig = {
      page: 1,
      limit: IVehicle.Config.LIMIT,
    };
    this.store.dispatch(VehiclesActions.SetVehiclesPage({ payload: params }));
  }

  resetFilterVehicles() {
    this.store.dispatch(VehiclesActions.ResetFilterVehicles());
  }

  resetSortVehicles() {
    this.store.dispatch(VehiclesActions.ResetSortVehicles());
  }

  resetListVehicles(list: string) {
    this.store.dispatch(VehiclesActions.ResetList({ payload: list }));
  }

  onSearch(numberPlate: IVehicle.IFilter) {
    if (numberPlate) {
      this.store.dispatch(
        VehiclesActions.FilterVehicles({ payload: numberPlate })
      );
    }
  }

  onTyreWidths() {
    this.store.dispatch(VehiclesActions.TyreWidths());
  }

  onRearTyreWidths() {
    this.store.dispatch(VehiclesActions.RearTyreWidths());
  }

  onTyreAspectratios(width: string) {
    this.store.dispatch(
      VehiclesActions.TyreAspectRatios({ payload: { width } })
    );
  }

  onRearTyreAspectratios(width: string) {
    this.store.dispatch(
      VehiclesActions.RearTyreAspectRatios({ payload: { width } })
    );
  }

  onTyreRims(width: string, aspectRatio: string) {
    this.store.dispatch(
      VehiclesActions.TyreRims({ payload: { width, aspectRatio } })
    );
  }

  onRearTyreRims(width: string, aspectRatio: string) {
    this.store.dispatch(
      VehiclesActions.RearTyreRims({ payload: { width, aspectRatio } })
    );
  }

  resetTyreRims() {
    this.store.dispatch(VehiclesActions.ResetTyre({ payload: 'aspectRatios' }));
  }

  resetTyreAspectratios() {
    this.store.dispatch(VehiclesActions.ResetTyre({ payload: 'rims' }));
  }

  resetVehicleList(list: string) {
    this.store.dispatch(VehiclesActions.ResetList({ payload: list }));
  }

  onSort(sort: IVehicle.ISort) {
    if (sort) {
      this.store.dispatch(VehiclesActions.SortVehicles({ payload: sort }));
    }
  }

  onLoadModel(brand: string) {
    this.store.dispatch(
      VehiclesActions.LoadVehicleModels({ payload: { brand } })
    );
  }

  onLoadVariant(brand: string, model: string) {
    this.store.dispatch(
      VehiclesActions.LoadVehicleVariants({
        payload: { brand, model },
      })
    );
  }

  onUpdate(document: IVehicle.IDocument, update: IVehicle.IUpdate) {
    this.store.dispatch(
      VehiclesActions.UpdateVehicle({ payload: { document, update } })
    );
  }

  onResetSelectedVehicle() {
    this.store.dispatch(VehiclesActions.ResetSelectedVehicle());
  }

  onResetSearchedVehicle() {
    this.store.dispatch(VehiclesActions.ResetSearchedVehicle());
  }

  onUpdateSearchedVehicle(
    document: IVehicle.IDocument,
    update: IVehicle.IUpdate
  ) {
    this.store.dispatch(
      VehiclesActions.UpdateSearchedVehicle({ payload: { document, update } })
    );
  }

  loadVehiclesInspections(uuid: string) {
    this.store.dispatch(
      VehiclesActions.LoadVehiclesInspections({ payload: uuid })
    );
  }

  corporateChange() {
    this.store.dispatch(VehiclesActions.GoToVehiclesList());
  }

  resetVehicleItem() {
    this.store.dispatch(VehiclesActions.ResetVehicleItem());
  }

  onSearchByVehicleNumberPlate(numberPlate: string) {
    if (numberPlate) {
      this.store.dispatch(
        VehiclesActions.SearchVehicleByNumberPlate({ payload: numberPlate })
      );
    }
  }

  loadVehiclesBrand() {
    this.store.dispatch(VehiclesActions.LoadVehicleBrands());
  }

  getVehicle(uuid: string) {
    this.store.dispatch(VehiclesActions.GetVehicle({ payload: uuid }));
  }
}
