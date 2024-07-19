import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { AuthFacade, PermissionValidatorService } from '@neural/auth';
import { IBranches } from '@neural/modules/customer/corporate';
import { IBC, permissionTags } from '@neural/shared/data';
import { Observable } from 'rxjs';
import { ServiceLineFacade } from '../../+state';
import { IServiceLine } from '../../models';
import { SyncDmsConfirmationDialogComponent } from '../../components/sync-dms-confirmation-dialog/sync-dms-confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'neural-service-line-list',
  templateUrl: './service-line-list.component.html',
  styleUrls: ['./service-line-list.component.scss'],
})
export class ServiceLineListComponent implements OnInit {
  bc: IBC[];
  serviceLines$: Observable<IServiceLine.IDocument[]>;
  total$: Observable<number>;
  serviceLineConfig$: Observable<IServiceLine.IConfig>;
  permissions$: Observable<{}>;
  loading$: Observable<boolean>;
  error$: Observable<any>;
  pageEvent: PageEvent;
  selectedCorporate$: Observable<{}>;
  selectedBranch$: Observable<any>;
  branchInfo$: Observable<IBranches.IDocument>;
  serviceLineFilter$: Observable<IServiceLine.IFilter>;
  serviceTypes$: Observable<any>;

  constructor(
    private serviceLineFacade: ServiceLineFacade,
    private permissionValidatorService: PermissionValidatorService,
    private authFacade: AuthFacade,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.initialData();
  }

  initialData() {
    this.bc = [
      {
        name: 'hub',
        path: null,
      },
      {
        name: 'Service Menu',
        path: null,
      },
      {
        name: 'Service',
        path: null,
      },
    ];
    this.branchInfo$ = this.serviceLineFacade.branch$;
    this.serviceLines$ = this.serviceLineFacade.serviceLines$;
    this.total$ = this.serviceLineFacade.total$;
    this.serviceLineConfig$ = this.serviceLineFacade.getServiceLineConfig$;
    this.selectedCorporate$ = this.authFacade.selectedCorporate;
    this.selectedBranch$ = this.authFacade.selectedBranch;
    this.loading$ = this.serviceLineFacade.loading$;
    this.error$ = this.serviceLineFacade.error$;
    this.permissions$ = this.permissionValidatorService.isAvailable([
      permissionTags.ServiceLine.CREATE_SERVICE_LINE,
      permissionTags.ServiceLine.UPDATE_SERVICE_LINE,
      permissionTags.ServiceLine.LIST_SERVICE_LINES,
      permissionTags.ServiceLine.GET_SERVICE_LINE,

    ]);
    this.serviceLineFacade.getServiceLineList();
    this.serviceLineFilter$ = this.serviceLineFacade.getServiceLineFilters$;
    this.serviceTypes$ = this.serviceLineFacade.serviceTypelist$;
  }

  onRefresh(event: boolean) {
    if (event) {
      this.serviceLineFacade.resetServiceLinePage();
    }
  }

  onActiveChange(event: IServiceLine.IChangeStatus) {
    this.serviceLineFacade.changeStatus(event);
  }

  onCustomerView(event: IServiceLine.IChangeStatus) {
    this.serviceLineFacade.changeStatus(event);
  }

  changePage(event: PageEvent) {
    const params: IServiceLine.IConfig = {
      limit: IServiceLine.Config.LIMIT,
      page: event.pageIndex + 1,
    };
    this.serviceLineFacade.changeServiceLinePage(params);
  }
  
  onResetToggle(event: IServiceLine.IDocument): void {
    this.serviceLineFacade.resetToggle(event);
  }

  syncServiceLineDMS(event) {
    const dialogRef = this.dialog.open(SyncDmsConfirmationDialogComponent, {
      disableClose: true,
    });

    dialogRef.componentInstance.sync.subscribe((res: boolean) => {
      if (res) {
        this.serviceLineFacade.syncServiceLineDMS();
        dialogRef.close();
      }
    });
  }

  onFilter(event: IServiceLine.IFilter) {
    if (event) {
      this.serviceLineFacade.changeServiceLineFilter(event);
    }
  }
}
