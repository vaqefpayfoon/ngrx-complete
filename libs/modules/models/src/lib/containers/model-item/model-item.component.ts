import { Component, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';

// BreadCrumb Interface
import { IBC } from '@neural/shared/data';

// Location
import { Location } from '@angular/common';

// Models
import { IModels } from '../../models';

// facade
import { CarModelsFacade } from '../../+state/facades';
// Auth
import { Auth, AuthFacade, PermissionValidatorService } from '@neural/auth';

// RxJs
import { Observable } from 'rxjs';

// permission tags
import { permissionTags } from '@neural/shared/data';

@Component({
  selector: 'neural-model-item',
  templateUrl: './model-item.component.html',
  styleUrls: ['./model-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModelItemComponent implements OnInit, OnDestroy {
  title = 'create a new model';

  model$: Observable<IModels.IDocument>;

  error$: Observable<any>;

  permissions$: Observable<{}>;

  selectedCorporate$: Observable<Auth.ICorporates>;

  bc: IBC[];

  constructor(
    private carModelsFacade: CarModelsFacade,
    private authFacade: AuthFacade,
    private permissionValidatorService: PermissionValidatorService
  ) {}

  initialData() {
    this.bc = [
      {
        name: 'administration',
        path: null
      },
      {
        name: 'car models',
        path: '/app/models'
      },
      {
        name: 'create',
        path: null
      }
    ];

    this.model$ = this.carModelsFacade.model$;
    this.error$ = this.carModelsFacade.error$;

    this.permissions$ = this.permissionValidatorService.isAvailable([
      permissionTags.Model.CREATE_MODEL,
      permissionTags.Model.UPDATE_MODEL
    ]);

    this.selectedCorporate$ = this.authFacade.selectedCorporate;
  }

  ngOnInit() {
    this.initialData();
  }

  ngOnDestroy() {
    this.carModelsFacade.onResetSelectedModel();
  }

  onCreateModel(model: IModels.ICreate) {
    this.carModelsFacade.onCreate(model);
  }

  onUpdateModel(model: IModels.IDocument) {
    this.carModelsFacade.onUpdate(model);
  }

  onUpdateModelBranches(payload: {
    model: IModels.IDocument;
    branches: IModels.ISetBranches;
  }) {
    this.carModelsFacade.onSetBranches(payload);
  }

  onLoad(model: IModels.IDocument) {
    if (model) {
      this.bc[this.bc.length - 1].name = `${model.unit.brand} ${
        model.unit.display
      } ${model.unit.variant}`;
      this.title = `${model.unit.brand} ${model.unit.display} ${
        model.unit.variant
      }`;
    }
  }

  onDeleteImage(event: { uuid: string; image: string }) {
    this.carModelsFacade.onDeleteGalleryImage(event);
  }

  onCorporateChange(event: boolean) {
    if (event) {
      this.carModelsFacade.onRedirect();
    }
  }
}
