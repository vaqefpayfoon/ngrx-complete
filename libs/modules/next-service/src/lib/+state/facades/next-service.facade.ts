import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { NextServiceQuery } from '../selectors';
import { INextService } from '../../models';
import { NextServiceAction } from '../actions';
import { INextServiceState } from '../reducers/next-service.reducer';

@Injectable({
  providedIn: 'root'
})
export class NextServiceFacade {
  NextServices$ = this.store.select(
    NextServiceQuery.getNextServiceEntities
  );
  allNextServices$ = this.store.select(
    NextServiceQuery.getAllNextService
  );
  NextService$ = this.store.select(NextServiceQuery.getSelectedNextService);
  
  getNextServiceConfig$ = this.store.select(
    NextServiceQuery.getNextServiceConfig
  );
  getNextServiceFilters$ = this.store.select(
    NextServiceQuery.getNextServiceFilters
  );

  getNextServiceSorts$ = this.store.select(
    NextServiceQuery.getNextServiceSorts
  );
  total$ = this.store.select(NextServiceQuery.getNextServiceTotals);
  loading$ = this.store.select(NextServiceQuery.getNextServiceLoading);

  loaded$ = this.store.select(NextServiceQuery.getNextServiceLoaded);

  error$ = this.store.select(NextServiceQuery.getNextServiceError);


  constructor(private store: Store<INextServiceState>) {}

  getNextService() {
    this.store.dispatch(NextServiceAction.loadNextServices());
  }
  resetNextServicePage() {
    const params: INextService.IConfig = {
      page: 1,
      limit: INextService.Config.LIMIT,
    };
    this.store.dispatch(
        NextServiceAction.SetNextServicesPage({ payload: params })
    );
  }
  changeNextServicePage(config: INextService.IConfig) {
    this.store.dispatch(
        NextServiceAction.ChangeNextServicesPage({ payload: config })
    );
  }
  changeNextServiceFilter(filter: INextService.IFilter) {
    this.store.dispatch(
        NextServiceAction.SetNextServicesFilters({ payload: filter })
    );
  }
}
