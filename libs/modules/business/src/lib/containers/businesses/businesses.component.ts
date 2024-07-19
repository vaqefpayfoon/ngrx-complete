import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

// BreadCrumb & Sort Interfaces
import {  IBC } from '@neural/shared/data';

// Models
import { IBusinesses } from '../../models';

// facade
import { BusinessesFacade } from '../../+state/facades';

// RxJs
import { Observable } from 'rxjs';

// Paginator
import { PageEvent } from '@angular/material/paginator';

// MatDialog
import { MatDialog } from '@angular/material/dialog';

// Dialog
import { BusinessConfirmationDialogComponent } from '../../components';

// permission tags
import { permissionTags } from '@neural/shared/data';
import { PermissionValidatorService } from '@neural/auth';

@Component({
  selector: 'neural-businesses',
  templateUrl: './businesses.component.html',
  styleUrls: ['./businesses.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BusinessesComponent implements OnInit {
  bc: IBC[];

  businesses$: Observable<IBusinesses.IDocument[]>;
  total$: Observable<number>;
  businessesConfig$: Observable<IBusinesses.IConfig>;

  permissions$: Observable<{}>;

  loading$: Observable<any>;
  error$: Observable<any>;

  pageEvent: PageEvent;

  constructor(
    private businessesFacade: BusinessesFacade,
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
        name: 'businesses',
        path: null
      }
    ];

    this.businesses$ = this.businessesFacade.businesses$;
    this.total$ = this.businessesFacade.total$;
    this.businessesConfig$ = this.businessesFacade.businessesConfig$;

    this.loading$ = this.businessesFacade.loading$;
    this.error$ = this.businessesFacade.error$;

    this.permissions$ = this.permissionValidatorService.isAvailable([
      permissionTags.Business.LIST_BUSINESS,
      permissionTags.Business.ASSOCIATE_ACCOUNTS_BUSINESS,
      permissionTags.Business.ACTIVATE_BUSINESS,
      permissionTags.Business.DEACTIVATE_BUSINESS,
      permissionTags.Business.CREATE_BUSINESS,
      permissionTags.Business.GET_BUSINESS
    ]);
  }

  onRefresh(event: boolean) {
    if (event) {
      const params: IBusinesses.IConfig = {
        limit: IBusinesses.Config.LIMIT,
        page: 1
      };
      this.businessesFacade.changeBusinessesPage(params);
    }
  }

  changePage(event: PageEvent) {
    const params: IBusinesses.IConfig = {
      limit: IBusinesses.Config.LIMIT,
      page: event.pageIndex + 1
    };
    this.businessesFacade.changeBusinessesPage(params);
  }

  openDialog(event: IBusinesses.IDocument) {
    const dialogRef = this.dialog.open(BusinessConfirmationDialogComponent, {
      data: event,
      disableClose: true
    });

    dialogRef.componentInstance.status.subscribe((res: boolean) => {
      if (res) {
        return this.businessesFacade.toggleStatus(event);
      } else {
        return this.businessesFacade.resetToggle(event);
      }
    });
  }
}
