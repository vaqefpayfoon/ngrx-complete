import { Component, OnInit } from '@angular/core';

// BreadCrumb & Sort Interfaces
import { IBC } from '@neural/shared/data';

// Models
import { IDashboard } from '../../models';

// facade
import { DashboardBasicFacade } from '../../+state/facades';

import { AuthFacade } from '@neural/auth';

// RxJs
import { Observable } from 'rxjs';

// permission tags
import { permissionTags } from '@neural/shared/data';
import { PermissionValidatorService } from '@neural/auth';

//Import dialog
import { MatDialog } from '@angular/material/dialog';
import { PasswordExpiredDialogComponent } from '../../components/password-expired-dialog/password-expired-dialog.component';

@Component({
  selector: 'neural-basic-item',
  templateUrl: './basic-item.component.html',
  styleUrls: ['./basic-item.component.scss'],
})
export class BasicItemComponent implements OnInit {
  bc: IBC[];

  search = false;

  basic$: Observable<IDashboard.IBasic>;

  loading$: Observable<boolean>;
  error$: Observable<any>;

  permissions$: Observable<{}>;

  passwordValidity: any;

  sorts: any[] = [];

  constructor(
    // private dashboardBasicFacade: DashboardBasicFacade,
    private permissionValidatorService: PermissionValidatorService,
    private authFacade: AuthFacade,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.initialData();
  }

  initialData() {
    this.bc = [
      {
        name: 'dashboard',
        path: null,
      },
      {
        name: 'basic',
        path: null,
      },
    ];

    // this.basic$ = this.dashboardBasicFacade.basic$;

    // this.loading$ = this.dashboardBasicFacade.loading$;
    // this.error$ = this.dashboardBasicFacade.error$;

    this.authFacade.account$.subscribe(
      (data) => (this.passwordValidity = new Date(data?.password?.expiry))
    );

    this.permissions$ = this.permissionValidatorService.isAvailable([
      permissionTags.Analytic.BASIC_DASHBOARD,
    ]);

    this.openPasswordExpiredDialog();
  }

  onRefresh(event: boolean) {
    if (event) {
      // this.dashboardBasicFacade.onLoad();
    }
  }

  openPasswordExpiredDialog() {
    const expiryDays = this.permissionValidatorService.calculateExpiryDays(
      this.passwordValidity
    );

    if (expiryDays < 1) {
      const dialogRef = this.dialog.open(PasswordExpiredDialogComponent, {
        disableClose: true,
        width: '480px',
        height: '200px',
      });

      dialogRef.componentInstance.redirect.subscribe((x) => {
        if (x) {
          this.authFacade.onRedirectToProfile();
        }
      });

      dialogRef.componentInstance.logout.subscribe((x) => {
        if (x) {
          this.authFacade.onLogout();
        }
      });
    }
  }
}
