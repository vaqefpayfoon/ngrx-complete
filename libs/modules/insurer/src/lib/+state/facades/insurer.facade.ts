import { Injectable } from '@angular/core';

// NgRx Store
import { Store } from '@ngrx/store';

// Reducers
import { IInsurerModel } from '../reducers';

// Selector
import { InsurersQuery } from '../selectors';

// Action
import { InsurerActions } from '../actions';

// Model
import { IInsurer } from '../../models';
import {
  IGlobalConfig,
  IGlobalFilter,
  IRequest,
  IBody,
  GlobalPaginationConfig,
} from '@neural/shared/data';

@Injectable()
export class InsurerFacade {
  loading$ = this.store.select(InsurersQuery.getInsurersLoading);

  loaded$ = this.store.select(InsurersQuery.getInsurersLoaded);

  error$ = this.store.select(InsurersQuery.getInsurersError);

  entities$ = this.store.select(InsurersQuery.getInsurersEntities);

  insurers$ = this.store.select(InsurersQuery.getAllInsurers);

  insurer$ = this.store.select(InsurersQuery.getSelectedInsurer);

  configs$ = this.store.select(InsurersQuery.getInsurersPage);

  filters$ = this.store.select(InsurersQuery.getInsurersFilters);

  sorts$ = this.store.select(InsurersQuery.getInsurersSorts);

  total$ = this.store.select(InsurersQuery.getInsurersTotal);

  corporateUuid$ = this.store.select(InsurersQuery.getCorporateUuid);

  constructor(private store: Store<IInsurerModel>) {}

  create({ payload }: IRequest<IInsurer.ICreate>): void {
    this.store.dispatch(InsurerActions.CreateInsurer({ payload }));
  }

  update(payload: IBody<IInsurer.IDocument, IInsurer.IUpdate>): void {
    this.store.dispatch(InsurerActions.UpdateInsurer(payload));
  }

  delete({ payload }: IRequest<IInsurer.IDocument>): void {
    this.store.dispatch(InsurerActions.DeleteInsurer({ payload }));
  }

  active(payload: IRequest<IInsurer.IDocument>): void {
    this.store.dispatch(InsurerActions.ActivateInsurer(payload));
  }

  deactivate(payload: IRequest<IInsurer.IDocument>): void {
    this.store.dispatch(InsurerActions.DeactivateInsurer(payload));
  }

  changePage(config: IGlobalConfig): void {
    this.store.dispatch(InsurerActions.ChangeInsurersPage({ payload: config }));
  }

  onSetFilter(filter: IGlobalFilter): void {
    this.store.dispatch(InsurerActions.SetInsurersFilters({ payload: filter }));
  }

  resetStatus(insurer: IInsurer.IDocument) {
    this.store.dispatch(
      InsurerActions.ResetInsurerStatus({
        payload: {
          id: insurer.uuid,
          changes: {
            active: insurer.active,
          },
        },
      })
    );
  }

  toggleStatus({ payload }: IRequest<IInsurer.IDocument>): void {
    if (payload.active) {
      this.deactivate({ payload });
    } else {
      this.active({ payload });
    }
  }

  setPage(config?: IGlobalConfig): void {
    const resetConfig: IGlobalConfig = {
      page: 1,
      limit: GlobalPaginationConfig.LIMIT,
    };

    this.store.dispatch(
      InsurerActions.SetInsurersPage({ payload: config ?? resetConfig })
    );
  }

  resetInsurer(): void {
    this.store.dispatch(InsurerActions.ResetInsurer());
  }
}
