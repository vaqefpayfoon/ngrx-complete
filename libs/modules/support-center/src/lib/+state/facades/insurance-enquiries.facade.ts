import { Injectable } from '@angular/core';

// NgRx Store
import { Store } from '@ngrx/store';

// Reducers
import { ISupportCenter } from '../reducers';

// Selector
import { insuranceEnquiriesQuery } from '../selectors';

// Action
import { InsuranceEnquiriesActions } from '../actions';

// Model
import {
  IGlobalConfig,
  IGlobalFilter,
  GlobalPaginationConfig,
} from '@neural/shared/data';

import { IInsuranceEnquiries } from '../../models';

@Injectable()
export class InsuranceEnquiriesFacade {
  loading$ = this.store.select(
    insuranceEnquiriesQuery.getInsuranceEnquiriesLoading
  );

  loaded$ = this.store.select(
    insuranceEnquiriesQuery.getInsuranceEnquiriesLoaded
  );

  error$ = this.store.select(
    insuranceEnquiriesQuery.getInsuranceEnquiriesError
  );

  insuranceEnquiries$ = this.store.select(
    insuranceEnquiriesQuery.getAllInsuranceEnquiries
  );

  insuranceEnquiry$ = this.store.select(
    insuranceEnquiriesQuery.getSelectedInsuranceEnquiry
  );

  enquiriesConfig$ = this.store.select(
    insuranceEnquiriesQuery.getInsuranceEnquiriesPage
  );

  getInsuranceEnquiriesFilters$ = this.store.select(
    insuranceEnquiriesQuery.getInsuranceEnquiriesFilters
  );

  sorts$ = this.store.select(
    insuranceEnquiriesQuery.getInsuranceEnquiriesSorts
  );

  total$ = this.store.select(
    insuranceEnquiriesQuery.getInsuranceEnquiriesTotal
  );

  constructor(private store: Store<ISupportCenter>) {}

  changeInsuranceEnquiriesPage(config: IGlobalConfig) {
    this.store.dispatch(
      InsuranceEnquiriesActions.ChangeInsuranceEnquiriesPage({
        payload: config,
      })
    );
  }

  changeInsuranceEnquiriesFilter(filter: IGlobalFilter) {
    this.store.dispatch(
      InsuranceEnquiriesActions.SetInsuranceEnquiriesFilters({
        payload: filter,
      })
    );
  }

  resetInsuranceEnquiriesPage() {
    const params: IGlobalConfig = {
      page: 1,
      limit: GlobalPaginationConfig.LIMIT,
    };
    this.store.dispatch(
      InsuranceEnquiriesActions.SetInsuranceEnquiriesPage({ payload: params })
    );
  }

  onResetSelectedEnquiry() {
    this.store.dispatch(
      InsuranceEnquiriesActions.ResetSelectedInsuranceEnquiry()
    );
  }

  onUpdate(payload: IInsuranceEnquiries.IDocument) {
    this.store.dispatch(
      InsuranceEnquiriesActions.UpdateInsuranceEnquiry({ payload })
    );
  }

  getEnquiry(uuid: string) {
    this.store.dispatch(
      InsuranceEnquiriesActions.GetInsuranceEnquiry({ payload: uuid })
    );
  }
}
