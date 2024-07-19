import { Injectable } from '@angular/core';

// NgRx Store
import { Store } from '@ngrx/store';

// Reducers
import { IBusinessesState } from '../reducers';

// Selector
import { BusinessQuery } from '../selectors';

// Action
import { BusinessesActions } from '../actions';

// Model
import { IBusinesses } from '../../models';

@Injectable()
export class BusinessesFacade {
  loading$ = this.store.select(BusinessQuery.getBusinessesLoading);

  loaded$ = this.store.select(BusinessQuery.getBusinessesLoaded);

  loadingAccounts$ = this.store.select(BusinessQuery.getAccountsLoading);

  error$ = this.store.select(BusinessQuery.getBusinessesError);

  businesses$ = this.store.select(BusinessQuery.getAllBusinesses);

  accounts$ = this.store.select(BusinessQuery.getAllAccounts);

  business$ = this.store.select(BusinessQuery.getSelectedBusiness);

  businessesConfig$ = this.store.select(BusinessQuery.getBusinessesPage);

  accountsConfig$ = this.store.select(BusinessQuery.getAccountsPage);

  total$ = this.store.select(BusinessQuery.getBusinessesTotal);

  search$ = this.store.select(BusinessQuery.getAccountsSearchParams);

  constructor(private store: Store<IBusinessesState>) {}

  toggleStatus(business: IBusinesses.IDocument) {
    if (business.active) {
      this.store.dispatch(
        BusinessesActions.DeactivateBusiness({ payload: business })
      );
    } else {
      this.store.dispatch(
        BusinessesActions.ActivateBusiness({ payload: business })
      );
    }
  }

  resetToggle(business: IBusinesses.IDocument) {
    this.store.dispatch(
      BusinessesActions.ResetBusinessStatus({
        payload: {
          id: business.uuid,
          changes: {
            active: business.active,
          },
        },
      })
    );
  }

  changeBusinessesPage(config: IBusinesses.IConfig) {
    this.store.dispatch(
      BusinessesActions.SetBusinessesPage({ payload: config })
    );
  }

  resetBusinessesPage() {
    const params: IBusinesses.IConfig = {
      page: 1,
      limit: IBusinesses.Config.LIMIT,
    };
    this.store.dispatch(
      BusinessesActions.SetBusinessesPage({ payload: params })
    );
  }

  onLoad() {
    this.store.dispatch(BusinessesActions.LoadBusinesses());
  }

  create(event: IBusinesses.ICreate) {
    this.store.dispatch(BusinessesActions.CreateBusiness({ payload: event }));
  }

  update(event: IBusinesses.IDocument) {
    this.store.dispatch(BusinessesActions.UpdateBusiness({ payload: event }));
  }

  search(event: IBusinesses.ISearch[]) {
    this.store.dispatch(BusinessesActions.SearchAccount({ payload: event }));
  }

  changePage(pagination: IBusinesses.IConfig) {
    this.store.dispatch(
      BusinessesActions.ChangeAccountsPage({ payload: pagination })
    );
  }

  reset() {
    this.store.dispatch(BusinessesActions.ResetSearch());
  }

  onResetSelectedBusiness() {
    this.store.dispatch(BusinessesActions.ResetSelectedBusiness());
  }

  associate(event: IBusinesses.IAssociate) {
    this.store.dispatch(
      BusinessesActions.AssosiateBusinessAccounts({ payload: event })
    );
  }

  getBusiness(uuid: string) {
    this.store.dispatch(BusinessesActions.GetBusiness({ payload: uuid }));
  }
}
