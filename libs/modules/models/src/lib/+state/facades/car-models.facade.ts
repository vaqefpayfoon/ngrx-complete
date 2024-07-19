import { Injectable } from '@angular/core';

// NgRx Store
import { Store } from '@ngrx/store';

// Reducers
import { IModelsState } from '../reducers';

// Selector
import { carModelsQuery } from '../selectors';
import * as fromRoot from '@neural/ngrx-router';

// Action
import { CarModelsActions } from '../actions';

// Model
import { IModels } from '../../models';

@Injectable()
export class CarModelsFacade {
  loading$ = this.store.select(carModelsQuery.getModelsLoading);

  loaded$ = this.store.select(carModelsQuery.getModelsLoaded);

  modelsModify$ = this.store.select(carModelsQuery.getModelsModified);

  error$ = this.store.select(carModelsQuery.getModelsError);

  models$ = this.store.select(carModelsQuery.getAllModels);

  model$ = this.store.select(carModelsQuery.getSelectedModel);

  modelsConfig$ = this.store.select(carModelsQuery.getModelsPage);

  total$ = this.store.select(carModelsQuery.getModelsTotal);

  router$ = this.store.select(fromRoot.getRouterState);

  temp$ = this.store.select(carModelsQuery.getModelTempGalleryColorImage);

  unit$ = this.store.select(carModelsQuery.getUnit);

  constructor(private store: Store<IModelsState>) {}

  toggleStatus(model: IModels.IDocument) {
    if (model.active) {
      this.store.dispatch(CarModelsActions.DeactivateModel({ payload: model }));
    } else {
      this.store.dispatch(CarModelsActions.ActivateModel({ payload: model }));
    }
  }

  resetToggle(model: IModels.IDocument) {
    this.store.dispatch(
      CarModelsActions.ResetModelStatus({
        payload: {
          id: model.uuid,
          changes: {
            active: model.active,
          },
        },
      })
    );
  }

  changeModelsPage(config: IModels.IConfig) {
    this.store.dispatch(CarModelsActions.SetModelsPage({ payload: config }));
  }

  resetModelPage() {
    const params: IModels.IConfig = {
      page: 1,
      limit: IModels.Config.LIMIT,
    };
    this.store.dispatch(CarModelsActions.SetModelsPage({ payload: params }));
  }

  onCreate(model: IModels.ICreate) {
    this.store.dispatch(CarModelsActions.CreateModel({ payload: model }));
  }

  onUpdate(model: IModels.IDocument) {
    this.store.dispatch(CarModelsActions.UpdateModel({ payload: model }));
  }

  onUploadInteriorGalleryColorImage(model: IModels.IFile, index: number) {
    this.store.dispatch(
      CarModelsActions.UploadInteriorGalleryColorImage({
        payload: { model, index },
      })
    );
  }

  onUploadExteriorGalleryColorImage(model: IModels.IFile, index: number) {
    this.store.dispatch(
      CarModelsActions.UploadExteriorGalleryColorImage({
        payload: { model, index },
      })
    );
  }

  onUploadInteriorGalleryImages(model: IModels.IFile, index: number) {
    this.store.dispatch(
      CarModelsActions.UploadInteriorGalleryImages({
        payload: { model, index },
      })
    );
  }

  onUploadExteriorGalleryImages(model: IModels.IFile, index: number) {
    this.store.dispatch(
      CarModelsActions.UploadExteriorGalleryImages({
        payload: { model, index },
      })
    );
  }

  onSetBranch(payload: IModels.ISetBranches) {
    this.store.dispatch(CarModelsActions.SetBranch({ payload }));
  }

  onSetSeriesImage(payload: IModels.ISetSeriesImage) {
    this.store.dispatch(CarModelsActions.UploadSeriesImage({ payload }));
  }

  onSetModelImage(payload: IModels.ISetModelImage) {
    this.store.dispatch(CarModelsActions.UpdateModelImage({ payload }));
  }

  onGetModelImage(payload: IModels.IDocument) {
    this.store.dispatch(CarModelsActions.GetModelImage({ payload }));
  }

  onSelectModelImage(payload: IModels.IVariant) {
    this.store.dispatch(CarModelsActions.SelectModelImage({ payload }));
  }

  onListSeriesModels(payload: { brand: string; series: string }) {
    this.store.dispatch(CarModelsActions.GetSeriesModels(payload));
  }

  onListVariants(payload: IModels.IVariant) {
    this.store.dispatch(CarModelsActions.GetVariants({ payload }));
  }

  onResetUnit() {
    this.store.dispatch(CarModelsActions.ResetUnit());
  }

  onResetSelectedModel() {
    this.store.dispatch(CarModelsActions.ResetSelectedModel());
  }

  onDeleteGalleryImage(payload: { uuid: string; image: string }) {
    this.store.dispatch(CarModelsActions.DeleteModelGalleryImage({ payload }));
  }

  onSetBranches(payload: {
    model: IModels.IDocument;
    branches: IModels.ISetBranches;
  }) {
    this.store.dispatch(CarModelsActions.SetBranches({ payload }));
  }

  onRedirect() {
    this.store.dispatch(CarModelsActions.RedirectToCarModels());
  }

  getModel(uuid: string) {
    this.store.dispatch(CarModelsActions.GetModel({ payload: uuid }));
  }

  getBrandsAndSeries() {
    this.store.dispatch(CarModelsActions.GetBrandsAndSeries());
  }
}
