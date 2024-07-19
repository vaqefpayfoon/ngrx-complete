import { Injectable } from '@angular/core';

// NgRx Store
import { Store } from '@ngrx/store';

// Reducers
import { IVehiclesState } from '../reducers';

// Selector
import { brandsFlatRateUnitQuery } from '../selectors';

// Action
import { BrandsFlatRateUnitActions } from '../actions';

// Models
import { IBrandsFlatRateUnit } from '../../models';

@Injectable()
export class BrandsFlatRateUnitFacade {
  loaded$ = this.store.select(
    brandsFlatRateUnitQuery.getBrandsFlatRateUnitLoaded
  );

  loading$ = this.store.select(
    brandsFlatRateUnitQuery.getBrandsFlatRateUnitLoading
  );

  error$ = this.store.select(
    brandsFlatRateUnitQuery.getBrandsFlatRateUnitError
  );

  total$ = this.store.select(
    brandsFlatRateUnitQuery.getBrandsFlatRateUnitTotal
  );

  pending$ = this.store.select(
    brandsFlatRateUnitQuery.getBrandsFlatRateUnitPending
  );

  brandsFlatRateUnit$ = this.store.select(
    brandsFlatRateUnitQuery.getAllBrandsFlatRateUnit
  );

  remainingBrands$ = this.store.select(
    brandsFlatRateUnitQuery.getRemainBrandsFlatRateUnit
  );

  constructor(private store: Store<IVehiclesState>) {}

  onUpdate(payload: IBrandsFlatRateUnit.ISetBrandsFru) {
    this.store.dispatch(
      BrandsFlatRateUnitActions.SetBrandsFlatRateUnit({ payload })
    );
  }
  
  onLoad() {
    this.store.dispatch(
      BrandsFlatRateUnitActions.GetBrandsFlatRateUnit()
    );
  }
}
