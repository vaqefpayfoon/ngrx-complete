import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

// BreadCrumb & Sort Interfaces
import {  ISort, IBC } from '@neural/shared/data';

// Models
import { IWarranties } from '../../models';

// facade
import { WarrantiesFacade } from '../../+state/facade';

// RxJs
import { Observable } from 'rxjs';

// Paginator
import { PageEvent } from '@angular/material/paginator';

// Dialog
import { WarrantyConfirmationDialogComponent } from '../../components';

// MatDialog
import { MatDialog } from '@angular/material/dialog';

// permission tags
import { permissionTags } from '@neural/shared/data';
import { PermissionValidatorService } from '@neural/auth';

@Component({
  selector: 'neural-warranties',
  templateUrl: './warranties.component.html',
  styleUrls: ['./warranties.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WarrantiesComponent implements OnInit {
  bc: IBC[];
  sort: ISort[];

  search = false;

  warranties$: Observable<IWarranties.IDocument[]>;
  total$: Observable<number>;
  warrantiesConfig$: Observable<IWarranties.IConfig>;

  loading$: Observable<any>;
  error$: Observable<any>;

  permissions$: Observable<{}>;

  reports$: Observable<{
    warranties: IWarranties.IJob | null;
  }>;

  sorts: any[] = [];

  constructor(
    private warrantiesFacade: WarrantiesFacade,
    private permissionValidatorService: PermissionValidatorService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.initialData();
  }

  initialData() {
    this.bc = [
      {
        name: 'hub',
        path: null
      },
      {
        name: 'reservations',
        path: null
      },
      {
        name: 'Reminders',
        path: null
      }
    ];

    this.warranties$ = this.warrantiesFacade.warranties$;
    this.total$ = this.warrantiesFacade.total$;
    this.warrantiesConfig$ = this.warrantiesFacade.warrantiesConfig$;

    this.loading$ = this.warrantiesFacade.loading$;
    this.error$ = this.warrantiesFacade.error$;

    this.permissions$ = this.permissionValidatorService.isAvailable([
      permissionTags.ServiceRecall.LIST_SERVICE_RECALL,
      permissionTags.ServiceRecall.CREATE_SERVICE_RECALL,
      permissionTags.ServiceRecall.ACTIVATE_SERVICE_RECALL,
      permissionTags.ServiceRecall.DEACTIVATE_SERVICE_RECALL,
      permissionTags.ServiceRecall.CLOSE_SERVICE_RECALL,
      permissionTags.ServiceRecall.GET_SERVICE_RECALL
    ]);

    this.reports$ = this.warrantiesFacade.reports$;
  }

  onRefresh(event: boolean) {
    if (event) {
      const params: IWarranties.IConfig = {
        limit: IWarranties.Config.LIMIT,
        page: 1
      };
      this.warrantiesFacade.setWarrantiesPage(params);
    }
  }

  changePage(event: PageEvent) {
    const params: IWarranties.IConfig = {
      limit: IWarranties.Config.LIMIT,
      page: event.pageIndex + 1
    };
    this.warrantiesFacade.setWarrantiesPage(params);
  }

  openDialog(event: IWarranties.IDocument) {
    const dialogRef = this.dialog.open(WarrantyConfirmationDialogComponent, {
      data: event,
      disableClose: true
    });

    dialogRef.componentInstance.status.subscribe(
      (res: { form: IWarranties.IClose; warranty: IWarranties.IDocument }) => {
        if (res) {
          return this.warrantiesFacade.close(res);
        }
      }
    );
  }
}
