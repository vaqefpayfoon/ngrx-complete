import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

// BreadCrumb & Sort Interfaces
import { IBC } from '@neural/shared/data';

// Models
import { IModels } from '../../models';

// facade
import { CarModelsFacade } from '../../+state/facades';

// RxJs
import { Observable } from 'rxjs';

// Paginator
import { PageEvent } from '@angular/material/paginator';

// MatDialog
import { MatDialog } from '@angular/material/dialog';

// Dialog
import { ModelConfirmationDialogComponent } from '../../components';

// permission tags
import { permissionTags } from '@neural/shared/data';
import { PermissionValidatorService } from '@neural/auth';

@Component({
  selector: 'neural-models',
  templateUrl: './models.component.html',
  styleUrls: ['./models.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModelsComponent implements OnInit {
  bc: IBC[];

  models$: Observable<IModels.IDocument[]>;
  total$: Observable<number>;
  modelsConfig$: Observable<IModels.IConfig>;

  permissions$: Observable<{}>;

  loading$: Observable<boolean>;
  error$: Observable<any>;

  pageEvent: PageEvent;

  constructor(
    private carModelsFacade: CarModelsFacade,
    private permissionValidatorService: PermissionValidatorService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.initialData();
  }

  initialData() {
    this.bc = [
      {
        name: 'administration',
        path: null
      },
      {
        name: 'car models',
        path: null
      }
    ];

    this.models$ = this.carModelsFacade.models$;
    this.total$ = this.carModelsFacade.total$;
    this.modelsConfig$ = this.carModelsFacade.modelsConfig$;

    this.loading$ = this.carModelsFacade.loading$;
    this.error$ = this.carModelsFacade.error$;

    this.permissions$ = this.permissionValidatorService.isAvailable([
      permissionTags.Model.LIST_MODEL,
      permissionTags.Model.ACTIVATE_MODEL,
      permissionTags.Model.DEACTIVATE_MODEL,
      permissionTags.Model.CREATE_MODEL,
      permissionTags.Model.GET_MODEL,
      permissionTags.Model.SET_MODEL_BRANCHES,
      permissionTags.Model.SET_MODEL_IMAGE,
      permissionTags.Model.GET_SERIES_IMAGE
    ]);

    this.carModelsFacade.onResetUnit();
  }

  onRefresh(event: boolean) {
    if (event) {
      const params: IModels.IConfig = {
        limit: IModels.Config.LIMIT,
        page: 1
      };
      this.carModelsFacade.changeModelsPage(params);
    }
  }

  openDialog(event: IModels.IDocument) {
    const dialogRef = this.dialog.open(ModelConfirmationDialogComponent, {
      data: event,
      disableClose: true
    });

    dialogRef.componentInstance.status.subscribe((res: boolean) => {
      if (res) {
        return this.carModelsFacade.toggleStatus(event);
      } else {
        return this.carModelsFacade.resetToggle(event);
      }
    });
  }

  changePage(event: PageEvent) {
    const params: IModels.IConfig = {
      limit: IModels.Config.LIMIT,
      page: event.pageIndex + 1
    };
    this.carModelsFacade.changeModelsPage(params);
  }
}
