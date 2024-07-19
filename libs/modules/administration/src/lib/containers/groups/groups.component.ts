import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

// BreadCrumb & Sort Interfaces
import {  IBC } from '@neural/shared/data';

// Models
import { IGroup } from '../../models';

// RxJs
import { Observable } from 'rxjs';

// facade
import { GroupsFacade } from '../../+state/facades';
import { AuthFacade, PermissionValidatorService } from '@neural/auth';

// Dialod
import { GroupConfirmationDialogComponent } from '../../components';

// MatDialog
import { MatDialog } from '@angular/material/dialog';

// permission tags
import { permissionTags } from '@neural/shared/data';

@Component({
  selector: 'neural-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupsComponent implements OnInit {
  groups$: Observable<IGroup.IDocument[]>;
  
  isSuperAdmin$: Observable<boolean>;

  roles$: Observable<IGroup.IRole[]>;

  loading$: Observable<any>;
  error$: Observable<any>;

  permissions$: Observable<{}>;

  filter: any;
  search = false;

  bc: IBC[];

  constructor(
    private groupsFacade: GroupsFacade,
    private authFacade: AuthFacade,
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
        name: 'groups',
        path: null
      }
    ];

    this.groups$ = this.groupsFacade.groups$;
    this.roles$ = this.groupsFacade.roles$;

    this.loading$ = this.groupsFacade.loading$;
    this.error$ = this.groupsFacade.error$;
    
    this.isSuperAdmin$ = this.authFacade.isSuperAdmin$;

    this.permissions$ = this.permissionValidatorService.isAvailable([
      permissionTags.AccountGroup.LIST_ACCOUNT_GROUP,
      permissionTags.AccountGroup.CREATE_ACCOUNT_GROUP,
      permissionTags.AccountGroup.UPDATE_ACCOUNT_GROUP,
      permissionTags.AccountGroup.DELETE_ACCOUNT_GROUP,
      permissionTags.AccountGroup.GET_ACCOUNT_GROUP
    ]);
  }

  onRefresh(event: boolean) {
    if (event) {
      this.groupsFacade.onLoad();
    }
  }

  onSubmit(value: any) {
    if (value) {
      this.search = true;
      this.filter = value.email;
    } else {
      this.search = false;
      this.filter = '';
      this.groupsFacade.onSearch(false);
    }
  }

  openDialog(event: IGroup.IDocument): void {
    const dialogRef = this.dialog.open(GroupConfirmationDialogComponent);

    dialogRef.componentInstance.delete.subscribe(() =>
      this.groupsFacade.delete(event)
    );
  }
}
