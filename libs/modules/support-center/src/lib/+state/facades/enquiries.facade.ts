import { Injectable } from '@angular/core';

// NgRx Store
import { Store } from '@ngrx/store';

// Reducers
import { ISupportCenter } from '../reducers';

// Selector
import { enquiriesQuery } from '../selectors';

// Action
import { EnquiriesActions } from '../actions';

// Model
import { IEnquiries } from '../../models';

@Injectable()
export class EnquiriesFacade {
  loading$ = this.store.select(enquiriesQuery.getEnquiriesLoading);

  loaded$ = this.store.select(enquiriesQuery.getEnquiriesLoaded);

  error$ = this.store.select(enquiriesQuery.getEnquiriesError);

  enquiries$ = this.store.select(enquiriesQuery.getAllEnquiries);

  enquiry$ = this.store.select(enquiriesQuery.getSelectedEnquiry);

  enquiriesConfig$ = this.store.select(enquiriesQuery.getEnquiriesPage);

  getEnquiriesFilters$ = this.store.select(enquiriesQuery.getEnquiriesFilters);

  sorts$ = this.store.select(enquiriesQuery.getEnquiriesSorts);

  total$ = this.store.select(enquiriesQuery.getEnquiriesTotal);

  constructor(private store: Store<ISupportCenter>) {}

  changeEnquiriesPage(config: IEnquiries.IConfig) {
    this.store.dispatch(
      EnquiriesActions.ChangeEnquiriesPage({ payload: config })
    );
  }

  changeEnquiriesFilter(filter: IEnquiries.IFilter) {
    this.store.dispatch(
      EnquiriesActions.SetEnquiriesFilters({ payload: filter })
    );
  }

  resetEnquiriesPage() {
    const params: IEnquiries.IConfig = {
      page: 1,
      limit: IEnquiries.Config.LIMIT,
    };
    this.store.dispatch(EnquiriesActions.SetEnquiriesPage({ payload: params }));
  }

  onResetSelectedEnquiry() {
    this.store.dispatch(EnquiriesActions.ResetSelectedEnquiry());
  }

  onUpdate(payload: IEnquiries.IDocument) {
    this.store.dispatch(EnquiriesActions.UpdateEnquiry({ payload }));
  }

  getEnquiry(uuid: string) {
    this.store.dispatch(EnquiriesActions.GetEnquiry({ payload: uuid }));
  }
}
