import { Injectable, Injector } from '@angular/core';

// NgRx Store
import { Store } from '@ngrx/store';

// Reducers
import { ICorporateState } from '../reducers';

// Selector
import { AgreementsQuery } from '../selectors';

// Action
import { AgreementsActions } from '../actions';

// Models
import { IAgreements } from '../../models';

//service
import { AgreementsService } from './../../services/agreements.service';
import { Observable } from 'rxjs';
@Injectable()
export class AgreementsFacade {
  total$ = this.store.select(AgreementsQuery.getAgreementsTotals);

  loaded$ = this.store.select(AgreementsQuery.getAgreementsLoaded);

  loading$ = this.store.select(AgreementsQuery.getAgreementsLoading);

  error$ = this.store.select(AgreementsQuery.getAgreementsError);

  agreements$ = this.store.select(AgreementsQuery.getAllAgreements);

  agreement$ = this.store.select(AgreementsQuery.getSelectedAgreement);

  corporateAgreementsConfig$ = this.store.select(
    AgreementsQuery.getCorporateAgreementsConfig
  );

  private _agreementService: AgreementsService;
  public get agreementService(): AgreementsService {
    if (!this._agreementService) {
      this._agreementService = this.injector.get(AgreementsService);
    }
    return this._agreementService;
  }

  constructor(
    private store: Store<ICorporateState>,
    private injector: Injector
  ) {}

  setCorporateAgreementsPage(config: IAgreements.IConfig) {
    this.store.dispatch(
      AgreementsActions.SetCorporateAgreementsPage({ payload: config })
    );
  }

  create(payload: IAgreements.ICreate) {
    this.store.dispatch(
      AgreementsActions.CreateCorporateAgreement({ payload })
    );
  }

  update(payload: IAgreements.IDocument) {
    this.store.dispatch(
      AgreementsActions.UpdateCorporateAgreement({ payload })
    );
  }

  uploadAgreementFile(
    payload: IAgreements.IUploadFile
  ): Observable<IAgreements.IDocument> {
    return this.agreementService.uploadAgreementDocument(payload);
  }
}
