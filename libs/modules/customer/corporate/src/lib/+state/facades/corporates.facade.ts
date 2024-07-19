import { Injectable } from '@angular/core';

// NgRx Store
import { Store } from '@ngrx/store';

// Reducers
import { ICorporateState } from '../reducers';

// Selector
import { corporatesQuery } from '../selectors';

// Action
import { CorporatesActions } from '../actions';

// Models
import { ICorporates } from '../../models';
import { CorporatesService } from '../../services/corporates.service';

@Injectable()
export class CorporatesFacade {
  corporates$ = this.store.select(corporatesQuery.getAllCorporates);

  total$ = this.store.select(corporatesQuery.getCorporatesTotal);

  corporatesConfig$ = this.store.select(corporatesQuery.getCorporatesPage);

  operations$ = this.store.select(corporatesQuery.getOperations);

  corporate$ = this.store.select(corporatesQuery.getSelectedCorporate);

  loading$ = this.store.select(corporatesQuery.getCorporatesLoading);

  error$ = this.store.select(corporatesQuery.getCorporatesError);

  appImages$ = this.store.select(corporatesQuery.getCorporatesAppImages);

  socialImage$ = this.store.select(
    corporatesQuery.getCorporateUploadedSocialImage
  );

  constructor(
    private store: Store<ICorporateState>,
    private corporatesService: CorporatesService
  ) {}

  setCorporatePage(config: ICorporates.IConfig) {
    this.store.dispatch(
      CorporatesActions.SetCorporatesPage({ payload: config })
    );
  }

  toggleStatus(corporate: ICorporates.IDocument) {
    if (corporate.active) {
      this.store.dispatch(
        CorporatesActions.DeactivateCorporate({ payload: corporate })
      );
    } else {
      this.store.dispatch(
        CorporatesActions.ActivateCorporate({ payload: corporate })
      );
    }
  }

  resetToggle(corporate: ICorporates.IDocument) {
    this.store.dispatch(
      CorporatesActions.ResetCorporateStatus({
        payload: {
          id: corporate.uuid,
          changes: {
            active: corporate.active,
          },
        },
      })
    );
  }

  create(event: ICorporates.ICreate) {
    this.store.dispatch(CorporatesActions.CreateCorporate({ payload: event }));
  }

  update(event: ICorporates.IDocument) {
    this.store.dispatch(CorporatesActions.UpdateCorporate({ payload: event }));
  }

  updateImage(corporate: ICorporates.IDocument) {
    this.store.dispatch(
      CorporatesActions.UpdateCorporateImage({ payload: corporate })
    );
  }

  onResetSelectedCorporate() {
    this.store.dispatch(CorporatesActions.ResetSelectedCorporate());
  }

  uploadSocialImage({
    file,
    index,
    corporate,
  }: {
    file: any;
    index: number;
    corporate: ICorporates.IDocument;
  }) {
    this.store.dispatch(
      CorporatesActions.UploadSocialIcon({
        payload: { file, index, corporate },
      })
    );
  }

  uploadAppImage(payload: ICorporates.IAppImageUploadAction) {
    this.store.dispatch(CorporatesActions.UploadAppImage({ payload }));
  }

  uploadWatermarkImage(payload: ICorporates.IAppImageUpload) {
    return this.corporatesService.uploadWatermark(payload);
  }

  getCorporate(payload: string) {
    this.store.dispatch(CorporatesActions.LoadCorporate({ payload }));
  }

  loadAlloperations(payload) {
    this.store.dispatch(
      CorporatesActions.GetCorporateOperations({ payload })
    );
  }
}
