import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

// BreadCrumb & Sort Interfaces
import {  IBC } from '@neural/shared/data';

// Models
import { IRole } from '../../models';

// RxJs
import { Observable } from 'rxjs';

// facade
import { RolesFacade } from '../../+state/facades';

// Dialod
import { RoleConfirmationDialogComponent } from '../../components';

// MatDialod
import { MatDialog } from '@angular/material/dialog';

// permission tags
import { permissionTags } from '@neural/shared/data';
import { PermissionValidatorService } from '@neural/auth';

@Component({
  selector: 'neural-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RolesComponent implements OnInit {
  roles$: Observable<IRole.IDocument[]>;

  loading$: Observable<any>;
  error$: Observable<any>;

  permissions$: Observable<{}>;

  filter: any;

  search = false;

  bc: IBC[];

  constructor(
    private rolesFacade: RolesFacade,
    private dialog: MatDialog,
    private permissionValidatorService: PermissionValidatorService
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
        name: 'Configuration',
        path: null
      },
      {
        name: 'roles',
        path: null
      }
    ];

    this.roles$ = this.rolesFacade.roles$;

    this.loading$ = this.rolesFacade.loading$;
    this.error$ = this.rolesFacade.error$;


    this.permissions$ = this.permissionValidatorService.isAvailable([
      permissionTags.AccountRole.LIST_ACCOUNT_ROLE,
      permissionTags.AccountRole.CREATE_ACCOUNT_ROLE,
      permissionTags.AccountRole.UPDATE_ACCOUNT_ROLE,
      permissionTags.AccountRole.DELETE_ACCOUNT_ROLE,
      permissionTags.AccountRole.GET_ACCOUNT_ROLE
    ]);
  }

  onRefresh(event: boolean) {
    if (event) {
      this.rolesFacade.onLoad();
    }
  }

  openDialog(event: IRole.IDocument): void {
    const dialogRef = this.dialog.open(RoleConfirmationDialogComponent);

    dialogRef.componentInstance.delete.subscribe(() =>
      this.rolesFacade.delete(event)
    );
  }

  onSubmit(value: any) {
    if (value) {
      this.search = true;
      this.filter = value.email;
    } else {
      this.search = false;
      this.filter = '';
      this.rolesFacade.onSearch(false);
    }
  }
}
